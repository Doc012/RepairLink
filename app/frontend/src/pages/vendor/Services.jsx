import { useState } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/formatCurrency';

const Services = () => {
  const [services, setServices] = useState([
    {
      id: 1,
      serviceName: 'Basic Car Service',
      description: 'Complete car checkup including oil change and basic maintenance',
      price: 1299.99,  // Now in ZAR
      duration: '2 hours',
      isActive: true
    },
    {
      id: 2,
      serviceName: 'Full Car Detailing',
      description: 'Interior and exterior detailing with premium cleaning products',
      price: 2499.99,  // Now in ZAR
      duration: '4 hours',
      isActive: true
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const handleEdit = (service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setServices(services.filter(service => service.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Services
        </h1>
        <button
          onClick={() => {
            setEditingService(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <PlusIcon className="mr-2 h-5 w-5" />
          Add Service
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="relative rounded-lg border border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {service.serviceName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  {service.description}
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                    <CurrencyDollarIcon className="mr-1.5 h-5 w-5" />
                    {formatCurrency(service.price)}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                    <ClockIcon className="mr-1.5 h-5 w-5" />
                    {service.duration}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-red-400"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Service Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              onClick={() => setIsModalOpen(false)}
            />
            <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all dark:bg-slate-800 sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
              {/* Add your form fields here */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;