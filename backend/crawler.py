"""
crawler.py - Official VCTM Website Data Collector

Extracts, cleans, and stores content from https://vctm.in with source page tracking.
Can be triggered periodically or via the /api/data/refresh endpoint.
"""

import json
import logging
import os
import time
from typing import Dict, List, Optional
import requests
from bs4 import BeautifulSoup

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
RAW_PAGES_FILE = os.path.join(DATA_DIR, "raw_pages.json")

# Target URLs on the official VCTM website
OFFICIAL_URLS = [
    {"url": "https://vctm.in/", "category": "home", "title": "Home - VCTM Aligarh"},
    {"url": "https://vctm.in/pages/About%20College", "category": "about", "title": "About College - VCTM Aligarh"},
    {"url": "https://vctm.in/pages/Mission%20and%20Vision", "category": "vision_mission", "title": "Mission & Vision - VCTM Aligarh"},
    {"url": "https://vctm.in/courses/btech", "category": "courses_btech", "title": "B.Tech Programs - Courses & Fees"},
    {"url": "https://vctm.in/courses/management", "category": "courses_pg", "title": "MBA & MCA Programs - Courses & Fees"},
    {"url": "https://vctm.in/courses/polytechnic", "category": "courses_diploma", "title": "Polytechnic Diploma Programs"},
    {"url": "https://vctm.in/admissions", "category": "admissions", "title": "Admissions - VCTM Aligarh"},
    {"url": "https://vctm.in/scholarships", "category": "scholarships", "title": "Scholarships & Financial Aid"},
    {"url": "https://vctm.in/hostel-transport", "category": "hostel_transport", "title": "Hostel & Transport Facilities"},
    {"url": "https://vctm.in/placements", "category": "placements", "title": "Placements & Recruiters (CRC)"},
    {"url": "https://vctm.in/faculty-departments", "category": "departments", "title": "Faculty & Heads of Departments"},
    {"url": "https://vctm.in/examinations", "category": "examinations", "title": "Examinations & Academic System"},
]

HEADERS = {
    "User-Agent": "VCTM-EnquiryBot-Collector/1.0 (+https://vctm.in)",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

def clean_html_text(html_content: str) -> List[Dict[str, str]]:
    """Parse HTML and extract meaningful heading + paragraph sections."""
    soup = BeautifulSoup(html_content, "html.parser")
    
    # Remove script, style, navigation, footer boilerplate
    for elem in soup(["script", "style", "nav", "footer", "header", "noscript"]):
        elem.decompose()
        
    sections = []
    current_heading = "General Overview"
    current_paras: List[str] = []
    
    for tag in soup.find_all(["h1", "h2", "h3", "h4", "p", "li", "td"]):
        tag_text = tag.get_text(" ", strip=True)
        if not tag_text or len(tag_text) < 4:
            continue
            
        if tag.name in ["h1", "h2", "h3", "h4"]:
            if current_paras:
                sections.append({
                    "heading": current_heading,
                    "content": " ".join(current_paras)
                })
                current_paras = []
            current_heading = tag_text
        else:
            current_paras.append(tag_text)
            
    if current_paras:
        sections.append({
            "heading": current_heading,
            "content": " ".join(current_paras)
        })
        
    return sections

def crawl_vctm_website(force_live: bool = False) -> Dict:
    """
    Crawls official VCTM website pages.
    Falls back cleanly to the verified offline snapshot if website is unreachable.
    """
    os.makedirs(DATA_DIR, exist_ok=True)
    pages_data = []
    live_count = 0
    
    logger.info("Starting VCTM official website data collection...")
    
    for item in OFFICIAL_URLS:
        url = item["url"]
        category = item["category"]
        title = item["title"]
        
        try:
            resp = requests.get(url, headers=HEADERS, timeout=5)
            if resp.status_code == 200:
                sections = clean_html_text(resp.text)
                if sections:
                    pages_data.append({
                        "url": url,
                        "title": title,
                        "category": category,
                        "sections": sections,
                        "status": "live_fetched"
                    })
                    live_count += 1
                    logger.info(f"Successfully fetched live: {url}")
            else:
                logger.warning(f"HTTP {resp.status_code} for {url}")
        except Exception as e:
            logger.debug(f"Live fetch skipped/failed for {url}: {e}")
            
    # If live fetching succeeded for at least some pages, save new data
    if live_count > 0:
        result = {
            "scraped_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "base_url": "https://vctm.in",
            "pages": pages_data,
            "mode": "live"
        }
        with open(RAW_PAGES_FILE, "w", encoding="utf-8") as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
        logger.info(f"Crawl completed. Saved {len(pages_data)} pages from live website.")
        return result

    # If offline or blocked, load the verified official snapshot
    logger.info("Using verified official VCTM data snapshot.")
    if os.path.exists(RAW_PAGES_FILE):
        with open(RAW_PAGES_FILE, "r", encoding="utf-8") as f:
            existing = json.load(f)
            return existing
            
    return {"scraped_at": time.strftime("%Y-%m-%dT%H:%M:%SZ"), "pages": []}

if __name__ == "__main__":
    data = crawl_vctm_website()
    print(f"Crawl finished. Found {len(data.get('pages', []))} pages.")
