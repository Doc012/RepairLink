import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  CheckBadgeIcon, 
  ClockIcon,
  CalendarIcon,
  StarIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

// Update the mock data section at the top of your file
const mockReviews = [
  {
    id: 1,
    author: "John Smith",
    rating: 5,
    date: "2024-03-15",
    comment: "Excellent service! Arrived on time and solved our plumbing emergency quickly. Very professional and clean work.",
    service: "Emergency Plumbing Repair"
  },
  {
    id: 2,
    author: "Sarah Johnson",
    rating: 4,
    date: "2024-03-10",
    comment: "Great work on our bathroom renovation. The team was professional and kept us informed throughout the process.",
    service: "Complete Bathroom Renovation"
  },
  {
    id: 3,
    author: "Michael Brown",
    rating: 5,
    date: "2024-03-05",
    comment: "Very knowledgeable and professional. Fixed our geyser issues and provided great maintenance advice.",
    service: "Geyser Installation & Repair"
  }
];

const commonCertifications = [
  "PIRB Registered Plumber",
  "Occupational Health & Safety Certified",
  "Master Craftsman Certificate",
  "Professional Service Provider License",
  "Quality Management Systems ISO 9001"
];

const commonAchievements = [
  "Best Service Provider 2023",
  "Customer Excellence Award",
  "5-Star Rating on ServiceLink",
  "1000+ Successfully Completed Projects",
  "Community Service Recognition"
];

const businessHours = {
  monday: { open: "08:00", close: "17:00" },
  tuesday: { open: "08:00", close: "17:00" },
  wednesday: { open: "08:00", close: "17:00" },
  thursday: { open: "08:00", close: "17:00" },
  friday: { open: "08:00", close: "17:00" },
  saturday: { open: "09:00", close: "14:00" },
  sunday: "Closed"
};

const serviceCategories = {
  Plumbing: ["Water Leak Repair", "Drain Cleaning", "Fixture Installation"],
  Electrical: ["Wiring Installation", "Circuit Repairs", "Lighting Setup"],
  HVAC: ["AC Installation", "Heating Repair", "Ventilation Service"],
  Construction: ["Renovations", "Painting", "Tiling"],
  Security: ["Alarm Systems", "CCTV Installation", "Access Control"],
  Landscaping: ["Garden Design", "Irrigation", "Maintenance"]
};

const mockProvider = {
  providerID: 1,
  businessName: "PlumbPro Solutions",
  serviceCategory: "Plumbing",
  location: "Sandton, Gauteng",
  verified: true,
  avatar: "https://pristineplumbing.com.au/wp-content/themes/pristineplumbing/assets/images/process_bg.png",
  coverImage: "https://pristineplumbing.com.au/wp-content/themes/pristineplumbing/assets/images/process_bg.png",
  rating: 4.9,
  reviews: mockReviews,
  reviewCount: 127,
  established: "2010",
  about: "Professional service provider with over a decade of experience. Our team of certified experts specializes in both residential and commercial services. We pride ourselves on our prompt response times, quality workmanship, and customer satisfaction. Available for emergency services with a commitment to using the latest technology and eco-friendly solutions.",
  certifications: commonCertifications,
  achievements: commonAchievements,
  businessHours: businessHours,
  contact: {
    phone: "+27 12 345 6789",
    email: "info@provider.co.za",
    whatsapp: "+27 12 345 6789",
    emergencyNumber: "+27 12 345 6789",
    socialMedia: {
      facebook: "https://facebook.com/provider",
      instagram: "https://instagram.com/provider",
      twitter: "https://twitter.com/provider"
    }
  },
  insurance: {
    provider: "Professional Indemnity Insurance",
    coverage: "Up to R2 million",
    verified: true
  }
};

const mockServices = [
  {
    serviceID: 1,
    serviceName: "Emergency Plumbing Repair",
    description: "24/7 emergency response for urgent plumbing issues including burst pipes, severe leaks, and blocked drains. Includes initial inspection, repair, and testing.",
    price: 550.00,
    duration: "1-2 hours",
    availability: "24/7"
  },
  {
    serviceID: 2,
    serviceName: "Complete Bathroom Renovation",
    description: "Full bathroom transformation service including design consultation, fixture installation, plumbing work, and finishing touches. Includes warranty on all installations.",
    price: 12500.00,
    duration: "3-5 days",
    availability: "By Appointment"
  },
  {
    serviceID: 3,
    serviceName: "Geyser Installation & Repair",
    description: "Professional geyser services including new installations, repairs, and maintenance. All work compliant with South African safety standards.",
    price: 850.00,
    duration: "2-3 hours",
    availability: "Same Day Service"
  },
  {
    serviceID: 4,
    serviceName: "Water Leak Detection",
    description: "Advanced leak detection service using latest technology. Includes thermal imaging and pressure testing.",
    price: 750.00,
    duration: "2-3 hours",
    availability: "Same Day"
  },
  {
    serviceID: 5,
    serviceName: "Drain Cleaning & Maintenance",
    description: "Professional drain cleaning service using high-pressure water jetting and CCTV inspection.",
    price: 650.00,
    duration: "1-2 hours",
    availability: "Next Day"
  },
  {
    serviceID: 6,
    serviceName: "Hot Water System Service",
    description: "Comprehensive hot water system maintenance and repair service. Includes safety inspection.",
    price: 550.00,
    duration: "1-2 hours",
    availability: "Same Day"
  },
  {
    serviceID: 7,
    serviceName: "Pipe Replacement",
    description: "Complete pipe replacement service for old or damaged plumbing systems. Includes material and labor warranty.",
    price: 4500.00,
    duration: "1-2 days",
    availability: "By Appointment"
  },
  {
    serviceID: 8,
    serviceName: "Bathroom Waterproofing",
    description: "Professional waterproofing service for bathrooms and wet areas. Includes warranty certificate.",
    price: 3500.00,
    duration: "1-2 days",
    availability: "By Appointment"
  },
  {
    serviceID: 9,
    serviceName: "Sump Pump Installation",
    description: "Installation and setup of sump pump systems for basement and flood protection.",
    price: 2800.00,
    duration: "4-6 hours",
    availability: "Next Day"
  },
  {
    serviceID: 10,
    serviceName: "Water Tank Installation",
    description: "Supply and installation of water storage tanks including pressure systems.",
    price: 6500.00,
    duration: "1-2 days",
    availability: "By Appointment"
  },
  {
    serviceID: 11,
    serviceName: "Solar Geyser Setup",
    description: "Installation of solar water heating systems with backup electrical elements.",
    price: 15000.00,
    duration: "2-3 days",
    availability: "By Appointment"
  },
  {
    serviceID: 12,
    serviceName: "Gas Line Installation",
    description: "Professional gas line installation for geysers, stoves, and heating systems.",
    price: 3200.00,
    duration: "4-6 hours",
    availability: "By Appointment"
  }
];

const ProviderProfile = () => {
  const { slug } = useParams();
  const providerId = slug.split('-').pop();
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('services');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 6;
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Add this function for filtering services
  const filteredServices = mockServices.filter(service =>
    service.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);
  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);

  // Add this pagination helper function
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-12 animate-pulse">
          <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
          <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section */}
      <div className="relative h-[300px] sm:h-[400px] overflow-hidden">
        <img
          src={mockProvider.coverImage}
          alt={mockProvider.businessName}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 sm:from-black/80 to-black/60 sm:to-black/40" />
        
        {/* Back Button */}
        <Link
          to="/professionals"
          className="absolute top-4 left-4 z-10 flex items-center space-x-2 text-white/90 hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span className="text-sm font-medium">Back to Professionals</span>
        </Link>

        {/* Provider Info */}
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
            <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-white p-2 shadow-xl">
              <img
                src={mockProvider.avatar}
                alt={mockProvider.businessName}
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-4xl font-bold text-white">
                {mockProvider.businessName}
              </h1>
              <div className="mt-2 sm:mt-4 flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-4">
                <div className="flex items-center text-white/90">
                  <MapPinIcon className="mr-1 h-5 w-5" />
                  {mockProvider.location}
                </div>
                {mockProvider.verified && (
                  <div className="flex items-center text-white/90">
                    <CheckBadgeIcon className="mr-1 h-5 w-5" />
                    Verified Provider
                  </div>
                )}
                <div className="flex items-center text-white/90">
                  <StarIcon className="mr-1 h-5 w-5" />
                  {mockProvider.rating} ({mockProvider.reviewCount} reviews)
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">{mockProvider.rating}</div>
              <div className="text-sm text-white/80">Average Rating</div>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">{mockProvider.reviewCount}</div>
              <div className="text-sm text-white/80">Total Reviews</div>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">{mockServices.length}</div>
              <div className="text-sm text-white/80">Services Offered</div>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">{2024 - parseInt(mockProvider.established)}</div>
              <div className="text-sm text-white/80">Years Experience</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="sticky top-0 z-10 backdrop-blur-lg bg-white/80 shadow-sm dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex space-x-8">
              {['services', 'about', 'reviews'].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`${
                    activeSection === section
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                  } relative h-16 border-b-2 px-3 text-sm font-medium capitalize transition-all hover:border-slate-300 dark:hover:border-slate-600`}
                >
                  {section}
                  {/* Indicator dot */}
                  {activeSection === section && (
                    <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-blue-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Conditional Rendering */}
      {activeSection === 'services' && (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Services Offered
            </h2>
            <div className="relative w-72">
              <input
                type="search"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          </div>
          
          {/* Services Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentServices.map((service) => (
              <motion.div
                key={service.serviceID}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {service.serviceName}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {service.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <ClockIcon className="mr-1 h-4 w-4" />
                      {service.duration}
                    </span>
                    <span className="text-lg font-semibold text-slate-900 dark:text-white">
                      R{service.price.toFixed(2)}
                    </span>
                  </div>
                  <Link
                    to="/login"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    Book Now
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
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
                      onClick={() => typeof pageNum === 'number' ? handlePageChange(pageNum) : null}
                      className={`${
                        pageNum === currentPage
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                          : pageNum === '...'
                          ? 'cursor-default text-slate-500 dark:text-slate-400'
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
        </div>
      )}

      {activeSection === 'about' && (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  About Us
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  {mockProvider.about}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <div className="flex items-center text-slate-600 dark:text-slate-400">
                    <CalendarIcon className="mr-1 h-5 w-5" />
                    Established {mockProvider.established}
                  </div>
                  {mockProvider.insurance.verified && (
                    <div className="flex items-center text-slate-600 dark:text-slate-400">
                      <CheckBadgeIcon className="mr-1 h-5 w-5 text-green-500" />
                      Insured up to {mockProvider.insurance.coverage}
                    </div>
                  )}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Professional Certifications
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {mockProvider.certifications.map((cert, index) => (
                    <div 
                      key={index}
                      className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50"
                    >
                      <CheckBadgeIcon className="mr-3 h-5 w-5 text-blue-500" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Achievements & Recognition
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {mockProvider.achievements.map((achievement, index) => (
                    <div 
                      key={index}
                      className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50"
                    >
                      <StarIcon className="mr-3 h-5 w-5 text-yellow-400" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact & Business Hours Sidebar */}
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center text-slate-600 dark:text-slate-400">
                    <PhoneIcon className="mr-2 h-5 w-5" />
                    {mockProvider.contact.phone}
                  </div>
                  <div className="flex items-center text-slate-600 dark:text-slate-400">
                    <EnvelopeIcon className="mr-2 h-5 w-5" />
                    {mockProvider.contact.email}
                  </div>
                  <div className="flex items-center text-slate-600 dark:text-slate-400">
                    <MapPinIcon className="mr-2 h-5 w-5" />
                    {mockProvider.location}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Business Hours
                </h3>
                <div className="space-y-2">
                  {Object.entries(mockProvider.businessHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="capitalize text-slate-600 dark:text-slate-400">{day}</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {typeof hours === 'string' ? hours : `${hours.open} - ${hours.close}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'reviews' && (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Reviews Summary Card */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Overall Rating
                </h3>
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white mr-2">
                    {mockProvider.rating}
                  </span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <StarIcon
                        key={index}
                        className={`h-5 w-5 ${
                          index < Math.floor(mockProvider.rating)
                            ? 'text-yellow-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Based on {mockProvider.reviewCount} customer reviews
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Service Highlights
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Professionalism</span>
                  <div className="flex items-center">
                    <div className="h-2 w-24 rounded-full bg-slate-200 dark:bg-slate-700">
                      <div className="h-2 w-[92%] rounded-full bg-blue-500"></div>
                    </div>
                    <span className="ml-2 text-sm font-medium text-slate-900 dark:text-white">4.6</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Punctuality</span>
                  <div className="flex items-center">
                    <div className="h-2 w-24 rounded-full bg-slate-200 dark:bg-slate-700">
                      <div className="h-2 w-[96%] rounded-full bg-blue-500"></div>
                    </div>
                    <span className="ml-2 text-sm font-medium text-slate-900 dark:text-white">4.8</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Value for Money</span>
                  <div className="flex items-center">
                    <div className="h-2 w-24 rounded-full bg-slate-200 dark:bg-slate-700">
                      <div className="h-2 w-[88%] rounded-full bg-blue-500"></div>
                    </div>
                    <span className="ml-2 text-sm font-medium text-slate-900 dark:text-white">4.4</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <div className="space-y-6">
              {mockReviews.map((review) => (
                <motion.div 
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-b border-slate-200 dark:border-slate-700 pb-6 last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="mr-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400 font-semibold">
                            {review.author.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white">
                          {review.author}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {new Date(review.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <StarIcon
                          key={index}
                          className={`h-4 w-4 ${
                            index < review.rating
                              ? 'text-yellow-400'
                              : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-3">
                    {review.comment}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                      {review.service}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-600 dark:bg-green-900/20 dark:text-green-400">
                      Verified Customer
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-20">
        <motion.button
          onClick={() => setIsContactModalOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 rounded-full bg-blue-600 px-6 py-3 text-white shadow-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <PhoneIcon className="h-5 w-5" />
          <span className="font-medium">Contact Now</span>
        </motion.button>
      </div>

      {/* Contact Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-slate-900/75 transition-opacity"
              onClick={() => setIsContactModalOpen(false)}
            />

            <span className="hidden sm:inline-block sm:h-screen sm:align-middle">&#8203;</span>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all dark:bg-slate-800 sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
            >
              <div className="absolute right-0 top-0 pr-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(false)}
                  className="rounded-md text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="sm:flex sm:items-start">
                <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg font-semibold leading-6 text-slate-900 dark:text-white">
                    Contact {mockProvider.businessName}
                  </h3>
                  
                  <div className="mt-6 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Numbers</h4>
                      <div className="mt-2 space-y-2">
                        <a
                          href={`tel:${mockProvider.contact.phone}`}
                          className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800/50"
                        >
                          <PhoneIcon className="mr-3 h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{mockProvider.contact.phone}</p>
                            <p className="text-slate-500 dark:text-slate-400">Main Office</p>
                          </div>
                        </a>
                        
                        <a
                          href={`tel:${mockProvider.contact.emergencyNumber}`}
                          className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800/50"
                        >
                          <PhoneIcon className="mr-3 h-5 w-5 text-red-500" />
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{mockProvider.contact.emergencyNumber}</p>
                            <p className="text-slate-500 dark:text-slate-400">24/7 Emergency</p>
                          </div>
                        </a>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Other Contact Methods</h4>
                      <div className="mt-2 space-y-2">
                        <a
                          href={`mailto:${mockProvider.contact.email}`}
                          className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800/50"
                        >
                          <EnvelopeIcon className="mr-3 h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{mockProvider.contact.email}</p>
                            <p className="text-slate-500 dark:text-slate-400">Email Us</p>
                          </div>
                        </a>

                        <a
                          href={`https://wa.me/${mockProvider.contact.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800/50"
                        >
                          <svg className="mr-3 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{mockProvider.contact.whatsapp}</p>
                            <p className="text-slate-500 dark:text-slate-400">WhatsApp</p>
                          </div>
                        </a>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Business Hours</h4>
                      <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                        <div className="space-y-1 text-sm">
                          {Object.entries(mockProvider.businessHours).map(([day, hours]) => (
                            <div key={day} className="flex justify-between">
                              <span className="capitalize text-slate-500 dark:text-slate-400">{day}</span>
                              <span className="font-medium text-slate-900 dark:text-white">
                                {typeof hours === 'string' ? hours : `${hours.open} - ${hours.close}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderProfile;