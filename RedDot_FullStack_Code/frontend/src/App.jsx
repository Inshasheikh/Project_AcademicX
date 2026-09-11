import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import SkillDiagnosticPage from './pages/SkillDiagnosticPage';
import CareerCoachPage from './pages/CareerCoachPage';
import FacultyDashboard from './pages/FacultyDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('home');

  // Derive activeRole from the current route path
  const getActiveRoleFromPath = (path) => {
    if (path === '/login') return 'login';
    if (path === '/register') return 'register';
    if (path === '/about') return 'about';
    if (path.startsWith('/student')) return 'student';
    if (path.startsWith('/faculty')) return 'faculty';
    if (path.startsWith('/recruiter')) return 'recruiter';
    if (path.startsWith('/admin')) return 'admin';
    return 'landing';
  };

  const [activeRole, setActiveRole] = useState(() => getActiveRoleFromPath(location.pathname));

  useEffect(() => {
    setActiveRole(getActiveRoleFromPath(location.pathname));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // Backward-compatible role switcher function for existing child props
  const handleSetRole = (role) => {
    setActiveRole(role);
    if (role === 'landing') navigate('/');
    else if (role === 'about') navigate('/about');
    else if (role === 'login') navigate('/login');
    else if (role === 'register') navigate('/register');
    else if (role === 'student') navigate('/student/dashboard');
    else if (role === 'recruiter') navigate('/recruiter/dashboard');
    else if (role === 'faculty') navigate('/faculty/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen flex flex-col bg-white font-['Inter',sans-serif]">
      {!isAuthPage && (
        <Navbar 
          activeRole={activeRole} 
          setActiveRole={handleSetRole} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
      )}

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage setActiveRole={handleSetRole} setActiveTab={setActiveTab} />} />
          <Route path="/landing" element={<Navigate to="/" replace />} />
          <Route path="/about" element={<AboutPage setActiveRole={handleSetRole} setActiveTab={setActiveTab} />} />
          <Route path="/login" element={<LoginPage setActiveRole={handleSetRole} setActiveTab={setActiveTab} />} />
          <Route path="/register" element={<RegisterPage setActiveRole={handleSetRole} setActiveTab={setActiveTab} />} />

          {/* Protected Student Portal Routes */}
          <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
          <Route 
            path="/student/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard setActiveTab={setActiveTab} initialSection="jobs" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/skills" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard setActiveTab={setActiveTab} initialSection="diagnostic" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/roadmap" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard setActiveTab={setActiveTab} initialSection="roadmap" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/interview" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard setActiveTab={setActiveTab} initialSection="interview" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/resume" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard setActiveTab={setActiveTab} initialSection="resume" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/jobs" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard setActiveTab={setActiveTab} initialSection="jobs" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/profile" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard setActiveTab={setActiveTab} initialSection="portfolio" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/coach" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard setActiveTab={setActiveTab} initialSection="interview" />
              </ProtectedRoute>
            } 
          />

          {/* Protected Recruiter Portal Routes */}
          <Route path="/recruiter" element={<Navigate to="/recruiter/dashboard" replace />} />
          <Route 
            path="/recruiter/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['recruiter', 'admin']} fallback="/student/dashboard">
                <RecruiterDashboard setActiveTab={setActiveTab} />
              </ProtectedRoute>
            } 
          />

          {/* Protected Faculty Portal Routes */}
          <Route path="/faculty" element={<Navigate to="/faculty/dashboard" replace />} />
          <Route 
            path="/faculty/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['faculty', 'admin']} fallback="/student/dashboard">
                <FacultyDashboard setActiveTab={setActiveTab} />
              </ProtectedRoute>
            } 
          />

          {/* Protected Admin Portal Routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']} fallback="/student/dashboard">
                <AdminDashboard setActiveTab={setActiveTab} />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all Wildcard Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAuthPage && (
        <Footer setActiveRole={handleSetRole} setActiveTab={setActiveTab} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
