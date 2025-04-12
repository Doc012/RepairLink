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
  MoonIcon
} from '@heroicons/react/24/outline';

// Add tooltip component for collapsed state
const Tooltip = ({ children, text }) => (
  <div className="group relative">
    {children}
    <div className="pointer-events-none absolute left-12 top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-slate-700">
      {text}
    </div>
  </div>
);

const navigation = [
  { name: 'Dashboard', href: '/customer', icon: HomeIcon },
  { name: 'My Bookings', href: '/customer/bookings', icon: CalendarIcon },
  { name: 'Services', href: '/customer/services', icon: WrenchScrewdriverIcon },
  { name: 'Service Providers', href: '/customer/providers', icon: BuildingStorefrontIcon },
  { name: 'My Reviews', href: '/customer/reviews', icon: StarIcon },
  { name: 'My Profile', href: '/customer/profile', icon: UserCircleIcon },
];

const CustomerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const location = useLocation();
  const navigate = useNavigate();

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

  // Add mock user data (replace with actual user data later)
  const [user] = useState({
    name: "John",
    surname: "Doe",
    picUrl: "/src/assets/images/hero/repair-3.jpg" // Replace with actual user profile pic
  });

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col transform overflow-x-hidden border-r border-gray-200 bg-white transition-all duration-300 ease-in-out dark:border-slate-700 dark:bg-slate-800 
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
                  to="/customer/profile"
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

        {/* Logout button */}
        <div className="border-t border-gray-200 p-4 dark:border-slate-700">
          {isDesktopCollapsed ? (
            <Tooltip text="Logout">
              <button
                onClick={handleLogout}
                className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-gray-100 hover:text-red-600 dark:hover:bg-slate-700 dark:hover:text-red-400"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </Tooltip>
          ) : (
            <button
              onClick={handleLogout}
              className="flex h-10 w-full items-center rounded-lg px-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-red-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-red-400"
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
        className={`fixed right-4 top-4 z-50 hidden rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition-all duration-300 hover:bg-gray-100 hover:text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white lg:block`}
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