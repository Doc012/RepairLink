import apiClient from '../../utils/apiClient';

/**
 * Authentication API endpoints
 */
const authAPI = {
  /**
   * Login with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} Login response with user data
   */
  login: (email, password) => {
    return apiClient.post('/auth/login', { email, password });
  },

  /**
   * Get current authenticated user data
   * @returns {Promise} User data
   */
  getCurrentUser: () => {
    return apiClient.get('/auth/me');
  },

  /**
   * Logout the current user
   * @returns {Promise} Logout response
   */
  logout: () => {
    return apiClient.post('/auth/logout', {});
  },

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} Registration response
   */
  register: (userData) => {
    return apiClient.post('/auth/register', userData);
  },
  
  /**
   * Refresh authentication token
   * @returns {Promise} Refresh response
   */
  refreshToken: () => {
    return apiClient.post('/auth/refresh-token', {});
  },

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise} Response with reset instructions
   */
  requestPasswordReset: (email) => {
    return apiClient.post('/auth/forgot-password', { email });
  },

  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} password - New password
   * @returns {Promise} Reset response
   */
  resetPassword: (token, password) => {
    return apiClient.post(`/auth/reset-password/${token}`, { password });
  },

  /**
   * Verify email with token
   * @param {string} token - Verification token
   * @returns {Promise} Verification response
   */
  verifyEmail: (token) => {
    return apiClient.post(`/auth/verify-email/${token}`);
  }
};

export default authAPI;