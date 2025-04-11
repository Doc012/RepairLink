import { Link } from 'react-router-dom';
import { 
  WrenchScrewdriverIcon, // Plumbing
  BoltIcon, // Electrical
  FireIcon, // HVAC
  WrenchIcon, // Appliance
  HomeModernIcon, // Carpentry
  UserGroupIcon, // General Handyman
  PaintBrushIcon, // Painting
  ShieldCheckIcon, // Security Systems
  BeakerIcon, // Pool Services
  HomeIcon, // Roofing
  ComputerDesktopIcon, // Home Network
  DeviceTabletIcon, // Smart Home
  BugAntIcon, // Pest Control
  TruckIcon // Moving Services
} from '@heroicons/react/24/outline';

const iconMap = {
  'Plumbing': WrenchScrewdriverIcon,
  'Electrical': BoltIcon,
  'HVAC': FireIcon,
  'Appliance': WrenchIcon,
  'Carpentry': HomeModernIcon,
  'General Handyman': UserGroupIcon,
  'Painting': PaintBrushIcon,
  'Security Systems': ShieldCheckIcon,
  'Pool Services': BeakerIcon,
  'Roofing': HomeIcon,
  'Home Network': ComputerDesktopIcon,
  'Smart Home': DeviceTabletIcon,
  'Pest Control': BugAntIcon,
  'Moving Services': TruckIcon
};

const ServiceCategoryCard = ({ category }) => {
  const Icon = iconMap[category.name] || UserGroupIcon; // Fallback icon

  return (
    <Link 
      to={`/services/${category.slug}`}
      className="group flex flex-col rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-slate-800"
    >
      <div className="flex items-start gap-4">
        <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
          <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {category.name}
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {category.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {category.tags.map((tag) => (
              <span 
                key={tag}
                className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCategoryCard;