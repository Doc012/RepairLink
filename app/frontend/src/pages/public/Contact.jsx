import { useState } from 'react';
import { 
  BuildingOfficeIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  ClockIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon 
} from '@heroicons/react/24/outline';

const contactInfo = [
  {
    icon: BuildingOfficeIcon,
    label: 'Office',
    value: '123 Main Street, Sandton, 2196',
    link: 'https://goo.gl/maps/your-address'
  },
  {
    icon: PhoneIcon,
    label: 'Phone',
    value: '+27 (0) 11 234 5678',
    link: 'tel:+27112345678'
  },
  {
    icon: EnvelopeIcon,
    label: 'Email',
    value: 'support@repairlink.co.za',
    link: 'mailto:support@repairlink.co.za'
  },
  {
    icon: ClockIcon,
    label: 'Business Hours',
    value: 'Mon-Fri: 8am - 6pm',
  }
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-blue-100/20 dark:from-blue-900/20">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              Get in Touch
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Have questions about RepairLink? We're here to help you connect with the right service providers.
            </p>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-gray-50 dark:from-slate-900"></div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 -mt-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Information */}
          <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-800">
            <div className="absolute right-0 top-0 -ml-12 h-48 w-48 translate-x-1/3 -translate-y-1/3 transform rounded-full bg-blue-100 dark:bg-blue-900/20"></div>
            
            <div className="relative">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
                Contact Information
              </h2>
              <p className="mt-2 max-w-sm text-gray-600 dark:text-gray-300">
                Reach out to us through any of these channels. We aim to respond within 24 hours.
              </p>

              <div className="mt-8 space-y-8">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-start">
                    <div className="flex-shrink-0">
                      <item.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                      {item.link ? (
                        <a 
                          href={item.link}
                          className="mt-1 text-base text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="mt-1 text-base text-gray-600 dark:text-gray-300">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Preview */}
              <div className="mt-12 overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700">
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    title="RepairLink Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d20952463.837463606!2d5.794995537217468!3d-32.69225046151419!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1c34a689d9ee1251%3A0xe85d630c1fa4e8a0!2sSouth%20Africa!5e1!3m2!1sen!2sus!4v1744403719671!5m2!1sen!2sus"
                    className="h-full w-full border-0"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-800">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
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
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400"
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
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400"
                    placeholder="your@email.com"
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
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400"
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
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full rounded-lg px-8 py-3 text-center text-sm font-semibold text-white transition-all ${
                  isSubmitting
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>

              {submitStatus && (
                <div className={`rounded-lg p-4 ${
                  submitStatus === 'success' 
                    ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                    : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {submitStatus === 'success' 
                    ? 'Message sent successfully!' 
                    : 'Failed to send message. Please try again.'}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;