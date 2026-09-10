import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  X,
  Phone,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { loginUserApi, sendOtpApi, verifyOtpApi } from '../services/api';
import slide1Img from '../assets/carousel/slide1.jpg';
import slide2Img from '../assets/carousel/slide2.jpg';
import slide3Img from '../assets/carousel/slide3.jpg';

export default function LoginPage({ setActiveRole, setActiveTab }) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [authMode, setAuthMode] = useState('password'); // 'password' | 'otp'
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  // OTP Login State
  const [otpIdentifier, setOtpIdentifier] = useState('');
  const [otpType, setOtpType] = useState('email'); // 'email' | 'phone'
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // 3 Slides with Inspiring Thoughts & Matching User-Uploaded Illustrations
  const slides = [
    {
      id: 1,
      image: slide1Img,
      title: 'Industry-Ready Skill Diagnostics',
      subtitle: 'Identify curriculum gaps with AI and prepare for high-impact campus placements with personalized roadmaps.',
      accent: '#2563eb'
    },
    {
      id: 2,
      image: slide2Img,
      title: 'Faculty Mentorship & Immersion',
      subtitle: 'Empower faculty-student collaboration with institutional project tracking aligned with AICTE & NEP 2020.',
      accent: '#059669'
    },
    {
      id: 3,
      image: slide3Img,
      title: 'Verified Academic Credentials',
      subtitle: 'Connect registrar-certified transcripts and authentic academic portfolios directly to verified corporate hiring partners.',
      accent: '#3b82f6'
    }
  ];

  // Auto-slide every 4.5 seconds (4-5 sec per user request)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  // Countdown timer for OTP
  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  // Auto-detect role based on user email or identifier
  const detectRoleFromEmail = (email) => {
    const lower = (email || '').toLowerCase().trim();
    if (lower.includes('recruiter') || lower.includes('talent') || lower.includes('hr') || lower.includes('corp')) {
      return 'recruiter';
    }
    if (lower.includes('faculty') || lower.includes('prof') || lower.includes('teacher') || lower.includes('mentor')) {
      return 'faculty';
    }
    if (lower.includes('admin') || lower.includes('dean') || lower.includes('registrar') || lower.includes('director')) {
      return 'admin';
    }
    return 'student'; // Default to student
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');
    setAuthSuccess('');

    try {
      const res = await loginUserApi({
        email: credentials.email,
        password: credentials.password
      });

      if (res.success && res.user) {
        setAuthSuccess(`Welcome back, ${res.user.full_name || 'User'}!`);
        const targetRole = res.user.role || detectRoleFromEmail(credentials.email);
        setTimeout(() => {
          setActiveRole(targetRole);
          if (targetRole === 'student') setActiveTab('dashboard');
        }, 600);
      } else {
        setAuthError(res.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      setAuthError(err.message || 'Unable to connect to authentication server. Please verify your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchOtpType = (newType) => {
    if (newType === otpType) return;
    setOtpType(newType);
    setOtpIdentifier('');
    setOtpCode('');
    setOtpSent(false);
    setAuthError('');
    setAuthSuccess('');
    setCountdown(0);
  };

  const handleSendOtp = async () => {
    const cleanId = otpIdentifier.trim();
    if (!cleanId) {
      setAuthError(otpType === 'phone' ? 'Please enter your 10-digit mobile number.' : 'Please enter your registered email address.');
      return;
    }

    if (otpType === 'phone') {
      const digitsOnly = cleanId.replace(/\D/g, '');
      if (digitsOnly.length < 10) {
        setAuthError('Please enter a valid 10-digit mobile number.');
        return;
      }
    }

    setIsLoading(true);
    setAuthError('');
    setAuthSuccess('');

    try {
      const isEmail = cleanId.includes('@') || otpType === 'email';
      const type = isEmail ? 'email' : 'phone';
      const res = await sendOtpApi({ identifier: cleanId, email: cleanId, type, purpose: 'login' });

      if (res.success) {
        setOtpSent(true);
        setCountdown(res.retry_after || 60);
        const codeHint = (res.demo_code || res.demo_otp) ? ` [Verification Code: ${res.demo_code || res.demo_otp}]` : '';
        if (res.message) {
          setAuthSuccess(res.message + codeHint);
        } else if (type === 'email') {
          setAuthSuccess(`6-digit OTP dispatched to ${res.identifier || cleanId} via Email.${codeHint}`);
        } else {
          setAuthSuccess(`6-digit OTP dispatched to +91 ${res.identifier || cleanId} via Fast2SMS.${codeHint}`);
        }
        if (res.demo_code || res.demo_otp) {
          setOtpCode(res.demo_code || res.demo_otp);
        }
      } else {
        setAuthError(res.error || res.message || 'Failed to dispatch OTP. Please try again.');
        if (res.retry_after) {
          setCountdown(res.retry_after);
        }
      }
    } catch (err) {
      setAuthError(err.message || 'Failed to send OTP code. Please check your network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpLogin = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setAuthError('Please enter the 6-digit numeric OTP.');
      return;
    }

    setIsLoading(true);
    setAuthError('');
    setAuthSuccess('');

    try {
      const cleanId = otpIdentifier.trim();
      const isEmail = cleanId.includes('@') || otpType === 'email';
      const payload = {
        otp: otpCode,
        isOtpLogin: true,
        identifier: cleanId,
        email: isEmail ? cleanId : '',
        phone: !isEmail ? cleanId : ''
      };

      const res = await loginUserApi(payload);
      if (res.success && res.user) {
        setAuthSuccess('OTP verified successfully! Launching workspace...');
        const targetRole = res.user.role || res.role || detectRoleFromEmail(cleanId);
        setTimeout(() => {
          setActiveRole(targetRole);
          if (targetRole === 'student') setActiveTab('dashboard');
        }, 600);
      } else {
        setAuthError(res.error || res.message || 'Invalid OTP code.');
      }
    } catch (err) {
      setAuthError('OTP Verification failed. Please check the code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    const role = detectRoleFromEmail(credentials.email);
    setActiveRole(role);
    if (role === 'student') {
      setActiveTab('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/60 to-indigo-50/40 flex flex-col justify-between font-['Inter',sans-serif] relative p-3 sm:p-6 md:p-8 selection:bg-sky-500 selection:text-white">
      
      {/* Top Navigation */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-2 mb-2 select-none">
        {/* Brand */}
        <div 
          onClick={() => { setActiveRole('landing'); setActiveTab('home'); }}
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

        {/* Back and Register links */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setActiveRole('landing'); setActiveTab('home'); }}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white/90 hover:bg-white px-3 py-1.5 rounded-full border border-slate-200/80 shadow-2xs transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <button
            onClick={() => setActiveRole('register')}
            className="text-xs font-semibold text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100/70 px-3.5 py-1.5 rounded-full border border-sky-200 shadow-2xs transition cursor-pointer"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Main Dual-Column Modal Card matching Reference Screenshot (Praktika / UNIEDU) */}
      <main className="flex-1 flex items-center justify-center py-2 sm:py-4">
        <div className="w-full max-w-[920px] bg-white rounded-[32px] sm:rounded-[36px] shadow-2xl shadow-sky-950/5 border border-slate-200/80 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Clean Pastel Auto-Sliding Carousel (Slides every 4.5s) */}
          {/* ========================================================================= */}
          <div 
            className="md:col-span-6 bg-gradient-to-b from-sky-50/70 via-slate-50/80 to-sky-50/40 p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-slate-200/80"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Top Tag */}
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[11px] font-bold text-sky-700/90 uppercase tracking-wider">
                Academia-Industry Collaboration
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {currentSlide + 1} / {slides.length}
              </span>
            </div>

            {/* Illustration Graphic Area */}
            <div className="my-auto py-4 flex flex-col items-center justify-center relative z-10">
              
              {/* Image Container with subtle soft background glow */}
              <div className="relative w-full max-w-[310px] sm:max-w-[340px] aspect-[4/3] flex items-center justify-center overflow-hidden rounded-2xl">
                {slides.map((slide, idx) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out transform ${
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
                      className="w-full h-full object-contain drop-shadow-sm select-none"
                    />
                  </div>
                ))}
              </div>

              {/* Slide Headline & Thought Description */}
              <div className="text-center mt-6 max-w-[340px] min-h-[96px] flex flex-col justify-center">
                <h2 className="text-lg sm:text-xl font-bold text-slate-800 font-['Outfit'] transition-all duration-500 leading-snug">
                  {slides[currentSlide].title}
                </h2>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed transition-all duration-500">
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
          {/* RIGHT COLUMN: Clean White Auth Form (UNIEDU Exact Style) */}
          {/* ========================================================================= */}
          <div className="md:col-span-6 p-6 sm:p-10 md:p-12 flex flex-col justify-between bg-white">
            
            <div className="my-auto space-y-6">
              
              {/* Brand Header */}
              <div className="text-center">
                <div 
                  onClick={() => { setActiveRole('landing'); setActiveTab('home'); }}
                  className="inline-flex items-center gap-2.5 cursor-pointer mb-2 group"
                >
                  <img 
                    src="/academicx-logo.jpg" 
                    alt="AcademicX" 
                    className="h-10 w-10 object-contain rounded-xl shadow-2xs group-hover:scale-105 transition-transform" 
                  />
                  <span className="text-2xl font-black tracking-tight text-slate-900 font-['Outfit']">
                    Academic<span className="text-sky-600">X</span>
                  </span>
                </div>
                <h1 className="text-base sm:text-lg font-semibold text-slate-700 tracking-tight">
                  Welcome to AcademicX
                </h1>
              </div>

              {/* Authentication Mode Switcher: Password vs OTP */}
              <div className="flex items-center justify-center p-1 bg-slate-100/90 rounded-2xl max-w-xs sm:max-w-sm mx-auto select-none">
                <button
                  type="button"
                  onClick={() => { setAuthMode('password'); setAuthError(''); setAuthSuccess(''); }}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    authMode === 'password'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Password Login
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('otp'); setAuthError(''); setAuthSuccess(''); }}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    authMode === 'otp'
                      ? 'bg-white text-sky-700 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Instant OTP Login</span>
                </button>
              </div>

              {/* Status & Error Alerts */}
              {authError && (
                <div className="max-w-xs sm:max-w-sm mx-auto p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{authError}</span>
                  </div>
                  {(authError.toLowerCase().includes('register') || authError.toLowerCase().includes('sign up')) && (
                    <button
                      type="button"
                      onClick={() => setActiveRole('register')}
                      className="text-xs font-bold text-sky-700 hover:text-sky-900 underline shrink-0 cursor-pointer ml-1 whitespace-nowrap"
                    >
                      Register now →
                    </button>
                  )}
                </div>
              )}
              {authSuccess && (
                <div className="max-w-xs sm:max-w-sm mx-auto p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{authSuccess}</span>
                </div>
              )}

              {/* ----------------- MODE 1: PASSWORD LOGIN ----------------- */}
              {authMode === 'password' ? (
                <form onSubmit={handlePasswordLogin} className="space-y-4 max-w-xs sm:max-w-sm mx-auto">
                  {/* Username or Email Input */}
                  <div>
                    <label className="block text-xs text-slate-500 font-medium mb-1">
                      Institutional or Corporate Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={credentials.email}
                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                        placeholder="name@institution.edu"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50/60 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none transition shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-xs text-slate-500 font-medium mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={credentials.password}
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-10 py-2.5 bg-slate-50/60 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none transition shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Sign In Button */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 px-6 rounded-full bg-[#1e293b] hover:bg-slate-950 text-white font-semibold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <span>Sign In</span>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* ----------------- MODE 2: INSTANT OTP LOGIN ----------------- */
                <form onSubmit={handleOtpLogin} className="space-y-4 max-w-xs sm:max-w-sm mx-auto">
                  {/* Channel Toggle: Mobile or Email */}
                  <div>
                    <label className="block text-xs text-slate-500 font-medium mb-1">
                      OTP Delivery Channel
                    </label>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <button
                        type="button"
                        onClick={() => handleSwitchOtpType('phone')}
                        className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          otpType === 'phone' ? 'border-sky-500 bg-sky-50/70 text-sky-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Mobile (SMS)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSwitchOtpType('email')}
                        className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          otpType === 'email' ? 'border-sky-500 bg-sky-50/70 text-sky-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email Address</span>
                      </button>
                    </div>

                    {/* Identifier Input */}
                    <div className="mb-1 flex items-center justify-between">
                      <label className="block text-xs text-slate-500 font-medium">
                        {otpType === 'phone' ? 'Mobile Phone Number' : 'Registered Email Address'}
                      </label>
                      {otpType === 'phone' && (
                        <span className="text-[10px] text-slate-400">10-digit Indian Mobile</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type={otpType === 'phone' ? 'tel' : 'email'}
                        required
                        value={otpIdentifier}
                        onChange={(e) => {
                          setAuthError('');
                          if (otpType === 'phone') {
                            setOtpIdentifier(e.target.value.replace(/[^\d+]/g, ''));
                          } else {
                            setOtpIdentifier(e.target.value);
                          }
                        }}
                        placeholder={otpType === 'phone' ? 'Enter 10-digit mobile number' : 'name@institution.edu'}
                        className="flex-1 px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none transition shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isLoading || countdown > 0}
                        className="px-3.5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold transition disabled:opacity-60 cursor-pointer shrink-0"
                      >
                        {countdown > 0 ? `${countdown}s` : otpSent ? 'Resend' : 'Send Code'}
                      </button>
                    </div>
                  </div>

                  {/* 6-Digit OTP Field (Visible once sent or ready) */}
                  {otpSent && (
                    <div className="space-y-2 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs text-slate-500 font-medium">
                          Enter 6-Digit Code
                        </label>
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="• • • • • •"
                        className="w-full text-center tracking-[0.4em] font-mono text-base font-bold py-2.5 bg-slate-50/80 border border-sky-300 focus:border-sky-600 focus:bg-white rounded-xl text-slate-900 focus:outline-none transition shadow-2xs"
                      />
                    </div>
                  )}

                  {/* Verify & Sign In Button */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={isLoading || !otpSent || otpCode.length !== 6}
                      className="w-full py-2.5 px-6 rounded-full bg-[#1e293b] hover:bg-slate-950 text-white font-semibold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Verifying Code...</span>
                        </>
                      ) : (
                        <span>Verify & Sign In</span>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Divider Line: or */}
              <div className="relative flex py-1 items-center max-w-xs sm:max-w-sm mx-auto">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-3 text-slate-400 text-[11px] lowercase">
                  or
                </span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Sign in with Google Button */}
              <div className="max-w-xs sm:max-w-sm mx-auto">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full py-2 px-4 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2.5 transition shadow-2xs cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Sign in with Google</span>
                </button>
              </div>
            </div>

            {/* Bottom Register Switch */}
            <div className="pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setActiveRole('register')}
                  className="text-sky-700 font-bold hover:underline cursor-pointer ml-1"
                >
                  Sign up
                </button>
              </p>
            </div>

          </div>

        </div>
      </main>

      {/* Forgot Password Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setShowHelpModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mb-3.5">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
              Reset Your Password
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
              Enter your registered email and we will send you instructions to reset your password.
            </p>
            <div className="my-4">
              <input
                type="email"
                defaultValue={credentials.email}
                placeholder="Enter your email"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-sky-500"
              />
            </div>
            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition cursor-pointer"
            >
              Send Reset Link
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
