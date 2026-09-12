import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Sparkles, 
  RefreshCw, 
  Check, 
  Copy, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  ShieldCheck, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Code2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Palette, 
  Type, 
  Sliders, 
  Eye, 
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  FileCheck2,
  Layers,
  HelpCircle,
  FolderSync
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { downloadElementAsPdf } from '../../utils/downloadUtils';
import { getStudentBasicInfo } from '../../utils/studentInfoSync';


const LinkedInIcon = ({ className = "w-3 h-3" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.65 1.65 0 0 0-1.66 1.66 1.65 1.65 0 0 0 1.66 1.66 1.66 1.66 0 0 0 1.66-1.66 1.65 1.65 0 0 0-1.66-1.66Z"/>
  </svg>
);

const GitHubIcon = ({ className = "w-3 h-3" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

// Pre-built sample presets for instant starting
const PRESET_PROFILES = {
  fullstack: {
    label: "Full Stack Engineer",
    role: "Full Stack Developer",
    personalInfo: {
      fullName: "Arjun Sharma",
      headline: "Full Stack Developer | Distributed Systems & Web Architectures",
      email: "arjun.sharma.tech@gmail.com",
      phone: "+91 98765 43210",
      location: "Bengaluru, Karnataka, India",
      linkedin: "https://linkedin.com/in/arjunsharma-dev",
      github: "https://github.com/arjunsharma-code",
      portfolio: "https://arjunsharma.dev"
    },
    summary: "Forward-thinking Full Stack Software Engineer with expertise in building responsive React applications, resilient Django REST microservices, and PostgreSQL database architectures. Proven experience optimizing query latency by 45% and implementing secure JWT/OAuth authentication pipelines.",
    education: [
      {
        id: 1,
        institution: "National Institute of Technology (NIT)",
        degree: "Bachelor of Technology (B.Tech)",
        field: "Computer Science & Engineering",
        cgpa: "8.84 / 10.0",
        year: "2022 - 2026",
        location: "Trichy, India",
        honors: "Dean's Merit Scholar • First Class with Distinction"
      }
    ],
    skills: {
      languages: ["Python", "JavaScript (ES6+)", "TypeScript", "SQL", "C++", "HTML5/CSS3"],
      frameworks: ["React 19", "Node.js", "Django REST Framework", "Next.js", "Tailwind CSS", "Express.js"],
      tools: ["PostgreSQL", "Docker", "Redis", "Git & GitHub", "Linux", "AWS (EC2/S3)", "Postman", "Vite"],
      softSkills: ["Agile/Scrum", "System Architecture", "Cross-Functional Collaboration", "Problem Solving"]
    },
    experience: [
      {
        id: 1,
        title: "Software Engineering Intern",
        company: "HyperScale Cloud Systems",
        location: "Bengaluru, India (Hybrid)",
        startDate: "May 2025",
        endDate: "July 2025",
        current: false,
        bullets: [
          "Engineered high-throughput RESTful endpoints using Django and PostgreSQL, supporting 50,000+ daily requests.",
          "Refactored state management in React 19 web portal, reducing client bundle size by 32% and initial load time by 400ms.",
          "Integrated Redis caching layer for frequent database read queries, lowering p99 response latency from 180ms to 24ms."
        ]
      }
    ],
    projects: [
      {
        id: 1,
        name: "AcademicX - Institutional Credential & Placement Grid",
        techStack: "React 19, Django, PostgreSQL, Docker, Tailwind CSS",
        demoUrl: "https://academicx.network",
        githubUrl: "https://github.com/arjunsharma/academicx-grid",
        description: "Unified higher education placement platform replacing unverified resumes with verifiable academic records.",
        bullets: [
          "Developed end-to-end vector-based semantic ATS candidate matching matching student profiles to corporate job requisites.",
          "Implemented role-based dashboard for students, university faculty, and recruiters with audit-logged transcript access.",
          "Constructed automated PDF generation and cryptographic verification hashes for tamper-proof digital credentials."
        ]
      },
      {
        id: 2,
        name: "Low-Latency Distributed Task Orchestrator",
        techStack: "Python, Redis, Celery, Docker, FastAPI",
        demoUrl: "",
        githubUrl: "https://github.com/arjunsharma/task-orchestrator",
        description: "Asynchronous task scheduler handling priority job queues with automatic worker heartbeat failover.",
        bullets: [
          "Designed distributed lock mechanism preventing race conditions under 10,000 concurrent synthetic worker tasks.",
          "Configured Prometheus & Grafana telemetry dashboards to visualize task queue lag and worker memory pressure."
        ]
      }
    ],
    certifications: [
      {
        id: 1,
        name: "AWS Certified Cloud Practitioner",
        issuer: "Amazon Web Services (AWS)",
        date: "2025",
        credentialId: "AWS-CCP-984129"
      },
      {
        id: 2,
        name: "Meta Certified Frontend Developer",
        issuer: "Coursera / Meta",
        date: "2024",
        credentialId: "META-FE-77123"
      }
    ]
  },

  aiml: {
    label: "AI / ML Engineer",
    role: "AI/ML Engineer",
    personalInfo: {
      fullName: "Priya Nair",
      headline: "AI & Machine Learning Engineer | Deep Learning, NLP & RAG Architectures",
      email: "priya.nair.ai@gmail.com",
      phone: "+91 91234 56789",
      location: "Hyderabad, Telangana, India",
      linkedin: "https://linkedin.com/in/priyanair-ai",
      github: "https://github.com/priyanair-ml",
      portfolio: "https://priyanair.ai"
    },
    summary: "Passionate AI/ML Engineer experienced in training deep neural architectures, fine-tuning open LLMs, and building high-throughput Retrieval-Augmented Generation (RAG) pipelines. Proficient in PyTorch, Hugging Face, sentence-transformers, and low-latency vector databases.",
    education: [
      {
        id: 1,
        institution: "Indian Institute of Information Technology (IIIT)",
        degree: "B.Tech in Artificial Intelligence & Data Science",
        field: "Artificial Intelligence",
        cgpa: "9.12 / 10.0",
        year: "2022 - 2026",
        location: "Hyderabad, India",
        honors: "AI Research Fellowship Recipient"
      }
    ],
    skills: {
      languages: ["Python", "C++", "SQL", "R", "Bash"],
      frameworks: ["PyTorch", "Hugging Face Transformers", "FastAPI", "Scikit-Learn", "LangChain", "LlamaIndex"],
      tools: ["Pinecone / Qdrant", "Docker", "Weights & Biases", "CUDA", "Git", "NumPy & Pandas", "OpenCV"],
      softSkills: ["Scientific Research", "Data Intuition", "Technical Writing", "Algorithmic Analysis"]
    },
    experience: [
      {
        id: 1,
        title: "Machine Learning Research Intern",
        company: "Applied AI Research Labs",
        location: "Hyderabad, India",
        startDate: "January 2025",
        endDate: "Present",
        current: true,
        bullets: [
          "Fine-tuned 7B parameter open-weight models using LoRA and QLoRA on domain-specific academic legal corpora.",
          "Engineered hybrid dense-sparse vector retrieval system yielding a 22% improvement in Mean Reciprocal Rank (MRR@10).",
          "Accelerated model inference throughput by 3.5x using vLLM and 4-bit AWQ quantization on NVIDIA RTX A6000 GPUs."
        ]
      }
    ],
    projects: [
      {
        id: 1,
        name: "Enterprise Multi-Modal RAG Document Assistant",
        techStack: "PyTorch, FastAPI, Qdrant Vector DB, Llama-3, Docker",
        demoUrl: "https://rag-assistant-demo.ai",
        githubUrl: "https://github.com/priyanair/multimodal-rag",
        description: "Retrieval engine for technical whitepapers and PDF diagrams with citation attribution.",
        bullets: [
          "Implemented semantic chunking strategy with dynamic overlap, preserving mathematical formulas and tabular context.",
          "Evaluated response faithfulness with Ragas metrics, reaching 94.2% factual precision on 1,000 ground truth queries."
        ]
      },
      {
        id: 2,
        name: "Real-Time Audio Spectrogram Emotion Classifier",
        techStack: "PyTorch, Librosa, ResNet-50, Streamlit",
        demoUrl: "",
        githubUrl: "https://github.com/priyanair/speech-emotion",
        description: "Deep convolutional model classifying acoustic speech emotions with sub-50ms latency.",
        bullets: [
          "Trained 2D spectrogram CNN on RAVDESS dataset with data augmentation, reaching 88.6% top-1 accuracy."
        ]
      }
    ],
    certifications: [
      {
        id: 1,
        name: "Deep Learning Specialization",
        issuer: "DeepLearning.AI / Andrew Ng",
        date: "2024",
        credentialId: "DLAI-DL-88319"
      }
    ]
  },

  devops: {
    label: "Cloud & DevOps Engineer",
    role: "Cloud/DevOps Engineer",
    personalInfo: {
      fullName: "Rohan Varma",
      headline: "Cloud & DevOps Engineer | Kubernetes, Terraform, CI/CD & Site Reliability",
      email: "rohan.varma.cloud@gmail.com",
      phone: "+91 97654 32109",
      location: "Pune, Maharashtra, India",
      linkedin: "https://linkedin.com/in/rohanvarma-devops",
      github: "https://github.com/rohanvarma-infra",
      portfolio: "https://rohanvarma.cloud"
    },
    summary: "Reliability-focused DevOps Engineer with hands-on proficiency in containerization, infrastructure as code (Terraform), Kubernetes cluster management, and automated GitHub Actions CI/CD pipelines. Dedicated to zero-downtime deployments and resilient cloud architectures.",
    education: [
      {
        id: 1,
        institution: "Pune Institute of Computer Technology (PICT)",
        degree: "Bachelor of Engineering (B.E.)",
        field: "Information Technology",
        cgpa: "8.70 / 10.0",
        year: "2022 - 2026",
        location: "Pune, India",
        honors: "Head of Campus Linux Users Group"
      }
    ],
    skills: {
      languages: ["Bash / Shell", "Python", "Go (Golang)", "YAML", "SQL"],
      frameworks: ["Docker", "Kubernetes (K8s)", "Helm", "Terraform", "Ansible"],
      tools: ["AWS (EKS, VPC, IAM)", "GitHub Actions", "Prometheus & Grafana", "Nginx", "Linux Kernel", "ArgoCD"],
      softSkills: ["Incident Management", "Security Best Practices", "Infrastructure Planning", "Root Cause Analysis"]
    },
    experience: [
      {
        id: 1,
        title: "Cloud Operations Intern",
        company: "KubeScale Technologies",
        location: "Pune, India",
        startDate: "June 2025",
        endDate: "August 2025",
        current: false,
        bullets: [
          "Provisioned multi-AZ AWS infrastructure using modular Terraform templates, cutting environment spin-up time by 75%.",
          "Configured GitHub Actions CI/CD pipeline with Trivy vulnerability scanning, enforcing zero high-severity CVE releases.",
          "Implemented Kubernetes Horizontal Pod Autoscalers (HPA) handling 300% sudden traffic spikes without dropped connections."
        ]
      }
    ],
    projects: [
      {
        id: 1,
        name: "Zero-Downtime GitOps Kubernetes Deployment Pipeline",
        techStack: "Kubernetes, ArgoCD, Helm, AWS EKS, Prometheus",
        demoUrl: "",
        githubUrl: "https://github.com/rohanvarma/gitops-k8s-cluster",
        description: "Automated declarative deployment system syncing application states from Git repository to production cluster.",
        bullets: [
          "Configured canary release strategy with automated metric rollback upon error rate exceeding 0.5% threshold.",
          "Standardized ingress routing and TLS cert-manager lifecycle automation using Let's Encrypt."
        ]
      }
    ],
    certifications: [
      {
        id: 1,
        name: "Certified Kubernetes Administrator (CKA)",
        issuer: "Cloud Native Computing Foundation (CNCF)",
        date: "2025",
        credentialId: "CKA-901428"
      }
    ]
  },

  fresher: {
    label: "College Graduate / Fresher",
    role: "Software Engineer",
    personalInfo: {
      fullName: "Sneha Patel",
      headline: "Computer Science Graduate | Aspiring Software Development Engineer",
      email: "sneha.patel.code@gmail.com",
      phone: "+91 99887 76655",
      location: "New Delhi, India",
      linkedin: "https://linkedin.com/in/snehapatel-tech",
      github: "https://github.com/snehapatel-dev",
      portfolio: "https://snehapatel.me"
    },
    summary: "Motivated Computer Science graduate with strong fundamentals in Data Structures & Algorithms, Object-Oriented Programming, and full stack web development. Actively solved 350+ LeetCode problems with proven academic excellence and hands-on project portfolio.",
    education: [
      {
        id: 1,
        institution: "Delhi Technological University (DTU)",
        degree: "B.Tech in Computer Engineering",
        field: "Computer Science",
        cgpa: "8.95 / 10.0",
        year: "2022 - 2026",
        location: "Delhi, India",
        honors: "Academic Rank Top 5% • Merit Scholarship Recipient"
      }
    ],
    skills: {
      languages: ["Java", "C++", "Python", "JavaScript", "SQL", "HTML/CSS"],
      frameworks: ["React", "Spring Boot", "Node.js", "Express", "Bootstrap"],
      tools: ["Git & GitHub", "MySQL", "PostgreSQL", "VS Code", "Postman", "Linux"],
      softSkills: ["Fast Learner", "Problem Solving", "Teamwork", "Effective Communication"]
    },
    experience: [
      {
        id: 1,
        title: "Web Development Intern",
        company: "EdTech Innovation Labs",
        location: "New Delhi, India (Remote)",
        startDate: "May 2025",
        endDate: "July 2025",
        current: false,
        bullets: [
          "Designed and shipped 8 responsive landing pages with React, increasing student sign-up conversion by 18%.",
          "Collaborated with backend engineers to integrate REST endpoints for automated quiz assessments and scorecards.",
          "Authored unit tests using Jest, achieving 80%+ test coverage across core UI components."
        ]
      }
    ],
    projects: [
      {
        id: 1,
        name: "Campus Event Booking & Ticketing Portal",
        techStack: "React, Node.js, Express, MongoDB, Tailwind CSS",
        demoUrl: "https://campusevents-demo.dev",
        githubUrl: "https://github.com/snehapatel/campus-events",
        description: "Full stack portal managing university symposium registrations with digital QR passes.",
        bullets: [
          "Built authentication flow using JWT with role permissions for student attendees and faculty organizers.",
          "Processed 1,200+ event registrations during annual technical fest with zero downtime or duplicate bookings."
        ]
      }
    ],
    certifications: [
      {
        id: 1,
        name: "Data Structures and Algorithms in Java",
        issuer: "NPTEL / IIT Kharagpur (Elite + Silver)",
        date: "2024",
        credentialId: "NPTEL24CS8812"
      }
    ]
  }
};

const THEME_COLORS = [
  { id: 'sky', name: 'Academic Sky', primary: '#0284c7', text: '#0369a1', light: '#f0f9ff', border: '#bae6fd' },
  { id: 'indigo', name: 'Royal Indigo', primary: '#4f46e5', text: '#4338ca', light: '#eef2ff', border: '#c7d2fe' },
  { id: 'emerald', name: 'Tech Emerald', primary: '#059669', text: '#047857', light: '#ecfdf5', border: '#a7f3d0' },
  { id: 'slate', name: 'Executive Slate', primary: '#334155', text: '#1e293b', light: '#f8fafc', border: '#cbd5e1' },
  { id: 'rose', name: 'Crimson Rose', primary: '#e11d48', text: '#be123c', light: '#fff1f2', border: '#fecdd3' }
];

const FONTS = [
  { id: 'inter', name: 'Inter (Clean Modern)', fontClass: "font-['Inter',sans-serif]" },
  { id: 'outfit', name: 'Outfit (Modern Tech)', fontClass: "font-['Outfit',sans-serif]" },
  { id: 'roboto', name: 'Roboto (Standard ATS)', fontClass: "font-['Roboto',sans-serif]" },
  { id: 'serif', name: 'Merriweather (Classic Serif)', fontClass: "font-serif" }
];

export default function ResumeBuilder({ onSendToReview, initialPreset = 'fullstack' }) {
  // Load saved state from localStorage if available, or fall back to preset
  const [activePreset, setActivePreset] = useState(initialPreset);
  
  const [resumeData, setResumeData] = useState(() => {
    try {
      const saved = localStorage.getItem('academicx_resume_builder_data');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not load saved resume builder state:', e);
    }
    const base = JSON.parse(JSON.stringify(PRESET_PROFILES[initialPreset] || PRESET_PROFILES.fullstack));
    try {
      const basic = getStudentBasicInfo();
      if (basic) {
        if (basic.fullName) base.personalInfo.fullName = basic.fullName;
        if (basic.email) base.personalInfo.email = basic.email;
        if (basic.phone) base.personalInfo.phone = basic.phone;
        if (basic.headline) base.personalInfo.headline = basic.headline;
        if (basic.location) base.personalInfo.location = basic.location;
        if (base.education && base.education[0]) {
          if (basic.college) base.education[0].institution = basic.college;
          if (basic.degree) base.education[0].degree = basic.degree;
          if (basic.branch) base.education[0].field = basic.branch;
          if (basic.cgpa) base.education[0].cgpa = `${basic.cgpa} / 10.0`;
          if (basic.graduationYear) base.education[0].year = `Class of ${basic.graduationYear}`;
        }
      }
    } catch (err) {}
    return base;
  });

  // Listen for real-time basic info updates from StudentDashboard
  useEffect(() => {
    const handleBasicInfoUpdate = (e) => {
      const basic = e.detail;
      if (!basic) return;
      setResumeData(prev => {
        const next = { ...prev };
        next.personalInfo = {
          ...next.personalInfo,
          fullName: basic.fullName || next.personalInfo.fullName,
          email: basic.email || next.personalInfo.email,
          phone: basic.phone || next.personalInfo.phone,
          headline: basic.headline || next.personalInfo.headline,
          location: basic.location || next.personalInfo.location
        };
        if (next.education && next.education[0]) {
          next.education[0] = {
            ...next.education[0],
            institution: basic.college || next.education[0].institution,
            degree: basic.degree || next.education[0].degree,
            field: basic.branch || next.education[0].field,
            cgpa: basic.cgpa ? `${basic.cgpa} / 10.0` : next.education[0].cgpa,
            year: basic.graduationYear ? `Class of ${basic.graduationYear}` : next.education[0].year
          };
        }
        return next;
      });
    };

    window.addEventListener('academicx_basic_info_updated', handleBasicInfoUpdate);
    return () => window.removeEventListener('academicx_basic_info_updated', handleBasicInfoUpdate);
  }, []);

  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'education' | 'skills' | 'experience' | 'projects' | 'certifications'
  const [selectedTemplate, setSelectedTemplate] = useState('modern'); // 'modern' | 'classic' | 'academic'
  const [selectedTheme, setSelectedTheme] = useState('sky');
  const [selectedFont, setSelectedFont] = useState('inter');
  const [spacingDensity, setSpacingDensity] = useState('normal'); // 'compact' | 'normal' | 'spacious'

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [isFullScreenPreview, setIsFullScreenPreview] = useState(false);

  // Skill Input Helpers
  const [newSkillCategory, setNewSkillCategory] = useState('languages');
  const [newSkillText, setNewSkillText] = useState('');

  const resumeSheetRef = useRef(null);

  // Auto-save to localStorage whenever resumeData changes
  useEffect(() => {
    try {
      localStorage.setItem('academicx_resume_builder_data', JSON.stringify(resumeData));
    } catch (e) {
      console.warn('Could not save resume builder state:', e);
    }
  }, [resumeData]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Switch preset profile
  const handleLoadPreset = (presetKey) => {
    setActivePreset(presetKey);
    const chosen = PRESET_PROFILES[presetKey];
    if (chosen) {
      setResumeData(JSON.parse(JSON.stringify(chosen)));
      showToast(`Loaded ${chosen.label} preset successfully!`);
    }
  };

  // 1-Click Sync from AcademicX Profile
  const handleSyncFromAcademicProfile = () => {
    try {
      const cachedUser = (() => {
        try {
          const u = localStorage.getItem('reddot_user') || localStorage.getItem('user');
          return u ? JSON.parse(u) : null;
        } catch { return null; }
      })();

      const cachedLinks = (() => {
        try {
          const l = localStorage.getItem('academicx_portfolio_links');
          return l ? JSON.parse(l) : null;
        } catch { return null; }
      })();

      const cachedSkills = (() => {
        try {
          const s = localStorage.getItem('academicx_skill_tags');
          return s ? JSON.parse(s) : null;
        } catch { return null; }
      })();

      const cachedProjects = (() => {
        try {
          const p = localStorage.getItem('academicx_projects_list');
          return p ? JSON.parse(p) : null;
        } catch { return null; }
      })();

      const cachedCerts = (() => {
        try {
          const c = localStorage.getItem('academicx_certificates_list');
          return c ? JSON.parse(c) : null;
        } catch { return null; }
      })();

      setResumeData(prev => {
        const next = { ...prev };

        const basicInfo = getStudentBasicInfo(cachedUser);
        if (basicInfo) {
          next.personalInfo = {
            ...next.personalInfo,
            fullName: basicInfo.fullName || next.personalInfo.fullName,
            email: basicInfo.email || next.personalInfo.email,
            phone: basicInfo.phone || next.personalInfo.phone,
            location: basicInfo.location || next.personalInfo.location || "India",
            headline: basicInfo.headline || next.personalInfo.headline
          };

          if (next.education && next.education.length > 0) {
            next.education[0] = {
              ...next.education[0],
              institution: basicInfo.college || next.education[0].institution,
              degree: basicInfo.degree || next.education[0].degree,
              field: basicInfo.branch || next.education[0].field,
              cgpa: basicInfo.cgpa ? `${basicInfo.cgpa} / 10.0` : next.education[0].cgpa,
              year: basicInfo.graduationYear ? `Class of ${basicInfo.graduationYear}` : next.education[0].year,
            };
          }
        } else if (cachedUser) {
          next.personalInfo = {
            ...next.personalInfo,
            fullName: cachedUser.full_name || cachedUser.name || next.personalInfo.fullName,
            email: cachedUser.email || next.personalInfo.email,
            phone: cachedUser.phone || next.personalInfo.phone,
            location: cachedUser.location || next.personalInfo.location || "India"
          };
        }

        if (cachedLinks) {
          next.personalInfo = {
            ...next.personalInfo,
            linkedin: cachedLinks.linkedin || next.personalInfo.linkedin,
            github: cachedLinks.github || next.personalInfo.github,
            portfolio: cachedLinks.portfolio || next.personalInfo.portfolio
          };
        }

        if (cachedSkills && Array.isArray(cachedSkills) && cachedSkills.length > 0) {
          const techSkills = cachedSkills.filter(s => s.category === 'Technical').map(s => s.name);
          const soft = cachedSkills.filter(s => s.category === 'Soft Skill').map(s => s.name);

          if (techSkills.length > 0) {
            // Distribute into frameworks/languages/tools
            next.skills = {
              ...next.skills,
              languages: [...new Set([...(next.skills.languages || []), ...techSkills.slice(0, 4)])],
              frameworks: [...new Set([...(next.skills.frameworks || []), ...techSkills.slice(4, 9)])],
              tools: [...new Set([...(next.skills.tools || []), ...techSkills.slice(9)])],
              softSkills: soft.length > 0 ? [...new Set([...(next.skills.softSkills || []), ...soft])] : next.skills.softSkills
            };
          }
        }

        if (cachedProjects && Array.isArray(cachedProjects) && cachedProjects.length > 0) {
          const importedProjects = cachedProjects.map((p, idx) => ({
            id: Date.now() + idx,
            name: p.title,
            techStack: Array.isArray(p.techStack) ? p.techStack.join(', ') : p.techStack,
            demoUrl: p.demoUrl || '',
            githubUrl: p.githubUrl || '',
            description: p.description,
            bullets: [
              p.description,
              "Implemented with modular clean architecture and integrated continuous integration."
            ]
          }));
          next.projects = [...importedProjects, ...next.projects.slice(0, 1)];
        }

        if (cachedCerts && Array.isArray(cachedCerts) && cachedCerts.length > 0) {
          const importedCerts = cachedCerts.map((c, idx) => ({
            id: Date.now() + idx,
            name: c.title,
            issuer: c.issuer || 'Accredited Institution',
            date: c.issueDate || '2025',
            credentialId: c.credentialUrl ? 'Verified Online' : 'VERIFIED-RECORD'
          }));
          next.certifications = [...importedCerts, ...next.certifications];
        }

        return next;
      });

      showToast("Synced profile, verified skills, and projects from your AcademicX Vault!");
    } catch (err) {
      console.error('Error syncing profile:', err);
      showToast("Could not sync all profile items. Using existing entries.");
    }
  };

  // AI Summary Generator Helper
  const handleGenerateAiSummary = () => {
    const role = resumeData.role || resumeData.personalInfo.headline || "Software Engineer";
    const topSkills = [
      ...(resumeData.skills.languages || []).slice(0, 3),
      ...(resumeData.skills.frameworks || []).slice(0, 3)
    ].join(", ");

    const generated = `Results-driven ${role} with a solid foundation in ${topSkills || 'modern software engineering'} and distributed systems. Demonstrated capability in building high-performing web applications, optimizing API latency, and delivering reliable software with agile development practices. Eager to contribute scalable code and technical rigor to high-growth engineering teams.`;

    setResumeData(prev => ({
      ...prev,
      summary: generated
    }));
    showToast("✨ AI generated an ATS-optimized professional summary!");
  };

  // Add Item Helpers
  const handleAddEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now(),
          institution: "University / Institution Name",
          degree: "Degree / Course (e.g. B.Tech in CSE)",
          field: "Major / Stream",
          cgpa: "8.5 / 10.0",
          year: "2023 - 2027",
          location: "City, State",
          honors: ""
        }
      ]
    }));
    showToast("Added new education entry.");
  };

  const handleDeleteEducation = (id) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(e => e.id !== id)
    }));
  };

  const handleAddExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now(),
          title: "Software Engineering Intern",
          company: "Company Name",
          location: "City / Remote",
          startDate: "Jan 2025",
          endDate: "Present",
          current: true,
          bullets: [
            "Contributed to core product features, improving system throughput and test coverage.",
            "Collaborated with senior engineers on architectural code reviews and automated CI pipelines."
          ]
        }
      ]
    }));
    showToast("Added new experience entry.");
  };

  const handleDeleteExperience = (id) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(e => e.id !== id)
    }));
  };

  const handleAddProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: Date.now(),
          name: "Innovative Engineering Project",
          techStack: "React, Python, PostgreSQL, Docker",
          demoUrl: "https://project-demo.com",
          githubUrl: "https://github.com/username/repo",
          description: "High-impact web application built to solve real-world operational bottlenecks.",
          bullets: [
            "Architected scalable backend services with sub-50ms query latency under simulated load.",
            "Designed modern accessible frontend with responsive UI and real-time state synchronization."
          ]
        }
      ]
    }));
    showToast("Added new project entry.");
  };

  const handleDeleteProject = (id) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
  };

  const handleAddCertification = () => {
    setResumeData(prev => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        {
          id: Date.now(),
          name: "Certified Specialist / Exam",
          issuer: "Issuing Organization (e.g. AWS / Google)",
          date: "2025",
          credentialId: "ID-1234567"
        }
      ]
    }));
    showToast("Added new certification entry.");
  };

  const handleDeleteCertification = (id) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c.id !== id)
    }));
  };

  // Add / Remove Skill Chips
  const handleAddSkillChip = () => {
    if (!newSkillText.trim()) return;
    const trimmed = newSkillText.trim();
    setResumeData(prev => {
      const currentList = prev.skills[newSkillCategory] || [];
      if (currentList.includes(trimmed)) return prev;
      return {
        ...prev,
        skills: {
          ...prev.skills,
          [newSkillCategory]: [...currentList, trimmed]
        }
      };
    });
    setNewSkillText('');
  };

  const handleRemoveSkillChip = (category, skillName) => {
    setResumeData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter(s => s !== skillName)
      }
    }));
  };

  // Convert Resume Data to Formatted Plain Text
  const getResumeAsPlainText = () => {
    const p = resumeData.personalInfo;
    let txt = `${p.fullName || 'Candidate'}\n`;
    txt += `${p.headline || ''}\n`;
    txt += `${p.email || ''} | ${p.phone || ''} | ${p.location || ''}\n`;
    if (p.linkedin) txt += `LinkedIn: ${p.linkedin} | `;
    if (p.github) txt += `GitHub: ${p.github} | `;
    if (p.portfolio) txt += `Portfolio: ${p.portfolio}\n`;
    txt += `\n`;

    if (resumeData.summary) {
      txt += `PROFESSIONAL SUMMARY\n${resumeData.summary}\n\n`;
    }

    if (resumeData.education?.length) {
      txt += `EDUCATION\n`;
      resumeData.education.forEach(ed => {
        txt += `${ed.institution} — ${ed.degree} in ${ed.field} (${ed.year})\n`;
        if (ed.cgpa) txt += `CGPA / Grade: ${ed.cgpa}\n`;
        if (ed.honors) txt += `Honors: ${ed.honors}\n`;
      });
      txt += `\n`;
    }

    txt += `TECHNICAL SKILLS\n`;
    if (resumeData.skills?.languages?.length) txt += `Languages: ${resumeData.skills.languages.join(', ')}\n`;
    if (resumeData.skills?.frameworks?.length) txt += `Frameworks & Libraries: ${resumeData.skills.frameworks.join(', ')}\n`;
    if (resumeData.skills?.tools?.length) txt += `Developer Tools & Cloud: ${resumeData.skills.tools.join(', ')}\n`;
    if (resumeData.skills?.softSkills?.length) txt += `Professional Skills: ${resumeData.skills.softSkills.join(', ')}\n`;
    txt += `\n`;

    if (resumeData.experience?.length) {
      txt += `WORK & INTERNSHIP EXPERIENCE\n`;
      resumeData.experience.forEach(exp => {
        txt += `${exp.title} | ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'}) - ${exp.location}\n`;
        exp.bullets?.forEach(b => {
          if (b.trim()) txt += `• ${b}\n`;
        });
      });
      txt += `\n`;
    }

    if (resumeData.projects?.length) {
      txt += `PROJECTS\n`;
      resumeData.projects.forEach(prj => {
        txt += `${prj.name} [${prj.techStack}]\n`;
        if (prj.description) txt += `${prj.description}\n`;
        prj.bullets?.forEach(b => {
          if (b.trim()) txt += `• ${b}\n`;
        });
      });
      txt += `\n`;
    }

    if (resumeData.certifications?.length) {
      txt += `CERTIFICATIONS\n`;
      resumeData.certifications.forEach(c => {
        txt += `• ${c.name} - ${c.issuer} (${c.date}) ${c.credentialId ? `[ID: ${c.credentialId}]` : ''}\n`;
      });
    }

    return txt;
  };

  // Copy Plain Text to Clipboard
  const handleCopyText = async () => {
    try {
      const text = getResumeAsPlainText();
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      showToast("Resume copied to clipboard as ATS plain text!");
      setTimeout(() => setCopySuccess(false), 2500);
    } catch (e) {
      console.error('Failed to copy text:', e);
    }
  };

  // Export as High-Res PDF using downloadElementAsPdf (Guaranteed local download, never window.print)
  const handleDownloadPdf = async () => {
    if (!resumeSheetRef.current) return;
    setIsGeneratingPdf(true);
    showToast("Generating crisp A4 PDF document...");

    const fileName = `${(resumeData.personalInfo.fullName || 'Candidate').replace(/\s+/g, '_')}_Resume.pdf`;
    try {
      await downloadElementAsPdf(
        resumeSheetRef.current,
        fileName,
        `${resumeData.personalInfo.fullName || 'Candidate'} - Curriculum Vitae`
      );
      showToast(`Downloaded ${fileName} successfully!`);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      showToast("Direct download failed. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Send directly to the existing ATS Review tool
  const handleSendToAtsAudit = () => {
    const text = getResumeAsPlainText();
    if (typeof onSendToReview === 'function') {
      onSendToReview(text, resumeData.role || 'Full Stack Developer');
    } else {
      try {
        localStorage.setItem('academicx_audit_pending_text', text);
        localStorage.setItem('academicx_audit_pending_role', resumeData.role || 'Full Stack Developer');
      } catch (e) {}
      showToast("Resume text prepared! Switching to ATS Audit...");
    }
  };

  const currentColorTheme = THEME_COLORS.find(c => c.id === selectedTheme) || THEME_COLORS[0];
  const currentFontObj = FONTS.find(f => f.id === selectedFont) || FONTS[0];

  return (
    <div className="space-y-6">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-bounce">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Quick Actions Toolbar */}
      <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-extrabold uppercase tracking-wide flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-sky-600" /> Interactive CV Studio
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit']">
              Build Your High-Impact Industry Resume
            </h2>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Sync from AcademicX Profile */}
            <button
              type="button"
              onClick={handleSyncFromAcademicProfile}
              className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Import student name, CGPA, verified skills & projects directly into your resume"
            >
              <FolderSync className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sync from Profile</span>
            </button>

            {/* Run ATS Review on this Resume */}
            <button
              type="button"
              onClick={handleSendToAtsAudit}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Test this resume in the deep ATS Audit engine"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-sky-200" />
              <span>Run ATS Audit</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            {/* Copy as Plain Text */}
            <button
              type="button"
              onClick={handleCopyText}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
              title="Copy formatted text to paste into job application portals"
            >
              {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copySuccess ? 'Copied' : 'Copy Text'}</span>
            </button>

            {/* Print */}
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
              title="Browser print sheet"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Download PDF */}
            <button
              type="button"
              disabled={isGeneratingPdf}
              onClick={handleDownloadPdf}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isGeneratingPdf ? 'Exporting...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>

        {/* Preset Profiles Selector Bar */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
              Ready Starter Presets:
            </span>
            {Object.keys(PRESET_PROFILES).map((key) => {
              const preset = PRESET_PROFILES[key];
              const isSelected = activePreset === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleLoadPreset(key)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                    isSelected
                      ? 'bg-sky-600 text-white border-sky-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Main Studio Grid: Form Editor on Left (5 cols) | Live Canvas on Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: INTUITIVE STEP-BY-STEP FORM BUILDER (5 COLS) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Section Navigation Tabs */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1 overflow-x-auto text-xs font-semibold no-scrollbar">
            {[
              { id: 'personal', label: '1. Personal', icon: User },
              { id: 'education', label: '2. Education', icon: GraduationCap },
              { id: 'skills', label: '3. Skills', icon: Code2 },
              { id: 'experience', label: '4. Experience', icon: Briefcase },
              { id: 'projects', label: '5. Projects', icon: Layers },
              { id: 'certifications', label: '6. Certs', icon: Award }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white font-bold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Tab 1: Personal Information */}
          {activeTab === 'personal' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-sky-600" />
                  <h3 className="text-sm font-bold text-slate-900 font-['Outfit']">Personal & Contact Info</h3>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">ATS Header Basics</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    value={resumeData.personalInfo.fullName}
                    onChange={(e) => setResumeData({
                      ...resumeData,
                      personalInfo: { ...resumeData.personalInfo, fullName: e.target.value }
                    })}
                    placeholder="e.g. Arjun Sharma"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-sky-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Professional Headline / Target Role *</label>
                  <input
                    type="text"
                    value={resumeData.personalInfo.headline}
                    onChange={(e) => setResumeData({
                      ...resumeData,
                      personalInfo: { ...resumeData.personalInfo, headline: e.target.value }
                    })}
                    placeholder="e.g. Full Stack Developer | Distributed Systems"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, email: e.target.value }
                      })}
                      placeholder="arjun@example.com"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-sky-500 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, phone: e.target.value }
                      })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Location (City, State / Country)</label>
                  <input
                    type="text"
                    value={resumeData.personalInfo.location}
                    onChange={(e) => setResumeData({
                      ...resumeData,
                      personalInfo: { ...resumeData.personalInfo, location: e.target.value }
                    })}
                    placeholder="Bengaluru, Karnataka, India"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                {/* Professional Links */}
                <div className="pt-2 border-t border-slate-100 space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Online Profiles & Portfolios
                  </span>

                  <div>
                    <label className="block text-[10px] text-slate-600 mb-0.5">LinkedIn Profile URL</label>
                    <input
                      type="url"
                      value={resumeData.personalInfo.linkedin}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, linkedin: e.target.value }
                      })}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-600 mb-0.5">GitHub Profile URL</label>
                    <input
                      type="url"
                      value={resumeData.personalInfo.github}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, github: e.target.value }
                      })}
                      placeholder="https://github.com/username"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-600 mb-0.5">Portfolio / Personal Website</label>
                    <input
                      type="url"
                      value={resumeData.personalInfo.portfolio}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, portfolio: e.target.value }
                      })}
                      placeholder="https://yourportfolio.dev"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Professional Summary */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-slate-700">
                      Professional Summary / Bio
                    </label>
                  </div>
                  <textarea
                    rows={4}
                    value={resumeData.summary}
                    onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                    placeholder="Summarize your key qualifications, technical competencies, and career goals in 2-3 sentences..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-sky-500 text-xs leading-relaxed"
                  />
                </div>

              </div>
            </div>
          )}

          {/* Form Tab 2: Education & Academic Credentials */}
          {activeTab === 'education' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-sky-600" />
                  <h3 className="text-sm font-bold text-slate-900 font-['Outfit']">Education & Academic Vault</h3>
                </div>
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 text-[11px] font-bold flex items-center gap-1 cursor-pointer border border-sky-200"
                >
                  <Plus className="w-3 h-3" /> Add Degree
                </button>
              </div>

              <div className="space-y-4">
                {resumeData.education.map((edu, index) => (
                  <div key={edu.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 relative text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700 text-[11px]">Degree #{index + 1}</span>
                      {resumeData.education.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteEducation(edu.id)}
                          className="text-slate-400 hover:text-rose-600 transition p-1 cursor-pointer"
                          title="Remove degree"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Institution / College Name *</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => {
                          const updated = [...resumeData.education];
                          updated[index].institution = e.target.value;
                          setResumeData({ ...resumeData, education: updated });
                        }}
                        placeholder="e.g. National Institute of Technology"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Degree *</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const updated = [...resumeData.education];
                            updated[index].degree = e.target.value;
                            setResumeData({ ...resumeData, education: updated });
                          }}
                          placeholder="e.g. Bachelor of Technology"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Field / Major *</label>
                        <input
                          type="text"
                          value={edu.field}
                          onChange={(e) => {
                            const updated = [...resumeData.education];
                            updated[index].field = e.target.value;
                            setResumeData({ ...resumeData, education: updated });
                          }}
                          placeholder="e.g. Computer Science & Engg"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">CGPA / Percentage</label>
                        <input
                          type="text"
                          value={edu.cgpa}
                          onChange={(e) => {
                            const updated = [...resumeData.education];
                            updated[index].cgpa = e.target.value;
                            setResumeData({ ...resumeData, education: updated });
                          }}
                          placeholder="8.84 / 10.0"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-[11px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Duration / Years</label>
                        <input
                          type="text"
                          value={edu.year}
                          onChange={(e) => {
                            const updated = [...resumeData.education];
                            updated[index].year = e.target.value;
                            setResumeData({ ...resumeData, education: updated });
                          }}
                          placeholder="2022 - 2026"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Location</label>
                        <input
                          type="text"
                          value={edu.location}
                          onChange={(e) => {
                            const updated = [...resumeData.education];
                            updated[index].location = e.target.value;
                            setResumeData({ ...resumeData, education: updated });
                          }}
                          placeholder="Trichy, India"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Academic Honors / Achievements</label>
                      <input
                        type="text"
                        value={edu.honors || ''}
                        onChange={(e) => {
                          const updated = [...resumeData.education];
                          updated[index].honors = e.target.value;
                          setResumeData({ ...resumeData, education: updated });
                        }}
                        placeholder="e.g. Dean's Merit Scholar • Top 5% in Department"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Tab 3: Technical & Soft Skills */}
          {activeTab === 'skills' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-sky-600" />
                  <h3 className="text-sm font-bold text-slate-900 font-['Outfit']">Skills Matrix & ATS Keywords</h3>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Categorized Chips</span>
              </div>

              {/* Add Skill Chip Bar */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Add New Skill Tag
                </span>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <select
                    value={newSkillCategory}
                    onChange={(e) => setNewSkillCategory(e.target.value)}
                    className="w-full sm:w-auto px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none"
                  >
                    <option value="languages">Languages</option>
                    <option value="frameworks">Frameworks</option>
                    <option value="tools">Tools & Cloud</option>
                    <option value="softSkills">Soft Skills</option>
                  </select>

                  <input
                    type="text"
                    value={newSkillText}
                    onChange={(e) => setNewSkillText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkillChip(); } }}
                    placeholder="e.g. Python, Docker, React 19..."
                    className="flex-1 w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-sky-500"
                  />

                  <button
                    type="button"
                    onClick={handleAddSkillChip}
                    className="w-full sm:w-auto px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              </div>

              {/* Render Skill Categories */}
              {[
                { key: 'languages', title: 'Programming Languages', color: 'bg-sky-50 border-sky-200 text-sky-800' },
                { key: 'frameworks', title: 'Frameworks & Libraries', color: 'bg-indigo-50 border-indigo-200 text-indigo-800' },
                { key: 'tools', title: 'Developer Tools & Cloud Infrastructure', color: 'bg-teal-50 border-teal-200 text-teal-800' },
                { key: 'softSkills', title: 'Professional & Collaborative Competencies', color: 'bg-amber-50 border-amber-200 text-amber-800' }
              ].map(cat => (
                <div key={cat.key} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700">{cat.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {(resumeData.skills[cat.key] || []).length} items
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 bg-slate-50/50 rounded-xl border border-slate-100">
                    {(resumeData.skills[cat.key] || []).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${cat.color}`}
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkillChip(cat.key, skill)}
                          className="hover:opacity-75 cursor-pointer text-[10px] font-bold"
                          title="Remove skill"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                    {(resumeData.skills[cat.key] || []).length === 0 && (
                      <span className="text-[11px] text-slate-400 italic py-0.5">No skills added yet in this group</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Form Tab 4: Work & Internship Experience */}
          {activeTab === 'experience' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-sky-600" />
                  <h3 className="text-sm font-bold text-slate-900 font-['Outfit']">Work & Internship Experience</h3>
                </div>
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 text-[11px] font-bold flex items-center gap-1 cursor-pointer border border-sky-200"
                >
                  <Plus className="w-3 h-3" /> Add Experience
                </button>
              </div>

              <div className="space-y-4">
                {resumeData.experience.map((exp, index) => (
                  <div key={exp.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 relative text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700 text-[11px]">Position #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="text-slate-400 hover:text-rose-600 transition p-1 cursor-pointer"
                        title="Remove position"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Job Title / Role *</label>
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => {
                            const updated = [...resumeData.experience];
                            updated[index].title = e.target.value;
                            setResumeData({ ...resumeData, experience: updated });
                          }}
                          placeholder="e.g. Software Engineering Intern"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Company / Organization *</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const updated = [...resumeData.experience];
                            updated[index].company = e.target.value;
                            setResumeData({ ...resumeData, experience: updated });
                          }}
                          placeholder="e.g. Microsoft / HyperScale Labs"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Start Date</label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => {
                            const updated = [...resumeData.experience];
                            updated[index].startDate = e.target.value;
                            setResumeData({ ...resumeData, experience: updated });
                          }}
                          placeholder="May 2025"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">End Date</label>
                        <input
                          type="text"
                          value={exp.endDate}
                          onChange={(e) => {
                            const updated = [...resumeData.experience];
                            updated[index].endDate = e.target.value;
                            setResumeData({ ...resumeData, experience: updated });
                          }}
                          placeholder="Present or July 2025"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Location</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => {
                            const updated = [...resumeData.experience];
                            updated[index].location = e.target.value;
                            setResumeData({ ...resumeData, experience: updated });
                          }}
                          placeholder="Bengaluru / Remote"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                    </div>

                    {/* Bullet points */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[10px] font-bold text-slate-600">
                          Bullet Points (Quantified achievements - 1 per line)
                        </label>
                      </div>
                      <textarea
                        rows={3}
                        value={(exp.bullets || []).join('\n')}
                        onChange={(e) => {
                          const updated = [...resumeData.experience];
                          updated[index].bullets = e.target.value.split('\n');
                          setResumeData({ ...resumeData, experience: updated });
                        }}
                        placeholder="• Engineered high-throughput REST endpoints using Django, supporting 50k+ daily calls&#10;• Reduced latency by 45% using Redis caching"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono text-xs leading-relaxed"
                      />
                    </div>
                  </div>
                ))}

                {resumeData.experience.length === 0 && (
                  <div className="py-8 text-center text-slate-400 border border-dashed rounded-2xl">
                    <p className="text-xs">No work experience added. Freshers can emphasize Projects & Hackathons!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form Tab 5: Projects Showcase */}
          {activeTab === 'projects' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-600" />
                  <h3 className="text-sm font-bold text-slate-900 font-['Outfit']">Projects & Capstones</h3>
                </div>
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 text-[11px] font-bold flex items-center gap-1 cursor-pointer border border-sky-200"
                >
                  <Plus className="w-3 h-3" /> Add Project
                </button>
              </div>

              <div className="space-y-4">
                {resumeData.projects.map((prj, index) => (
                  <div key={prj.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 relative text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700 text-[11px]">Project #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteProject(prj.id)}
                        className="text-slate-400 hover:text-rose-600 transition p-1 cursor-pointer"
                        title="Remove project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Project Title *</label>
                        <input
                          type="text"
                          value={prj.name}
                          onChange={(e) => {
                            const updated = [...resumeData.projects];
                            updated[index].name = e.target.value;
                            setResumeData({ ...resumeData, projects: updated });
                          }}
                          placeholder="e.g. AcademicX Credential Grid"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Tech Stack *</label>
                        <input
                          type="text"
                          value={prj.techStack}
                          onChange={(e) => {
                            const updated = [...resumeData.projects];
                            updated[index].techStack = e.target.value;
                            setResumeData({ ...resumeData, projects: updated });
                          }}
                          placeholder="React 19, Django, PostgreSQL, Docker"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">GitHub Repository URL</label>
                        <input
                          type="url"
                          value={prj.githubUrl}
                          onChange={(e) => {
                            const updated = [...resumeData.projects];
                            updated[index].githubUrl = e.target.value;
                            setResumeData({ ...resumeData, projects: updated });
                          }}
                          placeholder="https://github.com/username/repo"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-[11px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Live Demo URL (Optional)</label>
                        <input
                          type="url"
                          value={prj.demoUrl}
                          onChange={(e) => {
                            const updated = [...resumeData.projects];
                            updated[index].demoUrl = e.target.value;
                            setResumeData({ ...resumeData, projects: updated });
                          }}
                          placeholder="https://live-app.vercel.app"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-[11px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Brief Overview / Problem Solved</label>
                      <input
                        type="text"
                        value={prj.description}
                        onChange={(e) => {
                          const updated = [...resumeData.projects];
                          updated[index].description = e.target.value;
                          setResumeData({ ...resumeData, projects: updated });
                        }}
                        placeholder="A decentralized placement network connecting verified students to recruiters."
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                        Impact Bullet Points (1 per line)
                      </label>
                      <textarea
                        rows={2}
                        value={(prj.bullets || []).join('\n')}
                        onChange={(e) => {
                          const updated = [...resumeData.projects];
                          updated[index].bullets = e.target.value.split('\n');
                          setResumeData({ ...resumeData, projects: updated });
                        }}
                        placeholder="• Implemented vector semantic search achieving sub-25ms retrieval latency&#10;• Orchestrated Docker multi-container environment for automated testing"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono text-xs leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Tab 6: Certifications & Honors */}
          {activeTab === 'certifications' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-sky-600" />
                  <h3 className="text-sm font-bold text-slate-900 font-['Outfit']">Certifications & Accreditations</h3>
                </div>
                <button
                  type="button"
                  onClick={handleAddCertification}
                  className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 text-[11px] font-bold flex items-center gap-1 cursor-pointer border border-sky-200"
                >
                  <Plus className="w-3 h-3" /> Add Certificate
                </button>
              </div>

              <div className="space-y-4">
                {resumeData.certifications.map((cert, index) => (
                  <div key={cert.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5 relative text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700 text-[11px]">Certificate #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteCertification(cert.id)}
                        className="text-slate-400 hover:text-rose-600 transition p-1 cursor-pointer"
                        title="Remove certification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Certification Title *</label>
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => {
                          const updated = [...resumeData.certifications];
                          updated[index].name = e.target.value;
                          setResumeData({ ...resumeData, certifications: updated });
                        }}
                        placeholder="e.g. AWS Certified Solutions Architect"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Issuer</label>
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => {
                            const updated = [...resumeData.certifications];
                            updated[index].issuer = e.target.value;
                            setResumeData({ ...resumeData, certifications: updated });
                          }}
                          placeholder="Amazon Web Services"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Year / Date</label>
                        <input
                          type="text"
                          value={cert.date}
                          onChange={(e) => {
                            const updated = [...resumeData.certifications];
                            updated[index].date = e.target.value;
                            setResumeData({ ...resumeData, certifications: updated });
                          }}
                          placeholder="2025"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Credential ID (Optional)</label>
                        <input
                          type="text"
                          value={cert.credentialId || ''}
                          onChange={(e) => {
                            const updated = [...resumeData.certifications];
                            updated[index].credentialId = e.target.value;
                            setResumeData({ ...resumeData, certifications: updated });
                          }}
                          placeholder="AWS-12345"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Design Customizer Toolbox */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <Palette className="w-4 h-4 text-sky-600" />
              <h3 className="font-bold text-slate-900 font-['Outfit']">Design & Layout Controls</h3>
            </div>

            {/* Template Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                ATS Layout Template
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'modern', name: 'Modern Tech', badge: 'Popular' },
                  { id: 'classic', name: 'Classic ATS', badge: 'Fortune 500' },
                  { id: 'academic', name: 'Academic Grid', badge: 'Verified' }
                ].map(tmpl => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => setSelectedTemplate(tmpl.id)}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-between ${
                      selectedTemplate === tmpl.id
                        ? 'border-sky-600 bg-sky-50 text-sky-900 font-bold shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <span className="text-xs font-bold">{tmpl.name}</span>
                    <span className="text-[9px] text-slate-400 mt-0.5">{tmpl.badge}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Theme Colors */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Accent Theme Color
              </label>
              <div className="flex items-center gap-2.5">
                {THEME_COLORS.map(theme => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`w-7 h-7 rounded-full transition-transform cursor-pointer flex items-center justify-center border-2 ${
                      selectedTheme === theme.id ? 'scale-125 border-slate-900 shadow-xs' : 'border-transparent hover:scale-110'
                    }`}
                    style={{ backgroundColor: theme.primary }}
                    title={theme.name}
                  >
                    {selectedTheme === theme.id && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
                <span className="text-[11px] text-slate-500 ml-2 font-medium">
                  {currentColorTheme.name}
                </span>
              </div>
            </div>

            {/* Typography Selector & Density */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Font Family
                </label>
                <select
                  value={selectedFont}
                  onChange={(e) => setSelectedFont(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none"
                >
                  {FONTS.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Page Density / Fit
                </label>
                <div className="flex rounded-xl bg-slate-100 p-0.5">
                  {['compact', 'normal', 'spacious'].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSpacingDensity(d)}
                      className={`flex-1 py-1 rounded-lg text-[11px] font-semibold capitalize transition cursor-pointer ${
                        spacingDensity === d ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: REAL-TIME INTERACTIVE A4 RESUME CANVAS (7 COLS) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-3 sticky top-24">
          
          {/* Canvas Top Bar Controls */}
          <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-sky-600" />
              <span className="font-bold text-slate-800">Live A4 Document Canvas</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-mono">
                {selectedTemplate.toUpperCase()} • {spacingDensity.toUpperCase()}
              </span>
            </div>

            {/* Zoom / Scale Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPreviewScale(prev => Math.max(0.7, prev - 0.1))}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                title="Zoom out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono text-slate-500 w-10 text-center">
                {Math.round(previewScale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setPreviewScale(prev => Math.min(1.3, prev + 0.1))}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                title="Zoom in"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>

              <div className="h-4 w-px bg-slate-200 mx-1" />

              <button
                type="button"
                onClick={() => setIsFullScreenPreview(!isFullScreenPreview)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                title={isFullScreenPreview ? "Exit fullscreen" : "Fullscreen preview"}
              >
                {isFullScreenPreview ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* A4 Sheet Container */}
          <div className="overflow-x-auto p-4 bg-slate-200/70 rounded-3xl border border-slate-300 shadow-inner flex justify-center">
            
            <div
              style={{
                transform: `scale(${previewScale})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease'
              }}
            >
              {/* THE RESUME DOCUMENT PRINT SHEET (Standard A4 Dimensions: 210mm x 297mm) */}
              <div
                id="academicx-resume-sheet"
                ref={resumeSheetRef}
                className={`bg-white text-slate-900 shadow-2xl transition-all duration-200 ${currentFontObj.fontClass} print:shadow-none`}
                style={{
                  width: '210mm',
                  minHeight: '297mm',
                  padding: spacingDensity === 'compact' ? '12mm 14mm' : spacingDensity === 'spacious' ? '18mm 20mm' : '15mm 16mm',
                  boxSizing: 'border-box'
                }}
              >
                
                {/* ------------------------------------------------------------- */}
                {/* TEMPLATE 1: MODERN TECH (Sky/Indigo Header & Clean Badges) */}
                {/* ------------------------------------------------------------- */}
                {selectedTemplate === 'modern' && (
                  <div className="space-y-4">
                    
                    {/* Header */}
                    <div className="border-b-2 pb-3" style={{ borderColor: currentColorTheme.primary }}>
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <h1 className="text-2xl font-black tracking-tight" style={{ color: currentColorTheme.primary }}>
                          {resumeData.personalInfo.fullName || 'Candidate Name'}
                        </h1>
                        <span className="text-xs font-bold text-slate-600 tracking-wide">
                          {resumeData.personalInfo.headline}
                        </span>
                      </div>

                      {/* Contact Info Pills */}
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-[11px] text-slate-600 mt-2 font-medium">
                        {resumeData.personalInfo.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{resumeData.personalInfo.email}</span>
                          </span>
                        )}
                        {resumeData.personalInfo.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{resumeData.personalInfo.phone}</span>
                          </span>
                        )}
                        {resumeData.personalInfo.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{resumeData.personalInfo.location}</span>
                          </span>
                        )}
                        {resumeData.personalInfo.linkedin && (
                          <span className="flex items-center gap-1">
                            <LinkedInIcon className="w-3 h-3 text-slate-400" />
                            <a href={resumeData.personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:underline">
                              {resumeData.personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
                            </a>
                          </span>
                        )}
                        {resumeData.personalInfo.github && (
                          <span className="flex items-center gap-1">
                            <GitHubIcon className="w-3 h-3 text-slate-400" />
                            <a href={resumeData.personalInfo.github} target="_blank" rel="noreferrer" className="hover:underline">
                              {resumeData.personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}
                            </a>
                          </span>
                        )}
                        {resumeData.personalInfo.portfolio && (
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3 text-slate-400" />
                            <a href={resumeData.personalInfo.portfolio} target="_blank" rel="noreferrer" className="hover:underline">
                              {resumeData.personalInfo.portfolio.replace(/^https?:\/\/(www\.)?/, '')}
                            </a>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Summary */}
                    {resumeData.summary && (
                      <div className="space-y-1">
                        <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: currentColorTheme.primary }}>
                          Professional Profile
                        </h2>
                        <p className="text-[11.5px] text-slate-700 leading-relaxed text-justify">
                          {resumeData.summary}
                        </p>
                      </div>
                    )}

                    {/* Technical Skills */}
                    <div className="space-y-1.5">
                      <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: currentColorTheme.primary }}>
                        Technical Expertise
                      </h2>
                      <div className="text-[11.5px] space-y-1">
                        {resumeData.skills.languages?.length > 0 && (
                          <div>
                            <span className="font-bold text-slate-900">Languages: </span>
                            <span className="text-slate-700">{resumeData.skills.languages.join(', ')}</span>
                          </div>
                        )}
                        {resumeData.skills.frameworks?.length > 0 && (
                          <div>
                            <span className="font-bold text-slate-900">Frameworks & Libraries: </span>
                            <span className="text-slate-700">{resumeData.skills.frameworks.join(', ')}</span>
                          </div>
                        )}
                        {resumeData.skills.tools?.length > 0 && (
                          <div>
                            <span className="font-bold text-slate-900">Tools, Databases & Cloud: </span>
                            <span className="text-slate-700">{resumeData.skills.tools.join(', ')}</span>
                          </div>
                        )}
                        {resumeData.skills.softSkills?.length > 0 && (
                          <div>
                            <span className="font-bold text-slate-900">Core Competencies: </span>
                            <span className="text-slate-700">{resumeData.skills.softSkills.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Experience */}
                    {resumeData.experience?.length > 0 && (
                      <div className="space-y-2">
                        <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: currentColorTheme.primary }}>
                          Work & Internship Experience
                        </h2>
                        <div className="space-y-2.5">
                          {resumeData.experience.map(exp => (
                            <div key={exp.id} className="space-y-1">
                              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs">
                                <div>
                                  <span className="font-bold text-slate-900">{exp.title}</span>
                                  <span className="text-slate-600 font-semibold"> • {exp.company}</span>
                                </div>
                                <span className="text-[11px] text-slate-500 font-medium">
                                  {exp.startDate} - {exp.endDate || 'Present'} | {exp.location}
                                </span>
                              </div>
                              <ul className="list-disc list-outside pl-4 text-[11px] text-slate-700 space-y-0.5 leading-relaxed">
                                {exp.bullets?.map((b, bIdx) => (
                                  b.trim() && <li key={bIdx}>{b}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Projects */}
                    {resumeData.projects?.length > 0 && (
                      <div className="space-y-2">
                        <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: currentColorTheme.primary }}>
                          Key Technical Projects
                        </h2>
                        <div className="space-y-2.5">
                          {resumeData.projects.map(prj => (
                            <div key={prj.id} className="space-y-0.5">
                              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs">
                                <div>
                                  <span className="font-bold text-slate-900">{prj.name}</span>
                                  <span className="text-[10px] text-slate-500 font-mono ml-2">[{prj.techStack}]</span>
                                </div>
                                <div className="text-[10px] text-slate-500 space-x-2 font-mono">
                                  {prj.githubUrl && <span>{prj.githubUrl.replace(/^https?:\/\/(www\.)?/, '')}</span>}
                                </div>
                              </div>
                              {prj.description && (
                                <p className="text-[11px] text-slate-600 italic">{prj.description}</p>
                              )}
                              <ul className="list-disc list-outside pl-4 text-[11px] text-slate-700 space-y-0.5 leading-relaxed">
                                {prj.bullets?.map((b, bIdx) => (
                                  b.trim() && <li key={bIdx}>{b}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {resumeData.education?.length > 0 && (
                      <div className="space-y-1.5">
                        <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: currentColorTheme.primary }}>
                          Education & Academic Credentials
                        </h2>
                        <div className="space-y-2">
                          {resumeData.education.map(edu => (
                            <div key={edu.id} className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs">
                              <div>
                                <span className="font-bold text-slate-900">{edu.institution}</span>
                                <div className="text-[11px] text-slate-700">
                                  {edu.degree} in {edu.field}
                                  {edu.cgpa && <span className="font-semibold text-slate-900"> • CGPA: {edu.cgpa}</span>}
                                  {edu.honors && <span className="text-emerald-700 font-medium"> ({edu.honors})</span>}
                                </div>
                              </div>
                              <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
                                {edu.year} | {edu.location}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Certifications */}
                    {resumeData.certifications?.length > 0 && (
                      <div className="space-y-1">
                        <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: currentColorTheme.primary }}>
                          Certifications & Honors
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] text-slate-700">
                          {resumeData.certifications.map(c => (
                            <div key={c.id} className="flex items-baseline gap-1">
                              <span className="text-slate-400">•</span>
                              <span className="font-semibold text-slate-900">{c.name}</span>
                              <span className="text-slate-500">— {c.issuer} ({c.date})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}


                {/* ------------------------------------------------------------- */}
                {/* TEMPLATE 2: CLASSIC EXECUTIVE ATS (Minimalist Single Column) */}
                {/* ------------------------------------------------------------- */}
                {selectedTemplate === 'classic' && (
                  <div className="space-y-3.5 text-slate-900">
                    
                    {/* Header */}
                    <div className="text-center border-b border-slate-300 pb-2.5">
                      <h1 className="text-2xl font-bold tracking-tight uppercase font-serif">
                        {resumeData.personalInfo.fullName || 'Candidate Name'}
                      </h1>
                      <div className="text-xs text-slate-600 font-semibold tracking-wider mt-0.5 uppercase">
                        {resumeData.personalInfo.headline}
                      </div>
                      <div className="text-[11px] text-slate-600 mt-1.5 flex flex-wrap justify-center gap-x-2.5 gap-y-0.5">
                        <span>{resumeData.personalInfo.email}</span>
                        <span>•</span>
                        <span>{resumeData.personalInfo.phone}</span>
                        <span>•</span>
                        <span>{resumeData.personalInfo.location}</span>
                        {resumeData.personalInfo.linkedin && (
                          <>
                            <span>•</span>
                            <span>{resumeData.personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
                          </>
                        )}
                        {resumeData.personalInfo.github && (
                          <>
                            <span>•</span>
                            <span>{resumeData.personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Summary */}
                    {resumeData.summary && (
                      <div className="space-y-0.5">
                        <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-200 pb-0.5 font-serif">
                          Professional Summary
                        </h2>
                        <p className="text-[11px] text-slate-800 leading-relaxed text-justify pt-0.5">
                          {resumeData.summary}
                        </p>
                      </div>
                    )}

                    {/* Technical Skills */}
                    <div className="space-y-0.5">
                      <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-200 pb-0.5 font-serif">
                        Technical Competencies
                      </h2>
                      <div className="text-[11px] space-y-0.5 pt-0.5">
                        {resumeData.skills.languages?.length > 0 && (
                          <div>
                            <span className="font-bold">Languages: </span>
                            <span>{resumeData.skills.languages.join(', ')}</span>
                          </div>
                        )}
                        {resumeData.skills.frameworks?.length > 0 && (
                          <div>
                            <span className="font-bold">Frameworks: </span>
                            <span>{resumeData.skills.frameworks.join(', ')}</span>
                          </div>
                        )}
                        {resumeData.skills.tools?.length > 0 && (
                          <div>
                            <span className="font-bold">Tools & Infrastructure: </span>
                            <span>{resumeData.skills.tools.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Experience */}
                    {resumeData.experience?.length > 0 && (
                      <div className="space-y-1">
                        <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-200 pb-0.5 font-serif">
                          Professional Experience
                        </h2>
                        <div className="space-y-2 pt-0.5">
                          {resumeData.experience.map(exp => (
                            <div key={exp.id} className="space-y-0.5">
                              <div className="flex justify-between text-xs">
                                <span className="font-bold">{exp.title} — {exp.company}</span>
                                <span className="text-[10.5px] text-slate-600 font-medium">
                                  {exp.startDate} - {exp.endDate || 'Present'} | {exp.location}
                                </span>
                              </div>
                              <ul className="list-disc list-outside pl-4 text-[11px] text-slate-800 space-y-0.5 leading-relaxed">
                                {exp.bullets?.map((b, bIdx) => (
                                  b.trim() && <li key={bIdx}>{b}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Projects */}
                    {resumeData.projects?.length > 0 && (
                      <div className="space-y-1">
                        <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-200 pb-0.5 font-serif">
                          Technical Projects
                        </h2>
                        <div className="space-y-2 pt-0.5">
                          {resumeData.projects.map(prj => (
                            <div key={prj.id} className="space-y-0.5">
                              <div className="flex justify-between text-xs">
                                <span className="font-bold">{prj.name} <span className="font-normal text-slate-600">({prj.techStack})</span></span>
                                {prj.githubUrl && <span className="text-[10px] text-slate-500 font-mono">{prj.githubUrl.replace(/^https?:\/\/(www\.)?/, '')}</span>}
                              </div>
                              <ul className="list-disc list-outside pl-4 text-[11px] text-slate-800 space-y-0.5 leading-relaxed">
                                {prj.bullets?.map((b, bIdx) => (
                                  b.trim() && <li key={bIdx}>{b}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {resumeData.education?.length > 0 && (
                      <div className="space-y-1">
                        <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-200 pb-0.5 font-serif">
                          Education
                        </h2>
                        <div className="space-y-1.5 pt-0.5">
                          {resumeData.education.map(edu => (
                            <div key={edu.id} className="flex justify-between text-xs">
                              <div>
                                <span className="font-bold">{edu.institution}</span>
                                <div className="text-[11px] text-slate-700">
                                  {edu.degree}, {edu.field} {edu.cgpa && `— CGPA: ${edu.cgpa}`}
                                </div>
                              </div>
                              <span className="text-[10.5px] text-slate-600 font-medium whitespace-nowrap">
                                {edu.year} | {edu.location}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Certifications */}
                    {resumeData.certifications?.length > 0 && (
                      <div className="space-y-0.5">
                        <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-200 pb-0.5 font-serif">
                          Certifications & Honors
                        </h2>
                        <div className="text-[11px] text-slate-800 pt-0.5 space-y-0.5">
                          {resumeData.certifications.map(c => (
                            <div key={c.id}>
                              • <span className="font-semibold">{c.name}</span> — {c.issuer} ({c.date})
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}


                {/* ------------------------------------------------------------- */}
                {/* TEMPLATE 3: ACADEMIC & VERIFICATION GRID (Accredited Layout) */}
                {/* ------------------------------------------------------------- */}
                {selectedTemplate === 'academic' && (
                  <div className="space-y-4">
                    
                    {/* Header with Verified Badge */}
                    <div className="p-4 rounded-2xl border" style={{ backgroundColor: currentColorTheme.light, borderColor: currentColorTheme.border }}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-slate-900">
                              {resumeData.personalInfo.fullName || 'Candidate Name'}
                            </h1>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-emerald-700 border border-emerald-300 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Transcript
                            </span>
                          </div>
                          <p className="text-xs font-semibold mt-0.5" style={{ color: currentColorTheme.text }}>
                            {resumeData.personalInfo.headline}
                          </p>
                        </div>

                        <div className="text-[11px] text-slate-600 space-y-0.5 sm:text-right">
                          <div>{resumeData.personalInfo.email} • {resumeData.personalInfo.phone}</div>
                          <div>{resumeData.personalInfo.location}</div>
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    {resumeData.summary && (
                      <div className="space-y-1">
                        <span className="text-[10.5px] font-bold uppercase tracking-wider block" style={{ color: currentColorTheme.primary }}>
                          Academic & Professional Executive Summary
                        </span>
                        <p className="text-[11.5px] text-slate-700 leading-relaxed">
                          {resumeData.summary}
                        </p>
                      </div>
                    )}

                    {/* Education Matrix */}
                    <div className="space-y-1.5">
                      <span className="text-[10.5px] font-bold uppercase tracking-wider block" style={{ color: currentColorTheme.primary }}>
                        Institutional Credentials & Degrees
                      </span>
                      <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                        {resumeData.education.map(edu => (
                          <div key={edu.id} className="p-2.5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <div>
                              <span className="font-bold text-slate-900">{edu.institution}</span>
                              <div className="text-[11px] text-slate-600">
                                {edu.degree} in {edu.field}
                              </div>
                            </div>
                            <div className="sm:text-right">
                              <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 text-[10px] font-bold border border-sky-200">
                                CGPA: {edu.cgpa}
                              </span>
                              <div className="text-[10px] text-slate-500 mt-0.5">{edu.year}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Technical & Soft Skills Grid */}
                    <div className="space-y-1.5">
                      <span className="text-[10.5px] font-bold uppercase tracking-wider block" style={{ color: currentColorTheme.primary }}>
                        Verified Competencies & Stack
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50">
                          <span className="font-bold text-slate-800 block mb-1">Languages & Core</span>
                          <span className="text-slate-600">{(resumeData.skills.languages || []).join(', ')}</span>
                        </div>
                        <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50">
                          <span className="font-bold text-slate-800 block mb-1">Frameworks & Web</span>
                          <span className="text-slate-600">{(resumeData.skills.frameworks || []).join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Projects & Work */}
                    <div className="space-y-2">
                      <span className="text-[10.5px] font-bold uppercase tracking-wider block" style={{ color: currentColorTheme.primary }}>
                        Engineered Projects & Industrial Impact
                      </span>
                      <div className="space-y-2">
                        {resumeData.projects.map(prj => (
                          <div key={prj.id} className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-1 text-xs">
                            <div className="flex justify-between items-baseline">
                              <span className="font-bold text-slate-900">{prj.name}</span>
                              <span className="text-[10px] text-slate-500 font-mono">{prj.techStack}</span>
                            </div>
                            <ul className="list-disc list-outside pl-4 text-[11px] text-slate-700 space-y-0.5">
                              {prj.bullets?.map((b, bIdx) => (
                                b.trim() && <li key={bIdx}>{b}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
