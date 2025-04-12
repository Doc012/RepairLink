import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarDaysIcon,
  StarIcon,
  ClockIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  PhoneIcon,
  CalendarIcon,
  ChevronRightIcon,
  XCircleIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/formatCurrency';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 25,
    completedServices: 18,
    activeBookings: 3,
    averageRating: 4.8,
    totalSpent: 15499.99
  });

  const [recentBookings, setRecentBookings] = useState([
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
      price: 1299.99
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
      price: 899.99
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
      price: 749.99
    }
  ]);

  const [upcomingBookings, setUpcomingBookings] = useState([
    {
      id: 4,
      serviceName: "Garden Landscaping",
      provider: {
        name: "Garden Masters",
        location: "Morningside, Johannesburg",
        phone: "+27 11 567 8901"
      },
      date: "2024-04-20",
      time: "8:00 AM",
      status: "CONFIRMED",
      price: 1599.99
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
        return <CheckIcon className="mr-1.5 h-4 w-4" />;
      case 'CANCELLED':
        return <XCircleIcon className="mr-1.5 h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Welcome Back
        </h1>
        <Link
          to="/customer/services"
          className="mt-3 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 sm:mt-0"
        >
          Book New Service
          <ChevronRightIcon className="ml-1.5 h-4 w-4" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {/* Total Bookings */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                Total Bookings
              </p>
              <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.totalBookings}
              </p>
            </div>
            <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/20">
              <CalendarDaysIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Completed Services */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                Completed
              </p>
              <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.completedServices}
              </p>
            </div>
            <div className="rounded-lg bg-green-50 p-2 dark:bg-green-900/20">
              <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Active Bookings */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                Active
              </p>
              <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.activeBookings}
              </p>
            </div>
            <div className="rounded-lg bg-amber-50 p-2 dark:bg-amber-900/20">
              <ClockIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>

        {/* Average Rating */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                Rating
              </p>
              <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.averageRating}
                <span className="text-sm font-normal text-gray-500 dark:text-slate-400">/5</span>
              </p>
            </div>
            <div className="rounded-lg bg-yellow-50 p-2 dark:bg-yellow-900/20">
              <StarIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Total Spent */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                Total Spent
              </p>
              <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                {formatCurrency(stats.totalSpent)}
              </p>
            </div>
            <div className="rounded-lg bg-green-50 p-2 dark:bg-green-900/20">
              <CurrencyDollarIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div className="rounded-lg border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Upcoming Bookings
          </h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-slate-700">
          {upcomingBookings.map((booking) => (
            <div key={booking.id} className="p-6">
              <div className="sm:flex sm:items-center sm:justify-between">
                <div className="sm:flex sm:items-start sm:space-x-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {booking.serviceName}
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                        <CalendarIcon className="mr-1.5 h-5 w-5" />
                        {booking.date} at {booking.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                        <MapPinIcon className="mr-1.5 h-5 w-5" />
                        {booking.provider.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                        <PhoneIcon className="mr-1.5 h-5 w-5" />
                        {booking.provider.phone}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between sm:mt-0 sm:flex-col sm:items-end">
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {formatCurrency(booking.price)}
                  </p>
                  <div className="mt-2">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      {booking.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {upcomingBookings.length === 0 && (
            <div className="p-6 text-center text-gray-500 dark:text-slate-400">
              No upcoming bookings
            </div>
          )}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="rounded-lg border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Bookings
            </h2>
            <Link
              to="/customer/bookings"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View All
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-left dark:border-slate-700">
                <th className="whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-500 dark:text-slate-400">
                  Service
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-500 dark:text-slate-400">
                  Provider
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-500 dark:text-slate-400">
                  Date & Time
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-500 dark:text-slate-400">
                  Amount
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-500 dark:text-slate-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {recentBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {booking.serviceName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-slate-400">
                    {booking.provider.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-slate-400">
                    {booking.date} at {booking.time}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(booking.price)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;