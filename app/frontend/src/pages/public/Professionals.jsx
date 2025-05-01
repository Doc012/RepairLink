import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  StarIcon, 
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  BriefcaseIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  UserIcon
} from '@heroicons/react/20/solid';
import { motion } from 'framer-motion';
import { publicAPI } from '../../services';

const Professionals = () => {
  // 1. State declarations
  const [professionals, setProfessionals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState(['All']);
  const itemsPerPage = 6;
  const [reviewsLoading, setReviewsLoading] = useState({});
  const [serviceReviews, setServiceReviews] = useState({});

  // 2. Fetch data from API
  useEffect(() => {
    const fetchProfessionals = async () => {
      setIsLoading(true);
      try {
        const response = await publicAPI.getServiceProviders();
        
        // Set the providers first so the UI can render
        setProfessionals(response.data);
        
        // Then fetch review data separately for each provider
        response.data.forEach(async (provider) => {
          try {
            // Mark this provider's reviews as loading
            setReviewsLoading(prev => ({...prev, [provider.providerID]: true}));
            
            // Fetch provider's services first
            const servicesResponse = await publicAPI.getProviderServices(provider.providerID);
            const services = servicesResponse.data || [];
            
            // If provider has services, get reviews for each service
            if (services.length > 0) {
              let totalRating = 0;
              let totalReviews = 0;
              let bestServiceRating = {
                serviceName: "",
                rating: 0,
                reviewCount: 0
              };
              
              // Process each service
              for (const service of services) {
                try {
                  const serviceId = service.serviceID || service.id;
                  const reviewsResponse = await publicAPI.getServiceReviews(serviceId);
                  const reviews = reviewsResponse.data || [];
                  
                  if (reviews.length > 0) {
                    // Calculate average rating for this service
                    const serviceRatingSum = reviews.reduce((sum, review) => sum + review.rating, 0);
                    const serviceAvgRating = serviceRatingSum / reviews.length;
                    
                    // Track service with best rating
                    if (serviceAvgRating > bestServiceRating.rating || 
                        (serviceAvgRating === bestServiceRating.rating && 
                         reviews.length > bestServiceRating.reviewCount)) {
                      bestServiceRating = {
                        serviceName: service.serviceName || service.name,
                        rating: serviceAvgRating,
                        reviewCount: reviews.length
                      };
                    }
                    
                    // Add to totals
                    totalRating += serviceRatingSum;
                    totalReviews += reviews.length;
                    
                    // Save service review data
                    setServiceReviews(prev => ({
                      ...prev,
                      [provider.providerID]: {
                        ...prev[provider.providerID],
                        [serviceId]: {
                          rating: serviceAvgRating,
                          reviewCount: reviews.length,
                          serviceName: service.serviceName || service.name
                        }
                      }
                    }));
                  }
                } catch (err) {
                  // Continue to next service if there's an error
                }
              }
              
              // Update provider with overall review data
              if (totalReviews > 0) {
                const avgRating = totalRating / totalReviews;
                
                setProfessionals(prevProviders => 
                  prevProviders.map(p => 
                    p.providerID === provider.providerID ? 
                      {
                        ...p, 
                        rating: avgRating, 
                        reviewCount: totalReviews,
                        bestService: bestServiceRating
                      } : p
                  )
                );
              }
            } else {
              // Try the provider review endpoint as fallback
              try {
                const summaryResponse = await publicAPI.getProviderReviewSummary(provider.providerID);
                const reviewData = {
                  rating: summaryResponse.data.average || 0,
                  reviewCount: summaryResponse.data.total || 0
                };
                
                if (reviewData.reviewCount > 0) {
                  setProfessionals(prevProviders => 
                    prevProviders.map(p => 
                      p.providerID === provider.providerID ? 
                        {...p, ...reviewData} : p
                    )
                  );
                }
              } catch (err) {
                // Silent failure
              }
            }
          } catch (err) {
            // Silent failure
          } finally {
            // Mark this provider's reviews as loaded regardless of success/failure
            setReviewsLoading(prev => ({...prev, [provider.providerID]: false}));
          }
        });
        
        // Extract unique categories from service providers
        if (response.data && response.data.length > 0) {
          const uniqueCategories = ['All', ...new Set(
            response.data.map(provider => provider.serviceCategory).filter(Boolean)
          )];
          setCategories(uniqueCategories);
        }
        
        setError(null);
      } catch (err) {
        setError('Unable to load professionals. Please try again later.');
        setProfessionals([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  // 3. Memoized filtered results based on search and category filters
  const filteredResults = React.useMemo(() => {
    return professionals.filter(provider => {
      const searchTerms = searchQuery.toLowerCase().trim();
      
      // Match against business name, user name, service category, or location
      const matchesSearch = !searchTerms || 
        provider.businessName?.toLowerCase().includes(searchTerms) ||
        `${provider.user?.name} ${provider.user?.surname}`.toLowerCase().includes(searchTerms) ||
        provider.serviceCategory?.toLowerCase().includes(searchTerms) ||
        provider.location?.toLowerCase().includes(searchTerms);

      // Match against selected category/specialty
      const matchesSpecialty = !selectedSpecialty || selectedSpecialty === 'All' || 
        provider.serviceCategory?.toLowerCase().includes(selectedSpecialty.toLowerCase());

      return matchesSearch && matchesSpecialty;
    });
  }, [professionals, searchQuery, selectedSpecialty]);

  // 4. Pagination calculations
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProfessionals = filteredResults.slice(startIndex, endIndex);

  // 5. Event handlers
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleSpecialtyClick = (specialty) => {
    setSelectedSpecialty(specialty === 'All' ? null : specialty);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSpecialty(null);
    setCurrentPage(1);
  };

  // 6. Page numbers generator for pagination
  const getPageNumbers = () => {
    const delta = 1;
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

  // Animation variants for smooth transitions
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  // Helper function to get provider's full name
  const getProviderName = (provider) => {
    if (provider.businessName) return provider.businessName;
    if (provider.user?.name && provider.user?.surname) {
      return `${provider.user.name} ${provider.user.surname}`;
    }
    return "Service Provider";
  };

  // Helper function to get provider image or placeholder
  const getProviderImage = (provider) => {
    return provider.user?.picUrl || "https://pristineplumbing.com.au/wp-content/themes/pristineplumbing/assets/images/process_bg.png";
  };

  // Render star rating component
  const RatingStars = ({ rating, size = "sm" }) => {
    const starSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`${starSize} ${
              i < Math.floor(rating || 0)
                ? 'text-yellow-400'
                : i < rating && i + 1 > rating
                  ? 'text-yellow-300' // Half star (not implemented but you could use a half star SVG here)
                  : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  // Return JSX with updated components for the API data structure
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img
          src="https://pristineplumbing.com.au/wp-content/themes/pristineplumbing/assets/images/process_bg.png"
          alt="Professional Services"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col justify-center">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
                Our Professional Team
              </h1>
              <p className="mt-6 text-lg text-white/90 sm:text-xl">
                Connect with skilled and verified professionals ready to tackle your home service needs.
              </p>

              {/* Search Bar */}
              <div className="relative mt-8">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <MagnifyingGlassIcon className="h-5 w-5 text-white/60" />
                </div>
                <input
                  type="search"
                  className="block w-full rounded-xl border-2 border-white/20 bg-white/10 py-4 pl-11 pr-4 text-white backdrop-blur-sm placeholder:text-white/60 focus:border-white/30 focus:outline-none"
                  placeholder="Search professionals by name or service category..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Results Summary */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Found {filteredResults.length} service providers
            {searchQuery && ` matching "${searchQuery}"`}
            {selectedSpecialty && ` in ${selectedSpecialty}`}
          </p>
          {(searchQuery || selectedSpecialty) && (
            <button
              onClick={clearFilters}
              className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Category Filters - Now using dynamic categories from API */}
        <motion.div 
          className="mb-8 flex flex-wrap gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => handleSpecialtyClick(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                (category === 'All' && !selectedSpecialty) || category === selectedSpecialty
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

        {/* Loading State */}
        {isLoading ? (
          <motion.div 
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
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
                <div className="aspect-w-16 aspect-h-9 mb-4 rounded-lg bg-slate-200 dark:bg-slate-700" />
                <div className="h-6 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="mt-2 h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="mt-3 h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
                
                <div className="mt-3 flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 w-4 rounded bg-slate-200 dark:bg-slate-700" />
                  ))}
                  <div className="ml-2 h-4 w-16 rounded bg-slate-200 dark:bg-slate-700" />
                </div>
                
                <div className="mt-3 h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
                
                <div className="mt-4 flex justify-between">
                  <div className="h-5 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-5 w-1/4 rounded bg-slate-200 dark:bg-slate-700" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Professionals Grid - Updated for API data structure with service reviews */
          <motion.div 
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {currentProfessionals.map((provider) => (
              <motion.div
                key={provider.providerID}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-blue-600 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500"
              >
                {/* Provider Image */}
                <div className="aspect-w-16 aspect-h-9 mb-4 overflow-hidden rounded-lg">
                  <img
                    src={getProviderImage(provider)}
                    alt={provider.businessName || "Service Provider"}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = "https://pristineplumbing.com.au/wp-content/themes/pristineplumbing/assets/images/process_bg.png";
                    }}
                  />
                </div>

                {/* Provider Name and Info */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {getProviderName(provider)}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {provider.serviceCategory || "Service Provider"}
                    </p>
                  </div>
                  
                  {/* Verification Badge */}
                  {provider.verified && (
                    <div className="flex items-center bg-blue-50 px-2 py-1 rounded-full dark:bg-blue-900/20">
                      <ShieldCheckIcon className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-1" />
                      <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
                        Verified
                      </span>
                    </div>
                  )}
                </div>

                {/* About */}
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                  {provider.about || "Professional service provider ready to assist with your needs."}
                </p>

                {/* Reviews Summary */}
                <div className="mt-3 flex items-center">
                  {reviewsLoading[provider.providerID] ? (
                    <div className="flex items-center space-x-1 animate-pulse">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-4 w-4 rounded bg-slate-200 dark:bg-slate-700" />
                      ))}
                      <div className="ml-2 h-4 w-16 rounded bg-slate-200 dark:bg-slate-700" />
                    </div>
                  ) : (
                    <>
                      <RatingStars rating={provider.rating || 0} />
                      <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                        {provider.rating ? (
                          <>
                            <span className="font-medium">{Number(provider.rating).toFixed(1)}</span>
                            <span className="mx-1">•</span>
                            <span>{provider.reviewCount || 0} reviews</span>
                          </>
                        ) : (
                          "No reviews yet"
                        )}
                      </span>
                    </>
                  )}
                </div>

                {/* Best Service with Rating - Show if provider has a best service with rating > 0 */}
                {provider.bestService && provider.bestService.rating > 0 && (
                  <div className="mt-3 px-3 py-2 bg-blue-50 rounded-lg dark:bg-blue-900/20">
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Top rated service:
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-medium text-slate-900 dark:text-white line-clamp-1">
                        {provider.bestService.serviceName}
                      </span>
                      <div className="flex items-center">
                        <span className="text-xs font-semibold mr-1 text-slate-900 dark:text-white">
                          {Number(provider.bestService.rating).toFixed(1)}
                        </span>
                        <StarIcon className="h-3.5 w-3.5 text-yellow-400" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Provider Contact and Details */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                    <UserIcon className="mr-1 h-4 w-4" />
                    {provider.user?.name} {provider.user?.surname}
                  </div>
                  
                  {/* View Profile Link */}
                  <Link
                    to={`/provider/${provider.providerID}`}
                    state={{ scrollToSection: 'services' }}
                    className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:underline dark:text-blue-400 hover:text-blue-500 transition-colors"
                  >
                    View Profile
                    <ChevronRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {!isLoading && filteredResults.length > 0 && (
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
                    onClick={() => {
                      if (typeof pageNum === 'number') {
                        handlePageChange(pageNum);
                      }
                    }}
                    className={`${
                      pageNum === currentPage
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700'
                    } rounded-lg px-4 py-2 text-sm font-medium`}
                    disabled={typeof pageNum !== 'number'}
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
        {!isLoading && filteredResults.length > 0 && (
          <div className="mt-4 text-center sm:hidden">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        )}

        {/* No Results Message */}
        {!isLoading && !error && filteredResults.length === 0 && (
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-lg font-medium text-slate-900 dark:text-white">
              No service providers found
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
      </div>
    </div>
  );
};

export default Professionals;
