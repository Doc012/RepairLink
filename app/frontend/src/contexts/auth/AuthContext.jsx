import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';
import apiClient from '../../utils/apiClient';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Use a ref to track if an auth check is in progress
  const isCheckingAuth = useRef(false);
  // Use a ref to track last check time
  const lastCheckTime = useRef(0);

  // Store user data in localStorage for persistence
  const storeUserData = (userData) => {
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('user');
    }
  };

  // Load user from localStorage on initial mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    }
  }, []);

  // Throttled auth status check with token refresh capability
  const checkAuthStatus = useCallback(async (skipLoading = false) => {
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
      const response = await apiClient.get('/auth/me');
      
      const userData = {
        email: response.data.email,
        name: response.data.name,
        surname: response.data.surname,
        phoneNumber: response.data.phoneNumber,
        roles: response.data.roles.map(role => ({ authority: role }))
      };
      
      setUser(userData);
      storeUserData(userData);
      return true;
    } catch (error) {
      // If a 401 error occurs, the token refresh will be handled by apiClient
      // If we still get here, it means the refresh also failed
      if (error.response?.status === 401 || error.response?.status === 403) {
        setUser(null);
        storeUserData(null);
      }
      return false;
    } finally {
      if (!skipLoading) {
        setLoading(false);
      }
      isCheckingAuth.current = false;
    }
  }, [user]);

  // Initial auth check on mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Periodic auth check to keep the session alive
  useEffect(() => {
    let interval;
    if (user) {
      interval = setInterval(() => {
        checkAuthStatus(true);
      }, 4 * 60 * 1000); // Check every 4 minutes
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [user, checkAuthStatus]);

  const login = async (email, password) => {
    try {
      console.log('Attempting login for:', email);
      
      const response = await apiClient.post('/auth/login', { email, password });
      
      console.log('Login response:', response.data);
      
      // Store user data directly from the login response
      const userData = {
        email: response.data.email,
        name: response.data.name,
        surname: response.data.surname,
        phoneNumber: response.data.phoneNumber,
        roles: response.data.roles || []
      };
      
      setUser(userData);
      storeUserData(userData);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Login failed:', error.response?.status, error.response?.data);
      
      // Extract a user-friendly error message
      let errorMessage;
      
      if (error.response) {
        if (error.response.status === 401) {
          // Specific message for authentication failure
          errorMessage = 'Invalid email or password. Please try again.';
        } else if (error.response.status === 403) {
          errorMessage = 'Account is locked or does not have sufficient permissions.';
        } else if (error.response.status === 404) {
          errorMessage = 'User account not found. Please create an account';
        } else {
          errorMessage = error.response.data?.message || error.response.data || 'An error occurred during login';
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your internet connection.';
      } else {
        errorMessage = 'Unable to send login request. Please try again later.';
      }
      
      // Prevent unnecessary token refresh attempt for auth failures
      if (error.response?.status === 401) {
        // Clear any existing refresh token to prevent additional failed attempts
        localStorage.removeItem('refreshToken');
      }
      
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      isCheckingAuth.current = true;
      
      // Call the logout API endpoint
      const response = await apiClient.post('/auth/logout', {});
      
      // Clear the user data
      setUser(null);
      storeUserData(null);
      
      console.log('Logout successful:', response.data);
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      
      // Even if the API call fails, clear the user data for client-side logout
      setUser(null);
      storeUserData(null);
      
      throw error;
    } finally {
      isCheckingAuth.current = false;
    }
  };

  // Registration function
  const register = async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      
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

  // Function to get current user, with refresh if needed
  const getCurrentUser = async () => {
    if (user) return user;
    
    // Try to refresh auth status
    const isAuthenticated = await checkAuthStatus();
    if (isAuthenticated) {
      return user;
    }
    
    return null;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      register,
      checkAuthStatus,
      hasRole,
      getCurrentUser,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;