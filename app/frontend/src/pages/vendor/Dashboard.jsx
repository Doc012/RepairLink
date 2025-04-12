import { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/formatCurrency';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalEarnings: 0,
    pendingAppointments: 0,
    monthlyGrowth: 0
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    setStats({
      totalBookings: 156,
      totalEarnings: 12580.00,  // Now in ZAR
      pendingAppointments: 8,
      monthlyGrowth: 23.5
    });
  }, []);

  const cards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: UserGroupIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      darkBgColor: 'dark:bg-blue-900/20'
    },
    {
      title: 'Total Earnings',
      value: formatCurrency(stats.totalEarnings),
      icon: CurrencyDollarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      darkBgColor: 'dark:bg-green-900/20'
    },
    {
      title: 'Pending Appointments',
      value: stats.pendingAppointments,
      icon: ClockIcon,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      darkBgColor: 'dark:bg-amber-900/20'
    },
    {
      title: 'Monthly Growth',
      value: `${stats.monthlyGrowth}%`,
      icon: ChartBarIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      darkBgColor: 'dark:bg-purple-900/20'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Dashboard
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="rounded-lg border border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  {card.title}
                </p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                  {card.value}
                </p>
              </div>
              <div className={`rounded-lg ${card.bgColor} ${card.darkBgColor} p-3`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h2>
        </div>
        <div className="p-6">
          {/* Add your activity content here */}
          <p className="text-gray-500 dark:text-slate-400">
            Your recent activities will appear here.
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="rounded-lg border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Analytics Overview
          </h2>
        </div>
        <div className="p-6">
          {/* Add your chart component here */}
          <p className="text-gray-500 dark:text-slate-400">
            Analytics chart will be displayed here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;