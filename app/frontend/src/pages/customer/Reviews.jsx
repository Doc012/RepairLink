import { useState, useEffect } from 'react';
import { 
  StarIcon,
  BuildingStorefrontIcon,
  CalendarDaysIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      bookingId: 101,
      serviceName: "Full Car Service",
      provider: {
        name: "Smith's Auto Repair",
        location: "Johannesburg"
      },
      rating: 5,
      comment: "Excellent service! Very professional and thorough work.",
      createdAt: "2024-04-10",
      serviceDate: "2024-04-08"
    },
    {
      id: 2,
      bookingId: 102,
      serviceName: "Brake Replacement",
      provider: {
        name: "AutoMech Pro",
        location: "Pretoria"
      },
      rating: 4,
      comment: "Good service, slightly delayed but quality work.",
      createdAt: "2024-04-05",
      serviceDate: "2024-04-03"
    }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('submitted');

  useEffect(() => {
    // TODO: Fetch reviews data
    setIsLoading(false);
  }, []);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span key={index}>
        {index < rating ? (
          <StarIconSolid className="h-5 w-5 text-yellow-400" />
        ) : (
          <StarIcon className="h-5 w-5 text-gray-300 dark:text-gray-600" />
        )}
      </span>
    ));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">My Reviews</h1>
      </div>

      <div className="mt-8 border-b border-gray-200 dark:border-slate-700">
        <nav className="-mb-px flex space-x-8">
          {['submitted', 'pending'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors
                ${activeTab === tab
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-300'
                }
              `}
            >
              {tab === 'submitted' ? 'Submitted Reviews' : 'Pending Reviews'}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6 space-y-8">
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : activeTab === 'submitted' ? (
          reviews.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-slate-400">
              You haven't submitted any reviews yet.
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="overflow-hidden rounded-lg bg-white shadow dark:bg-slate-800"
              >
                <div className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {review.serviceName}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                        {review.provider.name}
                      </p>
                    </div>
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-slate-400">
                    <div className="flex items-center">
                      <BuildingStorefrontIcon className="mr-1.5 h-5 w-5" />
                      {review.provider.name}
                    </div>
                    <div className="flex items-center">
                      <CalendarDaysIcon className="mr-1.5 h-5 w-5" />
                      {review.serviceDate}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <ChatBubbleLeftIcon className="mt-1 h-5 w-5 flex-shrink-0 text-gray-400" />
                      <p className="text-sm text-gray-500 dark:text-slate-400">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-gray-200 pt-4 dark:border-slate-700">
                    <div className="flex justify-end space-x-2">
                      <button className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">
                        Edit Review
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )
        ) : (
          pendingReviews.map((booking) => (
            <div
              key={booking.bookingID}
              className="overflow-hidden rounded-lg bg-white shadow dark:bg-slate-800"
            >
              <div className="px-6 py-4">
                <div className="sm:flex sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {booking.serviceName}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                      {booking.providerName}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                      Service completed on {new Date(booking.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => {/* Handle review submission */}}
                    className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 sm:mt-0"
                  >
                    Write Review
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomerReviews;