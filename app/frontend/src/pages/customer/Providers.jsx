import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  StarIcon,
  PhoneIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  CheckBadgeIcon,
  ClockIcon,
  CurrencyDollarIcon,
  XMarkIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  CheckIcon, // Add this import
  EnvelopeIcon, 
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { formatCurrency } from '../../utils/formatCurrency';
import { format } from 'date-fns';
import { publicAPI, customerAPI } from '../../services';
import { toast } from 'react-hot-toast';
import apiClient from '../../utils/apiClient';
import { useAuth } from '../../contexts/auth/AuthContext';

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
    
    console.log('Customer ID found:', customerData.customerID);
    return customerData.customerID;
  } catch (err) {
    console.error('Error fetching customer ID:', err);
    throw err;
  }
};

const CustomerProviders = () => {
  const { user } = useAuth();
  // Replace mock data with real state
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    rating: 'all',
    location: 'all'
  });
  
  // Keep your existing state for modals and selected items
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    notes: ''
  });
  
  // Add states for provider details
  const [providerServices, setProviderServices] = useState([]);
  const [providerReviews, setProviderReviews] = useState([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [providerReviewCounts, setProviderReviewCounts] = useState({});
  // Add provider review ratings state to track average ratings from actual reviews
  const [providerReviewRatings, setProviderReviewRatings] = useState({});

  // Fetch all providers
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get service providers with filters
        const response = await publicAPI.getServiceProviders({
          category: filters.category !== 'all' ? filters.category : undefined,
          rating: filters.rating !== 'all' ? filters.rating : undefined,
          location: filters.location !== 'all' ? filters.location : undefined,
          search: filters.search || undefined
        });
        
        setProviders(response.data);
        
        // Extract unique categories and locations for filter dropdowns
        if (response.data && response.data.length > 0) {
          const uniqueCategories = [...new Set(
            response.data
              .map(provider => provider.serviceCategory)
              .filter(category => category)
          )];
          
          const uniqueLocations = [...new Set(
            response.data
              .map(provider => {
                // Extract city from location string like "Sandton, Johannesburg"
                const locationParts = provider.location ? provider.location.split(',') : [];
                return locationParts.length > 0 ? locationParts[0].trim() : null;
              })
              .filter(location => location)
          )];
          
          setCategories(uniqueCategories);
          setLocations(uniqueLocations);
        }
      } catch (err) {
        console.error("Failed to fetch providers:", err);
        setError('Failed to load service providers. Please try again later.');
        toast.error('Failed to load service providers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, [filters]);

  // Fetch provider details (services and reviews) when a provider is selected
  useEffect(() => {
    if (!selectedProvider) return;
    
    const fetchProviderDetails = async () => {
      try {
        setIsLoadingDetails(true);
        
        // Fetch provider services
        const servicesResponse = await publicAPI.getProviderServices(selectedProvider.providerID);
        setProviderServices(servicesResponse.data || []);
        
        // Fetch provider reviews
        const reviewsResponse = await publicAPI.getProviderReviews(selectedProvider.providerID);
        setProviderReviews(reviewsResponse.data || []);
        
      } catch (err) {
        console.error("Failed to fetch provider details:", err);
        toast.error("Couldn't load provider details");
      } finally {
        setIsLoadingDetails(false);
      }
    };
    
    fetchProviderDetails();
  }, [selectedProvider]);

  // Fetch review counts when providers list changes
  useEffect(() => {
    const fetchReviewData = async () => {
      if (!providers.length) return;
      
      const counts = {};
      const ratings = {};
      
      // Create a promise for each provider to fetch their reviews
      const reviewPromises = providers.map(async (provider) => {
        try {
          const response = await publicAPI.getProviderReviews(provider.providerID);
          const reviews = response.data || [];
          
          // Store the count
          counts[provider.providerID] = reviews.length;
          
          // Calculate average rating from actual reviews
          if (reviews.length > 0) {
            const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
            ratings[provider.providerID] = (totalRating / reviews.length).toFixed(1);
          } else {
            ratings[provider.providerID] = "0.0";
          }
          
        } catch (err) {
          console.error(`Failed to fetch reviews for provider ${provider.providerID}:`, err);
          counts[provider.providerID] = 0;
          ratings[provider.providerID] = "0.0";
        }
      });
      
      // Wait for all promises to complete
      await Promise.all(reviewPromises);
      
      setProviderReviewCounts(counts);
      setProviderReviewRatings(ratings);
    };
    
    fetchReviewData();
  }, [providers]);

  // Keep your existing RatingStars component
  const RatingStars = ({ rating }) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          {star <= rating ? (
            <StarSolid className="h-4 w-4 text-yellow-400" />
          ) : (
            <StarIcon className="h-4 w-4 text-yellow-400" />
          )}
        </span>
      ))}
    </div>
  );

  // Update the provider profile modal to use real data
  const ProviderProfileModal = ({ provider, onClose }) => {
    const [activeTab, setActiveTab] = useState('services');
    
    // Add these state variables inside the ProviderProfileModal component:
    const [servicesPerPage] = useState(6);
    const [currentServicePage, setCurrentServicePage] = useState(1);
    const [reviewsPerPage] = useState(4);
    const [currentReviewPage, setCurrentReviewPage] = useState(1);
    
    // Calculate actual average rating from fetched reviews
    const calculatedRating = providerReviews.length > 0
      ? (providerReviews.reduce((sum, review) => sum + (review.rating || 0), 0) / providerReviews.length).toFixed(1)
      : provider.rating || "0.0";

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          {/* Background overlay */}
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

          {/* Modal panel */}
          <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all dark:bg-slate-800 sm:my-8 sm:w-full sm:max-w-4xl sm:align-middle">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 dark:text-slate-400 dark:hover:text-slate-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            {/* Provider info */}
            <div className="px-6 pt-6 pb-4 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent">
              <div className="flex items-start space-x-4">
                <img
                  src={provider.profilePicUrl || "/src/assets/images/hero/repair-2.jpg"}
                  alt={provider.businessName}
                  className="h-24 w-24 rounded-lg object-cover shadow-md ring-2 ring-white dark:ring-slate-700"
                  onError={(e) => {
                    e.target.src = "/src/assets/images/hero/repair-2.jpg"; // Fallback image
                  }}
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {provider.businessName}
                    </h2>
                    {provider.verified && (
                      <CheckBadgeIcon className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                    {provider.serviceCategory}
                  </p>
                  <div className="mt-2 flex items-center space-x-4">
                    <div className="flex items-center">
                      <RatingStars rating={parseFloat(calculatedRating)} />
                      <span className="ml-2 text-sm text-gray-500 dark:text-slate-400">
                        ({providerReviews.length} reviews • {calculatedRating} stars)
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                      <MapPinIcon className="mr-1.5 h-5 w-5" />
                      {provider.location}
                    </div>
                  </div>
                  {provider.about && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-slate-400 line-clamp-2 max-w-lg">
                      {provider.about}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
              <div className="flex overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setActiveTab('services')}
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === 'services'
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300'
                  }`}
                >
                  <span className="flex items-center">
                    <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Services {providerServices.length > 0 && <span className="ml-1 rounded-full bg-gray-100 dark:bg-slate-700 px-2 py-0.5 text-xs">{providerServices.length}</span>}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === 'reviews'
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300'
                  }`}
                >
                  <span className="flex items-center">
                    <StarIcon className="mr-2 h-5 w-5" />
                    Reviews {providerReviews.length > 0 && <span className="ml-1 rounded-full bg-gray-100 dark:bg-slate-700 px-2 py-0.5 text-xs">{providerReviews.length}</span>}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('about')}
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === 'about'
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300'
                  }`}
                >
                  <span className="flex items-center">
                    <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    About
                  </span>
                </button>
              </div>
            </div>

            {/* Tab content */}
            <div className="p-6">
              {isLoadingDetails ? (
                <div className="p-6 space-y-4">
                  <div className="animate-pulse space-y-6">
                    {activeTab === 'services' ? (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="rounded-lg border border-gray-200 p-4 dark:border-slate-700">
                            <div className="h-5 w-2/3 bg-gray-200 rounded dark:bg-slate-700"></div>
                            <div className="mt-2 h-3 bg-gray-200 rounded dark:bg-slate-700"></div>
                            <div className="mt-1 h-3 w-3/4 bg-gray-200 rounded dark:bg-slate-700"></div>
                            <div className="mt-4 flex items-center justify-between">
                              <div className="h-4 w-16 bg-gray-200 rounded dark:bg-slate-700"></div>
                              <div className="h-4 w-12 bg-gray-200 rounded dark:bg-slate-700"></div>
                            </div>
                            <div className="mt-3 h-8 bg-gray-200 rounded dark:bg-slate-700"></div>
                          </div>
                        ))}
                      </div>
                    ) : activeTab === 'reviews' ? (
                      <>
                        <div className="rounded-lg border border-gray-200 p-5 dark:border-slate-700">
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex flex-col items-center sm:items-start">
                              <div className="h-10 w-16 bg-gray-200 rounded dark:bg-slate-700"></div>
                              <div className="mt-2 h-4 w-24 bg-gray-200 rounded dark:bg-slate-700"></div>
                              <div className="mt-1 h-3 w-32 bg-gray-200 rounded dark:bg-slate-700"></div>
                            </div>
                            <div className="w-full sm:w-auto flex-1 max-w-xs space-y-2">
                              {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="flex items-center mt-2">
                                  <div className="w-7 h-3 bg-gray-200 rounded dark:bg-slate-700"></div>
                                  <div className="w-48 h-2 mx-2 bg-gray-200 rounded dark:bg-slate-700"></div>
                                  <div className="w-4 h-3 bg-gray-200 rounded dark:bg-slate-700"></div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        {[1, 2].map(i => (
                          <div key={i} className="rounded-lg border border-gray-200 p-4 dark:border-slate-700">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="h-5 w-32 bg-gray-200 rounded dark:bg-slate-700"></div>
                                <div className="mt-1 h-3 w-48 bg-gray-200 rounded dark:bg-slate-700"></div>
                              </div>
                              <div className="h-3 w-16 bg-gray-200 rounded dark:bg-slate-700"></div>
                            </div>
                            <div className="mt-3 h-12 bg-gray-200 rounded dark:bg-slate-700"></div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="rounded-lg border border-gray-200 p-5 dark:border-slate-700">
                            <div className="h-6 w-32 bg-gray-200 rounded dark:bg-slate-700"></div>
                            <div className="mt-4 h-4 bg-gray-200 rounded dark:bg-slate-700"></div>
                            <div className="mt-2 h-4 w-3/4 bg-gray-200 rounded dark:bg-slate-700"></div>
                            <div className="mt-2 h-4 w-1/2 bg-gray-200 rounded dark:bg-slate-700"></div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : activeTab === 'services' ? (
                <div className="space-y-6">
                  {providerServices.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                      No services available for this provider.
                    </div>
                  ) : (
                    <>
                      {/* Service grid with pagination */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        {providerServices
                          .slice((currentServicePage - 1) * servicesPerPage, currentServicePage * servicesPerPage)
                          .map((service) => (
                            <div
                              key={service.serviceID}
                              data-service-card
                              className="rounded-lg border border-gray-200 p-4 dark:border-slate-700 transition-all"
                            >
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                {service.serviceName}
                              </h3>
                              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400 line-clamp-2">
                                {service.description}
                              </p>
                              <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                                  <ClockIcon className="mr-1.5 h-5 w-5" />
                                  {service.duration}
                                </div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {formatCurrency(service.price)}
                                </div>
                              </div>
                              <button
                                onClick={() => handleServiceBook(service)}
                                className="mt-3 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                              >
                                Book Now
                              </button>
                            </div>
                          ))}
                      </div>

                      {/* Pagination controls - only show if multiple pages */}
                      {providerServices.length > servicesPerPage && (
                        <div className="flex justify-center mt-6 space-x-2">
                          <button
                            onClick={() => setCurrentServicePage(prev => Math.max(prev - 1, 1))}
                            disabled={currentServicePage === 1}
                            className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 dark:bg-slate-700 dark:text-slate-300"
                          >
                            &lt;
                          </button>
                          
                          <span className="px-3 py-1 text-sm text-gray-600 dark:text-slate-300">
                            Page {currentServicePage} of {Math.ceil(providerServices.length / servicesPerPage)}
                          </span>
                          
                          <button
                            onClick={() => setCurrentServicePage(prev => 
                              Math.min(prev + 1, Math.ceil(providerServices.length / servicesPerPage))
                            )}
                            disabled={currentServicePage === Math.ceil(providerServices.length / servicesPerPage)}
                            className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 dark:bg-slate-700 dark:text-slate-300"
                          >
                            &gt;
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : activeTab === 'reviews' ? (
                <div className="space-y-6">
                  {/* Reviews Summary */}
                  <div className="mb-6 rounded-lg border border-gray-200 p-5 dark:border-slate-700">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex flex-col items-center sm:items-start">
                        <div className="text-4xl font-bold text-gray-900 dark:text-white">
                          {calculatedRating}
                        </div>
                        <div className="mt-2">
                          <RatingStars rating={parseFloat(calculatedRating)} />
                        </div>
                        <div className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                          Based on {providerReviews.length} {providerReviews.length === 1 ? 'review' : 'reviews'}
                        </div>
                      </div>
                      
                      {/* Rating breakdown */}
                      <div className="w-full sm:w-auto flex-1 max-w-xs">
                        {[5, 4, 3, 2, 1].map(star => {
                          const count = providerReviews.filter(review => Math.round(review.rating) === star).length;
                          const percentage = providerReviews.length ? Math.round((count / providerReviews.length) * 100) : 0;
                          
                          return (
                            <div key={star} className="flex items-center mt-2">
                              <span className="w-7 text-sm text-gray-600 dark:text-slate-400">{star}</span>
                              <div className="w-48 h-2 mx-2 bg-gray-200 rounded dark:bg-slate-700">
                                <div 
                                  className="h-2 bg-yellow-400 rounded" 
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600 dark:text-slate-400">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
              
                  {/* Reviews List with Pagination */}
                  {providerReviews.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                      <div className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium">No reviews yet</h3>
                      <p>Be the first to review this service provider</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        {providerReviews
                          .slice((currentReviewPage - 1) * reviewsPerPage, currentReviewPage * reviewsPerPage)
                          .map((review) => (
                            <div
                              key={review.reviewID}
                              className="rounded-lg border border-gray-200 p-4 dark:border-slate-700"
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="font-medium text-gray-900 dark:text-white">
                                    {review.customerName || "Verified Customer"}
                                  </div>
                                  <div className="mt-1 text-sm text-gray-500 dark:text-slate-400 flex items-center">
                                    <span className="mr-3">{review.serviceType || "Service"}</span>
                                    <span className="flex items-center">
                                      <RatingStars rating={review.rating || 0} />
                                    </span>
                                  </div>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-slate-400">
                                  {review.createdAt ? format(new Date(review.createdAt), 'MMM dd, yyyy') : ""}
                                </div>
                              </div>
                              <p className="mt-3 text-gray-600 dark:text-slate-300">
                                {review.comment || "No comment provided."}
                              </p>
                            </div>
                          ))}
                      </div>
              
                      {/* Pagination for reviews */}
                      {providerReviews.length > reviewsPerPage && (
                        <div className="flex justify-center mt-6 space-x-2">
                          <button
                            onClick={() => setCurrentReviewPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentReviewPage === 1}
                            className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 dark:bg-slate-700 dark:text-slate-300"
                          >
                            &lt;
                          </button>
                          
                          <span className="px-3 py-1 text-sm text-gray-600 dark:text-slate-300">
                            Page {currentReviewPage} of {Math.ceil(providerReviews.length / reviewsPerPage)}
                          </span>
                          
                          <button
                            onClick={() => setCurrentReviewPage(prev => 
                              Math.min(prev + 1, Math.ceil(providerReviews.length / reviewsPerPage))
                            )}
                            disabled={currentReviewPage === Math.ceil(providerReviews.length / reviewsPerPage)}
                            className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 dark:bg-slate-700 dark:text-slate-300"
                          >
                            &gt;
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : activeTab === 'about' ? (
                <div className="space-y-6">
                  {/* About section with better layout and icons */}
                  <div className="rounded-lg border border-gray-200 p-5 dark:border-slate-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                      <svg className="h-5 w-5 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      About {provider.businessName}
                    </h3>
                    <div className="mt-4 text-gray-600 dark:text-slate-300 whitespace-pre-wrap prose max-w-none dark:prose-invert">
                      {provider.about ? (
                        <p>{provider.about}</p>
                      ) : (
                        <div className="text-center py-4 text-gray-500 dark:text-slate-400">
                          <p>No information provided by this service provider.</p>
                        </div>
                      )}
                    </div>
                    
                    {provider.verified && (
                      <div className="mt-4 flex items-center p-3 bg-blue-50 rounded-md dark:bg-blue-900/20">
                        <CheckBadgeIcon className="h-5 w-5 text-blue-500 mr-2" />
                        <p className="text-sm text-blue-700 dark:text-blue-400">
                          This provider has been verified by RepairLink, ensuring reliability and quality service.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Business hours section with improved layout */}
                  <div className="rounded-lg border border-gray-200 p-5 dark:border-slate-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                      <ClockIcon className="h-5 w-5 mr-2 text-blue-500" />
                      Business Hours
                    </h3>
                    <div className="mt-4">
                      {provider.businessHours ? (
                        <pre className="text-sm text-gray-600 dark:text-slate-300 whitespace-pre-line font-sans">
                          {provider.businessHours}
                        </pre>
                      ) : (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">Monday - Friday</span>
                            <span>8:00 AM - 5:00 PM</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Saturday</span>
                            <span>9:00 AM - 2:00 PM</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Sunday</span>
                            <span>Closed</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Contact information section with better formatting */}
                  <div className="rounded-lg border border-gray-200 p-5 dark:border-slate-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                      <svg className="h-5 w-5 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Contact Information
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-start">
                        <PhoneIcon className="h-5 w-5 mr-3 text-gray-500 dark:text-slate-400 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">Phone</div>
                          <a 
                            href={`tel:${provider.phoneNumber?.replace(/\s/g, '')}`} 
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {provider.phoneNumber || "Contact information not available"}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <EnvelopeIcon className="h-5 w-5 mr-3 text-gray-500 dark:text-slate-400 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">Business Email</div>
                          {provider.businessEmail ? (
                            <a 
                              href={`mailto:${provider.businessEmail}`} 
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {provider.businessEmail}
                            </a>
                          ) : (
                            <span className="text-gray-600 dark:text-slate-300">
                              Business email not provided
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start">
                        <GlobeAltIcon className="h-5 w-5 mr-3 text-gray-500 dark:text-slate-400 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">Website</div>
                          {provider.website ? (
                            <a 
                              href={provider.website.startsWith('http') ? provider.website : `https://${provider.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {provider.website}
                            </a>
                          ) : (
                            <span className="text-gray-600 dark:text-slate-300">
                              Website not available
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPinIcon className="h-5 w-5 mr-3 text-gray-500 dark:text-slate-400 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">Location</div>
                          <p className="text-gray-600 dark:text-slate-300">
                            {provider.location || "Location not specified"}
                          </p>
                          {provider.location && (
                            <a 
                              href={`https://maps.google.com/?q=${encodeURIComponent(provider.location)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline text-sm mt-1 inline-block"
                            >
                              View on Google Maps
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Other tabs...
                null
              )}
            </div>

            {/* Action buttons */}
            <div className="border-t border-gray-200 px-6 py-4 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
              <div className="flex justify-between items-center">
                {activeTab === 'services' && providerServices.length > 0 ? (
                  <div className="text-sm text-gray-500 dark:text-slate-400">
                    {providerServices.length} {providerServices.length === 1 ? 'service' : 'services'} available
                  </div>
                ) : activeTab === 'reviews' ? (
                  <div className="text-sm text-gray-500 dark:text-slate-400">
                    {calculatedRating} out of 5 stars from {providerReviews.length} {providerReviews.length === 1 ? 'review' : 'reviews'}
                  </div>
                ) : (
                  <div></div>
                )}
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                  >
                    Close
                  </button>
                  {activeTab === 'services' && providerServices.length > 0 && (
                    <button
                      onClick={() => {
                        // Scroll to the top of the services tab and set a visual indicator on the first service card
                        const firstService = document.querySelector('[data-service-card]');
                        if (firstService) {
                          firstService.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          firstService.classList.add('ring-2', 'ring-blue-500');
                          setTimeout(() => {
                            firstService.classList.remove('ring-2', 'ring-blue-500');
                          }, 1500);
                        }
                      }}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors flex items-center"
                    >
                      <svg className="mr-1.5 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Book a Service
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Booking Modal - Update to use backend
  const BookingModal = ({ provider, service, onClose }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingError, setBookingError] = useState('');
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);
    
    // Add confirmation state
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [readyToSubmit, setReadyToSubmit] = useState(false);
    
    // Separate form notes from booking data
    const [formNotes, setFormNotes] = useState('');
    
    // Get today's date for min attribute on date picker
    const today = new Date().toISOString().split('T')[0];
  
    // Effect to generate time slots when date changes
    useEffect(() => {
      // Store the date we're currently loading slots for to prevent duplicate loading
      const currentLoadingDate = bookingData.date;
      
      if (!currentLoadingDate) return;
      
      setLoadingTimeSlots(true);
      
      // Use this timeout to simulate API call
      const timeoutId = setTimeout(() => {
        // Check if the date is still the same when the timeout completes
        if (currentLoadingDate !== bookingData.date) return;
        
        try {
          // Generate time slots from 8:00 AM to 5:00 PM with 1-hour intervals
          const slots = [];
          for (let hour = 8; hour < 17; hour++) {
            // Format: "HH:00:00"
            const formattedHour = hour.toString().padStart(2, '0');
            slots.push(`${formattedHour}:00:00`);
          }
          
          // Make some slots unavailable based on date
          const dateValue = parseInt(currentLoadingDate.split('-')[2]); // Get day of month
          const unavailableCount = dateValue % 3; // 0, 1, or 2 slots unavailable
          
          if (unavailableCount > 0) {
            // Remove specific slots based on the date
            for (let i = 0; i < unavailableCount; i++) {
              const indexToRemove = (dateValue + i) % slots.length;
              if (indexToRemove >= 0 && indexToRemove < slots.length) {
                slots.splice(indexToRemove, 1);
              }
            }
          }
          
          setAvailableTimeSlots(slots);
          setBookingError('');
        } catch (err) {
          console.error("Error generating time slots:", err);
          setBookingError('Failed to generate available time slots');
          setAvailableTimeSlots([]);
        } finally {
          if (currentLoadingDate === bookingData.date) {
            setLoadingTimeSlots(false);
          }
        }
      }, 600);
      
      return () => clearTimeout(timeoutId);
    }, [bookingData.date]);
  
    // Update handle submit to use confirmation step
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Show confirmation dialog instead of submitting directly
      if (!showConfirmation) {
        setShowConfirmation(true);
        return;
      }
      
      // Only proceed if confirmation was approved
      if (readyToSubmit) {
        setBookingError('');
        setIsSubmitting(true);
    
        try {
          // Format date and time correctly for the API - ensure exact format matching
          const bookingDateTime = `${bookingData.date}T${bookingData.time.split(':00')[0]}:00:00`;
          
          // Format data for booking API - ensure IDs are numbers not strings
          const bookingPayload = {
            customerID: 1, // Hardcoded value for testing
            serviceID: Number(service.serviceID),
            providerID: Number(service.providerID),
            bookingDate: bookingDateTime,
            additionalNotes: formNotes || "No additional notes provided."
          };
          
          console.log("Sending booking payload:", JSON.stringify(bookingPayload));
          
          // Create booking through API
          const response = await customerAPI.createBooking(bookingPayload);
          
          // Show success message
          showSuccessNotification();
          
          // Close modal and reset form
          setTimeout(() => {
            onClose();
          }, 500);
        } catch (err) {
          console.error("Booking failed:", err);
          
          // Log the response data if available
          if (err.response && err.response.data) {
            console.error("Error response data:", err.response.data);
          }
          
          setShowConfirmation(false);
          setReadyToSubmit(false);
          const errorMessage = err.response?.data?.message || 'Failed to create booking';
          setBookingError(errorMessage);
          toast.error(errorMessage);
        } finally {
          setIsSubmitting(false);
        }
      }
    };
  
    // Helper component for time slot display
    const TimeSlotGrid = ({ timeSlots, selectedTime, onSelectTime }) => {
      // Group time slots by morning (before noon) and afternoon
      const morningSlots = timeSlots.filter(slot => {
        const hour = parseInt(slot.split(':')[0]);
        return hour < 12;
      });
      
      const afternoonSlots = timeSlots.filter(slot => {
        const hour = parseInt(slot.split(':')[0]);
        return hour >= 12;
      });
      
      const formatTimeSlot = (slot) => {
        const [hours, minutes] = slot.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour;
        return `${displayHour}:${minutes} ${ampm}`;
      };
      
      return (
        <div className="space-y-4">
          {morningSlots.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-2">Morning</h4>
              <div className="grid grid-cols-3 gap-2">
                {morningSlots.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => onSelectTime(slot)}
                    className={`py-2 px-3 text-sm rounded-md border ${
                      selectedTime === slot
                        ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-400'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    {formatTimeSlot(slot)}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {afternoonSlots.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-2">Afternoon</h4>
              <div className="grid grid-cols-3 gap-2">
                {afternoonSlots.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => onSelectTime(slot)}
                    className={`py-2 px-3 text-sm rounded-md border ${
                      selectedTime === slot
                        ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-400'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    {formatTimeSlot(slot)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    };
  
    // Helper functions for date handling
    const formatDateForDisplay = (dateString) => {
      const options = { weekday: 'long', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };
  
    const isWeekend = (dateString) => {
      const date = new Date(dateString);
      const day = date.getDay();
      return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
    };
  
    const getNextAvailableWeekday = (date) => {
      const nextDate = new Date(date);
      while (isWeekend(nextDate)) {
        nextDate.setDate(nextDate.getDate() + 1);
      }
      return nextDate.toISOString().split('T')[0];
    };
  
    // Custom toast for warnings
    const showWarning = (message) => {
      return toast(message, {
        icon: '⚠️',
        duration: 3000,
        style: {
          borderRadius: '10px',
          background: '#FEF3C7',
          color: '#92400E',
        },
      });
    };
  
    // Custom success notification
    const showSuccessNotification = () => {
      try {
        toast.custom(
          (t) => (
            <div 
              className={`${
                t.visible ? 'animate-enter' : 'animate-leave'
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 dark:bg-slate-800 dark:border dark:border-slate-700`}
            >
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center dark:bg-green-900/30">
                      <CheckIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Booking Successful!
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                      Your appointment has been confirmed.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col border-l border-gray-200 dark:border-slate-700">
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    window.location.href = '/customer/bookings'; 
                  }}
                  className="w-full border border-transparent p-3 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none dark:text-blue-400 dark:hover:text-blue-300"
                >
                  View Bookings
                </button>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border-t border-gray-200 p-3 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none dark:border-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                >
                  Close
                </button>
              </div>
            </div>
          ),
          {
            duration: 5000, // 5 seconds
            position: 'top-center'
          }
        );
        
        // Set a backup timeout just in case
        setTimeout(() => {
          toast.dismiss(); // This will dismiss all toasts
        }, 6000);
        
      } catch (err) {
        console.error('Error showing custom toast:', err);
        // Show a standard toast that will auto-dismiss
        toast.success('Booking created successfully!', { duration: 5000 });
      }
    };
  
    // Add state to track the customer ID
    const [customerID, setCustomerID] = useState(null);
    
    // Fetch the customer ID when the modal opens
    useEffect(() => {
      if (user && user.email) {
        getCustomerID(user.email)
          .then(id => setCustomerID(id))
          .catch(err => {
            console.error("Could not fetch customer ID:", err);
            setBookingError("Could not verify your account. Please try again.");
          });
      }
    }, [user]);
    
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
  
          <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all dark:bg-slate-800 sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
            <form onSubmit={handleSubmit}>
              <div className="px-6 pt-5 pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Book Service
                  </h3>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 dark:text-slate-400 dark:hover:text-slate-300"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
  
                <div className="mt-4 space-y-4">
                  {/* Service Details */}
                  <div className="rounded-lg border border-gray-200 p-4 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {service.serviceName}
                        </h4>
                        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                          {provider.businessName || 'Unknown Provider'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(service.price)}
                        </p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                          {service.duration}
                        </p>
                      </div>
                    </div>
                  </div>
  
                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                      Select Date
                    </label>
                    <input
                      type="date"
                      min={today}
                      value={bookingData.date}
                      onChange={(e) => {
                        const newDate = e.target.value;
                        
                        // If selecting the same date, don't reset
                        if (newDate === bookingData.date) return;
                        
                        const selectedDay = new Date(newDate).getDay();
                        // If it's a weekend, show message and select next available weekday
                        if (selectedDay === 0 || selectedDay === 6) {
                          showWarning('We don\'t offer services on weekends. Please select a weekday.');
                          const nextWeekday = getNextAvailableWeekday(newDate);
                          
                          // Set to next available weekday
                          setBookingData(prev => ({
                            ...prev,
                            date: nextWeekday,
                            time: ''
                          }));
                        } else {
                          // Clear time only if date changes
                          setBookingData(prev => ({
                            ...prev,
                            date: newDate,
                            time: ''
                          }));
                        }
                      }}
                      onKeyDown={(e) => e.preventDefault()} 
                      required
                      className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                    {bookingData.date && (
                      <span className="text-sm text-gray-500 dark:text-slate-400 mt-1 inline-block">
                        {formatDateForDisplay(bookingData.date)}
                      </span>
                    )}
                  </div>
  
                  {/* Time Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                      Select Time
                    </label>
                    
                    {bookingData.date ? (
                      loadingTimeSlots ? (
                        <div className="mt-2 p-4 bg-gray-50 rounded-md border border-gray-200 dark:bg-slate-800 dark:border-slate-700 flex justify-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                      ) : (
                        availableTimeSlots.length > 0 ? (
                          <div className="mt-2 p-4 bg-gray-50 rounded-md border border-gray-200 dark:bg-slate-800 dark:border-slate-700">
                            <TimeSlotGrid
                              timeSlots={availableTimeSlots}
                              selectedTime={bookingData.time}
                              onSelectTime={(slot) => setBookingData(prev => ({ ...prev, time: slot }))}
                            />
                          </div>
                        ) : (
                          <div className="mt-2 p-4 bg-yellow-50 rounded-md border border-yellow-100 dark:bg-yellow-900/20 dark:border-yellow-700/50">
                            <p className="text-sm text-yellow-700 dark:text-yellow-400 flex items-center">
                              <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                              No time slots available for this date. Please select another date.
                            </p>
                          </div>
                        )
                      )
                    ) : (
                      <div className="mt-2 p-4 bg-blue-50 rounded-md border border-blue-100 dark:bg-blue-900/20 dark:border-blue-700/50">
                        <p className="text-sm text-blue-700 dark:text-blue-400 flex items-center">
                          <InformationCircleIcon className="h-5 w-5 mr-2" />
                          Select a date first to see available time slots
                        </p>
                      </div>
                    )}
                  </div>
  
                  {/* Notes - Use separate form state */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                      Additional Notes
                    </label>
                    <textarea
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      placeholder="Any special requirements or instructions..."
                    />
                  </div>
  
                  {bookingError && (
                    <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400 flex items-start">
                      <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                      <span>{bookingError}</span>
                    </div>
                  )}
                </div>
              </div>
  
              <div className="border-t border-gray-200 px-6 py-4 dark:border-slate-700">
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !bookingData.date || !bookingData.time}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
  
        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
  
              <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all dark:bg-slate-800 sm:my-8 sm:w-full sm:max-w-md sm:align-middle">
                <div className="px-6 pt-5 pb-4">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                      <CheckIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                      Confirm your booking
                    </h3>
                    <div className="mt-3 text-sm text-gray-500 dark:text-slate-400">
                      <p>You are about to book:</p>
                      <p className="mt-2 font-medium text-gray-900 dark:text-white">{service.serviceName}</p>
                      <p className="mt-1">with {provider.businessName}</p>
                      <p className="mt-2">
                        on {new Date(bookingData.date).toLocaleDateString()} at {
                          new Date(`2000-01-01T${bookingData.time}`).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })
                        }
                      </p>
                      <p className="mt-3">Price: {formatCurrency(service.price)}</p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 px-6 py-4 dark:border-slate-700">
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowConfirmation(false);
                        setReadyToSubmit(false);
                      }}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSubmitting(true);
                        setReadyToSubmit(true);
                        
                        // Format date and time correctly for the API
                        const bookingDateTime = `${bookingData.date}T${bookingData.time.split(':00')[0]}:00:00`;
                        
                        // Make sure we have the customer ID
                        if (!customerID) {
                          setBookingError("Could not verify your customer account.");
                          setShowConfirmation(false);
                          setIsSubmitting(false);
                          return;
                        }
                        
                        // Format data for booking API
                        const bookingPayload = {
                          customerID: customerID, // Use dynamic customerID instead of hardcoded value
                          serviceID: Number(service.serviceID),
                          providerID: Number(service.providerID || provider.providerID),
                          bookingDate: bookingDateTime,
                          additionalNotes: formNotes || "No additional notes provided."
                        };
                        
                        console.log("Sending booking payload:", JSON.stringify(bookingPayload));
                        
                        // Create booking through API
                        customerAPI.createBooking(bookingPayload)
                          .then(response => {
                            console.log('Booking successful, showing notification');
                            // Show enhanced success notification
                            showSuccessNotification();
                            
                            // Add small delay before closing modal
                            setTimeout(() => {
                              onClose();
                            }, 500);
                          })
                          .catch(err => {
                            console.error("Booking failed:", err);
                            
                            // Log the response data if available
                            if (err.response && err.response.data) {
                              console.error("Error response data:", err.response.data);
                            }
                            
                            setShowConfirmation(false);
                            const errorMessage = err.response?.data?.message || 'Failed to create booking';
                            setBookingError(errorMessage);
                            toast.error(errorMessage);
                          })
                          .finally(() => {
                            setIsSubmitting(false);
                          });
                      }}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Keep your existing handler functions
  const handleViewProfile = (provider) => {
    setSelectedProvider(provider);
    setShowProfileModal(true);
  };

  const handleBookNow = (provider, service) => {
    setSelectedProvider(provider);
    setSelectedService(service);
    setShowBookingModal(true);
  };

  const handleServiceBook = (service) => {
    setSelectedService(service);
    setShowBookingModal(true);
  };

  // Filter providers on the client-side as backup
  const filteredProviders = providers.filter(provider => {
    // Case-insensitive search
    const searchMatch = filters.search === '' || 
      (provider.businessName && provider.businessName.toLowerCase().includes(filters.search.toLowerCase())) ||
      (provider.serviceCategory && provider.serviceCategory.toLowerCase().includes(filters.search.toLowerCase())) ||
      (provider.location && provider.location.toLowerCase().includes(filters.search.toLowerCase()));
    
    // Category filter
    const categoryMatch = filters.category === 'all' || 
      (provider.serviceCategory && provider.serviceCategory.toLowerCase() === filters.category.toLowerCase());
    
    // Rating filter
    const ratingMatch = filters.rating === 'all' || 
      (provider.rating && provider.rating >= parseInt(filters.rating));
    
    // Location filter
    const locationMatch = filters.location === 'all' ||
      (provider.location && provider.location.toLowerCase().includes(filters.location.toLowerCase()));
    
    return searchMatch && categoryMatch && ratingMatch && locationMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Service Providers
        </h1>
        <button
          onClick={() => document.getElementById('filters').classList.toggle('hidden')}
          className="mt-4 inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 sm:mt-0"
        >
          <AdjustmentsHorizontalIcon className="mr-2 h-5 w-5" />
          Filters
        </button>
      </div>

      {/* Search and Filters */}
      <div id="filters" className="space-y-4">
        <div className="relative">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search providers..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="rounded-lg border border-gray-300 px-4 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category.toLowerCase()}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={filters.rating}
            onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
            className="rounded-lg border border-gray-300 px-4 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          >
            <option value="all">All Ratings</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
          </select>

          <select
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="rounded-lg border border-gray-300 px-4 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          >
            <option value="all">All Locations</option>
            {locations.map(location => (
              <option key={location} value={location.toLowerCase()}>
                {location}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
          <p className="flex items-center">
            <ExclamationCircleIcon className="h-5 w-5 mr-2" />
            {error}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-sm font-medium text-red-700 underline dark:text-red-400"
          >
            Try again
          </button>
        </div>
      )}

      {/* Providers Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-3">
              <MagnifyingGlassIcon className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No providers found</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <button
              onClick={() => setFilters({ search: '', category: 'all', rating: 'all', location: 'all' })}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:hover:bg-blue-900/40"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredProviders.map((provider) => (
            <div
              key={provider.providerID}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={provider.profilePicUrl || '/src/assets/images/hero/repair-2.jpg'}
                  alt={provider.businessName}
                  className="h-48 w-full object-cover"
                  onError={(e) => {
                    e.target.src = "/src/assets/images/hero/repair-2.jpg"; // Fallback image
                  }}
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {provider.businessName}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                      {provider.serviceCategory}
                    </p>
                  </div>
                  {provider.verified && (
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                      Verified
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-center space-x-2">
                  <RatingStars rating={parseFloat(providerReviewRatings[provider.providerID] || provider.rating || 0)} />
                  <span className="text-sm text-gray-500 dark:text-slate-400">
                    ({providerReviewCounts[provider.providerID] || 0} reviews • {providerReviewRatings[provider.providerID] || provider.rating || 0} stars)
                  </span>
                </div>

                <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-slate-400">
                  <MapPinIcon className="mr-1.5 h-5 w-5 flex-shrink-0" />
                  {provider.location}
                </div>

                {/* Add this preview of the about text */}
                {provider.about && (
                  <p className="mt-3 text-sm text-gray-600 dark:text-slate-400 line-clamp-2">
                    {provider.about}
                  </p>
                )}

                <div className="mt-6">
                  <Link
                    onClick={(e) => {
                      e.preventDefault();
                      handleViewProfile(provider);
                    }}
                    to={`/providers/${provider.providerID}`}
                    className="block w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showProfileModal && selectedProvider && (
        <ProviderProfileModal
          provider={selectedProvider}
          onClose={() => {
            setShowProfileModal(false);
            setSelectedProvider(null);
            setProviderServices([]);
            setProviderReviews([]);
          }}
        />
      )}

      {showBookingModal && selectedProvider && selectedService && (
        <BookingModal
          provider={selectedProvider}
          service={selectedService}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedService(null);
            setBookingData({ date: '', time: '', notes: '' });
          }}
        />
      )}
    </div>
  );
};

export default CustomerProviders;