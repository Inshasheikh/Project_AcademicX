import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  FileText, 
  UploadCloud, 
  Compass, 
  Award, 
  Check, 
  AlertCircle, 
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Sparkles,
  Building2,
  User,
  ChevronRight,
  Lightbulb,
  ShieldAlert,
  CheckCircle2,
  TrendingUp,
  HelpCircle,
  Layers,
  Flame,
  RotateCcw,
  Volume2,
  Keyboard,
  Clock,
  Briefcase,
  Target,
  Loader2,
  CheckSquare,
  AlertTriangle,
  PlayCircle,
  Video,
  ExternalLink,
  Trophy,
  Copy,
  CheckCheck,
  GraduationCap,
  Code2,
  Download,
  Share2
} from 'lucide-react';
import { 
  fetchCompanyInterviewTrack, 
  submitCompanyMockSession, 
  uploadResumeFile,
  auditResumeText,
  getDeepResumeRecommendations
} from '../services/api';
import ResumeBuilder from '../components/ResumeBuilder/ResumeBuilder';

const COMPANY_STYLES = [
  {
    id: 'tier1',
    name: 'Tier-1 Product Tech',
    badge: 'Google / Amazon Standard',
    desc: 'High algorithmic rigor, quantifiable metrics, and extreme system scalability',
    color: 'sky'
  },
  {
    id: 'startup',
    name: 'Fast-Paced Unicorn',
    badge: 'Uber / Swiggy Standard',
    desc: 'Pragmatism, rapid shipping, end-to-end architecture ownership & concurrency',
    color: 'emerald'
  },
  {
    id: 'enterprise',
    name: 'Enterprise / Consulting',
    badge: 'TCS Digital / Infosys',
    desc: 'Structured software engineering, robust OOP design, and formal delivery lifecycle',
    color: 'amber'
  }
];

const AVAILABLE_ROLES = [
  "Full Stack Developer",
  "AI/ML Engineer",
  "Cloud/DevOps Engineer"
];

export default function CareerCoachPage({ initialTab = 'interview', initialResumeMode = 'review', setActiveTab: setParentTab }) {
  const [activeTab, setActiveTab] = useState(initialTab === 'builder' ? 'resume' : initialTab); // 'interview' | 'resume' | 'roadmap'
  const [resumeMode, setResumeMode] = useState(initialResumeMode || (initialTab === 'builder' ? 'builder' : 'review')); // 'review' | 'builder'

  useEffect(() => {
    if (initialTab === 'builder') {
      setActiveTab('resume');
      setResumeMode('builder');
    } else if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // ==========================================
  // TAB 1: COMPANY-STYLE MOCK INTERVIEW STATE
  // ==========================================
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [companyStyle, setCompanyStyle] = useState('tier1');
  const [sessionStage, setSessionStage] = useState('setup'); // 'setup' | 'interview' | 'results'
  const [trackData, setTrackData] = useState(null);
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // round_num -> text
  const [inputMode, setInputMode] = useState('text'); // 'voice' | 'text'
  const [showHint, setShowHint] = useState(false);
  const [loadingTrack, setLoadingTrack] = useState(false);
  const [submittingSession, setSubmittingSession] = useState(false);
  const [sessionResults, setSessionResults] = useState(null);

  // Voice recording simulation states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef(null);

  // Load interview track whenever role or company style changes
  const loadTrack = async (role = targetRole, style = companyStyle) => {
    setLoadingTrack(true);
    try {
      const data = await fetchCompanyInterviewTrack(role, style);
      setTrackData(data);
      setCurrentRoundIdx(0);
      setAnswers({});
      setShowHint(false);
    } catch (err) {
      console.error('Failed to load track:', err);
    } finally {
      setLoadingTrack(false);
    }
  };

  useEffect(() => {
    loadTrack(targetRole, companyStyle);
  }, [targetRole, companyStyle]);

  // Voice recording handler
  const handleToggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => {
          if (prev >= 60) {
            clearInterval(recordingTimerRef.current);
            setIsRecording(false);
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(recordingTimerRef.current);
      setIsRecording(false);
      // If voice answer was empty, populate with a realistic transcribed draft
      const currentR = trackData?.rounds?.[currentRoundIdx];
      if (currentR && (!answers[currentR.round_num] || answers[currentR.round_num].length < 10)) {
        setAnswers(prev => ({
          ...prev,
          [currentR.round_num]: `[Voice Transcription: ${recordingSeconds}s] In my approach, I would isolate this using ${currentR.expected_keywords?.slice(0, 3).join(', ')} while monitoring p99 latency to resolve the problem.`
        }));
      }
    }
  };

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, []);

  const handleStartInterview = () => {
    setSessionStage('interview');
    setCurrentRoundIdx(0);
    setShowHint(false);
  };

  const handleFinishInterview = async () => {
    setSubmittingSession(true);
    try {
      const res = await submitCompanyMockSession({
        role: targetRole,
        company_style: companyStyle,
        answers: answers
      });
      setSessionResults(res);
      setSessionStage('results');
    } catch (err) {
      console.error('Error submitting mock session:', err);
    } finally {
      setSubmittingSession(false);
    }
  };

  // ==========================================
  // TAB 2: DEEP RESUME REVIEW & RECOMMENDATION ENGINE
  // ==========================================
  const SAMPLE_PROFILES = [
    {
      label: "Full Stack Engineer Template",
      role: "Full Stack Developer",
      text: `Candidate Full Name
B.Tech Computer Science & Engineering
Verified Academic Credentials | CGPA: 8.8 / 10.0

Technical Skills:
Python, Django REST Framework, React 19, JavaScript, TypeScript, PostgreSQL, Docker, Redis, SQL, Git, REST APIs

Projects & Experience:
- Higher Education & Placement Grid with verified credentials.
- Low-latency vector search engine with sub-25ms retrieval latency using PyTorch and Redis.`
    },
    {
      label: "AI / ML Engineer Template",
      role: "AI/ML Engineer",
      text: `Candidate Full Name
B.Tech Computer Science & Artificial Intelligence
Verified Academic Credentials | CGPA: 8.9 / 10.0

Technical Skills:
Python, PyTorch, Hugging Face Transformers, Scikit-Learn, NumPy, Pandas, FastAPI, Docker, Git, Machine Learning

Projects & Research:
- Real-Time Semantic Document RAG Pipeline using sentence-transformers and vector database.
- Audio Spectrogram Speech Emotion Classifier with deep learning CNN-LSTM architecture.`
    },
    {
      label: "Cloud & DevOps Template",
      role: "Cloud/DevOps Engineer",
      text: `Candidate Full Name
B.Tech Information Technology
Verified Academic Credentials | CGPA: 8.7 / 10.0

Technical Skills:
Docker, Kubernetes, AWS, CI/CD Pipelines, Linux, Python, FastAPI, PostgreSQL, Redis, Git, Prometheus, Grafana

Projects:
- Zero-Downtime Microservice Deployment Cluster with Kubernetes HPA.
- Automated CI/CD Testing & Security Scanner using GitHub Actions.`
    }
  ];

  const [resumeText, setResumeText] = useState(SAMPLE_PROFILES[0].text);
  const [resumeTargetRole, setResumeTargetRole] = useState('Full Stack Developer');
  const [recommendationFilter, setRecommendationFilter] = useState('all'); // 'all' | 'courses' | 'competitions' | 'certifications' | 'projects'
  const [isAuditingResume, setIsAuditingResume] = useState(false);
  const [auditProgressStep, setAuditProgressStep] = useState(0);
  const [copiedProjectId, setCopiedProjectId] = useState(null);

  const initialDeepRecs = getDeepResumeRecommendations('Full Stack Developer', ["Python", "Django", "React", "SQL", "Machine Learning", "Git"]);
  const [atsResult, setAtsResult] = useState({
    ats_score: 86,
    skills_detected: ["Python", "Django", "React", "PostgreSQL", "Redis", "Git", "REST APIs"],
    missing_keywords: ["Kubernetes", "AWS / Cloud", "CI/CD"],
    suggestions: [
      "Include quantified impact metrics (e.g. 'Reduced p99 query latency by 45%').",
      "Add containerization and cloud infrastructure experience to qualify for Tier-1 engineering benchmarks.",
      "Study recommended courses and watch curated video lectures to eliminate architectural gaps.",
      "Enroll in target industry certifications to pass automated recruiter screening pipelines.",
      "Incorporate the recommended high-impact projects with verified metrics onto your resume."
    ],
    ...initialDeepRecs,
    deep_analysis_completed: true
  });

  const handleAuditResume = async () => {
    setIsAuditingResume(true);
    setAuditProgressStep(1);
    try {
      await new Promise(r => setTimeout(r, 350));
      setAuditProgressStep(2);
      await new Promise(r => setTimeout(r, 350));
      setAuditProgressStep(3);
      const res = await auditResumeText(resumeText, resumeTargetRole);
      setAtsResult(res);
    } catch (err) {
      console.error('Failed to audit resume:', err);
    } finally {
      setIsAuditingResume(false);
      setAuditProgressStep(0);
    }
  };

  const handleCopyBullets = (projectId, bullets) => {
    const text = bullets.map(b => `• ${b}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedProjectId(projectId);
    setTimeout(() => setCopiedProjectId(null), 2500);
  };

  const handleLoadSample = (profile) => {
    setResumeText(profile.text);
    setResumeTargetRole(profile.role);
    const recs = getDeepResumeRecommendations(profile.role, []);
    setAtsResult(prev => ({
      ...prev,
      target_role: profile.role,
      ...recs
    }));
  };

  // Resume File Upload Handlers
  const fileInputRef = useRef(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processResumeFile(file);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processResumeFile(file);
  };

  const processResumeFile = async (file) => {
    setIsUploadingResume(true);
    setUploadError(null);
    setUploadedFileName(file.name);
    try {
      const res = await uploadResumeFile(file, resumeTargetRole);
      if (res.extracted_text) {
        setResumeText(res.extracted_text);
      }
      if (res.audit) {
        setAtsResult(res.audit);
      }
    } catch (err) {
      console.error('Error parsing resume file:', err);
      setUploadError('Failed to extract text from file. You can still paste your resume text below.');
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleBuilderSendToReview = async (text, role) => {
    setResumeText(text);
    if (role) {
      setResumeTargetRole(role);
    }
    setResumeMode('review');
    setIsAuditingResume(true);
    setAuditProgressStep(1);
    try {
      await new Promise(r => setTimeout(r, 350));
      setAuditProgressStep(2);
      await new Promise(r => setTimeout(r, 350));
      setAuditProgressStep(3);
      const res = await auditResumeText(text, role || resumeTargetRole);
      setAtsResult(res);
    } catch (err) {
      console.error('Failed to audit built resume:', err);
    } finally {
      setIsAuditingResume(false);
      setAuditProgressStep(0);
    }
  };

  useEffect(() => {
    try {
      const pendingText = localStorage.getItem('academicx_audit_pending_text');
      const pendingRole = localStorage.getItem('academicx_audit_pending_role');
      if (pendingText) {
        localStorage.removeItem('academicx_audit_pending_text');
        localStorage.removeItem('academicx_audit_pending_role');
        handleBuilderSendToReview(pendingText, pendingRole || resumeTargetRole);
      }
    } catch (e) {}
  }, []);

  // ==========================================
  // TAB 3: STEP-BY-STEP CAREER PROGRESSION ROADMAP STATE
  // ==========================================
  const [roadmapRole, setRoadmapRole] = useState('Full Stack Developer');
  const [examResult, setExamResult] = useState(() => {
    try {
      const saved = localStorage.getItem('reddot_latest_diagnostic_result');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [completedChecklist, setCompletedChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem('reddot_roadmap_completed');
      return saved ? JSON.parse(saved) : { "step1_1": true, "step1_2": true };
    } catch {
      return { "step1_1": true, "step1_2": true };
    }
  });

  const toggleChecklistItem = (id) => {
    setCompletedChecklist(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('reddot_roadmap_completed', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      


      {/* ========================================================= */}
      {/* TAB 1: COMPANY-CALIBRATED MOCK INTERVIEW & LOOPHOLE STUDIO */}
      {/* ========================================================= */}
      {activeTab === 'interview' && (
        <div className="space-y-6">

          {/* STAGE A: COMPANY SETUP & ROLE SELECTION */}
          {sessionStage === 'setup' && (
            <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-xs space-y-6">
              <div className="max-w-2xl">
                <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block mb-1">
                  Configure Your Mock Interview Simulation
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit']">
                  Simulate How Leading Tech Companies Evaluate Candidates
                </h2>
              </div>

              {/* Target Role Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Select Target Engineering Role:
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {AVAILABLE_ROLES.map(role => {
                    const isSelected = targetRole === role;
                    return (
                      <button
                        key={role}
                        onClick={() => setTargetRole(role)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-2 ${
                          isSelected
                            ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Target className="w-4 h-4" />
                        <span>{role}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Company Style Cards */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Select Company Hiring Bar & Standard:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {COMPANY_STYLES.map(cStyle => {
                    const isSelected = companyStyle === cStyle.id;
                    return (
                      <div
                        key={cStyle.id}
                        onClick={() => setCompanyStyle(cStyle.id)}
                        className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                          isSelected
                            ? 'bg-sky-50/50 border-sky-600 shadow-xs ring-2 ring-sky-100'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              {cStyle.badge}
                            </span>
                            {isSelected && <Check className="w-4 h-4 text-sky-600" />}
                          </div>
                          <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                            {cStyle.name}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            {cStyle.desc}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-slate-100 text-[11px] font-semibold text-sky-700 flex items-center gap-1">
                          <span>4 Sequential Rounds</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>



              {/* Start Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  disabled={loadingTrack}
                  onClick={handleStartInterview}
                  className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
                >
                  {loadingTrack ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" /> Loading Interviewer Track...
                    </>
                  ) : (
                    <>
                      Enter Company Interview Room <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STAGE B: ACTIVE STEP-BY-STEP COMPANY INTERVIEW SESSION */}
          {sessionStage === 'interview' && trackData && (
            <div className="space-y-6">
              
              {/* Stepper Navigation across Top */}
              <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-sky-600" />
                    <span className="font-bold text-slate-900">{targetRole}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 font-medium">{COMPANY_STYLES.find(c => c.id === companyStyle)?.name}</span>
                  </div>
                  <button
                    onClick={() => setSessionStage('setup')}
                    className="text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                  >
                    Change Track
                  </button>
                </div>

                {/* 4 Rounds Ladder */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {trackData.rounds.map((r, rIdx) => {
                    const isCurrent = rIdx === currentRoundIdx;
                    const isCompleted = answers[r.round_num] && answers[r.round_num].trim().length > 0;
                    return (
                      <div
                        key={r.round_num}
                        onClick={() => {
                          setCurrentRoundIdx(rIdx);
                          setShowHint(false);
                        }}
                        className={`p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-center gap-2.5 ${
                          isCurrent
                            ? 'bg-sky-50 border-sky-400 text-sky-950 ring-2 ring-sky-100 shadow-xs'
                            : isCompleted
                            ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                            : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center shrink-0 ${
                          isCurrent ? 'bg-sky-600 text-white' : isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {isCompleted ? '✓' : r.round_num}
                        </span>
                        <div className="truncate">
                          <span className="block truncate font-bold text-[11px]">{r.round_title.split(':')[0]}</span>
                          <span className="text-[10px] text-slate-500 block truncate">{r.difficulty}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Main Interview Card */}
              {(() => {
                const currentRound = trackData.rounds[currentRoundIdx];
                const currentAnswer = answers[currentRound.round_num] || '';
                const wordCount = currentAnswer.trim().split(/\s+/).filter(Boolean).length;

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Panel: Interviewer Context & Question */}
                    <div className="lg:col-span-2 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xs flex flex-col justify-between">
                      <div className="space-y-4">
                        
                        {/* Interviewer Persona Card */}
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                              TL
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-900">
                                AI Technical Interviewer • Technical Assessment Panel
                              </h4>
                              <p className="text-[11px] text-slate-500">
                                {COMPANY_STYLES.find(c => c.id === companyStyle)?.name} Committee
                              </p>
                            </div>
                          </div>

                          <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                            currentRound.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            currentRound.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            currentRound.difficulty === 'Hard' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                            'bg-sky-50 text-sky-700 border-sky-200'
                          }`}>
                            {currentRound.difficulty} Round
                          </span>
                        </div>

                        {/* Round Title & Objective */}
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            {currentRound.round_title}
                          </span>
                          <h2 className="text-base sm:text-xl font-bold text-slate-900 leading-relaxed font-['Outfit']">
                            "{currentRound.question}"
                          </h2>
                          <p className="text-xs text-slate-500 pt-1 leading-relaxed">
                            💡 <strong>Interviewer Objective:</strong> {currentRound.interviewer_intent}
                          </p>
                        </div>

                        {/* Expandable Interviewer Clarification / Hint */}
                        {currentRound.hint && (
                          <div className="pt-2">
                            {showHint ? (
                              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                                <div className="flex items-center justify-between font-bold text-amber-800">
                                  <span className="flex items-center gap-1.5">
                                    <Lightbulb className="w-4 h-4 text-amber-600" /> Interviewer Clarification / Coach Advice
                                  </span>
                                  <button onClick={() => setShowHint(false)} className="text-amber-700 hover:text-amber-900 cursor-pointer">
                                    ✕
                                  </button>
                                </div>
                                <p className="leading-relaxed text-amber-950 font-medium">
                                  {currentRound.hint}
                                </p>
                              </div>
                            ) : (
                              <button
                                onClick={() => setShowHint(true)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 flex items-center gap-1.5 transition cursor-pointer"
                              >
                                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                                <span>Ask Interviewer for Clarification / Hint</span>
                              </button>
                            )}
                          </div>
                        )}

                      </div>

                      {/* Answering Controls & Input Mode Selector */}
                      <div className="pt-4 border-t border-slate-100 space-y-4">
                        
                        {/* Input Mode Toggle */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Your Response Mode:
                          </span>
                          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
                            <button
                              onClick={() => setInputMode('voice')}
                              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition cursor-pointer ${
                                inputMode === 'voice' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              <Mic className="w-3.5 h-3.5 text-rose-600" /> Microphone
                            </button>
                            <button
                              onClick={() => setInputMode('text')}
                              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition cursor-pointer ${
                                inputMode === 'text' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              <Keyboard className="w-3.5 h-3.5 text-sky-600" /> Typing
                            </button>
                          </div>
                        </div>

                        {/* VOICE MODE RECORDER */}
                        {inputMode === 'voice' && (
                          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-4">
                            {/* Animated Audio Wave */}
                            <div className="h-12 flex items-center justify-center gap-1 px-4">
                              {[30, 60, 85, 45, 90, 70, 40, 95, 60, 75, 35, 80, 90, 50, 65, 40, 75, 60].map((height, idx) => (
                                <div
                                  key={idx}
                                  className={`w-1 rounded-full transition-all duration-150 ${
                                    isRecording ? 'bg-rose-500 animate-pulse' : 'bg-slate-300'
                                  }`}
                                  style={{ height: isRecording ? `${height}%` : '20%' }}
                                />
                              ))}
                            </div>

                            <div className="flex flex-col items-center gap-2">
                              <button
                                onClick={handleToggleRecording}
                                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
                                  isRecording
                                    ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-200'
                                    : 'bg-slate-900 hover:bg-black text-white'
                                }`}
                              >
                                {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                              </button>
                              <span className="text-xs font-semibold text-slate-600">
                                {isRecording ? `Recording audio (${recordingSeconds}s)... Click to conclude` : 'Click to answer via voice recording'}
                              </span>
                            </div>

                            {/* Transcript Preview */}
                            {currentAnswer && (
                              <div className="text-left bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Live Transcribed Speech:</span>
                                <p className="leading-relaxed font-mono">{currentAnswer}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* TEXT MODE TEXTAREA */}
                        {inputMode === 'text' && (
                          <div className="space-y-1.5">
                            <textarea
                              rows={5}
                              value={currentAnswer}
                              onChange={(e) => setAnswers(prev => ({
                                ...prev,
                                [currentRound.round_num]: e.target.value
                              }))}
                              placeholder="Type your structured answer here (e.g. explain mechanisms, asymptotic trade-offs, edge cases, or STAR situations)..."
                              className="w-full text-xs sm:text-sm p-4 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 leading-relaxed resize-none shadow-inner"
                            />
                            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                              <span>Recommended: 25-80 technical words for comprehensive loophole analysis</span>
                              <span className={`font-mono font-semibold ${wordCount >= 20 ? 'text-emerald-600' : 'text-slate-400'}`}>
                                {wordCount} words
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between pt-2">
                          <button
                            disabled={currentRoundIdx === 0}
                            onClick={() => setCurrentRoundIdx(prev => prev - 1)}
                            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 disabled:opacity-40 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
                          >
                            <ArrowLeft className="w-4 h-4" /> Previous Round
                          </button>

                          {currentRoundIdx < trackData.rounds.length - 1 ? (
                            <button
                              onClick={() => {
                                setCurrentRoundIdx(prev => prev + 1);
                                setShowHint(false);
                              }}
                              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition cursor-pointer"
                            >
                              Next Round <ArrowRight className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              disabled={submittingSession}
                              onClick={handleFinishInterview}
                              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black disabled:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition cursor-pointer"
                            >
                              {submittingSession ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin text-sky-400" /> Analyzing Loopholes & Feedback...
                                </>
                              ) : (
                                <>
                                  Conclude Interview & Run Loophole Analysis <Award className="w-4 h-4 text-amber-300" />
                                </>
                              )}
                            </button>
                          )}
                        </div>

                      </div>
                    </div>

                    {/* Right Panel: Interview Coaching Guide & Checklist */}
                    <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-5 shadow-xs">
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                          <Target className="w-4 h-4 text-sky-600" /> Company Hiring Rubric
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          What top interviewers evaluate in this specific round
                        </p>
                      </div>

                      {/* Criteria */}
                      <div className="space-y-3 text-xs">
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <span className="font-bold text-slate-800 block text-[11px]">1. Technical Precision & Taxonomy</span>
                          <p className="text-slate-500 leading-relaxed text-[11px]">
                            Cite exact algorithms, data structures, and protocols rather than ambiguous descriptions.
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <span className="font-bold text-slate-800 block text-[11px]">2. Quantified Trade-offs</span>
                          <p className="text-slate-500 leading-relaxed text-[11px]">
                            Always contrast time complexity O(1) vs O(N) and mention latency / throughput figures.
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <span className="font-bold text-slate-800 block text-[11px]">3. Failure & Edge Case Handling</span>
                          <p className="text-slate-500 leading-relaxed text-[11px]">
                            Explain what happens if the database crashes, network drops, or scale jumps 10x.
                          </p>
                        </div>
                      </div>

                      {/* Expected Concepts */}
                      <div className="pt-2 space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Target Core Keywords for this Round:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {currentRound.expected_keywords.map((kw, kIdx) => (
                            <span key={kIdx} className="px-2 py-0.5 rounded-md bg-sky-50 border border-sky-100 text-sky-800 text-[10px] font-mono font-medium">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>
                );
              })()}

            </div>
          )}

          {/* STAGE C: POST-INTERVIEW LOOPHOLE ANALYSIS & RECTIFICATION REPORT */}
          {sessionStage === 'results' && sessionResults && (
            <div className="space-y-6">
              
              {/* Top Committee Verdict Banner */}
              <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-sky-700 text-xs font-bold uppercase tracking-wider mb-1">
                      <Award className="w-4 h-4 text-sky-600" /> Placement Committee Assessment
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-['Outfit']">
                      {sessionResults.verdict}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                      {sessionResults.verdict_summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 self-start md:self-auto">
                    <div className="text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Overall Rating</span>
                      <span className="text-3xl font-black text-slate-900 font-['Outfit']">{sessionResults.overall_score}%</span>
                    </div>
                    <div className="w-px h-10 bg-slate-200" />
                    <div className="text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Company Bar</span>
                      <span className="text-sm font-bold text-slate-800">{COMPANY_STYLES.find(c => c.id === companyStyle)?.name}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setAnswers({});
                      setCurrentRoundIdx(0);
                      setSessionStage('interview');
                    }}
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Retake Interview
                  </button>
                  <button
                    onClick={() => setSessionStage('setup')}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer"
                  >
                    Try Another Role / Company Track
                  </button>
                </div>
              </div>

              {/* 4-ROUND SCORE BREAKDOWN */}
              <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-4 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-600" /> Round-by-Round Performance Progression
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {sessionResults.rounds.map((r, rIdx) => (
                    <div key={rIdx} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800 text-[11px]">{r.round_title.split(':')[0]}</span>
                        <span className={`font-black text-sm ${r.score >= 80 ? 'text-emerald-700' : r.score >= 65 ? 'text-sky-700' : 'text-rose-600'}`}>
                          {r.score}/100
                        </span>
                      </div>

                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            r.score >= 80 ? 'bg-emerald-500' : r.score >= 65 ? 'bg-sky-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${r.score}%` }}
                        />
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                        r.status === 'Strong' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        r.status === 'Adequate' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                        'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CRITICAL LOOPHOLES IDENTIFIED & RECTIFICATION (The Core User Request) */}
              <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-5 shadow-xs">
                <div>
                  <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
                    <AlertTriangle className="w-4 h-4 text-rose-600" /> Loophole Analysis & Red Flag Detection
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">
                    Where You Lost Points & Exactly How to Fix It
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real interviewers penalize these specific technical loopholes. Study the actionable fixes below to master your next campus interview.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  {sessionResults.loopholes.map((lh, lIdx) => (
                    <div 
                      key={lIdx}
                      className="p-5 rounded-2xl bg-rose-50/20 border border-rose-200 space-y-4 transition"
                    >
                      {/* Loophole Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-500" />
                          {lh.round} ({lh.difficulty})
                        </span>
                        <span className="text-[10px] font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md self-start sm:self-auto">
                          Loophole Identified
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        ⚠️ {lh.loophole}
                      </h4>

                      {/* Snippet Comparison */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                            Your Answer Excerpt:
                          </span>
                          <p className="text-slate-700 font-mono text-[11px] leading-relaxed italic">
                            "{lh.candidate_snippet}"
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200">
                          <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-1">
                            Tier-1 Candidate Benchmark Answer:
                          </span>
                          <p className="text-slate-800 text-[11px] leading-relaxed">
                            {lh.benchmark_solution}
                          </p>
                        </div>
                      </div>

                      {/* Actionable Fix */}
                      <div className="p-3 rounded-xl bg-sky-50/80 border border-sky-200 text-xs text-sky-950 flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-sky-950 block mb-0.5">How to Rectify in Real Interviews:</strong>
                          <span className="text-slate-700 leading-relaxed">{lh.actionable_fix}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 10/10 BENCHMARK TRANSCRIPT ACROSS ALL 4 ROUNDS */}
              <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xs">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    Complete 4-Round Question Transcript & 10/10 Model Solutions
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Review the benchmark model answers for each round to calibrate your technical communication
                  </p>
                </div>

                <div className="space-y-4">
                  {sessionResults.rounds.map((r, rIdx) => (
                    <div key={rIdx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/30 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">
                          {r.round_title} ({r.difficulty})
                        </span>
                        <span className="text-xs font-bold text-slate-600 font-mono">
                          Awarded: {r.score}/100
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm font-semibold text-slate-900">
                        {r.question}
                      </p>

                      <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Your Answer:</span>
                        <p className="text-slate-700 leading-relaxed font-mono text-[11px]">{r.candidate_answer}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                        <span className="text-[10px] font-bold text-emerald-800 uppercase block">10/10 Company Benchmark Solution:</span>
                        <p className="text-slate-800 leading-relaxed text-[11px]">{r.sample_benchmark}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: DEEP RESUME REVIEW & INTERACTIVE CV BUILDER STUDIO */}
      {/* ========================================================= */}
      {activeTab === 'resume' && (
        <div className="space-y-6">

          {/* Sub-Mode Navigation Switcher: Review vs Builder */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setResumeMode('review')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  resumeMode === 'review'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4 text-sky-400" />
                <span>AI Resume Review & ATS Audit</span>
              </button>

              <button
                type="button"
                onClick={() => setResumeMode('builder')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  resumeMode === 'builder'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span>Interactive CV / Resume Builder</span>
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-extrabold uppercase">
                  NEW
                </span>
              </button>
            </div>
          </div>

          {resumeMode === 'builder' ? (
            <ResumeBuilder
              onSendToReview={handleBuilderSendToReview}
              initialPreset={
                resumeTargetRole === 'AI/ML Engineer'
                  ? 'aiml'
                  : resumeTargetRole === 'Cloud/DevOps Engineer'
                  ? 'devops'
                  : 'fullstack'
              }
            />
          ) : (
            <div className="space-y-8">
              {/* Promotional Callout to Builder */}
              <div className="bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-emerald-500/10 border border-sky-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Want to create an ATS-guaranteed resume from scratch?</h4>
                    <p className="text-xs text-slate-600">Use our new Interactive CV Builder with 1-click AcademicX vault sync, pre-built presets, and PDF download.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setResumeMode('builder')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shrink-0 cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <span>Launch CV Builder</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Top Control Bar: Target Role */}
              <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
                  Resume Analysis & Career Boost Engine
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Deep ATS audit, curated study courses with direct video lectures, national competitions, industry certifications, and high-impact projects.
                </p>
              </div>

              {/* Target Role Selector */}
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700 whitespace-nowrap pl-1">Target Role:</span>
                <select
                  value={resumeTargetRole}
                  onChange={(e) => {
                    const newRole = e.target.value;
                    setResumeTargetRole(newRole);
                    const recs = getDeepResumeRecommendations(newRole, atsResult.skills_detected || []);
                    setAtsResult(prev => ({
                      ...prev,
                      target_role: newRole,
                      ...recs
                    }));
                  }}
                  className="bg-white border border-slate-200 text-slate-900 text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer shadow-2xs"
                >
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="AI/ML Engineer">AI/ML Engineer</option>
                  <option value="Cloud/DevOps Engineer">Cloud/DevOps Engineer</option>
                  <option value="Software Engineer">Software Engineer (General)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Two-Column Top: Ingestion & Resume Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column (5 cols): Resume Ingestion & Live Actions */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl space-y-4 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-600" /> Academic Resume Document
                  </h3>
                </div>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.doc,.docx,.md"
                  className="hidden"
                  onChange={handleFileSelect}
                />

                {/* Interactive File Dropzone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`p-5 border-2 border-dashed rounded-2xl text-center transition-all cursor-pointer ${
                    isDragging
                      ? 'border-sky-500 bg-sky-50/70 scale-[1.01]'
                      : uploadedFileName
                      ? 'border-emerald-300 bg-emerald-50/30 hover:bg-emerald-50/60'
                      : 'border-slate-300 bg-slate-50 hover:bg-slate-100/80 hover:border-slate-400'
                  }`}
                >
                  {isUploadingResume ? (
                    <div className="flex flex-col items-center gap-2 py-2">
                      <Loader2 className="w-7 h-7 animate-spin text-sky-600" />
                      <p className="text-xs font-bold text-slate-800">
                        Parsing {uploadedFileName}...
                      </p>
                      <p className="text-[10px] text-slate-400">Extracting academic sections & technical skills</p>
                    </div>
                  ) : uploadedFileName ? (
                    <div className="flex flex-col items-center gap-1 py-1">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-bold text-emerald-900 truncate max-w-[260px]">
                        {uploadedFileName}
                      </p>
                      <span className="text-[10px] text-emerald-700 font-medium">
                        ✓ File Parsed • Click to upload another
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5">
                      <UploadCloud className="w-7 h-7 text-sky-600" />
                      <p className="text-xs font-bold text-slate-800">
                        Click or Drag & Drop PDF / DOCX Resume
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Auto-extracts credentials, projects & technical keywords
                      </p>
                    </div>
                  )}
                </div>

                {uploadError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      Resume Plain Text Preview
                    </label>
                    <span className="text-[10px] font-mono text-slate-400">
                      {resumeText.length} characters
                    </span>
                  </div>
                  <textarea
                    rows={7}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 leading-relaxed resize-none"
                    placeholder="Paste resume text or upload your PDF file..."
                  />
                </div>
              </div>
            </div>

            {/* Right Column (7 cols): Deep ATS & Placement Readiness Scorecard */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
              <div>
                {/* Score Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
                      <Award className="w-4 h-4 text-sky-600" /> Tier-1 Placement ATS Audit
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-['Outfit']">
                      Resume Compatibility Index
                    </h3>
                    <p className="text-xs text-slate-500">
                      Targeting <strong className="text-slate-800">{atsResult.target_role || resumeTargetRole}</strong> at Tier-1 Tech Enterprises
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 self-start sm:self-auto">
                    <div className="text-center">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">ATS Score</span>
                      <span className="text-3xl font-black text-slate-900 font-['Outfit']">
                        {atsResult.ats_score}<span className="text-xs text-slate-400 font-medium">/100</span>
                      </span>
                    </div>
                    <div className="w-px h-10 bg-slate-200" />
                    <div className="text-left">
                      <span className="text-[10px] text-emerald-700 font-bold block">● Placement Ready</span>
                      <span className="text-xs font-bold text-slate-700">Top 12% Pool</span>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 mt-4">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                    <span>Hiring Bar Match</span>
                    <span>{atsResult.ats_score}% Qualified</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        atsResult.ats_score >= 80 ? 'bg-gradient-to-r from-sky-500 to-emerald-500' : 'bg-gradient-to-r from-amber-500 to-sky-500'
                      }`}
                      style={{ width: `${atsResult.ats_score}%` }}
                    />
                  </div>
                </div>

                {/* Identified Skills */}
                <div className="mt-5 space-y-2">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verified Technical Competencies:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {atsResult.skills_detected?.map((skill, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" /> {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="mt-4 space-y-2">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" /> Critical Gaps to Close for {atsResult.target_role || resumeTargetRole}:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {atsResult.missing_keywords?.map((kw, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recruiter Strategy Advice */}
                <div className="mt-4 space-y-1.5">
                  <span className="text-xs font-bold text-slate-900 block">Recruiter Strategic Suggestions:</span>
                  <div className="space-y-1.5">
                    {atsResult.suggestions?.slice(0, 3).map((sug, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                        <Lightbulb className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                        <span>{sug}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2">
                <button 
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Print / Save Diagnostic Action Plan
                </button>
                <button
                  onClick={() => setActiveTab('interview')}
                  className="px-4 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ml-auto"
                >
                  Practice Interview Drills <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* THE 4 PILLARS OF DEEP RECOMMENDATIONS */}
          {/* ========================================================= */}
          <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-xs space-y-6">
            
            {/* Header & Filter Pills */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit']">
                  Personalized Roadmap to Boost Your Resume
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct portals to study, video lecture links, corporate competitions, recognized certificates, and resume-boosting projects
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                <button
                  onClick={() => setRecommendationFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    recommendationFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Items
                </button>
                <button
                  onClick={() => setRecommendationFilter('courses')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    recommendationFilter === 'courses' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Courses & Videos
                </button>
                <button
                  onClick={() => setRecommendationFilter('competitions')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    recommendationFilter === 'competitions' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Competitions
                </button>
                <button
                  onClick={() => setRecommendationFilter('certifications')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    recommendationFilter === 'certifications' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Certifications
                </button>
                <button
                  onClick={() => setRecommendationFilter('projects')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    recommendationFilter === 'projects' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Boost Projects
                </button>
              </div>
            </div>

            {/* PILLAR 1: RECOMMENDED COURSES WITH STUDY PORTAL & DIRECT VIDEO LINKS */}
            {(recommendationFilter === 'all' || recommendationFilter === 'courses') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        1. Recommended Courses & Video Lectures
                      </h4>
                      <p className="text-xs text-slate-500">
                        Study portals to master core concepts, accompanied by direct video lecture links
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
                    {atsResult.recommended_courses?.length || 0} Recommended
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {atsResult.recommended_courses?.map((course) => (
                    <div 
                      key={course.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-slate-50/40 hover:bg-white hover:border-sky-300 hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md uppercase">
                            {course.badge}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">
                            {course.duration} • {course.cost}
                          </span>
                        </div>

                        <h5 className="text-sm font-bold text-slate-900 leading-snug">
                          {course.title}
                        </h5>

                        <p className="text-[11px] font-medium text-slate-500">
                          Provider: <strong className="text-slate-700">{course.provider}</strong> • Field: <span className="text-slate-700">{course.field}</span>
                        </p>

                        <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed">
                          <span className="font-bold text-slate-900 block mb-0.5 text-[11px]">Why You Should Study This:</span>
                          {course.why_recommended}
                        </div>
                      </div>

                      {/* Action Links: Portal + Video */}
                      <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-2">
                        <a
                          href={course.portal_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Study Portal
                        </a>
                        <a
                          href={course.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-xs"
                        >
                          <PlayCircle className="w-3.5 h-3.5" /> Watch Video
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PILLAR 2: COMPETITIONS & HACKATHONS */}
            {(recommendationFilter === 'all' || recommendationFilter === 'competitions') && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        2. National Competitions & Corporate Hackathons
                      </h4>
                      <p className="text-xs text-slate-500">
                        Participate to bypass resume screening algorithms and receive fast-tracked company interview calls
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                    {atsResult.competitions?.length || 0} Competitions
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {atsResult.competitions?.map((comp) => (
                    <div 
                      key={comp.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-amber-50/15 hover:bg-white hover:border-amber-300 hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md uppercase">
                            {comp.badge}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500">
                            {comp.type}
                          </span>
                        </div>

                        <h5 className="text-sm font-bold text-slate-900 leading-snug">
                          {comp.title}
                        </h5>

                        <p className="text-[11px] text-slate-500">
                          Organized by: <strong className="text-slate-700">{comp.organizer}</strong>
                        </p>

                        <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 space-y-1">
                          <span className="font-bold text-slate-900 block text-[11px]">How Companies Hire From This:</span>
                          <p className="text-slate-600 leading-relaxed text-[11px]">
                            {comp.hiring_impact}
                          </p>
                        </div>

                        <div className="text-[11px] text-amber-900 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200">
                          <strong>Recommended Angle:</strong> {comp.recommended_project_angle}
                        </div>
                      </div>

                      <a
                        href={comp.portal_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs mt-2"
                      >
                        <Trophy className="w-3.5 h-3.5" /> Register on Official Portal
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PILLAR 3: RESUME-BOOSTING INDUSTRY CERTIFICATIONS */}
            {(recommendationFilter === 'all' || recommendationFilter === 'certifications') && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        3. Industry Certifications That Companies Hire For
                      </h4>
                      <p className="text-xs text-slate-500">
                        Recognized credentials that prove autonomous execution and dramatically boost interview shortlist rates
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    {atsResult.certifications?.length || 0} Certifications
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {atsResult.certifications?.map((cert) => (
                    <div 
                      key={cert.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-emerald-50/20 hover:bg-white hover:border-emerald-300 hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md uppercase">
                            {cert.badge}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-slate-500">
                            {cert.exam_code}
                          </span>
                        </div>

                        <h5 className="text-sm font-bold text-slate-900 leading-snug">
                          {cert.title}
                        </h5>

                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100/70 border border-emerald-300 text-emerald-950 font-bold text-xs">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-700" /> {cert.hiring_boost_percentage}
                        </div>

                        <p className="text-[11px] text-slate-500">
                          Authority: <strong className="text-slate-700">{cert.issuer}</strong>
                        </p>

                        <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 space-y-1">
                          <span className="font-bold text-slate-900 block text-[11px]">Why Companies Value This:</span>
                          <p className="text-slate-600 leading-relaxed text-[11px]">
                            {cert.why_companies_hire}
                          </p>
                        </div>
                      </div>

                      <a
                        href={cert.apply_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs mt-2"
                      >
                        <Award className="w-3.5 h-3.5" /> Apply for Certification
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PILLAR 4: RESUME-BOOSTING HIGH-IMPACT PROJECTS */}
            {(recommendationFilter === 'all' || recommendationFilter === 'projects') && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                      <Code2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        4. High-Impact Projects to Boost Your Resume
                      </h4>
                      <p className="text-xs text-slate-500">
                        Production-grade projects with quantifiable bullet points ready to paste onto your resume
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                    {atsResult.recommended_projects?.length || 0} Boost Projects
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {atsResult.recommended_projects?.map((proj) => (
                    <div 
                      key={proj.id}
                      className="p-6 rounded-3xl border border-slate-200 bg-indigo-50/15 hover:bg-white hover:border-indigo-300 hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[10px] font-bold text-indigo-800 bg-indigo-100 px-2.5 py-0.5 rounded-md uppercase">
                            {proj.domain}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            High Recruiter Interest
                          </span>
                        </div>

                        <h5 className="text-base font-bold text-slate-900 leading-snug">
                          {proj.title}
                        </h5>

                        <div className="flex flex-wrap gap-1.5">
                          {proj.tech_stack?.map((tech, tIdx) => (
                            <span key={tIdx} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800 text-[10px] font-mono font-medium">
                              {tech}
                            </span>
                          ))}
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          <strong className="text-slate-800">Why this boosts your resume:</strong> {proj.why_boosts_resume}
                        </p>

                        {/* Exact Resume Bullets Box */}
                        <div className="p-3.5 rounded-2xl bg-white border border-indigo-200/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
                              Copy-Paste Bullet Points for Resume:
                            </span>
                            <button
                              onClick={() => handleCopyBullets(proj.id, proj.resume_bullet_points)}
                              className="text-[11px] font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer transition"
                            >
                              {copiedProjectId === proj.id ? (
                                <>
                                  <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> Copied to Clipboard!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" /> Copy Bullets
                                </>
                              )}
                            </button>
                          </div>

                          <div className="space-y-1.5 text-xs text-slate-800 font-mono text-[11px] leading-relaxed">
                            {proj.resume_bullet_points?.map((bullet, bIdx) => (
                              <div key={bIdx} className="flex items-start gap-1.5">
                                <span className="text-sky-600 font-bold">•</span>
                                <span>{bullet}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between gap-3">
                        <a
                          href={proj.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-xs"
                        >
                          <Code2 className="w-3.5 h-3.5" /> View Architecture / Starter
                        </a>
                        <button
                          onClick={() => handleCopyBullets(proj.id, proj.resume_bullet_points)}
                          className="py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" /> Copy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            </div>
          </div>
        )}

      </div>
    )}

      {/* ========================================================= */}
      {/* TAB 3: STEP-BY-STEP CAREER PROGRESSION ROADMAP */}
      {/* ========================================================= */}
      {activeTab === 'roadmap' && (
        <div className="space-y-8">

          {/* ========================================================= */}
          {/* SECTION: "HOW TO IMPROVE YOURSELF" (Aap Kaise Improve Karein) */}
          {/* ========================================================= */}
          {/* ========================================================= */}
          {/* DAILY BLUEPRINT & MISTAKE RECTIFICATION */}
          {/* ========================================================= */}
          <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-2xl shadow-xs space-y-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-['Outfit'] tracking-tight">
                How to Improve Yourself: Daily Blueprint & Mistake Rectification
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Exact tactical methods to raise your diagnostic scores, eliminate loopholes, and pass tech interviews
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Daily 2-Hour Schedule */}
              <div className="p-5 rounded-xl border border-slate-200/90 bg-slate-50/50 space-y-3.5">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Daily 2-Hour Routine
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                    Structured Preparation Routine
                  </h4>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-lg bg-white border border-slate-200/80 space-y-1">
                    <strong className="text-slate-900 block text-[12px] font-semibold">Morning (45 Mins): Algorithmic Rigor</strong>
                    <p className="text-slate-600 text-[11px] leading-relaxed">Solve 1 LeetCode Medium problem on recursion or trees with zero hints.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-slate-200/80 space-y-1">
                    <strong className="text-slate-900 block text-[12px] font-semibold">Evening (45 Mins): Architecture Building</strong>
                    <p className="text-slate-600 text-[11px] leading-relaxed">Work on Redis Lua caching or Kafka message ingestion with git commits.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-slate-200/80 space-y-1">
                    <strong className="text-slate-900 block text-[12px] font-semibold">Night (30 Mins): STAR Drill & Revision</strong>
                    <p className="text-slate-600 text-[11px] leading-relaxed">Practice behavioral STAR answers and review diagnostic questions.</p>
                  </div>
                </div>
              </div>

              {/* Loopholes to Avoid */}
              <div className="p-5 rounded-xl border border-slate-200/90 bg-slate-50/50 space-y-3.5">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Mistakes to Avoid
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                    Critical Technical Traps
                  </h4>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-lg bg-white border border-slate-200/80 space-y-1">
                    <strong className="text-slate-900 block text-[12px] font-semibold">Avoid Direct Database Locks</strong>
                    <p className="text-slate-600 text-[11px] leading-relaxed">Never lock database rows during flash-sales. Use Redis atomic Lua scripts.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-slate-200/80 space-y-1">
                    <strong className="text-slate-900 block text-[12px] font-semibold">Avoid Vague Project Bullets</strong>
                    <p className="text-slate-600 text-[11px] leading-relaxed">Always quantify: state "reduced latency from 320ms to 42ms" rather than "fast API".</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-slate-200/80 space-y-1">
                    <strong className="text-slate-900 block text-[12px] font-semibold">Don't Neglect Base-Rate Priors</strong>
                    <p className="text-slate-600 text-[11px] leading-relaxed">In ML classification, accuracy is useless when rare fraud is 0.2%. Use PR-AUC.</p>
                  </div>
                </div>
              </div>

              {/* Salary & Career Progression */}
              <div className="p-5 rounded-xl border border-slate-200/90 bg-slate-50/50 space-y-3.5">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Career Trajectory
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                    Expected Salary Progression
                  </h4>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-lg bg-white border border-slate-200/80 space-y-1">
                    <div className="flex justify-between items-center">
                      <strong className="text-slate-900 text-[12px] font-semibold">Level 1: Campus Placement</strong>
                      <span className="text-slate-900 font-bold font-mono text-[12px]">₹10 - 18 LPA</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">Graduate SDE-1 / Associate Engineer</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-slate-200/80 space-y-1">
                    <div className="flex justify-between items-center">
                      <strong className="text-slate-900 text-[12px] font-semibold">Level 2: 2-3 Years Growth</strong>
                      <span className="text-slate-900 font-bold font-mono text-[12px]">₹22 - 32 LPA</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">SDE-2 / Systems & Backend Engineer</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-slate-200/80 space-y-1">
                    <div className="flex justify-between items-center">
                      <strong className="text-slate-900 text-[12px] font-semibold">Level 3: 5+ Years Architect</strong>
                      <span className="text-slate-900 font-bold font-mono text-[12px]">₹40 - 65+ LPA</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">Staff Engineer / Solutions Architect</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================= */}
          {/* THE 5 PROGRESSIVE STEPS OF THE ROADMAP */}
          {/* ========================================================= */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                  <Compass className="w-5 h-5 text-sky-600" />
                  The 5 Progressive Roadmap Steps (Foundation to Placement)
                </h3>
                <p className="text-xs text-slate-500">
                  Check off items as you complete them to track your verified placement readiness
                </p>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 self-start sm:self-auto">
                Target: 12-Week Mastery
              </span>
            </div>

            {/* STEP 1 */}
            <div className="bg-white border-2 border-slate-200 hover:border-sky-300 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4 transition">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-sky-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                    1
                  </span>
                  <div>
                    <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider block">Phase 1: Weeks 1 - 2</span>
                    <h4 className="text-base font-bold text-slate-900">
                      Foundational Remediation & Core Taxonomy Mastery
                    </h4>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-100 self-start sm:self-auto">
                  1.5 hrs/day
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="md:col-span-2 space-y-3">
                  <p className="text-slate-600 leading-relaxed text-xs">
                    <strong className="text-slate-900">Exam Gap Targeted:</strong> Amortized complexity O(1) in dynamic arrays, pointer memory structures, and OOP polymorphism.
                  </p>
                  
                  {/* Action Checklist */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider">Step Action Milestones (Click to Mark Done):</span>
                    
                    <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={!!completedChecklist["step1_1"]}
                        onChange={() => toggleChecklistItem("step1_1")}
                        className="mt-0.5 rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                      />
                      <span className={`text-xs ${completedChecklist["step1_1"] ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>
                        Master dynamic list resizing arithmetic and explain why append() is O(1) amortized.
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={!!completedChecklist["step1_2"]}
                        onChange={() => toggleChecklistItem("step1_2")}
                        className="mt-0.5 rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                      />
                      <span className={`text-xs ${completedChecklist["step1_2"] ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>
                        Implement 15 foundational LeetCode Easy problems on Hash Maps and Pointers.
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={!!completedChecklist["step1_3"]}
                        onChange={() => toggleChecklistItem("step1_3")}
                        className="mt-0.5 rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                      />
                      <span className={`text-xs ${completedChecklist["step1_3"] ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>
                        Explain TCP 3-way handshake packet sequence (SYN, SYN-ACK, ACK) and state transitions.
                      </span>
                    </label>
                  </div>
                </div>

                {/* Recommended Resources */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Curated Study Links</span>
                    <div className="space-y-2 text-xs">
                      <a 
                        href="https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 hover:border-sky-300 text-slate-800 font-medium transition"
                      >
                        <span className="truncate">MIT 6.006: Core Algorithms</span>
                        <ExternalLink className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      </a>
                      <a 
                        href="https://cs50.harvard.edu/x/" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 hover:border-sky-300 text-slate-800 font-medium transition"
                      >
                        <span className="truncate">CS50: Memory & Pointers</span>
                        <ExternalLink className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      </a>
                    </div>
                  </div>
                  <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200 font-semibold">
                    ✓ Milestone: Pass Foundation Quiz with &gt; 90%
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 2 */}
            <div className="bg-white border-2 border-slate-200 hover:border-amber-300 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4 transition">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-amber-500 text-white font-black text-sm flex items-center justify-center shadow-xs">
                    2
                  </span>
                  <div>
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Phase 2: Weeks 3 - 4</span>
                    <h4 className="text-base font-bold text-slate-900">
                      Algorithmic Rigor, Recurrence & Mathematical Modeling
                    </h4>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-100 self-start sm:self-auto">
                  2.0 hrs/day
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="md:col-span-2 space-y-3">
                  <p className="text-slate-600 leading-relaxed text-xs">
                    <strong className="text-slate-900">Exam Gap Targeted:</strong> Recurrence relations, Master Theorem asymptotic bounds, and graph planar formulas (Euler V - E + F = 2).
                  </p>
                  
                  {/* Action Checklist */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider">Step Action Milestones:</span>
                    
                    <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={!!completedChecklist["step2_1"]}
                        onChange={() => toggleChecklistItem("step2_1")}
                        className="mt-0.5 rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                      />
                      <span className={`text-xs ${completedChecklist["step2_1"] ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>
                        Solve Master Theorem cases 1, 2, and 3 for divide-and-conquer recurrences under 60 seconds.
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={!!completedChecklist["step2_2"]}
                        onChange={() => toggleChecklistItem("step2_2")}
                        className="mt-0.5 rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                      />
                      <span className={`text-xs ${completedChecklist["step2_2"] ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>
                        Solve 10 Graph Theory problems (Euler formula, bipartite checking, and BFS topological sort).
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={!!completedChecklist["step2_3"]}
                        onChange={() => toggleChecklistItem("step2_3")}
                        className="mt-0.5 rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                      />
                      <span className={`text-xs ${completedChecklist["step2_3"] ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>
                        Implement an in-memory LRU Cache with O(1) get() and put() using Hash Map + Doubly Linked List.
                      </span>
                    </label>
                  </div>
                </div>

                {/* Recommended Resources */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Curated Study Links</span>
                    <div className="space-y-2 text-xs">
                      <a 
                        href="https://nptel.ac.in/courses/106106145" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 hover:border-amber-300 text-slate-800 font-medium transition"
                      >
                        <span className="truncate">NPTEL: Discrete Math IIT</span>
                        <ExternalLink className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      </a>
                      <a 
                        href="https://khanacademy.org" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 hover:border-amber-300 text-slate-800 font-medium transition"
                      >
                        <span className="truncate">Probability & Bayes Priors</span>
                        <ExternalLink className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      </a>
                    </div>
                  </div>
                  <div className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200 font-semibold">
                    ✓ Milestone: 80% on Recurrence & Graph Drills
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 3 */}
            <div className="bg-white border-2 border-slate-200 hover:border-emerald-300 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4 transition">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                    3
                  </span>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Phase 3: Weeks 5 - 8</span>
                    <h4 className="text-base font-bold text-slate-900">
                      High-Scalability Systems & Production Resume Projects
                    </h4>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100 self-start sm:self-auto">
                  2.5 hrs/day
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="md:col-span-2 space-y-3">
                  <p className="text-slate-600 leading-relaxed text-xs">
                    <strong className="text-slate-900">Exam Gap Targeted:</strong> Flash-sale concurrency (Question 7 in diagnostic test) and avoiding direct database locks under 100k req/sec.
                  </p>
                  
                  {/* Action Checklist */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider">Step Action Milestones:</span>
                    
                    <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={!!completedChecklist["step3_1"]}
                        onChange={() => toggleChecklistItem("step3_1")}
                        className="mt-0.5 rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                      />
                      <span className={`text-xs ${completedChecklist["step3_1"] ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>
                        Build a Redis atomic Lua script checkout API guaranteeing zero overselling across 50k requests.
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={!!completedChecklist["step3_2"]}
                        onChange={() => toggleChecklistItem("step3_2")}
                        className="mt-0.5 rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                      />
                      <span className={`text-xs ${completedChecklist["step3_2"] ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>
                        Decouple PostgreSQL writes with Apache Kafka / Celery event queues to reduce p99 latency to &lt;50ms.
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={!!completedChecklist["step3_3"]}
                        onChange={() => toggleChecklistItem("step3_3")}
                        className="mt-0.5 rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                      />
                      <span className={`text-xs ${completedChecklist["step3_3"] ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>
                        Deploy system with Docker Compose and add Prometheus latency metrics to GitHub portfolio.
                      </span>
                    </label>
                  </div>
                </div>

                {/* Recommended Resources */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Curated Study Links</span>
                    <div className="space-y-2 text-xs">
                      <a 
                        href="https://github.com/donnemartin/system-design-primer" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 hover:border-emerald-300 text-slate-800 font-medium transition"
                      >
                        <span className="truncate">System Design Primer</span>
                        <ExternalLink className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      </a>
                      <a 
                        href="https://fullstackopen.com/en/" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 hover:border-emerald-300 text-slate-800 font-medium transition"
                      >
                        <span className="truncate">Full Stack Open Helsinki</span>
                        <ExternalLink className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      </a>
                    </div>
                  </div>
                  <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200 font-semibold">
                    ✓ Milestone: Live Production GitHub Project
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 4 */}
            <div className="bg-white border-2 border-slate-200 hover:border-indigo-300 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4 transition">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                    4
                  </span>
                  <div>
                    <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">Phase 4: Weeks 9 - 10</span>
                    <h4 className="text-base font-bold text-slate-900">
                      Company-Calibrated Interview Simulations & STAR Framework
                    </h4>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-100 self-start sm:self-auto">
                  2.0 hrs/day
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="md:col-span-2 space-y-3">
                  <p className="text-slate-600 leading-relaxed text-xs">
                    <strong className="text-slate-900">Exam Gap Targeted:</strong> Technical articulation loopholes (Question 8 in diagnostic) and quantifying permanent safeguards.
                  </p>
                  
                  {/* Action Checklist */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider">Step Action Milestones:</span>
                    
                    <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={!!completedChecklist["step4_1"]}
                        onChange={() => toggleChecklistItem("step4_1")}
                        className="mt-0.5 rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                      />
                      <span className={`text-xs ${completedChecklist["step4_1"] ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>
                        Complete Tier-1 Product Mock Interview (all 4 rounds) with an overall score &gt;80%.
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={!!completedChecklist["step4_2"]}
                        onChange={() => toggleChecklistItem("step4_2")}
                        className="mt-0.5 rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                      />
                      <span className={`text-xs ${completedChecklist["step4_2"] ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>
                        Structure 3 production incident stories using STAR with quantifiable resolution numbers.
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={!!completedChecklist["step4_3"]}
                        onChange={() => toggleChecklistItem("step4_3")}
                        className="mt-0.5 rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                      />
                      <span className={`text-xs ${completedChecklist["step4_3"] ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>
                        Participate in Smart India Hackathon (SIH) or Unstop Corporate Challenge with your project.
                      </span>
                    </label>
                  </div>
                </div>

                {/* Recommended Resources */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Practice Tools</span>
                    <div className="space-y-2 text-xs">
                      <button 
                        onClick={() => setActiveTab('interview')}
                        className="w-full flex items-center justify-between p-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold transition cursor-pointer"
                      >
                        <span>Start 4-Round Mock</span>
                        <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                      </button>
                      <button 
                        onClick={() => setActiveTab('resume')}
                        className="w-full flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 hover:border-sky-300 text-slate-800 font-medium transition cursor-pointer"
                      >
                        <span>Run Resume Review</span>
                        <ExternalLink className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      </button>
                    </div>
                  </div>
                  <div className="text-[11px] text-indigo-900 bg-indigo-50 p-2 rounded-lg border border-indigo-200 font-semibold">
                    ✓ Milestone: Cleared Mock Interview Bar
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 5 */}
            <div className="bg-white border-2 border-slate-200 hover:border-sky-400 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4 transition">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center shadow-xs">
                    5
                  </span>
                  <div>
                    <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider block">Phase 5: Weeks 11 - 12</span>
                    <h4 className="text-base font-bold text-slate-900">
                      Placement Conversion, Credential Verification & Offer Letter
                    </h4>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="md:col-span-2 space-y-3">
                  <p className="text-slate-600 leading-relaxed text-xs">
                    <strong className="text-slate-900">Final Outcome:</strong> Authenticate degree credentials with institutional verification, connect with partner tech talent recruiters, and convert offers.
                  </p>
                  
                  {/* Action Checklist */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider">Step Action Milestones:</span>
                    
                    <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={!!completedChecklist["step5_1"]}
                        onChange={() => toggleChecklistItem("step5_1")}
                        className="mt-0.5 rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                      />
                      <span className={`text-xs ${completedChecklist["step5_1"] ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>
                        Ingest authenticated marksheet transcript with institutional cryptographic SHA-256 hash.
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={!!completedChecklist["step5_2"]}
                        onChange={() => toggleChecklistItem("step5_2")}
                        className="mt-0.5 rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                      />
                      <span className={`text-xs ${completedChecklist["step5_2"] ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>
                        Earn industry-standard certification (AWS SAA-C03 / CKA / Meta Backend) to boost ATS shortlist.
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={!!completedChecklist["step5_3"]}
                        onChange={() => toggleChecklistItem("step5_3")}
                        className="mt-0.5 rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                      />
                      <span className={`text-xs ${completedChecklist["step5_3"] ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>
                        Apply to verified placement drives with 94%+ match score and accept offer letter.
                      </span>
                    </label>
                  </div>
                </div>

                {/* Final Goal Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-50/80 via-white to-emerald-50/50 border border-sky-200/80 shadow-2xs flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-100/90 px-2.5 py-0.5 rounded-full border border-sky-200 uppercase tracking-wider inline-block mb-1.5">
                      Placement Benchmark
                    </span>
                    <h5 className="text-sm font-bold text-slate-900 leading-snug font-['Outfit']">
                      Tier-1 Product Tech Engineer Offer
                    </h5>
                    <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-600 flex-wrap">
                      <span>Expected Compensation:</span>
                      <span className="font-extrabold text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-2 py-0.5 rounded-md text-xs">
                        ₹14 - 22 LPA
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs hover:shadow transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Full Roadmap</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Navigation CTA Bar */}
          <div className="bg-white border border-slate-200 p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Want to update this roadmap with fresh exam data?</h4>
                <p className="text-xs text-slate-500">Retake the diagnostic assessment anytime to recalibrate your progression.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/?role=student&tab=diagnostic"
                className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retake Diagnostic Assessment
              </a>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
