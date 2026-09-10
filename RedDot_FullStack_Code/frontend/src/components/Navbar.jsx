import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  ChevronDown, 
  GraduationCap, 
  Briefcase, 
  Compass, 
  ShieldCheck, 
  User, 
  Sparkles,
  ExternalLink,
  LogOut
} from 'lucide-react';
import { getCurrentUserApi, logoutUserApi } from '../services/api';

export default function Navbar({ activeRole, setActiveRole, activeTab, setActiveTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const currentUser = getCurrentUserApi();

  const navLinks = [
    { name: 'Home', action: () => { setActiveRole('landing'); setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
    { name: 'About', action: () => { setActiveRole('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
    { name: 'For Students', action: () => { setActiveRole('student'); setActiveTab('dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
    { name: 'For Recruiters', action: () => { setActiveRole('recruiter'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
    { name: 'For Faculty', action: () => { setActiveRole('faculty'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
    { name: 'Institutions', action: () => { setActiveRole('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      {/* Main AcademicX Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo: AcademicX */}
        <div 
          onClick={() => { setActiveRole('landing'); setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <img 
            src="/academicx-logo.jpg" 
            alt="AcademicX" 
            className="h-11 w-11 object-contain rounded-xl shadow-2xs group-hover:scale-105 transition-transform" 
          />
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-['Outfit'] leading-none">
              Academic<span className="text-sky-600">X</span>
            </span>
            <span className="text-[9px] font-bold tracking-wider text-slate-500 uppercase mt-0.5">
              Learn • Prepare • Achieve
            </span>
          </div>
        </div>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
          {navLinks.map((link, idx) => {
            const isActive = 
              (link.name === 'Home' && activeRole === 'landing') ||
              (link.name === 'About' && activeRole === 'about') ||
              (link.name === 'For Students' && activeRole === 'student') ||
              (link.name === 'For Recruiters' && activeRole === 'recruiter') ||
              (link.name === 'For Faculty' && activeRole === 'faculty') ||
              (link.name === 'Institutions' && activeRole === 'admin');

            return (
              <button
                key={idx}
                onClick={link.action}
                className={`transition hover:text-sky-600 py-2 relative cursor-pointer ${
                  isActive ? 'text-sky-700 font-semibold' : ''
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-600 rounded-full"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Auth Status or Login/Register */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  {currentUser.full_name || currentUser.email}
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                  {currentUser.role || 'Member'}
                </span>
              </div>
              <button
                onClick={() => {
                  const targetRole = currentUser.role || 'student';
                  setActiveRole(targetRole);
                  if (targetRole === 'student') setActiveTab('dashboard');
                }}
                className="flex items-center gap-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 px-3.5 py-1.5 rounded-full shadow-2xs transition cursor-pointer"
                title="Go to your portal dashboard"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => {
                  logoutUserApi();
                  setActiveRole('landing');
                  setActiveTab('home');
                }}
                className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50/70 hover:bg-red-100/70 px-3 py-1.5 rounded-full border border-red-200 transition cursor-pointer"
                title="Sign out of account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <>
              {/* Login Link */}
              <button
                onClick={() => setActiveRole('login')}
                className="hidden sm:block text-sm font-semibold text-slate-700 hover:text-sky-600 transition px-2 cursor-pointer"
              >
                Login
              </button>

              {/* Sky Blue Register Button */}
              <button
                onClick={() => setActiveRole('register')}
                className="bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm px-6 py-2.5 rounded-full shadow-xs hover:shadow-md transition-all active:scale-98 cursor-pointer"
              >
                Register
              </button>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {navLinks.map((link, idx) => {
            const isActive = 
              (link.name === 'Home' && activeRole === 'landing') ||
              (link.name === 'About' && activeRole === 'about') ||
              (link.name === 'For Students' && activeRole === 'student') ||
              (link.name === 'For Recruiters' && activeRole === 'recruiter') ||
              (link.name === 'For Faculty' && activeRole === 'faculty') ||
              (link.name === 'Institutions' && activeRole === 'admin');

            return (
              <button
                key={idx}
                onClick={() => {
                  link.action();
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                  isActive ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-slate-700 hover:bg-sky-50 hover:text-sky-700'
                }`}
              >
                {link.name}
              </button>
            );
          })}
          <div className="pt-3 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => { setActiveRole('login'); setMobileMenuOpen(false); }}
              className="w-1/2 py-2.5 text-center text-sm font-semibold border border-slate-200 rounded-xl text-slate-700"
            >
              Login
            </button>
            <button
              onClick={() => { setActiveRole('register'); setMobileMenuOpen(false); }}
              className="w-1/2 py-2.5 text-center text-sm font-semibold bg-sky-600 text-white rounded-xl"
            >
              Register
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
