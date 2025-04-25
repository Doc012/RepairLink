import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CalendarDaysIcon,
  StarIcon,
  ClockIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  PhoneIcon,
  CalendarIcon,
  ChevronRightIcon,
  XCircleIcon,
  CheckIcon,
  BuildingStorefrontIcon,
  PlusIcon,
  ExclamationCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/formatCurrency';
import { format, parseISO, isFuture } from 'date-fns';
import { toast } from 'react-hot-toast';
import { customerAPI, publicAPI } from '../../services';
import { useAuth } from '../../contexts/auth/AuthContext';
import apiClient from '../../utils/apiClient'; // Add this import

// Loading skeleton for the dashboard
const LoadingSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="sm:flex sm:items-center sm:justify-between">
      <div className="h-8 w-48 bg-gray-200 rounded dark:bg-slate-700"></div>
    </div>
    
    {/* Stats Grid Skeleton */}
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-start justify-between">
            <div>
              <div className="h-4 w-24 bg-gray-200 rounded dark:bg-slate-700"></div>
              <div className="mt-2 h-8 w-16 bg-gray-200 rounded dark:bg-slate-700"></div>
            </div>
            <div className="rounded-lg bg-gray-200 p-2 h-9 w-9 dark:bg-slate-700"></div>
          </div>
        </div>
      ))}
    </div>
    
    {/* Upcoming Bookings Skeleton */}
    <div className="rounded-lg border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700">
        <div className="h-6 w-40 bg-gray-200 rounded dark:bg-slate-700"></div>
      </div>
      <div className="p-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex sm:items-start sm:space-x-4">
            <div>
              <div className="h-6 w-48 bg-gray-200 rounded dark:bg-slate-700"></div>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-gray-200 mr-1.5 dark:bg-slate-700"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded dark:bg-slate-700"></div>
                </div>
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-gray-200 mr-1.5 dark:bg-slate-700"></div>
                  <div className="h-4 w-40 bg-gray-200 rounded dark:bg-slate-700"></div>
                </div>
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-gray-200 mr-1.5 dark:bg-slate-700"></div>
                  <div className="h-4 w-36 bg-gray-200 rounded dark:bg-slate-700"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {/* Recent Bookings Skeleton */}
    <div className="rounded-lg border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 bg-gray-200 rounded dark:bg-slate-700"></div>
          <div className="h-4 w-16 bg-gray-200 rounded dark:bg-slate-700"></div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 text-left dark:border-slate-700">
              <th className="whitespace-nowrap px-6 py-3">
                <div className="h-4 w-16 bg-gray-200 rounded dark:bg-slate-700"></div>
              </th>
              <th className="whitespace-nowrap px-6 py-3">
                <div className="h-4 w-16 bg-gray-200 rounded dark:bg-slate-700"></div>
              </th>
              <th className="whitespace-nowrap px-6 py-3">
                <div className="h-4 w-24 bg-gray-200 rounded dark:bg-slate-700"></div>
              </th>
              <th className="whitespace-nowrap px-6 py-3">
                <div className="h-4 w-16 bg-gray-200 rounded dark:bg-slate-700"></div>
              </th>
              <th className="whitespace-nowrap px-6 py-3">
                <div className="h-4 w-16 bg-gray-200 rounded dark:bg-slate-700"></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
            {[...Array(3)].map((_, i) => (
              <tr key={i}>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="h-4 w-32 bg-gray-200 rounded dark:bg-slate-700"></div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="h-4 w-24 bg-gray-200 rounded dark:bg-slate-700"></div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="h-4 w-32 bg-gray-200 rounded dark:bg-slate-700"></div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="h-4 w-16 bg-gray-200 rounded dark:bg-slate-700"></div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="h-4 w-16 bg-gray-200 rounded dark:bg-slate-700"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [customerID, setCustomerID] = useState(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedServices: 0,
    activeBookings: 0,
    averageRating: 0,
    totalSpent: 0
  });
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [userName, setUserName] = useState('');

  // Format date from ISO string
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (err) {
      return 'Invalid date';
    }
  };

  // Format time from ISO string
  const formatTime = (dateString) => {
    try {
      if (!dateString) return '';
      return format(parseISO(dateString), 'h:mm a');
    } catch (err) {
      return '';
    }
  };

  // Get customer ID from user email
  const fetchCustomerID = async (email) => {
    try {
      // Step 1: Get user details by email
      const userResponse = await apiClient.get(`/v1/users/by-email/${email}`);
      const userData = userResponse.data;
      
      if (!userData || !userData.userID) {
        throw new Error('Failed to get user details');
      }
      
      // Step 2: Get customer ID using userID
      const customerResponse = await apiClient.get(`/v1/customers/user/${userData.userID}`);
      const customerData = customerResponse.data;
      
      if (!customerData || !customerData.customerID) {
        throw new Error('Failed to get customer details');
      }
      
      setCustomerID(customerData.customerID);
      
      // Set name from user data
      setUserName(userData.name || 'Customer');
      
      return customerData.customerID;
    } catch (err) {
      console.error('Error fetching customer ID:', err);
      throw err;
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      if (!user || !user.email) {
        throw new Error('User not authenticated');
      }
      
      // Get customer ID from user email
      const custID = customerID || await fetchCustomerID(user.email);
      
      if (!custID) {
        throw new Error('Customer ID not found');
      }

      // 2. Fetch all bookings using customer ID
      const bookingsResponse = await customerAPI.getBookings(custID);
      const bookings = bookingsResponse.data || [];
      
      // 3. Fetch all reviews using customer ID
      const reviewsResponse = await customerAPI.getCustomerReviews(custID);
      const reviews = reviewsResponse.data || [];
      
      // 4. Process bookings and enhance with service details
      const processedBookings = [];
      let totalAmount = 0;
      
      for (const booking of bookings) {
        try {
          // Fetch service details
          let serviceDetails = null;
          try {
            const serviceResp = await publicAPI.getServices({ serviceID: booking.serviceID });
            serviceDetails = serviceResp.data.find(s => s.serviceID === booking.serviceID);
          } catch (err) {
            console.warn(`Failed to fetch service details for ID ${booking.serviceID}`, err);
          }
          
          // Fetch provider details
          let providerDetails = null;
          try {
            const providerResp = await publicAPI.getServiceProviderById(booking.providerID);
            providerDetails = providerResp.data;
          } catch (err) {
            console.warn(`Failed to fetch provider details for ID ${booking.providerID}`, err);
          }
          
          // Calculate if the booking has a review
          const hasReview = reviews.some(review => review.bookingID === booking.bookingID);
          
          // Create enhanced booking object
          const enhancedBooking = {
            id: booking.bookingID,
            serviceName: serviceDetails?.serviceName || `Service #${booking.serviceID}`,
            serviceDescription: serviceDetails?.description || '',
            price: serviceDetails?.price || 0,
            provider: {
              id: booking.providerID,
              name: providerDetails?.businessName || `Provider #${booking.providerID}`,
              location: providerDetails?.location || 'Unknown Location',
              phone: providerDetails?.phoneNumber || 'No phone number'
            },
            date: booking.bookingDate,
            status: booking.status,
            notes: booking.additionalNotes || '',
            hasReview
          };
          
          if (enhancedBooking.status === 'COMPLETED') {
            totalAmount += enhancedBooking.price;
          }
          
          processedBookings.push(enhancedBooking);
        } catch (err) {
          console.error(`Error processing booking: ${err}`);
        }
      }
      
      // 5. Calculate statistics
      const totalBookings = processedBookings.length;
      const completedServices = processedBookings.filter(b => b.status === 'COMPLETED').length;
      const activeBookings = processedBookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING').length;
      
      // Calculate average rating
      let averageRating = 0;
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        averageRating = +(totalRating / reviews.length).toFixed(1);
      }
      
      // 6. Set upcoming bookings (future CONFIRMED and PENDING)
      const upcoming = processedBookings
        .filter(booking => 
          (booking.status === 'CONFIRMED' || booking.status === 'PENDING') && 
          isFuture(new Date(booking.date))
        )
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3); // Limit to 3 upcoming bookings
      
      // 7. Set recent bookings (all, sorted by date, recent first)
      const recent = [...processedBookings]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5); // Limit to 5 recent bookings
      
      // 8. Update state
      setStats({
        totalBookings,
        completedServices,
        activeBookings,
        averageRating,
        totalSpent: totalAmount
      });
      
      setUpcomingBookings(upcoming);
      setRecentBookings(recent);
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
      if (showRefreshIndicator) {
        setIsRefreshing(false);
        toast.success('Dashboard refreshed');
      }
    }
  };

  // Initial data load
  useEffect(() => {
    if (user && user.email) {
      fetchDashboardData();
    }
  }, [user]);

  // Get status color for badges
  const getStatusColor = (status) => {
    const colors = {
      PENDING: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400",
      CONFIRMED: "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400",
      CANCELLED: "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400",
      COMPLETED: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400"
    };
    return colors[status] || colors.PENDING;
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckIcon className="mr-1.5 h-4 w-4" />;
      case 'CANCELLED':
        return <XCircleIcon className="mr-1.5 h-4 w-4" />;
      case 'CONFIRMED':
        return <CheckCircleIcon className="mr-1.5 h-4 w-4" />;
      case 'PENDING':
        return <ClockIcon className="mr-1.5 h-4 w-4" />;
      default:
        return null;
    }
  };

  // Handle booking click
  const handleBookingClick = (bookingId) => {
    navigate(`/user/bookings/${bookingId}`);
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Welcome{userName ? `, ${userName}` : ' Back'}
        </h1>
        <button 
          onClick={() => fetchDashboardData(true)} 
          className="mt-3 inline-flex items-center mr-12 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 dark:bg-slate-800 dark:text-white dark:ring-slate-600 dark:hover:bg-slate-700"
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <>
              <ArrowPathIcon className="mr-1.5 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <ArrowPathIcon className="mr-1.5 h-4 w-4" />
              Refresh
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <div className="flex">
            <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                {error}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <Link
          to="/user/services"
          className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
        >
          <div className="space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
              <PlusIcon className="h-6 w-6 text-blue-600 dark:text-blue-500" />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Book Service</p>
          </div>
        </Link>
        <Link
          to="/user/bookings"
          className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
        >
          <div className="space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <CalendarDaysIcon className="h-6 w-6 text-green-600 dark:text-green-500" />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">My Bookings</p>
          </div>
        </Link>
        <Link
          to="/user/reviews"
          className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
        >
          <div className="space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
              <StarIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">My Reviews</p>
          </div>
        </Link>
        <Link
          to="/user/profile"
          className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
        >
          <div className="space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-purple-600 dark:text-purple-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Profile</p>
          </div>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {/* Total Bookings */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                Total Bookings
              </p>
              <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.totalBookings}
              </p>
            </div>
            <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/20">
              <CalendarDaysIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to="/user/bookings"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View all bookings
            </Link>
          </div>
        </div>

        {/* Completed Services */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                Completed
              </p>
              <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.completedServices}
              </p>
            </div>
            <div className="rounded-lg bg-green-50 p-2 dark:bg-green-900/20">
              <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to="/user/bookings?filter=COMPLETED"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View completed services
            </Link>
          </div>
        </div>

        {/* Active Bookings */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                Active
              </p>
              <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.activeBookings}
              </p>
            </div>
            <div className="rounded-lg bg-amber-50 p-2 dark:bg-amber-900/20">
              <ClockIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to="/user/bookings?filter=CONFIRMED"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View active bookings
            </Link>
          </div>
        </div>

        {/* Average Rating */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                Rating
              </p>
              <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.averageRating}
                <span className="text-sm font-normal text-gray-500 dark:text-slate-400">/5</span>
              </p>
            </div>
            <div className="rounded-lg bg-yellow-50 p-2 dark:bg-yellow-900/20">
              <StarIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to="/user/reviews"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View my reviews
            </Link>
          </div>
        </div>

        {/* Total Spent */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                Total Spent
              </p>
              <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                {formatCurrency(stats.totalSpent)}
              </p>
            </div>
            <div className="rounded-lg bg-green-50 p-2 dark:bg-green-900/20">
              <CurrencyDollarIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xs text-gray-500 dark:text-slate-400">
              From {stats.completedServices} completed services
            </span>
          </div>
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div className="rounded-lg border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Upcoming Bookings
          </h2>
          {upcomingBookings.length > 0 && (
            <Link
              to="/user/bookings?filter=CONFIRMED"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View All
            </Link>
          )}
        </div>
        <div className="divide-y divide-gray-200 dark:divide-slate-700">
          {upcomingBookings.map((booking) => (
            <div 
              key={booking.id} 
              className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors"
              onClick={() => handleBookingClick(booking.id)}
            >
              <div className="sm:flex sm:items-center sm:justify-between">
                <div className="sm:flex sm:items-start sm:space-x-4">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mr-3">
                        {booking.serviceName}
                      </h3>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        {booking.status}
                      </span>
                    </div>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                        <BuildingStorefrontIcon className="mr-1.5 h-5 w-5" />
                        {booking.provider.name}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                        <CalendarIcon className="mr-1.5 h-5 w-5" />
                        {formatDate(booking.date)} at {formatTime(booking.date)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                        <MapPinIcon className="mr-1.5 h-5 w-5" />
                        {booking.provider.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                        <PhoneIcon className="mr-1.5 h-5 w-5" />
                        {booking.provider.phone}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between sm:mt-0 sm:flex-col sm:items-end">
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {formatCurrency(booking.price)}
                  </p>
                  <div className="mt-2">
                    <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          ))}
          {upcomingBookings.length === 0 && (
            <div className="p-6 text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center dark:bg-slate-700">
                <CalendarDaysIcon className="h-8 w-8 text-gray-400 dark:text-slate-400" />
              </div>
              <p className="text-gray-500 dark:text-slate-400">
                You don't have any upcoming bookings
              </p>
              <Link
                to="/user/services"
                className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                <PlusIcon className="-ml-1 mr-2 h-4 w-4" />
                Book a Service
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="rounded-lg border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Bookings
            </h2>
            <Link
              to="/user/bookings"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View All
            </Link>
          </div>
        </div>
        
        {recentBookings.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500 dark:text-slate-400">
              You don't have any recent bookings
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 text-left dark:border-slate-700">
                  <th className="whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-500 dark:text-slate-400">
                    Service
                  </th>
                  <th className="whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-500 dark:text-slate-400">
                    Provider
                  </th>
                  <th className="whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-500 dark:text-slate-400">
                    Date
                  </th>
                  <th className="whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-500 dark:text-slate-400">
                    Amount
                  </th>
                  <th className="whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-500 dark:text-slate-400">
                    Status
                  </th>
                  <th className="whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-500 dark:text-slate-400">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {recentBookings.map((booking) => (
                  <tr 
                    key={booking.id} 
                    className="hover:bg-gray-50 dark:hover:bg-slate-700/30 cursor-pointer"
                    onClick={() => handleBookingClick(booking.id)}
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {booking.serviceName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-slate-400">
                      {booking.provider.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-slate-400">
                      {formatDate(booking.date)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(booking.price)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        {booking.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookingClick(booking.id);
                        }}
                        className="text-sm font-medium text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* User Activity Summary */}
      {stats.completedServices > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Activity Summary
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.completedServices} 
                <span className="text-sm font-normal text-gray-500 dark:text-slate-400 ml-1">
                  services
                </span>
              </div>
              <div className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                Total services completed
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.averageRating.toFixed(1)}
                <span className="text-sm font-normal text-gray-500 dark:text-slate-400 ml-1">
                  rating
                </span>
              </div>
              <div className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                Average service rating
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats.totalSpent / Math.max(stats.completedServices, 1))}
              </div>
              <div className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                Average service cost
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.totalBookings - stats.completedServices - stats.activeBookings}
                <span className="text-sm font-normal text-gray-500 dark:text-slate-400 ml-1">
                  cancelled
                </span>
              </div>
              <div className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                Cancellation history
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;