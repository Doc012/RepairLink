import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, CheckCircleIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { StarIcon } from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';

// Update the service interface to match backend data
const mockServices = [
  {
    serviceID: 1,
    serviceName: 'Plumbing Repair',
    description: 'Professional plumbing services for your home and business needs.',
    price: 350.00,
    duration: '1-2 hours',
    provider: {
      providerID: 1,
      businessName: 'PlumbPro Solutions',
      serviceCategory: 'Plumbing',
      location: 'Sandton, Gauteng',
      verified: true
    }
  },
  {
    serviceID: 2,
    serviceName: 'Electrical Installation',
    description: 'Professional electrical installations and repairs.',
    price: 450.00,
    duration: '2-3 hours',
    provider: {
      providerID: 2,
      businessName: 'ElectroTech Solutions',
      serviceCategory: 'Electrical',
      location: 'Rosebank, Johannesburg',
      verified: true
    }
  },
  {
    serviceID: 3,
    serviceName: 'Solar Panel Installation',
    description: 'Complete solar power system installation.',
    price: 15000.00,
    duration: '2-3 days',
    provider: {
      providerID: 3,
      businessName: 'SolarTech Pro',
      serviceCategory: 'Solar',
      location: 'Sandton, Gauteng',
      verified: true
    }
  },
  {
    serviceID: 4,
    serviceName: 'HVAC Maintenance',
    description: 'Professional air conditioning and heating system maintenance.',
    price: 550.00,
    duration: '2-4 hours',
    provider: {
      providerID: 4,
      businessName: 'CoolAir Pro',
      serviceCategory: 'HVAC',
      location: 'Midrand, Gauteng',
      verified: true
    }
  },
  {
    serviceID: 5,
    serviceName: 'Security System Installation',
    description: 'Complete home security system installation and setup.',
    price: 8500.00,
    duration: '1-2 days',
    provider: {
      providerID: 5,
      businessName: 'SecureHome Systems',
      serviceCategory: 'Security',
      location: 'Sandton, Gauteng',
      verified: true
    }
  },
  {
    serviceID: 6,
    serviceName: 'Carpentry Services',
    description: 'Custom woodworking and furniture repairs.',
    price: 750.00,
    duration: '4-6 hours',
    provider: {
      providerID: 6,
      businessName: 'WoodCraft Masters',
      serviceCategory: 'Carpentry',
      location: 'Rosebank, Johannesburg',
      verified: true
    }
  },
  {
    serviceID: 7,
    serviceName: 'Landscaping Design',
    description: 'Professional garden design and landscaping services.',
    price: 2500.00,
    duration: '3-5 days',
    provider: {
      providerID: 7,
      businessName: 'GreenScape Pro',
      serviceCategory: 'Landscaping',
      location: 'Bryanston, Johannesburg',
      verified: true
    }
  },
  {
    serviceID: 8,
    serviceName: 'Painting Services',
    description: 'Interior and exterior painting solutions.',
    price: 4500.00,
    duration: '2-3 days',
    provider: {
      providerID: 8,
      businessName: 'ColorMaster Painters',
      serviceCategory: 'Painting',
      location: 'Centurion, Pretoria',
      verified: false
    }
  },
  {
    serviceID: 9,
    serviceName: 'Roofing Repair',
    description: 'Professional roof repair and maintenance.',
    price: 3500.00,
    duration: '1-2 days',
    provider: {
      providerID: 9,
      businessName: 'TopRoof Solutions',
      serviceCategory: 'Roofing',
      location: 'Fourways, Johannesburg',
      verified: true
    }
  },
  {
    serviceID: 10,
    serviceName: 'Smart Home Installation',
    description: 'Complete smart home automation setup.',
    price: 12000.00,
    duration: '2-4 days',
    provider: {
      providerID: 10,
      businessName: 'SmartTech Pro',
      serviceCategory: 'Smart Home',
      location: 'Sandton, Gauteng',
      verified: true
    }
  },
  {
    serviceID: 11,
    serviceName: 'Bathroom Renovation',
    description: 'Full bathroom renovation and remodeling.',
    price: 45000.00,
    duration: '7-10 days',
    provider: {
      providerID: 11,
      businessName: 'LuxBath Renovations',
      serviceCategory: 'Renovation',
      location: 'Morningside, Johannesburg',
      verified: true
    }
  },
  {
    serviceID: 12,
    serviceName: 'Appliance Repair',
    description: 'Major appliance repair and maintenance.',
    price: 650.00,
    duration: '1-3 hours',
    provider: {
      providerID: 12,
      businessName: 'AppliancePro Fix',
      serviceCategory: 'Appliances',
      location: 'Randburg, Johannesburg',
      verified: false
    }
  }
];

// First, define services data outside the component
const allServices = [
  {
    name: 'Plumbing',
    slug: 'plumbing',
    description: 'Professional plumbing services for your home and business needs.',
    tags: ['Leak Repairs', 'Drain Cleaning', 'Geyser Installation', 'Bathroom Repairs'],
    rating: 4.9,
    totalReviews: 1250,
    icon: '🔧'
  },
  {
    name: 'Electrical',
    slug: 'electrical',
    description: 'Licensed electricians for all electrical installations and repairs.',
    tags: ['Wiring', 'Solar Installation', 'Lighting', 'Load Shedding Solutions'],
    rating: 4.8,
    totalReviews: 980,
    icon: '⚡'
  },
  // ... existing services ...
  {
    name: 'Solar Installation',
    slug: 'solar-installation',
    description: 'Professional solar panel installation and maintenance services.',
    tags: ['Panel Installation', 'Battery Systems', 'Inverters', 'Energy Consulting'],
    rating: 4.9,
    totalReviews: 320,
    icon: '☀️'
  },
  {
    name: 'Garage Door Services',
    slug: 'garage-doors',
    description: 'Installation and repair of garage doors and automation systems.',
    tags: ['Installation', 'Repairs', 'Automation', 'Maintenance'],
    rating: 4.6,
    totalReviews: 245,
    icon: '🚪'
  },
  {
    name: 'Window Services',
    slug: 'windows',
    description: 'Professional window installation, repair, and maintenance.',
    tags: ['Installation', 'Repairs', 'Double Glazing', 'Tinting'],
    rating: 4.7,
    totalReviews: 188,
    icon: '🪟'
  },
  {
    name: 'Locksmith',
    slug: 'locksmith',
    description: 'Professional locksmith services for homes and businesses.',
    tags: ['Lock Installation', 'Emergency Access', 'Security Systems', 'Key Cutting'],
    rating: 4.8,
    totalReviews: 412,
    icon: '🔐'
  },
  {
    name: 'Flooring',
    slug: 'flooring',
    description: 'Expert flooring installation and repair services.',
    tags: ['Wooden Floors', 'Tiles', 'Carpets', 'Vinyl'],
    rating: 4.7,
    totalReviews: 356,
    icon: '🏗️'
  },
  {
    name: 'Garden Services',
    slug: 'garden',
    description: 'Professional garden maintenance and landscaping services.',
    tags: ['Maintenance', 'Landscaping', 'Tree Services', 'Irrigation'],
    rating: 4.6,
    totalReviews: 289,
    icon: '🌿'
  },
  {
    name: 'Home Cleaning',
    slug: 'cleaning',
    description: 'Professional home and office cleaning services.',
    tags: ['Deep Cleaning', 'Regular Service', 'Window Cleaning', 'Carpet Cleaning'],
    rating: 4.5,
    totalReviews: 567,
    icon: '🧹'
  },
  {
    name: 'Waterproofing',
    slug: 'waterproofing',
    description: 'Expert waterproofing solutions for all surfaces.',
    tags: ['Roof Sealing', 'Damp Proofing', 'Wall Sealing', 'Basement Proofing'],
    rating: 4.8,
    totalReviews: 234,
    icon: '💧'
  }
];

const Services = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 9;

  // Memoized filtered services
  const filteredServices = React.useMemo(() => {
    return mockServices.filter(service => {
      const searchTerms = searchQuery.toLowerCase().trim();
      
      const matchesSearch = !searchTerms || 
        service.serviceName.toLowerCase().includes(searchTerms) ||
        service.description.toLowerCase().includes(searchTerms) ||
        service.provider.businessName.toLowerCase().includes(searchTerms);

      const matchesCategory = !selectedCategory || 
        service.provider.serviceCategory.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  const handleSearch = (value) => {
    setSearchQuery(value);
    // Clear category filter when searching
    setSelectedCategory(null);
    setCurrentPage(1);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === 'All' ? null : category);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setCurrentPage(1);
  };

  // Get unique categories for filter buttons
  const availableCategories = ['All', ...new Set(mockServices.map(service => 
    service.provider.serviceCategory
  ))];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = filteredServices.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = (currentPage, totalPages) => {
    const delta = 1; // Number of pages to show before and after current page
    const range = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift('...');
    }
    if (currentPage + delta < totalPages - 1) {
      range.push('...');
    }

    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Enhanced Hero Section */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img
          src="/src/assets/images/hero/repair-2.jpg"
          alt="Professional Services"
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
                Find trusted professionals for your home and business needs.
              </p>

              {/* Search Bar */}
              <div className="relative mt-8">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <MagnifyingGlassIcon className="h-5 w-5 text-white/60" />
                </div>
                <input
                  type="search"
                  className="block w-full rounded-xl border-2 border-white/20 bg-white/10 py-4 pl-11 pr-4 text-white backdrop-blur-sm placeholder:text-white/60 focus:border-white/30 focus:outline-none"
                  placeholder="Search services by name or category..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Filters */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Found {filteredServices.length} services
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {/* Category Filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          {availableCategories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category === 'All' ? null : category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* No Results Message */}
        {filteredServices.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-lg font-medium text-slate-900 dark:text-white">
              No services found
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Try adjusting your search or filters
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Services Grid - Keep your existing grid code here */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(9)].map((_, index) => (
              <div key={index} className="animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700 h-64" />
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {currentCategories.map((service) => (
              <motion.div 
                key={service.serviceID}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                        {service.serviceName}
                      </h3>
                      {service.provider.verified && (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                          <CheckCircleIcon className="mr-1 h-4 w-4" />
                          Verified
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      {service.description}
                    </p>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center text-slate-600 dark:text-slate-400">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm">{service.provider.location}</span>
                      </div>
                      <div className="flex items-center text-slate-600 dark:text-slate-400">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm">{service.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold text-slate-900 dark:text-white">
                        R{service.price.toFixed(2)}
                      </div>
                      <Link
                        to="/login"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
                      >
                        Book Now
                      </Link>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Provided by{' '}
                        <Link 
                          to={`/providers/${service.provider.providerID}`}
                          className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {service.provider.businessName}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Keep your existing pagination */}
        <div className="mt-12 flex items-center justify-center">
          <nav className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-800">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>

            <div className="hidden sm:flex">
              {getPageNumbers(
                currentPage,
                Math.ceil(filteredServices.length / itemsPerPage)
              ).map((pageNum, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (typeof pageNum === 'number') {
                      handlePageChange(pageNum);
                    }
                  }}
                  className={`${
                    pageNum === currentPage
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700'
                  } rounded-lg px-4 py-2 text-sm font-medium`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </nav>
        </div>

        {/* Mobile Pagination Info */}
        <div className="mt-4 text-center sm:hidden">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Services;
