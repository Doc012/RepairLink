import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Use a ref to track if an auth check is in progress
  const isCheckingAuth = useRef(false);
  // Use a ref to track last check time
  const lastCheckTime = useRef(0);

  // Throttled auth status check - doesn't run more than once every 5 seconds
  const checkAuthStatus = useCallback(async () => {
    // Prevent concurrent auth checks
    if (isCheckingAuth.current) return false;
    
    // Don't check too frequently (throttle to once every 5 seconds)
    const now = Date.now();
    if (now - lastCheckTime.current < 5000) {
      return !!user; // Return current auth state if checked recently
    }
    
    isCheckingAuth.current = true;
    lastCheckTime.current = now;
    
    try {
      const response = await axios.get('http://localhost:8080/api/auth/me', {
        withCredentials: true
      });
      
      setUser({
        email: response.data.email,
        roles: response.data.roles.map(role => ({ authority: role }))
      });
      
      return true;
    } catch (error) {
      // Only clear user if we get an auth error, not on network errors
      if (error.response?.status === 401 || error.response?.status === 403) {
        setUser(null);
      }
      return false;
    } finally {
      setLoading(false);
      isCheckingAuth.current = false;
    }
  }, [user]);

  // Initial auth check on mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (email, password) => {
    try {
      console.log('Attempting login for:', email);
      
      const response = await axios.post(
        'http://localhost:8080/api/auth/login',
        { email, password },
        { withCredentials: true }
      );
      
      console.log('Login response:', response.data);
      
      // After successful login, check auth status to update context
      await checkAuthStatus();
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Login failed:', error.response?.status, error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      isCheckingAuth.current = true;
      
      // Call the logout API endpoint
      const response = await axios.post('http://localhost:8080/api/auth/logout', {}, {
        withCredentials: true // Important: Ensures cookies are sent with the request
      });
      
      // Clear the user data
      setUser(null);
      
      console.log('Logout successful:', response.data);
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      
      // Even if the API call fails, clear the user data for client-side logout
      setUser(null);
      
      throw error;
    } finally {
      isCheckingAuth.current = false;
    }
  };

  // Registration function
  const register = async (userData) => {
    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/register',
        userData
      );
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Registration failed'
      };
    }
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    if (!user || !user.roles) return false;
    return user.roles.some(r => r.authority === role);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      register,  // Add the register function
      checkAuthStatus,
      hasRole,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;