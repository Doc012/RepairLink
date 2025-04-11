import Hero from '@/components/public/home/Hero';
import Button from '../../components/common/Button';
import ServiceCard from '../../components/public/home/ServiceCard';
import StepCard from '../../components/public/home/StepCard';
import FeatureCard from '../../components/public/home/FeatureCard';
import ProfessionalCard from '../../components/public/home/ProfessionalCard';
import TestimonialCard from '../../components/public/home/TestimonialCard';

const Home = () => {
  const services = ['Plumbing', 'Electrical', 'HVAC', 'Appliance', 'Carpentry', 'General Handyman'];

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

  return (
    <div className="relative overflow-hidden">
      <Hero />

      {/* Services preview */}
      <section className="bg-gray-50 py-16 sm:py-24 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Popular Services
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-400">
              We connect you with professionals across various repair categories
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16 sm:py-24 dark:bg-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              How RepairLink Works
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-400">
              Get your repairs done in four simple steps
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <StepCard key={step.step} {...step} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button to="/register" variant="primary">
              Get Started Now
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 py-16 sm:py-24 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Why Choose RepairLink?
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-400">
              We make finding and booking reliable repair services simple and secure
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>

          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{value}</div>
                <div className="mt-2 text-slate-600 dark:text-slate-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Professionals */}
      <section className="bg-white py-16 sm:py-24 dark:bg-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Featured Professionals
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-400">
              Meet our top-rated service providers ready to help you
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {professionals.map((professional) => (
              <ProfessionalCard 
                key={professional.name} 
                professional={professional} 
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button to="/professionals" variant="primary">
              View All Professionals
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-16 sm:py-24 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              What Our Clients Say
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-400">
              Read testimonials from satisfied customers across South Africa
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard 
                key={`${testimonial.name}-${testimonial.date}`} 
                testimonial={testimonial} 
              />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;