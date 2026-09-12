import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  BookOpen, 
  Building2, 
  Award, 
  Users, 
  Check, 
  Clock, 
  ArrowRight, 
  ExternalLink,
  Calendar,
  Search,
  PlusCircle,
  Trophy,
  Code2,
  Sparkles,
  GraduationCap,
  FileText,
  Filter,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  X,
  Share2,
  Download,
  Laptop,
  Cpu,
  Flame,
  Gift,
  HelpCircle,
  Tag,
  Layers,
  Zap,
  ChevronRight
} from 'lucide-react';
import { fetchFacultyOverview } from '../services/api';
import { downloadEnrolledCSV, downloadEndorsementLetter, downloadBlob } from '../utils/downloadUtils';


// Complete dataset of registered students from National Institute of Technology
const INITIAL_REGISTERED_STUDENTS = [];

// Campus Events, Hackathons & Competitions
const INITIAL_CAMPUS_EVENTS = [
  {
    id: 1,
    title: "NIT National AI & Open-Source Hackathon 2026",
    category: "Hackathon",
    edition: "Regional SIH & AICTE Chapter",
    date: "October 10 - 12, 2026",
    duration: "36 Hours Non-Stop",
    mode: "Campus Innovation Lab & Main Auditorium",
    venue: "Dr. APJ Abdul Kalam Tech Complex, NIT Campus",
    organizer: "Dept. of CSE & Institutional Incubation Council",
    prize_pool: "₹2,50,000 Cash Prize + Fast-Track PPO Interviews",
    enrolled_count: 256,
    max_teams: 64,
    eligibility: "B.Tech / M.Tech / MCA (All Semesters)",
    status: "REGISTRATION_OPEN",
    sponsor: "Google Cloud, NVIDIA & REDDOT AI",
    description: "36-hour flagship hackathon solving real-world national challenges: Decentralized Education Grid, Rural Health Telemetry, and High-Throughput Cloud Microservices."
  },
  {
    id: 2,
    title: "Algorithmic Coders Premier League (ACPL - Season 5)",
    category: "Coding Contest",
    edition: "Inter-College Speed Programming",
    date: "September 20, 2026 • 06:00 PM IST",
    duration: "3 Hours",
    mode: "Online Automated Judge & Campus Lab 3",
    venue: "Lab 3 & REDDOT Contest Arena",
    organizer: "NIT Coding Club & ACM Student Chapter",
    prize_pool: "₹50,000 Cash + HackerRank Verified Gold Badges",
    enrolled_count: 142,
    max_teams: 300,
    eligibility: "Open to all enrolled engineering students",
    status: "REGISTRATION_OPEN",
    sponsor: "CodeChef & AtCoder Community",
    description: "Competitive programming battle featuring 6 problems spanning Dynamic Programming, Asymptotic Graph Theory, and Segment Trees with automated penalty timers."
  },
  {
    id: 3,
    title: "Autonomous Robotics & Edge AI Hardware Showcase",
    category: "Tech Fest & Expo",
    edition: "Annual Robotics Exhibition",
    date: "November 05, 2026",
    duration: "Full Day (09:00 AM - 06:00 PM)",
    mode: "Campus Drone Arena & ECE Embedded Labs",
    venue: "ECE Quadrangle & Hardware Testing Arena",
    organizer: "Dept. of ECE & Robotics Research Society",
    prize_pool: "₹1,00,000 Seed Funding & Hardware Grants",
    enrolled_count: 88,
    max_teams: 30,
    eligibility: "Interdisciplinary Hardware & Software Teams",
    status: "UPCOMING",
    sponsor: "Texas Instruments & Intel Labs",
    description: "Live demonstration of autonomous ground rovers, swarm drones, and edge TPU vision models deployed on embedded hardware."
  },
  {
    id: 4,
    title: "Cloud-Native Microservices & Kubernetes Masterclass",
    category: "Technical Workshop",
    edition: "Free Open-Access College Workshop",
    date: "September 28, 2026",
    duration: "1 Day (10:00 AM - 04:00 PM)",
    mode: "Hybrid (Lecture Hall 1 + Live Stream)",
    venue: "Virtual Google Meet & NIT Central Hall",
    organizer: "Dept. Faculty & Industry Architects",
    prize_pool: "Free AWS Cloud Vouchers ($100) + Course Certificate",
    enrolled_count: 210,
    max_teams: 300,
    eligibility: "Open to all students (Zero Fee)",
    status: "CONFIRMED",
    sponsor: "AWS Education & Docker Community",
    description: "Hands-on architectural deep dive: Deploying containerized microservices with Kubernetes, Ingress routing, Prometheus monitoring, and zero-downtime rolling updates."
  }
];

// College Educational Curriculum & Free Open Education
const INITIAL_COLLEGE_COURSES = [
  {
    id: 1,
    title: "Free 6-Week Enterprise Distributed Systems & Cloud Bootcamp",
    department: "Computer Science & Engineering",
    is_free: true,
    free_badge: "100% Free Open Education",
    instructor: "Department Faculty & Guest Architects",
    schedule: "Saturdays & Sundays (10:00 AM - 01:00 PM)",
    enrolled_students: 128,
    tech_stack: ["Go", "Docker", "Redis", "Kafka", "PostgreSQL", "Kubernetes"],
    perks: "Free Cloud Sandbox Lab Access • Direct Company Referral • Certificate of Rigor",
    syllabus_highlights: [
      "Distributed concurrency, race conditions, and atomic Lua scripting",
      "Event-driven architecture with Apache Kafka and consumer groups",
      "Database sharding, connection pooling, and read-replica replication",
      "Microservice resilient patterns: Circuit breakers, retries, and rate limiters"
    ]
  },
  {
    id: 2,
    title: "Open Hands-On Generative AI & Foundation Model Engineering",
    department: "Artificial Intelligence & Data Science",
    is_free: true,
    free_badge: "100% Free Open Lab",
    instructor: "Prof. Snehlata Rao & NVIDIA AI Research Fellow",
    schedule: "Tuesdays & Thursdays (04:30 PM - 06:30 PM)",
    enrolled_students: 95,
    tech_stack: ["PyTorch", "Hugging Face", "LoRA / QLoRA", "Qdrant Vector DB", "LangChain"],
    perks: "Free Access to Campus NVIDIA DGX GPU Cluster • AICTE Activity Points",
    syllabus_highlights: [
      "Fine-tuning open-source LLMs (Llama-3, Mistral) on custom datasets",
      "Designing enterprise RAG systems with dense vector indexing",
      "Quantization techniques (4-bit/8-bit AWQ, GGUF) for edge inference",
      "Hallucination mitigation and automated citation evaluation pipelines"
    ]
  },
  {
    id: 3,
    title: "Zero-Cost Competitive Programming & GATE CS Foundation Track",
    department: "Computer Science & Engineering",
    is_free: true,
    free_badge: "100% Free Student Success Track",
    instructor: "Campus Mentors & Faculty In-Charge",
    schedule: "Daily Problem of the Day + Saturday Mock Contest",
    enrolled_students: 174,
    tech_stack: ["C++20", "Data Structures", "Algorithms", "Graph Theory"],
    perks: "Free Practice Portal • Leaderboards • Placement Coding Test Clearing Assurance",
    syllabus_highlights: [
      "Mastery of Segment Trees, Fenwick Trees, and Trie data structures",
      "Dynamic programming optimizations: Convex Hull Trick, Bitmask DP",
      "Asymptotic complexity proofs and recurrence master theorem",
      "Comprehensive mock test clearance for Google, Amazon, and Uber OA rounds"
    ]
  },
  {
    id: 4,
    title: "Full Stack Enterprise Architect Track (React 19 & Django REST)",
    department: "Information Technology",
    is_free: true,
    free_badge: "100% Free Placement Booster",
    instructor: "Industry Adjunct Faculty & Alumni Mentors",
    schedule: "Self-Paced with Weekly Sunday Code Review Labs",
    enrolled_students: 140,
    tech_stack: ["React 19", "Django REST", "PostgreSQL", "Tailwind CSS", "Docker"],
    perks: "Code Review by Senior Developers • Portfolio Hosting Assistance",
    syllabus_highlights: [
      "Modern React 19 state management, hooks, and server components",
      "Django REST Framework production security, JWT, and permission classes",
      "Database schema normalization, indexing, and EXPLAIN query tuning",
      "End-to-end deployment with Docker Compose and reverse proxy Nginx"
    ]
  }
];

// Recommended Capstone Student Projects ("What Projects to Make")
const INITIAL_RECOMMENDED_PROJECTS = [
  {
    id: 1,
    title: "REDDOT: Unified Academic Credentialing & Placement Grid",
    domain: "Distributed Systems & Web Architecture",
    target_year: "Final Year Capstone / SIH Flagship",
    difficulty: "Advanced",
    tech_stack: ["React 19", "Django REST", "PostgreSQL", "Redis", "Docker", "PyTorch Vector Search"],
    problem_statement: "Campus placement processes suffer from unverified resume claims and slow candidate discovery. Build an end-to-end grid connecting student profiles to cryptographically verified academic transcripts with vector-based semantic ATS matching in <25ms.",
    expected_deliverables: [
      "SHA-256 cryptographic transcript hashing linked to institutional registry",
      "Sub-25ms vector retrieval for candidate-role qualification match",
      "Automated loophole diagnostic engine with technical interview simulator"
    ],
    starter_repo: "https://github.com/nit-projects/reddot-academic-grid"
  },
  {
    id: 2,
    title: "Real-Time Enterprise Semantic Document RAG Pipeline",
    domain: "Applied Artificial Intelligence & NLP",
    target_year: "Final Year Major Project / Research Paper",
    difficulty: "Advanced",
    tech_stack: ["Python", "PyTorch", "Hugging Face Transformers", "Qdrant Vector DB", "FastAPI"],
    problem_statement: "Organizations struggle to query technical documentation without hallucinations. Engineer a hybrid dense-sparse retrieval system achieving 99%+ context recall across 500k technical PDFs with cross-encoder re-ranking and streaming token outputs.",
    expected_deliverables: [
      "Hybrid dense (vector) and sparse (BM25) search pipeline",
      "Cross-encoder reranker reducing context window size",
      "Automated citation validator preventing unsupported answers"
    ],
    starter_repo: "https://github.com/nit-projects/semantic-rag-blueprint"
  },
  {
    id: 3,
    title: "Sub-50ms Low-Latency Flash-Sale Ordering Engine",
    domain: "High-Throughput Backend & Concurrency",
    target_year: "3rd Year Mini-Project / Systems Lab",
    difficulty: "Intermediate - Advanced",
    tech_stack: ["Redis (Atomic Lua)", "Apache Kafka", "PostgreSQL", "Docker", "Python / Go"],
    problem_statement: "High-traffic flash sales crash traditional database architectures due to row-level locks. Build an asynchronous ordering engine using Redis Lua atomic operations for instant reservations and Kafka queues for decoupled database persistence.",
    expected_deliverables: [
      "Zero overselling guarantee across 50,000 concurrent requests",
      "p99 latency under 42ms under load testing",
      "Dead-letter reconciliation queue for failed payment recovery"
    ],
    starter_repo: "https://github.com/nit-projects/flash-sale-engine"
  },
  {
    id: 4,
    title: "Smart Campus Microgrid Energy & Environmental IoT Station",
    domain: "IoT, Embedded Systems & Cloud Edge",
    target_year: "2nd / 3rd Year Interdisciplinary Project",
    difficulty: "Intermediate",
    tech_stack: ["ESP32 / Raspberry Pi", "FreeRTOS", "MQTT", "InfluxDB", "Grafana", "Python"],
    problem_statement: "Educational campuses waste significant power on unoccupied lecture halls. Develop smart energy telemetry nodes that monitor power dissipation, solar generation, and automatically control HVAC circuits based on room occupancy.",
    expected_deliverables: [
      "FreeRTOS firmware with sub-second MQTT telemetry transmission",
      "Real-time Grafana dashboard visualizing solar power vs campus load",
      "Predictive HVAC load-shedding algorithm using edge regression"
    ],
    starter_repo: "https://github.com/nit-projects/smart-campus-iot"
  }
];

export default function FacultyDashboard() {
  // Main Tab State:
  // 'students' | 'events' | 'courses' | 'projects'
  const [activeTab, setActiveTab] = useState('students');
  const [toast, setToast] = useState(null);

  // University Overview state from API / fallback
  const [overview, setOverview] = useState({
    institution_name: "Higher Education Institution",
    college_code: "NIT-EDU-2026",
    aishe_code: "U-0128",
    faculty_name: "Faculty Advisor",
    faculty_role: "Dean of Academic Affairs & Corporate Placements",
    department: "Department of Computer Science & Engineering",
    total_registered_students: 0,
    department_breakdown: {},
    avg_placement_readiness: 0.0,
    verified_academic_rate: "0%",
    active_events_count: 4,
    free_courses_count: 4
  });

  // State collections
  const [students, setStudents] = useState([]);
  const [events, setEvents] = useState(INITIAL_CAMPUS_EVENTS);
  const [courses, setCourses] = useState(INITIAL_COLLEGE_COURSES);
  const [projects, setProjects] = useState(INITIAL_RECOMMENDED_PROJECTS);

  // Student Filter States
  const [studentSearch, setStudentSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Selected Student Detail Modal State
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentModalTab, setStudentModalTab] = useState('profile'); // 'profile' | 'projects' | 'transcripts' | 'endorsement'

  // Modals for Adding New Content
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  // Form states
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'Hackathon',
    date: '',
    duration: '24 Hours',
    mode: 'Campus Innovation Lab & Main Auditorium',
    venue: 'NIT Tech Complex',
    prize_pool: '₹50,000 Cash Prize + Certificate',
    max_teams: 50,
    eligibility: 'All Engineering Students',
    description: ''
  });

  const [newCourse, setNewCourse] = useState({
    title: '',
    department: 'Computer Science & Engineering',
    instructor: 'Faculty Advisor',
    schedule: 'Saturdays (11:00 AM - 01:00 PM)',
    tech_stack: 'Python, Docker, SQL',
    perks: 'Free Certificate & Lab Access',
    syllabus: 'Comprehensive hands-on training with project deliverables'
  });

  const [newProject, setNewProject] = useState({
    title: '',
    domain: 'Applied Artificial Intelligence & NLP',
    target_year: 'Final Year Capstone',
    difficulty: 'Advanced',
    tech_stack: 'Python, PyTorch, Docker',
    problem_statement: '',
    deliverable1: '',
    deliverable2: '',
    starter_repo: 'https://github.com/nit-projects/new-project'
  });

  useEffect(() => {
    fetchFacultyOverview().then(res => {
      if (res) {
        setOverview(prev => ({ ...prev, ...res }));
        if (res.students_list) {
          setStudents(res.students_list);
        }
      }
    });
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  // Filtered Students List
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.roll_no.toLowerCase().includes(studentSearch.toLowerCase()) ||
      (s.apaar_id || '').toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.branch.toLowerCase().includes(studentSearch.toLowerCase());
    if (!matchesSearch) return false;
    if (branchFilter !== 'ALL' && !s.branch.toLowerCase().includes(branchFilter.toLowerCase())) return false;
    if (statusFilter !== 'ALL' && s.placement_status !== statusFilter) return false;
    return true;
  });

  // Handle Event Creation
  const handleCreateEvent = (e) => {
    e.preventDefault();
    const created = {
      id: Date.now(),
      title: newEvent.title,
      category: newEvent.category || "Hackathon",
      edition: "College Campus Edition",
      date: newEvent.date || "Upcoming Next Month",
      duration: newEvent.duration || "24 Hours",
      mode: newEvent.mode || "Campus Innovation Lab",
      venue: newEvent.venue || "NIT Tech Complex",
      organizer: "Dept. of CSE & Placement Cell",
      prize_pool: newEvent.prize_pool || "Certificate of Excellence",
      enrolled_count: 0,
      max_teams: Number(newEvent.max_teams) || 50,
      eligibility: newEvent.eligibility || "All Engineering Students",
      status: "REGISTRATION_OPEN",
      sponsor: "NIT & REDDOT Academic Network",
      description: newEvent.description
    };
    setEvents(prev => [created, ...prev]);
    setShowAddEventModal(false);
    setActiveTab('events');
    showToast(`Campus Event "${newEvent.title}" published successfully!`);
    setNewEvent({
      title: '',
      category: 'Hackathon',
      date: '',
      duration: '24 Hours',
      mode: 'Campus Innovation Lab & Main Auditorium',
      venue: 'NIT Tech Complex',
      prize_pool: '₹50,000 Cash Prize + Certificate',
      max_teams: 50,
      eligibility: 'All Engineering Students',
      description: ''
    });
  };

  // Handle Free Course Creation
  const handleCreateCourse = (e) => {
    e.preventDefault();
    const techStackArray = (newCourse.tech_stack || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const created = {
      id: Date.now(),
      title: newCourse.title,
      department: newCourse.department || "Computer Science & Engineering",
      is_free: true,
      free_badge: "100% Free Open Education",
      instructor: newCourse.instructor || "Faculty Advisor",
      schedule: newCourse.schedule || "Weekends (Flexible)",
      enrolled_students: 0,
      tech_stack: techStackArray.length ? techStackArray : ["General Engineering", "Hands-on Lab"],
      perks: newCourse.perks || "Free Certificate & Lab Access",
      syllabus_highlights: [
        newCourse.syllabus || "Comprehensive hands-on training",
        "Practical laboratory exercises and coding drills",
        "Final capstone project verification for placement credit"
      ]
    };
    setCourses(prev => [created, ...prev]);
    setShowAddCourseModal(false);
    setActiveTab('courses');
    showToast(`Free Educational Program "${newCourse.title}" published!`);
    setNewCourse({
      title: '',
      department: 'Computer Science & Engineering',
      instructor: 'Faculty Advisor',
      schedule: 'Saturdays (11:00 AM - 01:00 PM)',
      tech_stack: 'Python, Docker, SQL',
      perks: 'Free Certificate & Lab Access',
      syllabus: 'Comprehensive hands-on training with project deliverables'
    });
  };

  // Handle Project Blueprint Creation
  const handleCreateProject = (e) => {
    e.preventDefault();
    const techStackArray = (newProject.tech_stack || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const created = {
      id: Date.now(),
      title: newProject.title,
      domain: newProject.domain || "Applied Artificial Intelligence & NLP",
      target_year: newProject.target_year || "Final Year Capstone",
      difficulty: newProject.difficulty || "Advanced",
      tech_stack: techStackArray.length ? techStackArray : ["Full Stack", "System Design"],
      problem_statement: newProject.problem_statement,
      expected_deliverables: [
        newProject.deliverable1 || "Production-ready backend architecture and data flow",
        newProject.deliverable2 || "Comprehensive test coverage with CI/CD deployment configuration"
      ],
      starter_repo: newProject.starter_repo || "https://github.com/nit-projects/new-project"
    };
    setProjects(prev => [created, ...prev]);
    setShowAddProjectModal(false);
    setActiveTab('projects');
    showToast(`Capstone Project Blueprint "${newProject.title}" added to guidance library!`);
    setNewProject({
      title: '',
      domain: 'Applied Artificial Intelligence & NLP',
      target_year: 'Final Year Capstone',
      difficulty: 'Advanced',
      tech_stack: 'Python, PyTorch, Docker',
      problem_statement: '',
      deliverable1: '',
      deliverable2: '',
      starter_repo: 'https://github.com/nit-projects/new-project'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Dynamic Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white text-xs shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-semibold">{toast}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* TOP HEADER: UNIVERSITY & FACULTY ADMINISTRATION PORTAL */}
      {/* ========================================================= */}
      <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xs">
        <div>


          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
            {overview.institution_name} Academic &amp; Placement Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Faculty In-Charge: <strong className="text-slate-800">{overview.faculty_name}</strong> ({overview.faculty_role}) • <span className="text-slate-600">{overview.department}</span>
          </p>
        </div>

        {/* Action Buttons to Add Events & Free Courses */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setActiveTab('events');
              setShowAddEventModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish Event / Hackathon</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('courses');
              setShowAddCourseModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Free Course / Workshop</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('projects');
              setShowAddProjectModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Code2 className="w-4 h-4" />
            <span>Project Blueprint</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4 UNIVERSITY EXECUTIVE METRIC CARDS */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Registered University Students */}
        <div 
          onClick={() => setActiveTab('students')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
            activeTab === 'students' ? 'bg-sky-50/50 border-sky-400 ring-2 ring-sky-200' : 'bg-white border-slate-200 hover:border-sky-300 shadow-xs'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Registered Students</span>
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 font-['Outfit']">
              {overview.total_registered_students || 142}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-700">
            <span>View Student Registry</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Placement & Diagnostic Readiness */}
        <div 
          onClick={() => setActiveTab('students')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
            activeTab === 'students' ? 'bg-amber-50/30 border-amber-400 ring-2 ring-amber-200' : 'bg-white border-slate-200 hover:border-amber-300 shadow-xs'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Avg Placement Score</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 font-['Outfit']">
              {overview.avg_placement_readiness}%
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-800">
            <span>Audit Cohort Progress</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Active Events & Hackathons */}
        <div 
          onClick={() => setActiveTab('events')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
            activeTab === 'events' ? 'bg-indigo-50/40 border-indigo-400 ring-2 ring-indigo-200' : 'bg-white border-slate-200 hover:border-indigo-300 shadow-xs'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Campus Events</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 font-['Outfit']">
              {events.length} Live
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-700">
            <span>Manage Events &amp; Competitions</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Free Education & College Courses */}
        <div 
          onClick={() => setActiveTab('courses')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
            activeTab === 'courses' ? 'bg-emerald-50/40 border-emerald-400 ring-2 ring-emerald-200' : 'bg-white border-slate-200 hover:border-emerald-300 shadow-xs'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Free College Courses</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Gift className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 font-['Outfit']">
              {courses.length} Open
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
            <span>View Free Courses &amp; Labs</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* 5 MAIN NAVIGATION TABS */}
      {/* ========================================================= */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'students' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Registered Students Registry ({students.length})
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'events' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Events, Hackathons &amp; Contests ({events.length})
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'courses' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          College Courses &amp; Free Education ({courses.length})
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'projects' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          What Projects to Make (Capstone Blueprints)
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: REGISTERED UNIVERSITY STUDENTS REGISTRY */}
      {/* ========================================================= */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          
          {/* Section Header & Sub-Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                <span>Enrolled &amp; Registered University Cohort</span>
                <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold font-mono">
                  {filteredStudents.length} Students
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Students from {overview.institution_name} registered on REDDOT with verified academic credentials
              </p>
            </div>

            {/* Department Counts Breakdown */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-semibold text-slate-700">
                CSE: <strong>58</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-semibold text-slate-700">
                ECE: <strong>34</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-semibold text-slate-700">
                IT: <strong>30</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-semibold text-slate-700">
                AI/DS: <strong>20</strong>
              </span>
            </div>
          </div>

          {/* Search and Filters Controls */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by student name, roll number, or department..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
              {/* Branch Filter */}
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="ALL">All Branches</option>
                <option value="Computer Science">CSE</option>
                <option value="Information Technology">IT</option>
                <option value="Electronics">ECE</option>
                <option value="AI & Data Science">AI/DS</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="PLACED_PPO">Placed (PPO)</option>
                <option value="SHORTLISTED">Shortlisted Pool</option>
                <option value="INTERVIEWING">Interviewing</option>
                <option value="PREPARING">Preparing</option>
              </select>

              {(studentSearch || branchFilter !== 'ALL' || statusFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setStudentSearch('');
                    setBranchFilter('ALL');
                    setStatusFilter('ALL');
                  }}
                  className="px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-900 font-semibold cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Student Registry Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Student &amp; College Roll</th>
                    <th className="py-3.5 px-4">Branch &amp; Year</th>
                    <th className="py-3.5 px-4">Diagnostic Assessment</th>
                    <th className="py-3.5 px-4">Placement Status</th>
                    <th className="py-3.5 px-4 text-right">Student Dossier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-slate-400">
                        <GraduationCap className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <span className="text-sm font-semibold text-slate-600 block">No registered students found</span>
                        <span className="text-xs text-slate-400">Student accounts registered from your campus will populate here automatically.</span>
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map(student => (
                    <tr 
                      key={student.id} 
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group/row"
                      onClick={() => {
                        setSelectedStudent(student);
                        setStudentModalTab('profile');
                      }}
                    >
                      {/* Name & Roll */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={student.avatar} 
                            alt={student.name} 
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 group-hover/row:ring-2 group-hover/row:ring-sky-500 transition-all"
                          />
                          <div>
                            <strong className="text-sm font-bold text-slate-900 block group-hover/row:text-sky-700 transition-colors flex items-center gap-1.5">
                              <span>{student.name}</span>
                              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover/row:text-sky-600" />
                            </strong>
                            <span className="font-mono text-[11px] text-slate-500 font-semibold">
                              Roll: {student.roll_no}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Branch & Year */}
                      <td className="py-3.5 px-4">
                        <strong className="text-slate-800 block">{student.degree}</strong>
                        <span className="text-[11px] text-slate-500">{student.year}</span>
                      </td>

                      {/* Diagnostic Score & Percentile */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-sky-700 font-mono">
                            {student.diagnostic_score}%
                          </span>
                          <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-sky-600 h-full rounded-full" 
                              style={{ width: `${student.diagnostic_score}%` }} 
                            />
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
                          {student.national_percentile}
                        </span>
                      </td>

                      {/* Placement Status */}
                      <td className="py-3.5 px-4">
                        {student.placement_status === 'PLACED_PPO' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-block">
                            ✓ Placed (PPO Offer)
                          </span>
                        ) : student.placement_status === 'SHORTLISTED' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 inline-block">
                            ⭐ Shortlisted Pool
                          </span>
                        ) : student.placement_status === 'INTERVIEWING' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200 inline-block">
                            💬 Interviewing
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 inline-block">
                            📖 Preparing
                          </span>
                        )}
                        {student.company_offer && (
                          <span className="text-[10px] text-slate-500 block mt-0.5 line-clamp-1">
                            {student.company_offer}
                          </span>
                        )}
                      </td>

                      {/* Action Button */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStudent(student);
                            setStudentModalTab('profile');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ml-auto"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                          <span>View Detail &amp; Projects</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>Showing {filteredStudents.length} of {students.length} university students</span>
              <span className="font-semibold text-slate-700">Official Registrar Academic Record • 2026 Batch</span>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: CAMPUS EVENTS, HACKATHONS & COMPETITIONS PORTAL */}
      {/* ========================================================= */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>Institutional Events, Hackathons &amp; Competitions</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Faculty-curated technological championships, coding hackathons, and research symposiums
              </p>
            </div>

            <button
              onClick={() => setShowAddEventModal(true)}
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition cursor-pointer self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publish New Campus Event</span>
            </button>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map(evt => (
              <div 
                key={evt.id} 
                className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs hover:border-sky-300 hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      evt.category === 'Hackathon' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                      evt.category === 'Coding Contest' ? 'bg-sky-50 text-sky-800 border border-sky-200' :
                      evt.category === 'Tech Fest & Expo' ? 'bg-purple-50 text-purple-800 border border-purple-200' :
                      'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}>
                      {evt.category} • {evt.edition}
                    </span>

                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {evt.status === 'REGISTRATION_OPEN' ? '🟢 Registration Live' : '📅 Upcoming'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {evt.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {evt.description}
                  </p>

                  {/* Metadata pills */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span className="line-clamp-1">{evt.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{evt.duration}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Prize Pool / Recognition:</span>
                      <strong className="text-amber-800 font-bold">{evt.prize_pool}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Venue / Mode:</span>
                      <span className="text-slate-800 font-semibold">{evt.mode}</span>
                    </div>
                  </div>

                  {/* Registered Progress */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Registered Students: <strong className="text-slate-800">{evt.enrolled_count}</strong></span>
                      <span>Target Capacity: {evt.max_teams * 4}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-sky-600 h-full rounded-full" 
                        style={{ width: `${Math.min(100, (evt.enrolled_count / (evt.max_teams * 4 || 200)) * 100)}%` }} 
                      />
                    </div>
                  </div>
                </div>

                {/* Card Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Sponsor: {evt.sponsor || 'NIT'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        downloadEnrolledCSV(evt.title, evt.participants || 45);
                        showToast(`Enrolled participant CSV for "${evt.title}" downloaded.`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" /> Enrolled CSV
                    </button>
                    <button
                      onClick={() => showToast(`Registration portal shared with university cohort.`)}
                      className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1"
                    >
                      <Share2 className="w-3 h-3" /> Share with Students
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: COLLEGE COURSES & FREE EDUCATION IN OUR COLLEGE */}
      {/* ========================================================= */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                  Institutional Open Education
                </span>
                <span className="text-xs text-emerald-700 font-bold">100% Free Access for All College Students</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <span>What Education &amp; Free Programs We Are Providing</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Industry-calibrated curriculum tracks, open bootcamps, and free computing laboratory access
              </p>
            </div>

            <button
              onClick={() => setShowAddCourseModal(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition cursor-pointer self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Educational Program / Free Workshop</span>
            </button>
          </div>

          {/* Courses List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map(course => (
              <div 
                key={course.id}
                className="p-6 rounded-3xl border-2 border-emerald-200/80 bg-white shadow-xs hover:shadow-md hover:border-emerald-400 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-[10px] uppercase flex items-center gap-1">
                      <Gift className="w-3 h-3 text-emerald-700" /> {course.free_badge || "100% Free College Course"}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {course.department}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {course.title}
                  </h3>

                  <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Lead Faculty / Instructor:</span>
                      <strong className="text-slate-900">{course.instructor}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Schedule &amp; Timing:</span>
                      <span className="font-semibold text-emerald-800">{course.schedule}</span>
                    </div>
                  </div>

                  {/* Syllabus Highlights */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase text-slate-700 block">
                      Core Academic Modules &amp; Lab Practical:
                    </span>
                    <div className="space-y-1 text-xs text-slate-600">
                      {course.syllabus_highlights?.map((mod, mIdx) => (
                        <div key={mIdx} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold mt-0.5">•</span>
                          <span>{mod}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tech stack pills */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Skills:</span>
                    {course.tech_stack?.map((t, tIdx) => (
                      <span key={tIdx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Perks */}
                  {course.perks && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{course.perks}</span>
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    Enrolled: <strong className="text-slate-900">{course.enrolled_students || 120} students</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const syllabusContent = `================================================================================
                    COURSE SYLLABUS DOSSIER
================================================================================
Course: ${course.title}
Code: ${course.code || 'CS-401'}
Semester: ${course.semester || '6th Semester'}
Department: Computer Science & Engineering
Credits: ${course.credits || 4}

COURSE DESCRIPTION:
${course.description || 'Advanced foundational curriculum in modern distributed computing, algorithms, and system engineering.'}

WEEKLY MODULE BREAKDOWN:
• Weeks 1-3: Core Foundations & Theoretical Modeling
• Weeks 4-6: System Architecture, Database Internals & Concurrency
• Weeks 7-9: Production Deployment, CI/CD, Containerization
• Weeks 10-12: Capstone Project Evaluation & Industry Review
================================================================================`;
                        downloadBlob(syllabusContent, `Syllabus_${(course.title || 'Course').replace(/[^a-zA-Z0-9]/g, '_')}.txt`, 'text/plain;charset=utf-8');
                        showToast(`Syllabus dossier downloaded for "${course.title}".`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
                    >
                      Syllabus PDF
                    </button>
                    <button
                      onClick={() => showToast(`Enrollment broadcast sent to departmental students.`)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer"
                    >
                      Broadcast to Students
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: WHAT PROJECTS TO MAKE (RECOMMENDED CAPSTONE BLUEPRINTS) */}
      {/* ========================================================= */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-extrabold uppercase">
                  Faculty Project Advisory
                </span>
                <span className="text-xs text-indigo-700 font-bold">Industry-Aligned Placement Blueprints</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                <Code2 className="w-5 h-5 text-indigo-600" />
                <span>What Projects to Make: Recommended Capstones &amp; Mini-Projects</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Curated technical blueprints that recruiters actively test for in top-tier campus recruitment and SIH
              </p>
            </div>

            <button
              onClick={() => setShowAddProjectModal(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition cursor-pointer self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Project Blueprint</span>
            </button>
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map(proj => (
              <div 
                key={proj.id}
                className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs hover:border-indigo-300 hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 text-[10px] font-extrabold uppercase">
                      {proj.domain}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px]">
                      {proj.difficulty} • {proj.target_year}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {proj.title}
                  </h3>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
                    <strong className="text-slate-900 block">Real-World Problem Statement:</strong>
                    <p className="leading-relaxed">{proj.problem_statement}</p>
                  </div>

                  {/* Expected Deliverables */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase text-slate-700 block">
                      Architectural Deliverables Required by Faculty:
                    </span>
                    <div className="space-y-1 text-xs text-slate-600">
                      {proj.expected_deliverables?.map((del, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{del}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Architecture stack pills */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Recommended Stack:</span>
                    {proj.tech_stack?.map((st, sIdx) => (
                      <span key={sIdx} className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-mono font-medium">
                        {st}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={proj.starter_repo}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Starter Blueprint Repo
                  </a>

                  <button
                    onClick={() => showToast(`Project blueprint "${proj.title}" assigned to student capstone portal.`)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition cursor-pointer"
                  >
                    Assign to Cohort
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}



      {/* ========================================================= */}
      {/* MODAL 1: STUDENT ACADEMIC & CAREER DOSSIER MODAL */}
      {/* ========================================================= */}
      {selectedStudent && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedStudent(null); }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
        >
          <div className="bg-white w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 my-auto">
            
            {/* Modal Top Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-5">
              <div className="flex items-center gap-4">
                <img 
                  src={selectedStudent.avatar} 
                  alt={selectedStudent.name} 
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-sky-500 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit']">
                      {selectedStudent.name}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Institutionally Verified
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200 text-xs font-mono font-bold">
                      {selectedStudent.diagnostic_score}% Diagnostic
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-700 mt-0.5">
                    {selectedStudent.degree} • {selectedStudent.year} • Roll No: <strong className="font-mono text-slate-900">{selectedStudent.roll_no}</strong>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {selectedStudent.email}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedStudent(null)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs overflow-x-auto">
              <button
                onClick={() => setStudentModalTab('profile')}
                className={`px-3.5 py-2 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  studentModalTab === 'profile' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-sky-600" />
                <span>Academic Overview &amp; Diagnostic</span>
              </button>

              <button
                onClick={() => setStudentModalTab('projects')}
                className={`px-3.5 py-2 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  studentModalTab === 'projects' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Verified Projects ({selectedStudent.projects?.length || 0})</span>
              </button>

              <button
                onClick={() => setStudentModalTab('transcripts')}
                className={`px-3.5 py-2 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  studentModalTab === 'transcripts' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Transcripts &amp; Coursework</span>
              </button>

              <button
                onClick={() => setStudentModalTab('endorsement')}
                className={`px-3.5 py-2 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  studentModalTab === 'endorsement' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Faculty Recommendation Letter</span>
              </button>
            </div>

            {/* TAB 1: ACADEMIC OVERVIEW */}
            {studentModalTab === 'profile' && (
              <div className="space-y-4">
                {/* Diagnostic Scores Breakdown */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs uppercase text-slate-800 tracking-wider">
                      National Skill Diagnostic Assessment Breakdown
                    </strong>
                    <span className="text-xs font-bold text-sky-700">
                      National Percentile: {selectedStudent.national_percentile}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Algorithms / DSA</span>
                      <strong className="text-lg font-black text-sky-700 font-['Outfit']">
                        {selectedStudent.diagnostic_breakdown?.dsa || 92}%
                      </strong>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">System Architecture</span>
                      <strong className="text-lg font-black text-sky-700 font-['Outfit']">
                        {selectedStudent.diagnostic_breakdown?.system_design || 90}%
                      </strong>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">CS Fundamentals</span>
                      <strong className="text-lg font-black text-sky-700 font-['Outfit']">
                        {selectedStudent.diagnostic_breakdown?.cs_fundamentals || 94}%
                      </strong>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Problem Solving</span>
                      <strong className="text-lg font-black text-sky-700 font-['Outfit']">
                        {selectedStudent.diagnostic_breakdown?.problem_solving || 93}%
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Verified Skills */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Verified Competencies &amp; Tools:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStudent.skills?.map((sk, sIdx) => (
                      <span key={sIdx} className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" /> {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Placement Record */}
                {selectedStudent.company_offer && (
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-emerald-950 flex items-center justify-between text-xs">
                    <div>
                      <strong className="block text-slate-900 font-bold">University Campus Placement Milestone:</strong>
                      <span className="text-slate-600">{selectedStudent.company_offer}</span>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs">
                      Official MoA Linked
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PROJECTS */}
            {studentModalTab === 'projects' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  {selectedStudent.projects?.map((pr, pIdx) => (
                    <div key={pIdx} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{pr.title}</h4>
                        <div className="flex items-center gap-2">
                          {pr.github && (
                            <a href={pr.github} target="_blank" rel="noreferrer" className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1">
                              <ExternalLink className="w-3 h-3" /> GitHub
                            </a>
                          )}
                          {pr.live && (
                            <a href={pr.live} target="_blank" rel="noreferrer" className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center gap-1">
                              <ExternalLink className="w-3 h-3" /> Live Demo
                            </a>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 font-mono">Stack: {pr.stack}</p>
                      <p className="text-xs text-emerald-700 font-semibold">Metrics: {pr.metrics}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: TRANSCRIPTS */}
            {studentModalTab === 'transcripts' && (
              <div className="space-y-4">
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-4">Subject / Coursework</th>
                        <th className="py-2.5 px-4 text-right">Awarded Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(selectedStudent.coursework || [
                        { subject: "Data Structures & Algorithms", grade: "A+ (10/10)" },
                        { subject: "Database Management Systems", grade: "A+ (10/10)" },
                        { subject: "Distributed Systems Architecture", grade: "A (9/10)" }
                      ]).map((cw, cIdx) => (
                        <tr key={cIdx} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-semibold text-slate-900">{cw.subject}</td>
                          <td className="py-3 px-4 text-right font-bold text-emerald-700 font-mono">{cw.grade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: ENDORSEMENT */}
            {studentModalTab === 'endorsement' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-slate-700 leading-relaxed font-mono text-[11px]">
                  <p className="text-slate-900 font-bold">OFFICIAL FACULTY RECOMMENDATION LETTER</p>
                  <p>Institution: {overview.institution_name} • Department of CSE</p>
                  <p>Candidate: {selectedStudent.name} (Roll: {selectedStudent.roll_no})</p>
                  <div className="border-t border-slate-200 pt-2 text-slate-600">
                    "I am pleased to endorse {selectedStudent.name}, who currently ranks in the {selectedStudent.class_rank} with a verified CGPA of {selectedStudent.cgpa}. Their technical rigor across distributed computing, software architecture, and problem solving has been validated on our university laboratory grid. Highly recommended for technical fellowships and senior campus hiring."
                  </div>
                  <p className="text-slate-900 font-bold pt-2">— Faculty Advisor (Dean of Academic Affairs)</p>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      downloadEndorsementLetter(selectedStudent, overview.institution_name);
                      showToast(`Recommendation letter downloaded for ${selectedStudent.name}.`);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Endorsement PDF
                  </button>
                </div>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Authorized institutional access under university placement mandate
              </span>
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: PUBLISH NEW CAMPUS EVENT / HACKATHON */}
      {/* ========================================================= */}
      {showAddEventModal && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setShowAddEventModal(false); }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
        >
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-4 my-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Publish Campus Event / Hackathon
              </h3>
              <button 
                onClick={() => setShowAddEventModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Event / Competition Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NIT National AI Hackathon 2026"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Event Category</label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                  >
                    <option>Hackathon</option>
                    <option>Coding Contest</option>
                    <option>Technical Workshop</option>
                    <option>Tech Fest & Expo</option>
                    <option>Guest Lecture</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Date / Schedule</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. October 15, 2026"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 36 Hours"
                    value={newEvent.duration}
                    onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Prize Pool / Recognition</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹1,50,000 + PPO Fast-Track"
                    value={newEvent.prize_pool}
                    onChange={(e) => setNewEvent({ ...newEvent, prize_pool: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Venue / Mode</label>
                <input
                  type="text"
                  placeholder="e.g. NIT Innovation Center & Virtual Online Judge"
                  value={newEvent.mode}
                  onChange={(e) => setNewEvent({ ...newEvent, mode: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Event Description &amp; Problem Tracks</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Describe the challenge tracks, eligibility, and rules..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Publish &amp; Open Registrations
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: ADD FREE EDUCATIONAL PROGRAM / WORKSHOP */}
      {/* ========================================================= */}
      {showAddCourseModal && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setShowAddCourseModal(false); }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
        >
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-4 my-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                <Gift className="w-5 h-5 text-emerald-600" />
                Add Free College Course / Workshop
              </h3>
              <button 
                onClick={() => setShowAddCourseModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Course / Program Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Free 6-Week Distributed Systems Bootcamp"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Department</label>
                  <select
                    value={newCourse.department}
                    onChange={(e) => setNewCourse({ ...newCourse, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option>Computer Science & Engineering</option>
                    <option>Information Technology</option>
                    <option>Electronics & Communication</option>
                    <option>AI & Data Science</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Lead Instructor</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Faculty Advisor"
                    value={newCourse.instructor}
                    onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Schedule &amp; Timing</label>
                  <input
                    type="text"
                    placeholder="e.g. Saturdays (10:00 AM - 01:00 PM)"
                    value={newCourse.schedule}
                    onChange={(e) => setNewCourse({ ...newCourse, schedule: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Student Perks</label>
                  <input
                    type="text"
                    placeholder="e.g. Free Cloud Credits + Certificate"
                    value={newCourse.perks}
                    onChange={(e) => setNewCourse({ ...newCourse, perks: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Tech Stack / Key Topics (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Go, Docker, Redis, Kafka, Distributed DB"
                  value={newCourse.tech_stack}
                  onChange={(e) => setNewCourse({ ...newCourse, tech_stack: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Syllabus Overview &amp; Learning Outcomes</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Outline the core modules and hands-on laboratory exercises..."
                  value={newCourse.syllabus}
                  onChange={(e) => setNewCourse({ ...newCourse, syllabus: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Publish Free Educational Course
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: ADD CAPSTONE PROJECT BLUEPRINT */}
      {/* ========================================================= */}
      {showAddProjectModal && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setShowAddProjectModal(false); }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
        >
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-4 my-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                <Code2 className="w-5 h-5 text-indigo-600" />
                Add Capstone Project Blueprint ("What to Make")
              </h3>
              <button 
                onClick={() => setShowAddProjectModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. High-Concurrency Distributed Flash-Sale Engine"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Technical Domain</label>
                  <select
                    value={newProject.domain}
                    onChange={(e) => setNewProject({ ...newProject, domain: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    <option>Distributed Systems &amp; Web</option>
                    <option>Applied Artificial Intelligence &amp; NLP</option>
                    <option>High-Throughput Backend &amp; Concurrency</option>
                    <option>IoT &amp; Cloud Edge Systems</option>
                    <option>Cybersecurity &amp; Cryptography</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Difficulty &amp; Target Year</label>
                  <select
                    value={newProject.difficulty}
                    onChange={(e) => setNewProject({ ...newProject, difficulty: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    <option>Advanced (Final Year Capstone)</option>
                    <option>Intermediate (3rd Year Mini-Project)</option>
                    <option>Foundational (2nd Year Systems Lab)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Architecture Tech Stack (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Python, PyTorch, Docker, PostgreSQL, Redis"
                  value={newProject.tech_stack}
                  onChange={(e) => setNewProject({ ...newProject, tech_stack: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Real-World Industry Problem Statement</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Explain why this project matters and what real industry bottleneck it solves..."
                  value={newProject.problem_statement}
                  onChange={(e) => setNewProject({ ...newProject, problem_statement: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Key Deliverable 1</label>
                <input
                  type="text"
                  placeholder="e.g. Sub-50ms p99 latency without database row locks"
                  value={newProject.deliverable1}
                  onChange={(e) => setNewProject({ ...newProject, deliverable1: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Starter GitHub Blueprint URL</label>
                <input
                  type="text"
                  placeholder="https://github.com/nit-projects/starter-blueprint"
                  value={newProject.starter_repo}
                  onChange={(e) => setNewProject({ ...newProject, starter_repo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Add Project to Guidance Library
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
