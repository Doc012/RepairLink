import { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/formatCurrency';

const Statistics = () => {
  const [metrics, setMetrics] = useState({
    totalRevenue: 156890.00,
    averageRating: 4.7,
    totalCustomers: 342,
    growthRate: 18.5,
    monthlyData: [
      { month: 'Jan', revenue: 52000.00, customers: 45 },
      { month: 'Feb', revenue: 48000.00, customers: 38 },
      { month: 'Mar', revenue: 61000.00, customers: 52 },
      { month: 'Apr', revenue: 45890.00, customers: 41 },
      { month: 'May', revenue: 58400.00, customers: 48 },
      { month: 'Jun', revenue: 62500.00, customers: 55 }
    ],
    recentBookings: [
      { date: '2024-04-12', count: 8, revenue: 12400.00 },
      { date: '2024-04-11', count: 6, revenue: 9800.00 },
      { date: '2024-04-10', count: 7, revenue: 11200.00 },
      { date: '2024-04-09', count: 5, revenue: 8900.00 },
      { date: '2024-04-08', count: 9, revenue: 13600.00 }
    ]
  });

  const [timeframe, setTimeframe] = useState('30');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Business Statistics
        </h1>
        <div className="flex space-x-2">
          <select 
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">This year</option>
          </select>
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
                {formatCurrency(metrics.totalRevenue)}
              </p>
              <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                +12.5% from last month
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
                {metrics.averageRating}/5.0
              </p>
              <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                Based on 186 reviews
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
                {metrics.totalCustomers}
              </p>
              <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                +28 new this month
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
                {metrics.growthRate}%
              </p>
              <p className="mt-2 text-sm text-purple-600 dark:text-purple-400">
                Year over year
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
                {metrics.recentBookings.map((booking, index) => (
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