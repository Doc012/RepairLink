import { useState } from 'react';
import { KeyIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import axios from 'axios';

const ChangePasswordForm = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Password strength indicator state
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    strength: 'weak'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user types
    if (error) setError('');
    if (success) setSuccess(false);
    
    // Check password strength if newPassword field changes
    if (name === 'newPassword') {
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
  
  // Get strength color for the progress bar
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

  const validateForm = () => {
    if (!formData.currentPassword) {
      setError('Current password is required');
      return false;
    }
    
    if (!formData.newPassword) {
      setError('New password is required');
      return false;
    }
    
    if (formData.newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return false;
    }
    
    if (!passwordStrength.hasUpperCase || !passwordStrength.hasLowerCase || !passwordStrength.hasNumber) {
      setError('Password must include uppercase, lowercase letters and numbers');
      return false;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return false;
    }
    
    if (formData.currentPassword === formData.newPassword) {
      setError('New password must be different from current password');
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
      const response = await axios.post(
        'http://localhost:8080/api/auth/change-password',
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        },
        {
          withCredentials: true
        }
      );
      
      console.log('Password change response:', response.data);
      setSuccess(true);
      
      // Reset form data
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Reset password strength
      setPasswordStrength({
        length: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        strength: 'weak'
      });
      
    } catch (error) {
      console.error('Failed to change password:', error);
      
      // Handle error response from API
      if (error.response?.data) {
        const errorMessage = error.response.data;
        if (typeof errorMessage === 'string') {
          if (errorMessage.includes('Current password is incorrect')) {
            setError('Your current password is incorrect');
          } else {
            setError(errorMessage.replace('Error changing password: ', ''));
          }
        } else {
          setError('Failed to change password. Please try again.');
        }
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4 border-t border-gray-200 pt-4 dark:border-slate-700">
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/10 dark:text-green-400"
        >
          <div className="flex items-center">
            <CheckCircleIcon className="mr-2 h-5 w-5 flex-shrink-0" />
            Password changed successfully!
          </div>
        </motion.div>
      )}
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/10 dark:text-red-400"
        >
          <div className="flex items-center">
            <ExclamationCircleIcon className="mr-2 h-5 w-5 flex-shrink-0" />
            {error}
          </div>
        </motion.div>
      )}
      
      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
          Current Password
        </label>
        <div className="mt-1">
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            required
            value={formData.currentPassword}
            onChange={handleChange}
            className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-blue-500"
            placeholder="••••••••"
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
          New Password
        </label>
        <div className="mt-1">
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            required
            value={formData.newPassword}
            onChange={handleChange}
            className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-blue-500"
            placeholder="••••••••"
            disabled={isLoading}
          />
        </div>
      </div>
      
      {/* Password strength indicator */}
      {formData.newPassword && (
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
      
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
          Confirm New Password
        </label>
        <div className="mt-1">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-blue-500"
            placeholder="••••••••"
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
        >
          {isLoading ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;