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
   * Update user's basic information
   * @param {string} userId - User ID
   * @param {Object} basicInfo - Basic info (name, surname, phone, etc.)
   * @returns {Promise} Updated user
   */
  updateUserBasicInfo: (userId, basicInfo) => {
    return apiClient.put(`/api/v1/users/${userId}/basic-info`, basicInfo);
  },

  /**
   * Upload user avatar
   * @param {string} userId - User ID
   * @param {FormData} formData - Form data containing avatar file
   * @returns {Promise} Avatar upload response
   */
  uploadUserAvatar: (userId, formData) => {
    return apiClient.post(`/api/v1/users/${userId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
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
   * Get all service providers with admin-specific data
   * @param {Object} filters - Optional filters (verified, search, page, etc.)
   * @returns {Promise} Service providers list with admin data
   */
  getServiceProviders: (filters = {}) => {
    return apiClient.get('/v1/service-providers', { params: filters });
  },

  /**
   * Verify or unverify a service provider
   * @param {string|number} providerId - Provider ID
   * @param {boolean} verified - Verification status to set
   * @returns {Promise} Updated provider
   */
  verifyServiceProvider: (providerId, verified = true) => {
    return apiClient.put(`/v1/service-providers/verify/${providerId}?verified=${verified}`);
  },

  /**
   * Change a service provider's status
   * @param {string|number} providerId - Provider ID
   * @param {string} status - New status (active, pending, inactive)
   * @returns {Promise} Updated provider
   */
  updateProviderStatus: (providerId, status) => {
    return apiClient.put(`/v1/service-providers/admin/${providerId}/status`, { status });
  },

  /**
   * Create a new service
   * @param {Object} serviceData - Service data to create
   * @returns {Promise} Created service
   */
  createService: (serviceData) => {
    return apiClient.post('/v1/services/create', serviceData);
  },

  /**
   * Update an existing service
   * @param {string|number} serviceId - Service ID
   * @param {Object} serviceData - Updated service data
   * @returns {Promise} Updated service
   */
  updateService: (serviceId, serviceData) => {
    return apiClient.put(`/v1/services/update/${serviceId}`, serviceData);
  },

  /**
   * Get all services with optional filters
   * @param {Object} params - Optional filters (search, category, status, page, size)
   * @returns {Promise} List of services
   */
  getServices: (params = {}) => {
    return apiClient.get('/v1/services', { params });
  },

  /**
   * Get service by ID
   * @param {string|number} serviceId - Service ID
   * @returns {Promise} Service details
   */
  getServiceById: (serviceId) => {
    return apiClient.get(`/v1/services/${serviceId}`);
  },

  /**
   * Get services by provider ID
   * @param {string|number} providerId - Provider ID
   * @param {Object} params - Optional filters (search, category, status, page, size)
   * @returns {Promise} List of services for the provider
   */
  getServicesByProvider: (providerId, params = {}) => {
    return apiClient.get(`/v1/services/provider/${providerId}`, { params });
  },

  /**
   * Delete a service
   * @param {string|number} serviceId - Service ID to delete
   * @returns {Promise} Deletion result
   */
  deleteService: (serviceId) => {
    return apiClient.delete(`/v1/services/delete/${serviceId}`);
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