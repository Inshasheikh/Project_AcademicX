from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    college = models.CharField(max_length=255, default="National Institute of Technology")
    branch = models.CharField(max_length=150, default="Computer Science & Engineering")
    year_of_study = models.IntegerField(default=3)
    apaar_id = models.CharField(max_length=50, blank=True, null=True, unique=True)
    is_verified = models.BooleanField(default=False)
    digilocker_verified = models.BooleanField(default=False)
    cgpa = models.FloatField(default=8.6)
    skills = models.JSONField(default=list, blank=True)
    resume_text = models.TextField(blank=True, null=True)
    placement_probability = models.IntegerField(default=78)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} - {self.college}"

class RecruiterProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='recruiter_profile')
    company_name = models.CharField(max_length=200, default="Google Cloud India")
    industry = models.CharField(max_length=150, default="Cloud Computing & AI")
    designation = models.CharField(max_length=150, default="Technical Talent Partner")
    website = models.URLField(blank=True, null=True)
    is_verified_company = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.company_name} ({self.user.username})"

class FacultyProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='faculty_profile')
    college = models.CharField(max_length=255, default="Indian Institute of Information Technology")
    department = models.CharField(max_length=150, default="Artificial Intelligence & Data Science")
    experience_years = models.IntegerField(default=8)
    immersion_status = models.CharField(max_length=50, default="In-Progress (Intel Labs)")
    fdp_completed_count = models.IntegerField(default=4)
    mentored_students_count = models.IntegerField(default=28)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Prof. {self.user.get_full_name() or self.user.username} - {self.department}"

class Job(models.Model):
    JOB_TYPES = [
        ('Internship', 'Internship'),
        ('Full-time', 'Full-time'),
        ('Part-time', 'Part-time'),
        ('Contract', 'Contract'),
    ]

    recruiter = models.ForeignKey(RecruiterProfile, on_delete=models.CASCADE, related_name='jobs', null=True, blank=True)
    title = models.CharField(max_length=200)
    company_name = models.CharField(max_length=200)
    job_type = models.CharField(max_length=50, choices=JOB_TYPES, default='Internship')
    location = models.CharField(max_length=150, default='Bengaluru / Hybrid')
    description = models.TextField()
    required_skills = models.JSONField(default=list)
    preferred_skills = models.JSONField(default=list, blank=True)
    salary_or_stipend = models.CharField(max_length=100, default="₹45,000/month")
    openings = models.IntegerField(default=3)
    deadline = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    posted_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.title} @ {self.company_name}"

class Application(models.Model):
    STATUS_CHOICES = [
        ('APPLIED', 'Applied'),
        ('REVIEWED', 'Reviewed'),
        ('SHORTLISTED', 'Shortlisted'),
        ('INTERVIEW', 'Interview Scheduled'),
        ('OFFERED', 'Offered'),
        ('REJECTED', 'Rejected'),
    ]

    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='applications')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='APPLIED')
    match_score = models.IntegerField(default=85)
    applied_at = models.DateTimeField(default=timezone.now)
    recruiter_notes = models.TextField(blank=True, default='')
    timeline = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"{self.student.user.username} -> {self.job.title} [{self.status}]"

class SkillDiagnostic(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='diagnostics')
    score = models.IntegerField(default=74)
    skill_breakdown = models.JSONField(default=dict)
    gaps = models.JSONField(default=list)
    recommendations = models.JSONField(default=list)
    completed_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Diagnostic ({self.score}/100) - {self.student.user.username}"

class VerificationQueue(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending Review'),
        ('APPROVED', 'Approved (Verified)'),
        ('REJECTED', 'Rejected'),
    ]

    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='verifications')
    document_type = models.CharField(max_length=150, default="DigiLocker Academic Credential")
    digilocker_uri = models.CharField(max_length=255, default="in.gov.digilocker:doc:academic-2026-99384")
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='PENDING')
    submission_date = models.DateTimeField(default=timezone.now)
    rejection_reason = models.TextField(blank=True, default="")
    verified_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Verification: {self.student.user.username} - {self.status}"

class MockInterviewSession(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='mock_interviews')
    role_target = models.CharField(max_length=150, default="Full Stack Engineer / AI Specialist")
    questions_answers = models.JSONField(default=list)
    overall_score = models.IntegerField(default=82)
    feedback = models.JSONField(default=dict)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Mock Interview ({self.role_target}): {self.student.user.username}"
