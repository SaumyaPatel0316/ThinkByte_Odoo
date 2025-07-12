import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { SkillCard } from '../components/SkillCard';
import { SwapRequestModal } from '../components/SwapRequestModal';
import { User } from '../types';
import { localStorageService } from '../services/localStorageService';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Browse Skills</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover talented people and find the perfect skill swap
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search by name or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            <FunnelIcon className="h-5 w-5" />
            <span>Filters</span>
          </button>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPinIcon className="h-4 w-4 inline mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g., New York, San Francisco"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <ClockIcon className="h-4 w-4 inline mr-1" />
                  Availability
                </label>
                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Any time</option>
                  <option value="weekends">Weekends</option>
                  <option value="evenings">Evenings</option>
                  <option value="mornings">Mornings</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400">
          {filteredUsers.length} {filteredUsers.length === 1 ? 'person' : 'people'} found
        </p>
      </div>

      {/* User Grid */}
      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <SkillCard
              key={user.id}
              user={user}
              onSendRequest={handleSendRequest}
            />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No users found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            There are no users available to browse. Try registering some demo accounts first.
          </p>
          <button
            onClick={() => {
              localStorageService.initializeDemoUsers();
              const allUsers = localStorageService.getAllUsers();
              setUsers(allUsers);
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Load Demo Users
          </button>
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No results found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Try adjusting your search criteria or filters
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setLocationFilter('');
              setAvailabilityFilter('');
            }}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
      
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