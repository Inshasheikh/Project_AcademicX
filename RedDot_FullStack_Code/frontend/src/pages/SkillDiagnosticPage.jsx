import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  Check, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft, 
  Download, 
  RotateCcw, 
  ExternalLink, 
  Award, 
  BookOpen, 
  Calendar, 
  Layers, 
  FileCheck,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Target,
  Loader2,
  Calculator,
  HelpCircle,
  Bookmark,
  PenTool,
  CheckSquare,
  ChevronRight,
  User,
  Info,
  FileText,
  BrainCircuit,
  Compass,
  Zap,
  Lightbulb,
  X
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { downloadElementAsPdf } from '../utils/downloadUtils';
import { fetchDiagnosticQuestions, submitDiagnostic } from '../services/api';

const AVAILABLE_DOMAINS = [
  { id: 'cs_ai', name: 'Computer Science & AI', desc: 'Algorithms, Discrete Math, AI/ML Theory & System Architecture' },
  { id: 'data_science', name: 'Data Science & Analytics', desc: 'Statistics, Probability, ML Modeling & Deep Learning' },
  { id: 'fullstack_cloud', name: 'Full-Stack Web & Cloud', desc: 'React, Node, REST/GraphQL APIs, Containerization & SQL' },
  { id: 'electronics_iot', name: 'Electronics & Embedded IoT', desc: 'Digital Logic, Microcontrollers, Embedded C & Concurrency' }
];

export default function SkillDiagnosticPage({ setActiveTab }) {
  const [selectedDomain, setSelectedDomain] = useState('cs_ai');
  const [stage, setStage] = useState('quiz'); // 'quiz' | 'results'
  const [questions, setQuestions] = useState([]);
  const [domainInfo, setDomainInfo] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [bookmarked, setBookmarked] = useState({});
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Interactive Helper States
  const [showFormulaSheet, setShowFormulaSheet] = useState(false);
  const [showScratchpad, setShowScratchpad] = useState(false);
  const [scratchNotes, setScratchNotes] = useState('');
  const [activeResultFilter, setActiveResultFilter] = useState('all'); // 'all' | 'gaps' | 'strengths'
  const [downloading, setDownloading] = useState(false);

  const reportRef = useRef(null);

  // Current session user
  const currentUser = (() => {
    try {
      const cached = localStorage.getItem('reddot_user');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  })();
  const candidateName = currentUser?.full_name || 'Candidate';
  const candidateInitials = candidateName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'ST';
  const candidateInstitution = currentUser?.college || currentUser?.institution || 'Registered Institute';
  const candidateDept = currentUser?.branch || currentUser?.department || 'Engineering & Technology';
  const candidateApaar = currentUser?.apaar_id || 'ACADEMIC-VERIFIED';

  // Load questions whenever domain changes
  useEffect(() => {
    setLoading(true);
    fetchDiagnosticQuestions(selectedDomain).then(res => {
      setQuestions(res.questions || []);
      setDomainInfo({
        domain_id: res.domain_id || selectedDomain,
        domain_name: res.domain_name || 'Computer Science & AI',
        description: res.description || '',
        available_domains: res.available_domains || AVAILABLE_DOMAINS
      });
      setCurrentIndex(0);
      setSelectedAnswers({});
      setBookmarked({});
      setTimeLeft(900);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [selectedDomain]);

  // Timer countdown
  useEffect(() => {
    if (stage !== 'quiz' || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [stage, timeLeft]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const handleSelectOption = (optIdx) => {
    const currentQ = questions[currentIndex];
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQ.id]: optIdx
    }));
  };

  const handleWritingInput = (text) => {
    const currentQ = questions[currentIndex];
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQ.id]: text
    }));
  };

  const toggleBookmark = (qId) => {
    setBookmarked(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  const handleSubmitTest = async () => {
    setSubmitting(true);
    try {
      const evalResult = await submitDiagnostic(selectedAnswers, selectedDomain);
      setResults(evalResult);
      try {
        localStorage.setItem('reddot_latest_diagnostic_result', JSON.stringify({
          ...evalResult,
          domain: selectedDomain,
          timestamp: new Date().toISOString()
        }));
        window.dispatchEvent(new Event('reddot_diagnostic_updated'));
      } catch (e) {
        console.error('Failed to save diagnostic result to localStorage:', e);
      }
      setStage('results');
    } catch (err) {
      console.error('Error submitting test:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setDownloading(true);
    try {
      await downloadElementAsPdf(
        reportRef.current,
        'REDDOT_Skill_Diagnostic_Report.pdf',
        'Official Diagnostic & Placement Benchmark Report'
      );
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
          <div className="text-center">
            <p className="text-slate-900 font-bold text-sm">Configuring Domain-Specific Assessment...</p>
            <p className="text-slate-400 text-xs mt-1">Calibrating difficulty ladder from Foundation to Advanced Synthesis</p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // STAGE 1: STEP-BY-STEP ADAPTIVE TEST
  // ==========================================
  if (stage === 'quiz' && questions.length > 0) {
    const currentQ = questions[currentIndex];
    const answeredCount = Object.keys(selectedAnswers).filter(k => selectedAnswers[k] !== undefined && selectedAnswers[k] !== '').length;
    const progressPct = ((currentIndex + 1) / questions.length) * 100;
    const currentStep = currentQ.step || 1;

    // Difficulty badge styling
    const difficultyBadgeStyle = {
      Easy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      Medium: 'bg-amber-50 text-amber-700 border-amber-200',
      Hard: 'bg-rose-50 text-rose-700 border-rose-200'
    }[currentQ.difficulty] || 'bg-slate-100 text-slate-700 border-slate-200';

    // Type badge styling
    const typeLabel = {
      mcq: 'Multiple Choice Concept',
      math: 'Math & Analytical Problem',
      writing: 'Written System Synthesis'
    }[currentQ.type] || 'Concept Check';

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Top Student Profile & Domain Alignment Bar */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-sky-600 text-white font-bold flex items-center justify-center text-base shadow-sm shrink-0">
                {candidateInitials}
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-base font-['Outfit']">{candidateName}</h2>
                <p className="text-xs text-slate-500">
                  {candidateInstitution} • {candidateDept}
                </p>
              </div>
            </div>

            {/* Test Timer & Progress Stats */}
            <div className="flex items-center gap-3 self-start md:self-center">
              <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-mono font-semibold transition-colors ${
                timeLeft < 180 ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                <Clock className="w-4 h-4 text-sky-600" />
                <span>{formatTime(timeLeft)}</span>
              </div>
              <div className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                Answered: <strong className="text-slate-900">{answeredCount}</strong> / {questions.length}
              </div>
            </div>
          </div>

          {/* Quick Domain Specialization Switcher */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Compass className="w-3.5 h-3.5 text-sky-600" />
              <span>Tailor Questions to Your Field:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_DOMAINS.map(d => {
                const isActive = selectedDomain === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => {
                      if (selectedDomain !== d.id && window.confirm(`Switch assessment domain to ${d.name}? Current question answers will reset.`)) {
                        setSelectedDomain(d.id);
                      }
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center ${
                      isActive
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                    }`}
                  >
                    <span>{d.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3-STEP DIFFICULTY PROGRESSION LADDER (Easy -> Medium -> Hard) */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4 text-sky-600" /> Assessment Progression Ladder (Easy to Hard)
            </span>
            <span className="text-slate-500 font-medium">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>

          {/* Stepper Bar */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { step: 1, title: 'Level 1: Foundation', desc: 'Core Concepts (Easy)', icon: Sparkles },
              { step: 2, title: 'Level 2: Math & Logic', desc: 'Quantitative Reasoning (Medium)', icon: Calculator },
              { step: 3, title: 'Level 3: Synthesis', desc: 'Scenario & Writing (Hard)', icon: PenTool }
            ].map((st) => {
              const isCurrent = currentStep === st.step;
              const isPassed = currentStep > st.step;
              const IconComp = st.icon;

              return (
                <div 
                  key={st.step}
                  className={`p-3 rounded-xl border transition-all ${
                    isCurrent 
                      ? 'bg-sky-50/80 border-sky-400 ring-2 ring-sky-100 shadow-xs' 
                      : isPassed
                      ? 'bg-emerald-50/60 border-emerald-200 text-slate-700'
                      : 'bg-slate-50/50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      isCurrent 
                        ? 'bg-sky-600 text-white' 
                        : isPassed 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {isPassed ? <Check className="w-3.5 h-3.5" /> : st.step}
                    </div>
                    <div className="truncate">
                      <p className={`text-xs font-bold truncate ${isCurrent ? 'text-sky-950' : 'text-slate-800'}`}>
                        {st.title}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate hidden sm:block">
                        {st.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continuous Progress Bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
            <div 
              className="bg-sky-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* MAIN QUESTION CARD */}
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl space-y-6 shadow-xs relative">
          
          {/* Question Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-3 py-1 rounded-lg border border-sky-100">
                {currentQ.category}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${difficultyBadgeStyle}`}>
                {currentQ.difficulty} (+{currentQ.weight} pts)
              </span>
              <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                {typeLabel}
              </span>
            </div>

            {/* Bookmark & Helper Buttons */}
            <div className="flex items-center gap-2">
              {currentQ.formula_hint && (
                <button
                  onClick={() => setShowFormulaSheet(prev => !prev)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 flex items-center gap-1.5 transition cursor-pointer"
                  title="View formula & calculation hints"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  <span>Formula Hint</span>
                </button>
              )}

              <button
                onClick={() => setShowScratchpad(prev => !prev)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition cursor-pointer ${
                  showScratchpad 
                    ? 'bg-sky-600 text-white border-sky-600' 
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
                title="Open notepad scratchpad"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Scratchpad</span>
              </button>

              <button
                onClick={() => toggleBookmark(currentQ.id)}
                className={`p-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                  bookmarked[currentQ.id]
                    ? 'bg-amber-50 text-amber-600 border-amber-300'
                    : 'bg-slate-50 text-slate-400 hover:text-slate-600 border-slate-200'
                }`}
                title="Mark question for review"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Formula Hint Alert (Expandable) */}
          {showFormulaSheet && currentQ.formula_hint && (
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-1 animate-in fade-in duration-200">
              <div className="flex items-center justify-between font-bold text-amber-800">
                <span className="flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-600" /> Quick Reference Formula & Calculation Method
                </span>
                <button onClick={() => setShowFormulaSheet(false)} className="text-amber-600 hover:text-amber-800 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="font-mono bg-white/70 p-2 rounded-lg border border-amber-200 text-slate-800">
                {currentQ.formula_hint}
              </p>
            </div>
          )}

          {/* Scratchpad (Collapsible) */}
          {showScratchpad && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-300 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5 text-sky-600" /> In-Test Quick Scratchpad (Rough Notes & Math)
                </span>
                <button onClick={() => setShowScratchpad(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <textarea
                value={scratchNotes}
                onChange={(e) => setScratchNotes(e.target.value)}
                placeholder="Type temporary numbers, equations, or calculation steps here..."
                rows={3}
                className="w-full text-xs font-mono p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-800 resize-none"
              />
            </div>
          )}

          {/* Question Text */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              {currentQ.step_label} • Question {currentIndex + 1}
            </span>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed font-['Outfit']">
              {currentQ.question}
            </h1>
          </div>

          {/* INTERACTIVE INPUT: MCQ / MATH OPTIONS OR WRITING PROMPT */}
          {currentQ.type in { mcq: true, math: true } && currentQ.options && (
            <div className="space-y-2.5 pt-2">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = selectedAnswers[currentQ.id] === oIdx;
                return (
                  <div
                    key={oIdx}
                    onClick={() => handleSelectOption(oIdx)}
                    className={`p-4 rounded-xl border text-xs sm:text-sm font-medium cursor-pointer transition-all flex items-center gap-3.5 ${
                      isSelected
                        ? 'bg-sky-50 border-sky-500 text-sky-950 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/70'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                      isSelected ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {String.fromCharCode(65 + oIdx)}
                    </div>
                    <span className="leading-snug">{opt}</span>
                  </div>
                );
              })}
            </div>
          )}

          {currentQ.type === 'writing' && (
            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-200 text-xs text-sky-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-sky-900">
                  <Lightbulb className="w-4 h-4 text-sky-600" /> Answer Guidelines & Evaluation Focus:
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {currentQ.writing_prompt || 'Explain concisely using practical engineering reasoning, architecture mechanisms, and key technologies.'}
                </p>
              </div>

              <div className="space-y-1.5">
                <textarea
                  value={selectedAnswers[currentQ.id] || ''}
                  onChange={(e) => handleWritingInput(e.target.value)}
                  placeholder="Type your structured engineering answer here (e.g. 2-4 sentences explaining storage, concurrency control, and messaging)..."
                  rows={6}
                  className="w-full text-xs sm:text-sm p-4 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 leading-relaxed resize-none shadow-inner"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                  <span>Aim for 20-60 technical words for optimal automated evaluation</span>
                  <span className={`font-mono font-semibold ${
                    (selectedAnswers[currentQ.id] || '').split(/\s+/).filter(Boolean).length >= 15
                      ? 'text-emerald-600'
                      : 'text-slate-400'
                  }`}>
                    {(selectedAnswers[currentQ.id] || '').split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(prev => prev - 1)}
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 disabled:opacity-40 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>

            <div className="flex items-center gap-3">
              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex(prev => prev + 1)}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center gap-2 transition shadow-xs cursor-pointer"
                >
                  Next Question <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  disabled={submitting}
                  onClick={handleSubmitTest}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black disabled:bg-slate-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-sky-400" /> Evaluating Assessment...
                    </>
                  ) : (
                    <>
                      Submit & View Growth Report <Award className="w-4 h-4 text-amber-300" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Palette with Status Indicator */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
              Question Palette & Quick Jump
            </span>
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Answered
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Marked
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200" /> Unanswered
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const isAnswered = selectedAnswers[q.id] !== undefined && selectedAnswers[q.id] !== '';
              const isFlagged = bookmarked[q.id];

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer relative ${
                    isCurrent
                      ? 'bg-sky-600 text-white shadow-xs ring-2 ring-sky-300'
                      : isFlagged
                      ? 'bg-amber-50 text-amber-800 border border-amber-300'
                      : isAnswered
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                  title={`Question ${idx + 1} (${q.difficulty})`}
                >
                  {idx + 1}
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    );
  }

  // ==========================================
  // STAGE 2: ACTIONABLE & BEAUTIFUL RESULTS
  // ==========================================
  if (stage === 'results' && results) {
    const questionsList = results.question_reviews || [];
    const gapsList = results.gaps || [];
    const strengthsList = results.strengths || [];

    const filteredQuestions = questionsList.filter(q => {
      if (activeResultFilter === 'gaps') return !q.is_correct;
      if (activeResultFilter === 'strengths') return q.is_correct;
      return true;
    });

    return (
      <div ref={reportRef} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-slate-50/50 rounded-3xl">
        
        {/* Header with Student Verified Credentials */}
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sky-700 text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4 text-sky-600" /> Official Diagnostic & Placement Benchmark Report
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-['Outfit']">
              Your Competency & Growth Diagnosis
            </h1>
            <p className="text-xs text-slate-500">
              Candidate: <strong className="text-slate-800">{candidateName}</strong> • {candidateInstitution}
            </p>
          </div>

          <div className="flex items-center gap-3 self-stretch md:self-auto" data-html2canvas-ignore="true">
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black disabled:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-sky-400" /> Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-sky-400" /> Download PDF Report
                </>
              )}
            </button>
            <button
              onClick={() => {
                setSelectedAnswers({});
                setBookmarked({});
                setCurrentIndex(0);
                setTimeLeft(900);
                setStage('quiz');
              }}
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Retake
            </button>
          </div>
        </div>

        {/* HERO BENCHMARK CARD: Score + Percentile + Readiness Tier */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Circular Score Visualizer */}
          <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl text-center flex flex-col items-center justify-center shadow-xs">
            <div className="relative w-36 h-36 flex items-center justify-center mb-3">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#f1f5f9"
                  strokeWidth="9"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={results.overall_score >= 75 ? "#0284c7" : results.overall_score >= 60 ? "#f59e0b" : "#f43f5e"}
                  strokeWidth="9"
                  strokeDasharray={`${results.overall_score * 2.51} 251.2`}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-900 font-['Outfit']">{results.overall_score}%</span>
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Overall Score</span>
              </div>
            </div>
            <h3 className="text-sm font-bold text-slate-900 font-['Outfit']">Benchmark Evaluation</h3>
            <p className="text-xs text-slate-500 mt-1">
              National Placement Bar: <strong className="text-slate-800">{results.industry_benchmark}%</strong>
            </p>
          </div>

          {/* Percentile & Readiness Badge Card */}
          <div className="md:col-span-2 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl flex flex-col justify-between shadow-xs space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-700 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-sky-600" /> National Candidate Percentile
                </span>
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                  {results.percentile}th Percentile
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-['Outfit'] mb-2">
                {results.readiness_badge}
              </h3>
              
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Your performance in <strong className="text-slate-800">{results.domain_name}</strong> demonstrates strong theoretical foundations. By addressing the analytical and scenario-specific items highlighted below, you will maximize your hiring probability for top-tier tech roles.
              </p>
            </div>

            {/* Quick Summary Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Specialization</span>
                <span className="font-bold text-slate-800 truncate block">{results.domain_name?.split('/')[0]}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Top Strength</span>
                <span className="font-bold text-emerald-700 truncate block">
                  {strengthsList[0] || 'Core Concepts'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Recommended Focus</span>
                <span className="font-bold text-rose-700 truncate block">
                  {gapsList[0]?.split(':')[0] || 'High Scalability'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* 3-DIMENSION COMPETENCY BREAKDOWN (Foundation vs Math vs Writing) */}
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xs">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
              <Layers className="w-5 h-5 text-sky-600" />
              Skill Dimension Matrix (Level-by-Level Breakdown)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluating your skills across Concept Foundations, Mathematical Analysis, and Technical Communication
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(results.dimensions || {}).map(([dimKey, dim]) => {
              const score = dim.score || 0;
              const isMastered = score >= 80;
              const isAdequate = score >= 60;

              return (
                <div 
                  key={dimKey}
                  className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        isMastered
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : isAdequate
                          ? 'bg-sky-50 text-sky-700 border-sky-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {dim.status}
                      </span>
                      <span className="font-mono text-xs text-slate-400">
                        {dim.earned}/{dim.total} pts
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">
                      {dim.label}
                    </h4>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px]">Proficiency</span>
                      <span className={`font-black text-sm ${isMastered ? 'text-emerald-700' : isAdequate ? 'text-sky-700' : 'text-rose-700'}`}>
                        {score}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isMastered ? 'bg-emerald-500' : isAdequate ? 'bg-sky-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DETAILED QUESTION-BY-QUESTION REVIEW & ACTIONABLE TIPS */}
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-sky-600" />
                Diagnostic Question Breakdown & Improvement Advice
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Understand exactly where points were earned or missed, with actionable advice to improve
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveResultFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeResultFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({questionsList.length})
              </button>
              <button
                onClick={() => setActiveResultFilter('gaps')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeResultFilter === 'gaps' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Missed ({questionsList.filter(q => !q.is_correct).length})
              </button>
              <button
                onClick={() => setActiveResultFilter('strengths')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeResultFilter === 'strengths' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Correct ({questionsList.filter(q => q.is_correct).length})
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredQuestions.map((q, qIdx) => {
              const isCorrect = q.is_correct;

              return (
                <div 
                  key={q.id || qIdx}
                  className={`p-5 rounded-2xl border transition-all ${
                    isCorrect
                      ? 'bg-white border-slate-200/90'
                      : 'bg-rose-50/20 border-rose-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {isCorrect ? <Check className="w-3 h-3" /> : '✕'}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        Q{q.id}: {q.category}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {q.difficulty}
                      </span>
                    </div>

                    <span className={`text-xs font-extrabold ${isCorrect ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {q.earned_points} / {q.max_points} pts
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-900 mb-3">
                    {q.question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Your Response</span>
                      <span className={`font-medium block mt-0.5 ${isCorrect ? 'text-emerald-800' : 'text-rose-800'}`}>
                        {q.user_answer}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Ideal Solution / Benchmark</span>
                      <span className="font-medium text-slate-800 block mt-0.5">
                        {q.correct_answer}
                      </span>
                    </div>
                  </div>

                  {/* Actionable Improvement Tip */}
                  <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-100 text-xs text-sky-950 flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-sky-900 block mb-0.5">Actionable Interview Tip:</strong>
                      <span className="text-slate-700 leading-relaxed">{q.tip || q.explanation}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4-WEEK REMEDIAL ROADMAP WITH VERIFIED LEARNING RESOURCES */}
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-['Outfit']">
                <BookOpen className="w-5 h-5 text-sky-600" />
                Personalized 4-Week Mastery & Remedial Roadmap
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Curated step-by-step curriculum with direct access to top free university and industry learning platforms
              </p>
            </div>
            <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-100 text-xs font-bold">
              4 Targeted Milestones
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {(results.recommendations || []).map((step, sIdx) => (
              <div 
                key={sIdx}
                className="rounded-2xl border border-slate-200 p-5 bg-white hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 text-xs font-black flex items-center justify-center">
                      {sIdx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-sky-600" /> {step.week}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                      {step.phase || step.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {step.focus}
                    </p>
                  </div>

                  {/* Resource Links */}
                  <div className="pt-2 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Recommended Study Material
                    </span>
                    {(step.courses || []).map((course, cIdx) => (
                      <a
                        key={cIdx}
                        href={course.link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200/80 hover:border-sky-200 transition text-xs text-slate-800 group/link"
                      >
                        <div className="truncate pr-2">
                          <span className="font-semibold block truncate">{course.name}</span>
                          <span className="text-[10px] text-sky-700 font-medium">{course.platform}</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover/link:text-sky-600 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Milestone */}
                <div className="mt-5 pt-3 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Week Milestone
                  </span>
                  <p className="text-xs font-semibold text-slate-800 mt-1 flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{step.milestone}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PROMINENT CTA: STEP-BY-STEP CAREER ROADMAP INTEGRATION */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-sky-500/30">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Exam Analysis Complete
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-['Outfit']">
              Aapka Step-by-Step Career Roadmap Ready Hai!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Based on your score of <strong className="text-sky-400">{results.overall_score}%</strong> ({results.performance_tier || 'Placement Ready'}), our AI Career Coach has generated a 5-step curriculum targeting your exact exam loopholes, daily 2-hour timetable, and salary growth trajectory (₹10 LPA &rarr; ₹65 LPA).
            </p>
          </div>
          <button
            onClick={() => setActiveTab?.('roadmap')}
            className="px-6 py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:shadow-sky-500/25 transition cursor-pointer shrink-0"
          >
            <span>View Step-by-Step Roadmap</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    );
  }

  return null;
}
