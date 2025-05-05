import { useState, useEffect } from 'react';
import { 
  ArrowPathIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarDaysIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserIcon,
  UserGroupIcon,
  BuildingStorefrontIcon,
  WrenchScrewdriverIcon,
  ChartBarSquareIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsers: 0,
    userGrowth: 0,
    totalProviders: 0,
    verifiedProviders: 0,
    providerVerificationRate: 0,
    totalBookings: 0,
    completedBookings: 0,
    bookingCompletionRate: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    revenueGrowth: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [topProviders, setTopProviders] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // In a real application, you would fetch this data from your API
      // const response = await api.get('/admin/dashboard');
      // setStats(response.data.stats);
      // setRecentBookings(response.data.recentBookings);
      // setTopProviders(response.data.topProviders);
      // setActivityLog(response.data.activityLog);
      
      // For demonstration purposes, we'll populate with mock data
      setTimeout(() => {
        setStats({
          totalUsers: 1245,
          newUsers: 78,
          userGrowth: 12.5,
          totalProviders: 86,
          verifiedProviders: 72,
          providerVerificationRate: 83.7,
          totalBookings: 3567,
          completedBookings: 2980,
          bookingCompletionRate: 83.5,
          totalRevenue: 1245750,
          monthlyRevenue: 178450,
          revenueGrowth: 8.2,
        });
        
        setRecentBookings([
          { 
            id: 'B1001', 
            customer: 'John Smith', 
            provider: 'Elite Plumbing',
            service: 'Pipe Leak Repair', 
            date: '2025-05-02T10:30:00Z', 
            status: 'Completed',
            amount: 450
          },
          { 
            id: 'B1002', 
            customer: 'Sarah Johnson', 
            provider: 'ElectroPro',
            service: 'Circuit Inspection', 
            date: '2025-05-03T14:00:00Z', 
            status: 'Confirmed',
            amount: 350
          },
          { 
            id: 'B1003', 
            customer: 'Michael Brown', 
            provider: 'GardenMasters',
            service: 'Lawn Maintenance', 
            date: '2025-05-03T09:00:00Z', 
            status: 'Pending',
            amount: 280
          },
          { 
            id: 'B1004', 
            customer: 'Emma Davis', 
            provider: 'CleanSweep',
            service: 'Home Deep Cleaning', 
            date: '2025-05-04T11:30:00Z', 
            status: 'Completed',
            amount: 850
          },
          { 
            id: 'B1005', 
            customer: 'David Wilson', 
            provider: 'Quick Fix Appliances',
            service: 'Refrigerator Repair', 
            date: '2025-05-04T15:45:00Z', 
            status: 'In Progress',
            amount: 580
          },
        ]);
        
        setTopProviders([
          { 
            id: 1, 
            name: 'Elite Plumbing', 
            category: 'Plumbing',
            bookings: 124,
            rating: 4.8, 
            revenue: 64500,
            avatar: 'EP'
          },
          { 
            id: 2, 
            name: 'ElectroPro', 
            category: 'Electrical',
            bookings: 97,
            rating: 4.7, 
            revenue: 53200,
            avatar: 'EP'
          },
          { 
            id: 3, 
            name: 'GardenMasters', 
            category: 'Gardening',
            bookings: 86,
            rating: 4.9, 
            revenue: 42800,
            avatar: 'GM'
          },
          { 
            id: 4, 
            name: 'CleanSweep', 
            category: 'Cleaning',
            bookings: 72,
            rating: 4.6, 
            revenue: 38900,
            avatar: 'CS'
          },
          { 
            id: 5, 
            name: 'Quick Fix Appliances', 
            category: 'Appliance Repair',
            bookings: 65,
            rating: 4.5, 
            revenue: 32700,
            avatar: 'QF'
          },
        ]);
        
        setActivityLog([
          { 
            id: 1, 
            action: 'User Registration', 
            details: 'New user account created',
            user: 'peter.parker@example.com',
            timestamp: '2025-05-04T15:42:18Z'
          },
          { 
            id: 2, 
            action: 'Provider Verification', 
            details: 'Provider verified and approved',
            user: 'admin@repairlink.co.za',
            timestamp: '2025-05-04T14:30:45Z'
          },
          { 
            id: 3, 
            action: 'Booking Completed', 
            details: 'Service marked as completed',
            user: 'elite.plumbing@example.com',
            timestamp: '2025-05-04T13:15:22Z'
          },
          { 
            id: 4, 
            action: 'Payment Processed', 
            details: 'Payment of R580.00 processed',
            user: 'system',
            timestamp: '2025-05-04T12:58:36Z'
          },
          { 
            id: 5, 
            action: 'Review Submitted', 
            details: '5-star review for ElectroPro',
            user: 'sarah.johnson@example.com',
            timestamp: '2025-05-04T11:42:10Z'
          },
        ]);
        
        setIsLoading(false);
      }, 800);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
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
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  // Stat card component
  const StatCard = ({ title, value, icon: Icon, percentChange, isLoading }) => (
    <div className="rounded-lg border bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      {isLoading ? (
        <div className="animate-pulse space-y-3">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-md bg-slate-200 dark:bg-slate-700"></div>
            <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700"></div>
          </div>
          <div className="h-8 w-32 rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-700"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-purple-100 text-purple-500 dark:bg-purple-900/30 dark:text-purple-400">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</h3>
          </div>
          <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value}</div>
          {percentChange !== undefined && (
            <div className={`mt-1 flex items-center text-sm ${percentChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {percentChange >= 0 ? (
                <ArrowUpIcon className="mr-1 h-4 w-4" />
              ) : (
                <ArrowDownIcon className="mr-1 h-4 w-4" />
              )}
              <span>{Math.abs(percentChange)}% from last month</span>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
        <button
          onClick={fetchDashboardData}
          className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <ArrowPathIcon className="mr-2 h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers.toLocaleString()} 
          icon={UserGroupIcon} 
          percentChange={stats.userGrowth}
          isLoading={isLoading} 
        />
        <StatCard 
          title="Service Providers" 
          value={stats.totalProviders.toLocaleString()} 
          icon={BuildingStorefrontIcon} 
          isLoading={isLoading} 
        />
        <StatCard 
          title="Total Bookings" 
          value={stats.totalBookings.toLocaleString()} 
          icon={CalendarDaysIcon} 
          isLoading={isLoading} 
        />
        <StatCard 
          title="Monthly Revenue" 
          value={formatCurrency(stats.monthlyRevenue)} 
          icon={CurrencyDollarIcon} 
          percentChange={stats.revenueGrowth}
          isLoading={isLoading} 
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Recent Bookings */}
        <div className="col-span-2 rounded-lg border bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b border-slate-200 p-5 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Bookings</h3>
          </div>
          <div className="p-2">
            {isLoading ? (
              <div className="animate-pulse p-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="mb-4 flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700"></div>
                      <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                    <tr>
                      <th scope="col" className="whitespace-nowrap px-4 py-3">Booking ID</th>
                      <th scope="col" className="whitespace-nowrap px-4 py-3">Customer</th>
                      <th scope="col" className="whitespace-nowrap px-4 py-3">Provider</th>
                      <th scope="col" className="whitespace-nowrap px-4 py-3">Service</th>
                      <th scope="col" className="whitespace-nowrap px-4 py-3">Date</th>
                      <th scope="col" className="whitespace-nowrap px-4 py-3">Status</th>
                      <th scope="col" className="whitespace-nowrap px-4 py-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900 dark:text-white">
                          {booking.id}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900 dark:text-white">
                          {booking.customer}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900 dark:text-white">
                          {booking.provider}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900 dark:text-white">
                          {booking.service}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                          {formatDate(booking.date)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                          {formatCurrency(booking.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="border-t border-slate-200 px-5 py-4 dark:border-slate-700">
              <Link
                to="/admin/bookings"
                className="text-sm font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
              >
                View all bookings
              </Link>
            </div>
          </div>
        </div>

        {/* Top Providers */}
        <div className="rounded-lg border bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b border-slate-200 p-5 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Top Service Providers</h3>
          </div>
          <div className="p-5">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700"></div>
                      <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {topProviders.map((provider) => (
                  <div key={provider.id} className="flex items-center">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                      {provider.avatar}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-slate-900 dark:text-white">{provider.name}</h4>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{formatCurrency(provider.revenue)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                        <span>{provider.category} • {provider.bookings} bookings</span>
                        <div className="flex items-center">
                          <svg className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          <span className="ml-1">{provider.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="mt-6 pt-4">
                  <Link
                    to="/admin/providers"
                    className="text-sm font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
                  >
                    View all providers
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="border-b border-slate-200 p-5 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
        </div>
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {isLoading ? (
            <div className="animate-pulse p-5 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700"></div>
                    <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            activityLog.map((log) => (
              <div key={log.id} className="flex items-start p-5">
                <div className="mr-4 mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                  <ClockIcon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white">{log.action}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{log.details}</p>
                  <div className="mt-1 flex items-center text-xs text-slate-500 dark:text-slate-400">
                    <span>{log.user}</span>
                    <span className="mx-1">•</span>
                    <span>{formatDate(log.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;