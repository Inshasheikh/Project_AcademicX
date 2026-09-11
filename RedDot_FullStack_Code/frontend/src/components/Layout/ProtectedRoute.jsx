import React from 'react';

/**
 * ProtectedRoute Component
 * Note: Role-based strict blocking is currently relaxed per user instruction
 * to allow freely designing, testing, and previewing all dashboards
 * (Student, Faculty, Recruiter, Admin).
 */
export default function ProtectedRoute({ children, allowedRoles = [], fallback = '/student/dashboard' }) {
  // Allow seamless access to all dashboards during active UI/UX design phase
  return children;
}
