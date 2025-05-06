import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarDaysIcon,
  UserIcon,
  WrenchScrewdriverIcon,
  ClockIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  PhoneIcon,
  MapPinIcon,
  XMarkIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { format, parseISO, differenceInCalendarDays, formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/auth/AuthContext';
import apiClient from '../../utils/apiClient';
import { formatCurrency } from '../../utils/formatCurrency';

// Common image URL for all service cards
const SERVICE_IMAGE_URL = "https://www.ddkk.co.za/Portals/0/Images/Insights/6377.png";

// Loading skeleton for the history page
const LoadingSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="sm:flex sm:items-center sm:justify-between">
      <div className="h-8 w-56 bg-gray-200 rounded dark:bg-slate-700"></div>
    </div>
    
    <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
      <div className="h-10 w-48 bg-gray-200 rounded dark:bg-slate-700"></div>
      <div className="flex gap-3">
        <div className="h-10 w-24 bg-gray-200 rounded dark:bg-slate-700"></div>
        <div className="h-10 w-24 bg-gray-200 rounded dark:bg-slate-700"></div>
      </div>
    </div>
    
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-slate-700">
      <div className="h-10 bg-gray-100 dark:bg-slate-800"></div>
      <div className="space-y-2 p-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-16 bg-gray-200 rounded dark:bg-slate-700"></div>
        ))}
      </div>
    </div>
  </div>
);

// Status badge component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    PENDING: {
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500',
      icon: ClockIcon
    },
    CONFIRMED: {
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500',
      icon: CheckCircleIcon
    },
    COMPLETED: {
      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500',
      icon: CheckCircleIcon
    },
    CANCELLED: {
      color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500',
      icon: XMarkIcon
    }
  };

  const config = statusConfig[status] || statusConfig.PENDING;
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
      <config.icon className="mr-1 h-3 w-3" />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
};

// Customer info modal component
const CustomerInfoModal = ({ customer, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        {/* Modal panel */}
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all dark:bg-slate-800 sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 dark:text-slate-400 dark:hover:text-slate-300"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          {/* Customer info */}
          <div className="px-6 py-6">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                Customer Information
              </h3>
            </div>

            <div className="mt-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900/30">
                  <UserIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    {customer.name} {customer.surname}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    Customer since {format(new Date(customer.createdAt || new Date()), 'MMM yyyy')}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-start">
                  <PhoneIcon className="h-5 w-5 mr-3 text-gray-500 dark:text-slate-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Phone</div>
                    <a 
                      href={`tel:${customer.phoneNumber?.replace(/\s/g, '')}`} 
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {customer.phoneNumber || "Not available"}
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <EnvelopeIcon className="h-5 w-5 mr-3 text-gray-500 dark:text-slate-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Email</div>
                    <a 
                      href={`mailto:${customer.email}`} 
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {customer.email || "Not available"}
                    </a>
                  </div>
                </div>
                {customer.address && (
                  <div className="flex items-start">
                    <MapPinIcon className="h-5 w-5 mr-3 text-gray-500 dark:text-slate-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Address</div>
                      <p className="text-gray-600 dark:text-slate-300">
                        {customer.address}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="border-t border-gray-200 px-6 py-4 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm text-gray-500 dark:text-slate-400">
                  Customer ID: {customer.customerID}
                </span>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const History = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [providerID, setProviderID] = useState(null);
  const [historyItems, setHistoryItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    timeframe: 'all', // all, lastMonth, lastYear
    sortBy: 'date-desc', // date-desc, date-asc
    status: 'all' // all, completed, cancelled
  });
  const [serviceDetails, setServiceDetails] = useState({});
  const [customerDetails, setCustomerDetails] = useState({});
  
  // Modal state
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  // Format date from ISO string
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (err) {
      return 'Invalid date';
    }
  };

  // Format time from ISO string
  const formatTime = (dateString) => {
    try {
      if (!dateString) return '';
      return format(parseISO(dateString), 'h:mm a');
    } catch (err) {
      return '';
    }
  };
  
  // Format relative time
  const formatRelativeTime = (dateString) => {
    try {
      if (!dateString) return '';
      const date = parseISO(dateString);
      const daysDiff = differenceInCalendarDays(new Date(), date);
      
      if (daysDiff <= 7) {
        return formatDistanceToNow(date, { addSuffix: true });
      } else {
        return formatDate(dateString);
      }
    } catch (err) {
      return '';
    }
  };

  // Get provider ID from user email
  const fetchProviderID = async (email) => {
    try {
      // Get user details by email
      const userResponse = await apiClient.get(`/v1/users/by-email/${email}`);
      const userData = userResponse.data;
      
      if (!userData || !userData.userID) {
        throw new Error('Failed to get user details');
      }
      
      // Get provider ID using userID
      const providerResponse = await apiClient.get(`/v1/service-providers/by-user/${userData.userID}`);
      const providerData = providerResponse.data;
      
      if (!providerData || !providerData.providerID) {
        throw new Error('Failed to get provider details');
      }
      
      setProviderID(providerData.providerID);
      return providerData.providerID;
    } catch (err) {
      console.error('Error fetching provider ID:', err);
      throw err;
    }
  };

  // Fetch history data using service-history API
  const fetchHistoryData = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      if (!user || !user.email) {
        throw new Error('User not authenticated');
      }
      
      // Get provider ID from user email
      const pID = providerID || await fetchProviderID(user.email);
      
      if (!pID) {
        throw new Error('Provider ID not found');
      }

      // Fetch service history using provider ID
      const historyResponse = await apiClient.get(`/v1/service-history/provider/${pID}`);
      const history = historyResponse.data || [];
      
      // Create maps to store service and customer details
      const servicesMap = {};
      const customersMap = {};
      
      // Fetch details for each service and customer in history
      await Promise.all(history.map(async (item) => {
        // Fetch service details if not already fetched
        if (!servicesMap[item.serviceID]) {
          try {
            const serviceResponse = await apiClient.get(`/v1/services/${item.serviceID}`);
            servicesMap[item.serviceID] = serviceResponse.data;
          } catch (err) {
            console.warn(`Failed to fetch service details for ID ${item.serviceID}`, err);
            servicesMap[item.serviceID] = { serviceName: `Service #${item.serviceID}`, description: '', price: 0 };
          }
        }
        
        // Fetch customer details if not already fetched
        if (!customersMap[item.customerID]) {
          try {
            // Step 1: Get customer details
            const customerResponse = await apiClient.get(`/v1/customers/${item.customerID}`);
            const customerData = customerResponse.data;
            
            if (!customerData || !customerData.userID) {
              customersMap[item.customerID] = { 
                customerID: item.customerID,
                name: `Customer #${item.customerID}`,
                surname: '',
                email: '',
                phoneNumber: '' 
              };
              return;
            }
            
            // Step 2: Get user details for this customer
            const userResponse = await apiClient.get(`/v1/users/${customerData.userID}`);
            const userData = userResponse.data;
            
            customersMap[item.customerID] = {
              ...customerData,
              ...userData,
              name: userData.name || `Customer`,
              surname: userData.surname || `#${item.customerID}`
            };
          } catch (err) {
            console.warn(`Failed to fetch customer details for ID ${item.customerID}`, err);
            customersMap[item.customerID] = { 
              customerID: item.customerID,
              name: `Customer #${item.customerID}`,
              surname: '',
              email: '',
              phoneNumber: '' 
            };
          }
        }
      }));
      
      // Store the fetched details
      setServiceDetails(servicesMap);
      setCustomerDetails(customersMap);
      
      // Update history items
      setHistoryItems(history);
      
    } catch (err) {
      console.error('Error fetching history data:', err);
      setError('Failed to load service history. Please try again.');
      toast.error('Failed to load service history');
    } finally {
      setIsLoading(false);
      if (showRefreshIndicator) {
        setIsRefreshing(false);
        toast.success('History refreshed');
      }
    }
  };

  // Show customer details modal
  const handleViewCustomer = (customerID) => {
    const customer = customerDetails[customerID];
    if (customer) {
      setSelectedCustomer(customer);
      setShowCustomerModal(true);
    } else {
      toast.error('Customer details not available');
    }
  };

  // Initial data load
  useEffect(() => {
    if (user && user.email) {
      fetchHistoryData();
    }
  }, [user]);

  // Filter history items based on search term and filters
  const filteredHistory = historyItems.filter(item => {
    // Apply search filter
    const serviceNameMatches = serviceDetails[item.serviceID]?.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const customerNameMatches = 
      (customerDetails[item.customerID]?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (customerDetails[item.customerID]?.surname?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    if (searchTerm && !serviceNameMatches && !customerNameMatches) {
      return false;
    }
    
    // Apply status filter
    if (filters.status !== 'all' && item.status?.toLowerCase() !== filters.status) {
      return false;
    }
    
    // Apply timeframe filter
    const date = new Date(item.serviceDate);
    const now = new Date();
    
    if (filters.timeframe === 'lastMonth') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);
      if (date < oneMonthAgo) return false;
    } else if (filters.timeframe === 'lastYear') {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(now.getFullYear() - 1);
      if (date < oneYearAgo) return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Apply sorting
    const dateA = new Date(a.serviceDate);
    const dateB = new Date(b.serviceDate);
    
    if (filters.sortBy === 'date-asc') {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header section with title and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center">
            <ClockIcon className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Service History</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
            View all your past service bookings
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => fetchHistoryData(true)}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <>
                <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />
                Refreshing
              </>
            ) : (
              <>
                <ArrowPathIcon className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <div className="flex">
            <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                {error}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Search and filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="relative max-w-xs">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
              placeholder="Search services or customers"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <div>
              <select
                value={filters.timeframe}
                onChange={(e) => setFilters({ ...filters, timeframe: e.target.value })}
                className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                <option value="all">All Time</option>
                <option value="lastMonth">Last Month</option>
                <option value="lastYear">Last Year</option>
              </select>
            </div>
            <div>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
              </select>
            </div>
            <div>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Showing results count */}
      {filteredHistory.length > 0 && (
        <p className="text-sm text-gray-500 dark:text-slate-400">
          Showing {filteredHistory.length} {filteredHistory.length === 1 ? 'service' : 'services'} from your history
        </p>
      )}

      {/* History table */}
      {filteredHistory.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center dark:border-slate-700 dark:bg-slate-800">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center dark:bg-slate-700">
            <CalendarDaysIcon className="h-8 w-8 text-gray-400 dark:text-slate-400" />
          </div>
          <h3 className="mb-1 text-lg font-medium text-gray-900 dark:text-white">No service history found</h3>
          <p className="text-gray-500 dark:text-slate-400">
            {searchTerm || filters.timeframe !== 'all' || filters.status !== 'all'
              ? "Try adjusting your search or filters"
              : "You haven't completed any services yet"}
          </p>
          {(searchTerm || filters.timeframe !== 'all' || filters.status !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilters({ timeframe: 'all', sortBy: 'date-desc', status: 'all' });
              }}
              className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <FunnelIcon className="mr-2 h-4 w-4" />
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          {/* Add overflow-x-auto to enable horizontal scrolling */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-slate-300">
                    Service
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-slate-300">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-slate-300">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-slate-300">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-slate-300">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {filteredHistory.map((item) => {
                  const service = serviceDetails[item.serviceID] || {};
                  const customer = customerDetails[item.customerID] || {};
                  
                  return (
                    <tr key={item.historyID} className="hover:bg-gray-50 dark:hover:bg-slate-700/30">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900/20">
                            <WrenchScrewdriverIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {service.serviceName || `Service #${item.serviceID}`}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-slate-400">
                              ID: {item.serviceID}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center dark:bg-slate-700">
                            <span className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                              {customer.name ? customer.name.charAt(0) : 'C'}
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {customer.name} {customer.surname}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-slate-400">
                              {customer.email || 'No email available'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatDate(item.serviceDate)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-slate-400 flex items-center">
                          <ClockIcon className="mr-1 h-3 w-3" />
                          {formatTime(item.serviceDate)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                          {formatRelativeTime(item.serviceDate)}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(service.price || 0)}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <StatusBadge status={item.status || 'COMPLETED'} />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <button
                          onClick={() => handleViewCustomer(item.customerID)}
                          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                        >
                          View Customer
                          <ChevronRightIcon className="ml-1 h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer info modal */}
      {showCustomerModal && selectedCustomer && (
        <CustomerInfoModal 
          customer={selectedCustomer}
          onClose={() => {
            setShowCustomerModal(false);
            setSelectedCustomer(null);
          }}
        />
      )}
    </div>
  );
};

export default History;