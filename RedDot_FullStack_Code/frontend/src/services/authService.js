import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001/api'}/auth`;

// Create Axios Instance with Interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT access token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('reddot_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 1. Send OTP
export const sendOTP = async (email, purpose = 'login') => {
  try {
    const response = await api.post('/send-otp/', { email, purpose });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error || error.response?.data?.message || 'Failed to send OTP.';
    throw new Error(message);
  }
};

// 2. Verify OTP
export const verifyOTP = async (email, otp, purpose = 'login') => {
  try {
    const response = await api.post('/verify-otp/', { email, otp, purpose });
    const data = response.data;

    // If login was successful, store session in localStorage
    if (purpose === 'login' && data.token) {
      localStorage.setItem('access_token', data.token);
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    }

    return data;
  } catch (error) {
    const message = error.response?.data?.error || error.response?.data?.message || 'Invalid or expired OTP.';
    throw new Error(message);
  }
};

// 3. Register User
export const register = async (userData) => {
  try {
    const response = await api.post('/register/', userData);
    const data = response.data;

    if (data.token) {
      localStorage.setItem('access_token', data.token);
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    }

    return data;
  } catch (error) {
    const message = error.response?.data?.error || error.response?.data?.message || 'Registration failed.';
    throw new Error(message);
  }
};

// 4. Reset Password
export const resetPassword = async (email, newPassword) => {
  try {
    const response = await api.post('/reset-password/', {
      email,
      new_password: newPassword,
      confirm_password: newPassword,
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error || error.response?.data?.message || 'Password reset failed.';
    throw new Error(message);
  }
};

// 5. Update / Select Role
export const updateRole = async (roleData) => {
  try {
    const response = await api.post('/role/', roleData);
    const data = response.data;
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  } catch (error) {
    const message = error.response?.data?.error || 'Failed to update role.';
    throw new Error(message);
  }
};

// 6. Logout
export const logout = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      await api.post('/logout/', { refresh_token: refreshToken });
    }
  } catch (err) {
    console.warn('Logout notification error (clearing local session):', err);
  } finally {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }
};

// 7. Get Current User from localStorage or API
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user') || localStorage.getItem('reddot_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    return null;
  }
};

export const isAuthenticated = () => {
  return !!(localStorage.getItem('access_token') || localStorage.getItem('reddot_token'));
};

export const getAccessToken = () => {
  return localStorage.getItem('access_token') || localStorage.getItem('reddot_token');
};

// 8. Fetch Profile from /me/
export const fetchMe = async () => {
  try {
    const response = await api.get('/me/');
    if (response.data?.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data.user;
    }
    return null;
  } catch {
    return null;
  }
};

// 9. Session Helpers
export const isLoggedIn = () => {
  return !!getAccessToken();
};

export default {
  sendOTP,
  verifyOTP,
  register,
  resetPassword,
  updateRole,
  logout,
  getCurrentUser,
  fetchMe,
  isLoggedIn,
  getAccessToken,
};
