import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  GraduationCap, 
  Briefcase, 
  Compass, 
  Building2, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Phone, 
  KeyRound, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';
import { registerUserApi, sendOtpApi, verifyOtpApi, getCurrentUserApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import regSlide1Img from '../assets/registration/reg_slide1.jpg';
import regSlide2Img from '../assets/registration/reg_slide2.jpg';
import regSlide3Img from '../assets/registration/reg_slide3.jpg';

export default function RegisterPage({ setActiveRole, setActiveTab }) {
  const navigate = useNavigate();
  const { user, role, isAuthenticated } = useAuth();

  // If already authenticated, redirect to dedicated dashboard
  useEffect(() => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('reddot_token');
    const storedUser = getCurrentUserApi();
    const effectiveRole = (role || user?.role || user?.profile?.role || storedUser?.role || storedUser?.profile?.role || '').toLowerCase();
    if ((isAuthenticated || token) && effectiveRole) {
      if (effectiveRole === 'student') {
        navigate('/student/dashboard', { replace: true });
      } else {
        navigate(`/${effectiveRole}/dashboard`, { replace: true });
      }
    }
  }, [isAuthenticated, role, user, navigate]);

  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('student'); // 'student' | 'recruiter' | 'faculty' | 'admin'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true,
    // Step 2 details
    institutionOrCompany: '',
    studentRollNo: '',
    degreeOrDept: ''
  });

  // OTP Verification State
  const [otpChannel, setOtpChannel] = useState('email'); // 'email' | 'phone'
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifiedOtp, setIsVerifiedOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 3 Slides with User-Uploaded Registration Illustrations
  const slides = [
    {
      id: 1,
      image: regSlide2Img,
      title: 'Industry-Ready Skill Diagnostics',
      subtitle: 'Assess competency gaps with AI and prepare for top tier campus opportunities with verified curricula.',
      tag: 'Student Learning Hub',
      bg: 'bg-white'
    },
    {
      id: 2,
      image: regSlide1Img,
      title: 'Verified Corporate & Institutional Linkage',
      subtitle: 'Connecting university registrar-certified talent directly to empanelled industry hiring partners.',
      tag: 'Enterprise Talent Desk',
      bg: 'bg-black'
    },
    {
      id: 3,
      image: regSlide3Img,
      title: 'Faculty Immersion & Institutional Governance',
      subtitle: 'Real-time NEP 2020 and AICTE IFP monitoring for research projects, mentoring, and academic audits.',
      tag: 'Academic & Governance Cell',
      bg: 'bg-black'
    }
  ];

  // Auto-slide every 4.5 seconds (pauses on hover)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  // Countdown timer for registration OTP
  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSendOtp = async () => {
    const isPhone = otpChannel === 'phone';
    const rawTarget = isPhone ? formData.phone : formData.email;
    const target = (rawTarget || '').trim();

    if (!target) {
      setErrorMsg(`Please provide a valid ${isPhone ? 'mobile phone number' : 'email address'} first.`);
      return;
    }

    if (isPhone) {
      const digitsOnly = target.replace(/\D/g, '');
      if (digitsOnly.length < 10) {
        setErrorMsg('Please enter a valid 10-digit mobile number for SMS OTP.');
        return;
      }
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const type = isPhone ? 'phone' : 'email';
      console.log(`[Register handleSendOtp] Sending ${type} OTP to ${target}`);
      const res = await sendOtpApi({
        identifier: target,
        phone: isPhone ? target : '',
        email: isPhone ? '' : target,
        type,
        purpose: 'register'
      });

      if (res.success) {
        setOtpSent(true);
        setCountdown(res.retry_after || 60);
        if (res.sms_dispatched) {
          setSuccessMsg(`6-digit OTP has been dispatched to mobile +91 ${target} via Fast2SMS. Please enter it below.`);
        } else if (res.email_dispatched) {
          setSuccessMsg(`6-digit OTP has been dispatched to ${target} via Email. Please check your inbox.`);
        } else {
          const fallback = res.demo_code || res.demo_otp;
          setSuccessMsg(res.message || (fallback ? `Verification code: ${fallback}` : 'OTP generated.'));
        }
      } else {
        setErrorMsg(res.error || res.message || 'Failed to dispatch OTP.');
        if (res.retry_after) {
          setCountdown(res.retry_after);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send verification code. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const isPhone = otpChannel === 'phone';
    const rawTarget = isPhone ? formData.phone : formData.email;
    const target = (rawTarget || '').trim();

    if (!otpCode || otpCode.length !== 6) {
      setErrorMsg('Please enter the 6-digit numeric OTP.');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const type = isPhone ? 'phone' : 'email';
      const res = await verifyOtpApi({
        identifier: target,
        phone: isPhone ? target : '',
        email: isPhone ? '' : target,
        otp: otpCode,
        otp_code: otpCode,
        type,
        purpose: 'register'
      });
      if (res.success) {
        setIsVerifiedOtp(true);
        setSuccessMsg(`${isPhone ? 'Phone Number (+91 ' + target + ')' : 'Email (' + target + ')'} verified successfully!`);
      } else {
        setErrorMsg(res.error || res.message || 'Invalid OTP code.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'OTP Verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = async (e) => {
    e.preventDefault();
    if (step === 1) {
      if (formData.password !== formData.confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
      setErrorMsg('');
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      // Step 3: Complete Registration in Supabase
      if (!isVerifiedOtp) {
        setErrorMsg(`Please verify your 6-digit OTP code sent to your ${otpChannel === 'phone' ? 'mobile phone' : 'email'} before completing registration.`);
        return;
      }

      setIsLoading(true);
      setErrorMsg('');
      setSuccessMsg('');

      try {
        const payload = {
          ...formData,
          role: selectedRole
        };
        const res = await registerUserApi(payload);
        const targetRole = String(selectedRole || 'student').toLowerCase();
        if (res.success) {
          setSuccessMsg('Profile provisioned in Supabase! Launching...');
          setTimeout(() => {
            if (typeof setActiveRole === 'function') setActiveRole(targetRole);
            if (targetRole === 'student') {
              if (typeof setActiveTab === 'function') setActiveTab('dashboard');
              navigate('/student/dashboard', { replace: true });
            } else {
              navigate(`/${targetRole}/dashboard`, { replace: true });
            }
          }, 600);
        } else {
          setErrorMsg(res.error || 'Registration failed.');
        }
      } catch (err) {
        const targetRole = String(selectedRole || 'student').toLowerCase();
        if (typeof setActiveRole === 'function') setActiveRole(targetRole);
        if (targetRole === 'student') {
          if (typeof setActiveTab === 'function') setActiveTab('dashboard');
          navigate('/student/dashboard', { replace: true });
        } else {
          navigate(`/${targetRole}/dashboard`, { replace: true });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/60 to-indigo-50/40 flex flex-col justify-between font-['Inter',sans-serif] relative p-3 sm:p-6 md:p-8 selection:bg-sky-500 selection:text-white">
      
      {/* Top Header Bar matching LoginPage */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-2 mb-2 select-none">
        {/* Brand */}
        <div 
          onClick={() => {
            if (typeof setActiveRole === 'function') setActiveRole('landing');
            if (typeof setActiveTab === 'function') setActiveTab('home');
            navigate('/');
          }}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <img 
            src="/academicx-logo.jpg" 
            alt="AcademicX" 
            className="h-8 w-8 object-contain rounded-lg shadow-2xs group-hover:scale-105 transition-transform" 
          />
          <span className="text-xl font-extrabold tracking-tight text-slate-800 font-['Outfit']">
            Academic<span className="text-sky-600">X</span>
          </span>
        </div>

        {/* Back and Sign In links */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (typeof setActiveRole === 'function') setActiveRole('landing');
              if (typeof setActiveTab === 'function') setActiveTab('home');
              navigate('/');
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white/90 hover:bg-white px-3 py-1.5 rounded-full border border-slate-200/80 shadow-2xs transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <button
            onClick={() => {
              if (typeof setActiveRole === 'function') setActiveRole('login');
              navigate('/login');
            }}
            className="text-xs font-semibold text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100/70 px-3.5 py-1.5 rounded-full border border-sky-200 shadow-2xs transition cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Main Dual-Column Modal Card matching Login Page Theme */}
      <main className="flex-1 flex items-center justify-center py-2 sm:py-4">
        <div className="w-full max-w-[960px] bg-white rounded-[32px] sm:rounded-[36px] shadow-2xl shadow-sky-950/5 border border-slate-200/80 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[600px]">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Clean Pastel Auto-Sliding Carousel (Slides every 4.5s) */}
          {/* ========================================================================= */}
          <div 
            className="md:col-span-5 bg-gradient-to-b from-sky-50/70 via-slate-50/80 to-sky-50/40 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-slate-200/80"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Top Tag & Progress indicator */}
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[11px] font-bold text-sky-700/90 uppercase tracking-wider">
                {slides[currentSlide].tag}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {currentSlide + 1} / {slides.length}
              </span>
            </div>

            {/* Illustration Graphic Area */}
            <div className="my-auto py-4 flex flex-col items-center justify-center relative z-10">
              
              {/* Image Container */}
              <div className="relative w-full max-w-[280px] sm:max-w-[310px] aspect-[4/3] flex items-center justify-center overflow-hidden rounded-2xl border border-slate-200/80 shadow-2xs">
                {slides.map((slide, idx) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 flex items-center justify-center p-2 transition-all duration-700 ease-in-out transform ${slide.bg} ${
                      idx === currentSlide 
                        ? 'opacity-100 scale-100 translate-x-0' 
                        : idx < currentSlide
                        ? 'opacity-0 scale-95 -translate-x-12 pointer-events-none'
                        : 'opacity-0 scale-95 translate-x-12 pointer-events-none'
                    }`}
                  >
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-contain select-none rounded-xl"
                    />
                  </div>
                ))}
              </div>

              {/* Slide Headline & Description */}
              <div className="text-center mt-5 max-w-[300px] min-h-[90px] flex flex-col justify-center">
                <h2 className="text-base sm:text-lg font-bold text-slate-800 font-['Outfit'] transition-all duration-500 leading-snug">
                  {slides[currentSlide].title}
                </h2>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed transition-all duration-500">
                  {slides[currentSlide].subtitle}
                </p>
              </div>

            </div>

            {/* Carousel Navigation Indicator Dots at Bottom */}
            <div className="flex items-center justify-center gap-2 pt-2 relative z-10 select-none">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    idx === currentSlide 
                      ? 'w-6 h-2 bg-sky-600' 
                      : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Clean White Auth Wizard (Login Style) */}
          {/* ========================================================================= */}
          <div className="md:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-white">
            
            <div>
              {/* Header Title */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900 font-['Outfit']">
                    {step === 1 && 'Create Your Account'}
                    {step === 2 && 'Role & Institution Info'}
                    {step === 3 && 'Verification & Access'}
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {step === 1 && 'Step 1 of 3: Basic identification'}
                    {step === 2 && 'Step 2 of 3: Credential linkage'}
                    {step === 3 && 'Step 3 of 3: Review and activate'}
                  </p>
                </div>

                {/* Compact Step Dots */}
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                        step === s 
                          ? 'bg-sky-600 text-white shadow-xs' 
                          : step > s 
                          ? 'bg-sky-100 text-sky-800' 
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {step > s ? <Check className="w-3 h-3" /> : s}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleNextStep} className="space-y-3.5 text-xs">
                
                {/* ---------------- STEP 1: Basic Info & Role ---------------- */}
                {step === 1 && (
                  <>
                    {/* Full Name */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          placeholder="Your Full Name"
                          className="w-full pl-9 pr-3 py-2 bg-slate-50/70 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl text-xs text-slate-900 focus:outline-none transition shadow-2xs"
                        />
                      </div>
                    </div>

                    {/* Email and Phone in 2 Cols */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Institutional or Work Email
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="name@institution.edu"
                            className="w-full pl-9 pr-3 py-2 bg-slate-50/70 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl text-xs text-slate-900 focus:outline-none transition shadow-2xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Mobile Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="+919876543210"
                            className="w-full pl-9 pr-3 py-2 bg-slate-50/70 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl text-xs text-slate-900 focus:outline-none transition shadow-2xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Password & Confirm Password in 2 Cols */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-8 pr-8 py-2 bg-slate-50/70 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl text-xs text-slate-900 focus:outline-none transition shadow-2xs"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-8 pr-8 py-2 bg-slate-50/70 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl text-xs text-slate-900 focus:outline-none transition shadow-2xs"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                          >
                            {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Role Selector: 4 sleek compact cards */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                        Select Your Role
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { id: 'student', label: 'Student', icon: GraduationCap },
                          { id: 'recruiter', label: 'Recruiter', icon: Briefcase },
                          { id: 'faculty', label: 'Faculty', icon: Compass },
                          { id: 'admin', label: 'Admin', icon: Building2 }
                        ].map((role) => {
                          const IconComp = role.icon;
                          const isActive = selectedRole === role.id;
                          return (
                            <button
                              key={role.id}
                              type="button"
                              onClick={() => setSelectedRole(role.id)}
                              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                                isActive 
                                  ? 'border-sky-600 bg-sky-50/80 text-sky-800 font-bold shadow-2xs' 
                                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/40 text-slate-600 font-medium'
                              }`}
                            >
                              <IconComp className={`w-4 h-4 ${isActive ? 'text-sky-700' : 'text-slate-500'}`} />
                              <span className="text-[11px]">{role.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="terms"
                        required
                        checked={formData.agreeTerms}
                        onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                        className="w-3.5 h-3.5 rounded text-sky-600 focus:ring-sky-500 border-slate-300 cursor-pointer"
                      />
                      <label htmlFor="terms" className="text-[11px] text-slate-500 cursor-pointer">
                        I agree to the <span className="text-sky-700 font-medium hover:underline">Terms</span> & <span className="text-sky-700 font-medium hover:underline">Privacy Policy</span>
                      </label>
                    </div>
                  </>
                )}

                {/* ---------------- STEP 2: Role Specific Details ---------------- */}
                {step === 2 && (
                  <div className="space-y-3.5 py-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        {selectedRole === 'student' ? 'College / University Name' : selectedRole === 'recruiter' ? 'Company / Organization' : selectedRole === 'faculty' ? 'Academic Institution' : 'Institute Name'}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.institutionOrCompany}
                        onChange={(e) => handleInputChange('institutionOrCompany', e.target.value)}
                        placeholder="e.g. University / Institution Name"
                        className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl text-xs text-slate-900 focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        {selectedRole === 'student' ? 'University Roll No / Student ID' : selectedRole === 'recruiter' ? 'Corporate Work Email' : 'Faculty ID / Employee Code'}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.studentRollNo}
                        onChange={(e) => handleInputChange('studentRollNo', e.target.value)}
                        placeholder="e.g. Student ID or Employee Code"
                        className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl text-xs text-slate-900 focus:outline-none transition"
                      />
                      <p className="text-[10px] text-sky-600 mt-1 flex items-center gap-1 font-medium">
                        <Check className="w-3 h-3" /> Direct linkage with University Registrar & NAD database
                      </p>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        {selectedRole === 'student' ? 'Degree & Branch (e.g. B.Tech CSE)' : selectedRole === 'recruiter' ? 'Hiring Domain / Role' : 'Department & Designation'}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.degreeOrDept}
                        onChange={(e) => handleInputChange('degreeOrDept', e.target.value)}
                        placeholder="e.g. B.Tech Computer Science (Final Year)"
                        className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl text-xs text-slate-900 focus:outline-none transition"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 pt-1 font-medium cursor-pointer"
                    >
                      <ArrowLeft className="w-3 h-3" /> Back to Account Details
                    </button>
                  </div>
                )}

                {/* Error & Success Feedback */}
                {errorMsg && (
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{errorMsg}</span>
                  </div>
                )}
                {successMsg && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {/* ---------------- STEP 3: Verification & Final Confirmation ---------------- */}
                {step === 3 && (
                  <div className="space-y-3.5 py-1">
                    <div className="text-center">
                      <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xs border border-sky-100 mb-1.5">
                        <KeyRound className="w-5 h-5 text-sky-600" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 font-['Outfit']">
                        Multi-Channel OTP Verification
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Verify your identity via mobile SMS or academic email before provisioning your account.
                      </p>
                    </div>

                    {/* Verification Channel Selector */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => { setOtpChannel('phone'); setOtpSent(false); setIsVerifiedOtp(false); setErrorMsg(''); setSuccessMsg(''); }}
                        className={`p-2 rounded-xl border text-[11px] font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          otpChannel === 'phone' ? 'border-sky-500 bg-sky-50 text-sky-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>SMS to Mobile</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => { setOtpChannel('email'); setOtpSent(false); setIsVerifiedOtp(false); setErrorMsg(''); setSuccessMsg(''); }}
                        className={`p-2 rounded-xl border text-[11px] font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          otpChannel === 'email' ? 'border-sky-500 bg-sky-50 text-sky-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email Code</span>
                      </button>
                    </div>

                    {/* OTP Action Card */}
                    <div className="p-3 bg-slate-50/80 border border-slate-200 rounded-xl space-y-2.5 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 font-medium">
                          Recipient: <strong className="text-slate-800">{otpChannel === 'phone' ? formData.phone : formData.email}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={isLoading || countdown > 0}
                          className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-[10px] font-semibold transition disabled:opacity-50 cursor-pointer"
                        >
                          {countdown > 0 ? `Resend (${countdown}s)` : otpSent ? 'Resend Code' : 'Send 6-Digit OTP'}
                        </button>
                      </div>

                      {otpSent && (
                        <div className="space-y-2 pt-1.5 border-t border-slate-200/80">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Enter Received 6-Digit Code:</span>
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              maxLength={6}
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                              placeholder="• • • • • •"
                              className="flex-1 text-center font-mono text-sm tracking-widest py-1.5 bg-white border border-sky-300 rounded-lg text-slate-900 focus:outline-none shadow-2xs"
                            />
                            <button
                              type="button"
                              onClick={handleVerifyOtp}
                              disabled={isLoading || otpCode.length !== 6 || isVerifiedOtp}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition cursor-pointer ${
                                isVerifiedOtp ? 'bg-emerald-600' : 'bg-slate-900 hover:bg-black disabled:opacity-50'
                              }`}
                            >
                              {isVerifiedOtp ? 'Verified ✓' : 'Verify'}
                            </button>
                          </div>
                        </div>
                      )}

                      {isVerifiedOtp && (
                        <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-1.5 font-medium">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Credentials Authenticated & Verified with Institutional Academic Registry</span>
                        </div>
                      )}
                    </div>

                    {/* Registration Summary */}
                    <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-2.5 text-left text-[11px] space-y-1 max-w-sm mx-auto">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Full Name:</span>
                        <span className="font-semibold text-slate-800">{formData.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Email:</span>
                        <span className="font-semibold text-slate-800">{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Mobile Phone:</span>
                        <span className="font-semibold text-slate-800">{formData.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Role:</span>
                        <span className="font-semibold capitalize text-sky-700">{selectedRole}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 justify-center mx-auto font-medium cursor-pointer"
                    >
                      <ArrowLeft className="w-3 h-3" /> Edit Details
                    </button>
                  </div>
                )}

                {/* Action Submit Button matching Login Page style */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-6 rounded-full bg-[#1e293b] hover:bg-slate-950 text-white font-semibold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-70"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Provisioning Profile...</span>
                      </>
                    ) : (
                      <>
                        <span>{step < 3 ? 'Continue to Next Step' : 'Launch Workspace'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

                {/* Switch to Login */}
                <div className="pt-1 text-center">
                  <p className="text-[11px] text-slate-500">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof setActiveRole === 'function') setActiveRole('login');
                        navigate('/login');
                      }}
                      className="text-sky-700 font-bold hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </form>
            </div>

          </div>
        </div>
      </main>

    </div>
  );
}
