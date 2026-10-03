import { CollegeCourse } from '../types/chatbot';

export interface VCTMDepartment {
  id: string;
  name: string;
  headOfDepartment: string;
  coursesOffered: string[];
  keyLabs: string[];
  description: string;
}

export interface VCTMExamInfo {
  affiliatingBody: string;
  examPattern: string;
  semesterTimeline: {
    oddSemester: string;
    evenSemester: string;
    sessionalExams: string;
  };
  attendanceRequirement: string;
  admitCardRules: string;
  evaluationScheme: string;
  marksheetAndDegree: string;
}

export interface VCTMKnowledgeBase {
  collegeInfo: {
    fullName: string;
    shortName: string;
    society: string;
    director: string;
    registrar: string;
    establishedYear: number;
    aktuCollegeCode: string;
    bteCollegeCode: string;
    aicteApproval: string;
    campusArea: string;
    location: string;
    campusAddress: string;
    registeredOffice: string;
    city: string;
    state: string;
    pincode: string;
    helplinePhone: string[];
    officialEmail: string;
    alternateEmail: string;
    directorEmail: string;
    registrarEmail: string;
    website: string;
    operatingHours: string;
    landmark: string;
    distanceFromStation: string;
    transportAccess: string;
    vision: string;
    mission: string[];
    coreValues: string[];
    groupInstitutions: string[];
    socialMedia: {
      instagram: string;
      facebook: string;
      youtube: string;
      website: string;
      groupWebsite: string;
    };
  };
  courses: CollegeCourse[];
  departments: VCTMDepartment[];
  examinations: VCTMExamInfo;
  scholarships: {
    title: string;
    provider: string;
    coverage: string;
    eligibility: string;
    documentsRequired: string[];
    deadlineNote: string;
  }[];
  hostelInfo: {
    availableFor: string;
    roomTypes: {
      type: string;
      annualFee: number;
      securityDeposit: number;
      mealPlanIncluded: boolean;
      features: string[];
    }[];
    amenities: string[];
    rules: {
      curfewGirls: string;
      curfewBoys: string;
      visitorsAllowed: string;
      raggingPolicy: string;
    };
    messDetails: {
      foodType: string;
      mealsPerDay: number;
      diningHours: {
        breakfast: string;
        lunch: string;
        eveningSnacks: string;
        dinner: string;
      };
    };
  };
  placementStats: {
    academicYear: string;
    placementRate: string;
    highestPackage: string;
    highestPackageCompany: string;
    averagePackage: string;
    medianPackage: string;
    totalRecruiters: number;
    totalOffers: number;
    topRecruiters: string[];
    keyHighlights: string[];
  };
  facilities: {
    name: string;
    category: string;
    icon: string;
    description: string;
  }[];
  transportRoutes: {
    routeNumber: number;
    destinationArea: string;
    majorPickups: string[];
    annualFare: number;
  }[];
  admissionSteps: {
    stepNumber: number;
    title: string;
    description: string;
  }[];
  requiredDocuments: string[];
  unsupportedPrograms: string[];
}

export const VCTM_DATA: VCTMKnowledgeBase = {
  collegeInfo: {
    fullName: 'Vivekananda College of Technology & Management (VCTM)',
    shortName: 'VCTM',
    society: 'N.L. Educational Society (Established 2008)',
    director: 'Dr. Y. K. Upadhyaya',
    registrar: 'Mr. Mukesh Kumar',
    establishedYear: 2008,
    aktuCollegeCode: '340 (AKTU Lucknow)',
    bteCollegeCode: '1628 (BTE Uttar Pradesh)',
    aicteApproval: 'Approved by AICTE, Ministry of Education, Govt. of India',
    campusArea: '10.7 Acres Lush Green Highway Campus',
    location: 'Mathura Bypass, Near Khair Road, Aligarh, Uttar Pradesh',
    campusAddress: 'Mathura Bypass, Near Khair Road, 500 meters from Nada Pul, Aligarh - 202002 (U.P.)',
    registeredOffice: '5/148, Issapur Colony, Banna Devi, G.T. Road, Aligarh - 202001 (U.P.)',
    city: 'Aligarh',
    state: 'Uttar Pradesh',
    pincode: '202002',
    helplinePhone: ['+91 94540 10846', '+91 79064 87855', '+91 97560 79797', '0571-2513913'],
    officialEmail: 'info@vctm.in',
    alternateEmail: 'vctmaligarh@gmail.com',
    directorEmail: 'director@vctm.in',
    registrarEmail: 'registrar@vctm.in',
    website: 'https://vctm.in',
    operatingHours: 'Monday to Saturday: 9:00 AM to 5:00 PM',
    landmark: 'Mathura Bypass, near Khair Road, 500 meters from Nada Pul, approx. 3 km from Aligarh City',
    distanceFromStation: 'Approx. 5-7 km from Aligarh Junction Railway Station (15 mins by road)',
    transportAccess: 'Directly accessible via college bus fleet, e-rickshaws, shared autos, and Mathura-Khair highway buses stopping near Nada Pul.',
    vision: 'To be a world-class professional institution, constantly striving for excellence in education, research & technical services and developing competent, ethical, and morally strong leaders for industry & society.',
    mission: [
      'Imparting quality education of global standards with a focus on problem-solving skills.',
      'Inculcating a global perspective and encouraging lifelong learning.',
      'Promoting human values, ethics, and healthy professional practices.',
      'Encouraging creativity and a research temperament.',
      'Providing knowledge-based technological services to meet industry and societal needs.',
      'Synergizing the teaching-learning process through active interaction with industry, academia, and other sectors, while staying updated with technology.',
    ],
    coreValues: [
      'Academic excellence and integrity',
      'Outstanding teaching and service',
      'Scholarly research and professional leadership',
      'Appreciation of intellectual excellence and creativity',
      'Integration of human values and ethics',
      'Encouraging lifelong learning',
      'Inculcating a global perspective',
      'Sensitivity to social responsibility',
    ],
    groupInstitutions: [
      'Vivekananda College of Technology & Management (VCTM) — AKTU Code: 340',
      'Vivekananda College of Polytechnic (VCP) — BTE UP Code: 1628',
      'Vivekananda College of Education (VCOE)',
      'Vivekananda College of Law (VCOL)',
    ],
    socialMedia: {
      instagram: 'https://www.instagram.com/vctm_aligarh/',
      facebook: 'https://www.facebook.com/vctmians',
      youtube: 'https://www.youtube.com/@vctmaligarh',
      website: 'https://vctm.in',
      groupWebsite: 'https://www.vivekanandagroupofcolleges.com',
    },
  },

  courses: [
    {
      id: 'btech-cse',
      name: 'B.Tech in Computer Science & Engineering',
      shortCode: 'B.Tech CSE',
      level: 'Undergraduate',
      duration: '4 Years (8 Semesters)',
      totalSeats: 60,
      annualFee: 55000,
      semesterFee: 27500,
      eligibility: 'Passed 10+2 examination with Physics, Mathematics, and Chemistry/CS with at least 50% aggregate marks (45% for SC/ST reserved categories). Minors in AI/ML & Data Science available.',
      examAccepted: ['JEE Main', 'CUET UG', 'UPTAC', 'Direct Merit Admission (AKTU Norms)'],
      curriculumHighlights: ['Data Structures & Algorithms', 'Web Development & Cloud', 'Operating Systems', 'AI/ML Minor Specialization', 'Database Management Systems'],
      careerProspects: ['Software Developer', 'Full Stack Engineer', 'Cloud Architect', 'System Analyst'],
    },
    {
      id: 'btech-it',
      name: 'B.Tech in Information Technology',
      shortCode: 'B.Tech IT',
      level: 'Undergraduate',
      duration: '4 Years (8 Semesters)',
      totalSeats: 30,
      annualFee: 55000,
      semesterFee: 27500,
      eligibility: 'Passed 10+2 examination with Physics & Mathematics with min 50% marks (45% for SC/ST).',
      examAccepted: ['JEE Main', 'CUET UG', 'Direct Merit Admission'],
      curriculumHighlights: ['Network Security', 'Enterprise Computing', 'Database Management', 'Cloud Infrastructure'],
      careerProspects: ['Network Engineer', 'IT Consultant', 'DevOps Specialist', 'Systems Administrator'],
    },
    {
      id: 'btech-ece',
      name: 'B.Tech in Electronics & Communication Engineering',
      shortCode: 'B.Tech ECE',
      level: 'Undergraduate',
      duration: '4 Years (8 Semesters)',
      totalSeats: 60,
      annualFee: 55000,
      semesterFee: 27500,
      eligibility: 'Passed 10+2 with Physics and Mathematics with at least 50% aggregate marks (45% for SC/ST).',
      examAccepted: ['JEE Main', 'CUET UG', 'Direct Merit Admission'],
      curriculumHighlights: ['VLSI Design', 'Microprocessors & Embedded Systems', 'Signal Processing', 'IoT & Wireless Communications'],
      careerProspects: ['Embedded Systems Engineer', 'VLSI Design Engineer', 'Telecom Engineer'],
    },
    {
      id: 'btech-me',
      name: 'B.Tech in Mechanical Engineering',
      shortCode: 'B.Tech ME',
      level: 'Undergraduate',
      duration: '4 Years (8 Semesters)',
      totalSeats: 60,
      annualFee: 55000,
      semesterFee: 27500,
      eligibility: 'Passed 10+2 with Physics and Mathematics with at least 50% aggregate marks (45% for SC/ST).',
      examAccepted: ['JEE Main', 'CUET UG', 'Direct Merit Admission'],
      curriculumHighlights: ['CAD/CAM Simulator', 'Thermodynamics & IC Engines', 'Manufacturing Processes', 'Automotive Engineering'],
      careerProspects: ['Design Engineer', 'Production Specialist', 'Quality Engineer', 'Automotive Technologist'],
    },
    {
      id: 'btech-civil',
      name: 'B.Tech in Civil Engineering',
      shortCode: 'B.Tech Civil',
      level: 'Undergraduate',
      duration: '4 Years (8 Semesters)',
      totalSeats: 60,
      annualFee: 55000,
      semesterFee: 27500,
      eligibility: 'Passed 10+2 with Physics and Mathematics with at least 50% aggregate marks (45% for SC/ST).',
      examAccepted: ['JEE Main', 'CUET UG', 'Direct Merit Admission'],
      curriculumHighlights: ['Structural Analysis', 'Surveying with Total Station', 'Concrete Technology', 'Geotechnical Engineering'],
      careerProspects: ['Site Engineer', 'Structural Designer', 'Project Planner', 'Government PWD/Irrigation Junior Engineer'],
    },
    {
      id: 'btech-ee',
      name: 'B.Tech in Electrical Engineering',
      shortCode: 'B.Tech EE',
      level: 'Undergraduate',
      duration: '4 Years (8 Semesters)',
      totalSeats: 60,
      annualFee: 55000,
      semesterFee: 27500,
      eligibility: 'Passed 10+2 with Physics and Mathematics with at least 50% aggregate marks (45% for SC/ST).',
      examAccepted: ['JEE Main', 'CUET UG', 'Direct Merit Admission'],
      curriculumHighlights: ['Power Systems', 'Control Systems', 'Electrical Machines', 'Renewable Energy'],
      careerProspects: ['Power Systems Engineer', 'Control & Automation Engineer', 'Electrical Maintenance Engineer'],
    },
    {
      id: 'btech-ag',
      name: 'B.Tech in Agricultural Engineering',
      shortCode: 'B.Tech AG',
      level: 'Undergraduate',
      duration: '4 Years (8 Semesters)',
      totalSeats: 30,
      annualFee: 55000,
      semesterFee: 27500,
      eligibility: 'Passed 10+2 with PCM/PCB or Agriculture with at least 50% aggregate marks (45% for SC/ST).',
      examAccepted: ['JEE Main', 'CUET UG', 'Direct Merit Admission'],
      curriculumHighlights: ['Farm Machinery & Power', 'Soil & Water Conservation', 'Food Processing Tech', 'Irrigation Engineering'],
      careerProspects: ['Agricultural Engineer', 'Farm Equipment Design Engineer', 'Food Processing Consultant'],
    },
    {
      id: 'polytechnic-diploma',
      name: 'Diploma in Engineering (Polytechnic)',
      shortCode: 'Polytechnic Diploma',
      level: 'Diploma',
      duration: '3 Years (6 Semesters)',
      totalSeats: 120,
      annualFee: 30150,
      semesterFee: 15075,
      eligibility: '10th Class (Matriculation) passed with Science and Mathematics with at least 35% marks. Affiliated to Board of Technical Education (BTE UP, Code: 1628).',
      examAccepted: ['JEECUP (UP Polytechnic)', 'Direct Merit Admission'],
      curriculumHighlights: ['Workshop Technology', 'Engineering Drawing', 'Applied Mechanics', 'Industrial Training'],
      careerProspects: ['Junior Engineer (JE)', 'Maintenance Supervisor', 'Technical Executive in Automobile/Manufacturing'],
    },
    {
      id: 'mba',
      name: 'Master of Business Administration (MBA)',
      shortCode: 'MBA',
      level: 'Postgraduate',
      duration: '2 Years (4 Semesters)',
      totalSeats: 60,
      annualFee: 59700,
      semesterFee: 29850,
      eligibility: 'Recognized Bachelor degree in any discipline with minimum 50% aggregate (45% for SC/ST). Specializations in Marketing, Finance, HR, and IT.',
      examAccepted: ['CUET PG', 'CAT / MAT / CMAT', 'Direct Merit Counseling'],
      curriculumHighlights: ['Financial Management', 'Digital Marketing & Analytics', 'Human Resource Management', 'Strategic Operations'],
      careerProspects: ['Marketing Manager', 'Financial Analyst', 'HR Business Partner', 'Operations Consultant'],
    },
    {
      id: 'mca',
      name: 'Master of Computer Applications (MCA)',
      shortCode: 'MCA',
      level: 'Postgraduate',
      duration: '2 Years (4 Semesters)',
      totalSeats: 0,
      annualFee: 55000,
      semesterFee: 27500,
      eligibility: 'BCA / B.Sc (Computer Science) / B.Tech or any Graduation with Mathematics at 10+2 or Graduation level with at least 50% marks (45% for SC/ST). Note: Sanctioned seat intake for MCA is not officially published on the college website.',
      examAccepted: ['CUET PG', 'AKTU PG Counseling', 'Direct Merit'],
      curriculumHighlights: ['Advanced Java & Web Services', 'Python & Machine Learning', 'Database Architecture', 'Software Engineering'],
      careerProspects: ['Senior Software Engineer', 'Database Administrator', 'Solutions Architect', 'Full Stack Developer'],
    },
    {
      id: 'mtech-pe',
      name: 'M.Tech in Production Engineering',
      shortCode: 'M.Tech Production',
      level: 'Postgraduate',
      duration: '2 Years (4 Semesters)',
      totalSeats: 24,
      annualFee: 57500,
      semesterFee: 28750,
      eligibility: 'B.Tech / B.E in Mechanical / Production or relevant branch with minimum 50% aggregate marks.',
      examAccepted: ['GATE', 'CUET PG', 'AKTU Counseling'],
      curriculumHighlights: ['Advanced Manufacturing Systems', 'Total Quality Management', 'Supply Chain Management'],
      careerProspects: ['Senior Production Engineer', 'Industrial Research Analyst', 'Assistant Professor'],
    },
    {
      id: 'mtech-se',
      name: 'M.Tech in Structural Engineering',
      shortCode: 'M.Tech Structural',
      level: 'Postgraduate',
      duration: '2 Years (4 Semesters)',
      totalSeats: 24,
      annualFee: 57500,
      semesterFee: 28750,
      eligibility: 'B.Tech / B.E in Civil Engineering with minimum 50% aggregate marks.',
      examAccepted: ['GATE', 'CUET PG', 'AKTU Counseling'],
      curriculumHighlights: ['Finite Element Method', 'Earthquake Resistant Structures', 'Advanced Reinforced Concrete'],
      careerProspects: ['Structural Consultant', 'Infrastructure Planning Lead', 'Assistant Professor'],
    },
  ],

  departments: [
    {
      id: 'dept-cse',
      name: 'Department of Computer Science & Engineering and IT',
      headOfDepartment: 'Dr. Mohammad Haris (HOD, B.Tech CSE) & Mr. Yash Tripathi (HOD Polytechnic CSE)',
      coursesOffered: ['B.Tech CSE', 'B.Tech IT', 'MCA'],
      keyLabs: ['Advanced Computing Lab (Intel Core i7 PCs)', 'AI/ML & Data Science Lab', 'Internet of Things (IoT) Lab', 'Open Source Software Studio'],
      description: 'Offers state-of-the-art curriculum in software development, cloud computing, and emerging minor degrees in AI/ML and Data Science.',
    },
    {
      id: 'dept-me',
      name: 'Department of Mechanical Engineering',
      headOfDepartment: 'Mr. Umardaraj Khan (HOD, B.Tech ME) & Mr. Santosh Kumar Awasthi (HOD Polytechnic ME)',
      coursesOffered: ['B.Tech Mechanical', 'M.Tech Production', 'Polytechnic Diploma in Mechanical'],
      keyLabs: ['CAD/CAM Modeling Centre', 'Central Mechanical Workshop', 'IC Engines Lab', 'Fluid Mechanics Lab'],
      description: 'Features industrial machinery, CNC simulation software, and machine tools providing hands-on manufacturing training.',
    },
    {
      id: 'dept-civil',
      name: 'Department of Civil Engineering',
      headOfDepartment: 'Mr. Sahil Abbas Zaidi (HOD, B.Tech Civil) & Mr. Vinit Kumar (HOD Polytechnic Civil)',
      coursesOffered: ['B.Tech Civil', 'M.Tech Structural', 'Polytechnic Diploma in Civil'],
      keyLabs: ['Surveying Lab (Total Station)', 'Concrete Technology & Materials Lab', 'Soil Mechanics Lab', 'Environmental Engineering Lab'],
      description: 'Prepares students for infrastructure engineering, structural design, construction management, and government PWD exams.',
    },
    {
      id: 'dept-ece',
      name: 'Department of Electronics & Communication and Electrical',
      headOfDepartment: 'Mr. Jai Kishan Singh (HOD EC) & Dr. Aisha Malik (HOD Electrical)',
      coursesOffered: ['B.Tech ECE', 'B.Tech EE', 'Polytechnic Diploma in Electrical/Electronics'],
      keyLabs: ['VLSI & Circuit Design Lab', 'Microprocessor & Microcontroller Lab', 'Digital Signal Processing (DSP) Lab', 'Electrical Machines Lab'],
      description: 'Focuses on chip design, microelectronics, telecommunications, and power systems.',
    },
    {
      id: 'dept-ag',
      name: 'Department of Agricultural Engineering',
      headOfDepartment: 'Mr. Deepak Gupta',
      coursesOffered: ['B.Tech Agricultural Engineering'],
      keyLabs: ['Farm Machinery Workshop', 'Soil & Water Conservation Lab', 'Food Processing Lab'],
      description: 'Specialized department catering to modernization of agricultural equipment, irrigation engineering, and food processing.',
    },
    {
      id: 'dept-mgmt',
      name: 'Department of Management Studies',
      headOfDepartment: 'Mr. Inder Pal Singh',
      coursesOffered: ['MBA'],
      keyLabs: ['Management Communication Lab', 'Business Simulation & Financial Analytics Center', 'Executive Seminar Room'],
      description: 'Delivers corporate-oriented business administration education with specializations in HR, Marketing, Finance, IT, IB, and Operations.',
    },
    {
      id: 'dept-ca',
      name: 'Department of Computer Applications',
      headOfDepartment: 'Dr. Mohammad Haris',
      coursesOffered: ['MCA'],
      keyLabs: ['Web & Mobile Application Development Lab', 'Database Management Studio', 'Java Enterprise Studio'],
      description: 'Provides strong algorithmic and software engineering foundations for postgraduate computing aspirants.',
    },
    {
      id: 'dept-ash',
      name: 'Department of Applied Sciences & Humanities',
      headOfDepartment: 'Dr. Ajay Kumar Mahur (HOD) & Dr. Naseem Ahmad Khan (Proctor)',
      coursesOffered: ['First Year B.Tech Foundation Courses'],
      keyLabs: ['Engineering Physics Lab', 'Engineering Chemistry Lab', 'Language & Professional Communication Lab'],
      description: 'Builds core scientific, mathematical, and soft-skill competency for all first-year engineering students.',
    },
  ],

  examinations: {
    affiliatingBody: 'Dr. A.P.J. Abdul Kalam Technical University (AKTU Lucknow, College Code: 340) & Board of Technical Education (BTE UP, Code: 1628)',
    examPattern: 'Semester system across all degree and diploma programs. Two internal sessional exams per semester followed by AKTU / BTE final theory and practical exams.',
    semesterTimeline: {
      oddSemester: 'Classes: August to November | AKTU Final Exams: December / January',
      evenSemester: 'Classes: February to May | AKTU Final Exams: May / June',
      sessionalExams: 'Sessional-I at 6th week, Sessional-II at 12th week of each semester.',
    },
    attendanceRequirement: 'Minimum 75% attendance in theory lectures and practical labs is strictly mandatory to obtain the AKTU examination admit card.',
    admitCardRules: 'Issued digitally via the AKTU ERP portal (erp.aktu.ac.in) and verified with the college exam cell stamp.',
    evaluationScheme: 'Total Marks = 30% Internal Assessment (Sessionals + Assignments + Attendance) + 70% End-Semester University Examination.',
    marksheetAndDegree: 'End-semester marks statements published on the AKTU ERP portal. Degree certificates awarded during university convocation.',
  },

  scholarships: [
    {
      title: 'UP Government Post-Matric Scholarship & Fee Reimbursement Scheme',
      provider: 'Social Welfare Department, Government of Uttar Pradesh',
      coverage: 'Up to 100% Tuition Fee Reimbursement under UP State Social Welfare Department norms',
      eligibility: 'Domicile of Uttar Pradesh with annual family income below ₹2.0 Lakh (General/OBC/Minority) or ₹2.5 Lakh (SC/ST). Applicable to all AKTU & BTE enrolled students.',
      documentsRequired: ['Aadhaar Card (linked with mobile & NPCI bank account)', 'UP Domicile Certificate', 'Caste Certificate (OBC/SC/ST)', 'Latest Income Certificate (issued by Tehsildar)', '10th & 12th Marksheet', 'College Fee Receipt & AKTU Enrollment Number'],
      deadlineNote: 'Applications open on scholarship.up.gov.in from July to October every academic year.',
    },
    {
      title: 'VCTM Academic Merit Scholarship',
      provider: 'N.L. Educational Society',
      coverage: '15% to 25% Tuition Fee Waiver for 1st Year',
      eligibility: 'Awarded to meritorious students scoring 80% and above in 10+2 (Intermediate) board examinations or high ranks in JEE Main / CUET.',
      documentsRequired: ['10+2 Original Marksheet', 'Scorecard of JEE Main / CUET', 'Application submitted to Director Office'],
      deadlineNote: 'Must be claimed at the time of initial admission confirmation.',
    },
    {
      title: 'Beti Padhao Women Empowerment Grant',
      provider: 'VCTM Trust',
      coverage: 'Flat ₹5,000 / year concession in tuition fees across all 4 years',
      eligibility: 'Open to all female candidates enrolling in any B.Tech or Polytechnic engineering program.',
      documentsRequired: ['Admission Allotment Letter', 'Aadhaar Card'],
      deadlineNote: 'Applied automatically during semester fee deposition.',
    },
  ],

  hostelInfo: {
    availableFor: 'Separate secure on-campus hostels for Boys and Girls',
    roomTypes: [
      {
        type: 'Standard Student Accommodation',
        annualFee: 0,
        securityDeposit: 0,
        mealPlanIncluded: true,
        features: ['Furnished Bed, Study Desk, Chair & Wardrobe', 'Pure Vegetarian Nutritious Meals', 'High-speed Wi-Fi', '24/7 Power Backup & RO Water'],
      },
    ],
    amenities: [
      '100% Pure Vegetarian Hygienic Mess (Breakfast, Lunch, Evening Tea/Snacks, Dinner)',
      '24/7 Electricity with Generator Power Backup',
      'High-Speed Wi-Fi across hostel premises',
      'Purified RO Drinking Water with Water Coolers',
      'Resident Wardens & CCTV Camera Surveillance',
      'Common Rooms, Games Rooms (Table Tennis, Carrom, Chess) and Sports Courts',
    ],
    rules: {
      curfewGirls: 'Specific curfew hours are not published on the official website. Contact hostel warden for current rules.',
      curfewBoys: 'Specific curfew hours are not published on the official website. Contact hostel warden for current rules.',
      visitorsAllowed: 'Parents and authorized guardians permitted during designated visiting hours.',
      raggingPolicy: 'Zero-tolerance anti-ragging policy strictly enforced with anti-ragging committee.',
    },
    messDetails: {
      foodType: '100% Pure Vegetarian nutritious home-style Indian cuisine run with student cooperation',
      mealsPerDay: 4,
      diningHours: {
        breakfast: 'Morning',
        lunch: 'Afternoon',
        eveningSnacks: 'Evening (Tea & Snacks)',
        dinner: 'Night',
      },
    },
  },

  placementStats: {
    academicYear: 'Annual Placement Drives',
    placementRate: 'Active CRC Placement Assistance (Exact overall % not published on website)',
    highestPackage: 'Not published on official website',
    highestPackageCompany: 'Multiple Corporate Partners',
    averagePackage: 'Not published on official website',
    medianPackage: 'Contact TPO Desk',
    totalRecruiters: 20,
    totalOffers: 0,
    topRecruiters: [
      'IBM Ltd.',
      'Wipro Technologies',
      'L&T Infotech',
      'HCL Technologies',
      'Microsoft',
      'Samsung',
      'Accenture',
      'Tata Communications',
      'Indus Towers',
      'Bajaj Motors',
      'Axis Bank',
      'IndiaMART',
    ],
    keyHighlights: [
      'Dedicated Corporate Resource Centre (CRC) coordinating on-campus interviews and industrial training.',
      'Training and Placement Officer: Dr. Vivek Thakur.',
      'Summer training and internship coordination with corporate partners.',
      'Note: Highest package, average package, and overall placement percentage are not officially published on the college website.',
    ],
  },

  facilities: [
    {
      name: 'Computer & Workstation Labs',
      category: 'Academic',
      icon: 'Monitor',
      description: 'Multiple fully networked air-conditioned laboratories equipped with high-speed internet and development software.',
    },
    {
      name: 'Central Library',
      category: 'Academic',
      icon: 'BookOpen',
      description: 'Spacious air-conditioned library enriched with over 20,000 books, 100 National and 40 International Journals, INDEST e-journal access, and Book Bank facility.',
    },
    {
      name: 'Mechanical & Civil Workshops',
      category: 'Technical',
      icon: 'Wrench',
      description: 'Central workshop equipped with machine tools, surveying total stations, and material testing equipment.',
    },
    {
      name: 'Sports Complex & Playground',
      category: 'Recreation',
      icon: 'Trophy',
      description: 'Outdoor grounds and facilities for football, cricket, basketball, volleyball, plus indoor badminton, table tennis, and carrom setups.',
    },
    {
      name: 'Cafeteria',
      category: 'Campus Life',
      icon: 'Coffee',
      description: '2 cafeterias in different blocks serving healthy and hygienic food on the "Pay as you eat" concept.',
    },
    {
      name: 'State-of-the-Art Auditorium',
      category: 'Academic',
      icon: 'Trophy',
      description: 'Sound-proof audio-visual auditorium with surround-sound speakers and multimedia projector for seminars and cultural activities.',
    },
  ],

  transportRoutes: [
    { routeNumber: 1, destinationArea: 'Kalai Bamba to VCTM', majorPickups: ['Kalai Bamba', 'Barautha Neher', 'Harduaganj', 'Tala Nagri', 'PAC', 'Quarsi', 'OLF', 'Tikaram College', 'Dubey Ka Padao', 'Old Bus Stand', 'Masoodabad Chauraha', 'Sarsol Chauraha'], annualFare: 0 },
    { routeNumber: 2, destinationArea: 'Sidhauli to VCTM', majorPickups: ['Sidhauli', 'Dhanipur', 'Mandi', 'Etah Chungi', 'Kyampur Mod', 'Swarnjyanti Nagar', 'Devi Nagla', 'Naurangabad', 'Hathras Adda', 'Khinni Gate', 'Chirnaji Lal College', 'Sasni Gate', 'Agra Flyover'], annualFare: 0 },
    { routeNumber: 3, destinationArea: 'Rampur to VCTM', majorPickups: ['Rampur', 'Kasimpur', 'Jawan', 'Chherat', 'FM Tower', 'Jamalpur', 'Dhorra Pulia', 'Medical Gate', 'Dodhpur', 'AMU Circle', 'Shamshad Market', 'Firduas Nagar', 'Baraula Pul', 'Sarsol Chauraha'], annualFare: 0 },
    { routeNumber: 4, destinationArea: 'Gabhana to VCTM', majorPickups: ['Gabhana', 'Chuharpur (Naglia)', 'Pachpedha'], annualFare: 0 },
    { routeNumber: 5, destinationArea: 'Kayampur Mode to VCTM', majorPickups: ['Kayampur Mode', 'Quarsi Chauraha', 'Kela Nagar', 'Dodhpur', 'Dorra Pulia', 'AMU Circle', 'Samsad Market', 'Firduas Nagar', 'Sarsol Chauraha'], annualFare: 0 },
  ],

  admissionSteps: [
    { stepNumber: 1, title: 'Inquiry & Registration', description: 'Fill the VCTM Online Inquiry Form at vctm.in or visit the Admission Cell on Mathura Bypass. Pay nominal registration fee.' },
    { stepNumber: 2, title: 'Eligibility & Document Verification', description: 'Submit 10th/12th/Graduation marksheets, JEE Main / CUET / JEECUP scorecard (if applicable), Aadhaar card, and domicile certificates for verification.' },
    { stepNumber: 3, title: 'Seat Allotment & Counseling', description: 'Receive provisional seat allotment based on AKTU counseling (Code: 340) or Direct Merit Quota based on qualifying exam percentage.' },
    { stepNumber: 4, title: 'Fee Submission & Confirmation', description: 'Deposit the first semester or annual academic fees through NetBanking, UPI, Demand Draft, or at the college fee counter to secure your admission.' },
    { stepNumber: 5, title: 'Orientation & Induction', description: 'Collect your Student ID, library card, ERP portal credentials, and attend the AICTE Deeksharambh student induction program.' },
  ],

  requiredDocuments: [
    'Class 10th (High School) Marksheet and Passing Certificate (Original + 3 Self-Attested Photocopies)',
    'Class 12th (Intermediate) Marksheet and Passing Certificate',
    'Graduation Marksheet and Degree (For MBA & MCA applicants only)',
    'Polytechnic Diploma Marksheet (For B.Tech Lateral Entry applicants only)',
    'JEE Main / CUET / UPTAC / JEECUP Scorecard and Allotment Letter (If admitted via counseling)',
    'Transfer Certificate (TC) & Character Certificate from last attended institution',
    'Migration Certificate (For candidates from non-UP Board institutions)',
    'Domicile Certificate of Uttar Pradesh (Required for UP State Scholarship & Fee Reimbursement)',
    'Caste / Category Certificate (OBC / SC / ST / EWS) issued by competent Tehsildar',
    'Annual Family Income Certificate (Issued within last 6 months for UP scholarship)',
    'Candidate Aadhaar Card (Linked with active Mobile Number and NPCI Bank DBT)',
    '8 Recent Passport Size Color Photographs with white background',
    'Anti-Ragging Affidavits (Student and Parent format)',
  ],

  unsupportedPrograms: [
    'MBBS', 'BDS', 'B.Pharm', 'D.Pharm', 'LLB', 'BA LLB', 'B.Ed', 'B.Sc Nursing', 'B.Arch', 'Ph.D',
    'Aeronautical Engineering', 'Aerospace Engineering', 'Biotechnology', 'Chemical Engineering', 'BCA', 'BBA'
  ],
};
