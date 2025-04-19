import { Link } from 'react-router-dom';
import {
  WrenchScrewdriverIcon,
  BoltIcon,
  FireIcon,
  WrenchIcon,
  HomeModernIcon,
  UserGroupIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const iconMap = {
  Plumbing: WrenchScrewdriverIcon,
  Electrical: BoltIcon,
  HVAC: FireIcon,
  Appliance: WrenchIcon,
  Carpentry: HomeModernIcon,
  'General Handyman': UserGroupIcon,
};

const ServiceCard = ({ service }) => {
  const Icon = iconMap[service];

  return (
    <Link 
      to={`/services/${service.toLowerCase()}`}
      className="group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 dark:bg-slate-800"
    >
      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors dark:bg-blue-900 dark:group-hover:bg-blue-800">
        {Icon && <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-slate-100">{service}</h3>
      <p className="mt-2 text-gray-600 dark:text-slate-400">
        Professional {service.toLowerCase()} services for your home or business.
      </p>
    </Link>
  );
};

const StepCard = ({ step, title, description }) => {
  return (
    <div className="relative">
      <div className="relative z-10 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white dark:bg-blue-500">
          {step}
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-slate-400">
          {description}
        </p>
      </div>
      
      {/* Connector line for larger screens */}
      <div className="absolute top-1/2 left-full hidden w-full -translate-y-1/2 transform lg:block">
        <div className="h-0.5 w-full bg-blue-200 dark:bg-blue-800" />
      </div>
    </div>
  );
};

export { ServiceCard, StepCard };
export default StepCard;