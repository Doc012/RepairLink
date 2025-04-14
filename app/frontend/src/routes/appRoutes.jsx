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

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
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
    ],
  },
  {
    path: '/customer',
    element: <CustomerLayout />,
    children: [
      {
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
    ],
  },
  {
    path: '/vendor',
    element: <VendorLayout />,
    children: [
      {
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
        path: 'profile',
        element: <VendorProfile />,
      },
      {
        path: 'statistics',
        element: <VendorStatistics />,
      },
    ],
  },
]);

export default router;