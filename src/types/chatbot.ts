export type IntentType =
  | 'greeting'
  | 'thanks'
  | 'goodbye'
  | 'fallback'
  | 'admissions'
  | 'course_details'
  | 'eligibility_criteria'
  | 'fees_structure'
  | 'scholarships'
  | 'hostel_mess'
  | 'placements'
  | 'examinations'
  | 'departments'
  | 'facilities_campus'
  | 'transportation'
  | 'contact_details'
  | 'location'
  | 'cutoffs_ranks'
  | 'general_greeting'
  | 'unknown'
  | 'anti_ragging'
  | 'grievance_cell'
  | 'dress_code'
  | 'academic_policy';

export interface IntentMetadata {
  id: IntentType;
  label: string;
  description: string;
}

export interface ExtractedEntities {
  course?: string;
  entity?: string;
  attributes?: string[];
  category?: 'General' | 'OBC' | 'SC/ST' | 'EWS';
  year?: string;
  hostelType?: 'ac' | 'non-ac' | 'boys' | 'girls';
  quota?: 'counseling' | 'direct' | 'management';
  isGeneralCourse?: boolean;
}

export interface TFIDFTokenDetail {
  term: string;
  rawCount: number;
  tf: number;
  idf: number;
  tfidf: number;
}

export interface FeatureContribution {
  token: string;
  weight: number;
  tfidfValue: number;
  contribution: number;
}

export interface ClassificationResult {
  predictedIntent: IntentType;
  confidence: number;
  probabilities: Record<IntentType, number>;
  rawLogits: Record<IntentType, number>;
  extractedEntities: ExtractedEntities;
  tokens: string[];
  ngrams: string[];
  tfidfVector: TFIDFTokenDetail[];
  topContributingFeatures: FeatureContribution[];
  inferenceTimeMs: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  classification?: ClassificationResult;
  cardType?:
    | 'course_card'
    | 'fee_table'
    | 'hostel_card'
    | 'placement_stats'
    | 'scholarship_breakdown'
    | 'contact_card'
    | 'facilities_grid'
    | 'eligibility_checker'
    | 'admission_steps'
    | 'exam_card'
    | 'department_card'
    | 'transport_card'
    | 'location_card'
    | 'fallback_card';
  cardData?: any;
  suggestedFollowUps?: string[];
  sourceReference?: string;
}

export interface TrainingExample {
  text: string;
  intent: IntentType;
}

export interface ModelMetrics {
  accuracy: number;
  trainingLoss: number;
  epochs: number;
  learningRate: number;
  vocabSize: number;
  totalTrainingSamples: number;
  lossHistory: number[];
  confusionMatrix: {
    classes: IntentType[];
    matrix: number[][];
  };
}

export interface CollegeCourse {
  id: string;
  name: string;
  shortCode: string;
  level: 'Undergraduate' | 'Postgraduate' | 'Diploma';
  duration: string;
  totalSeats: number;
  annualFee: number;
  semesterFee: number;
  eligibility: string;
  examAccepted: string[];
  curriculumHighlights: string[];
  careerProspects: string[];
}
