import { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  ClockIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  CalendarDaysIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  BuildingStorefrontIcon,
  CheckIcon,
  XMarkIcon,
  StarIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import { useAuth } from '../../contexts/auth/AuthContext';
import vendorAPI from '../../services/vendor/vendorAPI';
import userAPI from '../../services/auth/userAPI';
import publicAPI from '../../services/public/publicAPI';
import { toast } from 'react-hot-toast';

// Business Setup Guide component for new vendors
const BusinessSetupGuide = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Services
        </h1>
      </div>

      <div className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white shadow-md dark:from-blue-700 dark:to-indigo-800">
        <div className="flex flex-col items-center sm:flex-row sm:justify-between">
          <div className="mb-4 flex items-center sm:mb-0">
            <BuildingStorefrontIcon className="h-10 w-10 text-blue-100" />
            <div className="ml-4">
              <h2 className="text-2xl font-bold">Set Up Your Business Profile</h2>
              <p className="text-blue-100">You need to create your business profile before managing services</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/vendor/business')}
            className="rounded-lg bg-white px-4 py-2 font-medium text-blue-700 shadow-sm hover:bg-blue-50"
          >
            Create Business Profile
          </button>
        </div>
      </div>
      
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
          Why create a business profile?
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <CheckIcon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Offer your services</h4>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Create a business profile to start adding and managing your service offerings.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <CheckIcon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Customize pricing and details</h4>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Set your own prices, service durations, and detailed descriptions.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <CheckIcon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Attract more customers</h4>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Comprehensive service listings help customers find and choose your business.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate('/vendor/business')}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <BuildingStorefrontIcon className="mr-2 h-5 w-5" />
            Create Your Business Profile
          </button>
        </div>
      </div>
      
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <div className="flex">
          <div className="flex-shrink-0">
            <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Once your business profile is created and approved by RepairLink admins, you can start creating and managing your service offerings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Service categories for UI organization
const serviceCategories = [
  { value: "Plumbing", label: "Plumbing" },
  { value: "Electrical", label: "Electrical" },
  { value: "Automotive", label: "Automotive" },
  { value: "Carpentry", label: "Carpentry" },
  { value: "Cleaning", label: "Cleaning" },
  { value: "Landscaping", label: "Landscaping" },
  { value: "Painting", label: "Painting" },
  { value: "Roofing", label: "Roofing" },
  { value: "HVAC", label: "HVAC & Air Conditioning" },
  { value: "Appliance", label: "Appliance Repair" },
  { value: "Security", label: "Security Systems" },
  { value: "Other", label: "Other Services" }
];

const Services = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [serviceStats, setServiceStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [providerData, setProviderData] = useState(null);
  const [noBusinessProfile, setNoBusinessProfile] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [viewingReviews, setViewingReviews] = useState(null);

  const [formData, setFormData] = useState({
    serviceName: '',
    description: '',
    price: '',
    duration: ''
  });

  // Add this with your other state variables at the top of the Services component
const [groupedServices, setGroupedServices] = useState({});

  // Fetch services on component mount
  useEffect(() => {
    if (user) {
      fetchServices();
    }
  }, [user]);

  // Reset form when editing state changes
  useEffect(() => {
    if (editingService) {
      setFormData({
        serviceName: editingService.serviceName || editingService.name || '',
        description: editingService.description || '',
        price: editingService.price?.toString() || '',
        duration: editingService.duration || ''
      });
    } else {
      resetForm();
    }
  }, [editingService]);

  // Update the fetchServices function to include review information

// Update the fetchServices function to properly count bookings for each service
const fetchServices = async () => {
  if (!user) {
    setIsLoading(false);
    return;
  }
  
  setIsLoading(true);
  setIsRefreshing(true);
  
  try {
    // Start by getting the user ID from email
    const userResponse = await userAPI.getUserByEmail(user.email);
    const userDetails = userResponse.data;
    
    if (!userDetails || !userDetails.userID) {
      setError("User ID not found. Please check your account.");
      setIsLoading(false);
      return;
    }
    
    try {
      // Try to get provider details using user ID
      const profileResponse = await vendorAPI.getProviderByUserId(userDetails.userID);
      const provider = profileResponse.data;
      setProviderData(provider);
      
      // Fetch services
      const servicesResponse = await vendorAPI.getServices(provider.providerID);
      
      // Format service data consistently
      const formattedServices = (servicesResponse.data || []).map(service => ({
        id: service.serviceID || service.id,
        serviceName: service.serviceName || service.name,
        description: service.description || '',
        price: service.price || 0,
        duration: service.duration || '',
        category: service.category || 'Uncategorized',
        bookingCount: 0, // Initialize with 0, will be updated below
        reviewCount: 0,
        averageRating: 0
      }));
      
      // Fetch ALL bookings to properly count them by service
      const bookingsResponse = await vendorAPI.getBookings(provider.providerID);
      const allBookings = bookingsResponse.data || [];
      
      // Count bookings by service ID
      const bookingsByService = {};
      allBookings.forEach(booking => {
        const serviceId = booking.serviceID;
        if (!bookingsByService[serviceId]) {
          bookingsByService[serviceId] = 0;
        }
        bookingsByService[serviceId]++;
      });
      
      // Create service stats with accurate booking counts
      const stats = {};
      formattedServices.forEach(service => {
        stats[service.id] = {
          bookingCount: bookingsByService[service.id] || 0
        };
      });
      
      setServiceStats(stats);
      
      // Enhance services with review data
      const enhancedServices = await Promise.all(formattedServices.map(async (service) => {
        try {
          // Get review summary for this service
          const reviewResponse = await publicAPI.getServiceReviews(service.id);
          const reviews = reviewResponse.data || [];
          
          // Update the service with booking count from our calculated stats
          const updatedService = {
            ...service,
            bookingCount: bookingsByService[service.id] || 0
          };
          
          if (reviews.length > 0) {
            // Calculate average rating
            const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
            const averageRating = totalRating / reviews.length;
            
            return {
              ...updatedService,
              reviewCount: reviews.length,
              averageRating: averageRating
            };
          }
          
          return updatedService;
        } catch (err) {
          return {
            ...service,
            bookingCount: bookingsByService[service.id] || 0
          };
        }
      }));
      
      // Group services by category
      const groupedServices = enhancedServices.reduce((groups, service) => {
        const category = service.category || 'Uncategorized';
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(service);
        return groups;
      }, {});
      
      setServices(enhancedServices);
      setGroupedServices(groupedServices);
      
    } catch (providerError) {
      // Check if error is specific to missing business profile
      if (providerError.response && 
          providerError.response.status === 500 && 
          providerError.response.data.message?.includes('ServiceProvider not found')) {
        setNoBusinessProfile(true);
      } else {
        toast.error("Error loading profile data");
        console.error(providerError);
      }
    }
  } catch (error) {
    toast.error('Failed to load services');
  } finally {
    setIsLoading(false);
    setIsRefreshing(false);
  }
};

  const resetForm = () => {
    setFormData({
      serviceName: '',
      description: '',
      price: '',
      duration: ''
    });
    setFormErrors({});
  };

  const validateForm = (data) => {
    const errors = {};
    
    if (!data.serviceName.trim()) {
      errors.serviceName = 'Service name is required';
    }
    
    if (!data.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!data.price) {
      errors.price = 'Price is required';
    } else if (isNaN(parseFloat(data.price)) || parseFloat(data.price) <= 0) {
      errors.price = 'Price must be greater than 0';
    }
    
    if (!data.duration.trim()) {
      errors.duration = 'Duration is required';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format data exactly as required by the backend API
      const serviceData = {
        providerID: providerData?.providerID,
        serviceName: formData.serviceName,
        description: formData.description,
        price: parseFloat(formData.price),
        duration: formData.duration
      };
      
      let response;
      
      if (editingService) {
        // Update existing service
        response = await vendorAPI.updateService(editingService.id, serviceData);
        
        const updatedService = {
          id: response.data.serviceID || response.data.id,
          serviceName: response.data.serviceName || response.data.name,
          description: response.data.description || '',
          price: response.data.price || 0,
          duration: response.data.duration || '',
          category: 'Uncategorized'
        };
        
        setServices(prevServices => prevServices.map(service => 
          service.id === editingService.id ? updatedService : service
        ));
        
        toast.success('Service updated successfully');
      } else {
        // Create new service
        response = await vendorAPI.createService(serviceData);
        
        const newService = {
          id: response.data.serviceID || response.data.id,
          serviceName: response.data.serviceName || response.data.name,
          description: response.data.description || '',
          price: response.data.price || 0,
          duration: response.data.duration || '',
          category: 'Uncategorized'
        };
        
        setServices(prevServices => [...prevServices, newService]);
        
        toast.success('Service added successfully');
      }
      
      setIsModalOpen(false);
      resetForm();
      setEditingService(null);
    } catch (error) {
      toast.error(editingService ? 'Failed to update service' : 'Failed to add service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      return;
    }
    
    try {
      await vendorAPI.deleteService(serviceId);
      setServices(services.filter(service => service.id !== serviceId));
      toast.success('Service deleted successfully');
    } catch (error) {
      toast.error('Failed to delete service');
    }
  };

  // Format service duration to be more user-friendly
  const formatDuration = (duration) => {
    if (!duration) return '—';
    
    // If it's already formatted with text, return as is
    if (typeof duration === 'string' && 
        (duration.includes('hour') || duration.includes('min') || 
         duration.includes('day') || duration.includes('week'))) {
      return duration;
    }
    
    // If it's a number or numeric string, assume it's minutes
    const mins = parseInt(duration);
    if (isNaN(mins)) return duration;
    
    if (mins < 60) return `${mins} min`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    
    if (remainingMins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMins} min`;
  };

  // Calculate service statistics
  const calculateStats = () => {
    if (services.length === 0) {
      return { avgPrice: 0, totalServices: 0 };
    }
    
    const totalPrice = services.reduce((sum, s) => sum + parseFloat(s.price || 0), 0);
    const avgPrice = totalPrice / services.length;
    
    return {
      avgPrice,
      totalServices: services.length
    };
  };

  const stats = calculateStats();

  // Render content based on loading/error/noBusinessProfile state
  const renderContent = () => {
    // If no business profile, show the setup guide
    if (noBusinessProfile) {
      return <BusinessSetupGuide />;
    }
    
    // Regular content when we have a business profile
    return (
      <div className="space-y-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Services
          </h1>
          <div className="flex items-center gap-3 mr-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fetchServices()}
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
              disabled={isRefreshing}
            >
              <ArrowPathIcon className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditingService(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Service
            </motion.button>
          </div>
        </div>

        {/* Statistics cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Services</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{stats.totalServices}</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
                <MapPinIcon className="h-6 w-6 text-blue-700 dark:text-blue-400" />
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Total service offerings
            </p>
          </div>
          
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Price</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(stats.avgPrice)}
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
                <CurrencyDollarIcon className="h-6 w-6 text-green-700 dark:text-green-400" />
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Across all service offerings
            </p>
          </div>
          
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                  {Object.values(serviceStats).reduce((total, stat) => total + (stat.bookingCount || 0), 0)}
                </p>
              </div>
              <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900/20">
                <CalendarDaysIcon className="h-6 w-6 text-amber-700 dark:text-amber-400" />
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              From all your services
            </p>
          </div>
        </div>

        {/* Content area */}
        {isLoading ? (
          <div className="flex h-60 items-center justify-center rounded-lg border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-600 dark:border-blue-400"></div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading services...</p>
            </div>
          </div>
        ) : services.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white py-16 dark:border-slate-700 dark:bg-slate-800">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
              <CurrencyDollarIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No services yet</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by adding your first service.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Service
            </button>
          </div>
        ) : Object.keys(groupedServices).length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <p className="text-center text-gray-500 dark:text-gray-400">
              Services loaded but not properly categorized. Please refresh or check service categories.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedServices).map(([category, categoryServices]) => (
              <div key={category} className="rounded-lg border border-gray-200 bg-white overflow-hidden dark:border-slate-700 dark:bg-slate-800">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-3 dark:border-slate-700 dark:bg-slate-800/60">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">{category}</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {categoryServices.map(service => (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="group relative rounded-lg border border-gray-200 dark:border-slate-700 bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-slate-800"
                      >
                        <div className="p-5">
                          <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {service.serviceName}
                            </h3>
                            <div className="flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => {
                                    setEditingService(service);
                                    setIsModalOpen(true);
                                  }}
                                  className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-slate-700 dark:hover:text-white"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(service.id)}
                                  className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-slate-700 dark:hover:text-red-400"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          <p className="mb-4 h-12 overflow-hidden text-sm text-gray-600 dark:text-gray-300">
                            {service.description.length > 70 
                              ? `${service.description.substring(0, 70)}...` 
                              : service.description}
                          </p>
                          
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center text-lg font-bold text-gray-900 dark:text-white">
                              {formatCurrency(service.price)}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <ClockIcon className="mr-1 h-4 w-4" />
                              {formatDuration(service.duration)}
                            </div>
                          </div>
                          
                          {/* Bookings count */}
                          <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <CalendarDaysIcon className="mr-1 h-4 w-4" />
                            <span>
                              {serviceStats[service.id]?.bookingCount || 0} booking{(serviceStats[service.id]?.bookingCount || 0) !== 1 ? 's' : ''}
                            </span>
                          </div>
                          
                          {/* Ratings and Reviews section */}
                          <div className="mt-3 flex items-center justify-between">
                            {/* Star Rating Display */}
                            <div className="flex items-center">
                              {service.averageRating > 0 ? (
                                <div className="flex items-center">
                                  <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                      <StarIcon
                                        key={i}
                                        className={`h-4 w-4 ${
                                          i < Math.floor(service.averageRating) 
                                            ? 'text-yellow-400' 
                                            : i < Math.ceil(service.averageRating) && service.averageRating % 1 > 0
                                              ? 'text-yellow-400/50'
                                              : 'text-gray-300 dark:text-gray-600'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {service.averageRating.toFixed(1)}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-500 dark:text-gray-400">No ratings</span>
                              )}
                            </div>
                            
                            {/* View Reviews button - only shown when there are reviews */}
                            {(service.reviewCount > 0 || service.averageRating > 0) && (
                              <button
                                onClick={() => setSelectedService(service)}
                                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                <StarIcon className="mr-1 h-4 w-4" />
                                View Reviews
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Business verification message if applicable */}
        {providerData && !providerData.verified && (
          <div className="mt-6 rounded-lg bg-amber-50 p-4 dark:bg-amber-900/10">
            <div className="flex">
              <div className="flex-shrink-0">
                <InformationCircleIcon className="h-5 w-5 text-amber-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                   Your business is still pending verification by RepairLink admins. Services can not be created and your business won't be visible to customers until is approved.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Service Form Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
              {/* Background overlay */}
              <div 
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
                onClick={() => {
                  if (!isSubmitting) {
                    setIsModalOpen(false);
                    resetForm();
                    setEditingService(null);
                  }
                }}
              />
              
              {/* Modal */}
              <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all dark:bg-slate-800 sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                <div className="px-4 pb-4 pt-5 sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                      <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-2">
                        {editingService ? 'Edit Service' : 'Add New Service'}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {editingService 
                          ? 'Update the details of your existing service' 
                          : 'Create a new service offering for your customers'}
                      </p>

                      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        {/* Service Name */}
                        <div>
                          <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Service Name*
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id="serviceName"
                              value={formData.serviceName}
                              onChange={(e) => {
                                setFormData({...formData, serviceName: e.target.value});
                                setFormErrors({...formErrors, serviceName: ''});
                              }}
                              className={`block w-full rounded-lg border ${
                                formErrors.serviceName 
                                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                              } px-3 py-2 shadow-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white sm:text-sm`}
                              disabled={isSubmitting}
                              placeholder="E.g., Basic Plumbing Service"
                            />
                            {formErrors.serviceName && (
                              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.serviceName}</p>
                            )}
                          </div>
                        </div>
                        
                        {/* Description */}
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Description*
                          </label>
                          <div className="mt-1">
                            <textarea
                              id="description"
                              value={formData.description}
                              onChange={(e) => {
                                setFormData({...formData, description: e.target.value});
                                setFormErrors({...formErrors, description: ''});
                              }}
                              rows={4}
                              className={`block w-full rounded-lg border ${
                                formErrors.description 
                                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                              } px-3 py-2 shadow-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white sm:text-sm`}
                              disabled={isSubmitting}
                              placeholder="Describe what this service includes, what customers can expect, etc."
                            />
                            {formErrors.description && (
                              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.description}</p>
                            )}
                          </div>
                        </div>
                        
                        {/* Price and Duration */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Price (ZAR)*
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-gray-500 sm:text-sm">R</span>
                              </div>
                              <input
                                type="number"
                                id="price"
                                value={formData.price}
                                onChange={(e) => {
                                  setFormData({...formData, price: e.target.value});
                                  setFormErrors({...formErrors, price: ''});
                                }}
                                min="0"
                                step="0.01"
                                className={`block w-full rounded-lg border ${
                                  formErrors.price 
                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                } pl-7 pr-3 py-2 shadow-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white sm:text-sm`}
                                placeholder="0.00"
                                disabled={isSubmitting}
                              />
                              {formErrors.price && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.price}</p>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Duration*
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                id="duration"
                                value={formData.duration}
                                onChange={(e) => {
                                  setFormData({...formData, duration: e.target.value});
                                  setFormErrors({...formErrors, duration: ''});
                                }}
                                className={`block w-full rounded-lg border ${
                                  formErrors.duration 
                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                } px-3 py-2 shadow-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white sm:text-sm`}
                                placeholder="E.g., 2 hours, 30 minutes"
                                disabled={isSubmitting}
                              />
                              {formErrors.duration && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.duration}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Form Buttons */}
                        <div className="mt-6 flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setIsModalOpen(false);
                              resetForm();
                              setEditingService(null);
                            }}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                            disabled={isSubmitting}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
                              isSubmitting
                                ? 'bg-blue-400 dark:bg-blue-600/50'
                                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                            }`}
                          >
                            {isSubmitting ? (
                              <span className="flex items-center">
                                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                {editingService ? 'Updating...' : 'Creating...'}
                              </span>
                            ) : (
                              editingService ? 'Update Service' : 'Create Service'
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Service Reviews Modal */}
        {selectedService && (
          <ServiceReviewsModal
            serviceId={selectedService.id}
            serviceName={selectedService.serviceName}
            onClose={() => setSelectedService(null)}
          />
        )}
        {viewingReviews && (
          <ServiceReviewsModal 
            serviceId={viewingReviews.id} 
            serviceName={viewingReviews.name}
            onClose={() => setViewingReviews(null)}
          />
        )}
      </div>
    );
  };

  // Don't use early returns - always return renderContent()
  return renderContent();
};

// Update the ServiceReviewsModal component
const ServiceReviewsModal = ({ serviceId, serviceName, onClose }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerMap, setCustomerMap] = useState({});

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        // Use the existing API endpoint for service reviews
        const response = await publicAPI.getServiceReviews(serviceId);
        const reviewsData = response.data || [];
        setReviews(reviewsData);
        
        // Fetch customer details for all reviews
        await fetchCustomerDetails(reviewsData);
      } catch (err) {
        setError("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [serviceId]);

  // Add this function to fetch customer details
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

  // Helper function to get customer name
  const getCustomerName = (review) => {
    if (!review?.customerID) return "Anonymous Customer";
    return customerMap[review.customerID]?.fullName || `Customer #${review.customerID}`;
  };

  // Helper function to get customer initials for avatar
  const getCustomerInitials = (review) => {
    if (!review?.customerID) return "A";
    return customerMap[review.customerID]?.name?.charAt(0) || 'C';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all dark:bg-slate-800 sm:my-8 sm:w-full sm:max-w-2xl sm:align-middle">
          <div className="px-4 pb-4 pt-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Reviews for {serviceName}
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent text-blue-600 motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No reviews yet for this service.
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {reviews.map(review => (
                  <div key={review.id} className="border-b border-gray-200 dark:border-slate-700 pb-4 last:border-0">
                    <div className="flex items-start justify-between mb-3">
                      {/* Customer info with avatar */}
                      <div className="flex items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 mr-3">
                          {getCustomerInitials(review)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {getCustomerName(review)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      {/* Rating */}
                      <div className="flex items-center">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon 
                              key={i} 
                              className={`h-5 w-5 ${i < Math.round(review.rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          {review.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Review comment */}
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-slate-700/30 p-3 rounded-lg">
                      {review.comment || "No comment provided"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import apiClient from '../../utils/apiClient';

export default Services;