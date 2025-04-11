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
    <div className="relative flex flex-col items-center p-6 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
        <CheckCircleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        <span className="absolute -top-4 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-medium text-white">
          {step}
        </span>
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-slate-100">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-slate-400">{description}</p>
    </div>
  );
};

export { ServiceCard, StepCard };
export default StepCard;