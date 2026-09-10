import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './context/AuthContext';
import { getCurrentUserApi } from './services/api';

export default function App() {
  const [activeRole, setActiveRole] = useState(() => {
    const path = window.location.pathname;
    if (path === '/login') return 'login';
    if (path === '/register') return 'register';
    if (path.startsWith('/student')) return 'student';
    if (path.startsWith('/faculty')) return 'faculty';
    if (path.startsWith('/recruiter')) return 'recruiter';
    if (path.startsWith('/admin')) return 'admin';
    return 'landing';
  });

  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeRole, activeTab]);

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-white font-['Inter',sans-serif]">
        {activeRole !== 'login' && activeRole !== 'register' && (
          <Navbar 
            activeRole={activeRole} 
            setActiveRole={setActiveRole} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
        )}

        <main className="flex-1">
          {activeRole === 'landing' && <LandingPage setActiveRole={setActiveRole} setActiveTab={setActiveTab} />}
          {activeRole === 'about' && <AboutPage setActiveRole={setActiveRole} setActiveTab={setActiveTab} />}
          {activeRole === 'login' && <LoginPage setActiveRole={setActiveRole} setActiveTab={setActiveTab} />}
          {activeRole === 'register' && <RegisterPage setActiveRole={setActiveRole} setActiveTab={setActiveTab} />}
          {activeRole === 'student' && <StudentDashboard setActiveTab={setActiveTab} />}
          {activeRole === 'faculty' && <FacultyDashboard setActiveTab={setActiveTab} />}
          {activeRole === 'recruiter' && <RecruiterDashboard setActiveTab={setActiveTab} />}
          {activeRole === 'admin' && <AdminDashboard setActiveTab={setActiveTab} />}
        </main>

        {activeRole !== 'login' && activeRole !== 'register' && (
          <Footer setActiveRole={setActiveRole} setActiveTab={setActiveTab} />
        )}
      </div>
    </AuthProvider>
  );
}
