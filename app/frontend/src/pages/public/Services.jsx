import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import ServiceCategoryCard from '../../components/public/services/ServiceCategoryCard';
import { Link } from 'react-router-dom';
import { serviceDetails } from '@/data/serviceDetails';
import { MapPinIcon, StarIcon } from '@heroicons/react/20/solid';

const Services = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const categories = [
    {
      name: 'Plumbing',
      slug: 'plumbing',
      description: 'Professional plumbing services for your home and business needs.',
      tags: ['Leak Repairs', 'Drain Cleaning', 'Geyser Installation', 'Bathroom Repairs']
    },
    {
      name: 'Electrical',
      slug: 'electrical',
      description: 'Licensed electricians for all electrical installations and repairs.',
      tags: ['Wiring', 'Solar Installation', 'Lighting', 'Load Shedding Solutions']
    },
    {
      name: 'HVAC',
      slug: 'hvac',
      description: 'Complete heating, ventilation, and air conditioning services.',
      tags: ['AC Repair', 'Heating Systems', 'Maintenance', 'Installation']
    },
    {
      name: 'Appliance',
      slug: 'appliance',
      description: 'Expert repair services for all major household appliances.',
      tags: ['Washing Machine', 'Refrigerator', 'Dishwasher', 'Stove']
    },
    {
      name: 'Carpentry',
      slug: 'carpentry',
      description: 'Custom carpentry and woodworking services.',
      tags: ['Furniture', 'Cabinets', 'Doors', 'Wood Repairs']
    },
    {
      name: 'General Handyman',
      slug: 'general-handyman',
      description: 'Versatile handyman services for various home repairs.',
      tags: ['Maintenance', 'Repairs', 'Installation', 'Home Improvement']
    },
    {
      name: 'Painting',
      slug: 'painting',
      description: 'Professional painting services for interior and exterior surfaces.',
      tags: ['Interior Painting', 'Exterior Painting', 'Waterproofing', 'Wall Repairs']
    },
    {
      name: 'Security Systems',
      slug: 'security-systems',
      description: 'Installation and maintenance of home and business security systems.',
      tags: ['CCTV', 'Alarm Systems', 'Access Control', 'Electric Fencing']
    },
    {
      name: 'Pool Services',
      slug: 'pool-services',
      description: 'Complete swimming pool maintenance and repair services.',
      tags: ['Pool Cleaning', 'Pump Repairs', 'Filter Maintenance', 'Chemical Balance']
    },
    {
      name: 'Roofing',
      slug: 'roofing',
      description: 'Professional roof repairs and installation services.',
      tags: ['Leak Repairs', 'Tile Replacement', 'Waterproofing', 'Gutters']
    },
    {
      name: 'Home Network',
      slug: 'home-network',
      description: 'Internet and home network installation services.',
      tags: ['WiFi Setup', 'Network Cabling', 'Router Configuration', 'Troubleshooting']
    },
    {
      name: 'Smart Home',
      slug: 'smart-home',
      description: 'Smart home device installation and configuration.',
      tags: ['Smart Lighting', 'Security Cameras', 'Home Automation', 'Smart Thermostats']
    },
    {
      name: 'Pest Control',
      slug: 'pest-control',
      description: 'Professional pest control and prevention services.',
      tags: ['Insect Control', 'Rodent Control', 'Fumigation', 'Prevention']
    },
    {
      name: 'Moving Services',
      slug: 'moving-services',
      description: 'Professional moving and relocation services.',
      tags: ['Local Moving', 'Packing', 'Furniture Assembly', 'Storage']
    }
  ];

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero Section */}
      <div className="relative h-[500px] w-full overflow-hidden">
        <img
          src="https://pristineplumbing.com.au/wp-content/themes/pristineplumbing/assets/images/process_bg.png"
          alt="Our Services"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col justify-center">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
                Professional Services
              </h1>
              <p className="mt-6 text-lg text-white/90 sm:text-xl">
                Find trusted professionals for your home and business needs. From plumbing to electrical work, we've got you covered.
              </p>
              
              {/* Search Bar */}
              <div className="relative mt-8">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="search"
                  className="block w-full rounded-xl border-0 bg-white/10 py-4 pl-11 pr-4 text-white backdrop-blur-sm placeholder:text-white/60 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Quick Categories */}
              <div className="mt-6 flex flex-wrap items-center gap-2">
                {['Plumbing', 'Electrical', 'HVAC', 'Appliance'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSearchQuery(category)}
                    className="rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="relative z-10">
        {/* Featured Services Section */}
        <section className="bg-white py-16 dark:bg-slate-800/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 border-l-4 border-blue-600 pl-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Featured Services
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Browse our most popular service categories
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {currentCategories.map((category) => (
                <ServiceCategoryCard key={category.slug} category={category} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border ${
                      currentPage === index + 1
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                >
                  Next
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* All Services Section */}
        <section className="border-t border-slate-200 bg-slate-50/80 py-16 dark:border-slate-600 dark:bg-slate-900/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 border-l-4 border-blue-600 pl-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                All Services
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Explore our complete range of professional services
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {Object.entries(serviceDetails).map(([slug, service]) => (
                <Link
                  key={slug}
                  to={`/services/${slug}`}
                  className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-blue-600 hover:shadow-lg dark:border-slate-600 dark:bg-slate-800 dark:hover:border-blue-500 dark:hover:shadow-blue-500/10"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                        {service.name}
                      </h3>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center">
                      <StarIcon className="h-5 w-5 text-yellow-400" />
                      <span className="ml-1 text-sm text-slate-600 dark:text-slate-400">
                        {service.rating} ({service.totalReviews} reviews)
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPinIcon className="h-5 w-5 text-slate-400" />
                      <span className="ml-1 text-sm text-slate-600 dark:text-slate-400">
                        Multiple Locations
                      </span>
                    </div>
                  </div>
                  <span className="mt-4 inline-flex text-sm font-medium text-blue-600 group-hover:underline dark:text-blue-400">
                    View Details →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Services;
