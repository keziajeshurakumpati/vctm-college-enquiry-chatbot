import {
  ClassificationResult,
  ExtractedEntities,
  FeatureContribution,
  IntentType,
  ModelMetrics,
  TFIDFTokenDetail,
  TrainingExample,
} from '../types/chatbot';
import { INTENT_DEFINITIONS, TRAINING_DATASET } from './dataset';

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'can\'t', 'cannot',
  'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each',
  'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d',
  'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i',
  'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s',
  'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or',
  'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll',
  'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve',
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll',
  'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while',
  'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll',
  'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves', 'please', 'tell', 'want', 'know', 'give'
]);

// Keep critical inquiry keywords even if they appear in common language
const PRESERVE_TOKENS = new Set([
  'fee', 'fees', 'cost', 'hostel', 'placement', 'placements', 'scholarship', 'eligibility',
  'admission', 'admissions', 'marks', 'percentage', 'package', 'highest', 'average', 'bus',
  'transport', 'route', 'routes', 'exam', 'exams', 'examination', 'examinations', 'sessional',
  'admit', 'card', 'aktu', 'btech', 'mca', 'mba', 'diploma', 'polytechnic', 'department',
  'departments', 'hod', 'faculty', 'cse', 'cs', 'aiml', 'civil', 'mechanical', 'ece', 'bca', 'bba',
  'food', 'mess', 'contact', 'phone', 'address', 'location', 'where', 'seats', 'direct', 'reach',
  'distance', 'station', 'code', '340', '1628'
]);

/**
 * Standard Sigmoid Activation Function for Binary Logistic Regression
 */
function sigmoid(z: number): number {
  // Prevent overflow/underflow
  const clampedZ = Math.max(-25, Math.min(25, z));
  return 1 / (1 + Math.exp(-clampedZ));
}

/**
 * Standalone One-vs-Rest (OvR) Logistic Regression NLP Engine
 * Pure Logistic Regression (using the Sigmoid loss, NOT Multinomial Softmax)
 */
export class NLPLogisticEngine {
  private vocabulary: string[] = [];
  private vocabIndexMap: Map<string, number> = new Map();
  private idfMap: Map<string, number> = new Map();
  private docCount: number = 0;

  private intentClasses: IntentType[] = [
    'greeting',
    'thanks',
    'goodbye',
    'fallback',
    'admissions',
    'course_details',
    'eligibility_criteria',
    'fees_structure',
    'scholarships',
    'hostel_mess',
    'placements',
    'examinations',
    'departments',
    'facilities_campus',
    'transportation',
    'contact_details',
    'location',
    'cutoffs_ranks',
    'general_greeting',
    'unknown',
  ];

  // One-vs-Rest Logistic Regression parameters:
  // weights: [numClasses x vocabSize], biases: [numClasses]
  private weights: number[][] = [];
  private biases: number[] = [];

  private metrics: ModelMetrics = {
    accuracy: 0.98,
    trainingLoss: 0.03,
    epochs: 180,
    learningRate: 0.25,
    vocabSize: 0,
    totalTrainingSamples: 0,
    lossHistory: [],
    confusionMatrix: {
      classes: [],
      matrix: [],
    },
  };

  private trainingCorpus: TrainingExample[] = [...TRAINING_DATASET];

  constructor() {
    this.buildVocabularyAndTrain();
  }

  /**
   * Preprocesses text into standardized tokens and n-grams
   */
  public tokenizeAndExtractNgrams(text: string): { tokens: string[]; ngrams: string[] } {
    let cleaned = text.toLowerCase();

    // Standardize acronyms & college terms
    cleaned = cleaned
      .replace(/b\.?\s?tech/g, 'btech')
      .replace(/m\.?\s?tech/g, 'mtech')
      .replace(/ai\s*&?\s*ml|artificial\s+intelligence/g, 'aiml')
      .replace(/comp(uter)?\s*sci(ence)?/g, 'cse')
      .replace(/mech(anical)?(\s+engg)?/g, 'mechanical')
      .replace(/head\s+of\s+department/g, 'hod')
      .replace(/\b340\b/g, 'aktu code 340')
      .replace(/1628/g, 'bte code 1628');

    // Remove punctuation except alphanumeric characters
    cleaned = cleaned.replace(/[^a-z0-9\s]/g, ' ');

    const rawTokens = cleaned.split(/\s+/).filter((t) => t.length > 0);
    const tokens: string[] = [];

    for (const t of rawTokens) {
      if (PRESERVE_TOKENS.has(t) || (!STOP_WORDS.has(t) && t.length > 1)) {
        tokens.push(t);
      }
    }

    const ngrams: string[] = [...tokens];

    // Unigrams and Bigrams
    for (let i = 0; i < tokens.length - 1; i++) {
      ngrams.push(`${tokens[i]} ${tokens[i + 1]}`);
    }

    return { tokens, ngrams };
  }

  /**
   * Builds vocabulary, calculates IDF, and trains the Logistic Regression model using SGD with L2 regularization
   */
  public buildVocabularyAndTrain(): ModelMetrics {
    const docTermFreqs: Map<string, number>[] = [];
    const docFrequency = new Map<string, number>();
    const vocabSet = new Set<string>();

    this.docCount = this.trainingCorpus.length;

    // 1. Tokenize corpus & compute Document Frequencies (DF)
    for (const example of this.trainingCorpus) {
      const { ngrams } = this.tokenizeAndExtractNgrams(example.text);
      const termCounts = new Map<string, number>();

      for (const term of ngrams) {
        termCounts.set(term, (termCounts.get(term) || 0) + 1);
        vocabSet.add(term);
      }
      docTermFreqs.push(termCounts);

      for (const term of termCounts.keys()) {
        docFrequency.set(term, (docFrequency.get(term) || 0) + 1);
      }
    }

    // Sort vocabulary alphabetically for deterministic index mapping
    this.vocabulary = Array.from(vocabSet).sort();
    this.vocabIndexMap.clear();
    this.vocabulary.forEach((term, idx) => {
      this.vocabIndexMap.set(term, idx);
    });

    // 2. Compute Inverse Document Frequency (IDF) with smoothing
    this.idfMap.clear();
    for (const [term, df] of docFrequency.entries()) {
      const idf = Math.log((1 + this.docCount) / (1 + df)) + 1.0;
      this.idfMap.set(term, idf);
    }

    // 3. Build normalized TF-IDF feature matrix X
    const vocabSize = this.vocabulary.length;
    const X: number[][] = [];
    const y: number[] = [];

    for (let i = 0; i < this.trainingCorpus.length; i++) {
      const tfCounts = docTermFreqs[i];
      const vector = new Array(vocabSize).fill(0);
      let normSq = 0;

      for (const [term, count] of tfCounts.entries()) {
        const idx = this.vocabIndexMap.get(term);
        if (idx !== undefined) {
          const tf = 1 + Math.log(count);
          const idf = this.idfMap.get(term) || 1.0;
          const tfidf = tf * idf;
          vector[idx] = tfidf;
          normSq += tfidf * tfidf;
        }
      }

      // L2 Normalization
      if (normSq > 0) {
        const norm = Math.sqrt(normSq);
        for (let j = 0; j < vocabSize; j++) {
          vector[j] /= norm;
        }
      }

      X.push(vector);

      const intent = this.trainingCorpus[i].intent;
      const classIdx = this.intentClasses.indexOf(intent);
      y.push(classIdx >= 0 ? classIdx : 0);
    }

    // 4. Train One-vs-Rest (OvR) Logistic Regression (Binary Sigmoid per class)
    const numClasses = this.intentClasses.length;
    this.weights = Array.from({ length: numClasses }, () => new Array(vocabSize).fill(0));
    this.biases = new Array(numClasses).fill(0);

    // Initial domain weight priming for key intent terms
    for (let c = 0; c < numClasses; c++) {
      const intentName = this.intentClasses[c];
      const primaryKeywords: Record<string, string[]> = {
        admissions: ['admission', 'admissions', 'apply', 'enroll', 'counseling', 'procedure'],
        course_details: ['courses', 'course', 'programs', 'branches', 'code', '340', '1628'],
        eligibility_criteria: ['eligibility', 'eligible', 'percentage', 'marks', 'pcm', 'criteria'],
        fees_structure: ['fee', 'fees', 'tuition', 'cost', 'annual fee', 'installment', 'charges'],
        scholarships: ['scholarship', 'scholarships', 'waiver', 'concession', 'post matric'],
        hostel_mess: ['hostel', 'mess', 'rooms', 'room', 'vegetarian', 'warden', 'stay'],
        placements: ['placement', 'placements', 'package', 'highest', 'average', 'recruiters', 'tcs'],
        examinations: ['exam', 'exams', 'sessional', 'attendance', 'admit card', 'semester'],
        departments: ['department', 'departments', 'hod', 'faculty', 'cse', 'mechanical', 'civil'],
        facilities_campus: ['facilities', 'facility', 'labs', 'library', 'sports', 'campus'],
        transportation: ['bus', 'transport', 'route', 'routes', 'pickup', 'fare'],
        contact_details: ['contact', 'phone', 'helpline', 'email', 'call', 'office'],
        location: ['location', 'where', 'address', 'highway', 'station', 'reach'],
      };

      const kws = primaryKeywords[intentName] || [];
      for (const kw of kws) {
        const idx = this.vocabIndexMap.get(kw);
        if (idx !== undefined) {
          this.weights[c][idx] = 1.2;
        }
      }
    }

    const epochs = 180;
    const learningRate = 0.28;
    const lambda = 0.0005; // L2 weight decay parameter
    const lossHistory: number[] = [];

    // Training Loop: Pure Logistic Regression with Binary Cross Entropy per class
    for (let epoch = 0; epoch < epochs; epoch++) {
      let epochLoss = 0;
      const decayLR = learningRate / (1 + 0.005 * epoch);

      for (let i = 0; i < X.length; i++) {
        const x_i = X[i];
        const targetClass = y[i];

        for (let c = 0; c < numClasses; c++) {
          const target = c === targetClass ? 1 : 0;
          const w_c = this.weights[c];

          // Compute raw logit z_c = w_c . x_i + b_c
          let z = this.biases[c];
          for (let j = 0; j < vocabSize; j++) {
            if (x_i[j] !== 0) {
              z += w_c[j] * x_i[j];
            }
          }

          // Sigmoid activation for binary logistic regression
          const p = sigmoid(z);

          // Binary Cross-Entropy loss
          const loss = -(target * Math.log(Math.max(p, 1e-12)) + (1 - target) * Math.log(Math.max(1 - p, 1e-12)));
          epochLoss += loss;

          // Gradient for Logistic Regression: error = (p - target)
          const error = p - target;

          // Update bias
          this.biases[c] -= decayLR * error;

          // Update weights with L2 regularization
          for (let j = 0; j < vocabSize; j++) {
            if (x_i[j] !== 0) {
              const grad = error * x_i[j] + lambda * w_c[j];
              w_c[j] -= decayLR * grad;
            }
          }
        }
      }

      const meanLoss = epochLoss / (X.length * numClasses);
      if (epoch % 15 === 0 || epoch === epochs - 1) {
        lossHistory.push(Number(meanLoss.toFixed(4)));
      }
    }

    // Evaluate training accuracy
    let correct = 0;
    const confusion = Array.from({ length: numClasses }, () => new Array(numClasses).fill(0));

    for (let i = 0; i < X.length; i++) {
      const pred = this.predictRaw(X[i]);
      confusion[y[i]][pred.predictedIndex]++;
      if (pred.predictedIndex === y[i]) correct++;
    }

    const accuracy = Number((correct / X.length).toFixed(4));
    const finalLoss = lossHistory[lossHistory.length - 1] || 0.04;

    this.metrics = {
      accuracy,
      trainingLoss: finalLoss,
      epochs,
      learningRate,
      vocabSize,
      totalTrainingSamples: this.docCount,
      lossHistory,
      confusionMatrix: {
        classes: [...this.intentClasses],
        matrix: confusion,
      },
    };

    return this.metrics;
  }

  /**
   * Computes normalized TF-IDF feature vector of dimension vocabSize
   */
  private computeTFIDFVector(ngrams: string[]): number[] {
    const vector = new Array(this.vocabulary.length).fill(0);
    if (ngrams.length === 0) return vector;

    const tfCounts = new Map<string, number>();
    for (const term of ngrams) {
      tfCounts.set(term, (tfCounts.get(term) || 0) + 1);
    }

    let normSq = 0;
    for (const [term, count] of tfCounts.entries()) {
      const idx = this.vocabIndexMap.get(term);
      if (idx !== undefined) {
        const tf = 1 + Math.log(count);
        const idf = this.idfMap.get(term) || 1.0;
        const tfidf = tf * idf;
        vector[idx] = tfidf;
        normSq += tfidf * tfidf;
      }
    }

    if (normSq > 0) {
      const norm = Math.sqrt(normSq);
      for (let i = 0; i < vector.length; i++) {
        vector[i] /= norm;
      }
    }

    return vector;
  }

  /**
   * Raw Logistic Regression prediction using Sigmoid probabilities
   */
  private predictRaw(x: number[]): {
    predictedIndex: number;
    probabilities: number[];
    logits: number[];
  } {
    const numClasses = this.intentClasses.length;
    const vocabSize = this.vocabulary.length;
    const logits: number[] = new Array(numClasses).fill(0);
    const probs: number[] = new Array(numClasses).fill(0);

    let bestClass = 0;
    let maxProb = -1;

    for (let c = 0; c < numClasses; c++) {
      let sum = this.biases[c];
      const w_c = this.weights[c];
      for (let j = 0; j < vocabSize; j++) {
        if (x[j] !== 0) {
          sum += w_c[j] * x[j];
        }
      }
      logits[c] = sum;

      // Pure Sigmoid probability for Logistic Regression
      const p = sigmoid(sum);
      probs[c] = p;

      if (p > maxProb) {
        maxProb = p;
        bestClass = c;
      }
    }

    return {
      predictedIndex: bestClass,
      probabilities: probs,
      logits,
    };
  }

  /**
   * Extracts entities from text query, supporting contextual continuity from prior turns
   */
  public extractEntities(query: string, previousContextCourse?: string): ExtractedEntities {
    const q = query.toLowerCase();
    const entities: ExtractedEntities = {
      attributes: [],
    };

    // Check if query is asking for general course list (exclude if asking about HODs, faculty, or fees)
    const hasHODOrFee = /\b(hod|head|faculty|fees?|cost|charges)\b/i.test(q);
    const isGeneralCourse =
      !hasHODOrFee &&
      (/\b(what\s+(are\s+the\s+)?courses|courses\s+offered|what\s+programs|programs\s+offered|list\s+(all\s+)?courses|which\s+(courses|degrees|programs)|all\s+courses|course\s+list|academic\s+programs|available\s+courses|what\s+can\s+i\s+study|degrees\s+offered|branches\s+(offered|available)|tell\s+me\s+courses|show\s+courses|all\s+branches|what\s+are\s+the\s+programmes|programmes\s+offered|available\s+programmes)\b/i.test(q) ||
      (/\b(courses?|programs?|degrees?)\b/i.test(q) &&
        !/\b(cse|cs|computer\s+science|mechanical|civil|ece|electrical|electronics|agricultural|agri|mba|mca|polytechnic|diploma|m\.?\s?tech|production|structural)\b/i.test(q)));

    entities.isGeneralCourse = isGeneralCourse;

    if (isGeneralCourse) {
      entities.course = undefined;
      entities.entity = 'VCTM';
      entities.attributes!.push('all_courses');
    } else {
      // Specific course detection
      if (/\b(polytechnic\s+(diploma\s+(in\s+)?)?(cs|cse|computer\s+science)|polytechnic\s+(cs|cse)|diploma\s+(in\s+)?(cs|cse|computer\s+science))\b/i.test(q)) {
        entities.course = 'Polytechnic CS';
      } else if (/\b(polytechnic\s+(diploma\s+(in\s+)?)?mech(anical)?|polytechnic\s+mech(anical)?|diploma\s+(in\s+)?mech(anical)?)\b/i.test(q)) {
        entities.course = 'Polytechnic Mechanical';
      } else if (/\b(polytechnic\s+(diploma\s+(in\s+)?)?civil|polytechnic\s+civil|diploma\s+(in\s+)?civil)\b/i.test(q)) {
        entities.course = 'Polytechnic Civil';
      } else if (/\b(polytechnic\s+(diploma\s+(in\s+)?)?e(c|ce|lectronics)|polytechnic\s+e(c|ce)|diploma\s+(in\s+)?e(c|ce))\b/i.test(q)) {
        entities.course = 'Polytechnic EC';
      } else if (/\b(polytechnic\s+(diploma\s+(in\s+)?)?electrical|diploma\s+(in\s+)?electrical)\b/i.test(q)) {
        entities.course = 'Polytechnic Electrical';
      } else if (/\bcse\b|\bcs\b|computer\s+science/i.test(q)) {
        entities.course = 'B.Tech CSE';
      } else if (/\bece\b|electronics\s*(&|and)?\s*comm/i.test(q)) {
        entities.course = 'B.Tech ECE';
      } else if (/\b(b\.?\s?tech\s+mech(anical)?|btech\s+mech(anical)?|mechanical\s+engineering|mechanical)\b/i.test(q)) {
        entities.course = 'B.Tech Mechanical';
      } else if (/\bcivil\b|\bce\b|civil\s+engineering/i.test(q)) {
        entities.course = 'B.Tech Civil';
      } else if (/\belectrical\b|\bee\b|electrical\s+engineering/i.test(q)) {
        entities.course = 'B.Tech Electrical';
      } else if (/\bagricultural\b|\bagri\b/i.test(q)) {
        entities.course = 'B.Tech Agricultural';
      } else if (/\b(it|information\s+technology)\b/i.test(q)) {
        entities.course = 'B.Tech IT';
      } else if (/polytechnic|diploma/i.test(q)) {
        entities.course = 'Polytechnic Diploma';
      } else if (/\bmba\b|management\s+studies/i.test(q)) {
        entities.course = 'MBA';
      } else if (/\bmca\b/i.test(q)) {
        entities.course = 'MCA';
      } else if (/\bm\.?\s?tech\s+production/i.test(q)) {
        entities.course = 'M.Tech Production';
      } else if (/\bm\.?\s?tech\s+structural/i.test(q)) {
        entities.course = 'M.Tech Structural';
      } else if (/\bm\.?\s?tech/i.test(q)) {
        entities.course = 'M.Tech';
      } else if (/\blateral\s+entry\b/i.test(q)) {
        entities.course = 'B.Tech Lateral Entry';
      } else if (/b\.?\s?tech/i.test(q)) {
        if (previousContextCourse && previousContextCourse.startsWith('B.Tech') && !isGeneralCourse) {
          entities.course = previousContextCourse;
        } else {
          entities.course = 'B.Tech';
        }
      } else if (previousContextCourse && !isGeneralCourse) {
        entities.course = previousContextCourse;
      }

      entities.entity = entities.course;
    }

    // Entity resolution if not course
    const isScholarshipQuery = /\b(scholarship|scholarships|samaj\s+kalyan|fee\s+reimbursement)\b/i.test(q);
    const isHostelQuery = /\b(hostel|mess)\b/i.test(q);

    if (isScholarshipQuery && /\b(eligib|criteria|qualif|who\s+can|can\s+i|requirement|qualify|apply)\b/i.test(q)) {
      entities.entity = 'Scholarship';
      entities.course = undefined;
    } else if (isHostelQuery) {
      if (/\b(girls?|female|women)\b/i.test(q)) {
        entities.entity = 'Girls Hostel';
      } else if (/\b(boys?|male|men)\b/i.test(q)) {
        entities.entity = 'Boys Hostel';
      } else {
        entities.entity = 'VCTM Hostel';
      }
    } else if (!entities.entity) {
      if (/girls?\s+hostel/i.test(q)) {
        entities.entity = 'Girls Hostel';
      } else if (/boys?\s+hostel/i.test(q)) {
        entities.entity = 'Boys Hostel';
      } else if (/hostel|mess/i.test(q)) {
        entities.entity = 'VCTM Hostel';
      } else if (/placement|salary|package|recruiter|company|companies/i.test(q)) {
        entities.entity = 'VCTM Placement Cell';
      } else if (/bus|transport/i.test(q)) {
        entities.entity = 'VCTM Bus Fleet';
      } else if (isScholarshipQuery) {
        entities.entity = 'Scholarship';
      } else {
        entities.entity = 'VCTM';
      }
    }

    // Attribute extraction
    const attrPatterns: [string, RegExp][] = [
      ['aktu_code', /\b(aktu\s+code|code\s+for\s+aktu|aktu\s+counseling\s+code)\b/i],
      ['bte_code', /\b(bte\s+code|bte\s+up\s+code|board\s+of\s+technical\s+education\s+code|polytechnic\s+code)\b/i],
      ['institutional_codes', /\b(college\s+codes?|institutional\s+codes?|aktu\s+and\s+bte\s+codes?)\b/i],
      ['total_intake', /\b(total\s+(b\.?\s?tech\s+)?(seats?|intake|capacity)|overall\s+(b\.?\s?tech\s+)?(seats?|intake)|how\s+many\s+total\s+seats)\b/i],
      ['intake', /\b(intake|seats?|seat\s+capacity|capacity|sanctioned\s+intake|how\s+many\s+seats)\b/i],
      ['duration', /\b(duration|how\s+many\s+years|course\s+length|how\s+long\s+is|semesters?)\b/i],
      ['scholarship_eligibility', /\b(eligibility\s+for\s+scholarship|scholarship\s+eligibility|who\s+is\s+eligible\s+for\s+scholarship|eligibility\s+criteria\s+for\s+scholarship|who\s+can\s+get\s+(the\s+)?scholarship|what\s+do\s+i\s+need\s+to\s+qualify\s+for\s+scholarship|can\s+i\s+apply\s+for\s+scholarship|requirements?\s+to\s+get\s+scholarship|to\s+get\s+scholarship\s+what\s+is\s+the\s+eligibility|how\s+to\s+qualify\s+for\s+scholarship)\b/i],
      ['eligibility', /\b(eligibility|criteria|qualification|marks\s+required|minimum\s+percentage|pcm|percentage\s+in\s+12th|who\s+can\s+apply|who\s+is\s+eligible)\b/i],
      ['highest_package', /\b(highest\s+package|highest\s+salary|max\s+package|maximum\s+package|highest\s+offer|top\s+package)\b/i],
      ['average_package', /\b(average\s+package|average\s+salary|mean\s+package|avg\s+package|mean\s+salary)\b/i],
      ['placement_rate', /\b(placement\s+rate|placement\s+percentage|how\s+many\s+percent\s+placed|placement\s+ratio)\b/i],
      ['students_placed', /\b(students\s+placed|how\s+many\s+students\s+got\s+placed|total\s+placed|offers\s+made|placed\s+students)\b/i],
      ['recruiters', /\b(recruiters?|companies|visiting\s+companies|who\s+hires|hiring\s+partners|tcs|infosys)\b/i],
      ['internships', /\b(internships?|summer\s+training|industrial\s+training)\b/i],
      ['branch_wise', /\b(branch\s*wise|department\s*wise\s+placement)\b/i],
      ['boys_hostel_fee', /\b(boys?\s+(hostel\s+)?(fees?|charges?|cost|rent)|hostel\s+fees?\s+for\s+boys?|how\s+much\s+is\s+boys?\s+hostel)\b/i],
      ['girls_hostel_fee', /\b(girls?\s+(hostel\s+)?(fees?|charges?|cost|rent)|hostel\s+fees?\s+for\s+girls?|how\s+much\s+is\s+girls?\s+hostel)\b/i],
      ['hostel_fee', /\b(hostel\s+(fees?|charges?|cost|room\s+rent|annual\s+fee)|how\s+much\s+(does\s+)?hostel\s+accommodation\s+cost|how\s+much\s+is\s+hostel(\s+fee)?)\b/i],
      ['hostel_rules', /\b(hostel\s+rules?|hostel\s+regulations?|hostel\s+discipline)\b/i],
      ['hostel_accommodation', /\b(hostel\s+accommodation|accommodation\s+in\s+hostel|stay\s+in\s+hostel)\b/i],
      ['hostel_facilities', /\b(hostel\s+facilities|hostel\s+amenities|facilities\s+in\s+hostel|amenities\s+in\s+hostel)\b/i],
      ['fees', /\b(fee|fees|tuition|cost|charges|installment|annual\s+fee|semester\s+fee)\b/i],
      ['director', /\b(director|director's\s+name|who\s+is\s+(the\s+)?director)\b/i],
      ['registrar', /\b(registrar|registrar's\s+name|who\s+is\s+(the\s+)?registrar)\b/i],
      ['all_hods', /\b(who\s+are\s+the\s+hods?|list\s+(all\s+)?hods?|give\s+me\s+all\s+department\s+hods?|departments?\s+and\s+their\s+hods?|hod\s+details(\s+of\s+all\s+departments?)?|all\s+hods?|list\s+of\s+hods?|department\s+heads?\s+list|show\s+all\s+hods?|list\s+all\s+department\s+heads|all\s+department\s+hods)\b/i],
      ['proctor_name', /\b(who\s+is\s+(the\s+)?proctor|proctor\s+of\s+vctm|proctor\s+name|college\s+proctor)\b/i],
      ['hod', /\b(hod|head\s+of\s+department|department\s+head|who\s+heads)\b/i],
      ['curfew_girls', /\b(curfew\s+(time|timing)?\s+(for\s+)?girls|girls?\s+(hostel\s+)?curfew|entry\s+time\s+for\s+girls|closing\s+time\s+for\s+girls|gate\s+closing\s+time\s+for\s+girls)\b/i],
      ['curfew_boys', /\b(curfew\s+(time|timing)?\s+(for\s+)?boys|boys?\s+(hostel\s+)?curfew|entry\s+time\s+for\s+boys|closing\s+time\s+for\s+boys|gate\s+closing\s+time\s+for\s+boys)\b/i],
      ['curfew', /\b(curfew\s+timings?|curfew\s+time|hostel\s+closing\s+time|gate\s+closing\s+time|curfew)\b/i],
      ['mess_food', /\b(mess|food|meals?|dining|vegetarian|lunch|dinner|breakfast)\b/i],
      ['hostel_amenities', /\b(hostel|room|accommodation|warden)\b/i],
      ['bus_routes', /\b(bus\s+routes?|bus\s+pickup\s+points?|bus\s+stops?|routes?\s+of\s+bus)\b/i],
      ['transport_facility', /\b(transportation\s+facilities|bus\s+facility|does\s+vctm\s+provide\s+bus|college\s+transport|bus\s+service|transport\s+service|transportation)\b/i],
      ['scholarship_up', /\b(up\s+scholarship|samaj\s+kalyan|post\s*matric|fee\s+reimbursement|government\s+scholarship)\b/i],
      ['scholarship_merit', /\b(merit\s+scholarships?|merit\s+base[d]?|fee\s+waiver|fee\s+concession|concession\s+for\s+marks)\b/i],
      ['attendance_rule', /\b(attendance|75%|attendance\s+rule|admit\s+card\s+attendance)\b/i],
      ['exam_pattern', /\b(exam|examination|sessional|internal\s+test|evaluation)\b/i],
      ['phone', /\b(phone|mobile|call|number|helpline|contact\s+number)\b/i],
      ['email', /\b(email|mail|e-mail)\b/i],
      ['website', /\b(website|portal|link|url|official\s+site)\b/i],
      ['address', /\b(address|location|where\s+is|landmark|distance|how\s+to\s+reach)\b/i],
      ['working_hours', /\b(working\s+hours|office\s+hours|timings?|open\s+on\s+saturday)\b/i],
      ['admission_process', /\b(admission|how\s+to\s+apply|admission\s+process|procedure|steps)\b/i],
      ['direct_admission', /\b(direct\s+admission|management\s+quota|without\s+jee)\b/i],
      ['documents_required', /\b(documents|certificates|what\s+to\s+bring)\b/i],
      ['btech_branches', /\b(btech\s+branches|engineering\s+branches|streams\s+in\s+btech)\b/i],
      ['specializations', /\b(specialization|specializations|streams?)\b/i],
      ['all_courses', /\b(all\s+courses|courses\s+offered|what\s+courses|list\s+of\s+courses)\b/i],
    ];

    for (const [attrKey, pat] of attrPatterns) {
      if (pat.test(q)) {
        if (!entities.attributes!.includes(attrKey)) {
          entities.attributes!.push(attrKey);
        }
      }
    }

    // HOD routing overrides
    if (entities.attributes!.includes('all_hods') || /\bcourses?\s+hods?\b/i.test(q)) {
      if (!entities.attributes!.includes('all_hods')) {
        entities.attributes!.push('all_hods');
      }
      entities.entity = 'VCTM';
      entities.course = undefined;
      entities.attributes = entities.attributes!.filter((a) => a !== 'hod' && a !== 'all_courses');
    } else if (entities.attributes!.includes('hod')) {
      if (/\bpolytechnic\b/i.test(q)) {
        if (/\b(cs|cse|computer)\b/i.test(q)) {
          entities.entity = 'Polytechnic CS';
          entities.course = 'Polytechnic CS';
        } else if (/\b(mech|mechanical)\b/i.test(q)) {
          entities.entity = 'Polytechnic Mechanical';
          entities.course = 'Polytechnic Mechanical';
        } else if (/\bcivil\b/i.test(q)) {
          entities.entity = 'Polytechnic Civil';
          entities.course = 'Polytechnic Civil';
        } else if (/\b(ec|ece|electronics)\b/i.test(q)) {
          entities.entity = 'Polytechnic EC';
          entities.course = 'Polytechnic EC';
        }
      } else if (/\b(cs|cse|computer\s+science)\b/i.test(q)) {
        entities.entity = 'B.Tech CSE';
        entities.course = 'B.Tech CSE';
      }
    }

    if (entities.attributes!.includes('proctor_name')) {
      entities.entity = 'VCTM';
    }

    // Specificity filter: remove generic superset attributes if specific sub-attributes were matched
    if (entities.attributes!.includes('scholarship_eligibility') || (isScholarshipQuery && entities.attributes!.includes('eligibility'))) {
      if (!entities.attributes!.includes('scholarship_eligibility')) {
        entities.attributes!.push('scholarship_eligibility');
      }
      entities.attributes = entities.attributes!.filter((a) => a !== 'eligibility');
      entities.entity = 'Scholarship';
      entities.course = undefined;
    }

    if (
      entities.attributes!.some((h) =>
        ['hostel_fee', 'boys_hostel_fee', 'girls_hostel_fee', 'hostel_rules', 'hostel_accommodation', 'hostel_facilities'].includes(h)
      )
    ) {
      entities.attributes = entities.attributes!.filter((a) => a !== 'fees' && a !== 'hostel_amenities');
    }

    if (entities.attributes!.includes('aktu_code') || entities.attributes!.includes('bte_code')) {
      entities.attributes = entities.attributes!.filter((a) => a !== 'institutional_codes');
    }
    if (
      entities.attributes!.includes('curfew_girls') ||
      entities.attributes!.includes('curfew_boys') ||
      entities.attributes!.includes('mess_food')
    ) {
      entities.attributes = entities.attributes!.filter((a) => a !== 'hostel_amenities' && a !== 'curfew');
    }
    if (
      entities.attributes!.includes('highest_package') ||
      entities.attributes!.includes('average_package') ||
      entities.attributes!.includes('placement_rate') ||
      entities.attributes!.includes('recruiters')
    ) {
      entities.attributes = entities.attributes!.filter((a) => a !== 'placement_overview');
    }
    if (entities.attributes!.includes('bus_routes')) {
      entities.attributes = entities.attributes!.filter((a) => a !== 'transport_facility');
    }

    // Reservation Category recognition
    if (/sc|st|scheduled\s+caste/i.test(q)) {
      entities.category = 'SC/ST';
    } else if (/obc|other\s+backward/i.test(q)) {
      entities.category = 'OBC';
    } else if (/ews|economically\s+weaker/i.test(q)) {
      entities.category = 'EWS';
    } else if (/general|unreserved/i.test(q)) {
      entities.category = 'General';
    }

    // Hostel type
    if (/girl|female|women/i.test(q)) {
      entities.hostelType = 'girls';
    } else if (/boy|male/i.test(q)) {
      entities.hostelType = 'boys';
    } else if (/ac\s+room|air\s*condition/i.test(q)) {
      entities.hostelType = 'ac';
    } else if (/non[\s-]?ac/i.test(q)) {
      entities.hostelType = 'non-ac';
    }

    // Quota / admission route
    if (/direct|management\s+quota|walk\s+in/i.test(q)) {
      entities.quota = 'direct';
    } else if (/counseling|aktu|upsee|jeemain/i.test(q)) {
      entities.quota = 'counseling';
    }

    return entities;
  }

  /**
   * Complete Classification Pipeline:
   * 1. Tokenization & N-Gram Generation
   * 2. TF-IDF Calculation
   * 3. Pure Logistic Regression Sigmoid Classification
   * 4. Context-aware Entity Extraction
   */
  public classify(text: string, contextCourse?: string): ClassificationResult {
    const startTime = performance.now();
    const { tokens, ngrams } = this.tokenizeAndExtractNgrams(text);
    const x = this.computeTFIDFVector(ngrams);
    const { predictedIndex, probabilities, logits } = this.predictRaw(x);

    const predictedIntent = this.intentClasses[predictedIndex];
    const confidence = probabilities[predictedIndex];

    const tfidfVector: TFIDFTokenDetail[] = [];
    const termCount = new Map<string, number>();
    for (const term of ngrams) {
      termCount.set(term, (termCount.get(term) || 0) + 1);
    }

    for (const [term, rawCount] of termCount.entries()) {
      const idx = this.vocabIndexMap.get(term);
      if (idx !== undefined) {
        const tf = 1 + Math.log(rawCount);
        const idf = this.idfMap.get(term) || 1.0;
        const normalizedTfidf = x[idx];
        tfidfVector.push({
          term,
          rawCount,
          tf: Number(tf.toFixed(3)),
          idf: Number(idf.toFixed(3)),
          tfidf: Number(normalizedTfidf.toFixed(4)),
        });
      }
    }

    tfidfVector.sort((a, b) => b.tfidf - a.tfidf);

    const topContributingFeatures: FeatureContribution[] = [];
    const classWeights = this.weights[predictedIndex];

    for (const item of tfidfVector) {
      const idx = this.vocabIndexMap.get(item.term);
      if (idx !== undefined) {
        const weight = classWeights[idx];
        topContributingFeatures.push({
          token: item.term,
          weight: Number(weight.toFixed(4)),
          tfidfValue: item.tfidf,
          contribution: Number((weight * item.tfidf).toFixed(4)),
        });
      }
    }

    topContributingFeatures.sort((a, b) => b.contribution - a.contribution);

    const probabilityMap: Record<IntentType, number> = {} as any;
    const logitsMap: Record<IntentType, number> = {} as any;

    this.intentClasses.forEach((intent, idx) => {
      probabilityMap[intent] = Number(probabilities[idx].toFixed(4));
      logitsMap[intent] = Number(logits[idx].toFixed(4));
    });

    const isGreeting = /^(hi|hello|hey|namaste|good\s*(morning|evening|afternoon)|greetings)\b/i.test(text.trim());
    const isThanks = /^(thanks|thank\s*you|thankyou|much\s+appreciated)\b/i.test(text.trim());
    const isGoodbye = /^(bye|goodbye|see\s*you|farewell|exit|bye\s*bye)\b/i.test(text.trim());

    let finalIntent: IntentType = predictedIntent;
    let finalConfidence = confidence;

    const extractedEntities = this.extractEntities(text, contextCourse);

    if (isGreeting) {
      finalIntent = 'greeting';
      finalConfidence = 0.99;
    } else if (isThanks) {
      finalIntent = 'thanks';
      finalConfidence = 0.99;
    } else if (isGoodbye) {
      finalIntent = 'goodbye';
      finalConfidence = 0.99;
    } else if (
      extractedEntities.attributes?.includes('all_hods') ||
      /\b(who\s+are\s+the\s+hods?|list\s+(all\s+)?hods?|all\s+department\s+hods?|departments?\s+and\s+their\s+hods?|hod\s+details(\s+of\s+all\s+departments?)?|all\s+hods?|list\s+of\s+hods?|department\s+heads?\s+list|show\s+all\s+hods?|courses?\s+hods?)\b/i.test(text)
    ) {
      finalIntent = 'departments';
      finalConfidence = 0.98;
    } else if (/\b(scholarship|scholarships|samaj\s+kalyan|post\s*matric|fee\s+reimbursement|fee\s+waiver|fee\s+concession)\b/i.test(text)) {
      // Explicit scholarship queries must override any previous course context.
      finalIntent = 'scholarships';
      finalConfidence = 0.99;
      extractedEntities.entity = extractedEntities.entity || 'Scholarship';
      extractedEntities.course = undefined;
    } else if (/\b(contact|contact\s+details?|contact\s+number|helpline|phone|mobile|email|e[-\s]?mail|reach\s+(the\s+)?college|how\s+can\s+i\s+contact)\b/i.test(text)) {
      // Explicit contact queries must never inherit a previous course context.
      finalIntent = 'contact_details';
      finalConfidence = 0.99;
      extractedEntities.entity = 'VCTM';
      extractedEntities.course = undefined;
      if (!extractedEntities.attributes?.length) extractedEntities.attributes = ['phone'];
    } else if (extractedEntities.attributes?.includes('scholarship_eligibility')) {
      finalIntent = 'scholarships';
      finalConfidence = 0.98;
    } else if (extractedEntities.attributes?.some((a) => ['hostel_fee', 'boys_hostel_fee', 'girls_hostel_fee'].includes(a))) {
      finalIntent = 'hostel_mess';
      finalConfidence = 0.98;
    } else if (/\b(placement|placements|recruiters?|recruitment|campus\s+placement|placement\s+process|placement\s+assistance|how\s+are\s+the\s+placements?)\b/i.test(text)) {
      // Explicit placement-domain queries must override previous course context.
      finalIntent = 'placements';
      finalConfidence = 0.99;
      extractedEntities.entity = 'VCTM Placement Cell';
      extractedEntities.course = undefined;
    } else if (extractedEntities.attributes?.some((a) => ['highest_package', 'average_package', 'placement_rate', 'students_placed'].includes(a))) {
      finalIntent = 'placements';
      finalConfidence = 0.98;
    } else if (tfidfVector.length === 0) {
      finalIntent = 'fallback';
      finalConfidence = 0.0;
      probabilityMap['fallback'] = 1.0;
    }

    const endTime = performance.now();

    return {
      predictedIntent: finalIntent,
      confidence: Number(finalConfidence.toFixed(4)),
      probabilities: probabilityMap,
      rawLogits: logitsMap,
      extractedEntities,
      tokens,
      ngrams,
      tfidfVector,
      topContributingFeatures: topContributingFeatures.slice(0, 10),
      inferenceTimeMs: Number((endTime - startTime).toFixed(2)),
    };
  }

  public getModelMetrics(): ModelMetrics {
    return this.metrics;
  }
}

export const nlpEngine = new NLPLogisticEngine();
