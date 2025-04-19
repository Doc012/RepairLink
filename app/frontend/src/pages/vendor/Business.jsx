import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BuildingStorefrontIcon,
  MapPinIcon,
  WrenchScrewdriverIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  UserIcon,
  PhoneIcon,
  IdentificationIcon,
  BuildingOfficeIcon, // Add this import
  DocumentCheckIcon,   // Add this import
  ArrowRightIcon,      // Add this import
  ChevronDownIcon,     // Add this import
  CheckIcon,           // Add this import
  ClockIcon as SolidClockIcon // Add this import
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/formatCurrency';

const onboardingSteps = [
  { id: 1, name: 'Business Details' },
  { id: 2, name: 'Verification' }
];

const verificationSteps = [
  { 
    id: 1, 
    name: 'Application Submitted', 
    description: 'Your business details have been received',
    status: 'complete' 
  },
  { 
    id: 2, 
    name: 'Under Review', 
    description: 'Our team is reviewing your application',
    status: 'current' 
  },
  { 
    id: 3, 
    name: 'Verification', 
    description: 'Verifying business credentials and documents',
    status: 'upcoming' 
  },
  { 
    id: 4, 
    name: 'Approval', 
    description: 'Final approval and account activation',
    status: 'upcoming' 
  }
];

const Business = () => {
  const [business, setBusiness] = useState({
    businessName: "Smith's Auto Repair",
    serviceCategory: "Automotive",
    streetAddress: "123 Main Street",
    suburb: "Sandton",
    city: "Johannesburg",
    postalCode: "2000",
    contactNumber: "",
    description: ""
  });

  const [services, setServices] = useState([
    {
      id: 1,
      serviceName: "Basic Car Service",
      description: "Complete car checkup including oil change and basic maintenance",
      price: 1299.99,
      duration: "2 hours"
    }
  ]);

  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [isAddingService, setIsAddingService] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [newService, setNewService] = useState({
    serviceName: "",
    description: "",
    price: "",
    duration: ""
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isApproved, setIsApproved] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleBusinessSubmit = async (e) => {
    e.preventDefault();
    setIsConfirming(true); // Add this state to show confirmation
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Add your API call here to submit business details
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      setCurrentStep(2);
    } catch (error) {
      console.error('Error submitting business details:', error);
    } finally {
      setIsSubmitting(false);
      setIsConfirming(false);
    }
  };

  const handleBusinessUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Add your API call here to update business details
      // Example:
      // await fetch('/api/business/update', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(business)
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsEditingBusiness(false);
      // Optionally show success message
    } catch (error) {
      console.error('Error updating business:', error);
      // Handle error (show error message)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    setServices([...services, { ...newService, id: Date.now() }]);
    setNewService({ serviceName: "", description: "", price: "", duration: "" });
    setIsAddingService(false);
  };

  const handleEditService = async (e) => {
    e.preventDefault();
    setServices(services.map(service => 
      service.id === editingService.id ? editingService : service
    ));
    setEditingService(null);
  };

  const handleDeleteService = async (serviceId) => {
    // Add your API call here
    setServices(services.filter(service => service.id !== serviceId));
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = (step) => (
    <div key={step.id} className="flex flex-col items-center">
      <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
        currentStep === step.id
          ? 'border-blue-600 bg-blue-600 text-white'
          : currentStep > step.id
          ? 'border-blue-600 bg-blue-600 text-white'
          : 'border-gray-300 bg-white text-gray-500 dark:border-slate-600 dark:bg-slate-800'
      }`}>
        {currentStep > step.id ? (
          <CheckCircleIcon className="h-5 w-5" />
        ) : (
          <span>{step.id}</span>
        )}
      </div>
      <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
        {step.name}
      </p>
    </div>
  );

  const renderBusinessForm = () => (
    <form onSubmit={handleBusinessSubmit} className="mt-8 space-y-8">
      {/* Business Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
          Business Name
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <BuildingStorefrontIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={business.businessName}
            onChange={(e) => setBusiness({ ...business, businessName: e.target.value })}
            className="block w-full rounded-lg border border-gray-200 pl-10 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            required
            placeholder="Enter business name"
          />
        </div>
      </div>

      {/* Contact Number */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
          Contact Number
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <PhoneIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="tel"
            value={business.contactNumber}
            onChange={(e) => setBusiness({ ...business, contactNumber: e.target.value })}
            className="block w-full rounded-lg border border-gray-200 pl-10 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            required
            placeholder="Enter contact number"
          />
        </div>
      </div>

      {/* Service Category */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
          Service Category
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <WrenchScrewdriverIcon className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={business.serviceCategory}
            onChange={(e) => setBusiness({ ...business, serviceCategory: e.target.value })}
            className="block w-full rounded-lg border border-gray-200 pl-10 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white appearance-none bg-none"
            required
          >
            <option value="">Select a category</option>
            <option value="automotive">Automotive</option>
            <option value="plumbing">Plumbing</option>
            <option value="electrical">Electrical</option>
            <option value="carpentry">Carpentry</option>
            <option value="cleaning">Cleaning</option>
            <option value="landscaping">Landscaping</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Business Location */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
          Business Location
        </label>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-xs text-gray-500 dark:text-gray-400">
              Street Address
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={business.streetAddress}
                onChange={(e) => setBusiness({ ...business, streetAddress: e.target.value })}
                className="block w-full rounded-lg border border-gray-200 pl-10 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
                placeholder="123 Main Street"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs text-gray-500 dark:text-gray-400">
              Suburb
            </label>
            <input
              type="text"
              value={business.suburb}
              onChange={(e) => setBusiness({ ...business, suburb: e.target.value })}
              className="block w-full rounded-lg border border-gray-200 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              required
              placeholder="Sandton"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs text-gray-500 dark:text-gray-400">
              City
            </label>
            <input
              type="text"
              value={business.city}
              onChange={(e) => setBusiness({ ...business, city: e.target.value })}
              className="block w-full rounded-lg border border-gray-200 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              required
              placeholder="Johannesburg"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs text-gray-500 dark:text-gray-400">
              Postal Code
            </label>
            <input
              type="text"
              value={business.postalCode}
              onChange={(e) => setBusiness({ ...business, postalCode: e.target.value })}
              className="block w-full rounded-lg border border-gray-200 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              required
              placeholder="2000"
            />
          </div>
        </div>
      </div>

      {/* Business Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
          Business Description
        </label>
        <textarea
          value={business.description}
          onChange={(e) => setBusiness({ ...business, description: e.target.value })}
          rows={4}
          className="block w-full rounded-lg border border-gray-200 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          required
          placeholder="Tell us about your business..."
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Review Profile
          <ArrowRightIcon className="ml-2 h-5 w-5" />
        </motion.button>
      </div>

      {/* Confirmation Dialog */}
      {isConfirming && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setIsConfirming(false)}
            />
            <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all dark:bg-slate-800 sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20 sm:mx-0 sm:h-10 sm:w-10">
                  <DocumentCheckIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                    Confirm Submission
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Are you sure all the business details are correct? You can go back and review if needed.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleConfirmSubmit}
                  disabled={isSubmitting}
                  className={`inline-flex w-full justify-center rounded-lg px-4 py-2 text-sm font-medium text-white sm:ml-3 sm:w-auto ${
                    isSubmitting
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Yes, Submit'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfirming(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:mt-0 sm:w-auto dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );

  const renderEditBusinessForm = () => (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleBusinessUpdate}
      className="mt-4 space-y-6"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Business Name
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <BuildingStorefrontIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={business.businessName}
              onChange={(e) => setBusiness({ ...business, businessName: e.target.value })}
              className="block w-full rounded-lg border border-gray-200 pl-10 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Contact Number
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <PhoneIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              value={business.contactNumber}
              onChange={(e) => setBusiness({ ...business, contactNumber: e.target.value })}
              className="block w-full rounded-lg border border-gray-200 pl-10 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Service Category
        </label>
        <div className="relative mt-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <WrenchScrewdriverIcon className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={business.serviceCategory}
            onChange={(e) => setBusiness({ ...business, serviceCategory: e.target.value })}
            className="block w-full rounded-lg border border-gray-200 pl-10 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white appearance-none"
            required
          >
            <option value="">Select a category</option>
            <option value="automotive">Automotive</option>
            <option value="plumbing">Plumbing</option>
            <option value="electrical">Electrical</option>
            <option value="carpentry">Carpentry</option>
            <option value="cleaning">Cleaning</option>
            <option value="landscaping">Landscaping</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Business Location
        </label>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400">
              Street Address
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={business.streetAddress}
                onChange={(e) => setBusiness({ ...business, streetAddress: e.target.value })}
                className="block w-full rounded-lg border border-gray-200 pl-10 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400">
              Suburb
            </label>
            <input
              type="text"
              value={business.suburb}
              onChange={(e) => setBusiness({ ...business, suburb: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-200 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400">
              City
            </label>
            <input
              type="text"
              value={business.city}
              onChange={(e) => setBusiness({ ...business, city: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-200 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400">
              Postal Code
            </label>
            <input
              type="text"
              value={business.postalCode}
              onChange={(e) => setBusiness({ ...business, postalCode: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-200 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Business Description
        </label>
        <textarea
          value={business.description}
          onChange={(e) => setBusiness({ ...business, description: e.target.value })}
          rows={4}
          className="mt-1 block w-full rounded-lg border border-gray-200 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          required
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => setIsEditingBusiness(false)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Save Changes
        </button>
      </div>
    </motion.form>
  );

  const renderServiceForm = () => (
    <div className="space-y-6">
      {/* Services List */}
      <div className="space-y-4">
        {services.map((service) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {service.serviceName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {service.description}
                </p>
                <div className="flex items-center gap-4">
                  <span className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <CurrencyDollarIcon className="mr-1.5 h-4 w-4 text-gray-400" />
                    {formatCurrency(service.price)}
                  </span>
                  <span className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <ClockIcon className="mr-1.5 h-4 w-4 text-gray-400" />
                    {service.duration}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingService(service)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-slate-700"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteService(service.id)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Service Button */}
      {!isAddingService && !editingService && (
        <motion.button
          onClick={() => setIsAddingService(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-4 text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-700 dark:border-slate-700 dark:text-gray-400 dark:hover:border-slate-600 dark:hover:text-gray-300"
        >
          <PlusIcon className="mr-2 h-5 w-5" />
          Add New Service
        </motion.button>
      )}

      {/* Add/Edit Service Form */}
      {(isAddingService || editingService) && (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={editingService ? handleEditService : handleAddService}
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Service Name
              </label>
              <input
                type="text"
                value={editingService ? editingService.serviceName : newService.serviceName}
                onChange={(e) => {
                  if (editingService) {
                    setEditingService({ ...editingService, serviceName: e.target.value });
                  } else {
                    setNewService({ ...newService, serviceName: e.target.value });
                  }
                }}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                value={editingService ? editingService.description : newService.description}
                onChange={(e) => {
                  if (editingService) {
                    setEditingService({ ...editingService, description: e.target.value });
                  } else {
                    setNewService({ ...newService, description: e.target.value });
                  }
                }}
                rows={3}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Price (ZAR)
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">R</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    value={editingService ? editingService.price : newService.price}
                    onChange={(e) => {
                      if (editingService) {
                        setEditingService({ ...editingService, price: e.target.value });
                      } else {
                        setNewService({ ...newService, price: e.target.value });
                      }
                    }}
                    className="block w-full rounded-lg border border-gray-300 pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white sm:text-sm"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Duration
                </label>
                <input
                  type="text"
                  value={editingService ? editingService.duration : newService.duration}
                  onChange={(e) => {
                    if (editingService) {
                      setEditingService({ ...editingService, duration: e.target.value });
                    } else {
                      setNewService({ ...newService, duration: e.target.value });
                    }
                  }}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white"
                  placeholder="e.g., 2 hours"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setIsAddingService(false);
                setEditingService(null);
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {editingService ? 'Update Service' : 'Add Service'}
            </button>
          </div>
        </motion.form>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {showOnboarding ? (
          <div className="rounded-2xl bg-white p-8 shadow-lg dark:bg-slate-800">
            {/* Onboarding Header */}
            <div className="text-center">
              <BuildingOfficeIcon className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-400" />
              <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
                Let's Set Up Your Business
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Complete your business profile to start accepting service requests
              </p>
            </div>

            {/* Progress Steps */}
            <div className="mt-8 mb-12">
              <div className="relative">
                <div className="absolute left-0 top-2 h-0.5 w-full bg-gray-200 dark:bg-slate-700" />
                <div 
                  className="absolute left-0 top-2 h-0.5 bg-blue-600 transition-all duration-500 dark:bg-blue-400"
                  style={{ width: `${((currentStep - 1) / (onboardingSteps.length - 1)) * 100}%` }}
                />
                <div className="relative flex justify-between">
                  {onboardingSteps.map(renderStep)}
                </div>
              </div>
            </div>

            {/* Form Content */}
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {renderBusinessForm()}
                </motion.div>
              )}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div className="mt-8 space-y-8">
                    <div className="text-center">
                      <DocumentCheckIcon className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-400" />
                      <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                        Application Submitted Successfully!
                      </h2>
                      <p className="mt-2 text-gray-600 dark:text-gray-300">
                        We're reviewing your business details. This usually takes 1-2 business days.
                      </p>
                    </div>

                    {/* Verification Status Timeline */}
                    <div className="flow-root">
                      <ul className="-mb-8">
                        {verificationSteps.map((step, stepIdx) => (
                          <li key={step.id}>
                            <div className="relative pb-8">
                              {stepIdx !== verificationSteps.length - 1 ? (
                                <span
                                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-slate-700"
                                  aria-hidden="true"
                                />
                              ) : null}
                              <div className="relative flex items-start space-x-3">
                                <div>
                                  <div className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                                    step.status === 'complete' 
                                      ? 'bg-blue-600 dark:bg-blue-500'
                                      : step.status === 'current'
                                      ? 'bg-blue-100 dark:bg-blue-900/50 ring-2 ring-blue-600 dark:ring-blue-500'
                                      : 'bg-gray-100 dark:bg-slate-700'
                                  }`}>
                                    {step.status === 'complete' ? (
                                      <CheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
                                    ) : step.status === 'current' ? (
                                      <SolidClockIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                                    ) : (
                                      <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-slate-600" />
                                    )}
                                  </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {step.name}
                                  </div>
                                  <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                                    {step.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Estimated Time */}
                    <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <SolidClockIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                            Estimated Processing Time
                          </h3>
                          <p className="mt-2 text-sm text-blue-700 dark:text-blue-200">
                            Your application is being processed. We'll notify you via email once your business is approved.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Close Button */}
                    <div className="flex justify-end pt-4">
                      <motion.button
                        onClick={() => {
                          setShowOnboarding(false);
                          setIsApproved(true);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center rounded-lg bg-gray-800 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:bg-gray-700 dark:bg-slate-700 dark:hover:bg-slate-600"
                      >
                        View Business Profile
                        <ArrowRightIcon className="ml-2 h-5 w-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Business Profile Header */}
            <div className="relative rounded-2xl bg-white p-8 shadow-lg dark:bg-slate-800">
              {isEditingBusiness ? (
                renderEditBusinessForm()
              ) : (
                <>
                  <div className="absolute right-8 top-8">
                    <motion.button
                      onClick={() => setIsEditingBusiness(true)}
                      whileHover={{ scale: 1.05 }}
                      className="inline-flex items-center rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                    >
                      <PencilIcon className="mr-2 h-4 w-4" />
                      Edit Profile
                    </motion.button>
                  </div>
                  
                  <div className="flex items-start space-x-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <BuildingStorefrontIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {business.businessName}
                      </h1>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {business.description || "No description provided"}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-4">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <MapPinIcon className="mr-1.5 h-4 w-4" />
                          {business.streetAddress}, {business.suburb}, {business.city}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <PhoneIcon className="mr-1.5 h-4 w-4" />
                          {business.contactNumber}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <WrenchScrewdriverIcon className="mr-1.5 h-4 w-4" />
                          {business.serviceCategory}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Services Management */}
            {isApproved ? (
              <div className="rounded-2xl bg-white p-8 shadow-lg dark:bg-slate-800">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Services
                  </h2>
                  <motion.button
                    onClick={() => setIsAddingService(true)}
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add Service
                  </motion.button>
                </div>

                {/* Service list and forms */}
                {renderServiceForm()}
              </div>
            ) : (
              <div className="rounded-2xl bg-white p-8 shadow-lg dark:bg-slate-800">
                <div className="text-center">
                  <SolidClockIcon className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-400" />
                  <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                    Pending Approval
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Your business profile is under review. You'll be able to add services once approved.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Business;