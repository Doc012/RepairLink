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
   * Get user by ID
   * @param {number} userId - User ID
   * @returns {Promise} User data
   */
  getUserById: (userId) => {
    return apiClient.get(`/v1/users/${userId}`);
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
    return apiClient.put(`/v1/users/${userID}/basic-info`, profileData);
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
  },

  /**
   * Get user basic info
   * @param {number} userId - User ID
   * @returns {Promise} User basic info
   */
  getUserBasicInfo: async (userId) => {
    try {
      const response = await apiClient.get(`/v1/users/${userId}/basic-info`);
      return response;
    } catch (error) {
      console.error('Error fetching user basic info:', error);
      throw error;
    }
  },

  /**
   * Get customer by ID
   * @param {number} customerId - Customer ID
   * @returns {Promise} Customer data
   */
  getCustomerById: async (customerId) => {
    try {
      const response = await apiClient.get(`/v1/customers/${customerId}`);
      return response;
    } catch (error) {
      console.error('Error fetching customer details:', error);
      throw error;
    }
  }
};

export default userAPI;