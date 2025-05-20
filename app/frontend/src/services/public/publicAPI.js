import axios from 'axios';

/**
 * Dedicated API client for public endpoints that don't require authentication
 * This prevents authentication-related issues like refresh token loops
 */
const publicApiClient = axios.create({
  baseURL: 'http://13.60.59.231:8080/api',
  withCredentials: true // Keep this if CORS requires credentials
});

/**
 * Public API endpoints (no authentication required)
 */
const publicAPI = {
  /**
   * Get all service providers
   * @param {Object} filters - Optional filters like location, rating, etc.
   * @returns {Promise} Service providers list
   */
  getServiceProviders: (filters = {}) => {
    return publicApiClient.get('/v1/service-providers', { params: filters });
  },

  /**
   * Get service provider details by ID
   * @param {string} id - Service provider ID
   * @returns {Promise} Provider details
   */
  getServiceProviderById: (id) => {
    return publicApiClient.get(`/v1/service-providers/${id}`);
  },

  /**
   * Get all available services
   * @param {Object} filters - Optional filters like category, price range, etc.
   * @returns {Promise} Services list
   */
  getServices: (filters = {}) => {
    return publicApiClient.get('/v1/services', { params: filters });
  },

  /**
   * Get services provided by a specific provider
   * @param {string} providerID - Provider ID
   * @returns {Promise} Provider's services list
   */
  getServicesByProviderId: (providerID) => {
    return publicApiClient.get(`/v1/services/${providerID}`);
  },

  /**
   * Alternative endpoint to get provider's services
   * @param {string} providerID - Provider ID
   * @returns {Promise} Provider's services list
   */
  getProviderServices: (providerID) => {
    return publicApiClient.get(`/v1/services/provider/${providerID}`);
  },

  /**
   * Get service categories
   * @returns {Promise} Categories list
   */
  getCategories: () => {
    return publicApiClient.get('/v1/categories');
  },

  /**
   * Search across services and providers
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @returns {Promise} Search results
   */
  search: (query, filters = {}) => {
    return publicApiClient.get('/v1/search', { 
      params: { 
        q: query,
        ...filters 
      } 
    });
  },

  /**
   * Submit contact form (public)
   * @param {Object} contactData - Contact form data
   * @returns {Promise} Submission response
   */
  contact: (contactData) => {
    return publicApiClient.post('/v1/contact', contactData);
  },
  
  /**
   * Get featured or highlighted providers
   * @param {number} limit - Maximum number of featured providers to return
   * @returns {Promise} Featured providers list
   */
  getFeaturedProviders: (limit = 5) => {
    return publicApiClient.get('/v1/service-providers/featured', { 
      params: { limit } 
    });
  },
  
  /**
   * Get popular services
   * @param {number} limit - Maximum number of popular services to return
   * @returns {Promise} Popular services list
   */
  getPopularServices: (limit = 5) => {
    return publicApiClient.get('/v1/services/popular', { 
      params: { limit } 
    });
  },

  /**
   * Get reviews for a specific service
   * @param {string|number} serviceID - Service ID
   * @param {Object} options - Optional parameters (pagination, sorting)
   * @returns {Promise} Service reviews
   */
  getServiceReviews: (serviceID, options = {}) => {
    return publicApiClient.get(`/v1/reviews/service/${serviceID}`, { 
      params: options 
    });
  },

  /**
   * Get reviews for a specific provider
   * @param {string|number} providerID - Provider ID
   * @param {Object} options - Optional parameters (pagination, sorting)
   * @returns {Promise} Provider reviews
   */
  getProviderReviews: (providerID, options = {}) => {
    return publicApiClient.get(`/v1/reviews/provider/${providerID}`, { 
      params: options 
    });
  },
  
  /**
   * Get summary statistics for provider reviews
   * @param {string|number} providerID - Provider ID
   * @returns {Promise} Review summary including average rating and count
   */
  getProviderReviewSummary: async (providerId) => {
    try {
      // Get all reviews and then calculate the summary manually
      const response = await apiClient.get(`/v1/reviews/provider/${providerId}`);
      const reviews = response.data || [];
      
      // Calculate summary statistics
      let totalRating = 0;
      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      
      reviews.forEach(review => {
        if (review.rating) {
          totalRating += review.rating;
          distribution[review.rating] = (distribution[review.rating] || 0) + 1;
        }
      });
      
      const average = reviews.length > 0 ? totalRating / reviews.length : 0;
      
      return {
        data: {
          total: reviews.length,
          average,
          distribution
        }
      };
    } catch (error) {
      // Return empty summary instead of logging error
      return { 
        data: {
          total: 0,
          average: 0,
          distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        }
      };
    }
  }
};

export default publicAPI;