// filepath: c:\Users\sphas\Documents\GitHub\RepairLink\app\frontend\src\pages\vendor\Business.jsx
// Remove unused imports
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BuildingStorefrontIcon,
  MapPinIcon,
  WrenchScrewdriverIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  CheckCircleIcon,
  UserIcon,
  PhoneIcon,
  DocumentCheckIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  StarIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  EnvelopeIcon, 
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { ClockIcon as SolidClockIcon } from '@heroicons/react/24/solid';
import { formatCurrency } from '../../utils/formatCurrency';
import { useAuth } from '../../contexts/auth/AuthContext';
import { vendorAPI, userAPI } from '../../services';
import { toast } from 'react-hot-toast';
import apiClient from '../../utils/apiClient';

// Remove the onboarding steps array 
// And replace with professional welcome message constants
// Replace with welcoming content rather than inviting content
const vendorWelcomeContent = {
  title: "Welcome to RepairLink Business",
  description: "We're excited to have you as a service provider. Setting up your business profile helps customers discover your services and expertise.",
  benefits: [
    "Reach customers already searching for your specific services",
    "Effortlessly manage bookings with our streamlined scheduling system",
    "Showcase your expertise through verified customer reviews",
    "Gain visibility and recognition in your local service area"
  ]
};

// Replace the duration field in the service form

// First, add these helper functions at the beginning of your Business component
const parseDuration = (durationString) => {
  if (!durationString) return { minutes: 0 };
  
  // If it's already a number, return it as minutes
  if (!isNaN(durationString)) {
    return { minutes: parseInt(durationString) };
  }
  
  const durationStr = durationString.toLowerCase().trim();
  const match = durationStr.match(/^(\d+)\s*(minute|minutes|min|mins|hour|hours|hr|hrs|day|days|week|weeks|month|months)$/);
  
  if (!match) {
    return { minutes: 0, error: "Invalid duration format" };
  }
  
  const value = parseInt(match[1]);
  const unit = match[2];
  
  if (unit.startsWith('minute') || unit === 'min' || unit === 'mins') {
    return { minutes: value };
  } else if (unit.startsWith('hour') || unit === 'hr' || unit === 'hrs') {
    return { minutes: value * 60 };
  } else if (unit.startsWith('day')) {
    return { minutes: value * 24 * 60 };
  } else if (unit.startsWith('week')) {
    return { minutes: value * 7 * 24 * 60 };
  } else if (unit.startsWith('month')) {
    return { minutes: value * 30 * 24 * 60 }; // approximation
  }
  
  return { minutes: 0, error: "Unsupported time unit" };
};

const formatDuration = (minutes) => {
  if (!minutes) return "";
  
  const mins = parseInt(minutes);
  if (mins < 60) return `${mins} minute${mins !== 1 ? 's' : ''}`;
  if (mins < 24 * 60) {
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    if (remainingMins === 0) return `${hours} hour${hours !== 1 ? 's' : ''}`;
    return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMins} minute${remainingMins !== 1 ? 's' : ''}`;
  }
  const days = Math.floor(mins / (24 * 60));
  return `${days} day${days !== 1 ? 's' : ''}`;
};

// Add this utility function in your component
// Update this utility function to avoid console.error
const handleApiError = (error, defaultMessage) => {
  // Remove the console.error line
  
  // Extract message from error response or use default
  const errorMsg = error.response?.data?.message || 
                  error.message || 
                  defaultMessage;
                  
  toast.error(errorMsg);
  return errorMsg;
};

// Benefits of registering a business on RepairLink
const businessBenefits = [
  {
    title: "Expand Your Customer Base",
    description: "Reach a wider audience actively looking for service providers like you.",
    icon: UserIcon
  },
  {
    title: "Build Trust with Verification",
    description: "Our verification process helps customers trust your business from the start.",
    icon: ShieldCheckIcon
  },
  {
    title: "Manage Bookings Easily",
    description: "Streamlined booking management and communication with customers.",
    icon: ClockIcon
  },
  {
    title: "Grow Your Online Reputation",
    description: "Collect reviews and ratings to strengthen your digital presence.",
    icon: StarIcon
  }
];

// Service categories matching the backend
const serviceCategories = [
  { value: "Plumbing", label: "Plumbing", icon: "🔧" },
  { value: "Electrical", label: "Electrical", icon: "⚡" },
  { value: "Automotive", label: "Automotive", icon: "🚗" },
  { value: "Carpentry", label: "Carpentry", icon: "🪚" },
  { value: "Cleaning", label: "Cleaning", icon: "🧹" },
  { value: "Landscaping", label: "Landscaping", icon: "🌱" },
  { value: "Painting", label: "Painting", icon: "🎨" },
  { value: "Roofing", label: "Roofing", icon: "🏠" },
  { value: "HVAC", label: "HVAC & Air Conditioning", icon: "❄️" },
  { value: "Appliance", label: "Appliance Repair", icon: "🔌" },
  { value: "Security", label: "Security Systems", icon: "🔒" },
  { value: "IT Services", label: "IT Services", icon: "💻" },
  { value: "Other", label: "Other Services", icon: "🛠️" }
];

const Business = () => {
  const { user } = useAuth();
  
  // State for business data - only include fields from the API
  const [business, setBusiness] = useState({
    businessName: "",
    serviceCategory: "",
    location: "",
    phoneNumber: "",
    about: "",
    businessEmail: "", // Add this field
    website: ""        // Add this field
  });

  const [services, setServices] = useState([]);
  
  // UI state management
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [isAddingService, setIsAddingService] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [newService, setNewService] = useState({
    serviceName: "",
    description: "",
    price: "",
    duration: ""
  });

  // Form validation and errors
  const [businessFormErrors, setBusinessFormErrors] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState({});

  // Business status tracking
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isApproved, setIsApproved] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Provider data tracking
  const [providerExists, setProviderExists] = useState(false);
  const [providerID, setProviderID] = useState(null);

  // Load business data on component mount
  useEffect(() => {
    fetchBusinessData();
  }, []);

  // Fetch business data from backend
const fetchBusinessData = async () => {
  setIsLoading(true);
  setError(null);
  
  try {
    // Try to get provider profile using vendor API - it will use auth token automatically
    const profileResponse = await vendorAPI.getProfile();
    const providerData = profileResponse.data;
    
    // Update state with existing business data (no console.log)
    setBusiness({
      businessName: providerData.businessName || "",
      serviceCategory: providerData.serviceCategory || "",
      location: providerData.location || "",
      phoneNumber: providerData.phoneNumber || "",
      about: providerData.about || "",
      businessEmail: providerData.businessEmail || "", // Add this
      website: providerData.website || ""              // Add this
    });
    
    setProviderID(providerData.providerID);
    setProviderExists(true);
    setShowOnboarding(false);
    setIsApproved(providerData.verified);
    
    // Fetch services using the provider ID from the profile
    try {
      const servicesResponse = await vendorAPI.getServices(providerData.providerID);
      const servicesData = servicesResponse.data || [];
      
      // Map the services data to match the expected format
      const mappedServices = servicesData.map(service => ({
        id: service.serviceID,
        serviceName: service.serviceName || service.name,
        name: service.serviceName || service.name,
        description: service.description,
        price: parseFloat(service.price) || 0,
        duration: service.duration
      }));
      
      // Set services state (no console.log)
      setServices(mappedServices);
    } catch (servicesError) {
      // Silent error handling without console.error
      toast.error("Failed to load services. Please refresh the page.");
    }
  } catch (error) {
    // Silent error handling without console.error
    
    // Provider doesn't exist yet, show onboarding flow
    setProviderExists(false);
    setShowOnboarding(true);
    
    // Pre-fill with current user data if available
    if (user) {
      try {
        // Get user details by email
        const userResponse = await apiClient.get(`/v1/users/by-email/${user.email}`);
        const userData = userResponse.data;
        
        // Pre-populate the form with user data
        setBusiness(prev => ({
          ...prev,
          phoneNumber: userData.phoneNumber || ""
        }));
      } catch (userError) {
        // Silent handling without console.error
      }
    }
  } finally {
    setIsLoading(false);
  }
};

  // Validate business form
  const validateBusinessForm = (data) => {
    const errors = {};
    
    if (!data.businessName) {
      errors.businessName = "Business name is required";
    } else if (data.businessName.length < 2) {
      errors.businessName = "Business name must be at least 2 characters";
    }
    
    if (!data.phoneNumber) {
      errors.phoneNumber = "Phone number is required";
    }
    
    if (!data.serviceCategory) {
      errors.serviceCategory = "Please select a service category";
    }
    
    if (!data.location) {
      errors.location = "Location is required";
    }
    
    if (!data.about) {
      errors.about = "Please provide a brief description of your business";
    } else if (data.about.length < 20) {
      errors.about = "Description should be at least 20 characters";
    }
    
    // Add email validation
    if (data.businessEmail && !data.businessEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.businessEmail = "Please enter a valid email address";
    }
    
    // Add website validation (optional field)
    if (data.website && !data.website.match(/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/)) {
      errors.website = "Please enter a valid website URL";
    }
    
    return errors;
  };

  // Submit new business profile
  const handleBusinessSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateBusinessForm(business);
    if (Object.keys(errors).length > 0) {
      setBusinessFormErrors(errors);
      toast.error("Please fix the errors in the form");
      return;
    }
    
    // Show confirmation dialog directly
    setIsConfirming(true);
  };

  // Submit business profile after confirmation
  // Update the handleConfirmSubmit function to use authenticated user data
const handleConfirmSubmit = async () => {
  setIsSubmitting(true);
  try {
    // Get user info dynamically from auth context
    if (!user || !user.email) {
      throw new Error("User not authenticated");
    }
    
    // First get user details by email to ensure we have the most current data
    const userResponse = await apiClient.get(`/v1/users/by-email/${user.email}`);
    const userData = userResponse.data;
    
    if (!userData || !userData.userID) {
      throw new Error("Failed to get user details");
    }
    
    // Create provider profile with API using the retrieved userID
    const profileData = {
      userID: userData.userID,
      businessName: business.businessName,
      serviceCategory: business.serviceCategory,
      location: business.location,
      about: business.about,
      phoneNumber: business.phoneNumber,
      businessEmail: business.businessEmail, // Add this
      website: business.website               // Add this
    };
    
    console.log("Creating provider profile with data:", profileData);
    const response = await vendorAPI.createProvider(profileData);
    
    // Get the provider ID from the response
    const providerID = response.data.providerID;
    setProviderID(providerID);
    setProviderExists(true);
    setShowOnboarding(false);
    
    // Show success notification
    toast.success("Business profile created successfully! It will be reviewed shortly.");
  } catch (error) {
    const errorMsg = handleApiError(error, "Failed to create business profile. Please try again.");
    setError(errorMsg);
  } finally {
    setIsSubmitting(false);
    setIsConfirming(false);
  }
};

  // Update existing business profile
  const handleBusinessUpdate = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateBusinessForm(business);
    if (Object.keys(errors).length > 0) {
      setBusinessFormErrors(errors);
      toast.error("Please fix the errors in the form");
      return;
    }
    
    setIsSubmitting(true);

    try {
      const updateData = {
        businessName: business.businessName,
        serviceCategory: business.serviceCategory,
        phoneNumber: business.phoneNumber,
        location: business.location,
        about: business.about,
        businessEmail: business.businessEmail, // Add this
        website: business.website              // Add this
      };
      
      await vendorAPI.updateProvider(providerID, updateData);
      
      setIsEditingBusiness(false);
      toast.success("Business profile updated successfully!");
    } catch (error) {
      console.error("Error updating business profile:", error);
      toast.error("Failed to update business profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update validateServiceForm function
 // Update validateServiceForm function for string duration
const validateServiceForm = (data) => {
  const errors = {
    serviceName: "",
    description: "",
    price: "",
    duration: ""
  };
  
  if (!data.serviceName) {
    errors.serviceName = "Service name is required";
  } else if (data.serviceName.length < 3) {
    errors.serviceName = "Name must be at least 3 characters";
  }
  
  if (!data.description) {
    errors.description = "Description is required";
  } else if (data.description.length < 10) {
    errors.description = "Description should be more detailed (min 10 chars)";
  }
  
  if (!data.price) {
    errors.price = "Price is required";
  } else if (isNaN(parseFloat(data.price)) || parseFloat(data.price) <= 0) {
    errors.price = "Price must be greater than 0";
  }
  
  if (!data.duration) {
    errors.duration = "Duration is required";
  } else if (data.duration.trim() === "") {
    errors.duration = "Duration cannot be empty";
  }
  
  return errors;
};

  // Update handleAddService function to use vendorAPI.createService
  const handleAddService = async (e) => {
    e.preventDefault();
    console.log("Add service form submitted");
    
    // Validate form
    const errors = validateServiceForm(newService);
    const hasErrors = Object.values(errors).some(error => error !== "");
    setFormErrors(errors);
    
    if (hasErrors) {
      return;
    }
    
    try {
      // Show loading state
      setIsSubmitting(true);
      
      // Format data exactly as required by the backend API
      const serviceData = {
        providerID: providerID,
        serviceName: newService.serviceName,
        description: newService.description,
        price: parseFloat(newService.price),
        duration: newService.duration // Keep as string
      };
      
      console.log("Creating new service with data:", serviceData);
      
      // Use vendorAPI.createService instead of direct fetch
      const response = await vendorAPI.createService(serviceData);
      
      // Fix here: The API might return the data directly, not nested under a 'data' property
      const serviceResponse = response.data || response; // Handle both possible response structures
      
      console.log("Service created successfully:", serviceResponse);
      
      // Add new service to the state with consistent property names
      const createdService = {
        id: serviceResponse.serviceID || serviceResponse.id || Date.now(), // Fallback to timestamp if no ID
        serviceName: newService.serviceName,
        name: newService.serviceName,
        description: newService.description,
        price: parseFloat(newService.price),
        duration: newService.duration // Keep as string
      };
      
      setServices(prevServices => [...prevServices, createdService]);
      
      // Reset form and close
      setNewService({ 
        serviceName: "", 
        description: "", 
        price: "", 
        duration: "" 
      });
      
      setIsAddingService(false);
      toast.success("Service added successfully!");
    } catch (error) {
      console.error("Error adding service:", error);
      toast.error(error.message || "Failed to add service");
    } finally {
      setIsSubmitting(false);
    }
  };


// Update handleEditService function to use vendorAPI.updateService
const handleEditService = async (e) => {
  e.preventDefault();
  console.log("Edit service form submitted");
  
  try {
    // Validate required fields
    if (!editingService.serviceName || !editingService.description || 
        !editingService.price || !editingService.duration) {
      toast.error("All fields are required");
      return;
    }
    
    setIsSubmitting(true);
    
    const serviceData = {
      serviceName: editingService.serviceName,
      description: editingService.description,
      price: parseFloat(editingService.price),
      duration: editingService.duration // Keep as string
    };
    
    console.log("Updating service with data:", serviceData);
    
    // Use vendorAPI instead of direct fetch
    const response = await vendorAPI.updateService(editingService.id, serviceData);
    const updatedService = response.data || {};

    // Update services in local state
    setServices(prevServices => prevServices.map(service => 
      service.id === editingService.id ? {
        ...service,
        name: updatedService.serviceName || editingService.serviceName,
        serviceName: updatedService.serviceName || editingService.serviceName,
        description: updatedService.description || editingService.description,
        price: parseFloat(updatedService.price || editingService.price),
        duration: updatedService.duration || editingService.duration
      } : service
    ));
    
    setEditingService(null);
    toast.success("Service updated successfully!");
  } catch (error) {
    console.error("Error updating service:", error);
    toast.error(error.message || "Failed to update service");
  } finally {
    setIsSubmitting(false);
  }
};

// Update handleDeleteService function to use vendorAPI.deleteService
const handleDeleteService = async (serviceId) => {
  if (window.confirm("Are you sure you want to delete this service?")) {
    try {
      // Use vendorAPI.deleteService instead of direct fetch
      await vendorAPI.deleteService(serviceId);
      
      // Update local state
      setServices(services.filter(service => service.id !== serviceId));
      toast.success("Service deleted successfully!");
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error(error.message || "Failed to delete service");
    }
  }
};

  // Ensure the vendorAPI methods match our API endpoints
  // Add this to make sure the vendorAPI correctly calls the API endpoints
  useEffect(() => {
    // Debug logger for API calls if needed
    const logApiCall = (type, endpoint, data) => {
      console.log(`${type} request to ${endpoint}`, data || '');
    };

    // Original vendorAPI methods - we'll use these instead of overriding with fetch
    const originalCreateProvider = vendorAPI.createProvider;
    const originalCreateService = vendorAPI.createService;
    
    // Add logging but keep the original implementation
    vendorAPI.createProvider = async (data) => {
      logApiCall('POST', '/v1/service-providers/create', data);
      return originalCreateProvider(data);
    };
    
    vendorAPI.createService = async (data) => {
      logApiCall('POST', '/v1/services/create', data);
      return originalCreateService(data);
    };
    
    return () => {
      // Restore original methods when component unmounts
      vendorAPI.createProvider = originalCreateProvider;
      vendorAPI.createService = originalCreateService;
    };
  }, []);

  // Navigation helper
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Update renderStepIndicator to use a more professional heading instead
  const renderBusinessHeading = () => (
    <div className="mx-auto max-w-3xl mb-8 text-center">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
        {vendorWelcomeContent.title}
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        {vendorWelcomeContent.description}
      </p>
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-left">
        <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Key Benefits</h3>        
        <ul className="space-y-1">
          {vendorWelcomeContent.benefits.map((benefit, index) => (
            <li key={index} className="flex items-start">
              <CheckIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-blue-700 dark:text-blue-300">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  // Render business details form for new businesses
  const renderBusinessForm = () => (
    <form onSubmit={handleBusinessSubmit} className="mt-8 space-y-8">
      {/* Business Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
          Business Name*
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <BuildingStorefrontIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={business.businessName}
            onChange={(e) => {
              setBusiness({ ...business, businessName: e.target.value });
              setBusinessFormErrors({...businessFormErrors, businessName: ""});
            }}
            className={`block w-full rounded-lg border ${
              businessFormErrors.businessName 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-500/40' 
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700'
            } pl-10 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:text-white`}
            required
            placeholder="Enter business name"
          />
          {businessFormErrors.businessName && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{businessFormErrors.businessName}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Contact Number */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
            Business Phone Number*
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <PhoneIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              value={business.phoneNumber}
              onChange={(e) => {
                setBusiness({ ...business, phoneNumber: e.target.value });
                setBusinessFormErrors({...businessFormErrors, phoneNumber: ""});
              }}
              className={`block w-full rounded-lg border ${
                businessFormErrors.phoneNumber 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-500/40' 
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700'
              } pl-10 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:text-white`}
              required
              placeholder="+27-71-555-0001"
            />
            {businessFormErrors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{businessFormErrors.phoneNumber}</p>
            )}
          </div>
        </div>

        {/* Service Category - Fixed Icon Display */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
            Service Category*
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <WrenchScrewdriverIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={business.serviceCategory}
              onChange={(e) => {
                setBusiness({ ...business, serviceCategory: e.target.value });
                setBusinessFormErrors({...businessFormErrors, serviceCategory: ""});
              }}
              className={`block w-full rounded-lg border ${
                businessFormErrors.serviceCategory 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-500/40' 
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700'
              } pl-10 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:text-white appearance-none`}
            >
              <option value="">Select a category</option>
              {serviceCategories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            </div>
            {businessFormErrors.serviceCategory && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{businessFormErrors.serviceCategory}</p>
            )}
          </div>
        </div>
      </div>

      {/* Business Location */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
          Business Location*
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MapPinIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={business.location}
            onChange={(e) => {
              setBusiness({ ...business, location: e.target.value });
              setBusinessFormErrors({...businessFormErrors, location: ""});
            }}
            className={`block w-full rounded-lg border ${
              businessFormErrors.location 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-500/40' 
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700'
            } pl-10 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:text-white`}
            required
            placeholder="E.g., Sandton, Johannesburg, SA"
          />
          {businessFormErrors.location && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{businessFormErrors.location}</p>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Enter your business headquarters location or main operating area
        </p>
      </div>

      {/* Business Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
          About Your Business*
        </label>
        <textarea
          value={business.about}
          onChange={(e) => {
            setBusiness({ ...business, about: e.target.value });
            setBusinessFormErrors({...businessFormErrors, about: ""});
          }}
          rows={4}
          className={`block w-full rounded-lg border ${
            businessFormErrors.about 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-500/40' 
              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700'
          } p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:text-white`}
          required
          placeholder="Tell us about your experience, services offered, and why customers should choose you..."
        />
        {businessFormErrors.about && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{businessFormErrors.about}</p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Add keywords related to your services to help customers find you more easily
        </p>
      </div>

      {/* Business Email */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
          Business Email
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            value={business.businessEmail}
            onChange={(e) => {
              setBusiness({ ...business, businessEmail: e.target.value });
              setBusinessFormErrors({...businessFormErrors, businessEmail: ""});
            }}
            className={`block w-full rounded-lg border ${
              businessFormErrors.businessEmail 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-500/40' 
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700'
            } pl-10 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:text-white`}
            placeholder="business@example.com"
          />
          {businessFormErrors.businessEmail && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{businessFormErrors.businessEmail}</p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            This email will be visible to customers for business inquiries
          </p>
        </div>
      </div>

      {/* Website */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
          Business Website
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <GlobeAltIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="url"
            value={business.website}
            onChange={(e) => {
              setBusiness({ ...business, website: e.target.value });
              setBusinessFormErrors({...businessFormErrors, website: ""});
            }}
            className={`block w-full rounded-lg border ${
              businessFormErrors.website 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-500/40' 
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700'
            } pl-10 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:text-white`}
            placeholder="https://www.yourbusiness.com"
          />
          {businessFormErrors.website && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{businessFormErrors.website}</p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Include http:// or https:// for external links
          </p>
        </div>
      </div>

      {/* Submit/Next Button */}
      <div className="flex justify-between pt-4">
        {currentStep > 1 && (
          <motion.button
            type="button"
            onClick={handleBack}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </motion.button>
        )}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 ml-auto"
        >
          Submit Application
          <ArrowRightIcon className="ml-2 h-5 w-5" />
        </motion.button>
      </div>

      {/* Confirmation Dialog */}
      {isConfirming && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setIsConfirming(false)}
            />
            <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all dark:bg-slate-800 sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20 sm:mx-0 sm:h-10 sm:w-10">
                  <DocumentCheckIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                    Confirm Submission
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Are you ready to submit your business profile for review? Our team will verify your details before activating your business on RepairLink.
                    </p>
                    <div className="mt-4 rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            The review process usually takes 1-2 business days. You'll receive an email notification when your profile is approved.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleConfirmSubmit}
                  disabled={isSubmitting}
                  className={`inline-flex w-full justify-center rounded-lg px-4 py-2 text-sm font-medium text-white sm:ml-3 sm:w-auto ${
                    isSubmitting
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Yes, Submit Application'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfirming(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:mt-0 sm:w-auto dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                >
                  Review Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );

  // Render service setup in onboarding process
  const renderServiceSetup = () => (
    <div className="mt-8 space-y-8">
      {/* Introduction */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Add Your Services
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Let customers know what services you offer. You can add more services later.
        </p>
      </div>

      {/* Service List */}
      <div className="space-y-4">
        {services.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {services.map((service) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative flex flex-col rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="absolute right-2 top-2 flex space-x-1">
                  <button
                    onClick={() => {
                      setEditingService(service);
                      setIsAddingService(false);
                    }}
                    className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-slate-700 dark:hover:text-white"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="rounded-full bg-white p-1.5 text-gray-500 hover:bg-gray-100 hover:text-red-600 dark:bg-slate-700 dark:text-gray-400 dark:hover:bg-slate-600 transition-colors"
                    aria-label="Delete service"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="p-4 flex-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                    {service.name || service.serviceName}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {service.description}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(service.price)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {service.duration}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center bg-gray-50 rounded-lg p-8 dark:bg-slate-800/50 border border-dashed border-gray-300 dark:border-slate-700">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700">
              <WrenchScrewdriverIcon className="h-7 w-7 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No services yet</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Add your first service to help customers understand what you offer.
            </p>
          </div>
        )}

        {/* Add Service Button */}
        <div className="flex justify-center">
          <motion.button
            type="button"
            onClick={() => {
              setEditingService(null);
              setIsAddingService(true);
              resetServiceForm();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center rounded-lg bg-white border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            disabled={isAddingService || editingService}
          >
            <PlusIcon className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
            Add a Service
          </motion.button>
        </div>
      </div>

      {/* Service Form Modal */}
      {(isAddingService || editingService) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => {
                if (!isSubmitting) {
                  setIsAddingService(false);
                  setEditingService(null);
                }
              }}
            />
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all dark:bg-slate-800 sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="px-4 pb-4 pt-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {editingService ? "Edit Service" : "Add New Service"}
                </h3>
                
                <form onSubmit={editingService ? handleEditService : handleAddService} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Service Name*
                    </label>
                    <input
                      type="text"
                      value={editingService ? editingService.serviceName : newService.serviceName}
                      onChange={(e) => {
                        if (editingService) {
                          setEditingService({ ...editingService, serviceName: e.target.value });
                          setFormErrors({...formErrors, serviceName: ""});
                        } else {
                          setNewService({ ...newService, serviceName: e.target.value });
                          setFormErrors({...formErrors, serviceName: ""});
                        }
                      }}
                      className={`block w-full rounded-lg border ${
                        formErrors.serviceName 
                          ? 'border-red-300 ring-1 ring-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500/40' 
                          : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700'
                      } p-2.5 text-gray-900 dark:bg-slate-800 dark:text-white`}
                      required
                      placeholder="E.g., Basic Plumbing Service"
                    />
                    {formErrors.serviceName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {formErrors.serviceName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description*
                    </label>
                    <textarea
                      value={editingService ? editingService.description : newService.description}
                      onChange={(e) => {
                        if (editingService) {
                          setEditingService({ ...editingService, description: e.target.value });
                          setFormErrors({...formErrors, description: ""});
                        } else {
                          setNewService({ ...newService, description: e.target.value });
                          setFormErrors({...formErrors, description: ""});
                        }
                      }}
                      rows={3}
                      className={`block w-full rounded-lg border ${
                        formErrors.description 
                          ? 'border-red-300 ring-1 ring-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500/40' 
                          : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700'
                      } p-2.5 text-gray-900 dark:bg-slate-800 dark:text-white`}
                      required
                      placeholder="Describe what this service includes..."
                    />
                    {formErrors.description && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {formErrors.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Price (ZAR)*
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-gray-500 dark:text-gray-400 sm:text-sm">R</span>
                        </div>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editingService ? editingService.price : newService.price}
                          onChange={(e) => {
                            if (editingService) {
                              setEditingService({ ...editingService, price: e.target.value });
                              setFormErrors({...formErrors, price: ""});
                            } else {
                              setNewService({ ...newService, price: e.target.value });
                              setFormErrors({...formErrors, price: ""});
                            }
                          }}
                          className={`block w-full rounded-lg border ${
                            formErrors.price 
                              ? 'border-red-300 ring-1 ring-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500/40' 
                              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700'
                          } pl-8 p-2.5 text-gray-900 dark:bg-slate-800 dark:text-white`}
                          placeholder="0.00"
                          required
                        />
                      </div>
                      {formErrors.price && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {formErrors.price}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Duration*
                      </label>
                      <input
                        type="text"
                        value={editingService ? editingService.duration : newService.duration}
                        onChange={(e) => {
                          if (editingService) {
                            setEditingService({ ...editingService, duration: e.target.value });
                            setFormErrors({...formErrors, duration: ""});
                          } else {
                            setNewService({ ...newService, duration: e.target.value });
                            setFormErrors({...formErrors, duration: ""});
                          }
                        }}
                        className={`block w-full rounded-lg border ${
                          formErrors.duration 
                            ? 'border-red-300 ring-1 ring-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500/40' 
                            : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700'
                        } p-2.5 text-gray-900 dark:bg-slate-800 dark:text-white`}
                        placeholder="E.g., 2 hours, 30 minutes"
                        required
                      />
                      {formErrors.duration && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {formErrors.duration}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingService(false);
                        setEditingService(null);
                      }}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
                        isSubmitting 
                          ? 'bg-blue-400 cursor-not-allowed dark:bg-blue-600/50' 
                          : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {editingService ? 'Updating...' : 'Adding...'}
                        </div>
                      ) : (
                        editingService ? 'Update Service' : 'Add Service'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Continue button to move to next step */}
      <div className="flex justify-between pt-4">
        <motion.button
          type="button"
          onClick={handleBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
        >
          <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </motion.button>

        <motion.button
          type="button"
          onClick={() => setIsConfirming(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Submit Application
          <ArrowRightIcon className="ml-2 h-5 w-5" />
        </motion.button>
      </div>
    </div>
  );

  // Render edit business form
  const renderEditBusinessForm = () => (
    <form onSubmit={handleBusinessUpdate} className="mt-8 space-y-8">
      {/* Business Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
          Business Name*
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <BuildingStorefrontIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={business.businessName}
            onChange={(e) => {
              setBusiness({ ...business, businessName: e.target.value });
              setBusinessFormErrors({...businessFormErrors, businessName: ""});
            }}
            className={`block w-full rounded-lg border ${
              businessFormErrors.businessName 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-500/40' 
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700'
            } pl-10 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:text-white`}
            required
            placeholder="Enter business name"
          />
          {businessFormErrors.businessName && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{businessFormErrors.businessName}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Contact Number */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
            Business Phone Number*
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <PhoneIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              value={business.phoneNumber}
              onChange={(e) => {
                setBusiness({ ...business, phoneNumber: e.target.value });
                setBusinessFormErrors({...businessFormErrors, phoneNumber: ""});
              }}
              className={`block w-full rounded-lg border ${
                businessFormErrors.phoneNumber 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-500/40' 
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700'
              } pl-10 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:text-white`}
              required
              placeholder="+27-71-555-0001"
            />
            {businessFormErrors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{businessFormErrors.phoneNumber}</p>
            )}
          </div>
        </div>

        {/* Service Category - Fixed Icon Display */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
            Service Category*
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <WrenchScrewdriverIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={business.serviceCategory}
              onChange={(e) => {
                setBusiness({ ...business, serviceCategory: e.target.value });
                setBusinessFormErrors({...businessFormErrors, serviceCategory: ""});
              }}
              className={`block w-full rounded-lg border ${
                businessFormErrors.serviceCategory 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-500/40' 
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700'
              } pl-10 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:text-white appearance-none`}
            >
              <option value="">Select a category</option>
              {serviceCategories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            </div>
            {businessFormErrors.serviceCategory && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{businessFormErrors.serviceCategory}</p>
            )}
          </div>
        </div>
      </div>

      {/* Business Location */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
          Business Location*
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MapPinIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={business.location}
            onChange={(e) => {
              setBusiness({ ...business, location: e.target.value });
              setBusinessFormErrors({...businessFormErrors, location: ""});
            }}
            className={`block w-full rounded-lg border ${
              businessFormErrors.location 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-500/40' 
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700'
            } pl-10 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:text-white`}
            required
            placeholder="E.g., Sandton, Johannesburg, SA"
          />
          {businessFormErrors.location && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{businessFormErrors.location}</p>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Enter your business headquarters location or main operating area
        </p>
      </div>

      {/* Business Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
          About Your Business*
        </label>
        <textarea
          value={business.about}
          onChange={(e) => {
            setBusiness({ ...business, about: e.target.value });
            setBusinessFormErrors({...businessFormErrors, about: ""});
          }}
          rows={4}
          className={`block w-full rounded-lg border ${
            businessFormErrors.about 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-500/40' 
              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700'
          } p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:text-white`}
          required
          placeholder="Tell us about your experience, services offered, and why customers should choose you..."
        />
        {businessFormErrors.about && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{businessFormErrors.about}</p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Add keywords related to your services to help customers find you more easily
        </p>
      </div>

      {/* Business Email */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
          Business Email
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            value={business.businessEmail}
            onChange={(e) => {
              setBusiness({ ...business, businessEmail: e.target.value });
              setBusinessFormErrors({...businessFormErrors, businessEmail: ""});
            }}
            className={`block w-full rounded-lg border ${
              businessFormErrors.businessEmail 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-500/40' 
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700'
            } pl-10 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:text-white`}
            placeholder="business@example.com"
          />
          {businessFormErrors.businessEmail && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{businessFormErrors.businessEmail}</p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            This email will be visible to customers for business inquiries
          </p>
        </div>
      </div>

      {/* Website */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
          Business Website
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <GlobeAltIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="url"
            value={business.website}
            onChange={(e) => {
              setBusiness({ ...business, website: e.target.value });
              setBusinessFormErrors({...businessFormErrors, website: ""});
            }}
            className={`block w-full rounded-lg border ${
              businessFormErrors.website 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-500/40' 
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700'
            } pl-10 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:text-white`}
            placeholder="https://www.yourbusiness.com"
          />
          {businessFormErrors.website && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{businessFormErrors.website}</p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Include http:// or https:// for external links
          </p>
        </div>
      </div>

      {/* Submit/Next Button */}
      <div className="flex justify-between pt-4">
        <motion.button
          type="button"
          onClick={() => setIsEditingBusiness(false)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
        >
          <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 ml-auto"
        >
          Save Changes
          <ArrowRightIcon className="ml-2 h-5 w-5" />
        </motion.button>
      </div>
    </form>
  );

  // Simplify the onboarding process - render one form for new vendors
  const renderNewVendorOnboarding = () => (
    <div className="space-y-8">
      {/* Onboarding Header */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Create Your Business Profile
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Complete this form to register your business on RepairLink.
          Once approved, you'll be able to add services.
        </p>
      </div>
      
      {/* Business Profile Form - only including fields from the API example */}
      <form onSubmit={(e) => {
        e.preventDefault();
        const errors = validateBusinessForm(business);
        if (Object.keys(errors).length > 0) {
          setBusinessFormErrors(errors);
          toast.error("Please fix the errors in the form");
          return;
        }
        setIsConfirming(true);
      }} className="space-y-6 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
        {/* Business Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
            Business Name*
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <BuildingStorefrontIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={business.businessName}
              onChange={(e) => {
                setBusiness({ ...business, businessName: e.target.value });
                setBusinessFormErrors({...businessFormErrors, businessName: ""});
              }}
              className={`block w-full rounded-lg border ${
                businessFormErrors.businessName 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-500/40' 
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700'
              } pl-10 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:text-white`}
              placeholder="Enter your business name"
            />
            {businessFormErrors.businessName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{businessFormErrors.businessName}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Phone Number */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
              Business Phone Number*
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                value={business.phoneNumber}
                onChange={(e) => {
                  setBusiness({ ...business, phoneNumber: e.target.value });
                  setBusinessFormErrors({...businessFormErrors, phoneNumber: ""});
                }}
                className={`block w-full rounded-lg border ${
                  businessFormErrors.phoneNumber 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-500/40' 
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700'
                } pl-10 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:text-white`}
                placeholder="+1234567890"
              />
              {businessFormErrors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{businessFormErrors.phoneNumber}</p>
              )}
            </div>
          </div>

          {/* Service Category - Fixed Icon Display */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
              Service Category*
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <WrenchScrewdriverIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={business.serviceCategory}
                onChange={(e) => {
                  setBusiness({ ...business, serviceCategory: e.target.value });
                  setBusinessFormErrors({...businessFormErrors, serviceCategory: ""});
                }}
                className={`block w-full rounded-lg border ${
                  businessFormErrors.serviceCategory 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-500/40' 
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700'
                } pl-10 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:text-white appearance-none`}
              >
                <option value="">Select a category</option>
                {serviceCategories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronDownIcon className="h-5 w-5 text-gray-400" />
              </div>
              {businessFormErrors.serviceCategory && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{businessFormErrors.serviceCategory}</p>
              )}
            </div>
          </div>
        </div>

        {/* Business Location */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
            Business Location*
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MapPinIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={business.location}
              onChange={(e) => {
                setBusiness({ ...business, location: e.target.value });
                setBusinessFormErrors({...businessFormErrors, location: ""});
              }}
              className={`block w-full rounded-lg border ${
                businessFormErrors.location 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-500/40' 
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700'
              } pl-10 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:text-white`}
              placeholder="123 Main Street, Tech City"
            />
            {businessFormErrors.location && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{businessFormErrors.location}</p>
            )}
          </div>
        </div>

        {/* About Your Business */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
            About Your Business*
          </label>
          <textarea
            value={business.about}
            onChange={(e) => {
              setBusiness({ ...business, about: e.target.value });
              setBusinessFormErrors({...businessFormErrors, about: ""});
            }}
            rows={4}
            className={`block w-full rounded-lg border ${
              businessFormErrors.about 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-500/40' 
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700'
            } p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:text-white`}
            placeholder="We provide top-notch IT solutions for businesses."
          />
          {businessFormErrors.about && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{businessFormErrors.about}</p>
          )}
        </div>

        {/* Business Email */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
            Business Email
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <EnvelopeIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={business.businessEmail}
              onChange={(e) => {
                setBusiness({ ...business, businessEmail: e.target.value });
                setBusinessFormErrors({...businessFormErrors, businessEmail: ""});
              }}
              className={`block w-full rounded-lg border ${
                businessFormErrors.businessEmail 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-500/40' 
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700'
              } pl-10 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:text-white`}
              placeholder="Enter your business email"
            />
            {businessFormErrors.businessEmail && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{businessFormErrors.businessEmail}</p>
            )}
          </div>
        </div>

        {/* Business Website */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
            Business Website
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <GlobeAltIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="url"
              value={business.website}
              onChange={(e) => {
                setBusiness({ ...business, website: e.target.value });
                setBusinessFormErrors({...businessFormErrors, website: ""});
              }}
              className={`block w-full rounded-lg border ${
                businessFormErrors.website 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-500/40' 
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700'
              } pl-10 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:text-white`}
              placeholder="Enter your business website"
            />
            {businessFormErrors.website && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{businessFormErrors.website}</p>
            )}
          </div>
        </div>

        {/* Next Steps Info */}
        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20 my-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <InformationCircleIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300">What happens next?</h3>
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                <p>After submitting your business profile:</p>
                <ol className="list-decimal pl-5 space-y-1 mt-1">
                  <li>Our team will review your application</li>
                  <li>Once approved, you'll receive an email notification</li>
                  <li>You can then add your services for customers to book</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Submit Application
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </motion.button>
        </div>
      </form>

      {/* Confirmation Dialog */}
      {isConfirming && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => !isSubmitting && setIsConfirming(false)}
            />
            <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all dark:bg-slate-800 sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20 sm:mx-0 sm:h-10 sm:w-10">
                  <DocumentCheckIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                    Submit Business Profile
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Are you ready to submit your business profile for review? After approval, you'll be able to add services and receive bookings.
                    </p>
                    
                    <div className="mt-4 rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            The verification process typically takes 1-2 business days.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleConfirmSubmit}
                  disabled={isSubmitting}
                  className={`inline-flex w-full justify-center rounded-lg px-4 py-2 text-sm font-medium text-white sm:ml-3 sm:w-auto ${
                    isSubmitting
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit Profile'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfirming(false)}
                  disabled={isSubmitting}
                  className="mt-3 inline-flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:mt-0 sm:w-auto dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
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

  // Add this function to reset the form
  const resetServiceForm = () => {
    setNewService({
      serviceName: '',
      description: '',
      price: '',
      duration: ''
    });
    setFormErrors({});
  };

  // Add this service modal component to your render function, 
  // right before the closing tag of the main component return
  const renderServiceModal = () => (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          onClick={() => {
            if (!isSubmitting) {
              setIsAddingService(false);
              resetServiceForm();
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

                <form onSubmit={editingService ? handleEditService : handleAddService} className="mt-6 space-y-4">
                  {/* Service Name */}
                  <div>
                    <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Service Name*
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="serviceName"
                        value={editingService ? editingService.serviceName : newService.serviceName}
                        onChange={(e) => {
                          if (editingService) {
                            setEditingService({...editingService, serviceName: e.target.value});
                          } else {
                            setNewService({...newService, serviceName: e.target.value});
                          }
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
                        value={editingService ? editingService.description : newService.description}
                        onChange={(e) => {
                          if (editingService) {
                            setEditingService({...editingService, description: e.target.value});
                          } else {
                            setNewService({...newService, description: e.target.value});
                          }
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
                          value={editingService ? editingService.price : newService.price}
                          onChange={(e) => {
                            if (editingService) {
                              setEditingService({...editingService, price: e.target.value});
                            } else {
                              setNewService({...newService, price: e.target.value});
                            }
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
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Duration*
                      </label>
                      <input
                        type="text"
                        value={editingService ? editingService.duration : newService.duration}
                        onChange={(e) => {
                          if (editingService) {
                            setEditingService({ ...editingService, duration: e.target.value });
                            setFormErrors({...formErrors, duration: ""});
                          } else {
                            setNewService({ ...newService, duration: e.target.value });
                            setFormErrors({...formErrors, duration: ""});
                          }
                        }}
                        className={`block w-full rounded-lg border ${
                          formErrors.duration 
                            ? 'border-red-300 ring-1 ring-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500/40' 
                            : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700'
                        } p-2.5 text-gray-900 dark:bg-slate-800 dark:text-white`}
                        placeholder="E.g., 2 hours, 30 minutes"
                        required
                      />
                      {formErrors.duration && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {formErrors.duration}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Form Buttons */}
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingService(false);
                        resetServiceForm();
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
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <svg className="animate-spin h-8 w-8 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 dark:text-red-400 mt-8">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 mb-4" />
          <h3 className="text-lg font-medium mb-2">Error Loading Profile</h3>
          <p>{error.message || "Something went wrong. Please try again later."}</p>
        </div>
      ) : showOnboarding ? (
        <div className="max-w-4xl mx-auto">
          {renderBusinessHeading()}
          {renderNewVendorOnboarding()}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Business Profile Section */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/60 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Business Profile</h2>
              {!isEditingBusiness && (
                <button 
                  onClick={() => setIsEditingBusiness(true)}
                  className="inline-flex items-center rounded-lg bg-white border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                >
                  <PencilIcon className="mr-1.5 h-4 w-4" />
                  Edit
                </button>
              )}
            </div>
            <div className="p-6">
              {isEditingBusiness ? (
                renderEditBusinessForm()
              ) : (
                <div className="space-y-6">
                  <div className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-slate-700">
                    <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full p-3">
                      <BuildingStorefrontIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{business.businessName}</h3>
                      <div className="mt-1 flex items-center">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          isApproved 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400'
                        }`}>
                          {isApproved ? (
                            <>
                              <CheckBadgeIcon className="mr-1 h-3.5 w-3.5" />
                              Verified
                            </>
                          ) : (
                            <>
                              <SolidClockIcon className="mr-1 h-3.5 w-3.5" />
                              Pending Approval
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Service Category</h4>
                      <p className="text-base text-gray-900 dark:text-white">{business.serviceCategory}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Business Phone</h4>
                      <p className="text-base text-gray-900 dark:text-white">{business.phoneNumber}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Location</h4>
                      <p className="text-base text-gray-900 dark:text-white">{business.location}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Business Email</h4>
                      {business.businessEmail ? (
                        <a 
                          href={`mailto:${business.businessEmail}`} 
                          className="text-base text-blue-600 hover:underline dark:text-blue-400"
                        >
                          {business.businessEmail}
                        </a>
                      ) : (
                        <p className="text-base text-gray-500 dark:text-gray-400 italic">Not specified</p>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Website</h4>
                      {business.website ? (
                        <a 
                          href={business.website.startsWith('http') ? business.website : `https://${business.website}`}
                          target="_blank"
                          rel="noopener noreferrer" 
                          className="text-base text-blue-600 hover:underline dark:text-blue-400"
                        >
                          {business.website}
                        </a>
                      ) : (
                        <p className="text-base text-gray-500 dark:text-gray-400 italic">Not specified</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">About</h4>
                    <p className="text-base text-gray-900 dark:text-white whitespace-pre-wrap">{business.about}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Services Section */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/60 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Services</h2>
              <button 
                onClick={() => {
                  setEditingService(null);
                  setIsAddingService(true);
                }}
                className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                disabled={!isApproved}
              >
                <PlusIcon className="mr-1.5 h-4 w-4" />
                Add Service
              </button>
            </div>
            <div className="p-6">
              {!isApproved && (
                <div className="mb-4 rounded-lg bg-amber-50 p-4 dark:bg-amber-900/10">
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

              {services.length === 0 ? (
                <div className="text-center py-8">
                  <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center dark:bg-slate-700">
                    <WrenchScrewdriverIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No services</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Get started by adding your first service offering.
                  </p>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingService(null);
                        setIsAddingService(true);
                      }}
                      className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                      Add Service
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="relative rounded-lg border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
                    >
                      <div className="absolute right-2 top-2 flex space-x-1">
                        <button
                          onClick={() => {
                            setEditingService(service);
                            setIsAddingService(false);
                          }}
                          className="rounded-full bg-white p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:bg-slate-700 dark:text-gray-400 dark:hover:bg-slate-600 transition-colors"
                          aria-label="Edit service"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="rounded-full bg-white p-1.5 text-gray-500 hover:bg-gray-100 hover:text-red-600 dark:bg-slate-700 dark:text-gray-400 dark:hover:bg-slate-600 transition-colors"
                          aria-label="Delete service"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                          {service.name || service.serviceName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                          {service.description}
                        </p>
                        <div className="mt-auto flex items-center justify-between">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(service.price)}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {service.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Service Form Modal */}
      {(isAddingService || editingService) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => {
                if (!isSubmitting) {
                  setIsAddingService(false);
                  setEditingService(null);
                }
              }}
            />
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all dark:bg-slate-800 sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="px-4 pb-4 pt-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {editingService ? "Edit Service" : "Add New Service"}
                </h3>
                
                <form onSubmit={editingService ? handleEditService : handleAddService} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Service Name*
                    </label>
                    <input
                      type="text"
                      value={editingService ? editingService.serviceName : newService.serviceName}
                      onChange={(e) => {
                        if (editingService) {
                          setEditingService({ ...editingService, serviceName: e.target.value });
                          setFormErrors({...formErrors, serviceName: ""});
                        } else {
                          setNewService({ ...newService, serviceName: e.target.value });
                          setFormErrors({...formErrors, serviceName: ""});
                        }
                      }}
                      className={`block w-full rounded-lg border ${
                        formErrors.serviceName 
                          ? 'border-red-300 ring-1 ring-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500/40' 
                          : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700'
                      } p-2.5 text-gray-900 dark:bg-slate-800 dark:text-white`}
                      required
                      placeholder="E.g., Basic Plumbing Service"
                    />
                    {formErrors.serviceName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {formErrors.serviceName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description*
                    </label>
                    <textarea
                      value={editingService ? editingService.description : newService.description}
                      onChange={(e) => {
                        if (editingService) {
                          setEditingService({ ...editingService, description: e.target.value });
                          setFormErrors({...formErrors, description: ""});
                        } else {
                          setNewService({ ...newService, description: e.target.value });
                          setFormErrors({...formErrors, description: ""});
                        }
                      }}
                      rows={3}
                      className={`block w-full rounded-lg border ${
                        formErrors.description 
                          ? 'border-red-300 ring-1 ring-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500/40' 
                          : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700'
                      } p-2.5 text-gray-900 dark:bg-slate-800 dark:text-white`}
                      required
                      placeholder="Describe what this service includes..."
                    />
                    {formErrors.description && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {formErrors.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Price (ZAR)*
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-gray-500 dark:text-gray-400 sm:text-sm">R</span>
                        </div>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editingService ? editingService.price : newService.price}
                          onChange={(e) => {
                            if (editingService) {
                              setEditingService({ ...editingService, price: e.target.value });
                              setFormErrors({...formErrors, price: ""});
                            } else {
                              setNewService({ ...newService, price: e.target.value });
                              setFormErrors({...formErrors, price: ""});
                            }
                          }}
                          className={`block w-full rounded-lg border ${
                            formErrors.price 
                              ? 'border-red-300 ring-1 ring-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500/40' 
                              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700'
                          } pl-8 p-2.5 text-gray-900 dark:bg-slate-800 dark:text-white`}
                          placeholder="0.00"
                          required
                        />
                      </div>
                      {formErrors.price && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {formErrors.price}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Duration*
                      </label>
                      <input
                        type="text"
                        value={editingService ? editingService.duration : newService.duration}
                        onChange={(e) => {
                          if (editingService) {
                            setEditingService({ ...editingService, duration: e.target.value });
                            setFormErrors({...formErrors, duration: ""});
                          } else {
                            setNewService({ ...newService, duration: e.target.value });
                            setFormErrors({...formErrors, duration: ""});
                          }
                        }}
                        className={`block w-full rounded-lg border ${
                          formErrors.duration 
                            ? 'border-red-300 ring-1 ring-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500/40' 
                            : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700'
                        } p-2.5 text-gray-900 dark:bg-slate-800 dark:text-white`}
                        placeholder="E.g., 2 hours, 30 minutes"
                        required
                      />
                      {formErrors.duration && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {formErrors.duration}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingService(false);
                        setEditingService(null);
                      }}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
                        isSubmitting 
                          ? 'bg-blue-400 cursor-not-allowed dark:bg-blue-600/50' 
                          : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {editingService ? 'Updating...' : 'Adding...'}
                        </div>
                      ) : (
                        editingService ? 'Update Service' : 'Add Service'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Business;