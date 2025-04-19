import { CheckBadgeIcon, ShieldCheckIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline';

const iconMap = {
  verified: CheckBadgeIcon,
  secure: ShieldCheckIcon,
  quick: ClockIcon,
  quality: StarIcon,
};

const FeatureCard = ({ title, description, icon }) => {
  const Icon = iconMap[icon];

  return (
    <div className="flex flex-col items-start p-6 bg-white rounded-lg shadow-sm dark:bg-slate-800">
      <div className="p-3 bg-blue-100 rounded-lg dark:bg-blue-900">
        <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-slate-100">
        {title}
      </h3>
      <p className="mt-2 text-gray-600 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;