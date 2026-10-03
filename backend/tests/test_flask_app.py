import os
import sys
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from flask_app import app

class TestFlaskApp(unittest.TestCase):
    def setUp(self):
        app.config["TESTING"] = True
        self.client = app.test_client()

    def test_flask_health(self):
        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["status"], "healthy")
        self.assertEqual(data["model_type"], "LogisticRegression")

    def test_flask_predict(self):
        res = self.client.post("/api/predict", json={"query": "What are the btech fees?"})
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn("predictedIntent", data)
        self.assertEqual(data["predictedIntent"], "fees_structure")

    def test_flask_chat_specific_entity(self):
        res = self.client.post("/api/chat", json={"query": "What is the B.Tech CSE fee?"})
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["sender"], "bot")
        self.assertIn("55,000", data["text"])
        self.assertIn("B.Tech", data["text"])

    def test_flask_model_info(self):
        res = self.client.get("/api/model/info")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data.get("model_type"), "LogisticRegression")

if __name__ == "__main__":
    unittest.main()

