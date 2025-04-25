import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UserGroupIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  ArrowSmallRightIcon,
  CheckCircleIcon,
  ClockIcon as ClockSolidIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  StarIcon,
  BuildingStorefrontIcon,
  PlusCircleIcon,
  ShieldCheckIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/formatCurrency';
import { useAuth } from '../../contexts/auth/AuthContext';
import { vendorAPI } from '../../services';
import { toast } from 'react-hot-toast';
import { format, parseISO, isToday, isThisWeek, addDays, startOfToday, subDays } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import apiClient from '../../utils/apiClient';

// Add this helper at the top of your file (outside the component)
const DEBUG_MODE = false; // Set to true only when debugging

const log = (message, data = null) => {
  if (DEBUG_MODE) {
    if (data) {
      console.log(`[Dashboard] ${message}`, data);
    } else {
      console.log(`[Dashboard] ${message}`);
    }
  }
};

// Status badge component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    PENDING: {
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500',
      icon: ClockIcon
    },
    CONFIRMED: {
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500',
      icon: CheckCircleIcon
    },
    COMPLETED: {
      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500',
      icon: CheckCircleIcon
    },
    CANCELLED: {
      color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500',
      icon: XCircleIcon
    }
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
      <config.icon className="mr-1 h-3 w-3" />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
};

// Setup guide component for new vendors
const BusinessSetupGuide = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white shadow-md dark:from-blue-700 dark:to-indigo-800">
        <div className="flex flex-col items-center sm:flex-row sm:justify-between">
          <div className="mb-4 flex items-center sm:mb-0">
            <BuildingStorefrontIcon className="h-10 w-10 text-blue-100" />
            <div className="ml-4">
              <h2 className="text-2xl font-bold">Welcome to RepairLink</h2>
              <p className="text-blue-100">Let's set up your business profile to get started</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/vendor/business')}
            className="rounded-lg bg-white px-4 py-2 font-medium text-blue-700 shadow-sm hover:bg-blue-50"
          >
            Start Setup
          </button>
        </div>
      </div>
      
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
          Complete these steps to set up your business
        </h3>
        
        <div className="space-y-4">
          <SetupStep
            number={1}
            title="Create your business profile"
            description="Add your business name, contact information, and address"
            link="/vendor/business"
            buttonText="Create Profile"
          />
          
          <SetupStep
            number={2}
            title="Add your services"
            description="List the services you offer with pricing and descriptions"
            link="/vendor/services"
            buttonText="Add Services"
            disabled={true}
          />
          
          <SetupStep
            number={3}
            title="Set your availability"
            description="Define your working hours and availability for bookings"
            link="/vendor/calendar"
            buttonText="Set Hours"
            disabled={true}
          />
          
          <SetupStep
            number={4}
            title="Complete verification"
            description="Verify your business to build customer trust"
            link="/vendor/verification"
            buttonText="Verify Business"
            disabled={true}
          />
        </div>
      </div>
      
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <div className="flex">
          <div className="flex-shrink-0">
            <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Complete your business profile to unlock all vendor features and start receiving service requests.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Individual setup step component
const SetupStep = ({ number, title, description, link, buttonText, disabled = false }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-start rounded-lg border border-gray-200 p-4 dark:border-slate-700">
      <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
        {number}
      </div>
      <div className="flex-grow">
        <h4 className="text-md font-medium text-gray-900 dark:text-white">{title}</h4>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <button
        onClick={() => navigate(link)}
        disabled={disabled}
        className={`ml-4 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ${
          disabled
            ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-700 dark:text-slate-500'
            : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
        }`}
      >
        {buttonText}
      </button>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [provider, setProvider] = useState(null);
  const [stats, setStats] = useState({
    todayBookings: 0,
    pendingBookings: 0,
    todayEarnings: 0,
    nextAppointment: null,
    totalServices: 0,
    averageRating: 0,
    totalReviews: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [noBusinessProfile, setNoBusinessProfile] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({});
  const [servicesMap, setServicesMap] = useState({});

  // Add this function to fetch service details by ID
  const fetchServiceById = async (serviceId) => {
    try {
      const response = await apiClient.get(`/v1/services/${serviceId}`);
      return response.data;
    } catch (error) {
      return null;
    }
  };

  // Updated fetchDashboardData function for Dashboard.jsx
  const fetchDashboardData = async () => {
    setIsLoading(true);
    setIsRefreshing(true);
    setError(null);
    setNoBusinessProfile(false);
    
    try {
      // STEP 1: Get current authenticated user directly from the API
      let currentUser;
      
      try {
        const authResponse = await apiClient.get('/auth/me');
        if (authResponse?.data?.email) {
          currentUser = authResponse.data;
          // Update localStorage with the latest user data
          localStorage.setItem('user', JSON.stringify(currentUser));
        } else {
          throw new Error("No user data returned from auth endpoint");
        }
      } catch (authError) {
        throw new Error("Authentication failed. Please log in again.");
      }
      
      // STEP 2: Get provider data using the email from auth response
      let providerData;
      
      try {
        // Step 2.1: First get user details by email to get the userID
        const userResponse = await apiClient.get(`/v1/users/by-email/${encodeURIComponent(currentUser.email)}`);
        
        if (!userResponse?.data || !userResponse.data.userID) {
          throw new Error("Could not retrieve user details from email");
        }
        
        const userId = userResponse.data.userID;
        
        // Step 2.2: Use the userID to get the provider data
        const providerResponse = await apiClient.get(`/v1/service-providers/by-user/${userId}`);
        providerData = providerResponse.data;
      } catch (providerError) {
        // Check if error indicates no business profile
        if (providerError.response && 
            (providerError.response.status === 404 || 
             (providerError.response.status === 500 && 
              providerError.response.data?.message?.includes('not found')))) {
          setNoBusinessProfile(true);
          throw new Error("Business profile not found. Please create a business profile.");
        }
        
        throw new Error("Failed to retrieve provider profile. Please try again.");
      }
      
      // Set provider data in state
      setProvider(providerData);
      
      if (!providerData || !providerData.providerID) {
        throw new Error("Provider data is incomplete. Please update your business profile.");
      }
      
      const providerID = providerData.providerID;
      
      // STEP 3: Load all required data in parallel for better performance
      const [servicesResponse, bookingsResponse, reviewsResponse] = await Promise.allSettled([
        apiClient.get(`/v1/services/provider/${providerID}`),
        apiClient.get(`/v1/bookings/provider/${providerID}`),
        apiClient.get(`/v1/reviews/provider/${providerID}`)
          .catch(() => ({ data: [] }))
      ]);
      
      // Process services
      const services = servicesResponse.status === 'fulfilled' ? servicesResponse.value.data || [] : [];
      
      // Process bookings
      const allBookings = bookingsResponse.status === 'fulfilled' ? bookingsResponse.value.data || [] : [];
      
      // Process reviews
      const reviews = reviewsResponse.status === 'fulfilled' ? reviewsResponse.value.data || [] : [];
      
      // STEP 4: Calculate dashboard metrics
      const today = startOfToday();
      
      // Today's bookings
      const todayBookings = allBookings.filter(booking => {
        try {
          const bookingDate = new Date(booking.appointmentDateTime || booking.bookingDate);
          return isToday(bookingDate);
        } catch (err) {
          return false;
        }
      });
      
      // Pending and confirmed bookings
      const pendingBookings = allBookings.filter(booking => 
        booking.status === 'PENDING' || booking.status === 'CONFIRMED'
      );
      
      // Sort upcoming bookings by date
      const upcoming = pendingBookings
        .filter(booking => {
          try {
            const bookingDate = new Date(booking.appointmentDateTime || booking.bookingDate);
            return bookingDate >= today;
          } catch (err) {
            return false;
          }
        })
        .sort((a, b) => new Date(a.appointmentDateTime || a.bookingDate) - new Date(b.appointmentDateTime || b.bookingDate))
        .slice(0, 5);
      
      // Get recent bookings
      const recent = [...allBookings]
        .sort((a, b) => {
          try {
            return new Date(b.appointmentDateTime || b.bookingDate) - new Date(a.appointmentDateTime || a.bookingDate);
          } catch (err) {
            return 0;
          }
        })
        .slice(0, 5);
      
      // Calculate today's earnings
      const todayEarnings = todayBookings.reduce((sum, booking) => {
        const service = services.find(s => s.serviceID === booking.serviceID);
        return sum + (service?.price || 0);
      }, 0);
      
      // Find next appointment
      const nextAppointment = upcoming[0] || null;
      
      // Calculate average rating
      let averageRating = 0;
      if (reviews.length > 0) {
        const ratingSum = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
        averageRating = parseFloat((ratingSum / reviews.length).toFixed(1));
      }
      
      // Generate chart data for last 7 days
      const last7Days = [];
      const bookingsByDate = {};
      const revenueByDate = {};
      
      // Initialize with zeros
      for (let i = 6; i >= 0; i--) {
        const date = subDays(today, i);
        const dateStr = format(date, 'yyyy-MM-dd');
        bookingsByDate[dateStr] = 0;
        revenueByDate[dateStr] = 0;
      }
      
      // Count bookings and revenue by date
      allBookings.forEach(booking => {
        try {
          const bookingDate = new Date(booking.appointmentDateTime || booking.bookingDate);
          const dateStr = format(bookingDate, 'yyyy-MM-dd');
          
          // Only consider dates in the last 7 days
          if (bookingsByDate[dateStr] !== undefined) {
            bookingsByDate[dateStr] += 1;
            
            // Add to revenue if it's a confirmed or completed booking
            if (booking.status === 'CONFIRMED' || booking.status === 'COMPLETED') {
              const service = services.find(s => s.serviceID === booking.serviceID);
              revenueByDate[dateStr] += (service?.price || 0);
            }
          }
        } catch (err) {
          // Skip invalid dates
        }
      });
      
      // Format chart data
      for (let i = 6; i >= 0; i--) {
        const date = subDays(today, i);
        const dateStr = format(date, 'yyyy-MM-dd');
        const formattedDate = format(date, 'MMM dd');
        
        last7Days.push({
          date: formattedDate,
          bookings: bookingsByDate[dateStr] || 0,
          revenue: revenueByDate[dateStr] || 0
        });
      }
      
      // STEP 5: Update state with all the calculated data
      setStats({
        todayBookings: todayBookings.length,
        pendingBookings: pendingBookings.length,
        todayEarnings,
        nextAppointment,
        totalServices: services.length,
        averageRating: parseFloat(averageRating.toFixed(1)),
        totalReviews: reviews.length
      });
      
      setRecentBookings(recent);
      setUpcomingBookings(upcoming);
      setChartData(last7Days);
      
      // STEP 6: Fetch customer details for recent and upcoming bookings
      const uniqueCustomerIds = [...new Set(
        [...recent, ...upcoming].map(booking => booking.customerID).filter(Boolean)
      )];
      
      // Process each customer ID
      for (const customerId of uniqueCustomerIds) {
        if (!customerId || customerInfo[customerId]) continue;
        
        try {
          // Step 1: Get customer's user ID
          const customerResponse = await apiClient.get(`/v1/customers/${customerId}`);
          
          if (!customerResponse?.data || !customerResponse.data.userID) {
            setCustomerInfo(prev => ({
              ...prev,
              [customerId]: { fullName: `Customer #${customerId}` }
            }));
            continue;
          }
          
          const userId = customerResponse.data.userID;
          
          // Step 2: Get user details using user ID
          const userResponse = await apiClient.get(`/v1/users/${userId}`);
          
          if (!userResponse?.data) {
            setCustomerInfo(prev => ({
              ...prev,
              [customerId]: { fullName: `Customer #${customerId}` }
            }));
            continue;
          }
          
          const userData = userResponse.data;
          
          // Step 3: Store the customer information in state
          setCustomerInfo(prev => ({
            ...prev,
            [customerId]: {
              name: userData.name || '',
              surname: userData.surname || '',
              email: userData.email || '',
              phoneNumber: userData.phoneNumber || '',
              fullName: userData.name && userData.surname 
                ? `${userData.name} ${userData.surname}`
                : `Customer #${customerId}`
            }
          }));
        } catch (error) {
          setCustomerInfo(prev => ({
            ...prev,
            [customerId]: { fullName: `Customer #${customerId}` }
          }));
        }
      }

      // Extract unique service IDs from bookings
      const uniqueServiceIds = [...new Set(
        allBookings.map(booking => booking.serviceID).filter(Boolean)
      )];
      
      // Fetch service details for each unique ID
      const servicesData = {};
      
      // Use Promise.all to fetch services in parallel
      const servicePromises = uniqueServiceIds.map(async (serviceId) => {
        try {
          const service = await fetchServiceById(serviceId);
          if (service) {
            servicesData[serviceId] = service;
          }
        } catch (err) {
          // Silently handle service fetch errors
        }
      });
      
      await Promise.all(servicePromises);
      
      // Store the services map in state
      setServicesMap(servicesData);
      
    } catch (error) {
      // Set proper error state based on the error message
      if (error.message.includes('Business profile not found')) {
        setNoBusinessProfile(true);
      } else {
        setError(error.message || 'Failed to load dashboard data. Please try again.');
        toast.error('Failed to load dashboard data');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        await fetchDashboardData();
      } catch (error) {
        // Try again after a short delay - this helps with timing issues in auth state
        setTimeout(() => {
          fetchDashboardData().catch(err => {
          });
        }, 1000);
      }
    };
    
    loadDashboard();
    
    // We don't depend on user here because we're always fetching fresh data from the API
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Skip if no recent bookings
    if (!recentBookings || recentBookings.length === 0) return;

    const fetchAllCustomerDetails = async () => {
      // Get unique customer IDs
      const uniqueCustomerIds = [...new Set(
        recentBookings.map(booking => booking.customerID).filter(Boolean)
      )];
      
      const fetchCustomerDetails = async (customerId) => {
        if (!customerId) return;
        
        // Skip if we already have this customer's info in state
        if (customerInfo[customerId]) {
          return;
        }
        
        try {
          // Step 1: Get customer's user ID from customer ID
          const customerResponse = await apiClient.get(`/v1/customers/${customerId}`);
          
          if (!customerResponse?.data || !customerResponse.data.userID) {
            // Add fallback to avoid refetching invalid customer IDs
            setCustomerInfo(prev => ({
              ...prev,
              [customerId]: { fullName: `Customer #${customerId}` }
            }));
            return;
          }
          
          const userId = customerResponse.data.userID;
          
          // Step 2: Get user's basic info using user ID
          const userResponse = await apiClient.get(`/v1/users/${userId}`);
          
          if (!userResponse?.data) {
            // Add fallback to avoid refetching invalid user IDs
            setCustomerInfo(prev => ({
              ...prev,
              [customerId]: { fullName: `Customer #${customerId}` }
            }));
            return;
          }
          
          const userData = userResponse.data;
          
          // Step 3: Store the customer information in state
          setCustomerInfo(prev => {
            const updatedInfo = {
              ...prev,
              [customerId]: {
                name: userData.name,
                surname: userData.surname,
                phoneNumber: userData.phoneNumber,
                email: userData.email,
                fullName: `${userData.name} ${userData.surname}`
              }
            };
            return updatedInfo;
          });
        } catch (error) {
          // Add fallback to avoid refetching failed customer IDs
          setCustomerInfo(prev => ({
            ...prev,
            [customerId]: { fullName: `Customer #${customerId}` }
          }));
        }
      };
      
      // Process customer IDs sequentially
      const processBatch = async () => {
        for (const customerId of uniqueCustomerIds) {
          await fetchCustomerDetails(customerId);
        }
      };
      
      processBatch();
    };
    
    fetchAllCustomerDetails();
  }, [recentBookings]);

  // Define cards for the stats section
  const cards = useMemo(() => [
    {
      title: "Today's Bookings",
      value: stats.todayBookings,
      icon: ClipboardDocumentListIcon,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50',
      darkBgColor: 'dark:bg-blue-900/20',
      link: '/vendor/orders'
    },
    {
      title: 'Pending Bookings',
      value: stats.pendingBookings,
      icon: ClockIcon,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50',
      darkBgColor: 'dark:bg-amber-900/20',
      link: '/vendor/orders'
    },
    {
      title: "Today's Earnings",
      value: formatCurrency(stats.todayEarnings),
      icon: CurrencyDollarIcon,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50',
      darkBgColor: 'dark:bg-green-900/20',
      link: '/vendor/statistics'
    },
    {
      title: 'Customer Rating',
      value: `${stats.averageRating} / 5`,
      icon: StarIcon,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50',
      darkBgColor: 'dark:bg-yellow-900/20',
      link: '/vendor/statistics'
    }
  ], [stats]);

  const formatAppointmentTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    
    try {
      const date = parseISO(dateTimeString);
      const now = new Date();
      
      if (isToday(date)) {
        return `Today at ${format(date, 'h:mm a')}`;
      } else if (isThisWeek(date, { weekStartsOn: 1 })) {
        return format(date, 'EEEE h:mm a');
      } else {
        return format(date, 'MMM d, h:mm a');
      }
    } catch (err) {
      return dateTimeString;
    }
  };

  // Replace the existing getServiceName function with this improved version
const getServiceName = (booking) => {
  if (!booking) {
    return 'Not Available';
  }
  
  // If we have the service details in our map, use it
  if (booking.serviceID && servicesMap[booking.serviceID]) {
    return servicesMap[booking.serviceID].serviceName;
  }
  
  // Otherwise fall back to other properties
  if (booking.serviceName) {
    return booking.serviceName;
  } else if (booking.service && booking.service.serviceName) {
    return booking.service.serviceName;
  } else if (booking.service && booking.service.name) {
    return booking.service.name;
  } 
  
  // If all else fails, show the ID
  return booking.serviceID ? `Service #${booking.serviceID}` : 'Unnamed Service';
};

  const getCustomerDisplayName = (booking) => {
    if (!booking) {
      return '';
    }
    
    if (booking.customerID && customerInfo[booking.customerID]) {
      return customerInfo[booking.customerID].fullName;
    }
    
    return `Customer #${booking?.customerID || 'Unknown'}`;
  };

  // If the user doesn't have a business profile, show the setup guide
  if (noBusinessProfile) {
    return <BusinessSetupGuide />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <button
          onClick={fetchDashboardData}
          className="inline-flex items-center mr-8 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
          disabled={isRefreshing}
        >
          <ArrowPathIcon className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Welcome Message */}
      {!isLoading && provider && (
        <div className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 p-6 text-white shadow-md dark:from-blue-700 dark:to-blue-900">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <h2 className="text-xl font-semibold">Welcome back, {provider.businessName || user?.name || 'Vendor'}</h2>
              <p className="mt-1 text-blue-100">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end">
              <div className="text-sm text-blue-100">Next appointment:</div>
              <div className="font-medium">
                {stats.nextAppointment ? (
                  formatAppointmentTime(stats.nextAppointment.appointmentDateTime || stats.nextAppointment.bookingDate)
                ) : (
                  'No upcoming appointments'
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-700 dark:bg-red-900/20">
          <ExclamationCircleIcon className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-4 text-lg font-medium text-red-800 dark:text-red-400">Failed to load dashboard</h3>
          <p className="mt-2 text-red-700 dark:text-red-300">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="mt-4 inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            <ArrowPathIcon className="mr-2 h-4 w-4" />
            Try Again
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex h-60 items-center justify-center rounded-lg border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-600 dark:border-blue-400"></div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading dashboard data...</p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, index) => (
            <Link
              key={index}
              to={card.link}
              className="rounded-lg border border-gray-200 bg-white p-6 transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                    {card.title}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                    {card.value}
                  </p>
                </div>
                <div className={`rounded-lg ${card.bgColor} ${card.darkBgColor} p-3`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Main Dashboard Content */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Booking Activity Chart */}
          <div className="rounded-lg border border-gray-200 bg-white overflow-hidden lg:col-span-2 dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-800/60">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Weekly Activity
              </h2>
            </div>
            <div className="p-6">
              <div className="h-80">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        stroke="#9CA3AF"
                      />
                      <YAxis 
                        stroke="#9CA3AF"
                        tick={{ fontSize: 12 }}
                        width={40}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(17, 24, 39, 0.8)',
                          border: 'none',
                          borderRadius: '0.5rem',
                          color: '#F9FAFB'
                        }}
                        itemStyle={{ color: '#F9FAFB' }}
                        labelStyle={{ color: '#F9FAFB', fontWeight: 'bold', marginBottom: '0.5rem' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="bookings" 
                        stackId="1" 
                        stroke="#3B82F6" 
                        fill="#3B82F6"
                        fillOpacity={0.6}
                        name="Bookings"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stackId="2" 
                        stroke="#10B981" 
                        fill="#10B981"
                        fillOpacity={0.6}
                        name="Revenue (ZAR)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <p className="text-gray-500 dark:text-slate-400">
                      No activity data available yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Upcoming Bookings */}
          <div className="rounded-lg border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-800/60">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Upcoming Bookings
                </h2>
                <Link 
                  to="/vendor/orders" 
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-slate-700">
              {upcomingBookings.length > 0 ? (
                upcomingBookings.map((booking) => (
                  <div key={booking.bookingID} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700/30">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {getServiceName(booking)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {getCustomerDisplayName(booking)}
                        </p>
                      </div>
                      <div className="ml-4 flex flex-shrink-0 flex-col items-end">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatAppointmentTime(booking.appointmentDateTime || booking.bookingDate)}
                        </p>
                        <div className="mt-1">
                          <StatusBadge status={booking.status} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex h-48 items-center justify-center p-4">
                  <p className="text-gray-500 dark:text-slate-400">
                    No upcoming bookings
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {!isLoading && !error && (
        <div className="rounded-lg border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-800/60">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h2>
              <Link 
                to="/vendor/orders" 
                className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View all bookings
              </Link>
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                <thead className="bg-gray-50 dark:bg-slate-800/60">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Service
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-slate-700 dark:bg-slate-800">
                  {recentBookings.length > 0 ? (
                    recentBookings.map((booking) => (
                      <tr key={booking.bookingID} className="hover:bg-gray-50 dark:hover:bg-slate-700/30">
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-200 dark:bg-slate-700">
                              <div className="flex h-full w-full items-center justify-center text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                {booking.customerID && customerInfo[booking.customerID]?.name 
                                  ? customerInfo[booking.customerID].name.charAt(0) 
                                  : '?'}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {getCustomerDisplayName(booking)}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {booking.customerID && customerInfo[booking.customerID]?.email
                                  ? customerInfo[booking.customerID].email
                                  : 'No email'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white">{getServiceName(booking)}</div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {formatAppointmentTime(booking.appointmentDateTime || booking.bookingDate)}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <StatusBadge status={booking.status} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        No recent bookings
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Services and Review Stats */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Active Services Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Services
              </h2>
              <Link
                to="/vendor/services"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Manage services
              </Link>
            </div>
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
                <UserGroupIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <div className="text-xl font-semibold text-gray-900 dark:text-white">
                  {stats.totalServices}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Active Services
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Link
                to="/vendor/services"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Add new service
                <ArrowSmallRightIcon className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Customer Ratings Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Customer Ratings
              </h2>
              <Link
                to="/vendor/statistics"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View analytics
              </Link>
            </div>
            <div className="flex items-center">
              <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/20">
                <StarIcon className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <div className="flex items-center">
                  <span className="text-xl font-semibold text-gray-900 dark:text-white">
                    {stats.averageRating}
                  </span>
                  <div className="ml-2 flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(stats.averageRating)
                            ? 'text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Based on {stats.totalReviews} reviews
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Link
                to="/vendor/statistics#reviews"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Review customer feedback
                <ArrowSmallRightIcon className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Business verification notice */}
      {!isLoading && !error && provider && !provider.verified && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
          <div className="flex">
            <div className="flex-shrink-0">
              <ShieldCheckIcon className="h-5 w-5 text-amber-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Your business is pending verification by RepairLink admins. Once approved, your business will appear in customer searches and you can start receiving bookings.
                <Link to="/vendor/verification" className="ml-2 font-medium text-amber-700 underline hover:text-amber-600 dark:text-amber-300 dark:hover:text-amber-200">
                  View status
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;