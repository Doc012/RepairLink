import { useEffect, useState } from 'react';
import { Link, useNavigate, useRouteError } from 'react-router-dom';
import { 
  ExclamationTriangleIcon, 
  HomeIcon, 
  ArrowLeftIcon 
} from '@heroicons/react/24/outline';

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  // Get error information
  const errorStatus = error?.status || error?.statusCode || 500;
  const errorMessage = 
    error?.data?.message || 
    error?.message || 
    'Sorry, an unexpected error has occurred.';
  
  // Determine if it's a 404 or another error
  const is404 = errorStatus === 404;
  const errorTitle = is404 ? "Page Not Found" : "Unexpected Error";
  const errorDescription = is404 
    ? "We couldn't find the page you're looking for."
    : "We encountered an error while processing your request.";

  // Countdown to auto-redirect
  useEffect(() => {
    if (countdown <= 0) {
      navigate('/');
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <main className="flex flex-grow flex-col items-center justify-center px-6 py-16 sm:py-24">
        <div className="text-center">
          <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
            <ExclamationTriangleIcon className="h-12 w-12 text-amber-600 dark:text-amber-500" />
          </div>

          <p className="text-base font-semibold text-amber-600 dark:text-amber-500">Error {errorStatus}</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            {errorTitle}
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-slate-400">
            {errorDescription}
          </p>

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 rounded-md bg-slate-100 p-4 dark:bg-slate-800">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Error details (visible in development only):
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {errorMessage}
              </p>
            </div>
          )}

          <div className="mt-10">
            <p className="text-sm text-gray-500 dark:text-slate-500">
              Redirecting to home page in {countdown} seconds...
            </p>

            <div className="mt-5 flex flex-col items-center justify-center space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
              <button 
                onClick={() => navigate(-1)}
                className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                <ArrowLeftIcon className="mr-2 -ml-1 h-4 w-4" />
                Go Back
              </button>
              <Link 
                to="/" 
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                <HomeIcon className="mr-2 -ml-1 h-4 w-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
        &copy; {new Date().getFullYear()} RepairLink. All rights reserved.
      </footer>
    </div>
  );
};

export default ErrorPage;