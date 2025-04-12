import { useState } from 'react';
import { 
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  BuildingStorefrontIcon,
  PhoneIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/formatCurrency';

const Bookings = () => {
  const [filter, setFilter] = useState('all');
  const [bookings, setBookings] = useState([
    {
      id: 1,
      serviceName: "Full Car Service",
      provider: {
        name: "Smith's Auto Repair",
        location: "Sandton, Johannesburg",
        phone: "+27 11 234 5678"
      },
      date: "2024-04-15",
      time: "10:00 AM",
      status: "CONFIRMED",
      price: 1299.99,
      notes: "Please bring vehicle documentation"
    },
    {
      id: 2,
      serviceName: "Electrical System Diagnostics",
      provider: {
        name: "PowerTech Solutions",
        location: "Rosebank, Johannesburg",
        phone: "+27 11 345 6789"
      },
      date: "2024-04-16",
      time: "2:00 PM",
      status: "PENDING",
      price: 899.99,
      notes: "Main circuit inspection"
    },
    {
      id: 3,
      serviceName: "Plumbing Maintenance",
      provider: {
        name: "Pro Plumbers SA",
        location: "Braamfontein, Johannesburg",
        phone: "+27 11 456 7890"
      },
      date: "2024-04-10",
      time: "11:30 AM",
      status: "COMPLETED",
      price: 749.99,
      notes: "Annual maintenance check completed"
    },
    {
      id: 4,
      serviceName: "Security System Installation",
      provider: {
        name: "Secure Tech Systems",
        location: "Fourways, Johannesburg",
        phone: "+27 11 567 8901"
      },
      date: "2024-04-08",
      time: "9:00 AM",
      status: "CANCELLED",
      price: 2499.99,
      notes: "Cancelled due to scheduling conflict"
    },
    {
      id: 5,
      serviceName: "Garden Landscaping",
      provider: {
        name: "Garden Masters",
        location: "Morningside, Johannesburg",
        phone: "+27 11 678 9012"
      },
      date: "2024-04-20",
      time: "8:00 AM",
      status: "CONFIRMED",
      price: 1599.99,
      notes: "Full garden renovation"
    }
  ]);

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400",
      CONFIRMED: "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400",
      CANCELLED: "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400",
      COMPLETED: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400"
    };
    return colors[status] || colors.PENDING;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleIcon className="mr-1 h-4 w-4" />;
      case 'CANCELLED':
        return <XCircleIcon className="mr-1 h-4 w-4" />;
      default:
        return null;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status.toLowerCase() === filter.toUpperCase();
  });

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="text-sm font-medium text-gray-500 dark:text-slate-400">Total Bookings</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{bookings.length}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="text-sm font-medium text-gray-500 dark:text-slate-400">Upcoming</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
            {bookings.filter(b => b.status === 'CONFIRMED').length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="text-sm font-medium text-gray-500 dark:text-slate-400">Completed</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
            {bookings.filter(b => b.status === 'COMPLETED').length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="text-sm font-medium text-gray-500 dark:text-slate-400">Cancelled</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
            {bookings.filter(b => b.status === 'CANCELLED').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          My Bookings
        </h1>
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="all">All Bookings</option>
            <option value="confirmed">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Bookings Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBookings.map((booking) => (
          <div
            key={booking.id}
            className="rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {booking.serviceName}
                  </h3>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    {booking.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                  {booking.notes}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                  <BuildingStorefrontIcon className="mr-2 h-5 w-5 flex-shrink-0" />
                  {booking.provider.name}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                  <MapPinIcon className="mr-2 h-5 w-5 flex-shrink-0" />
                  {booking.provider.location}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                  <PhoneIcon className="mr-2 h-5 w-5 flex-shrink-0" />
                  {booking.provider.phone}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                  <CalendarIcon className="mr-2 h-5 w-5 flex-shrink-0" />
                  {booking.date}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                  <ClockIcon className="mr-2 h-5 w-5 flex-shrink-0" />
                  {booking.time}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-slate-700">
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  {formatCurrency(booking.price)}
                </span>
                {booking.status === 'COMPLETED' && (
                  <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                    Leave Review
                  </button>
                )}
                {booking.status === 'CONFIRMED' && (
                  <button className="rounded-lg border border-red-600 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-900/20">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
          <p className="text-gray-500 dark:text-slate-400">No bookings found</p>
        </div>
      )}
    </div>
  );
};

export default Bookings;