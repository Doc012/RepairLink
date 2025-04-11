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
import ProviderDetail from '../components/public/services/ProviderDetail';
import BookingForm from '../components/public/services/BookingForm';

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
        path: 'services/:serviceSlug',
        element: <ServiceDetail />,
      },
      {
        path: 'professionals',
        element: <Professionals />,
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
        path: 'providers/:providerId',
        element: <ProviderDetail />,
      },
      {
        path: 'book/provider/:providerId',
        element: <BookingForm />,
      },
    ],
  },
]);

export default router;