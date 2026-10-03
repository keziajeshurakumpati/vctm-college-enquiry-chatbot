"""
Comprehensive Automated Test Suite for VCTM College Enquiry Chatbot.
Tests strict attribute-only answering, non-substitution, scholarship eligibility,
hostel attributes, HOD queries, natural sentence variations, and multi-attribute queries.
"""

import os
import sys
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from nlp_pipeline import classifier
from entity_extractor import entity_extractor
from knowledge_retriever import knowledge_retriever

class TestAccuracyAudit(unittest.TestCase):
    def run_query(self, query: str):
        pred = classifier.predict(query)
        entities = entity_extractor.extract(query)
        res = knowledge_retriever.retrieve_response(query, pred["predictedIntent"], entities)
        return pred, entities, res

    def test_scholarship_eligibility(self):
        scholarship_queries = [
            "eligibility for scholarship?",
            "scholarship eligibility",
            "who is eligible for scholarship?",
            "what are the eligibility criteria for scholarship?",
            "who can get the scholarship?",
            "what do I need to qualify for scholarship?",
            "can I apply for scholarship?",
            "what are the requirements to get scholarship?",
            "to get scholarship what is the eligibility criteria?",
        ]
        for q in scholarship_queries:
            pred, ent, res = self.run_query(q)
            ans = res["text"].lower()
            # Must NOT return B.Tech admission eligibility
            self.assertNotIn("10+2", ans, f"Scholarship query '{q}' returned B.Tech 10+2 eligibility!")
            self.assertNotIn("pcm", ans, f"Scholarship query '{q}' returned PCM requirement!")
            # Must mention scholarship criteria (UP Post-Matric / domicile / income)
            self.assertTrue(
                "scholarship" in ans or "post-matric" in ans or "domicile" in ans or "income" in ans or "up" in ans,
                f"Scholarship query '{q}' did not return scholarship criteria!"
            )

    def test_btech_admission_eligibility(self):
        btech_queries = [
            "What is the eligibility for B.Tech?",
            "Who is eligible for B.Tech admission?",
            "B.Tech eligibility criteria",
            "What qualification is required for B.Tech?",
        ]
        for q in btech_queries:
            pred, ent, res = self.run_query(q)
            ans = res["text"].lower()
            # Must NOT return scholarship
            self.assertNotIn("scholarship", ans, f"B.Tech query '{q}' returned scholarship!")
            # Must return B.Tech eligibility
            self.assertTrue("10+2" in ans or "physics" in ans or "mathematics" in ans)

    def test_hostel_attributes_separation(self):
        # 1. Hostel fee
        fee_queries = [
            "What is the hostel fee?",
            "hostel fees?",
            "How much does hostel accommodation cost?",
        ]
        for q in fee_queries:
            pred, ent, res = self.run_query(q)
            ans = res["text"]
            # Must NOT return B.Tech tuition fee
            self.assertNotIn("55,000", ans, f"Hostel fee query '{q}' returned B.Tech fee!")
            self.assertIn("officially published", ans.lower())

        # 2. Boys hostel fee
        pred_b, ent_b, res_b = self.run_query("what is hostel fee for boys?")
        self.assertNotIn("55,000", res_b["text"])
        self.assertIn("boys hostel fees are not officially published", res_b["text"].lower())

        # 3. Girls hostel fee
        pred_g, ent_g, res_g = self.run_query("what is hostel fee for girls?")
        self.assertNotIn("55,000", res_g["text"])
        self.assertIn("girls hostel fees are not officially published", res_g["text"].lower())

        # 4. Hostel facilities
        pred_f, ent_f, res_f = self.run_query("hostel facilities")
        self.assertNotIn("55,000", res_f["text"])
        self.assertTrue("separate hostels" in res_f["text"].lower() or "sports" in res_f["text"].lower())

    def test_placement_strict_attributes(self):
        # Highest package
        for q in ["What is the highest package?", "highest package?"]:
            pred, ent, res = self.run_query(q)
            ans = res["text"].lower()
            self.assertIn("highest", ans)
            self.assertIn("not officially published", ans)
            # Must NOT return recruiters or placement assistance
            self.assertNotIn("wipro", ans)
            self.assertNotIn("ibm", ans)

        # Average package
        pred_a, ent_a, res_a = self.run_query("What is the average package?")
        ans_a = res_a["text"].lower()
        self.assertIn("average", ans_a)
        self.assertIn("not officially published", ans_a)
        self.assertNotIn("highest package", ans_a)

    def test_hod_queries(self):
        # Specific CSE HOD
        for q in ["Who is the HOD of CSE?", "Who heads the CSE department?"]:
            pred, ent, res = self.run_query(q)
            ans = res["text"]
            self.assertIn("Dr. Mohammad Haris", ans)
            # Must NOT include other HODs or Proctor
            self.assertNotIn("Sahil Abbas", ans)
            self.assertNotIn("Proctor", ans)

        # Mechanical HOD
        pred_m, ent_m, res_m = self.run_query("Who is the HOD of Mechanical Engineering?")
        self.assertIn("Mr. Umardaraj Khan", res_m["text"])

        # Civil HOD
        pred_c, ent_c, res_c = self.run_query("Who is the HOD of Civil Engineering?")
        self.assertIn("Mr. Sahil Abbas Zaidi", res_c["text"])

        # Polytechnic CS HOD
        pred_p, ent_p, res_p = self.run_query("Who is the HOD of Polytechnic CS?")
        self.assertIn("Mr. Yash Tripathi", res_p["text"])

        # All HODs
        for q in ["Who are the HODs?", "List all HODs.", "Give me all department HODs."]:
            pred, ent, res = self.run_query(q)
            ans = res["text"]
            self.assertIn("Dr. Mohammad Haris", ans)
            self.assertIn("Mr. Umardaraj Khan", ans)
            self.assertIn("Mr. Sahil Abbas Zaidi", ans)
            self.assertIn("Mr. Yash Tripathi", ans)
            # Must NOT include Proctor or TPO unless asked
            self.assertNotIn("Proctor", ans)

    def test_multi_attribute_questions(self):
        # Intake and duration
        pred, ent, res = self.run_query("What is the B.Tech CSE intake and duration?")
        ans = res["text"]
        self.assertIn("60", ans)
        self.assertIn("4 Years", ans)
        # Should not include fees or placements
        self.assertNotIn("55,000", ans)
        self.assertNotIn("recruiter", ans.lower())

    def test_college_codes_and_no_357(self):
        pred_aktu, ent_aktu, res_aktu = self.run_query("What is the AKTU college code?")
        self.assertIn("340", res_aktu["text"])
        self.assertNotIn("357", res_aktu["text"])

        pred_bte, ent_bte, res_bte = self.run_query("What is the BTE college code?")
        self.assertIn("1628", res_bte["text"])

    def test_transport_separation(self):
        pred_r, ent_r, res_r = self.run_query("bus routes")
        self.assertIn("Route 1", res_r["text"])

        pred_f, ent_f, res_f = self.run_query("transportation facilities")
        self.assertIn("fleet", res_f["text"].lower())
        self.assertNotIn("Route 1", res_f["text"])

    def test_conversational_acknowledgements(self):
        for q in ["OK", "okay", "thanks", "thank you", "bye", "goodbye"]:
            pred, ent, res = self.run_query(q)
            ans = res["text"].lower()
            self.assertTrue(
                "welcome" in ans or "goodbye" in ans or "hello" in ans or "assist" in ans or "feel free" in ans,
                f"Conversational query '{q}' did not return conversational response!"
            )
            # Should NOT return the entire 12-course catalogue
            self.assertNotIn("agricultural engg", ans)

    def test_branch_intake_vs_total_intake(self):
        # Branch intake only
        pred_cse, ent_cse, res_cse = self.run_query("What is B.Tech CSE intake?")
        self.assertIn("60 seats", res_cse["text"])
        self.assertNotIn("360 seats", res_cse["text"])

        # Total intake
        pred_tot, ent_tot, res_tot = self.run_query("What is the total intake for B.Tech?")
        self.assertIn("360 seats", res_tot["text"])

    def test_courses_and_hod_queries(self):
        # HOD details broad query
        pred_hod, ent_hod, res_hod = self.run_query("HOD details")
        self.assertIn("Dr. Mohammad Haris", res_hod["text"])
        self.assertIn("Mr. Umardaraj Khan", res_hod["text"])

        # Courses offered
        pred_c, ent_c, res_c = self.run_query("What courses are offered?")
        self.assertIn("B.Tech", res_c["text"])
        self.assertIn("MBA", res_c["text"])
        self.assertIn("Polytechnic", res_c["text"])

if __name__ == "__main__":
    unittest.main()

