import { useState, useEffect } from 'react';
import { 
  ArrowPathIcon, 
  ExclamationCircleIcon,
  CheckCircleIcon,
  XMarkIcon,
  Cog6ToothIcon,
  BellIcon,
  LockClosedIcon,
  UserIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import apiClient from '../../utils/apiClient';

const Settings = () => {
  // General settings
  const [companyName, setCompanyName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [address, setAddress] = useState('');
  const [timezone, setTimezone] = useState('Africa/Johannesburg');
  
  // Email settings
  const [smtpServer, setSmtpServer] = useState('');
  const [smtpPort, setSmtpPort] = useState('');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [emailEncryption, setEmailEncryption] = useState('tls');
  
  // Payment settings
  const [currency, setCurrency] = useState('ZAR');
  const [paypalEnabled, setPaypalEnabled] = useState(false);
  const [paypalClientId, setPaypalClientId] = useState('');
  const [paypalSecret, setPaypalSecret] = useState('');
  const [stripeEnabled, setStripeEnabled] = useState(true);
  const [stripeKey, setStripeKey] = useState('');
  const [stripeSecret, setStripeSecret] = useState('');
  const [commissionRate, setCommissionRate] = useState(10);
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  
  // System settings
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [serviceAccountVisible, setServiceAccountVisible] = useState(true);

  // UI state
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    // This effect tracks any changes to the form fields
    const handleBeforeUnload = (e) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [unsavedChanges]);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real app, fetch settings from API
      // const response = await apiClient.get('/admin/settings');
      
      // For now, simulate API fetch with timeout
      setTimeout(() => {
        // Simulate data from API
        const settings = {
          general: {
            companyName: 'RepairLink',
            contactEmail: 'support@repairlink.co.za',
            contactPhone: '+27 11 456 7890',
            address: '123 Main Street, Johannesburg, 2001, South Africa',
            timezone: 'Africa/Johannesburg',
          },
          email: {
            smtpServer: 'smtp.repairlink.co.za',
            smtpPort: '587',
            smtpUser: 'notifications@repairlink.co.za',
            smtpPassword: '********',
            fromEmail: 'no-reply@repairlink.co.za',
            emailEncryption: 'tls',
          },
          payment: {
            currency: 'ZAR',
            paypalEnabled: false,
            paypalClientId: '',
            paypalSecret: '',
            stripeEnabled: true,
            stripeKey: 'pk_test_*****************',
            stripeSecret: 'sk_test_*****************',
            commissionRate: 10,
          },
          notifications: {
            emailNotifications: true,
            smsNotifications: false,
            pushNotifications: true,
          },
          system: {
            maintenanceMode: false,
            debugMode: false,
            serviceAccountVisible: true,
          }
        };
        
        // Update all state variables from fetched settings
        setCompanyName(settings.general.companyName);
        setContactEmail(settings.general.contactEmail);
        setContactPhone(settings.general.contactPhone);
        setAddress(settings.general.address);
        setTimezone(settings.general.timezone);
        
        setSmtpServer(settings.email.smtpServer);
        setSmtpPort(settings.email.smtpPort);
        setSmtpUser(settings.email.smtpUser);
        setSmtpPassword(settings.email.smtpPassword);
        setFromEmail(settings.email.fromEmail);
        setEmailEncryption(settings.email.emailEncryption);
        
        setCurrency(settings.payment.currency);
        setPaypalEnabled(settings.payment.paypalEnabled);
        setPaypalClientId(settings.payment.paypalClientId);
        setPaypalSecret(settings.payment.paypalSecret);
        setStripeEnabled(settings.payment.stripeEnabled);
        setStripeKey(settings.payment.stripeKey);
        setStripeSecret(settings.payment.stripeSecret);
        setCommissionRate(settings.payment.commissionRate);
        
        setEmailNotifications(settings.notifications.emailNotifications);
        setSmsNotifications(settings.notifications.smsNotifications);
        setPushNotifications(settings.notifications.pushNotifications);
        
        setMaintenanceMode(settings.system.maintenanceMode);
        setDebugMode(settings.system.debugMode);
        setServiceAccountVisible(settings.system.serviceAccountVisible);
        
        setIsLoading(false);
        setUnsavedChanges(false);
      }, 800);
    } catch (err) {
      console.error('Failed to load settings:', err);
      setError('Failed to load settings. Please refresh the page and try again.');
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      setError(null);
      
      // Prepare settings object from current state
      const settings = {
        general: {
          companyName,
          contactEmail,
          contactPhone,
          address,
          timezone,
        },
        email: {
          smtpServer,
          smtpPort,
          smtpUser,
          smtpPassword,
          fromEmail,
          emailEncryption,
        },
        payment: {
          currency,
          paypalEnabled,
          paypalClientId,
          paypalSecret,
          stripeEnabled,
          stripeKey,
          stripeSecret,
          commissionRate,
        },
        notifications: {
          emailNotifications,
          smsNotifications,
          pushNotifications,
        },
        system: {
          maintenanceMode,
          debugMode,
          serviceAccountVisible,
        }
      };
      
      // In a real app, send settings to API
      // await apiClient.post('/admin/settings', settings);
      
      // Simulate API call with timeout
      setTimeout(() => {
        setIsSaving(false);
        setSuccess('Settings saved successfully!');
        setUnsavedChanges(false);
        
        // Clear success message after a few seconds
        setTimeout(() => setSuccess(null), 3000);
      }, 1000);
    } catch (err) {
      console.error('Failed to save settings:', err);
      setError('Failed to save settings. Please try again.');
      setIsSaving(false);
    }
  };

  // Handle form field changes and set the unsavedChanges flag
  const handleChange = (setter) => (e) => {
    setter(e.target.value);
    setUnsavedChanges(true);
  };

  // Handle toggle/checkbox changes
  const handleToggleChange = (setter, currentValue) => {
    setter(!currentValue);
    setUnsavedChanges(true);
  };

  // Input field component to reduce repetition
  const InputField = ({ id, label, type, value, onChange, placeholder, disabled }) => (
    <div className="mb-4">
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <input
        id={id}
        type={type || 'text'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled || isLoading || isSaving}
        className="w-full rounded-lg border border-slate-200 p-2 text-slate-900 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-purple-400 dark:focus:ring-purple-800"
      />
    </div>
  );

  // Toggle/Switch component for boolean settings
  const ToggleSwitch = ({ id, label, description, isChecked, onChange }) => (
    <div className="mb-4 flex items-start">
      <div className="flex h-5 items-center">
        <input
          id={id}
          type="checkbox"
          checked={isChecked}
          onChange={onChange}
          disabled={isLoading || isSaving}
          className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:focus:ring-purple-600"
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={id} className="font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
        {description && (
          <p className="text-slate-500 dark:text-slate-400">{description}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Settings</h1>
        <button
          onClick={loadSettings}
          disabled={isLoading || isSaving}
          className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <ArrowPathIcon className="mr-2 h-5 w-5" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-400" role="alert">
          <div className="flex items-center">
            <ExclamationCircleIcon className="mr-2 h-5 w-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-400" role="alert">
          <div className="flex items-center">
            <CheckCircleIcon className="mr-2 h-5 w-5" />
            <span>{success}</span>
          </div>
        </div>
      )}

      <div className="rounded-lg border bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        {/* Tabs navigation */}
        <div className="border-b border-slate-200 dark:border-slate-700">
          <nav className="flex overflow-x-auto" aria-label="Settings tabs">
            <button
              className={`whitespace-nowrap border-b-2 py-4 px-4 text-sm font-medium ${
                activeTab === 'general'
                  ? 'border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-400'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-300'
              }`}
              onClick={() => setActiveTab('general')}
            >
              <div className="flex items-center">
                <Cog6ToothIcon className="mr-2 h-5 w-5" />
                General
              </div>
            </button>
            <button
              className={`whitespace-nowrap border-b-2 py-4 px-4 text-sm font-medium ${
                activeTab === 'email'
                  ? 'border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-400'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-300'
              }`}
              onClick={() => setActiveTab('email')}
            >
              <div className="flex items-center">
                <EnvelopeIcon className="mr-2 h-5 w-5" />
                Email
              </div>
            </button>
            <button
              className={`whitespace-nowrap border-b-2 py-4 px-4 text-sm font-medium ${
                activeTab === 'payment'
                  ? 'border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-400'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-300'
              }`}
              onClick={() => setActiveTab('payment')}
            >
              <div className="flex items-center">
                <CurrencyDollarIcon className="mr-2 h-5 w-5" />
                Payment
              </div>
            </button>
            <button
              className={`whitespace-nowrap border-b-2 py-4 px-4 text-sm font-medium ${
                activeTab === 'notifications'
                  ? 'border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-400'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-300'
              }`}
              onClick={() => setActiveTab('notifications')}
            >
              <div className="flex items-center">
                <BellIcon className="mr-2 h-5 w-5" />
                Notifications
              </div>
            </button>
            <button
              className={`whitespace-nowrap border-b-2 py-4 px-4 text-sm font-medium ${
                activeTab === 'system'
                  ? 'border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-400'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-300'
              }`}
              onClick={() => setActiveTab('system')}
            >
              <div className="flex items-center">
                <LockClosedIcon className="mr-2 h-5 w-5" />
                System
              </div>
            </button>
          </nav>
        </div>

        <form onSubmit={handleSaveSettings}>
          <div className="p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-white">
                  Company Information
                </h3>
                <div className="space-y-4">
                  <InputField
                    id="company-name"
                    label="Company Name"
                    value={companyName}
                    onChange={handleChange(setCompanyName)}
                    placeholder="Your company name"
                  />
                  <InputField
                    id="contact-email"
                    label="Contact Email"
                    type="email"
                    value={contactEmail}
                    onChange={handleChange(setContactEmail)}
                    placeholder="contact@example.com"
                  />
                  <InputField
                    id="contact-phone"
                    label="Contact Phone"
                    value={contactPhone}
                    onChange={handleChange(setContactPhone)}
                    placeholder="+27 12 345 6789"
                  />
                  <div className="mb-4">
                    <label htmlFor="address" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Address
                    </label>
                    <textarea
                      id="address"
                      value={address}
                      onChange={handleChange(setAddress)}
                      rows={3}
                      className="w-full rounded-lg border border-slate-200 p-2 text-slate-900 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-purple-400 dark:focus:ring-purple-800"
                      placeholder="Company address"
                      disabled={isLoading || isSaving}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="timezone" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Timezone
                    </label>
                    <select
                      id="timezone"
                      value={timezone}
                      onChange={handleChange(setTimezone)}
                      className="w-full rounded-lg border border-slate-200 p-2 text-slate-900 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-purple-400 dark:focus:ring-purple-800"
                      disabled={isLoading || isSaving}
                    >
                      <option value="Africa/Johannesburg">Africa/Johannesburg (GMT+2)</option>
                      <option value="Africa/Cape_Town">Africa/Cape Town (GMT+2)</option>
                      <option value="Africa/Durban">Africa/Durban (GMT+2)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Email Settings */}
            {activeTab === 'email' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-white">
                  Email Configuration
                </h3>
                <div className="space-y-4">
                  <InputField
                    id="smtp-server"
                    label="SMTP Server"
                    value={smtpServer}
                    onChange={handleChange(setSmtpServer)}
                    placeholder="smtp.example.com"
                  />
                  <InputField
                    id="smtp-port"
                    label="SMTP Port"
                    value={smtpPort}
                    onChange={handleChange(setSmtpPort)}
                    placeholder="587"
                  />
                  <InputField
                    id="smtp-user"
                    label="SMTP Username"
                    value={smtpUser}
                    onChange={handleChange(setSmtpUser)}
                    placeholder="username"
                  />
                  <InputField
                    id="smtp-password"
                    label="SMTP Password"
                    type="password"
                    value={smtpPassword}
                    onChange={handleChange(setSmtpPassword)}
                    placeholder="••••••••"
                  />
                  <InputField
                    id="from-email"
                    label="From Email Address"
                    type="email"
                    value={fromEmail}
                    onChange={handleChange(setFromEmail)}
                    placeholder="no-reply@example.com"
                  />
                  <div className="mb-4">
                    <label htmlFor="email-encryption" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Encryption
                    </label>
                    <select
                      id="email-encryption"
                      value={emailEncryption}
                      onChange={handleChange(setEmailEncryption)}
                      className="w-full rounded-lg border border-slate-200 p-2 text-slate-900 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-purple-400 dark:focus:ring-purple-800"
                      disabled={isLoading || isSaving}
                    >
                      <option value="tls">TLS</option>
                      <option value="ssl">SSL</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md border border-transparent bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50"
                      disabled={isLoading || isSaving}
                    >
                      Test Email Connection
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Settings */}
            {activeTab === 'payment' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-white">
                  Payment Configuration
                </h3>
                <div className="space-y-4">
                  <div className="mb-4">
                    <label htmlFor="currency" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Currency
                    </label>
                    <select
                      id="currency"
                      value={currency}
                      onChange={handleChange(setCurrency)}
                      className="w-full rounded-lg border border-slate-200 p-2 text-slate-900 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-purple-400 dark:focus:ring-purple-800"
                      disabled={isLoading || isSaving}
                    >
                      <option value="ZAR">South African Rand (ZAR)</option>
                      <option value="USD">US Dollar (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                      <option value="GBP">British Pound (GBP)</option>
                    </select>
                  </div>

                  <div className="mt-6 rounded-md border border-slate-200 p-4 dark:border-slate-700">
                    <h4 className="mb-4 text-md font-medium text-slate-800 dark:text-white">
                      Stripe Integration
                    </h4>
                    
                    <ToggleSwitch
                      id="stripe-enabled"
                      label="Enable Stripe"
                      description="Accept payments through Stripe"
                      isChecked={stripeEnabled}
                      onChange={() => handleToggleChange(setStripeEnabled, stripeEnabled)}
                    />
                    
                    {stripeEnabled && (
                      <>
                        <InputField
                          id="stripe-key"
                          label="Stripe Public Key"
                          value={stripeKey}
                          onChange={handleChange(setStripeKey)}
                          placeholder="pk_test_..."
                        />
                        <InputField
                          id="stripe-secret"
                          label="Stripe Secret Key"
                          type="password"
                          value={stripeSecret}
                          onChange={handleChange(setStripeSecret)}
                          placeholder="sk_test_..."
                        />
                      </>
                    )}
                  </div>

                  <div className="mt-6 rounded-md border border-slate-200 p-4 dark:border-slate-700">
                    <h4 className="mb-4 text-md font-medium text-slate-800 dark:text-white">
                      PayPal Integration
                    </h4>
                    
                    <ToggleSwitch
                      id="paypal-enabled"
                      label="Enable PayPal"
                      description="Accept payments through PayPal"
                      isChecked={paypalEnabled}
                      onChange={() => handleToggleChange(setPaypalEnabled, paypalEnabled)}
                    />
                    
                    {paypalEnabled && (
                      <>
                        <InputField
                          id="paypal-client-id"
                          label="PayPal Client ID"
                          value={paypalClientId}
                          onChange={handleChange(setPaypalClientId)}
                          placeholder="Client ID from PayPal Developer Dashboard"
                        />
                        <InputField
                          id="paypal-secret"
                          label="PayPal Secret"
                          type="password"
                          value={paypalSecret}
                          onChange={handleChange(setPaypalSecret)}
                          placeholder="Secret from PayPal Developer Dashboard"
                        />
                      </>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="commission-rate" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Platform Commission Rate (%)
                    </label>
                    <div className="flex items-center">
                      <input
                        id="commission-rate"
                        type="number"
                        min="0"
                        max="100"
                        value={commissionRate}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          if (!isNaN(value) && value >= 0 && value <= 100) {
                            setCommissionRate(value);
                            setUnsavedChanges(true);
                          }
                        }}
                        className="w-24 rounded-lg border border-slate-200 p-2 text-slate-900 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-purple-400 dark:focus:ring-purple-800"
                        disabled={isLoading || isSaving}
                      />
                      <span className="ml-2 text-slate-700 dark:text-slate-300">%</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Percentage of each transaction that will be charged as platform fee
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-white">
                  Notification Settings
                </h3>
                <div className="space-y-4">
                  <ToggleSwitch
                    id="email-notifications"
                    label="Email Notifications"
                    description="Send email notifications to users"
                    isChecked={emailNotifications}
                    onChange={() => handleToggleChange(setEmailNotifications, emailNotifications)}
                  />
                  
                  <ToggleSwitch
                    id="sms-notifications"
                    label="SMS Notifications"
                    description="Send SMS notifications to users"
                    isChecked={smsNotifications}
                    onChange={() => handleToggleChange(setSmsNotifications, smsNotifications)}
                  />
                  
                  <ToggleSwitch
                    id="push-notifications"
                    label="Push Notifications"
                    description="Send browser and mobile app push notifications"
                    isChecked={pushNotifications}
                    onChange={() => handleToggleChange(setPushNotifications, pushNotifications)}
                  />
                  
                  <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700/50">
                    <h4 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      Notification Events
                    </h4>
                    <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                      Configure which events trigger notifications in the Notification Templates section
                    </p>
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                      disabled={isLoading || isSaving}
                    >
                      Configure Notification Templates
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* System Settings */}
            {activeTab === 'system' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-white">
                  System Configuration
                </h3>
                <div className="space-y-4">
                  <ToggleSwitch
                    id="maintenance-mode"
                    label="Maintenance Mode"
                    description="When enabled, only admins can access the site"
                    isChecked={maintenanceMode}
                    onChange={() => handleToggleChange(setMaintenanceMode, maintenanceMode)}
                  />
                  
                  <ToggleSwitch
                    id="debug-mode"
                    label="Debug Mode"
                    description="Enable detailed error messages and logging"
                    isChecked={debugMode}
                    onChange={() => handleToggleChange(setDebugMode, debugMode)}
                  />
                  
                  <ToggleSwitch
                    id="service-account-visible"
                    label="Show Service Provider Accounts"
                    description="Allow users to see and register for service provider accounts"
                    isChecked={serviceAccountVisible}
                    onChange={() => handleToggleChange(setServiceAccountVisible, serviceAccountVisible)}
                  />
                  
                  <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
                    <h4 className="mb-2 text-sm font-medium text-red-800 dark:text-red-400">
                      Danger Zone
                    </h4>
                    <p className="mb-4 text-sm text-red-600 dark:text-red-400">
                      These actions can cause data loss and are not reversible
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-red-700 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        Clear Cache
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-red-700 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        Reset Application
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end border-t border-slate-200 px-6 py-4 dark:border-slate-700">
            {unsavedChanges && (
              <span className="mr-auto text-sm text-amber-600 dark:text-amber-400">
                You have unsaved changes
              </span>
            )}
            <button
              type="button"
              onClick={loadSettings}
              disabled={isLoading || isSaving}
              className="mr-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <XMarkIcon className="mr-2 h-5 w-5" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || isSaving || !unsavedChanges}
              className="inline-flex items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-purple-500 dark:hover:bg-purple-600"
            >
              {isSaving ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="mr-2 h-5 w-5" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;