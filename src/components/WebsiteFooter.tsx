import React from 'react';
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Clock,
  Globe,
  Facebook,
} from 'lucide-react';
import { VCTM_DATA } from '../data/vctmKnowledgeBase';

export const WebsiteFooter: React.FC = () => {
  const { socialMedia } = VCTM_DATA.collegeInfo;

  return (
    <footer className="bg-[#0b1d3a] text-slate-300 font-sans border-t-4 border-amber-400 mt-auto">
      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Column 1: College Emblem & Overview */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0f2c59] to-[#1e3a8a] text-white flex flex-col items-center justify-center border-2 border-amber-400 shrink-0 text-center">
                <GraduationCap className="w-5 h-5 text-amber-300" />
                <span className="text-[7px] font-bold text-amber-200 font-mono">2008</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm tracking-wide leading-tight font-serif uppercase">
                  Vivekananda College
                </h3>
                <p className="text-[11px] text-amber-300 font-semibold">
                  of Technology & Management
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Established in 2008 under N.L. Educational Society, VCTM is an AICTE-approved premier institution in Aligarh offering engineering, management, and polytechnic diploma education.
            </p>

            <div className="text-[11px] space-y-1 text-slate-300 bg-[#0f2c59]/70 p-2.5 rounded border border-blue-900/60 font-mono">
              <div><strong className="text-amber-300">AKTU College Code:</strong> 340 (AKTU Lucknow)</div>
              <div><strong className="text-amber-300">BTE College Code:</strong> 1628 (BTE Uttar Pradesh)</div>
              <div><strong className="text-amber-300">AICTE Approved:</strong> New Delhi</div>
            </div>
          </div>

          {/* Column 2: Campus & Helplines */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider border-b border-blue-900 pb-2">
              Campus & Helplines
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 leading-tight">
                  Mathura Bypass, Near Khair Road, 500m from Nada Pul, Aligarh - 202002 (U.P.)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="text-slate-200 font-mono text-[11px]">
                  <a href="tel:+919454010846" className="hover:text-amber-300 block">+91 94540 10846</a>
                  <a href="tel:+917906487855" className="hover:text-amber-300 block">+91 79064 87855 / +91 97560 79797</a>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="text-slate-200 text-[11px] font-mono">
                  <a href="mailto:info@vctm.in" className="hover:text-amber-300 block">info@vctm.in / vctmaligarh@gmail.com</a>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Mon – Sat (9:00 AM – 5:00 PM)</span>
              </div>
            </div>
          </div>

          {/* Column 3: Official Online Channels (Facebook & Official Website only) */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider border-b border-blue-900 pb-2">
              Official Channels
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed">
              Official online portals for admissions, notifications, counseling, and campus updates:
            </p>

            {/* Official Links: Facebook & Website Icons */}
            <div className="flex items-center gap-3 pt-1">
              {/* Facebook */}
              <a
                href={socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[#0f2c59] hover:bg-[#1877F2] text-white flex items-center justify-center transition-all border border-blue-900/80 shadow-xs hover:scale-105 active:scale-95 group"
                title="Follow VCTM Official Facebook Page (@vctmians)"
                aria-label="VCTM Facebook"
              >
                <Facebook className="w-5 h-5 text-slate-200 group-hover:text-white transition-colors" />
              </a>

              {/* Official Website */}
              <a
                href={socialMedia.website}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[#0f2c59] hover:bg-amber-500 text-white flex items-center justify-center transition-all border border-blue-900/80 shadow-xs hover:scale-105 active:scale-95 group"
                title="Visit Official Website: vctm.in"
                aria-label="VCTM Official Website"
              >
                <Globe className="w-5 h-5 text-amber-300 group-hover:text-slate-950 transition-colors" />
              </a>
            </div>

            {/* Quick Domain Hint */}
            <div className="pt-1.5 text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
              <span>Official Website:</span>
              <a
                href={socialMedia.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 hover:underline font-semibold"
              >
                vctm.in
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-footer Copyright */}
      <div className="bg-[#071326] border-t border-blue-950 py-3.5 px-4 sm:px-8 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Vivekananda College of Technology & Management (VCTM). All Rights Reserved.</p>
          <p className="text-[11px] text-slate-300">
            AKTU College Code: <strong className="text-amber-300">340</strong> · BTE Code: <strong className="text-amber-300">1628</strong>
          </p>
        </div>
      </div>
    </footer>
  );
};
