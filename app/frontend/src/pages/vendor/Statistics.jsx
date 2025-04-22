import { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  UserGroupIcon, 
  ArrowTrendingUpIcon, 
  StarIcon,
  CalendarDaysIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  BuildingStorefrontIcon,
  CheckIcon,
  XMarkIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/formatCurrency';
import ThemeToggle from '../../components/ThemeToggle';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import vendorAPI from '../../services/vendor/vendorAPI';
import userAPI from '../../services/auth/userAPI';
import { useAuth } from '../../contexts/auth/AuthContext';
import { useNavigate } from 'react-router-dom';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Business Setup Guide component for new vendors
const BusinessSetupGuide = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Business Statistics
        </h1>
      </div>

      <div className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white shadow-md dark:from-blue-700 dark:to-indigo-800">
        <div className="flex flex-col items-center sm:flex-row sm:justify-between">
          <div className="mb-4 flex items-center sm:mb-0">
            <BuildingStorefrontIcon className="h-10 w-10 text-blue-100" />
            <div className="ml-4">
              <h2 className="text-2xl font-bold">Set Up Your Business Profile</h2>
              <p className="text-blue-100">You need to create your business profile to view statistics</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/vendor/business')}
            className="rounded-lg bg-white px-4 py-2 font-medium text-blue-700 shadow-sm hover:bg-blue-50"
          >
            Create Business Profile
          </button>
        </div>
      </div>
      
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
          Why track your business statistics?
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <ChartBarIcon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Track your performance</h4>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Monitor revenue, bookings, and customer growth over time to understand your business trends.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <StarIcon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Monitor customer satisfaction</h4>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                View ratings and reviews to understand what customers love about your services and where you can improve.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <ArrowTrendingUpIcon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Make data-driven decisions</h4>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Identify your top-performing services and optimize your business strategy based on real customer data.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate('/vendor/business')}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <BuildingStorefrontIcon className="mr-2 h-5 w-5" />
            Create Your Business Profile
          </button>
        </div>
      </div>
      
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <div className="flex">
          <div className="flex-shrink-0">
            <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Once your business profile is created, you'll be able to track key metrics like revenue, ratings, bookings, and customer growth in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const ensureArray = (arr) => Array.isArray(arr) ? arr : [];
const safeValue = (value) => value !== undefined && value !== null ? value : 0;

// Chart options hook
const useChartOptions = () => {
  const [options, setOptions] = useState({});
  
  useEffect(() => {
    const updateOptions = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      const textColor = isDarkMode ? '#f3f4f6' : '#111827';
      const gridColor = isDarkMode ? 'rgba(107, 114, 128, 0.2)' : 'rgba(229, 231, 235, 0.8)';
      
      setOptions({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: textColor
            }
          },
          tooltip: {
            backgroundColor: isDarkMode ? '#374151' : '#ffffff',
            titleColor: isDarkMode ? '#f3f4f6' : '#111827',
            bodyColor: isDarkMode ? '#d1d5db' : '#374151',
            borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            ticks: {
              color: isDarkMode ? '#9ca3af' : '#6b7280'
            },
            grid: {
              display: false
            }
          },
          y: {
            ticks: {
              color: isDarkMode ? '#9ca3af' : '#6b7280'
            },
            grid: {
              color: gridColor
            }
          }
        }
      });
    };
    
    // Update initially
    updateOptions();
    
    // Watch for theme changes
    const observer = new MutationObserver(updateOptions);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);
  
  return options;
};

const Statistics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState('30');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState({
    totalRevenue: { amount: 0, percentageChange: 0, timeframe: 'last month' },
    customerRating: { average: 0, total: 0, timeframe: 'all time' },
    customerMetrics: { total: 0, new: 0, timeframe: 'this month' },
    businessGrowth: { rate: 0, timeframe: 'year over year' },
    monthlyData: [],
    recentBookings: [],
    topServices: [],
    reviewMetrics: { total: 0, average: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } }
  });
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: new Date()
  });
  const [chartKey, setChartKey] = useState(0);
  const [reviewChartData, setReviewChartData] = useState({});
  const [noBusinessProfile, setNoBusinessProfile] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      // Force a re-render when the theme changes
      setChartKey(prev => prev + 1); 
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchStatistics = async () => {
      if (!user) return;
      
      setLoading(true);
      setNoBusinessProfile(false);
      
      try {
        // Update the start date based on the timeframe
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(timeframe));
        setDateRange({ startDate, endDate: new Date() });
        
        // Fetch user details first
        console.log('Fetching user details for email:', user.email);
        const userResponse = await userAPI.getUserByEmail(user.email);
        const userData = userResponse.data;
        
        if (!userData) {
          throw new Error('User data not found');
        }
        
        // Log user data to verify it contains what you expect
        console.log('User data retrieved:', userData);
        
        // Next, get provider ID if the user is a service provider
        let providerId;
        
        if (userData.userID) {
          console.log('Getting provider details for user ID:', userData.userID);
          try {
            const providerResponse = await vendorAPI.getProviderByUserId(userData.userID);
            providerId = providerResponse.data.providerID;
            console.log('Provider ID found:', providerId);
          } catch (providerError) {
            console.error('Error fetching provider details:', providerError);
            
            // Check if error is specific to missing business profile
            if (providerError.response && 
                providerError.response.status === 500 && 
                providerError.response.data.message?.includes('ServiceProvider not found')) {
              setNoBusinessProfile(true);
              setLoading(false);
              return;
            } else {
              throw new Error('Failed to get provider details');
            }
          }
        } else {
          throw new Error('User ID not found in user data');
        }
        
        // Fetch statistics with the provider ID
        console.log('Fetching statistics for provider ID:', providerId);
        const stats = await vendorAPI.getProviderStatistics(providerId, {
          timeframe: parseInt(timeframe)
        });
        
        setMetrics(stats.data);
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setError(`Failed to load statistics: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStatistics();
  }, [user, timeframe]);

  // Update the reviewChartData in your useEffect
  useEffect(() => {
    if (metrics?.reviewMetrics) {
      // Review chart data - use more attractive colors
      setReviewChartData({
        labels: ['5★', '4★', '3★', '2★', '1★'],
        datasets: [{
          data: [
            metrics.reviewMetrics.distribution?.[5] || 0,
            metrics.reviewMetrics.distribution?.[4] || 0,
            metrics.reviewMetrics.distribution?.[3] || 0,
            metrics.reviewMetrics.distribution?.[2] || 0,
            metrics.reviewMetrics.distribution?.[1] || 0
          ],
          backgroundColor: [
            '#10b981', // green-500
            '#2dd4bf', // teal-400
            '#facc15', // yellow-400
            '#fb923c', // orange-400
            '#ef4444'  // red-500
          ],
          borderWidth: 0,
          hoverOffset: 4
        }]
      });
    }
  }, [metrics]);
  
  // Format data for charts
  const safeMonthlyData = ensureArray(metrics.monthlyData);

  const revenueChartData = {
    labels: safeMonthlyData.map(d => d?.month || ''),
    datasets: [
      {
        label: 'Monthly Revenue',
        data: safeMonthlyData.map(d => safeValue(d?.revenue)),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const bookingsChartData = {
    labels: safeMonthlyData.map(d => d?.month || ''),
    datasets: [
      {
        label: 'Total Bookings',
        data: safeMonthlyData.map(d => safeValue(d?.totalBookings)),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      },
      {
        label: 'Completed Bookings',
        data: safeMonthlyData.map(d => safeValue(d?.completedBookings)),
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1
      }
    ]
  };

  // Making review distribution data safer too
  const safeDistribution = metrics.reviewMetrics?.distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  // Group recent bookings by date
  const groupedBookings = metrics.recentBookings.reduce((acc, booking) => {
    const date = booking.bookingDate;
    if (!acc[date]) {
      acc[date] = { date, count: 0, revenue: 0 };
    }
    acc[date].count++;
    acc[date].revenue += booking.price;
    return acc;
  }, {});

  // Convert to array and sort by date
  const recentBookingSummary = Object.values(groupedBookings)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
    
  // Use the hook in your component
  const chartOptions = useChartOptions();

  // And for the doughnut chart
  const doughnutOptions = {
    ...chartOptions,
    cutout: '70%',
    plugins: {
      ...chartOptions.plugins,
      legend: {
        ...chartOptions.plugins?.legend,
        position: 'bottom'
      }
    }
  };

  // Render content based on loading/error/noBusinessProfile state
  const renderContent = () => {
    // If no business profile, show the setup guide
    if (noBusinessProfile) {
      return <BusinessSetupGuide />;
    }
  
    if (loading) {
      return (
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-blue-600 motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
            <p className="mt-4 text-gray-500 dark:text-gray-400">Loading statistics...</p>
          </div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block rounded-full bg-red-100 p-2 text-red-600 dark:bg-red-900/30 dark:text-red-400">
              <ChartBarIcon className="h-6 w-6" />
            </div>
            <p className="mb-2 text-lg font-medium text-red-600 dark:text-red-400">Failed to Load Statistics</p>
            <p className="text-gray-500 dark:text-gray-400">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
  
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Business Statistics
          </h1>
          <div className="flex items-center space-x-4 mr-8">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {dateRange.startDate && (
                <span>
                  {dateRange.startDate.toLocaleDateString('en-ZA')} - {dateRange.endDate.toLocaleDateString('en-ZA')}
                </span>
              )}
            </div>
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
          </div>
        </div>
  
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Total Revenue
                </p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(metrics.totalRevenue.amount)}
                </p>
                <div className={`mt-2 flex items-center text-sm ${
                  metrics.totalRevenue.percentageChange >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {metrics.totalRevenue.percentageChange >= 0 ? (
                    <ArrowUpIcon className="mr-1 h-4 w-4" />
                  ) : (
                    <ArrowDownIcon className="mr-1 h-4 w-4" />
                  )}
                  {Math.abs(metrics.totalRevenue.percentageChange)}% from {metrics.totalRevenue.timeframe}
                </div>
              </div>
              <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600 dark:text-green-500" />
              </div>
            </div>
          </div>
  
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Customer Rating
                </p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                  {metrics.customerRating.average.toFixed(1)}/5.0
                </p>
                <div className="mt-2 flex items-center text-amber-600 dark:text-amber-400">
                  <StarIcon className="mr-1 h-4 w-4" />
                  Based on {metrics.customerRating.total} reviews
                </div>
              </div>
              <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
                <StarIcon className="h-6 w-6 text-amber-600 dark:text-amber-500" />
              </div>
            </div>
          </div>
  
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Total Customers
                </p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                  {metrics.customerMetrics.total}
                </p>
                <div className="mt-2 flex items-center text-sm text-blue-600 dark:text-blue-400">
                  <ArrowUpIcon className="mr-1 h-4 w-4" />
                  {metrics.customerMetrics.new} new {metrics.customerMetrics.timeframe}
                </div>
              </div>
              <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                <UserGroupIcon className="h-6 w-6 text-blue-600 dark:text-blue-500" />
              </div>
            </div>
          </div>
  
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Business Growth
                </p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                  {metrics.businessGrowth.rate}%
                </p>
                <div className="mt-2 flex items-center text-sm text-purple-600 dark:text-purple-400">
                  <ArrowTrendingUpIcon className="mr-1 h-4 w-4" />
                  {metrics.businessGrowth.timeframe}
                </div>
              </div>
              <div className="rounded-lg bg-purple-50 p-3 dark:bg-purple-900/20">
                <ArrowTrendingUpIcon className="h-6 w-6 text-purple-600 dark:text-purple-500" />
              </div>
            </div>
          </div>
        </div>
  
        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Revenue Chart */}
          <div className="rounded-lg border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Revenue Trends
              </h2>
            </div>
            <div className="p-6">
              {safeMonthlyData.length > 0 ? (
                <div className="h-80">
                  <Line key={`revenue-chart-${chartKey}`} data={revenueChartData} options={chartOptions} />
                </div>
              ) : (
                <div className="flex h-80 items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700">
                      <CurrencyDollarIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                    </div>
                    <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No Revenue Data</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      No revenue data available for the selected timeframe.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
  
          {/* Bookings Chart */}
          <div className="rounded-lg border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Booking Analysis
              </h2>
            </div>
            <div className="p-6">
              <div className="h-80">
                <Bar key={`bookings-chart-${chartKey}`} data={bookingsChartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
  
        {/* Top Services & Reviews */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Top Services */}
          <div className="md:col-span-2 rounded-lg border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Top Performing Services
              </h2>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 text-left dark:border-slate-700">
                      <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-slate-400">Service</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-slate-400">Bookings</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-slate-400">Revenue</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-slate-400">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.topServices
                      ?.filter(service => service.bookings > 0 || service.revenue > 0) // Only show services with activity
                      .map((service, index) => (
                        <tr 
                          key={service.serviceID}
                          className={index === 0 ? 'bg-green-50 dark:bg-green-900/10' : ''}
                        >
                          <td className="border-t border-gray-200 px-4 py-3 dark:border-slate-700">
                            {service.serviceName}
                          </td>
                          <td className="border-t border-gray-200 px-4 py-3 text-center dark:border-slate-700">
                            {service.bookings}
                          </td>
                          <td className="border-t border-gray-200 px-4 py-3 text-center dark:border-slate-700">
                            {formatCurrency(service.revenue || 0)}
                          </td>
                          <td className="border-t border-gray-200 px-4 py-3 text-center dark:border-slate-700">
                            {service.averageRating > 0 ? (
                              <div className="flex items-center justify-center">
                                <span className="mr-1">{service.averageRating.toFixed(1)}</span>
                                <div className="flex text-yellow-400">
                                  {Array.from({ length: 5 }).map((_, i) => {
                                    // Star rendering logic
                                    let starClass = "text-gray-300 dark:text-gray-600";
                                    
                                    if (i < Math.floor(service.averageRating)) {
                                      starClass = "text-yellow-400";
                                    } else if (i < service.averageRating) {
                                      starClass = "text-yellow-400/70";
                                    }
                                    
                                    return (
                                      <StarIcon key={i} className={`h-4 w-4 ${starClass}`} />
                                    );
                                  })}
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500 dark:text-gray-400">No ratings</div>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
  
          {/* Reviews Distribution */}
          <div className="rounded-lg border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Customer Reviews
              </h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col items-center">
                {/* Rating circle and value */}
                <div className="relative mb-6 h-36 w-36">
                  <Doughnut 
                    key={`review-chart-${chartKey}`} 
                    data={reviewChartData} 
                    options={{
                      ...doughnutOptions,
                      cutout: '75%',
                      plugins: {
                        tooltip: { enabled: false },
                        legend: { display: false }
                      }
                    }} 
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {metrics.reviewMetrics?.average?.toFixed(1) || "0.0"}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">out of 5.0</span>
                  </div>
                </div>
                
                {/* Rating legend */}
                <div className="mb-4 grid w-full grid-cols-4 gap-2 text-center text-sm">
                  <div className="col-span-1">
                    <div className="mb-1 h-3 w-full rounded-full bg-green-500"></div>
                    <span>5 ★</span>
                  </div>
                  <div className="col-span-1">
                    <div className="mb-1 h-3 w-full rounded-full bg-teal-400"></div>
                    <span>4 ★</span>
                  </div>
                  <div className="col-span-1">
                    <div className="mb-1 h-3 w-full rounded-full bg-yellow-400"></div>
                    <span>3 ★</span>
                  </div>
                  <div className="col-span-1">
                    <div className="mb-1 h-3 w-full rounded-full bg-orange-400"></div>
                    <span>2 ★</span>
                  </div>
                </div>
                
                {/* Rating distribution */}
                <div className="mt-4 w-full space-y-3">
                  {[5, 4, 3, 2, 1].map(rating => {
                    const count = metrics.reviewMetrics?.distribution?.[rating] || 0;
                    const total = metrics.reviewMetrics?.total || 0;
                    const percentage = total > 0 ? (count / total) * 100 : 0;
                    
                    return (
                      <div key={rating} className="flex items-center gap-3">
                        <div className="w-8 text-sm font-medium text-gray-700 dark:text-gray-300">
                          {rating} ★
                        </div>
                        <div className="flex-1">
                          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                            <div 
                              className={`h-full rounded-full ${
                                rating === 5 ? 'bg-green-500' : 
                                rating === 4 ? 'bg-teal-400' : 
                                rating === 3 ? 'bg-yellow-400' : 
                                rating === 2 ? 'bg-orange-400' : 'bg-red-500'
                              }`} 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-12 text-right text-sm text-gray-600 dark:text-gray-400">
                          {count}
                        </div>
                        <div className="w-16 text-right text-sm text-gray-600 dark:text-gray-400">
                          {percentage.toFixed(0)}%
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {metrics.reviewMetrics?.total === 0 && (
                  <div className="mt-6 text-center text-gray-500 dark:text-gray-400">
                    No reviews yet. Customer reviews will appear here once you receive them.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
  
        {/* Recent Bookings */}
        <div className="rounded-lg border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Booking Activity
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
                    <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-slate-400">Avg. Per Booking</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookingSummary.map((booking, index) => (
                    <tr key={index} className="border-b border-gray-200 dark:border-slate-700">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                        <div className="flex items-center">
                          <CalendarDaysIcon className="mr-2 h-4 w-4 text-gray-400" />
                          {new Date(booking.date).toLocaleDateString('en-ZA')}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {booking.count}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(booking.revenue)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {formatCurrency(booking.revenue / booking.count)}
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

  // Don't use early returns - return the renderContent function instead
  return renderContent();
};

export default Statistics;