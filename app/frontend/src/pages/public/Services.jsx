import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, CheckCircleIcon, MapPinIcon, ClockIcon, UserIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { StarIcon } from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';
import publicAPI from '../../services/public/publicAPI';

const Services = () => {
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState({});
  const [serviceReviews, setServiceReviews] = useState({});
  const [reviewsLoading, setReviewsLoading] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState(['All']);
  const itemsPerPage = 9;

  // Fetch services from backend
  useEffect(() => {
    const fetchServicesAndProviders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch all services
        const servicesResponse = await publicAPI.getServices();
        console.log('Services data:', servicesResponse.data);
        const servicesData = servicesResponse.data || [];
        setServices(servicesData);
        
        // Get unique provider IDs from services
        const providerIds = [...new Set(servicesData.map(service => service.providerID))];
        
        // Fetch provider data for each unique provider ID
        const providersData = {};
        await Promise.all(
          providerIds.map(async (providerId) => {
            try {
              const providerResponse = await publicAPI.getServiceProviderById(providerId);
              providersData[providerId] = providerResponse.data;
            } catch (err) {
              console.error(`Error fetching provider ${providerId}:`, err);
            }
          })
        );
        
        setProviders(providersData);
        
        // Extract unique categories from services
        const uniqueCategories = ['All'];
        for (const providerId in providersData) {
          if (providersData[providerId]?.serviceCategory && 
              !uniqueCategories.includes(providersData[providerId].serviceCategory)) {
            uniqueCategories.push(providersData[providerId].serviceCategory);
          }
        }
        
        setCategories(uniqueCategories);
        
        // Start loading reviews for each service
        const reviewLoadingState = {};
        servicesData.forEach(service => {
          reviewLoadingState[service.serviceID] = true;
        });
        setReviewsLoading(reviewLoadingState);
        
        // Fetch reviews for each service
        const reviewsData = {};
        await Promise.all(
          servicesData.map(async (service) => {
            try {
              const reviewsResponse = await publicAPI.getServiceReviews(service.serviceID);
              const reviews = reviewsResponse.data || [];
              
              // Calculate average rating and review count
              const totalReviews = reviews.length;
              let avgRating = 0;
              
              if (totalReviews > 0) {
                const ratingSum = reviews.reduce((sum, review) => sum + review.rating, 0);
                avgRating = ratingSum / totalReviews;
              }
              
              reviewsData[service.serviceID] = {
                reviews: reviews,
                averageRating: avgRating,
                totalReviews: totalReviews
              };
            } catch (err) {
              console.error(`Error fetching reviews for service ${service.serviceID}:`, err);
              reviewsData[service.serviceID] = { 
                reviews: [],
                averageRating: 0,
                totalReviews: 0
              };
            } finally {
              setReviewsLoading(prev => ({
                ...prev,
                [service.serviceID]: false
              }));
            }
          })
        );
        
        setServiceReviews(reviewsData);
        
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services. Please try again.');
      } finally {
        // Small delay for smoother UX
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };
    
    fetchServicesAndProviders();
  }, []);

  // Memoized filtered services
  const filteredServices = React.useMemo(() => {
    if (!services.length) return [];
    
    return services.filter(service => {
      const searchTerms = searchQuery.toLowerCase().trim();
      const provider = providers[service.providerID] || {};
      
      const matchesSearch = !searchTerms || 
        service.serviceName.toLowerCase().includes(searchTerms) ||
        service.description.toLowerCase().includes(searchTerms) ||
        provider.businessName?.toLowerCase().includes(searchTerms);

      const matchesCategory = !selectedCategory || 
        provider.serviceCategory?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, services, providers]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === 'All' ? null : category);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setCurrentPage(1);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentServices = filteredServices.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = (currentPage, totalPages) => {
    const delta = 1; // Number of pages to show before and after current page
    const range = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift('...');
    }
    if (currentPage + delta < totalPages - 1) {
      range.push('...');
    }

    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  // Helper to show review stars
  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating)
                ? 'text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Enhanced Hero Section */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img
          src="/src/assets/images/hero/repair-2.jpg"
          alt="Professional Services"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col justify-center">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
                Professional Services
              </h1>
              <p className="mt-6 text-lg text-white/90 sm:text-xl">
                Find trusted professionals for your home and business needs.
              </p>

              {/* Search Bar */}
              <div className="relative mt-8">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <MagnifyingGlassIcon className="h-5 w-5 text-white/60" />
                </div>
                <input
                  type="search"
                  className="block w-full rounded-xl border-2 border-white/20 bg-white/10 py-4 pl-11 pr-4 text-white backdrop-blur-sm placeholder:text-white/60 focus:border-white/30 focus:outline-none"
                  placeholder="Search services by name or category..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Filters */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Results Summary */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Found {filteredServices.length} services
            {searchQuery && ` matching "${searchQuery}"`}
            {selectedCategory && ` in ${selectedCategory}`}
          </p>
          {(searchQuery || selectedCategory) && (
            <button
              onClick={clearFilters}
              className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Category Filters */}
        <motion.div 
          className="mb-8 flex flex-wrap gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                (category === 'All' && !selectedCategory) || category === selectedCategory
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-50 hover:scale-105 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Error Message */}
        {error && !isLoading && (
          <motion.div 
            className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 text-sm font-medium text-red-700 hover:text-red-800 dark:text-red-300 dark:hover:text-red-200"
            >
              Try again
            </button>
          </motion.div>
        )}

        {/* No Results Message */}
        {!isLoading && !error && filteredServices.length === 0 && (
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-lg font-medium text-slate-900 dark:text-white">
              No services found
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Try adjusting your search or filters
            </p>
            <motion.button
              onClick={clearFilters}
              className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear all filters
            </motion.button>
          </motion.div>
        )}

        {/* Services Grid */}
        {isLoading ? (
          <motion.div 
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="animate-pulse rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="h-6 w-3/4 bg-slate-200 rounded dark:bg-slate-700 mb-4" />
                <div className="h-20 w-full bg-slate-200 rounded dark:bg-slate-700 mb-4" />
                <div className="flex justify-between items-center mb-4">
                  <div className="h-5 w-1/3 bg-slate-200 rounded dark:bg-slate-700" />
                  <div className="h-5 w-1/3 bg-slate-200 rounded dark:bg-slate-700" />
                </div>
                <div className="h-10 w-full bg-slate-200 rounded dark:bg-slate-700 mb-4" />
                <div className="flex justify-between items-center">
                  <div className="h-6 w-20 bg-slate-200 rounded dark:bg-slate-700" />
                  <div className="h-8 w-24 bg-blue-200 rounded dark:bg-blue-900" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {currentServices.map((service) => {
              const provider = providers[service.providerID] || {};
              const reviewData = serviceReviews[service.serviceID] || { averageRating: 0, totalReviews: 0 };
              const isReviewLoading = reviewsLoading[service.serviceID];
              
              return (
                <motion.div 
                  key={service.serviceID}
                  variants={itemVariants}
                  className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                          {service.serviceName}
                        </h3>
                        {provider.verified && (
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                            <CheckCircleIcon className="mr-1 h-4 w-4" />
                            Verified
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        {service.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className="flex items-center text-slate-600 dark:text-slate-400">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          <span className="text-sm">{provider.location || "Location not specified"}</span>
                        </div>
                        <div className="flex items-center text-slate-600 dark:text-slate-400">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          <span className="text-sm">{service.duration}</span>
                        </div>
                      </div>

                      {/* Service Reviews Section */}
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
                              <Link 
                                to={`/provider/${service.providerID}?service=${service.serviceID}&tab=reviews`}
                                className="ml-auto text-xs text-blue-600 hover:underline dark:text-blue-400"
                              >
                                <ChatBubbleBottomCenterTextIcon className="inline h-4 w-4 mr-1" />
                                Read reviews
                              </Link>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-lg font-semibold text-slate-900 dark:text-white">
                          R{service.price.toFixed(2)}
                        </div>
                        <Link
                          to="/login"
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
                        >
                          Book Now
                        </Link>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            Provided by{' '}
                            <Link 
                              to={`/provider/${service.providerID}`}
                              className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              {provider.businessName || `Provider #${service.providerID}`}
                            </Link>
                          </div>
                          
                          {provider.rating && (
                            <div className="flex items-center">
                              <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                {provider.rating.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Pagination */}
        {!isLoading && filteredServices.length > 0 && (
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
                {getPageNumbers(currentPage, totalPages).map((pageNum, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (typeof pageNum === 'number') {
                        handlePageChange(pageNum);
                      }
                    }}
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
                disabled={currentPage === totalPages || totalPages === 0}
                className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </nav>
          </div>
        )}

        {/* Mobile Pagination Info */}
        {!isLoading && filteredServices.length > 0 && (
          <div className="mt-4 text-center sm:hidden">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
