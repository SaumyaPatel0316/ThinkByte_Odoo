import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { SkillCard } from '../components/SkillCard';
import { SwapRequestModal } from '../components/SwapRequestModal';
import { User } from '../types';
import { localStorageService } from '../services/localStorageService';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { gsap } from 'gsap';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export function Browse() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showSwapModal, setShowSwapModal] = useState(false);

  // Refs for GSAP animations
  const headerRef = useRef(null);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);
  const gridRef = useRef(null);

  // GSAP animations on mount
  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(headerRef.current, 
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    )
    .fromTo(searchRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.3"
    )
    .fromTo(resultsRef.current,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    )
    .fromTo(gridRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.3"
    );
  }, []);

  // React Spring for search input animation
  const searchSpring = useSpring({
    transform: searchQuery ? 'scale(1.02)' : 'scale(1)',
    config: { tension: 300, friction: 20 }
  });

  // Load users from localStorage
  useEffect(() => {
    const allUsers = localStorageService.getAllUsers();
    setUsers(allUsers);
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      // Don't show current user
      if (u.id === user?.id) return false;
      
      // Only show public profiles
      if (!u.isPublic) return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = u.name.toLowerCase().includes(query);
        const matchesSkillsOffered = u.skillsOffered.some(skill => 
          skill.toLowerCase().includes(query)
        );
        const matchesSkillsWanted = u.skillsWanted.some(skill => 
          skill.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesSkillsOffered && !matchesSkillsWanted) {
          return false;
        }
      }
      
      // Location filter
      if (locationFilter && u.location && !u.location.toLowerCase().includes(locationFilter.toLowerCase())) {
        return false;
      }
      
      // Availability filter
      if (availabilityFilter && !u.availability.some(avail => 
        avail.toLowerCase().includes(availabilityFilter.toLowerCase())
      )) {
        return false;
      }
      
      return true;
    });
  }, [users, searchQuery, locationFilter, availabilityFilter, user?.id]);

  const handleSendRequest = (targetUser: User) => {
    setSelectedUser(targetUser);
    setShowSwapModal(true);
  };

  return (
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

      {/* Header */}
      <motion.div 
        ref={headerRef}
        className="mb-8 relative z-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h1 
          className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
          animate={{ 
            textShadow: [
              "0 0 0px rgba(0, 0, 0, 0)",
              "0 0 10px rgba(59, 130, 246, 0.1)",
              "0 0 0px rgba(0, 0, 0, 0)"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          Browse Skills
        </motion.h1>
        <motion.p 
          className="text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Discover talented people and find the perfect skill swap
        </motion.p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div 
        ref={searchRef}
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{ 
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          y: -2
        }}
      >
        {/* Section background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-teal-50/30 dark:from-blue-900/20 dark:via-transparent dark:to-teal-900/20 rounded-xl" />
        
        <div className="space-y-4 relative z-10">
          {/* Search Bar */}
          <animated.div 
            className="relative"
            style={searchSpring}
          >
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <motion.input
              type="text"
              placeholder="Search by name or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700/80 dark:text-white dark:placeholder-gray-400 bg-white/80 backdrop-blur-sm shadow-inner"
              whileFocus={{ 
                scale: 1.02,
                boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          </animated.div>

          {/* Filter Toggle */}
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <motion.div
              animate={{ rotate: showFilters ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FunnelIcon className="h-5 w-5" />
            </motion.div>
            <span>Filters</span>
          </motion.button>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                >
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MapPinIcon className="h-4 w-4 inline mr-1" />
                    Location
                  </label>
                  <motion.input
                    type="text"
                    placeholder="e.g., New York, San Francisco"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700/80 dark:text-white dark:placeholder-gray-400 bg-white/80 backdrop-blur-sm shadow-inner"
                    whileFocus={{ 
                      scale: 1.02,
                      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <ClockIcon className="h-4 w-4 inline mr-1" />
                    Availability
                  </label>
                  <motion.select
                    value={availabilityFilter}
                    onChange={(e) => setAvailabilityFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700/80 dark:text-white bg-white/80 backdrop-blur-sm shadow-inner"
                    whileFocus={{ 
                      scale: 1.02,
                      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <option value="">Any time</option>
                    <option value="weekends">Weekends</option>
                    <option value="evenings">Evenings</option>
                    <option value="mornings">Mornings</option>
                    <option value="flexible">Flexible</option>
                  </motion.select>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Results */}
      <motion.div 
        ref={resultsRef}
        className="mb-6 relative z-10"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.p 
          className="text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {filteredUsers.length} {filteredUsers.length === 1 ? 'person' : 'people'} found
        </motion.p>
      </motion.div>

      {/* User Grid */}
      <motion.div 
        ref={gridRef}
        className="relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ 
                  y: -5,
                  scale: 1.02
                }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut", type: "spring", stiffness: 300, damping: 20 }}
              >
                <SkillCard
                  user={user}
                  onSendRequest={handleSendRequest}
                />
              </motion.div>
            ))}
          </div>
        ) : users.length === 0 ? (
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
                <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              </motion.div>
              <motion.h3 
                className="text-lg font-medium text-gray-900 dark:text-white mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                No users found
              </motion.h3>
              <motion.p 
                className="text-gray-600 dark:text-gray-400 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                There are no users available to browse. Load demo data to see sample users and conversations.
              </motion.p>
              <motion.button
                onClick={() => {
                  localStorageService.initializeDemoData();
                  const allUsers = localStorageService.getAllUsers();
                  setUsers(allUsers);
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6, type: "spring", stiffness: 400 }}
              >
                Load Demo Data
              </motion.button>
            </div>
          </motion.div>
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
                <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              </motion.div>
              <motion.h3 
                className="text-lg font-medium text-gray-900 dark:text-white mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                No results found
              </motion.h3>
              <motion.p 
                className="text-gray-600 dark:text-gray-400 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Try adjusting your search criteria or filters
              </motion.p>
              <motion.button
                onClick={() => {
                  setSearchQuery('');
                  setLocationFilter('');
                  setAvailabilityFilter('');
                }}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6, type: "spring", stiffness: 400 }}
              >
                Clear all filters
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
      
      {/* Swap Request Modal */}
      {selectedUser && (
        <SwapRequestModal
          isOpen={showSwapModal}
          onClose={() => {
            setShowSwapModal(false);
            setSelectedUser(null);
          }}
          targetUser={selectedUser}
        />
      )}
    </div>
  );
}