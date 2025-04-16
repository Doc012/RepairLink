import { useState } from 'react';
import { 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ClockIcon,
  CurrencyDollarIcon,
  StarIcon,
  MapPinIcon,
  CheckBadgeIcon,
  CheckIcon,
  XMarkIcon,
  PhoneIcon, // Add this import
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/formatCurrency';

const Services = () => {
  const [services, setServices] = useState([
    {
      id: 1,
      serviceName: "Full Car Service",
      description: "Comprehensive vehicle service including oil change, filters, and safety checks",
      price: 1299.99,
      duration: "3 hours",
      provider: {
        businessName: "Smith's Auto Repair",
        serviceCategory: "Automotive",
        location: "Sandton, Johannesburg",
        verified: true,
        phoneNumber: "011 234 5678" // Add phone number
      }
    },
    {
      id: 2,
      serviceName: "Electrical System Diagnostics",
      description: "Complete electrical system check with computerized diagnostics and repair",
      price: 899.99,
      duration: "2 hours",
      provider: {
        businessName: "PowerTech Solutions",
        serviceCategory: "Electrical",
        location: "Rosebank, Johannesburg",
        verified: true
      }
    },
    {
      id: 3,
      serviceName: "Plumbing Maintenance",
      description: "Professional plumbing inspection and maintenance service for your property",
      price: 749.99,
      duration: "1.5 hours",
      provider: {
        businessName: "Pro Plumbers SA",
        serviceCategory: "Plumbing",
        location: "Braamfontein, Johannesburg",
        verified: true
      }
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Add new states for booking
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    notes: ''
  });

  // Add BookingModal component
  const BookingModal = ({ service, onClose }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setIsSubmitting(true);

      try {
        // TODO: Add your booking API call here
        await new Promise(resolve => setTimeout(resolve, 1000));
        onClose();
        // TODO: Add success notification
      } catch (err) {
        setError('Failed to create booking');
      } finally {
        setIsSubmitting(false);
      }
    };

    const today = new Date().toISOString().split('T')[0];

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

          <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all dark:bg-slate-800 sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
            <form onSubmit={handleSubmit}>
              <div className="px-6 pt-5 pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Book Service
                  </h3>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 dark:text-slate-400 dark:hover:text-slate-300"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="mt-4 space-y-4">
                  {/* Service Details */}
                  <div className="rounded-lg border border-gray-200 p-4 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {service.serviceName}
                        </h4>
                        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                          {service.provider.businessName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(service.price)}
                        </p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                          {service.duration}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                      Select Date
                    </label>
                    <input
                      type="date"
                      min={today}
                      value={bookingData.date}
                      onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                      required
                      className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                      Select Time
                    </label>
                    <select
                      value={bookingData.time}
                      onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                      required
                      className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    >
                      <option value="">Choose a time slot</option>
                      <option value="09:00">09:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="13:00">01:00 PM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="15:00">03:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                    </select>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                      Additional Notes
                    </label>
                    <textarea
                      value={bookingData.notes}
                      onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                      rows={3}
                      className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      placeholder="Any special requirements or instructions..."
                    />
                  </div>

                  {error && (
                    <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                      {error}
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 px-6 py-4 dark:border-slate-700">
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Add booking handler
  const handleBookService = (service) => {
    setSelectedService(service);
    setShowBookingModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Available Services
        </h1>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="all">All Categories</option>
            <option value="automotive">Automotive</option>
            <option value="electrical">Electrical</option>
            <option value="plumbing">Plumbing</option>
          </select>
          <button className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700">
            <AdjustmentsHorizontalIcon className="mr-2 h-5 w-5" />
            Filters
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="rounded-lg border border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {service.serviceName}
                </h3>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                  {service.provider.serviceCategory}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
                {service.description}
              </p>
            </div>

            {/* Provider Info */}
            <div className="mb-4 rounded-lg bg-gray-50 p-3 dark:bg-slate-700/30">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900 dark:text-white">
                  {service.provider.businessName}
                </span>
                {service.provider.verified && (
                  <CheckBadgeIcon className="h-5 w-5 text-blue-500" />
                )}
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                  <MapPinIcon className="mr-1.5 h-5 w-5 flex-shrink-0" />
                  {service.provider.location}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                  <PhoneIcon className="mr-1.5 h-5 w-5 flex-shrink-0" />
                  {service.provider.phoneNumber}
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="mb-4 flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-500 dark:text-slate-400">
                <CurrencyDollarIcon className="mr-1.5 h-5 w-5" />
                {formatCurrency(service.price)}
              </div>
              <div className="flex items-center text-gray-500 dark:text-slate-400">
                <ClockIcon className="mr-1.5 h-5 w-5" />
                {service.duration}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 dark:border-slate-700">
              <button
                onClick={() => handleBookService(service)}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Book Service
              </button>
            </div>
          </div>
        ))}
      </div>

      {showBookingModal && selectedService && (
        <BookingModal
          service={selectedService}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedService(null);
            setBookingData({ date: '', time: '', notes: '' });
          }}
        />
      )}
    </div>
  );
};

export default Services;