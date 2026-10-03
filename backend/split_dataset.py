"""Create a deterministic, stratified train/test split for the VCTM intent dataset.

The split is performed by exact question/example, stratified by intent, so every
intent represented in the full dataset is represented in both sets when it has
at least two examples. No example appears in both files.
"""
import json
import os
import random
from collections import defaultdict
from typing import Dict, List, Tuple

BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, "data")
SOURCE_FILE = os.path.join(DATA_DIR, "training_dataset.json")
TRAIN_FILE = os.path.join(DATA_DIR, "train_dataset.json")
TEST_FILE = os.path.join(DATA_DIR, "test_dataset.json")
SPLIT_META_FILE = os.path.join(DATA_DIR, "dataset_split.json")

SEED = 42
TEST_SIZE = 0.20


def _key(item: Dict) -> Tuple[str, str]:
    return (str(item.get("text", "")).strip().casefold(), str(item.get("intent", "")).strip())


def create_split(source_file: str = SOURCE_FILE, seed: int = SEED, test_size: float = TEST_SIZE):
    with open(source_file, "r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, list) or not data:
        raise ValueError("Training dataset must be a non-empty JSON list.")

    # Remove exact duplicate examples before splitting; preserve first occurrence.
    seen = set()
    unique = []
    for item in data:
        k = _key(item)
        if k not in seen:
            seen.add(k)
            unique.append(item)

    by_intent = defaultdict(list)
    for item in unique:
        by_intent[item["intent"]].append(item)

    rng = random.Random(seed)
    train, test = [], []

    for intent in sorted(by_intent):
        items = list(by_intent[intent])
        rng.shuffle(items)
        n = len(items)
        if n == 1:
            train.extend(items)
            continue
        n_test = max(1, round(n * test_size))
        n_test = min(n - 1, n_test)
        test.extend(items[:n_test])
        train.extend(items[n_test:])

    rng.shuffle(train)
    rng.shuffle(test)

    # Hard guarantee: no exact example overlap.
    train_keys = {_key(x) for x in train}
    test_keys = {_key(x) for x in test}
    overlap = train_keys & test_keys
    if overlap:
        raise AssertionError(f"Train/test leakage detected: {len(overlap)} examples overlap.")

    os.makedirs(DATA_DIR, exist_ok=True)
    for path, payload in [(TRAIN_FILE, train), (TEST_FILE, test)]:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=2, ensure_ascii=False)

    train_counts = defaultdict(int)
    test_counts = defaultdict(int)
    for x in train: train_counts[x["intent"]] += 1
    for x in test: test_counts[x["intent"]] += 1

    meta = {
        "source": os.path.basename(source_file),
        "seed": seed,
        "test_fraction_target": test_size,
        "total_unique_examples": len(unique),
        "train_examples": len(train),
        "test_examples": len(test),
        "train_fraction": round(len(train) / len(unique), 4),
        "test_fraction": round(len(test) / len(unique), 4),
        "exact_overlap_examples": 0,
        "train_intent_counts": dict(sorted(train_counts.items())),
        "test_intent_counts": dict(sorted(test_counts.items())),
    }
    with open(SPLIT_META_FILE, "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2, ensure_ascii=False)

    return train, test, meta


if __name__ == "__main__":
    _, _, meta = create_split()
    print(json.dumps(meta, indent=2))
