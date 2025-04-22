import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  BuildingStorefrontIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';
import { formatCurrency } from '../../utils/formatCurrency';
import { customerAPI, publicAPI } from '../../services';
import { useAuth } from '../../contexts/auth/AuthContext';
import { toast } from 'react-hot-toast';
import apiClient from '../../utils/apiClient'; // Add this import

// Loading skeleton component for bookings
const LoadingSkeleton = () => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="p-6 animate-pulse">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div className="h-6 w-1/2 bg-gray-200 rounded dark:bg-slate-700"></div>
              <div className="h-6 w-1/4 bg-gray-200 rounded dark:bg-slate-700"></div>
            </div>
            <div className="mt-2 h-4 w-3/4 bg-gray-200 rounded dark:bg-slate-700"></div>
          </div>

          <div className="space-y-3">
            {[...Array(5)].map((_, j) => (
              <div key={j} className="flex items-center">
                <div className="h-5 w-5 bg-gray-200 rounded-full dark:bg-slate-700"></div>
                <div className="ml-2 h-4 w-2/3 bg-gray-200 rounded dark:bg-slate-700"></div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 flex items-center justify-between border-t border-gray-200 dark:border-slate-700">
            <div className="h-6 w-1/4 bg-gray-200 rounded dark:bg-slate-700"></div>
            <div className="h-8 w-1/3 bg-gray-200 rounded dark:bg-slate-700"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Helper function to get customer ID from user email
const getCustomerID = async (email) => {
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
    
    return customerData.customerID;
  } catch (err) {
    console.error('Error fetching customer ID:', err);
    throw err;
  }
};

const Bookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
    pending: 0
  });
  const [cancelling, setCancelling] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false, 
    bookingId: null
  });
  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    bookingId: null,
    serviceName: '',
    providerName: ''
  });
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [user]);

  // Update the fetchBookings function to eliminate any remaining sample data
const fetchBookings = async () => {
  if (!user) return;
  
  setLoading(true);
  setError(null);
  
  try {
    const customerID = await getCustomerID(user.email);
    
    // Get bookings using the customer ID
    const bookingsResp = await customerAPI.getBookings(customerID);
    
    // Get all reviews for this customer
    let customerReviews = [];
    try {
      const reviewsResp = await customerAPI.getCustomerReviews(customerID);
      customerReviews = reviewsResp.data || [];
    } catch (err) {
      console.warn('Failed to fetch customer reviews', err);
    }
    
    // Process the bookings
    if (bookingsResp?.data) {
      const bookingsData = bookingsResp.data;
      const enhancedBookings = [];
      
      // Process each booking to include full service and provider details
      for (const booking of bookingsData) {
        try {
          // Step 1: Fetch service details for each booking
          let serviceDetails;
          try {
            const serviceResp = await publicAPI.getServices({ serviceID: booking.serviceID });
            serviceDetails = serviceResp.data.find(s => s.serviceID === booking.serviceID) || null;
          } catch (err) {
            console.warn(`Failed to fetch service details for ID ${booking.serviceID}`, err);
            serviceDetails = null;
          }
          
          // Step 2: Fetch provider details for each booking
          let providerDetails;
          try {
            const providerResp = await publicAPI.getServiceProviderById(booking.providerID);
            providerDetails = providerResp.data;
          } catch (err) {
            console.warn(`Failed to fetch provider details for ID ${booking.providerID}`, err);
            providerDetails = null;
          }
          
          // Step 3: Check if the booking has a review using the customer reviews
          const hasReview = customerReviews.some(review => review.bookingID === booking.bookingID);
          
          // Step 4: Combine all the data
          enhancedBookings.push({
            id: booking.bookingID,
            serviceName: serviceDetails?.serviceName || `Service #${booking.serviceID}`,
            serviceDescription: serviceDetails?.description || booking.additionalNotes || "",
            price: serviceDetails?.price || 0,
            duration: serviceDetails?.duration || "1 hour",
            provider: {
              name: providerDetails?.businessName || `Provider #${booking.providerID}`,
              location: providerDetails?.location || "Unknown Location",
              phone: providerDetails?.phoneNumber || "No phone number"
            },
            date: booking.bookingDate,
            status: booking.status,
            notes: booking.additionalNotes || "",
            hasReview: hasReview
          });
        } catch (err) {
          console.error(`Error processing booking ${booking.bookingID}:`, err);
          // Still include the booking with minimal details
          enhancedBookings.push({
            id: booking.bookingID,
            serviceName: `Service #${booking.serviceID}`,
            provider: {
              name: `Provider #${booking.providerID}`,
              location: "Unknown Location",
              phone: "No phone number"
            },
            date: booking.bookingDate,
            status: booking.status,
            notes: booking.additionalNotes || "",
            hasReview: false
          });
        }
      }
      
      setBookings(enhancedBookings);
      
      // Calculate stats
      setStats({
        total: enhancedBookings.length,
        upcoming: enhancedBookings.filter(b => b.status === 'CONFIRMED').length,
        completed: enhancedBookings.filter(b => b.status === 'COMPLETED').length,
        cancelled: enhancedBookings.filter(b => b.status === 'CANCELLED').length,
        pending: enhancedBookings.filter(b => b.status === 'PENDING').length
      });
    } else {
      // No bookings found
      setBookings([]);
      setStats({
        total: 0,
        upcoming: 0,
        completed: 0,
        cancelled: 0,
        pending: 0
      });
    }
  } catch (err) {
    console.error("Error fetching bookings:", err);
    setError("Failed to load bookings. Please try again later.");
    toast.error("Failed to load bookings");
    
    // Instead of using sample data, set empty state
    setBookings([]);
    setStats({
      total: 0,
      upcoming: 0,
      completed: 0,
      cancelled: 0,
      pending: 0
    });
  } finally {
    setLoading(false);
  }
};

// Update the cancelBooking function

const openCancelConfirmation = (bookingId) => {
  setConfirmDialog({
    isOpen: true,
    bookingId
  });
};

const cancelBooking = async () => {
  const bookingId = confirmDialog.bookingId;
  if (!bookingId) return;
  
  setCancelling(bookingId);
  
  try {
    // Use the correct API endpoint for updating booking status
    await customerAPI.updateBookingStatus(bookingId, "CANCELLED");
    
    // Update the state without fetching again
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'CANCELLED' } 
          : booking
      )
    );
    
    // Update stats
    setStats(prev => ({
      ...prev,
      upcoming: prev.upcoming - 1,
      cancelled: prev.cancelled + 1
    }));
    
    toast.success("Booking cancelled successfully");
  } catch (err) {
    console.error("Error cancelling booking:", err);
    toast.error("Failed to cancel booking");
  } finally {
    setCancelling(null);
    setConfirmDialog({ isOpen: false, bookingId: null });
  }
};

// Replace the existing handleLeaveReview function

const handleLeaveReview = (bookingId) => {
  const booking = bookings.find(b => b.id === bookingId);
  if (!booking) return;
  
  setReviewModal({
    isOpen: true,
    bookingId,
    serviceName: booking.serviceName,
    providerName: booking.provider?.name || 'Service Provider'
  });
  setReviewData({
    rating: 5,
    comment: ''
  });
};

// Add this function for submitting reviews

const submitReview = async () => {
  if (!reviewModal.bookingId || !reviewData.rating || !user) return;
  
  setSubmittingReview(true);
  
  try {
    const customerID = await getCustomerID(user.email);
    
    // Format data according to API requirements with the correct customerID
    const reviewPayload = {
      customerID: customerID,
      bookingID: reviewModal.bookingId,
      rating: reviewData.rating,
      comment: reviewData.comment.trim() || "No comments provided."
    };
    
    // Send review to API
    await customerAPI.createReview(reviewPayload);
    
    toast.success("Review submitted successfully!");
    setReviewModal({ isOpen: false, bookingId: null, serviceName: '', providerName: '' });
    
    // Update local state to mark the booking as reviewed
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === reviewModal.bookingId 
          ? { ...booking, hasReview: true } 
          : booking
      )
    );
  } catch (err) {
    console.error("Failed to submit review:", err);
    toast.error("Failed to submit review. Please try again.");
  } finally {
    setSubmittingReview(false);
  }
};

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400",
      CONFIRMED: "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400",
      CANCELLED: "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400",
      COMPLETED: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400"
    };
    return colors[status] || colors.PENDING;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleIcon className="mr-1 h-4 w-4" />;
      case 'CANCELLED':
        return <XCircleIcon className="mr-1 h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    try {
      // Parse ISO date or fallback to simple display
      return dateString.includes('T') 
        ? format(parseISO(dateString), 'MMM d, yyyy')
        : dateString;
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    try {
      if (timeString.includes('T')) {
        return format(parseISO(timeString), 'h:mm a');
      }
      
      // Handle case where time is just a string like "10:00 AM"
      return timeString;
    } catch (error) {
      return timeString;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter; // Exact match comparison instead of lowercase
  });

  if (error && !bookings.length) {
    return (
      <div className="space-y-6 mt-14">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-700 dark:bg-red-900/20">
          <ExclamationCircleIcon className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-4 text-lg font-medium text-red-800 dark:text-red-400">Failed to load bookings</h3>
          <p className="mt-2 text-red-700 dark:text-red-300">{error}</p>
          <button 
            onClick={fetchBookings}
            className="mt-4 inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            <ArrowPathIcon className="mr-2 h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      {/* Header with Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="text-sm font-medium text-gray-500 dark:text-slate-400">Total Bookings</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="text-sm font-medium text-gray-500 dark:text-slate-400">Upcoming</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{stats.upcoming}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="text-sm font-medium text-gray-500 dark:text-slate-400">Completed</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{stats.completed}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="text-sm font-medium text-gray-500 dark:text-slate-400">Pending</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{stats.pending}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="text-sm font-medium text-gray-500 dark:text-slate-400">Cancelled</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{stats.cancelled}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          My Bookings
        </h1>
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="all">All Bookings</option>
            <option value="CONFIRMED">Upcoming</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Mobile Book Button */}
      <div className="block md:hidden">
        <Link 
          to="/user/services"
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-center block"
        >
          Book New Service
        </Link>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {/* Bookings Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {booking.serviceName}
                      </h3>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        {booking.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-slate-400 line-clamp-2">
                      {booking.serviceDescription || booking.notes}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                      <BuildingStorefrontIcon className="mr-2 h-5 w-5 flex-shrink-0" />
                      {booking.provider?.name}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                      <MapPinIcon className="mr-2 h-5 w-5 flex-shrink-0" />
                      {booking.provider?.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                      <PhoneIcon className="mr-2 h-5 w-5 flex-shrink-0" />
                      {booking.provider?.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                      <CalendarIcon className="mr-2 h-5 w-5 flex-shrink-0" />
                      {formatDate(booking.date || booking.bookingDate)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                      <ClockIcon className="mr-2 h-5 w-5 flex-shrink-0" />
                      {formatTime(booking.date || booking.bookingDate)}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-slate-700">
                    <span className="text-lg font-medium text-gray-900 dark:text-white">
                      {formatCurrency(booking.price)}
                    </span>
                    
                    {booking.status === 'COMPLETED' && !booking.hasReview && (
                      <button 
                        onClick={() => handleLeaveReview(booking.id)}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                      >
                        Leave Review
                      </button>
                    )}

                    {booking.status === 'COMPLETED' && booking.hasReview && (
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center">
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Reviewed
                      </span>
                    )}
                    
                    {booking.status === 'CONFIRMED' && (
                      <button 
                        onClick={() => openCancelConfirmation(booking.id)}
                        className="rounded-lg border border-red-600 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-900/20"
                      >
                        Cancel
                      </button>
                    )}
                    
                    {booking.status === 'PENDING' && (
                      <button 
                        onClick={() => openCancelConfirmation(booking.id)}
                        className="rounded-lg border border-amber-600 px-4 py-2 text-sm font-medium text-amber-600 hover:bg-amber-50 disabled:opacity-50 dark:border-amber-500 dark:text-amber-500 dark:hover:bg-amber-900/20"
                      >
                        Cancel Request
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBookings.length === 0 && !loading && (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
              <p className="text-gray-500 dark:text-slate-400">No bookings found</p>
              <Link 
                to="/user/services"
                className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Book a Service
              </Link>
            </div>
          )}
        </>
      )}
      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
                 onClick={() => setConfirmDialog({ isOpen: false, bookingId: null })} />

            {/* Dialog content */}
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all dark:bg-slate-800 sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pt-5 pb-4 dark:bg-slate-800 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10">
                    <XCircleIcon className="h-6 w-6 text-red-600 dark:text-red-500" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                      Cancel Booking
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-slate-400">
                        Are you sure you want to cancel this booking? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 dark:bg-slate-700/30 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={cancelBooking}
                  disabled={cancelling === confirmDialog.bookingId}
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none disabled:opacity-50 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {cancelling === confirmDialog.bookingId ? (
                    <>
                      <svg className="mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Cancelling...
                    </>
                  ) : (
                    'Confirm Cancellation'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDialog({ isOpen: false, bookingId: null })}
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Keep Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Review Modal */}
      {reviewModal.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
                 onClick={() => setReviewModal({ isOpen: false, bookingId: null, serviceName: '', providerName: '' })} />

            {/* Modal content */}
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all dark:bg-slate-800 sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pt-5 pb-4 dark:bg-slate-800 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20 sm:mx-0 sm:h-10 sm:w-10">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-blue-600 dark:text-blue-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                      Leave a Review
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-slate-400">
                        How was your experience with {reviewModal.serviceName} by {reviewModal.providerName}?
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                      Your Rating
                    </label>
                    <StarRating 
                      rating={reviewData.rating}
                      onRatingChange={(newRating) => setReviewData(prev => ({ ...prev, rating: newRating }))}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                      Your Comments
                    </label>
                    <textarea
                      id="comment"
                      rows={4}
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      placeholder="Share details about your experience..."
                      value={reviewData.comment}
                      onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 dark:bg-slate-700/30 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={submitReview}
                  disabled={submittingReview}
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none disabled:opacity-50 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {submittingReview ? (
                    <>
                      <svg className="mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setReviewModal({ isOpen: false, bookingId: null, serviceName: '', providerName: '' })}
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Star Rating Component
const StarRating = ({ rating, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="p-1"
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => onRatingChange(star)}
        >
          <svg 
            className={`w-8 h-8 ${
              (hoverRating || rating) >= star 
                ? 'text-yellow-400' 
                : 'text-gray-300 dark:text-gray-600'
            }`}
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0L6.982 20.54a1 1 0 01-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        </button>
      ))}
    </div>
  );
};

export default Bookings;