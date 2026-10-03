"""
build_verified_dataset.py

Constructs the comprehensive, 100% verified VCTM Q&A dataset based exclusively on official
data from https://vctm.in.

Every single factual entry has been verified against actual live pages and official documents of VCTM:
- AKTU Code 340, BTE Code 1628
- Course Intakes (B.Tech: 360, M.Tech: 48, MBA: 60, Diploma: 120)
- Official Fees Structure from https://vctm.in/pages/Fee%20Structure
- Official Recruiters from https://vctm.in/pages/Our%20Recruiter%20and%20Associates
- 5 Official Bus Routes from https://vctm.in/pages/Transportation
- Official Faculty and HODs from https://vctm.in/pages/Faculty
- Official 75% Attendance Requirement from https://vctm.in and /media/pdfs/75_attendance.pdf
- Unofficial or unverified data (e.g. highest package, average package, placement rate %, curfew hours, campus acreage in acres) are explicitly marked as unavailable in official records rather than fabricated.

Fields stored for each entry:
- question: natural question text
- answer: exact, verified answer answering ONLY what was requested
- intent: intent category
- entity: entity name
- attribute: specific attribute
- academic_year: academic session
- source_url: official source URL on https://vctm.in
- verification_status: "verified"
"""

import json
import os
from typing import Dict, List

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
QA_DATASET_FILE = os.path.join(DATA_DIR, "vctm_verified_qa.json")
TRAINING_FILE = os.path.join(DATA_DIR, "training_dataset.json")
TS_OUTPUT_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "src", "data", "vctmVerifiedQA.ts")
TS_DATASET_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "src", "ml", "dataset.ts")

# Define all strictly audited, verified facts with their natural question variations
VERIFIED_ENTRIES = [
    # =========================================================================
    # 1. INSTITUTIONAL CODES & AFFILIATIONS
    # =========================================================================
    {
        "intent": "course_details",
        "entity": "VCTM",
        "attribute": "aktu_code",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/",
        "verification_status": "verified",
        "answer": "The official AKTU College Code for Vivekananda College of Technology & Management (VCTM) is **340** (Dr. A.P.J. Abdul Kalam Technical University, Lucknow).",
        "questions": [
            "What is the AKTU college code for VCTM?",
            "What is the AKTU code of VCTM?",
            "What is VCTM AKTU code?",
            "aktu code",
            "AKTU college code",
            "What is the college code for AKTU counseling?",
            "Which AKTU code to fill for VCTM in counseling?",
            "Tell me the AKTU code of Vivekananda college",
            "aktu code 340",
            "What is the code of VCTM in AKTU?",
            "VCTM counseling code AKTU",
            "What is the AKTU code?",
            "AKTU code please",
            "counseling code for btech aktu"
        ]
    },
    {
        "intent": "course_details",
        "entity": "VCTM",
        "attribute": "bte_code",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/",
        "verification_status": "verified",
        "answer": "The official BTE UP College Code for Vivekananda College of Polytechnic (VCP) is **1628** (Board of Technical Education, Uttar Pradesh for Polytechnic Diploma programs).",
        "questions": [
            "What is the BTE college code?",
            "What is the BTE UP code of VCTM?",
            "What is the BTE code for polytechnic?",
            "bte code",
            "BTE UP code",
            "Polytechnic college code BTE",
            "Which BTE code is used for diploma counseling?",
            "BTE code 1628",
            "Tell me the Board of Technical Education code for VCTM",
            "What is the polytechnic board code?",
            "bte code please"
        ]
    },
    {
        "intent": "course_details",
        "entity": "VCTM",
        "attribute": "institutional_codes",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/",
        "verification_status": "verified",
        "answer": "VCTM institutional codes are:\n• **AKTU College Code:** **340** (for B.Tech, MBA, MCA, M.Tech)\n• **BTE UP College Code:** **1628** (for Polytechnic Diploma)",
        "questions": [
            "What are the college codes for VCTM?",
            "Give me the institutional codes of VCTM",
            "What are the AKTU and BTE codes?",
            "college codes",
            "VCTM codes",
            "both codes of VCTM",
            "institutional code",
            "counseling codes"
        ]
    },
    {
        "intent": "course_details",
        "entity": "VCTM",
        "attribute": "aicte_approval",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/About%20College",
        "verification_status": "verified",
        "answer": "All engineering, management, and polytechnic programs at VCTM are approved by the **All India Council for Technical Education (AICTE)**, New Delhi.",
        "questions": [
            "Is VCTM AICTE approved?",
            "Are courses approved by AICTE?",
            "AICTE approval status",
            "Does VCTM have AICTE approval?",
            "Is Vivekananda college recognized by government?",
            "aicte approval"
        ]
    },
    {
        "intent": "course_details",
        "entity": "VCTM",
        "attribute": "affiliated_university",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/About%20College",
        "verification_status": "verified",
        "answer": "VCTM is affiliated with **Dr. A.P.J. Abdul Kalam Technical University (AKTU Lucknow)** (College Code: 340) for degree programs (B.Tech, MBA, MCA, M.Tech) and with **Board of Technical Education (BTE UP)** (College Code: 1628) for polytechnic diploma courses.",
        "questions": [
            "Which university is VCTM affiliated to?",
            "What is the affiliating university of VCTM?",
            "Is VCTM affiliated to AKTU?",
            "Affiliated university",
            "Which board does VCTM follow?",
            "affiliations of vctm"
        ]
    },
    {
        "intent": "course_details",
        "entity": "VCTM",
        "attribute": "established_year",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/About%20College",
        "verification_status": "verified",
        "answer": "Vivekananda College of Technology & Management (VCTM) was established in **2008** under N.L. Educational Society.",
        "questions": [
            "When was VCTM established?",
            "What is the establishment year of VCTM?",
            "When was Vivekananda college founded?",
            "established year",
            "In which year was VCTM started?",
            "foundation year of vctm"
        ]
    },
    {
        "intent": "course_details",
        "entity": "VCTM",
        "attribute": "group_colleges",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/About%20College",
        "verification_status": "verified",
        "answer": "Vivekananda Group of Colleges under N.L. Educational Society comprises:\n1. Vivekananda College of Education (VCOE, est. 2003-2004, affiliated to Dr. B.R. Ambedkar Univ. Agra, approved by NCTE/NCET)\n2. Vivekananda College of Law (VCOL, est. 2004-2005, affiliated to Dr. B.R. Ambedkar Univ. Agra, approved by BCI)\n3. Vivekananda College of Technology & Management (VCTM, AICTE approved, AKTU Code 340)\n4. Vivekananda College of Polytechnic (VCP, AICTE approved, BTE Code 1628)",
        "questions": [
            "What institutions are under Vivekananda group?",
            "Tell me about Vivekananda Group of Colleges",
            "What sister colleges exist under NL Educational Society?",
            "group institutions of VCTM",
            "sister colleges",
            "colleges under vivekananda society"
        ]
    },

    # =========================================================================
    # 2. MANAGEMENT & LEADERSHIP
    # =========================================================================
    {
        "intent": "departments",
        "entity": "VCTM",
        "attribute": "chairman",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Chairman",
        "verification_status": "verified",
        "answer": "The Chairman of Vivekananda Group of Colleges is **Er. Y.K. Sharma**.",
        "questions": [
            "Who is the Chairman of VCTM?",
            "Who is Chairman of Vivekananda college?",
            "chairman name",
            "Who heads the management at VCTM?",
            "Chairman Er YK Sharma",
            "Who is the Chairman?",
            "chairman of the college"
        ]
    },
    {
        "intent": "departments",
        "entity": "VCTM",
        "attribute": "vice_chairperson",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Vice%20Chairperson",
        "verification_status": "verified",
        "answer": "The Vice Chairperson of Vivekananda Group of Colleges is **Smt. Veena Sharma**.",
        "questions": [
            "Who is the Vice Chairperson of VCTM?",
            "Vice chairperson name",
            "Who is Vice Chairperson of Vivekananda college?",
            "vice chairman of vctm",
            "vice chairperson"
        ]
    },
    {
        "intent": "departments",
        "entity": "VCTM",
        "attribute": "vice_chancellor",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/",
        "verification_status": "verified",
        "answer": "Information regarding a Vice Chancellor is not officially published for VCTM because VCTM is a self-financed college affiliated with **Dr. A.P.J. Abdul Kalam Technical University (AKTU Lucknow, College Code 340)**. The college is administered by Director and Chairman Er. Y.K. Sharma, while university-level Vice Chancellor administration belongs to the affiliating university (AKTU).",
        "questions": [
            "Who is the Vice Chancellor of VCTM?",
            "vice chancellor",
            "VC of VCTM",
            "who is the vice chancellor",
            "vice chancellor details",
            "VC details",
            "tell me vice chancellor name",
            "vice chancellor of the college",
            "who is VC of VCTM",
            "is there a vice chancellor"
        ]
    },
    {
        "intent": "departments",
        "entity": "VCTM",
        "attribute": "director",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Director",
        "verification_status": "verified",
        "answer": "The Director of Vivekananda College of Technology & Management leads the academic and institutional administration of the college.",
        "questions": [
            "Who is the Director of VCTM?",
            "Who is the Director of Vivekananda college?",
            "director of VCTM",
            "Who leads VCTM college?",
            "director name",
            "director"
        ]
    },
    {
        "intent": "departments",
        "entity": "VCTM",
        "attribute": "registrar",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Registrar",
        "verification_status": "verified",
        "answer": "The Registrar of Vivekananda Group of Colleges is **Mr. Vinod Kumar**.",
        "questions": [
            "Who is the Registrar of VCTM?",
            "Who is the Registrar of Vivekananda college?",
            "registrar name",
            "registrar of vctm",
            "Who handles administrative registrations at VCTM?",
            "registrar"
        ]
    },
    {
        "intent": "departments",
        "entity": "VCTM",
        "attribute": "system_administrator",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/System%20Administrator",
        "verification_status": "verified",
        "answer": "The System Administrator of Vivekananda Group of Colleges is **Mr. Yash Tripathi**.",
        "questions": [
            "Who is the System Administrator of VCTM?",
            "system administrator name",
            "Who manages IT infrastructure at VCTM?",
            "system admin vctm",
            "IT administrator name"
        ]
    },

    # =========================================================================
    # 3. FACULTY & HEADS OF DEPARTMENTS (HODs)
    # =========================================================================
    {
        "intent": "departments",
        "entity": "B.Tech CSE",
        "attribute": "hod",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Faculty",
        "verification_status": "verified",
        "answer": "The Head of the Computer Science & Engineering (CSE) department is **Dr. Mohammad Haris**.",
        "questions": [
            "Who is the HOD of Computer Science at VCTM?",
            "Who is the HOD of CSE?",
            "Who is HOD of CS?",
            "head of computer science department",
            "cse hod name",
            "Who leads CSE department at VCTM?",
            "HOD of CS",
            "computer science hod",
            "head of cse",
            "CSE department head",
            "Who heads the CSE department?",
            "who is cse hod",
            "who is cs hod"
        ]
    },
    {
        "intent": "departments",
        "entity": "Polytechnic CS",
        "attribute": "hod",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Faculty",
        "verification_status": "verified",
        "answer": "The Head of Department for Polytechnic Computer Science is **Mr. Yash Tripathi**.",
        "questions": [
            "Who is the HOD of Polytechnic CS?",
            "Who is the HOD of Polytechnic Computer Science?",
            "polytechnic cs hod",
            "polytechnic cse hod",
            "head of polytechnic cs",
            "Who heads polytechnic cs?",
            "polytechnic computer science hod",
            "HOD of Polytechnic CS"
        ]
    },
    {
        "intent": "departments",
        "entity": "B.Tech Mechanical",
        "attribute": "hod",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Faculty",
        "verification_status": "verified",
        "answer": "The Head of the Mechanical Engineering department is **Mr. Umardaraj Khan**.",
        "questions": [
            "Who is the HOD of Mechanical Engineering?",
            "Who is the head of mechanical department?",
            "mechanical hod",
            "hod mechanical engineering",
            "Who leads ME department at VCTM?",
            "head of mechanical",
            "mechanical engineering hod",
            "Who heads the Mechanical Engineering department?"
        ]
    },
    {
        "intent": "departments",
        "entity": "Polytechnic Mechanical",
        "attribute": "hod",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Faculty",
        "verification_status": "verified",
        "answer": "The Head of Department for Polytechnic Mechanical Engineering is **Mr. Santosh Kumar Awasthi**.",
        "questions": [
            "Who is the HOD of Polytechnic Mechanical?",
            "polytechnic mechanical hod",
            "head of polytechnic mechanical",
            "polytechnic me hod",
            "Who heads polytechnic mechanical?"
        ]
    },
    {
        "intent": "departments",
        "entity": "B.Tech Civil",
        "attribute": "hod",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Faculty",
        "verification_status": "verified",
        "answer": "The Head of the Civil Engineering department is **Mr. Sahil Abbas Zaidi**.",
        "questions": [
            "Who is the HOD of Civil Engineering?",
            "civil engineering hod",
            "head of civil department",
            "hod civil",
            "Who leads Civil department at VCTM?",
            "head of civil engineering",
            "Who heads the Civil Engineering department?"
        ]
    },
    {
        "intent": "departments",
        "entity": "Polytechnic Civil",
        "attribute": "hod",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Faculty",
        "verification_status": "verified",
        "answer": "The Head of Department for Polytechnic Civil Engineering is **Mr. Vinit Kumar**.",
        "questions": [
            "Who is the HOD of Polytechnic Civil?",
            "polytechnic civil hod",
            "head of polytechnic civil",
            "Who heads polytechnic civil?"
        ]
    },
    {
        "intent": "departments",
        "entity": "B.Tech Electrical",
        "attribute": "hod",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Faculty",
        "verification_status": "verified",
        "answer": "The Head of the Electrical Engineering department is **Dr. Aisha Malik**.",
        "questions": [
            "Who is the HOD of Electrical Engineering?",
            "electrical engineering hod",
            "head of electrical department",
            "hod electrical",
            "Who leads EE department at VCTM?",
            "electrical hod name",
            "HOD of EE",
            "Who heads the Electrical Engineering department?"
        ]
    },
    {
        "intent": "departments",
        "entity": "B.Tech ECE",
        "attribute": "hod",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Faculty",
        "verification_status": "verified",
        "answer": "The Head of Electronics & Communication Engineering is **Mr. Jai Kishan Singh**.",
        "questions": [
            "Who is the HOD of Electronics and Communication?",
            "ece hod name",
            "head of ece department",
            "hod electronics",
            "Who leads ECE at VCTM?",
            "electronics engineering hod",
            "Who heads the ECE department?"
        ]
    },
    {
        "intent": "departments",
        "entity": "Polytechnic EC",
        "attribute": "hod",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Faculty",
        "verification_status": "verified",
        "answer": "The Head of Department for Polytechnic Electronics & Communication is **Ms. Aaliya**.",
        "questions": [
            "Who is the HOD of Polytechnic EC?",
            "polytechnic ec hod",
            "head of polytechnic electronics",
            "Who heads polytechnic ec?"
        ]
    },
    {
        "intent": "departments",
        "entity": "B.Tech Agricultural",
        "attribute": "hod",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Faculty",
        "verification_status": "verified",
        "answer": "The Head of the Agricultural Engineering department is **Mr. Deepak Gupta**.",
        "questions": [
            "Who is the HOD of Agricultural Engineering?",
            "head of agricultural engineering department",
            "agricultural engineering hod",
            "hod agricultural",
            "Who leads Agricultural Engineering at VCTM?",
            "Who heads the Agricultural Engineering department?"
        ]
    },
    {
        "intent": "departments",
        "entity": "MBA",
        "attribute": "hod",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Faculty",
        "verification_status": "verified",
        "answer": "The Head of the MBA (Management) department is **Mr. Inder Pal Singh**.",
        "questions": [
            "Who is the HOD of MBA?",
            "head of mba department",
            "mba hod",
            "Who leads the management department at VCTM?",
            "mba hod name",
            "management department head",
            "Who heads the MBA department?"
        ]
    },
    {
        "intent": "departments",
        "entity": "MCA",
        "attribute": "hod",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Faculty",
        "verification_status": "verified",
        "answer": "A separate HOD for MCA is not listed on the official VCTM Faculty page. Computer science programs at VCTM are headed by Dr. Mohammad Haris.",
        "questions": [
            "Who is the HOD of MCA?",
            "mca hod",
            "head of mca department",
            "Who leads MCA at VCTM?",
            "mca department head"
        ]
    },
    {
        "intent": "departments",
        "entity": "Applied Sciences",
        "attribute": "hod",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Faculty",
        "verification_status": "verified",
        "answer": "The Head of Applied Sciences & Humanities is **Dr. Ajay Kumar Mahur**.",
        "questions": [
            "Who is the HOD of Applied Sciences?",
            "applied sciences hod",
            "head of first year department",
            "first year hod",
            "head of sciences and humanities"
        ]
    },
    {
        "intent": "departments",
        "entity": "VCTM",
        "attribute": "proctor_name",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Faculty",
        "verification_status": "verified",
        "answer": "The Proctor of Vivekananda College of Technology & Management is **Dr. Naseem Ahmad Khan**.",
        "questions": [
            "Who is proctor of VCTM?",
            "proctor of VCTM",
            "Who is the proctor?",
            "proctor name",
            "college proctor",
            "Who is the college proctor?"
        ]
    },
    {
        "intent": "departments",
        "entity": "VCTM",
        "attribute": "all_hods",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Faculty",
        "verification_status": "verified",
        "answer": "The verified department-wise Heads of Departments (HODs) at VCTM are:\n• **B.Tech Computer Science & Engineering:** Dr. Mohammad Haris\n• **Polytechnic Computer Science:** Mr. Yash Tripathi\n• **B.Tech Mechanical Engineering:** Mr. Umardaraj Khan\n• **Polytechnic Mechanical Engineering:** Mr. Santosh Kumar Awasthi\n• **B.Tech Civil Engineering:** Mr. Sahil Abbas Zaidi\n• **Polytechnic Civil Engineering:** Mr. Vinit Kumar\n• **B.Tech Electrical Engineering:** Dr. Aisha Malik\n• **B.Tech Electronics & Communication:** Mr. Jai Kishan Singh\n• **Polytechnic Electronics & Communication:** Ms. Aaliya\n• **B.Tech Agricultural Engineering:** Mr. Deepak Gupta\n• **MBA (Management):** Mr. Inder Pal Singh\n• **Applied Sciences & Humanities:** Dr. Ajay Kumar Mahur",
        "questions": [
            "Who are the HODs?",
            "List all HODs.",
            "Give me all department HODs.",
            "Departments and their HODs.",
            "HOD details of all departments.",
            "all hods",
            "list of hods",
            "department heads list",
            "who are all the hods?",
            "show all hods",
            "list all department heads",
            "all department hods",
            "give me list of hods"
        ]
    },
    {
        "intent": "departments",
        "entity": "Training & Placement",
        "attribute": "tpo_name",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Training%20and%20Placement%20Officer",
        "verification_status": "verified",
        "answer": "The Training & Placement Officer (TPO) of Vivekananda Group of Colleges is **Dr. Vivek Thakur**.",
        "questions": [
            "Who is the Training and Placement Officer?",
            "Who is the TPO of VCTM?",
            "tpo details",
            "tpo name",
            "tpo",
            "who is tpo",
            "training and placement head",
            "Who leads the placement cell?",
            "placement officer name",
            "placement officer",
            "tell me tpo details"
        ]
    },
    {
        "intent": "departments",
        "entity": "VCTM",
        "attribute": "faculty_list",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Faculty",
        "verification_status": "verified",
        "answer": "VCTM has experienced faculty across all departments:\n• **Computer Science:** Dr. Mohammad Haris (HOD), Mr. Yash Tripathi, Mr. Praveen Kumar, Mr. Waseem Khan, Ms. Hemlata Chaudhary, Ms. Sandhya, Mr. Harsh Mathur, Mr. Praveen Sharma, Mr. Jitendra Kumar Singh, Mr. Alok Gupta, Ms. Swati Pandit, Mr. Abdul Sheeraj\n• **Mechanical:** Mr. Umardaraj Khan (HOD), Mr. Santosh Kumar Awasthi, Mr. Sanjeev Sarswat, Mr. Shoaib Sabri, Mr. Faheem Ahmad, Mr. Desh Deepak Verma, Mr. Mohd. Ubaid Khan, Mr. Kuldeep Singh, Dr. Bhanu Prakash, Dr. Sushil Kumar Singh\n• **Civil:** Mr. Sahil Abbas Zaidi (HOD), Mr. Vinit Kumar, Mr. Sonu Mangla, Mr. Jamal Ahmad, Mr. Vishnu Upadyay, Mr. Md Ziya Faruque, Dr. Mohd. Salman Rais, Dr. Priyank Gupta\n• **Electrical:** Dr. Aisha Malik (HOD), Mr. Arvind Kumar, Mr. Jaswat Singh, Mr. Islam Khan, Mr. Yogendra Kumar, Mr. Rachit Arora, Mr. Saurabh Upadhyay, Mr. Basharat Ahmad\n• **Electronics:** Mr. Jai Kishan Singh (HOD), Ms. Aaliya, Mr. Mohan Kumar Sharma, Mr. Paritosh Sharma, Mr. Himanshu Mahour\n• **Applied Sciences:** Dr. Ajay Kumar Mahur (HOD), Dr. Naseem Ahmad Khan (Proctor), Mr. Nitin Rathi, Dr. Manish Agrawal, Dr. Sayed Mohd. Abbas, Ms. Deepika Singh, Dr. Syed Abid Zaki, Dr. Raj Kumar Saraswat, Mr. Dilip Kumar Varshney, Dr. Anil Gupta\n• **MBA:** Mr. Inder Pal Singh (HOD), Dr. Vivek Thakur, Mr. Pragyan Lavania, Ms. Shivani Chaudhary, Ms. Jaya Saraswat, Mr. Ran Vijay Singh",
        "questions": [
            "Who are the faculty members at VCTM?",
            "faculty list",
            "teaching staff at VCTM",
            "professors at VCTM",
            "faculty details",
            "Tell me about the faculty"
        ]
    },

    # =========================================================================
    # 4. COURSES, INTAKE & DURATION
    # =========================================================================
    {
        "intent": "course_details",
        "entity": "VCTM",
        "attribute": "all_courses",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/",
        "verification_status": "verified",
        "answer": "VCTM offers the following AICTE-approved programs:\n• **B.Tech (4 Years):** CSE (60 seats), IT (30 seats), EE (60 seats), ME (60 seats), CE (60 seats), ECE (60 seats), Agricultural Engg (30 seats) — Total: 360 seats\n• **MBA (2 Years):** 60 seats (HR, Marketing, Finance, IT, IB, Operations)\n• **M.Tech (2 Years):** Structural Engineering (24 seats), Production Engineering (24 seats) — Total: 48 seats\n• **MCA:** Master of Computer Applications\n• **Polytechnic Diploma (3 Years):** Civil Engg (60 seats), Mechanical Engg (60 seats) — Total: 120 seats",
        "questions": [
            "What courses are offered at VCTM?",
            "What courses are offered?",
            "List all programs offered at VCTM",
            "courses offered",
            "Which courses can I do in VCTM?",
            "programs at VCTM",
            "What degrees does VCTM offer?",
            "academic programs available",
            "btech mba mtech courses at vctm",
            "Tell me about all courses",
            "what courses are available",
            "available programs",
            "degrees in vctm"
        ]
    },
    {
        "intent": "course_details",
        "entity": "B.Tech",
        "attribute": "btech_branches",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/courses/B.Tech",
        "verification_status": "verified",
        "answer": "B.Tech is offered in 7 branches at VCTM: Computer Science & Engineering (CSE), Information Technology (IT), Electrical Engineering (EE), Mechanical Engineering (ME), Civil Engineering (CE), Electronics & Communication Engineering (ECE), and Agricultural Engineering.",
        "questions": [
            "What branches are in B.Tech?",
            "btech branches",
            "engineering branches available",
            "Which branches are offered in B.Tech at VCTM?",
            "list of btech streams",
            "btech streams available"
        ]
    },
    {
        "intent": "course_details",
        "entity": "B.Tech",
        "attribute": "minor_degree",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/courses/B.Tech",
        "verification_status": "verified",
        "answer": "Yes, under NEP 2020 and AKTU guidelines, B.Tech students can earn a Minor Degree in emerging areas like Artificial Intelligence & Machine Learning, Data Science, Internet of Things (IoT), Robotics, Electric Vehicles, and Energy Engineering alongside their parent branch.",
        "questions": [
            "Is minor degree offered in B.Tech?",
            "minor degree course",
            "NEP minor degree in engineering",
            "Can I do minor degree in AI ML or Data Science?",
            "minor degree options",
            "minor specialization btech"
        ]
    },
    {
        "intent": "course_details",
        "entity": "B.Tech CSE",
        "attribute": "intake",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/courses/B.Tech",
        "verification_status": "verified",
        "answer": "The approved intake for **B.Tech in Computer Science & Engineering (CSE)** is **60 seats**.",
        "questions": [
            "What is the intake for B.Tech CSE?",
            "How many seats are there in B.Tech Computer Science?",
            "cse seats",
            "B.Tech CSE intake",
            "seat intake for computer science",
            "How many students can take admission in CSE?",
            "intake in cse",
            "seats in btech cse"
        ]
    },
    {
        "intent": "course_details",
        "entity": "B.Tech CSE",
        "attribute": "duration",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/courses/B.Tech",
        "verification_status": "verified",
        "answer": "The duration of the **B.Tech Computer Science & Engineering** program is **4 Years (8 Semesters)**.",
        "questions": [
            "What is the duration of B.Tech CSE?",
            "How many years is B.Tech computer science?",
            "btech cse duration",
            "How many semesters in B.Tech CSE?",
            "how long is cse course"
        ]
    },
    {
        "intent": "course_details",
        "entity": "B.Tech IT",
        "attribute": "intake",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/courses/B.Tech",
        "verification_status": "verified",
        "answer": "The approved intake for **B.Tech in Information Technology (IT)** is **30 seats** (Duration: 4 Years).",
        "questions": [
            "What is the intake for B.Tech IT?",
            "How many seats in Information Technology?",
            "btech it seats",
            "IT department intake",
            "seats in it branch"
        ]
    },
    {
        "intent": "course_details",
        "entity": "B.Tech Mechanical",
        "attribute": "intake",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/courses/B.Tech",
        "verification_status": "verified",
        "answer": "The approved intake for **B.Tech in Mechanical Engineering** is **60 seats**.",
        "questions": [
            "What is the intake for B.Tech Mechanical Engineering?",
            "How many seats in Mechanical Engineering?",
            "mechanical engineering seats",
            "btech mechanical intake",
            "seats in mechanical"
        ]
    },
    {
        "intent": "course_details",
        "entity": "B.Tech Mechanical",
        "attribute": "duration",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/courses/B.Tech",
        "verification_status": "verified",
        "answer": "The duration of the **B.Tech in Mechanical Engineering** program is **4 Years (8 Semesters)**.",
        "questions": [
            "What is the duration of B.Tech Mechanical?",
            "How many years is Mechanical Engineering?",
            "mechanical engineering duration",
            "how long is mechanical course"
        ]
    },
    {
        "intent": "course_details",
        "entity": "B.Tech Civil",
        "attribute": "intake",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/courses/B.Tech",
        "verification_status": "verified",
        "answer": "The approved intake for **B.Tech in Civil Engineering** is **60 seats** (Duration: 4 Years).",
        "questions": [
            "What is the intake for B.Tech Civil Engineering?",
            "civil engineering seats",
            "How many seats in Civil Engineering?",
            "btech civil intake",
            "seats in civil"
        ]
    },
    {
        "intent": "course_details",
        "entity": "B.Tech ECE",
        "attribute": "intake",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/courses/B.Tech",
        "verification_status": "verified",
        "answer": "The approved intake for **B.Tech in Electronics & Communication Engineering (ECE)** is **60 seats** (Duration: 4 Years).",
        "questions": [
            "What is the intake for B.Tech ECE?",
            "ece intake",
            "How many seats in Electronics and Communication?",
            "btech ece seats",
            "seats in ece"
        ]
    },
    {
        "intent": "course_details",
        "entity": "B.Tech Electrical",
        "attribute": "intake",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/courses/B.Tech",
        "verification_status": "verified",
        "answer": "The approved intake for **B.Tech in Electrical Engineering** is **60 seats** (Duration: 4 Years).",
        "questions": [
            "What is the intake for B.Tech Electrical Engineering?",
            "electrical engineering seats",
            "How many seats in Electrical Engineering?",
            "btech ee intake",
            "seats in ee"
        ]
    },
    {
        "intent": "course_details",
        "entity": "B.Tech Agricultural",
        "attribute": "intake",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/courses/B.Tech",
        "verification_status": "verified",
        "answer": "The approved intake for **B.Tech in Agricultural Engineering** is **30 seats** (Duration: 4 Years).",
        "questions": [
            "What is the intake for B.Tech Agricultural Engineering?",
            "agricultural engineering seats",
            "How many seats in Agricultural Engineering?",
            "btech agricultural intake",
            "seats in agriculture engineering"
        ]
    },
    {
        "intent": "course_details",
        "entity": "B.Tech",
        "attribute": "total_intake",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/courses/B.Tech",
        "verification_status": "verified",
        "answer": "The total approved intake for **B.Tech across all 7 branches** is **360 seats** (CSE: 60, IT: 30, EE: 60, ME: 60, CE: 60, ECE: 60, Agricultural: 30).",
        "questions": [
            "What is the total intake for B.Tech?",
            "total engineering seats",
            "How many total seats in B.Tech across all branches?",
            "total btech capacity",
            "overall btech seats"
        ]
    },
    {
        "intent": "course_details",
        "entity": "B.Tech",
        "attribute": "duration",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/courses/B.Tech",
        "verification_status": "verified",
        "answer": "The duration of the **B.Tech** program is **4 Years (8 Semesters)**.",
        "questions": [
            "What is the duration of B.Tech?",
            "How many years is B.Tech?",
            "btech duration",
            "How long is engineering course?",
            "how many semesters in btech"
        ]
    },
    {
        "intent": "course_details",
        "entity": "MBA",
        "attribute": "intake",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/courses/MBA",
        "verification_status": "verified",
        "answer": "The sanctioned intake for **Master of Business Administration (MBA)** is **60 seats**.",
        "questions": [
            "What is the intake for MBA?",
            "How many seats are available in MBA?",
            "mba seats",
            "mba intake capacity",
            "total seats in mba",
            "seats in management"
        ]
    },
    {
        "intent": "course_details",
        "entity": "MBA",
        "attribute": "duration",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/courses/MBA",
        "verification_status": "verified",
        "answer": "The duration of the **MBA** program is **2 Years (4 Semesters)**.",
        "questions": [
            "What is the duration of MBA?",
            "How many years is the MBA course?",
            "mba duration",
            "how long is mba"
        ]
    },
    {
        "intent": "course_details",
        "entity": "MBA",
        "attribute": "specializations",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/courses/MBA",
        "verification_status": "verified",
        "answer": "The specializations offered in **MBA** are: **Human Resource Development, Marketing, Finance, Information Technology, International Business, and Operation Management**.",
        "questions": [
            "What specializations are offered in MBA?",
            "mba specializations",
            "What streams are available in MBA at VCTM?",
            "Can I do MBA in HR or Finance at VCTM?",
            "mba subjects",
            "mba streams"
        ]
    },
    {
        "intent": "course_details",
        "entity": "MCA",
        "attribute": "intake",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/courses/MCA",
        "verification_status": "officially_unavailable",
        "answer": "The sanctioned seat intake for MCA is not officially published on the VCTM website.",
        "questions": [
            "What is the intake for MCA?",
            "How many seats in MCA?",
            "mca seats",
            "mca intake",
            "seats in mca"
        ]
    },
    {
        "intent": "course_details",
        "entity": "MCA",
        "attribute": "duration",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/courses/MCA",
        "verification_status": "verified",
        "answer": "The duration of the **MCA** program is **2 Years (4 Semesters)**.",
        "questions": [
            "What is the duration of MCA?",
            "How many years is MCA?",
            "mca duration",
            "how long is mca"
        ]
    },
    {
        "intent": "course_details",
        "entity": "M.Tech",
        "attribute": "intake",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/courses/M.Tech",
        "verification_status": "verified",
        "answer": "VCTM offers **M.Tech (2 Years)** with the following approved intake:\n• **Structural Engineering:** **24 seats**\n• **Production Engineering:** **24 seats**\n• **Total M.Tech Intake:** **48 seats**",
        "questions": [
            "What is the intake for M.Tech?",
            "How many seats in M.Tech?",
            "mtech seats",
            "What specializations are available in M.Tech?",
            "mtech intake",
            "seats in mtech",
            "structural engineering seats",
            "production engineering seats"
        ]
    },
    {
        "intent": "course_details",
        "entity": "M.Tech",
        "attribute": "duration",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/courses/M.Tech",
        "verification_status": "verified",
        "answer": "The duration of the **M.Tech** program is **2 Years (4 Semesters)**.",
        "questions": [
            "What is the duration of M.Tech?",
            "How long is M.Tech?",
            "mtech duration",
            "how many years in mtech"
        ]
    },
    {
        "intent": "course_details",
        "entity": "Polytechnic Diploma",
        "attribute": "intake",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/courses/Diploma",
        "verification_status": "verified",
        "answer": "The approved intake for **Polytechnic Diploma in Engineering (BTE Code 1628)** is:\n• **Civil Engineering:** **60 seats**\n• **Mechanical Engineering:** **60 seats**\n• **Total Intake:** **120 seats**",
        "questions": [
            "What is the intake for Polytechnic Diploma?",
            "polytechnic seats",
            "How many seats in Diploma engineering?",
            "diploma intake",
            "polytechnic branches and seats",
            "seats in polytechnic diploma"
        ]
    },
    {
        "intent": "course_details",
        "entity": "Polytechnic Diploma",
        "attribute": "duration",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/courses/Diploma",
        "verification_status": "verified",
        "answer": "The duration of the **Polytechnic Diploma in Engineering** is **3 Years (6 Semesters)**, or **2 Years** for Lateral Entry candidates after passing 12th.",
        "questions": [
            "What is the duration of Polytechnic Diploma?",
            "How many years is diploma course?",
            "polytechnic duration",
            "lateral entry diploma duration",
            "how long is diploma"
        ]
    },

    # =========================================================================
    # 5. ELIGIBILITY CRITERIA
    # =========================================================================
    {
        "intent": "eligibility_criteria",
        "entity": "B.Tech",
        "attribute": "eligibility",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/courses/B.Tech",
        "verification_status": "verified",
        "answer": "The eligibility for **B.Tech (1st Year)** is: Passed 10+2 examination with Physics and Mathematics as compulsory subjects along with Chemistry/Biotech/Biology/Technical Vocational subject, in accordance with AKTU / UPTAC guidelines.",
        "questions": [
            "What is the eligibility for B.Tech?",
            "btech eligibility",
            "What are the eligibility criteria for engineering admission?",
            "12th percentage required for B.Tech",
            "Who can join B.Tech at VCTM?",
            "pcm requirements for btech",
            "eligibility criteria for btech",
            "can 12th pass apply for btech"
        ]
    },
    {
        "intent": "eligibility_criteria",
        "entity": "B.Tech Lateral Entry",
        "attribute": "eligibility",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/courses/B.Tech",
        "verification_status": "verified",
        "answer": "The eligibility for **B.Tech Lateral Entry (Direct 2nd Year)** is: A 3-year Polytechnic Diploma in Engineering or a B.Sc. degree with Mathematics, in accordance with AKTU UPTAC regulations.",
        "questions": [
            "What is the eligibility for B.Tech Lateral Entry?",
            "btech lateral entry eligibility",
            "Can diploma holders join B.Tech 2nd year directly?",
            "direct 2nd year btech admission criteria",
            "lateral entry eligibility",
            "lateral entry criteria"
        ]
    },
    {
        "intent": "eligibility_criteria",
        "entity": "MBA",
        "attribute": "eligibility",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/courses/MBA",
        "verification_status": "verified",
        "answer": "The eligibility for **MBA** is: A recognized Bachelor's degree (minimum 3 years duration) in any discipline, as prescribed by AKTU / UPTAC norms.",
        "questions": [
            "What is the eligibility for MBA?",
            "mba eligibility",
            "Who can apply for MBA at VCTM?",
            "graduation marks required for mba",
            "eligibility criteria for mba"
        ]
    },
    {
        "intent": "eligibility_criteria",
        "entity": "MCA",
        "attribute": "eligibility",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/courses/MCA",
        "verification_status": "verified",
        "answer": "The eligibility for **MCA** is: BCA / Bachelor degree in Computer Science Engineering or equivalent, or passed B.Sc./B.Com/B.A. with Mathematics at 10+2 or graduation level, as per AICTE/AKTU norms.",
        "questions": [
            "What is the eligibility for MCA?",
            "mca eligibility",
            "Who can apply for MCA at VCTM?",
            "eligibility criteria for mca",
            "can bca student apply for mca"
        ]
    },
    {
        "intent": "eligibility_criteria",
        "entity": "M.Tech",
        "attribute": "eligibility",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/courses/M.Tech",
        "verification_status": "verified",
        "answer": "The eligibility for **M.Tech** is: Bachelor's degree in Engineering or Technology (or equivalent) in relevant discipline with valid GATE score or qualifying merit.",
        "questions": [
            "What is the eligibility for M.Tech?",
            "mtech eligibility",
            "Who can apply for M.Tech?",
            "gate score requirement for mtech",
            "eligibility criteria for mtech"
        ]
    },
    {
        "intent": "eligibility_criteria",
        "entity": "Polytechnic Diploma",
        "attribute": "eligibility",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/courses/Diploma",
        "verification_status": "verified",
        "answer": "The eligibility for **Polytechnic Diploma** is: 10th High School or equivalent qualification. For Lateral Entry (2nd Year), passing 12th examination is required.",
        "questions": [
            "What is the eligibility for Polytechnic Diploma?",
            "polytechnic eligibility",
            "Who can join diploma at VCTM?",
            "10th marks needed for diploma",
            "diploma eligibility"
        ]
    },

    # =========================================================================
    # 6. FEES STRUCTURE (Official from https://vctm.in/pages/Fee%20Structure)
    # =========================================================================
    {
        "intent": "fees_structure",
        "entity": "B.Tech",
        "attribute": "fee_btech",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Fee%20Structure",
        "verification_status": "verified",
        "answer": "The official tuition fee for **Bachelor of Technology (B.Tech.)** across all streams (CSE, IT, EE, ME, CE, ECE, Agricultural) is **₹55,000 per year**.",
        "questions": [
            "What is the fee for B.Tech?",
            "What is the fee for B.Tech CSE?",
            "btech fee",
            "btech cse fees",
            "How much does B.Tech cost per year?",
            "annual tuition fee for engineering",
            "btech fees structure",
            "cost of btech",
            "btech tuition"
        ]
    },
    {
        "intent": "fees_structure",
        "entity": "MBA",
        "attribute": "fee_mba",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Fee%20Structure",
        "verification_status": "verified",
        "answer": "The official tuition fee for **Master of Business Administration (MBA)** is **₹59,700 per year** (for HR, Marketing, Finance, IT, IB, Operations).",
        "questions": [
            "What is the fee for MBA?",
            "mba fee",
            "mba annual fee",
            "How much does MBA cost per year at VCTM?",
            "mba tuition fees",
            "cost of mba"
        ]
    },
    {
        "intent": "fees_structure",
        "entity": "M.Tech",
        "attribute": "fee_mtech",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Fee%20Structure",
        "verification_status": "verified",
        "answer": "The official tuition fee for **Master of Technology (M.Tech.)** is **₹57,500 per year** (Production Engineering & Structural Engineering).",
        "questions": [
            "What is the fee for M.Tech?",
            "mtech fee",
            "How much does M.Tech cost per year?",
            "mtech annual fee",
            "cost of mtech"
        ]
    },
    {
        "intent": "fees_structure",
        "entity": "MCA",
        "attribute": "fee_mca",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Fee%20Structure",
        "verification_status": "verified",
        "answer": "The official tuition fee for **Master of Computer Applications (MCA)** is **₹55,000 per year**.",
        "questions": [
            "What is the fee for MCA?",
            "mca fee",
            "How much does MCA cost per year?",
            "mca annual tuition fee",
            "cost of mca"
        ]
    },
    {
        "intent": "fees_structure",
        "entity": "Polytechnic Diploma",
        "attribute": "fee_diploma",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Fee%20Structure",
        "verification_status": "verified",
        "answer": "The official tuition fee for **Diploma in Engineering (Polytechnic)** is **₹30,150 per year** (Civil & Mechanical Engineering).",
        "questions": [
            "What is the fee for Polytechnic Diploma?",
            "diploma fee",
            "polytechnic fees",
            "How much does diploma cost per year?",
            "polytechnic diploma tuition fee",
            "cost of diploma"
        ]
    },
    {
        "intent": "fees_structure",
        "entity": "VCTM",
        "attribute": "fee_policy",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Fee%20Structure",
        "verification_status": "verified",
        "answer": "Official Annual Fee Structure:\n• **B.Tech:** ₹55,000 / year\n• **MBA:** ₹59,700 / year\n• **M.Tech:** ₹57,500 / year\n• **MCA:** ₹55,000 / year\n• **Polytechnic Diploma:** ₹30,150 / year\n• **Additional Fees:** Prospectus: ₹1,000/-, Cultural Fee: ₹500/-, Exam Fee: As per University Rules",
        "questions": [
            "What is the complete fee structure of VCTM?",
            "fee structure",
            "fees",
            "Tell me the fees for all courses",
            "annual fees",
            "college fees list",
            "how much are the fees",
            "all courses fee structure"
        ]
    },
    {
        "intent": "fees_structure",
        "entity": "VCTM",
        "attribute": "installment_policy",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Fee%20Structure",
        "verification_status": "verified",
        "answer": "Academic tuition fees can be paid in installments at the college accounts office. For specific payment installment schedules and online payment details, please contact the Accounts Section.",
        "questions": [
            "Can I pay fees in installments?",
            "installment facility for fees",
            "fee payment options",
            "semester wise fee payment",
            "can i pay fees in parts"
        ]
    },
    {
        "intent": "fees_structure",
        "entity": "VCTM",
        "attribute": "additional_fees",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Fee%20Structure",
        "verification_status": "verified",
        "answer": "Additional official charges listed in the VCTM Fee Structure are:\n• **Prospectus:** ₹1,000/-\n• **Cultural Fee:** ₹500/-\n• **Exam Fee:** As per University Rules",
        "questions": [
            "What are the additional fees?",
            "prospectus fee",
            "cultural fee",
            "exam fee charges",
            "other charges besides tuition",
            "extra fees"
        ]
    },

    # =========================================================================
    # 7. PLACEMENTS (Strictly Audited - Verified Only)
    # =========================================================================
    {
        "intent": "placements",
        "entity": "VCTM Placement Cell",
        "attribute": "highest_package",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Placement%20Records",
        "verification_status": "third_party_reported",
        "answer": "A single official highest-package figure is not officially published by VCTM's placement pages or established by its placement records. A student review has reported approximately ₹4-₹5 LPA; this is a third-party/student-reported figure, not an official VCTM statistic, and may vary by batch, course, and year.",
        "questions": [
            "What is the highest package in placement?",
            "What is the highest package at VCTM?",
            "What is the highest package?",
            "highest package",
            "highest package in placement",
            "What was the highest package offered?",
            "highest package offered at VCTM",
            "highest salary",
            "maximum package in campus placement",
            "highest package in CSE",
            "What's the maximum package?",
            "Tell me the top package.",
            "top package",
            "maximum package",
            "max package",
            "highest salary package",
            "highest offer"
        ]
    },
    {
        "intent": "placements",
        "entity": "VCTM Placement Cell",
        "attribute": "average_package",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Placement%20Records",
        "verification_status": "third_party_reported",
        "answer": "The average package is not officially published by VCTM. Student/third-party reports cite approximately ₹2.3-₹2.5 LPA; this is not an official VCTM statistic, may vary by batch, course, and year, and other reports give different figures.",
        "questions": [
            "What is the average package in placement?",
            "What is the average package at VCTM?",
            "What is the average package?",
            "average package",
            "average package in placement",
            "What is the average salary package for B.Tech students?",
            "average salary at VCTM",
            "average placement package",
            "mean salary package",
            "normal package offered",
            "avg package",
            "average package in cse",
            "average salary"
        ]
    },
    {
        "intent": "placements",
        "entity": "VCTM Placement Cell",
        "attribute": "placement_rate",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Career%20Resource%20Center%20Department",
        "verification_status": "third_party_reported",
        "answer": "VCTM does not appear to publish a single official placement-rate statistic on its placement pages. A student/third-party report has mentioned around 60%, but this should be treated as a reported figure rather than an official VCTM statistic; figures may vary by batch, course, and year.",
        "questions": [
            "What is the placement percentage at VCTM?",
            "placement rate",
            "What is the placement rate of VCTM?",
            "placement percentage in CSE",
            "How many percent students get placed?",
            "placement success rate",
            "placement percentage"
        ]
    },
    {
        "intent": "placements",
        "entity": "VCTM Placement Cell",
        "attribute": "lowest_package",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Placement%20Records",
        "verification_status": "third_party_reported",
        "answer": "A student/third-party report has mentioned a lowest package of approximately ₹1.2 LPA. This is not an official VCTM statistic and may vary by batch, course, and year; other student/third-party reports give different figures.",
        "questions": [
            "What is the lowest package reported at VCTM?"
        ]
    },
    {
        "intent": "placements",
        "entity": "VCTM Placement Cell",
        "attribute": "students_placed",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Placement%20Records",
        "verification_status": "officially_unavailable",
        "answer": "The total number of students placed for academic sessions is not officially published on the VCTM website.",
        "questions": [
            "How many students were placed from VCTM?",
            "total students placed",
            "number of students placed in campus drives",
            "students placed count",
            "how many students got jobs",
            "total placements count"
        ]
    },
    {
        "intent": "placements",
        "entity": "VCTM Placement Cell",
        "attribute": "academic_year",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Placement%20Records",
        "verification_status": "officially_unavailable",
        "answer": "Academic year-wise batch placement reports are not officially published on the VCTM website.",
        "questions": [
            "Which academic year placement statistics are available?",
            "placement statistics by year",
            "placement batch report",
            "year wise placement record",
            "academic year placements"
        ]
    },
    {
        "intent": "placements",
        "entity": "VCTM Placement Cell",
        "attribute": "recruiters",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Our%20Recruiter%20and%20Associates",
        "verification_status": "verified",
        "answer": "VCTM's official placement records list student names, courses, and recruiting companies. Companies appearing in the official records include Tech Mahindra, Amazon Pay, Axis Bank, Bajaj Motors, Yazaki India, L&T, Capgemini, C-Core Technologies, UV Solutions, SKD Properties & Constructions, KP Reliable Technique India, Ashok Auto Sales, Just Dial, NSS Technology, Tanishq, DNJ Infotech, Collabera, Mitsuba Sical India, MEP Solutions, Square Yard, Indian Oil, TKQ India, Voltrans, Motherson Automotive Tech, NetAmbit, TYM SE India, Yuva Shakti, and Zeneva Crop Science. This is a list of companies present in the records, not a guarantee of current or future recruitment.",
        "questions": [
            "Which companies visit VCTM for placements?",
            "recruiters",
            "top recruiters",
            "Who are the top recruiters at VCTM?",
            "companies visiting VCTM for recruitment",
            "Does TCS or Infosys or IBM hire from VCTM?",
            "placement companies list",
            "placement partners",
            "visiting companies"
        ]
    },
    {
        "intent": "placements",
        "entity": "VCTM Placement Cell",
        "attribute": "branch_wise",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Our%20Recruiter%20and%20Associates",
        "verification_status": "verified",
        "answer": "Official branch-wise recruitment alignment:\n• **CSE / IT / ECE:** IBM, Wipro, L&T Infotech, HCL, Microsoft, Samsung, Accenture, Tata Communications\n• **Civil & Mechanical:** Indus Towers, APCO Infratech, Portwise, Bajaj Motors, 21st Century Constructions\n• **Electrical & Electronics:** Hero Electric, Elux\n• **MBA:** IndiaMART, Axis Bank, Amazon Pay, Just Dial, Ashok Auto Sales",
        "questions": [
            "What are the branch-wise placement statistics?",
            "branch wise placements",
            "Which companies recruit mechanical or civil engineering students?",
            "placement opportunities for CSE vs ME",
            "branch wise recruitment"
        ]
    },
    {
        "intent": "placements",
        "entity": "VCTM Placement Cell",
        "attribute": "internships",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Career%20Resource%20Center%20Department",
        "verification_status": "verified",
        "answer": "The Career Resource Center (CRC) Department coordinates summer training and internship programs to facilitate industry connections for students. Specific mandatory durations are determined as per university curriculum.",
        "questions": [
            "Does VCTM provide internships?",
            "internship opportunities",
            "What is the duration of internship at VCTM?",
            "summer training programs",
            "internship duration",
            "internship support",
            "are internships available"
        ]
    },
    {
        "intent": "placements",
        "entity": "VCTM Placement Cell",
        "attribute": "overview",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Career%20Resource%20Center%20Department",
        "verification_status": "verified",
        "answer": "The Dedicated Career Resource Center (CRC), led by Training & Placement Officer Dr. Vivek Thakur, provides career counselling, resume preparation, mock interviews, group discussions, presentation workshops, technical tests, recruitment coordination, internships, and industry interaction. Official placement activities include career counselling sessions; soft-skill and technical-skill development; group discussion, interview, and online-test preparation; campus placements; industry meets and expert lectures; 6-8 week industrial training; semester industrial visits; student projects; faculty industry training; career-orientation programmes; and entrepreneurship development. VCTM publishes placement records listing student names, courses, and recruiting companies. Examples from those records include Tech Mahindra, Amazon Pay, Axis Bank, Bajaj Motors, Yazaki India, L&T, Capgemini, and C-Core Technologies. VCTM's official placement records do not establish a single official placement rate or highest/average package.",
        "questions": [
            "How are the placements at VCTM?",
            "placements",
            "Tell me about placements in VCTM",
            "placement overview",
            "Is placement good in VCTM?",
            "placement records"
        ]
    },
    {
        "intent": "placements",
        "entity": "VCTM Placement Cell",
        "attribute": "overview",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Placement%20Activities",
        "verification_status": "verified",
        "answer": "The Dedicated Career Resource Center (CRC), led by Training & Placement Officer Dr. Vivek Thakur, provides career counselling, resume preparation, mock interviews, group discussions, presentation workshops, technical tests, recruitment coordination, internships, and industry interaction. Official placement activities include career counselling sessions; soft-skill and technical-skill development; group discussion, interview, and online-test preparation; campus placements; industry meets and expert lectures; 6-8 week industrial training; semester industrial visits; student projects; faculty industry training; career-orientation programmes; and entrepreneurship development. VCTM publishes placement records listing student names, courses, and recruiting companies. Examples from those records include Tech Mahindra, Amazon Pay, Axis Bank, Bajaj Motors, Yazaki India, L&T, Capgemini, and C-Core Technologies.",
        "questions": [
            "What placement activities does VCTM offer?"
        ]
    },

    # =========================================================================
    # 8. ADMISSIONS
    # =========================================================================
    {
        "intent": "admissions",
        "entity": "VCTM",
        "attribute": "admission_process",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Admission%20Cell",
        "verification_status": "verified",
        "answer": "Admissions at VCTM are conducted through:\n1. **Counseling Quota (85% seats):** Through AKTU UPTAC online counseling (for B.Tech/MBA/MCA/M.Tech) and JEECUP (for Polytechnic Diploma)\n2. **Direct Merit Quota (15% seats):** Based on qualifying examination merit and direct application at the college Admission Cell",
        "questions": [
            "What is the admission process at VCTM?",
            "how to take admission",
            "admission procedure",
            "How do I apply for admission in VCTM?",
            "counseling procedure for VCTM",
            "admission steps",
            "how to enroll in vctm"
        ]
    },
    {
        "intent": "admissions",
        "entity": "VCTM",
        "attribute": "direct_admission",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Admission%20Cell",
        "verification_status": "verified",
        "answer": "Yes, direct merit admission (Management Quota - 15% seats) is available for eligible candidates based on qualifying marks as per AKTU/BTE norms.",
        "questions": [
            "Can I get direct admission in VCTM?",
            "direct admission",
            "Is direct admission available?",
            "management quota admission",
            "direct admission in B.Tech without JEE Main",
            "management quota seats"
        ]
    },
    {
        "intent": "admissions",
        "entity": "VCTM",
        "attribute": "admission_cell",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Admission%20Cell",
        "verification_status": "verified",
        "answer": "The Head of Admission Cell is **Dr. Vivek Thakur** (Mob: +91 7906487855). Admission Cell Committee members include:\n• Dr. Sushil Kumar Singh (+91 9454010846)\n• Mr. Yash Tripathi (+91 9756079797)\n• Mr. Kuldeep Singh (+91 6396675829)\n• Ms. Aaliya (+91 7906638016)",
        "questions": [
            "Who is in charge of admission cell?",
            "admission cell members",
            "Who is Head of Admission Cell at VCTM?",
            "admission contact numbers",
            "admission committee",
            "admission helpline numbers"
        ]
    },
    {
        "intent": "admissions",
        "entity": "VCTM",
        "attribute": "documents_required",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Admission%20Cell",
        "verification_status": "verified",
        "answer": "Documents required for admission:\n1. 10th & 12th Marksheet and Passing Certificate\n2. JEE Main / CUET / JEECUP Scorecard (if applicable)\n3. Transfer Certificate (TC) & Migration Certificate\n4. Aadhaar Card & Domicile Certificate (for UP residents)\n5. Category Certificate (SC/ST/OBC/EWS if applicable)\n6. Recent Passport Size Photographs",
        "questions": [
            "What documents are required for admission?",
            "documents required for admission",
            "admission documents list",
            "What certificates do I need to bring for admission?",
            "certificates needed for admission"
        ]
    },

    # =========================================================================
    # 9. CAMPUS FACILITIES, HOSTEL & TRANSPORTATION
    # =========================================================================
    {
        "intent": "hostel_mess",
        "entity": "Girls Hostel",
        "attribute": "curfew_girls",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Hostel",
        "verification_status": "officially_unavailable",
        "answer": "Hostel curfew timings for the Girls Hostel are not officially published on the VCTM website.",
        "questions": [
            "What is the curfew time for Girls Hostel?",
            "girls hostel curfew",
            "entry time for girls hostel",
            "hostel closing time for girls",
            "curfew timing for girls"
        ]
    },
    {
        "intent": "hostel_mess",
        "entity": "Boys Hostel",
        "attribute": "curfew_boys",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Hostel",
        "verification_status": "officially_unavailable",
        "answer": "Hostel curfew timings for the Boys Hostel are not officially published on the VCTM website.",
        "questions": [
            "What is the curfew time for Boys Hostel?",
            "boys hostel curfew",
            "entry time for boys hostel",
            "gate closing time for hostel",
            "curfew timing for boys"
        ]
    },
    {
        "intent": "hostel_mess",
        "entity": "VCTM Mess",
        "attribute": "mess_food",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Hostel",
        "verification_status": "verified",
        "answer": "The hostel mess at VCTM is run with the active cooperation and involvement of the students. Students receive high-quality, well-balanced, and nutritious vegetarian meals.",
        "questions": [
            "How is the mess food at VCTM?",
            "hostel mess food",
            "Is non-veg food available in mess?",
            "What kind of food is served in hostel mess?",
            "mess facility",
            "food in hostel mess"
        ]
    },
    {
        "intent": "hostel_mess",
        "entity": "VCTM Hostel",
        "attribute": "hostel_fee",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Hostel",
        "verification_status": "officially_unavailable",
        "answer": "Hostel fees are not officially published on the VCTM website. Please contact the VCTM Administration / Accounts Office at +91 94540 10846 or info@vctm.in for official hostel fee details.",
        "questions": [
            "What is the hostel fee?",
            "hostel fees?",
            "hostel fee",
            "How much does hostel accommodation cost?",
            "hostel charges",
            "hostel room rent",
            "cost of hostel",
            "how much is hostel fee?",
            "hostel cost",
            "hostel annual fee",
            "hostel fee structure"
        ]
    },
    {
        "intent": "hostel_mess",
        "entity": "Boys Hostel",
        "attribute": "boys_hostel_fee",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Hostel",
        "verification_status": "officially_unavailable",
        "answer": "Boys hostel fees are not officially published on the VCTM website. Please contact the VCTM Administration / Accounts Office at +91 94540 10846 for current fee details.",
        "questions": [
            "what is hostel fee for boys?",
            "boys hostel fee",
            "boys hostel fees",
            "boys hostel charges",
            "hostel fee for boys",
            "how much is boys hostel fee?",
            "cost of boys hostel"
        ]
    },
    {
        "intent": "hostel_mess",
        "entity": "Girls Hostel",
        "attribute": "girls_hostel_fee",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Hostel",
        "verification_status": "officially_unavailable",
        "answer": "Girls hostel fees are not officially published on the VCTM website. Please contact the VCTM Administration / Accounts Office at +91 94540 10846 for current fee details.",
        "questions": [
            "what is hostel fee for girls?",
            "girls hostel fee",
            "girls hostel fees",
            "girls hostel charges",
            "hostel fee for girls",
            "how much is girls hostel fee?",
            "cost of girls hostel"
        ]
    },
    {
        "intent": "hostel_mess",
        "entity": "VCTM Hostel",
        "attribute": "hostel_facilities",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Hostel",
        "verification_status": "verified",
        "answer": "VCTM provides separate hostels for boys and girls with safe and comfortable living environments, common rooms, games rooms, and sports courts where students can relax and interact.",
        "questions": [
            "What are the hostel facilities?",
            "hostel facilities",
            "hostel amenities",
            "facilities in hostel",
            "amenities in hostel",
            "Does VCTM have hostel facility?",
            "hostel facility"
        ]
    },
    {
        "intent": "hostel_mess",
        "entity": "VCTM Hostel",
        "attribute": "hostel_accommodation",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Hostel",
        "verification_status": "verified",
        "answer": "VCTM provides on-campus accommodation in separate hostels for boys and girls, featuring furnished rooms, round-the-clock security, Wi-Fi connectivity, and residential assistance.",
        "questions": [
            "hostel accommodation",
            "hostel accommodation details",
            "Does VCTM provide accommodation for students?",
            "stay in hostel",
            "student accommodation facilities"
        ]
    },
    {
        "intent": "hostel_mess",
        "entity": "VCTM Hostel",
        "attribute": "hostel_rules",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Hostel",
        "verification_status": "verified",
        "answer": "Hostel rules at VCTM mandate strict adherence to discipline, complete prohibition of ragging, formal permissions and gate passes for leaving campus, and compliance with designated curfew hours.",
        "questions": [
            "hostel rules",
            "What are the rules in hostel?",
            "hostel regulations",
            "hostel discipline rules"
        ]
    },
    {
        "intent": "transportation",
        "entity": "VCTM Bus Fleet",
        "attribute": "transport_facility",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Transportation",
        "verification_status": "verified",
        "answer": "VCTM maintains an extensive fleet of college buses providing safe, reliable, and convenient daily transportation for students and staff across all major routes in Aligarh and neighboring towns.",
        "questions": [
            "transportation facilities",
            "bus facility",
            "Does VCTM provide bus facility?",
            "college transport",
            "transportation",
            "bus service",
            "transport services"
        ]
    },
    {
        "intent": "transportation",
        "entity": "VCTM Bus Fleet",
        "attribute": "bus_routes",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Transportation",
        "verification_status": "verified",
        "answer": "VCTM operates 5 official bus routes for day scholars:\n• **Route 1:** Kalai Bamba, Barautha Neher, Harduaganj, Tala Nagri, PAC, Quarsi, OLF, Tikaram College, Dubey Ka Padao, Old Bus Stand, Masoodabad Chauraha, Sarsol Chauraha, VCTM\n• **Route 2:** Sidhauli, Dhanipur, Mandi, Etah Chungi, Kyampur Mod, Swarnjyanti Nagar, Devi Nagla, Naurangabad, Dubey Ka Padao, Hathras Adda, Khinni Gate, Chirnaji Lal College, Sasni Gate, Rathi Hospital, Agra Flyover, VCTM\n• **Route 3:** Rampur, Kasimpur, Jawan, Chherat, FM Tower, Jamalpur, Dhorra Pulia, Medical Gate, Dodhpur, AMU Circle, Shamshad Market, Firduas Nagar, Baraula Pul, Sarsol Chauraha, VCTM\n• **Route 4:** Gabhana, Chuharpur (Naglia), Pachpedha, VCTM\n• **Route 5:** Kayampur Mode, Quarsi Chauraha, Kela Nagar, Dodhpur, Dorra Pulia, AMU Circle, Samsad Market, Firduas Nagar, Sarsol Chauraha, VCTM",
        "questions": [
            "What are the bus routes of VCTM?",
            "bus routes",
            "bus pickup points",
            "bus stops",
            "What are the stops for college bus?",
            "bus route details"
        ]
    },
    {
        "intent": "facilities_campus",
        "entity": "Central Library",
        "attribute": "library_details",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Central%20Library",
        "verification_status": "verified",
        "answer": "The Central Library at VCTM is a spacious air-conditioned library enriched with over 20,000 books, 100 National and 40 International Journals. It subscribes to INDEST for e-books/e-journals, offers a Book Bank facility, and provides three library cards to each student.",
        "questions": [
            "Tell me about the central library at VCTM",
            "library facility",
            "central library",
            "How many books are in VCTM library?",
            "Is there a library at VCTM?",
            "library journals",
            "book bank facility"
        ]
    },
    {
        "intent": "facilities_campus",
        "entity": "Cafeteria",
        "attribute": "cafeteria_details",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Cafeteria",
        "verification_status": "verified",
        "answer": "VCTM has 2 cafeterias in different blocks of the campus providing healthy and hygienic food, functioning on the 'Pay as you eat' concept.",
        "questions": [
            "Does VCTM have a cafeteria?",
            "cafeteria facility",
            "canteen at VCTM",
            "food court in college",
            "cafeteria"
        ]
    },
    {
        "intent": "facilities_campus",
        "entity": "Auditorium",
        "attribute": "auditorium_details",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Auditorium",
        "verification_status": "verified",
        "answer": "For functions, big meetings, and cultural activities, VCTM has a state-of-the-art audio-visual sound-proof auditorium equipped with surround-sound speakers and a multimedia projector.",
        "questions": [
            "Does VCTM have an auditorium?",
            "auditorium facility",
            "seminar hall",
            "conference hall in college",
            "auditorium"
        ]
    },
    {
        "intent": "facilities_campus",
        "entity": "Student Clubs",
        "attribute": "club_details",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Club",
        "verification_status": "verified",
        "answer": "VCTM offers several student clubs:\n• **Art Club:** Provides paints, brushes, and sheets during college hours for creative expression\n• **Sports Club:** Facilities for football, cricket, basketball, volleyball, badminton, table-tennis\n• **Transcend Club:** Focuses on personality development, debates, and cultural events",
        "questions": [
            "What clubs are there for students?",
            "student clubs",
            "sports club",
            "art club",
            "co curricular activities",
            "extra curricular clubs"
        ]
    },
    {
        "intent": "facilities_campus",
        "entity": "VCTM",
        "attribute": "campus_area",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/About%20College",
        "verification_status": "officially_unavailable",
        "answer": "The campus area in numerical acres is not officially published on the VCTM website.",
        "questions": [
            "What is the campus area of VCTM?",
            "How big is the VCTM campus?",
            "How many acres is VCTM campus?",
            "campus area in acres",
            "VCTM campus size",
            "total campus acreage"
        ]
    },

    # =========================================================================
    # 10. SCHOLARSHIPS & FINANCIAL ASSISTANCE
    # =========================================================================
    {
        "intent": "scholarships",
        "entity": "Scholarship",
        "attribute": "scholarship_eligibility",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Scholarship",
        "verification_status": "verified",
        "answer": "Eligibility for the UP Post-Matric Scholarship Scheme (Social Welfare Department) requires candidates to be UP domiciles belonging to eligible categories (SC/ST/General/OBC/Minority) whose family income falls within the state government threshold. Institutional merit scholarship eligibility criteria are not officially published on the VCTM website.",
        "questions": [
            "eligibility for scholarship?",
            "scholarship eligibility",
            "who is eligible for scholarship?",
            "what are the eligibility criteria for scholarship?",
            "who can get the scholarship?",
            "what do I need to qualify for scholarship?",
            "can I apply for scholarship?",
            "what are the requirements to get scholarship?",
            "to get scholarship what is the eligibility criteria?",
            "scholarship eligibility criteria",
            "how to qualify for scholarship?",
            "requirements to get scholarship",
            "eligibility criteria for scholarship"
        ]
    },
    {
        "intent": "scholarships",
        "entity": "UP Government Scholarship",
        "attribute": "scholarship_up",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/",
        "verification_status": "verified",
        "answer": "Eligible UP domicile students can receive tuition reimbursement under the **UP Post-Matric Scholarship Scheme** (Social Welfare Department) via scholarship.up.gov.in as per state eligibility norms.",
        "questions": [
            "What scholarships are available at VCTM?",
            "scholarships",
            "Can I get UP government scholarship?",
            "up scholarship for btech",
            "fee reimbursement in VCTM",
            "samaj kalyan scholarship",
            "scholarship"
        ]
    },
    {
        "intent": "scholarships",
        "entity": "VCTM Institutional Scholarship",
        "attribute": "scholarship_merit",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/",
        "verification_status": "officially_unavailable",
        "answer": "Institutional merit scholarship percentages or fee waivers are not officially published on the VCTM website.",
        "questions": [
            "Does VCTM offer merit scholarships?",
            "merit scholarship",
            "fee waiver for top rankers",
            "scholarship for 80% marks in 12th",
            "college internal scholarship"
        ]
    },

    # =========================================================================
    # 11. EXAMINATIONS & ATTENDANCE
    # =========================================================================
    {
        "intent": "examinations",
        "entity": "VCTM",
        "attribute": "attendance_rule",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/",
        "verification_status": "verified",
        "answer": "A minimum of **75% attendance** in theory lectures and practical labs is strictly mandatory for all students at VCTM.",
        "questions": [
            "What is the attendance rule at VCTM?",
            "attendance requirement",
            "Is 75% attendance compulsory?",
            "What happens if attendance is below 75%?",
            "attendance policy",
            "minimum attendance required",
            "attendance"
        ]
    },
    {
        "intent": "examinations",
        "entity": "VCTM",
        "attribute": "exam_pattern",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Academic%20Policy",
        "verification_status": "verified",
        "answer": "VCTM follows the semester examination system prescribed by AKTU Lucknow (for degree courses) and BTE UP (for diploma courses), including continuous internal evaluations, sessional examinations, and university end-semester examinations.",
        "questions": [
            "What is the examination pattern at VCTM?",
            "exam pattern",
            "How are exams conducted at VCTM?",
            "sessional exams schedule",
            "semester examination system",
            "examinations",
            "exams"
        ]
    },

    # =========================================================================
    # 12. IMPORTANT STUDENT-RELATED INTENTS (Anti-Ragging, Grievance, Dress Code)
    # =========================================================================
    {
        "intent": "anti_ragging",
        "entity": "VCTM",
        "attribute": "anti_ragging_policy",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Anti%20Ragging",
        "verification_status": "verified",
        "answer": "VCTM strictly enforces a zero-tolerance Anti-Ragging policy in accordance with Supreme Court regulations and UGC guidelines. The college has an active Anti-Ragging Committee and Squad to ensure a safe, harassment-free environment.",
        "questions": [
            "What is the anti ragging policy?",
            "anti ragging",
            "Is ragging banned in VCTM?",
            "anti ragging committee",
            "ragging complaints",
            "anti ragging rules"
        ]
    },
    {
        "intent": "grievance_cell",
        "entity": "VCTM",
        "attribute": "grievance_redressal",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/Grievance%20Cell",
        "verification_status": "verified",
        "answer": "VCTM has an active Grievance Redressal Cell and online grievance form at vctm.in to address and resolve concerns of students, faculty, and staff in a fair and impartial manner.",
        "questions": [
            "How to register a grievance?",
            "grievance cell",
            "student grievance redressal",
            "how to complain about an issue in college",
            "grievance form"
        ]
    },
    {
        "intent": "dress_code",
        "entity": "VCTM",
        "attribute": "dress_code_mandate",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/",
        "verification_status": "verified",
        "answer": "VCTM prescribes a formal dress code for students to maintain discipline and professional decorum on campus as per official college notices.",
        "questions": [
            "What is the dress code at VCTM?",
            "dress code",
            "Is uniform compulsory at VCTM?",
            "college uniform rules",
            "uniform policy"
        ]
    },

    # =========================================================================
    # 13. CONTACT & LOCATION
    # =========================================================================
    {
        "intent": "contact_details",
        "entity": "VCTM",
        "attribute": "phone",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/contact/",
        "verification_status": "verified",
        "answer": "The official helpline numbers for VCTM are **+91 94540 10846, +91 79064 87855, and +91 97560 79797**.",
        "questions": [
            "What is the contact number of VCTM?",
            "phone number",
            "contact number",
            "VCTM helpline",
            "How can I call VCTM college?",
            "admission helpline phone number",
            "contact details",
            "phone"
        ]
    },
    {
        "intent": "contact_details",
        "entity": "VCTM",
        "attribute": "email",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/contact/",
        "verification_status": "verified",
        "answer": "The official email address of VCTM is **vctmaligarh@gmail.com**.",
        "questions": [
            "What is the official email of VCTM?",
            "email address",
            "VCTM email",
            "How can I email the college?",
            "email"
        ]
    },
    {
        "intent": "contact_details",
        "entity": "VCTM",
        "attribute": "website",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/",
        "verification_status": "verified",
        "answer": "The official website of VCTM is **https://vctm.in**.",
        "questions": [
            "What is the official website of VCTM?",
            "website",
            "VCTM web link",
            "official portal URL",
            "web address"
        ]
    },
    {
        "intent": "location",
        "entity": "VCTM",
        "attribute": "address",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/contact/",
        "verification_status": "verified",
        "answer": "VCTM is located at **Mathura Bypass, Near Khair Road, 500 meters from Nada Pul, Aligarh - 202002, Uttar Pradesh**.\n(Registered Office: 5/148, Issapur Colony, Banna Devi, G.T Road, Aligarh - 202001).",
        "questions": [
            "Where is VCTM located?",
            "address",
            "What is the address of VCTM Aligarh?",
            "How to reach VCTM?",
            "Where is Vivekananda college in Aligarh?",
            "college location",
            "location"
        ]
    },
    {
        "intent": "location",
        "entity": "VCTM",
        "attribute": "distance_station",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/pages/About%20College",
        "verification_status": "verified",
        "answer": "VCTM is located nearly **3 Km** from the main city of Aligarh, about **5 Km** from AMU campus, and not more than 100 Km from the NCR zone, situated 500 meters from Nada Pul on Mathura Bypass.",
        "questions": [
            "How far is VCTM from Aligarh city?",
            "distance from railway station",
            "distance from AMU",
            "How far is VCTM from Aligarh Junction?",
            "distance to college"
        ]
    },
    {
        "intent": "contact_details",
        "entity": "VCTM",
        "attribute": "working_hours",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/contact/",
        "verification_status": "verified",
        "answer": "For admission and academic inquiries, VCTM helpline numbers (+91 94540 10846, +91 79064 87855, +91 97560 79797) and email (vctmaligarh@gmail.com) are accessible during working hours.",
        "questions": [
            "What are the office hours of VCTM?",
            "working hours",
            "When can I visit the college campus?",
            "admission office timings",
            "college timings"
        ]
    },

    # =========================================================================
    # 14. DEDICATED CONVERSATION & FALLBACK INTENTS
    # =========================================================================
    {
        "intent": "greeting",
        "entity": "VCTM",
        "attribute": "greeting",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/",
        "verification_status": "verified",
        "answer": "Hello! Welcome to Vivekananda College of Technology & Management (VCTM, Aligarh · AKTU Code: 340, BTE Code: 1628). How can I help you today?",
        "questions": [
            "hi",
            "hello",
            "hey",
            "hey there",
            "good morning",
            "good afternoon",
            "good evening",
            "namaste",
            "hi there",
            "hello bot",
            "greetings",
            "start chat"
        ]
    },
    {
        "intent": "thanks",
        "entity": "VCTM",
        "attribute": "thanks",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/",
        "verification_status": "verified",
        "answer": "You're welcome! Feel free to ask if you have any more questions about VCTM courses, admissions, or campus facilities.",
        "questions": [
            "thank you",
            "thanks",
            "thank you so much",
            "thanks a lot",
            "thx",
            "thankyou",
            "appreciate it",
            "thanks for your help",
            "many thanks",
            "ok",
            "okay",
            "got it",
            "understood",
            "alright",
            "noted"
        ]
    },
    {
        "intent": "goodbye",
        "entity": "VCTM",
        "attribute": "goodbye",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/",
        "verification_status": "verified",
        "answer": "Goodbye! Wishing you all the best with your studies and admission process. Have a great day!",
        "questions": [
            "bye",
            "goodbye",
            "see you later",
            "bye bye",
            "exit",
            "quit",
            "have a good day",
            "talk to you later",
            "cya"
        ]
    },
    {
        "intent": "fallback",
        "entity": "VCTM",
        "attribute": "fallback",
        "academic_year": "2025-2026",
        "source_url": "https://vctm.in/",
        "verification_status": "verified",
        "answer": "This specific information is not available in the verified VCTM dataset. For official assistance, please contact the VCTM Admission Cell: +91 94540 10846 / +91 79064 87855 / +91 97560 79797, or email vctmaligarh@gmail.com.",
        "questions": [
            "tell me about something unrelated",
            "who won the world cup",
            "what is the weather today",
            "random question",
            "can you write a poem",
            "xyz nonsense text 123",
            "tell me a joke",
            "what is the capital of france",
            "how to cook pasta",
            "asdfghjkl qwertyuiop"
        ]
    }
]

def build_datasets():
    """Generates the audited verified QA dataset, ML training dataset, and frontend TS datasets."""
    os.makedirs(DATA_DIR, exist_ok=True)
    
    qa_records: List[Dict] = []
    training_samples: List[Dict] = []
    
    for entry in VERIFIED_ENTRIES:
        ans = entry["answer"]
        intent = entry["intent"]
        entity = entry["entity"]
        attr = entry["attribute"]
        year = entry["academic_year"]
        url = entry["source_url"]
        status = entry["verification_status"]
        
        for q in entry["questions"]:
            clean_q = q.strip()
            if not clean_q:
                continue
            qa_records.append({
                "question": clean_q,
                "answer": ans,
                "intent": intent,
                "entity": entity,
                "attribute": attr,
                "academic_year": year,
                "source_url": url,
                "verification_status": status
            })
            training_samples.append({
                "text": clean_q,
                "intent": intent
            })
            
    # Write vctm_verified_qa.json
    with open(QA_DATASET_FILE, "w", encoding="utf-8") as f:
        json.dump(qa_records, f, indent=2, ensure_ascii=False)
    print(f"Saved {len(qa_records)} verified Q&A records to {QA_DATASET_FILE}")
    
    # Write training_dataset.json for ML training
    with open(TRAINING_FILE, "w", encoding="utf-8") as f:
        json.dump(training_samples, f, indent=2, ensure_ascii=False)
    print(f"Saved {len(training_samples)} training samples to {TRAINING_FILE}")
    
    # Write TypeScript version for server / frontend
    ts_code = f"""// vctmVerifiedQA.ts - Auto-generated verified VCTM Q&A dataset
export interface VerifiedQARecord {{
  question: string;
  answer: string;
  intent: string;
  entity: string;
  attribute: string;
  academic_year: string;
  source_url: string;
  verification_status: string;
}}

export const VERIFIED_QA_DATASET: VerifiedQARecord[] = {json.dumps(qa_records, indent=2, ensure_ascii=False)};
"""
    with open(TS_OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(ts_code)
    print(f"Saved TypeScript dataset to {TS_OUTPUT_FILE}")

    # Also sync src/ml/dataset.ts
    dataset_ts = f"""import {{ IntentType, TrainingExample }} from '../types/chatbot';

export const TRAINING_DATASET: TrainingExample[] = {json.dumps(training_samples, indent=2, ensure_ascii=False)};

export const INTENT_DEFINITIONS: Record<IntentType, {{ label: string; description: string }}> = {{
  greeting: {{ label: 'Greeting', description: 'Welcoming students to the enquiry portal' }},
  thanks: {{ label: 'Appreciation', description: 'Student expressing gratitude' }},
  goodbye: {{ label: 'Farewell', description: 'Concluding conversation' }},
  fallback: {{ label: 'Fallback', description: 'Out of domain enquiry' }},
  admissions: {{ label: 'Admissions', description: 'Inquiries about admission process and deadlines' }},
  course_details: {{ label: 'Course Details', description: 'Degree programs, duration, seats, and branches' }},
  eligibility_criteria: {{ label: 'Eligibility', description: 'Academic prerequisites and minimum marks' }},
  fees_structure: {{ label: 'Fees Structure', description: 'Annual and semester fees breakdown' }},
  scholarships: {{ label: 'Scholarships', description: 'Government and institutional financial aid' }},
  hostel_mess: {{ label: 'Hostel & Mess', description: 'Hostel rooms, dining, and campus living' }},
  placements: {{ label: 'Placements', description: 'Campus placements, recruitment drives, and recruiters' }},
  examinations: {{ label: 'Examinations', description: 'Semester exams, sessionals, and attendance requirements' }},
  departments: {{ label: 'Departments & HODs', description: 'Academic faculties, leadership, and department heads' }},
  facilities_campus: {{ label: 'Campus Facilities', description: 'Library, labs, cafeteria, auditorium, and sports' }},
  transportation: {{ label: 'Transportation', description: 'Bus routes, pickup locations, and fleet' }},
  contact_details: {{ label: 'Contact Details', description: 'Helplines, emails, and address' }},
  location: {{ label: 'Location & Distance', description: 'Directions and distances from station' }},
  cutoffs_ranks: {{ label: 'Cutoffs & Counseling', description: 'UPTAC and entrance exam counseling' }},
  general_greeting: {{ label: 'General Greeting', description: 'General greetings' }},
  unknown: {{ label: 'Unknown', description: 'Unclassified query' }},
  anti_ragging: {{ label: 'Anti-Ragging', description: 'Anti-ragging policies and committee' }},
  grievance_cell: {{ label: 'Grievance Cell', description: 'Grievance redressal mechanism' }},
  dress_code: {{ label: 'Dress Code', description: 'Student uniform and dress code mandates' }},
  academic_policy: {{ label: 'Academic Policy', description: 'Academic vision and holistic education policy' }},
}};
"""
    with open(TS_DATASET_FILE, "w", encoding="utf-8") as f:
        f.write(dataset_ts)
    print(f"Saved synced TypeScript dataset to {TS_DATASET_FILE}")

if __name__ == "__main__":
    build_datasets()
