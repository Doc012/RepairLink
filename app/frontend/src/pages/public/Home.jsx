import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from '@/components/public/home/Hero';
import Button from '../../components/common/Button';
import ServiceCard from '../../components/public/home/ServiceCard';
import StepCard from '../../components/public/home/StepCard';
import FeatureCard from '../../components/public/home/FeatureCard';
import ProfessionalCard from '../../components/public/home/ProfessionalCard';
import TestimonialCard from '../../components/public/home/TestimonialCard';

const Home = () => {
  const services = [
    {
      id: 1,
      name: 'Plumbing',
      description: 'Expert plumbing services for your home and business',
      icon: '🔧',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      id: 2,
      name: 'Electrical',
      description: 'Professional electrical installations and repairs',
      icon: '⚡',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      id: 3,
      name: 'HVAC',
      description: 'Heating, ventilation, and air conditioning services',
      icon: '❄️',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      id: 4,
      name: 'Appliance',
      description: 'Repairs and maintenance for all home appliances',
      icon: '🏠',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      id: 5,
      name: 'Carpentry',
      description: 'Custom woodwork and furniture repairs',
      icon: '🔨',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      id: 6,
      name: 'General Handyman',
      description: 'Various home repair and maintenance services',
      icon: '🛠️',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    }
  ];

  const steps = [
    {
      step: 1,
      title: 'Choose a Service',
      description: 'Browse through our wide range of professional repair services.'
    },
    {
      step: 2,
      title: 'Book an Appointment',
      description: 'Select a convenient time slot and book your service provider.'
    },
    {
      step: 3,
      title: 'Get it Fixed',
      description: 'Our verified professional will arrive and solve your problem.'
    },
    {
      step: 4,
      title: 'Rate & Review',
      description: 'Share your experience and help others find great service.'
    }
  ];

  const features = [
    {
      icon: 'verified',
      title: 'Verified Professionals',
      description: 'All our service providers are thoroughly vetted and qualified to ensure top-quality service.'
    },
    {
      icon: 'secure',
      title: 'Secure Booking',
      description: 'Your payments and personal information are protected with bank-level security.'
    },
    {
      icon: 'quick',
      title: 'Quick Response',
      description: 'Get connected with available professionals within minutes of booking.'
    },
    {
      icon: 'quality',
      title: 'Satisfaction Guaranteed',
      description: 'We stand behind our service quality with a 100% satisfaction guarantee.'
    }
  ];

  const stats = [
    { value: '500+', label: 'Verified Professionals' },
    { value: '10k+', label: 'Completed Jobs' },
    { value: '4.8/5', label: 'Average Rating' },
    { value: '95%', label: 'Satisfaction Rate' }
  ];

  const professionals = [
    {
      name: 'Master Plumbing Solutions',
      image: 'https://www.checkatrade.com/blog/wp-content/uploads/2023/10/plumbing-business-names.jpg',
      specialty: 'Commercial & Residential Plumbing',
      rating: 4.9,
      reviews: 156,
      location: 'Sandton, Gauteng',
      yearsInBusiness: 15
    },
    {
      name: 'PowerTech Electrical',
      image: 'https://www.servicefusion.com/wp-content/uploads/2023/06/Smiling-Electrician-Working-on-Wiring_.jpg',
      specialty: 'Electrical Services & Installations',
      rating: 4.8,
      reviews: 123,
      location: 'Cape Town, Western Cape',
      yearsInBusiness: 20
    },
    {
      name: 'Comfort Air Systems',
      image: 'https://cdn.prod.website-files.com/665ff55d7164d44148375fb6/665ff8268e1dae97e2a48189_repairman-in-uniform-installing-the-outside-unit-o-2021-09-03-16-17-09-utc-1.jpeg',
      specialty: 'HVAC Installation & Maintenance',
      rating: 4.7,
      reviews: 98,
      location: 'Durban, KwaZulu-Natal',
      yearsInBusiness: 12
    }
  ];

  const testimonials = [
    {
      name: "John van der Merwe",
      location: "Pretoria, Gauteng",
      rating: 5,
      comment: "Excellent service! The plumber arrived on time and fixed our geyser issue quickly. Very professional and clean work.",
      service: "Plumbing Service",
      date: "2024-04-01"
    },
    {
      name: "Sarah Naidoo",
      location: "Durban, KZN",
      rating: 5,
      comment: "PowerTech Electrical did an amazing job installing our backup power system. Very knowledgeable team!",
      service: "Electrical Installation",
      date: "2024-03-28"
    },
    {
      name: "David Smith",
      location: "Cape Town, WC",
      rating: 4,
      comment: "Great air conditioning service. The technician was very thorough in explaining the maintenance process.",
      service: "HVAC Maintenance",
      date: "2024-03-25"
    }
  ];

  // Add scroll animation control
  const [isVisible, setIsVisible] = useState({
    services: false,
    steps: false,
    features: false,
    professionals: false,
    testimonials: false
  });

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['services', 'steps', 'features', 'professionals', 'testimonials'];
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.75) {
            setIsVisible(prev => ({ ...prev, [section]: true }));
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="relative overflow-hidden">
      <Hero />

      {/* Services preview */}
      <section id="services" className="bg-gray-50 py-16 sm:py-24 dark:bg-slate-900">
        <motion.div 
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          initial="hidden"
          animate={isVisible.services ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.div 
            className="mx-auto max-w-2xl text-center"
            variants={itemVariants}
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Popular Services
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-400">
              We connect you with professionals across various repair categories
            </p>
          </motion.div>
          
          <motion.div 
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
          >
            {services.map((service) => (
              <motion.div key={service.id} variants={itemVariants}>
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works - with timeline connector */}
      <section id="steps" className="bg-white py-16 sm:py-24 dark:bg-slate-800 relative">
        <motion.div 
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          initial="hidden"
          animate={isVisible.steps ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {/* Add connecting line between steps */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-blue-200 dark:bg-blue-800 hidden lg:block" />
          
          {/* Rest of steps section */}
          <motion.div variants={itemVariants} className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              How RepairLink Works
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-400">
              Get your repairs done in four simple steps
            </p>
          </motion.div>

          <motion.div 
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 relative z-10"
            variants={containerVariants}
          >
            {steps.map((step, index) => (
              <motion.div key={step.step} variants={itemVariants}>
                <StepCard {...step} isLast={index === steps.length - 1} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="mt-12 text-center"
            variants={itemVariants}
          >
            <Button 
              to="/register" 
              variant="primary"
              className="transform transition-transform hover:scale-105"
            >
              Get Started Now
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Why Choose Us */}
      <section id="features" className="bg-gray-50 py-16 sm:py-24 dark:bg-slate-900">
        <motion.div 
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          initial="hidden"
          animate={isVisible.features ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.div 
            className="mx-auto max-w-2xl text-center"
            variants={itemVariants}
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Why Choose RepairLink?
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-400">
              We make finding and booking reliable repair services simple and secure
            </p>
          </motion.div>

          <motion.div 
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={itemVariants}>
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4"
            variants={containerVariants}
          >
            {stats.map(({ value, label }) => (
              <motion.div key={label} className="text-center" variants={itemVariants}>
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{value}</div>
                <div className="mt-2 text-slate-600 dark:text-slate-400">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Professionals */}
      <section id="professionals" className="bg-white py-16 sm:py-24 dark:bg-slate-800">
        <motion.div 
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          initial="hidden"
          animate={isVisible.professionals ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.div 
            className="mx-auto max-w-2xl text-center"
            variants={itemVariants}
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Featured Professionals
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-400">
              Meet our top-rated service providers ready to help you
            </p>
          </motion.div>
          
          <motion.div 
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
          >
            {professionals.map((professional) => (
              <motion.div key={professional.name} variants={itemVariants}>
                <ProfessionalCard professional={professional} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="mt-12 text-center"
            variants={itemVariants}
          >
            <Button to="/professionals" variant="primary">
              View All Professionals
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="bg-gray-50 py-16 sm:py-24 dark:bg-slate-900">
        <motion.div 
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          initial="hidden"
          animate={isVisible.testimonials ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.div 
            className="mx-auto max-w-2xl text-center"
            variants={itemVariants}
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              What Our Clients Say
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-400">
              Read testimonials from satisfied customers across South Africa
            </p>
          </motion.div>
          
          <motion.div 
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
          >
            {testimonials.map((testimonial) => (
              <motion.div key={`${testimonial.name}-${testimonial.date}`} variants={itemVariants}>
                <TestimonialCard testimonial={testimonial} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;