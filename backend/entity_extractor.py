"""
entity_extractor.py - Programme, Entity, and Attribute Extraction Engine

Extracts:
1. Target Entity (e.g. B.Tech CSE, MBA, VCTM, Girls Hostel, VCTM Placement Cell)
2. Requested Attributes (e.g. intake, duration, eligibility, fees, highest_package,
   average_package, placement_rate, recruiters, hod, director, curfew, attendance)
3. Categories, Hostel Types, Quotas, and General Inquiries
"""

import re
from typing import Dict, List, Optional

def is_general_course_query(query: str) -> bool:
    """
    Identifies queries asking for the complete or general list of courses/programmes.
    General queries must NEVER be locked to a single branch or inherit previous branch context.
    """
    q = query.lower().strip()
    # Exclude queries asking about HODs, faculty, or fees
    if re.search(r"\b(hod|head|faculty|fees?|cost|charges)\b", q, re.I):
        return False

    general_patterns = [
        r"\b(what\s+(are\s+the\s+)?courses|courses\s+offered|what\s+programs|programs\s+offered)\b",
        r"\b(list\s+(all\s+)?courses|which\s+(courses|degrees|programs)|all\s+courses|course\s+list)\b",
        r"\b(academic\s+programs|available\s+courses|what\s+can\s+i\s+study|degrees\s+offered)\b",
        r"\b(branches\s+(offered|available)|tell\s+me\s+courses|show\s+courses|all\s+branches)\b",
        r"\b(what\s+are\s+the\s+programmes|programmes\s+offered|available\s+programmes)\b",
    ]
    if any(re.search(pat, q, re.I) for pat in general_patterns):
        return True
    
    # Generic "courses" or "programs" with no specific branch keyword
    if re.search(r"\bcourses?\b|\bprograms?\b|\bdegrees?\b", q, re.I):
        has_specific_branch = bool(re.search(
            r"\b(cse|cs|computer\s+science|mechanical|civil|ece|electronics|electrical|ee|agri|agricultural|mba|mca|polytechnic|diploma|m\.?\s?tech|production|structural)\b",
            q,
            re.I
        ))
        if not has_specific_branch:
            return True

    return False


class EntityExtractor:
    def __init__(self):
        # Specific programs (checked in order of specificity)
        self.course_patterns = [
            # 1. Polytechnic Specific Branches
            (r"\b(polytechnic\s+(diploma\s+(in\s+)?)?(cs|cse|computer\s+science)|polytechnic\s+(cs|cse)|diploma\s+(in\s+)?(cs|cse|computer\s+science))\b", "Polytechnic CS"),
            (r"\b(polytechnic\s+(diploma\s+(in\s+)?)?mech(anical)?|polytechnic\s+mech(anical)?|diploma\s+(in\s+)?mech(anical)?)\b", "Polytechnic Mechanical"),
            (r"\b(polytechnic\s+(diploma\s+(in\s+)?)?civil|polytechnic\s+civil|diploma\s+(in\s+)?civil)\b", "Polytechnic Civil"),
            (r"\b(polytechnic\s+(diploma\s+(in\s+)?)?e(c|ce|lectronics)|polytechnic\s+e(c|ce)|diploma\s+(in\s+)?e(c|ce))\b", "Polytechnic EC"),
            (r"\b(polytechnic\s+(diploma\s+(in\s+)?)?electrical|diploma\s+(in\s+)?electrical)\b", "Polytechnic Electrical"),
            (r"\b(polytechnic\s+diploma|diploma\s+in\s+engineering|polytechnic)\b", "Polytechnic Diploma"),

            # 2. B.Tech Lateral Entry
            (r"\b(lateral\s+entry|direct\s+2nd\s+year|b\.?\s?tech\s+lateral)\b", "B.Tech Lateral Entry"),

            # 3. B.Tech CSE & IT
            (r"\b(b\.?\s?tech\s+cse|b\.?\s?tech\s+cs|btech\s+cse|btech\s+cs|\bcse\b|\bcs\b|computer\s+science\s+engineering|computer\s+science)\b", "B.Tech CSE"),
            (r"\b(b\.?\s?tech\s+it|btech\s+it|information\s+technology)\b", "B.Tech IT"),
            
            # 4. B.Tech Core Branches
            (r"\b(b\.?\s?tech\s+mech(anical)?|btech\s+mech(anical)?|mechanical\s+engineering|mechanical)\b", "B.Tech Mechanical"),
            (r"\b(b\.?\s?tech\s+civil|btech\s+civil|civil\s+engineering|civil)\b", "B.Tech Civil"),
            (r"\b(b\.?\s?tech\s+ece|btech\s+ece|electronics\s+(&|and)\s+comm(unication)?|\bece\b)\b", "B.Tech ECE"),
            (r"\b(b\.?\s?tech\s+ee|btech\s+ee|electrical\s+engineering|\bee\b)\b", "B.Tech Electrical"),
            (r"\b(b\.?\s?tech\s+agri(cultural)?|btech\s+agri(cultural)?|agricultural\s+engineering|agriculture)\b", "B.Tech Agricultural"),
            
            # 5. Management & PG
            (r"\b(mba|master\s+of\s+business\s+administration|management\s+studies)\b", "MBA"),
            (r"\b(mca|master\s+of\s+computer\s+applications)\b", "MCA"),
            (r"\b(m\.?\s?tech\s+production|mtech\s+production|production\s+engineering)\b", "M.Tech Production"),
            (r"\b(m\.?\s?tech\s+structural|mtech\s+structural|structural\s+engineering)\b", "M.Tech Structural"),
            (r"\b(m\.?\s?tech|mtech|master\s+of\s+technology)\b", "M.Tech"),
            (r"\b(applied\s+sciences?|first\s+year\s+hod|sciences?\s+and\s+humanities)\b", "Applied Sciences"),
            
            # 6. Generic B.Tech (only if no specific branch was named)
            (r"\b(b\.?\s?tech|btech|bachelor\s+of\s+technology)\b", "B.Tech"),
            (r"\b(diploma)\b", "Polytechnic Diploma"),
        ]

        # Specific attributes requested in query
        self.attribute_patterns = [
            ("aktu_code", r"\b(aktu\s+code|code\s+for\s+aktu|aktu\s+counseling\s+code|code\s+of\s+vctm\s+in\s+aktu)\b"),
            ("bte_code", r"\b(bte\s+code|bte\s+up\s+code|board\s+of\s+technical\s+education\s+code|polytechnic\s+code)\b"),
            ("institutional_codes", r"\b(college\s+codes?|institutional\s+codes?|aktu\s+and\s+bte\s+codes?|both\s+codes)\b"),
            ("students_placed", r"\b(students?\s+(were\s+|are\s+|got\s+)?placed|how\s+many\s+students\s+(got\s+|were\s+)?placed|total\s+(students\s+)?placed|placed\s+students|placement\s+count|offers\s+made|total\s+placements\s+count)\b"),
            ("total_intake", r"\b(total\s+(b\.?\s?tech\s+)?(seats?|intake|capacity)|overall\s+(b\.?\s?tech\s+)?(seats?|intake)|how\s+many\s+total\s+seats)\b"),
            ("intake", r"\b(intake|seats?|seat\s+capacity|sanctioned\s+intake|how\s+many\s+seats)\b"),
            ("duration", r"\b(duration|how\s+many\s+years|course\s+length|how\s+long\s+is|semesters?)\b"),
            ("scholarship_eligibility", r"\b(eligibility\s+for\s+scholarship|scholarship\s+eligibility|who\s+is\s+eligible\s+for\s+scholarship|eligibility\s+criteria\s+for\s+scholarship|who\s+can\s+get\s+(the\s+)?scholarship|what\s+do\s+i\s+need\s+to\s+qualify\s+for\s+scholarship|can\s+i\s+apply\s+for\s+scholarship|requirements?\s+to\s+get\s+scholarship|to\s+get\s+scholarship\s+what\s+is\s+the\s+eligibility|how\s+to\s+qualify\s+for\s+scholarship)\b"),
            ("eligibility", r"\b(eligibility|criteria|qualification|marks\s+required|minimum\s+percentage|pcm|percentage\s+in\s+12th|who\s+can\s+apply|who\s+is\s+eligible)\b"),
            ("highest_package", r"\b(highest\s+package|highest\s+salary|max\s+package|maximum\s+package|highest\s+offer|top\s+package)\b"),
            ("average_package", r"\b(average\s+package|average\s+salary|mean\s+package|avg\s+package|mean\s+salary|normal\s+package)\b"),
            ("placement_rate", r"\b(placement\s+rate|placement\s+percentage|how\s+many\s+percent\s+placed|placement\s+ratio|placement\s+success\s+rate)\b"),
            ("recruiters", r"\b(recruiters?|companies|visiting\s+companies|who\s+hires|hiring\s+partners|placement\s+partners|tcs|infosys|ibm|wipro)\b"),
            ("internships", r"\b(internships?|summer\s+training|industrial\s+training|internship\s+duration)\b"),
            ("branch_wise", r"\b(branch\s*wise|department\s*wise\s+placement)\b"),
            ("boys_hostel_fee", r"\b(boys?\s+(hostel\s+)?(fees?|charges?|cost|rent)|hostel\s+fees?\s+for\s+boys?|how\s+much\s+is\s+boys?\s+hostel)\b"),
            ("girls_hostel_fee", r"\b(girls?\s+(hostel\s+)?(fees?|charges?|cost|rent)|hostel\s+fees?\s+for\s+girls?|how\s+much\s+is\s+girls?\s+hostel)\b"),
            ("hostel_fee", r"\b(hostel\s+(fees?|charges?|cost|room\s+rent|annual\s+fee)|how\s+much\s+(does\s+)?hostel\s+accommodation\s+cost|how\s+much\s+is\s+hostel(\s+fee)?)\b"),
            ("hostel_rules", r"\b(hostel\s+rules?|hostel\s+regulations?|hostel\s+discipline)\b"),
            ("hostel_accommodation", r"\b(hostel\s+accommodation|accommodation\s+in\s+hostel|stay\s+in\s+hostel)\b"),
            ("hostel_facilities", r"\b(hostel\s+facilities|hostel\s+amenities|facilities\s+in\s+hostel|amenities\s+in\s+hostel)\b"),
            ("fees", r"\b(fee|fees|tuition|cost|charges|installment|annual\s+fee|semester\s+fee)\b"),
            ("additional_fees", r"\b(prospectus|cultural\s+fee|exam\s+fee|extra\s+fees|other\s+charges)\b"),
            ("chairman", r"\b(chairman|er\s+y\s*k\s+sharma)\b"),
            ("vice_chairperson", r"\b(vice\s+chairperson|veena\s+sharma)\b"),
            ("director", r"\b(director|director's\s+name|who\s+is\s+(the\s+)?director)\b"),
            ("registrar", r"\b(registrar|registrar's\s+name|who\s+is\s+(the\s+)?registrar)\b"),
            ("system_administrator", r"\b(system\s+administrator|system\s+admin|it\s+admin)\b"),
            ("all_hods", r"\b(who\s+are\s+the\s+hods?|list\s+(all\s+)?hods?|give\s+me\s+all\s+department\s+hods?|departments?\s+and\s+their\s+hods?|hod\s+details(\s+of\s+all\s+departments?)?|all\s+hods?|list\s+of\s+hods?|department\s+heads?\s+list|who\s+are\s+all\s+the\s+hods?|show\s+all\s+hods?|list\s+all\s+department\s+heads|all\s+department\s+hods)\b"),
            ("proctor_name", r"\b(who\s+is\s+(the\s+)?proctor|proctor\s+of\s+vctm|proctor\s+name|college\s+proctor)\b"),
            ("hod", r"\b(hod|head\s+of\s+department|department\s+head|who\s+heads)\b"),
            ("curfew_girls", r"\b(curfew\s+(time|timing)?\s+(for\s+)?girls|girls?\s+(hostel\s+)?curfew|entry\s+time\s+for\s+girls|closing\s+time\s+for\s+girls|gate\s+closing\s+time\s+for\s+girls)\b"),
            ("curfew_boys", r"\b(curfew\s+(time|timing)?\s+(for\s+)?boys|boys?\s+(hostel\s+)?curfew|entry\s+time\s+for\s+boys|closing\s+time\s+for\s+boys|gate\s+closing\s+time\s+for\s+boys)\b"),
            ("curfew", r"\b(curfew\s+timings?|curfew\s+time|hostel\s+closing\s+time|gate\s+closing\s+time|curfew)\b"),
            ("mess_food", r"\b(mess|food|meals?|dining|vegetarian|lunch|dinner|breakfast)\b"),
            ("hostel_amenities", r"\b(hostel|room|accommodation|warden)\b"),
            ("bus_routes", r"\b(bus\s+routes?|bus\s+pickup\s+points?|bus\s+stops?|routes?\s+of\s+bus)\b"),
            ("transport_facility", r"\b(transportation\s+facilities|bus\s+facility|does\s+vctm\s+provide\s+bus|college\s+transport|bus\s+service|transport\s+service|transportation)\b"),
            ("library_details", r"\b(library|books|journals|book\s+bank|library\s+cards?)\b"),
            ("cafeteria_details", r"\b(cafeteria|canteen|food\s+court)\b"),
            ("auditorium_details", r"\b(auditorium|seminar\s+hall|conference\s+hall)\b"),
            ("club_details", r"\b(clubs?|sports\s+club|art\s+club|transcend\s+club)\b"),
            ("campus_area", r"\b(campus\s+area|campus\s+size|how\s+many\s+acres|how\s+big\s+is\s+(the\s+)?campus)\b"),
            ("scholarship_up", r"\b(up\s+scholarship|samaj\s+kalyan|post\s*matric|fee\s+reimbursement|government\s+scholarship)\b"),
            ("scholarship_merit", r"\b(merit\s+scholarships?|merit\s+base[d]?|fee\s+waiver|fee\s+concession|concession\s+for\s+marks)\b"),
            ("attendance_rule", r"\b(attendance|75%|attendance\s+rule|admit\s+card\s+attendance)\b"),
            ("exam_pattern", r"\b(exam|examination|sessional|internal\s+test|evaluation)\b"),
            ("anti_ragging_policy", r"\b(anti\s*ragging|ragging)\b"),
            ("grievance_redressal", r"\b(grievance|complaint)\b"),
            ("dress_code_mandate", r"\b(dress\s+code|uniform)\b"),
            ("phone", r"\b(phone|mobile|call|number|helpline|contact\s+number)\b"),
            ("email", r"\b(email|mail|e-mail)\b"),
            ("website", r"\b(website|portal|link|url|official\s+site)\b"),
            ("address", r"\b(address|location|where\s+is|landmark|distance|how\s+to\s+reach)\b"),
            ("working_hours", r"\b(working\s+hours|office\s+hours|timings?|open\s+on\s+saturday)\b"),
            ("admission_process", r"\b(admission|how\s+to\s+apply|admission\s+process|procedure|steps)\b"),
            ("direct_admission", r"\b(direct\s+admission|management\s+quota|without\s+jee)\b"),
            ("admission_cell", r"\b(admission\s+cell|admission\s+committee|admission\s+incharge)\b"),
            ("documents_required", r"\b(documents|certificates|what\s+to\s+bring)\b"),
            ("btech_branches", r"\b(btech\s+branches|engineering\s+branches|streams\s+in\s+btech)\b"),
            ("minor_degree", r"\b(minor\s+degree|nep\s+minor)\b"),
            ("specializations", r"\b(specialization|specializations|streams?)\b"),
            ("all_courses", r"\b(all\s+courses|courses\s+offered|what\s+courses|list\s+of\s+courses)\b"),
        ]

    def extract(self, query: str, context_course: Optional[str] = None) -> Dict:
        """Extract entities and requested attributes from user query."""
        entities = {
            "course": None,
            "entity": None,
            "attributes": [],
            "category": None,
            "hostelType": None,
            "quota": None,
            "isGeneralCourse": False
        }
        
        q_lower = query.lower().strip()
        
        # 1. General course flag
        if is_general_course_query(query):
            entities["isGeneralCourse"] = True
            entities["course"] = None
            entities["entity"] = "VCTM"
            entities["attributes"].append("all_courses")
        else:
            # 2. Specific Course Detection
            for pattern, course_name in self.course_patterns:
                if re.search(pattern, q_lower, re.I):
                    entities["course"] = course_name
                    entities["entity"] = course_name
                    break
                    
            if not entities["course"] and context_course:
                entities["course"] = context_course
                entities["entity"] = context_course

        # 3. Detect Entity if not a specific course
        is_scholarship_query = bool(re.search(r"\b(scholarship|scholarships|samaj\s+kalyan|fee\s+reimbursement)\b", q_lower))
        is_hostel_query = bool(re.search(r"\b(hostel|mess)\b", q_lower))

        if is_scholarship_query and any(w in q_lower for w in ["eligib", "criteria", "qualif", "who can", "can i", "requirement", "qualify", "apply"]):
            entities["entity"] = "Scholarship"
            entities["course"] = None
        elif is_hostel_query:
            if re.search(r"\b(girls?|female|women)\b", q_lower):
                entities["entity"] = "Girls Hostel"
            elif re.search(r"\b(boys?|male|men)\b", q_lower):
                entities["entity"] = "Boys Hostel"
            else:
                entities["entity"] = "VCTM Hostel"
        elif not entities["entity"]:
            if re.search(r"\b(girls?\s+hostel)\b", q_lower):
                entities["entity"] = "Girls Hostel"
            elif re.search(r"\b(boys?\s+hostel)\b", q_lower):
                entities["entity"] = "Boys Hostel"
            elif re.search(r"\b(hostel|mess)\b", q_lower):
                entities["entity"] = "VCTM Hostel"
            elif re.search(r"\b(placement|placements|salary|package|recruiters?|companies)\b", q_lower):
                entities["entity"] = "VCTM Placement Cell"
            elif re.search(r"\b(bus|transport|bus\s+routes?)\b", q_lower):
                entities["entity"] = "VCTM Bus Fleet"
            elif re.search(r"\b(library|books|journals)\b", q_lower):
                entities["entity"] = "Central Library"
            elif re.search(r"\b(cafeteria|canteen)\b", q_lower):
                entities["entity"] = "Cafeteria"
            elif re.search(r"\b(auditorium|seminar\s+hall)\b", q_lower):
                entities["entity"] = "Auditorium"
            elif re.search(r"\b(clubs?|sports\s+club|art\s+club)\b", q_lower):
                entities["entity"] = "Student Clubs"
            elif re.search(r"\b(up\s+scholarship|post\s*matric)\b", q_lower):
                entities["entity"] = "UP Government Scholarship"
            elif re.search(r"\b(merit\s+scholarship)\b", q_lower):
                entities["entity"] = "VCTM Institutional Scholarship"
            elif is_scholarship_query:
                entities["entity"] = "Scholarship"
            else:
                entities["entity"] = "VCTM"

        # 4. Extract Attributes requested in query
        detected_attrs = []
        for attr_key, pat in self.attribute_patterns:
            if re.search(pat, q_lower, re.I):
                if attr_key not in detected_attrs:
                    detected_attrs.append(attr_key)

        # HOD routing overrides
        if "all_hods" in detected_attrs:
            entities["entity"] = "VCTM"
            detected_attrs = [a for a in detected_attrs if a != "hod"]
        elif "hod" in detected_attrs:
            if re.search(r"\bpolytechnic\b", q_lower):
                if re.search(r"\b(cs|cse|computer)\b", q_lower):
                    entities["entity"] = "Polytechnic CS"
                    entities["course"] = "Polytechnic CS"
                elif re.search(r"\b(mech|mechanical)\b", q_lower):
                    entities["entity"] = "Polytechnic Mechanical"
                    entities["course"] = "Polytechnic Mechanical"
                elif re.search(r"\bcivil\b", q_lower):
                    entities["entity"] = "Polytechnic Civil"
                    entities["course"] = "Polytechnic Civil"
                elif re.search(r"\b(ec|ece|electronics)\b", q_lower):
                    entities["entity"] = "Polytechnic EC"
                    entities["course"] = "Polytechnic EC"
            elif re.search(r"\b(cs|cse|computer\s+science)\b", q_lower):
                entities["entity"] = "B.Tech CSE"
                entities["course"] = "B.Tech CSE"

        if "proctor_name" in detected_attrs:
            entities["entity"] = "VCTM"

        # Specificity filter: remove generic superset attributes if specific sub-attributes were matched
        if "scholarship_eligibility" in detected_attrs or (is_scholarship_query and "eligibility" in detected_attrs):
            if "scholarship_eligibility" not in detected_attrs:
                detected_attrs.append("scholarship_eligibility")
            detected_attrs = [a for a in detected_attrs if a != "eligibility"]
            entities["entity"] = "Scholarship"
            entities["course"] = None

        if any(h in detected_attrs for h in ["hostel_fee", "boys_hostel_fee", "girls_hostel_fee", "hostel_rules", "hostel_accommodation", "hostel_facilities"]):
            detected_attrs = [a for a in detected_attrs if a != "fees" and a != "hostel_amenities"]

        if "aktu_code" in detected_attrs or "bte_code" in detected_attrs:
            detected_attrs = [a for a in detected_attrs if a != "institutional_codes"]
        if "curfew_girls" in detected_attrs or "curfew_boys" in detected_attrs or "mess_food" in detected_attrs:
            detected_attrs = [a for a in detected_attrs if a != "hostel_amenities" and a != "curfew"]
        if any(p in detected_attrs for p in ["highest_package", "average_package", "placement_rate", "recruiters"]):
            detected_attrs = [a for a in detected_attrs if a != "placement_overview"]
        if "bus_routes" in detected_attrs:
            detected_attrs = [a for a in detected_attrs if a != "transport_facility"]

        entities["attributes"] = detected_attrs

        # 5. Category Detection
        if re.search(r"\b(sc|st|scheduled\s+caste|scheduled\s+tribe)\b", q_lower):
            entities["category"] = "SC/ST"
        elif re.search(r"\b(obc|other\s+backward\s+class)\b", q_lower):
            entities["category"] = "OBC"
        elif re.search(r"\b(ews|economically\s+weaker)\b", q_lower):
            entities["category"] = "EWS"
        elif re.search(r"\b(gen|general)\b", q_lower):
            entities["category"] = "General"
            
        # 6. Hostel Type
        if re.search(r"\b(girls?|female|women)\b", q_lower):
            entities["hostelType"] = "girls"
        elif re.search(r"\b(boys?|male|men)\b", q_lower):
            entities["hostelType"] = "boys"
            
        # 7. Quota
        if re.search(r"\b(direct|management\s+quota)\b", q_lower):
            entities["quota"] = "direct"
        elif re.search(r"\b(counseling|counselling|uptac|upsee|jeecup)\b", q_lower):
            entities["quota"] = "counseling"
            
        return entities

entity_extractor = EntityExtractor()
