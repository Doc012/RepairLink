import { useState } from 'react';
import { 
  BuildingStorefrontIcon,
  MapPinIcon,
  WrenchScrewdriverIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/formatCurrency';

const Business = () => {
  const [business, setBusiness] = useState({
    businessName: "Smith's Auto Repair",
    serviceCategory: "Automotive",
    location: "123 Main Street, Johannesburg, 2000"
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

  const handleBusinessUpdate = async (e) => {
    e.preventDefault();
    // Add your API call here
    setIsEditingBusiness(false);
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

  return (
    <div className="space-y-6">
      {/* Business Profile Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Business Profile
          </h2>
          <button
            onClick={() => setIsEditingBusiness(!isEditingBusiness)}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {isEditingBusiness ? 'Save Changes' : 'Edit Business'}
          </button>
        </div>

        <form onSubmit={handleBusinessUpdate} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Business Name
            </label>
            <div className="mt-1 flex items-center">
              <BuildingStorefrontIcon className="mr-2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                disabled={!isEditingBusiness}
                value={business.businessName}
                onChange={(e) => setBusiness({ ...business, businessName: e.target.value })}
                className="block w-full rounded-lg border border-gray-200 bg-white p-2.5 text-gray-900 disabled:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Service Category
            </label>
            <div className="mt-1 flex items-center">
              <WrenchScrewdriverIcon className="mr-2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                disabled={!isEditingBusiness}
                value={business.serviceCategory}
                onChange={(e) => setBusiness({ ...business, serviceCategory: e.target.value })}
                className="block w-full rounded-lg border border-gray-200 bg-white p-2.5 text-gray-900 disabled:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Location
            </label>
            <div className="mt-1 flex items-center">
              <MapPinIcon className="mr-2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                disabled={!isEditingBusiness}
                value={business.location}
                onChange={(e) => setBusiness({ ...business, location: e.target.value })}
                className="block w-full rounded-lg border border-gray-200 bg-white p-2.5 text-gray-900 disabled:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-900"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Services Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Services
          </h2>
          <button
            onClick={() => setIsAddingService(true)}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <PlusIcon className="mr-2 h-5 w-5" />
            Add Service
          </button>
        </div>

        {/* Services List */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="relative rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="absolute right-2 top-2 flex space-x-2">
                <button
                  onClick={() => setEditingService(service)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteService(service.id)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-red-400"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>

              <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                {service.serviceName}
              </h3>
              <p className="mb-4 text-sm text-gray-500 dark:text-slate-400">
                {service.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-900 dark:text-white">
                  <CurrencyDollarIcon className="mr-1 h-5 w-5 text-gray-400" />
                  {formatCurrency(service.price)}
                </div>
                <div className="flex items-center text-gray-900 dark:text-white">
                  <ClockIcon className="mr-1 h-5 w-5 text-gray-400" />
                  {service.duration}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Service Modal */}
        {(isAddingService || editingService) && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
              <div 
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                onClick={() => {
                  setIsAddingService(false);
                  setEditingService(null);
                }}
              />
              <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all dark:bg-slate-800 sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
                <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                  {isAddingService ? 'Add New Service' : 'Edit Service'}
                </h3>
                <form onSubmit={isAddingService ? handleAddService : handleEditService} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                      Service Name
                    </label>
                    <input
                      type="text"
                      value={isAddingService ? newService.serviceName : editingService?.serviceName}
                      onChange={(e) => {
                        if (isAddingService) {
                          setNewService({ ...newService, serviceName: e.target.value });
                        } else {
                          setEditingService({ ...editingService, serviceName: e.target.value });
                        }
                      }}
                      className="mt-1 block w-full rounded-lg border border-gray-200 bg-white p-2.5 text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                      Description
                    </label>
                    <textarea
                      value={isAddingService ? newService.description : editingService?.description}
                      onChange={(e) => {
                        if (isAddingService) {
                          setNewService({ ...newService, description: e.target.value });
                        } else {
                          setEditingService({ ...editingService, description: e.target.value });
                        }
                      }}
                      rows={3}
                      className="mt-1 block w-full rounded-lg border border-gray-200 bg-white p-2.5 text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                      Price (ZAR)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={isAddingService ? newService.price : editingService?.price}
                      onChange={(e) => {
                        if (isAddingService) {
                          setNewService({ ...newService, price: e.target.value });
                        } else {
                          setEditingService({ ...editingService, price: e.target.value });
                        }
                      }}
                      className="mt-1 block w-full rounded-lg border border-gray-200 bg-white p-2.5 text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={isAddingService ? newService.duration : editingService?.duration}
                      onChange={(e) => {
                        if (isAddingService) {
                          setNewService({ ...newService, duration: e.target.value });
                        } else {
                          setEditingService({ ...editingService, duration: e.target.value });
                        }
                      }}
                      placeholder="e.g., 2 hours"
                      className="mt-1 block w-full rounded-lg border border-gray-200 bg-white p-2.5 text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      required
                    />
                  </div>

                  <div className="mt-5 sm:mt-6">
                    <button
                      type="submit"
                      className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      {isAddingService ? 'Add Service' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Business;