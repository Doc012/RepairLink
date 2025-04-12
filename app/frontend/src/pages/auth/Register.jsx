import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  KeyIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import AuthLayout from '../../layouts/auth/AuthLayout';
import FormInput from '../../components/auth/FormInput';
import Button from '../../components/common/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '', // Add this field
    role: 'CUSTOMER'
  });
  const [passwordError, setPasswordError] = useState(''); // Add password validation error state
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear password error when either password field changes
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  const validatePasswords = () => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!validatePasswords()) {
        return;
      }
      setStep(2);
      return;
    }
    setIsLoading(true);
    try {
      // TODO: Implement registration logic
      console.log('Form submitted:', formData);
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  return (
    <AuthLayout
      title={step === 1 ? "Create your account" : "Complete your profile"}
      subtitle={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
            Sign in
          </Link>
        </>
      }
    >
      <div className="relative overflow-hidden">
        {/* Progress Indicator */}
        <div className="absolute top-0 left-0 right-0">
          <div className="h-1 w-full bg-slate-100 dark:bg-slate-700">
            <div
              className="h-1 bg-blue-500 transition-all duration-300"
              style={{ width: `${step * 50}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="pt-6">
          <AnimatePresence initial={false} custom={step}>
            {step === 1 ? (
              <motion.div
                key="step1"
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "tween", duration: 0.3 }}
                className="space-y-6"
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormInput
                    icon={UserIcon}
                    label="First Name"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John"
                  />
                  <FormInput
                    icon={UserIcon}
                    label="Last Name"
                    id="surname"
                    name="surname"
                    required
                    value={formData.surname}
                    onChange={handleChange}
                    placeholder="Doe"
                  />
                </div>

                <FormInput
                  icon={EnvelopeIcon}
                  label="Email address"
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                />

                <FormInput
                  icon={KeyIcon}
                  label="Password"
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                />

                <FormInput
                  icon={KeyIcon}
                  label="Confirm Password"
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                />

                {passwordError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400"
                  >
                    {passwordError}
                  </motion.div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full group"
                  disabled={!!passwordError}
                >
                  <span className="flex items-center justify-center">
                    Next Step
                    <ChevronRightIcon className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                custom={2}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "tween", duration: 0.3 }}
                className="space-y-6"
              >
                <FormInput
                  icon={PhoneIcon}
                  label="Phone Number"
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+27 123 456 789"
                />

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Account Type
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      {
                        id: 'CUSTOMER',
                        label: 'Service Seeker',
                        description: 'Looking for services',
                        icon: UserGroupIcon
                      },
                      {
                        id: 'VENDOR',
                        label: 'Service Provider',
                        description: 'Offering services',
                        icon: BuildingOfficeIcon
                      }
                    ].map((type) => (
                      <div
                        key={type.id}
                        onClick={() => handleChange({ target: { name: 'role', value: type.id } })}
                        className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                          formData.role === type.id
                            ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                            : 'border-slate-200 hover:border-blue-200 dark:border-slate-700 dark:hover:border-blue-800'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`rounded-lg p-2 ${
                            formData.role === type.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                          }`}>
                            <type.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">
                              {type.label}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                              {type.description}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full group"
                    onClick={() => setStep(1)}
                  >
                    <span className="flex items-center justify-center">
                      <ChevronLeftIcon className="mr-2 h-4 w-4 transition group-hover:-translate-x-1" />
                      Back
                    </span>
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Register;
