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
    
    console.log("Creating service with data:", formattedData);
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
    
    console.log(`Updating service ${serviceId} with data:`, formattedData);
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
      
      // Log the raw response to see what we're getting back
      console.log("Raw API response:", bookingsResponse);
      
      // Get the data from the response
      const bookings = bookingsResponse.data;

      // If no bookings, return empty array
      if (!bookings || bookings.length === 0) {
        console.log("No bookings found");
        return { data: [] };
      }
      
      console.log("Found bookings:", bookings);

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
          console.error('Error enhancing booking details:', error);
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

      console.log("Enhanced bookings:", enhancedBookings);
      
      // Add detailed logging of bookings and their price values
      console.log("Detailed booking price analysis:", enhancedBookings.map(b => ({
        bookingID: b.bookingID,
        serviceID: b.serviceID,
        serviceName: b.serviceName,
        price: b.price,
        priceType: typeof b.price,
        status: b.status
      })));
      
      return { data: enhancedBookings };
    } catch (error) {
      console.error('Error fetching bookings:', error);
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
      console.error('Error updating booking status:', error);
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
      console.error('Error calculating booking statistics:', error);
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
      console.error('Error fetching upcoming bookings:', error);
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
      console.error('Error fetching customer booking history:', error);
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
    
    console.log("Getting provider profile for email:", userEmail);
    
    // First get the user by email to get the userID
    return apiClient.get(`/v1/users/by-email/${encodeURIComponent(userEmail)}`)
      .then(userResponse => {
        if (!userResponse?.data || !userResponse.data.userID) {
          throw new Error('User ID not found');
        }
        
        const userId = userResponse.data.userID;
        console.log("Retrieved user ID:", userId);
        
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
      console.error('Error fetching user by email:', error);
      throw error;
    }
  },

  /**
   * Get provider statistics
   * @param {number} providerID - Provider ID
   * @param {Object} options - Options for statistics (e.g., timeframe)
   * @returns {Promise} Provider statistics
   */
  getProviderStatistics: async (providerID, options = { timeframe: 30 }) => {
    try {
      console.log('Fetching statistics for provider:', providerID, 'with timeframe:', options.timeframe);
      
      // Make the actual API call to your backend
      const response = await apiClient.get(`/v1/providers/${providerID}/statistics`, {
        params: { 
          timeframe: options.timeframe
        }
      });
      
      // If backend doesn't return data, fall back to mock data
      if (!response.data) {
        console.warn('Backend returned empty data, using fallback data');
        return {
          data: {
            // Your existing mock data
            totalRevenue: { amount: 24500, percentageChange: 12.6, timeframe: 'last month' },
            // ... rest of the mock data
          }
        };
      }
      
      console.log('Statistics data received from backend:', response);
      return response;
    } catch (error) {
      console.error('Error fetching provider statistics:', error);
      // You can still return mock data for development if the API call fails
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using fallback mock data due to API error');
        return {
          data: {
            // Your existing mock data
            totalRevenue: { amount: 24500, percentageChange: 12.6, timeframe: 'last month' },
            // ... rest of the mock data
          }
        };
      }
      throw error;
    }
  },

  /**
   * Get provider statistics using multiple existing API endpoints
   * @param {number} providerID - Provider ID
   * @param {Object} options - Options for statistics (e.g., timeframe)
   * @returns {Promise} Provider statistics
   */
  getProviderStatistics: async (providerID, options = { timeframe: 30 }) => {
    try {
      console.log('Calculating statistics for provider:', providerID, 'with timeframe:', options.timeframe);
      
      // Calculate date ranges for filtering
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - options.timeframe);
      
      // Also calculate previous period for comparison
      const prevPeriodEnd = new Date(startDate);
      prevPeriodEnd.setDate(prevPeriodEnd.getDate() - 1);
      const prevPeriodStart = new Date(prevPeriodEnd);
      prevPeriodStart.setDate(prevPeriodEnd.getDate() - options.timeframe);
      
      // 1. Get all provider bookings (this will give us data for statistics)
      const bookingsResponse = await vendorAPI.getBookings(providerID);
      const allBookings = bookingsResponse.data || [];
      
      // 2. Get services for this provider (for top services analysis)
      const servicesResponse = await vendorAPI.getServices(providerID);
      const allServices = servicesResponse.data || [];
      
      // 3. Get reviews for this provider
      const reviewsResponse = await vendorAPI.getReviews(providerID);
      const allReviews = reviewsResponse.data || [];
      
      // Filter bookings by timeframe
      const filterBookingsByDateRange = (bookings, start, end) => {
        console.log("Filtering bookings from", start, "to", end);
        
        // Debug each booking as we filter
        return bookings.filter(booking => {
          const bookingDate = new Date(booking.bookingDate);
          
          // Debug this specific booking
          console.log(`Booking #${booking.bookingID} date: ${bookingDate}, service: ${booking.serviceName}, in range: ${bookingDate >= start && bookingDate <= end}`);
          
          // TEMPORARILY DISABLE DATE FILTERING FOR DEBUGGING
          // return true; // Include ALL bookings regardless of date for testing
          
          // Or use a very generous date range
          const yearStart = new Date();
          yearStart.setFullYear(yearStart.getFullYear() - 1); // Last year
          const yearEnd = new Date();
          yearEnd.setFullYear(yearEnd.getFullYear() + 1); // Next year
          
          return bookingDate >= yearStart && bookingDate <= yearEnd;
        });
      };
      
      // Get bookings within current period - use a very generous date range for testing
      const currentPeriodBookings = filterBookingsByDateRange(allBookings, 
        new Date(new Date().getFullYear() - 1, 0, 1), // Jan 1st of last year
        new Date(new Date().getFullYear() + 1, 11, 31) // Dec 31st of next year
      );
      
      // Get bookings from previous period for comparison
      const prevPeriodBookings = filterBookingsByDateRange(allBookings, prevPeriodStart, prevPeriodEnd);
      
      // ------------- CALCULATE TOTAL REVENUE -------------
      // Calculate completed revenue in the current timeframe
      const calculateRevenue = (bookings) => {
        return bookings
          .filter(booking => booking.status === 'COMPLETED')
          .reduce((total, booking) => total + (parseFloat(booking.price) || 0), 0);
      };
      
      const currentRevenue = calculateRevenue(currentPeriodBookings);
      const prevRevenue = calculateRevenue(prevPeriodBookings);
      
      // Calculate percentage change
      const percentageChange = prevRevenue > 0 
        ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 
        : 0;
      
      // ------------- CALCULATE CUSTOMER METRICS -------------
      // Get unique customers in current period
      const uniqueCustomerIDs = [...new Set(allBookings.map(b => b.customerID))];
      const currentPeriodCustomerIDs = [...new Set(currentPeriodBookings.map(b => b.customerID))];
      
      // Find new customers (those who booked for the first time in this period)
      const newCustomers = currentPeriodCustomerIDs.filter(customerId => {
        // Find the earliest booking for this customer
        const customerBookings = allBookings.filter(b => b.customerID === customerId);
        const sortedBookings = customerBookings.sort((a, b) => 
          new Date(a.bookingDate) - new Date(b.bookingDate)
        );
        
        // Check if the earliest booking is within current period
        if (sortedBookings.length > 0) {
          const earliestBookingDate = new Date(sortedBookings[0].bookingDate);
          return earliestBookingDate >= startDate;
        }
        return false;
      });
      
      // ------------- CALCULATE GROWTH RATE -------------
      const currentBookingsCount = currentPeriodBookings.length;
      const prevBookingsCount = prevPeriodBookings.length;
      
      const growthRate = prevBookingsCount > 0 
        ? ((currentBookingsCount - prevBookingsCount) / prevBookingsCount) * 100 
        : 0;
      
      // ------------- CALCULATE MONTHLY DATA -------------
      // Get the last 6 months of data
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        months.push(date);
      }
      
      const monthlyData = months.map(month => {
        const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
        const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
        
        // Find all bookings within this month's date range
        const monthBookings = allBookings.filter(booking => {
          const bookingDate = new Date(booking.bookingDate);
          return bookingDate >= monthStart && bookingDate <= monthEnd;
        });
        
        // Count completed bookings
        const completedBookings = monthBookings.filter(b => b.status === 'COMPLETED');
        
        // Calculate revenue - include ALL non-cancelled bookings, not just completed ones
        const monthRevenue = monthBookings
          .filter(b => b.status !== 'CANCELLED')
          .reduce((total, booking) => {
            const price = parseFloat(booking.price) || 0;
            return total + price;
          }, 0);
        
        console.log(`Month ${month.toLocaleString('default', { month: 'short' })}: ${monthBookings.length} bookings, ${completedBookings.length} completed, R${monthRevenue} revenue`);
        
        return {
          month: month.toLocaleString('default', { month: 'short' }),
          revenue: monthRevenue,
          totalBookings: monthBookings.length,
          completedBookings: completedBookings.length
        };
      });
      
      // Log the calculated monthly data for debugging
      console.log("Monthly data for charts:", monthlyData);
      
      // After generating the monthlyData array:
      // Fill in any months with zero values if there were no bookings
      const monthlyDataWithDefaults = monthlyData.map(monthData => {
        return {
          month: monthData.month,
          revenue: monthData.revenue || 0,
          totalBookings: monthData.totalBookings || 0,
          completedBookings: monthData.completedBookings || 0
        };
      });
      
      // ------------- ANALYZE TOP SERVICES -------------
      // Map to track revenue and bookings by service
      const serviceMetrics = {};

      // Initialize metrics for each service
      allServices.forEach(service => {
        const serviceId = service.serviceID || service.id;
        const serviceName = service.name || service.serviceName || service.title || `Service #${serviceId}`;
        
        serviceMetrics[serviceId] = {
          serviceID: serviceId,
          serviceName: serviceName,
          bookings: 0,
          revenue: 0,
          ratings: [],
          averageRating: 0 // Initialize with zero
        };
        
        console.log(`Initialized service in metrics: ${serviceName} (ID: ${serviceId})`);
      });

      // Calculate bookings and revenue by service - INCLUDE ALL BOOKINGS, not just by status
      currentPeriodBookings.forEach(booking => {
        const serviceId = booking.serviceID;
        
        // Log detailed booking information for debugging
        console.log(`Processing booking #${booking.bookingID}:`, {
          serviceId: serviceId,
          serviceName: booking.serviceName,
          price: booking.price,
          status: booking.status
        });
        
        // Get the price - use booking.price directly if available
        // Note: The "price" in bookings sometimes comes from the service and may not reflect the actual booking price
        let bookingPrice = parseFloat(booking.price);
        
        // If service doesn't exist in our metrics map, create it
        if (!serviceMetrics[serviceId]) {
          serviceMetrics[serviceId] = {
            serviceID: serviceId,
            serviceName: booking.serviceName || `Service #${serviceId}`,
            bookings: 0,
            revenue: 0,
            ratings: []
          };
          console.log(`Created new service metric for: ${booking.serviceName || `Service #${serviceId}`}`);
        }
        
        // Always increment bookings count for all statuses
        serviceMetrics[serviceId].bookings++;
        
        // Add to revenue for all non-cancelled bookings - don't filter by COMPLETED only
        if (booking.status !== 'CANCELLED') {
          serviceMetrics[serviceId].revenue += bookingPrice;
          console.log(`Added ${bookingPrice} to revenue for ${serviceMetrics[serviceId].serviceName}`);
        }
      });

      // After processing, log the service metrics for debugging
      console.log("Service metrics after processing all bookings:", serviceMetrics);

      // Fetch ratings for each service using the publicAPI
      // We'll use Promise.all to fetch all ratings in parallel
      await Promise.all(
        Object.keys(serviceMetrics).map(async (serviceId) => {
          try {
            // Import at the top of your file: import publicAPI from '../public/publicAPI';
            const response = await publicAPI.getServiceReviews(serviceId);
            const reviews = response.data || [];
            
            if (reviews.length > 0) {
              // Calculate average rating
              const ratings = reviews.map(review => review.rating || 0);
              const sum = ratings.reduce((total, rating) => total + rating, 0);
              serviceMetrics[serviceId].averageRating = sum / ratings.length;
              serviceMetrics[serviceId].ratings = ratings;
              
              console.log(`Fetched ${ratings.length} ratings for service ${serviceMetrics[serviceId].serviceName}, average: ${serviceMetrics[serviceId].averageRating}`);
            }
          } catch (err) {
            console.error(`Error fetching ratings for service ${serviceId}:`, err);
          }
        })
      );
      
      // For services without reviews, try to get provider's overall rating as a fallback
      try {
        const providerReviewSummary = await publicAPI.getProviderReviewSummary(providerID);
        const providerRating = providerReviewSummary.data?.average || 0;
        
        // Apply provider rating to services with no ratings
        Object.keys(serviceMetrics).forEach(serviceId => {
          if (serviceMetrics[serviceId].ratings.length === 0) {
            serviceMetrics[serviceId].averageRating = providerRating;
          }
        });
      } catch (err) {
        console.warn("Could not fetch provider review summary:", err);
      }
      
      // Calculate averages and sort by revenue
      const topServices = Object.values(serviceMetrics)
        .filter(service => service.bookings > 0) // Only include services with bookings
        .sort((a, b) => b.revenue - a.revenue) // Sort by revenue
        .slice(0, 5); // Take top 5

      // Log the final top services for debugging
      console.log("Final top services:", topServices);
      
      // ------------- ANALYZE REVIEWS -------------
      // Calculate overall rating stats
      const ratings = allReviews.map(review => review.rating || 0);
      const averageRating = ratings.length > 0 
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
        : 0;
      
      // Calculate distribution
      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      ratings.forEach(rating => {
        const roundedRating = Math.round(rating);
        if (roundedRating >= 1 && roundedRating <= 5) {
          distribution[roundedRating]++;
        }
      });
      
      // Generate time labels based on timeframe
      let timeframeLabel;
      let comparisonLabel;
      
      switch (options.timeframe) {
        case 7:
          timeframeLabel = 'last week';
          comparisonLabel = 'week over week';
          break;
        case 30:
          timeframeLabel = 'last month';
          comparisonLabel = 'month over month';
          break;
        case 90:
          timeframeLabel = 'last quarter';
          comparisonLabel = 'quarter over quarter';
          break;
        case 365:
          timeframeLabel = 'last year';
          comparisonLabel = 'year over year';
          break;
        default:
          timeframeLabel = `last ${options.timeframe} days`;
          comparisonLabel = 'period over period';
      }
      
      // Assemble the final statistics object
      const statistics = {
        totalRevenue: {
          amount: currentRevenue,
          percentageChange: parseFloat(percentageChange.toFixed(1)),
          timeframe: timeframeLabel
        },
        customerRating: {
          average: parseFloat(averageRating.toFixed(1)),
          total: allReviews.length,
          timeframe: 'all time'
        },
        customerMetrics: {
          total: uniqueCustomerIDs.length,
          new: newCustomers.length,
          timeframe: timeframeLabel
        },
        businessGrowth: {
          rate: parseFloat(growthRate.toFixed(1)),
          timeframe: comparisonLabel
        },
        monthlyData: monthlyDataWithDefaults,
        recentBookings: currentPeriodBookings.slice(0, 20),
        topServices: topServices,
        reviewMetrics: {
          total: allReviews.length,
          average: parseFloat(averageRating.toFixed(1)),
          distribution: distribution
        }
      };
      
      console.log('Calculated statistics:', statistics);
      return { data: statistics };
    } catch (error) {
      console.error('Error calculating provider statistics:', error);
      
      // Return mock data for development in case of error
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using fallback mock data due to calculation error');
        return {
          data: {
            totalRevenue: { amount: 24500, percentageChange: 12.6, timeframe: 'last month' },
            customerRating: { average: 4.7, total: 123, timeframe: 'all time' },
            customerMetrics: { total: 86, new: 14, timeframe: 'this month' },
            businessGrowth: { rate: 8.2, timeframe: 'year over year' },
            monthlyData: [
              { month: 'Jan', revenue: 3200, totalBookings: 28, completedBookings: 25 },
              { month: 'Feb', revenue: 3800, totalBookings: 32, completedBookings: 30 },
              { month: 'Mar', revenue: 4200, totalBookings: 35, completedBookings: 32 },
              { month: 'Apr', revenue: 3900, totalBookings: 30, completedBookings: 28 },
              { month: 'May', revenue: 4800, totalBookings: 40, completedBookings: 37 },
              { month: 'Jun', revenue: 5200, totalBookings: 45, completedBookings: 42 }
            ],
            recentBookings: [
              { bookingID: 1, bookingDate: '2025-04-20', customerID: 1, price: 850, status: 'COMPLETED' },
              { bookingID: 2, bookingDate: '2025-04-19', customerID: 2, price: 1200, status: 'COMPLETED' },
              { bookingID: 3, bookingDate: '2025-04-18', customerID: 3, price: 750, status: 'CONFIRMED' },
              { bookingID: 4, bookingDate: '2025-04-17', customerID: 1, price: 950, status: 'PENDING' }
            ],
            topServices: [
              { serviceID: 1, serviceName: 'Electrical Repair', bookings: 42, revenue: 12600, averageRating: 4.8 },
              { serviceID: 2, serviceName: 'Circuit Installation', bookings: 28, revenue: 8400, averageRating: 4.6 },
              { serviceID: 3, serviceName: 'Emergency Call', bookings: 15, revenue: 6000, averageRating: 4.9 }
            ],
            reviewMetrics: { 
              total: 123, 
              average: 4.7, 
              distribution: { 5: 85, 4: 25, 3: 10, 2: 3, 1: 0 } 
            }
          }
        };
      }
      throw error;
    }
  }
};

export default vendorAPI;