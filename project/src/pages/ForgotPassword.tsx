import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { gsap } from 'gsap';
import { 
  EnvelopeIcon,
  ArrowLeftIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { localStorageService } from '../services/localStorageService';
import { EmailService } from '../services/emailService';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Refs for GSAP animations
  const logoRef = useRef(null);
  const formRef = useRef(null);
  const headerRef = useRef(null);

  // GSAP animations on mount
  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(logoRef.current, 
      { opacity: 0, y: -50, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)" }
    )
    .fromTo(headerRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    )
    .fromTo(formRef.current,
      { opacity: 0, y: 50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" },
      "-=0.3"
    );
  }, []);

  // React Spring for form field animations
  const emailSpring = useSpring({
    transform: email ? 'scale(1.02)' : 'scale(1)',
    config: { tension: 300, friction: 20 }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check if user exists using localStorageService
      if (!localStorageService.userExists(email)) {
        throw new Error('No account found with this email address');
      }

      // Send password reset email
      const emailSent = await EmailService.sendPasswordResetEmail(email);
      
      if (!emailSent) {
        throw new Error('Failed to send reset email. Please try again.');
      }

      setSuccess(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (newPassword: string) => {
    try {
      return localStorageService.resetUserPassword(email, newPassword);
    } catch (error) {
      return false;
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated background elements */}
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            background: [
              "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          ref={formRef}
          className="max-w-md w-full space-y-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Success Icon */}
          <motion.div
            className="flex justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          >
            <CheckCircleIcon className="h-16 w-16 text-green-500" />
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Check Your Email
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
              Click the link in the email to reset your password. If you don't see the email, check your spam folder.
            </p>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.button
              onClick={() => setSuccess(false)}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Try a different email
            </motion.button>

            <motion.div className="text-center">
              <Link
                to="/login"
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                Back to login
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          background: [
            "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 20%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)"
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <motion.div 
          ref={headerRef}
          className="text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div 
            ref={logoRef}
            className="flex items-center justify-center gap-3 mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.img
              src="/public/ThinkByte_Logo.png"
              alt="ThinkByte Logo"
              className="h-12 w-12 rounded-lg object-contain drop-shadow-lg"
              whileHover={{ rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <motion.span 
              className="text-3xl font-bold text-blue-900 dark:text-blue-200"
              animate={{ 
                textShadow: [
                  "0 0 0px rgba(30, 64, 175, 0)",
                  "0 0 20px rgba(30, 64, 175, 0.3)",
                  "0 0 0px rgba(30, 64, 175, 0)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              ThinkByte
            </motion.span>
          </motion.div>
          <motion.p 
            className="mt-2 text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Reset your password
          </motion.p>
        </motion.div>

        {/* Forgot Password Form */}
        <motion.form
          ref={formRef}
          className="mt-8 space-y-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{ 
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            y: -2
          }}
        >
          {/* Form background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-teal-50/30 dark:from-blue-900/20 dark:via-transparent dark:to-teal-900/20 rounded-2xl" />
          
          <AnimatePresence>
            {error && (
              <motion.div 
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 relative z-10"
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email address
              </label>
              <animated.div 
                className="relative"
                style={emailSpring}
              >
                <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <motion.input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm shadow-inner"
                  placeholder="Enter your email address"
                  whileFocus={{ 
                    scale: 1.02,
                    boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)"
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              </animated.div>
            </motion.div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 relative z-10"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
            }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, type: "spring", stiffness: 300, damping: 20 }}
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Sending reset email...
                </motion.div>
              ) : (
                <motion.span
                  key="send"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Send reset email
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.div 
            className="text-center relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 font-medium"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to login
            </Link>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
} 