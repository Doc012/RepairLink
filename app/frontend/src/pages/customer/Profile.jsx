import { useState, useEffect } from 'react';
import { 
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  KeyIcon,
  PhotoIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import ChangePasswordForm from '../../components/shared/ChangePasswordForm';
import { useAuth } from '../../contexts/auth/AuthContext';
import { customerAPI, userAPI } from '../../services'; // Import the API services instead of axios

const CustomerProfile = () => {
  const { user } = useAuth(); // Get user from auth context
  
  const [profile, setProfile] = useState({
    name: '',
    surname: '',
    email: '',
    phoneNumber: '',
    roles: [],
    picUrl: "/src/assets/images/hero/repair-3.jpg"
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    // Fetch user profile data
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        
        console.log("Auth context user data:", user);
        
        // Try to get profile from API first
        try {
          console.log("Fetching profile from API");
          // Try customer API first, then fall back to generic user API if needed
          const response = await customerAPI.getProfile()
            .catch(() => userAPI.getProfile()); // Fallback to userAPI if customerAPI fails
          
          console.log("API response:", response.data);
          const userData = response.data;
          setProfile({
            name: userData.name || '',
            surname: userData.surname || '',
            email: userData.email || '',
            phoneNumber: userData.phoneNumber || '',
            roles: userData.roles || [],
            picUrl: userData.picUrl || "/src/assets/images/hero/repair-3.jpg"
          });
        } catch (apiError) {
          console.error("API call failed, using auth context data:", apiError);
          
          // Use user data from auth context if API fails
          if (user) {
            console.log("Setting profile from auth context:", user);
            setProfile({
              name: user.name || '',
              surname: user.surname || '',
              email: user.email || '',
              phoneNumber: user.phoneNumber || '',
              roles: user.roles || [],
              picUrl: user.picUrl || "/src/assets/images/hero/repair-3.jpg"
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);

  // Fix for the getUserRole function
  const getUserRole = () => {
    // If no roles, return default
    if (!profile.roles || profile.roles.length === 0) return "User";
    
    // Get the first role (could be a string or an object)
    const roleObj = profile.roles[0];
    
    // Handle different formats of role data
    let roleValue;
    
    if (typeof roleObj === 'string') {
      // If role is directly a string like "ROLE_CUSTOMER"
      roleValue = roleObj;
    } else if (roleObj && typeof roleObj === 'object') {
      // If role is an object like { authority: "ROLE_CUSTOMER" } or similar
      roleValue = roleObj.authority || roleObj.role || roleObj.name || Object.values(roleObj)[0];
    } else {
      // Fallback if we can't determine the role
      return "User";
    }
    
    // Now we can safely use roleValue
    if (roleValue === "ROLE_VENDOR") return "Service Provider";
    if (roleValue === "ROLE_CUSTOMER") return "Customer";
    if (roleValue === "ROLE_ADMIN") return "Administrator";
    
    // Make sure roleValue is a string before using replace
    if (typeof roleValue === 'string' && roleValue.includes("ROLE_")) {
      // Remove ROLE_ prefix and capitalize
      return roleValue.replace("ROLE_", "").charAt(0).toUpperCase() + 
             roleValue.replace("ROLE_", "").slice(1).toLowerCase();
    }
    
    // If we get here, just return the role value or a default
    return roleValue || "User";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setUpdateError('');
    setUpdateSuccess(false);
    
    try {
      // Use customerAPI to update profile
      await customerAPI.updateProfile({
        name: profile.name,
        surname: profile.surname,
        phoneNumber: profile.phoneNumber
      });
      
      setIsEditing(false);
      setUpdateSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setUpdateError('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Use customerAPI to upload profile picture
        const response = await customerAPI.uploadProfilePicture(file);
        
        // Update profile with new image URL
        if (response.data && response.data.picUrl) {
          setProfile(prev => ({
            ...prev,
            picUrl: response.data.picUrl
          }));
        }
      } catch (error) {
        console.error('Failed to upload image:', error);
        setUpdateError('Failed to upload image. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          My Profile
        </h1>
        {isEditing ? (
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 mr-14 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Edit Profile
          </button>
        )}
      </div>
      
      {updateSuccess && (
        <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
          Profile updated successfully!
        </div>
      )}
      
      {updateError && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {updateError}
        </div>
      )}

      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Profile Information */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-6 flex items-center space-x-4">
              <div className="relative">
                <img
                  src={profile.picUrl}
                  alt="Profile"
                  className="h-20 w-20 rounded-full object-cover ring-4 ring-blue-100 dark:ring-blue-900"
                />
                {isEditing && (
                  <label htmlFor="profile-image" className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-blue-600 p-1.5 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                    <PhotoIcon className="h-4 w-4" />
                    <input
                      type="file"
                      id="profile-image"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {`${profile.name} ${profile.surname}`}
                </h2>
                <div className="flex items-center space-x-1">
                  <ShieldCheckIcon className="h-4 w-4 text-blue-500" />
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    {getUserRole()}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Name fields */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                  Full Name
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="block w-full rounded-lg border border-gray-200 bg-white p-2.5 text-gray-900 disabled:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-900"
                    placeholder="First Name"
                  />
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={profile.surname}
                    onChange={(e) => setProfile({ ...profile, surname: e.target.value })}
                    className="block w-full rounded-lg border border-gray-200 bg-white p-2.5 text-gray-900 disabled:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-900"
                    placeholder="Last Name"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                  Email
                </label>
                <div className="mt-1 flex items-center">
                  <span className="mr-2 text-gray-500 dark:text-slate-400">
                    <EnvelopeIcon className="h-5 w-5" />
                  </span>
                  <input
                    type="email"
                    disabled={true} // Email should not be editable directly for security reasons
                    value={profile.email}
                    className="block w-full rounded-lg border border-gray-200 bg-white p-2.5 text-gray-900 disabled:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-900"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                  Phone Number
                </label>
                <div className="mt-1 flex items-center">
                  <span className="mr-2 text-gray-500 dark:text-slate-400">
                    <PhoneIcon className="h-5 w-5" />
                  </span>
                  <input
                    type="tel"
                    disabled={!isEditing}
                    value={profile.phoneNumber}
                    onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                    className="block w-full rounded-lg border border-gray-200 bg-white p-2.5 text-gray-900 disabled:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-900"
                    placeholder="Phone Number"
                  />
                </div>
              </div>

              {/* User Role Information */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                  Account Type
                </label>
                <div className="mt-1">
                  <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-slate-700 dark:bg-slate-900">
                    <ShieldCheckIcon className="mr-2 h-5 w-5 text-blue-500" />
                    <span className="text-gray-900 dark:text-white">{getUserRole()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              Security Settings
            </h2>
            
            <div className="space-y-4">
              <button
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="inline-flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
              >
                <KeyIcon className="mr-2 h-5 w-5" />
                {isChangingPassword ? 'Cancel' : 'Change Password'}
              </button>

              {isChangingPassword && <ChangePasswordForm />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProfile;