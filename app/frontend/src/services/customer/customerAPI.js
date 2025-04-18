import apiClient from '../../utils/apiClient';

/**
 * Customer-specific API endpoints
 */
const customerAPI = {
  /**
   * Get customer profile
   * @returns {Promise} Customer profile data
   */
  getProfile: () => {
    return apiClient.get('/customers/profile');
  },

  /**
   * Update customer profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} Update response
   */
  updateProfile: (profileData) => {
    return apiClient.put('/customers/profile', profileData);
  },

  /**
   * Upload customer profile picture
   * @param {File} image - Profile image file
   * @returns {Promise} Upload response with image URL
   */
  uploadProfilePicture: (image) => {
    const formData = new FormData();
    formData.append('file', image);
    
    return apiClient.post('/customers/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  /**
   * Change customer password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise} Password change response
   */
  changePassword: (currentPassword, newPassword) => {
    return apiClient.put('/customers/profile/password', { 
      currentPassword, 
      newPassword 
    });
  },
  
  /**
   * Get customer bookings
   * @param {Object} filters - Optional filters like status or date
   * @returns {Promise} Bookings list
   */
  getBookings: (filters = {}) => {
    return apiClient.get('/customers/bookings', { params: filters });
  },

  /**
   * Get booking details
   * @param {string} bookingId - Booking ID
   * @returns {Promise} Booking details
   */
  getBookingDetails: (bookingId) => {
    return apiClient.get(`/customers/bookings/${bookingId}`);
  },

  /**
   * Create a new booking
   * @param {Object} bookingData - Booking information
   * @returns {Promise} Created booking
   */
  createBooking: (bookingData) => {
    return apiClient.post('/customers/bookings', bookingData);
  },

  /**
   * Cancel a booking
   * @param {string} bookingId - Booking ID to cancel
   * @returns {Promise} Cancellation response
   */
  cancelBooking: (bookingId) => {
    return apiClient.post(`/customers/bookings/${bookingId}/cancel`);
  },

  /**
   * Get customer reviews
   * @returns {Promise} Reviews list
   */
  getReviews: () => {
    return apiClient.get('/customers/reviews');
  },

  /**
   * Create a review for service
   * @param {Object} reviewData - Review data with rating and comments
   * @returns {Promise} Created review
   */
  createReview: (reviewData) => {
    return apiClient.post('/customers/reviews', reviewData);
  },

  /**
   * Update an existing review
   * @param {string} reviewId - Review ID to update
   * @param {Object} reviewData - Updated review data
   * @returns {Promise} Updated review
   */
  updateReview: (reviewId, reviewData) => {
    return apiClient.put(`/customers/reviews/${reviewId}`, reviewData);
  },

  /**
   * Delete a review
   * @param {string} reviewId - Review ID to delete
   * @returns {Promise} Deletion response
   */
  deleteReview: (reviewId) => {
    return apiClient.delete(`/customers/reviews/${reviewId}`);
  },

  /**
   * Get all available services with optional filters
   * @param {Object} filters - Optional filters like category or search
   * @returns {Promise} Services list
   */
  getServices: (filters = {}) => {
    // Change from '/services' to '/v1/services'
    return apiClient.get('/v1/services', { params: filters });
  },

  /**
   * Get available time slots for a service on a specific date
   * @param {string} serviceId - Service ID
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise} Available time slots
   */
  getAvailableTimeSlots: (serviceId, date) => {
    return apiClient.get(`/services/${serviceId}/available-slots`, {
      params: { date }
    });
  }
};

export default customerAPI;