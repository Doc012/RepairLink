import apiClient from '../../utils/apiClient';

/**
 * User-specific API endpoints that match your actual backend
 */
const userAPI = {
  /**
   * Get user by ID
   * @param {number} userId - User ID
   * @returns {Promise} User data
   */
  getUserById: (userId) => {
    return apiClient.get(`/api/v1/users/${userId}`);
  },
  
  /**
   * Get user by email
   * @param {string} email - User email
   * @returns {Promise} User data
   */
  getUserByEmail: (email) => {
    return apiClient.get(`/api/v1/users/email/${email}`);
  },

  /**
   * Update user profile
   * @param {number} userId - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise} Update response
   */
  updateProfile: (userId, userData) => {
    return apiClient.put(`/api/v1/users/${userId}`, userData);
  },

  /**
   * Change user password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise} Update response
   */
  changePassword: (currentPassword, newPassword) => {
    return apiClient.post('/api/v1/auth/change-password', {
      currentPassword,
      newPassword
    });
  },

  /**
   * Upload profile picture
   * @param {File} file - Image file
   * @returns {Promise} Upload response with URL
   */
  uploadProfilePicture: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/api/v1/users/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  /**
   * Get current user profile
   * @returns {Promise} User profile data
   */
  getCurrentUser: () => {
    return apiClient.get('/api/v1/users/me');
  }
};

export default userAPI;