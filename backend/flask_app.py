"""
flask_app.py - Production Flask Backend for VCTM College Enquiry Chatbot

Integrates:
- Scikit-Learn Logistic Regression Intent Classifier
- TF-IDF N-Gram Vectorizer
- Programme & Entity Extractor (e.g., B.Tech CSE vs Mechanical vs MBA)
- Official VCTM Knowledge Base Retriever (vctm.in)
- Website Data Update & Retraining Endpoints
- Flask-CORS & Structured Error Handling
"""

import logging
import os
import sys
import time
from flask import Flask, jsonify, request
from flask_cors import CORS

# Ensure backend directory is in path
sys.path.insert(0, os.path.dirname(__file__))

from crawler import crawl_vctm_website
from data_cleaner import build_clean_knowledge_base
from dataset_builder import generate_training_dataset
from entity_extractor import entity_extractor
from knowledge_retriever import knowledge_retriever
from nlp_pipeline import classifier

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.errorhandler(Exception)
def handle_exception(e):
    logger.error(f"Global error: {e}", exc_info=True)
    return jsonify({
        "detail": "An internal server error occurred while processing the enquiry.",
        "error": str(e)
    }), 500

@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint indicating model readiness and service status."""
    return jsonify({
        "status": "healthy",
        "service": "VCTM College Enquiry API (Flask)",
        "model_loaded": classifier.is_loaded,
        "model_type": "LogisticRegression",
        "intent_classes_count": len(classifier.classes),
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    })

@app.route("/api/predict", methods=["POST"])
def predict_intent():
    """
    Direct ML prediction endpoint: runs text preprocessing, TF-IDF vectorization,
    and Logistic Regression classification.
    """
    data = request.get_json(force=True, silent=True) or {}
    query = (data.get("query") or "").strip()
    if not query:
        return jsonify({"detail": "Query cannot be empty."}), 400

    context_course = data.get("contextCourse")
    try:
        classification = classifier.predict(query)
        entities = entity_extractor.extract(query, context_course)
        classification["extractedEntities"] = entities
        return jsonify(classification)
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        return jsonify({"detail": str(e)}), 500

@app.route("/api/chat", methods=["POST"])
def process_chat_message():
    """
    Primary chatbot endpoint:
    Website Data -> Text Preprocessing -> TF-IDF -> Logistic Regression -> Entity Extraction -> Knowledge Retrieval -> Formatted Response
    """
    data = request.get_json(force=True, silent=True) or {}
    query = (data.get("query") or "").strip()
    if not query:
        return jsonify({"detail": "Query cannot be empty."}), 400

    active_course_context = data.get("activeCourseContext")

    try:
        # 1. Classify intent using Logistic Regression
        classification = classifier.predict(query)

        # 2. Extract specific programme/entity (e.g. B.Tech CSE vs MBA)
        entities = entity_extractor.extract(query, active_course_context)
        classification["extractedEntities"] = entities

        predicted_intent = classification["predictedIntent"]

        # 3. Retrieve verified response from official VCTM knowledge base
        bot_response = knowledge_retriever.retrieve_response(query, predicted_intent, entities)

        # 4. Construct response payload
        bot_timestamp = time.strftime("%I:%M %p")

        return jsonify({
            "id": f"bot-{int(time.time() * 1000)}",
            "sender": "bot",
            "text": bot_response["text"],
            "timestamp": bot_timestamp,
            "classification": classification,
            "cardType": bot_response.get("cardType"),
            "cardData": bot_response.get("cardData"),
            "suggestedFollowUps": bot_response.get("suggestedFollowUps", []),
            "sourceReference": bot_response.get("sourceReference", "Official VCTM Portal (https://vctm.in)")
        })
    except Exception as e:
        logger.error(f"Chat processing failed: {e}", exc_info=True)
        return jsonify({"detail": f"Failed to process enquiry: {str(e)}"}), 500

@app.route("/api/data/refresh", methods=["POST"])
def refresh_website_data():
    """
    Collects fresh data from the official VCTM website (https://vctm.in),
    cleans it, and updates the searchable knowledge base.
    """
    try:
        logger.info("Triggered website data refresh via Flask...")
        crawl_result = crawl_vctm_website(force_live=True)
        kb_items = build_clean_knowledge_base()
        knowledge_retriever.load_knowledge_base()

        return jsonify({
            "status": "success",
            "message": "VCTM official website data refreshed and knowledge base updated.",
            "pages_crawled": len(crawl_result.get("pages", [])),
            "knowledge_chunks": len(kb_items),
            "updated_at": crawl_result.get("scraped_at")
        })
    except Exception as e:
        logger.error(f"Website data refresh failed: {e}")
        return jsonify({"detail": str(e)}), 500

@app.route("/api/retrain", methods=["POST"])
def retrain_model():
    """
    Re-generates the training dataset and retrains the Logistic Regression model.
    """
    try:
        logger.info("Triggered model retraining via Flask...")
        dataset = generate_training_dataset()
        metrics = classifier.train()

        return jsonify({
            "status": "success",
            "message": "Logistic Regression model successfully retrained.",
            "accuracy": metrics.get("accuracy"),
            "total_samples": metrics.get("total_samples"),
            "vocab_size": metrics.get("vocab_size"),
            "trained_at": metrics.get("trained_at")
        })
    except Exception as e:
        logger.error(f"Model retraining failed: {e}")
        return jsonify({"detail": str(e)}), 500

@app.route("/api/model/info", methods=["GET"])
def get_model_info():
    """Returns architecture, training parameters, accuracy, and evaluation metrics."""
    return jsonify(classifier.metrics or {
        "model_type": "LogisticRegression",
        "status": "ready",
        "classes": classifier.classes
    })

@app.route("/api/knowledge-base", methods=["GET"])
def get_knowledge_base():
    """Returns the indexed knowledge base items with official source URLs."""
    return jsonify({
        "total_items": len(knowledge_retriever.kb_items),
        "items": knowledge_retriever.kb_items
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    app.run(host=host, port=port, debug=False)
