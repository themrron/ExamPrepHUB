import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// For routes requiring authentication
export function AuthenticatedRoute() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
}

// For routes requiring admin role
export function AdminRoute() {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return userRole === 'admin' ? <Outlet /> : <Navigate to="/" replace />; // Redirect non-admins
}
