import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, ArrowLeft, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export default function OTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOTP, sendOTP } = useAuth();

  // Retrieve email and purpose from navigation state
  const email = location.state?.email || '';
  const purpose = location.state?.purpose || 'login';

  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);

  const inputRefs = useRef([]);

  // Redirect to login if email is missing
  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  // 60-second countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Handle single digit changes and auto-focus
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otpDigits];
    newOtp[index] = value.slice(-1); // Only take latest char
    setOtpDigits(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify if all 6 digits are provided
    const combinedOtp = newOtp.join('');
    if (combinedOtp.length === 6) {
      submitVerification(combinedOtp);
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste for full 6 digits
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim().slice(0, 6);
    if (/^\d+$/.test(pasteData)) {
      const newDigits = pasteData.split('').concat(Array(6).fill('')).slice(0, 6);
      setOtpDigits(newDigits);
      if (pasteData.length === 6) {
        submitVerification(pasteData);
      }
    }
  };

  const submitVerification = async (codeToVerify) => {
    const code = codeToVerify || otpDigits.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits of the OTP.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await verifyOTP(email, code, purpose);

      if (purpose === 'login') {
        const userRole = data.role || data.user?.profile?.role;
        if (!userRole || userRole === 'student') {
          // Allow role selection or direct to role-selection
          navigate('/role-selection');
        } else {
          navigate(`/${userRole}/dashboard`);
        }
      } else if (purpose === 'register') {
        navigate('/register', { state: { email, email_verified: true } });
      } else if (purpose === 'reset_password') {
        navigate('/reset-password', { state: { email, reset_allowed: true } });
      }
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setError('');

    try {
      await sendOTP(email, purpose);
      setCountdown(60);
      setOtpDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message || 'Failed to resend code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-['Inter',sans-serif]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 mb-3 shadow-xs">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Enter Verification Code
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          We sent a 6-digit one-time code to <br />
          <strong className="text-slate-900 font-semibold">{email}</strong>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl sm:px-10 border border-slate-100">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* 6 Digit Inputs */}
            <div className="flex justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold font-mono bg-slate-50 border-2 border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl text-slate-900 focus:outline-none transition shadow-xs"
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              type="button"
              disabled={loading || otpDigits.join('').length !== 6}
              onClick={() => submitVerification()}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Verify OTP</span>
              )}
            </button>

            {/* Resend Section with Countdown */}
            <div className="text-center pt-2">
              {countdown > 0 ? (
                <p className="text-xs text-slate-500 font-medium">
                  Resend code in <span className="font-bold text-blue-600">{countdown}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resending}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                  <span>Resend OTP Code</span>
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <Link
              to="/login"
              className="text-xs text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 transition font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
