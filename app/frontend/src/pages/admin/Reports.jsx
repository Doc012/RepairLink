import { useState, useEffect } from 'react';
import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import apiClient from '../../utils/apiClient';

const Reports = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingsData, setBookingsData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    conversionRate: 0,
    averageRating: 0,
    topCategory: '',
    topLocation: '',
  });

  useEffect(() => {
    fetchReportData();
  }, [timeRange]);

  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      // In a real app, make API calls to get analytics data
      // const response = await apiClient.get(`/admin/analytics?timeRange=${timeRange}`);
      
      // For now, simulate with mock data
      setTimeout(() => {
        const mockData = getMockAnalyticsData();
        setBookingsData(mockData.bookingsData);
        setRevenueData(mockData.revenueData);
        setCategoryData(mockData.categoryData);
        setLocationData(mockData.locationData);
        setSummaryStats(mockData.summaryStats);
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Failed to fetch analytics data:', err);
      setError('Failed to load analytics data. Please try again.');
      setIsLoading(false);
    }
  };

  // Mock analytics data for demonstration
  const getMockAnalyticsData = () => {
    // Different data based on time range
    let bookings, revenue, summary;
    
    if (timeRange === 'week') {
      bookings = [
        { name: 'Mon', bookings: 12, completed: 10 },
        { name: 'Tue', bookings: 18, completed: 15 },
        { name: 'Wed', bookings: 15, completed: 12 },
        { name: 'Thu', bookings: 20, completed: 17 },
        { name: 'Fri', bookings: 25, completed: 22 },
        { name: 'Sat', bookings: 32, completed: 28 },
        { name: 'Sun', bookings: 16, completed: 14 },
      ];
      revenue = [
        { name: 'Mon', amount: 3500 },
        { name: 'Tue', amount: 4800 },
        { name: 'Wed', amount: 3900 },
        { name: 'Thu', amount: 5200 },
        { name: 'Fri', amount: 6400 },
        { name: 'Sat', amount: 8700 },
        { name: 'Sun', amount: 4200 },
      ];
      summary = {
        totalBookings: 138,
        totalRevenue: 36700,
        conversionRate: 85.5,
        averageRating: 4.7,
        topCategory: 'Plumbing',
        topLocation: 'Johannesburg',
      };
    } else if (timeRange === 'month') {
      bookings = [
        { name: 'Week 1', bookings: 82, completed: 68 },
        { name: 'Week 2', bookings: 97, completed: 84 },
        { name: 'Week 3', bookings: 103, completed: 91 },
        { name: 'Week 4', bookings: 115, completed: 102 },
      ];
      revenue = [
        { name: 'Week 1', amount: 21500 },
        { name: 'Week 2', amount: 26800 },
        { name: 'Week 3', amount: 29400 },
        { name: 'Week 4', amount: 34200 },
      ];
      summary = {
        totalBookings: 397,
        totalRevenue: 111900,
        conversionRate: 87.2,
        averageRating: 4.6,
        topCategory: 'Plumbing',
        topLocation: 'Johannesburg',
      };
    } else {
      bookings = [
        { name: 'Jan', bookings: 320, completed: 274 },
        { name: 'Feb', bookings: 342, completed: 295 },
        { name: 'Mar', bookings: 398, completed: 350 },
        { name: 'Apr', bookings: 427, completed: 383 },
        { name: 'May', bookings: 452, completed: 410 },
        { name: 'Jun', bookings: 518, completed: 475 },
      ];
      revenue = [
        { name: 'Jan', amount: 87500 },
        { name: 'Feb', amount: 94200 },
        { name: 'Mar', amount: 112600 },
        { name: 'Apr', amount: 124800 },
        { name: 'May', amount: 136500 },
        { name: 'Jun', amount: 168400 },
      ];
      summary = {
        totalBookings: 2457,
        totalRevenue: 724000,
        conversionRate: 89.3,
        averageRating: 4.5,
        topCategory: 'Plumbing',
        topLocation: 'Johannesburg',
      };
    }
    
    // Static category and location data
    const categories = [
      { name: 'Plumbing', value: 35 },
      { name: 'Electrical', value: 28 },
      { name: 'Cleaning', value: 18 },
      { name: 'Handyman', value: 12 },
      { name: 'Gardening', value: 7 },
    ];
    
    const locations = [
      { name: 'Johannesburg', value: 42 },
      { name: 'Cape Town', value: 28 },
      { name: 'Durban', value: 15 },
      { name: 'Pretoria', value: 10 },
      { name: 'Port Elizabeth', value: 5 },
    ];
    
    return {
      bookingsData: bookings,
      revenueData: revenue,
      categoryData: categories,
      locationData: locations,
      summaryStats: summary,
    };
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Colors for charts
  const COLORS = ['#8B5CF6', '#6366F1', '#3B82F6', '#10B981', '#F59E0B', '#EC4899'];

  // Summary card component
  const SummaryCard = ({ title, value, icon: Icon, className }) => (
    <div className={`rounded-lg border bg-white p-5 dark:border-slate-700 dark:bg-slate-800 ${className || ''}`}>
      {isLoading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-8 w-1/3 rounded bg-slate-200 dark:bg-slate-700"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-purple-500 dark:text-purple-400" />
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</h3>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports & Analytics</h1>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1.5 text-sm font-medium ${
                timeRange === 'week'
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1.5 text-sm font-medium ${
                timeRange === 'month'
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-3 py-1.5 text-sm font-medium ${
                timeRange === 'year'
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50'
              }`}
            >
              Year
            </button>
          </div>
          
          <button
            onClick={() => fetchReportData()}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700/50"
          >
            <ArrowPathIcon className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          
          <button
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700/50"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-400" role="alert">
          <div className="flex items-center">
            <ExclamationCircleIcon className="mr-2 h-5 w-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <SummaryCard 
          title="Total Bookings" 
          value={isLoading ? "-" : summaryStats.totalBookings} 
          icon={CalendarIcon} 
        />
        <SummaryCard 
          title="Total Revenue" 
          value={isLoading ? "-" : formatCurrency(summaryStats.totalRevenue)} 
          icon={CalendarIcon} 
        />
        <SummaryCard 
          title="Conversion Rate" 
          value={isLoading ? "-" : `${summaryStats.conversionRate}%`} 
          icon={CalendarIcon} 
        />
        <SummaryCard 
          title="Average Rating" 
          value={isLoading ? "-" : summaryStats.averageRating} 
          icon={CalendarIcon} 
        />
        <SummaryCard 
          title="Top Category" 
          value={isLoading ? "-" : summaryStats.topCategory} 
          icon={CalendarIcon} 
        />
        <SummaryCard 
          title="Top Location" 
          value={isLoading ? "-" : summaryStats.topLocation} 
          icon={CalendarIcon} 
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Bookings Chart */}
        <div className="rounded-lg border bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Booking Performance</h3>
          {isLoading ? (
            <div className="flex h-64 animate-pulse items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
              <CalendarIcon className="h-10 w-10 text-slate-400 dark:text-slate-500" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={bookingsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" name="Total Bookings" fill="#8B5CF6" />
                <Bar dataKey="completed" name="Completed" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Revenue Chart */}
        <div className="rounded-lg border bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Revenue Trends</h3>
          {isLoading ? (
            <div className="flex h-64 animate-pulse items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
              <CalendarIcon className="h-10 w-10 text-slate-400 dark:text-slate-500" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={revenueData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis 
                  stroke="#94a3b8"
                  tickFormatter={(value) => `R${value/1000}k`} 
                />
                <Tooltip 
                  formatter={(value) => [`${formatCurrency(value)}`, 'Revenue']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  name="Revenue" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Category Distribution */}
        <div className="rounded-lg border bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Service Categories</h3>
          {isLoading ? (
            <div className="flex h-64 animate-pulse items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
              <CalendarIcon className="h-10 w-10 text-slate-400 dark:text-slate-500" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Location Distribution */}
        <div className="rounded-lg border bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Customer Locations</h3>
          {isLoading ? (
            <div className="flex h-64 animate-pulse items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
              <CalendarIcon className="h-10 w-10 text-slate-400 dark:text-slate-500" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={locationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {locationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;