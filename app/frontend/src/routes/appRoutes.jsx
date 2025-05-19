import { createBrowserRouter } from 'react-router-dom';
import PublicLayout from '../layouts/public/PublicLayout';
import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Contact from '../pages/public/Contact';
import Services from '../pages/public/Services';
import Professionals from '../pages/public/Professionals';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ServiceDetail from '../components/public/services/ServiceDetail';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import CustomerLayout from '../layouts/customer/CustomerLayout';
import CustomerDashboard from '../pages/customer/Dashboard';
import CustomerBookings from '../pages/customer/Bookings';
import CustomerProfile from '../pages/customer/Profile';
import CustomerReviews from '../pages/customer/Reviews';
import CustomerServices from '../pages/customer/Services';
import CustomerProviders from '../pages/customer/Providers';
import VendorLayout from '../layouts/vendor/VendorLayout';
import VendorDashboard from '../pages/vendor/Dashboard';
import VendorServices from '../pages/vendor/Services';
import VendorBusiness from '../pages/vendor/Business';
import VendorOrders from '../pages/vendor/Orders';
import VendorProfile from '../pages/vendor/Profile';
import VendorStatistics from '../pages/vendor/Statistics';
import ProviderProfile from '../components/public/providers/ProviderProfile';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import ErrorPage from '../pages/errors/ErrorPage';

// Import admin components
import AdminLayout from '../layouts/admin/AdminLayout';
import AdminDashboard from '../pages/admin/Dashboard';
import AdminUsers from '../pages/admin/Users';
import AdminProviders from '../pages/admin/Providers';
import AdminServices from '../pages/admin/Services';
import AdminBookings from '../pages/admin/Bookings';
import AdminReports from '../pages/admin/Reports';
import AdminSettings from '../pages/admin/Settings';
import AdminProfile from '../pages/admin/Profile';

// Add import for the Reviews page
import VendorReviews from '../pages/vendor/Reviews';

// Add the import
import History from '../pages/customer/History';

// Add the import
import VendorHistory from '../pages/vendor/History';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'services',
        element: <Services />,
      },
      {
        path: 'services/:serviceId',
        element: <ServiceDetail />,
      },
      {
        path: 'professionals',
        element: <Professionals />,
      },
      {
        path: 'provider/:slug',
        element: <ProviderProfile />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'reset-password',
        element: <ResetPassword />,
      },
      {
        path: 'reset-password/:token',
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: '/user',
    element: <ProtectedRoute requiredRole="ROLE_CUSTOMER" />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <CustomerLayout />,
        children: [
          {
            path: 'dashboard',
            index: true,
            element: <CustomerDashboard />,
          },
          {
            path: 'bookings',
            element: <CustomerBookings />,
          },
          {
            path: 'services',
            element: <CustomerServices />,
          },
          {
            path: 'providers',
            element: <CustomerProviders />,
          },
          {
            path: 'profile',
            element: <CustomerProfile />,
          },
          {
            path: 'reviews',
            element: <CustomerReviews />,
          },
          // Inside the routes array, add this route in the customer routes section
          {
            path: "/user/history",
            element: <History />,
            // Change these to true to show the sidebar and layout elements
            hasNavbar: true,
            hasFooter: true
          },
        ],
      },
    ],
  },
  {
    path: '/vendor',
    element: <ProtectedRoute requiredRole="ROLE_VENDOR" />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <VendorLayout />,
        children: [
          {
            path: 'dashboard',
            index: true,
            element: <VendorDashboard />,
          },
          {
            path: 'services',
            element: <VendorServices />,
          },
          {
            path: 'business',
            element: <VendorBusiness />,
          },
          {
            path: 'orders',
            element: <VendorOrders />,
          },
          {
            path: 'reviews',        // Add this new route
            element: <VendorReviews />,
          },
          {
            path: 'profile',
            element: <VendorProfile />,
          },
          {
            path: 'statistics',
            element: <VendorStatistics />,
          },
          // Inside the routes array, add this route in the vendor routes section
          {
            path: "/vendor/history",
            element: <VendorHistory />,
            hasNavbar: true,
            hasFooter: true
          },
        ],
      },
    ],
  },
  // Add admin routes
  {
    path: '/admin',
    element: <ProtectedRoute requiredRole="ROLE_ADMIN" />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <AdminLayout />,
        children: [
          {
            path: '',
            element: <AdminDashboard />,  // Default route
          },
          {
            path: 'dashboard',
            element: <AdminDashboard />,
          },
          {
            path: 'users',
            element: <AdminUsers />,
          },
          {
            path: 'users/:userId',
            element: <AdminUsers />,  // Add user detail view when created
          },
          {
            path: 'providers',
            element: <AdminProviders />,
          },
          {
            path: 'providers/:providerId',
            element: <AdminProviders />,  // Add provider detail view when created
          },
          {
            path: 'services',
            element: <AdminServices />,
          },
          {
            path: 'services/:serviceId',
            element: <AdminServices />,  // Add service detail view when created
          },
          {
            path: 'bookings',
            element: <AdminBookings />,
          },
          {
            path: 'bookings/:bookingId',
            element: <AdminBookings />,  // Add booking detail view when created
          },
          {
            path: 'reports',
            element: <AdminReports />,
          },
          {
            path: 'settings',
            element: <AdminSettings />,
          },
          {
            path: 'profile',
            element: <AdminProfile />,
          },
        ],
      },
    ],
  },
  // Catch-all route for any non-matching paths
  {
    path: '*',
    element: <ErrorPage />,
  },
]);

export default router;