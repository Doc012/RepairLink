import { useParams, Link } from 'react-router-dom';
import { useState } from 'react'; // Add this import
import { Tab } from '@headlessui/react';
import { 
  StarIcon, 
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  CheckBadgeIcon
} from '@heroicons/react/20/solid';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import Button from '@/components/common/Button';
import { serviceDetails } from '@/data/serviceDetails';

const getProviderHeroImage = (provider) => {
  // Default images for each service type
  const images = {
    plumbing: "https://fabianservices.co.za/wp-content/uploads/2024/06/Plumbing-Image-1.jpg",
    electrical: "https://pristineplumbing.com.au/wp-content/themes/pristineplumbing/assets/images/process_bg.png"
  };

  // Provider-specific images
  const providerImages = {
    // Plumbing providers
    1: images.plumbing, // Master Plumbing Solutions
    2: images.electrical, // Cape Town Plumbing Pros
    3: images.plumbing, // Durban Plumbing Services
    4: images.electrical, // Pretoria Plumbers
    // Electrical providers
    5: images.plumbing, // PowerTech Electrical
    6: images.electrical, // Solar Solutions SA
    7: images.plumbing, // Cape Electrical Experts
    8: images.electrical, // Pretoria Electrical Services
    9: images.plumbing  // East Coast Electricians
  };

  return providerImages[provider.id] || images.plumbing; // Fallback to plumbing image
};

const ProviderDetail = () => {
  const { providerId } = useParams();
  const [selectedTab, setSelectedTab] = useState(0);

  // Find provider across all services
  const provider = Object.values(serviceDetails)
    .flatMap(service => service.providers)
    .find(p => p.id.toString() === providerId);

  if (!provider) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Provider not found
          </h1>
          <Link 
            to="/services" 
            className="mt-8 inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            View All Services
          </Link>
        </div>
      </div>
    );
  }

  // Find all services offered by this provider
  const providerServices = Object.entries(serviceDetails)
    .filter(([_, service]) => 
      service.providers.some(p => p.id === provider.id)
    )
    .map(([slug, service]) => ({
      slug,
      ...service
    }));

  return (
    <div className="bg-gray-50 dark:bg-slate-900">
      {/* Hero Section with Background */}
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={getProviderHeroImage(provider)}
          alt={provider.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        <div className="absolute inset-0 flex flex-col justify-end pb-8">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-start justify-between">
              <div>
                <Link 
                  to="/services"
                  className="inline-flex items-center text-sm text-white/90 hover:text-white"
                >
                  <ChevronLeftIcon className="mr-2 h-5 w-5" />
                  Back to Services
                </Link>
                <h1 className="mt-4 text-4xl font-bold text-white">
                  {provider.name}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <div className="flex items-center">
                    <StarIcon className="h-5 w-5 text-yellow-400" />
                    <span className="ml-1 text-white">
                      {provider.rating} ({provider.reviews?.length || 0} reviews)
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="h-5 w-5 text-white/90" />
                    <span className="ml-1 text-white/90">
                      {provider.location}
                    </span>
                  </div>
                  {provider.available ? (
                    <span className="inline-flex items-center rounded-full bg-green-500/20 px-3 py-1 text-sm font-medium text-green-400">
                      <CheckBadgeIcon className="mr-1.5 h-5 w-5" />
                      Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-red-500/20 px-3 py-1 text-sm font-medium text-red-400">
                      Unavailable
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
            <Tab.List className="flex space-x-8">
              {['Services', 'Pricing', 'Reviews', 'FAQs', 'Contact'].map((tab) => (
                <Tab
                  key={tab}
                  className={({ selected }) =>
                    `border-b-2 py-4 text-sm font-medium outline-none ${
                      selected
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-800 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-300'
                    }`
                  }
                >
                  {tab}
                </Tab>
              ))}
            </Tab.List>
            
            <Button 
              to={`/book/provider/${provider.id}`}
              variant="primary"
              className="px-6 py-2"
              disabled={!provider.available}
            >
              Book Now
            </Button>
          </div>

          <Tab.Panels className="mt-8">
            {/* Services Panel */}
            <Tab.Panel>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {providerServices.map((service) => (
                  <Link 
                    key={service.slug}
                    to={`/services/${service.slug}`}
                    className="group rounded-lg border border-slate-200 p-6 hover:border-blue-600 dark:border-slate-700 dark:hover:border-blue-500"
                  >
                    <h3 className="font-medium text-slate-900 dark:text-slate-100">
                      {service.name}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      {service.description}
                    </p>
                    <div className="mt-4">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        View Details →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </Tab.Panel>

            {/* Pricing Panel */}
            <Tab.Panel>
              <div className="space-y-6">
                <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-800">
                  <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                    Our Pricing
                  </h3>
                  <ul className="mt-6 divide-y divide-slate-200 dark:divide-slate-700">
                    {provider.pricing?.map((item) => (
                      <li key={item.service} className="py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-slate-100">
                              {item.service}
                            </h4>
                            <div className="mt-1 flex items-center text-sm text-slate-500">
                              <ClockIcon className="mr-1.5 h-4 w-4" />
                              {item.duration}
                            </div>
                          </div>
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            {item.price}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm text-slate-500">
                    * Final price may vary based on job complexity and materials required
                  </p>
                </div>
              </div>
            </Tab.Panel>

            {/* Updated Reviews Panel */}
            <Tab.Panel>
              <div className="space-y-8">
                {provider.reviews?.length > 0 ? (
                  <>
                    <div className="mb-8 rounded-lg bg-white p-6 dark:bg-slate-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <StarIcon className="h-8 w-8 text-yellow-400" />
                            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                              {provider.rating}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                            Based on {provider.reviews.length} reviews
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            Overall Rating
                          </div>
                          <div className="mt-1 flex items-center justify-end">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`h-5 w-5 ${
                                  i < Math.round(provider.rating)
                                    ? 'text-yellow-400'
                                    : 'text-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    {provider.reviews.map((review) => (
                      <div 
                        key={review.id} 
                        className="border-b border-slate-200 pb-8 dark:border-slate-700 last:border-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-slate-900 dark:text-slate-100">
                              {review.author}
                            </h3>
                            <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                              <MapPinIcon className="h-4 w-4" />
                              {review.location}
                            </div>
                          </div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`h-5 w-5 ${
                                  i < review.rating ? 'text-yellow-400' : 'text-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mt-4 text-slate-600 dark:text-slate-400">
                          {review.comment}
                        </p>
                        <div className="mt-2 text-sm text-slate-500">
                          {new Date(review.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-center text-slate-600 dark:text-slate-400">
                    No reviews available yet.
                  </div>
                )}
              </div>
            </Tab.Panel>

            {/* FAQs Panel */}
            <Tab.Panel>
              <div className="space-y-6">
                <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-800">
                  <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                    Frequently Asked Questions
                  </h3>
                  <dl className="mt-6 space-y-6">
                    {provider.faqs?.map((faq) => (
                      <div key={faq.question} className="group">
                        <dt className="font-medium text-slate-900 dark:text-slate-100">
                          {faq.question}
                        </dt>
                        <dd className="mt-2 text-slate-600 dark:text-slate-400">
                          {faq.answer}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </Tab.Panel>

            {/* Contact Panel */}
            <Tab.Panel>
              <div className="max-w-2xl rounded-lg border border-slate-200 p-6 dark:border-slate-700">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                  Contact Information
                </h3>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-400">
                      {provider.phone || '+27 (0) 11 234 5678'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <EnvelopeIcon className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-400">
                      {provider.email || 'contact@example.com'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ClockIcon className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-400">
                      {provider.hours || 'Monday - Friday: 8:00 AM - 5:00 PM'}
                    </span>
                  </div>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default ProviderDetail;