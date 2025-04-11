import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  StarIcon, 
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  BriefcaseIcon
} from '@heroicons/react/20/solid';

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
  }
];

const Professionals = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [filteredProfessionals, setFilteredProfessionals] = useState(professionals);

  // Filter professionals based on search query and selected specialty
  useEffect(() => {
    const filtered = professionals.filter(professional => {
      const matchesSearch = searchQuery === '' || 
        professional.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        professional.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        professional.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesSpecialty = selectedSpecialty === 'All' ||
        professional.specialties.some(specialty => 
          specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())
        );

      return matchesSearch && matchesSpecialty;
    });

    setFilteredProfessionals(filtered);
  }, [searchQuery, selectedSpecialty]);

  // Handle search input with debounce
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle specialty filter
  const handleSpecialtyChange = (specialty) => {
    setSelectedSpecialty(specialty);
  };

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

              {/* Search Bar */}
              <div className="relative mt-8">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <MagnifyingGlassIcon className="h-5 w-5 text-white/60" />
                </div>
                <input
                  type="search"
                  className="block w-full rounded-xl border-2 border-white/20 bg-white/10 py-4 pl-11 pr-4 text-white backdrop-blur-sm placeholder:text-white/60 focus:border-white/30 focus:outline-none"
                  placeholder="Search professionals by name or specialty..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Found {filteredProfessionals.length} service providers
            {selectedSpecialty !== 'All' && ` in ${selectedSpecialty}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {/* Specialty Filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          {['All', 'Plumbing', 'Electrical', 'HVAC', 'Carpentry'].map((specialty) => (
            <button
              key={specialty}
              onClick={() => handleSpecialtyChange(specialty)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedSpecialty === specialty
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>

        {/* No Results Message */}
        {filteredProfessionals.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-lg font-medium text-slate-900 dark:text-white">
              No service providers found
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSpecialty('All');
              }}
              className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Professionals Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProfessionals.map((professional) => (
            <Link
              key={professional.id}
              to={`/providers/${professional.id}`}
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

              <div className="mt-4 flex items-center gap-4 text-sm">
                <div className="flex items-center text-slate-500 dark:text-slate-400">
                  <MapPinIcon className="mr-1 h-4 w-4" />
                  {professional.location}
                </div>
                <div className="flex items-center text-slate-500 dark:text-slate-400">
                  <BriefcaseIcon className="mr-1 h-4 w-4" />
                  {professional.experience}
                </div>
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
                <span className="text-sm font-medium text-blue-600 group-hover:underline dark:text-blue-400">
                  View Profile →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Professionals;
