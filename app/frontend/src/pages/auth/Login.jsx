import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EnvelopeIcon, KeyIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import AuthLayout from '../../layouts/auth/AuthLayout';
import FormInput from '../../components/auth/FormInput';
import Button from '../../components/common/Button';
import { useAuth } from '../../contexts/auth/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Use the login function from auth context
      const result = await login(formData.email, formData.password);

      if (result.success) {
        // Determine where to redirect based on user role
        if (result.data.roles && result.data.roles.some(role => 
            typeof role === 'string' ? role === 'ROLE_ADMIN' : role.authority === 'ROLE_ADMIN')) {
          console.log('Redirecting to admin dashboard');
          navigate('/admin/dashboard');
        } else if (result.data.roles && result.data.roles.some(role => 
            typeof role === 'string' ? role === 'ROLE_CUSTOMER' : role.authority === 'ROLE_CUSTOMER')) {
          console.log('Redirecting to customer dashboard');
          navigate('/user/dashboard');
        } else if (result.data.roles && result.data.roles.some(role => 
            typeof role === 'string' ? role === 'ROLE_VENDOR' : role.authority === 'ROLE_VENDOR')) {
          console.log('Redirecting to vendor dashboard');
          navigate('/vendor/dashboard');
        } else {
          console.log('No specific role found or unrecognized format, redirecting to home');
          navigate('/');
        }
      } else {
        // Display the error message from the login result
        setError(result.message);
        
        // Add focus to the password field if it's an authentication error
        if (result.message.includes('Invalid email or password')) {
          document.getElementById('password')?.focus();
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome back"
      subtitle={
        <>
          New to RepairLink?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
            Create an account
          </Link>
        </>
      }
    >
      {error && (
        <div className="mb-4 flex items-center p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
          <ExclamationCircleIcon className="flex-shrink-0 inline w-4 h-4 mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          icon={EnvelopeIcon}
          label="Email address"
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          placeholder="john@example.com"
        />

        <FormInput
          icon={KeyIcon}
          label="Password"
          id="password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
          placeholder="••••••••"
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600"
            />
            <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
              Remember me
            </span>
          </label>

          <Link
            to="/forgot-password"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full py-2.5"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Login;
