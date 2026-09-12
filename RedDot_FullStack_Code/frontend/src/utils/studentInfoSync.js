import { supabase } from '../services/supabase';

/**
 * Default fallback student information.
 */
export const DEFAULT_STUDENT_INFO = {
  fullName: "Insha Sheikh",
  email: "insha.test@nitrr.ac.in",
  phone: "+91 98765 43210",
  college: "National Institute of Technology (NIT), Raipur",
  branch: "Computer Science & Engineering",
  degree: "Bachelor of Technology (B.Tech)",
  yearOfStudy: "3rd Year",
  semester: "Semester VI",
  graduationYear: "2026",
  rollNo: "21BCSE044",
  apaarId: "APAAR-9821-4402-8819",
  cgpa: "8.84",
  headline: "Full-Stack Software Engineer & Distributed Systems Developer",
  location: "Raipur, Chhattisgarh, India",
  dob: "2003-08-14",
  gender: "Female"
};

const STORAGE_KEY = 'academicx_student_basic_info';

/**
 * Returns the latest synchronized student basic information from local storage or user session.
 */
export const getStudentBasicInfo = (currentUser = null) => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    let parsed = saved ? JSON.parse(saved) : {};

    // Get session user if available
    let sessionUser = currentUser;
    if (!sessionUser) {
      try {
        const u = localStorage.getItem('reddot_user') || localStorage.getItem('user');
        if (u) sessionUser = JSON.parse(u);
      } catch {}
    }

    const merged = {
      ...DEFAULT_STUDENT_INFO,
      ...parsed,
    };

    // Overlay session user properties if not explicitly overridden
    if (sessionUser) {
      if (sessionUser.full_name && !parsed.fullName) merged.fullName = sessionUser.full_name;
      if (sessionUser.email && !parsed.email) merged.email = sessionUser.email;
      if (sessionUser.phone && !parsed.phone) merged.phone = sessionUser.phone;
      if (sessionUser.college && !parsed.college) merged.college = sessionUser.college;
      if (sessionUser.department && !parsed.branch) merged.branch = sessionUser.department;
      if (sessionUser.branch && !parsed.branch) merged.branch = sessionUser.branch;
      if (sessionUser.student_roll_no && !parsed.rollNo) merged.rollNo = sessionUser.student_roll_no;
      if (sessionUser.apaar_id && !parsed.apaarId) merged.apaarId = sessionUser.apaar_id;
      if (sessionUser.cgpa && !parsed.cgpa) merged.cgpa = String(sessionUser.cgpa);
    }

    return merged;
  } catch (err) {
    console.warn('[getStudentBasicInfo error]', err);
    return { ...DEFAULT_STUDENT_INFO };
  }
};

/**
 * Synchronizes student basic information from Supabase cloud database.
 */
export const fetchStudentBasicInfoFromCloud = async (currentUser = null) => {
  try {
    let email = currentUser?.email;
    let phone = currentUser?.phone || currentUser?.phone_number;

    if (!email && !phone) {
      try {
        const u = localStorage.getItem('reddot_user') || localStorage.getItem('user');
        if (u) {
          const parsed = JSON.parse(u);
          email = parsed.email;
          phone = parsed.phone || parsed.phone_number;
        }
      } catch {}
    }

    if (!email && !phone) return null;

    let query = supabase
      .from('profiles')
      .select('id, full_name, email, phone_number, avatar_url, student_profiles(*)');

    if (email) {
      query = query.eq('email', email.toLowerCase().trim());
    } else {
      query = query.eq('phone_number', phone.trim());
    }

    const { data: prof, error } = await query.maybeSingle();
    if (error || !prof) return null;

    const stud = Array.isArray(prof.student_profiles) && prof.student_profiles.length > 0
      ? prof.student_profiles[0]
      : null;

    const currentLocal = getStudentBasicInfo(currentUser);

    const updated = {
      ...currentLocal,
      fullName: prof.full_name || currentLocal.fullName,
      email: prof.email || currentLocal.email,
      phone: prof.phone_number || currentLocal.phone,
      college: stud?.college || currentLocal.college,
      branch: stud?.branch || currentLocal.branch,
      rollNo: stud?.student_roll_no || currentLocal.rollNo,
      apaarId: stud?.apaar_id || currentLocal.apaarId,
      cgpa: stud?.cgpa && parseFloat(stud.cgpa) > 0 ? String(stud.cgpa) : currentLocal.cgpa,
      yearOfStudy: stud?.year_of_study ? `${stud.year_of_study}${stud.year_of_study === 1 ? 'st' : stud.year_of_study === 2 ? 'nd' : stud.year_of_study === 3 ? 'rd' : 'th'} Year` : currentLocal.yearOfStudy,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Dispatch notification event so all components update immediately
    window.dispatchEvent(
      new CustomEvent('academicx_basic_info_updated', { detail: updated })
    );

    return updated;
  } catch (err) {
    console.warn('[fetchStudentBasicInfoFromCloud exception]', err);
    return null;
  }
};

/**
 * Saves and updates student basic information locally and synchronizes to Supabase.
 */
export const saveStudentBasicInfo = async (newInfo, currentUser = null) => {
  if (!newInfo) return { success: false, error: 'No data provided' };

  try {
    const current = getStudentBasicInfo(currentUser);
    const updated = {
      ...current,
      ...newInfo
    };

    // 1. Save to local storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // 2. Update session user objects
    ['reddot_user', 'user'].forEach((key) => {
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          parsed.full_name = updated.fullName;
          parsed.college = updated.college;
          parsed.branch = updated.branch;
          parsed.department = updated.branch;
          parsed.student_roll_no = updated.rollNo;
          parsed.apaar_id = updated.apaarId;
          parsed.cgpa = updated.cgpa;
          localStorage.setItem(key, JSON.stringify(parsed));
        }
      } catch {}
    });

    // 3. Dispatch window event for instant cross-component synchronization
    window.dispatchEvent(
      new CustomEvent('academicx_basic_info_updated', { detail: updated })
    );

    // 4. Asynchronously persist to Supabase cloud
    const email = (updated.email || currentUser?.email || '').toLowerCase().trim();
    if (email) {
      try {
        const { data: profileRow } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .maybeSingle();

        if (profileRow?.id) {
          // Update profiles table
          await supabase
            .from('profiles')
            .update({
              full_name: updated.fullName,
              phone_number: updated.phone || null,
              updated_at: new Date().toISOString()
            })
            .eq('id', profileRow.id);

          // Update student_profiles table
          const yrNum = parseInt(String(updated.yearOfStudy).replace(/\D/g, '') || '3', 10);
          const cgpaNum = parseFloat(updated.cgpa) || 0.0;

          const { data: studProfile } = await supabase
            .from('student_profiles')
            .select('id')
            .eq('user_id', profileRow.id)
            .maybeSingle();

          if (studProfile) {
            await supabase
              .from('student_profiles')
              .update({
                college: updated.college,
                branch: updated.branch,
                student_roll_no: updated.rollNo,
                apaar_id: updated.apaarId,
                year_of_study: yrNum,
                cgpa: cgpaNum
              })
              .eq('id', studProfile.id);
          } else {
            await supabase
              .from('student_profiles')
              .insert({
                user_id: profileRow.id,
                college: updated.college,
                branch: updated.branch,
                student_roll_no: updated.rollNo,
                apaar_id: updated.apaarId,
                year_of_study: yrNum,
                cgpa: cgpaNum,
                is_verified: true,
                digilocker_verified: true
              });
          }
        }
      } catch (cloudErr) {
        console.warn('[Supabase student basic info sync exception]', cloudErr);
      }
    }

    return { success: true, data: updated };
  } catch (err) {
    console.error('[saveStudentBasicInfo failed]', err);
    return { success: false, error: err.message };
  }
};
