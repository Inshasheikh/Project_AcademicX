import os
from datetime import datetime, timezone
from supabase import create_client, Client

# Official Supabase Credentials for REDDOT Project
SUPABASE_URL = os.environ.get('SUPABASE_URL', 'https://hznhvqxwzswxwzusonsz.supabase.co')
SUPABASE_KEY = os.environ.get(
    'SUPABASE_ANON_KEY',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6bmh2cXh3enN3eHd6dXNvbnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4MDczNjcsImV4cCI6MjEwNDM4MzM2N30.Xy8uOTqfCe7mbwDEUtTb_70hYi_l3wvQ7lT-krA3jqQ'
)

_client: Client = None

def get_supabase_client() -> Client:
    global _client
    if _client is None:
        try:
            _client = create_client(SUPABASE_URL, SUPABASE_KEY)
        except Exception as e:
            print(f"[Supabase] Error initializing client: {e}")
            raise
    return _client

def get_profile_by_email(email: str):
    client = get_supabase_client()
    clean_email = email.strip().lower()
    res = client.table("profiles").select("*").eq("email", clean_email).execute()
    return res.data[0] if res.data else None

def get_profile_by_phone(phone: str):
    client = get_supabase_client()
    clean_phone = phone.strip()
    res = client.table("profiles").select("*").eq("phone_number", clean_phone).execute()
    return res.data[0] if res.data else None

def create_user_profile(email: str, phone: str, full_name: str, password_hash: str, role: str, extra_data: dict = None):
    client = get_supabase_client()
    clean_email = email.strip().lower()
    clean_phone = (phone or "").strip()
    
    # 1. Insert into profiles
    profile_payload = {
        "email": clean_email,
        "phone_number": clean_phone,
        "full_name": full_name.strip(),
        "password_hash": password_hash,
        "role": role,
        "is_verified": True
    }
    
    profile_res = client.table("profiles").insert(profile_payload).execute()
    if not profile_res.data:
        raise ValueError("Failed to create profile in Supabase.")
    
    created_profile = profile_res.data[0]
    user_id = created_profile["id"]
    extra_data = extra_data or {}
    
    # 2. Insert role-specific profile
    if role == "student":
        student_payload = {
            "user_id": user_id,
            "college": extra_data.get("college", ""),
            "branch": extra_data.get("branch", ""),
            "year_of_study": int(extra_data.get("year_of_study", 1)),
            "apaar_id": extra_data.get("apaar_id") or f"{clean_phone[-4:] if clean_phone else '0000'}-APAAR",
            "student_roll_no": extra_data.get("student_roll_no", ""),
            "is_verified": True,
            "digilocker_verified": True,
            "cgpa": float(extra_data.get("cgpa", 0.0)),
            "skills": extra_data.get("skills", [])
        }
        client.table("student_profiles").insert(student_payload).execute()

    elif role == "recruiter":
        recruiter_payload = {
            "user_id": user_id,
            "company_name": extra_data.get("company_name", ""),
            "industry": extra_data.get("industry", "Technology"),
            "designation": extra_data.get("designation", "Recruitment Lead"),
            "website": extra_data.get("website", "")
        }
        client.table("recruiter_profiles").insert(recruiter_payload).execute()

    elif role == "faculty":
        faculty_payload = {
            "user_id": user_id,
            "college": extra_data.get("college", ""),
            "department": extra_data.get("department", ""),
            "experience_years": int(extra_data.get("experience_years", 0)),
            "immersion_status": extra_data.get("immersion_status", "Active")
        }
        client.table("faculty_profiles").insert(faculty_payload).execute()

    return created_profile

def fetch_all_jobs():
    client = get_supabase_client()
    res = client.table("jobs").select("*").order("posted_at", desc=True).execute()
    return res.data or []

def fetch_student_dashboard_data(email: str = None):
    client = get_supabase_client()
    profile = get_profile_by_email(email) if email else None

    if not profile:
        return {
            "student_name": "Student",
            "email": email or "",
            "college": "Not set",
            "branch": "Not set",
            "apaar_id": "Pending DigiLocker Verification",
            "is_verified": False,
            "digilocker_verified": False,
            "placement_probability": 0,
            "cgpa": 0.0,
            "skills": [],
            "total_applications": 0,
            "shortlisted": 0,
            "offers": 0,
            "skill_progress": {},
            "upcoming_interview": None
        }

    stud_res = client.table("student_profiles").select("*").eq("user_id", profile["id"]).execute()
    student_profile = stud_res.data[0] if stud_res.data else {}

    # Query real applications count for this student
    app_res = client.table("applications").select("status").eq("student_id", student_profile.get("id", profile["id"])).execute()
    apps = app_res.data or []
    total_apps = len(apps)
    shortlisted = len([a for a in apps if a.get("status") in ("SHORTLISTED", "INTERVIEW", "OFFERED")])
    offers = len([a for a in apps if a.get("status") == "OFFERED"])

    skills_list = student_profile.get("skills") or []
    skill_progress = {}
    for skill in skills_list[:5]:
        skill_progress[skill] = 80

    return {
        "student_name": profile.get("full_name", "Student"),
        "email": profile.get("email", ""),
        "college": student_profile.get("college", "University / College"),
        "branch": student_profile.get("branch", "Engineering / Technology"),
        "apaar_id": student_profile.get("apaar_id", "Not assigned"),
        "is_verified": student_profile.get("is_verified", False),
        "digilocker_verified": student_profile.get("digilocker_verified", False),
        "placement_probability": student_profile.get("placement_probability", 70),
        "cgpa": float(student_profile.get("cgpa") or 0.0),
        "skills": skills_list,
        "total_applications": total_apps,
        "shortlisted": shortlisted,
        "offers": offers,
        "skill_progress": skill_progress,
        "upcoming_interview": None
    }
