import os
import sys
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from entity_extractor import entity_extractor

class TestEntityExtractor(unittest.TestCase):
    def test_specific_program_detection(self):
        # B.Tech CSE query must specifically detect B.Tech CSE
        e1 = entity_extractor.extract("What is the B.Tech CSE fee?")
        self.assertEqual(e1["course"], "B.Tech CSE")

        # Mechanical
        e2 = entity_extractor.extract("Tell me about mechanical engineering branch")
        self.assertEqual(e2["course"], "B.Tech Mechanical")

        # MBA
        e3 = entity_extractor.extract("What are the fees for MBA?")
        self.assertEqual(e3["course"], "MBA")

        # Polytechnic
        e4 = entity_extractor.extract("Tell me about polytechnic diploma in civil")
        self.assertEqual(e4["course"], "Polytechnic Civil")

    def test_context_retention(self):
        # If no course is mentioned, it should inherit context course
        e = entity_extractor.extract("What are the fees?", context_course="B.Tech CSE")
        self.assertEqual(e["course"], "B.Tech CSE")

    def test_category_detection(self):
        e_sc = entity_extractor.extract("scholarship for SC category student")
        self.assertEqual(e_sc["category"], "SC/ST")

        e_obc = entity_extractor.extract("eligibility criteria for OBC candidates")
        self.assertEqual(e_obc["category"], "OBC")

if __name__ == "__main__":
    unittest.main()

