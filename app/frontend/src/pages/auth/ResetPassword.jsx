import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { KeyIcon, CheckCircleIcon, ExclamationCircleIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import AuthLayout from '../../layouts/auth/AuthLayout';
import FormInput from '../../components/auth/FormInput';
import Button from '../../components/common/Button';
import axios from 'axios';

const ResetPassword = () => {
  const { token: tokenFromUrl } = useParams(); // Get token from URL path
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [tokenError, setTokenError] = useState(false);
  
  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    strength: 'weak'
  });

  // Set token from URL on component mount
  useEffect(() => {
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setTokenError(true);
    }
  }, [tokenFromUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (error) setError('');
    
    // Check password strength if password field changes
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };
  
  const checkPasswordStrength = (password) => {
    const strength = {
      length: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      strength: 'weak'
    };
    
    // Calculate password strength
    const checks = [strength.length, strength.hasUpperCase, strength.hasLowerCase, strength.hasNumber];
    const passedChecks = checks.filter(Boolean).length;
    
    if (passedChecks === 4) {
      strength.strength = 'strong';
    } else if (passedChecks >= 2) {
      strength.strength = 'medium';
    } else {
      strength.strength = 'weak';
    }
    
    setPasswordStrength(strength);
  };

  const validateForm = () => {
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      // Call API to reset password
      const response = await axios.post('http://13.60.59.231:8080/api/auth/reset-password', {
        token: token,
        newPassword: formData.password
      });
      
      console.log('Password reset successful:', response.data);
      setIsSubmitted(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Password reset failed:', error);
      
      // Handle different error scenarios
      if (error.response?.data) {
        setError(typeof error.response.data === 'string' ? 
          error.response.data : 
          'Invalid or expired token. Please request a new password reset.');
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Define strength colors
  const getStrengthColor = () => {
    switch (passwordStrength.strength) {
      case 'strong':
        return 'bg-green-500 dark:bg-green-500';
      case 'medium':
        return 'bg-yellow-500 dark:bg-yellow-500';
      default:
        return 'bg-red-500 dark:bg-red-500';
    }
  };

  // If token is missing or invalid
  if (tokenError) {
    return (
      <AuthLayout
        title="Invalid Reset Link"
        subtitle={
          <>
            Return to{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
              Sign in
            </Link>
          </>
        }
      >
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <ShieldExclamationIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>

          <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">
            Invalid Password Reset Link
          </h3>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            This password reset link is invalid or has expired.<br />
            Please request a new one.
          </p>

          <div className="mt-6">
            <Button variant="primary" to="/forgot-password" className="w-full">
              Request New Reset Link
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle={
        <>
          Remember your password?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
            Sign in
          </Link>
        </>
      }
    >
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Enter your new password below. Make sure it's at least 8 characters and includes a mix of uppercase, lowercase, and numbers.
              </div>

              <FormInput
                icon={KeyIcon}
                label="New Password"
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={isLoading}
              />
              
              {/* Password strength indicator */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      Password strength: 
                      <span className={`ml-1 font-semibold ${
                        passwordStrength.strength === 'strong' ? 'text-green-600 dark:text-green-400' : 
                        passwordStrength.strength === 'medium' ? 'text-yellow-600 dark:text-yellow-400' : 
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {passwordStrength.strength.charAt(0).toUpperCase() + passwordStrength.strength.slice(1)}
                      </span>
                    </span>
                  </div>
                  <div className="h-1 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                    <div 
                      className={`h-1 rounded-full transition-all duration-300 ${getStrengthColor()}`} 
                      style={{ 
                        width: passwordStrength.strength === 'strong' ? '100%' : 
                              passwordStrength.strength === 'medium' ? '66%' : '33%' 
                      }}
                    />
                  </div>
                  <ul className="grid gap-1 text-xs text-slate-600 dark:text-slate-400">
                    <li className={`flex items-center ${passwordStrength.length ? 'text-green-600 dark:text-green-400' : ''}`}>
                      <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${passwordStrength.length ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
                      At least 8 characters
                    </li>
                    <li className={`flex items-center ${passwordStrength.hasUpperCase ? 'text-green-600 dark:text-green-400' : ''}`}>
                      <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${passwordStrength.hasUpperCase ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
                      At least one uppercase letter
                    </li>
                    <li className={`flex items-center ${passwordStrength.hasLowerCase ? 'text-green-600 dark:text-green-400' : ''}`}>
                      <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${passwordStrength.hasLowerCase ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
                      At least one lowercase letter
                    </li>
                    <li className={`flex items-center ${passwordStrength.hasNumber ? 'text-green-600 dark:text-green-400' : ''}`}>
                      <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${passwordStrength.hasNumber ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
                      At least one number
                    </li>
                  </ul>
                </div>
              )}

              <FormInput
                icon={KeyIcon}
                label="Confirm New Password"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={isLoading}
              />

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400"
                >
                  <ExclamationCircleIcon className="mr-2 h-5 w-5 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>

            <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">
              Password Reset Successful
            </h3>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Your password has been reset successfully.<br />
              You will be redirected to the login page.
            </p>

            <div className="mt-6">
              <Button variant="primary" to="/login" className="w-full">
                Go to Login
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};

export default ResetPassword;