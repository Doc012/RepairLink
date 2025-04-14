import { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/formatCurrency';
import ThemeToggle from '../../components/ThemeToggle';  // Update this import path

const Statistics = () => {
  // Mock data structure matching your database schema
  const [metrics, setMetrics] = useState({
    // Summary metrics
    totalRevenue: {
      amount: 15890.00,
      percentageChange: 12.5,
      timeframe: 'last month'
    },
    customerRating: {
      average: 4.7,
      total: 186,
      timeframe: 'all time'
    },
    customerMetrics: {
      total: 342,
      new: 28,
      timeframe: 'this month'
    },
    businessGrowth: {
      rate: 18.5,
      timeframe: 'year over year'
    },

    // Monthly data (based on bookings and services tables)
    monthlyData: [
      {
        month: 'Jan',
        revenue: 52000.00,
        completedBookings: 45,
        totalBookings: 52,
        averageServicePrice: 1155.56
      },
      {
        month: 'Feb',
        revenue: 48000.00,
        completedBookings: 38,
        totalBookings: 45,
        averageServicePrice: 1263.16
      },
      // ... more months
    ],

    // Recent bookings data (joins bookings, services, and customers tables)
    recentBookings: [
      {
        bookingID: 1,
        bookingDate: '2024-04-12',
        customerID: 123,
        customerName: 'John Doe',
        serviceID: 456,
        serviceName: 'Full Car Service',
        price: 3499.99,
        status: 'COMPLETED',
        rating: 5
      },
      {
        bookingID: 2,
        bookingDate: '2024-04-11',
        customerID: 124,
        customerName: 'Jane Smith',
        serviceID: 457,
        serviceName: 'Oil Change',
        price: 799.99,
        status: 'PENDING',
        rating: null
      },
      // ... more bookings
    ],

    // Service performance (from services and bookings tables)
    topServices: [
      {
        serviceID: 456,
        serviceName: 'Full Car Service',
        bookings: 45,
        revenue: 157499.55,
        averageRating: 4.8
      },
      // ... more services
    ],

    // Review metrics (from reviews table)
    reviewMetrics: {
      total: 186,
      average: 4.7,
      distribution: {
        5: 120,
        4: 45,
        3: 12,
        2: 6,
        1: 3
      }
    }
  });

  const [timeframe, setTimeframe] = useState('30');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Group recent bookings by date
  const groupedBookings = metrics.recentBookings.reduce((acc, booking) => {
    const date = booking.bookingDate;
    if (!acc[date]) {
      acc[date] = {
        date,
        count: 0,
        revenue: 0
      };
    }
    acc[date].count++;
    acc[date].revenue += booking.price;
    return acc;
  }, {});

  // Convert to array and sort by date
  const recentBookingSummary = Object.values(groupedBookings)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Business Statistics
        </h1>
        <div className="flex items-center space-x-4">
          {/* Timeframe Dropdown */}
          <select 
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">This year</option>
          </select>

          {/* Add divider */}
          <div className="h-6 w-px bg-gray-200 dark:bg-slate-700"></div>

          {/* Theme Toggle */}
          <div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                Total Revenue
              </p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                {formatCurrency(metrics.totalRevenue.amount)}
              </p>
              <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                +{metrics.totalRevenue.percentageChange}% from {metrics.totalRevenue.timeframe}
              </p>
            </div>
            <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                Customer Rating
              </p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                {metrics.customerRating.average}/5.0
              </p>
              <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                Based on {metrics.customerRating.total} reviews
              </p>
            </div>
            <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
              <StarIcon className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                Total Customers
              </p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                {metrics.customerMetrics.total}
              </p>
              <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                +{metrics.customerMetrics.new} new {metrics.customerMetrics.timeframe}
              </p>
            </div>
            <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                Business Growth
              </p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                {metrics.businessGrowth.rate}%
              </p>
              <p className="mt-2 text-sm text-purple-600 dark:text-purple-400">
                {metrics.businessGrowth.timeframe}
              </p>
            </div>
            <div className="rounded-lg bg-purple-50 p-3 dark:bg-purple-900/20">
              <ArrowTrendingUpIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="rounded-lg border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Bookings
          </h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 text-left dark:border-slate-700">
                  <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-slate-400">Date</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-slate-400">Bookings</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-slate-400">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {recentBookingSummary.map((booking, index) => (
                  <tr key={index} className="border-b border-gray-200 dark:border-slate-700">
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {new Date(booking.date).toLocaleDateString('en-ZA')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {booking.count} bookings
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {formatCurrency(booking.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;