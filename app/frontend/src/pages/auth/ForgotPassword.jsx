import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EnvelopeIcon, ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import AuthLayout from '../../layouts/auth/AuthLayout';
import FormInput from '../../components/auth/FormInput';
import Button from '../../components/common/Button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // TODO: Implement password reset request logic
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      setIsSubmitted(true);
    } catch (error) {
      setError('Failed to send reset instructions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle={
        <>
          Remember your password?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
            Sign in
          </Link>
        </>
      }
    >
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Enter your email address and we'll send you instructions to reset your password.
              </div>

              <FormInput
                icon={EnvelopeIcon}
                label="Email address"
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                disabled={isLoading}
              />

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400"
                >
                  {error}
                </motion.div>
              )}

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full group"
                  onClick={() => window.history.back()}
                >
                  <span className="flex items-center justify-center">
                    <ArrowLeftIcon className="mr-2 h-4 w-4 transition group-hover:-translate-x-1" />
                    Back
                  </span>
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Instructions'}
                </Button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>

            <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">
              Check your email
            </h3>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              We've sent password reset instructions to<br />
              <span className="font-medium text-slate-900 dark:text-white">{email}</span>
            </p>

            <div className="mt-6 space-y-4">
              <Button variant="primary" to="/login" className="w-full">
                Return to Sign In
              </Button>
              <button
                type="button"
                onClick={handleSubmit}
                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                Didn't receive the email? Click to resend
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};

export default ForgotPassword;