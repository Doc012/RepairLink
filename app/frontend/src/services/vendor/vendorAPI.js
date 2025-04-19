import apiClient from '../../utils/apiClient';

/**
 * Vendor-specific API endpoints
 */
const vendorAPI = {
  /**
   * Get vendor profile
   * @returns {Promise} Vendor profile data
   */
  getProfile: () => {
    return apiClient.get('/vendors/profile');
  },

  /**
   * Update vendor profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} Update response
   */
  updateProfile: (profileData) => {
    return apiClient.put('/vendors/profile', profileData);
  },

  /**
   * Get vendor services
   * @returns {Promise} Services list
   */
  getServices: () => {
    return apiClient.get('/vendors/services');
  },

  /**
   * Get service details
   * @param {string} serviceId - Service ID
   * @returns {Promise} Service details
   */
  getServiceDetails: (serviceId) => {
    return apiClient.get(`/vendors/services/${serviceId}`);
  },

  /**
   * Create a new service
   * @param {Object} serviceData - Service information
   * @returns {Promise} Created service
   */
  createService: (serviceData) => {
    return apiClient.post('/vendors/services', serviceData);
  },

  /**
   * Update a service
   * @param {string} serviceId - Service ID to update
   * @param {Object} serviceData - Updated service data
   * @returns {Promise} Updated service
   */
  updateService: (serviceId, serviceData) => {
    return apiClient.put(`/vendors/services/${serviceId}`, serviceData);
  },

  /**
   * Delete a service
   * @param {string} serviceId - Service ID to delete
   * @returns {Promise} Deletion response
   */
  deleteService: (serviceId) => {
    return apiClient.delete(`/vendors/services/${serviceId}`);
  },

  /**
   * Get vendor bookings
   * @param {Object} filters - Optional filters like status or date
   * @returns {Promise} Bookings list
   */
  getBookings: (filters = {}) => {
    return apiClient.get('/vendors/bookings', { params: filters });
  },

  /**
   * Update booking status
   * @param {string} bookingId - Booking ID
   * @param {string} status - New status (e.g., 'CONFIRMED', 'COMPLETED', 'CANCELLED')
   * @returns {Promise} Updated booking
   */
  updateBookingStatus: (bookingId, status) => {
    return apiClient.put(`/vendors/bookings/${bookingId}/status`, { status });
  },

  /**
   * Get vendor reviews
   * @returns {Promise} Reviews list
   */
  getReviews: () => {
    return apiClient.get('/vendors/reviews');
  },

  /**
   * Respond to a review
   * @param {string} reviewId - Review ID to respond to
   * @param {string} response - Vendor's response text
   * @returns {Promise} Updated review with response
   */
  respondToReview: (reviewId, response) => {
    return apiClient.post(`/vendors/reviews/${reviewId}/respond`, { response });
  }
};

export default vendorAPI;