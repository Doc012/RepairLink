import { useState } from 'react';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const Analytics = () => {
  const [metrics, setMetrics] = useState({
    totalRevenue: 45890,
    averageRating: 4.8,
    totalCustomers: 234,
    growthRate: 23.5,
    monthlyData: [
      { month: 'Jan', revenue: 3200 },
      { month: 'Feb', revenue: 3800 },
      { month: 'Mar', revenue: 4100 },
      { month: 'Apr', revenue: 4500 }
    ]
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Analytics
        </h1>
        <div className="flex space-x-2">
          <select className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
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
                ${metrics.totalRevenue}
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
                Average Rating
              </p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                {metrics.averageRating}
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
                Growth Rate
              </p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                {metrics.growthRate}%
              </p>
            </div>
            <div className="rounded-lg bg-purple-50 p-3 dark:bg-purple-900/20">
              <ArrowTrendingUpIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
            Revenue Overview
          </h2>
          <div className="h-80">
            {/* Add your chart component here */}
            <p className="text-gray-500 dark:text-slate-400">
              Revenue chart will be displayed here
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
            Customer Growth
          </h2>
          <div className="h-80">
            {/* Add your chart component here */}
            <p className="text-gray-500 dark:text-slate-400">
              Customer growth chart will be displayed here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;