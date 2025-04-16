import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/auth/AuthContext';

const ProtectedRoute = ({ requiredRole }) => {
  const { user, loading, checkAuthStatus } = useAuth();
  const [checking, setChecking] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Only check auth status once per route navigation
    if (!authChecked) {
      const verifyAuth = async () => {
        try {
          await checkAuthStatus();
        } finally {
          setChecking(false);
          setAuthChecked(true);
        }
      };
      
      verifyAuth();
    }
  }, [authChecked, checkAuthStatus, location.pathname]); // Include location.pathname to re-check when route changes

  // Show loading indicator while checking auth status
  if (loading || checking) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  // If user isn't authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific role is required, check if the user has it
  if (requiredRole) {
    const hasRequiredRole = user.roles.some(role => 
      typeof role === 'string' ? role === requiredRole : role.authority === requiredRole
    );
    
    if (!hasRequiredRole) {
      // Redirect based on their actual role
      if (user.roles.some(role => 
          typeof role === 'string' ? role === 'ROLE_CUSTOMER' : role.authority === 'ROLE_CUSTOMER')) {
        return <Navigate to="/dashboard" replace />;
      } else if (user.roles.some(role => 
          typeof role === 'string' ? role === 'ROLE_VENDOR' : role.authority === 'ROLE_VENDOR')) {
        return <Navigate to="/dashboard" replace />;
      } else {
        return <Navigate to="/" replace />;
      }
    }
  }

  // If all checks pass, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;