"""
dataset_builder.py - Automatically builds the supervised intent classification dataset
from the cleaned official VCTM knowledge base and queries.
"""

import json
import logging
import os
from typing import Dict, List

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
DATASET_FILE = os.path.join(DATA_DIR, "training_dataset.json")

# Grounded training query templates covering all official VCTM facets
INTENT_SEED_PATTERNS = {
    "admissions": [
        "admission", "admissions", "admission process", "how to take admission",
        "How can I take admission in VCTM?", "How do I take admission in VCTM college?",
        "What is the admission procedure for B.Tech in VCTM?",
        "When does the admission process start at Vivekananda college?",
        "Can I get direct admission in CSE?", "direct admission btech", "management quota admission",
        "What documents are needed for admission?", "documents required for admission",
        "Is there a management quota in VCTM?", "How do I apply for MBA admission?",
        "What is the lateral entry admission process for B.Tech?", "lateral entry admission",
        "Is counseling mandatory for admission at VCTM?", "uptac counseling admission",
        "How can I apply for Polytechnic Diploma admission?", "jeecup counseling admission",
        "Where is the admission cell in the campus?", "Can I get admission without JEE Main in B.Tech?",
        "Tell me about the admission guidelines for AKTU code 340", "Direct admission in VCTM Aligarh",
        "How do I apply online on vctm.in?", "online admission form vctm",
        "What is the admission helpline number?", "admission cell phone number",
        "Can 12th pass students apply for admission directly?", "Admission procedure for MCA in Vivekananda college",
        "How many seats are available in CSE for admission?", "What is the registration process for new admissions?",
        "admissions 2026", "admissions 2025", "apply for admission", "how to enroll in vctm",
        "admission criteria and steps", "counseling procedure for btech admission",
        "admission office timings", "can I visit campus for direct admission?"
    ],
    "course_details": [
        "courses", "what courses are offered", "What courses are offered?", "programs offered",
        "What courses are offered at VCTM?", "Does VCTM offer B.Tech in Computer Science?",
        "What branches are available in B.Tech?", "btech branches", "engineering courses",
        "Tell me about MBA program in VCTM", "mba course details", "mba specializations",
        "Is MCA offered at Vivekananda College of Technology?", "mca course details",
        "What diploma engineering courses are available in BTE code 1628?", "polytechnic courses",
        "What is the duration of B.Tech at VCTM?", "Does VCTM have agricultural engineering?",
        "Tell me about Mechanical Engineering branch", "What are the specializations offered in MBA?",
        "How many semesters are there in Polytechnic Diploma?", "Does the college offer Civil Engineering?",
        "Is B.Tech in Information Technology available?", "What is the seat intake for B.Tech CSE?",
        "Is Electrical Engineering offered in VCTM?", "Tell me about M.Tech courses in VCTM",
        "Does VCTM offer B.Sc or BCA?", "List all undergraduate and postgraduate programs",
        "Are all courses approved by AICTE New Delhi?", "What is the course curriculum for MCA?",
        "academic programs", "which degrees does vctm provide", "polytechnic diploma streams",
        "computer science and engineering program", "btech curriculum and syllabus",
        "duration and seats for all courses", "list of engineering degrees at vctm"
    ],
    "eligibility_criteria": [
        "eligibility", "btech eligibility", "What is the eligibility for B.Tech?",
        "What is the eligibility for B.Tech in VCTM?", "eligibility criteria",
        "Can I get admission in B.Tech if I have 45% in 12th?", "12th marks needed for btech",
        "What are the PCM criteria for engineering admission?", "physics chemistry maths percentage",
        "What is the eligibility for MBA?", "mba eligibility criteria", "graduation percentage for mba",
        "Can arts or commerce students apply for MCA?", "mca eligibility",
        "What is the eligibility for Polytechnic Diploma?", "polytechnic diploma eligibility 10th",
        "What is the minimum percentage required in intermediate for general category?",
        "What is the eligibility for SC and ST students in B.Tech?", "sc st eligibility concession marks",
        "Can I get lateral entry admission into 2nd year B.Tech after diploma?",
        "What exams are accepted for B.Tech eligibility?", "Is JEE Main compulsory for B.Tech admission?",
        "What is the age limit for Polytechnic admission?", "Can students with biology in 12th apply for Agricultural Engineering?",
        "Do I need mathematics in graduation for MCA?", "Minimum marks required in 10th for polytechnic engineering diploma",
        "Eligibility criteria for UP domicile candidates", "who is eligible to apply for btech cse",
        "minimum cutoff percentage in intermediate", "qualifying criteria for direct admission"
    ],
    "fees_structure": [
        "fee", "fees", "btech fees", "btech cse fees", "fees structure", "fee structure",
        "What are the B.Tech fees at VCTM?", "What is the annual tuition fee for B.Tech CSE?",
        "How much does MBA cost per year at VCTM?", "mba fees", "mba annual tuition fee",
        "What are the fees for Polytechnic Diploma?", "polytechnic fees", "diploma fees",
        "What is the semester fee for B.Tech?", "Can I pay the fees in installments?",
        "What is the total fee for MCA course?", "mca fees", "mca tuition fee",
        "What is the annual fee for Mechanical Engineering?", "mechanical engineering fees",
        "How much is the fee for Civil Engineering in B.Tech?", "civil engineering fees",
        "What are the charges for Agricultural Engineering?", "agricultural engineering fee",
        "Is there any hidden fee or exam fee extra?", "What is the fee structure for 4 years B.Tech?",
        "Diploma fees per semester in VCTM", "What is the fee for lateral entry B.Tech students?",
        "Tell me the tuition fees of Vivekananda college Aligarh", "Fee breakdown for B.Tech CSE with tuition and security",
        "How much do I need to pay during admission?", "What is the total cost of completing MBA from VCTM?",
        "btech semester fee installment", "hostel and tuition fee total", "cost of studying engineering at vctm"
    ],
    "scholarships": [
        "scholarship", "scholarships", "What scholarships are available?", "What scholarships are available at VCTM?",
        "Can I get UP government post-matric scholarship?", "up scholarship", "samaj kalyan scholarship",
        "How much fee reimbursement can SC ST students get?", "sc st fee reimbursement up",
        "Is scholarship available for OBC and General students?", "What is the Samaj Kalyan Vibhag scholarship eligibility?",
        "What is the income limit for UP scholarship in VCTM?", "income certificate criteria for scholarship",
        "Does VCTM offer fee concession for meritorious students?", "How do I apply for scholarship on scholarship.up.gov.in?",
        "Are there any AICTE Pragati scholarships for girls?", "What documents are needed to apply for scholarship?",
        "Does the college assist in scholarship application?", "Is 100% fee waiver possible through government scholarship?",
        "Can minority students get NSP scholarship at VCTM?", "What is the deadline for UP scholarship submission?",
        "scholarship reimbursement process", "financial assistance for poor students", "merit fee concession"
    ],
    "hostel_mess": [
        "hostel", "hostels", "mess", "What hostel facilities are available?", "What hostel facilities are available at VCTM?",
        "Does VCTM provide separate hostels for boys and girls?", "boys hostel", "girls hostel",
        "What is the annual hostel fee at VCTM?", "hostel fees", "hostel charges", "hostel room rent",
        "Is mess food included in the hostel fee?", "How much does hostel cost per year?",
        "Are the hostel rooms air conditioned?", "What is the curfew time for girls hostel?",
        "Is 24 hours Wi-Fi and power backup available in the hostel?", "How is the quality of mess food in the college?",
        "Can I inspect the hostel rooms before admission?", "What amenities are provided inside the hostel rooms?",
        "Is on-campus accommodation safe for outstation students?", "What are the rules and regulations in VCTM hostels?",
        "hostel security and wardens", "food menu in hostel mess", "ac non ac rooms hostel"
    ],
    "placements": [
        "placement", "placements", "How are the placements?", "How are the placements at VCTM Aligarh?",
        "What was the highest package offered at VCTM?", "highest package", "average package",
        "What is the average salary package for B.Tech CSE students?", "Which companies visit VCTM for campus recruitment?",
        "Does TCS and Infosys hire from Vivekananda college?", "top recruiters", "companies recruiting",
        "What is the placement percentage for computer science?", "Does the college have a dedicated Corporate Resource Centre (CRC)?",
        "Tell me about the training and placement cell", "tpo cell vctm",
        "Are internship opportunities provided during the course?", "What salary can I expect after completing B.Tech from VCTM?",
        "How many companies recruited students last year?", "What are the placement records of MBA graduates?",
        "job opportunities after btech", "campus interview preparation", "companies visiting vctm aligarh"
    ],
    "examinations": [
        "exam", "exams", "examinations", "exam pattern", "What is the exam pattern and schedule at VCTM?",
        "What is the exam pattern at VCTM?", "When are sessional exams held?", "sessional exams",
        "How many internal tests are conducted per semester?", "What is the AKTU semester examination schedule?",
        "What is the passing criteria in semester exams?", "How much internal marks weightage is given in B.Tech?",
        "What is the backlog and carryover paper policy of AKTU?", "When are odd and even semester examinations conducted?",
        "Are practical exams conducted in the college labs?", "Where can I check AKTU examination results?",
        "aktu exam dates", "sessional test schedule", "end semester exams aktu", "internal marks evaluation"
    ],
    "departments": [
        "hod", "head of department", "Who is the HOD of CS?", "Who is the HOD of Computer Science at VCTM?",
        "Who is the head of mechanical engineering department?", "hod mechanical", "hod civil",
        "Who leads the civil engineering department?", "Tell me about the faculty in management studies",
        "Who is the HOD of Applied Sciences?", "hod electronics", "hod electrical",
        "Who is the head of department for electrical and electronics?", "What is the qualifications of the teaching staff at VCTM?",
        "Who is the Director of VCTM Aligarh?", "director of vctm", "Who is the Registrar of Vivekananda college?",
        "registrar of vctm", "Tell me about Dr. Y. K. Upadhyaya", "Who is the head of Agricultural Engineering?",
        "faculty list", "professors in cse department", "leadership of vctm college"
    ],
    "facilities_campus": [
        "facilities", "campus facilities", "What facilities are available on the VCTM campus?",
        "Tell me about the college library and computer labs", "library books and journals",
        "Does VCTM have sports facilities and ground?", "cricket ground and sports",
        "Is the campus Wi-Fi enabled?", "wifi on campus", "How big is the VCTM college campus?",
        "campus area acres", "Is there a cafeteria or canteen on campus?", "canteen and food court",
        "Are laboratories well equipped for practicals?", "computer center labs",
        "Does VCTM have a gym and recreation room?", "Tell me about the infrastructure of Vivekananda college Aligarh",
        "Is there an auditorium or seminar hall for events?", "campus amenities and buildings"
    ],
    "transportation": [
        "transport", "transportation", "bus", "bus routes", "Does VCTM provide college bus service?",
        "What are the bus routes for VCTM in Aligarh?", "college bus routes",
        "What is the annual bus transport fee?", "bus fee per year",
        "Are buses available from Sasni, Khair, and Hathras?", "bus pickup points",
        "How can day scholars travel to the college?", "Are the college buses GPS tracked?",
        "What are the pickup points for college transport?", "commute to college from aligarh city",
        "bus facility for students"
    ],
    "contact_details": [
        "contact", "contact details", "phone number", "helpline", "How can I contact the college?",
        "How can I contact VCTM college?", "What is the phone number of Vivekananda college Aligarh?",
        "What is the official email address of VCTM?", "email id", "mobile number",
        "Where can I send an inquiry about admission?", "What are the college helpline mobile numbers?",
        "What are the office working hours?", "office hours timings",
        "How do I contact the college registrar or director?", "contact admission desk"
    ],
    "location": [
        "location", "where is the college located", "Where is the college located?",
        "Where is VCTM college located?", "How far is VCTM from Aligarh railway station?",
        "What is the address of Vivekananda college?", "college address",
        "How do I reach VCTM from Aligarh bus stand?", "Is VCTM on Mathura Bypass near Nada Pul?",
        "What is the landmark for VCTM campus?", "distance from aligarh station", "how to reach vctm"
    ],
    "cutoffs_ranks": [
        "cutoff", "cut off", "rank", "ranks", "What is the cutoff rank for B.Tech CSE in VCTM?",
        "What JEE Main rank is required for admission?", "jee main cutoff rank",
        "What is the AKTU college code for VCTM counseling?", "aktu code 340 counseling",
        "What is the BTE code for polytechnic counseling in UP?", "bte up code 1628",
        "Can I get CSE with 70 percentile in JEE Main?", "What is the UP TAC closing rank for Vivekananda college?",
        "counseling closing ranks", "minimum rank for cse admission"
    ],
    "general_greeting": [
        "hello", "hi", "hey", "namaste", "good morning", "good afternoon", "good evening",
        "greetings", "hello assistant", "hi there", "Who are you?", "What can you do?",
        "Help me with college information", "thank you", "thanks", "thanks a lot", "bye", "goodbye"
    ],
    "unknown": [
        "What is the capital of Australia?", "Who is the president of the United States?",
        "Write a python program to reverse a linked list", "How to bake a chocolate cake?",
        "Tell me a funny joke", "What is the weather today in Delhi?", "Who won the cricket world cup?",
        "Explain photosynthesis in biology", "What is the formula for kinetic energy?",
        "Buy cheap iphone 15 online", "What is the bitcoin price today?", "asdfghjkl qwertyuiop",
        "Can you write a poem about the moon?", "Translate this sentence to French",
        "Solve equation 2x + 5 = 15", "recipe for chicken biryani", "how to repair a bicycle",
        "who is messi", "what is quantum computing"
    ]
}

from build_verified_dataset import build_datasets, QA_DATASET_FILE, TRAINING_FILE

def generate_training_dataset() -> List[Dict]:
    """Generates the full verified Q&A dataset and labeled training dataset."""
    build_datasets()
    with open(TRAINING_FILE, "r", encoding="utf-8") as f:
        dataset = json.load(f)
    return dataset

if __name__ == "__main__":
    generate_training_dataset()
