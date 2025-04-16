import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  StarIcon,
  PhoneIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  CheckBadgeIcon,
  ClockIcon,
  CurrencyDollarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { formatCurrency } from '../../utils/formatCurrency';
import { format } from 'date-fns';

const CustomerProviders = () => {
  const [providers, setProviders] = useState([
    {
      providerID: 1,
      businessName: "Smith's Auto Repair",
      serviceCategory: "Automotive",
      location: "Sandton, Johannesburg",
      rating: 4.8,
      totalReviews: 156,
      verified: true,
      picUrl: "/src/assets/images/hero/repair-2.jpg"
    },
    {
      providerID: 2,
      businessName: "PowerTech Solutions",
      serviceCategory: "Electrical",
      location: "Rosebank, Johannesburg",
      rating: 4.9,
      totalReviews: 128,
      verified: true,
      picUrl: "/src/assets/images/hero/repair-2.jpg"
    },
    {
      providerID: 3,
      businessName: "Pro Plumbers SA",
      serviceCategory: "Plumbing",
      location: "Braamfontein, Johannesburg",
      rating: 4.7,
      totalReviews: 189,
      verified: true,
      picUrl: "/src/assets/images/hero/repair-2.jpg"
    },
    {
      providerID: 4,
      businessName: "Secure Tech Systems",
      serviceCategory: "Security",
      location: "Fourways, Johannesburg",
      rating: 4.6,
      totalReviews: 92,
      verified: true,
      picUrl: "/src/assets/images/hero/repair-2.jpg"
    },
    {
      providerID: 5,
      businessName: "Garden Masters",
      serviceCategory: "Landscaping",
      location: "Morningside, Johannesburg",
      rating: 4.5,
      totalReviews: 75,
      verified: true,
      picUrl: "/src/assets/images/hero/repair-2.jpg"
    },
    {
      providerID: 6,
      businessName: "BuildRight Construction",
      serviceCategory: "Construction",
      location: "Midrand, Johannesburg",
      rating: 4.8,
      totalReviews: 143,
      verified: true,
      picUrl: "/src/assets/images/hero/repair-2.jpg"
    }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    rating: 'all',
    location: 'all'
  });
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    notes: ''
  });

  useEffect(() => {
    // TODO: Fetch providers data
    setIsLoading(false);
  }, []);

  const RatingStars = ({ rating }) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          {star <= rating ? (
            <StarSolid className="h-4 w-4 text-yellow-400" />
          ) : (
            <StarIcon className="h-4 w-4 text-yellow-400" />
          )}
        </span>
      ))}
    </div>
  );

  const getProviderServices = (providerId) => [
    {
      id: 1,
      name: "Full Service",
      description: "Comprehensive service package including inspection and maintenance",
      price: 1299.99,
      duration: "3 hours"
    },
    {
      id: 2,
      name: "Quick Service",
      description: "Basic maintenance and quick inspection",
      price: 599.99,
      duration: "1 hour"
    },
    {
      id: 3,
      name: "Diagnostic Check",
      description: "Complete system diagnostic scan",
      price: 399.99,
      duration: "45 minutes"
    }
  ];

  const getProviderReviews = (providerId) => [
    {
      id: 1,
      customerName: "John D.",
      rating: 5,
      comment: "Excellent service! Very professional and quick turnaround time.",
      date: "2024-03-15",
      serviceType: "Full Service"
    },
    {
      id: 2,
      customerName: "Sarah M.",
      rating: 4,
      comment: "Good work, although slightly delayed. Quality was great though.",
      date: "2024-03-10",
      serviceType: "Quick Service"
    },
    {
      id: 3,
      customerName: "David K.",
      rating: 5,
      comment: "Very thorough and explained everything clearly. Will use again!",
      date: "2024-03-05",
      serviceType: "Diagnostic Check"
    }
  ];

  const ProviderProfileModal = ({ provider, onClose }) => {
    const [activeTab, setActiveTab] = useState('services');
    const services = getProviderServices(provider.providerID);
    const reviews = getProviderReviews(provider.providerID);

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          {/* Background overlay */}
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

          {/* Modal panel */}
          <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all dark:bg-slate-800 sm:my-8 sm:w-full sm:max-w-4xl sm:align-middle">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 dark:text-slate-400 dark:hover:text-slate-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            {/* Provider info */}
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-start space-x-4">
                <img
                  src={provider.picUrl}
                  alt={provider.businessName}
                  className="h-24 w-24 rounded-lg object-cover"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {provider.businessName}
                    </h2>
                    {provider.verified && (
                      <CheckBadgeIcon className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                    {provider.serviceCategory}
                  </p>
                  <div className="mt-2 flex items-center space-x-4">
                    <div className="flex items-center">
                      <RatingStars rating={provider.rating} />
                      <span className="ml-2 text-sm text-gray-500 dark:text-slate-400">
                        ({provider.totalReviews} reviews)
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                      <MapPinIcon className="mr-1.5 h-5 w-5" />
                      {provider.location}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-gray-200 dark:border-slate-700">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('services')}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === 'services'
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300'
                  }`}
                >
                  Services
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === 'reviews'
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300'
                  }`}
                >
                  Reviews
                </button>
                <button
                  onClick={() => setActiveTab('about')}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === 'about'
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300'
                  }`}
                >
                  About
                </button>
              </div>
            </div>

            {/* Tab content */}
            <div className="p-6">
              {activeTab === 'services' ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="rounded-lg border border-gray-200 p-4 dark:border-slate-700"
                    >
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {service.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                        {service.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                          <ClockIcon className="mr-1.5 h-5 w-5" />
                          {service.duration}
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(service.price)}
                        </div>
                      </div>
                      <button
                        onClick={() => handleServiceBook(service)}
                        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                      >
                        Book Now
                      </button>
                    </div>
                  ))}
                </div>
              ) : activeTab === 'reviews' ? (
                <div className="space-y-4">
                  {/* Reviews Summary */}
                  <div className="mb-6 flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-slate-700">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">
                          {provider.rating}
                        </div>
                        <RatingStars rating={provider.rating} />
                        <div className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                          {provider.totalReviews} reviews
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reviews List */}
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="rounded-lg border border-gray-200 p-4 dark:border-slate-700"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {review.customerName}
                          </div>
                          <div className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                            {review.serviceType}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-slate-400">
                          {review.date}
                        </div>
                      </div>
                      <div className="mt-2">
                        <RatingStars rating={review.rating} />
                      </div>
                      <p className="mt-2 text-gray-600 dark:text-slate-300">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-lg border border-gray-200 p-4 dark:border-slate-700">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Business Hours
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
                      Monday - Friday: 8:00 AM - 5:00 PM<br />
                      Saturday: 9:00 AM - 2:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4 dark:border-slate-700">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Contact Information
                    </h3>
                    <div className="mt-2 space-y-2 text-sm text-gray-500 dark:text-slate-400">
                      <div className="flex items-center">
                        <PhoneIcon className="mr-2 h-5 w-5" />
                        +27 11 234 5678
                      </div>
                      <div className="flex items-center">
                        <MapPinIcon className="mr-2 h-5 w-5" />
                        {provider.location}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="border-t border-gray-200 px-6 py-4 dark:border-slate-700">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const BookingModal = ({ provider, service, onClose }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setIsSubmitting(true);

      try {
        // Add your API call here
        // const response = await api.post('/bookings', {
        //   providerId: provider.providerID,
        //   serviceId: service.id,
        //   ...bookingData
        // });

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        onClose();
        // Add success notification here
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to create booking');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

          <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all dark:bg-slate-800 sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
            <form onSubmit={handleSubmit}>
              <div className="px-6 pt-6 pb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Book Service
                </h3>
                <div className="mt-4 space-y-4">
                  {/* Service Details */}
                  <div className="rounded-lg border border-gray-200 p-4 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {service.name}
                        </h4>
                        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                          {provider.businessName}
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
                      Date
                    </label>
                    <input
                      type="date"
                      min={format(new Date(), 'yyyy-MM-dd')}
                      value={bookingData.date}
                      onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                      required
                      className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                      Time
                    </label>
                    <select
                      value={bookingData.time}
                      onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                      required
                      className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    >
                      <option value="">Select a time</option>
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

  const handleViewProfile = (provider) => {
    setSelectedProvider(provider);
    setShowProfileModal(true);
  };

  const handleBookNow = (provider, service) => {
    setSelectedProvider(provider);
    setSelectedService(service);
    setShowBookingModal(true);
  };

  const handleServiceBook = (service) => {
    setSelectedService(service);
    setShowBookingModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Service Providers
        </h1>
        <button
          onClick={() => document.getElementById('filters').classList.toggle('hidden')}
          className="mt-4 inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 mr-14 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 sm:mt-0"
        >
          <AdjustmentsHorizontalIcon className="mr-2 h-5 w-5" />
          Filters
        </button>
      </div>

      {/* Search and Filters */}
      <div id="filters" className="space-y-4">
        <div className="relative">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search providers..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="rounded-lg border border-gray-300 px-4 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          >
            <option value="all">All Categories</option>
            <option value="automotive">Automotive</option>
            <option value="electrical">Electrical</option>
            <option value="plumbing">Plumbing</option>
            <option value="security">Security</option>
            <option value="landscaping">Landscaping</option>
            <option value="construction">Construction</option>
          </select>

          <select
            value={filters.rating}
            onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
            className="rounded-lg border border-gray-300 px-4 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          >
            <option value="all">All Ratings</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
          </select>

          <select
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="rounded-lg border border-gray-300 px-4 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          >
            <option value="all">All Locations</option>
            <option value="sandton">Sandton</option>
            <option value="rosebank">Rosebank</option>
            <option value="braamfontein">Braamfontein</option>
            <option value="fourways">Fourways</option>
            <option value="morningside">Morningside</option>
            <option value="midrand">Midrand</option>
          </select>
        </div>
      </div>

      {/* Providers Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full text-center">Loading...</div>
        ) : providers.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 dark:text-slate-400">
            No service providers found.
          </div>
        ) : (
          providers.map((provider) => (
            <div
              key={provider.providerID}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={provider.picUrl || '/images/provider-placeholder.jpg'}
                  alt={provider.businessName}
                  className="h-48 w-full object-cover"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {provider.businessName}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                      {provider.serviceCategory}
                    </p>
                  </div>
                  {provider.verified && (
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                      Verified
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-center space-x-2">
                  <RatingStars rating={provider.rating || 0} />
                  <span className="text-sm text-gray-500 dark:text-slate-400">
                    ({provider.totalReviews || 0} reviews)
                  </span>
                </div>

                <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-slate-400">
                  <MapPinIcon className="mr-1.5 h-5 w-5 flex-shrink-0" />
                  {provider.location}
                </div>

                <div className="mt-6">
                  <Link
                    onClick={(e) => {
                      e.preventDefault();
                      handleViewProfile(provider);
                    }}
                    to={`/providers/${provider.providerID}`}
                    className="block w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showProfileModal && selectedProvider && (
        <ProviderProfileModal
          provider={selectedProvider}
          onClose={() => {
            setShowProfileModal(false);
            setSelectedProvider(null);
          }}
        />
      )}

      {showBookingModal && selectedProvider && selectedService && (
        <BookingModal
          provider={selectedProvider}
          service={selectedService}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedProvider(null);
            setSelectedService(null);
            setBookingData({ date: '', time: '', notes: '' });
          }}
        />
      )}
    </div>
  );
};

export default CustomerProviders;