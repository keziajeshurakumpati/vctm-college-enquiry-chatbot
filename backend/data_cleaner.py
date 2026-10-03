"""
data_cleaner.py - Cleans raw scraped pages into structured, searchable knowledge items
with source URLs and entity tags.
"""

import json
import logging
import os
import re
from typing import Dict, List

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
RAW_PAGES_FILE = os.path.join(DATA_DIR, "raw_pages.json")
CLEAN_KB_FILE = os.path.join(DATA_DIR, "clean_knowledge_base.json")

def clean_text(text: str) -> str:
    """Normalize whitespace and remove unwanted characters."""
    text = re.sub(r"\s+", " ", text)
    return text.strip()

def build_clean_knowledge_base() -> List[Dict]:
    """Processes raw pages into high-precision, searchable knowledge chunks."""
    if not os.path.exists(RAW_PAGES_FILE):
        logger.error(f"{RAW_PAGES_FILE} not found. Run crawler first.")
        return []
        
    with open(RAW_PAGES_FILE, "r", encoding="utf-8") as f:
        raw_data = json.load(f)
        
    pages = raw_data.get("pages", [])
    kb_items: List[Dict] = []
    item_id = 1
    
    for page in pages:
        url = page.get("url", "https://vctm.in")
        page_title = page.get("title", "")
        category = page.get("category", "general")
        sections = page.get("sections", [])
        
        for sec in sections:
            heading = sec.get("heading", "")
            content = clean_text(sec.get("content", ""))
            if not content or len(content) < 20:
                continue
                
            # Detect target entities mentioned in this section
            programs_found = []
            if re.search(r"\b(cse|computer\s+science)\b", content, re.I):
                programs_found.append("B.Tech CSE")
            if re.search(r"\b(information\s+technology|it)\b", content, re.I):
                programs_found.append("B.Tech IT")
            if re.search(r"\b(mechanical|me)\b", content, re.I):
                programs_found.append("B.Tech Mechanical")
            if re.search(r"\b(civil|ce)\b", content, re.I):
                programs_found.append("B.Tech Civil")
            if re.search(r"\b(electrical|ee)\b", content, re.I):
                programs_found.append("B.Tech Electrical")
            if re.search(r"\b(electronics|ece)\b", content, re.I):
                programs_found.append("B.Tech ECE")
            if re.search(r"\b(agricultural|agri)\b", content, re.I):
                programs_found.append("B.Tech Agricultural")
            if re.search(r"\bmba\b", content, re.I):
                programs_found.append("MBA")
            if re.search(r"\bmca\b", content, re.I):
                programs_found.append("MCA")
            if re.search(r"\b(polytechnic|diploma)\b", content, re.I):
                programs_found.append("Polytechnic Diploma")
                
            # Extract monetary values (fees)
            fee_matches = re.findall(r"₹\s*([0-9,]+)", content)
            
            kb_items.append({
                "id": f"kb_{item_id}",
                "topic": category,
                "title": f"{page_title} - {heading}",
                "heading": heading,
                "content": content,
                "programs": programs_found,
                "extracted_fees": fee_matches,
                "source_url": url,
            })
            item_id += 1
            
    with open(CLEAN_KB_FILE, "w", encoding="utf-8") as f:
        json.dump(kb_items, f, indent=2, ensure_ascii=False)
        
    logger.info(f"Cleaned {len(kb_items)} knowledge base items saved to {CLEAN_KB_FILE}")
    return kb_items

if __name__ == "__main__":
    build_clean_knowledge_base()
