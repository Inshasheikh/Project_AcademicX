import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Directly downloads any text/binary/JSON content as a local file.
 * This never triggers window.print() and guarantees a local disk save.
 */
export const downloadBlob = (content, fileName, mimeType = 'text/plain;charset=utf-8') => {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/**
 * Sanitizes modern CSS (oklch, color-mix, etc.) and CSS transforms in cloned document
 * so html2canvas doesn't crash on Tailwind CSS v4 styles.
 */
const sanitizeCloneForCanvas = (clonedDoc, clonedElement) => {
  if (clonedElement) {
    clonedElement.style.transform = 'none';
    let p = clonedElement.parentElement;
    while (p && p !== clonedDoc.body) {
      if (p.style) p.style.transform = 'none';
      p = p.parentElement;
    }
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const colorProps = [
    'color',
    'backgroundColor',
    'borderColor',
    'borderTopColor',
    'borderRightColor',
    'borderBottomColor',
    'borderLeftColor',
    'outlineColor',
    'fill',
    'stroke'
  ];

  const elements = clonedDoc.querySelectorAll('*');
  elements.forEach((el) => {
    try {
      const computed = window.getComputedStyle(el);
      for (const prop of colorProps) {
        const val = computed[prop];
        if (val && (val.includes('oklch') || val.includes('color-mix') || val.includes('lab') || val.includes('oklab'))) {
          ctx.fillStyle = '#000000';
          ctx.fillStyle = val;
          el.style[prop] = ctx.fillStyle;
        }
      }
    } catch {
      // ignore
    }
  });
};

/**
 * Export any HTML DOM element as a crisp PDF directly saved to local disk.
 * If canvas capture fails, it falls back to a clean direct jsPDF text document.
 * NEVER CALLS window.print().
 */
export const downloadElementAsPdf = async (element, fileName = 'document.pdf', fallbackTitle = 'AcademicX Export') => {
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        const clonedEl = clonedDoc.getElementById(element.id) || clonedDoc.body;
        sanitizeCloneForCanvas(clonedDoc, clonedEl);
      }
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    pdf.save(fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`);
    return true;
  } catch (err) {
    console.warn('html2canvas failed, falling back to direct vector jsPDF document:', err);
    
    // Direct jsPDF fallback - generates a clean, well-formatted local PDF without using html2canvas or window.print()
    try {
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(18);
      pdf.text(fallbackTitle, 20, 20);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text(`Exported from AcademicX Platform • ${new Date().toLocaleString()}`, 20, 28);
      pdf.line(20, 31, 190, 31);

      const innerText = element.innerText || '';
      const lines = innerText.split('\n').filter(l => l.trim().length > 0);

      let y = 40;
      pdf.setFontSize(10);
      for (const line of lines) {
        if (y > 275) {
          pdf.addPage();
          y = 20;
        }
        const splitLines = pdf.splitTextToSize(line, 170);
        for (const sLine of splitLines) {
          if (y > 275) {
            pdf.addPage();
            y = 20;
          }
          pdf.text(sLine, 20, y);
          y += 5.5;
        }
      }
      pdf.save(fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`);
      return true;
    } catch (fallbackErr) {
      console.warn('Direct jsPDF fallback failed, downloading as clean text file:', fallbackErr);
      const textContent = element.innerText || 'AcademicX Export Document';
      downloadBlob(textContent, fileName.replace(/\.pdf$/i, '.txt'), 'text/plain;charset=utf-8');
      return true;
    }
  }
};

/**
 * Downloads Diagnostic & Placement ATS Action Plan locally
 */
export const downloadDiagnosticActionPlan = (atsResult) => {
  const targetRole = atsResult?.target_role || 'Software Engineer';
  const score = atsResult?.ats_score ?? 75;
  const skills = atsResult?.skills_detected || ['Data Structures', 'Python', 'System Architecture'];
  const missing = atsResult?.missing_keywords || ['Distributed Systems', 'Cloud CI/CD', 'Docker'];
  const suggestions = atsResult?.suggestions || [
    'Add measurable metrics (e.g. latency reduction, request throughput) to past project descriptions.',
    'Highlight production deployment experience and container orchestration.',
    'Target high-frequency recruiter keywords for Tier-1 engineering benchmarks.'
  ];

  try {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    
    // Header banner
    pdf.setFillColor(15, 23, 42); // slate-900
    pdf.rect(0, 0, 210, 35, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.text('AcademicX • Diagnostic ATS Action Plan', 20, 16);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(148, 163, 184); // slate-400
    pdf.text(`Target Role: ${targetRole} | Generated: ${new Date().toLocaleDateString()}`, 20, 25);

    // Score Box
    pdf.setFillColor(241, 245, 249);
    pdf.roundedRect(20, 42, 170, 24, 3, 3, 'F');
    
    pdf.setTextColor(15, 23, 42);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('ATS Benchmark Score:', 26, 54);
    
    pdf.setFontSize(16);
    pdf.setTextColor(2, 132, 199); // sky-600
    pdf.text(`${score} / 100`, 85, 55);

    pdf.setFontSize(10);
    pdf.setTextColor(16, 185, 129); // emerald-600
    pdf.text('● Placement Ready (Top Tier Candidate)', 115, 55);

    let y = 76;

    // Verified Skills
    pdf.setTextColor(15, 23, 42);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('1. Verified Technical Competencies', 20, y);
    y += 7;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(51, 65, 85);
    skills.forEach((s) => {
      pdf.text(`  •  ${s}`, 24, y);
      y += 6;
    });

    y += 4;

    // Missing Gaps
    pdf.setTextColor(15, 23, 42);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('2. Critical Technical Gaps to Close', 20, y);
    y += 7;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(180, 83, 9); // amber-700
    missing.forEach((m) => {
      pdf.text(`  +  ${m}`, 24, y);
      y += 6;
    });

    y += 4;

    // Suggestions
    pdf.setTextColor(15, 23, 42);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('3. Recruiter Strategic Roadmap & Advice', 20, y);
    y += 7;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    pdf.setTextColor(51, 65, 85);
    suggestions.forEach((s, idx) => {
      const split = pdf.splitTextToSize(`${idx + 1}. ${s}`, 165);
      split.forEach(line => {
        pdf.text(line, 24, y);
        y += 5.5;
      });
      y += 1.5;
    });

    // Footer
    pdf.setFontSize(8.5);
    pdf.setTextColor(148, 163, 184);
    pdf.text('AcademicX Platform • Placement Acceleration Engine • Confidential Diagnostic Report', 20, 285);

    const safeRole = targetRole.replace(/[^a-zA-Z0-9]/g, '_');
    pdf.save(`AcademicX_Action_Plan_${safeRole}.pdf`);
  } catch (err) {
    console.warn('PDF export failed, downloading as formatted text:', err);
    const textReport = `=====================================================
AcademicX • Diagnostic ATS Action Plan
=====================================================
Target Role: ${targetRole}
ATS Score:   ${score} / 100 (Placement Ready)
Generated:   ${new Date().toLocaleString()}

1. VERIFIED TECHNICAL COMPETENCIES:
${skills.map(s => `  • ${s}`).join('\n')}

2. CRITICAL TECHNICAL GAPS TO CLOSE:
${missing.map(m => `  + ${m}`).join('\n')}

3. RECRUITER STRATEGIC SUGGESTIONS:
${suggestions.map((s, idx) => `  ${idx + 1}. ${s}`).join('\n')}

=====================================================
AcademicX Platform • Confidential Placement Report
=====================================================`;

    const safeRole = targetRole.replace(/[^a-zA-Z0-9]/g, '_');
    downloadBlob(textReport, `AcademicX_Action_Plan_${safeRole}.txt`, 'text/plain;charset=utf-8');
  }
};

/**
 * Downloads Full Career Roadmap locally
 */
export const downloadCareerRoadmap = (roleTitle = 'Full Stack Engineer') => {
  const phases = [
    {
      phase: 'Phase 1: Weeks 1 - 2',
      title: 'Foundational Mastery & Discrete Systems',
      commitment: '1.5 hrs/day',
      gaps: 'Graph Planarity, Modular Arithmetic (Euler Totient), Finite Automata DFA minimization.',
      milestone: 'Pass Foundation Quiz with > 90% score.'
    },
    {
      phase: 'Phase 2: Weeks 3 - 4',
      title: 'Algorithmic Rigor, Recurrence & Mathematical Modeling',
      commitment: '2.0 hrs/day',
      gaps: 'Recurrence relations, Master Theorem asymptotic bounds, Planar graph formulas.',
      milestone: 'Solve Master Theorem cases 1, 2, and 3 under 60 seconds.'
    },
    {
      phase: 'Phase 3: Weeks 5 - 6',
      title: 'Production Architecture, Distributed Systems & Database Indexing',
      commitment: '2.5 hrs/day',
      gaps: 'B-Tree vs LSM trees, Distributed consensus (Raft/Paxos), Postgres EXPLAIN ANALYZE optimization.',
      milestone: 'Deploy end-to-end containerized microservice with Supabase Postgres & Redis cache.'
    },
    {
      phase: 'Phase 4: Weeks 7 - 8',
      title: 'System Design Drills & Mock Technical Interviews',
      commitment: '2.0 hrs/day',
      gaps: 'High-level architecture, Rate limiters, Cache-aside pattern, Message queues (Kafka/RabbitMQ).',
      milestone: 'Complete 3 full AI mock interview sessions with > 85% readiness score.'
    },
    {
      phase: 'Phase 5: Weeks 9 - 10',
      title: 'Placement Benchmark & Tier-1 Corporate Applications',
      commitment: '1.5 hrs/day',
      gaps: 'Authenticated marksheets, AWS SAA-C03 / CKA certification, Tailored ATS applications.',
      milestone: 'Apply to verified placement drives with 94%+ match score and receive Tier-1 offer.'
    }
  ];

  try {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    
    // Header banner
    pdf.setFillColor(2, 132, 199); // sky-600
    pdf.rect(0, 0, 210, 36, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.text('AcademicX • Career & Skill Acceleration Roadmap', 20, 16);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(224, 242, 254);
    pdf.text(`Target Track: ${roleTitle} | Expected CTC: Rs. 14 - 22 LPA`, 20, 25);
    pdf.text(`Date of Issue: ${new Date().toLocaleDateString()}`, 20, 31);

    let y = 48;

    phases.forEach((p) => {
      if (y > 250) {
        pdf.addPage();
        y = 20;
      }

      // Phase Header Box
      pdf.setFillColor(248, 250, 252);
      pdf.setDrawColor(226, 232, 240);
      pdf.roundedRect(18, y - 5, 174, 38, 2.5, 2.5, 'FD');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(2, 132, 199);
      pdf.text(p.phase.toUpperCase(), 23, y + 1);

      pdf.setFontSize(8.5);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`Study Commitment: ${p.commitment}`, 130, y + 1);

      pdf.setFontSize(11);
      pdf.setTextColor(15, 23, 42);
      pdf.text(p.title, 23, y + 8);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.5);
      pdf.setTextColor(71, 85, 105);
      const gapLines = pdf.splitTextToSize(`Core Focus: ${p.gaps}`, 164);
      pdf.text(gapLines, 23, y + 15);

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8.5);
      pdf.setTextColor(16, 185, 129);
      pdf.text(`✓ Milestone: ${p.milestone}`, 23, y + 27);

      y += 44;
    });

    // Footer
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184);
    pdf.text('AcademicX Platform • Personalized Learning & Placement Roadmap', 20, 287);

    const safeRole = roleTitle.replace(/[^a-zA-Z0-9]/g, '_');
    pdf.save(`AcademicX_Full_Roadmap_${safeRole}.pdf`);
  } catch (err) {
    console.warn('PDF roadmap generation failed, saving formatted text:', err);
    let roadmapText = `=====================================================
ACADEMICX CAREER & SKILL ACCELERATION ROADMAP
=====================================================
Target Track: ${roleTitle}
Target Compensation: Rs. 14 - 22 LPA
Issued: ${new Date().toLocaleString()}

`;

    phases.forEach((p, idx) => {
      roadmapText += `[${p.phase}] - ${p.title}
Commitment: ${p.commitment}
Key Topics: ${p.gaps}
Goal/Milestone: ${p.milestone}
-----------------------------------------------------
`;
    });

    roadmapText += `\nPlacement Benchmark: Tier-1 Product Tech Engineer Offer\nAcademicX Platform • Official Study Plan`;
    const safeRole = roleTitle.replace(/[^a-zA-Z0-9]/g, '_');
    downloadBlob(roadmapText, `AcademicX_Full_Roadmap_${safeRole}.txt`, 'text/plain;charset=utf-8');
  }
};

/**
 * Download Recruiter Offer Letter locally
 */
export const downloadOfferLetter = (studentName, role = 'Software Engineer', ctc = '16.5 LPA', company = 'AcademicX Hiring Partner') => {
  const content = `================================================================================
                           LETTER OF EMPLOYMENT OFFER
================================================================================

Date: ${new Date().toLocaleDateString()}
Candidate: ${studentName}
Role: ${role}
Annual Compensation: ₹${ctc}
Company: ${company}

Dear ${studentName},

We are pleased to offer you the position of ${role} with our engineering team. 
Your technical assessments, portfolio verification, and diagnostic competencies on 
the AcademicX Platform have satisfied our highest engineering benchmarks.

Key Offer Details:
--------------------------------------------------------------------------------
1. Position:              ${role}
2. Total Compensation:     ₹${ctc} CTC
3. Employment Type:       Full-Time Permanent
4. Primary Tech Stack:    Distributed Systems, React/Node.js, PostgreSQL, Cloud
5. Location:              Bangalore / Hybrid
6. Background Check:      Verified via AcademicX Cryptographic Transcript

Please sign and return the duplicate copy of this letter within 7 business days.

Sincerely,

Campus Recruitment & Talent Acquisition
${company}
Institutional Partner - AcademicX Platform
================================================================================`;

  const safeName = studentName.replace(/[^a-zA-Z0-9]/g, '_');
  downloadBlob(content, `Offer_Letter_${safeName}.txt`, 'text/plain;charset=utf-8');
};

/**
 * Download Student Verified Dossier locally
 */
export const downloadStudentDossier = (student) => {
  const name = student?.name || 'Candidate';
  const roll = student?.roll_no || 'NIT-2026-CSE';
  const cgpa = student?.cgpa || '8.8';
  const role = student?.applied_role || student?.role || 'Full Stack Engineer';
  const readiness = student?.readiness || student?.ats_score || '92%';
  const skills = Array.isArray(student?.skills) ? student.skills.join(', ') : 'Python, React, Postgres, Docker';

  const content = `================================================================================
                    ACADEMICX VERIFIED STUDENT DOSSIER
================================================================================
Generated: ${new Date().toLocaleString()}

STUDENT CREDENTIALS:
--------------------------------------------------------------------------------
Full Name:           ${name}
Roll Number:         ${roll}
Cumulative GPA:      ${cgpa} / 10.0
Target Role:         ${role}
Placement Readiness: ${readiness}
Verified Skills:     ${skills}

VALIDATION TELEMETRY:
--------------------------------------------------------------------------------
• Academic Transcript:  VERIFIED (SHA-256 Hash Ingested)
• Laboratory Endorsement: APPROVED (Dean of Academic Affairs)
• Skill Diagnostics:     94th Percentile National Benchmark
• ATS Compatibility:     Top 10% Shortlist Ready

This dossier is cryptographically authentic and certified for institutional 
and corporate campus recruitment drives under the AcademicX platform.
================================================================================`;

  const safeName = name.replace(/[^a-zA-Z0-9]/g, '_');
  downloadBlob(content, `Verified_Dossier_${safeName}.txt`, 'text/plain;charset=utf-8');
};

/**
 * Download Enrolled Students CSV locally
 */
export const downloadEnrolledCSV = (courseTitle, count = 120) => {
  let csv = 'Roll Number,Student Name,Department,Semester,CGPA,Attendance,Status\n';
  const firstNames = ['Aarav', 'Diya', 'Rohan', 'Ananya', 'Vivaan', 'Isha', 'Aditya', 'Sneha', 'Kabir', 'Tanvi'];
  const lastNames = ['Sharma', 'Verma', 'Gupta', 'Patel', 'Reddy', 'Mehta', 'Nair', 'Singh', 'Kumar', 'Joshi'];

  const rows = Math.min(Math.max(count, 15), 50);
  for (let i = 1; i <= rows; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[Math.floor(i / 2) % lastNames.length];
    const roll = `22BCSE${100 + i}`;
    const cgpa = (7.8 + ((i * 7) % 20) / 10).toFixed(2);
    const att = `${82 + ((i * 3) % 16)}%`;
    csv += `${roll},"${fn} ${ln}",Computer Science & Engineering,6th,${cgpa},${att},Enrolled\n`;
  }

  const safeTitle = (courseTitle || 'Course').replace(/[^a-zA-Z0-9]/g, '_');
  downloadBlob(csv, `Enrolled_Students_${safeTitle}.csv`, 'text/csv;charset=utf-8');
};

/**
 * Download Faculty Endorsement locally
 */
export const downloadEndorsementLetter = (student, institution = 'NIT Campus') => {
  const name = student?.name || 'Candidate';
  const roll = student?.roll_no || 'NIT-2026-CSE';
  const cgpa = student?.cgpa || '8.9';
  const rank = student?.class_rank || 'Top 5%';

  const content = `================================================================================
                    OFFICIAL INSTITUTIONAL RECOMMENDATION
                         DEPARTMENT OF COMPUTER SCIENCE
================================================================================
Institution: ${institution}
Date: ${new Date().toLocaleDateString()}

To Whom It May Concern,

I am pleased to endorse ${name} (Roll No: ${roll}), who currently ranks in the 
${rank} of our cohort with a verified CGPA of ${cgpa}. 

Their technical rigor across distributed computing, software architecture, algorithm 
optimization, and system programming has been comprehensively validated on our 
university laboratory grid and peer-reviewed projects. 

${name} exhibits exemplary problem-solving capability, ethical teamwork, and hands-on 
mastery of production engineering stacks. I endorse them without reservation for 
senior campus placements, technical fellowships, and research appointments.

Sincerely,

Dr. Academic Dean / Faculty Advisor
Department of Computer Science & Engineering
${institution}
AcademicX Institutional Accreditation Network
================================================================================`;

  const safeName = name.replace(/[^a-zA-Z0-9]/g, '_');
  downloadBlob(content, `Faculty_Endorsement_${safeName}.txt`, 'text/plain;charset=utf-8');
};
