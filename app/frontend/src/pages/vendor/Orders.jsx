import { useState, useEffect } from 'react';
import { 
  CheckIcon, 
  XMarkIcon, 
  ClockIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  UserIcon,
  ChatBubbleLeftIcon,
  EllipsisVerticalIcon,  // Add this import
  ChevronUpIcon,
  ChevronDownIcon,
  PlusIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/formatCurrency';
import ThemeToggle from '../../components/ThemeToggle';
import OrderCalendar from '../../components/calendar/OrderCalendar';

const Orders = () => {
  const [orders, setOrders] = useState([
    {
      bookingID: 1,
      customerName: "Jane Smith",
      serviceName: "Full Car Service",
      price: 3499.99,
      bookingDate: "2025-04-15",
      scheduledTime: "14:30",
      status: "COMPLETED",
      customerID: 1,
      serviceID: 1,
      review: {
        rating: 5,
        comment: "Excellent service!"
      }
    },
    {
      bookingID: 2,
      customerName: "Mike Johnson",
      serviceName: "Oil Change",
      price: 799.99,
      bookingDate: "2025-04-16",
      scheduledTime: "10:00",
      status: "PENDING",
      customerID: 2,
      serviceID: 2,
      review: null
    }
  ]);

  const [activeOrderId, setActiveOrderId] = useState(null);
  const [expandedNote, setExpandedNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortConfig, setSortConfig] = useState({
    key: 'bookingDate',
    direction: 'desc'
  });
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'calendar'

  const handleActionClick = (orderId) => {
    setActiveOrderId(activeOrderId === orderId ? null : orderId);
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    setActiveOrderId(null);
    // Update the order status
    setOrders(orders.map(order => 
      order.bookingID === orderId 
        ? { ...order, status: newStatus }
        : order
    ));
  };

  // Add this function to filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Add sorting function
  const handleSort = (key) => {
    setSortConfig((currentSort) => ({
      key,
      direction: 
        currentSort.key === key && currentSort.direction === 'asc' 
          ? 'desc' 
          : 'asc'
    }));
  };

  // Update filteredOrders to include sorting
  const sortedAndFilteredOrders = filteredOrders.sort((a, b) => {
    if (sortConfig.key === 'bookingDate') {
      const dateA = new Date(`${a.bookingDate} ${a.scheduledTime}`);
      const dateB = new Date(`${b.bookingDate} ${b.scheduledTime}`);
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
    }
    if (sortConfig.key === 'customerName') {
      return sortConfig.direction === 'asc'
        ? a.customerName.localeCompare(b.customerName)
        : b.customerName.localeCompare(a.customerName);
    }
    if (sortConfig.key === 'price') {
      return sortConfig.direction === 'asc'
        ? a.price - b.price
        : b.price - a.price;
    }
    if (sortConfig.key === 'status') {
      return sortConfig.direction === 'asc'
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }
    return 0;
  });

  // Add click outside handler to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeOrderId && !event.target.closest('button')) {
        setActiveOrderId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeOrderId]);

  const getStatusColor = (status) => {
    const colors = {
      COMPLETED: "text-green-600 bg-green-50 dark:bg-green-900/20",
      PENDING: "text-amber-600 bg-amber-50 dark:bg-amber-900/20",
      CANCELLED: "text-red-600 bg-red-50 dark:bg-red-900/20"
    };
    return colors[status] || colors.PENDING;
  };

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
            className="inline-flex items-center rounded-lg bg-white px-3 py-2 mr-10  text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-700"
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
          
          {/* Theme Toggle
          <ThemeToggle /> */}
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

          {/* Status Filter and Theme Toggle */}
          <div className="flex items-center space-x-2">
            {['ALL', 'PENDING', 'COMPLETED', 'CANCELLED'].map((status) => (
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

      {/* Orders List */}
      {viewMode === 'table' ? (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="w-48 px-4 py-3 text-left">
                    <button 
                      onClick={() => handleSort('customerName')}
                      className="group inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                      Customer
                      <span className="ml-2 flex-none rounded">
                        {sortConfig.key === 'customerName' && (
                          sortConfig.direction === 'desc' ? 
                            <ChevronDownIcon className="h-4 w-4" /> : 
                            <ChevronUpIcon className="h-4 w-4" />
                        )}
                      </span>
                    </button>
                  </th>
                  <th className="w-40 px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-slate-400">
                    Service
                  </th>
                  <th className="w-32 px-4 py-3 text-left">
                    <button 
                      onClick={() => handleSort('price')}
                      className="group inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                      Amount
                      <span className="ml-2 flex-none rounded">
                        {sortConfig.key === 'price' && (
                          sortConfig.direction === 'desc' ? 
                            <ChevronDownIcon className="h-4 w-4" /> : 
                            <ChevronUpIcon className="h-4 w-4" />
                        )}
                      </span>
                    </button>
                  </th>
                  <th className="w-40 px-4 py-3 text-left">
                    <button 
                      onClick={() => handleSort('bookingDate')}
                      className="group inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                      Schedule
                      <span className="ml-2 flex-none rounded">
                        {sortConfig.key === 'bookingDate' && (
                          sortConfig.direction === 'desc' ? 
                            <ChevronDownIcon className="h-4 w-4" /> : 
                            <ChevronUpIcon className="h-4 w-4" />
                        )}
                      </span>
                    </button>
                  </th>
                  <th className="w-24 px-4 py-3 text-left">
                    <button 
                      onClick={() => handleSort('status')}
                      className="group inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                      Status
                      <span className="ml-2 flex-none rounded">
                        {sortConfig.key === 'status' && (
                          sortConfig.direction === 'desc' ? 
                            <ChevronDownIcon className="h-4 w-4" /> : 
                            <ChevronUpIcon className="h-4 w-4" />
                        )}
                      </span>
                    </button>
                  </th>
                  <th className="w-64 px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-slate-400">
                    Notes
                  </th>
                  <th className="w-16 px-4 py-3 text-center text-sm font-medium text-gray-500 dark:text-slate-400">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {sortedAndFilteredOrders.map((order) => (
                  <tr key={order.bookingID} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center">
                        <UserIcon className="mr-2 h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {order.customerName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-900 dark:text-white">
                        {order.serviceName}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center text-gray-900 dark:text-white">
                        <CurrencyDollarIcon className="mr-1 h-4 w-4 text-gray-400" />
                        {formatCurrency(order.price)}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center space-x-1 text-sm text-gray-900 dark:text-white">
                        <CalendarDaysIcon className="h-4 w-4 text-gray-400" />
                        <span>{order.bookingDate}</span>
                        <span className="text-gray-400">•</span>
                        <span>{order.scheduledTime}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setExpandedNote(expandedNote === order.bookingID ? null : order.bookingID)}
                        className="group flex items-start max-w-xs"
                      >
                        <ChatBubbleLeftIcon className="mr-2 h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
                        <p className={`text-sm text-gray-600 dark:text-gray-300 ${
                          expandedNote === order.bookingID ? '' : 'truncate'
                        }`}>
                          {order.review ? order.review.comment : "No notes provided"}
                        </p>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        <div className="relative">
                          <button
                            onClick={() => handleActionClick(order.bookingID)}
                            disabled={order.status === "COMPLETED"}
                            className={`inline-flex items-center rounded-lg p-2 ${
                              order.status === "COMPLETED"
                                ? "cursor-not-allowed text-gray-300 dark:text-gray-600"
                                : "text-gray-500 hover:bg-gray-100 focus:outline-none dark:text-gray-400 dark:hover:bg-slate-700"
                            }`}
                          >
                            <EllipsisVerticalIcon className="h-5 w-5" />
                          </button>
                          {activeOrderId === order.bookingID && order.status !== "COMPLETED" && (
                            <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-slate-800 dark:ring-slate-700">
                              <button
                                onClick={() => handleUpdateStatus(order.bookingID, "COMPLETED")}
                                className="block w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                              >
                                Mark as Completed
                              </button>
                              {order.status === "PENDING" && (
                                <button
                                  onClick={() => handleUpdateStatus(order.bookingID, "CANCELLED")}
                                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                >
                                  Cancel Order
                                </button>
                              )}
                              {order.status === "CANCELLED" && (
                                <button
                                  onClick={() => handleUpdateStatus(order.bookingID, "PENDING")}
                                  className="block w-full px-4 py-2 text-left text-sm text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/20"
                                >
                                  Reactivate Order
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <OrderCalendar orders={sortedAndFilteredOrders} />
        </div>
      )}
    </div>
  );
};

export default Orders;