import os
import sys
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from entity_extractor import entity_extractor
from knowledge_retriever import knowledge_retriever
from nlp_pipeline import classifier


SAFE_FALLBACK = (
    "This specific information is not available in the verified VCTM dataset. "
    "For official verified records, please contact the VCTM Helpdesk at "
    "+91 94540 10846 or info@vctm.in."
)


class TestKnowledgeRetrieverFallback(unittest.TestCase):
    def retrieve(self, query, intent_override=None):
        classification = classifier.predict(query)
        entities = entity_extractor.extract(query)
        intent = intent_override or classification["predictedIntent"]
        response = knowledge_retriever.retrieve_response(query, intent, entities)
        return classification, entities, intent, response

    def assert_record(self, query, intent, expected_attribute, intent_override=None):
        _, _, selected_intent, response = self.retrieve(query, intent_override)
        records = [
            record
            for record in knowledge_retriever.qa_records
            if record["intent"] == selected_intent
            and record["attribute"] == expected_attribute
            and record["answer"] == response["text"]
        ]
        self.assertTrue(records, f"{query!r} did not retrieve {expected_attribute!r}")

    def test_verified_intent_defaults(self):
        cases = [
            ("courses", "course_details", "all_courses", None),
            ("list courses", "course_details", "all_courses", None),
            ("what programs does VCTM offer?", "course_details", "all_courses", None),
            ("placements", "placements", "overview", None),
            ("what are the placement opportunities?", "placements", "overview", None),
            ("hostel", "hostel_mess", "hostel_facilities", None),
            ("exams", "examinations", "exam_pattern", None),
            ("admissions", "admissions", "admission_process", "admissions"),
            ("fees", "fees_structure", "fee_policy", None),
        ]
        for query, intent, attribute, override in cases:
            with self.subTest(query=query):
                self.assert_record(query, intent, attribute, override)

    def test_specific_queries_keep_their_kb_records(self):
        cases = [
            ("Are courses approved by AICTE?", "course_details", "aicte_approval"),
            (
                "What is the AKTU college code for VCTM?",
                "course_details",
                "aktu_code",
            ),
            ("what is the MBA fee?", "fees_structure", "fee_mba"),
            ("what is the CSE HOD?", "departments", "hod"),
        ]
        for query, intent, attribute in cases:
            with self.subTest(query=query):
                self.assert_record(query, intent, attribute)

    def test_queries_without_safe_overview_use_generic_fallback(self):
        cases = [
            ("what scholarships are available?", "scholarships", None),
            (
                "what facilities are available on campus?",
                "facilities_campus",
                None,
            ),
            ("departments", "departments", "departments"),
            ("contact", "contact_details", None),
        ]
        for query, intent, override in cases:
            with self.subTest(query=query):
                _, _, _, response = self.retrieve(query, override)
                self.assertEqual(response["text"], SAFE_FALLBACK)
                self.assertFalse(
                    any(
                        record["answer"] == response["text"]
                        for record in knowledge_retriever.qa_records
                    )
                )

    def test_specific_mba_fee_and_cse_hod_are_not_replaced_by_defaults(self):
        self.assert_record("what is the MBA fee?", "fees_structure", "fee_mba")
        self.assert_record("what is the CSE HOD?", "departments", "hod")

    def test_fallback_intent_does_not_select_an_arbitrary_record(self):
        response = knowledge_retriever.retrieve_response(
            "admissions", "fallback", {}
        )
        self.assertIn("not available in the verified VCTM dataset", response["text"])
        self.assertFalse(
            any(
                record["answer"] == response["text"]
                for record in knowledge_retriever.qa_records
            )
        )


if __name__ == "__main__":
    unittest.main()
