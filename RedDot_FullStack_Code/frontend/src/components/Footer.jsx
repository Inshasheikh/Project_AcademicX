import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function Footer({ setActiveRole, setActiveTab }) {
  const navigateTo = (role, tab) => {
    if (setActiveRole) setActiveRole(role);
    if (setActiveTab && tab) setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#082f49] text-slate-200 text-sm pt-16 pb-12 mt-20 border-t border-sky-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Info Column */}
          <div className="md:col-span-2 space-y-4">
            <div 
              onClick={() => navigateTo('landing', 'home')}
              className="flex items-center gap-3 cursor-pointer select-none"
            >
              <img 
                src="/academicx-logo.jpg" 
                alt="AcademicX" 
                className="h-10 w-10 object-contain rounded-xl shadow-xs bg-white p-0.5" 
              />
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-white tracking-tight font-['Outfit'] leading-none">
                  Academic<span className="text-sky-400">X</span>
                </span>
                <span className="text-[9px] font-semibold tracking-wider text-slate-300 uppercase mt-0.5">
                  Learn • Prepare • Achieve
                </span>
              </div>
            </div>
            <p className="text-slate-200 text-xs sm:text-sm max-w-sm leading-relaxed font-medium">
              Bridge the Academia-Industry Gap.
            </p>
            <p className="text-slate-300 text-xs max-w-sm leading-relaxed">
              India's premier AI-powered higher education and corporate placement platform. Smart India Hackathon 2026 (Problem Statement ID: 26044).
            </p>
          </div>

          {/* Platform Column */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li><button onClick={() => navigateTo('student', 'dashboard')} className="hover:text-white transition cursor-pointer">Students</button></li>
              <li><button onClick={() => navigateTo('recruiter')} className="hover:text-white transition cursor-pointer">Recruiters</button></li>
              <li><button onClick={() => navigateTo('faculty')} className="hover:text-white transition cursor-pointer">Faculty</button></li>
              <li><button onClick={() => navigateTo('admin')} className="hover:text-white transition cursor-pointer">Institutions</button></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <button 
                  onClick={() => navigateTo('about')} 
                  className="hover:text-white transition text-sky-300 font-semibold cursor-pointer"
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('about')} 
                  className="hover:text-white transition cursor-pointer"
                >
                  Tech Stack
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('about')} 
                  className="hover:text-white transition cursor-pointer"
                >
                  Roadmap
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li><a href="#privacy" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-white transition">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
