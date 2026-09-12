import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ChevronDown, 
  GraduationCap, 
  Briefcase, 
  Compass, 
  ShieldCheck, 
  User, 
  Sparkles, 
  ExternalLink, 
  LogOut,
  Target,
  FileCheck2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getCurrentUserApi, logoutUserApi } from '../services/api';
import { getStoredUserAvatar, fetchUserAvatarFromCloud } from '../utils/avatarSync';

export default function Navbar({ activeRole, setActiveRole, activeTab, setActiveTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, isAuthenticated, logout } = useAuth();

  const storedUser = getCurrentUserApi();
  const currentUser = user || storedUser;
  const token = localStorage.getItem('access_token') || localStorage.getItem('reddot_token');
  const isAuth = (isAuthenticated || !!token) && !!currentUser;
  const currentRole = (role || currentUser?.role || currentUser?.profile?.role || '').toLowerCase();
  const isStudent = isAuth && currentRole === 'student';

  const [navAvatar, setNavAvatar] = useState(() => getStoredUserAvatar(currentUser));

  useEffect(() => {
    if (!currentUser) {
      setNavAvatar(null);
      return;
    }
    setNavAvatar(getStoredUserAvatar(currentUser));

    let isSubscribed = true;
    const syncNav = async () => {
      const cloudPhoto = await fetchUserAvatarFromCloud(currentUser);
      if (cloudPhoto && isSubscribed) {
        setNavAvatar(cloudPhoto);
      }
    };
    syncNav();

    const handleAvatarUpdate = (e) => {
      if (e.detail?.avatar_url && isSubscribed) {
        setNavAvatar(e.detail.avatar_url);
      }
    };
    window.addEventListener('academicx_avatar_updated', handleAvatarUpdate);

    return () => {
      isSubscribed = false;
      window.removeEventListener('academicx_avatar_updated', handleAvatarUpdate);
    };
  }, [currentUser?.email, currentUser?.phone, currentUser?.id]);

  const handleNavigate = (path, roleName, tabName) => {
    if (typeof setActiveRole === 'function' && roleName) {
      setActiveRole(roleName);
    }
    if (typeof setActiveTab === 'function' && tabName) {
      setActiveTab(tabName);
    }
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    logoutUserApi();
    if (typeof logout === 'function') {
      await logout();
    }
    if (typeof setActiveRole === 'function') {
      setActiveRole('landing');
    }
    if (typeof setActiveTab === 'function') {
      setActiveTab('home');
    }
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // General portal navigation links (Public and other visitors)
  const allPortalNavLinks = [
    { 
      name: 'Home', 
      action: () => handleNavigate('/', 'landing', 'home'),
      isActive: location.pathname === '/' || (!isAuth && activeRole === 'landing')
    },
    { 
      name: 'About', 
      action: () => handleNavigate('/about', 'about', 'about'),
      isActive: location.pathname === '/about' || activeRole === 'about'
    },
    { 
      name: 'For Students', 
      action: () => handleNavigate('/student/dashboard', 'student', 'dashboard'),
      isActive: location.pathname.startsWith('/student')
    },
    { 
      name: 'For Faculty', 
      action: () => handleNavigate('/faculty/dashboard', 'faculty', 'faculty'),
      isActive: location.pathname.startsWith('/faculty') || activeRole === 'faculty'
    },
    { 
      name: 'For Recruiters', 
      action: () => handleNavigate('/recruiter/dashboard', 'recruiter', 'recruiter'),
      isActive: location.pathname.startsWith('/recruiter') || activeRole === 'recruiter'
    },
    { 
      name: 'Institutions', 
      action: () => handleNavigate('/admin/dashboard', 'admin', 'admin'),
      isActive: location.pathname.startsWith('/admin') || activeRole === 'admin'
    },
  ];

  // Dedicated Student Portal Navigation (Includes Skill Analysis, Roadmap, Mock Interview)
  const studentNavLinks = [
    { 
      name: 'Opportunities', 
      action: () => handleNavigate('/student/dashboard', 'student', 'dashboard'),
      isActive: location.pathname === '/student/dashboard' || location.pathname === '/student'
    },
    { 
      name: 'Skill Analysis', 
      action: () => handleNavigate('/student/skills', 'student', 'diagnostic'),
      isActive: location.pathname === '/student/skills'
    },
    { 
      name: 'Career Roadmap', 
      action: () => handleNavigate('/student/roadmap', 'student', 'roadmap'),
      isActive: location.pathname === '/student/roadmap'
    },
    { 
      name: 'Mock Interview', 
      action: () => handleNavigate('/student/interview', 'student', 'interview'),
      isActive: location.pathname === '/student/interview' || location.pathname === '/student/coach'
    },
    { 
      name: 'Resume Review', 
      action: () => handleNavigate('/student/resume', 'student', 'resume'),
      isActive: location.pathname === '/student/resume'
    },
    { 
      name: 'Portfolio', 
      action: () => handleNavigate('/student/profile', 'student', 'portfolio'),
      isActive: location.pathname === '/student/profile'
    },
  ];

  const activeNavLinks = isStudent ? studentNavLinks : allPortalNavLinks;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      {/* Main AcademicX Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo: AcademicX */}
        <div 
          onClick={() => {
            if (isStudent) {
              handleNavigate('/student/dashboard', 'student', 'dashboard');
            } else {
              handleNavigate('/', 'landing', 'home');
            }
          }}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <img 
            src="/academicx-logo.jpg" 
            alt="AcademicX" 
            className="h-11 w-11 object-contain rounded-xl shadow-2xs group-hover:scale-105 transition-transform" 
          />
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-['Outfit'] leading-none">
              Academic<span className="text-sky-600">X</span>
            </span>
            <span className="text-[9px] font-bold tracking-wider text-slate-500 uppercase mt-0.5">
              Learn • Prepare • Achieve
            </span>
          </div>
        </div>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
          {activeNavLinks.map((link, idx) => (
            <button
              key={idx}
              onClick={link.action}
              className={`transition hover:text-sky-600 py-2 relative cursor-pointer ${
                link.isActive ? 'text-sky-700 font-semibold' : ''
              }`}
            >
              {link.name}
              {link.isActive && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-600 rounded-full"></span>
              )}
            </button>
          ))}
        </nav>

        {/* Right Actions: Auth Status or Login/Register */}
        <div className="flex items-center gap-3">
          {isAuth ? (
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  {currentUser.full_name || currentUser.email}
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                  {currentUser.role || (isStudent ? 'STUDENT' : 'Member')}
                </span>
              </div>

              {/* User Avatar Badge */}
              <div 
                onClick={() => {
                  if (isStudent) handleNavigate('/student/dashboard', 'student', 'dashboard');
                }}
                className="w-9 h-9 rounded-full overflow-hidden border-2 border-sky-200 ring-2 ring-sky-50 shadow-2xs shrink-0 flex items-center justify-center bg-gradient-to-br from-sky-100 to-indigo-100 cursor-pointer transition-transform hover:scale-105"
                title={currentUser.full_name || currentUser.email}
              >
                {navAvatar ? (
                  <img 
                    src={navAvatar} 
                    alt={currentUser.full_name || 'User'} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <span className="text-xs font-extrabold text-sky-700 font-['Outfit']">
                    {(currentUser.full_name || currentUser.email || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'ST'}
                  </span>
                )}
              </div>

              {!isStudent && (
                <button
                  onClick={() => {
                    const targetRole = currentRole || 'student';
                    handleNavigate(`/${targetRole}/dashboard`, targetRole, 'dashboard');
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 px-3.5 py-1.5 rounded-full shadow-2xs transition cursor-pointer"
                  title="Go to your portal dashboard"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </button>
              )}

              {/* Sign Out / Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50/70 hover:bg-red-100/70 px-3.5 py-1.5 rounded-full border border-red-200 transition cursor-pointer"
                title="Sign out of account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <>
              {/* Login Link */}
              <button
                onClick={() => handleNavigate('/login', 'login', 'login')}
                className="hidden sm:block text-sm font-semibold text-slate-700 hover:text-sky-600 transition px-2 cursor-pointer"
              >
                Login
              </button>

              {/* Sky Blue Register Button */}
              <button
                onClick={() => handleNavigate('/register', 'register', 'register')}
                className="bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm px-6 py-2.5 rounded-full shadow-xs hover:shadow-md transition-all active:scale-98 cursor-pointer"
              >
                Register
              </button>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {isAuth && (
            <div className="flex items-center gap-3 p-2.5 mb-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-sky-200 ring-2 ring-sky-50 shadow-2xs shrink-0 flex items-center justify-center bg-gradient-to-br from-sky-100 to-indigo-100">
                {navAvatar ? (
                  <img src={navAvatar} alt={currentUser.full_name || 'User'} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-extrabold text-sky-700 font-['Outfit']">
                    {(currentUser.full_name || currentUser.email || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'ST'}
                  </span>
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-slate-800 truncate">{currentUser.full_name || currentUser.email}</span>
                <span className="text-[10px] font-semibold text-sky-600 uppercase">{currentUser.role || (isStudent ? 'STUDENT' : 'Member')}</span>
              </div>
            </div>
          )}
          {activeNavLinks.map((link, idx) => (
            <button
              key={idx}
              onClick={() => {
                link.action();
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                link.isActive ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-slate-700 hover:bg-sky-50 hover:text-sky-700'
              }`}
            >
              {link.name}
            </button>
          ))}

          <div className="pt-3 border-t border-slate-100 flex gap-2">
            {isAuth ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-center text-sm font-semibold bg-red-50 text-red-600 border border-red-200 rounded-xl flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => { 
                    handleNavigate('/login', 'login', 'login'); 
                    setMobileMenuOpen(false); 
                  }}
                  className="w-1/2 py-2.5 text-center text-sm font-semibold border border-slate-200 rounded-xl text-slate-700"
                >
                  Login
                </button>
                <button
                  onClick={() => { 
                    handleNavigate('/register', 'register', 'register'); 
                    setMobileMenuOpen(false); 
                  }}
                  className="w-1/2 py-2.5 text-center text-sm font-semibold bg-sky-600 text-white rounded-xl"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
