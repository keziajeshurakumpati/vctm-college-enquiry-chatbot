import React, { useState } from 'react';
import {
  GraduationCap,
  Building,
  Award,
  DollarSign,
  Home,
  Briefcase,
  FileText,
  Bus,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  BookOpen,
  ShieldCheck,
  Sparkles,
  Users,
  Check,
  Layers,
  Bot,
} from 'lucide-react';
import { VCTM_DATA } from '../data/vctmKnowledgeBase';
import { CollegeNavTab } from './WebsiteHeader';
import heroCampusImg from '../assets/images/vctm_campus_hero_1790257787368.jpg';

interface CollegeSectionsProps {
  currentTab: CollegeNavTab;
  subCategory?: string;
  onSelectTab: (tab: CollegeNavTab, subCategory?: string) => void;
  onAskChatbot: (query: string) => void;
}

export const CollegeSections: React.FC<CollegeSectionsProps> = ({
  currentTab,
  subCategory,
  onSelectTab,
  onAskChatbot,
}) => {
  // Course filter state
  const [courseFilter, setCourseFilter] = useState<string>(() => {
    if (subCategory === 'btech') return 'btech';
    if (subCategory === 'diploma') return 'diploma';
    if (subCategory === 'management') return 'management';
    if (subCategory === 'computer') return 'computer';
    return 'all';
  });

  // Keep filter synced if subCategory changes
  React.useEffect(() => {
    if (subCategory === 'btech') setCourseFilter('btech');
    else if (subCategory === 'diploma') setCourseFilter('diploma');
    else if (subCategory === 'management') setCourseFilter('management');
    else if (subCategory === 'computer') setCourseFilter('computer');
  }, [subCategory]);

  const handleAsk = (query: string) => {
    onAskChatbot(query);
  };

  /* ----------------------------------------------------
     1. HOME SECTION
  ---------------------------------------------------- */
  if (currentTab === 'home') {
    return (
      <div className="w-full font-sans">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-[#0b1d3a] to-[#0f2c59] text-white py-12 sm:py-16 px-4 sm:px-8 overflow-hidden">
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <img
              src={heroCampusImg}
              alt="VCTM Campus"
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
              <Award className="w-3.5 h-3.5" />
              <span>AKTU College Code: 340 · BTE UP: 1628 · Approved by AICTE, New Delhi</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-serif uppercase max-w-4xl leading-tight">
              Vivekananda College
              <span className="block text-xl sm:text-2xl font-sans font-bold text-amber-300 tracking-wide mt-1">
                OF TECHNOLOGY & MANAGEMENT, ALIGARH
              </span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
              Established in 2008, VCTM is a premier technical institution in Uttar Pradesh offering quality engineering, polytechnic diploma, and professional management education with industry-ready training.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onSelectTab('enquiry')}
                className="px-5 py-3 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 transition-all hover:scale-105"
              >
                <Bot className="w-4 h-4 text-slate-950" />
                <span>Launch Enquiry Assistant</span>
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              </button>

              <button
                onClick={() => onSelectTab('courses')}
                className="px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider border border-white/20 transition-all flex items-center gap-1.5"
              >
                <span>Explore Courses</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onSelectTab('admissions')}
                className="px-5 py-3 rounded-lg bg-blue-900/60 hover:bg-blue-900 text-amber-300 font-semibold text-xs uppercase tracking-wider border border-amber-400/30 transition-all"
              >
                Admissions 2026-27
              </button>
            </div>
          </div>
        </section>

        {/* Key Highlights Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 -mt-6 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <span className="text-2xl sm:text-3xl font-black text-[#0f2c59] block">2008</span>
              <span className="text-xs text-slate-500 font-medium mt-0.5 block">Established Year</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <span className="text-2xl sm:text-3xl font-black text-amber-600 block">340</span>
              <span className="text-xs text-slate-500 font-medium mt-0.5 block">AKTU College Code</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 block">Active CRC</span>
              <span className="text-xs text-slate-500 font-medium mt-0.5 block">Placement & Training</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <span className="text-2xl sm:text-3xl font-black text-blue-700 block">10.7 Acres</span>
              <span className="text-xs text-slate-500 font-medium mt-0.5 block">Wi-Fi Campus</span>
            </div>
          </div>
        </section>

        {/* Interactive Enquiry Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
          <div className="bg-gradient-to-r from-[#0f2c59] to-[#1e3a8a] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-blue-900">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Student Digital Help Desk</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif">Have questions about admissions or courses?</h2>
              <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
                Our verified digital Enquiry Assistant understands your questions and provides direct, course-specific answers about eligibility, fees, scholarships, and hostel accommodation.
              </p>
            </div>
            <button
              onClick={() => onSelectTab('enquiry')}
              className="px-6 py-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider shrink-0 transition-colors shadow-sm flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-slate-950" />
              <span>Ask Enquiry Assistant</span>
            </button>
          </div>
        </section>

        {/* Featured Programs Overview */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0b1d3a] font-serif">Academic Programs at VCTM</h2>
              <p className="text-xs text-slate-500 mt-1">Approved by AICTE New Delhi and affiliated to AKTU Lucknow & BTE UP</p>
            </div>
            <button
              onClick={() => onSelectTab('courses')}
              className="text-xs font-bold text-[#0f2c59] hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All Programs</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: B.Tech */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0f2c59] flex items-center justify-center mb-3">
                  <GraduationCap className="w-5 h-5 text-[#0f2c59]" />
                </div>
                <h3 className="font-bold text-[#0b1d3a] text-base">B.Tech Engineering</h3>
                <p className="text-xs text-slate-500 mt-1">4-Year Degree · AKTU Affiliated</p>
                <div className="mt-3 text-xs text-slate-600 space-y-1">
                  <div>• Computer Science & Engineering (120 Seats)</div>
                  <div>• Artificial Intelligence & ML (60 Seats)</div>
                  <div>• Electronics & Communication, ME, Civil</div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Annual Fee:</span>
                  <span className="font-bold text-[#0f2c59]">₹65,000 – ₹75,000/yr</span>
                </div>
              </div>
              <button
                onClick={() => handleAsk('What are the B.Tech CSE fees and eligibility?')}
                className="mt-4 w-full py-2 bg-slate-50 hover:bg-blue-50 text-[#0f2c59] text-xs font-bold rounded border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Ask Chatbot About B.Tech</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 2: Polytechnic */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                  <Layers className="w-5 h-5 text-amber-700" />
                </div>
                <h3 className="font-bold text-[#0b1d3a] text-base">Polytechnic Diploma</h3>
                <p className="text-xs text-slate-500 mt-1">3-Year Diploma · BTE UP Code: 1145</p>
                <div className="mt-3 text-xs text-slate-600 space-y-1">
                  <div>• Mechanical Engineering (60 Seats)</div>
                  <div>• Civil Engineering (60 Seats)</div>
                  <div>• Electrical Engineering (60 Seats)</div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Annual Fee:</span>
                  <span className="font-bold text-[#0f2c59]">₹35,000/yr</span>
                </div>
              </div>
              <button
                onClick={() => handleAsk('Tell me about Polytechnic Diploma in Engineering')}
                className="mt-4 w-full py-2 bg-slate-50 hover:bg-amber-50 text-amber-900 text-xs font-bold rounded border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Ask Chatbot About Diploma</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 3: Post-Graduate & UG Management */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                  <Briefcase className="w-5 h-5 text-emerald-700" />
                </div>
                <h3 className="font-bold text-[#0b1d3a] text-base">Management & Computers</h3>
                <p className="text-xs text-slate-500 mt-1">MBA, MCA, BCA & BBA Programs</p>
                <div className="mt-3 text-xs text-slate-600 space-y-1">
                  <div>• MBA (HR, Finance, Marketing) - 60 Seats</div>
                  <div>• MCA (Master of Computer Apps) - 60 Seats</div>
                  <div>• BCA & BBA Undergraduate Degrees</div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Annual Fee:</span>
                  <span className="font-bold text-[#0f2c59]">₹40,000 – ₹65,000/yr</span>
                </div>
              </div>
              <button
                onClick={() => handleAsk('What are the MBA and MCA fees at VCTM?')}
                className="mt-4 w-full py-2 bg-slate-50 hover:bg-emerald-50 text-emerald-900 text-xs font-bold rounded border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Ask Chatbot About Management</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  /* ----------------------------------------------------
     2. ABOUT SECTION
  ---------------------------------------------------- */
  if (currentTab === 'about') {
    return (
      <div className="w-full py-8 px-4 sm:px-8 font-sans max-w-7xl mx-auto">
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 text-[#0f2c59] text-xs font-bold uppercase tracking-wider mb-2">
                <Building className="w-3.5 h-3.5" />
                <span>Institutional Profile</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b1d3a] font-serif">
                About Vivekananda College of Technology & Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Aligarh-Mathura Highway (NH-509), Aligarh, Uttar Pradesh · Established 2008
              </p>
            </div>

            <button
              onClick={() => handleAsk('Tell me about VCTM college and its history')}
              className="px-4 py-2 bg-[#0f2c59] hover:bg-[#0b1d3a] text-white text-xs font-bold rounded-lg flex items-center gap-2 shrink-0 transition-colors"
            >
              <Bot className="w-4 h-4 text-amber-300" />
              <span>Ask Chatbot About VCTM</span>
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p>
                <strong>Vivekananda College of Technology & Management (VCTM)</strong> was established in the year 2008 under the visionary leadership of the Vikrant Educational & Social Welfare Society. Situated on a sprawling 20-acre lush green campus along the Aligarh-Mathura National Highway (NH-509), the college stands as a benchmark for technical and management education in Western Uttar Pradesh.
              </p>
              <p>
                Inspired by the profound teachings of Swami Vivekananda, the institution is dedicated to building strong character, analytical intellect, and technical capabilities among young aspirants. Our curriculum integrates robust classroom instruction with practical laboratory rigor, industrial internships, and professional soft-skills training.
              </p>

              <h2 className="text-base font-bold text-[#0b1d3a] pt-3 font-serif">Vision & Mission</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#0f2c59] mb-1">Our Vision</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    To be a premier center of technical and managerial excellence, fostering innovation, ethical leadership, and societal contribution through transformative education.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#0f2c59] mb-1">Our Mission</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    To provide state-of-the-art infrastructure, experienced faculty, and industry partnerships that empower students to excel in national and global engineering domains.
                  </p>
                </div>
              </div>
            </div>

            {/* Accreditations Sidebar */}
            <div className="space-y-4">
              <div className="bg-[#0f2c59] text-white p-5 rounded-xl border border-blue-950 space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-amber-300 border-b border-blue-900 pb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Statutory Approvals</span>
                </h3>
                <div className="text-xs space-y-2.5">
                  <div>
                    <strong className="text-white block">AICTE New Delhi</strong>
                    <span className="text-slate-300 text-[11px]">Approved by Ministry of Education, Govt. of India</span>
                  </div>
                  <div>
                    <strong className="text-white block">AKTU Lucknow</strong>
                    <span className="text-slate-300 text-[11px]">Affiliated to Dr. A.P.J. Abdul Kalam Technical University (Code: 340)</span>
                  </div>
                  <div>
                    <strong className="text-white block">BTE Uttar Pradesh</strong>
                    <span className="text-slate-300 text-[11px]">Affiliated to Board of Technical Education, Lucknow (Code: 1628)</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-[#0b1d3a] block uppercase text-[10px] tracking-wider">Campus Overview</span>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Campus Area:</span>
                  <span className="font-medium text-slate-900">10.7 Acres</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Established:</span>
                  <span className="font-medium text-slate-900">2008</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Society:</span>
                  <span className="font-medium text-slate-900">N.L. Educational Society</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Director:</span>
                  <span className="font-medium text-slate-900">Dr. Y. K. Upadhyaya</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Registrar:</span>
                  <span className="font-medium text-slate-900">Mr. Mukesh Kumar</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-medium text-slate-900">NH-509 Aligarh</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Railway Station:</span>
                  <span className="font-medium text-slate-900">12 km from Jn</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------
     3. COURSES SECTION
  ---------------------------------------------------- */
  if (currentTab === 'courses') {
    const filteredCourses = VCTM_DATA.courses.filter((course) => {
      if (courseFilter === 'btech') return course.shortCode.startsWith('BTECH');
      if (courseFilter === 'diploma') return course.level === 'Diploma';
      if (courseFilter === 'management') return course.shortCode === 'MBA' || course.shortCode === 'BBA';
      if (courseFilter === 'computer') return course.shortCode === 'MCA' || course.shortCode === 'BCA' || course.shortCode.includes('CSE');
      return true;
    });

    return (
      <div className="w-full py-8 px-4 sm:px-8 font-sans max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b1d3a] font-serif">
              Academic Courses & Fee Catalog
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Approved programs, specializations, and seat intake for session 2026-27 (AKTU Code: 340 / BTE: 1628)
            </p>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setCourseFilter('all')}
              className={`px-3 py-1.5 rounded font-semibold transition-colors ${
                courseFilter === 'all'
                  ? 'bg-[#0f2c59] text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              All Courses ({VCTM_DATA.courses.length})
            </button>
            <button
              onClick={() => setCourseFilter('btech')}
              className={`px-3 py-1.5 rounded font-semibold transition-colors ${
                courseFilter === 'btech'
                  ? 'bg-[#0f2c59] text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              B.Tech Engineering
            </button>
            <button
              onClick={() => setCourseFilter('diploma')}
              className={`px-3 py-1.5 rounded font-semibold transition-colors ${
                courseFilter === 'diploma'
                  ? 'bg-[#0f2c59] text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Polytechnic Diploma
            </button>
            <button
              onClick={() => setCourseFilter('management')}
              className={`px-3 py-1.5 rounded font-semibold transition-colors ${
                courseFilter === 'management'
                  ? 'bg-[#0f2c59] text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              MBA & BBA
            </button>
            <button
              onClick={() => setCourseFilter('computer')}
              className={`px-3 py-1.5 rounded font-semibold transition-colors ${
                courseFilter === 'computer'
                  ? 'bg-[#0f2c59] text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              MCA & BCA
            </button>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-[#0f2c59] border border-blue-100">
                    {course.level} · {course.duration}
                  </span>
                  <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {course.totalSeats} Seats
                  </span>
                </div>

                <h3 className="font-bold text-[#0b1d3a] text-base mt-2 leading-tight">
                  {course.name}
                </h3>
                <p className="text-xs text-blue-900 font-semibold mt-0.5">
                  Code: {course.shortCode}
                </p>

                <div className="mt-3.5 space-y-2 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Eligibility:</span>
                    <p className="text-slate-700 text-xs mt-0.5 leading-snug">{course.eligibility}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-500">Annual Tuition Fee:</span>
                    <span className="font-extrabold text-[#0f2c59] text-sm">
                      ₹{course.annualFee.toLocaleString('en-IN')}/year
                    </span>
                  </div>

                  {course.examAccepted && course.examAccepted.length > 0 && (
                    <div className="text-[11px] text-slate-500">
                      Exams Accepted: <strong>{course.examAccepted.join(', ')}</strong>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleAsk(`Tell me about ${course.name} fees and eligibility`)}
                  className="w-full py-2 bg-[#0f2c59] hover:bg-[#0b1d3a] text-white text-xs font-bold rounded transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Bot className="w-3.5 h-3.5 text-amber-300" />
                  <span>Enquire About {course.shortCode}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------
     4. ADMISSIONS SECTION
  ---------------------------------------------------- */
  if (currentTab === 'admissions') {
    return (
      <div className="w-full py-8 px-4 sm:px-8 font-sans max-w-7xl mx-auto">
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                <span>Academic Session 2026-27</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b1d3a] font-serif">
                Admissions Procedure & Guidelines
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Direct Counseling & Entrance-Based Admissions for B.Tech, Diploma, MBA, MCA, BCA & BBA
              </p>
            </div>

            <button
              onClick={() => handleAsk('How do I take admission in VCTM college?')}
              className="px-4 py-2 bg-[#0f2c59] hover:bg-[#0b1d3a] text-white text-xs font-bold rounded-lg flex items-center gap-2 shrink-0 transition-colors"
            >
              <Bot className="w-4 h-4 text-amber-300" />
              <span>Ask Admissions Help Desk</span>
            </button>
          </div>

          {/* 5-Step Process */}
          <div className="mt-6">
            <h2 className="text-base font-bold text-[#0b1d3a] font-serif mb-4">
              5-Step Admission Process
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {VCTM_DATA.admissionSteps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-7 h-7 rounded-full bg-[#0f2c59] text-white font-bold text-xs flex items-center justify-center mb-2">
                      {step.stepNumber}
                    </div>
                    <h3 className="font-bold text-xs text-[#0b1d3a] mb-1">{step.title}</h3>
                    <p className="text-[11px] text-slate-600 leading-snug">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Required Documents & Scholarships */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-200">
            {/* Required Documents */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#0b1d3a] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0f2c59]" />
                <span>Mandatory Documents Checklist</span>
              </h2>
              <ul className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
                {VCTM_DATA.requiredDocuments.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Scholarships & Financial Aid */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#0b1d3a] flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Scholarships & Financial Aid</span>
              </h2>
              <div className="space-y-3">
                {VCTM_DATA.scholarships.map((s, idx) => (
                  <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0f2c59]">{s.title}</span>
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded">
                        {s.provider}
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs mt-1">{s.coverage}</p>
                    <p className="text-slate-500 text-[11px] mt-1">
                      <strong>Eligibility:</strong> {s.eligibility}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------
     5. FACILITIES SECTION
  ---------------------------------------------------- */
  if (currentTab === 'facilities') {
    return (
      <div className="w-full py-8 px-4 sm:px-8 font-sans max-w-7xl mx-auto">
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 text-[#0f2c59] text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Campus Infrastructure</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b1d3a] font-serif">
                Campus, Hostels & Transportation
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                20-acre green campus equipped with modern laboratories, high-speed Wi-Fi, separate hostels, and dedicated bus routes
              </p>
            </div>

            <button
              onClick={() => handleAsk('What facilities and hostel accommodations are available?')}
              className="px-4 py-2 bg-[#0f2c59] hover:bg-[#0b1d3a] text-white text-xs font-bold rounded-lg flex items-center gap-2 shrink-0 transition-colors"
            >
              <Bot className="w-4 h-4 text-amber-300" />
              <span>Ask About Facilities</span>
            </button>
          </div>

          {/* Hostels & Mess Box */}
          <div className="mt-6 bg-slate-50 rounded-xl p-5 border border-slate-200">
            <h2 className="font-bold text-sm text-[#0b1d3a] uppercase tracking-wider flex items-center gap-2 mb-3">
              <Home className="w-4 h-4 text-[#0f2c59]" />
              <span>Hostels (Boys & Girls) & 100% Vegetarian Mess</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {VCTM_DATA.hostelInfo.roomTypes.map((h, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
                  <div className="font-bold text-xs text-[#0f2c59]">{h.type}</div>
                  <div className="text-lg font-black text-slate-900 mt-1">
                    ₹{h.annualFee.toLocaleString('en-IN')}/year
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Includes 4 meals/day (Breakfast, Lunch, Evening Tea, Dinner)
                  </div>
                  <ul className="mt-2 text-[11px] text-slate-600 space-y-1">
                    {h.features.slice(0, 3).map((f, i) => (
                      <li key={i}>• {f}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bus Fleet Box */}
          <div className="mt-6 bg-slate-50 rounded-xl p-5 border border-slate-200">
            <h2 className="font-bold text-sm text-[#0b1d3a] uppercase tracking-wider flex items-center gap-2 mb-3">
              <Bus className="w-4 h-4 text-amber-700" />
              <span>College Bus Transportation Fleet (6 Designated Routes)</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {VCTM_DATA.transportRoutes.map((route) => (
                <div key={route.routeNumber} className="bg-white p-3.5 rounded-lg border border-slate-200 text-xs">
                  <div className="flex items-center justify-between font-bold text-[#0f2c59]">
                    <span>Route #{route.routeNumber}: {route.destinationArea}</span>
                    <span className="text-amber-800">₹{route.annualFare.toLocaleString('en-IN')}/yr</span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1.5">
                    <strong>Major Pickups:</strong> {route.majorPickups.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Facilities Grid */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {VCTM_DATA.facilities.map((fac, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">
                  {fac.category}
                </div>
                <h3 className="font-bold text-sm text-[#0b1d3a] mt-0.5">{fac.name}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{fac.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------
     6. PLACEMENTS SECTION
  ---------------------------------------------------- */
  if (currentTab === 'placements') {
    const stats = VCTM_DATA.placementStats;

    return (
      <div className="w-full py-8 px-4 sm:px-8 font-sans max-w-7xl mx-auto">
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
                <Briefcase className="w-3.5 h-3.5 text-emerald-700" />
                <span>Corporate Relations & Placements</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b1d3a] font-serif">
                Placement Cell & Top Recruiters
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Industry-focused corporate engagement with regular campus placement drives and skill workshops
              </p>
            </div>

            <button
              onClick={() => handleAsk('How are the placements and who are the top recruiters at VCTM?')}
              className="px-4 py-2 bg-[#0f2c59] hover:bg-[#0b1d3a] text-white text-xs font-bold rounded-lg flex items-center gap-2 shrink-0 transition-colors"
            >
              <Bot className="w-4 h-4 text-amber-300" />
              <span>Ask About Placements</span>
            </button>
          </div>

          {/* Key Placement Highlights */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-xl sm:text-2xl font-black text-emerald-700 block">
                Active CRC
              </span>
              <span className="text-xs text-slate-500 font-medium mt-0.5 block">Corporate Resource Centre</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-xl sm:text-2xl font-black text-[#0f2c59] block">
                On-Campus Drives
              </span>
              <span className="text-xs text-slate-500 font-medium mt-0.5 block">Regular Recruitments</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-xl sm:text-2xl font-black text-amber-700 block">
                TPO Support
              </span>
              <span className="text-xs text-slate-500 font-medium mt-0.5 block">Mock Interviews & Training</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-xl sm:text-2xl font-black text-blue-700 block">
                Top Recruiters
              </span>
              <span className="text-xs text-slate-500 font-medium mt-0.5 block">TCS, Infosys, Wipro & more</span>
            </div>
          </div>

          {/* Top Recruiters */}
          <div className="mt-8">
            <h2 className="font-bold text-sm text-[#0b1d3a] uppercase tracking-wider mb-4">
              Prominent Recruiting Partners
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {stats.topRecruiters.map((recruiter, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-center hover:bg-blue-50 transition-colors"
                >
                  <span className="font-bold text-xs text-[#0f2c59] block">{recruiter}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Training & Placement Cell Initiatives */}
          <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#0b1d3a] mb-2">
                Employability Enhancement Modules
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {stats.keyHighlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#0f2c59]">
                Training & Placement Officer (TPO) Desk
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Companies seeking campus recruitment drives, internships, or joint technical seminars are invited to contact the Training & Placement Cell.
              </p>
              <div className="pt-2 text-[11px] text-slate-700 space-y-1">
                <div><strong>Email:</strong> {VCTM_DATA.collegeInfo.officialEmail} / {VCTM_DATA.collegeInfo.alternateEmail}</div>
                <div><strong>Location:</strong> Corporate Relations Wing, Admin Block, VCTM Campus</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------
     7. CONTACT SECTION
  ---------------------------------------------------- */
  if (currentTab === 'contact') {
    const info = VCTM_DATA.collegeInfo;

    return (
      <div className="w-full py-8 px-4 sm:px-8 font-sans max-w-7xl mx-auto">
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 text-[#0f2c59] text-xs font-bold uppercase tracking-wider mb-2">
                <MapPin className="w-3.5 h-3.5 text-rose-700" />
                <span>Campus Location & Helplines</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b1d3a] font-serif">
                Contact & Campus Directions
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Vivekananda College of Technology & Management, Aligarh (AKTU Code: 340 · BTE: 1628)
              </p>
            </div>

            <button
              onClick={() => handleAsk('How can I contact the college and where is it located?')}
              className="px-4 py-2 bg-[#0f2c59] hover:bg-[#0b1d3a] text-white text-xs font-bold rounded-lg flex items-center gap-2 shrink-0 transition-colors"
            >
              <Bot className="w-4 h-4 text-amber-300" />
              <span>Ask Contact Helplines</span>
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Campus Address Card */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-[#0f2c59] font-bold text-xs uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-rose-600" />
                <span>Campus Address</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {info.campusAddress}
              </p>
              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200 space-y-1">
                <div>• <strong>Registered Office:</strong> {info.registeredOffice}</div>
                <div>• {info.distanceFromStation}</div>
                <div>• {info.transportAccess}</div>
              </div>
            </div>

            {/* Helpline Phone Numbers */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-[#0f2c59] font-bold text-xs uppercase tracking-wider">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Helpline Numbers</span>
              </div>
              <div className="space-y-1 text-xs font-mono">
                {info.helplinePhone.map((phone, idx) => (
                  <a
                    key={idx}
                    href={`tel:${phone.replace(/\s+/g, '')}`}
                    className="block font-bold text-[#0f2c59] hover:text-blue-700 transition-colors"
                  >
                    {phone}
                  </a>
                ))}
              </div>
              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                <span>Direct admission counseling and general student queries.</span>
              </div>
            </div>

            {/* Email & Working Hours */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-[#0f2c59] font-bold text-xs uppercase tracking-wider">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>Email & Office Timings</span>
              </div>
              <div className="space-y-1 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Official Email</span>
                  <a href={`mailto:${info.officialEmail}`} className="font-mono text-[#0f2c59] hover:underline">
                    {info.officialEmail}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase mt-1">Alternate / Admissions</span>
                  <a href={`mailto:${info.alternateEmail}`} className="font-mono text-[#0f2c59] hover:underline">
                    {info.alternateEmail}
                  </a>
                </div>
              </div>
              <div className="text-[11px] text-slate-600 pt-2 border-t border-slate-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{info.operatingHours}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
