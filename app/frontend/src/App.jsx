import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/auth/AuthContext';
import router from './routes/appRoutes';

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;