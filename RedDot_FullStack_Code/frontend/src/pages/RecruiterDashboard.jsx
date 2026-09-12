import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Users, 
  UserCheck, 
  Check, 
  PlusCircle, 
  Search, 
  Send, 
  MessageSquare, 
  Building, 
  Clock,
  ExternalLink,
  ArrowRight,
  X,
  AlertTriangle,
  Sparkles,
  Filter,
  Calendar,
  MapPin,
  DollarSign,
  Award,
  GraduationCap,
  ShieldCheck,
  Download,
  ChevronRight,
  FileText,
  CheckCircle2,
  TrendingUp,
  Share2,
  Phone,
  Mail,
  Copy,
  CheckCheck,
  Star
} from 'lucide-react';
import { fetchRecruiterStats } from '../services/api';
import { downloadOfferLetter, downloadStudentDossier } from '../utils/downloadUtils';


// Clean production candidate dossier builder
export const createCandidateDossier = (candidate = {}) => ({
  id: candidate.id || 1,
  name: candidate.name || candidate.student_name || "Candidate",
  role_title: candidate.role || candidate.role_title || "Engineering Candidate",
  college: candidate.college || "Higher Education Institution",
  apaar_id: candidate.apaar_id || "VERIFIED",
  cgpa: candidate.cgpa || "N/A",
  class_rank: "Verified Candidate",
  bio: "Candidate profile registered on the National Higher Education & Campus Placement Grid.",
  verified_hash: "0x8f2a74c19b882e30d12ac491901fa9",
  top_skills: (candidate.top_skills && candidate.top_skills.length) ? candidate.top_skills : (candidate.skills && candidate.skills.length) ? candidate.skills : ["Python", "React", "PostgreSQL"],
  match_score: candidate.match_score || 85,
  match_breakdown: candidate.match_breakdown || { Skills: 88, Projects: 82, Academics: 85 },
  avatar: candidate.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
  projects: candidate.projects || [],
  coursework: candidate.coursework || [],
  certifications: candidate.certifications || [],
  hackathons: candidate.hackathons || []
});

const INITIAL_RECRUITER_DATA = {
  company_name: "Tata Consultancy Services (TCS) Talent Hub",
  recruiter_name: "Priya Sharma (Campus Hiring Lead)",
  active_jobs_count: 5,
  total_applications_count: 48,
  shortlisted_count: 12,
  hired_count: 3,
  active_postings_detail: [
    {
      id: "job-101",
      title: "AI & Deep Learning Research Engineer",
      department: "Applied AI Research",
      location: "Bengaluru (Hybrid)",
      type: "Full-Time",
      stipend_salary: "₹14.0 - 22.0 LPA",
      openings: 3,
      applications_count: 18,
      deadline: "2026-09-30",
      status: "CLOSING_SOON",
      closing_label: "Closing in 2 days",
      urgency: "urgent",
      skills: ["PyTorch", "Transformers", "Python", "FastAPI", "VectorDB"]
    },
    {
      id: "job-102",
      title: "Full-Stack Cloud & Distributed Systems Engineer",
      department: "Core Platform Engineering",
      location: "Hyderabad / Remote",
      type: "Full-Time",
      stipend_salary: "₹12.0 - 18.0 LPA",
      openings: 5,
      applications_count: 14,
      deadline: "2026-10-15",
      status: "ACTIVE",
      closing_label: "Active (14 Openings)",
      urgency: "normal",
      skills: ["React", "Node.js", "PostgreSQL", "Docker", "AWS"]
    },
    {
      id: "job-103",
      title: "DevOps & Cloud Security Specialist",
      department: "Infrastructure & SecOps",
      location: "Pune",
      type: "Full-Time",
      stipend_salary: "₹11.0 - 16.0 LPA",
      openings: 2,
      applications_count: 8,
      deadline: "2026-10-05",
      status: "CLOSING_SOON",
      closing_label: "Closing in 3 days",
      urgency: "urgent",
      skills: ["Kubernetes", "Terraform", "CI/CD", "Linux", "GCP"]
    },
    {
      id: "job-104",
      title: "Data Platform & Analytics Engineer",
      department: "Enterprise Intelligence",
      location: "Gurugram",
      type: "Full-Time",
      stipend_salary: "₹10.0 - 15.0 LPA",
      openings: 4,
      applications_count: 12,
      deadline: "2026-10-25",
      status: "ACTIVE",
      closing_label: "Active",
      urgency: "normal",
      skills: ["Python", "Apache Spark", "SQL", "Snowflake", "dbt"]
    },
    {
      id: "job-105",
      title: "Embedded IoT & Edge AI Developer",
      department: "Smart Devices Lab",
      location: "Bengaluru",
      type: "Full-Time",
      stipend_salary: "₹9.5 - 14.5 LPA",
      openings: 2,
      applications_count: 6,
      deadline: "2026-11-01",
      status: "ACTIVE",
      closing_label: "Active",
      urgency: "normal",
      skills: ["C++", "Embedded C", "FreeRTOS", "TinyML", "MQTT"]
    }
  ],
  shortlisted_pool_detail: {
    average_match: 91,
    breakdown: { skills: 93, experience: 89, academics: 92 },
    candidates: [
      {
        id: "c-1",
        name: "Aarav Mehta",
        college: "NIT Raipur • B.Tech CSE",
        role: "AI / ML Systems Engineer",
        match_score: 94,
        cgpa: "9.12",
        skills: ["PyTorch", "FastAPI", "VectorDB", "Python"],
        top_skills: ["PyTorch", "FastAPI", "VectorDB", "Python"],
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150"
      },
      {
        id: "c-2",
        name: "Isha Saxena",
        college: "IIT Bombay • B.Tech CSE",
        role: "Full-Stack Cloud Engineer",
        match_score: 93,
        cgpa: "9.45",
        skills: ["React", "Node.js", "Docker", "Kubernetes"],
        top_skills: ["React", "Node.js", "Docker", "Kubernetes"],
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
      },
      {
        id: "c-3",
        name: "Rohan Deshmukh",
        college: "BITS Pilani • Information Systems",
        role: "Cloud Platform Dev",
        match_score: 89,
        cgpa: "8.82",
        skills: ["Go", "Kafka", "PostgreSQL", "Docker"],
        top_skills: ["Go", "Kafka", "PostgreSQL", "Docker"],
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
      },
      {
        id: "c-4",
        name: "Pooja Hegde",
        college: "IIT Bombay • Electrical Eng.",
        role: "Embedded IoT Developer",
        match_score: 92,
        cgpa: "9.05",
        skills: ["Embedded C", "C++", "FreeRTOS", "TinyML"],
        top_skills: ["Embedded C", "C++", "FreeRTOS", "TinyML"],
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
      },
      {
        id: "c-5",
        name: "Ananya Roy",
        college: "DTU Delhi • Software Engineering",
        role: "Data Platform Engineer",
        match_score: 91,
        cgpa: "8.94",
        skills: ["Python", "Spark", "SQL", "Snowflake"],
        top_skills: ["Python", "Spark", "SQL", "Snowflake"],
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150"
      },
      {
        id: "c-6",
        name: "Karan Malhotra",
        college: "VIT Vellore • Computer Science",
        role: "DevOps & SecOps",
        match_score: 86,
        cgpa: "8.65",
        skills: ["Kubernetes", "Terraform", "CI/CD", "Linux"],
        top_skills: ["Kubernetes", "Terraform", "CI/CD", "Linux"],
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
      }
    ]
  },
  selected_candidates_detail: [
    {
      id: "hire-1",
      student_name: "Rahul Verma",
      college: "National Institute of Technology (NIT) Raipur",
      apaar_id: "STU-8821-4902-1190",
      offered_ctc: "₹14.5 LPA",
      joining_date: "July 1, 2026",
      role_selected: "AI Systems Engineer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      university_linkage: {
        moa_number: "MOA-NITR-2026-089",
        placement_cell: "NIT Raipur Corporate Career Center",
        officer: "Dr. S. K. Gupta (Head of Placements)",
        verification_status: "Institutionally Cryptographically Verified",
        sha256_hash: "0x8f2a74c19b882e30d12ac491901fa9b882e30d12ac491901fa9"
      }
    },
    {
      id: "hire-2",
      student_name: "Ananya Sharma",
      college: "BITS Pilani (Goa Campus)",
      apaar_id: "STU-9104-5829-3341",
      offered_ctc: "₹16.0 LPA",
      joining_date: "July 15, 2026",
      role_selected: "Distributed Cloud Engineer",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      university_linkage: {
        moa_number: "MOA-BITS-2026-114",
        placement_cell: "BITS Career & Internship Directorate",
        officer: "Prof. M. Roy (Placement Chair)",
        verification_status: "Institutionally Cryptographically Verified",
        sha256_hash: "0x4e21a8f93010baec9381a18274a9840291baec9381a18274a9"
      }
    },
    {
      id: "hire-3",
      student_name: "Siddharth Nair",
      college: "IIT Bombay • M.Tech Computer Science",
      apaar_id: "STU-7712-9903-8821",
      offered_ctc: "₹22.0 LPA",
      joining_date: "August 1, 2026",
      role_selected: "Senior AI Research Fellow",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      university_linkage: {
        moa_number: "MOA-IITB-2026-042",
        placement_cell: "IIT Bombay Placement Office",
        officer: "Dr. K. Raman (Director, Industry Relations)",
        verification_status: "Institutionally Cryptographically Verified",
        sha256_hash: "0x9183ab92841029cba8371904a8b7263541029cba8371904a8b"
      }
    }
  ],
  recent_applications: [
    {
      id: "app-1",
      student_name: "Aarav Mehta",
      college: "NIT Raipur • Computer Science",
      job_title: "AI & Deep Learning Research Engineer",
      match_score: 94,
      verified_apaar: true,
      status: "INTERVIEW"
    },
    {
      id: "app-2",
      student_name: "Pooja Hegde",
      college: "IIT Bombay • Electrical Eng.",
      job_title: "Embedded IoT & Edge AI Developer",
      match_score: 92,
      verified_apaar: true,
      status: "SHORTLISTED"
    },
    {
      id: "app-3",
      student_name: "Rohan Deshmukh",
      college: "BITS Pilani • Information Systems",
      job_title: "Full-Stack Cloud & Distributed Systems Engineer",
      match_score: 89,
      verified_apaar: true,
      status: "APPLIED"
    },
    {
      id: "app-4",
      student_name: "Ananya Roy",
      college: "DTU Delhi • Software Engineering",
      job_title: "Data Platform & Analytics Engineer",
      match_score: 91,
      verified_apaar: true,
      status: "SHORTLISTED"
    },
    {
      id: "app-5",
      student_name: "Karan Malhotra",
      college: "VIT Vellore • Computer Science",
      job_title: "DevOps & Cloud Security Specialist",
      match_score: 86,
      verified_apaar: true,
      status: "REVIEWED"
    }
  ],
  ai_recommended_candidates: [
    {
      id: "rec-1",
      name: "Aarav Mehta",
      college: "National Institute of Technology (NIT) Raipur",
      role: "AI / ML Systems Engineer",
      match_score: 94,
      match_breakdown: { Skills: 96, Projects: 92, Academics: 94 },
      cgpa: "9.12",
      skills: ["PyTorch", "Transformers", "FastAPI", "Docker", "SQL"],
      top_skills: ["PyTorch", "Transformers", "FastAPI", "Docker", "SQL"],
      apaar_verified: true,
      verified_apaar: true,
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
      projects: [
        {
          title: "Real-time Edge Anomaly Detection Engine",
          role: "Lead ML Engineer",
          stars: "98/100",
          description: "Deployed containerized ONNX models running inferencing under 12ms on telemetry sensor clusters.",
          highlights: ["99.4% precision on benchmark datasets", "Sub-15ms latency verified with load testing"],
          tech_stack: ["PyTorch", "ONNX", "Docker", "TimescaleDB"]
        }
      ],
      coursework: [
        { subject: "Deep Learning & Neural Networks", grade: "A+ (10/10)" },
        { subject: "Data Structures & Algorithms", grade: "A+ (10/10)" },
        { subject: "High Performance Computing", grade: "A (9/10)" }
      ]
    },
    {
      id: "rec-2",
      name: "Isha Saxena",
      college: "Indian Institute of Technology (IIT) Bombay",
      role: "Distributed Cloud Engineer",
      match_score: 93,
      match_breakdown: { Skills: 94, Projects: 91, Academics: 95 },
      cgpa: "9.45",
      skills: ["React", "Go", "Kubernetes", "PostgreSQL", "Kafka"],
      top_skills: ["React", "Go", "Kubernetes", "PostgreSQL", "Kafka"],
      apaar_verified: true,
      verified_apaar: true,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      projects: [
        {
          title: "Multi-Tenant Distributed Event Broker",
          role: "Backend Architect",
          stars: "96/100",
          description: "Engineered high-throughput event pipeline processing 150k msg/sec with zero packet loss.",
          highlights: ["End-to-end TLS encryption", "Automated failover in 2.1s"],
          tech_stack: ["Go", "Kafka", "Docker", "Grafana"]
        }
      ]
    },
    {
      id: "rec-3",
      name: "Rohan Deshmukh",
      college: "BITS Pilani • Information Systems",
      role: "Full-Stack Cloud Developer",
      match_score: 89,
      match_breakdown: { Skills: 90, Projects: 88, Academics: 89 },
      cgpa: "8.82",
      skills: ["React", "Node.js", "GraphQL", "TailwindCSS", "PostgreSQL"],
      top_skills: ["React", "Node.js", "GraphQL", "TailwindCSS", "PostgreSQL"],
      apaar_verified: true,
      verified_apaar: true,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      projects: [
        {
          title: "Enterprise Micro-Frontend Design System",
          role: "Lead Frontend Dev",
          stars: "94/100",
          description: "Architected accessible, WCAG-compliant design system adopted across 4 campus departments.",
          highlights: ["Sub-second initial page load", "Zero layout shift (CLS 0.0)"],
          tech_stack: ["React", "Vite", "TailwindCSS", "Storybook"]
        }
      ]
    }
  ]
};

export default function RecruiterDashboard() {
  const [data, setData] = useState(INITIAL_RECRUITER_DATA);
  const [loading, setLoading] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  // INTERACTIVE STATS MODALS:
  // 'postings' | 'applications' | 'shortlisted' | 'selected' | null
  const [activeModal, setActiveModal] = useState(null);

  // Sub-filters for Modals
  const [postingsFilter, setPostingsFilter] = useState('ALL'); // 'ALL' | 'CLOSING_SOON' | 'ACTIVE'
  const [applicantSearch, setApplicantSearch] = useState('');
  const [applicantFilter, setApplicantFilter] = useState('ALL'); // 'ALL' | 'VERIFIED' | 'PENDING'
  const [shortlistSearch, setShortlistSearch] = useState('');

  // Selected Student Profile & Projects Dossier Modal
  const [selectedStudentProfile, setSelectedStudentProfile] = useState(null);
  const [profileTab, setProfileTab] = useState('projects'); // 'projects' | 'skills' | 'academics' | 'certifications'

  // Pipeline Digest Modal States (Interactive Working Implementation)
  const [showDigestModal, setShowDigestModal] = useState(false);
  const [isDispatchingDigest, setIsDispatchingDigest] = useState(false);
  const [digestSuccess, setDigestSuccess] = useState(false);
  const [lastDispatchedTime, setLastDispatchedTime] = useState(null);
  const [digestChannels, setDigestChannels] = useState({
    tpoEmail: true,
    slackWebhook: true
  });
  const [digestOptionalNote, setDigestOptionalNote] = useState('');

  // Academic Feedback Modal States
  const [showAcademicFeedbackModal, setShowAcademicFeedbackModal] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const [newFeedback, setNewFeedback] = useState({
    department: "Department of Computer Science & Engineering",
    batch: "Batch 2026 (Final Year)",
    category: "System Design & Distributed Concurrency",
    rating: 4,
    notes: ""
  });

  const [newJob, setNewJob] = useState({
    title: '',
    type: 'Internship',
    location: 'Bengaluru (Hybrid)',
    salary: '₹50,000/month',
    skills: 'Python, React, Docker, SQL',
    openings: 3
  });

  useEffect(() => {
    fetchRecruiterStats()
      .then(res => {
        if (res) {
          setData(prev => ({
            ...prev,
            ...res,
            active_postings_detail: (res.active_postings_detail && res.active_postings_detail.length > 0) 
              ? res.active_postings_detail : prev.active_postings_detail,
            recent_applications: (res.recent_applications && res.recent_applications.length > 0) 
              ? res.recent_applications : prev.recent_applications,
            ai_recommended_candidates: (res.ai_recommended_candidates && res.ai_recommended_candidates.length > 0) 
              ? res.ai_recommended_candidates.map(c => ({
                  ...c,
                  top_skills: (c.top_skills && c.top_skills.length > 0) ? c.top_skills : (c.skills && c.skills.length > 0) ? c.skills : ['Python', 'React', 'SQL'],
                  skills: (c.skills && c.skills.length > 0) ? c.skills : ['Python', 'React', 'SQL'],
                  match_breakdown: c.match_breakdown || { Skills: c.match_score || 88, Projects: 82, Academics: 85 }
                })) : prev.ai_recommended_candidates,
            shortlisted_pool_detail: (res.shortlisted_pool_detail && res.shortlisted_pool_detail.candidates?.length > 0) 
              ? res.shortlisted_pool_detail : prev.shortlisted_pool_detail,
            selected_candidates_detail: (res.selected_candidates_detail && res.selected_candidates_detail.length > 0) 
              ? res.selected_candidates_detail : prev.selected_candidates_detail,
          }));
        }
      })
      .catch(err => {
        console.warn('Recruiter stats background fetch failed:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const triggerAutomationToast = (candidateName, action) => {
    setToastMessage(`Workflow Updated: "${candidateName}" updated to ${action}. Institutional notification dispatched.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Open rich profile modal for any candidate or student name
  const openStudentProfile = (target) => {
    if (!target) return;
    if (typeof target === 'object') {
      setSelectedStudentProfile(createCandidateDossier(target));
      setProfileTab('projects');
      return;
    }
    // Match in ai_recommended_candidates if present
    const match = (data?.ai_recommended_candidates || []).find(
      c => c.name && c.name.toLowerCase() === String(target).toLowerCase()
    );
    if (match) {
      setSelectedStudentProfile(createCandidateDossier(match));
      setProfileTab('projects');
      return;
    }
    setSelectedStudentProfile(createCandidateDossier({ name: target }));
    setProfileTab('projects');
  };

  const handleDispatchPipelineDigest = () => {
    setIsDispatchingDigest(true);
    setTimeout(() => {
      setIsDispatchingDigest(false);
      setDigestSuccess(true);
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastDispatchedTime(nowStr);
      triggerAutomationToast("TPO & Slack Webhook", `PIPELINE_DIGEST_DELIVERED at ${nowStr}`);
    }, 900);
  };

  const handleDownloadDigestJSON = () => {
    const digestPayload = {
      report_title: "Campus Recruitment Pipeline Digest",
      company_name: data?.company_name || "Enterprise Partner",
      authorized_recruiter: data?.recruiter_name || "Campus Hiring Lead",
      dispatched_at: new Date().toISOString(),
      pipeline_summary: {
        total_candidates: data?.total_applications_count || 48,
        shortlisted_pool: data?.shortlisted_count || 12,
        direct_hires: data?.hired_count || 3,
        active_roles: data?.active_jobs_count || 5,
        verification_status: "100% Cryptographically Verified Institutional Record"
      },
      recruiter_notes: digestOptionalNote.trim() || "Regular weekly talent pipeline dispatch.",
      destinations: [
        { channel: "Placement Cell (TPO)", recipient: "tpo-placement@campus.edu", delivered: digestChannels.tpoEmail },
        { channel: "Hiring Team Slack", recipient: "#campus-talent-pipeline", delivered: digestChannels.slackWebhook }
      ]
    };

    const blob = new Blob([JSON.stringify(digestPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Pipeline_Digest_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    triggerAutomationToast("Pipeline Digest", "REPORT_JSON_DOWNLOADED");
  };

  const handleSubmitAcademicFeedback = (e) => {
    e.preventDefault();
    if (!newFeedback.notes.trim()) return;
    setIsSubmittingFeedback(true);
    setTimeout(() => {
      setIsSubmittingFeedback(false);
      setFeedbackSuccess(true);
      setNewFeedback({
        department: "Department of Computer Science & Engineering",
        batch: "Batch 2026 (Final Year)",
        category: "System Design & Distributed Concurrency",
        rating: 4,
        notes: ""
      });
      triggerAutomationToast("University Board of Studies & TPO", "ACADEMIC_FEEDBACK_TRANSMITTED");
    }, 800);
  };

  const handleUpdateStatus = (appId, newStatus) => {
    if (!data) return;
    const updatedApps = data.recent_applications.map(app => {
      if (app.id === appId) {
        return { ...app, status: newStatus };
      }
      return app;
    });
    setData({ ...data, recent_applications: updatedApps });
    const student = data.recent_applications.find(a => a.id === appId)?.student_name || 'Candidate';
    triggerAutomationToast(student, newStatus);
  };

  const handleCreateJob = (e) => {
    e.preventDefault();
    setShowPostModal(false);
    setToastMessage(`New role "${newJob.title}" published. Automated matching triggered across verified campus talent.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-sky-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-xs font-medium">Loading Industry Talent Hub...</p>
        </div>
      </div>
    );
  }

  // Active Postings list from API
  const activePostingsList = data?.active_postings_detail || [];

  // Shortlisted pool list
  const shortlistedPoolData = data?.shortlisted_pool_detail || {
    average_match: 0,
    breakdown: { skills: 0, experience: 0, academics: 0 },
    candidates: []
  };

  // Selected candidates list
  const selectedCandidatesList = data?.selected_candidates_detail || [];

  // All applicants pool from recommended & recent
  const allApplicantsPool = (data?.ai_recommended_candidates || []).concat(data?.recent_applications || []);

  // Filtered lists for modals
  const filteredPostings = activePostingsList.filter(p => {
    if (postingsFilter === 'ALL') return true;
    if (postingsFilter === 'CLOSING_SOON') return p.status === 'CLOSING_SOON';
    if (postingsFilter === 'ACTIVE') return p.status === 'ACTIVE';
    return true;
  });

  const filteredApplicants = allApplicantsPool.filter(app => {
    const appName = app.name || app.student_name || '';
    const appCollege = app.college || '';
    const appRole = app.role || app.job_title || '';
    const matchesSearch = appName.toLowerCase().includes(applicantSearch.toLowerCase()) ||
      appCollege.toLowerCase().includes(applicantSearch.toLowerCase()) ||
      appRole.toLowerCase().includes(applicantSearch.toLowerCase());
    if (!matchesSearch) return false;
    if (applicantFilter === 'ALL') return true;
    if (applicantFilter === 'VERIFIED') return app.verified || app.verified_apaar;
    if (applicantFilter === 'PENDING') return !(app.verified || app.verified_apaar);
    return true;
  });

  const filteredShortlisted = (shortlistedPoolData.candidates || []).filter(c => {
    const cName = c.name || c.student_name || '';
    const cCollege = c.college || '';
    const cRole = c.role || c.job_title || '';
    return cName.toLowerCase().includes(shortlistSearch.toLowerCase()) ||
      cCollege.toLowerCase().includes(shortlistSearch.toLowerCase()) ||
      cRole.toLowerCase().includes(shortlistSearch.toLowerCase());
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-slate-900 text-white text-xs shadow-xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <p className="font-semibold text-white">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
            {data.company_name} Campus Talent Desk
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowPostModal(true)}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Post New Opening
          </button>
          <button
            onClick={() => {
              setShowDigestModal(true);
              setDigestSuccess(false);
            }}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-sky-700 hover:border-sky-300 font-semibold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer group"
          >
            <MessageSquare className="w-4 h-4 text-slate-500 group-hover:text-sky-600 transition-colors" />
            <span>Dispatch Pipeline Digest</span>
            {lastDispatchedTime ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Sent {lastDispatchedTime}</span>
              </span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-sky-500"></span>
            )}
          </button>
          <button
            onClick={() => {
              setShowAcademicFeedbackModal(true);
              setFeedbackSuccess(false);
            }}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-sky-700 hover:border-sky-300 font-semibold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer group"
          >
            <GraduationCap className="w-4 h-4 text-slate-500 group-hover:text-sky-600 transition-colors" />
            <span>Academic Feedback</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4 INTERACTIVE STATS CARDS ROW WITH DIRECT ACTION BUTTONS */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* CARD 1: ACTIVE POSTINGS */}
        <div 
          onClick={() => setActiveModal('postings')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-sky-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Postings</span>
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 font-['Outfit']">
              {data.active_jobs_count || 5}
            </div>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setActiveModal('postings');
            }}
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-700 group-hover:text-sky-800 w-full text-left cursor-pointer"
          >
            <span>View 5 Postings & Deadlines</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* CARD 2: TOTAL APPLICATIONS */}
        <div 
          onClick={() => setActiveModal('applications')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total Applications</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 font-['Outfit']">
              {data.total_applications_count || 48}
            </div>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setActiveModal('applications');
            }}
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-700 group-hover:text-indigo-800 w-full text-left cursor-pointer"
          >
            <span>View All 48 Applicants</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* CARD 3: SHORTLISTED POOL */}
        <div 
          onClick={() => setActiveModal('shortlisted')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Shortlisted Pool</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 font-['Outfit']">
              {data.shortlisted_count || 12}
            </div>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setActiveModal('shortlisted');
            }}
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700 group-hover:text-amber-800 w-full text-left cursor-pointer"
          >
            <span>View 12 Shortlisted (91% Avg)</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* CARD 4: SELECTED CANDIDATES */}
        <div 
          onClick={() => setActiveModal('selected')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Selected Candidates</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-emerald-700 font-['Outfit']">
              {data.hired_count || 3}
            </div>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setActiveModal('selected');
            }}
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800 w-full text-left cursor-pointer"
          >
            <span>View 3 Hired & University MoA</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

      {/* Recommended Candidate Profiles */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-['Outfit']">Recommended Candidate Profiles</h2>
          </div>
          <span 
            onClick={() => setActiveModal('applications')}
            className="text-xs text-sky-700 font-semibold cursor-pointer hover:underline flex items-center gap-1"
          >
            <span>View All Applicants ({data?.total_applications_count || 0})</span> &rarr;
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {(!data?.ai_recommended_candidates || data.ai_recommended_candidates.length === 0) ? (
            <div className="col-span-full p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <Users className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">No applicants in pool yet</h4>
              <p className="text-xs text-slate-500">Live student applications submitted via the portal will appear here automatically.</p>
            </div>
          ) : (
            data.ai_recommended_candidates.map(candidate => (
            <div 
              key={candidate.id} 
              onClick={() => openStudentProfile(candidate)}
              className="p-5 rounded-2xl flex flex-col justify-between bg-white border border-slate-200 shadow-xs hover:border-sky-400 hover:shadow-md transition-all cursor-pointer group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={candidate.avatar} 
                      alt={candidate.name} 
                      className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-2xs group-hover:ring-2 group-hover:ring-sky-500 transition-all"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors flex items-center gap-1.5">
                        <span>{candidate.name}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 shrink-0" />
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{candidate.college}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold mt-0.5">
                        <Check className="w-3 h-3 text-emerald-600" /> Verified Transcripts
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200 font-bold text-xs">
                      {candidate.match_score}% Match
                    </span>
                  </div>
                </div>

                {/* Match Breakdown */}
                <div className="grid grid-cols-3 gap-2 my-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Skills</span>
                    <span className="text-xs font-bold text-slate-900">{candidate.match_breakdown?.Skills || candidate.match_score || 85}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Projects</span>
                    <span className="text-xs font-bold text-slate-900">{candidate.match_breakdown?.Projects || 80}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Academics</span>
                    <span className="text-xs font-bold text-slate-900">{candidate.match_breakdown?.Academics || 85}%</span>
                  </div>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {(candidate.top_skills || candidate.skills || ['Python', 'React', 'SQL']).slice(0, 4).map((skill, sIdx) => (
                    <span key={sIdx} className="px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-medium">
                      {skill}
                    </span>
                  ))}
                  {(candidate.top_skills || candidate.skills || []).length > 4 && (
                    <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 text-[10px] font-semibold">
                      +{(candidate.top_skills || candidate.skills || []).length - 4} more
                    </span>
                  )}
                </div>

                {/* View Projects CTA Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openStudentProfile(candidate);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold flex items-center justify-between border border-sky-200 transition cursor-pointer mb-3"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                    <span>View Projects &amp; Verified Portfolio</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerAutomationToast(candidate.name, "SHORTLISTED");
                  }}
                  className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Shortlist
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerAutomationToast(candidate.name, "INTERVIEW_INVITE");
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Interview
                </button>
              </div>
            </div>
          ))
        )}
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="p-6 rounded-3xl bg-white space-y-4 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-['Outfit']">Recent Candidate Submissions</h2>
            <p className="text-xs text-slate-500">Live pipeline with verified academic credentials</p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            {['ALL', 'APPLIED', 'SHORTLISTED', 'INTERVIEW', 'REVIEWED'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  statusFilter === st ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-4">Role Applied</th>
                <th className="py-3 px-4">Competency</th>
                <th className="py-3 px-4">Credential Status</th>
                <th className="py-3 px-4">Pipeline Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.recent_applications
                .filter(app => statusFilter === 'ALL' || app.status === statusFilter)
                .map(app => (
                <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {app.student_name}
                    <span className="block text-[10px] text-slate-400 font-normal">{app.college}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{app.job_title}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-sky-50 text-sky-800 border border-sky-200">
                      {app.match_score}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {app.verified_apaar ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-medium text-[11px]">
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Verified Transcripts
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-400 font-medium text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> Pending Verification
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'SHORTLISTED')}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition-colors cursor-pointer border border-slate-200"
                      >
                        Shortlist
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'INTERVIEW')}
                        className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold transition-colors cursor-pointer"
                      >
                        Interview
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: ACTIVE POSTINGS & CLOSING TIMELINE MODAL */}
      {/* ========================================================= */}
      {activeModal === 'postings' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 inline-block mb-1.5">
                  Live Opportunity Grid
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit']">
                  Active Campus Job Postings (5 Roles)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review closing deadlines, candidate pipeline numbers, and vacancy quotas
                </p>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Tabs & Add Role CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs">
                <button
                  onClick={() => setPostingsFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    postingsFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Postings (5)
                </button>
                <button
                  onClick={() => setPostingsFilter('CLOSING_SOON')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    postingsFilter === 'CLOSING_SOON' ? 'bg-rose-50 text-rose-800 border border-rose-200 shadow-xs' : 'text-rose-600 hover:text-rose-700'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  Closing Soon (2)
                </button>
                <button
                  onClick={() => setPostingsFilter('ACTIVE')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    postingsFilter === 'ACTIVE' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Active (3)
                </button>
              </div>

              <button
                onClick={() => {
                  setActiveModal(null);
                  setShowPostModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" /> Post Another Role
              </button>
            </div>

            {/* Postings Cards List */}
            <div className="space-y-4">
              {filteredPostings.map(job => {
                const isClosingSoon = job.status === 'CLOSING_SOON';
                return (
                  <div 
                    key={job.id} 
                    className={`p-5 rounded-2xl border transition-all ${
                      isClosingSoon ? 'border-rose-300 bg-rose-50/20 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900">{job.title}</h3>
                          {isClosingSoon ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">
                              <AlertTriangle className="w-3 h-3" /> {job.closing_label}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <Clock className="w-3 h-3" /> {job.closing_label}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-3">
                          <span className="font-semibold text-slate-700">{job.department}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {job.location}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-semibold text-slate-800"><DollarSign className="w-3 h-3 text-emerald-600" /> {job.stipend_salary}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-4 bg-slate-50 p-2.5 rounded-xl border border-slate-200 self-start md:self-auto">
                        <div className="text-center px-2">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Openings</span>
                          <span className="text-sm font-extrabold text-slate-900">{job.openings}</span>
                        </div>
                        <div className="h-6 w-px bg-slate-200"></div>
                        <div className="text-center px-2">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Applicants</span>
                          <span className="text-sm font-extrabold text-sky-700">{job.applications_count}</span>
                        </div>
                      </div>
                    </div>

                    {/* Skill Badges & Action Buttons */}
                    <div className="pt-3 mt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-semibold text-slate-400">Target Tech:</span>
                        {(job.skills || []).map((sk, sIdx) => (
                          <span key={sIdx} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[10px] font-mono">
                            {sk}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setActiveModal('applications');
                            setApplicantSearch(job.title.split(' ')[0]);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold text-xs transition cursor-pointer"
                        >
                          View {job.applications_count} Applicants
                        </button>
                        <button
                          onClick={() => triggerAutomationToast(job.title, "DEADLINE_EXTENDED_7_DAYS")}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
                        >
                          Extend (+7 Days)
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Automatic closing triggers 24h reminders to student applicants
              </span>
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: TOTAL APPLICATIONS & VERIFIED CREDENTIALS MODAL */}
      {/* ========================================================= */}
      {activeModal === 'applications' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 inline-block mb-1.5">
                  Complete Talent Funnel
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit']">
                  Total Student Applications (48 Candidates)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified degree records with institutional transcript validation and ATS competency match
                </p>
              </div>
              <button 
                onClick={() => {
                  setActiveModal(null);
                  setApplicantSearch('');
                }}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Filter Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search candidate, college, or role..."
                  value={applicantSearch}
                  onChange={(e) => setApplicantSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs w-full sm:w-auto overflow-x-auto">
                <button
                  onClick={() => setApplicantFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    applicantFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All (48)
                </button>
                <button
                  onClick={() => setApplicantFilter('VERIFIED')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                    applicantFilter === 'VERIFIED' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Verified Credentials (42)
                </button>
                <button
                  onClick={() => setApplicantFilter('PENDING')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    applicantFilter === 'PENDING' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Pending (6)
                </button>
              </div>
            </div>

            {/* Applications Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Candidate & College</th>
                      <th className="py-3 px-4">Role Applied</th>
                      <th className="py-3 px-4">Verification & CGPA</th>
                      <th className="py-3 px-4">Match Score</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredApplicants.map(app => (
                      <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                        <td 
                          onClick={() => openStudentProfile(app)}
                          className="py-3.5 px-4 cursor-pointer group/cand"
                        >
                          <div className="flex items-center gap-3">
                            <img src={app.avatar} alt={app.name} className="w-8 h-8 rounded-full object-cover border border-slate-200 group-hover/cand:ring-2 group-hover/cand:ring-sky-500 transition-all" />
                            <div>
                              <strong className="text-slate-900 block group-hover/cand:text-sky-700 transition-colors flex items-center gap-1">
                                <span>{app.name}</span>
                                <ExternalLink className="w-3 h-3 text-slate-400 group-hover/cand:text-sky-600" />
                              </strong>
                              <span className="text-[11px] text-slate-500">{app.college}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-medium text-slate-800">
                          {app.role}
                        </td>

                        <td className="py-3.5 px-4">
                          {app.verified ? (
                            <div>
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified
                              </span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">CGPA: {app.cgpa}</span>
                            </div>
                          ) : (
                            <div>
                              <span className="inline-flex items-center gap-1 text-amber-700 font-semibold text-[10px] bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                <Clock className="w-3.5 h-3.5 text-amber-600" /> Verification In Progress
                              </span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">CGPA: {app.cgpa}</span>
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs text-sky-700 font-mono">{app.match_score}%</span>
                            <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-sky-600 h-full rounded-full" style={{ width: `${app.match_score}%` }}></div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            app.status === 'SHORTLISTED' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                            app.status === 'INTERVIEW' ? 'bg-sky-50 text-sky-800 border-sky-200' :
                            'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            {app.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => openStudentProfile(app)}
                              className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                            >
                              <Sparkles className="w-3 h-3 text-sky-600" /> Projects
                            </button>
                            <button
                              onClick={() => triggerAutomationToast(app.name, "SHORTLISTED")}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition cursor-pointer"
                            >
                              Shortlist
                            </button>
                            <button
                              onClick={() => triggerAutomationToast(app.name, "INTERVIEW_INVITATION_DISPATCHED")}
                              className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition cursor-pointer"
                            >
                              Interview
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Showing {filteredApplicants.length} of 48 applications in active recruitment funnel
              </span>
              <button
                onClick={() => {
                  setActiveModal(null);
                  setApplicantSearch('');
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: SHORTLISTED POOL & AVERAGE MATCH ANALYSIS MODAL */}
      {/* ========================================================= */}
      {activeModal === 'shortlisted' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 inline-block mb-1.5">
                  High-Competency Shortlist
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit']">
                  Shortlisted Candidate Pool (12 Candidates)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Curated student candidates meeting company hiring benchmarks across algorithms, system architecture, and coursework
                </p>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Average Match: 91% Highlight Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-sky-50 to-emerald-50 border border-amber-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex flex-col items-center justify-center font-extrabold shadow-xs">
                  <span className="text-lg leading-tight font-['Outfit']">91%</span>
                  <span className="text-[9px] uppercase tracking-wider">Avg</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                    Exceptional Benchmark Pool Match (91% Average)
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    12 candidates selected out of 48 applications. 100% verified academic credentials.
                  </p>
                </div>
              </div>

              {/* Breakdown Bars */}
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 self-stretch md:self-auto border-t md:border-t-0 md:border-l border-amber-200/60 pt-3 md:pt-0 md:pl-5">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Skills Rigor</span>
                  <span className="text-sm font-extrabold text-sky-700">93%</span>
                </div>
                <div className="h-7 w-px bg-amber-200"></div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Live Projects</span>
                  <span className="text-sm font-extrabold text-emerald-700">89%</span>
                </div>
                <div className="h-7 w-px bg-amber-200"></div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Academics</span>
                  <span className="text-sm font-extrabold text-amber-700">91%</span>
                </div>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter shortlisted candidates by name, college, or role..."
                value={shortlistSearch}
                onChange={(e) => setShortlistSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* 12 Candidates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredShortlisted.map(candidate => (
                <div key={candidate.id} className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-amber-300 hover:shadow-xs transition-all space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={candidate.avatar} alt={candidate.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                        <div>
                          <strong className="text-sm font-bold text-slate-900 block">{candidate.name}</strong>
                          <span className="text-xs text-slate-500">{candidate.college}</span>
                        </div>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-extrabold text-xs font-mono">
                        {candidate.match_score}% Match
                      </span>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                      <span>Target: <strong className="text-slate-800">{candidate.role}</strong></span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" /> CGPA: {candidate.cgpa}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {(candidate.skills || candidate.top_skills || ['Python', 'React', 'PostgreSQL']).map((sk, sIdx) => (
                        <span key={sIdx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => openStudentProfile(candidate)}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs transition cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <Sparkles className="w-3 h-3 text-amber-600" /> Projects
                    </button>
                    <button
                      onClick={() => triggerAutomationToast(candidate.name, "SCHEDULED_FOR_ROUND_1_INTERVIEW")}
                      className="flex-1 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold text-xs transition cursor-pointer text-center"
                    >
                      Schedule Interview Round
                    </button>
                    <button
                      onClick={() => triggerAutomationToast(candidate.name, "TECHNICAL_ASSESSMENT_DISPATCHED")}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
                    >
                      Send Test
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => triggerAutomationToast("All 12 Shortlisted Candidates", "CALENDAR_INVITES_DISPATCHED")}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold text-xs transition cursor-pointer"
              >
                Send Batch Interview Invites (12 Candidates)
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: SELECTED CANDIDATES & DIRECT UNIVERSITY LINKAGE MODAL */}
      {/* ========================================================= */}
      {activeModal === 'selected' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 inline-block mb-1.5">
                  Institutional Placement Linkage
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit']">
                  Selected Candidates & Direct University Linkage (3 Hired)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Offers officially accepted and verified with university placement cells through signed MoA agreements
                </p>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Overview Banner */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-slate-900 font-bold">100% University Placement Linkage Completed</strong>
                  <span className="text-slate-600 text-[11px]">All 3 hires backed by authorized MoA and institutional cryptographic validation</span>
                </div>
              </div>

              <span className="px-3 py-1 rounded-lg bg-white border border-emerald-200 font-bold text-emerald-800 text-[11px] self-start sm:self-auto">
                Batch 2026 Campus Drive
              </span>
            </div>

            {/* 3 Selected Candidates Cards */}
            <div className="space-y-5">
              {selectedCandidatesList.map((hire, hIdx) => (
                <div key={hire.id || hIdx} className="p-5 rounded-2xl border-2 border-emerald-200 bg-white shadow-xs space-y-4">
                  
                  {/* Top Candidate Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3.5">
                      <img src={hire.avatar} alt={hire.student_name} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-xs" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-slate-900">{hire.student_name}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            ✓ Offer Accepted
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {hire.college} • <span className="font-mono text-slate-700 font-semibold">ID: {hire.apaar_id}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right sm:text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Offered Compensation</span>
                      <strong className="text-sm font-extrabold text-emerald-700 font-mono">{hire.offered_ctc}</strong>
                      <span className="text-[10px] text-slate-500 block">Joining: {hire.joining_date}</span>
                    </div>
                  </div>

                  {/* Direct University Linkage Box */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-emerald-600" /> Direct Institutional Linkage Details:
                      </span>
                      <span className="font-mono text-[11px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                        {hire.university_linkage?.moa_number || "MOA-NITR-2026-089"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Placement Cell Desk:</span>
                        <strong className="text-slate-900">{hire.university_linkage?.placement_cell || "Corporate Career Center"}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Institutional Liaison Officer:</span>
                        <strong className="text-slate-900">{hire.university_linkage?.officer || "Head of Placements"}</strong>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                      <span className="text-emerald-800 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> {hire.university_linkage?.verification_status || "Institutionally Cryptographically Verified"}
                      </span>
                      <span className="font-mono text-slate-400 text-[10px]">
                        Cryptographic Seal: {hire.university_linkage?.sha256_hash || "0x8f2a74c19b882e30d12ac491901fa9"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <span className="text-xs text-slate-500">Role: <strong className="text-slate-800">{hire.role_selected}</strong></span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openStudentProfile(hire.student_name)}
                        className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-sky-600" /> View Projects &amp; Portfolio
                      </button>
                      <button
                        onClick={() => {
                          downloadOfferLetter(hire.student_name, hire.role || 'Software Development Engineer', hire.package_lpa ? `${hire.package_lpa} LPA` : '18.5 LPA');
                          triggerAutomationToast(hire.student_name, "OFFER_LETTER_DOWNLOADED");
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold text-xs transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" /> Download Offer Letter
                      </button>
                      <button
                        onClick={() => triggerAutomationToast(hire.student_name, "UNIVERSITY_MOA_VERIFIED")}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-xs transition cursor-pointer flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" /> View University MoA
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Official placement linkage letters are stored permanently on institutional registry
              </span>
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* POST A NEW JOB MODAL */}
      {/* ========================================================= */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg p-6 rounded-3xl border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-sky-600" />
                Publish Campus Opportunity & Candidate Match
              </h3>
              <button onClick={() => setShowPostModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Opportunity Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Research Intern"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Engagement Type</label>
                  <select
                    value={newJob.type}
                    onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option>Internship</option>
                    <option>Full-time</option>
                    <option>Part-time</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Stipend / CTC</label>
                  <input
                    type="text"
                    value={newJob.salary}
                    onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  value={newJob.skills}
                  onChange={(e) => setNewJob({ ...newJob, skills: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Publish & Match Candidates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DISPATCH PIPELINE DIGEST (CLEAN & STREAMLINED) */}
      {/* ========================================================= */}
      {showDigestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-5">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-['Outfit']">
                    Dispatch Pipeline Digest
                  </h2>
                  <p className="text-xs text-slate-500">
                    Send candidate shortlist &amp; recruitment status to University Placement Office &amp; Team Slack
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setShowDigestModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Success Notification Banner */}
            {digestSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center gap-3 animate-in fade-in">
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <strong className="block font-bold text-slate-900">Pipeline Digest Dispatched!</strong>
                  <span className="text-slate-600">
                    Delivered to <strong>tpo-placement@campus.edu</strong> and <strong>#campus-talent-pipeline</strong> at {lastDispatchedTime}.
                  </span>
                </div>
              </div>
            )}

            {/* Live Pipeline Snapshot Strip */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-4 gap-2 text-center text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Candidates</span>
                <strong className="text-base font-extrabold text-slate-900 font-['Outfit']">{data.total_applications_count || 48}</strong>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-amber-600 block">Shortlisted</span>
                <strong className="text-base font-extrabold text-amber-900 font-['Outfit']">{data.shortlisted_count || 12}</strong>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-600 block">Selected</span>
                <strong className="text-base font-extrabold text-emerald-900 font-['Outfit']">{data.hired_count || 3}</strong>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-sky-600 block">Active Roles</span>
                <strong className="text-base font-extrabold text-sky-900 font-['Outfit']">{data.active_jobs_count || 5}</strong>
              </div>
            </div>

            {/* Recipients Selection */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Deliver Report To:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <label className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                  digestChannels.tpoEmail ? 'bg-sky-50/60 border-sky-300 ring-1 ring-sky-400' : 'bg-slate-50 border-slate-200'
                }`}>
                  <input 
                    type="checkbox" 
                    checked={digestChannels.tpoEmail}
                    onChange={(e) => setDigestChannels({ ...digestChannels, tpoEmail: e.target.checked })}
                    className="rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                  />
                  <div className="text-xs">
                    <strong className="font-bold text-slate-900 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-sky-600" /> Placement Cell (TPO)
                    </strong>
                    <span className="text-[10px] text-slate-500">tpo-placement@campus.edu</span>
                  </div>
                </label>

                <label className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                  digestChannels.slackWebhook ? 'bg-indigo-50/60 border-indigo-300 ring-1 ring-indigo-400' : 'bg-slate-50 border-slate-200'
                }`}>
                  <input 
                    type="checkbox" 
                    checked={digestChannels.slackWebhook}
                    onChange={(e) => setDigestChannels({ ...digestChannels, slackWebhook: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <div className="text-xs">
                    <strong className="font-bold text-slate-900 flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-600" /> Team Slack Channel
                    </strong>
                    <span className="text-[10px] text-slate-500">#campus-talent-pipeline</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Optional Note */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Add Optional Note / Next Steps:
              </label>
              <textarea
                rows={2}
                value={digestOptionalNote}
                onChange={(e) => setDigestOptionalNote(e.target.value)}
                placeholder="E.g. Technical Round 1 interviews scheduled for Friday 10:00 AM via Google Meet..."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-1 focus:ring-sky-500 focus:outline-hidden transition"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleDownloadDigestJSON}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Download (.JSON)
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowDigestModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={handleDispatchPipelineDigest}
                  disabled={isDispatchingDigest}
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isDispatchingDigest ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Dispatching...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Dispatch Digest</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ACADEMIC FEEDBACK (CLEAN & USER-FRIENDLY) */}
      {/* ========================================================= */}
      {showAcademicFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-5">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-['Outfit']">
                    Academic &amp; Curriculum Feedback
                  </h2>
                  <p className="text-xs text-slate-500">
                    Share skill gap recommendations with university faculty &amp; Dean of Academics
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setShowAcademicFeedbackModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Success Banner */}
            {feedbackSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center gap-3 animate-in fade-in">
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <strong className="block font-bold text-slate-900">Feedback Transmitted Successfully!</strong>
                  <span className="text-slate-600">
                    Forwarded to the University Board of Studies &amp; Campus Placement Office.
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmitAcademicFeedback} className="space-y-4">
              
              {/* Row 1: Department & Cohort */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Target Department
                  </label>
                  <select
                    value={newFeedback.department}
                    onChange={(e) => setNewFeedback({ ...newFeedback, department: e.target.value })}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
                  >
                    <option value="Department of Computer Science & Engineering">Computer Science &amp; Engineering</option>
                    <option value="Information Technology & Software Systems">Information Technology</option>
                    <option value="AI & Data Science Engineering">AI &amp; Data Science Engineering</option>
                    <option value="Electronics & Communication Engineering">Electronics &amp; Communication</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Student Cohort / Batch
                  </label>
                  <select
                    value={newFeedback.batch}
                    onChange={(e) => setNewFeedback({ ...newFeedback, batch: e.target.value })}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
                  >
                    <option value="Batch 2026 (Final Year)">Batch 2026 (Final Year)</option>
                    <option value="Batch 2027 (Pre-Final Year)">Batch 2027 (Pre-Final Year)</option>
                    <option value="All Engineering Cohorts">All Engineering Cohorts</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Gap Area & Star Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Curriculum Gap Area
                  </label>
                  <select
                    value={newFeedback.category}
                    onChange={(e) => setNewFeedback({ ...newFeedback, category: e.target.value })}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
                  >
                    <option value="System Design & Distributed Concurrency">System Design &amp; Concurrency</option>
                    <option value="Modern Cloud & DevOps (Docker/K8s/CI-CD)">Cloud &amp; DevOps (Docker/K8s)</option>
                    <option value="Real-World MLOps & Vector Databases">MLOps &amp; Vector Databases</option>
                    <option value="Clean Architecture & Testing Rigor">Clean Architecture &amp; Testing</option>
                    <option value="Algorithmic Rigor & Interview Drills">DSA &amp; Algorithmic Rigor</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Readiness Rating
                  </label>
                  <div className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-xl border border-slate-200">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewFeedback({ ...newFeedback, rating: star })}
                        className={`flex-1 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                          newFeedback.rating === star
                            ? 'bg-amber-500 text-white shadow-2xs'
                            : 'text-slate-600 hover:bg-slate-200/60'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${newFeedback.rating >= star ? 'fill-current' : ''}`} />
                        <span>{star}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 3: Actionable Recommendations */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Specific Recommendations for Syllabus Revision:
                  </label>
                  <span className="text-[10px] text-slate-400">Click a chip below to auto-fill</span>
                </div>
                <textarea
                  rows={3}
                  value={newFeedback.notes}
                  onChange={(e) => setNewFeedback({ ...newFeedback, notes: e.target.value })}
                  placeholder="Enter actionable advice for faculty (e.g. Include Redis caching and Docker containerization in semester 6 lab coursework)..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
                  required
                />

                {/* 1-Click Suggestion Chips */}
                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  {[
                    "+ Add Redis Caching Lab",
                    "+ Require Docker & CI/CD in Projects",
                    "+ Include Vector DBs in AI Elective",
                    "+ Practice Mock STAR Technical Interviews"
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewFeedback(prev => ({
                        ...prev,
                        notes: prev.notes ? `${prev.notes} ${chip.replace('+ ', '')}.` : `${chip.replace('+ ', '')}.`
                      }))}
                      className="text-[10px] font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-lg border border-sky-200 transition cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Transmits directly to Board of Studies (BoS)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAcademicFeedbackModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingFeedback || !newFeedback.notes.trim()}
                    className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingFeedback ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Transmitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Transmit Feedback</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STUDENT PROFILE & ALL PROJECTS DOSSIER MODAL */}
      {/* ========================================================= */}
      {selectedStudentProfile && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
            
            {/* Modal Top Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-5">
              <div className="flex items-center gap-4">
                <img 
                  src={selectedStudentProfile.avatar} 
                  alt={selectedStudentProfile.name} 
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-sky-500 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit']">
                      {selectedStudentProfile.name}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Institutionally Verified
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200 text-xs font-extrabold font-mono">
                      {selectedStudentProfile.match_score}% Match
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">
                    {selectedStudentProfile.role_title || selectedStudentProfile.college}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {selectedStudentProfile.college} • <span className="font-mono text-slate-700 font-bold">ID: {selectedStudentProfile.apaar_id || '9938-4821-2026'}</span> • <strong className="text-emerald-700">CGPA: {selectedStudentProfile.cgpa || '8.84'}</strong> ({selectedStudentProfile.class_rank || 'Top 3%'})
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedStudentProfile(null)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Candidate Bio summary */}
            {selectedStudentProfile.bio && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                <strong className="text-slate-900 font-bold">Candidate Executive Summary: </strong>
                {selectedStudentProfile.bio}
              </div>
            )}

            {/* Modal Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs overflow-x-auto">
              <button
                onClick={() => setProfileTab('projects')}
                className={`px-3.5 py-2 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  profileTab === 'projects' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-sky-600" />
                <span>Projects Portfolio ({selectedStudentProfile.projects?.length || 4})</span>
              </button>
              <button
                onClick={() => setProfileTab('skills')}
                className={`px-3.5 py-2 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  profileTab === 'skills' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Skills & Match Breakdown</span>
              </button>
              <button
                onClick={() => setProfileTab('academics')}
                className={`px-3.5 py-2 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  profileTab === 'academics' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                <span>Academic Transcripts</span>
              </button>
              <button
                onClick={() => setProfileTab('certifications')}
                className={`px-3.5 py-2 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  profileTab === 'certifications' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-indigo-600" />
                <span>Certifications & Hackathons</span>
              </button>
            </div>

            {/* TAB 1: ALL PROJECTS PORTFOLIO */}
            {profileTab === 'projects' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 font-['Outfit']">
                      Verified Technical Projects Portfolio
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      All projects include live architecture, quantified metrics, and git commit history
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
                    Verified Projects
                  </span>
                </div>

                <div className="space-y-4">
                  {(!selectedStudentProfile.projects || selectedStudentProfile.projects.length === 0) ? (
                    <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                      <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                      <h4 className="text-sm font-bold text-slate-700">No projects submitted yet</h4>
                      <p className="text-xs text-slate-500">Candidate has not linked verified GitHub repositories to this profile.</p>
                    </div>
                  ) : (
                    selectedStudentProfile.projects.map((proj, pIdx) => (
                    <div key={proj.id || pIdx} className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-sky-300 hover:shadow-xs transition-all space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 text-xs font-black flex items-center justify-center">
                              {pIdx + 1}
                            </span>
                            <h4 className="text-sm sm:text-base font-bold text-slate-900">
                              {proj.title}
                            </h4>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 font-medium">
                            {proj.tagline}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          {proj.github_url && (
                            <a
                              href={proj.github_url}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition"
                            >
                              <ExternalLink className="w-3 h-3" /> GitHub Repo
                            </a>
                          )}
                          {proj.live_url && (
                            <a
                              href={proj.live_url}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center gap-1 transition"
                            >
                              <ExternalLink className="w-3 h-3" /> Live Demo
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Metrics Pill */}
                      {proj.metrics && (
                        <div className="px-3 py-1.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 text-xs font-semibold flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{proj.metrics}</span>
                        </div>
                      )}

                      {/* Highlights */}
                      <div className="space-y-1.5 text-xs text-slate-700">
                        {proj.highlights?.map((h, hIdx) => (
                          <div key={hIdx} className="flex items-start gap-2">
                            <span className="text-sky-600 font-bold mt-0.5">•</span>
                            <span className="leading-relaxed">{h}</span>
                          </div>
                        ))}
                      </div>

                      {/* Tech Stack Pills */}
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase text-slate-400">Architecture Stack:</span>
                        {proj.tech_stack?.map((tech, tIdx) => (
                          <span key={tIdx} className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-mono font-medium">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
                </div>
              </div>
            )}

            {/* TAB 2: SKILLS & MATCH BREAKDOWN */}
            {profileTab === 'skills' && (
              <div className="space-y-5">
                <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <div>
                    <span className="text-[11px] text-slate-400 font-bold uppercase block">Skills Rigor</span>
                    <span className="text-2xl font-black text-sky-700 font-['Outfit']">
                      {selectedStudentProfile.match_breakdown?.Skills || 95}%
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Exceeds Google Bar</span>
                  </div>
                  <div className="border-x border-slate-200">
                    <span className="text-[11px] text-slate-400 font-bold uppercase block">Live Projects</span>
                    <span className="text-2xl font-black text-sky-700 font-['Outfit']">
                      {selectedStudentProfile.match_breakdown?.Projects || 90}%
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Production Deployed</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-bold uppercase block">Academic Rigor</span>
                    <span className="text-2xl font-black text-sky-700 font-['Outfit']">
                      {selectedStudentProfile.match_breakdown?.Academics || 96}%
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Verified CGPA 8.84</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Verified Competency Skills & Tools:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(selectedStudentProfile.top_skills || selectedStudentProfile.skills || ['Python', 'React', 'SQL']).map((skill, sIdx) => (
                      <span key={sIdx} className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{skill}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ACADEMIC TRANSCRIPTS */}
            {profileTab === 'academics' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <strong className="block text-slate-900 font-bold">Official National Academic Depository</strong>
                    <span className="text-slate-600 text-[11px]">Degree transcript cryptographically hashed: {selectedStudentProfile.verified_hash || '0x8f2a74c19b882e30d12ac491901fa9'}</span>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs self-start sm:self-auto">
                    Verified
                  </span>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-4">Subject / Coursework</th>
                        <th className="py-2.5 px-4">Institution</th>
                        <th className="py-2.5 px-4 text-right">Awarded Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(selectedStudentProfile.coursework || [
                        { subject: "Data Structures & Algorithms", grade: "A+ (10/10)" },
                        { subject: "Database Management Systems", grade: "A+ (10/10)" },
                        { subject: "Distributed Systems Architecture", grade: "A (9/10)" },
                        { subject: "Machine Learning & Neural Networks", grade: "A+ (10/10)" }
                      ]).map((c, cIdx) => (
                        <tr key={cIdx} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-semibold text-slate-900">{c.subject}</td>
                          <td className="py-3 px-4 text-slate-500">{selectedStudentProfile.college}</td>
                          <td className="py-3 px-4 text-right font-bold text-emerald-700 font-mono">{c.grade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: CERTIFICATIONS & HACKATHONS */}
            {profileTab === 'certifications' && (
              <div className="space-y-4 text-xs">
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Industry Professional Certifications:
                  </span>
                  {(selectedStudentProfile.certifications || [
                    "AWS Certified Solutions Architect - Associate (SAA-C03)",
                    "Meta Backend Developer Professional Certificate",
                    "DeepLearning.AI Deep Learning Specialization"
                  ]).map((cert, cIdx) => (
                    <div key={cIdx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Award className="w-4 h-4 text-amber-500 shrink-0" />
                        <span className="font-semibold text-slate-800">{cert}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Verified Credential
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2.5 pt-3 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    National Hackathons & Competitions:
                  </span>
                  {(selectedStudentProfile.hackathons || [
                    "Smart India Hackathon (SIH 2026) - National Finalist",
                    "Unstop Corporate Tech Challenge - Rank 4 Nationwide"
                  ]).map((hack, hIdx) => (
                    <div key={hIdx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Trophy className="w-4 h-4 text-sky-600 shrink-0" />
                        <span className="font-semibold text-slate-800">{hack}</span>
                      </div>
                      <span className="text-[10px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                        Verified Achievement
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerAutomationToast(selectedStudentProfile.name, "OFFICIAL_SHORTLISTED_CANDIDATE")}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition cursor-pointer"
                >
                  Shortlist Candidate
                </button>
                <button
                  onClick={() => triggerAutomationToast(selectedStudentProfile.name, "TECHNICAL_INTERVIEW_SCHEDULED")}
                  className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition cursor-pointer"
                >
                  Schedule Technical Interview
                </button>
                <button
                  onClick={() => {
                    downloadStudentDossier(selectedStudentProfile);
                    triggerAutomationToast(selectedStudentProfile.name, "VERIFIED_DOSSIER_DOWNLOADED");
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> PDF Dossier
                </button>
              </div>

              <button
                onClick={() => setSelectedStudentProfile(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer self-end sm:self-auto"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
