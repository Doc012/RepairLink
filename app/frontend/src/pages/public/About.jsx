import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HomeIcon, 
  ShieldCheckIcon, 
  UserGroupIcon, 
  ClockIcon,
  ChartBarIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const stats = [
  { id: 1, name: 'Service Providers', value: '500+', icon: UserGroupIcon },
  { id: 2, name: 'Cities Covered', value: '25+', icon: BuildingOfficeIcon },
  { id: 3, name: 'Completed Jobs', value: '10,000+', icon: ChartBarIcon },
  { id: 4, name: 'Customer Rating', value: '4.8/5', icon: ShieldCheckIcon },
];

const values = [
  {
    name: 'Trust & Safety',
    description: 'All service providers are thoroughly vetted and continuously monitored for quality.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Convenience',
    description: 'Book services at your convenience with our easy-to-use platform.',
    icon: ClockIcon,
  },
  {
    name: 'Quality Service',
    description: 'We maintain high standards through regular quality checks and customer feedback.',
    icon: HomeIcon,
  },
];

const About = () => {
  const [activeSection, setActiveSection] = useState('about');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-blue-100/20 dark:from-blue-900/20">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
              Connecting Communities Through Quality Service
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              RepairLink is revolutionizing how people connect with trusted service professionals. 
              Our platform ensures quality, reliability, and peace of mind for all your home service needs.
            </p>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-gray-50 dark:from-slate-900"></div>
      </div>

      {/* Stats Section */}
      <div className="mx-auto -mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="relative overflow-hidden rounded-lg bg-white p-6 shadow-sm transition hover:shadow-md dark:bg-slate-800"
              >
                <dt>
                  <div className="absolute rounded-md bg-blue-500/10 p-3 dark:bg-blue-500/20">
                    <stat.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="ml-16 truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.name}
                  </p>
                </dt>
                <dd className="ml-16 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </dd>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Mission & Process */}
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              At RepairLink, we're transforming the home services industry by creating a 
              reliable bridge between skilled professionals and homeowners. Our platform 
              ensures transparency, quality, and convenience in every service booking.
            </p>
            <div className="mt-8">
              <Link
                to="/services"
                className="inline-flex items-center rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:hover:bg-blue-500"
              >
                Explore Our Services
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">How It Works</h2>
            <div className="space-y-4">
              {[
                "Describe your service need through our intuitive platform",
                "Get matched with verified professionals in your area",
                "Compare quotes and book appointments at your convenience",
                "Enjoy quality service backed by our satisfaction guarantee"
              ].map((step, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white">
                    {index + 1}
                  </span>
                  <span className="text-lg text-gray-600 dark:text-gray-300">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mt-24">
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
            Our Core Values
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.name}
                className="relative rounded-2xl bg-white p-8 shadow-sm transition hover:shadow-md dark:bg-slate-800"
              >
                <div className="absolute -top-4 left-4 inline-block rounded-xl bg-blue-600 p-3 shadow-lg">
                  <value.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                  {value.name}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;