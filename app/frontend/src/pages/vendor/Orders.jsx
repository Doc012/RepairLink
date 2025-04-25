import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckIcon, 
  XMarkIcon, 
  ClockIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  UserIcon,
  ChatBubbleLeftIcon,
  EllipsisVerticalIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  PlusIcon,
  TableCellsIcon,
  BuildingStorefrontIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/formatCurrency';
import { useAuth } from '../../contexts/auth/AuthContext';
import { toast } from 'react-hot-toast';
import ThemeToggle from '../../components/ThemeToggle';
import OrderCalendar from '../../components/calendar/OrderCalendar';
import vendorAPI from '../../services/vendor/vendorAPI';
import userAPI from '../../services/auth/userAPI';

// Business Setup Guide component for new vendors
const BusinessSetupGuide = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Orders & Bookings
        </h1>
      </div>

      <div className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white shadow-md dark:from-blue-700 dark:to-indigo-800">
        <div className="flex flex-col items-center sm:flex-row sm:justify-between">
          <div className="mb-4 flex items-center sm:mb-0">
            <BuildingStorefrontIcon className="h-10 w-10 text-blue-100" />
            <div className="ml-4">
              <h2 className="text-2xl font-bold">Set Up Your Business Profile</h2>
              <p className="text-blue-100">You need to create your business profile before managing bookings</p>
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
              <h4 className="font-medium text-gray-900 dark:text-white">Manage customer bookings</h4>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Create a business profile to view and manage all your customer bookings and orders.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <CheckIcon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Get discovered by customers</h4>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Your business will be visible to customers searching for services in your area.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <CheckIcon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Track your performance</h4>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Access detailed insights about your services and customer satisfaction.
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
              Once your business profile is created and approved by RepairLink admins, you can start receiving and managing bookings from customers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper to format date and time from ISO string
const formatDateTime = (isoString) => {
  if (!isoString) return { date: 'N/A', time: 'N/A' };
  
  const date = new Date(isoString);
  return {
    date: date.toLocaleDateString('en-ZA', { year: 'numeric', month: '2-digit', day: '2-digit' }),
    time: date.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', hour12: false })
  };
};

// Add this function before your Orders component
const getStatusColor = (status) => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    case 'PENDING':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
    case 'CONFIRMED':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

// Add a tooltip component for status
const StatusTooltip = ({ status }) => {
  const tooltips = {
    PENDING: "Order is waiting for confirmation",
    CONFIRMED: "Order has been confirmed but not completed",
    COMPLETED: "Order has been successfully completed",
    CANCELLED: "Order has been cancelled"
  };
  
  return (
    <div className="group relative">
      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(status)}`}>
        {status}
      </span>
      <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 transform whitespace-nowrap rounded-md bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
        {tooltips[status] || status}
      </div>
    </div>
  );
};

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [expandedNote, setExpandedNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortConfig, setSortConfig] = useState({
    key: 'bookingDate',
    direction: 'desc'
  });
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'calendar'
  const [providerInfo, setProviderInfo] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState('bottom');
  const [dropdownTop, setDropdownTop] = useState(0);
  const [dropdownRight, setDropdownRight] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({});
  const [noBusinessProfile, setNoBusinessProfile] = useState(false);

  // Add this function INSIDE the component
  const getCustomerDisplayName = (order) => {
    if (!order) {
      return '';
    }
    
    if (order?.customerName) {
      return order.customerName;
    }
    
    if (order?.customerID && customerInfo[order.customerID]) {
      const fullName = customerInfo[order.customerID].fullName;
      return fullName;
    }
    
    return `Customer #${order?.customerID || 'Unknown'}`;
  };

  // Fetch provider info first, then bookings
  useEffect(() => {
    const fetchProviderAndBookings = async () => {
      if (!user || !user.email) {
        setError("User information not found. Please log in again.");
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        setNoBusinessProfile(false);
        
        // Step 1: Get user details by email
        const userResponse = await userAPI.getUserByEmail(user.email);
        const userDetails = userResponse.data;
        
        if (!userDetails || !userDetails.userID) {
          setError("User ID not found. Please check your account.");
          setIsLoading(false);
          return;
        }
        
        try {
          // Step 2: Get provider details using user ID
          const providerResponse = await vendorAPI.getProviderByUserId(userDetails.userID);
          const providerDetails = providerResponse.data;
          
          if (!providerDetails || !providerDetails.providerID) {
            setNoBusinessProfile(true);
            setIsLoading(false);
            return;
          }
          
          setProviderInfo(providerDetails);
          
          // Step 3: Get bookings using provider ID
          const bookingsResponse = await vendorAPI.getBookings(providerDetails.providerID);
          
          // Process bookings to add formatted date and time
          const processedBookings = (bookingsResponse.data || []).map(booking => {
            const { date, time } = formatDateTime(booking.appointmentDateTime || booking.bookingDate);
            return { ...booking, date, time };
          });
          
          // Set the orders state with processed bookings
          setOrders(processedBookings);
          
        } catch (providerError) {
          // Check if error is specific to missing business profile
          if (providerError.response && 
              providerError.response.status === 500 && 
              providerError.response.data.message?.includes('ServiceProvider not found')) {
            setNoBusinessProfile(true);
          } else {
            throw providerError; // Re-throw if it's a different error
          }
        }
        
      } catch (err) {
        if (!noBusinessProfile) {
          setError("Failed to load bookings. Please try again later.");
          toast.error("Failed to load bookings");
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProviderAndBookings();
  }, [user]);

  // Add this useEffect to fetch customer details when orders are loaded
  useEffect(() => {
    // Skip if no orders
    if (!orders || orders.length === 0) return;

    const fetchAllCustomerDetails = async () => {
      // Get unique customer IDs
      const uniqueCustomerIds = [...new Set(
        orders.map(order => order.customerID).filter(Boolean)
      )];
      
      const fetchCustomerDetails = async (customerId) => {
        if (!customerId) return;
        
        // Skip if we already have this customer's info in state
        if (customerInfo[customerId]) {
          return;
        }
        
        try {
          // Step 1: Get customer's user ID from customer ID
          const customerResponse = await userAPI.getCustomerById(customerId);
          
          if (!customerResponse?.data || !customerResponse.data.userID) {
            // Add fallback to avoid refetching invalid customer IDs
            setCustomerInfo(prev => ({
              ...prev,
              [customerId]: { fullName: `Customer #${customerId}` }
            }));
            return;
          }
          
          const userId = customerResponse.data.userID;
          
          // Step 2: Get user's basic info using user ID
          const userResponse = await userAPI.getUserBasicInfo(userId);
          
          if (!userResponse?.data) {
            // Add fallback to avoid refetching invalid user IDs
            setCustomerInfo(prev => ({
              ...prev,
              [customerId]: { fullName: `Customer #${customerId}` }
            }));
            return;
          }
          
          const userData = userResponse.data;
          
          // Step 3: Store the customer information in state
          setCustomerInfo(prev => {
            const updatedInfo = {
              ...prev,
              [customerId]: {
                name: userData.name,
                surname: userData.surname,
                phoneNumber: userData.phoneNumber,
                fullName: `${userData.name} ${userData.surname}`
              }
            };
            return updatedInfo;
          });
        } catch (error) {
          // Add fallback to avoid refetching failed customer IDs
          setCustomerInfo(prev => ({
            ...prev,
            [customerId]: { fullName: `Customer #${customerId}` }
          }));
        }
      };
      
      // Process customer IDs one by one (sequentially)
      const processBatch = async () => {
        for (const customerId of uniqueCustomerIds) {
          await fetchCustomerDetails(customerId);
        }
      };
      
      processBatch();
    };
    
    fetchAllCustomerDetails();
  }, [orders]); // Include customerInfo to avoid issues with stale state

  // Add this useEffect with window event listener to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeOrderId && !event.target.closest('.action-dropdown-container')) {
        setActiveOrderId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeOrderId]);

  // Add this useEffect to handle keyboard navigation in the dropdown
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (activeOrderId && event.key === 'Escape') {
        setActiveOrderId(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeOrderId]);

  // Add this useEffect to detect mobile screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Functions must be defined before using them in render
  const getDropdownPosition = (event) => {
    // Get the button's position in the viewport
    const buttonRect = event.currentTarget.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // If button is in the top half of the screen, show dropdown below
    // Otherwise, show it above to prevent it going off-screen
    const position = buttonRect.top < viewportHeight / 2 ? 'bottom' : 'top';
    
    return position;
  };

  const handleRowClick = (order) => {
    // Don't show modal for completed orders
    if (order.status === "COMPLETED") {
      return;
    }
    
    setSelectedOrder(order);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    // Clear the selected order
    setSelectedOrder(null);
    
    // Set up confirmation if cancelling or completing
    if (newStatus === 'CANCELLED' || newStatus === 'COMPLETED') {
      setConfirmAction({
        orderId,
        newStatus,
        title: `${newStatus === 'CANCELLED' ? 'Cancel' : 'Complete'} Order`,
        message: `Are you sure you want to mark this order as ${newStatus.toLowerCase()}?`,
        confirmText: `Yes, ${newStatus === 'CANCELLED' ? 'cancel' : 'complete'} it`,
        cancelText: "No, keep it as is"
      });
      return;
    }
    
    // Direct update for non-critical status changes
    await updateOrderStatus(orderId, newStatus);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    if (!providerInfo || !providerInfo.providerID) {
      toast.error("Provider information not available");
      return;
    }
    
    try {
      toast.loading("Updating booking status...", { id: "status-update" });
      
      await vendorAPI.updateBookingStatus(orderId, newStatus);
      
      // Update orders in state
      setOrders(orders.map(order => 
        order.bookingID === orderId 
          ? { ...order, status: newStatus }
          : order
      ));
      
      toast.success(`Booking marked as ${newStatus.toLowerCase()}`, { id: "status-update" });
    } catch (err) {
      toast.error("Failed to update booking status", { id: "status-update" });
    } finally {
      setConfirmAction(null);
    }
  };

  const handleSort = (key) => {
    setSortConfig((currentSort) => ({
      key,
      direction: 
        currentSort.key === key && currentSort.direction === 'asc' 
          ? 'desc' 
          : 'asc'
    }));
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (order.serviceName?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (order.additionalNotes?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sort filtered orders
  const sortedAndFilteredOrders = filteredOrders.sort((a, b) => {
    if (sortConfig.key === 'bookingDate') {
      const dateA = new Date(a.bookingDate);
      const dateB = new Date(b.bookingDate);
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
    }
    if (sortConfig.key === 'customerName') {
      return sortConfig.direction === 'asc'
        ? (a.customerName || '').localeCompare(b.customerName || '')
        : (b.customerName || '').localeCompare(a.customerName || '');
    }
    if (sortConfig.key === 'price') {
      return sortConfig.direction === 'asc'
        ? (a.price || 0) - (b.price || 0)
        : (b.price || 0) - (a.price || 0);
    }
    if (sortConfig.key === 'status') {
      return sortConfig.direction === 'asc'
        ? (a.status || '').localeCompare(b.status || '')
        : (b.status || '').localeCompare(a.status || '');
    }
    return 0;
  });

  // Render content based on loading/error/noBusinessProfile state
  // IMPORTANT: Don't use early returns with hooks!
  const renderContent = () => {
    if (noBusinessProfile) {
      return <BusinessSetupGuide />;
    }
    
    if (isLoading) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Orders & Bookings
            </h1>
          </div>
          
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-blue-600 motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
              </div>
              <p className="mt-4 text-gray-500 dark:text-gray-400">Loading your bookings...</p>
              <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">This may take a moment</p>
            </div>
          </div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block rounded-full bg-red-100 p-2 text-red-600 dark:bg-red-900/30 dark:text-red-400">
              <XMarkIcon className="h-6 w-6" />
            </div>
            <p className="mb-2 text-lg font-medium text-red-600 dark:text-red-400">Failed to Load Bookings</p>
            <p className="text-gray-500 dark:text-gray-400">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    
    // Main content when data is loaded successfully
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Orders & Bookings
          </h1>
          <div className="flex items-center space-x-4">
            {/* Calendar View Button */}
            <button 
              onClick={() => setViewMode(viewMode === 'table' ? 'calendar' : 'table')}
              className="inline-flex items-center rounded-lg bg-white px-3 py-2 mr-4 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-700"
            >
              {viewMode === 'table' ? (
                <>
                  <CalendarDaysIcon className="mr-2 h-5 w-5" />
                  View Calendar
                </>
              ) : (
                <>
                  <TableCellsIcon className="mr-2 h-5 w-5" />
                  View Table
                </>
              )}
            </button>
            
            {/* Divider */}
            <div className="h-6 w-px bg-gray-200 dark:bg-slate-700"></div>
          </div>
        </div>

        {/* Summary Stats - Updated for single row on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center">
              <div className="mr-3 rounded-full bg-blue-50 p-2 dark:bg-blue-900/20">
                <CalendarDaysIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{orders.length}</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center">
              <div className="mr-3 rounded-full bg-amber-50 p-2 dark:bg-amber-900/20">
                <ClockIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {orders.filter(order => order.status === 'PENDING').length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center">
              <div className="mr-3 rounded-full bg-blue-50 p-2 dark:bg-blue-900/20">
                <CheckIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Confirmed</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {orders.filter(order => order.status === 'CONFIRMED').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center">
              <div className="mr-3 rounded-full bg-green-50 p-2 dark:bg-green-900/20">
                <CheckIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {orders.filter(order => order.status === 'COMPLETED').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center">
              <div className="mr-3 rounded-full bg-red-50 p-2 dark:bg-red-900/20">
                <XMarkIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Cancelled</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {orders.filter(order => order.status === 'CANCELLED').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
            {/* Search Bar */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders..."
                className="block w-full rounded-lg border border-gray-200 pl-10 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap items-center gap-2">
              {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium ${
                    statusFilter === status
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700'
                  } border border-gray-200 dark:border-slate-700`}
                >
                  {status === 'ALL' ? 'All Orders' : status.charAt(0) + status.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700">
              <CalendarDaysIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No bookings found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchQuery || statusFilter !== 'ALL' 
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'You don\'t have any bookings yet. They will appear here when customers book your services.'}
            </p>
          </div>
        )}

        {/* Orders List */}
        {filteredOrders.length > 0 && (
          viewMode === 'table' ? (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                  <thead className="bg-gray-100 dark:bg-slate-700/90">
                    <tr>
                      <th className="w-48 px-4 py-3.5 text-left">
                        <button 
                          onClick={() => handleSort('customerName')}
                          className="group inline-flex items-center text-sm font-semibold text-gray-700 hover:text-gray-900 dark:text-slate-300 dark:hover:text-white"
                        >
                          Customer
                          <span className={`ml-2 flex-none rounded ${
                            sortConfig.key === 'customerName' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                          }`}>
                            {sortConfig.key === 'customerName' && (
                              sortConfig.direction === 'desc' ? 
                                <ChevronDownIcon className="h-4 w-4" /> : 
                                <ChevronUpIcon className="h-4 w-4" />
                            )}
                            {sortConfig.key !== 'customerName' && (
                              <ChevronUpIcon className="h-4 w-4" />
                            )}
                          </span>
                        </button>
                      </th>
                      <th className="w-40 px-4 py-3.5 text-left">
                        <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                          Service
                        </span>
                      </th>
                      <th className="w-32 px-4 py-3.5 text-left">
                        <button 
                          onClick={() => handleSort('price')}
                          className="group inline-flex items-center text-sm font-semibold text-gray-700 hover:text-gray-900 dark:text-slate-300 dark:hover:text-white"
                        >
                          Amount
                          <span className={`ml-2 flex-none rounded ${
                            sortConfig.key === 'price' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                          }`}>
                            {sortConfig.key === 'price' && (
                              sortConfig.direction === 'desc' ? 
                                <ChevronDownIcon className="h-4 w-4" /> : 
                                <ChevronUpIcon className="h-4 w-4" />
                            )}
                            {sortConfig.key !== 'price' && (
                              <ChevronUpIcon className="h-4 w-4" />
                            )}
                          </span>
                        </button>
                      </th>
                      <th className="w-40 px-4 py-3.5 text-left">
                        <button 
                          onClick={() => handleSort('bookingDate')}
                          className="group inline-flex items-center text-sm font-semibold text-gray-700 hover:text-gray-900 dark:text-slate-300 dark:hover:text-white"
                        >
                          Schedule
                          <span className={`ml-2 flex-none rounded ${
                            sortConfig.key === 'bookingDate' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                          }`}>
                            {sortConfig.key === 'bookingDate' && (
                              sortConfig.direction === 'desc' ? 
                                <ChevronDownIcon className="h-4 w-4" /> : 
                                <ChevronUpIcon className="h-4 w-4" />
                            )}
                            {sortConfig.key !== 'bookingDate' && (
                              <ChevronUpIcon className="h-4 w-4" />
                            )}
                          </span>
                        </button>
                      </th>
                      <th className="w-24 px-4 py-3.5 text-left">
                        <button 
                          onClick={() => handleSort('status')}
                          className="group inline-flex items-center text-sm font-semibold text-gray-700 hover:text-gray-900 dark:text-slate-300 dark:hover:text-white"
                        >
                          Status
                          <span className={`ml-2 flex-none rounded ${
                            sortConfig.key === 'status' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                          }`}>
                            {sortConfig.key === 'status' && (
                              sortConfig.direction === 'desc' ? 
                                <ChevronDownIcon className="h-4 w-4" /> : 
                                <ChevronUpIcon className="h-4 w-4" />
                            )}
                            {sortConfig.key !== 'status' && (
                              <ChevronUpIcon className="h-4 w-4" />
                            )}
                          </span>
                        </button>
                      </th>
                      <th className="w-64 px-4 py-3.5 text-left">
                        <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                          Notes
                        </span>
                      </th>
                      <th className="w-16 px-4 py-3.5 text-center">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                    {sortedAndFilteredOrders.map((order, index) => (
                      <tr 
                        key={order.bookingID} 
                        className={`${
                          index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-gray-50 dark:bg-slate-800/50'
                        } hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors ${
                          order.status !== "COMPLETED" ? 'cursor-pointer' : ''
                        }`}
                        onClick={() => handleRowClick(order)}
                      >
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="flex items-center">
                            <UserIcon className="mr-2 h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-900 dark:text-white">
                              {order?.customerID && customerInfo[order.customerID]?.fullName 
                                ? customerInfo[order.customerID].fullName 
                                : `Customer #${order?.customerID || 'Unknown'}`}
                            </span>
                            {customerInfo[order.customerID]?.phoneNumber && (
                              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                ({customerInfo[order.customerID].phoneNumber})
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-gray-900 dark:text-white" title={order.serviceName}>
                            {order.serviceName || `Service #${order.serviceID}`}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="flex items-center text-gray-900 dark:text-white">
                            <CurrencyDollarIcon className="mr-1 h-4 w-4 text-gray-400" />
                            {formatCurrency(order.price || 0)}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="flex items-center space-x-1 text-sm text-gray-900 dark:text-white">
                            <CalendarDaysIcon className="h-4 w-4 text-gray-400" />
                            <span>{order.date}</span>
                            <span className="text-gray-400">•</span>
                            <span>{order.time}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <StatusTooltip status={order.status} />
                        </td>
                        <td className="px-4 py-3">
                          <div
                            onClick={(e) => e.stopPropagation()} // Prevent modal from opening when clicking notes
                            className="group flex items-start max-w-xs"
                          >
                            <ChatBubbleLeftIcon className="mr-2 h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
                            <p className={`text-sm text-gray-600 dark:text-gray-300 ${
                              expandedNote === order.bookingID ? '' : 'truncate'
                            }`}>
                              {order.additionalNotes || "No notes provided"}
                            </p>
                            <button
                              className="ml-2 text-blue-600 text-xs hover:text-blue-800"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedNote(expandedNote === order.bookingID ? null : order.bookingID);
                              }}
                            >
                              {expandedNote === order.bookingID ? 'Show less' : 'Show more'}
                            </button>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-center">
                          {order.status !== "COMPLETED" && (
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                              Update
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <OrderCalendar 
                orders={sortedAndFilteredOrders} 
                onSelectOrder={(order) => handleRowClick(order)}
                customerInfo={customerInfo}
              />
            </div>
          )
        )}

        {/* Order status update modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg max-w-md w-full p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Update Order Status
                </h3>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              {/* Order details */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Customer:</span>
                  <div className="text-right">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {selectedOrder?.customerID && customerInfo[selectedOrder.customerID]?.fullName 
                        ? customerInfo[selectedOrder.customerID].fullName 
                        : `Customer #${selectedOrder?.customerID || 'Unknown'}`}
                    </span>
                    {customerInfo[selectedOrder.customerID]?.phoneNumber && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {customerInfo[selectedOrder.customerID].phoneNumber}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Service:</span>
                  <span className="text-sm text-gray-900 dark:text-white">{selectedOrder.serviceName}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Date:</span>
                  <span className="text-sm text-gray-900 dark:text-white">{selectedOrder.date} at {selectedOrder.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Status:</span>
                  <StatusTooltip status={selectedOrder.status} />
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Select new status:</h4>
                
                {/* Status update options */}
                <div className="space-y-2">
                  {selectedOrder.status === "PENDING" && (
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.bookingID, "CONFIRMED")}
                      className="flex w-full items-center px-4 py-3 text-left text-sm text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900/30"
                    >
                      <CheckIcon className="h-5 w-5 mr-2" />
                      Confirm Order
                      <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">Changes status to Confirmed</span>
                    </button>
                  )}
                  
                  {(selectedOrder.status === "PENDING" || selectedOrder.status === "CONFIRMED") && (
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.bookingID, "COMPLETED")}
                      className="flex w-full items-center px-4 py-3 text-left text-sm text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-900/30"
                    >
                      <CheckIcon className="h-5 w-5 mr-2" />
                      Mark as Completed
                      <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">Finalizes the order</span>
                    </button>
                  )}
                  
                  {(selectedOrder.status === "PENDING" || selectedOrder.status === "CONFIRMED") && (
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.bookingID, "CANCELLED")}
                      className="flex w-full items-center px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-900/30"
                    >
                      <XMarkIcon className="h-5 w-5 mr-2" />
                      Cancel Order
                      <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">Cancels the booking</span>
                    </button>
                  )}
                  
                  {selectedOrder.status === "CANCELLED" && (
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.bookingID, "PENDING")}
                      className="flex w-full items-center px-4 py-3 text-left text-sm text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-900/30"
                    >
                      <ClockIcon className="h-5 w-5 mr-2" />
                      Reactivate Order
                      <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">Changes status to Pending</span>
                    </button>
                  )}
                </div>
              </div>
              
              <div className="mt-6 border-t border-gray-200 dark:border-slate-700 pt-4 flex justify-end">
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-slate-700 rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation dialog */}
        {confirmAction && (
          <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg max-w-md w-full p-6 shadow-xl">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {confirmAction.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {confirmAction.message}
              </p>
              <div className="mt-6 flex justify-end space-x-3">
                <button 
                  onClick={() => setConfirmAction(null)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700"
                >
                  {confirmAction.cancelText}
                </button>
                <button 
                  onClick={() => updateOrderStatus(confirmAction.orderId, confirmAction.newStatus)}
                  className={`rounded-md px-4 py-2 text-sm font-medium text-white ${
                    confirmAction.newStatus === 'CANCELLED' 
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {confirmAction.confirmText}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Always return something, never conditionally return early
  return renderContent();
};

export default Orders;