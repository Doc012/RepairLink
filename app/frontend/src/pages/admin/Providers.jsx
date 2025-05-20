import { useState, useEffect, useCallback } from 'react';
import { 
  MagnifyingGlassIcon, 
  ArrowPathIcon, 
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  ExclamationCircleIcon,
  BuildingStorefrontIcon,
  CheckBadgeIcon,
  ShieldExclamationIcon,
  PhoneIcon, 
  EnvelopeIcon, 
  GlobeAltIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon,
  UserIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import adminAPI from '../../services/admin/adminAPI';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

const Providers = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProviders, setTotalProviders] = useState(0);
  const [pageSize] = useState(10);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [confirmAction, setConfirmAction] = useState({ 
    open: false, 
    action: null, // 'approve', 'reject', or 'unverify'
    providerId: null 
  });
  // Add this new state for the provider profile modal
  const [profileModal, setProfileModal] = useState({
    open: false,
    provider: null
  });
  // Add this state for storing user details
  const [userDetails, setUserDetails] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState(null);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);

  // Move the fetchProviders function definition above all the useEffects and wrap it in useCallback
const fetchProviders = useCallback(async () => {
  setIsRefreshing(true);
  if (providers.length === 0) {
    setIsLoading(true);
  }
  
  try {
    // Build params object
    const params = {
      page: currentPage - 1,
      size: pageSize
    };
    
    if (searchQuery && searchQuery.trim() !== '') {
      params.search = searchQuery.trim();
    }
    
    if (filterStatus !== 'all') {
      params.verified = filterStatus === 'active';
    }
    
    // Make API call with our params
    const response = await adminAPI.getServiceProviders(params);
    
    if (response && response.data) {
      let loadedProviders = Array.isArray(response.data) ? response.data : (response.data.content || []);
      
      // Apply filters on the frontend side
      if (searchQuery && searchQuery.trim() !== '') {
        const query = searchQuery.trim().toLowerCase();
        loadedProviders = loadedProviders.filter(provider => {
          return (
            provider.businessName?.toLowerCase().includes(query) ||
            provider.businessEmail?.toLowerCase().includes(query) ||
            provider.user?.name?.toLowerCase().includes(query) ||
            provider.user?.surname?.toLowerCase().includes(query) ||
            provider.serviceCategory?.toLowerCase().includes(query) ||
            provider.location?.toLowerCase().includes(query)
          );
        });
      }
      
      // Apply verified filter on the frontend if necessary
      if (filterStatus !== 'all') {
        const isVerified = filterStatus === 'active';
        loadedProviders = loadedProviders.filter(provider => provider.verified === isVerified);
      }
      
      // Update pagination info based on filtered results
      setProviders(loadedProviders);
      setTotalProviders(loadedProviders.length);
      setTotalPages(Math.ceil(loadedProviders.length / pageSize) || 1);
    } else {
      setProviders([]);
      setTotalProviders(0);
      setTotalPages(1);
    }
  } catch (error) {
    setError("Failed to load service providers. Please try again.");
    toast.error("Failed to load service providers");
    setProviders([]);
  } finally {
    setIsLoading(false);
    setIsRefreshing(false);
  }
}, [searchQuery, filterStatus, currentPage, pageSize]);

  // Initial load
useEffect(() => {
  // Load providers when component mounts
  fetchProviders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

// Filter changes
useEffect(() => {
  // This single useEffect will handle all filter changes including search and status
  const handler = setTimeout(() => {
    fetchProviders();
  }, 300); // Small debounce for better performance
  
  return () => clearTimeout(handler);
}, [searchQuery, filterStatus, currentPage, fetchProviders]); // Now it's safe to include fetchProviders

  // Simplified filter change handler
  const handleFilterChange = (value) => {
    setFilterStatus(value);
    setCurrentPage(1); // Reset to page 1 when filter changes
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to page 1 when search changes
  };

  // Replace direct handleApproveProvider with a function that opens modal first
  const handleApproveProvider = (providerId) => {
    setConfirmAction({
      open: true,
      action: 'approve',
      providerId
    });
  };

  // Replace direct handleRejectProvider with a function that opens modal first
  const handleRejectProvider = (providerId) => {
    setConfirmAction({
      open: true,
      action: 'reject',
      providerId
    });
  };

  // Modify handleUnverifyProvider to show the modal instead
  const handleUnverifyProvider = (providerId) => {
    setConfirmAction({
      open: true,
      action: 'unverify',
      providerId
    });
  };

  // Add a new executeAction function to handle all provider actions
  const executeAction = async () => {
    if (!confirmAction.providerId) return;
    
    try {
      setIsRefreshing(true);
      
      switch (confirmAction.action) {
        case 'approve':
          await adminAPI.verifyServiceProvider(confirmAction.providerId, true);
          // Update the provider in state
          setProviders(prevProviders => 
            prevProviders.map(p => 
              p.providerID === confirmAction.providerId ? { ...p, verified: true } : p
            )
          );
          toast.success('Provider verified successfully');
          break;
          
        case 'reject':
          await adminAPI.verifyServiceProvider(confirmAction.providerId, false);
          // Update the provider in state - mark as rejected (non-verified)
          setProviders(prevProviders => 
            prevProviders.map(p => 
              p.providerID === confirmAction.providerId ? { ...p, verified: false } : p
            )
          );
          toast.success('Provider rejected');
          break;
          
        case 'unverify':
          await adminAPI.verifyServiceProvider(confirmAction.providerId, false);
          // Update the provider in state
          setProviders(prevProviders => 
            prevProviders.map(p => 
              p.providerID === confirmAction.providerId ? { ...p, verified: false } : p
            )
          );
          toast.success('Provider verification removed');
          break;
      }
    } catch (err) {
      console.error(`Error executing ${confirmAction.action} action:`, err);
      toast.error(`Failed to ${confirmAction.action} provider`);
    } finally {
      setIsRefreshing(false);
      setConfirmAction({ open: false, action: null, providerId: null });
    }
  };

  // Update the handleViewProvider function to fetch services from the correct endpoint
const handleViewProvider = async (providerID) => {
  const provider = providers.find(p => p.providerID === providerID);
  if (provider) {
    setProfileModal({
      open: true,
      provider
    });
    
    // Reset states
    setUserDetails(null);
    setUserLoading(true);
    setUserError(null);
    setServices([]);
    setServicesLoading(true);
    
    // Fetch user details if provider has a user
    if (provider.user?.userID) {
      try {
        // Ensure you're including the same auth headers that your browser would
        // Get the token from wherever you store it (localStorage, context, etc.)
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://13.60.59.231:8080'}/api/v1/users/${provider.user.userID}`, {
          method: 'GET',
          credentials: 'include', // Include cookies if your auth uses cookies
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch user details: ${response.status}`);
        }
        
        const userData = await response.json();
        setUserDetails(userData);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setUserError('Failed to load user details');
      } finally {
        setUserLoading(false);
      }
    } else {
      setUserLoading(false);
    }
    
    // Fetch provider services - UPDATED ENDPOINT
    try {
      const response = await fetch(`http://13.60.59.231:8080/api/v1/services/provider/${providerID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch provider services: ${response.status}`);
      }
      
      const servicesData = await response.json();
      setServices(Array.isArray(servicesData) ? servicesData : []);
    } catch (error) {
      console.error('Error fetching provider services:', error);
      setServices([]);
    } finally {
      setServicesLoading(false);
    }
  }
};

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Service Providers
        </h1>
        <div className="mt-4 flex items-center space-x-3 sm:mt-0">
          {/* Update counting of pending providers in the header */}
          <span className="text-sm text-gray-500 dark:text-slate-400">
            {providers.filter(p => !p.verified).length} pending verifications
          </span>
          <button
            onClick={() => {
              handleFilterChange('pending');
            }}
            className="inline-flex items-center rounded-lg bg-yellow-100 px-3 py-1.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
          >
            View pending
          </button>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <div className="flex">
            <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-400">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative max-w-xs">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          {/* Search input */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="block w-full rounded-md border-gray-300 pl-10 focus:border-purple-500 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white sm:text-sm"
            placeholder="Search providers"
          />
        </div>

        <div className="flex items-center space-x-4">
          <div>
            <label htmlFor="status-filter" className="sr-only">
              Filter by status
            </label>
            <div className="flex items-center">
              <FunnelIcon className="mr-2 h-5 w-5 text-gray-400" />
              {/* Filter dropdown */}
              <select
                id="status-filter"
                value={filterStatus}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="rounded-md border-gray-300 text-base focus:border-purple-500 focus:outline-none focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                <option value="all">All Providers</option>
                <option value="active">Verified Providers</option>
                <option value="pending">Pending Verification</option>
              </select>
            </div>
          </div>
          {/* Refresh button */}
          <button
            onClick={() => fetchProviders()}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
            disabled={isRefreshing}
          >
            <ArrowPathIcon className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Providers Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className="bg-gray-50 dark:bg-slate-800/60">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Business
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Owner
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-slate-700 dark:bg-slate-800">
              {isLoading ? (
                [...Array(5)].map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="h-4 w-32 rounded bg-gray-200 dark:bg-slate-700"></div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="h-4 w-24 rounded bg-gray-200 dark:bg-slate-700"></div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="h-4 w-16 rounded bg-gray-200 dark:bg-slate-700"></div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="h-4 w-24 rounded bg-gray-200 dark:bg-slate-700"></div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="h-4 w-16 rounded bg-gray-200 dark:bg-slate-700"></div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="ml-auto h-4 w-16 rounded bg-gray-200 dark:bg-slate-700"></div>
                    </td>
                  </tr>
                ))
              ) : providers.length > 0 ? (
                providers.map((provider) => (
                  <tr key={provider.providerID} className="hover:bg-gray-50 dark:hover:bg-slate-700/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                            <BuildingStorefrontIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900 dark:text-white">{provider.businessName}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{provider.businessEmail}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{provider.phoneNumber}</div>
                        </div>
                        {provider.verified && (
                          <CheckBadgeIcon className="ml-2 h-5 w-5 text-blue-500" title="Verified Provider" />
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {provider.user?.name} {provider.user?.surname}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                        {provider.serviceCategory}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {provider.location}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(provider.verified ? 'active' : 'pending')}`}>
                        {provider.verified ? 'active' : 'pending'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewProvider(provider.providerID)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 group relative"
                          title="View Provider Details"
                        >
                          <EyeIcon className="h-5 w-5" />
                          <span className="absolute -top-10 left-1/2 -translate-x-1/2 transform whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-gray-700">
                            View Details
                          </span>
                        </button>
                        {!provider.verified ? (
                          // For pending providers
                          <>
                            <button
                              onClick={() => handleApproveProvider(provider.providerID)}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 group relative"
                              title="Approve Provider"
                            >
                              <CheckCircleIcon className="h-5 w-5" />
                              <span className="absolute -top-10 left-1/2 -translate-x-1/2 transform whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-gray-700">
                                Approve Provider
                              </span>
                            </button>
                            <button
                              onClick={() => handleRejectProvider(provider.providerID)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 group relative"
                              title="Reject Provider"
                            >
                              <XCircleIcon className="h-5 w-5" />
                              <span className="absolute -top-10 left-1/2 -translate-x-1/2 transform whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-gray-700">
                                Reject Provider
                              </span>
                            </button>
                          </>
                        ) : (
                          // For verified providers
                          <button
                            onClick={() => handleUnverifyProvider(provider.providerID)}
                            className="text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300 group relative"
                            title="Remove Verification"
                          >
                            <ShieldExclamationIcon className="h-5 w-5" />
                            <span className="absolute -top-10 left-1/2 -translate-x-1/2 transform whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-gray-700">
                              Remove Verification
                            </span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No service providers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {providers.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">
              {(currentPage - 1) * pageSize + 1}
            </span> to{" "}
            <span className="font-medium">
              {Math.min(currentPage * pageSize, totalProviders)}
            </span> of{" "}
            <span className="font-medium">{totalProviders}</span> results
          </div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:ring-slate-700 dark:hover:bg-slate-700/30 disabled:opacity-50"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            {totalPages <= 5 ? (
              [...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    currentPage === idx + 1
                      ? 'z-10 bg-purple-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 dark:bg-purple-500'
                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-700/30'
                  }`}
                >
                  {idx + 1}
                </button>
              ))
            ) : (
              // Handle cases with many pages - show current +/- 1 and first/last
              <>
                {currentPage > 2 && (
                  <button
                    onClick={() => setCurrentPage(1)}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-700/30"
                  >
                    1
                  </button>
                )}
                
                {currentPage > 3 && (
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 dark:text-gray-400 dark:ring-slate-700">
                    ...
                  </span>
                )}
                
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-700/30"
                  >
                    {currentPage - 1}
                  </button>
                )}
                
                <button
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold z-10 bg-purple-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 dark:bg-purple-500"
                >
                  {currentPage}
                </button>
                
                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-700/30"
                  >
                    {currentPage + 1}
                  </button>
                )}
                
                {currentPage < totalPages - 2 && (
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 dark:text-gray-400 dark:ring-slate-700">
                    ...
                  </span>
                )}
                
                {currentPage < totalPages - 1 && (
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-700/30"
                  >
                    {totalPages}
                  </button>
                )}
              </>
            )}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:ring-slate-700 dark:hover:bg-slate-700/30 disabled:opacity-50"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      )}

      {/* Enhanced Confirmation Modal */}
      {confirmAction.open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
            onClick={() => setConfirmAction({ open: false, action: null, providerId: null })}
            aria-hidden="true"
          ></div>
          
          {/* Modal */}
          <div className="flex min-h-screen items-center justify-center p-4 text-center sm:block sm:p-0">
            <div 
              className="relative inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle dark:bg-slate-800"
              onClick={(e) => e.stopPropagation()} // Stop click events from propagating to overlay
            >
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 dark:bg-slate-800">
                <div className="sm:flex sm:items-start">
                  <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full 
                    ${confirmAction.action === 'approve' 
                      ? 'bg-green-100 dark:bg-green-900/30' 
                      : confirmAction.action === 'reject'
                      ? 'bg-red-100 dark:bg-red-900/30'
                      : 'bg-amber-100 dark:bg-amber-900/30'}`}
                    sm:mx-0 sm:h-10 sm:w-10>
                    {confirmAction.action === 'approve' ? (
                      <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" aria-hidden="true" />
                    ) : confirmAction.action === 'reject' ? (
                      <XCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                    ) : (
                      <ShieldExclamationIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                    )}
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                      {confirmAction.action === 'approve' 
                        ? 'Verify Service Provider' 
                        : confirmAction.action === 'reject'
                        ? 'Reject Service Provider'
                        : 'Remove Provider Verification'}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {confirmAction.action === 'approve' 
                          ? 'Are you sure you want to verify this provider? They will be marked as verified and visible to customers.'
                          : confirmAction.action === 'reject'
                          ? 'Are you sure you want to reject this provider? They will be marked as unverified and will not appear in search results.'
                          : 'Are you sure you want to remove verification from this provider? They will need to be verified again before appearing as verified to customers.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 dark:bg-slate-700">
                <button
                  type="button"
                  className={`inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm
                    ${confirmAction.action === 'approve' 
                      ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500 dark:bg-green-500 dark:hover:bg-green-600' 
                      : confirmAction.action === 'reject'
                      ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600'
                      : 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 dark:bg-amber-500 dark:hover:bg-amber-600'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    executeAction();
                  }}
                >
                  {confirmAction.action === 'approve' 
                    ? 'Verify Provider' 
                    : confirmAction.action === 'reject'
                    ? 'Reject Provider'
                    : 'Remove Verification'}
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmAction({ open: false, action: null, providerId: null });
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Provider Profile Modal */}
      {profileModal.open && profileModal.provider && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
            onClick={() => setProfileModal({ open: false, provider: null })}
            aria-hidden="true"
          ></div>
          
          {/* Modal */}
          <div className="flex min-h-screen items-center justify-center p-4">
            <div 
              className="relative w-full max-w-3xl rounded-lg bg-white shadow-xl dark:bg-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with close button */}
              <div className="flex items-start justify-between rounded-t-lg border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-slate-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Provider Profile
                </h2>
                <button
                  type="button"
                  className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => setProfileModal({ open: false, provider: null })}
                >
                  <XMarkIcon className="h-5 w-5" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              
              {/* Provider content */}
              <div className="p-6 overflow-y-auto max-h-[calc(100vh-12rem)]">
                {/* Business Info */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-start">
                  <div className="sm:mr-6">
                    {/* Business logo/icon */}
                    <div className="mx-auto h-24 w-24 rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
                      <BuildingStorefrontIcon className="h-full w-full text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <div className="flex items-center">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {profileModal.provider.businessName}
                      </h3>
                      {profileModal.provider.verified && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          <CheckBadgeIcon className="mr-1 h-4 w-4" />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                        {profileModal.provider.serviceCategory}
                      </span>
                    </p>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                      {profileModal.provider.about || "No description provided."}
                    </p>
                  </div>
                </div>
                
                {/* Contact & Details */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-6">
                  {/* Contact Information */}
                  <div className="space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">Contact Information</h4>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-center">
                        <UserIcon className="mr-2 h-5 w-5 text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {profileModal.provider.user?.name} {profileModal.provider.user?.surname}
                        </span>
                      </li>
                      <li className="flex items-center">
                        <EnvelopeIcon className="mr-2 h-5 w-5 text-gray-400" />
                        <a href={`mailto:${profileModal.provider.businessEmail}`} className="text-blue-600 hover:underline dark:text-blue-400">
                          {profileModal.provider.businessEmail}
                        </a>
                      </li>
                      <li className="flex items-center">
                        <PhoneIcon className="mr-2 h-5 w-5 text-gray-400" />
                        <a href={`tel:${profileModal.provider.phoneNumber}`} className="text-blue-600 hover:underline dark:text-blue-400">
                          {profileModal.provider.phoneNumber}
                        </a>
                      </li>
                      {profileModal.provider.website && (
                        <li className="flex items-center">
                          <GlobeAltIcon className="mr-2 h-5 w-5 text-gray-400" />
                          <a 
                            href={profileModal.provider.website.startsWith('http') ? profileModal.provider.website : `https://${profileModal.provider.website}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline dark:text-blue-400"
                          >
                            {profileModal.provider.website}
                          </a>
                        </li>
                      )}
                      <li className="flex items-center">
                        <MapPinIcon className="mr-2 h-5 w-5 text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {profileModal.provider.location}
                        </span>
                      </li>
                    </ul>
                  </div>
                  
                  {/* Account Details */}
                  <div className="space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">Account Details</h4>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-center">
                        <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">
                          <strong>Joined:</strong> {profileModal.provider.createdAt ? 
                            format(new Date(profileModal.provider.createdAt), 'MMM d, yyyy') : 
                            'Unknown'}
                        </span>
                      </li>
                      <li className="flex items-center">
                        <DocumentTextIcon className="mr-2 h-5 w-5 text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">
                          <strong>Provider ID:</strong> {profileModal.provider.providerID}
                        </span>
                      </li>
                      <li className="flex items-center">
                        <UserIcon className="mr-2 h-5 w-5 text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">
                          <strong>User ID:</strong> {profileModal.provider.user?.userID || 'N/A'}
                        </span>
                      </li>
                      <li className="flex items-center">
                        <ClockIcon className="mr-2 h-5 w-5 text-gray-400" />
                        <span className={`${profileModal.provider.verified ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                          <strong>Status:</strong> {profileModal.provider.verified ? 'Verified' : 'Pending Verification'}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                {/* Owner Details - NEW SECTION */}
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">Owner Details</h4>
                  
                  {userLoading ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                    </div>
                  ) : userError ? (
                    <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                      <p className="text-sm text-red-700 dark:text-red-400">{userError}</p>
                    </div>
                  ) : userDetails ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                        <div className="flex items-center">
                          {userDetails.picUrl ? (
                            <div className="h-16 w-16 rounded-full overflow-hidden">
                              <img 
                                src={userDetails.picUrl} 
                                alt={`${userDetails.name} ${userDetails.surname}`} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                              <UserIcon className="h-8 w-8 text-gray-500" />
                            </div>
                          )}
                          <div className="ml-4">
                            <h5 className="font-medium text-gray-900 dark:text-white">
                              {userDetails.name} {userDetails.surname}
                            </h5>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {userDetails.email}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {userDetails.phoneNumber}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Role:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {userDetails.roleType?.roleType || 'N/A'}
                            </span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Account Status:</span>
                            <span className={`font-medium ${userDetails.enabled ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {userDetails.enabled ? 'Active' : 'Inactive'}
                            </span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Joined:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {userDetails.createdAt ? format(new Date(userDetails.createdAt), 'MMM d, yyyy') : 'Unknown'}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 py-2">No owner information available</p>
                  )}
                </div>
                
                {/* Services - NEW SECTION */}
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">Services Offered</h4>
                  
                  {servicesLoading ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                    </div>
                  ) : services.length > 0 ? (
                    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-slate-700/60">
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                              Service
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                              Description
                            </th>
                            <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                              Price
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-slate-800/60">
                          {services.map((service) => (
                            <tr key={service.serviceID} className="hover:bg-gray-50 dark:hover:bg-slate-700/30">
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {service.serviceName}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                {service.description || 'No description'}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                                R{service.price?.toFixed(2) || 'N/A'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-6 border rounded-lg border-dashed border-gray-300 dark:border-gray-700">
                      <p className="text-gray-500 dark:text-gray-400">No services listed</p>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="mt-8 flex justify-end space-x-3">
                  {!profileModal.provider.verified ? (
                    <>
                      <button
                        onClick={() => {
                          setProfileModal({ open: false, provider: null });
                          handleApproveProvider(profileModal.provider.providerID);
                        }}
                        className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                      >
                        <CheckCircleIcon className="mr-2 h-5 w-5" />
                        Verify Provider
                      </button>
                      <button
                        onClick={() => {
                          setProfileModal({ open: false, provider: null });
                          handleRejectProvider(profileModal.provider.providerID);
                        }}
                        className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                      >
                        <XCircleIcon className="mr-2 h-5 w-5" />
                        Reject Provider
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setProfileModal({ open: false, provider: null });
                        handleUnverifyProvider(profileModal.provider.providerID);
                      }}
                      className="inline-flex items-center rounded-md border border-transparent bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600"
                    >
                      <ShieldExclamationIcon className="mr-2 h-5 w-5" />
                      Remove Verification
                    </button>
                  )}
                  <button
                    onClick={() => setProfileModal({ open: false, provider: null })}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                  >
                    Close
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

export default Providers;