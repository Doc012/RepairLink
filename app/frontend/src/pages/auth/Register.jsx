import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  KeyIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import AuthLayout from '../../layouts/auth/AuthLayout';
import FormInput from '../../components/auth/FormInput';
import Button from '../../components/common/Button';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '' // No default role - user must select
  });
  const [passwordError, setPasswordError] = useState('');
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Password strength indicator state
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    strength: 'weak'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear password error when either password field changes
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('');
      
      // Check password strength if password field changes
      if (name === 'password') {
        checkPasswordStrength(value);
      }
    }
    
    // Clear API error when any field changes
    if (apiError) {
      setApiError('');
    }
  };
  
  // Password strength checker function
  const checkPasswordStrength = (password) => {
    const strength = {
      length: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      strength: 'weak'
    };
    
    // Calculate password strength
    const checks = [strength.length, strength.hasUpperCase, strength.hasLowerCase, strength.hasNumber];
    const passedChecks = checks.filter(Boolean).length;
    
    if (passedChecks === 4) {
      strength.strength = 'strong';
    } else if (passedChecks >= 2) {
      strength.strength = 'medium';
    } else {
      strength.strength = 'weak';
    }
    
    setPasswordStrength(strength);
  };
  
  // Get strength color for the progress bar
  const getStrengthColor = () => {
    switch (passwordStrength.strength) {
      case 'strong':
        return 'bg-green-500 dark:bg-green-500';
      case 'medium':
        return 'bg-yellow-500 dark:bg-yellow-500';
      default:
        return 'bg-red-500 dark:bg-red-500';
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
    // Enhanced password validation
    if (!passwordStrength.hasUpperCase || !passwordStrength.hasLowerCase || !passwordStrength.hasNumber) {
      setPasswordError('Password must include uppercase, lowercase letters and numbers');
      return false;
    }
    return true;
  };
  
  const validateForm = () => {
    // Step 1 validation already handled by validatePasswords
    if (step === 2) {
      if (!formData.phoneNumber) {
        setApiError('Phone number is required');
        return false;
      }
      
      if (!formData.role) {
        setApiError('Please select an account type');
        return false;
      }
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
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setApiError('');
    
    try {
      // Prepare registration data
      const registrationData = {
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        roleType: formData.role // Map to roleType as expected by API
      };
      
      // Send registration request
      const response = await axios.post(
        'http://13.60.59.231:8080/api/auth/register',
        registrationData
      );
      
      console.log('Registration successful:', response.data);
      setSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Registration failed:', error);
      
      // Handle specific API errors
      if (error.response?.data?.error) {
        setApiError(error.response.data.error);
      } else {
        setApiError('Registration failed. Please try again later.');
      }
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

        {success && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-lg bg-green-50 p-4 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400"
          >
            Registration successful! Please check your email for verification instructions.
            Redirecting to login...
          </motion.div>
        )}

        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex items-center rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400"
          >
            <ExclamationCircleIcon className="mr-2 h-5 w-5 flex-shrink-0" />
            {apiError}
          </motion.div>
        )}

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

                {/* Password strength indicator */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        Password strength: 
                        <span className={`ml-1 font-semibold ${
                          passwordStrength.strength === 'strong' ? 'text-green-600 dark:text-green-400' : 
                          passwordStrength.strength === 'medium' ? 'text-yellow-600 dark:text-yellow-400' : 
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {passwordStrength.strength.charAt(0).toUpperCase() + passwordStrength.strength.slice(1)}
                        </span>
                      </span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                      <div 
                        className={`h-1 rounded-full transition-all duration-300 ${getStrengthColor()}`} 
                        style={{ 
                          width: passwordStrength.strength === 'strong' ? '100%' : 
                                passwordStrength.strength === 'medium' ? '66%' : '33%' 
                        }}
                      />
                    </div>
                    <ul className="grid gap-1 text-xs text-slate-600 dark:text-slate-400">
                      <li className={`flex items-center ${passwordStrength.length ? 'text-green-600 dark:text-green-400' : ''}`}>
                        <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${passwordStrength.length ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
                        At least 8 characters
                      </li>
                      <li className={`flex items-center ${passwordStrength.hasUpperCase ? 'text-green-600 dark:text-green-400' : ''}`}>
                        <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${passwordStrength.hasUpperCase ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
                        At least one uppercase letter
                      </li>
                      <li className={`flex items-center ${passwordStrength.hasLowerCase ? 'text-green-600 dark:text-green-400' : ''}`}>
                        <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${passwordStrength.hasLowerCase ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
                        At least one lowercase letter
                      </li>
                      <li className={`flex items-center ${passwordStrength.hasNumber ? 'text-green-600 dark:text-green-400' : ''}`}>
                        <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${passwordStrength.hasNumber ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
                        At least one number
                      </li>
                    </ul>
                  </div>
                )}

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
                    Account Type <span className="text-red-500">*</span>
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
