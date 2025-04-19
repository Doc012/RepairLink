import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { 
  MapPinIcon, 
  CheckBadgeIcon, 
  ClockIcon,
  CalendarIcon,
  StarIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import publicAPI from '../../../services/public/publicAPI'; // Update this import path to match your project structure

const ProviderProfile = () => {
  const { slug } = useParams();
  const location = useLocation();
  const providerId = slug.split('-').pop();
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Set initial section based on navigation state
  const initialSection = location.state?.scrollToSection || 'services';
  const [activeSection, setActiveSection] = useState(initialSection);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 6;
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [totalReviewPages, setTotalReviewPages] = useState(1);
  const [reviewSummary, setReviewSummary] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: {}
  });

  // Add a new state variable to track service reviews
  const [serviceReviews, setServiceReviews] = useState({});
  const [serviceReviewsLoading, setServiceReviewsLoading] = useState({});

  // Fetch provider details and services
  useEffect(() => {
    const fetchProviderData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch provider data
        const providerResponse = await publicAPI.getServiceProviderById(providerId);
        setProvider(providerResponse.data);
        
        // Fetch services
        setServicesLoading(true);
        const servicesResponse = await publicAPI.getProviderServices(providerId);
        const servicesData = servicesResponse.data;
        setServices(servicesData);
        
        // Initialize loading state for each service's reviews
        const loadingState = {};
        servicesData.forEach(service => {
          loadingState[service.serviceID] = true;
        });
        setServiceReviewsLoading(loadingState);
        
        // Fetch review summaries for each service (not full reviews)
        const reviewsData = {};
        await Promise.all(
          servicesData.map(async (service) => {
            try {
              // Try to use a summary endpoint if available
              const summaryResponse = await publicAPI.getProviderReviewSummary(service.serviceID);
              reviewsData[service.serviceID] = {
                averageRating: summaryResponse.data.averageRating || 0,
                totalReviews: summaryResponse.data.totalReviews || 0
              };
            } catch (err) {
              try {
                // Fall back to calculating from reviews if needed
                const reviewsResponse = await publicAPI.getServiceReviews(service.serviceID);
                const reviews = reviewsResponse.data || [];
                
                // Calculate average rating and total reviews
                const totalReviews = reviews.length;
                let avgRating = 0;
                
                if (totalReviews > 0) {
                  const ratingSum = reviews.reduce((sum, review) => sum + review.rating, 0);
                  avgRating = ratingSum / totalReviews;
                }
                
                reviewsData[service.serviceID] = {
                  averageRating: avgRating,
                  totalReviews: totalReviews
                };
              } catch (innerErr) {
                console.error(`Error fetching reviews for service ${service.serviceID}:`, innerErr);
                reviewsData[service.serviceID] = {
                  averageRating: 0,
                  totalReviews: 0
                };
              }
            } finally {
              setServiceReviewsLoading(prev => ({
                ...prev,
                [service.serviceID]: false
              }));
            }
          })
        );
        
        setServiceReviews(reviewsData);
        setServicesLoading(false);
        
        // Also fetch review data for the stats grid (provider overall rating)
        try {
          const summaryResponse = await publicAPI.getProviderReviewSummary(providerId);
          setReviewSummary({
            averageRating: summaryResponse.data.averageRating || 0,
            totalReviews: summaryResponse.data.totalReviews || 0,
            ratingDistribution: summaryResponse.data.ratingDistribution || {}
          });
        } catch (err) {
          // Fall back to calculating from reviews
          try {
            const reviewsResponse = await publicAPI.getProviderReviews(providerId);
            const reviews = reviewsResponse.data || [];
            
            if (reviews.length > 0) {
              const totalReviews = reviews.length;
              const ratingSum = reviews.reduce((sum, review) => sum + review.rating, 0);
              const avgRating = ratingSum / totalReviews;
              
              // Count ratings by star level
              const distribution = {};
              reviews.forEach(review => {
                distribution[review.rating] = (distribution[review.rating] || 0) + 1;
              });
              
              setReviewSummary({
                averageRating: avgRating,
                totalReviews: totalReviews,
                ratingDistribution: distribution
              });
            }
          } catch (reviewErr) {
            console.error("Error fetching initial reviews:", reviewErr);
          }
        }
      } catch (err) {
        console.error('Error fetching provider data:', err);
        setError('Failed to load provider information. Please try again.');
      } finally {
        // Small delay to prevent UI flashing
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    if (providerId) {
      fetchProviderData();
    }
  }, [providerId]);

  // Add debug logging to check what data is being received
  useEffect(() => {
    if (provider) {
      console.log("Provider data received:", provider);
    }
  }, [provider]);

  // Filter services based on search query
  const filteredServices = services.filter(service =>
    service.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);
  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);

  // Pagination helper function
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll to services section when coming from providers list
  useEffect(() => {
    if (location.state?.scrollToSection && !loading) {
      const servicesElement = document.getElementById('services-section');
      if (servicesElement) {
        servicesElement.scrollIntoView({ behavior: 'smooth' });
      }
      
      // Clear the location state to avoid scrolling again on future navigation
      window.history.replaceState({}, document.title);
    }
  }, [location.state, loading]);

  // Add this to your existing useEffect or create a new one
  useEffect(() => {
    const fetchProviderReviews = async () => {
      try {
        setReviewsLoading(true);
        const response = await publicAPI.getProviderReviews(providerId);
        
        // The API returns an array directly, not an object with content
        setReviews(response.data || []);
        setTotalReviewPages(1); // Since pagination might not be implemented yet
        
        // Calculate review summary manually if summary endpoint is not available
        if (response.data && response.data.length > 0) {
          const totalReviews = response.data.length;
          const ratingSum = response.data.reduce((sum, review) => sum + review.rating, 0);
          const avgRating = ratingSum / totalReviews;
          
          // Count ratings by star level
          const distribution = {};
          response.data.forEach(review => {
            distribution[review.rating] = (distribution[review.rating] || 0) + 1;
          });
          
          setReviewSummary({
            averageRating: avgRating,
            totalReviews: totalReviews,
            ratingDistribution: distribution
          });
        }
      } catch (err) {
        console.error('Error fetching provider reviews:', err);
        setReviewError('Failed to load reviews. Please try again.');
      } finally {
        setReviewsLoading(false);
      }
    };

    if (providerId && activeSection === 'reviews') {
      fetchProviderReviews();
    }
  }, [providerId, activeSection, reviewsPage]);

  // Helper function to render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <StarIcon
            key={index}
            className={`h-4 w-4 ${
              index < Math.floor(rating)
                ? 'text-yellow-400'
                : 'text-slate-300 dark:text-slate-600'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-12 animate-pulse">
          <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
          <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <Link 
            to="/professionals"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Professionals
          </Link>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Provider Not Found</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">The service provider you're looking for could not be found.</p>
          <Link 
            to="/professionals"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Professionals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section */}
      <div className="relative h-[300px] sm:h-[400px] overflow-hidden">
        <img
          src={provider.coverImage || "https://pristineplumbing.com.au/wp-content/themes/pristineplumbing/assets/images/process_bg.png"}
          alt={provider.businessName}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 sm:from-black/80 to-black/60 sm:to-black/40" />
        
        {/* Back Button */}
        <Link
          to="/professionals"
          className="absolute top-4 left-4 z-10 flex items-center space-x-2 text-white/90 hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span className="text-sm font-medium">Back to Professionals</span>
        </Link>

        {/* Provider Info */}
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
            <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-white p-2 shadow-xl">
              <img
                src={provider.user?.picUrl || "https://pristineplumbing.com.au/wp-content/themes/pristineplumbing/assets/images/process_bg.png"}
                alt={provider.businessName || "Service Provider"}
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-4xl font-bold text-white">
                {provider.businessName || `${provider.user?.name} ${provider.user?.surname}`}
              </h1>
              <div className="mt-2 sm:mt-4 flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-4">
                <div className="flex items-center text-white/90">
                  <MapPinIcon className="mr-1 h-5 w-5" />
                  {provider.location || "Location not specified"}
                </div>
                {provider.verified && (
                  <div className="flex items-center text-white/90">
                    <CheckBadgeIcon className="mr-1 h-5 w-5" />
                    Verified Provider
                  </div>
                )}
                <div className="flex items-center text-white/90">
                  <StarIcon className="mr-1 h-5 w-5" />
                  {provider.rating || "No ratings"} ({provider.reviewCount || 0} reviews)
                </div>
              </div>
              {/* Show service category if available */}
              {provider.serviceCategory && (
                <div className="mt-2 inline-flex items-center rounded-full bg-blue-500/20 px-3 py-1">
                  <span className="text-sm font-medium text-white">
                    {provider.serviceCategory}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">
                {reviewSummary.averageRating ? reviewSummary.averageRating.toFixed(1) : "N/A"}
              </div>
              <div className="text-sm text-white/80">Average Rating</div>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">
                {reviewSummary.totalReviews || 0}
              </div>
              <div className="text-sm text-white/80">Total Reviews</div>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">{services.length}</div>
              <div className="text-sm text-white/80">Services Offered</div>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">
                {provider.established ? (new Date().getFullYear() - parseInt(provider.established)) : "N/A"}
              </div>
              <div className="text-sm text-white/80">Years Experience</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="sticky top-0 z-10 backdrop-blur-lg bg-white/80 shadow-sm dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex space-x-8">
              {['services', 'about', 'reviews'].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`${
                    activeSection === section
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                  } relative h-16 border-b-2 px-3 text-sm font-medium capitalize transition-all hover:border-slate-300 dark:hover:border-slate-600`}
                >
                  {section}
                  {/* Indicator dot */}
                  {activeSection === section && (
                    <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-blue-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      {activeSection === 'services' && (
        <div id="services-section" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Services Offered
            </h2>
            <div className="relative w-72">
              <input
                type="search"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          </div>
          
          {/* Services Grid */}
          {servicesLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, index) => (
                <div 
                  key={index} 
                  className="animate-pulse rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="h-6 w-3/4 bg-slate-200 rounded dark:bg-slate-700 mb-4" />
                  <div className="h-20 w-full bg-slate-200 rounded dark:bg-slate-700 mb-4" />
                  <div className="flex justify-between items-center">
                    <div className="h-6 w-20 bg-slate-200 rounded dark:bg-slate-700" />
                    <div className="h-8 w-24 bg-blue-200 rounded dark:bg-blue-900" />
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="h-4 w-full bg-slate-200 rounded dark:bg-slate-700 mb-2" />
                    <div className="h-4 w-3/4 bg-slate-200 rounded dark:bg-slate-700" />
                  </div>
                </div>
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg font-medium text-slate-900 dark:text-white">No services found</p>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                This provider hasn't added any services yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {currentServices.map((service) => {
                const reviewData = serviceReviews[service.serviceID] || { 
                  reviews: [], 
                  averageRating: 0, 
                  totalReviews: 0 
                };
                const isReviewLoading = serviceReviewsLoading[service.serviceID];
                
                return (
                  <motion.div
                    key={service.serviceID}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
                  >
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {service.serviceName}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 min-h-[60px]">
                      {service.description}
                    </p>
                    
                    {/* Service Reviews - Simplified to only show star rating and count */}
                    <div className="mt-3 mb-4">
                      {isReviewLoading ? (
                        <div className="flex items-center space-x-1 animate-pulse">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-4 w-4 rounded bg-slate-200 dark:bg-slate-700" />
                          ))}
                          <div className="ml-2 h-4 w-16 rounded bg-slate-200 dark:bg-slate-700" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {renderStars(reviewData.averageRating)}
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {reviewData.averageRating.toFixed(1)} ({reviewData.totalReviews} {reviewData.totalReviews === 1 ? 'review' : 'reviews'})
                          </span>
                          {reviewData.totalReviews > 0 && (
                            <button
                              onClick={() => {
                                setActiveSection('reviews');
                                setTimeout(() => {
                                  const element = document.getElementById(`service-reviews-${service.serviceID}`);
                                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                                }, 200);
                              }}
                              className="ml-auto text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              See reviews →
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                          <ClockIcon className="mr-1 h-4 w-4" />
                          {service.duration}
                        </span>
                        <span className="text-lg font-semibold text-slate-900 dark:text-white">
                          R{service.price.toFixed(2)}
                        </span>
                      </div>
                      <Link
                        to="/login"
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                      >
                        Book Now
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!servicesLoading && totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center">
              <nav className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-800">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>

                <div className="hidden sm:flex">
                  {getPageNumbers().map((pageNum, idx) => (
                    <button
                      key={idx}
                      onClick={() => typeof pageNum === 'number' ? handlePageChange(pageNum) : null}
                      className={`${
                        pageNum === currentPage
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                          : pageNum === '...'
                          ? 'cursor-default text-slate-500 dark:text-slate-400'
                          : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700'
                      } rounded-lg px-4 py-2 text-sm font-medium`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </nav>
            </div>
          )}

          {/* Mobile Pagination Info */}
          {!servicesLoading && totalPages > 1 && (
            <div className="mt-4 text-center sm:hidden">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          )}
        </div>
      )}

      {/* About Section */}
      {activeSection === 'about' && (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  About Us
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  {provider.about || "No information provided."}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  {provider.established && (
                    <div className="flex items-center text-slate-600 dark:text-slate-400">
                      <CalendarIcon className="mr-1 h-5 w-5" />
                      Established {provider.established}
                    </div>
                  )}
                  {provider.insurance?.verified && (
                    <div className="flex items-center text-slate-600 dark:text-slate-400">
                      <CheckBadgeIcon className="mr-1 h-5 w-5 text-green-500" />
                      Insured up to {provider.insurance.coverage || "R2 million"}
                    </div>
                  )}
                </div>

                {/* Owner/Provider Information */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    Provider Information
                  </h3>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                    <div className="space-y-2">
                      {provider.user && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Owner:</span>
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {provider.user.name} {provider.user.surname}
                          </span>
                        </div>
                      )}
                      {provider.createdAt && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Joined:</span>
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {new Date(provider.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {provider.verified && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Status:</span>
                          <span className="text-sm text-green-600 dark:text-green-400 flex items-center">
                            <CheckBadgeIcon className="h-4 w-4 mr-1" />
                            Verified Provider
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Certifications */}
              {provider.certifications && provider.certifications.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Professional Certifications
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {provider.certifications.map((cert, index) => (
                      <div 
                        key={index}
                        className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50"
                      >
                        <CheckBadgeIcon className="mr-3 h-5 w-5 text-blue-500" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements */}
              {provider.achievements && provider.achievements.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Achievements & Recognition
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {provider.achievements.map((achievement, index) => (
                      <div 
                        key={index}
                        className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50"
                      >
                        <StarIcon className="mr-3 h-5 w-5 text-yellow-400" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact & Business Hours Sidebar */}
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  {/* Use provider.phoneNumber directly instead of provider.contact?.phone */}
                  {provider.phoneNumber && (
                    <div className="flex items-center text-slate-600 dark:text-slate-400">
                      <PhoneIcon className="mr-2 h-5 w-5" />
                      <a href={`tel:${provider.phoneNumber}`} className="hover:text-blue-500 transition-colors">
                        {provider.phoneNumber}
                      </a>
                    </div>
                  )}
                  
                  {/* Display user email */}
                  {provider.user?.email && (
                    <div className="flex items-center text-slate-600 dark:text-slate-400">
                      <EnvelopeIcon className="mr-2 h-5 w-5" />
                      <a href={`mailto:${provider.user.email}`} className="hover:text-blue-500 transition-colors">
                        {provider.user.email}
                      </a>
                    </div>
                  )}
                  
                  {provider.location && (
                    <div className="flex items-center text-slate-600 dark:text-slate-400">
                      <MapPinIcon className="mr-2 h-5 w-5" />
                      {provider.location}
                    </div>
                  )}
                </div>
              </div>

              {provider.businessHours && (
                <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Business Hours
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(provider.businessHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between text-sm">
                        <span className="capitalize text-slate-600 dark:text-slate-400">{day}</span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {typeof hours === 'string' ? hours : `${hours.open} - ${hours.close}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Service Category */}
              {provider.serviceCategory && (
                <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Specialization
                  </h3>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 py-2 px-4">
                      <span className="font-medium text-blue-700 dark:text-blue-400">
                        {provider.serviceCategory}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      {activeSection === 'reviews' && (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Reviews Summary Card */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Overall Rating
                </h3>
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white mr-2">
                    {reviewSummary.averageRating?.toFixed(1) || "N/A"}
                  </span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <StarIcon
                        key={index}
                        className={`h-5 w-5 ${
                          index < Math.floor(reviewSummary.averageRating || 0)
                            ? 'text-yellow-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Based on {reviewSummary.totalReviews || 0} customer reviews
              </p>
            </div>

            {/* Rating distribution if available */}
            {reviewSummary.ratingDistribution && (
              <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Rating Distribution
                </h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = reviewSummary.ratingDistribution[rating] || 0;
                    const percentage = reviewSummary.totalReviews ? 
                      (count / reviewSummary.totalReviews) * 100 : 0;
                    
                    return (
                      <div key={rating} className="flex items-center justify-between">
                        <div className="flex items-center w-16">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {rating} stars
                          </span>
                        </div>
                        <div className="w-full mx-4">
                          <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                            <div 
                              className="h-2 rounded-full bg-blue-500"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-400 w-10 text-right">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Reviews List */}
          {reviewsLoading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i} 
                  className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                      <div className="ml-3">
                        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        <div className="mt-1 h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                      </div>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, j) => (
                        <div key={j} className="h-4 w-4 ml-1 bg-slate-200 dark:bg-slate-700 rounded"></div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : reviews.length > 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <div className="space-y-6">
                {reviews.map((review) => (
                  <motion.div 
                    key={review.reviewID}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b border-slate-200 dark:border-slate-700 pb-6 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="mr-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <span className="text-blue-600 dark:text-blue-400 font-semibold">
                              {/* Use customer ID since name might not be available */}
                              {review.customerID?.toString().charAt(0) || "U"}
                            </span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white">
                          Verified Customer
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                          <StarIcon
                            key={index}
                            className={`h-4 w-4 ${
                              index < review.rating
                                ? 'text-yellow-400'
                                : 'text-slate-300 dark:text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mb-3">
                      {review.comment}
                    </p>
                    {/* Display booking ID instead of service name which might not be available */}
                    {review.bookingID && (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-600 dark:bg-green-900/20 dark:text-green-400">
                          Verified Booking
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Pagination controls if needed */}
              {totalReviewPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <nav className="inline-flex rounded-md shadow-sm">
                    <button
                      onClick={() => setReviewsPage(Math.max(1, reviewsPage - 1))}
                      disabled={reviewsPage === 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 enabled:hover:text-gray-500 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    
                    {/* Page number buttons */}
                    {[...Array(totalReviewPages)].map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setReviewsPage(idx + 1)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          reviewsPage === idx + 1
                            ? 'z-10 bg-blue-600 text-white'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setReviewsPage(Math.min(totalReviewPages, reviewsPage + 1))}
                      disabled={reviewsPage === totalReviewPages}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 enabled:hover:text-gray-500 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <p className="text-lg font-medium text-slate-900 dark:text-white">No reviews yet</p>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                This provider doesn't have any reviews yet.
              </p>
            </div>
          )}

          {/* Service-Specific Reviews Section - Only show services with reviews */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Reviews by Service
            </h2>
            
            {services.length === 0 ? (
              <div className="text-center py-8 rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                <p className="text-lg font-medium text-slate-900 dark:text-white">No services found</p>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  This provider hasn't added any services yet.
                </p>
              </div>
            ) : (
              // Filter services to only show those with reviews
              (() => {
                const servicesWithReviews = services.filter(service => {
                  const reviewData = serviceReviews[service.serviceID];
                  return reviewData && reviewData.totalReviews > 0;
                });
                
                if (servicesWithReviews.length === 0) {
                  return (
                    <div className="text-center py-8 rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                      <p className="text-lg font-medium text-slate-900 dark:text-white">No service reviews yet</p>
                      <p className="mt-2 text-slate-600 dark:text-slate-400">
                        This provider's services don't have any reviews yet.
                      </p>
                    </div>
                  );
                }
                
                return (
                  <div className="space-y-8">
                    {servicesWithReviews.map(service => {
                      const reviewData = serviceReviews[service.serviceID] || { 
                        averageRating: 0, 
                        totalReviews: 0 
                      };
                      const isReviewLoading = serviceReviewsLoading[service.serviceID];
                      
                      return (
                        <div 
                          key={service.serviceID} 
                          id={`service-reviews-${service.serviceID}`}
                          className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 overflow-hidden"
                        >
                          <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                {service.serviceName}
                              </h3>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center">
                                  {renderStars(reviewData.averageRating)}
                                  <span className="ml-2 text-sm font-medium text-slate-900 dark:text-white">
                                    {reviewData.averageRating.toFixed(1)}
                                  </span>
                                </div>
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                  {reviewData.totalReviews} {reviewData.totalReviews === 1 ? 'review' : 'reviews'}
                                </span>
                              </div>
                            </div>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                              {service.description}
                            </p>
                          </div>
                          
                          <div className="p-6">
                            {isReviewLoading ? (
                              <div className="animate-pulse space-y-4">
                                {[...Array(2)].map((_, i) => (
                                  <div key={i} className="flex items-start space-x-4">
                                    <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                                    <div className="flex-1">
                                      <div className="h-4 w-32 bg-slate-200 rounded dark:bg-slate-700 mb-2"></div>
                                      <div className="h-3 w-24 bg-slate-200 rounded dark:bg-slate-700 mb-3"></div>
                                      <div className="h-4 w-full bg-slate-200 rounded dark:bg-slate-700 mb-2"></div>
                                      <div className="h-4 w-5/6 bg-slate-200 rounded dark:bg-slate-700"></div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <>
                                {/* If reviews array is available, show them, otherwise auto-load them */}
                                {reviewData.reviews && reviewData.reviews.length > 0 ? (
                                  <div className="space-y-6">
                                    {reviewData.reviews.map(review => (
                                      <motion.div 
                                        key={review.reviewID}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="border-b border-slate-200 dark:border-slate-700 pb-6 last:border-0 last:pb-0"
                                      >
                                        <div className="flex items-center justify-between mb-2">
                                          <div className="flex items-center">
                                            <div className="mr-3">
                                              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                                                  A
                                                </span>
                                              </div>
                                            </div>
                                            <div>
                                              <h4 className="font-medium text-slate-900 dark:text-white">
                                                Verified Customer
                                              </h4>
                                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                              </p>
                                            </div>
                                          </div>
                                          <div className="flex items-center">
                                            {[...Array(5)].map((_, index) => (
                                              <StarIcon
                                                key={index}
                                                className={`h-4 w-4 ${
                                                  index < review.rating
                                                    ? 'text-yellow-400'
                                                    : 'text-slate-300 dark:text-slate-600'
                                                }`}
                                              />
                                            ))}
                                          </div>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 mb-3">
                                          {review.comment}
                                        </p>
                                        {review.bookingID && (
                                          <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-600 dark:bg-green-900/20 dark:text-green-400">
                                              Verified Booking
                                            </span>
                                          </div>
                                        )}
                                      </motion.div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center py-8">
                                    <p className="text-slate-600 dark:text-slate-400">
                                      {reviewData.totalReviews > 0 ? 'Loading reviews...' : 'No reviews yet for this service.'}
                                    </p>
                                    {reviewData.totalReviews > 0 && !reviewData.reviews && (() => {
                                      setServiceReviewsLoading(prev => ({...prev, [service.serviceID]: true}));
                                      publicAPI.getServiceReviews(service.serviceID)
                                        .then(response => {
                                          setServiceReviews(prev => ({
                                            ...prev,
                                            [service.serviceID]: {
                                              ...prev[service.serviceID],
                                              reviews: response.data || []
                                            }
                                          }));
                                        })
                                        .catch(err => console.error(`Error fetching reviews for service ${service.serviceID}:`, err))
                                        .finally(() => {
                                          setServiceReviewsLoading(prev => ({...prev, [service.serviceID]: false}));
                                        });
                                      return null;
                                    })()}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()
            )}
          </div>
          
         
        </div>
      )}

      {/* Contact Button */}
      <div className="fixed bottom-6 right-6 z-20">
        <motion.button
          onClick={() => setIsContactModalOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 rounded-full bg-blue-600 px-6 py-3 text-white shadow-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <PhoneIcon className="h-5 w-5" />
          <span className="font-medium">Contact Now</span>
        </motion.button>
      </div>

      {/* WhatsApp Contact Button */}
      <div className="fixed bottom-6 right-6 z-20">
        <motion.a
          href={provider?.phoneNumber ? 
            `https://wa.me/${provider.phoneNumber.replace(/\D/g, '')}?text=Hello, I'm interested in your services on RepairLink` : 
            "#"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (!provider?.phoneNumber) {
              e.preventDefault();
              setIsContactModalOpen(true);
            }
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 rounded-full bg-green-600 px-6 py-3 text-white shadow-lg hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12.04 0C5.437 0 0.102 5.335.1 11.892c-.001 2.096.548 4.143 1.592 5.945l-1.636 6.164 6.305-1.654c1.73.942 3.687 1.444 5.68 1.445h.005c6.603 0 11.946-5.335 11.949-11.891C24 5.342 18.663.002 12.04 0zm6.984 16.878c-.118.188-.297.336-.51.434-1.602.824-3.686.602-5.318-.1-.699-.286-1.47-.642-2.276-1.062-3.827-1.993-6.025-5.875-6.187-6.138-.162-.263-1.347-1.794-1.347-3.425 0-1.63.786-2.434 1.122-2.773.278-.28.727-.398 1.163-.398.14 0 .266.007.38.013.334.013.502.033.723.55.273.631.833 2.193.904 2.353.071.16.13.347.039.543-.084.2-.157.288-.285.458-.132.173-.26.305-.391.458-.146.177-.31.366-.126.613.183.245.814 1.043 1.748 1.695 1.21.85 2.193 1.139 2.517 1.253.26.09.566.07.753-.19.24-.348.54-.927.732-1.244.19-.317.385-.267.647-.16.264.107 1.669.785 1.957.929.288.143.48.214.551.329.071.116.071.67-.047.919z" />
            <path d="M12.04 0C5.437 0 0.102 5.335.1 11.892c-.001 2.096.548 4.143 1.592 5.945l-1.636 6.164 6.305-1.654c1.73.942 3.687 1.444 5.68 1.445h.005c6.603 0 11.946-5.335 11.949-11.891C24 5.342 18.663.002 12.04 0zm6.984 16.878c-.118.188-.297.336-.51.434-1.602.824-3.686.602-5.318-.1-.699-.286-1.47-.642-2.276-1.062-3.827-1.993-6.025-5.875-6.187-6.138-.162-.263-1.347-1.794-1.347-3.425 0-1.63.786-2.434 1.122-2.773.278-.28.727-.398 1.163-.398.14 0 .266.007.38.013.334.013.502.033.723.55.273.631.833 2.193.904 2.353.071.16.13.347.039.543-.084.2-.157.288-.285.458-.132.173-.26.305-.391.458-.146.177-.31.366-.126.613.183.245.814 1.043 1.748 1.695 1.21.85 2.193 1.139 2.517 1.253.26.09.566.07.753-.19.24-.348.54-.927.732-1.244.19-.317.385-.267.647-.16.264.107 1.669.785 1.957.929.288.143.48.214.551.329.071.116.071.67-.047.919z" />
          </svg>
          <span className="font-medium">Chat on WhatsApp</span>
        </motion.a>
      </div>

      {/* Contact Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-slate-900/75 transition-opacity"
              onClick={() => setIsContactModalOpen(false)}
            />

            <span className="hidden sm:inline-block sm:h-screen sm:align-middle">&#8203;</span>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all dark:bg-slate-800 sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
            >
              <div className="absolute right-0 top-0 pr-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(false)}
                  className="rounded-md text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="sm:flex sm:items-start">
                <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg font-semibold leading-6 text-slate-900 dark:text-white">
                    Contact {provider.businessName || `${provider.user?.name} ${provider.user?.surname}`}
                  </h3>
                  
                  <div className="mt-6 space-y-4">
                    {provider.contact?.phone && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Numbers</h4>
                        <div className="mt-2 space-y-2">
                          <a
                            href={`tel:${provider.contact.phone}`}
                            className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800/50"
                          >
                            <PhoneIcon className="mr-3 h-5 w-5 text-blue-500" />
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">{provider.contact.phone}</p>
                              <p className="text-slate-500 dark:text-slate-400">Main Office</p>
                            </div>
                          </a>
                          
                          {provider.contact.emergencyNumber && (
                            <a
                              href={`tel:${provider.contact.emergencyNumber}`}
                              className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800/50"
                            >
                              <PhoneIcon className="mr-3 h-5 w-5 text-red-500" />
                              <div>
                                <p className="font-medium text-slate-900 dark:text-white">{provider.contact.emergencyNumber}</p>
                                <p className="text-slate-500 dark:text-slate-400">24/7 Emergency</p>
                              </div>
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Other Contact Methods</h4>
                      <div className="mt-2 space-y-2">
                        {provider.contact?.email && (
                          <a
                            href={`mailto:${provider.contact.email}`}
                            className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800/50"
                          >
                            <EnvelopeIcon className="mr-3 h-5 w-5 text-blue-500" />
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">{provider.contact.email}</p>
                              <p className="text-slate-500 dark:text-slate-400">Email Us</p>
                            </div>
                          </a>
                        )}

                        {provider.contact?.whatsapp && (
                          <a
                            href={`https://wa.me/${provider.contact.whatsapp.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800/50"
                          >
                            <svg className="mr-3 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">{provider.contact.whatsapp}</p>
                              <p className="text-slate-500 dark:text-slate-400">WhatsApp</p>
                            </div>
                          </a>
                        )}
                      </div>
                    </div>

                    {provider.businessHours && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Business Hours</h4>
                        <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                          <div className="space-y-1 text-sm">
                            {Object.entries(provider.businessHours).map(([day, hours]) => (
                              <div key={day} className="flex justify-between">
                                <span className="capitalize text-slate-500 dark:text-slate-400">{day}</span>
                                <span className="font-medium text-slate-900 dark:text-white">
                                  {typeof hours === 'string' ? hours : `${hours.open} - ${hours.close}`}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderProfile;