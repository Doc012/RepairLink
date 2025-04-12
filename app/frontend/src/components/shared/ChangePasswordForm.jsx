import { useState } from 'react';
import { 
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

const ChangePasswordForm = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwords.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      // Add your API call here
      // const response = await api.post('/auth/change-password', passwords);
      setSuccess('Password successfully updated');
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg bg-green-50 p-4 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
          {success}
        </div>
      )}

      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
          Current Password
        </label>
        <div className="relative mt-1">
          <input
            type={showPasswords.current ? 'text' : 'password'}
            value={passwords.currentPassword}
            onChange={(e) => setPasswords(prev => ({
              ...prev,
              currentPassword: e.target.value
            }))}
            className="block w-full rounded-lg border border-gray-200 bg-white p-2.5 pr-10 text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('current')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300"
          >
            {showPasswords.current ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
          New Password
        </label>
        <div className="relative mt-1">
          <input
            type={showPasswords.new ? 'text' : 'password'}
            value={passwords.newPassword}
            onChange={(e) => setPasswords(prev => ({
              ...prev,
              newPassword: e.target.value
            }))}
            className="block w-full rounded-lg border border-gray-200 bg-white p-2.5 pr-10 text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('new')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300"
          >
            {showPasswords.new ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
          Confirm New Password
        </label>
        <div className="relative mt-1">
          <input
            type={showPasswords.confirm ? 'text' : 'password'}
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords(prev => ({
              ...prev,
              confirmPassword: e.target.value
            }))}
            className="block w-full rounded-lg border border-gray-200 bg-white p-2.5 pr-10 text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('confirm')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300"
          >
            {showPasswords.confirm ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        Update Password
      </button>
    </form>
  );
};

export default ChangePasswordForm;