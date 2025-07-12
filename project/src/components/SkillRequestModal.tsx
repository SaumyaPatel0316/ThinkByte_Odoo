import React, { useState, useEffect } from 'react';
import { XMarkIcon, MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline';
import { localStorageService } from '../services/localStorageService';
import { User } from '../types';

interface SkillRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestSent: () => void;
}

export function SkillRequestModal({ isOpen, onClose, onRequestSent }: SkillRequestModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (isOpen) {
      const allUsers = localStorageService.getAllUsers();
      setUsers(allUsers);
    }
  }, [isOpen]);

  // Filter users who can teach the selected skill
  const availableTeachers = users.filter(user => 
    user.skillsOffered.some(skill => 
      skill.toLowerCase().includes(selectedSkill.toLowerCase())
    )
  );

  // Filter users based on search query
  const filteredUsers = availableTeachers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.skillsOffered.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkill || !selectedUser || !message.trim()) return;

    setIsSubmitting(true);
    try {
      // Create a swap request for learning
      const currentUser = localStorageService.getCurrentUser();
      if (!currentUser) return;

      localStorageService.createSwapRequest({
        fromUserId: currentUser.id,
        toUserId: selectedUser.id,
        skillOffered: 'Learning Request', // Placeholder since user has no skills
        skillWanted: selectedSkill,
        message: message.trim(),
      });

      onRequestSent();
      onClose();
      
      // Reset form
      setSelectedSkill('');
      setSelectedUser(null);
      setMessage('');
    } catch (error) {
      console.error('Failed to send request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Request to Learn a Skill
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Skill Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What skill would you like to learn?
              </label>
              <input
                type="text"
                placeholder="e.g., React, Python, Photography..."
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                required
              />
            </div>

            {/* Available Teachers */}
            {selectedSkill && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Available Teachers
                </label>
                <div className="relative mb-3">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search teachers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 text-sm"
                  />
                </div>
                
                <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => setSelectedUser(user)}
                        className={`w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 transition-colors ${
                          selectedUser?.id === user.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {user.profilePhoto ? (
                            <img 
                              src={user.profilePhoto} 
                              alt={user.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {user.skillsOffered.join(', ')}
                            </p>
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-gray-400 dark:text-gray-500">
                                Rating: {user.rating.toFixed(1)} • {user.totalSwaps} swaps
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      <p>No teachers found for "{selectedSkill}"</p>
                      <p className="text-sm mt-1">Try a different skill or check back later</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Message */}
            {selectedUser && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message to {selectedUser.name}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Hi ${selectedUser.name}, I'd love to learn ${selectedSkill} from you. I'm a beginner and would appreciate your guidance...`}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  required
                />
              </div>
            )}

            {/* Submit Button */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !selectedSkill || !selectedUser || !message.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Sending...' : 'Send Learning Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 