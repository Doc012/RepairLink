import apiClient from '../../utils/apiClient';

/**
 * User profile API endpoints (common to all user types)
 */
const userAPI = {
  /**
   * Get user profile
   * @returns {Promise} User profile data
   */
  getProfile: () => {
    return apiClient.get('/users/profile');
  },

  /**
   * Update user profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} Update response
   */
  updateProfile: (profileData) => {
    return apiClient.put('/users/profile', profileData);
  },

  /**
   * Change password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise} Password change response
   */
  changePassword: (currentPassword, newPassword) => {
    return apiClient.put('/users/change-password', { 
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