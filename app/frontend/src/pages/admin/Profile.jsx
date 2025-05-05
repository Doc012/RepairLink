import { useState, useEffect } from 'react';
import { 
  UserCircleIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  CheckCircleIcon,
  ExclamationCircleIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  ArrowPathIcon,
  CameraIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/auth/AuthContext';

const Profile = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Profile data state
  const [profileData, setProfileData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    position: 'System Administrator',
    bio: '',
    avatar: ''
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Password form errors
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    form: ''
  });
  
  // Profile picture upload state
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Load profile data from auth context
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        surname: user.surname || '',
        email: user.email || '',
        phone: user.phone || '',
        position: 'System Administrator',
        bio: user.bio || 'Responsible for system administration and management of the RepairLink platform.',
        avatar: user.picUrl || '/src/assets/images/avatar-placeholder.jpg'
      });
      setIsLoading(false);
    }
  }, [user]);

  // Handle profile form change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle password form change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user types
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: '',
        form: ''
      }));
    }
  };

  // Handle avatar file selection
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile changes
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      // Create form data for profile update with avatar if present
      const formData = new FormData();
      formData.append('name', profileData.name);
      formData.append('surname', profileData.surname);
      formData.append('phone', profileData.phone);
      formData.append('bio', profileData.bio);
      
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      // In a real app, you would call the updateProfile function from your auth context
      // const response = await updateProfile(formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      if (avatarPreview) {
        setProfileData(prev => ({
          ...prev,
          avatar: avatarPreview
        }));
      }
      
      setSuccess('Profile updated successfully');
      setAvatarFile(null);
      
      // Clear success message after a few seconds
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle password change submission
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');
    
    // Validate password
    const errors = {};
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      setIsSaving(false);
      return;
    }

    try {
      // In a real app, call the updatePassword function from your auth context
      // await updatePassword(
      //   passwordData.currentPassword, 
      //   passwordData.newPassword
      // );
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Clear success message after a few seconds
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Failed to change password:', err);
      setPasswordErrors({
        ...passwordErrors,
        form: 'Current password is incorrect or an error occurred.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>
      </div>

      {success && (
        <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-400" role="alert">
          <div className="flex items-center">
            <CheckCircleIcon className="mr-2 h-5 w-5" />
            <span>{success}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-400" role="alert">
          <div className="flex items-center">
            <ExclamationCircleIcon className="mr-2 h-5 w-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-slate-200 p-5 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Profile Information
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Update your personal information
              </p>
            </div>
            <form onSubmit={handleSaveProfile}>
              <div className="p-5">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-purple-400 dark:focus:ring-purple-800"
                      disabled={isLoading || isSaving}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="surname" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="surname"
                      name="surname"
                      value={profileData.surname}
                      onChange={handleProfileChange}
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-purple-400 dark:focus:ring-purple-800"
                      disabled={isLoading || isSaving}
                      required
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 px-3 text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
                      <EnvelopeIcon className="h-4 w-4" />
                    </span>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      className="block w-full min-w-0 flex-1 rounded-none rounded-r-lg border border-slate-200 p-2.5 text-slate-900 disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      disabled={true}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Email address cannot be changed directly. Please contact system support.
                  </p>
                </div>

                <div className="mt-5">
                  <label htmlFor="phone" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Phone Number
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 px-3 text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
                      <PhoneIcon className="h-4 w-4" />
                    </span>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      className="block w-full min-w-0 flex-1 rounded-none rounded-r-lg border border-slate-200 p-2.5 text-slate-900 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-purple-400 dark:focus:ring-purple-800"
                      disabled={isLoading || isSaving}
                      placeholder="+27 11 123 4567"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label htmlFor="bio" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows="4"
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-purple-400 dark:focus:ring-purple-800"
                    disabled={isLoading || isSaving}
                  ></textarea>
                </div>
              </div>
              <div className="border-t border-slate-200 px-5 py-4 dark:border-slate-700">
                <button
                  type="submit"
                  className="rounded-lg bg-purple-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-70 dark:bg-purple-500 dark:hover:bg-purple-600 dark:focus:ring-purple-800"
                  disabled={isLoading || isSaving}
                >
                  {isSaving ? (
                    <>
                      <ArrowPathIcon className="mr-2 inline h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar with Photo and Security */}
        <div className="space-y-6">
          {/* Profile Photo */}
          <div className="rounded-lg border bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-slate-200 p-5 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Profile Photo
              </h3>
            </div>
            <div className="p-5">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <img
                    src={avatarPreview || profileData.avatar}
                    alt="Profile photo"
                    className="h-32 w-32 rounded-full object-cover ring-4 ring-purple-100 dark:ring-purple-900/30"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
                  >
                    <CameraIcon className="h-4 w-4" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      disabled={isSaving}
                    />
                  </label>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Click the camera icon to upload a new photo
                </p>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="rounded-lg border bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-slate-200 p-5 dark:border-slate-700">
              <h3 className="flex items-center text-lg font-semibold text-slate-900 dark:text-white">
                <ShieldCheckIcon className="mr-2 h-5 w-5 text-purple-600 dark:text-purple-400" />
                Security
              </h3>
            </div>
            <div className="p-5">
              <form onSubmit={handleChangePassword}>
                {passwordErrors.form && (
                  <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-400">
                    {passwordErrors.form}
                  </div>
                )}
                
                <div className="mb-4">
                  <label htmlFor="currentPassword" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Current Password
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 px-3 text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
                      <LockClosedIcon className="h-4 w-4" />
                    </span>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className={`block w-full min-w-0 flex-1 rounded-none rounded-r-lg border p-2.5 text-slate-900 focus:ring focus:ring-opacity-50 dark:text-white ${
                        passwordErrors.currentPassword
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:border-red-400 dark:focus:ring-red-800'
                          : 'border-slate-200 focus:border-purple-500 focus:ring-purple-200 dark:border-slate-600 dark:bg-slate-700 dark:focus:border-purple-400 dark:focus:ring-purple-800'
                      }`}
                      disabled={isSaving}
                    />
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {passwordErrors.currentPassword}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="newPassword" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={`w-full rounded-lg border p-2.5 text-slate-900 focus:ring focus:ring-opacity-50 dark:text-white ${
                      passwordErrors.newPassword
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:border-red-400 dark:focus:ring-red-800'
                        : 'border-slate-200 focus:border-purple-500 focus:ring-purple-200 dark:border-slate-600 dark:bg-slate-700 dark:focus:border-purple-400 dark:focus:ring-purple-800'
                    }`}
                    disabled={isSaving}
                  />
                  {passwordErrors.newPassword ? (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {passwordErrors.newPassword}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Password must be at least 8 characters
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`w-full rounded-lg border p-2.5 text-slate-900 focus:ring focus:ring-opacity-50 dark:text-white ${
                      passwordErrors.confirmPassword
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:border-red-400 dark:focus:ring-red-800'
                        : 'border-slate-200 focus:border-purple-500 focus:ring-purple-200 dark:border-slate-600 dark:bg-slate-700 dark:focus:border-purple-400 dark:focus:ring-purple-800'
                    }`}
                    disabled={isSaving}
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {passwordErrors.confirmPassword}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full rounded-lg bg-purple-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-70 dark:bg-purple-500 dark:hover:bg-purple-600 dark:focus:ring-purple-800"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <ArrowPathIcon className="mr-2 inline h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : 'Change Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="rounded-lg border bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="border-b border-slate-200 p-5 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Account Information
          </h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <h4 className="mb-2 text-sm font-medium uppercase text-slate-500 dark:text-slate-400">
                Role
              </h4>
              <div className="flex items-center">
                <ShieldCheckIcon className="mr-2 h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span className="text-lg font-medium text-slate-900 dark:text-white">
                  Administrator
                </span>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <h4 className="mb-2 text-sm font-medium uppercase text-slate-500 dark:text-slate-400">
                Position
              </h4>
              <p className="text-lg font-medium text-slate-900 dark:text-white">
                {profileData.position}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <h4 className="mb-2 text-sm font-medium uppercase text-slate-500 dark:text-slate-400">
                Account Status
              </h4>
              <div className="flex items-center">
                <span className="mr-2 h-2.5 w-2.5 rounded-full bg-green-500"></span>
                <span className="text-lg font-medium text-slate-900 dark:text-white">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;