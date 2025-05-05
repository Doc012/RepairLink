import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  ArrowPathIcon, 
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  ExclamationCircleIcon,
  BuildingStorefrontIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import apiClient from '../../utils/apiClient';

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchProviders = async () => {
    setIsLoading(true);
    setError(null);
    setIsRefreshing(true);

    try {
      // In a real app, implement pagination, search, and filtering in the API call
      // const response = await apiClient.get('/v1/admin/service-providers', {
      //   params: {
      //     page: currentPage,
      //     search: searchQuery,
      //     status: filterStatus !== 'all' ? filterStatus : undefined
      //   }
      // });

      // For demo purposes, using mock data
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock data for providers
      const mockProviders = [
        { 
          id: 1, 
          businessName: 'Elite Plumbing Services', 
          ownerName: 'Robert Johnson',
          email: 'robert@eliteplumbing.com', 
          phone: '(011) 555-7890',
          category: 'Plumbing',
          location: 'Johannesburg, Gauteng',
          verified: true, 
          status: 'active',
          rating: 4.8,
          createdAt: '2024-12-15'
        },
        { 
          id: 2, 
          businessName: 'Swift Electrical Repairs', 
          ownerName: 'Sarah Williams',
          email: 'sarah@swiftelectrical.com', 
          phone: '(021) 555-1234',
          category: 'Electrical',
          location: 'Cape Town, Western Cape',
          verified: true, 
          status: 'active',
          rating: 4.6,
          createdAt: '2025-01-05' 
        },
        { 
          id: 3, 
          businessName: 'Modern Home Renovations', 
          ownerName: 'Michael Brown',
          email: 'michael@modernhome.com', 
          phone: '(031) 555-4567',
          category: 'Renovation',
          location: 'Durban, KwaZulu-Natal',
          verified: false, 
          status: 'pending',
          rating: null,
          createdAt: '2025-02-20'
        },
        { 
          id: 4, 
          businessName: 'Ace Locksmith', 
          ownerName: 'David Clark',
          email: 'david@acelocksmith.com', 
          phone: '(011) 555-8901',
          category: 'Security',
          location: 'Pretoria, Gauteng',
          verified: false, 
          status: 'pending',
          rating: null,
          createdAt: '2025-03-10'
        },
        { 
          id: 5, 
          businessName: 'Garden Masters', 
          ownerName: 'Emily Wilson',
          email: 'emily@gardenmasters.com', 
          phone: '(021) 555-2345',
          category: 'Landscaping',
          location: 'Stellenbosch, Western Cape',
          verified: true, 
          status: 'active',
          rating: 4.9,
          createdAt: '2024-11-25'
        },
        { 
          id: 6, 
          businessName: 'City Painters', 
          ownerName: 'Thomas Moore',
          email: 'thomas@citypainters.com', 
          phone: '(031) 555-6789',
          category: 'Painting',
          location: 'Pietermaritzburg, KwaZulu-Natal',
          verified: true, 
          status: 'inactive',
          rating: 3.7,
          createdAt: '2025-01-15'
        },
        { 
          id: 7, 
          businessName: 'FastFix Appliance Repair', 
          ownerName: 'Jessica Taylor',
          email: 'jessica@fastfix.com', 
          phone: '(011) 555-3456',
          category: 'Appliance Repair',
          location: 'Sandton, Gauteng',
          verified: false, 
          status: 'pending',
          rating: null,
          createdAt: '2025-04-02'
        }
      ];

      // Filter by status if needed
      let filteredProviders = mockProviders;
      if (filterStatus !== 'all') {
        filteredProviders = mockProviders.filter(provider => provider.status === filterStatus);
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredProviders = filteredProviders.filter(provider => 
          provider.businessName.toLowerCase().includes(query) || 
          provider.ownerName.toLowerCase().includes(query) ||
          provider.location.toLowerCase().includes(query)
        );
      }

      setProviders(filteredProviders);
      setTotalPages(Math.ceil(filteredProviders.length / 10) || 1);

    } catch (err) {
      console.error('Error fetching providers:', err);
      setError('Failed to load service providers. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [currentPage, filterStatus]); // Re-fetch when page or filter changes

  // Debounce search to prevent too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProviders();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleApproveProvider = (providerId) => {
    if (window.confirm('Are you sure you want to verify this provider?')) {
      console.log(`Approve provider with ID: ${providerId}`);
      // In a real app, implement approval API call and update state
    }
  };

  const handleRejectProvider = (providerId) => {
    if (window.confirm('Are you sure you want to reject this provider?')) {
      console.log(`Reject provider with ID: ${providerId}`);
      // In a real app, implement rejection API call and update state
    }
  };

  const handleViewProvider = (providerId) => {
    console.log(`View provider with ID: ${providerId}`);
    // In a real app, implement view functionality or redirect to details page
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Service Providers
        </h1>
        <div className="mt-4 flex items-center space-x-3 sm:mt-0">
          <span className="text-sm text-gray-500 dark:text-slate-400">
            {providers.filter(p => p.status === 'pending').length} pending verifications
          </span>
          <Link
            to="/admin/providers?filter=pending"
            className="inline-flex items-center rounded-lg bg-yellow-100 px-3 py-1.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
          >
            View pending
          </Link>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <div className="flex">
            <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-400">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative max-w-xs">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-md border-gray-300 pl-10 focus:border-purple-500 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white sm:text-sm"
            placeholder="Search providers"
          />
        </div>

        <div className="flex items-center space-x-4">
          <div>
            <label htmlFor="status-filter" className="sr-only">
              Filter by status
            </label>
            <div className="flex items-center">
              <FunnelIcon className="mr-2 h-5 w-5 text-gray-400" />
              <select
                id="status-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-md border-gray-300 text-base focus:border-purple-500 focus:outline-none focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => fetchProviders()}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
            disabled={isRefreshing}
          >
            <ArrowPathIcon className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Providers Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className="bg-gray-50 dark:bg-slate-800/60">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Business
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Owner
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-slate-700 dark:bg-slate-800">
              {isLoading ? (
                [...Array(5)].map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="h-4 w-32 rounded bg-gray-200 dark:bg-slate-700"></div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="h-4 w-24 rounded bg-gray-200 dark:bg-slate-700"></div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="h-4 w-16 rounded bg-gray-200 dark:bg-slate-700"></div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="h-4 w-24 rounded bg-gray-200 dark:bg-slate-700"></div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="h-4 w-16 rounded bg-gray-200 dark:bg-slate-700"></div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="ml-auto h-4 w-16 rounded bg-gray-200 dark:bg-slate-700"></div>
                    </td>
                  </tr>
                ))
              ) : providers.length > 0 ? (
                providers.map((provider) => (
                  <tr key={provider.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                            <BuildingStorefrontIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900 dark:text-white">{provider.businessName}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{provider.email}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{provider.phone}</div>
                        </div>
                        {provider.verified && (
                          <CheckBadgeIcon className="ml-2 h-5 w-5 text-blue-500" title="Verified Provider" />
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {provider.ownerName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                        {provider.category}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {provider.location}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(provider.status)}`}>
                        {provider.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewProvider(provider.id)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="View details"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        {provider.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApproveProvider(provider.id)}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                              title="Approve"
                            >
                              <CheckCircleIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleRejectProvider(provider.id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              title="Reject"
                            >
                              <XCircleIcon className="h-5 w-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No service providers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {providers.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">{1}</span> to{" "}
            <span className="font-medium">{providers.length}</span> of{" "}
            <span className="font-medium">{providers.length}</span> results
          </div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:ring-slate-700 dark:hover:bg-slate-700/30"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                  currentPage === idx + 1
                    ? 'z-10 bg-purple-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 dark:bg-purple-500'
                    : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-700/30'
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:ring-slate-700 dark:hover:bg-slate-700/30"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Providers;