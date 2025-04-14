import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  StarIcon, 
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  BriefcaseIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/20/solid';
import { motion } from 'framer-motion';

// Mock data for professionals
const professionals = [
  {
    id: 1,
    name: 'PlumbPro Solutions',
    title: 'Professional Plumbing Services',
    image: 'https://pristineplumbing.com.au/wp-content/themes/pristineplumbing/assets/images/process_bg.png',
    rating: 4.9,
    reviews: 127,
    location: 'Sandton, Gauteng',
    specialties: ['Emergency Repairs', 'Installation', 'Maintenance'],
    available: true,
    experience: '15+ years',
    verification: 'Licensed & Insured',
  },
  {
    id: 2,
    name: 'ElectroTech Services',
    title: 'Certified Electrical Contractors',
    image: 'https://pristineplumbing.com.au/wp-content/themes/pristineplumbing/assets/images/process_bg.png',
    rating: 4.8,
    reviews: 95,
    location: 'Rosebank, Johannesburg',
    specialties: ['Electrical Installation', 'Solar Systems', 'Load Shedding Solutions'],
    available: true,
    experience: '12+ years',
    verification: 'Licensed & Certified',
  },
  {
    id: 3,
    name: 'CoolAir HVAC Systems',
    title: 'Air Conditioning Specialists',
    image: 'https://pristineplumbing.com.au/wp-content/themes/pristineplumbing/assets/images/process_bg.png',
    rating: 4.7,
    reviews: 83,
    location: 'Pretoria East',
    specialties: ['AC Installation', 'Heating Systems', 'Ventilation'],
    available: false,
    experience: '10+ years',
    verification: 'HVAC Certified',
  },
  {
    id: 4,
    name: 'SecureHome Solutions',
    title: 'Security Systems Experts',
    image: 'https://pristineplumbing.com.au/wp-content/themes/pristineplumbing/assets/images/process_bg.png',
    rating: 4.9,
    reviews: 156,
    location: 'Centurion',
    specialties: ['CCTV Installation', 'Access Control', 'Electric Fencing'],
    available: true,
    experience: '8+ years',
    verification: 'PSIRA Registered',
  },
  {
    id: 5,
    name: 'MasterCraft Carpentry',
    title: 'Custom Woodworking Services',
    image: 'https://pristineplumbing.com.au/wp-content/themes/pristineplumbing/assets/images/process_bg.png',
    rating: 4.8,
    reviews: 72,
    location: 'Midrand',
    specialties: ['Custom Furniture', 'Kitchen Cabinets', 'Wood Repairs'],
    available: true,
    experience: '20+ years',
    verification: 'Master Craftsman',
  },
  {
    id: 6,
    name: 'SolarTech Solutions',
    title: 'Solar Power Specialists',
    image: 'https://pristineplumbing.com.au/wp-content/themes/pristineplumbing/assets/images/process_bg.png',
    rating: 4.9,
    reviews: 142,
    location: 'Fourways, Johannesburg',
    specialties: ['Solar Installation', 'Battery Systems', 'Inverter Setup'],
    available: true,
    experience: '8+ years',
    verification: 'Solar Certified',
  },
  {
    id: 7,
    name: 'SafeLock Security',
    title: 'Professional Locksmith Services',
    image: 'https://pristineplumbing.com.au/wp-content/themes/pristineplumbing/assets/images/process_bg.png',
    rating: 4.7,
    reviews: 98,
    location: 'Bryanston, Johannesburg',
    specialties: ['Lock Installation', 'Emergency Access', 'Security Systems'],
    available: true,
    experience: '10+ years',
    verification: 'Licensed & Certified',
  },
  {
    id: 8,
    name: 'GreenScape Gardens',
    title: 'Professional Landscaping',
    image: 'https://pristineplumbing.com.au/wp-content/themes/pristineplumbing/assets/images/process_bg.png',
    rating: 4.8,
    reviews: 167,
    location: 'Waterfall, Midrand',
    specialties: ['Landscape Design', 'Irrigation', 'Garden Maintenance'],
    available: true,
    experience: '12+ years',
    verification: 'Certified Landscaper',
  },
  {
    id: 9,
    name: 'SmartHome Automation',
    title: 'Home Automation Experts',
    image: 'https://pristineplumbing.com.au/wp-content/themes/pristineplumbing/assets/images/process_bg.png',
    rating: 4.9,
    reviews: 89,
    location: 'Sandton, Gauteng',
    specialties: ['Smart Lighting', 'Home Security', 'Climate Control'],
    available: true,
    experience: '7+ years',
    verification: 'Smart Home Certified',
  },
  {
    id: 10,
    name: 'ProPaint Masters',
    title: 'Professional Painting Services',
    image: 'https://pristineplumbing.com.au/wp-content/themes/pristineplumbing/assets/images/process_bg.png',
    rating: 4.6,
    reviews: 134,
    location: 'Morningside, Johannesburg',
    specialties: ['Interior Painting', 'Exterior Painting', 'Waterproofing'],
    available: false,
    experience: '15+ years',
    verification: 'Master Painter',
  }
];

const Professionals = () => {
  // 1. State declarations
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 2. Memoized filtered results
  const filteredResults = React.useMemo(() => {
    return professionals.filter(professional => {
      const searchTerms = searchQuery.toLowerCase().trim();
      
      const matchesSearch = !searchTerms || 
        professional.name.toLowerCase().includes(searchTerms) ||
        professional.title.toLowerCase().includes(searchTerms) ||
        professional.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchTerms)
        );

      const matchesSpecialty = !selectedSpecialty || 
        professional.specialties.some(specialty => 
          specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())
        );

      return matchesSearch && matchesSpecialty;
    });
  }, [searchQuery, selectedSpecialty]);

  // 3. Pagination calculations
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProfessionals = filteredResults.slice(startIndex, endIndex);

  // 4. Event handlers
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSelectedSpecialty(null);
    setCurrentPage(1);
  };

  const handleSpecialtyClick = (specialty) => {
    setSelectedSpecialty(specialty === 'All' ? null : specialty);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSpecialty(null);
    setCurrentPage(1);
  };

  // 5. Page numbers generator
  const getPageNumbers = () => {
    const delta = 1;
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

  // 6. Loading effect
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedSpecialty]);

  // Add animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  // Update the return JSX - replace the search input and filters section
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img
          src="https://pristineplumbing.com.au/wp-content/themes/pristineplumbing/assets/images/process_bg.png"
          alt="Professional Services"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col justify-center">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
                Our Professional Team
              </h1>
              <p className="mt-6 text-lg text-white/90 sm:text-xl">
                Connect with skilled and verified professionals ready to tackle your home service needs.
              </p>

              {/* Updated Search Bar */}
              <div className="relative mt-8">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <MagnifyingGlassIcon className="h-5 w-5 text-white/60" />
                </div>
                <input
                  type="search"
                  className="block w-full rounded-xl border-2 border-white/20 bg-white/10 py-4 pl-11 pr-4 text-white backdrop-blur-sm placeholder:text-white/60 focus:border-white/30 focus:outline-none"
                  placeholder="Search professionals by name or specialty..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Enhanced Results Summary */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Found {filteredResults.length} professionals
            {searchQuery && ` matching "${searchQuery}"`}
            {selectedSpecialty && ` in ${selectedSpecialty}`}
          </p>
          {(searchQuery || selectedSpecialty) && (
            <button
              onClick={clearFilters}
              className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Enhanced Specialty Filters */}
        <motion.div 
          className="mb-8 flex flex-wrap gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {['All', 'Plumbing', 'Electrical', 'HVAC', 'Carpentry', 'Security'].map((specialty) => (
            <motion.button
              key={specialty}
              onClick={() => handleSpecialtyClick(specialty)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                (specialty === 'All' && !selectedSpecialty) || specialty === selectedSpecialty
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-50 hover:scale-105 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {specialty}
            </motion.button>
          ))}
        </motion.div>

        {/* Loading State */}
        {isLoading ? (
          <motion.div 
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="animate-pulse rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="aspect-w-16 aspect-h-9 mb-4 rounded-lg bg-slate-200 dark:bg-slate-700" />
                <div className="h-6 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="mt-2 h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="mt-4 flex gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-700" />
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Enhanced Professionals Grid */
          <motion.div 
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {currentProfessionals.map((professional) => (
              <motion.div
                key={professional.id}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-blue-600 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500"
              >
                <div className="aspect-w-16 aspect-h-9 mb-4 overflow-hidden rounded-lg">
                  <img
                    src={professional.image}
                    alt={professional.name}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {professional.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {professional.title}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <StarIcon className="h-5 w-5 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                      {professional.rating}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {professional.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  {professional.available ? (
                    <span className="flex items-center text-sm text-green-600 dark:text-green-400">
                      <CheckCircleIcon className="mr-1 h-4 w-4" />
                      Available Now
                    </span>
                  ) : (
                    <span className="flex items-center text-sm text-red-600 dark:text-red-400">
                      <ClockIcon className="mr-1 h-4 w-4" />
                      Unavailable
                    </span>
                  )}
                  <Link
                    to={`/provider/${professional.name.toLowerCase().replace(/\s+/g, '-')}-${professional.id}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:underline dark:text-blue-400 hover:text-blue-500 transition-colors"
                  >
                    View Profile
                    <ChevronRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Add this after the professionals grid */}
        {!isLoading && filteredResults.length > 0 && (
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
                {getPageNumbers().map((pageNum, idx) => (
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
        )}

        {/* Mobile Pagination Info */}
        <div className="mt-4 text-center sm:hidden">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        {/* Enhanced No Results Message */}
        {!isLoading && filteredResults.length === 0 && (
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-lg font-medium text-slate-900 dark:text-white">
              No professionals found
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Try adjusting your search or filters
            </p>
            <motion.button
              onClick={clearFilters}
              className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear all filters
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Professionals;
