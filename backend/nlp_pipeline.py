"""
nlp_pipeline.py - Core ML Pipeline: TF-IDF Vectorizer + Multinomial Logistic Regression Classifier

Self-contained pure Python implementation of TF-IDF N-Gram Vectorizer and
Multinomial Logistic Regression (Softmax / Cross-Entropy Loss) classifier with zero external dependencies.
Strictly uses Logistic Regression for intent classification per architectural requirement.
"""

import json
import logging
import math
import os
import pickle
import random
import re
import time
from typing import Dict, List, Optional, Set, Tuple

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, "data")
MODELS_DIR = os.path.join(BASE_DIR, "models")
DATASET_FILE = os.path.join(DATA_DIR, "train_dataset.json")
TEST_DATASET_FILE = os.path.join(DATA_DIR, "test_dataset.json")

MODEL_PATH = os.path.join(MODELS_DIR, "logistic_regression_model.pkl")
VECTORIZER_PATH = os.path.join(MODELS_DIR, "tfidf_vectorizer.pkl")
CLASSES_PATH = os.path.join(MODELS_DIR, "intent_classes.json")
METRICS_PATH = os.path.join(MODELS_DIR, "model_metrics.json")

PRESERVED_DOMAIN_TOKENS = {
    "cs", "cse", "it", "me", "ce", "ee", "ece", "mba", "mca", "mtech",
    "btech", "polytechnic", "diploma", "hod", "aktu", "bte", "fee", "fees",
    "intake", "duration", "eligibility", "hostel", "placement", "salary",
    "package", "recruiters", "curfew", "attendance", "340", "1628"
}

STOP_WORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
    "any", "are", "as", "at", "be", "because", "been", "before", "being",
    "below", "between", "both", "but", "by", "could", "did", "do", "does",
    "doing", "down", "during", "each", "few", "for", "from", "further", "had",
    "has", "have", "having", "he", "her", "here", "hers", "herself", "him",
    "himself", "his", "how", "i", "if", "in", "into", "is", "it", "its", "itself",
    "me", "more", "most", "my", "myself", "no", "nor", "not", "of", "off", "on",
    "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out",
    "over", "own", "same", "she", "should", "so", "some", "such", "than", "that",
    "the", "their", "theirs", "them", "themselves", "then", "there", "these",
    "they", "this", "those", "through", "to", "too", "under", "until", "up",
    "very", "was", "we", "were", "what", "when", "where", "which", "while",
    "who", "whom", "why", "with", "would", "you", "your", "yours", "yourself",
    "yourselves", "please", "tell", "want", "know", "give"
}

def preprocess_text(text: str) -> str:
    """Standardizes text tokens while preserving domain keywords."""
    cleaned = text.lower().strip()
    cleaned = re.sub(r"\bb\.?\s*tech\b", "btech", cleaned)
    cleaned = re.sub(r"\bm\.?\s*tech\b", "mtech", cleaned)
    cleaned = re.sub(r"\b340\b", "aktu code 340", cleaned)
    cleaned = re.sub(r"\b1628\b", "bte code 1628", cleaned)
    cleaned = re.sub(r"[^\w\s]", " ", cleaned)
    return " ".join(cleaned.split())


class PureTfidfVectorizer:
    """TF-IDF N-Gram Vectorizer."""
    def __init__(self, ngram_range=(1, 2), max_features=2500):
        self.ngram_range = ngram_range
        self.max_features = max_features
        self.vocabulary: Dict[str, int] = {}
        self.idf_map: Dict[str, float] = {}
        self.doc_count = 0

    def _extract_ngrams(self, text: str) -> List[str]:
        tokens = text.split()
        filtered = [t for t in tokens if t in PRESERVED_DOMAIN_TOKENS or (t not in STOP_WORDS and len(t) > 1)]
        terms = list(filtered)
        if self.ngram_range[1] >= 2 and len(filtered) >= 2:
            for i in range(len(filtered) - 1):
                terms.append(f"{filtered[i]} {filtered[i+1]}")
        return terms

    def fit(self, texts: List[str]):
        self.doc_count = len(texts)
        term_doc_freq: Dict[str, int] = {}

        for doc in texts:
            unique_terms = set(self._extract_ngrams(doc))
            for term in unique_terms:
                term_doc_freq[term] = term_doc_freq.get(term, 0) + 1

        sorted_terms = sorted(term_doc_freq.items(), key=lambda x: x[1], reverse=True)[:self.max_features]
        self.vocabulary = {term: idx for idx, (term, _) in enumerate(sorted_terms)}

        for term, df in sorted_terms:
            self.idf_map[term] = math.log((1 + self.doc_count) / (1 + df)) + 1.0

    def transform(self, texts: List[str]) -> List[Dict[int, float]]:
        sparse_vectors = []
        for doc in texts:
            terms = self._extract_ngrams(doc)
            term_counts: Dict[str, int] = {}
            for t in terms:
                if t in self.vocabulary:
                    term_counts[t] = term_counts.get(t, 0) + 1

            vec: Dict[int, float] = {}
            norm_sq = 0.0
            for t, count in term_counts.items():
                col = self.vocabulary[t]
                tf = 1.0 + math.log(count)
                val = tf * self.idf_map[t]
                vec[col] = val
                norm_sq += val * val

            norm = math.sqrt(norm_sq) if norm_sq > 0 else 1.0
            normalized_vec = {col: val / norm for col, val in vec.items()}
            sparse_vectors.append(normalized_vec)
        return sparse_vectors


class PureLogisticRegression:
    """Multinomial Logistic Regression with Softmax / Cross-Entropy Loss."""
    def __init__(self, learning_rate: float = 1.2, epochs: int = 100, l2_reg: float = 0.0001):
        self.learning_rate = learning_rate
        self.epochs = epochs
        self.l2_reg = l2_reg
        self.weights: List[List[float]] = []  # [num_classes, vocab_size]
        self.biases: List[float] = []        # [num_classes]
        self.classes: List[str] = []

    def fit(self, X: List[Dict[int, float]], y: List[str], vocab_size: int, classes: List[str]):
        self.classes = sorted(list(set(classes)))
        num_classes = len(self.classes)
        c2i = {c: i for i, c in enumerate(self.classes)}
        num_samples = len(X)

        self.weights = [[0.0] * vocab_size for _ in range(num_classes)]
        self.biases = [0.0] * num_classes

        # Train Multinomial Logistic Regression via Stochastic Gradient Descent
        for epoch in range(self.epochs):
            lr = self.learning_rate / (1.0 + 0.01 * epoch)
            for i in range(num_samples):
                vec = X[i]
                target_idx = c2i[y[i]]

                # Logits
                logits = [self.biases[c] + sum(self.weights[c][col] * val for col, val in vec.items()) for c in range(num_classes)]
                max_l = max(logits)
                exp_l = [math.exp(l - max_l) for l in logits]
                sum_exp = sum(exp_l)
                probs = [e / sum_exp for e in exp_l]

                # Gradient updates with Cross-Entropy Loss
                for c in range(num_classes):
                    err = probs[c] - (1.0 if c == target_idx else 0.0)
                    self.biases[c] -= lr * err * 0.1
                    for col, val in vec.items():
                        self.weights[c][col] -= lr * (err * val + self.l2_reg * self.weights[c][col])

    def predict_proba(self, x: Dict[int, float]) -> List[float]:
        num_classes = len(self.classes)
        logits = [self.biases[c] + sum(self.weights[c][col] * val for col, val in x.items()) for c in range(num_classes)]
        max_l = max(logits)
        exp_l = [math.exp(l - max_l) for l in logits]
        sum_exp = sum(exp_l) or 1.0
        return [e / sum_exp for e in exp_l]

    def predict_logits(self, x: Dict[int, float]) -> List[float]:
        num_classes = len(self.classes)
        return [self.biases[c] + sum(self.weights[c][col] * val for col, val in x.items()) for c in range(num_classes)]


class VCTMNLPClassifier:
    def __init__(self):
        self.vectorizer: Optional[PureTfidfVectorizer] = None
        self.model: Optional[PureLogisticRegression] = None
        self.classes: List[str] = []
        self.metrics: Dict = {}
        self.is_loaded = False
        self.load_model()

    def train(self, dataset_path: str = DATASET_FILE, test_dataset_path: str = TEST_DATASET_FILE) -> Dict:
        logger.info(f"Training Multinomial Logistic Regression classifier from {dataset_path}...")
        os.makedirs(MODELS_DIR, exist_ok=True)

        with open(dataset_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        texts = [preprocess_text(item["text"]) for item in data]
        labels = [item["intent"] for item in data]
        self.classes = sorted(list(set(labels)))

        # Train TF-IDF
        self.vectorizer = PureTfidfVectorizer(ngram_range=(1, 2), max_features=2500)
        self.vectorizer.fit(texts)
        X = self.vectorizer.transform(texts)

        # Train Logistic Regression
        self.model = PureLogisticRegression(learning_rate=1.2, epochs=90, l2_reg=0.0001)
        self.model.fit(X, labels, len(self.vectorizer.vocabulary), self.classes)

        # Evaluate on a held-out test set that was never used to fit the vectorizer/model.
        test_accuracy = None
        test_samples = 0
        if os.path.exists(test_dataset_path):
            with open(test_dataset_path, "r", encoding="utf-8") as f:
                test_data = json.load(f)
            test_texts = [preprocess_text(item["text"]) for item in test_data]
            test_labels = [item["intent"] for item in test_data]
            test_X = self.vectorizer.transform(test_texts)
            correct = 0
            for i in range(len(test_X)):
                probas = self.model.predict_proba(test_X[i])
                pred_idx = probas.index(max(probas))
                if self.classes[pred_idx] == test_labels[i]:
                    correct += 1
            test_samples = len(test_X)
            test_accuracy = correct / test_samples if test_samples else 0.0

        self.metrics = {
            "model_type": "LogisticRegression",
            "solver": "Multinomial Softmax (Cross-Entropy SGD)",
            "train_samples": len(texts),
            "test_samples": test_samples,
            "test_accuracy": round(test_accuracy, 4) if test_accuracy is not None else None,
            "total_samples": len(texts) + test_samples,
            "vocab_size": len(self.vectorizer.vocabulary),
            "intent_classes_count": len(self.classes),
            "intent_classes": self.classes,
            "evaluation": "held-out test set; no exact example overlap with train set",
            "trained_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        }

        # Save artifacts
        with open(MODEL_PATH, "wb") as f:
            pickle.dump(self.model, f)
        with open(VECTORIZER_PATH, "wb") as f:
            pickle.dump(self.vectorizer, f)
        with open(CLASSES_PATH, "w", encoding="utf-8") as f:
            json.dump(self.classes, f, indent=2)
        with open(METRICS_PATH, "w", encoding="utf-8") as f:
            json.dump(self.metrics, f, indent=2)

        self.is_loaded = True
        logger.info("Model trained successfully. Held-out test accuracy: %s. Saved to %s", f"{test_accuracy * 100:.2f}%" if test_accuracy is not None else "N/A", MODELS_DIR)
        return self.metrics

    def load_model(self) -> bool:
        if os.path.exists(MODEL_PATH) and os.path.exists(VECTORIZER_PATH) and os.path.exists(CLASSES_PATH):
            try:
                with open(MODEL_PATH, "rb") as f:
                    self.model = pickle.load(f)
                with open(VECTORIZER_PATH, "rb") as f:
                    self.vectorizer = pickle.load(f)
                with open(CLASSES_PATH, "r", encoding="utf-8") as f:
                    self.classes = json.load(f)
                if os.path.exists(METRICS_PATH):
                    with open(METRICS_PATH, "r", encoding="utf-8") as f:
                        self.metrics = json.load(f)
                self.is_loaded = True
                return True
            except Exception as e:
                logger.error(f"Error loading model artifacts: {e}")
                return False
        return False

    def predict(self, query: str) -> Dict:
        if not self.is_loaded or not self.model or not self.vectorizer:
            self.train()

        start_time = time.time()
        cleaned_text = preprocess_text(query)
        vec_list = self.vectorizer.transform([cleaned_text])
        x = vec_list[0]

        # If the query has no features learned from the training vocabulary, do not
        # force an arbitrary college intent. Treat it as out-of-domain/unknown.
        if not x:
            return {
                "predictedIntent": "fallback",
                "confidence": 0.0,
                "probabilities": {c: 0.0 for c in self.classes},
                "rawLogits": {c: 0.0 for c in self.classes},
                "tokens": cleaned_text.split(),
                "ngrams": self.vectorizer._extract_ngrams(cleaned_text),
                "topContributingFeatures": [],
                "inferenceTimeMs": round((time.time() - start_time) * 1000, 2)
            }

        probas = self.model.predict_proba(x)
        logits = self.model.predict_logits(x)

        max_prob = max(probas)
        pred_idx = probas.index(max_prob)
        predicted_intent = self.classes[pred_idx]

        probabilities_dict = {self.classes[i]: round(probas[i], 4) for i in range(len(self.classes))}
        raw_logits_dict = {self.classes[i]: round(logits[i], 4) for i in range(len(self.classes))}

        tokens = cleaned_text.split()
        top_features = []
        for term in set(tokens):
            if term in self.vectorizer.vocabulary:
                col = self.vectorizer.vocabulary[term]
                w = self.model.weights[pred_idx][col]
                val = x.get(col, 0.0)
                top_features.append({
                    "token": term,
                    "weight": round(w, 4),
                    "tfidfValue": round(val, 4),
                    "contribution": round(w * val, 4)
                })
        top_features.sort(key=lambda item: item["contribution"], reverse=True)

        inference_time_ms = round((time.time() - start_time) * 1000, 2)

        return {
            "predictedIntent": predicted_intent,
            "confidence": round(max_prob, 4),
            "probabilities": probabilities_dict,
            "rawLogits": raw_logits_dict,
            "tokens": tokens,
            "ngrams": self.vectorizer._extract_ngrams(cleaned_text),
            "topContributingFeatures": top_features[:5],
            "inferenceTimeMs": inference_time_ms
        }

classifier = VCTMNLPClassifier()
