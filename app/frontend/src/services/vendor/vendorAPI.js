import apiClient from '../../utils/apiClient';
import publicAPI from '../public/publicAPI';

/**
 * Vendor-specific API endpoints that match your actual backend
 */
const vendorAPI = {
  /**
   * Get vendor profile by user ID
   * @param {number} userId - User ID
   * @returns {Promise} Service provider data
   */
  getProviderByUserId: (userId) => {
    return apiClient.get(`/v1/service-providers/by-user/${userId}`);
  },

  /**
   * Update vendor profile (business details only)
   * @param {number} providerId - Provider ID
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} Update response
   */
  updateProvider: (providerId, profileData) => {
    return apiClient.put(`/v1/service-providers/update/${providerId}`, profileData);
  },
  
  /**
   * Update basic user information (name, surname, phone)
   * @param {number} userId - User ID
   * @param {Object} basicInfo - Basic user information
   * @returns {Promise} Update response
   */
  updateBasicInfo: (userId, basicInfo) => {
    return apiClient.put(`/v1/users/${userId}/basic-info`, basicInfo);
  },

  /**
   * Create a new vendor profile
   * @param {Object} profileData - Profile data including userID
   * @returns {Promise} Created provider
   */
  createProvider: (profileData) => {
    return apiClient.post('/v1/service-providers/create', profileData);
  },

  /**
   * Get vendor services
   * @param {number} providerId - Provider ID
   * @returns {Promise} Services list
   */
  getServices: (providerId) => {
    return apiClient.get(`/v1/services/provider/${providerId}`);
  },

  /**
   * Get service details
   * @param {number} serviceId - Service ID
   * @returns {Promise} Service details
   */
  getServiceDetails: (serviceId) => {
    return apiClient.get(`/v1/services/${serviceId}`);
  },

  /**
   * Create a new service
   * @param {Object} serviceData - Service information including providerID, serviceName, description, price, duration
   * @returns {Promise} Created service
   */
  createService: (serviceData) => {
    // Ensure data is properly formatted for the backend
    const formattedData = {
      providerID: serviceData.providerID,
      serviceName: serviceData.serviceName,
      description: serviceData.description,
      price: parseFloat(serviceData.price),
      duration: serviceData.duration
    };
    
    return apiClient.post('/v1/services/create', formattedData);
  },

  /**
   * Update a service
   * @param {number} serviceId - Service ID to update
   * @param {Object} serviceData - Updated service data
   * @returns {Promise} Updated service
   */
  updateService: (serviceId, serviceData) => {
    // Ensure isActive is properly formatted for the backend
    const formattedData = {
      ...serviceData,
      isActive: serviceData.isActive === true // Explicitly convert to boolean
    };
    
    return apiClient.put(`/v1/services/update/${serviceId}`, formattedData);
  },

  /**
   * Delete a service
   * @param {number} serviceId - Service ID to delete
   * @returns {Promise} Deletion response
   */
  deleteService: (serviceId) => {
    return apiClient.delete(`/v1/services/delete/${serviceId}`);
  },

  /**
   * Get vendor bookings with enhanced details
   * @param {number} providerId - Provider ID
   * @param {Object} filters - Optional filters like status or date range
   * @returns {Promise} Bookings list with customer and service details
   */
  getBookings: async (providerId, filters = {}) => {
    try {
      // Get basic bookings data
      const bookingsResponse = await apiClient.get(`/v1/bookings/provider/${providerId}`, { 
        params: filters 
      });
      
      // Get the data from the response
      const bookings = bookingsResponse.data;

      // If no bookings, return empty array
      if (!bookings || bookings.length === 0) {
        return { data: [] };
      }

      // Process bookings as before...
      const enhancedBookings = await Promise.all(bookings.map(async (booking) => {
        try {
          // Get customer details
          const customerResponse = await apiClient.get(`/v1/customers/${booking.customerID}`);
          const customer = customerResponse.data;

          // Get service details
          const serviceResponse = await apiClient.get(`/v1/services/${booking.serviceID}`);
          const service = serviceResponse.data;

          // Format date/time
          const bookingDate = new Date(booking.bookingDate);
          const formattedDate = bookingDate.toLocaleDateString('en-ZA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });
          
          const formattedTime = bookingDate.toLocaleTimeString('en-ZA', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });

          // Return enhanced booking object
          return {
            ...booking,
            customerName: customer?.name || `Customer #${booking.customerID}`,
            customerEmail: customer?.email,
            customerPhone: customer?.phone,
            serviceName: service?.name || service?.serviceName || `Service #${booking.serviceID}`,
            price: service?.price || 0,
            duration: service?.duration || 'Not specified',
            date: formattedDate,
            time: formattedTime
          };
        } catch (error) {
          // Return basic booking with placeholder values if enhancement fails
          return {
            ...booking,
            customerName: `Customer #${booking.customerID}`,
            serviceName: `Service #${booking.serviceID}`,
            price: 0,
            date: new Date(booking.bookingDate).toLocaleDateString(),
            time: new Date(booking.bookingDate).toLocaleTimeString()
          };
        }
      }));

      return { data: enhancedBookings };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update booking status
   * @param {number} bookingId - Booking ID
   * @param {string} status - New status (e.g., 'CONFIRMED', 'COMPLETED', 'CANCELLED')
   * @returns {Promise} Updated booking
   */
  updateBookingStatus: async (bookingId, status) => {
    try {
      // Updated to match the correct endpoint format and request body structure
      const response = await apiClient.put(`/v1/bookings/status/${bookingId}`, { 
        newStatus: status 
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get bookings statistics for a provider
   * @param {number} providerId - Provider ID
   * @returns {Promise} Statistics including counts by status, revenue data
   */
  getBookingStats: async (providerId) => {
    try {
      // Get all bookings for the provider
      const bookingsResponse = await vendorAPI.getBookings(providerId);
      const bookings = bookingsResponse.data;

      // Initialize stats object
      const stats = {
        total: bookings.length,
        pending: 0,
        completed: 0,
        cancelled: 0,
        totalRevenue: 0,
        completedRevenue: 0,
        upcomingRevenue: 0,
        averageValue: 0
      };

      // Process each booking
      bookings.forEach(booking => {
        const price = parseFloat(booking.price) || 0;

        // Count by status
        switch (booking.status) {
          case 'PENDING':
            stats.pending++;
            stats.upcomingRevenue += price;
            break;
          case 'COMPLETED':
            stats.completed++;
            stats.completedRevenue += price;
            break;
          case 'CANCELLED':
            stats.cancelled++;
            break;
          default:
            // For any other status
            break;
        }

        // Add to total revenue (excluding cancelled)
        if (booking.status !== 'CANCELLED') {
          stats.totalRevenue += price;
        }
      });

      // Calculate average booking value (excluding cancelled)
      const validBookings = stats.total - stats.cancelled;
      stats.averageValue = validBookings > 0 ? stats.totalRevenue / validBookings : 0;

      return { data: stats };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get upcoming bookings for a provider
   * @param {number} providerId - Provider ID
   * @param {number} days - Number of days to look ahead (default: 7)
   * @returns {Promise} List of upcoming bookings
   */
  getUpcomingBookings: async (providerId, days = 7) => {
    try {
      const now = new Date();
      const endDate = new Date();
      endDate.setDate(now.getDate() + days);

      // Create date strings for filtering
      const startDateStr = now.toISOString();
      const endDateStr = endDate.toISOString();

      // Filter bookings by date range
      const bookingsResponse = await vendorAPI.getBookings(providerId, {
        startDate: startDateStr,
        endDate: endDateStr,
        status: 'PENDING'
      });

      return bookingsResponse;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get customer booking history
   * @param {number} providerId - Provider ID
   * @param {number} customerId - Customer ID
   * @returns {Promise} Customer's booking history with this provider
   */
  getCustomerBookingHistory: async (providerId, customerId) => {
    try {
      const bookingsResponse = await vendorAPI.getBookings(providerId);
      const allBookings = bookingsResponse.data;

      // Filter bookings for this specific customer
      const customerBookings = allBookings.filter(
        booking => booking.customerID === customerId
      );

      return { data: customerBookings };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get vendor reviews by provider ID
   * @param {number} providerId - Provider ID
   * @returns {Promise} Reviews list
   */
  getReviews: (providerId) => {
    return apiClient.get(`/v1/reviews/provider/${providerId}`);
  },

  /**
   * For backward compatibility - gets the provider profile using correct API path
   * @returns {Promise} - Current user's provider profile if they have a valid token
   */
  getProfile: function() {
    // Get the user email from localStorage
    const userEmail = JSON.parse(localStorage.getItem('user'))?.email;
    
    if (!userEmail) {
      return Promise.reject(new Error('No user email found'));
    }
    
    // First get the user by email to get the userID
    return apiClient.get(`/v1/users/by-email/${encodeURIComponent(userEmail)}`)
      .then(userResponse => {
        if (!userResponse?.data || !userResponse.data.userID) {
          throw new Error('User ID not found');
        }
        
        const userId = userResponse.data.userID;
        
        // Then get provider data using the user ID
        return apiClient.get(`/v1/service-providers/by-user/${userId}`);
      });
  },

  /**
   * For backward compatibility - maps to updateProvider
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} Update response
   */
  updateProfile: function(profileData) {
    // First get the provider ID, then update
    return this.getProfile()
      .then(response => {
        const providerId = response.data.providerID;
        return this.updateProvider(providerId, profileData);
      });
  },

  /**
   * Get user by email
   * @param {string} email - User email
   * @returns {Promise} User data
   */
  getUserByEmail: async (email) => {
    try {
      const response = await apiClient.get(`/v1/users/by-email/${email}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get provider statistics
   * @param {number} providerID - Provider ID
   * @param {Object} options - Options for statistics (e.g., timeframe)
   * @returns {Promise} Provider statistics
   */
  getProviderStatistics: async (providerId, options = {}) => {
    try {
      const timeframe = options.timeframe || 30; // Default to 30 days

      // Get provider services
      const servicesResponse = await apiClient.get(`/v1/services/provider/${providerId}`);
      const services = servicesResponse.data || [];
      
      // Get all bookings for this provider
      const bookingsResponse = await apiClient.get(`/v1/bookings/provider/${providerId}`);
      const bookings = bookingsResponse.data || [];
      
      // Get all reviews for this provider
      const reviewsResponse = await apiClient.get(`/v1/reviews/provider/${providerId}`);
      const reviews = reviewsResponse.data || [];

      // Generate statistics from these raw data - this is more reliable than trying to use specialized endpoints
      
      // 1. Calculate revenue metrics
      let totalRevenue = 0;
      let previousPeriodRevenue = 0;
      
      const now = new Date();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - timeframe);
      
      const previousPeriodStart = new Date(cutoffDate);
      previousPeriodStart.setDate(previousPeriodStart.getDate() - timeframe);
      
      // Group bookings by month for chart data
      const monthlyData = [];
      const monthGroups = {};
      
      bookings.forEach(booking => {
        const bookingDate = new Date(booking.appointmentDateTime || booking.bookingDate);
        const service = services.find(s => s.serviceID === booking.serviceID);
        const price = service?.price || 0;
        
        // Calculate revenue for current period vs previous period
        if (bookingDate >= cutoffDate && bookingDate <= now) {
          totalRevenue += price;
        } else if (bookingDate >= previousPeriodStart && bookingDate < cutoffDate) {
          previousPeriodRevenue += price;
        }
        
        // Group by month for chart data
        const monthYear = `${bookingDate.getMonth() + 1}/${bookingDate.getFullYear()}`;
        if (!monthGroups[monthYear]) {
          monthGroups[monthYear] = {
            month: monthYear,
            totalBookings: 0,
            completedBookings: 0,
            revenue: 0
          };
        }
        
        monthGroups[monthYear].totalBookings++;
        if (booking.status === 'COMPLETED') {
          monthGroups[monthYear].completedBookings++;
        }
        monthGroups[monthYear].revenue += price;
      });
      
      // Convert month groups to array and sort chronologically
      Object.values(monthGroups).forEach(monthData => {
        monthlyData.push(monthData);
      });
      monthlyData.sort((a, b) => {
        const [aMonth, aYear] = a.month.split('/');
        const [bMonth, bYear] = b.month.split('/');
        return (parseInt(aYear) - parseInt(bYear)) || (parseInt(aMonth) - parseInt(bMonth));
      });
      
      // 2. Calculate review metrics
      let totalRating = 0;
      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      
      reviews.forEach(review => {
        if (review.rating) {
          totalRating += review.rating;
          distribution[review.rating] = (distribution[review.rating] || 0) + 1;
        }
      });
      
      const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
      
      // 3. Calculate percentage change in revenue
      const percentageChange = previousPeriodRevenue > 0 
        ? ((totalRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100
        : 0;
      
      // 4. Calculate top services based on bookings and revenue
      const serviceStats = {};
      services.forEach(service => {
        serviceStats[service.serviceID] = {
          serviceID: service.serviceID,
          serviceName: service.serviceName || service.name,
          bookings: 0,
          revenue: 0,
          ratings: [],
          averageRating: 0
        };
      });
      
      // Count bookings and revenue by service
      bookings.forEach(booking => {
        if (serviceStats[booking.serviceID]) {
          serviceStats[booking.serviceID].bookings++;
          
          const service = services.find(s => s.serviceID === booking.serviceID);
          if (service) {
            serviceStats[booking.serviceID].revenue += service.price || 0;
          }
        }
      });
      
      // Add ratings by service
      reviews.forEach(review => {
        if (serviceStats[review.serviceID] && review.rating) {
          serviceStats[review.serviceID].ratings.push(review.rating);
        }
      });
      
      // Calculate average ratings and sort services by revenue
      const topServices = Object.values(serviceStats).map(stat => {
        const totalRating = stat.ratings.reduce((sum, rating) => sum + rating, 0);
        const averageRating = stat.ratings.length > 0 ? totalRating / stat.ratings.length : 0;
        
        return {
          ...stat,
          averageRating: averageRating,
          // Include the raw ratings array for additional calculations if needed
          ratings: [...stat.ratings]
        };
      }).sort((a, b) => b.revenue - a.revenue);
      
      // 5. Count unique customers
      const uniqueCustomerIDs = new Set(bookings.map(booking => booking.customerID)).size;
      
      // Count new customers in the current period
      const recentCustomerIDs = bookings
        .filter(booking => {
          const bookingDate = new Date(booking.appointmentDateTime || booking.bookingDate);
          return bookingDate >= cutoffDate && bookingDate <= now;
        })
        .map(booking => booking.customerID);
      
      const newCustomers = new Set(recentCustomerIDs).size;
      
      // 6. Calculate business growth (simplified)
      const businessGrowth = previousPeriodRevenue > 0 
        ? Math.round(percentageChange) 
        : Math.round(totalRevenue > 0 ? 100 : 0);
      
      // Return aggregated statistics
      return {
        data: {
          totalRevenue: { 
            amount: totalRevenue,
            percentageChange: Math.round(percentageChange),
            timeframe: 'last period'
          },
          customerRating: { 
            average: averageRating, 
            total: reviews.length,
            timeframe: 'all time' 
          },
          customerMetrics: { 
            total: uniqueCustomerIDs, 
            new: newCustomers,
            timeframe: timeframe <= 30 ? 'this month' : 'this period'
          },
          businessGrowth: { 
            rate: businessGrowth,
            timeframe: timeframe <= 30 ? 'month over month' : timeframe <= 90 ? 'quarter over quarter' : 'year over year'
          },
          monthlyData,
          recentBookings: bookings
            .sort((a, b) => {
              const dateA = new Date(a.appointmentDateTime || a.bookingDate);
              const dateB = new Date(b.appointmentDateTime || b.bookingDate);
              return dateB - dateA;
            })
            .slice(0, 10)
            .map(booking => {
              const service = services.find(s => s.serviceID === booking.serviceID);
              return {
                ...booking,
                price: service?.price || 0
              };
            }),
          topServices: topServices.slice(0, 5),
          reviewMetrics: { 
            total: reviews.length, 
            average: averageRating,
            distribution 
          }
        }
      };
    } catch (error) {
      // Silently catch errors and return dummy data instead of logging to console
      return {
        data: {
          totalRevenue: { amount: 0, percentageChange: 0, timeframe: 'last month' },
          customerRating: { average: 0, total: 0, timeframe: 'all time' },
          customerMetrics: { total: 0, new: 0, timeframe: 'this month' },
          businessGrowth: { rate: 0, timeframe: 'year over year' },
          monthlyData: [],
          recentBookings: [],
          topServices: [],
          reviewMetrics: { total: 0, average: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } }
        }
      };
    }
  }
};

export default vendorAPI;