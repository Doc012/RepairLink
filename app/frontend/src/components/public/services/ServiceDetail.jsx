import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { 
  StarIcon, 
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  BanknotesIcon // Replace CurrencyRandIcon with BanknotesIcon
} from '@heroicons/react/20/solid';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import Button from '../../common/Button'; // Fix the import path
import { serviceDetails } from '@/data/serviceDetails'; // Fix the import path

const ServiceDetail = () => {
  const { serviceSlug } = useParams();
  const [selectedTab, setSelectedTab] = useState(0);

  const service = serviceDetails[serviceSlug];

  // Add debug logging
  console.log('Service Slug:', serviceSlug);
  console.log('Service Details:', service);

  if (!service) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Service not found
          </h1>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            The service you're looking for doesn't exist or has been removed.
          </p>
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

  return (
    <div className="bg-gray-50 dark:bg-slate-900">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img
          src="https://pristineplumbing.com.au/wp-content/themes/pristineplumbing/assets/images/process_bg.png"
          alt={service.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        <div className="absolute inset-0 flex flex-col justify-center">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div>
              <Link 
                to="/services"
                className="inline-flex items-center text-sm text-white/90 hover:text-white"
              >
                <ChevronLeftIcon className="mr-2 h-5 w-5" />
                Back to Services
              </Link>
              <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
                {service.name}
              </h1>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 text-yellow-400" />
                  <span className="ml-1 text-white">
                    {service.rating} ({service.totalReviews} reviews)
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 text-white/90" />
                  <span className="ml-1 text-white/90">Multiple Locations</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-lg dark:prose-invert">
          <p>{service.description}</p>
        </div>

        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="mt-12 flex space-x-8 border-b border-slate-200 dark:border-slate-700">
            {['Providers', 'Features', 'Pricing', 'FAQs', 'Reviews'].map((tab) => (
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

          <Tab.Panels className="mt-8">
            {/* Providers Panel - Now First */}
            <Tab.Panel>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {service.providers.map((provider) => (
                  <div 
                    key={provider.id}
                    className="rounded-lg border border-slate-200 p-6 dark:border-slate-700"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-slate-900 dark:text-slate-100">
                        {provider.name}
                      </h3>
                      <div className="flex items-center">
                        <StarIcon className="h-5 w-5 text-yellow-400" />
                        <span className="ml-1 text-slate-900 dark:text-slate-100">
                          {provider.rating}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                      <MapPinIcon className="h-4 w-4" />
                      {provider.location}
                    </div>
                    <div className="mt-4 flex flex-col gap-2">
                      <Button 
                        to={`/providers/${provider.id}`}
                        variant="primary"
                        className="w-full justify-center"
                      >
                        View Services & Reviews
                      </Button>
                      {provider.available ? (
                        <p className="text-center text-xs text-green-600 dark:text-green-400">
                          ● Currently Available
                        </p>
                      ) : (
                        <p className="text-center text-xs text-red-600 dark:text-red-400">
                          ● Currently Unavailable
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Tab.Panel>

            {/* Features Panel - Now Second */}
            <Tab.Panel>
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    <span className="text-slate-600 dark:text-slate-400">{feature}</span>
                  </li>
                ))}
              </ul>
            </Tab.Panel>

            {/* Pricing Panel */}
            <Tab.Panel>
              <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                {service.pricing.map((item) => (
                  <li key={item.service} className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-slate-900 dark:text-slate-100">
                          {item.service}
                        </h3>
                        <div className="mt-1 flex items-center text-sm text-slate-500">
                          <ClockIcon className="mr-1.5 h-4 w-4" />
                          {item.duration}
                        </div>
                      </div>
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {item.priceRange}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-slate-500">
                * Prices may vary based on provider, location, and job complexity
              </p>
            </Tab.Panel>

            {/* FAQs Panel */}
            <Tab.Panel>
              <dl className="space-y-8">
                {service.faqs.map((faq) => (
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
            </Tab.Panel>

            {/* Reviews Panel */}
            <Tab.Panel>
              <div className="space-y-8">
                {service.reviews.map((review) => (
                  <div key={review.id} className="border-b border-slate-200 pb-8 dark:border-slate-700 last:border-0">
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
                  </div>
                ))}
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default ServiceDetail;