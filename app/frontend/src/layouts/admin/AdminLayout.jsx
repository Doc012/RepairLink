import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  HomeIcon, 
  UserGroupIcon,
  BuildingStorefrontIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  ClipboardDocumentListIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
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

// Confirmation Dialog component
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

// Navigation items for admin
const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
  { name: 'Users', href: '/admin/users', icon: UserGroupIcon },
  { name: 'Service Providers', href: '/admin/providers', icon: BuildingStorefrontIcon },
  { name: 'Services', href: '/admin/services', icon: Cog6ToothIcon },
  { name: 'Reports', href: '/admin/reports', icon: ClipboardDocumentListIcon },
  { name: 'Settings', href: '/admin/settings', icon: ShieldCheckIcon },
  { name: 'My Profile', href: '/admin/profile', icon: UserCircleIcon },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const { logout, user: authUser } = useAuth();

  // Admin data (replace with actual data from your auth system)
  const [admin] = useState({
    name: authUser?.name || "Admin",
    surname: authUser?.surname || "User",
    picUrl: authUser?.picUrl || "/src/assets/images/avatar-placeholder.jpg"
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
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900">
      {/* Logout confirmation dialog */}
      <ConfirmationDialog
        isOpen={showLogoutConfirmation}
        title="Confirm Logout"
        message="Are you sure you want to log out of your admin account?"
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
        {/* Admin Profile Section */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-slate-700">
          {isDesktopCollapsed ? (
            <Tooltip text="Admin Dashboard">
              <div className="flex items-center">
                <img
                  src={admin.picUrl}
                  alt="Admin"
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-purple-500"
                />
              </div>
            </Tooltip>
          ) : (
            <div className="flex items-center space-x-3">
              <img
                src={admin.picUrl}
                alt="Admin"
                className="h-10 w-10 rounded-full object-cover ring-2 ring-purple-500"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-slate-200">
                  {admin.name} {admin.surname}
                </span>
                <span className="text-xs text-purple-600 dark:text-purple-400">
                  System Administrator
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
                        ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
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
                      ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
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
              Admin Dashboard
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

export default AdminLayout;