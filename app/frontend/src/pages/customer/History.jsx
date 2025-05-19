import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarDaysIcon,
  BuildingStorefrontIcon,
  WrenchScrewdriverIcon,
  ClockIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  PhoneIcon, 
  MapPinIcon,
  XMarkIcon,
  StarIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { format, parseISO } from 'date-fns';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/auth/AuthContext';
import apiClient from '../../utils/apiClient';
import { publicAPI } from '../../services';

// Common image URL for all service cards
const SERVICE_IMAGE_URL = "https://www.ddkk.co.za/Portals/0/Images/Insights/6377.png";

// Add the RatingStars component
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

// Add the LoadingSkeleton component
const LoadingSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="sm:flex sm:items-center sm:justify-between">
      <div className="h-8 w-56 bg-gray-200 rounded dark:bg-slate-700"></div>
    </div>
    
    <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
      <div className="h-10 w-48 bg-gray-200 rounded dark:bg-slate-700"></div>
      <div className="flex gap-3">
        <div className="h-10 w-24 bg-gray-200 rounded dark:bg-slate-700"></div>
        <div className="h-10 w-24 bg-gray-200 rounded dark:bg-slate-700"></div>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="rounded-lg border border-gray-200 p-5 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <div className="h-6 w-32 bg-gray-200 rounded dark:bg-slate-700"></div>
            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-slate-700"></div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="h-5 w-5 mr-2 rounded bg-gray-200 dark:bg-slate-700"></div>
              <div className="h-4 w-2/3 bg-gray-200 rounded dark:bg-slate-700"></div>
            </div>
            <div className="flex items-center">
              <div className="h-5 w-5 mr-2 rounded bg-gray-200 dark:bg-slate-700"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded dark:bg-slate-700"></div>
            </div>
            <div className="flex items-center">
              <div className="h-5 w-5 mr-2 rounded bg-gray-200 dark:bg-slate-700"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded dark:bg-slate-700"></div>
            </div>
          </div>
          <div className="mt-4 h-8 bg-gray-200 rounded dark:bg-slate-700"></div>
        </div>
      ))}
    </div>
  </div>
);

// Add the ProviderProfileModal component
const ProviderProfileModal = ({ provider, onClose }) => {
  const [activeTab, setActiveTab] = useState('about');
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const [providerServices, setProviderServices] = useState([]);
  const [providerReviews, setProviderReviews] = useState([]);
  
  // Fetch provider details when modal opens
  useEffect(() => {
    const fetchProviderDetails = async () => {
      try {
        setIsLoadingDetails(true);
        
        // Fetch provider services
        const servicesResponse = await publicAPI.getProviderServices(provider.providerID);
        setProviderServices(servicesResponse.data || []);
        
        // Fetch provider reviews
        const reviewsResponse = await publicAPI.getProviderReviews(provider.providerID);
        setProviderReviews(reviewsResponse.data || []);
        
      } catch (err) {
        console.error("Failed to fetch provider details:", err);
        toast.error("Couldn't load provider details");
      } finally {
        setIsLoadingDetails(false);
      }
    };
    
    fetchProviderDetails();
  }, [provider.providerID]);
  
  // Calculate average rating from reviews
  const calculatedRating = providerReviews.length > 0
    ? (providerReviews.reduce((sum, review) => sum + (review.rating || 0), 0) / providerReviews.length).toFixed(1)
    : provider.rating || "0.0";

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
          <div className="px-6 pt-6 pb-4 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent">
            <div className="flex items-start space-x-4">
              <img
                src={provider.profilePicUrl || SERVICE_IMAGE_URL}
                alt={provider.businessName}
                className="h-24 w-24 rounded-lg object-cover shadow-md ring-2 ring-white dark:ring-slate-700"
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
                    <RatingStars rating={parseFloat(calculatedRating)} />
                    <span className="ml-2 text-sm text-gray-500 dark:text-slate-400">
                      ({providerReviews.length} reviews • {calculatedRating} stars)
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                    <MapPinIcon className="mr-1.5 h-5 w-5" />
                    {provider.location}
                  </div>
                </div>
                {provider.about && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-slate-400 line-clamp-2 max-w-lg">
                    {provider.about}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
            <div className="flex overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab('about')}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === 'about'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                <span className="flex items-center">
                  <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  About
                </span>
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === 'services'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                <span className="flex items-center">
                  <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Services {providerServices.length > 0 && <span className="ml-1 rounded-full bg-gray-100 dark:bg-slate-700 px-2 py-0.5 text-xs">{providerServices.length}</span>}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === 'reviews'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                <span className="flex items-center">
                  <StarIcon className="mr-2 h-5 w-5" />
                  Reviews {providerReviews.length > 0 && <span className="ml-1 rounded-full bg-gray-100 dark:bg-slate-700 px-2 py-0.5 text-xs">{providerReviews.length}</span>}
                </span>
              </button>
            </div>
          </div>

          {/* Tab content */}
          <div className="p-6">
            {isLoadingDetails ? (
              <div className="p-6 space-y-4">
                <div className="animate-pulse space-y-6">
                  {activeTab === 'services' ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="rounded-lg border border-gray-200 p-4 dark:border-slate-700">
                          <div className="h-5 w-2/3 bg-gray-200 rounded dark:bg-slate-700"></div>
                          <div className="mt-2 h-3 bg-gray-200 rounded dark:bg-slate-700"></div>
                          <div className="mt-1 h-3 w-3/4 bg-gray-200 rounded dark:bg-slate-700"></div>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="h-4 w-16 bg-gray-200 rounded dark:bg-slate-700"></div>
                            <div className="h-4 w-12 bg-gray-200 rounded dark:bg-slate-700"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : activeTab === 'reviews' ? (
                    <>
                      <div className="rounded-lg border border-gray-200 p-5 dark:border-slate-700">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="flex flex-col items-center sm:items-start">
                            <div className="h-10 w-16 bg-gray-200 rounded dark:bg-slate-700"></div>
                            <div className="mt-2 h-4 w-24 bg-gray-200 rounded dark:bg-slate-700"></div>
                          </div>
                        </div>
                      </div>
                      {[1, 2].map(i => (
                        <div key={i} className="rounded-lg border border-gray-200 p-4 dark:border-slate-700">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="h-5 w-32 bg-gray-200 rounded dark:bg-slate-700"></div>
                              <div className="mt-1 h-3 w-48 bg-gray-200 rounded dark:bg-slate-700"></div>
                            </div>
                            <div className="h-3 w-16 bg-gray-200 rounded dark:bg-slate-700"></div>
                          </div>
                          <div className="mt-3 h-12 bg-gray-200 rounded dark:bg-slate-700"></div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="rounded-lg border border-gray-200 p-5 dark:border-slate-700">
                          <div className="h-6 w-32 bg-gray-200 rounded dark:bg-slate-700"></div>
                          <div className="mt-4 h-4 bg-gray-200 rounded dark:bg-slate-700"></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : activeTab === 'about' ? (
              <div className="space-y-6">
                {/* About section */}
                <div className="rounded-lg border border-gray-200 p-5 dark:border-slate-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                    <svg className="h-5 w-5 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    About {provider.businessName}
                  </h3>
                  <div className="mt-4 text-gray-600 dark:text-slate-300 whitespace-pre-wrap prose max-w-none dark:prose-invert">
                    {provider.about ? (
                      <p>{provider.about}</p>
                    ) : (
                      <div className="text-center py-4 text-gray-500 dark:text-slate-400">
                        <p>No information provided by this service provider.</p>
                      </div>
                    )}
                  </div>
                  
                  {provider.verified && (
                    <div className="mt-4 flex items-center p-3 bg-blue-50 rounded-md dark:bg-blue-900/20">
                      <CheckBadgeIcon className="h-5 w-5 text-blue-500 mr-2" />
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        This provider has been verified by RepairLink, ensuring reliability and quality service.
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Contact information section */}
                <div className="rounded-lg border border-gray-200 p-5 dark:border-slate-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                    <svg className="h-5 w-5 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Contact Information
                  </h3>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-start">
                      <PhoneIcon className="h-5 w-5 mr-3 text-gray-500 dark:text-slate-400 mt-0.5" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Phone</div>
                        <a 
                          href={`tel:${provider.phoneNumber?.replace(/\s/g, '')}`} 
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {provider.phoneNumber || "Contact information not available"}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <EnvelopeIcon className="h-5 w-5 mr-3 text-gray-500 dark:text-slate-400 mt-0.5" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Business Email</div>
                        {provider.businessEmail ? (
                          <a 
                            href={`mailto:${provider.businessEmail}`} 
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {provider.businessEmail}
                          </a>
                        ) : (
                          <span className="text-gray-600 dark:text-slate-300">
                            Business email not provided
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start">
                      <GlobeAltIcon className="h-5 w-5 mr-3 text-gray-500 dark:text-slate-400 mt-0.5" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Website</div>
                        {provider.website ? (
                          <a 
                            href={provider.website.startsWith('http') ? provider.website : `https://${provider.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {provider.website}
                          </a>
                        ) : (
                          <span className="text-gray-600 dark:text-slate-300">
                            Website not available
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPinIcon className="h-5 w-5 mr-3 text-gray-500 dark:text-slate-400 mt-0.5" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Location</div>
                        <p className="text-gray-600 dark:text-slate-300">
                          {provider.location || "Location not specified"}
                        </p>
                        {provider.location && (
                          <a 
                            href={`https://maps.google.com/?q=${encodeURIComponent(provider.location)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline text-sm mt-1 inline-block"
                          >
                            View on Google Maps
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : activeTab === 'services' ? (
              <div className="space-y-6">
                {providerServices.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                    No services available for this provider.
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {providerServices.map((service) => (
                      <div
                        key={service.serviceID}
                        className="rounded-lg border border-gray-200 p-4 dark:border-slate-700 transition-all"
                      >
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {service.serviceName}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400 line-clamp-2">
                          {service.description}
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                            <ClockIcon className="mr-1.5 h-5 w-5" />
                            {service.duration}
                          </div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            ${service.price}
                          </div>
                        </div>
                        <Link
                          to={`/user/services`}
                          className="mt-3 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 inline-block text-center"
                        >
                          Book This Service
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : activeTab === 'reviews' ? (
              <div className="space-y-6">
                {/* Reviews Summary */}
                <div className="mb-6 rounded-lg border border-gray-200 p-5 dark:border-slate-700">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex flex-col items-center sm:items-start">
                      <div className="text-4xl font-bold text-gray-900 dark:text-white">
                        {calculatedRating}
                      </div>
                      <div className="mt-2">
                        <RatingStars rating={parseFloat(calculatedRating)} />
                      </div>
                      <div className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                        Based on {providerReviews.length} {providerReviews.length === 1 ? 'review' : 'reviews'}
                      </div>
                    </div>
                  </div>
                </div>
              
                {/* Reviews List */}
                {providerReviews.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                    <div className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium">No reviews yet</h3>
                    <p>Be the first to review this service provider</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {providerReviews.map((review) => (
                      <div
                        key={review.reviewID}
                        className="rounded-lg border border-gray-200 p-4 dark:border-slate-700"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {review.customerName || "Verified Customer"}
                            </div>
                            <div className="mt-1 text-sm text-gray-500 dark:text-slate-400 flex items-center">
                              <span className="mr-3">{review.serviceType || "Service"}</span>
                              <span className="flex items-center">
                                <RatingStars rating={review.rating || 0} />
                              </span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-slate-400">
                            {review.createdAt ? format(new Date(review.createdAt), 'MMM dd, yyyy') : ""}
                          </div>
                        </div>
                        <p className="mt-3 text-gray-600 dark:text-slate-300">
                          {review.comment || "No comment provided."}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Action buttons */}
          <div className="border-t border-gray-200 px-6 py-4 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500 dark:text-slate-400">
                {activeTab === 'services' ? 
                  `${providerServices.length} ${providerServices.length === 1 ? 'service' : 'services'} available` :
                  activeTab === 'reviews' ? 
                  `${calculatedRating} out of 5 stars from ${providerReviews.length} ${providerReviews.length === 1 ? 'review' : 'reviews'}` :
                  ''
                }
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                  Close
                </button>
                <Link
                  to="/user/services"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors flex items-center"
                >
                  <svg className="mr-1.5 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Book a Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Now modify the History component to use this modal
const History = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [customerID, setCustomerID] = useState(null);
  const [historyItems, setHistoryItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    timeframe: 'all', // all, lastMonth, lastYear
    sortBy: 'date-desc' // date-desc, date-asc
  });
  const [serviceDetails, setServiceDetails] = useState({});
  const [providerDetails, setProviderDetails] = useState({});
  // Add these state variables to manage the provider profile modal
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showProviderProfileModal, setShowProviderProfileModal] = useState(false);

  // Format date from ISO string
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (err) {
      return 'Invalid date';
    }
  };

  // Format time from ISO string
  const formatTime = (dateString) => {
    try {
      if (!dateString) return '';
      return format(parseISO(dateString), 'h:mm a');
    } catch (err) {
      return '';
    }
  };

  // Get customer ID from user email
  const fetchCustomerID = async (email) => {
    try {
      // Get user details by email
      const userResponse = await apiClient.get(`/v1/users/by-email/${email}`);
      const userData = userResponse.data;
      
      if (!userData || !userData.userID) {
        throw new Error('Failed to get user details');
      }
      
      // Get customer ID using userID
      const customerResponse = await apiClient.get(`/v1/customers/user/${userData.userID}`);
      const customerData = customerResponse.data;
      
      if (!customerData || !customerData.customerID) {
        throw new Error('Failed to get customer details');
      }
      
      setCustomerID(customerData.customerID);
      return customerData.customerID;
    } catch (err) {
      console.error('Error fetching customer ID:', err);
      throw err;
    }
  };

  // Fetch history data
  const fetchHistoryData = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      if (!user || !user.email) {
        throw new Error('User not authenticated');
      }
      
      // Get customer ID from user email
      const custID = customerID || await fetchCustomerID(user.email);
      
      if (!custID) {
        throw new Error('Customer ID not found');
      }

      // Fetch service history using customer ID
      const historyResponse = await apiClient.get(`/v1/service-history/customer/${custID}`);
      const history = historyResponse.data || [];
      
      // Create maps to store service and provider details
      const servicesMap = {};
      const providersMap = {};
      
      // Fetch details for each service and provider in history
      await Promise.all(history.map(async (item) => {
        // Fetch service details if not already fetched
        if (!servicesMap[item.serviceID]) {
          try {
            const serviceResponse = await apiClient.get(`/v1/services/${item.serviceID}`);
            servicesMap[item.serviceID] = serviceResponse.data;
          } catch (err) {
            console.warn(`Failed to fetch service details for ID ${item.serviceID}`, err);
            servicesMap[item.serviceID] = { serviceName: `Service #${item.serviceID}`, description: '', price: 0 };
          }
        }
        
        // Fetch provider details if not already fetched
        if (!providersMap[item.providerID]) {
          try {
            const providerResponse = await apiClient.get(`/v1/service-providers/${item.providerID}`);
            providersMap[item.providerID] = providerResponse.data;
          } catch (err) {
            console.warn(`Failed to fetch provider details for ID ${item.providerID}`, err);
            providersMap[item.providerID] = { businessName: `Provider #${item.providerID}`, location: '', phoneNumber: '' };
          }
        }
      }));
      
      // Store the fetched details
      setServiceDetails(servicesMap);
      setProviderDetails(providersMap);
      
      // Update history items
      setHistoryItems(history);
    } catch (err) {
      console.error('Error fetching history data:', err);
      setError('Failed to load service history. Please try again.');
      toast.error('Failed to load service history');
    } finally {
      setIsLoading(false);
      if (showRefreshIndicator) {
        setIsRefreshing(false);
        toast.success('History refreshed');
      }
    }
  };

  // Initial data load
  useEffect(() => {
    if (user && user.email) {
      fetchHistoryData();
    }
  }, [user]);

  // Filter history items based on search term and filters
  const filteredHistory = historyItems.filter(item => {
    // Apply search filter
    const serviceNameMatches = serviceDetails[item.serviceID]?.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const providerNameMatches = providerDetails[item.providerID]?.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    
    if (searchTerm && !serviceNameMatches && !providerNameMatches) {
      return false;
    }
    
    // Apply timeframe filter
    const date = new Date(item.serviceDate);
    const now = new Date();
    
    if (filters.timeframe === 'lastMonth') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);
      if (date < oneMonthAgo) return false;
    } else if (filters.timeframe === 'lastYear') {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(now.getFullYear() - 1);
      if (date < oneYearAgo) return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Apply sorting
    const dateA = new Date(a.serviceDate);
    const dateB = new Date(b.serviceDate);
    
    if (filters.sortBy === 'date-asc') {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });

  // Add a handler function to view provider profile
  const handleViewProviderProfile = async (providerID) => {
    try {
      // Fetch complete provider details
      const response = await apiClient.get(`/v1/service-providers/${providerID}`);
      setSelectedProvider(response.data);
      setShowProviderProfileModal(true);
    } catch (err) {
      console.error("Failed to fetch provider details:", err);
      toast.error("Couldn't load provider profile");
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header section with title and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center">
            <ClockIcon className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Service History</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
            Your complete service booking history
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => fetchHistoryData(true)}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <>
                <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />
                Refreshing
              </>
            ) : (
              <>
                <ArrowPathIcon className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <div className="flex">
            <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                {error}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Search and filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="relative max-w-xs">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
              placeholder="Search services or providers"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <div>
              <select
                value={filters.timeframe}
                onChange={(e) => setFilters({ ...filters, timeframe: e.target.value })}
                className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                <option value="all">All Time</option>
                <option value="lastMonth">Last Month</option>
                <option value="lastYear">Last Year</option>
              </select>
            </div>
            <div>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Showing results count */}
      {filteredHistory.length > 0 && (
        <p className="text-sm text-gray-500 dark:text-slate-400">
          Showing {filteredHistory.length} {filteredHistory.length === 1 ? 'service' : 'services'} from your history
        </p>
      )}

      {/* History cards grid */}
      {filteredHistory.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center dark:border-slate-700 dark:bg-slate-800">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center dark:bg-slate-700">
            <CalendarDaysIcon className="h-8 w-8 text-gray-400 dark:text-slate-400" />
          </div>
          <h3 className="mb-1 text-lg font-medium text-gray-900 dark:text-white">No service history found</h3>
          <p className="text-gray-500 dark:text-slate-400">
            {searchTerm || filters.timeframe !== 'all' 
              ? "Try adjusting your search or filters"
              : "You haven't booked any services yet"}
          </p>
          {(searchTerm || filters.timeframe !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilters({ timeframe: 'all', sortBy: 'date-desc' });
              }}
              className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <FunnelIcon className="mr-2 h-4 w-4" />
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHistory.map((item) => {
            const service = serviceDetails[item.serviceID] || {};
            const provider = providerDetails[item.providerID] || {};
            
            return (
              <div 
                key={item.historyID}
                className="rounded-lg border border-gray-200 bg-white overflow-hidden dark:border-slate-700 dark:bg-slate-800 shadow-sm transition-all hover:shadow-md"
              >
                <div className="relative h-32 overflow-hidden">
                  <img 
                    src={SERVICE_IMAGE_URL} 
                    alt={service.serviceName || "Service"} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 right-0 m-2">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      <CheckCircleIcon className="h-3 w-3 mr-1" />
                      Completed
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white line-clamp-1">
                    {service.serviceName || `Service #${item.serviceID}`}
                  </h3>
                  
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                      <BuildingStorefrontIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">
                        {provider.businessName || `Provider #${item.providerID}`}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                      <CalendarDaysIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>
                        {formatDate(item.serviceDate)}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                      <ClockIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>
                        {formatTime(item.serviceDate)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <button
                      onClick={() => handleViewProviderProfile(item.providerID)}
                      className="w-full inline-flex items-center justify-center rounded-md bg-blue-50 p-2 text-sm font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                    >
                      View Provider Profile
                      <ChevronRightIcon className="ml-1.5 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Provider Profile Modal */}
      {showProviderProfileModal && selectedProvider && (
        <ProviderProfileModal
          provider={selectedProvider}
          onClose={() => {
            setShowProviderProfileModal(false);
            setSelectedProvider(null);
          }}
        />
      )}
    </div>
  );
};

export default History;