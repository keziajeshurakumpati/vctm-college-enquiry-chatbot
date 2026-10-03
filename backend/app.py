"""
app.py - Production FastAPI Backend for VCTM College Enquiry Chatbot

Integrates:
- Scikit-Learn Logistic Regression Intent Classifier
- TF-IDF N-Gram Vectorizer
- Programme & Entity Extractor
- Official VCTM Knowledge Base Retriever
- Website Data Update & Retraining Endpoints
- CORS & Comprehensive Error Handling
"""

import logging
import os
import re
import sys
import time
from typing import Dict, List, Optional
import requests
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

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

app = FastAPI(
    title="VCTM College Enquiry Chatbot API",
    description="Official NLP + TF-IDF + Logistic Regression backend for Vivekananda College of Technology & Management (Aligarh)",
    version="1.0.0"
)

# CORS Middleware allowing seamless communication with frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request / Response Schemas
class ChatQueryRequest(BaseModel):
    query: str = Field(..., min_length=1, description="Student enquiry text")
    activeCourseContext: Optional[str] = Field(None, description="Active course from previous turn")
    sessionId: Optional[str] = Field(None, description="Session identifier")

class PredictRequest(BaseModel):
    query: str = Field(..., min_length=1)
    contextCourse: Optional[str] = None

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global error on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred while processing the enquiry.", "error": str(exc)}
    )

@app.get("/api/health")
def health_check():
    """Health check endpoint indicating model readiness and service status."""
    return {
        "status": "healthy",
        "service": "VCTM College Enquiry API",
        "model_loaded": classifier.is_loaded,
        "model_type": "LogisticRegression",
        "intent_classes_count": len(classifier.classes),
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }

def is_vctm_related_query(query: str) -> bool:
    """Identifies questions within the college enquiry assistant's scope."""
    return bool(re.search(
        r"\b(vctm|colleges?|campuses?|institutions?|institutes?|admissions?|courses?|"
        r"programs?|programmes?|fees?|tuition|scholarships?|eligibility|hostels?|"
        r"placements?|tpo|faculty|faculties|hod|departments?|libraries|transport(?:ation)?|buses?|"
        r"aktu|bte|attendance|exams?|examinations?|cutoff|cut\s+off|engineering|"
        r"b\.?\s?tech|mba|mca|m\.?\s?tech|diplomas?|facilit(?:y|ies)|mess)\b",
        query,
        re.IGNORECASE,
    ))

def generate_groq_fallback(query: str) -> Optional[str]:
    """Answers unsupported or uncertain VCTM queries using verified context only."""
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        logger.warning("Groq fallback requested, but GROQ_API_KEY is not configured.")
        return None

    query_terms = {
        term for term in re.findall(r"\b[a-z0-9]+\b", query.lower())
        if len(term) > 2 and term not in {
            "about", "are", "can", "does", "for", "how", "the", "this",
            "what", "when", "where", "which", "who", "why", "with"
        }
    }
    relevant_records = []
    for record in knowledge_retriever.qa_records:
        if record.get("verification_status") not in {"verified", "officially_unavailable"}:
            continue
        record_text = " ".join(
            str(record.get(field, ""))
            for field in ("question", "entity", "attribute", "answer")
        )
        overlap = len(query_terms & set(re.findall(r"\b[a-z0-9]+\b", record_text.lower())))
        if overlap:
            relevant_records.append((overlap, record))
    relevant_records.sort(key=lambda item: item[0], reverse=True)
    context = "\n".join(
        f"Q: {record['question']}\nVerified answer: {record['answer']}"
        for _, record in relevant_records[:5]
    ) or "No directly relevant verified VCTM knowledge-base records were found."

    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are strictly a VCTM College Enquiry Assistant, not a general-purpose "
                    "assistant. Answer only VCTM/college-related questions, using only the supplied "
                    "verified VCTM knowledge-base context. If it does not contain the answer, say "
                    "the information is not available in the verified information. Never invent "
                    "college facts. Refuse general-knowledge requests (including programming, "
                    "science, weather, jokes, and current events), even if VCTM is mentioned incidentally."
                ),
            },
            {
                "role": "user",
                "content": f"Verified VCTM knowledge-base context:\n{context}\n\nQuestion: {query}",
            },
        ],
        "temperature": 0.2,
        "max_tokens": 350,
    }
    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {api_key}"},
            json=payload,
            timeout=20,
        )
        response.raise_for_status()
        answer = response.json()["choices"][0]["message"]["content"]
        if isinstance(answer, str) and answer.strip():
            return answer.strip()
        logger.warning("Groq fallback returned an empty answer.")
    except (requests.RequestException, KeyError, IndexError, TypeError, ValueError) as exc:
        logger.warning("Groq fallback failed: %s", exc)
    return None

@app.post("/api/predict")
def predict_intent(req: PredictRequest):
    """
    Direct ML prediction endpoint: runs text preprocessing, TF-IDF vectorization,
    and Logistic Regression classification.
    """
    try:
        classification = classifier.predict(req.query)
        entities = entity_extractor.extract(req.query, req.contextCourse)
        classification["extractedEntities"] = entities
        return classification
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
def process_chat_message(req: ChatQueryRequest):
    """
    Primary chatbot endpoint:
    Website Data -> Text Preprocessing -> TF-IDF -> Logistic Regression -> Entity Extraction -> Knowledge Retrieval -> Formatted Response
    """
    query = req.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
        
    try:
        # 1. Classify intent using Logistic Regression
        classification = classifier.predict(query)
        
        # 2. Extract specific programme/entity (e.g. B.Tech CSE vs MBA)
        entities = entity_extractor.extract(query, req.activeCourseContext)
        normalized_query = query.lower().strip()
        if re.fullmatch(
            r"(?:the\s+)?(?:tpo(?:\s+officer)?|training\s+and\s+placement\s+officer)",
            normalized_query,
        ):
            classification["predictedIntent"] = "departments"
            entities["entity"] = "Training & Placement"
            entities["attributes"] = ["tpo_name"]
        elif re.fullmatch(r"(?:ok\s+)?placements?\s+details[?.!]*", normalized_query):
            classification["predictedIntent"] = "placements"
            entities["entity"] = "VCTM Placement Cell"
            entities["attributes"] = ["overview"]
        classification["extractedEntities"] = entities
        
        predicted_intent = classification["predictedIntent"]
        
        # 3. Retrieve verified response from official VCTM knowledge base
        bot_response = knowledge_retriever.retrieve_response(query, predicted_intent, entities)

        simple_conversation = bool(re.fullmatch(
            r"(?:hi|hello|hey|namaste|good\s+morning|good\s+afternoon|good\s+evening|"
            r"thank\s+you|thanks(?:\s+a\s+lot)?|thankyou|ok|okay|got\s+it|understood|"
            r"alright|bye|goodbye|see\s+you|exit)[!. ]*",
            query.lower().strip(),
        ))
        if not is_vctm_related_query(query) and not simple_conversation:
            bot_response = {
                "text": (
                    "I'm the VCTM College Enquiry Assistant. I can help with VCTM courses, "
                    "admissions, fees, eligibility, scholarships, facilities, placements, "
                    "and other college-related questions."
                ),
                "sourceReference": "VCTM College Enquiry Assistant",
            }
        elif is_vctm_related_query(query) and (
            bot_response.get("cardType") == "fallback_card"
            or predicted_intent == "fallback"
        ):
            groq_answer = generate_groq_fallback(query)
            if groq_answer:
                bot_response["text"] = groq_answer
                bot_response["sourceReference"] = "AI-generated response"
                bot_response.pop("cardType", None)
                bot_response.pop("cardData", None)

        # 4. Construct complete response payload
        bot_timestamp = time.strftime("%I:%M %p")
        
        return {
            "id": f"bot-{int(time.time() * 1000)}",
            "sender": "bot",
            "text": bot_response["text"],
            "timestamp": bot_timestamp,
            "classification": classification,
            "cardType": bot_response.get("cardType"),
            "cardData": bot_response.get("cardData"),
            "suggestedFollowUps": bot_response.get("suggestedFollowUps", []),
            "sourceReference": bot_response.get("sourceReference", "Official VCTM Portal (https://vctm.in)")
        }
    except Exception as e:
        logger.error(f"Chat processing failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to process enquiry: {str(e)}")

@app.post("/api/data/refresh")
def refresh_website_data():
    """
    Collects fresh data from the official VCTM website (https://vctm.in),
    cleans it, and updates the searchable knowledge base.
    """
    try:
        logger.info("Triggered website data refresh...")
        crawl_result = crawl_vctm_website(force_live=True)
        kb_items = build_clean_knowledge_base()
        knowledge_retriever.load_knowledge_base()
        
        return {
            "status": "success",
            "message": "VCTM official website data refreshed and knowledge base updated.",
            "pages_crawled": len(crawl_result.get("pages", [])),
            "knowledge_chunks": len(kb_items),
            "updated_at": crawl_result.get("scraped_at")
        }
    except Exception as e:
        logger.error(f"Website data refresh failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/retrain")
def retrain_model():
    """
    Re-generates the training dataset and retrains the Logistic Regression model,
    saving the new model artifacts and evaluation metrics.
    """
    try:
        logger.info("Triggered model retraining...")
        dataset = generate_training_dataset()
        metrics = classifier.train()
        
        return {
            "status": "success",
            "message": "Logistic Regression model successfully retrained.",
            "accuracy": metrics.get("accuracy"),
            "total_samples": metrics.get("total_samples"),
            "vocab_size": metrics.get("vocab_size"),
            "trained_at": metrics.get("trained_at")
        }
    except Exception as e:
        logger.error(f"Model retraining failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/model/info")
def get_model_info():
    """Returns architecture, training parameters, accuracy, and evaluation metrics."""
    return classifier.metrics or {
        "model_type": "LogisticRegression",
        "status": "ready",
        "classes": classifier.classes
    }

@app.get("/api/knowledge-base")
def get_knowledge_base():
    """Returns the indexed knowledge base items with official source URLs."""
    return {
        "total_items": len(knowledge_retriever.kb_items),
        "items": knowledge_retriever.kb_items
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    uvicorn.run("app:app", host=host, port=port, reload=True)
