import { useState } from 'react';
import { 
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  KeyIcon,
  PhotoIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import ChangePasswordForm from '../../components/shared/ChangePasswordForm';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "John",
    surname: "Smith",
    email: "john.smith@example.com",
    phoneNumber: "+1 234-567-8900",
    picUrl: "/src/assets/images/hero/repair-3.jpg"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          My Profile
        </h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

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
                <button className="absolute bottom-0 right-0 rounded-full bg-blue-600 p-1.5 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                  <PhotoIcon className="h-4 w-4" />
                </button>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {`${profile.name} ${profile.surname}`}
              </h2>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Service Provider
              </p>
            </div>
          </div>

          <div className="space-y-4">
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
                  disabled={!isEditing}
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
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
              Change Password
            </button>

            {isChangingPassword && <ChangePasswordForm />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;