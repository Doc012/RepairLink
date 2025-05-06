import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  StarIcon, 
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  CheckIcon,
  FlagIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import apiClient from '../../utils/apiClient';
import { format, parseISO } from 'date-fns';

const Reviews = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc', 'date-asc', 'rating-desc', 'rating-asc'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [serviceMap, setServiceMap] = useState({});
  const [customerMap, setCustomerMap] = useState({});
  const itemsPerPage = 10;

  const fetchProviderProfile = async () => {
    try {
      // First get the current user
      const userResponse = await apiClient.get('/auth/me');
      if (!userResponse?.data?.email) {
        throw new Error("Unable to retrieve user information");
      }
      
      // Get user details by email to get the userID
      const userDetailResponse = await apiClient.get(`/v1/users/by-email/${encodeURIComponent(userResponse.data.email)}`);
      if (!userDetailResponse?.data?.userID) {
        throw new Error("Could not retrieve user details");
      }
      
      const userId = userDetailResponse.data.userID;
      
      // Get provider data using the user ID
      const providerResponse = await apiClient.get(`/v1/service-providers/by-user/${userId}`);
      return providerResponse.data;
    } catch (error) {
      console.error("Failed to fetch provider profile:", error);
      throw error;
    }
  };

  const fetchReviews = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get provider data first
      const providerData = await fetchProviderProfile();
      setProvider(providerData);
      
      if (!providerData?.providerID) {
        throw new Error("Provider profile not found. Please complete your business profile setup.");
      }
      
      const providerID = providerData.providerID;
      
      // Fetch reviews for the provider
      const response = await apiClient.get(`/v1/reviews/provider/${providerID}`);
      
      if (!response.data) {
        throw new Error("Failed to fetch reviews");
      }
      
      const reviewsData = response.data;
      setReviews(reviewsData);
      setTotalReviews(reviewsData.length);
      
      // Fetch service details for all reviews
      await fetchServiceDetails(reviewsData);
      
      // Fetch customer details for all reviews
      await fetchCustomerDetails(reviewsData);
      
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError(error.message || "Failed to load reviews. Please try again.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchServiceDetails = async (reviewsData) => {
    const uniqueServiceIds = [...new Set(reviewsData.map(review => review.serviceID).filter(Boolean))];
    const serviceData = {};
    
    for (const serviceId of uniqueServiceIds) {
      try {
        const response = await apiClient.get(`/v1/services/${serviceId}`);
        if (response.data) {
          serviceData[serviceId] = response.data;
        }
      } catch (error) {
        console.error(`Failed to fetch service with ID ${serviceId}:`, error);
        serviceData[serviceId] = { serviceName: `Service #${serviceId}` };
      }
    }
    
    setServiceMap(serviceData);
  };

  const fetchCustomerDetails = async (reviewsData) => {
    const uniqueCustomerIds = [...new Set(reviewsData.map(review => review.customerID).filter(Boolean))];
    const customerData = {};
    
    for (const customerId of uniqueCustomerIds) {
      try {
        // Get customer's user ID
        const customerResponse = await apiClient.get(`/v1/customers/${customerId}`);
        if (!customerResponse?.data?.userID) {
          customerData[customerId] = { fullName: `Customer #${customerId}` };
          continue;
        }
        
        const userId = customerResponse.data.userID;
        
        // Get user details
        const userResponse = await apiClient.get(`/v1/users/${userId}`);
        if (userResponse?.data) {
          const userData = userResponse.data;
          customerData[customerId] = {
            name: userData.name || '',
            surname: userData.surname || '',
            fullName: userData.name && userData.surname 
              ? `${userData.name} ${userData.surname}`
              : `Customer #${customerId}`,
            email: userData.email || '',
            phoneNumber: userData.phoneNumber || ''
          };
        } else {
          customerData[customerId] = { fullName: `Customer #${customerId}` };
        }
      } catch (error) {
        console.error(`Failed to fetch customer with ID ${customerId}:`, error);
        customerData[customerId] = { fullName: `Customer #${customerId}` };
      }
    }
    
    setCustomerMap(customerData);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchReviews();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterRatingChange = (e) => {
    setFilterRating(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const getServiceName = (review) => {
    if (!review?.serviceID) return "Unknown Service";
    return serviceMap[review.serviceID]?.serviceName || `Service #${review.serviceID}`;
  };

  const getCustomerName = (review) => {
    if (!review?.customerID) return "Anonymous Customer";
    return customerMap[review.customerID]?.fullName || `Customer #${review.customerID}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  // Filter and sort reviews
  const filteredReviews = reviews.filter(review => {
    // Apply rating filter
    if (filterRating !== 'all' && review.rating !== parseInt(filterRating)) {
      return false;
    }
    
    // Apply search term filter (search in comment text)
    if (searchTerm) {
      const serviceName = getServiceName(review).toLowerCase();
      const customerName = getCustomerName(review).toLowerCase();
      const commentText = (review.comment || "").toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      
      return serviceName.includes(searchLower) || 
             customerName.includes(searchLower) || 
             commentText.includes(searchLower);
    }
    
    return true;
  });

  // Sort filtered reviews
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.reviewDate || b.createdAt) - new Date(a.reviewDate || a.createdAt);
      case 'date-asc':
        return new Date(a.reviewDate || a.createdAt) - new Date(b.reviewDate || b.createdAt);
      case 'rating-desc':
        return b.rating - a.rating;
      case 'rating-asc':
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  // Paginate reviews
  const indexOfLastReview = currentPage * itemsPerPage;
  const indexOfFirstReview = indexOfLastReview - itemsPerPage;
  const currentReviews = sortedReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(sortedReviews.length / itemsPerPage);

  // Calculate summary statistics
  const stats = reviews.reduce((acc, review) => {
    acc.totalRating += review.rating || 0;
    acc.counts[review.rating] = (acc.counts[review.rating] || 0) + 1;
    return acc;
  }, { totalRating: 0, counts: {} });
  
  const averageRating = reviews.length > 0 ? (stats.totalRating / reviews.length).toFixed(1) : 0;
  
  // Calculate rating percentages
  const ratingPercentages = {};
  for (let i = 5; i >= 1; i--) {
    ratingPercentages[i] = reviews.length > 0 
      ? Math.round((stats.counts[i] || 0) / reviews.length * 100) 
      : 0;
  }

  // JSX for rendering star ratings
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon 
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Reviews</h1>
        <button 
          onClick={handleRefresh}
          className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          disabled={isRefreshing}
        >
          <ArrowPathIcon className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/30 dark:text-red-400">
          <div className="flex items-center">
            <ExclamationCircleIcon className="mr-3 h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
            <p className="mt-4 text-gray-500 dark:text-gray-400">Loading reviews...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Review Summary */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="col-span-1 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center">
                <div className="mr-4">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{averageRating}</div>
                  <div className="mt-1">{renderStars(Math.round(averageRating))}</div>
                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">Based on {reviews.length} reviews</div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center">
                    <div className="mr-2 flex w-10 items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      {rating} <StarIcon className="ml-1 h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                        <div 
                          className="h-2.5 rounded-full bg-blue-600 dark:bg-blue-500" 
                          style={{ width: `${ratingPercentages[rating] || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-2 w-10 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                      {ratingPercentages[rating] || 0}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-1 lg:col-span-2">
              {/* Filters */}
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="grid gap-4 md:grid-cols-3">
                  {/* Search */}
                  <div className="md:col-span-1">
                    <label htmlFor="search" className="sr-only">Search reviews</label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="search"
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-75 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        placeholder="Search reviews..."
                      />
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div className="md:col-span-1">
                    <label htmlFor="filter-rating" className="sr-only">Filter by rating</label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <FunnelIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="filter-rating"
                        value={filterRating}
                        onChange={handleFilterRatingChange}
                        className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-75 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      >
                        <option value="all">All Ratings</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                      </select>
                    </div>
                  </div>

                  {/* Sort By */}
                  <div className="md:col-span-1">
                    <label htmlFor="sort-by" className="sr-only">Sort by</label>
                    <select
                      id="sort-by"
                      value={sortBy}
                      onChange={handleSortChange}
                      className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-75 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    >
                      <option value="date-desc">Newest First</option>
                      <option value="date-asc">Oldest First</option>
                      <option value="rating-desc">Highest Rating</option>
                      <option value="rating-asc">Lowest Rating</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="rounded-t-lg border-b border-gray-200 bg-gray-50 px-6 py-3 dark:border-gray-700 dark:bg-gray-700/30">
              <h3 className="text-base font-medium text-gray-900 dark:text-white">
                {filteredReviews.length} {filteredReviews.length === 1 ? 'Review' : 'Reviews'} Found
              </h3>
            </div>

            {currentReviews.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {currentReviews.map((review) => (
                  <li key={review.reviewID} className="p-6">
                    <div className="flex flex-col space-y-4 md:flex-row md:space-x-6 md:space-y-0">
                      <div className="md:w-1/4">
                        <div className="mb-3 flex items-center">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                            {customerMap[review.customerID]?.name?.charAt(0) || 'C'}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {getCustomerName(review)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(review.reviewDate || review.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="flex mr-2">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{review.rating}/5</span>
                        </div>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          Service: {getServiceName(review)}
                        </p>
                      </div>
                      <div className="md:w-3/4">
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                          <div className="flex items-start">
                            <ChatBubbleOvalLeftEllipsisIcon className="mt-0.5 h-4 w-4 text-gray-400" />
                            <div className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                              {review.comment || "No comment provided"}
                            </div>
                          </div>
                        </div>
                        {review.vendorReply && (
                          <div className="mt-4 ml-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                            <div className="flex items-start">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800/50">
                                <CheckIcon className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div className="ml-2">
                                <p className="text-xs font-medium text-blue-900 dark:text-blue-400">Your reply</p>
                                <p className="mt-1 text-sm text-blue-800 dark:text-blue-300">
                                  {review.vendorReply}
                                </p>
                                <p className="mt-1 text-xs text-blue-700 dark:text-blue-400">
                                  {formatDate(review.replyDate)}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="mt-4 flex justify-end space-x-2">
                          {!review.vendorReply && (
                            <button
                              type="button"
                              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                            >
                              <ChatBubbleOvalLeftEllipsisIcon className="mr-1.5 h-4 w-4" />
                              Reply
                            </button>
                          )}
                          <button
                            type="button"
                            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                          >
                            <FlagIcon className="mr-1.5 h-4 w-4" />
                            Report
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center p-8">
                <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-700">
                  <ChatBubbleOvalLeftEllipsisIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No reviews found</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  {reviews.length > 0 
                    ? 'Try adjusting your filters to see more reviews' 
                    : 'You have not received any customer reviews yet'}
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 dark:border-gray-700">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage <= 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage >= totalPages}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-400">
                      Showing <span className="font-medium">{indexOfFirstReview + 1}</span> to{" "}
                      <span className="font-medium">
                        {Math.min(indexOfLastReview, filteredReviews.length)}
                      </span>{" "}
                      of <span className="font-medium">{filteredReviews.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage <= 1}
                        className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeftIcon className="h-5 w-5" />
                      </button>
                      
                      {/* Page numbers */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center border border-gray-300 px-4 py-2 text-sm font-medium ${
                            currentPage === page
                              ? 'bg-blue-600 text-white dark:bg-blue-700'
                              : 'bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage >= totalPages}
                        className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRightIcon className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Reviews;