import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize session from localStorage on app mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = authService.getAccessToken();
        const storedUser = authService.getCurrentUser();

        if (token && storedUser) {
          setUser(storedUser);
          setRole(storedUser.profile?.role || null);
          setIsAuthenticated(true);

          // Synchronize fresh profile data from backend
          const freshUser = await authService.fetchMe();
          if (freshUser) {
            setUser(freshUser);
            setRole(freshUser.profile?.role || null);
          }
        }
      } catch (err) {
        console.warn('Auth initialization check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Send OTP
  const sendOTP = async (email, purpose = 'login') => {
    return await authService.sendOTP(email, purpose);
  };

  // Verify OTP
  const verifyOTP = async (email, otp, purpose = 'login') => {
    const data = await authService.verifyOTP(email, otp, purpose);
    if (purpose === 'login' && data.user) {
      setUser(data.user);
      setRole(data.user.profile?.role || data.role || null);
      setIsAuthenticated(true);
    }
    return data;
  };

  // Register User
  const register = async (userData) => {
    const data = await authService.register(userData);
    if (data.user) {
      setUser(data.user);
      setRole(data.user.profile?.role || data.role || null);
      setIsAuthenticated(true);
    }
    return data;
  };

  // Set / Update Role
  const selectRole = async (selectedRole, extraData = {}) => {
    const data = await authService.updateRole({ role: selectedRole, ...extraData });
    if (data.user) {
      setUser(data.user);
      setRole(selectedRole);
    }
    return data;
  };

  // Logout
  const logout = async () => {
    await authService.logout();
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    role,
    isAuthenticated,
    loading,
    sendOTP,
    verifyOTP,
    register,
    selectRole,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
