import { useState, useEffect } from 'react';
import { 
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  KeyIcon,
  PhotoIcon,
  ShieldCheckIcon,
  PencilIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import ChangePasswordForm from '../../components/shared/ChangePasswordForm';
import { useAuth } from '../../contexts/auth/AuthContext';
import { customerAPI, userAPI } from '../../services';
import { toast } from 'react-hot-toast';

const CustomerProfile = () => {
  const { user } = useAuth();
  
  const [profile, setProfile] = useState({
    name: '',
    surname: '',
    email: '',
    phoneNumber: '',
    roles: [],
    userID: null,
    picUrl: "/src/assets/images/hero/repair-3.jpg"
  });
  
  const [editFormData, setEditFormData] = useState({
    name: '',
    surname: '',
    phoneNumber: '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('Your profile has been successfully updated.');

  // Function to get user role for display purposes
  const getUserRole = () => {
    if (profile.roles && profile.roles.length > 0) {
      const role = profile.roles[0].authority || profile.roles[0];
      return role.replace('ROLE_', '');
    }
    return 'User';
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);
  
  // Fetch user profile data
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      
      // Get email from auth context or localStorage
      const userEmail = user?.email || JSON.parse(localStorage.getItem('user'))?.email;
      
      if (!userEmail) {
        toast.error("Unable to fetch your profile. Please log in again.");
        return;
      }
      
      try {
        const response = await userAPI.getUserByEmail(userEmail);
        const userData = response.data;
        
        // Map the API data to profile state
        const profileData = {
          name: userData.name || '',
          surname: userData.surname || '',
          email: userData.email || '',
          phoneNumber: userData.phoneNumber || '',
          userID: userData.userID || null,
          roles: userData.roleType ? [{ authority: `ROLE_${userData.roleType.roleType}` }] : [],
          picUrl: userData.picUrl || "/src/assets/images/hero/repair-3.jpg"
        };
        
        setProfile(profileData);
        setEditFormData({
          name: profileData.name,
          surname: profileData.surname,
          phoneNumber: profileData.phoneNumber,
        });
      } catch (apiError) {
        toast.error("Failed to fetch profile data.");
        
        // Fall back to auth context data
        if (user) {
          const profileData = {
            name: user.name || '',
            surname: user.surname || '',
            email: user.email || '',
            phoneNumber: user.phoneNumber || '',
            roles: user.roles || [],
            picUrl: user.picUrl || "/src/assets/images/hero/repair-3.jpg"
          };
          
          setProfile(profileData);
          setEditFormData({
            name: profileData.name,
            surname: profileData.surname,
            phoneNumber: profileData.phoneNumber,
          });
        }
      }
    } catch (error) {
      toast.error("An error occurred while fetching your profile.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes during editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Begin editing profile
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Cancel editing and revert changes
  const handleCancel = () => {
    setEditFormData({
      name: profile.name,
      surname: profile.surname,
      phoneNumber: profile.phoneNumber
    });
    setIsEditing(false);
    setUpdateError('');
  };

  // Submit profile updates
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setUpdateError('');
      
      if (!profile.userID) {
        throw new Error("User ID not found");
      }
      
      // Validate form data
      if (!editFormData.name.trim()) {
        throw new Error("Name is required");
      }
      
      if (!editFormData.surname.trim()) {
        throw new Error("Surname is required");
      }
      
      if (!editFormData.phoneNumber.trim()) {
        throw new Error("Phone number is required");
      }
      
      // Create update payload
      const updateData = {
        name: editFormData.name,
        surname: editFormData.surname,
        phoneNumber: editFormData.phoneNumber,
      };
      
      // Call API to update profile
      const response = await userAPI.updateProfile(profile.userID, updateData);
      
      // Update local state with the new data
      setProfile(prev => ({
        ...prev,
        name: editFormData.name,
        surname: editFormData.surname,
        phoneNumber: editFormData.phoneNumber,
      }));
      
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setUpdateSuccess(true);
      toast.success('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
      
    } catch (error) {
      setUpdateError(error.response?.data?.message || error.message || "Failed to update profile");
      toast.error(error.response?.data?.message || error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle uploading a profile picture
  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image is too large. Maximum size is 5MB.');
      return;
    }

    // Check file type
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      toast.error('Only JPG, JPEG and PNG images are supported.');
      return;
    }

    try {
      toast.loading('Uploading profile picture...');
      const response = await userAPI.uploadProfilePicture(file);
      toast.dismiss();
      
      setProfile(prev => ({
        ...prev,
        picUrl: response.data.url
      }));
      
      toast.success('Profile picture updated successfully!');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to upload profile picture');
    }
  };

  // Toggle password change form visibility
  const togglePasswordForm = () => {
    setIsChangingPassword(prev => !prev);
  };

  // Handle password change submission
  const handlePasswordChange = async (currentPassword, newPassword) => {
    try {
      await userAPI.changePassword(currentPassword, newPassword);
      
      // Close the password change modal
      setIsChangingPassword(false);
      
      // Show success message using toast
      toast.success('Password changed successfully!');
      
      // Show a success notification in the UI
      setSuccessMessage('Your password has been changed successfully.');
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 5000); // Hide after 5 seconds
      
      return true;
    } catch (error) {
      // Extract the error message from the response
      let errorMessage = 'Failed to change password';
      
      if (error.response) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      }
      
      // Show error toast
      toast.error(errorMessage);
      
      // Return error object for the form to display
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="px-4 py-2 mr-20 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <PencilIcon className="w-4 h-4 mr-1" />
            Edit Profile
          </button>
        ) : (
          <div className="flex space-x-3 mr-20">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 flex items-center dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <XMarkIcon className="w-4 h-4 mr-1" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                <>
                  <CheckIcon className="w-4 h-4 mr-1" />
                  Save
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {updateSuccess && (
        <div className="bg-green-50 text-green-800 p-4 rounded-md flex items-start border border-green-200">
          <CheckIcon className="h-5 w-5 mr-2 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {updateError && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md flex items-start border border-red-200">
          <XMarkIcon className="h-5 w-5 mr-2 mt-0.5" />
          <span>{updateError}</span>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile picture column */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center dark:bg-gray-800 dark:border-gray-700">
            <div className="relative inline-block">
              {profile.picUrl ? (
                <img 
                  src={profile.picUrl} 
                  alt="Profile" 
                  className="h-32 w-32 mx-auto rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="h-32 w-32 mx-auto rounded-full bg-gray-200 flex items-center justify-center dark:bg-gray-700">
                  <UserCircleIcon className="h-24 w-24 text-gray-400" />
                </div>
              )}
              
              <label 
                htmlFor="profile-picture" 
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700"
              >
                <PhotoIcon className="h-5 w-5" />
                <input 
                  id="profile-picture" 
                  type="file" 
                  accept="image/jpeg,image/png,image/jpg" 
                  onChange={handleProfilePicUpload} 
                  className="sr-only"
                />
              </label>
            </div>
            
            <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              {profile.name} {profile.surname}
            </h2>
            
            <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center mt-1">
              <ShieldCheckIcon className="h-4 w-4 mr-1" />
              {getUserRole()}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Security</h3>
            
            <button
              onClick={togglePasswordForm}
              className="flex items-center w-full px-4 py-2 border border-gray-300 text-left text-gray-700 rounded-md hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <KeyIcon className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
              Change Password
            </button>
          </div>
        </div>

        {/* Profile details column */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Profile Information</h3>
            
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editFormData.name}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : (
                  <div className="flex items-center">
                    <UserCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-900 dark:text-white">{profile.name}</span>
                  </div>
                )}
              </div>
              
              {/* Surname */}
              <div>
                <label htmlFor="surname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    id="surname"
                    name="surname"
                    value={editFormData.surname}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : (
                  <div className="flex items-center">
                    <UserCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-900 dark:text-white">{profile.surname}</span>
                  </div>
                )}
              </div>
              
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-900 dark:text-white">{profile.email}</span>
                </div>
                {isEditing && (
                  <p className="text-xs text-gray-500 mt-1">Email address cannot be changed</p>
                )}
              </div>
              
              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={editFormData.phoneNumber}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="+27 12 345 6789"
                  />
                ) : (
                  <div className="flex items-center">
                    <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-900 dark:text-white">{profile.phoneNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password change form modal */}
      {isChangingPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 dark:bg-gray-800">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Change Password</h3>
            <ChangePasswordForm 
              onSubmit={handlePasswordChange}
              onCancel={() => setIsChangingPassword(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProfile;