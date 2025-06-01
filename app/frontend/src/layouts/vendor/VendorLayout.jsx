import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  HomeIcon, 
  CalendarIcon, 
  UserCircleIcon,
  Cog8ToothIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  BuildingStorefrontIcon,
  ArrowRightOnRectangleIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
  StarIcon, // Added StarIcon for reviews
  WrenchScrewdriverIcon, // Added WrenchScrewdriverIcon for services
  ClockIcon, // Added ClockIcon for history
} from '@heroicons/react/24/outline';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/auth/AuthContext';

// Tooltip component for collapsed state
const Tooltip = ({ children, text }) => (
  <div className="group relative">
    {children}
    <div className="pointer-events-none absolute left-12 top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-slate-700">
      {text}
    </div>
  </div>
);

// New Confirmation Dialog component
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

// Updated navigation items for service provider
const navigation = [
  { name: 'Dashboard', href: '/vendor/dashboard', icon: HomeIcon },               // Overview - always first
  { name: 'Orders', href: '/vendor/orders', icon: ClipboardDocumentListIcon },    // Daily operations
  { name: 'Services', href: '/vendor/services', icon: WrenchScrewdriverIcon },    // Core business offering
  { name: 'Reviews', href: '/vendor/reviews', icon: StarIcon },                   // Customer reviews
  { name: 'History', href: '/vendor/history', icon: ClockIcon },                  // History
  { name: 'Statistics', href: '/vendor/statistics', icon: ChartBarIcon },         // Business insights
  { name: 'Business Profile', href: '/vendor/business', icon: BuildingStorefrontIcon }, // Business settings
  { name: 'My Profile', href: '/vendor/profile', icon: UserCircleIcon },          // Personal settings - always last
];

const VendorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const { logout } = useAuth();

  // Mock vendor data (replace with actual data from your auth system)
  const [vendor] = useState({
    name: "John",
    surname: "Smith",
    businessName: "RepairLink",
    picUrl: "data:image/png;base64,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"
  });

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
    <ThemeProvider>
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
          className={`fixed inset-y-0 left-0 z-50 flex flex-col transform overflow-x-hidden border-r border-gray-200 bg-white transition-all duration-300 ease-in-out dark:border-slate-700 dark:bg-slate-800 
            lg:static lg:transition-[width,transform]
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            ${isDesktopCollapsed ? 'lg:w-16' : 'lg:w-52'} 
            lg:translate-x-0`}
        >
          {/* Vendor Profile Section */}
          <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-slate-700">
            {isDesktopCollapsed ? (
              <Tooltip text={vendor.businessName}>
                <div className="flex items-center">
                  <img
                    src={vendor.picUrl}
                    alt={vendor.businessName}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-500"
                  />
                </div>
              </Tooltip>
            ) : (
              <div className="flex items-center space-x-3">
                <img
                  src={vendor.picUrl}
                  alt={vendor.businessName}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-500"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 dark:text-slate-200">
                    {vendor.businessName}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-slate-400">
                    Service Provider
                  </span>
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

          {/* Logout button */}
          <div className="border-t border-gray-200 p-4 dark:border-slate-700">
            {isDesktopCollapsed ? (
              <Tooltip text="Logout">
                <button
                  onClick={handleLogoutClick}
                  className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-gray-100 hover:text-red-600 dark:hover:bg-slate-700 dark:hover:text-red-400"
                  disabled={isLoggingOut}
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                </button>
              </Tooltip>
            ) : (
              <button
                onClick={handleLogoutClick}
                className="flex h-10 w-full items-center rounded-lg px-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-red-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-red-400"
                disabled={isLoggingOut}
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span className="ml-3">Logout</span>
              </button>
            )}
          </div>
        </aside>

        {/* Collapse button */}
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

        {/* Theme toggle button */}
        <button
          onClick={toggleTheme}
          className={`fixed right-6 top-6 z-50 hidden rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition-all duration-300 hover:bg-gray-100 hover:text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white lg:block`}
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
                {vendor.businessName}
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
    </ThemeProvider>
  );
};

export default VendorLayout;