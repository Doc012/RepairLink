import { useState, useEffect } from 'react';
import { KeyIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const ChangePasswordForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0, // 0-4, where 0 is very weak and 4 is very strong
    feedback: ''
  });

  // Calculate password strength when password changes
  useEffect(() => {
    if (!formData.newPassword) {
      setPasswordStrength({ score: 0, feedback: '' });
      return;
    }
    
    // Evaluate password strength
    const strength = evaluatePasswordStrength(formData.newPassword);
    setPasswordStrength(strength);
  }, [formData.newPassword]);

  // Password strength evaluation function
  const evaluatePasswordStrength = (password) => {
    // Base score
    let score = 0;
    let feedback = '';
    
    if (!password) return { score, feedback: '' };
    
    // Length check
    if (password.length < 8) {
      feedback = 'Password is too short';
      return { score, feedback };
    } else if (password.length >= 12) {
      score += 2;
    } else if (password.length >= 8) {
      score += 1;
    }
    
    // Complexity checks
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    
    // Add scores based on complexity
    score += hasLower ? 1 : 0;
    score += hasUpper ? 1 : 0;
    score += hasDigit ? 1 : 0;
    score += hasSpecial ? 1 : 0;
    
    // Cap the score at 4
    score = Math.min(score, 4);
    
    // Generate feedback based on missing criteria
    if (score < 3) {
      const missing = [];
      if (!hasLower) missing.push('lowercase letters');
      if (!hasUpper) missing.push('uppercase letters');
      if (!hasDigit) missing.push('numbers');
      if (!hasSpecial) missing.push('special characters');
      
      if (missing.length > 0) {
        feedback = `Consider adding ${missing.join(', ')}`;
      }
    }
    
    return { score, feedback };
  };

  // Get color class for password strength visualization
  const getStrengthColorClass = (score) => {
    switch (score) {
      case 0: return 'bg-gray-200';
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  // Get text description for password strength
  const getStrengthText = (score) => {
    switch (score) {
      case 0: return '';
      case 1: return 'Very Weak';
      case 2: return 'Weak';
      case 3: return 'Moderate';
      case 4: return 'Strong';
      default: return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    } else if (passwordStrength.score < 2) { // Require at least a weak password
      newErrors.newPassword = 'Password is too weak. Make it stronger.';
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      setSubmitting(true);
      const result = await onSubmit(formData.currentPassword, formData.newPassword);
      
      // Check if result is a success object or error object
      if (result === true || (result && result.success !== false)) {
        // Reset form if successfully submitted
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else if (result && result.message) {
        // Display the error from the API
        setErrors(prev => ({
          ...prev,
          currentPassword: result.message
        }));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Current Password */}
      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Current Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <KeyIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={showCurrentPassword ? "text" : "password"}
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className={`block w-full pl-10 pr-10 py-2 rounded-md ${
              errors.currentPassword 
                ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
            }`}
          />
          <button 
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showCurrentPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        {errors.currentPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
        )}
      </div>
      
      {/* New Password */}
      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          New Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <KeyIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={showNewPassword ? "text" : "password"}
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className={`block w-full pl-10 pr-10 py-2 rounded-md ${
              errors.newPassword 
                ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
            }`}
          />
          <button 
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showNewPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        {errors.newPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
        )}

        {/* Password Strength Indicator */}
        {formData.newPassword && (
          <div className="mt-2">
            <div className="flex justify-between mb-1">
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Password strength: 
                <span className={`ml-1 font-medium ${
                  passwordStrength.score <= 1 ? 'text-red-600' : 
                  passwordStrength.score === 2 ? 'text-orange-600' : 
                  passwordStrength.score === 3 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {getStrengthText(passwordStrength.score)}
                </span>
              </div>
            </div>
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-1.5 rounded-full ${getStrengthColorClass(passwordStrength.score)}`} 
                style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
              ></div>
            </div>
            {passwordStrength.feedback && (
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                {passwordStrength.feedback}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Use at least 8 characters with a mix of uppercase, lowercase, numbers, and symbols.
            </p>
          </div>
        )}
      </div>
      
      {/* Confirm New Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Confirm New Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <KeyIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`block w-full pl-10 py-2 rounded-md ${
              errors.confirmPassword 
                ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
            }`}
          />
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting || passwordStrength.score < 2}
          className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {submitting ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;