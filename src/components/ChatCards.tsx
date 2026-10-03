import React from 'react';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Bus,
  Calendar,
  Layers,
  Award,
  HelpCircle,
  GraduationCap,
  DollarSign,
  Briefcase,
} from 'lucide-react';
import { CollegeCourse } from '../types/chatbot';
import { VCTM_DATA } from '../data/vctmKnowledgeBase';

interface CardProps {
  type: string;
  data: any;
  onFollowUpClick?: (query: string) => void;
}

export const ChatCard: React.FC<CardProps> = ({ type, data, onFollowUpClick }) => {
  if (!data) return null;

  switch (type) {
    case 'fee_table': {
      const isSpecific = data.isSpecific;
      const course: CollegeCourse | undefined = data.course;
      const courses: CollegeCourse[] | undefined = data.courses;

      if (isSpecific && course) {
        return (
          <div className="mt-3 bg-[#f8fafc] border border-slate-200 rounded-lg p-3.5 shadow-2xs text-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-slate-200 gap-1">
              <div>
                <h4 className="font-bold text-[#0b1d3a] text-xs uppercase tracking-wide">
                  {course.name} ({course.shortCode})
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  {course.duration} · Sanctioned Intake: {course.totalSeats} Seats
                </p>
              </div>
              <div className="sm:text-right">
                <span className="text-xs font-bold text-[#0f2c59] bg-blue-50 border border-blue-200 px-2 py-1 rounded inline-block">
                  UP Fee Fixation Norms
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">AKTU Code: 340</span>
              </div>
            </div>

            <div className="p-3 my-2.5 bg-white border border-slate-200 rounded text-xs space-y-1.5">
              <div className="text-[11px] text-slate-700 font-medium">
                <strong>Official Fee Guidelines:</strong> Exact tuition and semester installment fee schedules are governed by the Uttar Pradesh State Fee Regulatory Committee and AKTU / BTE UP approved directives.
              </div>
              <div className="text-[11px] text-slate-600">
                To receive the official session 2026–27 verified fee circular and semester breakdown, contact the <strong>VCTM Admission Cell</strong> at <strong>+91 94540 10846</strong> or <strong>info@vctm.in</strong>.
              </div>
            </div>

            <div className="text-[11px] text-slate-600 space-y-1 pt-1 border-t border-slate-200">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Semester installment payment facilities available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Eligible UP domicile students can claim up to 100% UP Post-Matric Scholarship reimbursement</span>
              </div>
            </div>

            {onFollowUpClick && (
              <div className="pt-2.5 mt-2 border-t border-slate-200 flex flex-wrap gap-2">
                <button
                  onClick={() => onFollowUpClick(`What is the eligibility for ${course.shortCode}?`)}
                  className="text-[11px] text-[#0f2c59] hover:text-blue-900 font-semibold flex items-center gap-1 hover:underline"
                >
                  View Eligibility for {course.shortCode} <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        );
      }

      return (
        <div className="mt-3 bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs text-slate-800">
          <div className="bg-[#0f2c59] text-white px-3 py-1.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
            <span>VCTM Approved Academic Programs & Regulatory Fee Norms</span>
            <span className="font-mono text-amber-300">AKTU Code: 340</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="py-2 px-3 font-bold">Course Program</th>
                  <th className="py-2 px-3 font-bold">Duration</th>
                  <th className="py-2 px-3 font-bold">Intake</th>
                  <th className="py-2 px-3 font-bold text-[#0f2c59]">Tuition Fee Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(courses || VCTM_DATA.courses).map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-3 font-semibold text-slate-900">{c.shortCode}</td>
                    <td className="py-2 px-3 text-slate-600">{c.duration}</td>
                    <td className="py-2 px-3 text-slate-600 font-mono">{c.totalSeats} seats</td>
                    <td className="py-2 px-3 font-medium text-slate-700 text-[11px]">As per UP Fee Regulatory Norms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-600">
            * Exact session circular available from Admission Desk (+91 94540 10846). Eligible UP domicile candidates can receive full reimbursement via UP Post-Matric Scholarship.
          </div>
        </div>
      );
    }

    case 'hostel_card': {
      const hostel = data.hostelInfo || VCTM_DATA.hostelInfo;
      return (
        <div className="mt-3 bg-[#f8fafc] border border-slate-200 rounded-lg p-3.5 shadow-2xs text-slate-800">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h4 className="font-bold text-[#0b1d3a] text-xs uppercase tracking-wide">
                On-Campus Hostels & Vegetarian Mess
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">
                Separate residential blocks for Boys & Girls · 24/7 Security & Power Backup
              </p>
            </div>
            <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded">
              4 Meals / Day Included
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 my-2.5">
            {hostel.roomTypes.map((room: any, idx: number) => (
              <div key={idx} className="p-2.5 border border-slate-200 rounded bg-white">
                <span className="font-bold text-slate-900 text-[11px] block">{room.type}</span>
                <span className="text-[#0f2c59] font-bold text-xs block mt-0.5 font-mono">
                  ₹{room.annualFee.toLocaleString('en-IN')} / year
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">
                  High-speed Wi-Fi · Power Backup · RO Water
                </span>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-200">
            <strong className="text-slate-800">Mess Schedule:</strong> 100% Pure Vegetarian Mess (Breakfast, Lunch, Evening Tea, Dinner)
          </div>
        </div>
      );
    }

    case 'placement_stats': {
      const stats = data.placementStats || VCTM_DATA.placementStats;
      return (
        <div className="mt-3 bg-[#f8fafc] border border-slate-200 rounded-lg p-3.5 shadow-2xs text-slate-800">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h4 className="font-bold text-[#0b1d3a] text-xs uppercase tracking-wide">
                Training & Corporate Resource Centre (CRC)
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">
                Dedicated placement assistance, campus interview drives & industry engagement
              </p>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              Active TPO Cell
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 my-2.5 text-center">
            <div className="p-2.5 bg-white border border-slate-200 rounded">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Corporate Engagement</span>
              <span className="font-bold text-[#0b1d3a] text-xs block mt-0.5">On-Campus Drives</span>
              <span className="text-[9px] text-slate-500 block mt-0.5">IT, Core Engg & Management</span>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Skill Training</span>
              <span className="font-bold text-[#0b1d3a] text-xs block mt-0.5">Aptitude & Technical</span>
              <span className="text-[9px] text-slate-500 block mt-0.5">Mock Interviews & Soft Skills</span>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Industry Visits</span>
              <span className="font-bold text-[#0b1d3a] text-xs block mt-0.5">Delhi-NCR Hubs</span>
              <span className="text-[9px] text-slate-500 block mt-0.5">Live Industrial Exposure</span>
            </div>
          </div>

          <div className="pt-1">
            <span className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Prominent Corporate Recruiters:</span>
            <div className="flex flex-wrap gap-1">
              {(stats.topRecruiters || []).slice(0, 8).map((rec: any, idx: number) => {
                const name = typeof rec === 'string' ? rec : rec.name;
                return (
                  <span
                    key={idx}
                    className="text-[10px] bg-white border border-slate-200 text-slate-700 font-medium px-2 py-0.5 rounded"
                  >
                    {name}
                  </span>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-500 mt-2 italic">
              * Exact placement statistics and package offers vary each year depending on company drives. For verified annual batch reports, contact the CRC Placement Desk directly at info@vctm.in.
            </p>
          </div>
        </div>
      );
    }

    case 'scholarship_breakdown': {
      const scholarships = data.scholarships || VCTM_DATA.scholarships;
      return (
        <div className="mt-3 bg-[#f8fafc] border border-slate-200 rounded-lg p-3.5 shadow-2xs text-slate-800">
          <h4 className="font-bold text-[#0b1d3a] text-xs uppercase tracking-wide mb-2">
            Available Scholarships & Financial Assistance
          </h4>
          <div className="space-y-2 text-xs">
            {scholarships.slice(0, 3).map((sch: any, idx: number) => (
              <div key={idx} className="p-2.5 bg-white rounded border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0b1d3a] text-[11px]">{sch.title}</span>
                  <span className="text-[10px] text-amber-700 font-semibold">{sch.provider.split(',')[0]}</span>
                </div>
                <p className="text-slate-600 text-[11px] mt-0.5">{sch.coverage}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'contact_card': {
      const info = data.collegeInfo || VCTM_DATA.collegeInfo;
      return (
        <div className="mt-3 bg-[#f8fafc] border border-slate-200 rounded-lg p-3.5 shadow-2xs text-slate-800">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <Building2 className="w-4 h-4 text-[#0f2c59]" />
            <h4 className="font-bold text-[#0b1d3a] text-xs uppercase tracking-wide">
              VCTM Admission & Campus Directory
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-2.5 text-xs">
            <div className="p-2.5 bg-white border border-slate-200 rounded">
              <span className="font-bold text-slate-900 block flex items-center gap-1 text-[11px]">
                <Phone className="w-3.5 h-3.5 text-[#0f2c59]" /> Admission Helplines
              </span>
              <div className="mt-1 space-y-0.5">
                {info.helplinePhone.map((phone: string, idx: number) => (
                  <a
                    key={idx}
                    href={`tel:${phone.replace(/\s+/g, '')}`}
                    className="block text-[#0f2c59] hover:underline font-mono text-[11px] font-semibold"
                  >
                    {phone}
                  </a>
                ))}
              </div>
            </div>

            <div className="p-2.5 bg-white border border-slate-200 rounded">
              <span className="font-bold text-slate-900 block flex items-center gap-1 text-[11px]">
                <Mail className="w-3.5 h-3.5 text-[#0f2c59]" /> Official Email
              </span>
              <div className="mt-1 space-y-0.5">
                <a href={`mailto:${info.admissionsEmail}`} className="block text-[#0f2c59] hover:underline text-[11px] font-mono">
                  {info.admissionsEmail}
                </a>
                <span className="text-[10px] text-slate-500 block pt-0.5">Office: {info.operatingHours}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    case 'admission_steps': {
      const steps = data.steps || VCTM_DATA.admissionSteps;
      return (
        <div className="mt-3 bg-[#f8fafc] border border-slate-200 rounded-lg p-3.5 shadow-2xs text-slate-800">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h4 className="font-bold text-[#0b1d3a] text-xs uppercase tracking-wide">
              VCTM Admission Steps (Session 2026-27)
            </h4>
            <span className="text-[10px] text-[#0f2c59] font-mono font-bold">AKTU Code: 340</span>
          </div>

          <div className="mt-2.5 space-y-2">
            {steps.map((step: any) => (
              <div key={step.stepNumber} className="flex gap-2.5 text-xs items-start">
                <div className="w-4 h-4 rounded-full bg-[#0f2c59] text-white font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                  {step.stepNumber}
                </div>
                <div>
                  <span className="font-bold text-slate-900 text-[11px]">{step.title}</span>
                  <p className="text-slate-600 text-[11px]">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'course_card': {
      const course: CollegeCourse | undefined = data.course;
      const allCourses: CollegeCourse[] | undefined = data.allCourses || data.courses;

      if (course) {
        return (
          <div className="mt-3 bg-[#f8fafc] border border-slate-200 rounded-lg p-3.5 shadow-2xs text-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div>
                <h4 className="font-bold text-[#0b1d3a] text-xs uppercase tracking-wide">{course.name}</h4>
                <p className="text-[11px] text-slate-500">{course.level} · {course.duration}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-[#0f2c59]">
                  {course.annualFee && course.annualFee > 0 ? `₹${course.annualFee.toLocaleString('en-IN')}/yr` : 'UP Regulatory Norms'}
                </span>
                <span className="text-[10px] text-slate-500 block">{course.totalSeats} Seats</span>
              </div>
            </div>

            <div className="my-2 text-[11px] space-y-1">
              <div>
                <strong className="text-slate-700">Eligibility:</strong>{' '}
                <span className="text-slate-600">{course.eligibility}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-1">
              {course.curriculumHighlights.map((sub, idx) => (
                <span key={idx} className="text-[10px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded">
                  {sub}
                </span>
              ))}
            </div>
          </div>
        );
      }

      if (allCourses && allCourses.length > 0) {
        const btechCourses = allCourses.filter(
          (c) => c.level === 'Undergraduate' || c.shortCode.startsWith('B.Tech')
        );
        const pgCourses = allCourses.filter(
          (c) => c.level === 'Postgraduate' || ['MBA', 'MCA', 'M.Tech Production', 'M.Tech Structural'].includes(c.shortCode)
        );
        const diplomaCourses = allCourses.filter(
          (c) => c.level === 'Diploma' || c.shortCode.toLowerCase().includes('polytechnic') || c.shortCode.toLowerCase().includes('diploma')
        );

        return (
          <div className="mt-3 bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs text-slate-800">
            <div className="bg-[#0f2c59] text-white px-3.5 py-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
              <span>VCTM Complete Approved Programmes</span>
              <span className="text-amber-300 font-mono text-[11px]">AKTU: 340 · BTE: 1628</span>
            </div>

            <div className="p-3 space-y-3 text-xs">
              {/* 1. B.Tech Programmes */}
              <div>
                <div className="font-bold text-[#0b1d3a] text-xs flex items-center gap-1.5 pb-1 border-b border-slate-200 mb-2">
                  <GraduationCap className="w-4 h-4 text-[#0f2c59]" />
                  <span>1. Bachelor of Technology (B.Tech - 4 Years · AKTU Code: 340)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {btechCourses.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => onFollowUpClick && onFollowUpClick(`Tell me about ${c.name}`)}
                      className="text-left p-2 rounded bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-colors"
                    >
                      <div className="font-semibold text-slate-900 text-[11px]">{c.shortCode}</div>
                      <div className="text-[10px] text-slate-500">{c.name} · {c.totalSeats} seats</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Postgraduate Programmes */}
              <div>
                <div className="font-bold text-[#0b1d3a] text-xs flex items-center gap-1.5 pb-1 border-b border-slate-200 mb-2">
                  <Briefcase className="w-4 h-4 text-[#0f2c59]" />
                  <span>2. Postgraduate Programmes (2 Years · AKTU Code: 340)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {pgCourses.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => onFollowUpClick && onFollowUpClick(`Tell me about ${c.name}`)}
                      className="text-left p-2 rounded bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-colors"
                    >
                      <div className="font-semibold text-slate-900 text-[11px]">{c.shortCode}</div>
                      <div className="text-[10px] text-slate-500">{c.name} · {c.totalSeats} seats</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Polytechnic Diploma */}
              <div>
                <div className="font-bold text-[#0b1d3a] text-xs flex items-center gap-1.5 pb-1 border-b border-slate-200 mb-2">
                  <Layers className="w-4 h-4 text-[#0f2c59]" />
                  <span>3. Polytechnic Diploma in Engineering (3 Years · BTE UP Code: 1628)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {diplomaCourses.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => onFollowUpClick && onFollowUpClick(`Tell me about ${c.name}`)}
                      className="text-left p-2 rounded bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-colors"
                    >
                      <div className="font-semibold text-slate-900 text-[11px]">{c.shortCode}</div>
                      <div className="text-[10px] text-slate-500">{c.name} · Civil, Mechanical, Electrical, Electronics</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between items-center">
              <span>All programmes AICTE approved</span>
              <span>Tap any course for eligibility & details</span>
            </div>
          </div>
        );
      }

      return null;
    }

    case 'exam_card': {
      const exams = data.exams || VCTM_DATA.examinations;
      return (
        <div className="mt-3 bg-[#f8fafc] border border-slate-200 rounded-lg p-3.5 shadow-2xs text-slate-800">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h4 className="font-bold text-[#0b1d3a] text-xs uppercase tracking-wide">
              AKTU Examination Structure & Guidelines
            </h4>
            <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
              75% Attendance Mandatory
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 my-2 text-xs">
            <div className="p-2 bg-white border border-slate-200 rounded">
              <span className="font-bold text-slate-900 text-[11px] block">Odd Semester Exams</span>
              <span className="text-slate-600 text-[10px] block mt-0.5">December / January (Sem 1, 3, 5, 7)</span>
            </div>
            <div className="p-2 bg-white border border-slate-200 rounded">
              <span className="font-bold text-slate-900 text-[11px] block">Even Semester Exams</span>
              <span className="text-slate-600 text-[10px] block mt-0.5">May / June (Sem 2, 4, 6, 8)</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-600 pt-1">
            <strong className="text-slate-800">Evaluation:</strong> {exams.evaluationScheme}
          </div>
        </div>
      );
    }

    case 'transport_card': {
      const routes = data.routes || VCTM_DATA.transportRoutes;
      return (
        <div className="mt-3 bg-[#f8fafc] border border-slate-200 rounded-lg p-3.5 shadow-2xs text-slate-800">
          <div className="flex items-center gap-1.5 pb-2 border-b border-slate-200">
            <Bus className="w-4 h-4 text-[#0f2c59]" />
            <h4 className="font-bold text-[#0b1d3a] text-xs uppercase tracking-wide">
              College Bus Routes (25+ Fleet)
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2 text-xs">
            {routes.map((r: any) => (
              <div key={r.routeNumber} className="p-2 bg-white border border-slate-200 rounded">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-[11px]">Route {r.routeNumber}: {r.destinationArea}</span>
                  <span className="text-[#0f2c59] font-bold font-mono text-[11px]">₹{r.annualFare.toLocaleString('en-IN')}/yr</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Pickups: {r.majorPickups.slice(0, 3).join(', ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'location_card': {
      const info = data.collegeInfo || VCTM_DATA.collegeInfo;
      return (
        <div className="mt-3 bg-[#f8fafc] border border-slate-200 rounded-lg p-3.5 shadow-2xs text-slate-800">
          <div className="flex items-center gap-1.5 pb-2 border-b border-slate-200">
            <MapPin className="w-4 h-4 text-rose-700" />
            <h4 className="font-bold text-[#0b1d3a] text-xs uppercase tracking-wide">
              VCTM Campus Location & Distance
            </h4>
          </div>

          <div className="my-2 space-y-1.5 text-xs">
            <div className="p-2 bg-white border border-slate-200 rounded text-[11px]">
              <strong className="text-slate-800 block">Campus Address:</strong>
              <span className="text-slate-600">{info.address}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 bg-white border border-slate-200 rounded">
                <strong className="text-slate-800 block">From Aligarh Junction:</strong>
                <span className="text-slate-600">{info.distanceFromStation}</span>
              </div>
              <div className="p-2 bg-white border border-slate-200 rounded">
                <strong className="text-slate-800 block">From Sasni Gate Stand:</strong>
                <span className="text-slate-600">{info.distanceFromBusStand}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    case 'fallback_card': {
      const topics = [
        { label: 'Courses Offered', query: 'What courses are offered?', icon: GraduationCap },
        { label: 'B.Tech Fees', query: 'btech fees', icon: DollarSign },
        { label: 'Eligibility', query: 'What is the eligibility for B.Tech?', icon: CheckCircle2 },
        { label: 'CS Department HOD', query: 'Who is the HOD of CS?', icon: Layers },
        { label: 'Hostel & Mess', query: 'What hostel facilities are available?', icon: Building2 },
        { label: 'Placements & Packages', query: 'How are the placements?', icon: Briefcase },
        { label: 'Bus Routes', query: 'Does the college provide bus transport facility?', icon: Bus },
        { label: 'Helpline & Address', query: 'How can I contact the college?', icon: Phone },
      ];

      return (
        <div className="mt-3 bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200 rounded-xl p-3.5 shadow-2xs text-slate-800">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-200/80">
            <div className="w-6 h-6 rounded-md bg-[#0f2c59] text-white flex items-center justify-center shrink-0">
              <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
            </div>
            <div>
              <h4 className="font-bold text-[#0b1d3a] text-xs uppercase tracking-wide">
                VCTM Enquiry Assistance Directory
              </h4>
              <p className="text-[11px] text-slate-500">
                Click any college topic below for instant verified details:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
            {topics.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => onFollowUpClick && onFollowUpClick(item.query)}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white hover:bg-blue-50/80 border border-slate-200 hover:border-blue-300 transition-all text-left group shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-[#0f2c59]" />
                    <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-950">
                      {item.label}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-900 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    default:
      return null;
  }
};
