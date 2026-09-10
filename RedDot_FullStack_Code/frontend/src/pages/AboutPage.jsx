import React, { useState } from 'react';
import { 
  BarChart3, 
  ShieldCheck, 
  BookOpen, 
  Compass, 
  Code2, 
  Server, 
  Cpu, 
  CheckCircle2,
  GraduationCap,
  Users,
  Building2,
  Briefcase
} from 'lucide-react';

export default function AboutPage() {
  const [activeInfoTab, setActiveInfoTab] = useState('capabilities');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-sky-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-sky-50/50 py-16 sm:py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-['Outfit'] leading-tight">
              Bridging the <span className="text-sky-600">Academia-Industry</span> Gap Through Intelligent Credentials
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl mx-auto">
              AcademicX is a unified higher education and talent transformation platform designed to align academic learning with real-world industry demands. By bridging the gap between students, educators, and corporate recruiters, AcademicX builds a transparent, multi-stakeholder ecosystem that replaces unverified resumes with skill diagnostic metrics, verified credentials, and industry-oriented development programs.
            </p>
          </div>
        </div>
      </section>

      {/* The Core Challenge & Our Mission */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
                Why Millions of Degrees Don't Translate to Corporate Readiness
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                In India, over 1.5 million engineering and technical students graduate annually. Yet corporate recruiters report that over 70% of applicants lack deployment-ready practical skills. Conventional hiring pipelines suffer from:
              </p>
              
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✕</div>
                  <span><strong>Resume Inflation & Misrepresentation:</strong> Candidates inflate buzzwords while recruiters spend hundreds of hours filtering noisy unverified profiles.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✕</div>
                  <span><strong>Silent Rejections ("Ghosting"):</strong> Rejected candidates receive no constructive feedback or diagnostic data on what specific skills caused their rejection.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✕</div>
                  <span><strong>Faculty-Industry Disconnect:</strong> Classroom syllabi often lag behind real-world corporate tech stacks by 3-5 years without an active industry feedback loop.</span>
                </li>
              </ul>
            </div>

            {/* Right Column: The AcademicX Solution in Light Blue Card */}
            <div className="bg-gradient-to-br from-sky-50 via-[#edf5fd] to-blue-50/70 border border-sky-200/80 p-7 sm:p-8 rounded-3xl space-y-6 shadow-md shadow-sky-100/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-sky-200/20 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="inline-flex items-center text-sky-700 text-xs font-bold uppercase tracking-wider">
                THE ACADEMICX SOLUTION
              </div>

              <h3 className="text-2xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
                A Transparent, Multi-Stakeholder Ecosystem
              </h3>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                AcademicX closes the loop between students, educational institutions, faculty members, and corporate recruiters through verifiable data:
              </p>

              <div className="space-y-3.5">
                {/* 1. Direct Academic Registrar Integration */}
                <div className="p-4 sm:p-4.5 rounded-2xl bg-white/95 border border-sky-100/90 flex items-start gap-3.5 shadow-2xs hover:border-sky-200 transition-all">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200/60">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm sm:text-base text-slate-900">Direct Academic Registrar Integration</h5>
                    <p className="text-xs sm:text-[13px] text-slate-600 mt-0.5 leading-relaxed">Degrees and semester marks verified directly from institutional databases.</p>
                  </div>
                </div>

                {/* 2. Diagnostic Skill Competency Radar */}
                <div className="p-4 sm:p-4.5 rounded-2xl bg-white/95 border border-sky-100/90 flex items-start gap-3.5 shadow-2xs hover:border-sky-200 transition-all">
                  <div className="w-6 h-6 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 mt-0.5 border border-sky-200/60">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm sm:text-base text-slate-900">Diagnostic Skill Competency Radar</h5>
                    <p className="text-xs sm:text-[13px] text-slate-600 mt-0.5 leading-relaxed">Objective testing that pinpoints exact competency gaps instead of blunt rejections.</p>
                  </div>
                </div>

                {/* 3. Accredited 6-Week Remedial Syllabus */}
                <div className="p-4 sm:p-4.5 rounded-2xl bg-white/95 border border-sky-100/90 flex items-start gap-3.5 shadow-2xs hover:border-sky-200 transition-all">
                  <div className="w-6 h-6 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 border border-amber-200/60">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm sm:text-base text-slate-900">Accredited 6-Week Remedial Syllabus</h5>
                    <p className="text-xs sm:text-[13px] text-slate-600 mt-0.5 leading-relaxed">Actionable learning roadmaps mapped directly to industry job requisitions.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Deep-Dive Capabilities / Tech / Roadmap Tabs */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest font-extrabold text-sky-700 block mb-1">
              Technical & Operational Blueprint
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
              Engineered for National Scale Impact
            </h2>

            {/* Segmented Tab Controls */}
            <div className="inline-flex p-1 mt-6 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setActiveInfoTab('capabilities')}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  activeInfoTab === 'capabilities' 
                    ? 'bg-white text-sky-700 shadow-xs font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Key Pillars
              </button>
              <button
                onClick={() => setActiveInfoTab('tech')}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  activeInfoTab === 'tech' 
                    ? 'bg-white text-sky-700 shadow-xs font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Technology Stack
              </button>
              <button
                onClick={() => setActiveInfoTab('roadmap')}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  activeInfoTab === 'roadmap' 
                    ? 'bg-white text-sky-700 shadow-xs font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Roadmap & Scale
              </button>
            </div>
          </div>

          {/* TAB 1: KEY PILLARS */}
          {activeInfoTab === 'capabilities' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Adaptive Skill Diagnostics & Remedial Learning</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Students undergo adaptive assessments to benchmark core competencies against real market requirements. Identified skill gaps are addressed through structured, accredited 6-week remedial roadmaps.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Tamper-Proof Credential Verification</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Degrees and academic records are validated directly through institutional databases, eliminating resume inflation and offering recruiters verified candidate data.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <Compass className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Faculty Advancement & Immersion</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Educators gain access to corporate lab immersion and Faculty Development Programs (FDPs) like the AICTE IFP, ensuring classroom teaching stays updated with evolving tech stacks.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Direct Placement & Internship Pipelines</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Employers connect with job-ready candidates and pre-vetted skill profiles, while students gain direct access to internship and entry-level career opportunities without recruitment application black holes.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: TECH STACK */}
          {activeInfoTab === 'tech' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Frontend Layer</h4>
                    <span className="text-[11px] text-sky-700 font-semibold">React + Vite + Tailwind CSS</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ultra-fast compilation, reactive role switching, responsive layout, and client-side high-res PDF generation with html2canvas & jsPDF.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Backend API Engine</h4>
                    <span className="text-[11px] text-cyan-700 font-semibold">Python 3 + Django REST</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Robust REST endpoints, stateless authentication, database migrations, audit trail tracking, and institutional data governance.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">AI & Matching Engine</h4>
                    <span className="text-[11px] text-indigo-700 font-semibold">Semantic Match Algorithms</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Candidate-to-job semantic scoring (&gt;85% precision), AI career diagnostic analyzer, and automated resume ATS evaluation.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: ROADMAP & SCALE */}
          {activeInfoTab === 'roadmap' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-5 rounded-2xl bg-white border-2 border-sky-600 space-y-2">
                  <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold uppercase">
                    Phase 1 • Current
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">Core MVP Platform</h4>
                  <p className="text-xs text-slate-500">
                    4-Stakeholder Portals, competency benchmark, automated transcript verification, and 1-click direct PDF downloads.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">
                    Phase 2 • Q3-Q4 2026
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">University Pilot</h4>
                  <p className="text-xs text-slate-500">
                    Direct registrar sync, pilot in 50 Technical Institutes, and automated WhatsApp/Telegram placement alerts.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">
                    Phase 3 • Q1-Q2 2027
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">Immersion Hub</h4>
                  <p className="text-xs text-slate-500">
                    Corporate faculty fellowships, industry co-design lab, and predictive campus hiring analytics.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">
                    Phase 4 • 2027+
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">National Grid</h4>
                  <p className="text-xs text-slate-500">
                    Scaling to 10,000+ AICTE/UGC colleges with 1-click NAAC Criterion 5 and NIRF accreditation audit reports.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Help & Support Center */}
      <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest font-extrabold text-sky-700 block mb-1">
              Need Assistance?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
              Help & Support Center
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Have questions about using AcademicX? We are here to assist every member of our ecosystem:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* For Students */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-sky-300 transition-all">
              <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">For Students</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Guidance on taking diagnostic tests, accessing 6-week learning roadmaps, downloading verified transcripts, and applying for corporate opportunities.
              </p>
            </div>

            {/* For Faculty */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-amber-300 transition-all">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">For Faculty</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Assistance with FDP enrollments, integrating skill diagnostics into coursework, and participating in corporate immersion tracks.
              </p>
            </div>

            {/* For Recruiters & Institutions */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-purple-300 transition-all">
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">For Recruiters & Institutions</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Platform onboarding, credential verification protocols, custom assessment setups, and partnership opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
