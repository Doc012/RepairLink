import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ClockIcon,
  CurrencyDollarIcon,
  StarIcon,
  MapPinIcon,
  CheckBadgeIcon,
  CheckIcon,
  XMarkIcon,
  PhoneIcon,
  ExclamationCircleIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/formatCurrency';
import { useAuth } from '../../contexts/auth/AuthContext';
import { customerAPI, publicAPI } from '../../services';
import { toast } from 'react-hot-toast';

const Services = () => {
  const { user } = useAuth();
  
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  
  // Add scroll to top button visibility state
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Add new states for booking
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    notes: ''
  });

  // Add pagination state variables
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [servicesPerPage] = useState(6); // 6 fits nicely in your 3-column grid
  
  // Replace your existing scroll-to-top implementation with this corrected version:

  // 1. First, update the useEffect that controls visibility
  useEffect(() => {
    const handleScroll = () => {
      // Use this for more reliable cross-browser support
      const scrollY = window.scrollY || window.pageYOffset;
      
      // Show button when scrolled down 300px or more
      setShowScrollToTop(scrollY > 300);
    };
    
    // Set initial state
    handleScroll();
    
    // Add event listener
    window.addEventListener('scroll', handleScroll);
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 2. Next, update the scrollToTop function to use the most reliable method
  const scrollToTop = () => {
    // The most compatible way to scroll to top
    window.scrollTo(0, 0);
  };

  // Fetch services and provider details
  useEffect(() => {
    const fetchServicesAndProviders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get services with pagination parameters
        const servicesResponse = await customerAPI.getServices({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          search: searchQuery || undefined,
          page: currentPage,
          limit: servicesPerPage
        });
        
        const servicesList = servicesResponse.data.services || servicesResponse.data;
        const total = servicesResponse.data.total || servicesList.length;
        
        setServices(servicesList);
        setTotalPages(Math.ceil(total / servicesPerPage));
        
        // Extract unique provider IDs from services
        const providerIDs = [...new Set(servicesList.map(service => service.providerID))];
        
        // If we have provider IDs, fetch their details
        if (providerIDs.length > 0) {
          const providersData = {};
          
          // Create an object mapping provider IDs to their data
          for (const id of providerIDs) {
            try {
              const providerResponse = await publicAPI.getServiceProviderById(id);
              providersData[id] = providerResponse.data;
            } catch (err) {
              console.error(`Failed to fetch provider ${id}:`, err);
              providersData[id] = { 
                businessName: 'Unknown Provider',
                serviceCategory: 'Other',
                location: 'Unknown',
                verified: false
              };
            }
          }
          
          setProviders(providersData);
          
          // Extract unique categories from providers
          const uniqueCategories = [...new Set(
            Object.values(providersData)
              .map(provider => provider.serviceCategory)
              .filter(Boolean)
          )];
          
          setCategories(uniqueCategories);
        }
      } catch (err) {
        console.error("Failed to fetch services:", err);
        setError('Failed to load services. Please try again later.');
        toast.error('Failed to load services');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServicesAndProviders();
  }, [searchQuery, selectedCategory, currentPage, servicesPerPage]);

  // Add BookingModal component
  const BookingModal = ({ service, onClose }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingError, setBookingError] = useState('');
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const provider = providers[service.providerID] || {};

    // Fetch available time slots for selected date
    useEffect(() => {
      if (!bookingData.date) return;
      
      const fetchTimeSlots = async () => {
        try {
          const response = await customerAPI.getAvailableTimeSlots(
            service.serviceID, 
            bookingData.date
          );
          
          setAvailableTimeSlots(response.data);
          
          // Clear selected time if it's no longer available
          if (bookingData.time && !response.data.includes(bookingData.time)) {
            setBookingData(prev => ({ ...prev, time: '' }));
          }
        } catch (err) {
          console.error("Failed to fetch time slots:", err);
          setBookingError('Failed to load available time slots');
        }
      };
      
      fetchTimeSlots();
    }, [service.serviceID, bookingData.date]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setBookingError('');
      setIsSubmitting(true);

      try {
        // Format data for booking API
        const bookingPayload = {
          serviceID: service.serviceID,
          scheduledDate: `${bookingData.date}T${bookingData.time}:00`,
          notes: bookingData.notes,
        };
        
        // Create booking through API
        const response = await customerAPI.createBooking(bookingPayload);
        
        // Show success message
        toast.success('Booking created successfully!');
        
        // Close modal and reset form
        onClose();
      } catch (err) {
        console.error("Booking failed:", err);
        const errorMessage = err.response?.data?.message || 'Failed to create booking';
        setBookingError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    };

    const today = new Date().toISOString().split('T')[0];

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
                      onChange={(e) => setBookingData({ ...bookingData, date: e.target.value, time: '' })}
                      required
                      className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                      Select Time
                    </label>
                    <select
                      value={bookingData.time}
                      onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                      required
                      disabled={!bookingData.date || availableTimeSlots.length === 0}
                      className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 dark:border-slate-600 dark:bg-slate-700 dark:text-white disabled:opacity-50"
                    >
                      <option value="">Choose a time slot</option>
                      {availableTimeSlots.length > 0 ? (
                        availableTimeSlots.map(slot => (
                          <option key={slot} value={slot}>
                            {new Date(`2000-01-01T${slot}`).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </option>
                        ))
                      ) : (
                        bookingData.date && (
                          <option value="" disabled>No available times for selected date</option>
                        )
                      )}
                    </select>
                    {bookingData.date && availableTimeSlots.length === 0 && !isSubmitting && (
                      <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
                        No time slots available for this date. Please select another date.
                      </p>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                      Additional Notes
                    </label>
                    <textarea
                      value={bookingData.notes}
                      onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
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
      </div>
    );
  };

  // Add booking handler
  const handleBookService = (service) => {
    // Check if user is logged in
    if (!user) {
      toast.error('Please log in to book a service');
      // You could redirect to login page here
      return;
    }
    
    setSelectedService(service);
    setShowBookingModal(true);
    
    // Reset booking form data
    setBookingData({
      date: '',
      time: '',
      notes: ''
    });
  };

  // Filter services based on search query and category
  const filteredServices = services.filter(service => {
    const provider = providers[service.providerID] || {};
    
    const matchesSearch = searchQuery === '' || 
      service.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (provider.businessName && provider.businessName.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesCategory = selectedCategory === 'all' || 
      (provider.serviceCategory && provider.serviceCategory.toLowerCase() === selectedCategory.toLowerCase());
      
    return matchesSearch && matchesCategory;
  });

  // Client-side pagination example
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);

  // Add pagination UI
  const PaginationControls = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <button
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 dark:bg-slate-700 dark:text-slate-300"
        >
          First
        </button>
        
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 dark:bg-slate-700 dark:text-slate-300"
        >
          &lt;
        </button>
        
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`px-3 py-1 rounded-md ${
              currentPage === number
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-300'
            }`}
          >
            {number}
          </button>
        ))}
        
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 dark:bg-slate-700 dark:text-slate-300"
        >
          &gt;
        </button>
        
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 dark:bg-slate-700 dark:text-slate-300"
        >
          Last
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Available Services
        </h1>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category.toLowerCase()}>
                {category}
              </option>
            ))}
          </select>
          
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

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

      {/* Empty State */}
      {!isLoading && !error && filteredServices.length === 0 && (
        <div className="text-center py-10">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-3">
            <MagnifyingGlassIcon className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No services found</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:hover:bg-blue-900/40"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Services Grid */}
      {!isLoading && !error && filteredServices.length > 0 && (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentServices.map((service) => {
              const provider = providers[service.providerID] || {};
              
              return (
                <div
                  key={service.serviceID}
                  className="rounded-lg border border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {service.serviceName}
                      </h3>
                      {provider.serviceCategory && (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                          {provider.serviceCategory}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
                      {service.description}
                    </p>
                  </div>

                  {/* Provider Info */}
                  <div className="mb-4 rounded-lg bg-gray-50 p-3 dark:bg-slate-700/30">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {provider.businessName || 'Unknown Provider'}
                      </span>
                      {provider.verified && (
                        <CheckBadgeIcon className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <div className="mt-2 space-y-1">
                      {provider.location && (
                        <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                          <MapPinIcon className="mr-1.5 h-5 w-5 flex-shrink-0" />
                          {provider.location}
                        </div>
                      )}
                      {provider.phoneNumber && (
                        <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                          <PhoneIcon className="mr-1.5 h-5 w-5 flex-shrink-0" />
                          {provider.phoneNumber}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="mb-4 flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-500 dark:text-slate-400">
                      <CurrencyDollarIcon className="mr-1.5 h-5 w-5" />
                      {formatCurrency(service.price)}
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-slate-400">
                      <ClockIcon className="mr-1.5 h-5 w-5" />
                      {service.duration}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 dark:border-slate-700">
                    <button
                      onClick={() => handleBookService(service)}
                      className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      Book Service
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <PaginationControls />
        </>
      )}

      {showBookingModal && selectedService && (
        <BookingModal
          service={selectedService}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedService(null);
            setBookingData({ date: '', time: '', notes: '' });
          }}
        />
      )}

      {/* Scroll to top button - Always visible for debugging */}
      {showScrollToTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 z-40"
          aria-label="Scroll to top"
        >
          <ArrowUpIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default Services;