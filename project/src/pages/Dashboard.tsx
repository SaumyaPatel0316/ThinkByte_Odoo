import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSwapRequests } from '../hooks/useSwapRequests';
import { SwapRequestCard } from '../components/SwapRequestCard';
import { ProfileSetupNotification } from '../components/ProfileSetupNotification';
import { SkillRequestModal } from '../components/SkillRequestModal';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { gsap } from 'gsap';
import { 
  UserGroupIcon, 
  ArrowsRightLeftIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  PlusIcon,
  AcademicCapIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { user, isProfileComplete } = useAuth();
  const { swapRequests, updateSwapRequest, deleteSwapRequest } = useSwapRequests(user?.id);
  const [showProfileNotification, setShowProfileNotification] = useState(!isProfileComplete);
  const [showSkillRequestModal, setShowSkillRequestModal] = useState(false);

  // Refs for GSAP animations
  const welcomeRef = useRef(null);
  const statsRef = useRef(null);
  const skillsRef = useRef(null);
  const requestsRef = useRef(null);
  const actionsRef = useRef(null);
  const activityRef = useRef(null);

  // GSAP animations on mount
  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(welcomeRef.current, 
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    )
    .fromTo(statsRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.3"
    )
    .fromTo(skillsRef.current,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    )
    .fromTo(requestsRef.current,
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    )
    .fromTo(actionsRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.3"
    )
    .fromTo(activityRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.3"
    );
  }, []);

  // React Spring for hover effects
  const cardSpring = useSpring({
    transform: 'scale(1)',
    config: { tension: 300, friction: 20 }
  });

  const stats = [
    {
      name: 'Total Swaps',
      value: user?.totalSwaps || 0,
      icon: ArrowsRightLeftIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      link: '/swaps',
    },
    {
      name: 'Rating',
      value: user?.rating?.toFixed(1) || '0.0',
      icon: StarIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      link: null,
    },
    {
      name: 'Skills Offered',
      value: user?.skillsOffered?.length || 0,
      icon: ArrowTrendingUpIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      link: '/profile',
    },
    {
      name: 'Active Requests',
      value: swapRequests.filter(req => req.status === 'pending').length,
      icon: UserGroupIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      link: '/swaps',
    },
  ];

  const handleAccept = async (id: string) => {
    await updateSwapRequest(id, { status: 'accepted' });
  };

  const handleReject = async (id: string) => {
    await updateSwapRequest(id, { status: 'rejected' });
  };

  const handleDelete = async (id: string) => {
    await deleteSwapRequest(id);
  };

  const handleRequestSent = () => {
    // Refresh the page or update the swap requests
    window.location.reload();
  };

  const pendingRequests = swapRequests.filter(req => req.status === 'pending');
  const recentRequests = swapRequests.slice(0, 3);

  const hasSkills = user?.skillsOffered && user.skillsOffered.length > 0;
  const hasActiveRequests = pendingRequests.length > 0;

  return (
    <>
      {showProfileNotification && (
        <ProfileSetupNotification 
          onDismiss={() => setShowProfileNotification(false)} 
        />
      )}
      
      <SkillRequestModal
        isOpen={showSkillRequestModal}
        onClose={() => setShowSkillRequestModal(false)}
        onRequestSent={handleRequestSent}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative overflow-hidden">
        {/* Animated background elements */}
        <motion.div
          className="absolute inset-0 opacity-5"
          animate={{
            background: [
              "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Welcome Section */}
        <motion.div 
          ref={welcomeRef}
          className="mb-8 relative z-10"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-3xl font-bold text-gray-900 dark:text-white"
            animate={{ 
              textShadow: [
                "0 0 0px rgba(0, 0, 0, 0)",
                "0 0 10px rgba(59, 130, 246, 0.1)",
                "0 0 0px rgba(0, 0, 0, 0)"
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            Welcome back, {user?.name}!
          </motion.h1>
          <motion.p 
            className="text-gray-600 dark:text-gray-400 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Here's what's happening with your skill swaps
          </motion.p>
        </motion.div>

        {/* Stats */}
        <motion.div 
          ref={statsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={stat.name} 
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 relative overflow-hidden"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.25)",
                scale: 1.02
              }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut", type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Card background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-teal-50/30 dark:from-blue-900/20 dark:via-transparent dark:to-teal-900/20 rounded-xl" />
              
              {stat.link ? (
                <Link to={stat.link} className="block relative z-10">
                  <motion.div 
                    className="flex items-center cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-700/50 rounded-lg p-2 -m-2 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div 
                      className={`${stat.bgColor} rounded-lg p-3`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </motion.div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                      <motion.p 
                        className="text-2xl font-bold text-gray-900 dark:text-white"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 300 }}
                      >
                        {stat.value}
                      </motion.p>
                    </div>
                  </motion.div>
                </Link>
              ) : (
                <div className="flex items-center relative z-10">
                  <motion.div 
                    className={`${stat.bgColor} rounded-lg p-3`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </motion.div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                    <motion.p 
                      className="text-2xl font-bold text-gray-900 dark:text-white"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 300 }}
                    >
                      {stat.value}
                    </motion.p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Skills Section */}
        <motion.div 
          ref={skillsRef}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8 relative overflow-hidden"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{ 
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            y: -2
          }}
        >
          {/* Section background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-transparent to-blue-50/30 dark:from-green-900/20 dark:via-transparent dark:to-blue-900/20 rounded-xl" />
          
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Skills Offered</h2>
            <motion.div>
              <Link
                to="/profile"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  Manage Skills
                </motion.span>
              </Link>
            </motion.div>
          </div>
          
          {hasSkills ? (
            <div className="flex flex-wrap gap-2 relative z-10">
              {user?.skillsOffered.map((skill, index) => (
                <motion.span
                  key={skill}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 400 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
              >
                <AcademicCapIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              </motion.div>
              <motion.h3 
                className="text-lg font-medium text-gray-900 dark:text-white mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                No skills added yet
              </motion.h3>
              <motion.p 
                className="text-gray-600 dark:text-gray-400 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Add your skills to start offering them to others, or request to learn from others
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-3 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <motion.div>
                  <Link
                    to="/profile"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400 }}
                      className="flex items-center"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add Skills
                    </motion.div>
                  </Link>
                </motion.div>
                <motion.button
                  onClick={() => setShowSkillRequestModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <AcademicCapIcon className="h-4 w-4 mr-2" />
                  Request to Learn
                </motion.button>
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* Active Requests Section */}
        <motion.div 
          ref={requestsRef}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8 relative overflow-hidden"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{ 
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            y: -2
          }}
        >
          {/* Section background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-transparent to-pink-50/30 dark:from-purple-900/20 dark:via-transparent dark:to-pink-900/20 rounded-xl" />
          
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Requests</h2>
            <motion.div>
              <Link
                to="/swaps"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  View All
                </motion.span>
              </Link>
            </motion.div>
          </div>
          
          {hasActiveRequests ? (
            <div className="space-y-4 relative z-10">
              {pendingRequests.slice(0, 3).map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <SwapRequestCard
                    request={request}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    onDelete={handleDelete}
                  />
                </motion.div>
              ))}
              {pendingRequests.length > 3 && (
                <motion.div 
                  className="text-center pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <Link
                    to="/swaps"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      View {pendingRequests.length - 3} more requests
                    </motion.span>
                  </Link>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
              >
                <ClockIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              </motion.div>
              <motion.h3 
                className="text-lg font-medium text-gray-900 dark:text-white mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                No active requests
              </motion.h3>
              <motion.p 
                className="text-gray-600 dark:text-gray-400 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                {hasSkills 
                  ? "You don't have any pending swap requests at the moment"
                  : "Start by requesting to learn skills from others"
                }
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-3 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                {!hasSkills && (
                  <motion.button
                    onClick={() => setShowSkillRequestModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <AcademicCapIcon className="h-4 w-4 mr-2" />
                    Request to Learn
                  </motion.button>
                )}
                <motion.div>
                  <Link
                    to="/browse"
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400 }}
                      className="flex items-center"
                    >
                      <UserGroupIcon className="h-4 w-4 mr-2" />
                      Browse Skills
                    </motion.div>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          ref={actionsRef}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{ 
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            y: -2
          }}
        >
          {/* Section background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-transparent to-cyan-50/30 dark:from-indigo-900/20 dark:via-transparent dark:to-cyan-900/20 rounded-xl" />
          
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 relative z-10">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <Link
                to="/browse"
                className="flex items-center p-4 bg-blue-50/80 dark:bg-blue-900/20 backdrop-blur-sm rounded-lg hover:bg-blue-100/80 dark:hover:bg-blue-900/30 transition-all duration-300 border border-blue-200/50 dark:border-blue-800/50"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="flex items-center w-full"
                >
                  <UserGroupIcon className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Browse Skills</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Find new people to swap with</p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Link
                to="/profile"
                className="flex items-center p-4 bg-green-50/80 dark:bg-green-900/20 backdrop-blur-sm rounded-lg hover:bg-green-100/80 dark:hover:bg-green-900/30 transition-all duration-300 border border-green-200/50 dark:border-green-800/50"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="flex items-center w-full"
                >
                  <PlusIcon className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Update Profile</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Add new skills or availability</p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Link
                to="/swaps"
                className="flex items-center p-4 bg-purple-50/80 dark:bg-purple-900/20 backdrop-blur-sm rounded-lg hover:bg-purple-100/80 dark:hover:bg-purple-900/30 transition-all duration-300 border border-purple-200/50 dark:border-purple-800/50"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="flex items-center w-full"
                >
                  <ArrowsRightLeftIcon className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">View All Swaps</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage your swap requests</p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          ref={activityRef}
          className="relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
            <motion.div>
              <Link
                to="/swaps"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  View all
                </motion.span>
              </Link>
            </motion.div>
          </div>
          
          {recentRequests.length > 0 ? (
            <div className="space-y-4">
              {recentRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <SwapRequestCard
                    request={request}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    onDelete={handleDelete}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="text-center py-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ 
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                y: -2
              }}
            >
              {/* Section background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 via-transparent to-blue-50/30 dark:from-gray-900/20 dark:via-transparent dark:to-blue-900/20 rounded-xl" />
              
              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                >
                  <ArrowsRightLeftIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                </motion.div>
                <motion.h3 
                  className="text-lg font-medium text-gray-900 dark:text-white mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  No swap requests yet
                </motion.h3>
                <motion.p 
                  className="text-gray-600 dark:text-gray-400 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  {hasSkills 
                    ? "Start by browsing available skills and sending requests"
                    : "Start by requesting to learn skills from others"
                  }
                </motion.p>
                <motion.div 
                  className="flex flex-col sm:flex-row gap-3 justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  {!hasSkills && (
                    <motion.button
                      onClick={() => setShowSkillRequestModal(true)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <AcademicCapIcon className="h-4 w-4 mr-2" />
                      Request to Learn
                    </motion.button>
                  )}
                  <motion.div>
                    <Link
                      to="/browse"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400 }}
                        className="flex items-center"
                      >
                        Browse Skills
                      </motion.div>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
}