import React from 'react';
import { 
  Sparkles, 
  GraduationCap, 
  Briefcase, 
  Compass, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  User, 
  Brain, 
  Target, 
  Building2,
  ExternalLink,
  Code2,
  Database,
  Server,
  Layers,
  Cpu,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Zap,
  Lock,
  ChevronRight,
  TrendingUp,
  Award,
  FileCheck2,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserApi } from '../services/api';

export default function LandingPage({ setActiveRole, setActiveTab }) {
  const navigate = useNavigate();
  const currentUser = getCurrentUserApi();

  const handleGoToWorkspace = () => {
    const rawRole = currentUser?.role || 'student';
    const role = String(rawRole).toLowerCase();
    if (typeof setActiveRole === 'function') setActiveRole(role);
    if (role === 'student') {
      if (typeof setActiveTab === 'function') setActiveTab('dashboard');
      navigate('/student/dashboard');
    } else {
      navigate(`/${role}/dashboard`);
    }
  };

  return (
    <div className="bg-white text-slate-900 overflow-hidden font-['Inter',sans-serif]">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Modern 2-Column with Dynamic CTAs & Illustration) */}
      {/* ========================================================================= */}
      <section className="relative pt-8 pb-16 lg:pt-14 lg:pb-20 border-b border-slate-200/60 bg-gradient-to-b from-[#f4f8fe] via-[#f8fbff] to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Text & Call to Action */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-slate-900 tracking-tight leading-[1.12] font-['Outfit']">
                Bridge the{' '}
                <span className="bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
                  Academia-Industry
                </span>{' '}
                Gap
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                AcademicX connects students, corporate recruiters, and higher education institutions through 
                adaptive AI skill diagnostics, fraud-proof digital credentials, and automated matching.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                {currentUser ? (
                  <>
                    <button
                      onClick={handleGoToWorkspace}
                      className="w-full sm:w-auto px-7 py-3 rounded-full bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Launch My Workspace ({currentUser.role || 'Member'})</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <a
                      href="#portals"
                      className="w-full sm:w-auto px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-semibold text-sm transition-all cursor-pointer text-center"
                    >
                      Explore Portals
                    </a>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        if (typeof setActiveRole === 'function') setActiveRole('register');
                        navigate('/register');
                      }}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 group"
                    >
                      <span>Get Started Free</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                      onClick={() => {
                        if (typeof setActiveRole === 'function') setActiveRole('login');
                        navigate('/login');
                      }}
                      className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-sm shadow-2xs transition-all cursor-pointer"
                    >
                      Sign In to Portal
                    </button>
                  </>
                )}
              </div>

              {/* Trust Badges */}
              <div className="pt-4 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto lg:mx-0 border-t border-slate-200/80 text-[11px] sm:text-xs text-slate-600">
                <div className="flex items-center gap-1.5 justify-center lg:justify-start font-medium">
                  <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Fraud-Proof</span>
                </div>
                <div className="flex items-center gap-1.5 justify-center lg:justify-start font-medium">
                  <Brain className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>AI Diagnostics</span>
                </div>
                <div className="flex items-center gap-1.5 justify-center lg:justify-start font-medium">
                  <Building2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Corporate Network</span>
                </div>
              </div>
            </div>

            {/* Right Column: High-Quality AcademicX Illustration */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="w-full max-w-lg lg:max-w-xl relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-sky-400/20 to-blue-500/20 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition duration-1000"></div>
                <img 
                  src="/hero-banner.jpg" 
                  alt="AcademicX - Talent Meets Opportunity" 
                  className="relative w-full h-auto object-contain max-h-[470px] rounded-2xl drop-shadow-sm transition-transform duration-500 hover:scale-[1.01]" 
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. PLATFORM ATTRIBUTES BAR */}
      {/* ========================================================================= */}
      <section className="bg-white py-10 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 text-center">
            <div className="p-4 rounded-2xl bg-slate-50/60 border border-slate-100">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">Real-Time</div>
              <div className="text-xs text-slate-500 font-medium mt-1">AI Skill Diagnostics</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50/60 border border-slate-100">
              <div className="text-2xl sm:text-3xl font-extrabold text-sky-600 font-['Outfit']">100%</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Verified Transcripts</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50/60 border border-slate-100">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">Multi-Role</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Students, Faculty & Recruiters</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50/60 border border-slate-100">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-['Outfit']">Outcome-Driven</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Campus Placement Lifecycle</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CHOOSE YOUR PORTAL (Clean Navigation) */}
      {/* ========================================================================= */}
      <section id="portals" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-700 block mb-1">
            Role-Based Portals
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
            Tailored Experiences for Every Stakeholder
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Select your role to explore features customized for your academic or corporate workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {/* 1. For Students */}
          <div 
            onClick={() => { 
              if (typeof setActiveRole === 'function') setActiveRole('student'); 
              if (typeof setActiveTab === 'function') setActiveTab('dashboard'); 
              navigate('/student/dashboard');
            }}
            className="rounded-2xl p-7 flex flex-col justify-between cursor-pointer bg-white border border-slate-200 hover:border-sky-400 hover:shadow-xl transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-sky-50 rounded-full -mr-14 -mt-14 group-hover:scale-110 transition-transform"></div>
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-2xs">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 font-['Outfit']">For Students</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Analyze your coding skills with AI diagnostics, view personalized job matches, and manage verified academic credentials.
              </p>
              <ul className="space-y-2 mb-6 text-xs text-slate-500">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>AI Skill Assessment & Gap Analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>6-Week Remedial Career Coach</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>DigiLocker & APAAR ID Integration</span>
                </li>
              </ul>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-sky-700 group-hover:translate-x-1.5 transition-transform pt-2 border-t border-slate-100">
              <span>Enter Student Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 2. For Recruiters */}
          <div 
            onClick={() => {
              if (typeof setActiveRole === 'function') setActiveRole('recruiter');
              navigate('/recruiter/dashboard');
            }}
            className="rounded-2xl p-7 flex flex-col justify-between cursor-pointer bg-white border border-slate-200 hover:border-cyan-400 hover:shadow-xl transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-50 rounded-full -mr-14 -mt-14 group-hover:scale-110 transition-transform"></div>
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-2xs">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 font-['Outfit']">For Recruiters</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Access verified candidate talent pools, post campus jobs, and accelerate candidate evaluation with real skill scores.
              </p>
              <ul className="space-y-2 mb-6 text-xs text-slate-500">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Verified Candidate Talent Pools</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Automated Fit Index & Resume Filters</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Direct Campus Drive Management</span>
                </li>
              </ul>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-cyan-700 group-hover:translate-x-1.5 transition-transform pt-2 border-t border-slate-100">
              <span>Enter Recruiter Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 3. For Faculty & Institutions */}
          <div 
            onClick={() => {
              if (typeof setActiveRole === 'function') setActiveRole('faculty');
              navigate('/faculty/dashboard');
            }}
            className="rounded-2xl p-7 flex flex-col justify-between cursor-pointer bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-amber-50 rounded-full -mr-14 -mt-14 group-hover:scale-110 transition-transform"></div>
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-2xs">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 font-['Outfit']">For Faculty & Institutes</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Track cohort placement readiness, join corporate faculty immersion, and generate NAAC/NIRF audit reports.
              </p>
              <ul className="space-y-2 mb-6 text-xs text-slate-500">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Cohort Skill Readiness Analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Corporate Faculty Immersion Programs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>NAAC / NIRF Accreditation Reports</span>
                </li>
              </ul>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 group-hover:translate-x-1.5 transition-transform pt-2 border-t border-slate-100">
              <span>Enter Faculty Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CORE PLATFORM PILLARS (Why AcademicX) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-slate-50/70 border-t border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-700 block mb-1">
              Platform Innovations
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
              Engineered to Solve Campus Hiring Friction
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Four unified systems working in unison to ensure student success and recruiter certainty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Brain className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5 font-['Outfit']">Adaptive AI Diagnostics</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Evaluates DSA, system design, and specialized tech competencies to pinpoint exact curriculum deficiencies.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5 font-['Outfit']">Fraud-Proof Credentials</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Verifies university transcripts, DigiLocker marks, and hackathon certificates directly at the institutional source.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5 font-['Outfit']">Live Industry Demand</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Aggregates real-time hiring requisitions across top tech enterprises to dynamically update student roadmaps.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5 font-['Outfit']">NEP 2020 Compliance</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pre-configured credit accounting for multi-disciplinary minors, vocational internships, and faculty development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. HOW IT WORKS (3 Simple Steps) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-700 block mb-1">
              SIMPLE & VERIFIED
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
              How AcademicX Operates in 3 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-slate-50/70 rounded-2xl p-6 border border-slate-200/80 text-center flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-sky-600 text-white font-bold text-sm flex items-center justify-center mb-4 shadow-sm">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Connect Verified Identity
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Connect university roll number and government APAAR/DigiLocker IDs for immediate verified standing.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50/70 rounded-2xl p-6 border border-slate-200/80 text-center flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-cyan-600 text-white font-bold text-sm flex items-center justify-center mb-4 shadow-sm">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                AI Diagnostic Benchmark
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Take an adaptive 15-minute diagnostic test to establish verified skill scores and a tailored 6-week roadmap.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50/70 rounded-2xl p-6 border border-slate-200/80 text-center flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center mb-4 shadow-sm">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Automated Placement
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Match directly with enterprise recruiters hiring for verified skill percentiles with zero ghosting.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. BOTTOM CONVERSION CTA BANNER */}
      {/* ========================================================================= */}
      <section className="py-14 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <h2 className="text-2xl sm:text-4xl font-black font-['Outfit'] tracking-tight">
            Ready to Accelerate Your Career or Campus Hiring?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Empowering students, academic faculties, and corporate recruiters with verified skill intelligence and streamlined hiring.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            {currentUser ? (
              <button
                onClick={handleGoToWorkspace}
                className="px-8 py-3.5 rounded-full bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm shadow-md transition cursor-pointer flex items-center gap-2"
              >
                <span>Enter Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    if (typeof setActiveRole === 'function') setActiveRole('register');
                    navigate('/register');
                  }}
                  className="px-8 py-3.5 rounded-full bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm shadow-md transition cursor-pointer"
                >
                  Create Free Account
                </button>
                <button
                  onClick={() => {
                    if (typeof setActiveRole === 'function') setActiveRole('login');
                    navigate('/login');
                  }}
                  className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm transition cursor-pointer"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
