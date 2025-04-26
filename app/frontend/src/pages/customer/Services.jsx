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
  ArrowUpIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/formatCurrency';
import { useAuth } from '../../contexts/auth/AuthContext';
import { customerAPI, publicAPI } from '../../services';
import { toast } from 'react-hot-toast';
import apiClient from '../../utils/apiClient';

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

    // Add these states to your BookingModal component
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [readyToSubmit, setReadyToSubmit] = useState(false);

    // Add this state to your BookingModal component
    const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);

    // 1. First, update the state structure to separate booking data from form values
    // Add this near the top of your BookingModal component:

    const [formNotes, setFormNotes] = useState('');  // Separate state for notes input

    // 2. Replace the useEffect for generating time slots to track the date more precisely
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

    // Replace the existing handleSubmit function
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
          // Get customerID from the authenticated user
          const customerID = await getCustomerID(user.email);
          
          // Format date and time correctly for the API
          const bookingDateTime = `${bookingData.date}T${bookingData.time.split(':00')[0]}:00:00`;
          
          // Format data for booking API with dynamic customerID
          const bookingPayload = {
            customerID: customerID, // Using the dynamic customerID
            serviceID: Number(service.serviceID),
            providerID: Number(service.providerID),
            bookingDate: bookingDateTime,
            additionalNotes: formNotes || "No additional notes provided."
          };
          
          console.log("Sending booking payload:", JSON.stringify(bookingPayload));
          
          // Create booking through API
          const response = await customerAPI.createBooking(bookingPayload);
          
          // Show success message
          toast.success('Booking created successfully!');
          
          // Close modal and reset form
          onClose();
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

    const today = new Date().toISOString().split('T')[0];

    // Add this helper component inside your BookingModal component
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

    // Add this function to format dates
    const formatDateForDisplay = (dateString) => {
      const options = { weekday: 'long', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Add this function to check if a date is a weekend
    const isWeekend = (dateString) => {
      const date = new Date(dateString);
      const day = date.getDay();
      return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
    };

    // Add this function to find the next available weekday
    const getNextAvailableWeekday = (date) => {
      const nextDate = new Date(date);
      while (isWeekend(nextDate)) {
        nextDate.setDate(nextDate.getDate() + 1);
      }
      return nextDate.toISOString().split('T')[0];
    };

    // Replace this function in your BookingModal component
    // To create a custom warning toast function:
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

    // Add this custom success notification function in your BookingModal component
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

                  {/* Time Selection - Replace with improved version */}
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

                  {/* Notes - Update to use separate form state */}
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

        {/* Add this confirmation modal inside the BookingModal component */}
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
                        
                        // Get customerID from the authenticated user
                        getCustomerID(user.email)
                          .then(customerID => {
                            // Format date and time correctly for the API
                            const bookingDateTime = `${bookingData.date}T${bookingData.time.split(':00')[0]}:00:00`;
                            
                            // Format data for booking API with dynamic customerID
                            const bookingPayload = {
                              customerID: customerID, // Using the dynamic customerID
                              serviceID: Number(service.serviceID),
                              providerID: Number(service.providerID),
                              bookingDate: bookingDateTime,
                              additionalNotes: formNotes || "No additional notes provided."
                            };
                            
                            console.log("Sending booking payload:", JSON.stringify(bookingPayload));
                            
                            // Create booking through API
                            return customerAPI.createBooking(bookingPayload);
                          })
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

  // Add this helper function inside the Services component, before useEffect hooks
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