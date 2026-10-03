# VCTM College Enquiry Chatbot - Official NLP + Logistic Regression Backend

A production-grade machine learning backend for **Vivekananda College of Technology & Management (VCTM), Aligarh** (AKTU College Code: **340**, BTE UP Code: **1628**).

The system uses **TF-IDF N-Gram Vectorization** paired strictly with a **Multinomial Logistic Regression Classifier** to classify student enquiries, alongside a programme/entity extraction engine and a searchable knowledge retrieval system grounded exclusively in official college website data (`https://vctm.in`).

Both **FastAPI** (`app.py`) and **Flask** (`flask_app.py`) implementations are included.

---

## 🏛️ Architecture & Pipeline Flow

```
User Query (Frontend)
         │
         ▼
[Text Preprocessing] ──► Normalization, abbreviation preservation ('cse', 'it', 'me', 'mba', 'hod')
         │
         ▼
[TF-IDF Vectorizer]  ──► Sublinear TF scaling, unigram + bigram n-grams (1, 2)
         │
         ▼
[Logistic Regression]──► L-BFGS solver, multi-class probabilities, confidence score
         │
         ▼
[Entity Extractor]   ──► Specific programme detection (B.Tech CSE vs Mechanical vs MBA vs Diploma)
         │
         ▼
[Knowledge Retrieval]──► Filtered lookup against clean official VCTM data with source URLs
         │
         ▼
[Structured Response]──► Verified text + UI cards (fees, eligibility, hostel, placements, etc.)
```

---

## 🚀 Key Features

- **Strict ML Classifier:** Uses pure **Logistic Regression** (via Scikit-Learn) with no neural networks, transformers, or external LLMs.
- **Official Grounding:** Collects, cleans, and structures data from `https://vctm.in/`.
- **Entity & Programme Isolation:** Distinguishes queries like *"What is the B.Tech CSE fee?"* to return specifically CSE information without spilling unrelated MBA/Polytechnic fees.
- **Automated Dataset Generation:** Builds 370+ labeled training examples across 16 intent classes from verified website content.
- **Model Persistence & Retraining:** Automatically persists fitted artifacts (`models/logistic_regression_model.pkl`, `models/tfidf_vectorizer.pkl`) and supports zero-downtime retraining via `/api/retrain`.
- **Live / Snapshot Crawler:** Scrapes official pages with fallback to the verified snapshot if website network requests are restricted.
- **Dual Framework Support:** Complete implementations for both **FastAPI** and **Flask** with CORS, Swagger docs, health checks, and error handling.

---

## 📂 Project Structure

```
backend/
├── app.py                     # FastAPI application endpoints & lifecycle
├── flask_app.py               # Flask application endpoints
├── crawler.py                 # Official VCTM website crawler (https://vctm.in)
├── data_cleaner.py            # Cleans raw pages into structured knowledge chunks
├── dataset_builder.py         # Automatically generates labeled intent dataset
├── nlp_pipeline.py            # Text preprocessing, TF-IDF, Logistic Regression trainer
├── entity_extractor.py        # Programme (B.Tech CSE, MBA, MCA, etc.) and entity detector
├── knowledge_retriever.py     # Searchable knowledge retrieval & card generator
├── train_model.py             # Model training & evaluation script
├── requirements.txt           # Python dependencies
├── .env.example               # Environment variables template
├── data/
│   ├── raw_pages.json         # Scraped official website pages with source URLs
│   ├── clean_knowledge_base.json # Structured searchable knowledge items
│   └── training_dataset.json  # Auto-generated labeled intent dataset
├── models/
│   ├── logistic_regression_model.pkl # Trained Logistic Regression weights
│   ├── tfidf_vectorizer.pkl          # Fitted TF-IDF vectorizer
│   ├── intent_classes.json           # 16 intent classes list
│   └── model_metrics.json            # Model evaluation metrics & accuracy
└── tests/
    ├── test_nlp_pipeline.py          # TF-IDF & Logistic Regression tests
    ├── test_entity_extractor.py      # Programme isolation & context tests
    ├── test_api_endpoints.py         # FastAPI endpoint integration tests
    └── test_flask_app.py             # Flask endpoint integration tests
```

---

## 🔧 Installation & Setup

### Prerequisites
- Python 3.10+
- pip

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Train the Model
```bash
python train_model.py
```

### 3. Run the Backend Server

**Option A: FastAPI (Default)**
```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```
Interactive API docs available at: `http://localhost:8000/docs`

**Option B: Flask**
```bash
python flask_app.py
```

---

## 📡 API Reference

### 1. Process Chat Message
- **Endpoint:** `POST /api/chat`
- **Request Body:**
```json
{
  "query": "What is the B.Tech CSE fee?",
  "activeCourseContext": null
}
```
- **Response:**
```json
{
  "id": "bot-1727250000000",
  "sender": "bot",
  "text": "The annual tuition fee for B.Tech in Computer Science & Engineering...",
  "timestamp": "01:52 PM",
  "classification": {
    "predictedIntent": "fees_structure",
    "confidence": 0.672,
    "extractedEntities": {
      "course": "B.Tech CSE"
    }
  },
  "cardType": "fee_table",
  "suggestedFollowUps": ["What is the eligibility for B.Tech CSE?", "What scholarships are available?"],
  "sourceReference": "VCTM Official Fee Schedule (https://vctm.in/courses/btech)"
}
```

### 2. Predict Intent (Raw ML)
- **Endpoint:** `POST /api/predict`
- **Request Body:** `{"query": "Who is the HOD of CS?"}`

### 3. Retrain Model
- **Endpoint:** `POST /api/retrain`
- Retrains the Logistic Regression model and outputs refreshed accuracy and metrics.

### 4. Refresh Website Data
- **Endpoint:** `POST /api/data/refresh`
- Fetches latest content from `https://vctm.in/` and rebuilds the knowledge base.

### 5. Health Check
- **Endpoint:** `GET /api/health`

### 6. Model Info
- **Endpoint:** `GET /api/model/info`
- Returns model architecture (Logistic Regression), solver (L-BFGS), vocabulary size, intent classes, confusion matrix, metrics.

### 7. Knowledge Base
- **Endpoint:** `GET /api/knowledge-base`
- Returns all indexed items from the official VCTM website with source URLs.

---

## 🧪 Running Tests

Execute the automated test suite with pytest:
```bash
pytest tests/ -v
```
All tests cover data preprocessing, TF-IDF vectorization, Logistic Regression predictions, entity extraction, and API endpoints for both FastAPI and Flask.
