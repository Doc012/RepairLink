import apiClient from '../../utils/apiClient';

/**
 * Admin-specific API endpoints
 */
const adminAPI = {
  /**
   * Get all users
   * @param {Object} filters - Optional filters
   * @returns {Promise} Users list
   */
  getUsers: (filters = {}) => {
    return apiClient.get('/admin/users', { params: filters });
  },

  /**
   * Get user details
   * @param {string} userId - User ID
   * @returns {Promise} User details
   */
  getUserDetails: (userId) => {
    return apiClient.get(`/admin/users/${userId}`);
  },

  /**
   * Update user
   * @param {string} userId - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise} Updated user
   */
  updateUser: (userId, userData) => {
    return apiClient.put(`/admin/users/${userId}`, userData);
  },

  /**
   * Delete user
   * @param {string} userId - User ID
   * @returns {Promise} Deletion response
   */
  deleteUser: (userId) => {
    return apiClient.delete(`/admin/users/${userId}`);
  },

  /**
   * Get all vendors
   * @param {Object} filters - Optional filters
   * @returns {Promise} Vendors list
   */
  getVendors: (filters = {}) => {
    return apiClient.get('/admin/vendors', { params: filters });
  },

  /**
   * Update vendor status
   * @param {string} vendorId - Vendor ID
   * @param {string} status - New status
   * @returns {Promise} Updated vendor
   */
  updateVendorStatus: (vendorId, status) => {
    return apiClient.put(`/admin/vendors/${vendorId}/status`, { status });
  },

  /**
   * Get dashboard statistics
   * @returns {Promise} Dashboard stats
   */
  getDashboardStats: () => {
    return apiClient.get('/admin/dashboard/stats');
  },
  
  /**
   * Get system settings
   * @returns {Promise} System settings
   */
  getSettings: () => {
    return apiClient.get('/admin/settings');
  },
  
  /**
   * Update system settings
   * @param {Object} settings - Updated settings
   * @returns {Promise} Updated settings
   */
  updateSettings: (settings) => {
    return apiClient.put('/admin/settings', settings);
  }
};

export default adminAPI;