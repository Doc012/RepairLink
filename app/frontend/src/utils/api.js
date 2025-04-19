// import axios from 'axios';

// // Create base API instance with common configuration
// const API = axios.create({
//   baseURL: 'http://localhost:8080/api',
//   withCredentials: true // This is crucial for cookies to be handled properly
// });

// // Add a response interceptor to handle token refresh
// API.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
    
//     // If the error is 401 and we haven't already tried to refresh the token
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
      
//       try {
//         // Try to refresh the token
//         await API.post('/auth/refresh-token');
        
//         // Retry the original request
//         return API(originalRequest);
//       } catch (refreshError) {
//         // If refresh fails, redirect to login
//         window.location.href = '/login';
//         return Promise.reject(refreshError);
//       }
//     }
    
//     return Promise.reject(error);
//   }
// );

// // Authentication APIs
// export const authAPI = {
//   /**
//    * Login with email and password
//    * @param {string} email - User email
//    * @param {string} password - User password
//    * @returns {Promise} Login response with user data
//    */
//   login: (email, password) => {
//     return API.post('/auth/login', { email, password });
//   },

//   /**
//    * Get current authenticated user data
//    * @returns {Promise} User data
//    */
//   getCurrentUser: () => {
//     return API.get('/auth/me');
//   },

//   /**
//    * Logout the current user
//    * @returns {Promise} Logout response
//    */
//   logout: () => {
//     return API.post('/auth/logout', {});
//   },

//   /**
//    * Register a new user
//    * @param {Object} userData - User registration data
//    * @returns {Promise} Registration response
//    */
//   register: (userData) => {
//     return API.post('/auth/register', userData);
//   },

//   /**
//    * Request password reset
//    * @param {string} email - User email
//    * @returns {Promise} Response with reset instructions
//    */
//   requestPasswordReset: (email) => {
//     return API.post('/auth/forgot-password', { email });
//   },

//   /**
//    * Reset password with token
//    * @param {string} token - Reset token
//    * @param {string} password - New password
//    * @returns {Promise} Reset response
//    */
//   resetPassword: (token, password) => {
//     return API.post(`/auth/reset-password/${token}`, { password });
//   },

//   /**
//    * Verify email with token
//    * @param {string} token - Verification token
//    * @returns {Promise} Verification response
//    */
//   verifyEmail: (token) => {
//     return API.post(`/auth/verify-email/${token}`);
//   }
// };

// // User Profile APIs
// export const userAPI = {
//   /**
//    * Get user profile
//    * @returns {Promise} User profile data
//    */
//   getProfile: () => {
//     return API.get('/users/profile');
//   },

//   /**
//    * Update user profile
//    * @param {Object} profileData - Updated profile data
//    * @returns {Promise} Update response
//    */
//   updateProfile: (profileData) => {
//     return API.put('/users/profile', profileData);
//   },

//   /**
//    * Change password
//    * @param {string} currentPassword - Current password
//    * @param {string} newPassword - New password
//    * @returns {Promise} Password change response
//    */
//   changePassword: (currentPassword, newPassword) => {
//     return API.put('/users/change-password', { 
//       currentPassword, 
//       newPassword 
//     });
//   },

//   /**
//    * Upload profile picture
//    * @param {File} image - Profile image file
//    * @returns {Promise} Upload response with image URL
//    */
//   uploadProfilePicture: (image) => {
//     const formData = new FormData();
//     formData.append('file', image);
    
//     return API.post('/users/profile-picture', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     });
//   }
// };

// // Customer APIs
// export const customerAPI = {
//   /**
//    * Get customer bookings
//    * @param {Object} filters - Optional filters like status or date
//    * @returns {Promise} Bookings list
//    */
//   getBookings: (filters = {}) => {
//     return API.get('/customers/bookings', { params: filters });
//   },

//   /**
//    * Get booking details
//    * @param {string} bookingId - Booking ID
//    * @returns {Promise} Booking details
//    */
//   getBookingDetails: (bookingId) => {
//     return API.get(`/customers/bookings/${bookingId}`);
//   },

//   /**
//    * Create a new booking
//    * @param {Object} bookingData - Booking information
//    * @returns {Promise} Created booking
//    */
//   createBooking: (bookingData) => {
//     return API.post('/customers/bookings', bookingData);
//   },

//   /**
//    * Cancel a booking
//    * @param {string} bookingId - Booking ID to cancel
//    * @returns {Promise} Cancellation response
//    */
//   cancelBooking: (bookingId) => {
//     return API.post(`/customers/bookings/${bookingId}/cancel`);
//   },

//   /**
//    * Get customer reviews
//    * @returns {Promise} Reviews list
//    */
//   getReviews: () => {
//     return API.get('/customers/reviews');
//   },

//   /**
//    * Create a review for service
//    * @param {Object} reviewData - Review data with rating and comments
//    * @returns {Promise} Created review
//    */
//   createReview: (reviewData) => {
//     return API.post('/customers/reviews', reviewData);
//   },

//   /**
//    * Update an existing review
//    * @param {string} reviewId - Review ID to update
//    * @param {Object} reviewData - Updated review data
//    * @returns {Promise} Updated review
//    */
//   updateReview: (reviewId, reviewData) => {
//     return API.put(`/customers/reviews/${reviewId}`, reviewData);
//   },

//   /**
//    * Delete a review
//    * @param {string} reviewId - Review ID to delete
//    * @returns {Promise} Deletion response
//    */
//   deleteReview: (reviewId) => {
//     return API.delete(`/customers/reviews/${reviewId}`);
//   }
// };

// // Vendor APIs
// export const vendorAPI = {
//   /**
//    * Get vendor profile
//    * @returns {Promise} Vendor profile data
//    */
//   getProfile: () => {
//     return API.get('/vendors/profile');
//   },

//   /**
//    * Update vendor profile
//    * @param {Object} profileData - Updated profile data
//    * @returns {Promise} Update response
//    */
//   updateProfile: (profileData) => {
//     return API.put('/vendors/profile', profileData);
//   },

//   /**
//    * Get vendor services
//    * @returns {Promise} Services list
//    */
//   getServices: () => {
//     return API.get('/vendors/services');
//   },

//   /**
//    * Get service details
//    * @param {string} serviceId - Service ID
//    * @returns {Promise} Service details
//    */
//   getServiceDetails: (serviceId) => {
//     return API.get(`/vendors/services/${serviceId}`);
//   },

//   /**
//    * Create a new service
//    * @param {Object} serviceData - Service information
//    * @returns {Promise} Created service
//    */
//   createService: (serviceData) => {
//     return API.post('/vendors/services', serviceData);
//   },

//   /**
//    * Update a service
//    * @param {string} serviceId - Service ID to update
//    * @param {Object} serviceData - Updated service data
//    * @returns {Promise} Updated service
//    */
//   updateService: (serviceId, serviceData) => {
//     return API.put(`/vendors/services/${serviceId}`, serviceData);
//   },

//   /**
//    * Delete a service
//    * @param {string} serviceId - Service ID to delete
//    * @returns {Promise} Deletion response
//    */
//   deleteService: (serviceId) => {
//     return API.delete(`/vendors/services/${serviceId}`);
//   },

//   /**
//    * Get vendor bookings
//    * @param {Object} filters - Optional filters like status or date
//    * @returns {Promise} Bookings list
//    */
//   getBookings: (filters = {}) => {
//     return API.get('/vendors/bookings', { params: filters });
//   },

//   /**
//    * Update booking status
//    * @param {string} bookingId - Booking ID
//    * @param {string} status - New status (e.g., 'CONFIRMED', 'COMPLETED', 'CANCELLED')
//    * @returns {Promise} Updated booking
//    */
//   updateBookingStatus: (bookingId, status) => {
//     return API.put(`/vendors/bookings/${bookingId}/status`, { status });
//   },

//   /**
//    * Get vendor reviews
//    * @returns {Promise} Reviews list
//    */
//   getReviews: () => {
//     return API.get('/vendors/reviews');
//   },

//   /**
//    * Respond to a review
//    * @param {string} reviewId - Review ID to respond to
//    * @param {string} response - Vendor's response text
//    * @returns {Promise} Updated review with response
//    */
//   respondToReview: (reviewId, response) => {
//     return API.post(`/vendors/reviews/${reviewId}/respond`, { response });
//   }
// };

// // Public APIs (not requiring authentication)
// export const publicAPI = {
//   /**
//    * Get public services list
//    * @param {Object} filters - Optional filters
//    * @returns {Promise} Services list
//    */
//   getServices: (filters = {}) => {
//     return API.get('/public/services', { params: filters });
//   },

//   /**
//    * Get service details
//    * @param {string} serviceId - Service ID or slug
//    * @returns {Promise} Service details
//    */
//   getServiceDetails: (serviceId) => {
//     return API.get(`/public/services/${serviceId}`);
//   },

//   /**
//    * Get service providers
//    * @param {Object} filters - Optional filters
//    * @returns {Promise} Providers list
//    */
//   getProviders: (filters = {}) => {
//     return API.get('/public/providers', { params: filters });
//   },

//   /**
//    * Get provider details
//    * @param {string} providerId - Provider ID or slug
//    * @returns {Promise} Provider details
//    */
//   getProviderDetails: (providerId) => {
//     return API.get(`/public/providers/${providerId}`);
//   },

//   /**
//    * Get service categories
//    * @returns {Promise} Categories list
//    */
//   getCategories: () => {
//     return API.get('/public/categories');
//   },

//   /**
//    * Search services and providers
//    * @param {string} query - Search query
//    * @returns {Promise} Search results
//    */
//   search: (query) => {
//     return API.get('/public/search', { params: { q: query } });
//   },

//   /**
//    * Submit contact form
//    * @param {Object} contactData - Contact form data
//    * @returns {Promise} Submission response
//    */
//   contact: (contactData) => {
//     return API.post('/public/contact', contactData);
//   }
// };

// // Admin APIs
// export const adminAPI = {
//   /**
//    * Get all users
//    * @param {Object} filters - Optional filters
//    * @returns {Promise} Users list
//    */
//   getUsers: (filters = {}) => {
//     return API.get('/admin/users', { params: filters });
//   },

//   /**
//    * Get user details
//    * @param {string} userId - User ID
//    * @returns {Promise} User details
//    */
//   getUserDetails: (userId) => {
//     return API.get(`/admin/users/${userId}`);
//   },

//   /**
//    * Update user
//    * @param {string} userId - User ID
//    * @param {Object} userData - Updated user data
//    * @returns {Promise} Updated user
//    */
//   updateUser: (userId, userData) => {
//     return API.put(`/admin/users/${userId}`, userData);
//   },

//   /**
//    * Delete user
//    * @param {string} userId - User ID
//    * @returns {Promise} Deletion response
//    */
//   deleteUser: (userId) => {
//     return API.delete(`/admin/users/${userId}`);
//   },

//   /**
//    * Get all vendors
//    * @param {Object} filters - Optional filters
//    * @returns {Promise} Vendors list
//    */
//   getVendors: (filters = {}) => {
//     return API.get('/admin/vendors', { params: filters });
//   },

//   /**
//    * Update vendor status
//    * @param {string} vendorId - Vendor ID
//    * @param {string} status - New status
//    * @returns {Promise} Updated vendor
//    */
//   updateVendorStatus: (vendorId, status) => {
//     return API.put(`/admin/vendors/${vendorId}/status`, { status });
//   },

//   /**
//    * Get dashboard statistics
//    * @returns {Promise} Dashboard stats
//    */
//   getDashboardStats: () => {
//     return API.get('/admin/dashboard/stats');
//   },
  
//   /**
//    * Get system settings
//    * @returns {Promise} System settings
//    */
//   getSettings: () => {
//     return API.get('/admin/settings');
//   },
  
//   /**
//    * Update system settings
//    * @param {Object} settings - Updated settings
//    * @returns {Promise} Updated settings
//    */
//   updateSettings: (settings) => {
//     return API.put('/admin/settings', settings);
//   }
// };

// // Export the base API instance as default
// export default API;