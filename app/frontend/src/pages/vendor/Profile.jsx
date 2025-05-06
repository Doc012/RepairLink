import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  KeyIcon,
  PhotoIcon,
  ShieldCheckIcon,
  PencilIcon,
  XMarkIcon,
  CheckIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  InformationCircleIcon,
  WrenchScrewdriverIcon,
  CheckBadgeIcon,
  ExclamationCircleIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import ChangePasswordForm from '../../components/shared/ChangePasswordForm';
import { useAuth } from '../../contexts/auth/AuthContext';
import { vendorAPI, userAPI } from '../../services';
import { toast } from 'react-hot-toast';
import apiClient from '../../utils/apiClient';

// Loading skeleton component for the profile page
const ProfileSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="flex justify-between items-center">
      <div className="h-8 w-32 bg-gray-200 rounded dark:bg-slate-700"></div>
      <div className="h-10 w-28 bg-gray-200 rounded dark:bg-slate-700 mr-20"></div>
    </div>

    <div className="grid md:grid-cols-3 gap-6">
      <div className="space-y-6">
        {/* Profile picture skeleton */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center dark:bg-gray-800 dark:border-gray-700">
          <div className="h-32 w-32 mx-auto rounded-full bg-gray-200 dark:bg-slate-700"></div>
          <div className="h-6 w-40 mx-auto mt-4 bg-gray-200 rounded dark:bg-slate-700"></div>
          <div className="h-4 w-24 mx-auto mt-2 bg-gray-200 rounded dark:bg-slate-700"></div>
          <div className="h-4 w-16 mx-auto mt-2 bg-gray-200 rounded dark:bg-slate-700"></div>
        </div>

        {/* Security section skeleton */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
          <div className="h-6 w-24 bg-gray-200 rounded dark:bg-slate-700"></div>
          <div className="h-10 w-full mt-4 bg-gray-200 rounded dark:bg-slate-700"></div>
        </div>
      </div>

      <div className="md:col-span-2">
        {/* Personal info skeleton */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
          <div className="h-6 w-48 bg-gray-200 rounded dark:bg-slate-700"></div>
          <div className="mt-6 space-y-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded dark:bg-slate-700"></div>
                <div className="h-10 w-full bg-gray-200 rounded dark:bg-slate-700"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const VendorProfile = () => {
  const { user, isAuthenticated } = useAuth();
  
  const [profile, setProfile] = useState({
    name: '',
    surname: '',
    email: '',
    phoneNumber: '',
    businessName: '',
    location: '',
    description: '',
    roles: [],
    userID: null,
    picUrl: "/src/assets/images/hero/repair-3.jpg",
    joinedDate: '',
    serviceCategory: '',
    businessPhone: '',
    businessEmail: '', // Add this field
    website: '',       // Add this field
    verified: false
  });
  
  const [editFormData, setEditFormData] = useState({
    name: '',
    surname: '',
    phoneNumber: '',
    businessName: '',
    location: '',
    description: '',
    serviceCategory: '',
    businessPhone: '',
    businessEmail: '', // Add this field
    website: ''        // Add this field
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('Your profile has been successfully updated.');
  const [businessInfoExpanded, setBusinessInfoExpanded] = useState(true);
  const [personalInfoExpanded, setPersonalInfoExpanded] = useState(true);

  // Format joined date
  const formatJoinedDate = (dateString) => {
    if (!dateString) return 'Joined recently';
    try {
      const date = new Date(dateString);
      return `Joined ${date.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      })}`;
    } catch (e) {
      return 'Joined recently';
    }
  };

  // Function to get user role for display purposes
  const getUserRole = () => {
    if (profile.roles && profile.roles.length > 0) {
      const role = profile.roles[0].authority || profile.roles[0];
      return role.replace('ROLE_', '');
    }
    return 'Service Provider';
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);
  
  // Fetch user profile data
const fetchProfile = async () => {
  try {
    setIsLoading(true);
    
    // Compare the email in auth context vs localStorage
    const authEmail = user?.email;
    let localStorageUser = null;
    
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        localStorageUser = JSON.parse(storedUser);
      }
    } catch (e) {
      // Silent error handling - no console.log
    }
    
    // Select the user data source - prioritize auth context when emails differ
    let userData = null;
    
    if (authEmail && localStorageUser?.email && authEmail !== localStorageUser.email) {
      // Use auth context as source of truth for email
      userData = { ...localStorageUser, email: authEmail };
    } else if (localStorageUser) {
      // Use localStorage when emails match or auth has no email
      userData = localStorageUser;
    } else if (user) {
      // Fall back to auth context if localStorage is empty
      userData = user;
    }
    
    // Check if we have valid user data
    if (!userData || (!userData.email && !userData.userID)) {
      toast.error("Unable to fetch your profile. Please log in again.");
      return;
    }
    
    // Fetch user information by email since that's what we just logged in with
    try {
      // First try to get user by email from the context
      if (userData.email) {
        const userResponse = await userAPI.getUserByEmail(userData.email);
        const userInfo = userResponse.data;
        
        // Now get vendor data using the correct user ID
        const correctUserID = userInfo.userID;
        
        if (!correctUserID) {
          throw new Error("Could not determine user ID");
        }
        
        // Get vendor-specific business info using the correct userID
        let vendorData = {};
        try {
          const vendorResponse = await vendorAPI.getProviderByUserId(correctUserID);
          vendorData = vendorResponse.data || {};
        } catch (vendorError) {
          // Silent error handling - no console.log
        }
        
        // Map the API data to profile state, combining user and vendor data
        const profileData = {
          name: userInfo.name || '',
          surname: userInfo.surname || '',
          email: userInfo.email || '',
          phoneNumber: userInfo.phoneNumber || '',
          userID: correctUserID,
          roles: userInfo.roleType ? [{ authority: `ROLE_${userInfo.roleType.roleType}` }] : [],
          picUrl: userInfo.picUrl || "/src/assets/images/hero/repair-3.jpg",
          joinedDate: userInfo.createdAt || '',
          
          // Vendor specific fields from business API
          businessName: vendorData.businessName || '',
          location: vendorData.location || '',
          description: vendorData.about || '', // API field is 'about'
          serviceCategory: vendorData.serviceCategory || '',
          businessPhone: vendorData.phoneNumber || '', // API field is 'phoneNumber'
          businessEmail: vendorData.businessEmail || '', // Map from API
          website: vendorData.website || '',             // Map from API
          verified: vendorData.verified || false,
          providerID: vendorData.providerID || null
        };
        
        // Update localStorage with the correct user information to prevent future issues
        const updatedLocalStorageUser = {
          ...localStorageUser,
          userID: correctUserID,
          email: userInfo.email,
          name: userInfo.name,
          surname: userInfo.surname,
          phoneNumber: userInfo.phoneNumber,
          roles: userInfo.roleType ? [{ authority: `ROLE_${userInfo.roleType.roleType}` }] : []
        };
        
        localStorage.setItem('user', JSON.stringify(updatedLocalStorageUser));
        
        setProfile(profileData);
        setEditFormData({
          name: profileData.name,
          surname: profileData.surname,
          phoneNumber: profileData.phoneNumber,
          businessName: profileData.businessName,
          location: profileData.location,
          description: profileData.description,
          serviceCategory: profileData.serviceCategory,
          businessPhone: profileData.businessPhone,
          businessEmail: profileData.businessEmail, // Add this field
          website: profileData.website              // Add this field
        });
      }
    } catch (apiError) {
      toast.error("Failed to fetch profile data.");
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
    // Ensure both sections are expanded when editing
    setBusinessInfoExpanded(true);
    setPersonalInfoExpanded(true);
  };

  // Cancel editing and revert changes
  const handleCancel = () => {
    setEditFormData({
      name: profile.name,
      surname: profile.surname,
      phoneNumber: profile.phoneNumber,
      businessName: profile.businessName,
      location: profile.location,
      description: profile.description,
      serviceCategory: profile.serviceCategory,
      businessPhone: profile.businessPhone,
      businessEmail: profile.businessEmail, // Add this field
      website: profile.website              // Add this field
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
    
    // Create basic user info update payload
    const userUpdateData = {
      name: editFormData.name,
      surname: editFormData.surname,
      phoneNumber: editFormData.phoneNumber,
    };
    
    // Create vendor-specific update payload mapping fields correctly
    const vendorUpdateData = {
      businessName: editFormData.businessName,
      serviceCategory: editFormData.serviceCategory,
      phoneNumber: editFormData.businessPhone,
      location: editFormData.location,
      about: editFormData.description,
      businessEmail: editFormData.businessEmail, // Add this field
      website: editFormData.website              // Add this field
    };
    
    // If we have a providerID, include it in the update payload
    if (profile.providerID) {
      vendorUpdateData.providerID = profile.providerID;
    }
    
    // Call API to update user profile
    try {
      if (typeof userAPI.updateProfile === 'function') {
        await userAPI.updateProfile(profile.userID, userUpdateData);
      } else if (typeof userAPI.updateUser === 'function') {
        await userAPI.updateUser(profile.userID, userUpdateData);
      }
    } catch (userUpdateError) {
      throw new Error("Failed to update user information");
    }
    
    // Call API to update vendor profile directly
    try {
      if (profile.providerID) {
        // Update existing provider
        if (typeof vendorAPI.updateProfile === 'function') {
          await vendorAPI.updateProfile(vendorUpdateData);
        } else if (typeof vendorAPI.updateProvider === 'function') {
          await vendorAPI.updateProvider(profile.providerID, vendorUpdateData);
        }
      } else {
        // Create new provider if it doesn't exist
        vendorUpdateData.userID = profile.userID;
        if (typeof vendorAPI.createProfile === 'function') {
          const response = await vendorAPI.createProfile(vendorUpdateData);
          setProfile(prev => ({ ...prev, providerID: response.data.providerID }));
        } else if (typeof vendorAPI.createProvider === 'function') {
          const response = await vendorAPI.createProvider(vendorUpdateData);
          setProfile(prev => ({ ...prev, providerID: response.data.providerID }));
        }
      }
    } catch (vendorUpdateError) {
      throw new Error("Failed to update business information");
    }
    
    // Update local state with the new data
    setProfile(prev => ({
      ...prev,
      name: editFormData.name,
      surname: editFormData.surname,
      phoneNumber: editFormData.phoneNumber,
      businessName: editFormData.businessName,
      location: editFormData.location,
      description: editFormData.description,
      serviceCategory: editFormData.serviceCategory,
      businessPhone: editFormData.businessPhone,
      businessEmail: editFormData.businessEmail, // Add this field
      website: editFormData.website              // Add this field
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
      const loadingToast = toast.loading('Uploading profile picture...');
      const response = await userAPI.uploadProfilePicture(file);
      toast.dismiss(loadingToast);
      
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
    return <ProfileSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Business Profile</h1>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="px-4 py-2 mr-8 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center transition-colors"
          >
            <PencilIcon className="w-4 h-4 mr-1" />
            Edit Profile
          </button>
        ) : (
          <div className="flex space-x-3 mr-20">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 flex items-center dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <XMarkIcon className="w-4 h-4 mr-1" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

      {/* Success message */}
      {updateSuccess && (
        <div className="bg-green-50 text-green-800 p-4 rounded-md flex items-start border border-green-200 animate-fade-in dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30">
          <CheckIcon className="h-5 w-5 mr-2 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error message */}
      {updateError && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md flex items-start border border-red-200 animate-fade-in dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30">
          <XMarkIcon className="h-5 w-5 mr-2 mt-0.5" />
          <span>{updateError}</span>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile picture column */}
        <div className="space-y-6">
          {/* Profile card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center dark:bg-gray-800 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="relative inline-block">
              {profile.picUrl ? (
                <img 
                  src={profile.picUrl} 
                  alt="Business Profile" 
                  className="h-32 w-32 mx-auto rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                />
              ) : (
                <div className="h-32 w-32 mx-auto rounded-full bg-gray-200 flex items-center justify-center dark:bg-gray-700">
                  <BuildingStorefrontIcon className="h-24 w-24 text-gray-400" />
                </div>
              )}
              
              <label 
                htmlFor="profile-picture" 
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-sm"
                title="Upload business logo"
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
              {profile.businessName || 'Your Business'}
            </h2>
            
            <p className="text-sm font-medium text-blue-600 mt-1 dark:text-blue-400">
              {profile.name} {profile.surname}
            </p>
            
            <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center mt-1 text-sm">
              <ShieldCheckIcon className="h-4 w-4 mr-1" />
              {getUserRole()}
            </p>

            <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
              {formatJoinedDate(profile.joinedDate)}
            </p>
          </div>

          {/* Security section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Security</h3>
            
            <button
              onClick={togglePasswordForm}
              className="flex items-center w-full px-4 py-2 border border-gray-300 text-left text-gray-700 rounded-md hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Change your account password"
            >
              <KeyIcon className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
              Change Password
            </button>
          </div>
        </div>

        {/* Profile details column */}
        <div className="md:col-span-2">
          {/* Personal Information Section */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6 dark:bg-gray-800 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div 
              className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
              onClick={() => !isEditing && setPersonalInfoExpanded(!personalInfoExpanded)}
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Personal Information</h3>
              {!isEditing && (
                <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 transition-transform ${personalInfoExpanded ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>
            
            {personalInfoExpanded && (
              <div className="p-6 space-y-4">
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
                    />
                  ) : (
                    <div className="flex items-center">
                      <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-900 dark:text-white">{profile.phoneNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Business Information Section */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div 
              className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
              onClick={() => !isEditing && setBusinessInfoExpanded(!businessInfoExpanded)}
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Business Information</h3>
              {!isEditing && (
                <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 transition-transform ${businessInfoExpanded ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>
            
            {businessInfoExpanded && (
              <div className="p-6 space-y-4">
                {/* Business Name */}
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Business Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      value={editFormData.businessName}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  ) : (
                    <div className="flex items-center">
                      <BuildingStorefrontIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-900 dark:text-white">{profile.businessName}</span>
                    </div>
                  )}
                </div>
                
                {/* Service Category */}
                <div>
                  <label htmlFor="serviceCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Service Category
                  </label>
                  {isEditing ? (
                    <select
                      id="serviceCategory"
                      name="serviceCategory"
                      value={editFormData.serviceCategory}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="">Select a category</option>
                      <option value="automotive">Automotive</option>
                      <option value="plumbing">Plumbing</option>
                      <option value="electrical">Electrical</option>
                      <option value="carpentry">Carpentry</option>
                      <option value="cleaning">Cleaning</option>
                      <option value="landscaping">Landscaping</option>
                    </select>
                  ) : (
                    <div className="flex items-center">
                      <WrenchScrewdriverIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-900 dark:text-white capitalize">{profile.serviceCategory || 'Not specified'}</span>
                    </div>
                  )}
                </div>
                
                {/* Business Phone */}
                <div>
                  <label htmlFor="businessPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Business Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      id="businessPhone"
                      name="businessPhone"
                      value={editFormData.businessPhone}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  ) : (
                    <div className="flex items-center">
                      <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-900 dark:text-white">{profile.businessPhone || profile.phoneNumber || 'Not specified'}</span>
                    </div>
                  )}
                </div>
                
                {/* Business Email */}
                <div>
                  <label htmlFor="businessEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Business Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      id="businessEmail"
                      name="businessEmail"
                      value={editFormData.businessEmail}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="business@example.com"
                    />
                  ) : (
                    <div className="flex items-center">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-900 dark:text-white">
                        {profile.businessEmail ? (
                          <a href={`mailto:${profile.businessEmail}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                            {profile.businessEmail}
                          </a>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400 italic">Not specified</span>
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Website */}
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Website
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={editFormData.website}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="https://www.example.com"
                    />
                  ) : (
                    <div className="flex items-center">
                      <GlobeAltIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-900 dark:text-white">
                        {profile.website ? (
                          <a 
                            href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {profile.website}
                          </a>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400 italic">Not specified</span>
                        )}
                      </span>
                    </div>
                  )}
                  {isEditing && (
                    <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                      Include http:// or https:// for external links
                    </p>
                  )}
                </div>
                
                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Business Address
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={editFormData.location}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="123 Main St, City, State, ZIP"
                    />
                  ) : (
                    <div className="flex items-center">
                      <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-900 dark:text-white">{profile.location || 'Not specified'}</span>
                    </div>
                  )}
                </div>
                
                {/* About (Description) */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    About Your Business
                  </label>
                  {isEditing ? (
                    <textarea
                      id="description"
                      name="description"
                      value={editFormData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Tell customers about your business services and specialties..."
                    />
                  ) : (
                    <div className="text-gray-900 dark:text-white">
                      {profile.description || (
                        <span className="text-gray-500 dark:text-gray-400 italic">
                          No business description provided. Click "Edit Profile" to add information about your business.
                        </span>
                      )}
                    </div>
                  )}
                  {isEditing && (
                    <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                      A good description helps customers understand what services you provide and your specialties.
                    </p>
                  )}
                </div>

                {/* Verification Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Verification Status
                  </label>
                  <div className={`flex items-center ${profile.verified ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {profile.verified ? (
                      <>
                        <CheckBadgeIcon className="h-5 w-5 mr-2" />
                        <span>Verified Business</span>
                      </>
                    ) : (
                      <>
                        <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                        <span>Pending Verification</span>
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">(Your business will be verified within 1-2 business days)</span>
                      </>
                    )}
                  </div>
                </div>
                
                {!isEditing && (
                  <div className="mt-4">
                    <Link
                      to="/vendor/business"
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <BuildingStorefrontIcon className="mr-1.5 h-4 w-4" />
                      Manage Business Services & Details
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Account Settings Info Box */}
          {!isEditing && !isChangingPassword && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-900/20 dark:border-blue-800/30">
              <div className="flex">
                <div className="flex-shrink-0">
                  <InformationCircleIcon className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    Keep your profile updated
                  </h3>
                  <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                    <p>
                      Customers trust service providers with complete profiles. Make sure your business information is accurate and up-to-date to build trust with potential clients.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Password change form modal */}
      {isChangingPassword && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              onClick={() => setIsChangingPassword(false)}
            ></div>

            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all dark:bg-gray-800 sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20 sm:mx-0 sm:h-10 sm:w-10">
                    <KeyIcon className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                      Change Password
                    </h3>
                    <div className="mt-2 w-full">
                      <ChangePasswordForm 
                        onSubmit={handlePasswordChange} 
                        onCancel={() => setIsChangingPassword(false)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorProfile;