import { useState, useEffect } from 'react';
import { 
  StarIcon,
  BuildingStorefrontIcon,
  CalendarDaysIcon,
  ChatBubbleLeftIcon,
  PencilSquareIcon,
  TrashIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { customerAPI, publicAPI } from '../../services';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/auth/AuthContext';
import apiClient from '../../utils/apiClient';

// Loading skeleton component for reviews
const LoadingSkeleton = () => (
  <div className="space-y-8">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="overflow-hidden rounded-lg bg-white shadow dark:bg-slate-800">
        <div className="animate-pulse px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="w-2/3">
              <div className="h-6 w-3/4 bg-gray-200 rounded dark:bg-slate-700"></div>
              <div className="mt-1 h-4 w-1/2 bg-gray-200 rounded dark:bg-slate-700"></div>
            </div>
            <div className="flex space-x-1">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="h-5 w-5 bg-gray-200 rounded-full dark:bg-slate-700"></div>
              ))}
            </div>
          </div>
          <div className="mt-2 flex items-center space-x-4">
            <div className="h-5 w-1/4 bg-gray-200 rounded dark:bg-slate-700"></div>
            <div className="h-5 w-1/4 bg-gray-200 rounded dark:bg-slate-700"></div>
          </div>
          <div className="mt-3">
            <div className="h-4 w-full bg-gray-200 rounded dark:bg-slate-700"></div>
            <div className="mt-2 h-4 w-5/6 bg-gray-200 rounded dark:bg-slate-700"></div>
          </div>
          <div className="mt-4 border-t border-gray-200 pt-4 dark:border-slate-700">
            <div className="flex justify-end space-x-2">
              <div className="h-9 w-24 bg-gray-200 rounded dark:bg-slate-700"></div>
              <div className="h-9 w-24 bg-gray-200 rounded dark:bg-slate-700"></div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Review editing modal
const ReviewModal = ({ review, isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(review ? review.rating : 5);
  const [comment, setComment] = useState(review ? review.comment : '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setComment(review.comment);
    } else {
      setRating(5);
      setComment('');
    }
  }, [review]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      await onSubmit(rating, comment);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        {/* Modal content */}
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all dark:bg-slate-800 sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 dark:bg-slate-800 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20 sm:mx-0 sm:h-10 sm:w-10">
                  <PencilSquareIcon className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                    {review ? 'Edit Review' : 'Write Review'}
                  </h3>
                  <div className="mt-2">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                        Your Rating
                      </label>
                      <div className="mt-1 flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className="p-1"
                            onClick={() => setRating(star)}
                          >
                            {star <= rating ? (
                              <StarIconSolid className="h-8 w-8 text-yellow-400" />
                            ) : (
                              <StarIcon className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                        Your Comments
                      </label>
                      <textarea
                        id="comment"
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        placeholder="Share details about your experience..."
                      />
                    </div>
                    
                    {error && (
                      <div className="mt-2 rounded-md bg-red-50 p-2 dark:bg-red-900/20">
                        <div className="flex">
                          <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                          <span className="ml-2 text-sm text-red-700 dark:text-red-400">{error}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 dark:bg-slate-700/30 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none disabled:opacity-50 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {submitting ? (
                  <>
                    <svg className="mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {review ? 'Updating...' : 'Submitting...'}
                  </>
                ) : (
                  review ? 'Update Review' : 'Submit Review'
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Delete confirmation modal
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all dark:bg-slate-800 sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 dark:bg-slate-800 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationCircleIcon className="h-6 w-6 text-red-600 dark:text-red-500" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  Delete Review
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    Are you sure you want to delete this review? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 dark:bg-slate-700/30 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none disabled:opacity-50 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {isDeleting ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                'Delete Review'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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

const CustomerReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('submitted');
  const [editReview, setEditReview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteReview, setDeleteReview] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newReviewBooking, setNewReviewBooking] = useState(null);
  const [customerID, setCustomerID] = useState(null);

  // Format date using date-fns
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (err) {
      return 'Invalid date';
    }
  };

  // Fetch reviews and completed bookings without reviews
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Get customer ID dynamically from authenticated user
        const custID = await getCustomerID(user.email);
        setCustomerID(custID);
        
        // Fetch customer reviews with dynamic customer ID
        const reviewsResponse = await customerAPI.getCustomerReviews(custID);
        let reviewsData = reviewsResponse.data || [];
        
        // Fetch customer bookings with dynamic customer ID
        const bookingsResponse = await customerAPI.getBookings(custID);
        let bookingsData = bookingsResponse.data || [];
        
        // Rest of your existing code remains the same
        // Process reviews with service and provider details
        const processedReviews = [];
        for (const review of reviewsData) {
          try {
            // Find the corresponding booking
            const booking = bookingsData.find(b => b.bookingID === review.bookingID);
            
            // Fetch service details
            let serviceDetails = null;
            try {
              const serviceResp = await publicAPI.getServices({ serviceID: booking?.serviceID });
              serviceDetails = serviceResp.data.find(s => s.serviceID === booking?.serviceID);
            } catch (err) {
              console.warn(`Failed to fetch service details: ${err}`);
            }
            
            // Fetch provider details
            let providerDetails = null;
            try {
              if (booking?.providerID) {
                const providerResp = await publicAPI.getServiceProviderById(booking.providerID);
                providerDetails = providerResp.data;
              }
            } catch (err) {
              console.warn(`Failed to fetch provider details: ${err}`);
            }
            
            processedReviews.push({
              id: review.reviewID,
              bookingId: review.bookingID,
              serviceName: serviceDetails?.serviceName || `Service #${booking?.serviceID || 'Unknown'}`,
              serviceId: booking?.serviceID,
              provider: {
                name: providerDetails?.businessName || `Provider #${booking?.providerID || 'Unknown'}`,
                location: providerDetails?.location || 'Unknown Location',
                id: booking?.providerID
              },
              rating: review.rating,
              comment: review.comment,
              createdAt: review.createdAt || new Date().toISOString(),
              serviceDate: booking?.bookingDate
            });
          } catch (err) {
            console.error(`Error processing review: ${err}`);
          }
        }
        
        // Find completed bookings without reviews
        const reviewedBookingIds = new Set(reviewsData.map(r => r.bookingID));
        const pendingReviewBookings = bookingsData
          .filter(booking => 
            booking.status === 'COMPLETED' && 
            !reviewedBookingIds.has(booking.bookingID)
          )
          .map(async (booking) => {
            let serviceName = `Service #${booking.serviceID}`;
            let providerName = `Provider #${booking.providerID}`;
            
            try {
              const serviceResp = await publicAPI.getServices({ serviceID: booking.serviceID });
              const serviceDetails = serviceResp.data.find(s => s.serviceID === booking.serviceID);
              if (serviceDetails) {
                serviceName = serviceDetails.serviceName;
              }
            } catch (err) {
              console.warn(`Failed to fetch service details: ${err}`);
            }
            
            try {
              const providerResp = await publicAPI.getServiceProviderById(booking.providerID);
              if (providerResp.data) {
                providerName = providerResp.data.businessName;
              }
            } catch (err) {
              console.warn(`Failed to fetch provider details: ${err}`);
            }
            
            return {
              bookingID: booking.bookingID,
              serviceID: booking.serviceID,
              providerID: booking.providerID,
              serviceName,
              providerName,
              completedAt: booking.bookingDate
            };
          });
        
        const resolvedPendingReviews = await Promise.all(pendingReviewBookings);
        setReviews(processedReviews);
        setPendingReviews(resolvedPendingReviews);
      } catch (err) {
        console.error('Failed to fetch reviews data:', err);
        setError('Failed to load reviews. Please try again later.');
        toast.error('Failed to load reviews');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  // Render stars for rating display
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span key={index}>
        {index < rating ? (
          <StarIconSolid className="h-5 w-5 text-yellow-400" />
        ) : (
          <StarIcon className="h-5 w-5 text-gray-300 dark:text-gray-600" />
        )}
      </span>
    ));
  };

  // Handle editing a review
  const handleEditReview = (review) => {
    setEditReview(review);
    setIsEditing(true);
  };

  // Handle deleting a review
  const handleDeleteClick = (review) => {
    setDeleteReview(review);
  };

  // Confirm delete review
  const confirmDeleteReview = async () => {
    if (!deleteReview || !customerID) return;
    
    setIsDeleting(true);
    try {
      await customerAPI.deleteReview(deleteReview.id, customerID); // Pass the customerID here
      setReviews(reviews.filter(r => r.id !== deleteReview.id));
      
      // Move the booking back to pending reviews
      const booking = {
        bookingID: deleteReview.bookingId,
        serviceID: deleteReview.serviceId,
        providerID: deleteReview.provider.id,
        serviceName: deleteReview.serviceName,
        providerName: deleteReview.provider.name,
        completedAt: deleteReview.serviceDate
      };
      setPendingReviews([...pendingReviews, booking]);
      
      toast.success('Review deleted successfully');
      setDeleteReview(null);
    } catch (err) {
      console.error('Failed to delete review:', err);
      toast.error('Failed to delete review');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle submitting a new or updated review
  const handleReviewSubmit = async (rating, comment) => {
    if (isEditing && editReview) {
      // Update existing review
      const reviewData = {
        customerID: customerID, // Use the dynamically retrieved customerID
        rating,
        comment
      };
      
      await customerAPI.updateReview(editReview.id, reviewData);
      
      // Update local state
      setReviews(reviews.map(r => 
        r.id === editReview.id 
          ? { ...r, rating, comment } 
          : r
      ));
      
      toast.success('Review updated successfully');
      setEditReview(null);
      setIsEditing(false);
    } else if (newReviewBooking) {
      // Create new review
      const reviewData = {
        customerID: customerID, // Replace hardcoded '1' with dynamic customerID
        bookingID: newReviewBooking.bookingID,
        rating,
        comment: comment || "No comments provided."
      };
      
      const response = await customerAPI.createReview(reviewData);
      
      // Add new review to list and remove from pending
      const newReview = {
        id: response.data.reviewID || Date.now(),
        bookingId: newReviewBooking.bookingID,
        serviceName: newReviewBooking.serviceName,
        serviceId: newReviewBooking.serviceID,
        provider: {
          name: newReviewBooking.providerName,
          location: 'Unknown Location',
          id: newReviewBooking.providerID
        },
        rating,
        comment,
        createdAt: new Date().toISOString(),
        serviceDate: newReviewBooking.completedAt
      };
      
      setReviews([...reviews, newReview]);
      setPendingReviews(pendingReviews.filter(b => b.bookingID !== newReviewBooking.bookingID));
      
      toast.success('Review submitted successfully');
      setNewReviewBooking(null);
    }
  };

  // Handle writing a new review
  const handleWriteReview = (booking) => {
    setNewReviewBooking(booking);
  };

  return (
    <div className="space-y-6 mt-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">My Reviews</h1>
      </div>

      <div className="border-b border-gray-200 dark:border-slate-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'submitted', label: 'Submitted Reviews' },
            { key: 'pending', label: 'Pending Reviews' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors
                ${activeTab === tab.key
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-300'
                }
              `}
            >
              {tab.label}
              {tab.key === 'pending' && pendingReviews.length > 0 && (
                <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  {pendingReviews.length}
                </span>
              )}
            </button>
          ))}
        </nav>
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

      <div className="space-y-8">
        {isLoading ? (
          <LoadingSkeleton />
        ) : activeTab === 'submitted' ? (
          reviews.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
              <p className="text-gray-500 dark:text-slate-400">
                You haven't submitted any reviews yet.
              </p>
              {pendingReviews.length > 0 && (
                <button
                  onClick={() => setActiveTab('pending')}
                  className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Write a Review
                </button>
              )}
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="overflow-hidden rounded-lg bg-white shadow dark:bg-slate-800"
              >
                <div className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {review.serviceName}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                        {review.provider.name}
                      </p>
                    </div>
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-slate-400">
                    <div className="flex items-center">
                      <BuildingStorefrontIcon className="mr-1.5 h-5 w-5" />
                      {review.provider.location}
                    </div>
                    <div className="flex items-center">
                      <CalendarDaysIcon className="mr-1.5 h-5 w-5" />
                      {formatDate(review.serviceDate)}
                    </div>
                  </div>
                  <div className="mt-3 space-y-3">
                    <div className="flex items-start space-x-2">
                      <ChatBubbleLeftIcon className="mt-1 h-5 w-5 flex-shrink-0 text-gray-400" />
                      <p className="text-sm text-gray-500 dark:text-slate-400">
                        {review.comment || "No comments provided."}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-gray-200 pt-4 dark:border-slate-700">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleEditReview(review)}
                        className="flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                      >
                        <PencilSquareIcon className="mr-1.5 h-4 w-4" />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(review)}
                        className="flex items-center rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-800/30 dark:bg-slate-700 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <TrashIcon className="mr-1.5 h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )
        ) : (
          pendingReviews.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
              <p className="text-gray-500 dark:text-slate-400">
                You don't have any pending reviews. All your completed services have been reviewed.
              </p>
            </div>
          ) : (
            pendingReviews.map((booking) => (
              <div
                key={booking.bookingID}
                className="overflow-hidden rounded-lg bg-white shadow dark:bg-slate-800"
              >
                <div className="px-6 py-4">
                  <div className="sm:flex sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {booking.serviceName}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                        {booking.providerName}
                      </p>
                      <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
                        Service completed on {formatDate(booking.completedAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleWriteReview(booking)}
                      className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 sm:mt-0"
                    >
                      Write Review
                    </button>
                  </div>
                </div>
              </div>
            ))
          )
        )}
      </div>
      
      {/* Review edit modal */}
      <ReviewModal
        review={editReview}
        isOpen={!!editReview && isEditing}
        onClose={() => {
          setEditReview(null);
          setIsEditing(false);
        }}
        onSubmit={handleReviewSubmit}
      />
      
      {/* New review modal */}
      <ReviewModal
        review={null}
        isOpen={!!newReviewBooking}
        onClose={() => setNewReviewBooking(null)}
        onSubmit={handleReviewSubmit}
      />
      
      {/* Delete confirmation modal */}
      <DeleteConfirmationModal
        isOpen={!!deleteReview}
        onClose={() => setDeleteReview(null)}
        onConfirm={confirmDeleteReview}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default CustomerReviews;