import { useState, useEffect, useCallback } from 'react';
import { 
  MagnifyingGlassIcon, 
  ArrowPathIcon, 
  EyeIcon,
  TrashIcon, 
  PencilIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  ExclamationCircleIcon,
  WrenchScrewdriverIcon,
  PlusCircleIcon,
  XCircleIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import adminAPI from '../../services/admin/adminAPI';
// Removed publicAPI import since we're not using categories

const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalServices, setTotalServices] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [pageSize] = useState(9); // Fixed for consistency
  // Removed categories state since we don't have that endpoint
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Define hardcoded categories for filtering - common service categories
  const staticCategories = [
    'Electronics Repair',
    'Plumbing',
    'Electrical',
    'Carpentry',
    'Appliance Repair',
    'Automotive',
    'Computer Services',
    'Mobile Repair'
  ];

  // Remove fetchCategories useEffect since we don't have that endpoint

  // Fetch services whenever filters or pagination changes
  useEffect(() => {
    fetchServices();
  }, [currentPage]);

  // Separate useEffect for search and filter changes
  useEffect(() => {
    // When search or filters change, reset to first page
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      // If already on first page, fetch with new filters
      fetchServices();
    }
  }, [searchTerm, filterCategory, filterStatus]);

  // Remove fetchCategories function since we don't need it

  const fetchServices = useCallback(async () => {
    setIsRefreshing(true);
    if (services.length === 0) {
      setIsLoading(true);
    }
    
    try {
      // Build filter params
      const params = {
        page: currentPage - 1, // Convert to 0-indexed for backend
        size: pageSize
      };

      if (searchTerm && searchTerm.trim() !== '') {
        params.search = searchTerm.trim();
      }

      if (filterCategory !== 'all') {
        params.category = filterCategory;
      }

      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }
      
      // Make API call using AdminAPI
      const response = await adminAPI.getServices(params);
      
      if (response && response.data) {
        let fetchedServices;
        let totalElements;
        let totalPages;

        if (Array.isArray(response.data)) {
          // Handle non-paginated response
          fetchedServices = response.data;
          totalElements = response.data.length;
          totalPages = 1;
        } else {
          // Handle Spring Boot paginated response
          fetchedServices = response.data.content || [];
          totalElements = response.data.totalElements || 0;
          totalPages = response.data.totalPages || 1;
        }

        // Map to UI format - FIX: Use verified property for status instead of active
        const mappedServices = fetchedServices.map(service => ({
          id: service.serviceID,
          name: service.serviceName,
          description: service.description,
          price: service.price ? `R${service.price.toFixed(2)}` : 'Price varies',
          duration: service.duration || 'Not specified',
          category: service.category || 'Miscellaneous',
          providerId: service.providerID,
          // FIX: Default to 'Active' if verified is true or not specified
          status: service.verified === false ? 'Inactive' : 'Active',
          featured: service.featured || false,
          rating: service.rating || 0,
          reviews: service.reviewCount || 0,
          image: service.imageUrl || null,
          createdAt: service.createdAt,
          // Store original data for edit operations
          originalData: service
        }));

        setServices(mappedServices);
        setTotalServices(totalElements);
        setTotalPages(totalPages);
      } else {
        setServices([]);
        setTotalServices(0);
        setTotalPages(1);
      }
      
    } catch (err) {
      console.error('Failed to fetch services:', err);
      setError('Failed to load services. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [currentPage, pageSize, searchTerm, filterCategory, filterStatus]);

  // Toggle active status - Update to use verified property
  const handleToggleStatus = async (serviceId, currentStatus) => {
    try {
      const service = services.find(s => s.id === serviceId);
      if (!service) return;

      const isCurrentlyActive = currentStatus === 'Active';
      
      // Update service with toggled verified status instead of active
      const updatedService = {
        ...service.originalData,
        verified: !isCurrentlyActive
      };

      await adminAPI.updateService(serviceId, updatedService);
      
      // Update state
      const updatedServices = services.map(s => {
        if (s.id === serviceId) {
          return {
            ...s,
            status: isCurrentlyActive ? 'Inactive' : 'Active'
          };
        }
        return s;
      });
      
      setServices(updatedServices);
      toast.success(`Service ${isCurrentlyActive ? 'deactivated' : 'activated'} successfully`);
    } catch (err) {
      console.error('Failed to update service status:', err);
      toast.error('Failed to update service status');
    }
  };

  // Add these functions after handleToggleStatus and before the return statement:

  // Handle search input submission
  const handleSearch = (e) => {
    e.preventDefault();
    // The search is handled by the useEffect that watches searchTerm
    // This function just prevents the form from refreshing the page
  };

  // Handle filter changes
  const handleFilterChange = (type, value) => {
    if (type === 'category') {
      setFilterCategory(value);
    } else if (type === 'status') {
      setFilterStatus(value);
    }
    // The useEffect hook will handle the refetch
  };

  // Handle page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle delete service function
  const handleDeleteService = (service) => {
    setServiceToDelete(service);
    setShowDeleteModal(true);
  };

  // Confirm delete function
  const confirmDeleteService = async () => {
    if (!serviceToDelete) return;
    
    try {
      setIsDeleting(true);
      
      await adminAPI.deleteService(serviceToDelete.id);
      
      // Remove deleted service from the state
      setServices(services.filter(s => s.id !== serviceToDelete.id));
      setShowDeleteModal(false);
      setServiceToDelete(null);
      
      // Show success message
      toast.success('Service deleted successfully');
    } catch (err) {
      console.error('Failed to delete service:', err);
      toast.error('Failed to delete service. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // View service function
  const handleViewService = (service) => {
    setSelectedService(service);
    setShowServiceModal(true);
  };

  // Toggle featured function
  const handleToggleFeatured = async (serviceId) => {
    try {
      const service = services.find(s => s.id === serviceId);
      if (!service) return;

      // Update the service with the toggled featured status
      const updatedService = {
        ...service.originalData,
        featured: !service.featured
      };

      await adminAPI.updateService(serviceId, updatedService);
      
      // Update state
      const updatedServices = services.map(s => {
        if (s.id === serviceId) {
          return { ...s, featured: !s.featured };
        }
        return s;
      });
      
      setServices(updatedServices);
      toast.success(`Service ${!service.featured ? 'added to' : 'removed from'} featured`);
    } catch (err) {
      console.error('Failed to toggle featured status:', err);
      toast.error('Failed to update service');
    }
  };

  // Helper to get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending review':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  // No changes needed to other handlers

  return (
    <div className="space-y-6">
      {/* Header section - no changes needed */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Service Management</h1>
        <Link
          to="/admin/services/new"
          className="inline-flex items-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
        >
          <PlusCircleIcon className="mr-2 h-5 w-5" />
          <span>Add New Service</span>
        </Link>
      </div>

      <div className="rounded-lg border bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        {/* Search and filter bar - Keep search, modify filter */}
        <div className="border-b border-slate-200 p-4 dark:border-slate-700">
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <form onSubmit={handleSearch} className="relative flex w-full max-w-md">
              <input
                type="text"
                placeholder="Search services..."
                className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-purple-400 dark:focus:ring-purple-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <button
                type="submit"
                className="ml-2 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
              >
                Search
              </button>
            </form>
            <div className="flex items-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
              >
                <FunnelIcon className="h-4 w-4" />
                <span>Filter</span>
              </button>
              <button
                onClick={() => fetchServices()}
                className="ml-2 rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                title="Refresh"
                disabled={isRefreshing}
              >
                <ArrowPathIcon className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Expanded filters - Use static categories */}
          {showFilters && (
            <div className="mt-4 flex flex-wrap gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-700/50">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Service Category
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  <option value="all">All Categories</option>
                  {staticCategories.map(category => (
                    <option key={category} value={category.toLowerCase()}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="m-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-400" role="alert">
            <div className="flex items-center">
              <ExclamationCircleIcon className="mr-2 h-5 w-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Services grid */}
        <div className="p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              // Loading state
              [...Array(6)].map((_, index) => (
                <div key={index} className="h-64 animate-pulse rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <div className="flex items-center justify-center h-32 mb-4 bg-slate-200 rounded dark:bg-slate-700">
                    <WrenchScrewdriverIcon className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                  </div>
                  <div className="h-4 bg-slate-200 rounded dark:bg-slate-700 w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded dark:bg-slate-700 w-full mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded dark:bg-slate-700 w-2/3"></div>
                </div>
              ))
            ) : services.length > 0 ? (
              services.map((service) => (
                <div 
                  key={service.id} 
                  className="relative flex flex-col rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
                >
                  {/* Service image or placeholder */}
                  <div className="relative h-40 overflow-hidden rounded-t-lg bg-slate-100 dark:bg-slate-700">
                    {service.image ? (
                      <div 
                        className="h-full w-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${service.image})` }}
                      ></div>
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <WrenchScrewdriverIcon className="h-16 w-16 text-slate-400 dark:text-slate-500" />
                      </div>
                    )}
                    
                    {/* Featured badge */}
                    {service.featured && (
                      <div className="absolute right-2 top-2 rounded-full bg-purple-600 px-2 py-1 text-xs font-medium text-white">
                        Featured
                      </div>
                    )}
                    
                    {/* Status badge */}
                    <div className={`absolute left-2 top-2 rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeColor(service.status)}`}>
                      {service.status}
                    </div>
                  </div>
                  
                  {/* Service details */}
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
                      {service.name}
                    </h3>
                    <p className="mb-2 text-sm text-slate-600 line-clamp-2 dark:text-slate-300">
                      {service.description}
                    </p>
                    
                    <div className="mb-3 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-900 dark:text-white">{service.price}</span>
                      <span className="text-slate-500 dark:text-slate-400">{service.duration}</span>
                    </div>
                    
                    <div className="mb-2 flex items-center text-sm">
                      <span className="text-slate-600 dark:text-slate-300">Provider ID: </span>
                      <span className="ml-1 font-medium text-purple-600 dark:text-purple-400">
                        {service.providerId}
                      </span>
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-slate-900 dark:text-white">{service.rating || "No ratings"}</div>
                        {service.rating > 0 && (
                          <>
                            <span className="mx-1 text-xs text-slate-600 dark:text-slate-400">•</span>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{service.reviews} reviews</div>
                          </>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleToggleFeatured(service.id)}
                          className={`rounded p-1 ${
                            service.featured 
                              ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' 
                              : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                          title={service.featured ? 'Remove from featured' : 'Add to featured'}
                        >
                          <CheckBadgeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleViewService(service)}
                          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-purple-600 dark:hover:bg-slate-700 dark:hover:text-purple-400"
                          title="View details"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <Link
                          to={`/admin/services/${service.id}/edit`}
                          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-purple-600 dark:hover:bg-slate-700 dark:hover:text-purple-400"
                          title="Edit"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteService(service)}
                          className="rounded p-1 text-slate-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 py-8 text-center text-slate-500 dark:text-slate-400">
                No services found matching your criteria
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {!isLoading && services.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 dark:border-slate-700 sm:px-6">
            <div className="hidden sm:block">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                Showing <span className="font-medium">{((currentPage - 1) * pageSize) + 1}</span> to{' '}
                <span className="font-medium">{Math.min(currentPage * pageSize, totalServices)}</span> of{' '}
                <span className="font-medium">{totalServices}</span> services
              </p>
            </div>
            <div className="flex flex-1 justify-between sm:justify-end">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
              >
                <ChevronLeftIcon className="mr-1 h-4 w-4" />
                Previous
              </button>
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
              >
                Next
                <ChevronRightIcon className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !isDeleting && setShowDeleteModal(false)}></div>
          <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-slate-800">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Confirm Delete</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Are you sure you want to delete the service <span className="font-medium">{serviceToDelete?.name}</span>? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteService}
                disabled={isDeleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Detail Modal */}
      {showServiceModal && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowServiceModal(false)}></div>
          <div className="relative z-10 w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-slate-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Service Details
              </h3>
              <button
                onClick={() => setShowServiceModal(false)}
                className="rounded-full p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                {selectedService.image ? (
                  <img 
                    src={selectedService.image} 
                    alt={selectedService.name}
                    className="h-48 w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-48 w-full items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
                    <WrenchScrewdriverIcon className="h-16 w-16 text-slate-400 dark:text-slate-500" />
                  </div>
                )}
              </div>
              
              <div className="flex flex-col">
                <div className="mb-2 flex items-center">
                  <span className={`mr-2 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${getStatusBadgeColor(selectedService.status)}`}>
                    {selectedService.status}
                  </span>
                  {selectedService.featured && (
                    <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                      <CheckBadgeIcon className="mr-1 h-3 w-3" />
                      Featured
                    </span>
                  )}
                </div>
                
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedService.name}
                </h2>
                
                <div className="mt-1 flex items-center text-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Category:</span>
                  <span className="ml-1 text-slate-600 dark:text-slate-400">{selectedService.category || 'Miscellaneous'}</span>
                </div>
                
                <div className="mt-1 flex items-center text-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Provider ID:</span>
                  <span className="ml-1 text-purple-600 dark:text-purple-400">{selectedService.providerId}</span>
                </div>
                
                <div className="mt-1 text-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Price:</span>
                  <span className="ml-1 text-slate-900 dark:text-white">{selectedService.price}</span>
                </div>
                
                <div className="mt-1 text-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Duration:</span>
                  <span className="ml-1 text-slate-600 dark:text-slate-400">{selectedService.duration}</span>
                </div>
                
                <div className="mt-1 text-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Created:</span>
                  <span className="ml-1 text-slate-600 dark:text-slate-400">
                    {selectedService.createdAt ? new Date(selectedService.createdAt).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
                
                {selectedService.rating > 0 && (
                  <div className="mt-2 flex items-center text-sm">
                    <div className="flex items-center text-yellow-500">
                      {/* Star icon would go here */}
                      <span className="ml-1 font-medium text-slate-900 dark:text-white">{selectedService.rating}</span>
                    </div>
                    <span className="mx-1 text-slate-400">•</span>
                    <span className="text-slate-600 dark:text-slate-400">{selectedService.reviews} reviews</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Description</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {selectedService.description}
              </p>
            </div>
            
            <div className="flex justify-end space-x-3 border-t border-slate-200 pt-4 dark:border-slate-700">
              <Link
                to={`/admin/services/${selectedService.id}/edit`}
                className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
              >
                <PencilIcon className="mr-2 h-4 w-4" />
                Edit Service
              </Link>
              <button
                onClick={() => {
                  handleToggleStatus(selectedService.id, selectedService.status);
                  setShowServiceModal(false);
                }}
                className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  selectedService.status === 'Active'
                    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                    : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                }`}
              >
                {selectedService.status === 'Active' ? (
                  <>
                    <XCircleIcon className="mr-2 h-4 w-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="mr-2 h-4 w-4" />
                    Activate
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;