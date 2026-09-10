import math
import re

# Multi-Domain Profile-Aligned Diagnostic Question Banks
# Organized Step-by-Step: Step 1 (Easy Foundation) -> Step 2 (Medium Math/Analytical) -> Step 3 (Hard Written/Scenario)

DOMAIN_DIAGNOSTICS = {
    "cs_ai": {
        "domain_id": "cs_ai",
        "domain_name": "Computer Science & AI / Software",
        "description": "Core Algorithms, Applied Discrete Math, AI/ML Theory, and High-Scalability System Architecture.",
        "questions": [
            # STEP 1: EASY - FOUNDATION CONCEPTS (MCQ)
            {
                "id": 1,
                "step": 1,
                "step_label": "Level 1: Foundation (Easy)",
                "difficulty": "Easy",
                "type": "mcq",
                "category": "Data Structures & Python",
                "question": "What is the average amortized time complexity of inserting an element into a Python dynamic list or hash map?",
                "options": ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
                "answer": 0,
                "weight": 5,
                "explanation": "Python lists allocate extra capacity geometrically, making append O(1) amortized. Dictionaries use open addressing hash tables with O(1) average lookup and insertion.",
                "tip": "Review amortized analysis and array doubling strategies in dynamic arrays."
            },
            {
                "id": 2,
                "step": 1,
                "step_label": "Level 1: Foundation (Easy)",
                "difficulty": "Easy",
                "type": "mcq",
                "category": "Object-Oriented Programming",
                "question": "Which OOP principle allows a subclass to provide a specific implementation of a method that is already defined in its parent class?",
                "options": ["Encapsulation", "Method Overriding (Polymorphism)", "Data Abstraction", "Multiple Inheritance"],
                "answer": 1,
                "weight": 5,
                "explanation": "Method overriding is a form of runtime polymorphism where the derived class redefines a base class method with the same signature.",
                "tip": "Focus on dynamic dispatch and virtual method tables in modern OOP languages."
            },
            {
                "id": 3,
                "step": 1,
                "step_label": "Level 1: Foundation (Easy)",
                "difficulty": "Easy",
                "type": "mcq",
                "category": "Operating Systems & Networking",
                "question": "In TCP/IP networking, what is the sequence of packets exchanged during the standard 3-way handshake to establish a connection?",
                "options": ["ACK -> SYN -> SYN-ACK", "SYN -> SYN-ACK -> ACK", "FIN -> ACK -> FIN-ACK", "RST -> SYN -> ACK"],
                "answer": 1,
                "weight": 5,
                "explanation": "TCP establishes reliability via SYN (Client to Server) -> SYN-ACK (Server to Client) -> ACK (Client to Server) with initial sequence numbers.",
                "tip": "Memorize the state transition diagram of TCP sockets (SYN_SENT, ESTABLISHED, TIME_WAIT)."
            },

            # STEP 2: MEDIUM - MATHEMATICAL & ANALYTICAL LOGIC (MATHS/NUMERICAL)
            {
                "id": 4,
                "step": 2,
                "step_label": "Level 2: Math & Applied Logic (Medium)",
                "difficulty": "Medium",
                "type": "math",
                "category": "Algorithm Complexity & Recurrence",
                "question": "Using the Master Theorem T(n) = 2T(n/2) + O(n), what is the tight asymptotic bound for this divide-and-conquer recurrence (e.g. MergeSort)?",
                "options": ["Θ(n)", "Θ(n log n)", "Θ(n^2)", "Θ(log n)"],
                "answer": 1,
                "weight": 8,
                "formula_hint": "Master Theorem: If a = b^c (here 2 = 2^1), then T(n) = Θ(n^c * log n).",
                "explanation": "Here a = 2, b = 2, and f(n) = O(n^1). Since log_b(a) = log_2(2) = 1 = c, case 2 applies, giving Θ(n log n).",
                "tip": "Practice Master Theorem cases 1, 2, and 3 along with recursion tree analysis."
            },
            {
                "id": 5,
                "step": 2,
                "step_label": "Level 2: Math & Applied Logic (Medium)",
                "difficulty": "Medium",
                "type": "math",
                "category": "Discrete Mathematics & Graph Theory",
                "question": "A connected planar graph has 7 vertices and 10 edges. According to Euler's Formula (V - E + F = 2), how many faces (regions) does it divide the plane into?",
                "options": ["3", "5", "7", "9"],
                "answer": 1,
                "weight": 8,
                "formula_hint": "Euler's Planar Formula: V - E + F = 2  =>  F = 2 - V + E",
                "explanation": "Plugging in the values: F = 2 - 7 + 10 = 5 faces (including the unbounded outer face).",
                "tip": "Euler's planar graph formula is frequently tested in technical entrance and campus placement exams."
            },
            {
                "id": 6,
                "step": 2,
                "step_label": "Level 2: Math & Applied Logic (Medium)",
                "difficulty": "Medium",
                "type": "math",
                "category": "AI Probability & Bayes Theorem",
                "question": "A medical classifier tests for a rare bug present in 1% of code files. If a file is buggy, the test is positive 90% of the time (sensitivity). If clean, it tests positive 10% of the time (false positive). Given a positive alert, what is the approximate posterior probability P(Bug | Positive)?",
                "options": ["~8.3%", "~50%", "~90%", "~99%"],
                "answer": 0,
                "weight": 8,
                "formula_hint": "Bayes Rule: P(B|+) = [P(+|B)*P(B)] / [P(+|B)*P(B) + P(+|~B)*P(~B)]",
                "explanation": "Numerator: 0.90 * 0.01 = 0.009. Denominator: 0.009 + (0.10 * 0.99) = 0.009 + 0.099 = 0.108. 0.009 / 0.108 ≈ 0.0833 (8.3%). Base-rate fallacy in practice!",
                "tip": "Remember that rare priors heavily dilute positive predictive value (Precision)."
            },

            # STEP 3: HARD - ADVANCED SCENARIO & WRITTEN SYNTHESIS (WRITING)
            {
                "id": 7,
                "step": 3,
                "step_label": "Level 3: Advanced Scenario & Synthesis (Hard)",
                "difficulty": "Hard",
                "type": "writing",
                "category": "System Architecture & Concurrency",
                "question": "Scenario: You are designing an API endpoint for an urgent flash-sale with 100,000 concurrent requests trying to purchase only 50 remaining stock items. Briefly explain your architectural approach to prevent race conditions and overselling while maintaining sub-100ms response latency.",
                "writing_prompt": "Write 2 to 4 concise sentences explaining: (1) Storage/caching layer, (2) Concurrency mechanism (e.g. Redis atomic DECR / Lua script / distributed lock), (3) Asynchronous order persistence (e.g. message queue).",
                "expected_keywords": ["redis", "atomic", "decr", "lua", "lock", "queue", "kafka", "rabbitmq", "celery", "optimistic", "pessimistic"],
                "sample_answer": "Use Redis in-memory storage with an atomic DECR or Lua script to check and decrement stock in O(1) time before hitting the database. Successful claims push an order event to an async message queue (Kafka/RabbitMQ) for database persistence, immediately returning HTTP 200 to the user.",
                "weight": 12,
                "tip": "Always mention atomic in-memory decrement (Redis Lua) to decouple instant inventory deduction from heavy database disk I/O."
            },
            {
                "id": 8,
                "step": 3,
                "step_label": "Level 3: Advanced Scenario & Synthesis (Hard)",
                "difficulty": "Hard",
                "type": "writing",
                "category": "Machine Learning Production Engineering",
                "question": "Scenario: An image classification model shows 98% accuracy on historical training and test data, but customer satisfaction drops significantly 2 months after deployment. What ML lifecycle phenomenon is occurring, and what two monitoring techniques would you implement?",
                "writing_prompt": "Write 2 to 3 sentences identifying the root issue (Data Drift / Concept Drift / Covariate Shift) and two concrete metrics/actions to monitor and mitigate it.",
                "expected_keywords": ["drift", "concept drift", "data drift", "distribution", "monitoring", "evidently", "retrain", "ks-test", "psi", "latency", "ground truth"],
                "sample_answer": "The model is suffering from Data Drift (covariate shift) or Concept Drift due to shifting input distributions over time. To detect and mitigate this, implement real-time distribution drift tests (e.g. KS-test or Population Stability Index PSI) and an automated pipeline to trigger model retraining with recent annotated samples.",
                "weight": 12,
                "tip": "Distinguish between Covariate Shift P(X) changes vs Concept Drift P(Y|X) changes when explaining ML production health."
            }
        ]
    },

    "data_science": {
        "domain_id": "data_science",
        "domain_name": "Data Science & AI / Analytics",
        "description": "Statistics, Probability, Machine Learning Modeling, SQL Analytics, and Deep Learning Pipelines.",
        "questions": [
            {
                "id": 1,
                "step": 1,
                "step_label": "Level 1: Foundation (Easy)",
                "difficulty": "Easy",
                "type": "mcq",
                "category": "Data Wrangling & Pandas",
                "question": "Which pandas method computes pairwise correlation of columns, excluding NA/null values?",
                "options": ["df.corr()", "df.cov()", "df.describe()", "df.aggregate()"],
                "answer": 0,
                "weight": 5,
                "explanation": "df.corr() calculates Pearson (default), Spearman, or Kendall correlation matrix across numeric columns.",
                "tip": "Understand the difference between Pearson (linear) and Spearman (monotonic rank) correlation."
            },
            {
                "id": 2,
                "step": 1,
                "step_label": "Level 1: Foundation (Easy)",
                "difficulty": "Easy",
                "type": "mcq",
                "category": "Supervised Learning",
                "question": "Which evaluation metric is invariant to decision threshold choice and measures the overall ranking quality of a binary classifier?",
                "options": ["ROC-AUC", "Accuracy", "Mean Absolute Error", "Precision at 0.5"],
                "answer": 0,
                "weight": 5,
                "explanation": "ROC-AUC evaluates True Positive Rate vs False Positive Rate across all possible classification thresholds.",
                "tip": "Use PR-AUC instead of ROC-AUC when positive instances are extremely sparse."
            },
            {
                "id": 3,
                "step": 2,
                "step_label": "Level 2: Math & Applied Logic (Medium)",
                "difficulty": "Medium",
                "type": "math",
                "category": "Linear Algebra & Matrices",
                "question": "Given a 2x2 matrix A = [[3, 1], [0, 2]], what are its eigenvalues λ?",
                "options": ["λ = 3 and λ = 2", "λ = 1 and λ = 0", "λ = 5 and λ = 6", "λ = -3 and λ = -2"],
                "answer": 0,
                "weight": 8,
                "formula_hint": "For an upper triangular matrix, eigenvalues are precisely the elements on the main diagonal: det(A - λI) = (3 - λ)(2 - λ) = 0.",
                "explanation": "Because A is triangular, det(A - λI) = (3 - λ)(2 - λ) - 0 = 0, giving λ1 = 3, λ2 = 2 directly.",
                "tip": "Triangular and diagonal matrices allow immediate eigenvalue reading without quadratic expansion."
            },
            {
                "id": 4,
                "step": 2,
                "step_label": "Level 2: Math & Applied Logic (Medium)",
                "difficulty": "Medium",
                "type": "math",
                "category": "Applied Statistics & Hypothesis Testing",
                "question": "In an A/B test with sample size n = 100 per variant, if the sample variance is 16, what is the standard error of the mean (SE = s / sqrt(n))?",
                "options": ["0.4", "1.6", "4.0", "0.04"],
                "answer": 0,
                "weight": 8,
                "formula_hint": "Standard Deviation s = sqrt(Variance) = sqrt(16) = 4.  SE = 4 / sqrt(100) = 4 / 10.",
                "explanation": "Variance = 16 => standard deviation s = 4. Sample size n = 100 => sqrt(n) = 10. SE = 4 / 10 = 0.4.",
                "tip": "Always double check if the prompt provided variance σ² or standard deviation σ before square rooting."
            },
            {
                "id": 5,
                "step": 3,
                "step_label": "Level 3: Advanced Scenario & Synthesis (Hard)",
                "difficulty": "Hard",
                "type": "writing",
                "category": "Feature Engineering & Data Pipeline",
                "question": "Scenario: You are given a tabular dataset with a categorical column 'zip_code' containing 12,000 distinct high-cardinality values, predicting loan default risk. Why is standard One-Hot Encoding problematic here, and what two alternative encoding strategies would you employ?",
                "writing_prompt": "Explain the curse of dimensionality/sparsity with 12,000 one-hot columns, and name 2 superior techniques (e.g. Target/Out-of-Fold Encoding, Frequency Encoding, or Embedding vectors).",
                "expected_keywords": ["sparsity", "dimension", "curse", "target encoding", "frequency", "embedding", "catboost", "weight of evidence", "overfitting", "leakage"],
                "sample_answer": "One-Hot Encoding creates 12,000 sparse columns, causing extreme memory overhead and model overfitting (curse of dimensionality). Instead, use Target Encoding with smoothing/regularization (or Out-of-Fold) to capture default rates per zip code, or learn low-dimensional entity embeddings.",
                "weight": 12,
                "tip": "Highlight target leakage prevention (K-fold out-of-fold target encoding) whenever discussing high-cardinality features."
            }
        ]
    },

    "fullstack_cloud": {
        "domain_id": "fullstack_cloud",
        "domain_name": "Full-Stack Web & Cloud Systems",
        "description": "Frontend Frameworks, REST/GraphQL APIs, Containerization, Microservices, and Relational Databases.",
        "questions": [
            {
                "id": 1,
                "step": 1,
                "step_label": "Level 1: Foundation (Easy)",
                "difficulty": "Easy",
                "type": "mcq",
                "category": "Web Core & HTTP",
                "question": "Which HTTP status code signifies that a client must authenticate itself to get the requested response (Unauthorized)?",
                "options": ["401", "403", "404", "502"],
                "answer": 0,
                "weight": 5,
                "explanation": "HTTP 401 indicates lack of valid authentication credentials, whereas 403 Forbidden indicates credentials are recognized but lack permissions.",
                "tip": "Distinguish between 401 (Authentication required) and 403 (Authorization forbidden)."
            },
            {
                "id": 2,
                "step": 1,
                "step_label": "Level 1: Foundation (Easy)",
                "difficulty": "Easy",
                "type": "mcq",
                "category": "React State Management",
                "question": "Why shouldn't state variables in React be mutated directly (e.g., state.count = 5)?",
                "options": ["React compares state references to trigger re-renders; direct mutation does not change object reference", "It will crash the JavaScript V8 engine", "State variables are read-only at the OS level", "Browser local storage will get corrupted"],
                "answer": 0,
                "weight": 5,
                "explanation": "React uses Object.is shallow equality comparison on state. Direct mutations bypass reference updates and prevent components from re-rendering.",
                "tip": "Always produce new immutable copies using spread operators (...state) or updater callbacks."
            },
            {
                "id": 3,
                "step": 2,
                "step_label": "Level 2: Math & Applied Logic (Medium)",
                "difficulty": "Medium",
                "type": "math",
                "category": "Cloud Sizing & Availability Calculation",
                "question": "An architecture consists of 3 independent sequential services (API Gateway, Auth Service, Database). Each service has an individual SLA uptime of 99% (0.99). What is the total composite availability of the end-to-end system?",
                "options": ["~97.03%", "99.00%", "99.90%", "~95.50%"],
                "answer": 0,
                "weight": 8,
                "formula_hint": "Composite Availability = Product of individual service uptimes = 0.99 * 0.99 * 0.99",
                "explanation": "0.99 * 0.99 * 0.99 = 0.970299 ≈ 97.03%. Sequential dependencies compound downtime significantly!",
                "tip": "Sequential services multiply uptimes (degrading overall SLA); parallel redundant services multiply failure rates."
            },
            {
                "id": 4,
                "step": 3,
                "step_label": "Level 3: Advanced Scenario & Synthesis (Hard)",
                "difficulty": "Hard",
                "type": "writing",
                "category": "Database Performance & Indexing",
                "question": "Scenario: A query `SELECT * FROM orders WHERE customer_id = 123 ORDER BY created_at DESC LIMIT 10` takes 4.2 seconds on a table with 50 million rows. What database index would you create, and how does it eliminate both table scan and filesort operations?",
                "writing_prompt": "State the exact composite index definition `(colA, colB)` and explain how B-tree ordering satisfies both equality filtering and sorting without extra disk passes.",
                "expected_keywords": ["composite", "index", "b-tree", "customer_id", "created_at", "filesort", "covering", "seek"],
                "sample_answer": "Create a composite B-tree index on (customer_id, created_at DESC). The database engine uses the first column to perform an O(log N) equality seek to customer_id = 123, and immediately traverses the pre-sorted leaf nodes by created_at DESC, completely avoiding a full table scan and in-memory filesort.",
                "weight": 12,
                "tip": "Remember the Leftmost Prefix rule in composite indices: Equality columns first, followed by range/order-by columns."
            }
        ]
    },

    "electronics_iot": {
        "domain_id": "electronics_iot",
        "domain_name": "Electronics, Embedded Systems & IoT",
        "description": "Digital Logic, Microcontrollers (ARM/ESP32), Embedded C, Signal Processing, and IoT Protocols.",
        "questions": [
            {
                "id": 1,
                "step": 1,
                "step_label": "Level 1: Foundation (Easy)",
                "difficulty": "Easy",
                "type": "mcq",
                "category": "Embedded Communication Protocols",
                "question": "Which serial communication protocol uses two bidirectional open-drain lines (SDA and SCL) with pull-up resistors to support multi-master bus topology?",
                "options": ["I2C", "SPI", "UART", "RS-232"],
                "answer": 0,
                "weight": 5,
                "explanation": "I2C (Inter-Integrated Circuit) uses Serial Data (SDA) and Serial Clock (SCL) with pull-up resistors.",
                "tip": "Compare I2C (2 wires, addressing) with SPI (4 wires, faster, chip-select lines)."
            },
            {
                "id": 2,
                "step": 2,
                "step_label": "Level 2: Math & Applied Logic (Medium)",
                "difficulty": "Medium",
                "type": "math",
                "category": "Ohm's Law & Power Electronics",
                "question": "An ESP32 microcontroller GPIO pin outputs 3.3V to illuminate an LED with a forward voltage of 2.1V. If the desired forward current is 20 mA (0.02 A), what resistance value R is required?",
                "options": ["60 Ω", "165 Ω", "270 Ω", "10 Ω"],
                "answer": 0,
                "weight": 8,
                "formula_hint": "R = (V_supply - V_forward) / I_forward = (3.3 - 2.1) / 0.02 = 1.2 / 0.02",
                "explanation": "Voltage drop across resistor = 3.3V - 2.1V = 1.2V. R = 1.2V / 0.02A = 60 Ohms.",
                "tip": "Standard E24 resistor closest value would be 62 or 68 Ohms."
            },
            {
                "id": 3,
                "step": 3,
                "step_label": "Level 3: Advanced Scenario & Synthesis (Hard)",
                "difficulty": "Hard",
                "type": "writing",
                "category": "Real-Time Embedded Systems (RTOS)",
                "question": "Scenario: In an embedded RTOS controlling a medical infusion pump, a low-priority logging task holding a mutex blocks a high-priority motor task because a medium-priority network task preempts the low-priority task. Name this hazard and state the standard solution.",
                "writing_prompt": "Identify the concurrency hazard (Priority Inversion) and explain how Priority Inheritance or Priority Ceiling solves it.",
                "expected_keywords": ["priority inversion", "inheritance", "priority inheritance", "ceiling", "mutex", "deadlock", "preemption"],
                "sample_answer": "This classic hazard is Priority Inversion. The standard remedy is Priority Inheritance (or Priority Ceiling Protocol), where the low-priority task temporarily inherits the high priority of the waiting task while holding the shared mutex, preventing intermediate tasks from preempting it.",
                "weight": 12,
                "tip": "Priority inversion is famously known for causing system resets on the Mars Pathfinder spacecraft in 1997."
            }
        ]
    }
}

# Flat fallback for backward compatibility
DIAGNOSTIC_QUESTIONS = DOMAIN_DIAGNOSTICS["cs_ai"]["questions"]


def calculate_ai_match_score(student_skills, required_skills, preferred_skills=None):
    """
    Computes a semantic match score (0-100%) between student skills and job requirements.
    Simulates sentence-transformers cosine similarity with domain skill weighting.
    """
    if not required_skills:
        return 80

    student_set = {str(s).strip().lower() for s in student_skills}
    req_set = {str(r).strip().lower() for r in required_skills}
    pref_set = {str(p).strip().lower() for p in (preferred_skills or [])}

    # Match required skills (75% of score)
    req_matches = sum(1 for r in req_set if any(r in s or s in r for s in student_set))
    req_score = (req_matches / len(req_set)) * 75 if req_set else 75

    # Match preferred skills (25% of score)
    pref_score = 15  # baseline
    if pref_set:
        pref_matches = sum(1 for p in pref_set if any(p in s or s in p for s in student_set))
        pref_score = (pref_matches / len(pref_set)) * 25

    total = int(round(req_score + pref_score))
    return max(45, min(98, total))


def evaluate_diagnostic(answers_dict, domain="cs_ai"):
    """
    Evaluates student's answers (MCQ, Math calculations, and Written synthesis).
    Computes dimensional scores (Foundation, Math, Writing), granular reviews,
    identifies precise gaps, and builds an actionable 4-week remedial roadmap.
    """
    domain_info = DOMAIN_DIAGNOSTICS.get(domain, DOMAIN_DIAGNOSTICS["cs_ai"])
    questions = domain_info["questions"]

    total_possible = sum(q["weight"] for q in questions)
    earned_points = 0

    dim_scores = {
        "foundation": {"earned": 0, "total": 0, "label": "Foundational Concepts (Easy)"},
        "math_analytical": {"earned": 0, "total": 0, "label": "Mathematical & Analytical Rigor (Medium)"},
        "written_synthesis": {"earned": 0, "total": 0, "label": "System Synthesis & Technical Writing (Hard)"}
    }

    question_reviews = []
    gaps = []
    strengths = []

    for q in questions:
        qid = str(q["id"])
        w = q["weight"]
        q_type = q.get("type", "mcq")
        user_ans = answers_dict.get(qid) if qid in answers_dict else answers_dict.get(q["id"])

        dim_key = "foundation" if q.get("step") == 1 else "math_analytical" if q.get("step") == 2 else "written_synthesis"
        dim_scores[dim_key]["total"] += w

        is_correct = False
        earned_for_q = 0
        user_display = "Not Answered"

        if q_type in ["mcq", "math"]:
            if user_ans is not None:
                try:
                    selected_idx = int(user_ans)
                    if 0 <= selected_idx < len(q["options"]):
                        user_display = q["options"][selected_idx]
                    if selected_idx == q["answer"]:
                        is_correct = True
                        earned_for_q = w
                except (ValueError, TypeError):
                    pass
        elif q_type == "writing":
            text = str(user_ans or "").strip()
            user_display = text if text else "No written response provided"
            if len(text) >= 15:
                keywords = q.get("expected_keywords", [])
                text_lower = text.lower()
                matches = sum(1 for kw in keywords if kw.lower() in text_lower)
                if matches >= 3 or (matches >= 2 and len(text.split()) >= 15):
                    earned_for_q = w
                    is_correct = True
                elif matches >= 1:
                    earned_for_q = int(round(w * 0.65))
                    is_correct = True
                else:
                    earned_for_q = int(round(w * 0.4))
            else:
                earned_for_q = 0

        earned_points += earned_for_q
        dim_scores[dim_key]["earned"] += earned_for_q

        if is_correct:
            strengths.append(f"{q['category']} ({q['difficulty']})")
        else:
            gaps.append(f"{q['category']}: {q.get('tip', 'Review core fundamentals')}")

        question_reviews.append({
            "id": q["id"],
            "step": q.get("step", 1),
            "step_label": q.get("step_label", "Level 1"),
            "category": q["category"],
            "difficulty": q["difficulty"],
            "type": q_type,
            "question": q["question"],
            "user_answer": user_display,
            "correct_answer": q["options"][q["answer"]] if q_type in ["mcq", "math"] else q.get("sample_answer", ""),
            "is_correct": is_correct,
            "earned_points": earned_for_q,
            "max_points": w,
            "explanation": q.get("explanation") or q.get("sample_answer"),
            "tip": q.get("tip", "Review topic fundamentals")
        })

    overall_percentage = int(round((earned_points / max(total_possible, 1)) * 100))

    dimensions_summary = {}
    for k, v in dim_scores.items():
        pct = int(round((v["earned"] / max(v["total"], 1)) * 100))
        dimensions_summary[k] = {
            "label": v["label"],
            "score": pct,
            "earned": v["earned"],
            "total": v["total"],
            "status": "Mastered" if pct >= 80 else "Adequate" if pct >= 60 else "Critical Gap"
        }

    if overall_percentage >= 90:
        percentile = 96
        readiness = "🌟 Industry Ready (Top 4% Candidate)"
        badge_color = "emerald"
    elif overall_percentage >= 75:
        percentile = 84
        readiness = "🚀 Placement Ready (Above National Benchmark)"
        badge_color = "sky"
    elif overall_percentage >= 60:
        percentile = 68
        readiness = "📈 Fast Track (2-3 Weeks Targeted Remediation)"
        badge_color = "amber"
    else:
        percentile = 42
        readiness = "🌱 High Potential (Foundational Reinforcement Needed)"
        badge_color = "rose"

    roadmap = [
        {
            "week": "Week 1",
            "phase": "Foundational Mastery & Discrete Concepts",
            "focus": "Algorithm Complexity, Core Data Structures & Memory Hierarchy",
            "courses": [
                {"name": "MIT 6.006: Introduction to Algorithms", "platform": "MIT OpenCourseWare (Free)", "link": "https://ocw.mit.edu"},
                {"name": "CS50 Computer Science Foundations", "platform": "edX / Harvard", "link": "https://edx.org"}
            ],
            "milestone": "Implement 15 LeetCode Medium data structure problems with zero memory leaks."
        },
        {
            "week": "Week 2",
            "phase": "Mathematical & Analytical Rigor",
            "focus": "Recurrence Relations, Master Theorem, and Probability in Systems",
            "courses": [
                {"name": "Discrete Mathematics & Graph Theory", "platform": "NPTEL India (IIT Kharagpur)", "link": "https://nptel.ac.in"},
                {"name": "Probability & Statistics for Machine Learning", "platform": "Khan Academy (Free)", "link": "https://khanacademy.org"}
            ],
            "milestone": "Pass Master Theorem & Probability self-assessment with >90% accuracy."
        },
        {
            "week": "Week 3",
            "phase": "System Architecture & High-Concurrency Design",
            "focus": "Atomic In-Memory Caching (Redis), Sharding, and Distributed Locks",
            "courses": [
                {"name": "System Design Primer", "platform": "GitHub Open Source", "link": "https://github.com/donnemartin/system-design-primer"},
                {"name": "High Performance Microservices & Event Queues", "platform": "Coursera", "link": "https://coursera.org"}
            ],
            "milestone": "Build a simulated flash-sale checkout API supporting 10,000 requests/sec."
        },
        {
            "week": "Week 4",
            "phase": "Mock Placement Drive & Faculty Verification",
            "focus": "Technical Synthesis, Voice Interview Drills, and Resume Polish",
            "courses": [
                {"name": "REDDOT AI Career Coach Interactive Mock Session", "platform": "REDDOT Platform", "link": "#coach"},
                {"name": "Industry Panel Interview Prep", "platform": "AcademicX Vault", "link": "#"}
            ],
            "milestone": "Achieve >85% in REDDOT Technical Mock Interview."
        }
    ]

    return {
        "overall_score": overall_percentage,
        "percentile": percentile,
        "industry_benchmark": 75,
        "readiness_badge": readiness,
        "badge_color": badge_color,
        "domain_id": domain_info["domain_id"],
        "domain_name": domain_info["domain_name"],
        "dimensions": dimensions_summary,
        "question_reviews": question_reviews,
        "strengths": strengths[:4],
        "gaps": gaps[:4] if gaps else ["Review advanced edge cases in high-throughput systems"],
        "recommendations": roadmap
    }


def audit_resume_text(resume_text, target_role="Software Engineer"):
    """
    Performs deep resume review, extracts technical skills and academic background,
    evaluates ATS and company hiring readiness, and generates targeted actionable recommendations:
    - Curated courses with direct portal and video links
    - High-value hackathons and competitions
    - Industry certifications that boost shortlist rates with direct apply links
    - High-impact resume-boosting projects with quantified resume bullets
    """
    known_skills = [
        "Python", "Django", "React", "JavaScript", "TypeScript", "Node.js", "Docker",
        "Kubernetes", "PostgreSQL", "MySQL", "MongoDB", "Redis", "AWS", "Git",
        "CI/CD", "Machine Learning", "PyTorch", "TensorFlow", "FastAPI", "Tailwind CSS",
        "REST API", "GraphQL", "Microservices", "Celery", "Kafka", "Linux", "Java", "C++"
    ]

    found = []
    text_lower = (resume_text or "").lower()
    for s in known_skills:
        if re.search(r'\b' + re.escape(s.lower()) + r'\b', text_lower):
            found.append(s)

    target_requirements = {
        "Software Engineer": ["Python", "React", "PostgreSQL", "Docker", "Git", "REST API", "Redis"],
        "AI/ML Engineer": ["Python", "PyTorch", "TensorFlow", "Machine Learning", "Docker", "FastAPI"],
        "AI/ML Specialist": ["Python", "PyTorch", "TensorFlow", "Machine Learning", "Docker", "FastAPI"],
        "Full Stack Developer": ["React", "JavaScript", "Python", "Django", "PostgreSQL", "Tailwind CSS", "Redis"],
        "Cloud/DevOps Engineer": ["Docker", "Kubernetes", "AWS", "CI/CD", "Git", "Redis", "Linux"]
    }

    core_reqs = target_requirements.get(target_role, ["Python", "React", "Docker", "PostgreSQL", "Git"])
    missing = [req for req in core_reqs if req not in found]

    match_ratio = (len(found) / max(len(found) + len(missing), 1))
    ats_score = int(round(55 + (match_ratio * 40)))
    ats_score = min(96, max(54, ats_score))

    # Role-specific curated deep recommendations
    if "ai" in target_role.lower() or "machine learning" in text_lower:
        courses = [
            {
                "id": "c1",
                "title": "DeepLearning.AI: Machine Learning Specialization",
                "field": "Artificial Intelligence & Statistical Modeling",
                "provider": "Stanford Online / Coursera",
                "portal_url": "https://www.coursera.org/specializations/machine-learning-introduction",
                "video_url": "https://www.youtube.com/watch?v=PPLop4L2eGk",
                "duration": "8 Weeks (Self-Paced)",
                "cost": "Free to Audit / Financial Aid Available",
                "why_recommended": "Master mathematical foundations of Supervised/Unsupervised Learning, regularization, and gradient descent.",
                "badge": "Core Foundation"
            },
            {
                "id": "c2",
                "title": "CS231n: Deep Learning for Computer Vision",
                "field": "Neural Networks & Modern Architectures",
                "provider": "Stanford University",
                "portal_url": "https://cs231n.stanford.edu/",
                "video_url": "https://www.youtube.com/watch?v=vT1JzLTH4G4",
                "duration": "10 Weeks",
                "cost": "100% Free Open Courseware",
                "why_recommended": "Delivers rigorous understanding of backpropagation, ConvNets, attention mechanisms, and PyTorch tensors.",
                "badge": "Advanced Depth"
            },
            {
                "id": "c3",
                "title": "Hugging Face Transformers & NLP Course",
                "field": "Generative AI & LLM Fine-Tuning",
                "provider": "Hugging Face Open Academy",
                "portal_url": "https://huggingface.co/learn/nlp-course/",
                "video_url": "https://www.youtube.com/watch?v=00GKzGyUFEs",
                "duration": "4 Weeks (Hands-on Labs)",
                "cost": "100% Free",
                "why_recommended": "Teaches tokenizer pipelines, dataset curation, PEFT/LoRA fine-tuning, and model quantization for production.",
                "badge": "GenAI Production"
            },
            {
                "id": "c4",
                "title": "NPTEL: Deep Learning & Reinforcement Learning",
                "field": "Mathematical Rigor & Industry Systems",
                "provider": "IIT Madras (NPTEL India)",
                "portal_url": "https://nptel.ac.in/courses/106106184",
                "video_url": "https://www.youtube.com/watch?v=0IAPZzGSbME",
                "duration": "12 Weeks",
                "cost": "Free (Govt. Exam Option)",
                "why_recommended": "Government-recognized credit course covering loss landscapes, policy gradients, and Markov decision processes.",
                "badge": "Academic Certified"
            }
        ]

        competitions = [
            {
                "id": "cmp1",
                "title": "Kaggle Featured Competitions & Community Benchmarks",
                "organizer": "Google / Kaggle",
                "portal_url": "https://www.kaggle.com/competitions",
                "type": "Global Data Science Leaderboard",
                "hiring_impact": "Top 10% finish or Kaggle Notebook Expert status provides immediate resume screening pass at Tier-1 AI firms.",
                "recommended_project_angle": "Focus on tabular feature engineering or multimodal classification with ensemble blending.",
                "badge": "Tier-1 Signal"
            },
            {
                "id": "cmp2",
                "title": "Smart India Hackathon (SIH 2026) - AI & Smart Automation",
                "organizer": "Ministry of Education & AICTE",
                "portal_url": "https://www.sih.gov.in/",
                "type": "National Innovation Grand Challenge",
                "hiring_impact": "Finalist citation is officially verified on APAAR and recognized by national tech recruiters for direct placement talks.",
                "recommended_project_angle": "Automated document OCR & APAAR semantic verification pipeline with local offline LLM inference.",
                "badge": "Govt Recognized"
            },
            {
                "id": "cmp3",
                "title": "Google Solution Challenge 2026",
                "organizer": "Google Developer Student Clubs",
                "portal_url": "https://developers.google.com/community/dsc-solution-challenge",
                "type": "Global Social Impact Tech Challenge",
                "hiring_impact": "Top 100 global teams receive 1-on-1 mentorship from Google engineers and priority consideration for internships.",
                "recommended_project_angle": "AI accessibility tool or agricultural disease detector powered by TensorFlow Lite and Firebase.",
                "badge": "Global Reach"
            }
        ]

        certifications = [
            {
                "id": "crt1",
                "title": "TensorFlow Developer Certificate (TFDC)",
                "issuer": "Google / TensorFlow",
                "apply_url": "https://www.tensorflow.org/certificate",
                "hiring_boost_percentage": "+48% Interview Shortlist Rate",
                "why_companies_hire": "Validates proficiency with ConvNets, NLP sequences, and practical model training under test constraints.",
                "exam_code": "TF-DEV-001",
                "badge": "Gold Standard"
            },
            {
                "id": "crt2",
                "title": "AWS Certified Machine Learning – Specialty (MLS-C01)",
                "issuer": "Amazon Web Services (AWS)",
                "apply_url": "https://aws.amazon.com/certification/certified-machine-learning-specialty/",
                "hiring_boost_percentage": "+52% Shortlist Rate for AI Cloud Roles",
                "why_companies_hire": "Proves ability to architect, train, tune, and deploy SageMaker endpoints in secure high-availability VPCs.",
                "exam_code": "MLS-C01",
                "badge": "Enterprise Cloud"
            },
            {
                "id": "crt3",
                "title": "Databricks Certified Generative AI Engineer Associate",
                "issuer": "Databricks Academy",
                "apply_url": "https://www.databricks.com/learn/certification/generative-ai-engineer-associate",
                "hiring_boost_percentage": "+39% Faster Screening",
                "why_companies_hire": "Verifies practical implementation of vector databases, LangChain/LlamaIndex agents, and RAG evaluation.",
                "exam_code": "DB-GENAI-A",
                "badge": "High Demand"
            }
        ]

        projects = [
            {
                "id": "p1",
                "title": "Real-Time Semantic Vector Search & Hybrid RAG Engine",
                "domain": "Generative AI & Production ML",
                "tech_stack": ["Python", "PyTorch", "Qdrant / Milvus", "FastAPI", "React 19"],
                "why_boosts_resume": "Demonstrates practical knowledge of embedding spaces, HNSW vector indexing, and low-latency chunk retrieval beyond basic wrapper APIs.",
                "github_url": "https://github.com/qdrant/qdrant",
                "resume_bullet_points": [
                    "Engineered a production semantic RAG engine using BAAI/bge-large embeddings and Qdrant vector index, indexing 250,000+ technical documents with sub-22ms retrieval latency.",
                    "Implemented Cross-Encoder reciprocal rank fusion (RRF) and dynamic chunking, boosting retrieval precision by 34% over baseline keyword search."
                ]
            },
            {
                "id": "p2",
                "title": "Low-Latency Model Serving Gateway with Dynamic Batching",
                "domain": "MLOps & Inference Engineering",
                "tech_stack": ["FastAPI", "Docker", "Triton Inference Server", "TensorRT", "Prometheus"],
                "why_boosts_resume": "Addresses real-world inference throughput, memory limits, and p99 SLA compliance that tech leads care about.",
                "github_url": "https://github.com/triton-inference-server/server",
                "resume_bullet_points": [
                    "Architected high-throughput inference microservice with TensorRT FP16 quantization, achieving a 3.2x speedup in token generation.",
                    "Implemented dynamic request batching and Prometheus telemetry to sustain 1,200 req/sec while keeping p99 response time below 45ms."
                ]
            }
        ]
    else:
        # Full Stack / Software Engineering Track
        courses = [
            {
                "id": "c1",
                "title": "Full Stack Open: Deep Dive into Modern Web Development",
                "field": "Modern Full-Stack & System Design",
                "provider": "University of Helsinki",
                "portal_url": "https://fullstackopen.com/en/",
                "video_url": "https://www.youtube.com/watch?v=nu_pCVPKzTk",
                "duration": "8 Weeks (Comprehensive)",
                "cost": "100% Free & Open Source",
                "why_recommended": "Covers React, Node/Express, REST/GraphQL, containerization, and relational database migrations with automated testing.",
                "badge": "Full Stack Standard"
            },
            {
                "id": "c2",
                "title": "MIT 6.006: Introduction to Algorithms",
                "field": "Data Structures & Computational Complexity",
                "provider": "MIT OpenCourseWare",
                "portal_url": "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/",
                "video_url": "https://www.youtube.com/watch?v=ZA-tUyM_y7s",
                "duration": "12 Weeks (Self-Paced)",
                "cost": "100% Free",
                "why_recommended": "Eliminates algorithmic loopholes in graph algorithms (Dijkstra, BFS), dynamic programming, and recurrence relations.",
                "badge": "Core Algorithms"
            },
            {
                "id": "c3",
                "title": "CS50: Web Programming with Python and JavaScript",
                "field": "Backend Architecture & Django REST",
                "provider": "Harvard University / edX",
                "portal_url": "https://cs50.harvard.edu/web/",
                "video_url": "https://www.youtube.com/watch?v=8mAITcNt710",
                "duration": "10 Weeks",
                "cost": "Free to Audit",
                "why_recommended": "Teaches secure authentication, ORM performance, database transactions, and scalable API architecture.",
                "badge": "Production Architecture"
            },
            {
                "id": "c4",
                "title": "Docker & Kubernetes: The Practical Guide",
                "field": "Cloud Infrastructure & Containerization",
                "provider": "FreeCodeCamp / CNCF Community",
                "portal_url": "https://www.freecodecamp.org/news/learn-docker-containers-full-course/",
                "video_url": "https://www.youtube.com/watch?v=fqMOX6JJhGo",
                "duration": "4 Weeks",
                "cost": "100% Free",
                "why_recommended": "Fills the Docker & DevOps gap in your resume, directly qualifying you for Tier-1 engineering interview standards.",
                "badge": "Essential DevOps"
            }
        ]

        competitions = [
            {
                "id": "cmp1",
                "title": "Smart India Hackathon (SIH 2026) - Software Edition",
                "organizer": "Ministry of Education & AICTE",
                "portal_url": "https://www.sih.gov.in/",
                "type": "National Innovation Grand Challenge",
                "hiring_impact": "Winners receive immediate corporate internship interviews, institutional grants, and high-visibility APAAR badges.",
                "recommended_project_angle": "Institutional placement grid or automated credential verification with tamper-proof audit trails.",
                "badge": "Top National Event"
            },
            {
                "id": "cmp2",
                "title": "Unstop National Tech Competitions (Flipkart GRiD, Walmart Spark)",
                "organizer": "Unstop Placement Portal",
                "portal_url": "https://unstop.com/hackathons",
                "type": "Corporate Hiring Hackathons",
                "hiring_impact": "Direct fast-track recruitment channel for 20+ Tier-1 companies bypassing standard resume applicant tracking systems.",
                "recommended_project_angle": "Real-time supply chain or high-concurrency inventory reservation API.",
                "badge": "Direct Hiring"
            },
            {
                "id": "cmp3",
                "title": "Google Solution Challenge 2026",
                "organizer": "Google Developer Student Clubs",
                "portal_url": "https://developers.google.com/community/dsc-solution-challenge",
                "type": "Global Student Tech Challenge",
                "hiring_impact": "Top finalists get direct visibility with Google engineering managers and international mentorship.",
                "recommended_project_angle": "Cloud-native educational equity platform integrated with DigiLocker and open educational standards.",
                "badge": "Global Prestige"
            }
        ]

        certifications = [
            {
                "id": "crt1",
                "title": "AWS Certified Solutions Architect – Associate (SAA-C03)",
                "issuer": "Amazon Web Services (AWS)",
                "apply_url": "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
                "hiring_boost_percentage": "+44% Resume Selection Rate",
                "why_companies_hire": "Demonstrates you understand load balancing, multi-tier architectures, auto-scaling, and cost-efficient cloud engineering.",
                "exam_code": "SAA-C03",
                "badge": "Industry Gold Standard"
            },
            {
                "id": "crt2",
                "title": "CKA: Certified Kubernetes Administrator",
                "issuer": "Cloud Native Computing Foundation (CNCF)",
                "apply_url": "https://www.cncf.io/certification/cka/",
                "hiring_boost_percentage": "+56% Shortlist Rate for Backend/DevOps",
                "why_companies_hire": "100% hands-on performance-based exam that proves you can debug pods, manage clusters, and maintain microservice health.",
                "exam_code": "CKA-Linux",
                "badge": "High Pay Premium"
            },
            {
                "id": "crt3",
                "title": "Meta Professional Backend Developer Certificate",
                "issuer": "Meta / Coursera",
                "apply_url": "https://www.coursera.org/professional-certificates/meta-back-end-developer",
                "hiring_boost_percentage": "+38% Interview Calls",
                "why_companies_hire": "Industry-accredited credential providing exclusive entry into Meta Career Network job portals.",
                "exam_code": "META-BACKEND",
                "badge": "Accredited Career"
            }
        ]

        projects = [
            {
                "id": "p1",
                "title": "High-Concurrency Flash-Sale Ingestion Engine with Redis Lua & Kafka",
                "domain": "Distributed Backend Architecture",
                "tech_stack": ["Python / FastAPI", "Redis (Lua Scripting)", "Apache Kafka", "PostgreSQL", "Docker"],
                "why_boosts_resume": "Addresses distributed race conditions, zero-overselling guarantees, and sub-50ms latency under 100,000 req/sec stress tests.",
                "github_url": "https://github.com/donnemartin/system-design-primer",
                "resume_bullet_points": [
                    "Engineered an atomic in-memory inventory reservation engine with Redis Lua scripts, guaranteeing zero-overselling across 50,000 concurrent simulated requests.",
                    "Decoupled relational database persistence via Apache Kafka consumer groups, slashing p99 latency by 64% (from 280ms to 32ms) and eliminating database deadlocks."
                ]
            },
            {
                "id": "p2",
                "title": "REDDOT: National Higher Education & Verifiable Placement Grid",
                "domain": "Full-Stack Enterprise & Institutional Infrastructure",
                "tech_stack": ["React 19", "Django REST Framework", "Docker", "PostgreSQL", "SHA-256 Hashes"],
                "why_boosts_resume": "Proves real-world execution handling APAAR/DigiLocker verification, role-based dashboards, and responsive modern UX.",
                "github_url": "https://github.com/django/django",
                "resume_bullet_points": [
                    "Constructed an authenticated higher education credential verification pipeline compliant with national APAAR & DigiLocker protocols.",
                    "Optimized database indexing and ORM query serialization, cutting average dashboard loading time by 48%."
                ]
            }
        ]

    suggestions = [
        "Include measurable quantitative achievements (e.g. 'Optimized API latency by 35%').",
        f"Add the missing required competencies for {target_role}: {', '.join(missing)}." if missing else "Great keyword alignment for target role!",
        "Study the recommended courses with direct video links below to master theoretical gaps.",
        "Enroll in recommended certifications and competitions to create verified signals that companies hire for.",
        "Build the recommended high-impact projects and use the quantified bullet points on your resume."
    ]

    return {
        "ats_score": ats_score,
        "skills_detected": found,
        "missing_keywords": missing,
        "suggestions": suggestions,
        "target_role": target_role,
        "recommended_courses": courses,
        "competitions": competitions,
        "certifications": certifications,
        "recommended_projects": projects,
        "deep_analysis_completed": True
    }


# =====================================================================
# REALISTIC COMPANY-STYLE MOCK INTERVIEW TRACKS & LOOPHOLE EVALUATION
# Organized in 4 Progressive Rounds (Basic/Easy -> Medium -> Hard -> Behavioral)
# =====================================================================

COMPANY_INTERVIEW_TRACKS = {
    "AI/ML Engineer": {
        "role": "AI/ML Engineer",
        "description": "Model Architecture, Optimization, Distributed Training & Production Inference",
        "rounds": [
            {
                "round_num": 1,
                "round_title": "Round 1: Core Fundamentals & Warm-up",
                "difficulty": "Easy",
                "interviewer_intent": "Verify foundational grasp of regularization and loss landscapes without rote memorization.",
                "question": "Can you explain the mathematical and geometric difference between L1 (Lasso) and L2 (Ridge) regularization, and why L1 drives weights to absolute zero (producing sparsity)?",
                "hint": "Think about the geometric shape of the constraint boundaries (diamond in L1 vs sphere in L2) and where the loss contours intersect first.",
                "expected_keywords": ["diamond", "sparsity", "corner", "derivative", "penalty", "weights", "feature selection", "contour", "l1", "l2"],
                "sample_benchmark": "L1 adds the sum of absolute weights to the loss, creating a diamond-shaped constraint region with sharp corners along the coordinate axes. The elliptical contours of the unconstrained loss are most likely to intersect L1 constraints at these axis corners, setting specific weights strictly to zero. L2 uses squared norms, creating a spherical constraint where weights shrink smoothly toward zero but rarely reach exact zero.",
                "loophole_checklist": [
                    {"check": "sparse", "advice": "Did not explain why sparsity occurs geometrically via axis corners.", "penalty": 4},
                    {"check": "diamond|corner", "advice": "Failed to mention diamond vs circular constraint geometry.", "penalty": 3}
                ]
            },
            {
                "round_num": 2,
                "round_title": "Round 2: Problem Solving & Technical Logic",
                "difficulty": "Medium",
                "interviewer_intent": "Examine how you approach real-world training anomalies and class imbalance.",
                "question": "In a fraud detection model where only 0.2% of transactions are fraudulent, your model gets 99.8% training accuracy but misses real fraud in production. What specific loss functions, sampling strategies, and evaluation metrics would you adopt to fix this?",
                "hint": "Discuss Focal Loss or Weighted Cross-Entropy, SMOTE or Under-sampling, and PR-AUC / Cost-Sensitive matrices over Accuracy.",
                "expected_keywords": ["focal loss", "smote", "pr-auc", "precision", "recall", "cost-sensitive", "imbalance", "threshold", "weighted", "f1"],
                "sample_benchmark": "Accuracy is misleading due to the severe 99.8% majority class skew. First, switch from standard cross-entropy to Focal Loss or Class-Weighted Cross-Entropy to penalize false negatives heavily. Second, apply stratified under-sampling or SMOTE on the minority class during batch generation. Third, evaluate via Precision-Recall AUC (PR-AUC) and optimize decision thresholds against a business-weighted financial loss matrix rather than defaulting to 0.5.",
                "loophole_checklist": [
                    {"check": "focal|weighted", "advice": "Did not mention modifying the loss function (Focal Loss or class weights).", "penalty": 4},
                    {"check": "pr-auc|precision", "advice": "Relied on generic metrics without highlighting PR-AUC for extreme sparsity.", "penalty": 3}
                ]
            },
            {
                "round_num": 3,
                "round_title": "Round 3: High-Scalability System Architecture",
                "difficulty": "Hard",
                "interviewer_intent": "Gauge production engineering maturity, sub-second latency constraints, and distributed scaling.",
                "question": "Architect an end-to-end real-time vector search recommendation engine serving 50,000 requests/sec with p99 latency under 25ms. Walk me through candidate retrieval (ANN), multi-stage re-ranking, and caching.",
                "hint": "Separate two-stage retrieval: fast HNSW vector lookup in Milvus/Qdrant + Redis caching -> heavy cross-encoder ranking on GPU/Triton.",
                "expected_keywords": ["hnsw", "redis", "ann", "two-stage", "ranking", "retrieval", "latency", "milvus", "qdrant", "triton", "quantization", "p99"],
                "sample_benchmark": "Adopt a decoupled two-stage funnel: 1) Candidate Retrieval: Query embedding generated via quantized lightweight model, searching millions of vectors in Milvus/Qdrant using HNSW index with sub-10ms latency to retrieve top-200 candidates. A Redis cache caches hot query embeddings and frequent candidate lists. 2) Re-Ranking: The top 200 candidates pass to an optimized cross-encoder hosted on Triton Inference Server with TensorRT FP16 quantization. The final top 10 results are returned under 20ms p99.",
                "loophole_checklist": [
                    {"check": "two-stage|funnel|retrieval", "advice": "Treated the recommendation problem as a monolithic model instead of a two-stage retrieval + re-ranking pipeline.", "penalty": 5},
                    {"check": "hnsw|ann|quantiz", "advice": "Did not specify approximate nearest neighbor (HNSW/IVF) indexing or quantization for sub-25ms latency.", "penalty": 4}
                ]
            },
            {
                "round_num": 4,
                "round_title": "Round 4: Behavioral & STAR Leadership Principles",
                "difficulty": "Behavioral",
                "interviewer_intent": "Evaluate collaborative decision making, handling technical disagreements, and STAR structuring.",
                "question": "Describe a situation where a technical stakeholder or manager insisted on pushing a model to production that you believed had severe safety, latency, or bias flaws. How did you handle the conflict, and what was the quantifiable outcome?",
                "hint": "Structure your answer using STAR (Situation, Task, Action, Result). Highlight objective data over emotion and focus on company risk mitigation.",
                "expected_keywords": ["situation", "task", "action", "result", "metric", "stakeholder", "data", "compromise", "test", "latency", "benchmark"],
                "sample_benchmark": "Situation: Prior to a campus placement portal launch, our product lead wanted to deploy a high-accuracy LLM resume matcher that had a 4.8s p95 latency. Task: I needed to demonstrate the production risk and propose an alternative without delaying the go-live. Action: I built a rapid A/B stress test demonstrating that under 500 concurrent users, the endpoint threw 504 timeouts on 18% of requests. I then implemented a distilled student-teacher model. Result: Reduced latency by 76% to 220ms while retaining 96.4% ranking parity, successfully launching on time with zero downtime.",
                "loophole_checklist": [
                    {"check": "situation|action|result|%|reduced|ms", "advice": "Missing concrete quantifiable metrics (e.g. latency % reduction, failure rate).", "penalty": 4},
                    {"check": "test|data|benchmark", "advice": "Lacked objective data-driven proof used to resolve the conflict constructively.", "penalty": 3}
                ]
            }
        ]
    },

    "Full Stack Developer": {
        "role": "Full Stack Developer",
        "description": "High-Throughput APIs, Modern Frontends, Distributed Caching & Zero-Downtime Releases",
        "rounds": [
            {
                "round_num": 1,
                "round_title": "Round 1: Core Fundamentals & Warm-up",
                "difficulty": "Easy",
                "interviewer_intent": "Examine depth of browser internals, event loop, and web protocols.",
                "question": "Walk me through what happens under the hood from the moment a user types a URL and hits Enter, until the browser completes the first paint. Cover DNS, TCP, TLS, and DOM/CSSOM construction.",
                "hint": "Mention browser cache/DNS resolution -> 3-way TCP handshake -> TLS session -> HTTP GET -> HTML parsing -> CSSOM -> Render Tree -> Layout/Reflow -> Paint.",
                "expected_keywords": ["dns", "tcp", "tls", "handshake", "dom", "cssom", "render tree", "layout", "paint", "reflow"],
                "sample_benchmark": "1. DNS lookup resolves the domain (checking browser cache, OS hosts, and recursive resolvers). 2. A TCP connection is opened via 3-way handshake (SYN, SYN-ACK, ACK), followed by TLS cryptographic negotiation. 3. The browser receives the HTML byte stream, parsing it into the DOM tree while asynchronously fetching stylesheet assets to build the CSSOM. 4. DOM and CSSOM combine into the Render Tree, triggering Layout (computing geometry and bounding boxes) and final Paint onto display pixels.",
                "loophole_checklist": [
                    {"check": "cssom|render tree", "advice": "Missed the relationship between DOM, CSSOM, and the Render Tree in the critical rendering path.", "penalty": 4},
                    {"check": "tls|tcp", "advice": "Overlooked network transport handshake details (TCP/TLS).", "penalty": 3}
                ]
            },
            {
                "round_num": 2,
                "round_title": "Round 2: Problem Solving & Technical Logic",
                "difficulty": "Medium",
                "interviewer_intent": "Evaluate data structure selection, memory trade-offs, and algorithm implementation.",
                "question": "How would you implement an in-memory LRU (Least Recently Used) Cache with strict O(1) get() and O(1) put() operations? Which two data structures do you combine and why?",
                "hint": "Hash Map for O(1) key lookup combined with a Doubly Linked List for O(1) node deletion and head insertion.",
                "expected_keywords": ["hash map", "doubly linked list", "o(1)", "pointer", "head", "tail", "evict", "node", "lookup"],
                "sample_benchmark": "Combine a Hash Map with a Doubly Linked List. The Hash Map stores keys mapping directly to linked list node pointers, guaranteeing O(1) key lookup. The Doubly Linked List maintains access order: whenever a key is accessed or added, its node is moved to the head in O(1) time. When capacity is exceeded, the node at the tail is evicted in O(1) and removed from the hash map.",
                "loophole_checklist": [
                    {"check": "doubly|linked list", "advice": "Did not specify a Doubly Linked List (singly linked lists require O(N) traversal to delete previous pointers).", "penalty": 5},
                    {"check": "hash map|dictionary", "advice": "Omitted hash table pairing needed for O(1) lookup.", "penalty": 4}
                ]
            },
            {
                "round_num": 3,
                "round_title": "Round 3: High-Scalability System Architecture",
                "difficulty": "Hard",
                "interviewer_intent": "Assess handling of massive concurrency, distributed race conditions, and zero overselling.",
                "question": "Architect a flash-sale reservation system where 200,000 concurrent users try to book 100 limited concert tickets within 3 seconds. How do you prevent overselling, ensure sub-100ms latency, and handle database crashes?",
                "hint": "Redis atomic decrement via Lua script, rate limiting with token bucket, asynchronous message queue (Kafka) to decouple DB write.",
                "expected_keywords": ["redis", "atomic", "lua", "decr", "kafka", "queue", "race condition", "idempotent", "database", "worker"],
                "sample_benchmark": "Store ticket inventory in Redis in-memory. An atomic Redis Lua script checks and decrements the counter: if stock > 0, it decrements and writes a unique reservation token, guaranteeing zero overselling in O(1) without database locks. Successfully reserved tokens push an event to a Kafka queue. Background consumer workers write orders idempotently to PostgreSQL with transaction isolation. If DB crashes, Redis holds confirmed reservations while Kafka replays events safely upon recovery.",
                "loophole_checklist": [
                    {"check": "atomic|lua|redis", "advice": "Relied on direct database locks, which collapse under 200k concurrent requests.", "penalty": 5},
                    {"check": "kafka|queue|worker", "advice": "Failed to decouple instant in-memory reservation from asynchronous database disk writes.", "penalty": 4}
                ]
            },
            {
                "round_num": 4,
                "round_title": "Round 4: Behavioral & STAR Leadership Principles",
                "difficulty": "Behavioral",
                "interviewer_intent": "Gauge ownership, critical outage troubleshooting, and stakeholder communication.",
                "question": "Tell me about a time when a critical production bug or outage occurred on a project you maintained. How did you isolate the problem under pressure, and what permanent safeguard did you implement?",
                "hint": "Use the STAR framework. Describe Situation -> Root Cause Investigation -> Action Taken -> Post-Mortem & Preventative Safeguard.",
                "expected_keywords": ["situation", "task", "action", "result", "post-mortem", "rollback", "monitoring", "alert", "fix", "safeguard"],
                "sample_benchmark": "Situation: Following a major feature release, memory usage spiked across worker nodes, causing sporadic 502 gateway errors. Task: I was on-call lead responsible for restoring service within our 15-minute SLA. Action: I first initiated a one-click rollback to the previous stable build, immediately restoring uptime. Then, inspecting APM traces, I isolated an unclosed database cursor in a loop. I patched the code with context managers and wrote automated regression tests. Result: Restored service in 9 minutes, and implemented mandatory memory leak profiling in our CI/CD pipeline.",
                "loophole_checklist": [
                    {"check": "rollback|isolate|apm", "advice": "Did not mention immediate mitigation (rollback/circuit breaker) before debugging.", "penalty": 4},
                    {"check": "safeguard|ci/cd|post-mortem", "advice": "Lacked a permanent institutional safeguard to prevent recurrence.", "penalty": 3}
                ]
            }
        ]
    },

    "Cloud/DevOps Engineer": {
        "role": "Cloud/DevOps Engineer",
        "description": "Container Orchestration, Cloud Architecture, CI/CD Automation & SRE Reliability",
        "rounds": [
            {
                "round_num": 1,
                "round_title": "Round 1: Core Fundamentals & Warm-up",
                "difficulty": "Easy",
                "interviewer_intent": "Verify Linux kernel namespaces, cgroups, and container virtualization principles.",
                "question": "At the Linux OS kernel level, what is the exact mechanism that separates a Docker container from the host system, and how does it differ from hypervisor-based virtual machines?",
                "hint": "Focus on Linux Namespaces (isolation) + Control Groups / cgroups (resource limits) sharing host kernel vs Hypervisor Type-1/2 virtualizing full OS hardware.",
                "expected_keywords": ["namespaces", "cgroups", "kernel", "hypervisor", "isolation", "pid", "memory", "cpu", "overhead"],
                "sample_benchmark": "Docker containers use Linux kernel Namespaces (PID, Mount, Network, IPC, UTS) to provide process isolation, and Control Groups (cgroups) to meter and constrain CPU, memory, and I/O quotas. Containers share the host OS kernel directly with near-zero virtualization overhead. Virtual Machines, by contrast, run on a Hypervisor (Type 1 or 2) that emulates virtual hardware, requiring a complete guest OS kernel, which incurs higher startup latency and resource overhead.",
                "loophole_checklist": [
                    {"check": "cgroup", "advice": "Missed Control Groups (cgroups), the core Linux mechanism for resource allocation.", "penalty": 4},
                    {"check": "namespace", "advice": "Omitted Linux namespaces responsible for process/network isolation.", "penalty": 4}
                ]
            },
            {
                "round_num": 2,
                "round_title": "Round 2: Problem Solving & Technical Logic",
                "difficulty": "Medium",
                "interviewer_intent": "Troubleshooting Kubernetes scheduling, probes, and crash loops under pressure.",
                "question": "A production Kubernetes pod repeatedly enters CrashLoopBackOff. Walk me through your methodical triage workflow to diagnose whether the root cause is an OOMKill, failing liveness probe, or missing secrets.",
                "hint": "Check kubectl describe pod (Last State: Terminated, Exit Code 137 for OOM), kubectl logs --previous, check secret/configmap bindings.",
                "expected_keywords": ["describe", "logs", "137", "oomkill", "liveness", "readiness", "exit code", "events", "secrets"],
                "sample_benchmark": "1. Run `kubectl describe pod <name>` and inspect the Events and 'Last State' sections: Exit Code 137 specifically indicates an OOMKilled event where memory limits were breached. 2. If exit code is 1 or non-zero, check `kubectl logs <name> --previous` to inspect runtime application stack traces. 3. Check liveness and readiness probe configurations (timeoutSeconds and initialDelaySeconds) to confirm the probe isn't terminating slow-starting apps prematurely. 4. Verify that referenced ConfigMaps and Secrets exist and are mounted properly in the container spec.",
                "loophole_checklist": [
                    {"check": "137|oom", "advice": "Did not mention Exit Code 137 as the definitive sign of Linux OOMKill.", "penalty": 4},
                    {"check": "describe|events", "advice": "Overlooked `kubectl describe pod` events section for probe and mounting failures.", "penalty": 3}
                ]
            },
            {
                "round_num": 3,
                "round_title": "Round 3: High-Scalability System Architecture",
                "difficulty": "Hard",
                "interviewer_intent": "Design high-availability cloud infrastructure with zero downtime and disaster recovery.",
                "question": "Architect a multi-region Active-Active cloud deployment across AWS (e.g. us-east-1 and eu-west-1) with 99.99% availability SLA. How do you handle Route53 latency routing, database replication latency, and split-brain resolution?",
                "hint": "Route53 latency-based routing with health checks, DynamoDB Global Tables or Aurora Global DB, idempotent API handling for cross-region writes.",
                "expected_keywords": ["route53", "active-active", "latency", "aurora", "replication", "split-brain", "multi-region", "health check", "idempotent"],
                "sample_benchmark": "Deploy symmetrical Kubernetes clusters in us-east-1 and eu-west-1 fronted by AWS Route53 latency-based routing with automated health check failover. For data persistence, use Amazon Aurora Global Database (or DynamoDB Global Tables) with sub-second replication. To resolve cross-region split-brain conflicts and write collisions, design the application layer with idempotent request headers (UUIDs) and last-write-wins timestamps, with read replicas serving local traffic and asynchronous CDC (Change Data Capture) pipelines synchronizing state.",
                "loophole_checklist": [
                    {"check": "route53|latency|dns", "advice": "Omitted global DNS traffic steering and automated health checks.", "penalty": 4},
                    {"check": "replication|conflict|split-brain", "advice": "Did not provide a concrete resolution for write conflicts and replication lag.", "penalty": 5}
                ]
            },
            {
                "round_num": 4,
                "round_title": "Round 4: Behavioral & STAR Leadership Principles",
                "difficulty": "Behavioral",
                "interviewer_intent": "Evaluate balancing developer agility with infrastructure security and strict compliance.",
                "question": "Developers in your organization complain that your newly enforced CI/CD security scanning and Kubernetes policies are slowing down their release velocity. How do you resolve this conflict while keeping the infrastructure secure?",
                "hint": "Use STAR. Shift-left security (pre-commit hooks, IDE scanners), fast-track PR checks, collaborative education over rigid gatekeeping.",
                "expected_keywords": ["situation", "task", "action", "result", "shift-left", "security", "velocity", "developer experience", "pipeline", "automated"],
                "sample_benchmark": "Situation: Introducing container image vulnerability scanning increased PR build times from 4 to 22 minutes, leading to team friction. Task: I needed to reduce pipeline friction while ensuring zero critical vulnerabilities reached production. Action: I implemented 'shift-left' security by adding lightweight pre-commit hooks and IDE plugins so developers caught flaws locally before pushing. In CI/CD, I parallelized scanning and cached base image layers. Result: Build times dropped back to 5.5 minutes, developer satisfaction rose 45%, and vulnerability remediation time improved by 3x.",
                "loophole_checklist": [
                    {"check": "shift-left|local|pre-commit", "advice": "Failed to mention shift-left tools to catch vulnerabilities before CI/CD bottlenecks.", "penalty": 4},
                    {"check": "metric|%|minutes", "advice": "Lacked measurable operational outcomes (build time reduction, developer satisfaction).", "penalty": 3}
                ]
            }
        ]
    }
}


def evaluate_company_mock_session(session_data):
    """
    Evaluates a candidate's complete 4-round company-style mock interview session.
    Generates hiring committee verdict, round scores, identifies precise loopholes
    in candidate answers, and provides actionable remedial blueprints.
    """
    role = session_data.get("role", "AI/ML Engineer")
    answers = session_data.get("answers", {})  # round_num -> text
    company_style = session_data.get("company_style", "tier1")

    track = COMPANY_INTERVIEW_TRACKS.get(role, COMPANY_INTERVIEW_TRACKS["AI/ML Engineer"])
    rounds = track["rounds"]

    round_evaluations = []
    total_score = 0
    loopholes_detected = []
    strengths = []

    style_multipliers = {
        "tier1": 1.0,      # Strict high bar
        "startup": 0.95,   # Pragmatism & speed valued
        "enterprise": 0.9  # Process & clarity valued
    }
    bar = style_multipliers.get(company_style, 1.0)

    for r in rounds:
        r_num = str(r["round_num"])
        user_ans = str(answers.get(r_num, "")).strip()
        has_content = len(user_ans) >= 20
        word_count = len(user_ans.split())

        # Baseline scoring
        base_score = 45 if has_content else 15
        expected_kws = r.get("expected_keywords", [])
        matched_kws = [kw for kw in expected_kws if kw.lower() in user_ans.lower()]
        kw_score = min(35, len(matched_kws) * 7)

        # Word length depth score
        depth_score = min(20, int(word_count * 0.4)) if word_count >= 15 else 0

        round_score = int(round((base_score + kw_score + depth_score) * bar))
        round_score = max(10, min(96, round_score))
        total_score += round_score

        # Loophole detection
        round_loopholes = []
        for check_item in r.get("loophole_checklist", []):
            pattern = check_item["check"]
            if not re.search(r'\b(' + pattern + r')\b', user_ans, re.IGNORECASE):
                round_loopholes.append(check_item["advice"])

        if round_loopholes:
            for lh in round_loopholes[:2]:
                loopholes_detected.append({
                    "round": r["round_title"],
                    "round_num": r["round_num"],
                    "difficulty": r["difficulty"],
                    "loophole": lh,
                    "candidate_snippet": (user_ans[:140] + "...") if len(user_ans) > 140 else (user_ans or "No response provided"),
                    "benchmark_solution": r["sample_benchmark"],
                    "actionable_fix": f"In interviews for {role}, always directly address: {lh}"
                })
        else:
            strengths.append(f"{r['round_title']} ({r['difficulty']})")

        round_evaluations.append({
            "round_num": r["round_num"],
            "round_title": r["round_title"],
            "difficulty": r["difficulty"],
            "question": r["question"],
            "candidate_answer": user_ans if user_ans else "No response recorded",
            "score": round_score,
            "status": "Strong" if round_score >= 80 else "Adequate" if round_score >= 65 else "Loophole Found",
            "matched_concepts": matched_kws[:4],
            "sample_benchmark": r["sample_benchmark"]
        })

    average_score = int(round(total_score / len(rounds)))

    # Hiring Committee Verdict Rubric (Google/Amazon style)
    if average_score >= 86:
        verdict = "🌟 STRONG HIRE (Top 5% Candidate)"
        verdict_color = "emerald"
        verdict_summary = "Candidate demonstrated exceptional technical precision, quantified impact, and system depth with minimal interview coaching."
    elif average_score >= 74:
        verdict = "🚀 HIRE (Placement Ready)"
        verdict_color = "sky"
        verdict_summary = "Candidate cleared the hiring bar with solid fundamental grounding. Minor loopholes detected in edge case elaboration and numerical metrics."
    elif average_score >= 60:
        verdict = "📈 LEAN HIRE / BORDERLINE"
        verdict_color = "amber"
        verdict_summary = "Candidate has strong foundational instincts but fell into critical loopholes regarding concurrency, metrics, or STAR structuring."
    else:
        verdict = "🌱 NEEDS TARGETED REMEDIATION"
        verdict_color = "rose"
        verdict_summary = "Significant conceptual and architectural gaps identified. Candidate should complete the recommended practice drills before company campus drives."

    # Top improvement recommendations
    recommendations = [
        {
            "priority": "High",
            "area": "Quantifiable System & Project Metrics",
            "action": "Avoid vague claims like 'improved performance'. Always quantify: 'Reduced p99 latency from 1.2s to 180ms by introducing Redis Lua atomic counter.'",
            "drill": "Practice the STAR framework drill for 3 recent college or internship projects."
        },
        {
            "priority": "High",
            "area": "Edge Case & Distributed Failure Recovery",
            "action": "In System Architecture questions, interviewers actively look for network partitions, database deadlocks, and idempotency handling.",
            "drill": "Review the System Design Primer failure recovery chapter on GitHub."
        },
        {
            "priority": "Medium",
            "area": "Asymptotic Trade-off Justification",
            "action": "Whenever selecting a data structure or model, explicitly state *why* it outperforms alternatives (e.g. 'Chose Doubly Linked List over Array because node deletion is O(1) instead of O(N)').",
            "drill": "Complete 10 LeetCode Medium data structure trade-off explanations."
        }
    ]

    return {
        "overall_score": average_score,
        "verdict": verdict,
        "verdict_color": verdict_color,
        "verdict_summary": verdict_summary,
        "role": role,
        "company_style": company_style,
        "rounds": round_evaluations,
        "loopholes": loopholes_detected[:4] if loopholes_detected else [
            {
                "round": "General Interview Execution",
                "round_num": 3,
                "difficulty": "Hard",
                "loophole": "Minor: Consider elaborating further on asynchronous message serialization formats (Protobuf vs JSON).",
                "candidate_snippet": "Solid overall architectural response.",
                "benchmark_solution": "In high-throughput pipelines, Protobuf saves ~40% bandwidth over standard JSON serialization.",
                "actionable_fix": "State serialization trade-offs when discussing microservices."
            }
        ],
        "strengths": strengths if strengths else ["Core Technical Foundations"],
        "recommendations": recommendations
    }

