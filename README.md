<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/357b5d09-efa1-44e3-98b1-0aad0c7d9359

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## Dataset train/test split
The supervised intent dataset is split deterministically with seed 42 into an approximately 80/20 stratified split:
- `backend/data/training_dataset.json` — complete verified dataset (source)
- `backend/data/train_dataset.json` — 614 training examples
- `backend/data/test_dataset.json` — 153 held-out test examples
- `backend/data/dataset_split.json` — split metadata and per-intent counts

There are 0 exact question/intent overlaps between train and test. The Logistic Regression model is trained only on `train_dataset.json` and evaluated on the held-out `test_dataset.json`.
