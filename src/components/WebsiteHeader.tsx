import React from 'react';
import {
  GraduationCap,
  Phone,
  Mail,
  Award,
  Globe,
} from 'lucide-react';

export type CollegeNavTab =
  | 'home'
  | 'about'
  | 'courses'
  | 'admissions'
  | 'facilities'
  | 'placements'
  | 'contact'
  | 'enquiry';

export const WebsiteHeader: React.FC = () => {
  return (
    <header className="w-full bg-white shadow-xs border-b border-slate-200 sticky top-0 z-40 font-sans">
      {/* 1. Top Utility Notification Strip */}
      <div className="bg-[#0b1d3a] text-slate-200 text-[11px] py-1.5 px-4 sm:px-8 border-b border-blue-950 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-1">
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto scrollbar-none whitespace-nowrap">
            <span className="inline-flex items-center gap-1.5 text-amber-300 font-semibold">
              <Award className="w-3.5 h-3.5" /> AKTU College Code: 340
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="inline-flex items-center gap-1.5 text-amber-300 font-semibold">
              BTE UP Code: 1628
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline text-slate-300">
              Approved by AICTE, New Delhi
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[11px] whitespace-nowrap">
            <a
              href="tel:+919454010846"
              className="hover:text-amber-300 transition-colors flex items-center gap-1 text-slate-200 font-mono"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span>+91 94540 10846</span>
            </a>
            <span className="text-slate-500">|</span>
            <a
              href="mailto:info@vctm.in"
              className="hover:text-amber-300 transition-colors hidden sm:flex items-center gap-1 text-slate-200"
            >
              <Mail className="w-3 h-3 text-amber-400" />
              <span>info@vctm.in</span>
            </a>
            <span className="hidden sm:inline text-slate-500">|</span>
            <a
              href="https://vctm.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-300 hover:underline font-semibold text-[10px] inline-flex items-center gap-1"
            >
              <Globe className="w-3 h-3 text-amber-400" />
              <span>vctm.in</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Institutional College Branding Banner */}
      <div className="bg-white py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & College Wordmark */}
          <div className="flex items-center gap-3 sm:gap-4 text-left select-none">
            {/* VCTM College Emblem Seal */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#0b1d3a] to-[#1e3a8a] text-white flex flex-col items-center justify-center p-1 border-2 border-amber-400 shadow-xs shrink-0 text-center">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
              <span className="text-[8px] font-bold tracking-tighter text-amber-200 font-mono mt-0.5">
                ESTD. 2008
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-base sm:text-2xl font-extrabold tracking-tight text-[#0b1d3a] leading-tight font-serif uppercase">
                Vivekananda College
              </span>
              <span className="text-xs sm:text-sm font-bold tracking-wide text-blue-900 leading-tight">
                OF TECHNOLOGY & MANAGEMENT, ALIGARH
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden sm:block mt-0.5">
                Approved by AICTE, New Delhi · Affiliated to Dr. A.P.J. Abdul Kalam Technical University, Lucknow (Code: 340) · BTE UP (Code: 1628)
              </span>
            </div>
          </div>

          {/* Institutional Status Badge on Right */}
          <div className="hidden md:flex flex-col items-end text-right">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0f2c59]">
              Session 2026–2027
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Admissions Enquiry Desk Active
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
