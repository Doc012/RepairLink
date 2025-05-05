import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  ArrowPathIcon, 
  EyeIcon,
  TrashIcon, 
  PencilIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  ExclamationCircleIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import apiClient from '../../utils/apiClient';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, filterType]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      // In a real app, make API calls with pagination and filters
      // const response = await apiClient.get(`/admin/users?page=${currentPage}&type=${filterType}`);
      
      // For now, simulate with mock data
      setTimeout(() => {
        const mockUsers = getMockUsers();
        setUsers(mockUsers);
        setTotalPages(5); // Mock total pages
        setIsLoading(false);
      }, 800);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users. Please try again.');
      setIsLoading(false);
    }
  };

  // Mock user data for demonstration
  const getMockUsers = () => {
    const baseUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', type: 'Customer', status: 'Active', joinDate: '2023-01-15' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', type: 'Provider', status: 'Active', joinDate: '2023-02-20' },
      { id: 3, name: 'Robert Johnson', email: 'robert@example.com', type: 'Customer', status: 'Inactive', joinDate: '2023-03-05' },
      { id: 4, name: 'Emily Davis', email: 'emily@example.com', type: 'Provider', status: 'Active', joinDate: '2023-04-12' },
      { id: 5, name: 'Michael Wilson', email: 'michael@example.com', type: 'Customer', status: 'Active', joinDate: '2023-05-18' },
      { id: 6, name: 'Sarah Brown', email: 'sarah@example.com', type: 'Provider', status: 'Pending', joinDate: '2023-06-22' },
      { id: 7, name: 'David Taylor', email: 'david@example.com', type: 'Customer', status: 'Active', joinDate: '2023-07-30' },
      { id: 8, name: 'Lisa Anderson', email: 'lisa@example.com', type: 'Provider', status: 'Active', joinDate: '2023-08-14' },
      { id: 9, name: 'Thomas Martinez', email: 'thomas@example.com', type: 'Customer', status: 'Inactive', joinDate: '2023-09-05' },
      { id: 10, name: 'Jennifer Robinson', email: 'jennifer@example.com', type: 'Provider', status: 'Active', joinDate: '2023-10-10' },
    ];

    // Apply filter
    if (filterType !== 'all') {
      return baseUsers.filter(user => user.type.toLowerCase() === filterType.toLowerCase());
    }
    
    return baseUsers;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search logic here
    console.log('Searching for:', searchTerm);
    // In a real app, you would fetch filtered data from the server
    // For now, just simulate filtering
    if (searchTerm.trim()) {
      const filtered = getMockUsers().filter(
        user => 
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setUsers(filtered);
    } else {
      fetchUsers();
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // In a real app, this would trigger a new API call with the updated page
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      setIsDeleting(true);
      // In a real app, make an API call to delete the user
      // await apiClient.delete(`/admin/users/${userToDelete.id}`);
      
      // Simulate API call
      setTimeout(() => {
        // Remove the user from the state
        setUsers(users.filter(u => u.id !== userToDelete.id));
        setShowDeleteModal(false);
        setUserToDelete(null);
        setIsDeleting(false);
      }, 1000);
    } catch (err) {
      console.error('Failed to delete user:', err);
      setIsDeleting(false);
      // Handle error (show error message)
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Users</h1>
        <Link
          to="/admin/users/new"
          className="inline-flex items-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
        >
          <span>Add New User</span>
        </Link>
      </div>

      <div className="rounded-lg border bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        {/* Search and filter bar */}
        <div className="border-b border-slate-200 p-4 dark:border-slate-700">
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <form onSubmit={handleSearch} className="relative flex w-full max-w-md">
              <input
                type="text"
                placeholder="Search users..."
                className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-purple-400 dark:focus:ring-purple-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <button
                type="submit"
                className="ml-2 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
              >
                Search
              </button>
            </form>
            <div className="flex items-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
              >
                <FunnelIcon className="h-4 w-4" />
                <span>Filter</span>
              </button>
              <button
                onClick={fetchUsers}
                className="ml-2 rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                title="Refresh"
              >
                <ArrowPathIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 flex flex-wrap gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-700/50">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  User Type
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  <option value="all">All Users</option>
                  <option value="customer">Customers</option>
                  <option value="provider">Providers</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="m-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-400" role="alert">
            <div className="flex items-center">
              <ExclamationCircleIcon className="mr-2 h-5 w-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Users table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Joined
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-800">
              {isLoading ? (
                // Loading state
                [...Array(5)].map((_, index) => (
                  <tr key={index}>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700"></div>
                        <div className="ml-4">
                          <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
                          <div className="mt-1 h-3 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="h-6 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="h-6 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="h-8 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
                    </td>
                  </tr>
                ))
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                          <div className="flex h-full w-full items-center justify-center">
                            <UserGroupIcon className="h-5 w-5" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900 dark:text-white">
                            {user.name}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        user.type === 'Provider' 
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {user.type}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        user.status === 'Active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : user.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <Link
                          to={`/admin/users/${user.id}`}
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-purple-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-purple-400"
                          title="View details"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </Link>
                        <Link
                          to={`/admin/users/${user.id}/edit`}
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-purple-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-purple-400"
                          title="Edit"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-red-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-red-400"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-slate-500 dark:text-slate-400">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && users.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 dark:border-slate-700 sm:px-6">
            <div className="hidden sm:block">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{users.length}</span> of{' '}
                <span className="font-medium">97</span> users
              </p>
            </div>
            <div className="flex flex-1 justify-between sm:justify-end">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
              >
                <ChevronLeftIcon className="mr-1 h-4 w-4" />
                Previous
              </button>
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
              >
                Next
                <ChevronRightIcon className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !isDeleting && setShowDeleteModal(false)}></div>
          <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-slate-800">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Confirm Delete</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Are you sure you want to delete the user <span className="font-medium">{userToDelete?.name}</span>? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUser}
                disabled={isDeleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;