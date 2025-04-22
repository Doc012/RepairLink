/**
 * Authentication utility functions
 */

/**
 * Get the current user details from localStorage or sessionStorage
 * @returns {Object|null} The user details or null if not logged in
 */
export const getUserDetails = () => {
  try {
    // Try different storage methods
    let user = null;
    
    // Check localStorage first
    const userFromLocal = localStorage.getItem('user');
    if (userFromLocal) {
      user = JSON.parse(userFromLocal);
    }
    
    // If not in localStorage, try sessionStorage
    if (!user) {
      const userFromSession = sessionStorage.getItem('user');
      if (userFromSession) {
        user = JSON.parse(userFromSession);
      }
    }
    
    // As a fallback for development, provide a test user
    if (!user && (process.env.NODE_ENV === 'development' || process.env.REACT_APP_ENV === 'development')) {
      // You can enable this by setting localStorage.setItem('use_test_user', 'true') in browser console
      if (localStorage.getItem('use_test_user') === 'true') {
        console.warn('Using test user for development');
        return {
          id: 1,
          customerID: 1,
          name: 'Test User',
          email: 'test@example.com',
          role: 'CUSTOMER'
        };
      }
    }
    
    return user;
  } catch (error) {
    console.error('Error getting user details:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const user = getUserDetails();
  return !!(token && user);
};

/**
 * Get the authentication token
 * @returns {string|null} The token or null if not logged in
 */
export const getToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

/**
 * Check if user has a specific role
 * @param {string} role - Role to check for
 * @returns {boolean} True if user has the specified role
 */
export const hasRole = (role) => {
  const user = getUserDetails();
  if (!user || !user.roles) return false;
  
  // Handle both array of strings and array of objects with authority property
  return user.roles.some(r => 
    (typeof r === 'string' && r === role) || 
    (r.authority && r.authority === role)
  );
};

/**
 * Get customer ID from user details
 * @returns {number|null} Customer ID or null if not available
 */
export const getCustomerId = () => {
  const user = getUserDetails();
  if (!user) return null;
  
  // Different possible locations for customer ID based on your auth structure
  return user.customerID || user.customerId || user.id || null;
};

/**
 * Get user ID from user details
 * @returns {number|null} User ID or null if not available
 */
export const getUserId = () => {
  const user = getUserDetails();
  return user?.id || user?.userID || user?.userId || null;
};