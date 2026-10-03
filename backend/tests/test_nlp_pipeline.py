import os
import sys
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from nlp_pipeline import classifier, preprocess_text

class TestNLPPipeline(unittest.TestCase):
    def test_preprocessing(self):
        clean = preprocess_text("What is the B.Tech CSE fee?!")
        self.assertIn("btech", clean)
        self.assertIn("cse", clean)
        self.assertIn("fee", clean)
        self.assertNotIn("?", clean)

    def test_model_loaded(self):
        self.assertTrue(classifier.is_loaded)
        self.assertIsNotNone(classifier.model)
        self.assertIsNotNone(classifier.vectorizer)
        self.assertGreater(len(classifier.classes), 0)

    def test_intent_classification(self):
        # Fees structure
        res_fee = classifier.predict("btech fees")
        self.assertEqual(res_fee["predictedIntent"], "fees_structure")
        self.assertGreater(res_fee["confidence"], 0.35)

        # Department HOD
        res_hod = classifier.predict("Who is the HOD of CS?")
        self.assertEqual(res_hod["predictedIntent"], "departments")

        # Hostel
        res_hostel = classifier.predict("What hostel facilities are available?")
        self.assertEqual(res_hostel["predictedIntent"], "hostel_mess")

        # Eligibility
        res_elig = classifier.predict("What is the eligibility for B.Tech?")
        self.assertEqual(res_elig["predictedIntent"], "eligibility_criteria")

        # Unknown / gibberish
        res_unknown = classifier.predict("asdfghjkl zxcvbnm qwertyuiop")
        self.assertIn(res_unknown["predictedIntent"], ["unknown", "fallback"])

if __name__ == "__main__":
    unittest.main()

