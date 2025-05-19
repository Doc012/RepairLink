import { useState, useEffect, useRef, useMemo } from 'react';
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
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/auth/AuthContext';
import userAPI from '../../services/user/userAPI';

const Profile = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  const profileFormRef = useRef(null);
  const passwordFormRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
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

  // Update the useEffect that loads user data:
  useEffect(() => {
    // Function to load user data
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        if (user && user.email) {
          // First get the userId if we don't have it
          let userId = user.id;
          
          if (!userId) {
            const userResponse = await userAPI.getUserByEmail(user.email);
            if (userResponse.data && userResponse.data.userID) {
              userId = userResponse.data.userID;
              // Update user context with ID for future use
              if (updateProfile) {
                updateProfile({
                  ...user,
                  id: userId
                });
              }
            } else {
              throw new Error('Could not retrieve user information');
            }
          }
          
          // Now fetch complete user details
          const response = await userAPI.getUserById(userId);
          const userData = response.data;
          
          if (userData) {
            setProfileData({
              name: userData.name || '',
              surname: userData.surname || '',
              email: userData.email || user.email || '',
              // Use phoneNumber from API response
              phone: userData.phoneNumber || '',
              position: 'System Administrator',
              bio: userData.bio || 'Responsible for system administration and management of the RepairLink platform.',
              avatar: userData.picUrl || '/src/assets/images/avatar-placeholder.jpg'
            });
          }
        }
      } catch (err) {
        console.error('Failed to load user data:', err);
        setError('Failed to load user profile data. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [user, updateProfile]);

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
      // First, make sure we have a user email
      if (!user || !user.email) {
        throw new Error('User information is missing. Please try logging in again.');
      }
      
      // Get the user ID using the email if not already available
      let userId = user.id;
      
      if (!userId) {
        // Fetch user details by email
        const response = await userAPI.getUserByEmail(user.email);
        if (response.data && response.data.userID) {
          userId = response.data.userID;
        } else {
          throw new Error('Could not retrieve user information');
        }
      }
      
      if (!userId) {
        throw new Error('User ID could not be determined');
      }

      // Extract the basic info fields
      const basicInfoUpdate = {
        name: profileData.name,
        surname: profileData.surname,
        phoneNumber: profileData.phone
      };
      
      // Use the API method to update basic info with the correct user ID
      await userAPI.updateBasicInfo(userId, basicInfoUpdate);
      
      // Update the user context with the new information
      if (updateProfile) {
        updateProfile({
          ...user,
          id: userId,
          name: profileData.name,
          surname: profileData.surname,
          phoneNumber: profileData.phone
        });
      }
      
      // Exit edit mode after successful save
      setIsEditMode(false);
      
      // Use toast notification instead of setting success state
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('Failed to update profile:', err);
      // Show error as toast
      toast.error(err.response?.data?.message || err.message || 'Failed to update profile. Please try again.');
      // Still set error for inline display
      setError(err.response?.data?.message || err.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle password change submission
  const handleChangePassword = async (e) => {
    if (e) e.preventDefault();
    
    setIsSaving(true);
    setError('');
    setSuccess('');
    setPasswordErrors({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      form: ''
    });
    
    // Validate password
    const errors = {};
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    // Enhanced password validation
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else {
      const validations = [
        { check: passwordData.newPassword.length >= 8, message: 'Password must be at least 8 characters' },
        { check: /[A-Z]/.test(passwordData.newPassword), message: 'Password must include at least one uppercase letter' },
        { check: /[a-z]/.test(passwordData.newPassword), message: 'Password must include at least one lowercase letter' },
        { check: /[0-9]/.test(passwordData.newPassword), message: 'Password must include at least one number' },
      ];
      
      const failedValidations = validations.filter(v => !v.check);
      if (failedValidations.length > 0) {
        errors.newPassword = failedValidations[0].message; // Show first error
      }
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
      // Use the userAPI to change password
      await userAPI.changePassword(
        passwordData.currentPassword, 
        passwordData.newPassword
      );
      
      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Close the modal
      setIsPasswordModalOpen(false);
      
      // Show success message
      toast.success('Password changed successfully');
    } catch (err) {
      // Enhanced error handling without logging
      const errorResponse = err.response;
      const statusCode = errorResponse?.status;
      const errorData = errorResponse?.data;
      
      // Check for specific error responses from the backend
      if (statusCode === 400 && typeof errorData === 'string' && 
          errorData.includes('Current password is incorrect')) {
        
        setPasswordErrors({
          ...passwordErrors,
          currentPassword: 'Current password is incorrect',
          form: 'The password you entered is incorrect. Please try again.'
        });
      } else {
        // Other errors
        let errorMessage = 'Failed to change password. Please try again.';
        
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData?.message) {
          errorMessage = errorData.message;
        }
        
        setPasswordErrors({
          ...passwordErrors,
          form: errorMessage
        });
      }
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
            <div className="border-b border-slate-200 p-5 dark:border-slate-700 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Profile Information
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {isEditMode ? "Update your personal information" : "Your personal information"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditMode(!isEditMode)}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                  isEditMode 
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600" 
                    : "bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/30"
                }`}
              >
                {isEditMode ? "Cancel" : "Edit Profile"}
              </button>
            </div>
            <form ref={profileFormRef} onSubmit={handleSaveProfile}>
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
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-purple-400 dark:disabled:bg-slate-800"
                      disabled={!isEditMode || isLoading || isSaving}
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
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-purple-400 dark:disabled:bg-slate-800"
                      disabled={!isEditMode || isLoading || isSaving}
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
                      className="block w-full min-w-0 flex-1 rounded-none rounded-r-lg border border-slate-200 p-2.5 text-slate-900 disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:disabled:bg-slate-800"
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
                      className="block w-full min-w-0 flex-1 rounded-none rounded-r-lg border border-slate-200 p-2.5 text-slate-900 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-purple-400 dark:disabled:bg-slate-800"
                      disabled={!isEditMode || isLoading || isSaving}
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
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-purple-400 dark:disabled:bg-slate-800"
                    disabled={!isEditMode || isLoading || isSaving}
                  ></textarea>
                </div>
              </div>
              {isEditMode && (
                <div className="border-t border-slate-200 px-5 py-4 dark:border-slate-700">
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setIsEditMode(false)}
                      className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                    >
                      Cancel
                    </button>
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
                </div>
              )}
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
                    src="https://t4.ftcdn.net/jpg/02/27/45/09/360_F_227450952_KQCMShHPOPebUXklULsKsROk5AvN6H1H.jpg"
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
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-md font-medium text-slate-900 dark:text-white">Password</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Update your password to keep your account secure
                    </p>
                  </div>
                  <button
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="rounded-lg bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/30"
                  >
                    Change Password
                  </button>
                </div>

                <div className="mt-2 h-px bg-slate-200 dark:bg-slate-700"></div>
                  
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-md font-medium text-slate-900 dark:text-white">Two-Factor Authentication</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Add additional security with 2FA
                    </p>
                  </div>
                  <span className="bg-slate-100 text-slate-800 text-xs font-medium px-3 py-1 rounded-full dark:bg-slate-700 dark:text-slate-300">
                    Coming Soon
                  </span>
                </div>
              </div>
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

      {/* Password Change Modal */}
      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setPasswordErrors({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            form: ''
          });
          setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        }}
        onSubmit={handleChangePassword}
        isSaving={isSaving}
        passwordData={passwordData}
        passwordErrors={passwordErrors}
        handlePasswordChange={handlePasswordChange}
      />
    </div>
  );
};

// Add this password strength checking function
const checkPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };
  
  let score = 0;
  
  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  
  // Complexity checks
  if (/[A-Z]/.test(password)) score += 1; // Has uppercase
  if (/[a-z]/.test(password)) score += 1; // Has lowercase
  if (/[0-9]/.test(password)) score += 1; // Has number
  if (/[^A-Za-z0-9]/.test(password)) score += 1; // Has special character
  
  // Map score to strength label and color
  let label = '';
  let color = '';
  
  if (password.length < 1) {
    label = '';
    color = '';
  } else if (score < 3) {
    label = 'Weak';
    color = 'text-red-600 dark:text-red-400';
  } else if (score < 5) {
    label = 'Medium';
    color = 'text-yellow-600 dark:text-yellow-400';
  } else {
    label = 'Strong';
    color = 'text-green-600 dark:text-green-400';
  }
  
  return { score, label, color };
};

// Add this component at the end of your Profile.jsx file before the export

function PasswordChangeModal({ isOpen, onClose, onSubmit, isSaving, passwordData, passwordErrors, handlePasswordChange }) {
  const modalRef = useRef(null);
  
  // Calculate password strength
  const passwordStrength = useMemo(() => 
    checkPasswordStrength(passwordData.newPassword),
    [passwordData.newPassword]
  );
  
  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };
  
  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent scrolling of the body when modal is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Calculate progress width based on password strength score
  const strengthProgress = passwordData.newPassword ? `${(passwordStrength.score / 6) * 100}%` : '0%';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Background overlay - increased z-index and made sure it covers everything */}
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:block sm:p-0">
        {/* Center modal - adjusted positioning */}
        <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full dark:bg-slate-800 relative z-50">
          <div ref={modalRef} className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Modal content remains the same */}
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 sm:mx-0 sm:h-10 sm:w-10 dark:bg-purple-900/30">
                <LockClosedIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Change Password
                </h3>
                <div className="mt-4">
                  {/* Create a proper form element that will submit */}
                  <form onSubmit={handleFormSubmit}>
                    {/* Form error message */}
                    {passwordErrors.form && (
                      <div className="rounded-md bg-red-50 p-4 mb-4 dark:bg-red-900/30">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                              {passwordErrors.form}
                            </h3>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Current Password */}
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Current Password
                        </label>
                        <div className="relative mt-1">
                          <input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className={`block w-full rounded-md border ${
                              passwordErrors.currentPassword 
                                ? 'border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500' 
                                : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600'
                            } px-3 py-2 shadow-sm dark:bg-gray-700 dark:text-white sm:text-sm`}
                            aria-invalid={passwordErrors.currentPassword ? 'true' : 'false'}
                          />
                          {passwordErrors.currentPassword && (
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                              <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                            </div>
                          )}
                        </div>
                        {passwordErrors.currentPassword && (
                          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                            {passwordErrors.currentPassword}
                          </p>
                        )}
                      </div>

                      {/* New Password */}
                      <div>
                        <div className="flex items-center justify-between">
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            New Password
                          </label>
                          {passwordData.newPassword && (
                            <span className={`text-xs font-medium ${passwordStrength.color}`}>
                              {passwordStrength.label}
                            </span>
                          )}
                        </div>
                        <div className="mt-1">
                          <input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className={`block w-full rounded-md border ${
                              passwordErrors.newPassword ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                            } px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 dark:bg-gray-700 dark:text-white sm:text-sm`}
                          />
                          {passwordData.newPassword && (
                            <div className="mt-1 h-1 w-full bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                              <div 
                                className={`h-full ${
                                  passwordStrength.label === 'Weak' ? 'bg-red-500' : 
                                  passwordStrength.label === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: strengthProgress }}
                              ></div>
                            </div>
                          )}
                          {passwordErrors.newPassword && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{passwordErrors.newPassword}</p>
                          )}

                          {/* Password requirements */}
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Password requirements:</p>
                            <ul className="mt-1 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                              <li className="flex items-center">
                                <span className={`mr-1 text-xs ${passwordData.newPassword && passwordData.newPassword.length >= 8 ? 'text-green-500' : ''}`}>
                                  {passwordData.newPassword && passwordData.newPassword.length >= 8 ? '✓' : '•'}
                                </span>
                                At least 8 characters
                              </li>
                              <li className="flex items-center">
                                <span className={`mr-1 text-xs ${/[A-Z]/.test(passwordData.newPassword) ? 'text-green-500' : ''}`}>
                                  {/[A-Z]/.test(passwordData.newPassword) ? '✓' : '•'}
                                </span>
                                At least one uppercase letter
                              </li>
                              <li className="flex items-center">
                                <span className={`mr-1 text-xs ${/[a-z]/.test(passwordData.newPassword) ? 'text-green-500' : ''}`}>
                                  {/[a-z]/.test(passwordData.newPassword) ? '✓' : '•'}
                                </span>
                                At least one lowercase letter
                              </li>
                              <li className="flex items-center">
                                <span className={`mr-1 text-xs ${/[0-9]/.test(passwordData.newPassword) ? 'text-green-500' : ''}`}>
                                  {/[0-9]/.test(passwordData.newPassword) ? '✓' : '•'}
                                </span>
                                At least one number
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Confirm New Password
                        </label>
                        <div className="mt-1">
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className={`block w-full rounded-md border ${
                              passwordErrors.confirmPassword ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                            } px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 dark:bg-gray-700 dark:text-white sm:text-sm`}
                          />
                          {passwordErrors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{passwordErrors.confirmPassword}</p>
                          )}
                          {passwordData.confirmPassword && passwordData.newPassword === passwordData.confirmPassword && (
                            <p className="mt-1 text-sm text-green-600 dark:text-green-400">Passwords match</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Modal Actions */}
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:mt-0 sm:text-sm dark:bg-slate-600 dark:text-white dark:border-slate-500 dark:hover:bg-slate-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:text-sm disabled:opacity-70 dark:bg-purple-500 dark:hover:bg-purple-600"
                      >
                        {isSaving ? (
                          <span className="flex items-center">
                            <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />
                            Changing...
                          </span>
                        ) : 'Change Password'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;