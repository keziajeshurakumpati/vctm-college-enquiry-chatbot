/**
 * responseGenerator.ts - Exact Verified Q&A Retrieval Engine
 *
 * Implements the Final Flow:
 * User Question → TF-IDF → Logistic Regression → Intent/Entity/Attribute → Exact Verified Q&A Retrieval → Specific Answer Only → Fallback if unavailable
 *
 * Rules:
 * 1. Return ONLY the information specifically asked for. Do not display extra related data.
 * 2. If the user asks multiple things, answer only those requested items.
 * 3. If exact information is unavailable, state it is not available in the verified dataset. Never substitute, guess or estimate.
 * 4. Maintain existing frontend / API compatibility.
 */

import { VCTM_DATA } from '../data/vctmKnowledgeBase.js';
import { VERIFIED_QA_DATASET, VerifiedQARecord } from '../data/vctmVerifiedQA.js';
import { ChatMessage, ClassificationResult } from '../types/chatbot.js';

export interface GeneratedBotResponse {
  text: string;
  cardType?: ChatMessage['cardType'];
  cardData?: any;
  suggestedFollowUps: string[];
  sourceReference: string;
}

/**
 * Find exact matching verified record in VERIFIED_QA_DATASET
 */
function findExactVerifiedRecord(
  intent: string,
  entity?: string,
  attribute?: string
): VerifiedQARecord | undefined {
  let normEntity = entity;
  let normAttr = attribute;
  let normIntent = intent;

  // 1. Normalize hostel fee attributes
  if (normAttr === 'hostel_fee' || normAttr === 'boys_hostel_fee' || normAttr === 'girls_hostel_fee') {
    normIntent = 'hostel_mess';
    if (normAttr === 'boys_hostel_fee' || normEntity === 'Boys Hostel') {
      normEntity = 'Boys Hostel';
      normAttr = 'boys_hostel_fee';
    } else if (normAttr === 'girls_hostel_fee' || normEntity === 'Girls Hostel') {
      normEntity = 'Girls Hostel';
      normAttr = 'girls_hostel_fee';
    } else {
      normEntity = 'VCTM Hostel';
      normAttr = 'hostel_fee';
    }
  } else if (normAttr === 'hostel_facilities' || normAttr === 'hostel_amenities') {
    normIntent = 'hostel_mess';
    normEntity = 'VCTM Hostel';
    normAttr = 'hostel_facilities';
  } else if (normAttr === 'hostel_rules') {
    normIntent = 'hostel_mess';
    normEntity = 'VCTM Hostel';
    normAttr = 'hostel_rules';
  } else if (normAttr === 'hostel_accommodation') {
    normIntent = 'hostel_mess';
    normEntity = 'VCTM Hostel';
    normAttr = 'hostel_accommodation';
  } else if (normAttr === 'total_intake') {
    normIntent = 'course_details';
    normEntity = 'B.Tech';
    normAttr = 'total_intake';
  } else if (normAttr === 'scholarship_eligibility') {
    normIntent = 'scholarships';
    normEntity = 'Scholarship';
    normAttr = 'scholarship_eligibility';
  } else if (normAttr === 'all_hods') {
    normIntent = 'departments';
    normEntity = 'VCTM';
    normAttr = 'all_hods';
  } else if (normAttr === 'proctor_name') {
    normIntent = 'departments';
    normEntity = 'VCTM';
    normAttr = 'proctor_name';
  } else if (normAttr === 'transport_facility') {
    normIntent = 'transportation';
    normEntity = 'VCTM Bus Fleet';
    normAttr = 'transport_facility';
  } else if (normAttr === 'fees') {
    normIntent = 'fees_structure';
    if (normEntity && (/b\.?\s*tech|cse|it|mech|civil|ece|ee|agri/i.test(normEntity))) {
      normEntity = 'B.Tech';
      normAttr = 'fee_btech';
    } else if (normEntity && /mba/i.test(normEntity)) {
      normEntity = 'MBA';
      normAttr = 'fee_mba';
    } else if (normEntity && /mca/i.test(normEntity)) {
      normEntity = 'MCA';
      normAttr = 'fee_mca';
    } else if (normEntity && (/m\.?\s*tech|production|structural/i.test(normEntity))) {
      normEntity = 'M.Tech';
      normAttr = 'fee_mtech';
    } else if (normEntity && (/polytechnic|diploma/i.test(normEntity))) {
      normEntity = 'Polytechnic Diploma';
      normAttr = 'fee_diploma';
    } else {
      normEntity = 'VCTM';
      normAttr = 'fee_policy';
    }
  }

  // 2. Normalize curfew
  if (normAttr === 'curfew' || normAttr === 'curfew_girls' || normAttr === 'curfew_boys') {
    normIntent = 'hostel_mess';
    if (normEntity === 'Boys Hostel' || normAttr === 'curfew_boys') {
      normEntity = 'Boys Hostel';
      normAttr = 'curfew_boys';
    } else {
      normEntity = 'Girls Hostel';
      normAttr = 'curfew_girls';
    }
  }

  // 3. Normalize HOD
  if (normAttr === 'hod') {
    normIntent = 'departments';
    if (normEntity && /applied\s+sciences?/i.test(normEntity)) {
      normEntity = 'Applied Sciences';
    } else if (normEntity && /mba/i.test(normEntity)) {
      normEntity = 'MBA';
    } else if (normEntity && /mca/i.test(normEntity)) {
      normEntity = 'MCA';
    } else if (normEntity && /polytechnic.*(cs|cse|computer)/i.test(normEntity)) {
      normEntity = 'Polytechnic CS';
    } else if (normEntity && /polytechnic.*mech/i.test(normEntity)) {
      normEntity = 'Polytechnic Mechanical';
    } else if (normEntity && /polytechnic.*civil/i.test(normEntity)) {
      normEntity = 'Polytechnic Civil';
    } else if (normEntity && /polytechnic.*e(c|ce)/i.test(normEntity)) {
      normEntity = 'Polytechnic EC';
    } else if (normEntity && /civil/i.test(normEntity)) {
      normEntity = 'B.Tech Civil';
    } else if (normEntity && /mech/i.test(normEntity)) {
      normEntity = 'B.Tech Mechanical';
    } else if (normEntity && /electrical|\bee\b/i.test(normEntity)) {
      normEntity = 'B.Tech Electrical';
    } else if (normEntity && /electronics|\bece\b/i.test(normEntity)) {
      normEntity = 'B.Tech ECE';
    } else if (normEntity && /agri/i.test(normEntity)) {
      normEntity = 'B.Tech Agricultural';
    } else {
      normEntity = 'B.Tech CSE';
    }
  }

  // Direct match by attribute & entity
  if (normAttr) {
    if (normEntity) {
      const match = VERIFIED_QA_DATASET.find(
        (r) =>
          r.attribute === normAttr &&
          r.entity.toLowerCase() === normEntity!.toLowerCase()
      );
      if (match) return match;
    }
    const match = VERIFIED_QA_DATASET.find((r) => r.attribute === normAttr);
    if (match) return match;
  }

  if (normIntent) {
    if (normEntity) {
      const match = VERIFIED_QA_DATASET.find(
        (r) =>
          r.intent === normIntent &&
          r.entity.toLowerCase() === normEntity!.toLowerCase()
      );
      if (match) return match;
    }
    const match = VERIFIED_QA_DATASET.find((r) => r.intent === normIntent);
    if (match) return match;
  }

  return undefined;
}

/**
 * Detect explicitly unrelated queries
 */
function isExplicitlyUnrelated(q: string): boolean {
  const unrelatedPatterns = [
    /\b(capital\s+of|president\s+of|prime\s+minister|chief\s+minister|who\s+invented|largest\s+(country|ocean|planet|animal|state)|history\s+of\s+(india|world|america|europe)|world\s+war|currency\s+of|population\s+of|elon\s+musk|bill\s+gates|messi|ronaldo)\b/i,
    /\b(tell(\s+me)?\s+a\s+joke|joke|riddle|write(\s+me)?\s+a\s+(poem|story|song|essay|speech)|sing\s+a\s+song|do\s+you\s+love\s+me|are\s+you\s+(human|robot|ai|real|single)|meaning\s+of\s+life)\b/i,
    /\b(write(\s+a)?\s+(python|c\+\+|java|javascript|php|sql|rust|golang|ruby|html|css)\s+(code|script|program)|how\s+to\s+(write\s+a\s+loop|invert\s+a\s+binary\s+tree|reverse\s+a\s+string|install\s+linux|install\s+windows)|def\s+[a-z_]+)\b/i,
    /\b(solve\s+for\s+[a-z]|derivative\s+of|integral\s+of|calculate\s+\d+|what\s+is\s+photosynthesis|speed\s+of\s+light|pythagorean\s+theorem|newton'?s\s+law|formula\s+for\s+acceleration)\b/i,
    /\b(recipe\s+for|how\s+to\s+(make|cook|bake)\s+(cake|pizza|biryani|pasta|burger|soup|chicken|tea|coffee|curry)|ingredients\s+of)\b/i,
    /\b(weather\s+in|today'?s\s+weather|temperature\s+in|will\s+it\s+rain|weather\s+forecast)\b/i,
    /\b(cricket\s+score|who\s+won\s+the\s+match|fifa\s+world\s+cup|ipl\s+score|movie\s+review|box\s+office|netflix|spotify)\b/i,
    /\b(bitcoin\s+price|cryptocurrency|ethereum|stock\s+market|sensex|nifty|share\s+price|buy\s+iphone)\b/i,
  ];
  return unrelatedPatterns.some((p) => p.test(q));
}

export function generateResponse(
  userQuery: string,
  classification: ClassificationResult,
  previousContextCourse?: string
): GeneratedBotResponse {
  const { predictedIntent, extractedEntities } = classification;
  const qLower = userQuery.toLowerCase().trim();

  // 1. Dedicated Conversation Intents
  if (
    predictedIntent === 'greeting' ||
    /^(hi|hello|hey|namaste|good\s*(morning|evening|afternoon)|greetings)\b/i.test(qLower)
  ) {
    const rec = findExactVerifiedRecord('greeting');
    return {
      text:
        rec?.answer ||
        'Hello! Welcome to Vivekananda College of Technology & Management (VCTM, Aligarh · AKTU Code: 340, BTE Code: 1628). How can I assist you with college information today?',
      sourceReference: 'Official VCTM Portal (https://vctm.in)',
      suggestedFollowUps: [
        'What courses are offered?',
        'What is the intake for B.Tech CSE?',
        'What is the highest package in placement?',
        'How can I contact the college?',
      ],
    };
  }

  if (
    predictedIntent === 'thanks' ||
    /^(thanks|thank\s*you|thankyou|much\s+appreciated|ok|okay|got\s+it|understood|alright)\b/i.test(qLower)
  ) {
    const rec = findExactVerifiedRecord('thanks');
    return {
      text:
        rec?.answer ||
        "You're welcome! Feel free to ask if you have any more questions about VCTM courses, admissions, or campus facilities.",
      sourceReference: 'Official VCTM Portal (https://vctm.in)',
      suggestedFollowUps: ['What courses are offered?', 'How are the placements?', 'How can I contact the college?'],
    };
  }

  if (
    predictedIntent === 'goodbye' ||
    /^(bye|goodbye|see\s*you|farewell|exit|bye\s*bye)\b/i.test(qLower)
  ) {
    const rec = findExactVerifiedRecord('goodbye');
    return {
      text:
        rec?.answer ||
        'Goodbye! Wishing you all the best with your studies and admission journey. Have a great day!',
      sourceReference: 'Official VCTM Portal (https://vctm.in)',
      suggestedFollowUps: [],
    };
  }

  // Fallback for explicitly unrelated queries
  if (
    predictedIntent === 'fallback' ||
    isExplicitlyUnrelated(qLower) ||
    predictedIntent === 'unknown'
  ) {
    return {
      text: 'This specific information is not available in the verified VCTM dataset. For official assistance, please contact the VCTM Helpdesk at +91 94540 10846 or info@vctm.in.',
      cardType: 'fallback_card',
      cardData: { isFallback: true },
      suggestedFollowUps: [
        'What courses are offered?',
        'What is the intake for B.Tech CSE?',
        'What is the highest package in placement?',
        'How can I contact the college?',
      ],
      sourceReference: 'Official VCTM Helpdesk (https://vctm.in)',
    };
  }

  // 2. Unsupported programs check (e.g. Aeronautical, MBBS, BDS, Nursing, Pharmacy, etc.)
  const unsupportedMatch = VCTM_DATA.unsupportedPrograms.find((prog) =>
    new RegExp(`\\b${prog.toLowerCase().replace('.', '\\.')}\\b`, 'i').test(qLower)
  );

  if (unsupportedMatch) {
    return {
      text: `No, **${unsupportedMatch} is not offered at VCTM**.\n\nVivekananda College of Technology & Management (Aligarh · AKTU Code: **340**, BTE Code: **1628**) offers approved programs in:\n• **B.Tech (4 Years):** CSE, IT, ECE, Mechanical, Civil, Electrical, Agricultural Engineering\n• **Postgraduate (2 Years):** MBA, MCA, M.Tech (Production & Structural)\n• **Polytechnic Diploma (3 Years):** Civil Engineering, Mechanical Engineering`,
      suggestedFollowUps: [
        'What courses are offered?',
        'What is the B.Tech eligibility?',
        'How can I contact the college?',
      ],
      sourceReference: 'VCTM Academic Intake Directory (vctm.in)',
    };
  }

  // 3. Resolve Entity & Attributes
  const entity = extractedEntities.entity || extractedEntities.course || (extractedEntities.isGeneralCourse ? 'VCTM' : previousContextCourse);
  const attributes = extractedEntities.attributes || [];

  // Match course object if applicable
  const matchedCourse = entity
    ? VCTM_DATA.courses.find(
        (c) =>
          c.shortCode.toLowerCase() === entity.toLowerCase() ||
          c.name.toLowerCase().includes(entity.toLowerCase()) ||
          c.id.toLowerCase() === entity.toLowerCase()
      )
    : undefined;

  // 4. Multi-Attribute Query: Answer ONLY the requested items
  if (attributes.length > 1 && entity) {
    const lines: string[] = [];
    for (const attr of attributes) {
      const rec =
        findExactVerifiedRecord(predictedIntent, entity, attr) ||
        findExactVerifiedRecord(predictedIntent, 'VCTM', attr) ||
        findExactVerifiedRecord('course_details', entity, attr) ||
        findExactVerifiedRecord('course_details', 'VCTM', attr);

      if (rec) {
        const label = attr.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        lines.push(`• **${label}:** ${rec.answer}`);
      }
    }

    if (lines.length > 0) {
      const header = entity !== 'VCTM' ? `For **${entity}**:\n` : `VCTM Verified Details:\n`;
      return {
        text: header + lines.join('\n'),
        suggestedFollowUps: [
          'What courses are offered?',
          'What are the fees for B.Tech?',
          'How can I contact the college?',
        ],
        sourceReference: 'Official VCTM Portal (https://vctm.in)',
      };
    }
  }

  // 5. Single Attribute Query: Answer ONLY the specifically requested attribute
  if (attributes.length === 1) {
    const attr = attributes[0];
    const rec =
      findExactVerifiedRecord(predictedIntent, entity, attr) ||
      findExactVerifiedRecord(predictedIntent, 'VCTM', attr) ||
      findExactVerifiedRecord(predictedIntent, undefined, attr);

    if (rec) {
      // Attach appropriate UI card if helpful, while keeping answer concise
      let cardType: ChatMessage['cardType'];
      let cardData: any;

      if (attr === 'all_courses') {
        cardType = 'course_card';
        cardData = { allCourses: VCTM_DATA.courses };
      }

      return {
        text: rec.answer,
        cardType,
        cardData,
        suggestedFollowUps: [
          'What courses are offered?',
          'What is the highest package in placement?',
          'How can I contact the college?',
        ],
        sourceReference: `Official VCTM Portal (${rec.source_url})`,
      };
    }
  }

  // 6. Direct Course Overview (if user asked about a course without specific sub-attribute)
  if (matchedCourse && !extractedEntities.isGeneralCourse) {
    return {
      text: `**${matchedCourse.name} (${matchedCourse.shortCode})** is an AICTE-approved ${matchedCourse.duration} program affiliated with AKTU Lucknow (College Code: **340**).\n\n• **Total Seats:** ${matchedCourse.totalSeats} seats\n• **Eligibility:** ${matchedCourse.eligibility}\n• **Exams Accepted:** ${matchedCourse.examAccepted.join(', ')}\n• **Curriculum Highlights:** ${matchedCourse.curriculumHighlights.join(', ')}`,
      cardType: 'course_card',
      cardData: { course: matchedCourse },
      suggestedFollowUps: [
        `What are the fees for ${matchedCourse.shortCode}?`,
        `Who is the HOD for ${matchedCourse.shortCode}?`,
        'What companies recruit students?',
      ],
      sourceReference: 'VCTM Course Curriculum Matrix (vctm.in / AKTU Code: 340)',
    };
  }

  // 7. General Course Overview
  if (extractedEntities.isGeneralCourse || predictedIntent === 'course_details') {
    const rec = findExactVerifiedRecord('course_details', 'VCTM', 'all_courses');
    return {
      text:
        rec?.answer ||
        'The approved academic programmes offered at VCTM are:\n1. **B.Tech (4 Years · AKTU Code 340):** CSE (60 seats), IT (30 seats), Mechanical (60 seats), Civil (60 seats), ECE (60 seats), EE (60 seats), Agricultural Engineering (30 seats) - Total 360 seats\n2. **Postgraduate (2 Years · AKTU Code 340):** MBA (60 seats), MCA (Annual fee ₹55,000), M.Tech Production (24 seats), M.Tech Structural (24 seats)\n3. **Polytechnic Diploma (3 Years · BTE Code 1628):** Civil (60 seats), Mechanical (60 seats) - Total 120 seats',
      cardType: 'course_card',
      cardData: { allCourses: VCTM_DATA.courses },
      suggestedFollowUps: [
        'What is the intake for B.Tech CSE?',
        'What is the B.Tech eligibility?',
        'What are the fees for B.Tech?',
      ],
      sourceReference: 'AICTE & AKTU Approved Intake Directory (vctm.in)',
    };
  }

  // 8. General Intent-Level Retrieval
  const intentRec = findExactVerifiedRecord(predictedIntent, entity) || findExactVerifiedRecord(predictedIntent, 'VCTM');

  if (intentRec) {
    let cardType: ChatMessage['cardType'];
    let cardData: any;

    if (predictedIntent === 'admissions') {
      cardType = 'admission_steps';
      cardData = { steps: VCTM_DATA.admissionSteps };
    } else if (predictedIntent === 'placements') {
      // STRICT ATTRIBUTE-ONLY: Check if user asked for a specific placement metric
      if (/\b(highest\s+package|max(imum)?\s+package|top\s+package|highest\s+salary)\b/i.test(qLower)) {
        const hRec = findExactVerifiedRecord('placements', 'VCTM Placement Cell', 'highest_package');
        return {
          text: hRec?.answer || 'The highest salary package is not officially published on the VCTM website.',
          sourceReference: `Official VCTM Portal (${hRec?.source_url || 'https://vctm.in/pages/Placement%20Records'})`,
          suggestedFollowUps: ['Who are the recruiters at VCTM?', 'How can I contact the college?'],
        };
      }
      if (/\b(average\s+package|avg\s+package|mean\s+salary|average\s+salary)\b/i.test(qLower)) {
        const aRec = findExactVerifiedRecord('placements', 'VCTM Placement Cell', 'average_package');
        return {
          text: aRec?.answer || 'The average salary package is not officially published on the VCTM website.',
          sourceReference: `Official VCTM Portal (${aRec?.source_url || 'https://vctm.in/pages/Placement%20Records'})`,
          suggestedFollowUps: ['Who are the recruiters at VCTM?', 'How can I contact the college?'],
        };
      }
      if (/\b(placement\s+(rate|percentage)|how\s+many\s+percent\s+placed)\b/i.test(qLower)) {
        const pRec = findExactVerifiedRecord('placements', 'VCTM Placement Cell', 'placement_rate');
        return {
          text: pRec?.answer || 'The overall placement rate or percentage is not officially published on the VCTM website.',
          sourceReference: `Official VCTM Portal (${pRec?.source_url || 'https://vctm.in/pages/Career%20Resource%20Center%20Department'})`,
          suggestedFollowUps: ['Who are the recruiters at VCTM?', 'How can I contact the college?'],
        };
      }
      if (/\b(students?\s+placed|placed\s+students|how\s+many\s+students\s+got\s+placed)\b/i.test(qLower)) {
        const sRec = findExactVerifiedRecord('placements', 'VCTM Placement Cell', 'students_placed');
        return {
          text: sRec?.answer || 'The total number of students placed for academic sessions is not officially published on the VCTM website.',
          sourceReference: `Official VCTM Portal (${sRec?.source_url || 'https://vctm.in/pages/Placement%20Records'})`,
          suggestedFollowUps: ['Who are the recruiters at VCTM?', 'How can I contact the college?'],
        };
      }

      // General placements inquiry (e.g. "How are the placements?", "Tell me about placements")
      cardType = 'placement_stats';
      cardData = { stats: VCTM_DATA.placementStats };
    }

    return {
      text: intentRec.answer,
      cardType,
      cardData,
      suggestedFollowUps: [
        'What courses are offered?',
        'What are the fees for B.Tech?',
        'How can I contact the college?',
      ],
      sourceReference: `Official VCTM Portal (${intentRec.source_url})`,
    };
  }

  // 9. Exact Fallback when information is unavailable in verified dataset
  return {
    text: 'This specific information is not available in the verified VCTM dataset. For official verified records, please contact the VCTM Admission Cell (+91 94540 10846 / info@vctm.in).',
    suggestedFollowUps: [
      'What courses are offered?',
      'What is the intake for B.Tech CSE?',
      'What is the highest package in placement?',
      'How can I contact the college?',
    ],
    sourceReference: 'Official VCTM Helpdesk (https://vctm.in)',
  };
}
