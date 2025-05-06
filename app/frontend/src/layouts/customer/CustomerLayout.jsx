import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  HomeIcon, 
  CalendarIcon, 
  UserCircleIcon, 
  StarIcon,
  Bars3Icon,
  XMarkIcon,
  BuildingStorefrontIcon,
  WrenchScrewdriverIcon,
  ArrowRightOnRectangleIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  SunIcon,
  MoonIcon,
  ClockIcon // Add ClockIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/auth/AuthContext'; // Import useAuth

// Add tooltip component for collapsed state
const Tooltip = ({ children, text }) => (
  <div className="group relative">
    {children}
    <div className="pointer-events-none absolute left-12 top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-slate-700">
      {text}
    </div>
  </div>
);

// Add Confirmation Dialog component
const ConfirmationDialog = ({ isOpen, title, message, onConfirm, onCancel, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" 
        onClick={onCancel}
      />
      
      {/* Dialog */}
      <div className="z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-slate-800">
        <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="mb-6 text-gray-600 dark:text-slate-300">
          {message}
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-70 dark:bg-red-700 dark:hover:bg-red-800"
          >
            {isLoading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Update the navigation array to include the History link
const navigation = [
  { name: 'Dashboard', href: '/user/dashboard', icon: HomeIcon },
  { name: 'My Bookings', href: '/user/bookings', icon: CalendarIcon },
  { name: 'Services', href: '/user/services', icon: WrenchScrewdriverIcon },
  { name: 'Service Providers', href: '/user/providers', icon: BuildingStorefrontIcon },
  { name: 'My History', href: '/user/history', icon: ClockIcon }, // Add this line
  { name: 'My Reviews', href: '/user/reviews', icon: StarIcon },
  { name: 'My Profile', href: '/user/profile', icon: UserCircleIcon },
];

const CustomerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Add state for logout in progress
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user: authUser } = useAuth(); // Get logout function and user from auth context

  const toggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains('dark')) {
      root.classList.remove('dark');
      setIsDark(false);
      localStorage.setItem('theme', 'light');
    } else {
      root.classList.add('dark');
      setIsDark(true);
      localStorage.setItem('theme', 'dark');
    }
  };

  // Add mock user data (replace with auth user data if available)
  const [user] = useState({
    name: authUser?.name || "John",
    surname: authUser?.surname || "Doe",
    picUrl: authUser?.picUrl || "/src/assets/images/hero/repair-3.jpg"
  });

  // New functions for logout confirmation
  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirmation(false);
  };

  const handleConfirmLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      setShowLogoutConfirmation(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setShowLogoutConfirmation(false);
      navigate('/login'); // Still redirect on error
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900">
      {/* Logout confirmation dialog */}
      <ConfirmationDialog
        isOpen={showLogoutConfirmation}
        title="Confirm Logout"
        message="Are you sure you want to log out of your account?"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
        isLoading={isLoggingOut}
      />
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 -mr-10 flex flex-col transform overflow-x-hidden border-r border-gray-200 bg-white transition-all duration-300 ease-in-out dark:border-slate-700 dark:bg-slate-800 
          lg:static lg:transition-[width,transform]
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          ${isDesktopCollapsed ? 'lg:w-16' : 'lg:w-52'} 
          lg:translate-x-0`}
      >
        {/* Logo and collapse button section */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-slate-700">
          {isDesktopCollapsed ? (
            <Tooltip text={`${user.name} ${user.surname}`}>
              <div className="flex items-center">
                <img
                  src={user.picUrl}
                  alt={`${user.name}'s profile`}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-500"
                />
              </div>
            </Tooltip>
          ) : (
            <div className="flex items-center space-x-3">
              <img
                src={user.picUrl}
                alt={`${user.name}'s profile`}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-500"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-slate-200">
                  {user.name} {user.surname}
                </span>
                <Link
                  to="/user/profile"
                  className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  View Profile
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-x-hidden p-4">
          {navigation.map((item) => (
            <div key={item.name} className="mb-1">
              {isDesktopCollapsed ? (
                <Tooltip text={item.name}>
                  <Link
                    to={item.href}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                      location.pathname === item.href
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                  </Link>
                </Tooltip>
              ) : (
                <Link
                  to={item.href}
                  className={`flex h-10 items-center rounded-lg px-3 transition-colors ${
                    location.pathname === item.href
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="ml-3 text-sm font-medium">{item.name}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Updated Logout button */}
        <div className="border-t border-gray-200 p-4 dark:border-slate-700">
          {isDesktopCollapsed ? (
            <Tooltip text="Logout">
              <button
                onClick={handleLogoutClick}
                disabled={isLoggingOut}
                className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors 
                  ${isLoggingOut 
                    ? 'cursor-not-allowed opacity-50' 
                    : 'hover:bg-gray-100 hover:text-red-600 dark:hover:bg-slate-700 dark:hover:text-red-400'}`}
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </Tooltip>
          ) : (
            <button
              onClick={handleLogoutClick}
              disabled={isLoggingOut}
              className={`flex h-10 w-full items-center rounded-lg px-3 text-sm font-medium text-gray-600 transition-colors 
                ${isLoggingOut 
                  ? 'cursor-not-allowed opacity-50' 
                  : 'hover:bg-gray-100 hover:text-red-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-red-400'}`}
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span className="ml-3">Logout</span>
            </button>
          )}
        </div>
      </aside>

      {/* Collapse button - Moved outside sidebar */}
      <button
        onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
        className={`fixed left-0 top-4 z-50 hidden rounded-r-lg border border-l-0 border-gray-200 bg-white p-1.5 text-gray-500 transition-all duration-300 hover:bg-gray-100 hover:text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white lg:block ${
          isDesktopCollapsed ? 'lg:left-16' : 'lg:left-52'
        }`}
        title={isDesktopCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {isDesktopCollapsed ? (
          <ChevronDoubleRightIcon className="h-5 w-5" />
        ) : (
          <ChevronDoubleLeftIcon className="h-5 w-5" />
        )}
      </button>

      {/* Desktop theme toggle button */}
      <button
        onClick={toggleTheme}
        className={`fixed right-10 top-6 z-50 hidden rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition-all duration-300 hover:bg-gray-100 hover:text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white lg:block`}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? (
          <SunIcon className="h-5 w-5" />
        ) : (
          <MoonIcon className="h-5 w-5" />
        )}
      </button>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600/75 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div 
        className={`flex flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out ${
          isDesktopCollapsed ? 'lg:ml-16' : 'lg:ml-52'
        }`}
      >
        {/* Mobile header */}
        <header className="sticky top-0 z-30 lg:hidden">
          <div className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-800">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              RepairLink
            </span>
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <SunIcon className="h-6 w-6" />
              ) : (
                <MoonIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;