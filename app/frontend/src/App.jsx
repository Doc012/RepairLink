import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/auth/AuthContext';
import router from './routes/appRoutes';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
}

export default App;