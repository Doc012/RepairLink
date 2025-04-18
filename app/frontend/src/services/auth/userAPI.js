import apiClient from '../../utils/apiClient';

/**
 * User profile API endpoints (common to all user types)
 */
const userAPI = {
  /**
   * Get user by email
   * @param {string} email - User email
   * @returns {Promise} User data
   */
  getUserByEmail: (email) => {
    return apiClient.get(`/v1/users/by-email/${email}`);
  },

  /**
   * Get user profile
   * @returns {Promise} User profile data
   */
  getProfile: () => {
    return apiClient.get('/users/profile');
  },

  /**
   * Update user profile
   * @param {number} userID - User ID
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} Update response
   */
  updateProfile: (userID, profileData) => {
    return apiClient.put(`/v1/users/user/${userID}/basic-info`, profileData);
  },

  /**
   * Change password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise} Password change response
   */
  changePassword: (currentPassword, newPassword) => {
    return apiClient.post('/auth/change-password', { 
      currentPassword, 
      newPassword 
    });
  },

  /**
   * Upload profile picture
   * @param {File} image - Profile image file
   * @returns {Promise} Upload response with image URL
   */
  uploadProfilePicture: (image) => {
    const formData = new FormData();
    formData.append('file', image);
    
    return apiClient.post('/users/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export default userAPI;