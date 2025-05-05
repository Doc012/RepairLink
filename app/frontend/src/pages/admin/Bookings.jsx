import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  ArrowPathIcon, 
  EyeIcon,
  TrashIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  ExclamationCircleIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import apiClient from '../../utils/apiClient';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [processingAction, setProcessingAction] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [currentPage, filterStatus]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      // In a real app, make API calls with pagination and filters
      // const response = await apiClient.get(`/admin/bookings?page=${currentPage}&status=${filterStatus}`);
      
      // For now, simulate with mock data
      setTimeout(() => {
        const mockBookings = getMockBookings();
        setBookings(mockBookings);
        setTotalPages(3); // Mock total pages
        setIsLoading(false);
      }, 800);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError('Failed to load bookings. Please try again.');
      setIsLoading(false);
    }
  };

  // Mock booking data for demonstration
  const getMockBookings = () => {
    const baseBookings = [
      { 
        id: 'B1001', 
        customer: { name: 'John Smith', email: 'john.smith@example.com', phone: '+27 11 123 4567' }, 
        provider: { name: 'Elite Plumbing', email: 'info@eliteplumbing.co.za' },
        service: 'Plumbing Repair',
        description: 'Fix leaking kitchen sink pipe',
        status: 'Completed', 
        paymentStatus: 'Paid',
        amount: 'R350.00',
        scheduledDate: '2025-03-15T10:00:00Z',
        completedDate: '2025-03-15T11:30:00Z',
        createdAt: '2025-03-10T08:15:00Z'
      },
      { 
        id: 'B1002', 
        customer: { name: 'Sarah Johnson', email: 'sarah.j@example.com', phone: '+27 21 234 5678' }, 
        provider: { name: 'PowerPros Electric', email: 'contact@powerpros.co.za' },
        service: 'Electrical Installation',
        description: 'Install ceiling fan in living room',
        status: 'Confirmed', 
        paymentStatus: 'Pending',
        amount: 'R680.00',
        scheduledDate: '2025-03-18T14:00:00Z',
        completedDate: null,
        createdAt: '2025-03-12T15:40:00Z'
      },
      { 
        id: 'B1003', 
        customer: { name: 'Michael Brown', email: 'mbrown@example.com', phone: '+27 31 345 6789' }, 
        provider: { name: 'ApplianceMasters', email: 'service@appliancemasters.co.za' },
        service: 'Washing Machine Repair',
        description: 'Machine not spinning during cycle',
        status: 'Pending', 
        paymentStatus: 'Not Paid',
        amount: 'R425.00',
        scheduledDate: '2025-03-20T09:30:00Z',
        completedDate: null,
        createdAt: '2025-03-14T11:20:00Z'
      },
      { 
        id: 'B1004', 
        customer: { name: 'Emma Davis', email: 'emma.d@example.com', phone: '+27 12 456 7890' }, 
        provider: { name: 'CleanSweep Services', email: 'bookings@cleansweep.co.za' },
        service: 'Home Deep Cleaning',
        description: 'Full house deep cleaning service',
        status: 'Cancelled', 
        paymentStatus: 'Refunded',
        amount: 'R950.00',
        scheduledDate: '2025-03-16T08:00:00Z',
        completedDate: null,
        createdAt: '2025-03-09T14:50:00Z'
      },
      { 
        id: 'B1005', 
        customer: { name: 'David Wilson', email: 'david.w@example.com', phone: '+27 41 567 8901' }, 
        provider: { name: 'Ace Locksmith', email: 'info@acelocksmith.co.za' },
        service: 'Lock Replacement',
        description: 'Replace front door lock and provide 3 keys',
        status: 'Completed', 
        paymentStatus: 'Paid',
        amount: 'R280.00',
        scheduledDate: '2025-03-12T13:30:00Z',
        completedDate: '2025-03-12T14:15:00Z',
        createdAt: '2025-03-11T09:10:00Z'
      },
      { 
        id: 'B1006', 
        customer: { name: 'Lisa Taylor', email: 'lisa.t@example.com', phone: '+27 11 678 9012' }, 
        provider: { name: 'GardenMasters', email: 'contact@gardenmasters.co.za' },
        service: 'Garden Maintenance',
        description: 'Lawn mowing, hedge trimming and general garden cleanup',
        status: 'Confirmed', 
        paymentStatus: 'Paid',
        amount: 'R550.00',
        scheduledDate: '2025-03-19T07:30:00Z',
        completedDate: null,
        createdAt: '2025-03-13T16:30:00Z'
      },
      { 
        id: 'B1007', 
        customer: { name: 'Thomas Moore', email: 'thomas.m@example.com', phone: '+27 21 789 0123' }, 
        provider: { name: 'TechWizards', email: 'support@techwizards.co.za' },
        service: 'Computer Repair',
        description: 'Fix laptop overheating issue and replace fan',
        status: 'In Progress', 
        paymentStatus: 'Partial',
        amount: 'R750.00',
        scheduledDate: '2025-03-14T11:00:00Z',
        completedDate: null,
        createdAt: '2025-03-13T08:45:00Z'
      },
    ];

    // Apply filter by status
    if (filterStatus !== 'all') {
      return baseBookings.filter(booking => booking.status.toLowerCase() === filterStatus.toLowerCase());
    }
    
    // Apply search term if present
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return baseBookings.filter(booking => 
        booking.id.toLowerCase().includes(term) ||
        booking.customer.name.toLowerCase().includes(term) ||
        booking.provider.name.toLowerCase().includes(term) ||
        booking.service.toLowerCase().includes(term)
      );
    }
    
    return baseBookings;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
    fetchBookings(); // This will apply the search term in getMockBookings
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // In a real app, this would trigger a new API call with the updated page
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleChangeStatus = async (bookingId, newStatus) => {
    setProcessingAction(true);
    try {
      // In a real app, make API call to update booking status
      // await apiClient.patch(`/admin/bookings/${bookingId}/status`, { status: newStatus });
      
      // Simulate API call
      setTimeout(() => {
        // Update status in local state
        const updatedBookings = bookings.map(booking => {
          if (booking.id === bookingId) {
            return { ...booking, status: newStatus };
          }
          return booking;
        });
        setBookings(updatedBookings);
        setProcessingAction(false);
        
        // If the booking is currently being viewed in the modal, update it too
        if (selectedBooking && selectedBooking.id === bookingId) {
          setSelectedBooking({ ...selectedBooking, status: newStatus });
        }
      }, 800);
    } catch (err) {
      console.error('Failed to update booking status:', err);
      setProcessingAction(false);
      // Show error notification
    }
  };

  // Helper to get appropriate status badge color
  const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'in progress':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Booking Management</h1>
        <div className="flex space-x-3">
          <Link
            to="/admin/reports"
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          >
            View Booking Reports
          </Link>
        </div>
      </div>

      <div className="rounded-lg border bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        {/* Search and filter bar */}
        <div className="border-b border-slate-200 p-4 dark:border-slate-700">
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <form onSubmit={handleSearch} className="relative flex w-full max-w-md">
              <input
                type="text"
                placeholder="Search bookings..."
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
                onClick={fetchBookings}
                className="ml-2 rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                title="Refresh"
              >
                <ArrowPathIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 flex flex-wrap gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-700/50">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Booking Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
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

        {/* Bookings table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Booking ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Service
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Scheduled For
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Amount
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-800">
              {isLoading ? (
                // Loading state
                [...Array(5)].map((_, index) => (
                  <tr key={index}>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="h-4 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="h-6 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="h-4 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="h-8 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
                    </td>
                  </tr>
                ))
              ) : bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {booking.id}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {booking.customer.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {booking.customer.email}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {booking.service}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {booking.provider.name}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(booking.scheduledDate)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                      {booking.amount}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleViewBooking(booking)}
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-purple-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-purple-400"
                          title="View details"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        {booking.status !== 'Completed' && booking.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleChangeStatus(booking.id, 'Completed')}
                            disabled={processingAction}
                            className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-green-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-green-400"
                            title="Mark as completed"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                        )}
                        {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                          <button
                            onClick={() => handleChangeStatus(booking.id, 'Cancelled')}
                            disabled={processingAction}
                            className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-red-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-red-400"
                            title="Cancel booking"
                          >
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-slate-500 dark:text-slate-400">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && bookings.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 dark:border-slate-700 sm:px-6">
            <div className="hidden sm:block">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{bookings.length}</span> of{' '}
                <span className="font-medium">57</span> bookings
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

      {/* Booking Detail Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)}></div>
          <div className="relative z-10 w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-slate-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Booking Details - {selectedBooking.id}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-full p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <h4 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Customer Information</h4>
                <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                  <p className="text-base font-medium text-slate-900 dark:text-white">{selectedBooking.customer.name}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{selectedBooking.customer.email}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{selectedBooking.customer.phone}</p>
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Provider Information</h4>
                <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                  <p className="text-base font-medium text-slate-900 dark:text-white">{selectedBooking.provider.name}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{selectedBooking.provider.email}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Service Details</h4>
              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <div className="mb-4">
                  <p className="text-base font-medium text-slate-900 dark:text-white">{selectedBooking.service}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{selectedBooking.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div>
                    <h5 className="text-xs font-medium text-slate-500 dark:text-slate-400">Status</h5>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${getStatusBadgeColor(selectedBooking.status)}`}>
                      {selectedBooking.status}
                    </span>
                  </div>
                  <div>
                    <h5 className="text-xs font-medium text-slate-500 dark:text-slate-400">Payment</h5>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedBooking.paymentStatus}</p>
                  </div>
                  <div>
                    <h5 className="text-xs font-medium text-slate-500 dark:text-slate-400">Amount</h5>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedBooking.amount}</p>
                  </div>
                  <div>
                    <h5 className="text-xs font-medium text-slate-500 dark:text-slate-400">Created</h5>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{new Date(selectedBooking.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Schedule Information</h4>
              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <h5 className="text-xs font-medium text-slate-500 dark:text-slate-400">Scheduled Date</h5>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{formatDate(selectedBooking.scheduledDate)}</p>
                  </div>
                  <div>
                    <h5 className="text-xs font-medium text-slate-500 dark:text-slate-400">Completed Date</h5>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {selectedBooking.completedDate ? formatDate(selectedBooking.completedDate) : 'Not completed yet'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 border-t border-slate-200 pt-4 dark:border-slate-700">
              {selectedBooking.status !== 'Completed' && selectedBooking.status !== 'Cancelled' && (
                <>
                  <button
                    onClick={() => {
                      handleChangeStatus(selectedBooking.id, 'Completed');
                      setShowModal(false);
                    }}
                    disabled={processingAction}
                    className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CheckCircleIcon className="mr-2 h-4 w-4" />
                    Mark as Completed
                  </button>
                  <button
                    onClick={() => {
                      handleChangeStatus(selectedBooking.id, 'Cancelled');
                      setShowModal(false);
                    }}
                    disabled={processingAction}
                    className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <XCircleIcon className="mr-2 h-4 w-4" />
                    Cancel Booking
                  </button>
                </>
              )}
              <button
                onClick={() => setShowModal(false)}
                className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;