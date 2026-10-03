"""
knowledge_retriever.py - Searchable Knowledge Base Retrieval Engine

Retrieves exact verified Q&A answers from the official VCTM dataset.
Flow: User Question -> Intent + Entity + Requested Attribute -> Exact Verified Q&A Retrieval -> Specific Answer Only -> Fallback if unavailable.

Rule: Returns ONLY the information specifically asked for. Does not display extra related data.
If the user asks multiple things, answers only those requested items.
If exact information is unavailable, states it is not available in the verified dataset.
"""

import json
import logging
import os
import re
from typing import Dict, List, Optional

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, "data")
QA_FILE = os.path.join(DATA_DIR, "vctm_verified_qa.json")

class KnowledgeRetriever:
    def __init__(self):
        self.qa_records: List[Dict] = []
        self.load_knowledge_base()

    def load_knowledge_base(self):
        """Loads verified Q&A records."""
        if os.path.exists(QA_FILE):
            with open(QA_FILE, "r", encoding="utf-8") as f:
                self.qa_records = json.load(f)
            logger.info(f"Loaded {len(self.qa_records)} verified Q&A records.")
        else:
            logger.warning(f"{QA_FILE} not found. Using fallback.")
            self.qa_records = []

    def find_exact_record(self, intent: str, entity: Optional[str] = None, attribute: Optional[str] = None) -> Optional[Dict]:
        """Finds matching verified record by intent, entity, and attribute."""
        # Normalize hostel fee attributes
        if attribute in ["hostel_fee", "boys_hostel_fee", "girls_hostel_fee"]:
            intent = "hostel_mess"
            if attribute == "boys_hostel_fee" or entity == "Boys Hostel":
                entity = "Boys Hostel"
                attribute = "boys_hostel_fee"
            elif attribute == "girls_hostel_fee" or entity == "Girls Hostel":
                entity = "Girls Hostel"
                attribute = "girls_hostel_fee"
            else:
                entity = "VCTM Hostel"
                attribute = "hostel_fee"

        # Normalize hostel facilities
        elif attribute in ["hostel_facilities", "hostel_amenities"]:
            intent = "hostel_mess"
            entity = "VCTM Hostel"
            attribute = "hostel_facilities"

        # Normalize scholarship eligibility
        elif attribute == "scholarship_eligibility":
            intent = "scholarships"
            entity = "Scholarship"

        # Normalize broad HOD
        elif attribute == "all_hods":
            intent = "departments"
            entity = "VCTM"

        # Normalize transport facility
        elif attribute == "transport_facility":
            intent = "transportation"
            entity = "VCTM Bus Fleet"

        # Normalize fees attribute by program
        elif attribute == "fees":
            intent = "fees_structure"
            if entity and ("B.Tech" in entity or entity in ["B.Tech CSE", "B.Tech IT", "B.Tech Mechanical", "B.Tech Civil", "B.Tech ECE", "B.Tech Electrical", "B.Tech Agricultural"]):
                entity = "B.Tech"
                attribute = "fee_btech"
            elif entity == "MBA":
                attribute = "fee_mba"
            elif entity == "MCA":
                attribute = "fee_mca"
            elif entity and ("M.Tech" in entity or entity in ["M.Tech Production", "M.Tech Structural"]):
                entity = "M.Tech"
                attribute = "fee_mtech"
            elif entity and ("Polytechnic" in entity or "Diploma" in entity):
                entity = "Polytechnic Diploma"
                attribute = "fee_diploma"
            else:
                entity = "VCTM"
                attribute = "fee_policy"

        # Normalize curfew attribute
        elif attribute in ["curfew", "curfew_girls", "curfew_boys"]:
            intent = "hostel_mess"
            if entity == "Boys Hostel" or attribute == "curfew_boys":
                entity = "Boys Hostel"
                attribute = "curfew_boys"
            else:
                entity = "Girls Hostel"
                attribute = "curfew_girls"

        # Direct match by intent, entity, attribute
        for record in self.qa_records:
            if record["intent"] == intent:
                if entity and record["entity"].lower() != entity.lower():
                    continue
                if attribute and record["attribute"] != attribute:
                    continue
                return record

        # Match by attribute and entity across intents
        if attribute and entity:
            for record in self.qa_records:
                if record["attribute"] == attribute and record["entity"].lower() == entity.lower():
                    return record

        # Fallback to attribute match
        if attribute:
            for record in self.qa_records:
                if record["attribute"] == attribute:
                    if entity and record["entity"].lower() != entity.lower() and record["entity"] not in ["VCTM", "Scholarship", "VCTM Hostel", "VCTM Bus Fleet", "VCTM Placement Cell"]:
                        continue
                    return record
        return None

    def retrieve_response(self, query: str, predicted_intent: str, entities: Dict) -> Dict:
        """
        Retrieves specific answer matching Intent + Entity + Attribute.
        Returns ONLY what was asked for.
        """
        q_lower = query.lower().strip()
        unsupported_programs = [
            "MBBS", "BDS", "B.Pharm", "D.Pharm", "LLB", "BA LLB", "B.Ed",
            "B.Sc Nursing", "B.Arch", "Ph.D", "Aeronautical Engineering",
            "Aerospace Engineering", "Biotechnology", "Chemical Engineering", "BCA", "BBA",
        ]
        unsupported_match = next(
            (
                program for program in unsupported_programs
                if re.search(rf"\b{re.escape(program.lower())}\b", q_lower)
            ),
            None,
        )
        if unsupported_match:
            return {
                "text": (
                    f"No, **{unsupported_match} is not offered at VCTM**.\n\n"
                    "Vivekananda College of Technology & Management (Aligarh · AKTU Code: **340**, "
                    "BTE Code: **1628**) offers approved programs in:\n"
                    "• **B.Tech (4 Years):** CSE, IT, ECE, Mechanical, Civil, Electrical, "
                    "Agricultural Engineering\n"
                    "• **Postgraduate (2 Years):** MBA, MCA, M.Tech (Production & Structural)\n"
                    "• **Polytechnic Diploma (3 Years):** Civil Engineering, Mechanical Engineering"
                ),
                "sourceReference": "VCTM Academic Intake Directory (vctm.in)",
                "suggestedFollowUps": [
                    "What courses are offered?",
                    "What is the B.Tech eligibility?",
                    "How can I contact the college?",
                ],
            }

        entity = entities.get("entity") or entities.get("course")
        attributes = list(entities.get("attributes", []))

        # Explicit attribute triggers from query text to guard against classifier ambiguity
        if re.search(r"\b(who\s+are\s+the\s+hods?|list\s+(all\s+)?hods?|all\s+department\s+hods?|departments?\s+and\s+their\s+hods?|hod\s+details(\s+of\s+all\s+departments?)?|all\s+hods?|list\s+of\s+hods?|department\s+heads?\s+list|show\s+all\s+hods?)\b", q_lower):
            predicted_intent = "departments"
            entity = "VCTM"
            attributes = ["all_hods"]
        elif re.search(r"\b(total\s+(intake|seats?|capacity)|overall\s+(intake|seats?)|how\s+many\s+total\s+seats)\b", q_lower):
            predicted_intent = "course_details"
            entity = "B.Tech"
            attributes = ["total_intake"]
        elif re.search(r"\b(scholarship|scholarships|samaj\s+kalyan)\b", q_lower) and any(w in q_lower for w in ["eligib", "criteria", "qualif", "who can", "can i", "requirement", "qualify", "apply"]):
            predicted_intent = "scholarships"
            entity = "Scholarship"
            attributes = ["scholarship_eligibility"]
        elif re.search(r"\bhostel\b", q_lower) and re.search(r"\b(fee|fees|cost|charges?|rent|pay|price|how\s+much)\b", q_lower):
            predicted_intent = "hostel_mess"
            if re.search(r"\b(boy|boys|male)\b", q_lower):
                entity = "Boys Hostel"
                attributes = ["boys_hostel_fee"]
            elif re.search(r"\b(girl|girls|female)\b", q_lower):
                entity = "Girls Hostel"
                attributes = ["girls_hostel_fee"]
            else:
                entity = "VCTM Hostel"
                attributes = ["hostel_fee"]
        elif re.search(r"\b(highest\s+package|highest\s+salary|max(imum)?\s+package|top\s+package)\b", q_lower):
            predicted_intent = "placements"
            entity = "VCTM Placement Cell"
            attributes = ["highest_package"]
        elif re.search(r"\b(average\s+package|average\s+salary|avg\s+package|mean\s+salary)\b", q_lower):
            predicted_intent = "placements"
            entity = "VCTM Placement Cell"
            attributes = ["average_package"]
        elif re.search(r"\b(placement\s+(rate|percentage)|how\s+many\s+percent\s+placed)\b", q_lower):
            predicted_intent = "placements"
            entity = "VCTM Placement Cell"
            attributes = ["placement_rate"]
        elif re.search(r"\b(students?\s+placed|how\s+many\s+students\s+got\s+placed|placed\s+students)\b", q_lower):
            predicted_intent = "placements"
            entity = "VCTM Placement Cell"
            attributes = ["students_placed"]

        # 1. Dedicated Conversation Intents
        if predicted_intent == "greeting" or re.search(r"^(hi|hello|hey|namaste|good\s+morning|good\s+afternoon|good\s+evening)\b", q_lower):
            record = self.find_exact_record("greeting")
            return {
                "text": record["answer"] if record else "Hello! Welcome to Vivekananda College of Technology & Management (VCTM, Aligarh · AKTU Code: 340, BTE Code: 1628). How can I help you today?",
                "sourceReference": "VCTM Official Helpdesk (vctm.in)",
                "suggestedFollowUps": ["What courses are offered?", "What is the intake for B.Tech CSE?", "How are the placements?"]
            }

        if predicted_intent == "thanks" or re.fullmatch(
            r"(?:thank\s+you|thanks(?:\s+a\s+lot)?|thankyou|ok|okay|got\s+it|understood|alright)[!. ]*",
            q_lower,
        ):
            record = self.find_exact_record("thanks")
            return {
                "text": record["answer"] if record else "You're welcome! Feel free to ask if you have any more questions about VCTM.",
                "sourceReference": "VCTM Official Helpdesk (vctm.in)",
                "suggestedFollowUps": ["What courses are offered?", "How can I contact the college?"]
            }

        if predicted_intent == "goodbye" or re.search(r"\b(bye|goodbye|see\s+you|exit)\b", q_lower):
            record = self.find_exact_record("goodbye")
            return {
                "text": record["answer"] if record else "Goodbye! Wishing you all the best with your studies and admission journey.",
                "sourceReference": "VCTM Official Helpdesk (vctm.in)"
            }

        if predicted_intent == "fallback":
            return {
                "text": "This specific information is not available in the verified VCTM dataset. For official assistance, please contact the VCTM Helpdesk at +91 94540 10846 or info@vctm.in.",
                "sourceReference": "Official VCTM Helpdesk (https://vctm.in)",
                "cardType": "fallback_card"
            }

        # 2. Multi-Attribute Handling: Answer only the requested items
        if len(attributes) > 1 and entity:
            answers_collected = []
            for attr in attributes:
                rec = self.find_exact_record(predicted_intent, entity, attr)
                if not rec:
                    rec = self.find_exact_record(predicted_intent, "VCTM", attr)
                if rec:
                    label = attr.replace("_", " ").title()
                    answers_collected.append(f"• **{label}:** {rec['answer']}")

            if answers_collected:
                header = f"Details for **{entity}**:\n" if entity != "VCTM" else "VCTM Details:\n"
                return {
                    "text": header + "\n".join(answers_collected),
                    "sourceReference": "Official VCTM Portal (https://vctm.in)"
                }

        # 3. Single Specific Attribute Handling
        if len(attributes) == 1:
            attr = attributes[0]
            rec = self.find_exact_record(predicted_intent, entity, attr)
            if not rec and entity:
                rec = self.find_exact_record(predicted_intent, "VCTM", attr)
            if not rec:
                rec = self.find_exact_record(predicted_intent, None, attr)

            if rec:
                return {
                    "text": rec["answer"],
                    "sourceReference": f"Official VCTM Portal ({rec.get('source_url', 'https://vctm.in')})"
                }

        # 4. Entity-specific overview (if a course was specified without a specific sub-attribute)
        if entity and entity != "VCTM" and entity in ["B.Tech CSE", "B.Tech IT", "B.Tech Mechanical", "B.Tech Civil", "B.Tech ECE", "B.Tech Electrical", "B.Tech Agricultural", "MBA", "MCA", "M.Tech Production", "M.Tech Structural", "Polytechnic Diploma"]:
            # Find intake, duration, eligibility
            intake_rec = self.find_exact_record("course_details", entity, "intake")
            dur_rec = self.find_exact_record("course_details", entity, "duration")
            elig_rec = self.find_exact_record("eligibility_criteria", entity, "eligibility") or self.find_exact_record("eligibility_criteria", "B.Tech", "eligibility")

            resp_lines = [f"**{entity} at VCTM:**"]
            if dur_rec:
                resp_lines.append(f"• **Duration:** {dur_rec['answer']}")
            if intake_rec:
                resp_lines.append(f"• **Approved Intake:** {intake_rec['answer']}")
            if elig_rec:
                resp_lines.append(f"• **Eligibility:** {elig_rec['answer']}")

            return {
                "text": "\n".join(resp_lines),
                "sourceReference": "Official VCTM Course Directory (https://vctm.in/courses)"
            }

        # 5. Intent-level default matching
        matched_rec = None
        for record in self.qa_records:
            if record["intent"] == predicted_intent:
                # Prioritize matching query text similarity or keywords
                if any(w in q_lower for w in record["question"].lower().split() if len(w) > 3):
                    matched_rec = record
                    break
        if not matched_rec:
            for record in self.qa_records:
                if record["intent"] == predicted_intent:
                    matched_rec = record
                    break

        if matched_rec:
            return {
                "text": matched_rec["answer"],
                "sourceReference": f"Official VCTM Portal ({matched_rec.get('source_url', 'https://vctm.in')})"
            }

        # 6. Fallback if information is not available in verified dataset
        return {
            "text": "This specific information is not available in the verified VCTM dataset. For official verified records, please contact the VCTM Helpdesk at +91 94540 10846 or info@vctm.in.",
            "sourceReference": "Official VCTM Helpdesk (https://vctm.in)",
            "cardType": "fallback_card"
        }

knowledge_retriever = KnowledgeRetriever()
