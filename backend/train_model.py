"""
train_model.py - Standalone training and evaluation script

Performs end-to-end training:
Data Cleaning -> Dataset Generation -> TF-IDF Vectorization -> Logistic Regression Training -> Evaluation
"""

import logging
import sys
from data_cleaner import build_clean_knowledge_base
from dataset_builder import generate_training_dataset
from split_dataset import create_split
from nlp_pipeline import classifier

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

def run_training_pipeline():
    logger.info("Step 1: Building Clean Knowledge Base from Website Data...")
    kb = build_clean_knowledge_base()
    logger.info(f"Cleaned {len(kb)} knowledge chunks.")

    logger.info("Step 2: Generating Training Dataset...")
    dataset = generate_training_dataset()
    logger.info(f"Dataset generated with {len(dataset)} examples.")

    logger.info("Step 3: Creating deterministic stratified 80/20 train/test split...")
    train_set, test_set, split_meta = create_split()
    logger.info(f"Split created: {len(train_set)} train / {len(test_set)} test; exact overlap = {split_meta['exact_overlap_examples']}")

    logger.info("Step 4: Training TF-IDF Vectorizer + Logistic Regression Model on TRAIN only...")
    metrics = classifier.train()
    
    print("\n" + "="*50)
    print("VCTM LOGISTIC REGRESSION MODEL TRAINING REPORT")
    print("="*50)
    print(f"Model Type: {metrics.get('model_type')}")
    print(f"Solver: {metrics.get('solver')}")
    if metrics.get("test_accuracy") is not None:
        print(f"Held-out Test Accuracy: {metrics.get('test_accuracy') * 100:.2f}%")
    print(f"Total Samples: {metrics.get('total_samples')}")
    print(f"Train / Test Split: {metrics.get('train_samples')} / {metrics.get('test_samples')}")
    print(f"Vocabulary Size: {metrics.get('vocab_size')}")
    print(f"Number of Intent Classes: {metrics.get('intent_classes_count')}")
    print("="*50 + "\n")
    
    return metrics

if __name__ == "__main__":
    run_training_pipeline()
