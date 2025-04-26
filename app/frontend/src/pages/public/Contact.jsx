import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BuildingOfficeIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  ClockIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const contactMethods = [
  {
    icon: PhoneIcon,
    name: 'Phone Support',
    description: 'Talk to our friendly team',
    value: '+27 (0) 11 234 5678',
    link: 'tel:+27112345678',
    availability: 'Mon-Fri from 8am to 6pm'
  },
  {
    icon: EnvelopeIcon,
    name: 'Email',
    description: 'Get email support',
    value: 'support@repairlink.co.za',
    link: 'mailto:support@repairlink.co.za',
    availability: '24/7 response within 24 hours'
  },
  {
    icon: MapPinIcon,
    name: 'Office',
    description: 'Visit our office',
    value: '123 Main Street, Sandton',
    link: 'https://goo.gl/maps/your-address',
    availability: 'Mon-Fri from 9am to 5pm'
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-32">
      {/* Hero Section */}
      <div className="relative isolate">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-950 dark:via-slate-900 dark:to-blue-950"></div>
          <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] shadow-xl shadow-blue-600/10 ring-1 ring-blue-50 dark:shadow-blue-900/10 dark:ring-blue-900"></div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Let's Connect
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Have questions or need assistance? We're here to help you get the most out of RepairLink.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-3 lg:gap-x-12">
          {contactMethods.map((method, index) => (
            <motion.div
              key={method.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-slate-800"
            >
              <div className="absolute right-0 top-0 h-24 w-24 translate-x-1/3 -translate-y-1/3 transform rounded-full bg-blue-50 dark:bg-blue-900/20"></div>
              <div className="relative">
                <div className="inline-flex rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                  <method.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                  {method.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {method.description}
                </p>
                <a
                  href={method.link}
                  className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {method.value}
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </a>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {method.availability}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Updated Form and Map Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map Section - Now on the left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="h-full"
            >
              <div className="h-full rounded-2xl bg-white shadow-lg dark:bg-slate-800 overflow-hidden">
                <div className="p-6 bg-gradient-to-b from-white to-transparent dark:from-slate-800 dark:to-transparent relative z-10">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Visit Our Office
                  </h2>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    123 Main Street, Sandton, Johannesburg
                  </p>
                </div>
                <div className="h-[calc(100%-5rem)] w-full relative">
                  <iframe
                    title="RepairLink Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d20952463.837463606!2d5.794995537217468!3d-32.69225046151419!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1c34a689d9ee1251%3A0xe85d630c1fa4e8a0!2sSouth%20Africa!5e1!3m2!1sen!2sus!4v1744403719671!5m2!1sen!2sus"
                    className="absolute inset-0 w-full h-full border-0"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </motion.div>

            {/* Contact Form - Now on the right */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="h-full rounded-2xl bg-white shadow-lg dark:bg-slate-800">
                <div className="p-6 sm:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Send us a message
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    We'll get back to you within 24 hours
                  </p>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:placeholder-gray-400"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:placeholder-gray-400"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        id="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:placeholder-gray-400"
                        placeholder="How can we help?"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        required
                        value={formData.message}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:placeholder-gray-400"
                        placeholder="Your message..."
                      />
                    </div>

                    <div className="pt-2">
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`inline-flex w-full items-center justify-center rounded-lg px-6 py-3 text-base font-medium text-white shadow-lg transition-all ${
                          isSubmitting
                            ? 'bg-blue-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="mr-3 h-5 w-5 animate-spin" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Sending...
                          </>
                        ) : (
                          'Send Message'
                        )}
                      </motion.button>
                    </div>

                    {submitStatus && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`rounded-lg p-4 ${
                          submitStatus === 'success' 
                            ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                            : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}
                      >
                        {submitStatus === 'success' 
                          ? 'Message sent successfully! We\'ll get back to you soon.' 
                          : 'Failed to send message. Please try again.'}
                      </motion.div>
                    )}
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;