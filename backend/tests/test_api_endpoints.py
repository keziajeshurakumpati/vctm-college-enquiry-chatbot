import os
import sys
import unittest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import app

client = TestClient(app)

class TestAPIEndpoints(unittest.TestCase):
    def test_health(self):
        res = client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "healthy")
        self.assertEqual(data["model_type"], "LogisticRegression")
        self.assertTrue(data["model_loaded"])

    def test_predict_endpoint(self):
        res = client.post("/api/predict", json={"query": "btech fees"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("predictedIntent", data)
        self.assertEqual(data["predictedIntent"], "fees_structure")
        self.assertIn("probabilities", data)
        self.assertIn("confidence", data)

    def test_chat_endpoint_specific_course(self):
        # Specific B.Tech CSE query must return B.Tech CSE fee, not MBA or BCA
        res = client.post("/api/chat", json={"query": "What is the B.Tech CSE fee?"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["sender"], "bot")
        self.assertIn("55,000", data["text"])
        self.assertIn("B.Tech", data["text"])
        self.assertIn("sourceReference", data)

    def test_chat_endpoint_unsupported_course(self):
        # Course not offered at VCTM
        res = client.post("/api/chat", json={"query": "What is the fee for MBBS?"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("not offered at VCTM", data["text"])

    def test_chat_endpoint_placement_cell_details(self):
        res = client.post("/api/chat", json={"query": "details of placement cell"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["classification"]["predictedIntent"], "placements")
        self.assertIn("Dedicated Career Resource Center", data["text"])

    def test_model_info(self):
        res = client.get("/api/model/info")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data.get("model_type"), "LogisticRegression")

if __name__ == "__main__":
    unittest.main()
