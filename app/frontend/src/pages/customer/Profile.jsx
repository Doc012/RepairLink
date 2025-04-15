import { useState, useEffect } from 'react';
import { 
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  KeyIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import ChangePasswordForm from '../../components/shared/ChangePasswordForm';
import { useAuth } from '../../contexts/auth/AuthContext';
import axios from 'axios';

const CustomerProfile = () => {
  const { user } = useAuth(); // Get user from auth context
  
  const [profile, setProfile] = useState({
    name: '',
    surname: '',
    email: '',
    phoneNumber: '',
    picUrl: "/src/assets/images/hero/repair-3.jpg"
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    // Fetch user profile data
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        
        // Use user data from auth context if available
        if (user) {
          setProfile({
            name: user.name || '',
            surname: user.surname || '',
            email: user.email || '',
            phoneNumber: user.phoneNumber || '',
            picUrl: user.picUrl || "/src/assets/images/hero/repair-3.jpg"
          });
        } else {
          // Fallback to API call if needed
          const response = await axios.get('http://localhost:8080/api/users/profile', {
            withCredentials: true
          });
          
          const userData = response.data;
          setProfile({
            name: userData.name || '',
            surname: userData.surname || '',
            email: userData.email || '',
            phoneNumber: userData.phoneNumber || '',
            picUrl: userData.picUrl || "/src/assets/images/hero/repair-3.jpg"
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setUpdateError('');
    setUpdateSuccess(false);
    
    try {
      // Update profile API call
      const response = await axios.put(
        'http://localhost:8080/api/users/profile',
        {
          name: profile.name,
          surname: profile.surname,
          phoneNumber: profile.phoneNumber
        },
        { withCredentials: true }
      );
      
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
      // TODO: Implement image upload
      console.log('Uploading image:', file);
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
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
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
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Customer
                </p>
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
                  />
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={profile.surname}
                    onChange={(e) => setProfile({ ...profile, surname: e.target.value })}
                    className="block w-full rounded-lg border border-gray-200 bg-white p-2.5 text-gray-900 disabled:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-900"
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
                  />
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