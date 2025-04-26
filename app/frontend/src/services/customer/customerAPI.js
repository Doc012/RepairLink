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
  //  * Change customer password
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
   * @param {number} customerID - Customer ID
   * @param {Object} filters - Optional filters like status or date
   * @returns {Promise} Bookings list
   */
  getBookings: (customerID, filters = {}) => {
    if (!customerID) {
      console.error('Customer ID is required to fetch bookings');
      throw new Error('Customer ID is required to fetch bookings');
    }
    
    return apiClient.get(`/v1/bookings/customer`, { 
      params: { 
        customerID,
        ...filters 
      } 
    });
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
  createBooking: async (bookingData) => {
    try {
      // Ensure all IDs are numbers
      bookingData = {
        ...bookingData,
        customerID: Number(bookingData.customerID),
        serviceID: Number(bookingData.serviceID),
        providerID: Number(bookingData.providerID)
      };
      
      // Make sure the date format is correct - should be YYYY-MM-DDTHH:MM:SS
      if (bookingData.bookingDate) {
        // Add seconds if they're missing
        if (!bookingData.bookingDate.match(/:\d{2}$/)) {
          bookingData.bookingDate = `${bookingData.bookingDate}:00`;
        }
        
        // Ensure the format matches exactly
        const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
        if (!dateRegex.test(bookingData.bookingDate)) {
          console.error('Invalid date format:', bookingData.bookingDate);
          console.log('Date format should be YYYY-MM-DDTHH:MM:SS');
          throw new Error('Invalid date format');
        }
      }
      
      console.log('Sending booking data:', bookingData);
      
      // Using the correct endpoint without duplicate "api"
      return await apiClient.post('/v1/bookings/customer', bookingData);
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  /**
   * Cancel a booking
   * @param {string} bookingId - Booking ID to cancel
   * @returns {Promise} Cancellation response
   */
  cancelBooking: (bookingId) => {
    // Try PUT instead of POST
    return apiClient.put(`/v1/bookings/${bookingId}/cancel`);
  },

  /**
   * Update booking status
   * @param {string} bookingId - Booking ID to update
   * @param {string} newStatus - New status (PENDING, CONFIRMED, CANCELLED, COMPLETED)
   * @returns {Promise} Response from the API
   */
  updateBookingStatus: (bookingId, newStatus) => {
    // Change from POST to PUT
    return apiClient.put(`/v1/bookings/status/${bookingId}`, { newStatus });
  },

  /**
   * Get customer reviews
   * @param {number} customerID - Customer ID
   * @returns {Promise} Reviews list
   */
  getReviews: (customerID) => {
    if (!customerID) {
      console.error('Customer ID is required to fetch reviews');
      throw new Error('Customer ID is required to fetch reviews');
    }
    
    return apiClient.get(`/v1/reviews/customer/${customerID}`);
  },

  /**
   * Create a review for service
   * @param {Object} reviewData - Review data with rating and comments
   * @returns {Promise} Created review
   */
  createReview: (reviewData) => {
    if (!reviewData.customerID) {
      console.error('Customer ID is required to create a review');
      throw new Error('Customer ID is required to create a review');
    }
    
    if (!reviewData.bookingID) {
      console.error('Booking ID is required to create a review');
      throw new Error('Booking ID is required to create a review');
    }
    
    return apiClient.post('/v1/reviews/customer', reviewData);
  },

  /**
   * Update an existing review
   * @param {string} reviewId - Review ID to update
   * @param {Object} reviewData - Updated review data
   * @returns {Promise} Updated review
   */
  updateReview: (reviewId, reviewData) => {
    // Use the customerID from reviewData instead of hardcoding
    const { customerID } = reviewData;
    
    if (!customerID) {
      console.error('Customer ID is required to update a review');
      throw new Error('Customer ID is required to update a review');
    }
    
    return apiClient.put(`/v1/reviews/customer/${customerID}/${reviewId}`, reviewData);
  },

  /**
   * Delete a review
   * @param {string} reviewId - Review ID to delete
   * @param {number} customerID - Customer ID who owns the review
   * @returns {Promise} Deletion response
   */
  deleteReview: (reviewId, customerID) => {
    if (!customerID) {
      console.error('Customer ID is required to delete a review');
      throw new Error('Customer ID is required to delete a review');
    }
    
    return apiClient.delete(`/v1/reviews/customer/${customerID}/${reviewId}`);
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
  getAvailableTimeSlots: async (serviceId, date) => {
    if (!serviceId) {
      throw new Error('Service ID is required to fetch available time slots');
    }
    
    if (!date) {
      throw new Error('Date is required to fetch available time slots');
    }
    
    // For now keeping the mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        // Create a Date object from the selected date
        const selectedDate = new Date(date);
        const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        // Check if it's a weekend (0 = Sunday, 6 = Saturday)
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          resolve({ data: [] }); // No slots on weekends
          return;
        }
        
        // Generate time slots from 8:00 AM to 5:00 PM with 1-hour intervals
        const slots = [];
        for (let hour = 8; hour < 17; hour++) {
          // Format: "HH:00:00"
          const formattedHour = hour.toString().padStart(2, '0');
          slots.push(`${formattedHour}:00:00`);
        }
        
        // Simulate some slots being unavailable (randomly)
        const unavailableCount = Math.floor(Math.random() * 3); // 0 to 2 unavailable slots
        const availableSlots = [...slots];
        
        for (let i = 0; i < unavailableCount; i++) {
          const randomIndex = Math.floor(Math.random() * availableSlots.length);
          if (randomIndex >= 0 && randomIndex < availableSlots.length) {
            availableSlots.splice(randomIndex, 1);
          }
        }
        
        resolve({ data: availableSlots });
      }, 800); // Simulate network delay
    });
    
    // When ready to use the real API endpoint:
    // return apiClient.get(`/v1/services/${serviceId}/available-slots`, {
    //   params: { date }
    // });
  },

  /**
   * Get reviews by customer ID
   * @param {number} customerID - Customer ID
   * @returns {Promise} Reviews list for the customer
   */
  getCustomerReviews: (customerID) => {
    return apiClient.get(`/v1/reviews/customer/${customerID}`);
  }
};

export default customerAPI;