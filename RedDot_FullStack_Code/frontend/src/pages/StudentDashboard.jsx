import React, { useState, useEffect, useRef } from 'react';
import { 
  GraduationCap, 
  Check, 
  Briefcase, 
  Clock, 
  ArrowRight, 
  FileText, 
  Calendar,
  Building2,
  Award,
  BookOpen,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  QrCode,
  Lock,
  RefreshCw,
  X,
  FileCheck2,
  Download,
  Fingerprint,
  Camera,
  User,
  CheckCircle2,
  TrendingUp,
  MapPin,
  DollarSign,
  Filter,
  Video,
  AlertCircle,
  CheckSquare,
  Square,
  Layers,
  Globe,
  Plus,
  Trash2,
  Eye,
  Code2,
  Tag
} from 'lucide-react';
import { BASE_URL } from '../services/api';

export default function StudentDashboard({ setActiveTab }) {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [toast, setToast] = useState(null);
  const [showDocModal, setShowDocModal] = useState(false);
  const [activeStatsModal, setActiveStatsModal] = useState(null);
  const [offerAccepted, setOfferAccepted] = useState(false);
  const [appFilter, setAppFilter] = useState('all');
  const [showAllJobs, setShowAllJobs] = useState(false);
  const [jobTypeFilter, setJobTypeFilter] = useState('all');
  const [activeMainSection, setActiveMainSection] = useState('jobs'); // 'jobs' | 'portfolio'
  const [selectedJobForDetails, setSelectedJobForDetails] = useState(null);
  const [jobToApply, setJobToApply] = useState(null);
  const [confirmProfileChecked, setConfirmProfileChecked] = useState(true);

  // Recruiter Visibility
  const [recruiterVisibility, setRecruiterVisibility] = useState(() => {
    try {
      const saved = localStorage.getItem('academicx_recruiter_vis');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Current session user
  const currentUser = (() => {
    try {
      const cached = localStorage.getItem('reddot_user') || localStorage.getItem('user');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  })();
  const studentName = currentUser?.full_name || 'Student';
  const studentRollNo = currentUser?.student_roll_no || currentUser?.apaar_id || 'Verified Student';

  // Social & Professional Profiles
  const [portfolioLinks, setPortfolioLinks] = useState(() => {
    try {
      const saved = localStorage.getItem('academicx_portfolio_links');
      return saved ? JSON.parse(saved) : {
        linkedin: '',
        github: '',
        portfolio: '',
        twitter: ''
      };
    } catch {
      return {
        linkedin: '',
        github: '',
        portfolio: '',
        twitter: ''
      };
    }
  });

  // Skills Matrix Tags
  const [skillTags, setSkillTags] = useState(() => {
    try {
      const saved = localStorage.getItem('academicx_skill_tags');
      return saved ? JSON.parse(saved) : [
        { name: 'Python', category: 'Technical' },
        { name: 'React 19', category: 'Technical' },
        { name: 'PostgreSQL', category: 'Technical' },
        { name: 'Docker', category: 'Technical' },
        { name: 'Problem Solving', category: 'Soft Skill' }
      ];
    } catch {
      return [
        { name: 'Python', category: 'Technical' },
        { name: 'React 19', category: 'Technical' }
      ];
    }
  });
  const [newSkillInput, setNewSkillInput] = useState('');

  // Projects Showcase
  const [projectsList, setProjectsList] = useState(() => {
    try {
      const saved = localStorage.getItem('academicx_projects_list');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Certificates & Academic Awards
  const [certificatesList, setCertificatesList] = useState(() => {
    try {
      const saved = localStorage.getItem('academicx_certificates_list');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showAddProjectForm, setShowAddProjectForm] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '', techStack: '', githubUrl: '', demoUrl: '' });

  const [showAddCertForm, setShowAddCertForm] = useState(false);
  const [newCert, setNewCert] = useState({ title: '', issuer: '', issueDate: '', credentialUrl: '' });

  const STORAGE_KEY = 'academicx_student_photo';

  const [studentPhoto, setStudentPhoto] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || null;
    } catch {
      return null;
    }
  });
  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setToast("Photo size should be less than 5MB");
        setTimeout(() => setToast(null), 3000);
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64Photo = uploadEvent.target.result;
        setStudentPhoto(base64Photo);
        try {
          localStorage.setItem(STORAGE_KEY, base64Photo);
        } catch (err) {
          console.warn("Storage quota or localStorage error:", err);
        }
        setToast("Profile photo updated & saved successfully!");
        setTimeout(() => setToast(null), 3000);
      };
      reader.readAsDataURL(file);
    }
  };


  const academicDocuments = [
    {
      id: 1,
      title: "B.Tech Computer Science & Eng. Degree Transcript",
      issuer: "National Institute of Technology, Trichy",
      grade: "CGPA: 8.84 / 10.0 (Top 5% Cohort)",
      status: "Verified by University Registrar",
      date: "August 2026",
      docId: "NIT-TR-2026-CS884"
    },
    {
      id: 2,
      title: "Higher Secondary Examination Marksheet (Class XII)",
      issuer: "Central Board of Secondary Education",
      grade: "94.2% Marks (PCM Stream)",
      status: "Authenticated Board Record",
      date: "May 2022",
      docId: "CBSE-XII-2022-9421"
    },
    {
      id: 3,
      title: "Institutional Bona Fide Student Certificate",
      issuer: "Dean of Academic Affairs, NIT",
      grade: "Active 4th Year B.Tech Full-time",
      status: "Direct University Record",
      date: "July 2026",
      docId: "BONAFIDE-2026-NIT04"
    }
  ];

  // Verified Blue Tick logic: only active when all institutional documents are verified
  const isProfileVerified = academicDocuments.length > 0 && academicDocuments.every(doc => 
    doc.status.toLowerCase().includes('verified') || 
    doc.status.toLowerCase().includes('authenticated') || 
    doc.status.toLowerCase().includes('record')
  );

  const jobs = [
    {
      id: 1,
      title: "AI/ML Research Intern",
      company: "Google Cloud India",
      workType: "Hybrid",
      location: "Bengaluru, Karnataka, India",
      stipend: "₹60,000/month",
      matchScore: 94,
      skills: ["Python", "PyTorch", "Hugging Face", "SQL"],
      isFree: false,
      badge: "Paid Internship",
      industry: "Enterprise AI & Cloud Platforms",
      companyProfile: {
        about: "Google Cloud accelerates every organization’s ability to digitally transform its business through leading-edge infrastructure and AI products.",
        website: "https://cloud.google.com",
        location: "Bengaluru, Karnataka, India",
        companySize: "100,000+ employees"
      },
      overview: "Join Google Cloud's AI Research lab to design and evaluate state-of-the-art transformer models, graph neural networks, and scalable inference systems.",
      responsibilities: [
        "Train, fine-tune, and benchmark foundation models for specialized enterprise tasks.",
        "Implement distributed training routines using PyTorch, TPU accelerators, and CUDA.",
        "Collaborate with senior research scientists to write technical documentation and patents."
      ],
      requirements: {
        minGpa: "8.0 CGPA or higher",
        graduatingYears: "2026 / 2027 Batches",
        eligibleBranches: "Computer Science, Data Science, AI/ML, ECE",
        keyTools: ["Python 3.11+", "PyTorch", "Hugging Face", "CUDA", "Linux"]
      },
      compensationDetails: "Fixed Stipend: ₹60,000/month • Hybrid meal allowances • Direct PPO consideration for top performers."
    },
    {
      id: 2,
      title: "Full Stack Platform Engineer",
      company: "Tata Consultancy Services (Research)",
      workType: "Hybrid",
      location: "Pune, Maharashtra, India",
      stipend: "₹10 LPA",
      matchScore: 89,
      skills: ["React 19", "Django REST", "PostgreSQL", "Tailwind"],
      isFree: false,
      badge: "Placement Offer",
      industry: "Enterprise Software & Research",
      companyProfile: {
        about: "TCS Research and Innovation labs develop pioneering software architectures, autonomous systems, and distributed platforms for global Fortune 500 enterprises.",
        website: "https://www.tcs.com/research-and-innovation",
        location: "Pune, Maharashtra, India",
        companySize: "600,000+ employees"
      },
      overview: "Develop scalable microservices, interactive dashboard applications, and high-throughput transactional database architectures.",
      responsibilities: [
        "Build modular frontend components using React 19 and modern CSS utility frameworks.",
        "Design RESTful APIs and asynchronous task workers with Django and Celery.",
        "Optimize database queries, indexing strategies, and connection pooling in PostgreSQL."
      ],
      requirements: {
        minGpa: "7.5 CGPA or higher",
        graduatingYears: "2026 Batch",
        eligibleBranches: "Computer Science, Information Technology, Software Engineering",
        keyTools: ["React", "Django REST Framework", "PostgreSQL", "Docker", "Git"]
      },
      compensationDetails: "Annual CTC: ₹10,00,000 (Base: ₹8.5L + Performance Bonus: ₹1.5L) • Health Cover: ₹5,00,000."
    },
    {
      id: 3,
      title: "Cloud Infrastructure Associate",
      company: "Microsoft Azure",
      workType: "On-site",
      location: "Hyderabad, Telangana, India",
      stipend: "₹14 LPA",
      matchScore: 82,
      skills: ["Docker", "Kubernetes", "Linux", "CI/CD"],
      isFree: false,
      badge: "Placement Drive",
      industry: "Hyperscale Cloud Infrastructure",
      companyProfile: {
        about: "Microsoft Azure enables mission-critical workloads across the world with global data centers, advanced networking, and secure cloud operating systems.",
        website: "https://azure.microsoft.com",
        location: "Hyderabad, Telangana, India",
        companySize: "220,000+ employees"
      },
      overview: "Support hyper-scale cluster deployments, automated site-reliability pipelines, and container orchestrations on Azure Kubernetes Service (AKS).",
      responsibilities: [
        "Build and maintain infrastructure as code using Terraform and Azure Resource Manager.",
        "Monitor cluster health, implement auto-scaling policies, and conduct root-cause analysis.",
        "Ensure enterprise-grade security hardening and automated zero-downtime CI/CD workflows."
      ],
      requirements: {
        minGpa: "8.0 CGPA or higher",
        graduatingYears: "2026 Batch",
        eligibleBranches: "CSE, IT, Electrical & Computer Engineering",
        keyTools: ["Kubernetes", "Docker", "Linux Kernel", "Terraform", "GitHub Actions"]
      },
      compensationDetails: "Annual CTC: ₹14,00,000 (Base: ₹11L + Joining Bonus: ₹1.5L + Stock Grants: ₹1.5L) • Relocation Allowance."
    },
    {
      id: 4,
      title: "Open-Source AI & LLM Apprentice",
      company: "Linux Foundation & Hugging Face",
      workType: "Remote",
      location: "Global / 100% Remote Community",
      stipend: "Free Track • Sponsored Certification + Mentorship",
      matchScore: 91,
      skills: ["Transformers", "PyTorch", "Git", "Model Fine-tuning"],
      isFree: true,
      badge: "100% FREE Track",
      industry: "Open-Source AI Research Ecosystem",
      companyProfile: {
        about: "The Linux Foundation and Hugging Face democratize machine learning through transparent open-source code, benchmarks, and community fellowships.",
        website: "https://huggingface.co",
        location: "Remote / Open Ecosystem",
        companySize: "Decentralized Open Source Community"
      },
      overview: "An open community apprenticeship program where students contribute to public AI models, optimize open-weight checkpoints, and build community datasets.",
      responsibilities: [
        "Contribute pull requests to Hugging Face diffusers, transformers, or PEFT libraries.",
        "Quantize and optimize open models using LoRA and GGUF for edge inference.",
        "Collaborate with international open-source maintainers via GitHub discussions."
      ],
      requirements: {
        minGpa: "No Minimum GPA Required (Merit & Code Based)",
        graduatingYears: "All Batches Eligible (2025-2028)",
        eligibleBranches: "All Engineering Branches & Self-Taught Developers",
        keyTools: ["Git", "GitHub", "Python", "PyTorch", "Transformers"]
      },
      compensationDetails: "100% Free Tuition • Sponsored GPU compute credits • Official Linux Foundation Fellowship Certificate upon completion."
    },
    {
      id: 5,
      title: "Data Analytics Virtual Externship",
      company: "Deloitte Technology Academy",
      workType: "Remote",
      location: "Virtual / Self-Paced",
      stipend: "Free Track • Direct Fast-Track Interview Access",
      matchScore: 87,
      skills: ["PowerBI", "SQL", "Python", "Data Modeling"],
      isFree: true,
      badge: "FREE Virtual Externship",
      industry: "Management Consulting & Enterprise Data",
      companyProfile: {
        about: "Deloitte provides audit, consulting, financial advisory, and advanced analytical services to 80% of Fortune Global 500 companies.",
        website: "https://www.deloitte.com",
        location: "Virtual / Pan-India",
        companySize: "400,000+ employees"
      },
      overview: "Gain hands-on corporate experience analyzing real-world client data scenarios, building interactive PowerBI dashboards, and extracting business insights.",
      responsibilities: [
        "Transform messy enterprise CSV/SQL datasets into structured relational data models.",
        "Develop executive KPI dashboards in PowerBI visualizing customer retention and churn.",
        "Submit weekly analytical briefs mimicking actual management consulting client deliverables."
      ],
      requirements: {
        minGpa: "7.0 CGPA or equivalent",
        graduatingYears: "2026 / 2027 Batches",
        eligibleBranches: "Computer Science, IT, Data Analytics, Mechanical, Civil",
        keyTools: ["SQL", "PowerBI / Tableau", "Excel Advanced", "Python Pandas"]
      },
      compensationDetails: "100% Free Access • Official Verified Deloitte Certificate of Completion • Fast-track campus interview priority."
    },
    {
      id: 6,
      title: "Cybersecurity Operations Fellow",
      company: "National Cyber Coordination Centre (Govt of India)",
      workType: "Hybrid",
      location: "New Delhi / Remote",
      stipend: "Free Track • Govt Certified Defense Credential",
      matchScore: 84,
      skills: ["Network Security", "Wireshark", "Penetration Testing", "SIEM"],
      isFree: true,
      badge: "FREE Govt Accredited",
      industry: "National Critical Infrastructure Defense",
      companyProfile: {
        about: "NCCC operates under CERT-In and the Ministry of Electronics and Information Technology to coordinate cyber threat intelligence across national networks.",
        website: "https://www.cert-in.org.in",
        location: "New Delhi, India",
        companySize: "Govt Directorate"
      },
      overview: "A national initiative training promising engineering students in cyber incident analysis, packet sniffing, and vulnerability assessment.",
      responsibilities: [
        "Analyze network traffic dumps for malicious port scans and anomalous payload signatures.",
        "Simulate web application vulnerability testing (OWASP Top 10) in sandbox labs.",
        "Prepare incident response incident reports according to national cybersecurity directives."
      ],
      requirements: {
        minGpa: "Indian Nationals only • 7.0 CGPA+",
        graduatingYears: "2026 / 2027 Batches",
        eligibleBranches: "CSE, IT, Cyber Security, ECE",
        keyTools: ["Wireshark", "Linux Command Line", "Nmap", "Burp Suite", "Snort"]
      },
      compensationDetails: "Free Govt-funded training • Government of India verified credential • Priority placement referral to defense tech contractors."
    },
    {
      id: 7,
      title: "Cloud & Serverless Immersion Trainee",
      company: "AWS Educate Academy",
      workType: "Remote",
      location: "Virtual / Hybrid",
      stipend: "Free Track • Cloud Certification Voucher Included",
      matchScore: 85,
      skills: ["AWS Lambda", "Docker", "CloudFormation", "Terraform"],
      isFree: true,
      badge: "FREE Sponsored Track",
      industry: "Cloud & Serverless Architectures",
      companyProfile: {
        about: "Amazon Web Services (AWS) is the world's most comprehensive cloud platform, offering over 200 fully featured services from data centers globally.",
        website: "https://aws.amazon.com/education/awseducate/",
        location: "Virtual / Pan-India",
        companySize: "1,500,000+ employees (Amazon)"
      },
      overview: "Master modern event-driven serverless architectures, microservice decoupling, and cloud deployment security with hands-on AWS console sandboxes.",
      responsibilities: [
        "Deploy serverless REST microservices using AWS Lambda, API Gateway, and DynamoDB.",
        "Automate cloud infrastructure pipelines with AWS CloudFormation templates.",
        "Implement IAM role-based least-privilege security policies for cloud assets."
      ],
      requirements: {
        minGpa: "Open to all enrolled university students",
        graduatingYears: "2025 to 2028 Batches",
        eligibleBranches: "All Engineering & Science streams",
        keyTools: ["AWS Console", "Python / Node.js", "Docker", "DynamoDB"]
      },
      compensationDetails: "Zero Registration Fee • $100 free AWS Cloud Credits • Free 50% discount voucher for AWS Certified Cloud Practitioner exam."
    },
    {
      id: 8,
      title: "Frontend Core Platform Engineer",
      company: "Zomato / Blinkit Tech",
      workType: "Hybrid",
      location: "Gurugram, Haryana, India",
      stipend: "₹12 LPA",
      matchScore: 88,
      skills: ["React 19", "Next.js", "TypeScript", "Tailwind"],
      isFree: false,
      badge: "Campus Placement",
      industry: "Hyperlocal Consumer Internet & E-Commerce",
      companyProfile: {
        about: "Zomato and Blinkit power instantaneous food delivery and quick-commerce groceries for millions of customers across 500+ Indian cities.",
        website: "https://www.zomato.com",
        location: "Gurugram, Haryana, India",
        companySize: "15,000+ employees"
      },
      overview: "Build lightning-fast, high-converting customer ordering flows, real-time delivery rider tracking interfaces, and accessible design system components.",
      responsibilities: [
        "Craft pixel-perfect, accessible user interfaces using Next.js 15 and Tailwind CSS.",
        "Optimize Web Vitals (LCP, INP, CLS) across low-bandwidth 4G/5G mobile browser connections.",
        "Implement state management and WebSocket feeds for real-time live map tracking."
      ],
      requirements: {
        minGpa: "7.0 CGPA or higher",
        graduatingYears: "2026 Batch",
        eligibleBranches: "Computer Science, IT, Software Engineering",
        keyTools: ["TypeScript", "React / Next.js", "Tailwind CSS", "Redux Toolkit", "WebSockets"]
      },
      compensationDetails: "Annual Package: ₹12,00,000 CTC • Free cafeteria meals & transport allowance • Annual tech gear stipend."
    },
    {
      id: 9,
      title: "Distributed Systems Backend Associate",
      company: "Amazon Web Services (AWS)",
      workType: "On-site",
      location: "Bengaluru, Karnataka, India",
      stipend: "₹18 LPA",
      matchScore: 93,
      skills: ["Go", "Distributed DB", "Kafka", "Linux"],
      isFree: false,
      badge: "Campus Placement",
      industry: "Distributed Storage & High Performance Computing",
      companyProfile: {
        about: "Amazon Web Services provides robust, fault-tolerant infrastructure services that power global web-scale applications and multi-tenant architectures.",
        website: "https://aws.amazon.com",
        location: "Bengaluru, Karnataka, India",
        companySize: "1,500,000+ employees (Amazon)"
      },
      overview: "Build core distributed backend storage, consensus algorithms, and event-streaming pipelines handling petabytes of data at millisecond latency.",
      responsibilities: [
        "Write high-concurrency backend services in Go and Java with zero memory leaks.",
        "Design partitioned message queues and Kafka streaming consumer groups.",
        "Implement automated failover, load re-balancing, and fault-injection chaos testing."
      ],
      requirements: {
        minGpa: "8.2 CGPA or higher",
        graduatingYears: "2026 Batch",
        eligibleBranches: "CSE, IT, Mathematics & Computing",
        keyTools: ["Golang", "Apache Kafka", "Redis", "Distributed SQL", "Linux Internals"]
      },
      compensationDetails: "Annual CTC: ₹18,00,000 (Base: ₹14.5L + Sign-on Bonus: ₹2L + RSUs: ₹1.5L) • Comprehensive Family Health Insurance."
    },
    {
      id: 10,
      title: "Web3 & Smart Contracts Research Fellow",
      company: "Ethereum India Fellowship",
      workType: "Remote",
      location: "Remote / Open Ecosystem",
      stipend: "Free Track • Sponsored Community Grant ($1,000)",
      matchScore: 79,
      skills: ["Solidity", "Rust", "Web3.js", "Cryptography"],
      isFree: true,
      badge: "FREE Community Grant",
      industry: "Decentralized Finance & Cryptographic Protocols",
      companyProfile: {
        about: "Ethereum India Fellowship supports university builders and protocol researchers contributing to zero-knowledge cryptography, decentralized governance, and EVM scaling.",
        website: "https://ethereum.org",
        location: "Remote / Global",
        companySize: "Decentralized Protocol DAO"
      },
      overview: "An intensive 8-week research fellowship on EVM architecture, smart contract security auditing, and zero-knowledge proof primitives.",
      responsibilities: [
        "Develop and unit-test smart contracts using Foundry and Hardhat with gas optimization.",
        "Perform vulnerability fuzz testing (re-entrancy, oracle manipulation, arithmetic overflow).",
        "Publish an open-source research proposal or decentralized demo on the Sepolia testnet."
      ],
      requirements: {
        minGpa: "No Minimum GPA Required",
        graduatingYears: "Open to all enrolled students",
        eligibleBranches: "All Engineering disciplines",
        keyTools: ["Solidity", "Foundry", "Rust", "Ethers.js / Viem", "Git"]
      },
      compensationDetails: "Free Fellowship • $1,000 USD equity-free micro-grant for demo completion • Access to global Web3 hackathon sponsorships."
    }
  ];

  const initialApplications = [
    {
      id: 'app-1',
      appRef: 'APP-MSFT-2026-904',
      title: "Cloud Infrastructure Associate",
      company: "Microsoft Azure",
      appliedDate: "05 Sep 2026",
      status: "Screening Passed • Hiring Manager Review",
      category: "review",
      statusColor: "text-amber-700 bg-amber-50 border-amber-200",
      stage: "Technical Screening Assessment Cleared (Score: 88%)",
      progressStep: 2,
      location: "Hyderabad / Hybrid",
      stipend: "₹14 LPA",
      matchScore: 82,
      transcriptSynced: true
    },
    {
      id: 'app-2',
      appRef: 'APP-INFY-2026-201',
      title: "Distributed Systems & Cloud Intern",
      company: "Infosys Springboard",
      appliedDate: "03 Sep 2026",
      status: "Application Under Review",
      category: "review",
      statusColor: "text-blue-700 bg-blue-50 border-blue-200",
      stage: "Academic Profile & Coursework Synced with Recruiter",
      progressStep: 1,
      location: "Bengaluru / Remote",
      stipend: "₹45,000/month",
      matchScore: 86,
      transcriptSynced: true
    },
    {
      id: 'app-3',
      appRef: 'APP-GOOG-2026-881',
      title: "AI/ML Research Intern",
      company: "Google Cloud India",
      appliedDate: "02 Sep 2026",
      status: "Shortlisted • Interview Scheduled",
      category: "shortlisted",
      statusColor: "text-sky-700 bg-sky-50 border-sky-200",
      stage: "Round 2: Algorithmic & Systems Live Interview",
      progressStep: 3,
      location: "Bengaluru (Hybrid)",
      stipend: "₹60,000/month",
      matchScore: 94,
      transcriptSynced: true
    },
    {
      id: 'app-4',
      appRef: 'APP-TCS-2026-710',
      title: "Full Stack Platform Engineer",
      company: "Tata Consultancy Services (Research)",
      appliedDate: "28 Aug 2026",
      status: "Offer Released",
      category: "offers",
      statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
      stage: "Final Placement Offer Issued (Verified: ₹10 LPA)",
      progressStep: 4,
      location: "Pune / Remote",
      stipend: "₹10 LPA",
      matchScore: 89,
      transcriptSynced: true
    }
  ];

  // Live dynamic applications list combining initial + dynamically applied jobs
  const liveApplicationsList = [
    ...initialApplications,
    ...appliedJobs.map(jobId => {
      const matchedJob = jobs.find(j => j.id === jobId);
      return {
        id: `app-job-${jobId}`,
        appRef: `APP-CAMPUS-${jobId}-${Math.floor(1000 + Math.random() * 9000)}`,
        title: matchedJob ? matchedJob.title : "Software Engineering Role",
        company: matchedJob ? matchedJob.company : "Partner Tech Corp",
        appliedDate: "Today (Just now)",
        status: "Application Under Review",
        category: "review",
        statusColor: "text-amber-700 bg-amber-50 border-amber-200",
        stage: "Resume & Verified Credential Sync Complete",
        progressStep: 1,
        location: matchedJob ? matchedJob.location : "Pan India / Remote",
        stipend: matchedJob ? matchedJob.stipend : "Industry Standard",
        matchScore: matchedJob ? matchedJob.matchScore : 85,
        transcriptSynced: true
      };
    })
  ];

  const shortlistedList = [
    {
      id: 'sl-1',
      company: "Google Cloud India",
      role: "AI/ML Research Intern",
      round: "Round 2: Algorithmic & Systems Interview",
      scheduledDate: "Tomorrow (08 Sep 2026) • 03:30 PM - 04:30 PM IST",
      countdownBadge: "Starts in 18 hrs",
      interviewer: "Dr. Rajesh Sen",
      interviewerTitle: "Senior Staff ML Engineer, Google Cloud Bengaluru",
      mode: "Google Meet • 1-on-1 Live Assessment",
      status: "Interview Scheduled",
      badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
      skillsTested: ["Distributed PyTorch", "Graph Neural Networks", "Python Concurrency & AsyncIO"],
      meetingLink: "https://meet.google.com/acd-xpr-opt",
      preparationTips: [
        "Be ready with your NIT student identity card.",
        "Review dynamic programming on graphs & distributed training concepts.",
        "Ensure stable internet and Google Meet test run 10 minutes before."
      ]
    },
    {
      id: 'sl-2',
      company: "Tata Consultancy Services (Research)",
      role: "Full Stack Platform Engineer",
      round: "All 3 Evaluation Rounds Cleared",
      scheduledDate: "Completed on 04 Sep 2026",
      countdownBadge: "Rounds Completed",
      interviewer: "TCS Campus Hiring & Research Board",
      interviewerTitle: "Executive Technical Assessment Committee",
      mode: "On-Campus Technical & Systems Architecture Board",
      status: "Selected & Offer Released",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      skillsTested: ["React 19 Architecture", "Django REST Framework", "Distributed PostgreSQL"],
      meetingLink: null,
      evaluationRemark: "Candidate ranked in the top 2nd percentile in the campus technical round. Offer letter officially dispatched."
    }
  ];

  const offerDetails = {
    company: "Tata Consultancy Services (Research)",
    role: "Full Stack Platform Engineer",
    ctc: "₹10,00,000 / Year (₹10 LPA)",
    breakdown: "Fixed Base: ₹8,50,000 • Performance Variable: ₹1,50,000 • Health Cover: ₹5,00,000",
    location: "Pune Innovation Hub / Hybrid Flexibility",
    joiningDate: "July 1, 2027 (Post Degree Completion)",
    offerLetterId: "TCS-RES-2026-OFFER-8842",
    verificationStamp: "Cryptographically Verified by NIT Placement Cell & TCS Campus Hiring Division",
    deadline: "15 September 2026"
  };

  const readinessBreakdown = [
    { skill: "Data Structures & Algorithms", score: 85, target: 80, status: "Proficient", color: "bg-emerald-500", note: "Cleared Hard dynamic programming questions" },
    { skill: "Full Stack Web Architecture", score: 88, target: 75, status: "High Competency", color: "bg-sky-500", note: "Top 5% percentile in college cohort" },
    { skill: "Databases & Cloud Architecture", score: 74, target: 75, status: "Adequate", color: "bg-amber-500", note: "Solid SQL & Docker fundamentals" },
    { skill: "Machine Learning & AI Pipelines", score: 65, target: 70, status: "Remedial Suggested", color: "bg-purple-500", note: "Recommend completing 6-Week PyTorch roadmap" },
  ];

  const handleConfirmApplication = async () => {
    if (!jobToApply || !confirmProfileChecked) return;
    const job = jobToApply;
    if (appliedJobs.includes(job.id)) {
      setJobToApply(null);
      return;
    }
    try {
      await fetch(`${BASE_URL}/jobs/${job.id}/apply/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: 1, roll_number: studentRollNo })
      });
    } catch (e) {
      console.warn('Backend call fallback:', e);
    }
    setAppliedJobs([...appliedJobs, job.id]);
    setToast(`Application submitted successfully! Your verified profile and transcripts were shared with ${job.company}.`);
    setJobToApply(null);
    if (selectedJobForDetails?.id === job.id) {
      setSelectedJobForDetails(null);
    }
    setTimeout(() => setToast(null), 4000);
  };

  const handleSaveLinks = () => {
    try {
      localStorage.setItem('academicx_portfolio_links', JSON.stringify(portfolioLinks));
      setToast("Professional profiles & social links saved successfully!");
    } catch (e) {
      console.warn("Storage error:", e);
    }
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleRecruiterVisibility = () => {
    const nextVal = !recruiterVisibility;
    setRecruiterVisibility(nextVal);
    try {
      localStorage.setItem('academicx_recruiter_vis', JSON.stringify(nextVal));
    } catch (e) {
      console.warn("Storage error:", e);
    }
    setToast(nextVal ? "Profile visibility set to PUBLIC for verified corporate recruiters." : "Profile visibility set to PRIVATE.");
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddSkill = (category = 'Technical') => {
    if (!newSkillInput.trim()) return;
    if (skillTags.some(s => s.name.toLowerCase() === newSkillInput.trim().toLowerCase())) {
      setToast("Skill already exists in matrix!");
      setTimeout(() => setToast(null), 2500);
      return;
    }
    const updated = [...skillTags, { name: newSkillInput.trim(), category }];
    setSkillTags(updated);
    setNewSkillInput('');
    try {
      localStorage.setItem('academicx_skill_tags', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
    setToast(`Added "${newSkillInput.trim()}" to your Skills Matrix!`);
    setTimeout(() => setToast(null), 2500);
  };

  const handleRemoveSkill = (skillName) => {
    const updated = skillTags.filter(s => s.name !== skillName);
    setSkillTags(updated);
    try {
      localStorage.setItem('academicx_skill_tags', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;
    const projectItem = {
      id: Date.now(),
      title: newProject.title.trim(),
      description: newProject.description.trim() || "Academic engineering project.",
      techStack: newProject.techStack ? newProject.techStack.split(',').map(s => s.trim()).filter(Boolean) : ["React", "Python"],
      githubUrl: newProject.githubUrl.trim(),
      demoUrl: newProject.demoUrl.trim()
    };
    const updated = [projectItem, ...projectsList];
    setProjectsList(updated);
    try {
      localStorage.setItem('academicx_projects_list', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
    setNewProject({ title: '', description: '', techStack: '', githubUrl: '', demoUrl: '' });
    setShowAddProjectForm(false);
    setToast(`Project "${projectItem.title}" added to your portfolio!`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteProject = (projectId) => {
    const updated = projectsList.filter(p => p.id !== projectId);
    setProjectsList(updated);
    try {
      localStorage.setItem('academicx_projects_list', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
    setToast("Project removed from showcase.");
    setTimeout(() => setToast(null), 2500);
  };

  const handleAddCertificate = (e) => {
    e.preventDefault();
    if (!newCert.title.trim() || !newCert.issuer.trim()) return;
    const certItem = {
      id: Date.now(),
      title: newCert.title.trim(),
      issuer: newCert.issuer.trim(),
      issueDate: newCert.issueDate.trim() || "2026",
      credentialUrl: newCert.credentialUrl.trim() || "#"
    };
    const updated = [certItem, ...certificatesList];
    setCertificatesList(updated);
    try {
      localStorage.setItem('academicx_certificates_list', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
    setNewCert({ title: '', issuer: '', issueDate: '', credentialUrl: '' });
    setShowAddCertForm(false);
    setToast(`Verified certificate "${certItem.title}" added!`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteCertificate = (certId) => {
    const updated = certificatesList.filter(c => c.id !== certId);
    setCertificatesList(updated);
    try {
      localStorage.setItem('academicx_certificates_list', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
    setToast("Certificate removed.");
    setTimeout(() => setToast(null), 2500);
  };

  const handleApply = (job) => {
    if (appliedJobs.includes(job.id)) return;
    setJobToApply(job);
    setConfirmProfileChecked(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-slate-900 text-white text-xs shadow-xl flex items-center gap-3 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Banner with Profile Photo Upload */}
      <div className="bg-white border border-slate-200 p-6 sm:p-7 rounded-2xl shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 flex-1">
            {/* Profile Photo Avatar with Upload Overlay */}
            <div className="relative group shrink-0">
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                className="hidden" 
                onChange={handlePhotoUpload} 
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-sky-300 ring-4 ring-sky-50 shadow-md bg-gradient-to-br from-sky-100 to-indigo-100 flex items-center justify-center cursor-pointer transition-all hover:ring-sky-200"
                title="Click to upload/change profile photo"
              >
                {studentPhoto ? (
                  <img 
                    src={studentPhoto} 
                    alt={studentName} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-sky-700 select-none">
                    <span className="font-extrabold text-2xl font-['Outfit']">
                      {studentName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'ST'}
                    </span>
                    <span className="text-[10px] font-bold text-sky-600 mt-0.5">Add Photo</span>
                  </div>
                )}
              </div>

              {/* Camera badge overlay */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-2 bg-sky-600 hover:bg-sky-700 text-white rounded-full shadow-md border-2 border-white transition-transform group-hover:scale-110 cursor-pointer"
                title="Upload / Change profile photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Student Info */}
            <div className="space-y-1.5 flex-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit'] flex items-center gap-2">
                <span>Welcome back, {studentName}</span>
                {isProfileVerified && (
                  <span 
                    className="inline-flex items-center transition-transform hover:scale-110 cursor-help" 
                    title="Verified Student Profile • All institutional academic documents verified by Registrar"
                  >
                    <svg className="w-6 h-6 text-sky-500 fill-sky-500 shrink-0 drop-shadow-xs" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M8.6 2.25A3.375 3.375 0 0 0 5.36 4.39 3.375 3.375 0 0 0 3.25 7.6a3.375 3.375 0 0 0 .96 3.19 3.375 3.375 0 0 0-.96 3.2 3.375 3.375 0 0 0 2.11 3.2 3.375 3.375 0 0 0 3.24 2.14 3.375 3.375 0 0 0 3.2 1.42 3.375 3.375 0 0 0 3.2-1.42 3.375 3.375 0 0 0 3.24-2.13 3.375 3.375 0 0 0 2.11-3.21 3.375 3.375 0 0 0-.96-3.2 3.375 3.375 0 0 0 .96-3.19 3.375 3.375 0 0 0-2.11-3.21 3.375 3.375 0 0 0-3.24-2.14 3.375 3.375 0 0 0-3.2-1.42 3.375 3.375 0 0 0-3.2 1.42Z" clipRule="evenodd" />
                      <path fill="#ffffff" d="m10.25 14.5-2.25-2.25 1.06-1.06 1.19 1.19 4.44-4.44 1.06 1.06-5.5 5.5Z" />
                    </svg>
                  </span>
                )}
              </h1>

              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {currentUser?.branch || 'Academic Track'}{currentUser?.college ? ` • ${currentUser.college}` : ''} • ID: {studentRollNo}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                  Semester 8 (2026 Batch)
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-semibold text-[11px]">
                  CGPA: 8.84
                </span>
              </div>
            </div>
          </div>

          {/* Attractive View Academic Transcripts Button */}
          <div className="w-full sm:w-auto shrink-0 pt-2 lg:pt-0">
            <button
              type="button"
              onClick={() => setShowDocModal(true)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-semibold text-xs shadow-sm hover:shadow-md flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer group"
            >
              <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform" />
              </div>
              <span className="tracking-tight">View Academic Transcripts</span>
              <span className="px-2 py-0.5 rounded-full bg-white/25 text-white text-[11px] font-bold">
                {academicDocuments.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards Row - Interactive & Clickable */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Placement Readiness Card */}
        <div 
          onClick={() => setActiveStatsModal('readiness')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-sky-400 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
          title="Click to view full Skill Competency & Diagnostic breakdown"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500">Placement Readiness</span>
            <span className="text-[10px] text-sky-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
              View &rarr;
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-['Outfit'] group-hover:text-sky-600 transition-colors">78%</div>
          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Diagnostic Benchmark Score
          </span>
        </div>

        {/* Active Applications Card */}
        <div 
          onClick={() => setActiveStatsModal('applications')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-sky-400 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
          title="Click to view live job applications and tracking status"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500">Active Applications</span>
            <span className="text-[10px] text-sky-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
              View &rarr;
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-['Outfit'] group-hover:text-sky-600 transition-colors">
            {liveApplicationsList.length}
          </div>
          <span className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
            Tracked in real-time
          </span>
        </div>

        {/* Shortlisted Pool Card */}
        <div 
          onClick={() => setActiveStatsModal('shortlisted')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-sky-400 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
          title="Click to view shortlisted companies & interview rounds"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500">Shortlisted Pool</span>
            <span className="text-[10px] text-sky-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
              View &rarr;
            </span>
          </div>
          <div className="text-3xl font-extrabold text-sky-600 font-['Outfit']">2</div>
          <span className="text-[11px] text-slate-500 truncate block mt-1">Google Cloud, TCS Research</span>
        </div>

        {/* Placement Offers Card */}
        <div 
          onClick={() => setActiveStatsModal('offers')}
          className="bg-white p-5 rounded-xl border border-emerald-300 bg-emerald-50/20 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
          title="Click to view verified placement offers and employment agreements"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-600">Placement Offers</span>
            <span className="text-[10px] text-emerald-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
              View &rarr;
            </span>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 font-['Outfit']">1</div>
          <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            Verified Offer: ₹10 LPA
          </span>
        </div>
      </div>

      {/* Student Workspace Sub-Navigation: Opportunities Explorer vs Profile Enhancement */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 p-1 bg-slate-100/90 rounded-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveMainSection('jobs')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeMainSection === 'jobs'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-sky-600" />
            <span>Opportunities Explorer</span>
            <span className="px-1.5 py-0.2 rounded-full bg-sky-100 text-sky-700 text-[10px] font-extrabold">
              {jobs.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainSection('portfolio')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeMainSection === 'portfolio'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Academic & Professional Portfolio</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-extrabold">
              Enhanced
            </span>
          </button>
        </div>

        {/* Recruiter Visibility Toggle Badge */}
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs self-stretch sm:self-auto justify-between sm:justify-start">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${recruiterVisibility ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
            <span className="text-slate-600 font-medium">Recruiter Discovery:</span>
          </div>
          <button
            type="button"
            onClick={handleToggleRecruiterVisibility}
            className={`font-bold px-2 py-0.5 rounded text-[11px] cursor-pointer transition ${
              recruiterVisibility ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
            }`}
            title="Click to toggle recruiter visibility"
          >
            {recruiterVisibility ? 'Public (Visible)' : 'Private (Hidden)'}
          </button>
        </div>
      </div>

      {/* VIEW 1: OPPORTUNITIES EXPLORER */}
      {activeMainSection === 'jobs' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recommended Opportunities */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900 font-['Outfit']">Recommended Opportunities</h2>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                    {jobs.length} Active Openings
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Curated campus drives, high-growth tech roles & 100% free virtual externships
                </p>
              </div>

              {/* View All Openings Button */}
              <button
                type="button"
                onClick={() => setShowAllJobs(!showAllJobs)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-xs shadow-sm hover:shadow-md flex items-center justify-center gap-2 transition-all duration-200 shrink-0 cursor-pointer group"
              >
                <Briefcase className="w-3.5 h-3.5 text-sky-200 group-hover:scale-110 transition-transform" />
                <span>{showAllJobs ? 'Show Top 3 Recommendations' : `View All ${jobs.length} Openings`}</span>
                <ArrowRight className={`w-3.5 h-3.5 transition-transform ${showAllJobs ? '-rotate-90' : 'rotate-0 group-hover:translate-x-0.5'}`} />
              </button>
            </div>

            {/* Filter Pills when All Openings is opened */}
            {showAllJobs && (
              <div className="flex items-center gap-2 flex-wrap bg-slate-50/80 p-2.5 rounded-xl border border-slate-200 text-xs animate-fade-in">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">Filter:</span>
                <button
                  type="button"
                  onClick={() => setJobTypeFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    jobTypeFilter === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  All Openings ({jobs.length})
                </button>

                <button
                  type="button"
                  onClick={() => setJobTypeFilter('paid')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    jobTypeFilter === 'paid'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  💼 Placement Drives ({jobs.filter(j => !j.isFree).length})
                </button>

                <button
                  type="button"
                  onClick={() => setJobTypeFilter('free')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    jobTypeFilter === 'free'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  🎁 Free Tracks & Externships ({jobs.filter(j => j.isFree).length})
                </button>
              </div>
            )}

            {/* Job Opportunities Cards List */}
            <div className="space-y-3.5">
              {(showAllJobs 
                ? jobs.filter(j => jobTypeFilter === 'all' || (jobTypeFilter === 'free' ? j.isFree : !j.isFree))
                : jobs.slice(0, 3)
              ).map(job => {
                const isApplied = appliedJobs.includes(job.id);
                return (
                  <div 
                    key={job.id} 
                    className={`p-5 rounded-2xl flex flex-col justify-between gap-4 transition-all duration-200 ${
                      job.isFree
                        ? 'bg-gradient-to-br from-emerald-50/30 via-white to-sky-50/20 border-2 border-emerald-200/90 shadow-xs hover:border-emerald-300'
                        : 'bg-white border border-slate-200 shadow-xs hover:border-sky-300'
                    }`}
                  >
                    <div className="space-y-2 flex-1">
                      {/* Top Badges: Role, Match, Work Type & Free/Paid */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-slate-900">{job.title}</h3>
                          <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-bold">
                            {job.matchScore}% Match
                          </span>
                          
                          {/* Work Type Badge (Remote, Hybrid, On-site) */}
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            job.workType === 'Remote'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : job.workType === 'Hybrid'
                              ? 'bg-sky-50 text-sky-700 border-sky-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {job.workType}
                          </span>

                          {job.isFree ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-extrabold flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-emerald-600" />
                              {job.badge}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                              {job.badge}
                            </span>
                          )}
                        </div>

                        <span className={`text-xs font-bold ${job.isFree ? 'text-emerald-700' : 'text-slate-900'}`}>
                          {job.stipend}
                        </span>
                      </div>

                      {/* Company Profile, Industry & Location */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium flex-wrap">
                        <span className="font-bold text-slate-800">{job.company}</span>
                        <span>•</span>
                        <span className="text-slate-600">{job.industry}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {job.location}
                        </span>
                      </div>

                      {/* Brief Role Overview */}
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {job.overview}
                      </p>

                      {/* Requirements & Criteria Quick Pills */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
                        <span className="bg-slate-100 px-2 py-0.5 rounded font-medium text-slate-700">
                          🎓 Criteria: {job.requirements?.minGpa}
                        </span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded font-medium text-slate-700">
                          📅 {job.requirements?.graduatingYears}
                        </span>
                      </div>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {job.skills.map((s, idx) => (
                          <span key={idx} className="px-2.5 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Dual Action Buttons: View Details & Apply Now */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => setSelectedJobForDetails(job)}
                        className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>View Details</span>
                      </button>

                      <button
                        disabled={isApplied}
                        onClick={() => handleApply(job)}
                        className={`px-5 py-2 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                          isApplied
                            ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-default'
                            : job.isFree
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs hover:shadow'
                            : 'bg-sky-600 hover:bg-sky-700 text-white shadow-xs hover:shadow'
                        }`}
                      >
                        {isApplied ? '✓ Applied' : (job.isFree ? 'Enroll Free Track' : 'Apply Now')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom toggle card if viewing only 3 */}
            {!showAllJobs && (
              <div 
                onClick={() => setShowAllJobs(true)}
                className="p-4 rounded-xl border border-dashed border-sky-300 bg-sky-50/40 hover:bg-sky-50 transition cursor-pointer text-center group"
              >
                <p className="text-xs font-semibold text-sky-800 flex items-center justify-center gap-2">
                  <span>+ {jobs.length - 3} more opportunities available (including 100% Free tracks & Govt fellowships)</span>
                  <span className="font-bold underline group-hover:text-sky-900">View All Openings &rarr;</span>
                </p>
              </div>
            )}
          </div>

        {/* Skill Progress & Interview Alert */}
        <div className="space-y-6">
          {/* Skill Profile Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Skill Competency Index</h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">Python & Algorithms</span>
                  <span className="text-slate-900 font-bold">85%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-purple-600 h-full rounded-full" style={{ width: '85%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">Machine Learning & AI</span>
                  <span className="text-slate-900 font-bold">70%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full rounded-full" style={{ width: '70%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">SQL & Databases</span>
                  <span className="text-slate-900 font-bold">75%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full rounded-full" style={{ width: '75%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-rose-600 font-medium">Cloud & DevOps (Identified Gap)</span>
                  <span className="text-rose-600 font-bold">40%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: '40%' }} />
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('diagnostic')}
              className="w-full py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold text-center transition cursor-pointer"
            >
              Analyze & Bridge Gaps &rarr;
            </button>
          </div>

          {/* Upcoming Interview Card */}
          <div className="bg-white p-6 rounded-2xl border-l-4 border-l-sky-600 border-t border-r border-b border-slate-200 shadow-xs space-y-3">
            <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block">Upcoming Interview</span>
            <h4 className="text-sm font-bold text-slate-900 font-['Outfit']">Google Cloud Solutions</h4>
            <p className="text-xs text-slate-500">Role: AI/ML Research Intern</p>
            <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> Tomorrow at 11:00 AM IST (Google Meet)
            </div>

            <button
              onClick={() => setActiveTab('coach')}
              className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-sm transition cursor-pointer"
            >
              Practice with AI Career Coach
            </button>
          </div>
        </div>
      </div>
      )}

      {/* VIEW 2: ACADEMIC & PROFESSIONAL PORTFOLIO (PROFILE ENHANCEMENT) */}
      {activeMainSection === 'portfolio' && (
        <div className="space-y-6 animate-fade-in">
          {/* Recruiter Visibility Banner */}
          <div className={`p-5 rounded-2xl border transition-all ${
            recruiterVisibility 
              ? 'bg-gradient-to-r from-emerald-900 via-slate-900 to-sky-900 text-white border-emerald-500/40 shadow-sm'
              : 'bg-slate-100 text-slate-800 border-slate-300'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${recruiterVisibility ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`}></span>
                  <h3 className="text-base font-bold font-['Outfit']">
                    Corporate Recruiter Visibility Status: {recruiterVisibility ? 'Active & Visible' : 'Private'}
                  </h3>
                </div>
                <p className={`text-xs ${recruiterVisibility ? 'text-emerald-100' : 'text-slate-600'} max-w-2xl`}>
                  {recruiterVisibility 
                    ? 'Your verified academic credentials, projects showcase, and verified skill diagnostics are visible to campus recruiters and enterprise talent acquisition teams.'
                    : 'Your portfolio is currently hidden from corporate searches. Only companies you directly apply to can view your credentials.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggleRecruiterVisibility}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm cursor-pointer shrink-0 ${
                  recruiterVisibility 
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {recruiterVisibility ? '✓ Visible to Recruiters' : 'Make Profile Public'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Social Links & Skills Matrix */}
            <div className="space-y-6">
              {/* Social Media & Professional Profiles */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-sky-600" />
                    <h3 className="text-sm font-bold text-slate-900 font-['Outfit']">Professional Profiles</h3>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Publicly Verified</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">LinkedIn Profile</label>
                    <input 
                      type="url" 
                      value={portfolioLinks.linkedin}
                      onChange={(e) => setPortfolioLinks({ ...portfolioLinks, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">GitHub Profile</label>
                    <input 
                      type="url" 
                      value={portfolioLinks.github}
                      onChange={(e) => setPortfolioLinks({ ...portfolioLinks, github: e.target.value })}
                      placeholder="https://github.com/username"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Portfolio Website</label>
                    <input 
                      type="url" 
                      value={portfolioLinks.portfolio}
                      onChange={(e) => setPortfolioLinks({ ...portfolioLinks, portfolio: e.target.value })}
                      placeholder="https://yourportfolio.dev"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Twitter / X Handle</label>
                    <input 
                      type="url" 
                      value={portfolioLinks.twitter}
                      onChange={(e) => setPortfolioLinks({ ...portfolioLinks, twitter: e.target.value })}
                      placeholder="https://x.com/username"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-500 font-mono"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveLinks}
                    className="w-full mt-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Save Professional Links</span>
                  </button>
                </div>
              </div>

              {/* Skills Matrix (Tag-based Interface) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-sky-600" />
                    <h3 className="text-sm font-bold text-slate-900 font-['Outfit']">Skills Matrix</h3>
                  </div>
                  <span className="text-[11px] font-bold text-sky-600">{skillTags.length} Tags</span>
                </div>

                {/* Add Skill Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddSkill('Technical'); }}
                    placeholder="Type skill & press Enter..."
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill('Technical')}
                    className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shrink-0 cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Technical Skills Tags */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Technical Competencies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {skillTags.filter(s => s.category === 'Technical').map((skill, idx) => (
                      <span 
                        key={idx} 
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-200 text-sky-800 text-xs font-medium group"
                      >
                        <span>{skill.name}</span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveSkill(skill.name)}
                          className="text-sky-400 hover:text-sky-700 cursor-pointer text-xs"
                          title="Remove skill"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Soft Skills Tags */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Professional & Soft Skills
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {skillTags.filter(s => s.category === 'Soft Skill').map((skill, idx) => (
                      <span 
                        key={idx} 
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium group"
                      >
                        <span>{skill.name}</span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveSkill(skill.name)}
                          className="text-emerald-400 hover:text-emerald-700 cursor-pointer text-xs"
                          title="Remove skill"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right 2 Columns: Projects Showcase & Certificates */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Projects Showcase */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-sky-600" />
                    <div>
                      <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Projects Showcase</h3>
                      <p className="text-xs text-slate-500">Academic capstones, open-source repositories & engineering demos</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddProjectForm(!showAddProjectForm)}
                    className="px-3.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddProjectForm ? 'Close Form' : 'Add Project'}</span>
                  </button>
                </div>

                {/* Add Project Form */}
                {showAddProjectForm && (
                  <form onSubmit={handleAddProject} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3 animate-fade-in">
                    <h4 className="font-bold text-slate-900 text-xs">Add New Engineering Project</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Project Title *</label>
                        <input
                          type="text"
                          required
                          value={newProject.title}
                          onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                          placeholder="e.g. Distributed Task Scheduler"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-sky-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tech Stack (comma separated)</label>
                        <input
                          type="text"
                          value={newProject.techStack}
                          onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
                          placeholder="e.g. React 19, Python, Docker"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-sky-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Detailed Description</label>
                      <textarea
                        rows={2}
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        placeholder="Key technical accomplishments, algorithms implemented, and benchmarks achieved..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">GitHub / Code Repository URL</label>
                        <input
                          type="url"
                          value={newProject.githubUrl}
                          onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                          placeholder="https://github.com/..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-sky-500 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Live Demo URL (Optional)</label>
                        <input
                          type="url"
                          value={newProject.demoUrl}
                          onChange={(e) => setNewProject({ ...newProject, demoUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-sky-500 font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddProjectForm(false)}
                        className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition cursor-pointer"
                      >
                        Save Project
                      </button>
                    </div>
                  </form>
                )}

                {/* Projects List */}
                <div className="space-y-3">
                  {projectsList.map((project) => (
                    <div key={project.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-white transition space-y-2.5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{project.title}</h4>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{project.description}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-slate-400 hover:text-rose-600 transition p-1 cursor-pointer shrink-0"
                          title="Delete project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack.map((tech, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 text-[10px] font-semibold">
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Action Links */}
                      <div className="pt-1 flex items-center gap-3 text-xs">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-600 hover:text-sky-800 font-semibold flex items-center gap-1"
                          >
                            <span>GitHub Code</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1"
                          >
                            <span>Live Demo</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certificates & Achievements */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-600" />
                    <div>
                      <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Certificates & Achievements</h3>
                      <p className="text-xs text-slate-500">Verified course certifications, hackathon awards & professional credentials</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddCertForm(!showAddCertForm)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddCertForm ? 'Close Form' : 'Add Certificate'}</span>
                  </button>
                </div>

                {/* Add Certificate Form */}
                {showAddCertForm && (
                  <form onSubmit={handleAddCertificate} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3 animate-fade-in">
                    <h4 className="font-bold text-slate-900 text-xs">Add Verified Certificate</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Certificate Title *</label>
                        <input
                          type="text"
                          required
                          value={newCert.title}
                          onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                          placeholder="e.g. Certified Kubernetes Administrator"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-sky-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Issuing Organization *</label>
                        <input
                          type="text"
                          required
                          value={newCert.issuer}
                          onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                          placeholder="e.g. CNCF & Linux Foundation"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-sky-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Issue Date</label>
                        <input
                          type="text"
                          value={newCert.issueDate}
                          onChange={(e) => setNewCert({ ...newCert, issueDate: e.target.value })}
                          placeholder="e.g. August 2025"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-sky-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Credential Verification URL</label>
                        <input
                          type="url"
                          value={newCert.credentialUrl}
                          onChange={(e) => setNewCert({ ...newCert, credentialUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-sky-500 font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddCertForm(false)}
                        className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
                      >
                        Save Certificate
                      </button>
                    </div>
                  </form>
                )}

                {/* Certificates List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {certificatesList.map((cert) => (
                    <div key={cert.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition space-y-2 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{cert.title}</h4>
                          <button
                            type="button"
                            onClick={() => handleDeleteCertificate(cert.id)}
                            className="text-slate-400 hover:text-rose-600 transition p-0.5 cursor-pointer shrink-0"
                            title="Delete certificate"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">{cert.issuer} • {cert.issueDate}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Verified Credential
                        </span>
                        {cert.credentialUrl && cert.credentialUrl !== '#' && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-600 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <span>Verify</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ACADEMIC CREDENTIAL VAULT MODAL */}
      {/* ========================================================================= */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-fade-in">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-sky-800 to-[#082f49] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-lg">
                  🎓
                </div>
                <div>
                  <h3 className="font-bold text-sm">Academic Credential Vault</h3>
                  <p className="text-[10px] text-sky-100">National Institute of Technology • Registrar Verified Documents</p>
                </div>
              </div>
              <button
                onClick={() => setShowDocModal(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Verified Academic Transcripts & Records</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Roll Number: {studentRollNo} • Department of Computer Science & Engineering
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Registrar Verified
                </span>
              </div>

              {/* Documents list */}
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {academicDocuments.map((doc) => (
                  <div 
                    key={doc.id}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-sky-300 bg-slate-50/50 hover:bg-white transition flex items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                        <FileCheck2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-900">{doc.title}</h5>
                        <p className="text-[11px] text-slate-500">{doc.issuer} • {doc.date}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium border border-emerald-100">
                            {doc.grade}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            ID: {doc.docId}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedDoc(doc)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-sky-600 hover:bg-sky-50 text-xs font-semibold shrink-0 cursor-pointer"
                    >
                      View Record
                    </button>
                  </div>
                ))}
              </div>

              {/* Preview of selected document metadata */}
              {selectedDoc && (
                <div className="p-3.5 bg-slate-900 text-slate-200 rounded-xl text-[11px] space-y-1.5">
                  <div className="flex justify-between text-slate-300 border-b border-slate-800 pb-1">
                    <span className="font-bold text-white">{selectedDoc.title}</span>
                    <span className="text-emerald-400 font-mono">VERIFIED_ORIGINAL</span>
                  </div>
                  <div className="text-slate-300 text-xs">Issuer: {selectedDoc.issuer}</div>
                  <div className="text-emerald-300 font-mono text-xs">Academic Performance: {selectedDoc.grade}</div>
                  <div className="text-slate-300 text-[10px] font-mono">Status: {selectedDoc.status}</div>
                </div>
              )}

              <div className="pt-2 flex justify-end items-center border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDocModal(false)}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                >
                  Close Vault
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Interactive Live Stats Details Modal */}
      {activeStatsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header with Navigation Tabs */}
            <div className="p-5 border-b border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                    {activeStatsModal === 'applications' && <Briefcase className="w-4 h-4 text-sky-600" />}
                    {activeStatsModal === 'shortlisted' && <Award className="w-4 h-4 text-sky-600" />}
                    {activeStatsModal === 'offers' && <Sparkles className="w-4 h-4 text-emerald-600" />}
                    {activeStatsModal === 'readiness' && <TrendingUp className="w-4 h-4 text-sky-600" />}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                      {activeStatsModal === 'applications' && 'Active Applications Tracking'}
                      {activeStatsModal === 'shortlisted' && 'Shortlisted Interview Pool'}
                      {activeStatsModal === 'offers' && 'Verified Placement Offers'}
                      {activeStatsModal === 'readiness' && 'Placement Readiness Diagnostic'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {activeStatsModal === 'applications' && 'Real-time pipeline of campus & corporate opportunities'}
                      {activeStatsModal === 'shortlisted' && 'Companies that advanced your verified profile to interview rounds'}
                      {activeStatsModal === 'offers' && 'Institutionally authenticated job offers and employment contracts'}
                      {activeStatsModal === 'readiness' && 'Benchmark scores across core competencies against hiring standards'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveStatsModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition self-end sm:self-auto cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-navigation tabs to quickly switch between the 4 cards */}
            <div className="flex border-b border-slate-200 px-5 pt-2 bg-white gap-2 overflow-x-auto text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveStatsModal('applications')}
                className={`pb-2.5 px-3 border-b-2 transition whitespace-nowrap cursor-pointer ${
                  activeStatsModal === 'applications'
                    ? 'border-sky-600 text-sky-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Applications ({liveApplicationsList.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveStatsModal('shortlisted')}
                className={`pb-2.5 px-3 border-b-2 transition whitespace-nowrap cursor-pointer ${
                  activeStatsModal === 'shortlisted'
                    ? 'border-sky-600 text-sky-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Shortlisted ({shortlistedList.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveStatsModal('offers')}
                className={`pb-2.5 px-3 border-b-2 transition whitespace-nowrap cursor-pointer ${
                  activeStatsModal === 'offers'
                    ? 'border-emerald-600 text-emerald-700 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Offers (1)
              </button>

              <button
                type="button"
                onClick={() => setActiveStatsModal('readiness')}
                className={`pb-2.5 px-3 border-b-2 transition whitespace-nowrap cursor-pointer ${
                  activeStatsModal === 'readiness'
                    ? 'border-sky-600 text-sky-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Readiness (78%)
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              
              {/* TAB 1: ACTIVE APPLICATIONS (Job Applications & Pipeline Tracker) */}
              {activeStatsModal === 'applications' && (
                <div className="space-y-4">
                  {/* Summary Metric Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Submissions</span>
                      <span className="text-xl font-extrabold text-slate-900 font-['Outfit']">{liveApplicationsList.length}</span>
                    </div>
                    <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl">
                      <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Under Review</span>
                      <span className="text-xl font-extrabold text-amber-800 font-['Outfit']">
                        {liveApplicationsList.filter(a => a.category === 'review').length}
                      </span>
                    </div>
                    <div className="p-3 bg-sky-50/60 border border-sky-200/80 rounded-xl">
                      <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider block">Shortlisted</span>
                      <span className="text-xl font-extrabold text-sky-800 font-['Outfit']">
                        {liveApplicationsList.filter(a => a.category === 'shortlisted').length}
                      </span>
                    </div>
                    <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-xl">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Offers Extended</span>
                      <span className="text-xl font-extrabold text-emerald-800 font-['Outfit']">
                        {liveApplicationsList.filter(a => a.category === 'offers').length}
                      </span>
                    </div>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 flex-wrap text-xs pb-1 border-b border-slate-100">
                    <span className="text-slate-400 font-medium text-[11px] flex items-center gap-1 mr-1">
                      <Filter className="w-3.5 h-3.5" /> Filter:
                    </span>
                    <button
                      type="button"
                      onClick={() => setAppFilter('all')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        appFilter === 'all'
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      All ({liveApplicationsList.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAppFilter('review')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        appFilter === 'review'
                          ? 'bg-amber-600 text-white'
                          : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                      }`}
                    >
                      Under Review ({liveApplicationsList.filter(a => a.category === 'review').length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAppFilter('shortlisted')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        appFilter === 'shortlisted'
                          ? 'bg-sky-600 text-white'
                          : 'bg-sky-50 text-sky-800 hover:bg-sky-100'
                      }`}
                    >
                      Shortlisted ({liveApplicationsList.filter(a => a.category === 'shortlisted').length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAppFilter('offers')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        appFilter === 'offers'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      Offers ({liveApplicationsList.filter(a => a.category === 'offers').length})
                    </button>
                  </div>

                  {/* Application Cards List */}
                  <div className="space-y-3">
                    {liveApplicationsList
                      .filter(app => appFilter === 'all' || app.category === appFilter)
                      .map((app) => (
                        <div 
                          key={app.id} 
                          className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                                  {app.appRef}
                                </span>
                                <span className="text-[11px] text-slate-400">
                                  Submitted: {app.appliedDate}
                                </span>
                              </div>
                              <h4 className="text-sm font-bold text-slate-900 mt-1">{app.title}</h4>
                              <p className="text-xs text-slate-500 font-medium">
                                {app.company} • {app.location}
                              </p>
                            </div>

                            <div className="text-left sm:text-right shrink-0">
                              <span className="text-xs font-bold text-slate-900 block">{app.stipend}</span>
                              <span className="text-[11px] font-semibold text-sky-600">
                                {app.matchScore}% Skill Match
                              </span>
                            </div>
                          </div>

                          {/* Live Status and Timeline Milestone */}
                          <div className="space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                              <div className="flex items-center gap-1.5">
                                <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${app.statusColor}`}>
                                  {app.status}
                                </span>
                                <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-medium flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3" /> Transcripts Synced
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-500 font-medium">
                                {app.stage}
                              </span>
                            </div>

                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                  app.progressStep === 4 ? 'bg-emerald-500' : 'bg-sky-500'
                                }`} 
                                style={{ width: `${(app.progressStep / 4) * 100}%` }}
                              />
                            </div>

                            <div className="flex justify-between text-[10px] text-slate-400">
                              <span className={app.progressStep >= 1 ? 'text-sky-600 font-bold' : ''}>1. Applied</span>
                              <span className={app.progressStep >= 2 ? 'text-sky-600 font-bold' : ''}>2. Screening</span>
                              <span className={app.progressStep >= 3 ? 'text-sky-600 font-bold' : ''}>3. Shortlisted</span>
                              <span className={app.progressStep >= 4 ? 'text-emerald-600 font-bold' : ''}>4. Offer Extended</span>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                            <button
                              type="button"
                              onClick={() => {
                                setToast(`Official submission acknowledgment copied for ${app.appRef}`);
                                setTimeout(() => setToast(null), 3000);
                              }}
                              className="text-slate-500 hover:text-slate-800 font-medium text-[11px] flex items-center gap-1 cursor-pointer"
                            >
                              <FileText className="w-3 h-3" /> View Application Slip
                            </button>

                            {app.category === 'shortlisted' && (
                              <button
                                type="button"
                                onClick={() => setActiveStatsModal('shortlisted')}
                                className="px-3 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold text-xs transition cursor-pointer"
                              >
                                View Interview Details &rarr;
                              </button>
                            )}

                            {app.category === 'offers' && (
                              <button
                                type="button"
                                onClick={() => setActiveStatsModal('offers')}
                                className="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs transition cursor-pointer"
                              >
                                View Placement Offer &rarr;
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* TAB 2: SHORTLISTED POOL (Recruiter Interview Command Center) */}
              {activeStatsModal === 'shortlisted' && (
                <div className="space-y-4">
                  {/* Highlight Banner */}
                  <div className="p-4 bg-gradient-to-r from-sky-900 to-indigo-900 text-white rounded-2xl shadow-sm space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      <span className="text-[11px] font-bold text-sky-300 uppercase tracking-wider">
                        Recruiter Selection Command Desk
                      </span>
                    </div>
                    <h4 className="text-base font-bold font-['Outfit']">
                      You have 2 active corporate shortlists in progress
                    </h4>
                    <p className="text-xs text-sky-200">
                      Recruiters evaluated your Digilocker-verified transcripts and advanced your profile directly into assessment rounds.
                    </p>
                  </div>

                  {/* Company 1: Google Cloud India (Upcoming Live Interview) */}
                  <div className="p-5 rounded-2xl border-2 border-sky-300 bg-gradient-to-br from-sky-50/40 via-white to-indigo-50/20 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-slate-900">Google Cloud India</h4>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                            Interview Scheduled
                          </span>
                        </div>
                        <p className="text-xs text-sky-700 font-semibold mt-0.5">
                          AI/ML Research Intern • Bengaluru (Hybrid) • ₹60,000/month
                        </p>
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold animate-pulse">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Starts in 18 hrs</span>
                      </div>
                    </div>

                    {/* Interview Schedule Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Evaluation Round
                        </span>
                        <p className="font-bold text-slate-900">Round 2: Algorithmic & Systems Live Coding</p>
                        <span className="text-[11px] text-slate-500 block">Duration: 60 minutes • 1-on-1</span>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Technical Assessor
                        </span>
                        <p className="font-bold text-slate-900">Dr. Rajesh Sen</p>
                        <span className="text-[11px] text-slate-500 block">Senior Staff ML Engineer, Google Cloud</span>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Scheduled Date & Time
                        </span>
                        <p className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-sky-600" />
                          Tomorrow (08 Sep 2026), 03:30 PM IST
                        </p>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Verified Sourced Candidate
                        </span>
                        <p className="font-bold text-emerald-700 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> NIT Transcript Auto-Synced
                        </p>
                      </div>
                    </div>

                    {/* Syllabus Focus Checklist */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Assessor Focus Areas & Syllabus
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700">
                          Distributed PyTorch (94% Match)
                        </span>
                        <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700">
                          Graph Neural Networks
                        </span>
                        <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700">
                          Python Concurrency & AsyncIO
                        </span>
                      </div>
                    </div>

                    {/* Pre-Interview Checklist */}
                    <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs space-y-1.5 text-amber-900">
                      <span className="font-bold block flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                        Candidate Pre-Flight Checklist:
                      </span>
                      <ul className="list-disc list-inside text-[11px] text-amber-800 space-y-0.5">
                        <li>Transcripts and CGPA (8.84) are pre-verified with the recruiter.</li>
                        <li>Keep your NIT student identity card (Roll: 22BCSE104) ready for visual check.</li>
                        <li>Join the Google Meet room 10 minutes before for camera and mic testing.</li>
                      </ul>
                    </div>

                    {/* Direct Action Buttons */}
                    <div className="pt-1 flex flex-col sm:flex-row items-center justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setToast("Calendar invite downloaded: Google Cloud Technical Interview (08 Sep, 3:30 PM)");
                          setTimeout(() => setToast(null), 3500);
                        }}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Add to Google Calendar</span>
                      </button>

                      <a
                        href="https://meet.google.com/acd-xpr-opt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
                      >
                        <Video className="w-4 h-4" />
                        <span>Join Live Google Meet Room</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Company 2: TCS Research (All Rounds Cleared - Offer Issued) */}
                  <div className="p-5 rounded-2xl border border-emerald-300 bg-gradient-to-br from-emerald-50/50 via-white to-slate-50 shadow-sm space-y-3.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-slate-900">Tata Consultancy Services (Research)</h4>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Candidate Selected
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-semibold mt-0.5">
                          Full Stack Platform Engineer • Pune / Remote • ₹10 LPA
                        </p>
                      </div>

                      <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold inline-flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        All 3 Rounds Cleared
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Assessment Committee Evaluation
                      </span>
                      <p className="text-slate-800">
                        "Candidate scored in the <strong>Top 2nd percentile</strong> during the on-campus systems architecture round. Exceptional mastery demonstrated in React 19 architecture and Django REST microservices."
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-emerald-800 font-medium">
                        Verified Offer Letter Dispatched by Registrar Office
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveStatsModal('offers')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>View Official ₹10 LPA Offer Letter &rarr;</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PLACEMENT OFFERS */}
              {activeStatsModal === 'offers' && (
                <div className="space-y-4">
                  {offerAccepted && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 animate-fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <strong>Offer Formally Accepted & Locked!</strong> Recorded in the Dean Placement cell repository.
                      </div>
                    </div>
                  )}

                  {/* Official Offer Letter Card */}
                  <div className="p-5 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50/40 via-white to-sky-50/20 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                          TCS
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-slate-900">{offerDetails.company}</h4>
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold border border-emerald-200">
                              Verified Institutional Offer
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 font-semibold">{offerDetails.role}</p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="text-xl font-extrabold text-emerald-700 font-['Outfit']">{offerDetails.ctc}</div>
                        <span className="text-[10px] text-slate-500">Annual Gross Compensation</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-[11px] text-slate-500 block mb-0.5 font-medium">Compensation Breakdown</span>
                        <span className="text-slate-800 font-semibold">{offerDetails.breakdown}</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-[11px] text-slate-500 block mb-0.5 font-medium">Work Location</span>
                        <span className="text-slate-800 font-semibold">{offerDetails.location}</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-[11px] text-slate-500 block mb-0.5 font-medium">Expected Joining Date</span>
                        <span className="text-slate-800 font-semibold">{offerDetails.joiningDate}</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-[11px] text-slate-500 block mb-0.5 font-medium">Offer Acceptance Deadline</span>
                        <span className="text-amber-700 font-bold">{offerDetails.deadline}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Fingerprint className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <div className="font-mono text-emerald-300 font-semibold">Ref: {offerDetails.offerLetterId}</div>
                          <div className="text-[10px] text-slate-400">{offerDetails.verificationStamp}</div>
                        </div>
                      </div>
                      <span className="text-emerald-400 font-mono text-[10px] uppercase font-bold">DIGITALLY_SEALED</span>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setToast("Official Offer Letter PDF (TCS-RES-2026-OFFER-8842) downloaded successfully.");
                          setTimeout(() => setToast(null), 3500);
                        }}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Offer Letter (PDF)</span>
                      </button>

                      {!offerAccepted ? (
                        <button
                          type="button"
                          onClick={() => {
                            setOfferAccepted(true);
                            setToast(`Congratulations ${studentName}! Research placement offer officially accepted & recorded.`);
                            setTimeout(() => setToast(null), 4000);
                          }}
                          className="w-full sm:w-auto px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Accept Offer Letter</span>
                        </button>
                      ) : (
                        <span className="px-4 py-2 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Accepted on 07 Sep 2026
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: PLACEMENT READINESS */}
              {activeStatsModal === 'readiness' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Overall Benchmark Score</span>
                      <div className="text-3xl font-extrabold text-slate-900 font-['Outfit'] mt-0.5">
                        78<span className="text-lg text-slate-400 font-medium">/100</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Ranked in the <strong>Top 8th percentile</strong> among CSE batch 2026 at NIT.
                      </p>
                    </div>

                    <div className="w-full sm:w-48 bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                      <div className="flex justify-between text-slate-500">
                        <span>Cohort Rank:</span>
                        <span className="font-bold text-slate-900">#9 / 180</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Eligibility Tier:</span>
                        <span className="font-bold text-emerald-600">Tier-1 Corporate</span>
                      </div>
                    </div>
                  </div>

                  {/* Competency breakdown */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Competency Domain Analysis</h4>
                    {readinessBreakdown.map((item, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-900">{item.skill}</span>
                            <span className="text-slate-400 text-[11px] block">{item.note}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-extrabold text-slate-900">{item.score}%</span>
                            <span className="text-[10px] text-slate-400 block">Target: {item.target}%</span>
                          </div>
                        </div>

                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`${item.color} h-full rounded-full transition-all duration-500`}
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof setActiveTab === 'function') {
                          setActiveTab('career-coach');
                        }
                        setActiveStatsModal(null);
                        setToast("Navigating to AI Career Coach & Skill Diagnostics...");
                        setTimeout(() => setToast(null), 3000);
                      }}
                      className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Launch AI Career Coach & Remedial Roadmap</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                AcademicX Verified Records System • Real-Time Sync
              </span>
              <button
                type="button"
                onClick={() => setActiveStatsModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition cursor-pointer"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DETAILED JOB & INTERNSHIP OPPORTUNITY MODAL */}
      {/* ========================================================================= */}
      {selectedJobForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 bg-slate-50/80 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
                  {selectedJobForDetails.company.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                      {selectedJobForDetails.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-bold">
                      {selectedJobForDetails.matchScore}% Match
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      selectedJobForDetails.workType === 'Remote'
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : selectedJobForDetails.workType === 'Hybrid'
                        ? 'bg-sky-50 text-sky-700 border-sky-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {selectedJobForDetails.workType}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">
                    {selectedJobForDetails.company} • {selectedJobForDetails.industry}
                  </p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {selectedJobForDetails.location}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedJobForDetails(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Compensation & Work Mode Banner */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Compensation / Stipend</span>
                  <span className={`text-base font-extrabold ${selectedJobForDetails.isFree ? 'text-emerald-700' : 'text-slate-900'}`}>
                    {selectedJobForDetails.stipend}
                  </span>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Company Sector</span>
                  <span className="font-semibold text-slate-800">{selectedJobForDetails.industry}</span>
                </div>
              </div>

              {/* Role Overview */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Role Overview</h4>
                <p className="text-slate-600 leading-relaxed">{selectedJobForDetails.overview}</p>
              </div>

              {/* Key Responsibilities */}
              {selectedJobForDetails.responsibilities && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Key Responsibilities</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    {selectedJobForDetails.responsibilities.map((resp, idx) => (
                      <li key={idx} className="leading-relaxed">{resp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements & Academic Criteria */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Requirements & Eligibility</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                  <div>
                    <span className="font-semibold text-slate-500 block">Minimum Academic Criteria:</span>
                    <span className="font-bold text-slate-800">{selectedJobForDetails.requirements?.minGpa}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500 block">Eligible Graduating Years:</span>
                    <span className="font-bold text-slate-800">{selectedJobForDetails.requirements?.graduatingYears}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="font-semibold text-slate-500 block">Eligible Disciplines & Branches:</span>
                    <span className="font-bold text-slate-800">{selectedJobForDetails.requirements?.eligibleBranches}</span>
                  </div>
                </div>

                {/* Key Tools */}
                <div className="pt-1">
                  <span className="font-semibold text-slate-500 text-[11px] block mb-1.5">Key Technical Tools:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJobForDetails.requirements?.keyTools?.map((tool, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Company Profile Box */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">About {selectedJobForDetails.company}</h4>
                  {selectedJobForDetails.companyProfile?.website && (
                    <a
                      href={selectedJobForDetails.companyProfile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-600 hover:underline flex items-center gap-1 text-[11px] font-semibold"
                    >
                      <span>Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <p className="text-slate-600 leading-relaxed">{selectedJobForDetails.companyProfile?.about}</p>
                <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                  <span>🏢 Size: {selectedJobForDetails.companyProfile?.companySize}</span>
                  <span>📍 HQ: {selectedJobForDetails.companyProfile?.location}</span>
                </div>
              </div>

              {/* Compensation Details */}
              <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-xl text-[11px] text-emerald-800 space-y-0.5">
                <span className="font-bold block">Benefits & Compensation Package:</span>
                <p>{selectedJobForDetails.compensationDetails}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedJobForDetails(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Close View
              </button>

              {appliedJobs.includes(selectedJobForDetails.id) ? (
                <span className="px-5 py-2 rounded-xl bg-slate-200 text-slate-600 text-xs font-bold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Application Already Submitted
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setJobToApply(selectedJobForDetails);
                    setConfirmProfileChecked(true);
                  }}
                  className={`px-5 py-2 rounded-xl font-bold text-xs text-white shadow-sm transition cursor-pointer flex items-center gap-1.5 ${
                    selectedJobForDetails.isFree ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-sky-600 hover:bg-sky-700'
                  }`}
                >
                  <span>{selectedJobForDetails.isFree ? 'Enroll Free Track Now' : 'Apply for this Role'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* APPLICATION CONFIRMATION POP-UP MODAL */}
      {/* ========================================================================= */}
      {jobToApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            {/* Confirmation Header */}
            <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-sky-900 to-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold">
                  📝
                </div>
                <div>
                  <h3 className="text-sm font-bold font-['Outfit']">Confirm Application Submission</h3>
                  <p className="text-[11px] text-sky-200">Institutional Talent Dispatch Verification</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setJobToApply(null)}
                className="p-1.5 text-sky-200 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Confirmation Body */}
            <div className="p-5 space-y-4 text-xs">
              {/* Quick Summary of Role */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{jobToApply.title}</span>
                  <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold text-[10px]">
                    {jobToApply.matchScore}% Match
                  </span>
                </div>
                <p className="text-slate-600 font-medium">
                  {jobToApply.company} • {jobToApply.location} ({jobToApply.workType})
                </p>
                <p className="text-slate-800 font-bold text-[11px] pt-0.5">
                  Package/Stipend: <span className={jobToApply.isFree ? 'text-emerald-700 font-semibold' : 'text-slate-900'}>{jobToApply.stipend}</span>
                </p>
              </div>

              {/* Attached Documents Preview */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Auto-Attached Verified Documents
                </span>
                
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-sky-600 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-800 block text-[11px]">{studentName.replace(/\s+/g, '_')}_Verified_Resume.pdf</span>
                        <span className="text-[10px] text-slate-400">Institutional Template • Updated Sep 2026</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-100">
                      Auto-Attached
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-800 block text-[11px]">NIT Academic Transcripts (CGPA: 8.84)</span>
                        <span className="text-[10px] text-slate-400">Registrar Sealed • DigiLocker Verified</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-100">
                      Verified Vault
                    </span>
                  </div>
                </div>
              </div>

              {/* Recruiter Consent Notice */}
              <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-100 text-[11px] text-sky-800 space-y-1">
                <span className="font-bold block flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                  Tamper-Proof Data Transmittal
                </span>
                <p>
                  Your verified coursework grades, institutional transcript hash, and GitHub project portfolio will be securely transmitted to {jobToApply.company}'s campus recruitment board.
                </p>
              </div>

              {/* Confirmation Checkbox */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={confirmProfileChecked}
                  onChange={(e) => setConfirmProfileChecked(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                />
                <span className="text-xs text-slate-700 font-medium">
                  I confirm that my profile details, project links, and attached documents are accurate and up to date.
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setJobToApply(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!confirmProfileChecked}
                onClick={handleConfirmApplication}
                className={`px-5 py-2 rounded-xl text-white font-bold text-xs transition shadow-sm cursor-pointer flex items-center gap-1.5 ${
                  confirmProfileChecked
                    ? (jobToApply.isFree ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-sky-600 hover:bg-sky-700')
                    : 'bg-slate-300 cursor-not-allowed text-slate-500'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Submit Application</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


