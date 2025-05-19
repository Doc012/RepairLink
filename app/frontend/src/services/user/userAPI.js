import apiClient from '../../utils/apiClient';

/**
 * Consolidated user-specific API endpoints that match your backend
 */
const userAPI = {
  /**
   * Get user by ID
   * @param {number} userId - User ID
   * @returns {Promise} User data
   */
  getUserById: (userId) => {
    return apiClient.get(`/v1/users/${userId}`);
  },
  
  /**
   * Get user by email
   * @param {string} email - User email
   * @returns {Promise} User data
   */
  getUserByEmail: (email) => {
    return apiClient.get(`/v1/users/by-email/${email}`);
  },

  /**
   * Update user profile (complete profile update)
   * @param {number} userId - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise} Update response
   */
  updateProfile: (userId, userData) => {
    return apiClient.put(`/v1/users/${userId}`, userData);
  },

  /**
   * Update user's basic information (name, surname, phone)
   * @param {number} userId - User ID
   * @param {Object} basicInfo - Basic info containing name, surname, phoneNumber
   * @returns {Promise} Update response
   */
  updateBasicInfo: (userId, basicInfo) => {
    // Transform the field name if necessary
    const payload = {
      ...basicInfo,
      // Map 'phone' to 'phoneNumber' if that's what your API expects
      phoneNumber: basicInfo.phone || basicInfo.phoneNumber
    };
    
    // Remove the 'phone' property if we've added phoneNumber
    if (payload.phone && payload.phoneNumber) {
      delete payload.phone;
    }
    
    return apiClient.put(`/v1/users/${userId}/basic-info`, payload);
  },

  /**
   * Get user's basic information
   * @param {number} userId - User ID
   * @returns {Promise} User basic info
   */
  getUserBasicInfo: (userId) => {
    return apiClient.get(`/v1/users/${userId}/basic-info`);
  },

  /**
   * Change user password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise} Update response
   */
  changePassword: (currentPassword, newPassword) => {
    return apiClient.post('/auth/change-password', {
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
    return apiClient.post('/v1/users/profile-picture', formData, {
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
    return apiClient.get('/v1/users/me');
  },

  /**
   * Get customer by ID
   * @param {number} customerId - Customer ID
   * @returns {Promise} Customer data
   */
  getCustomerById: (customerId) => {
    return apiClient.get(`/v1/customers/${customerId}`);
  }
};

export default userAPI;