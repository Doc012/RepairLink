import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

const ServiceCard = ({ service }) => {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      <div className={`absolute right-0 top-0 h-24 w-24 translate-x-8 translate-y-[-8] transform ${service.bgColor} rounded-full transition-transform group-hover:translate-x-6 group-hover:translate-y-[-6]`} />
      
      <div className="relative">
        <span className="mb-4 inline-block text-4xl">{service.icon}</span>
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          {service.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-slate-400">
          {service.description}
        </p>
        <div className="mt-4">
          <Link
            to={`/services/${service.name?.toLowerCase()}`}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Learn more
            <ChevronRightIcon className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;