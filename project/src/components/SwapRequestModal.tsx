import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { User } from '../types';
import { useAuth } from '../context/AuthContext';
import { useSwapRequests } from '../hooks/useSwapRequests';
import { useToast } from '../context/ToastContext';

interface SwapRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: User;
}

export function SwapRequestModal({ isOpen, onClose, targetUser }: SwapRequestModalProps) {
  const { user } = useAuth();
  const { createSwapRequest } = useSwapRequests(user?.id);
  const { showToast } = useToast();
  
  const [skillOffered, setSkillOffered] = useState('');
  const [skillWanted, setSkillWanted] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!skillOffered || !skillWanted) {
      showToast({
        type: 'error',
        title: 'Missing Information',
        message: 'Please select both a skill to offer and a skill you want to learn.'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createSwapRequest({
        toUserId: targetUser.id,
        skillOffered,
        skillWanted,
        message: message.trim() || undefined,
      });

      showToast({
        type: 'success',
        title: 'Request Sent!',
        message: `Your swap request has been sent to ${targetUser.name}.`
      });

      // Reset form
      setSkillOffered('');
      setSkillWanted('');
      setMessage('');
      onClose();
    } catch {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to send swap request. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableSkillsOffered = user.skillsOffered.filter(skill => 
    targetUser.skillsWanted.includes(skill)
  );

  const availableSkillsWanted = targetUser.skillsOffered.filter(skill => 
    user.skillsWanted.includes(skill)
  );

  // If no matching skills, show all skills as options
  const skillsOfferedOptions = availableSkillsOffered.length > 0 
    ? availableSkillsOffered 
    : user.skillsOffered;

  const skillsWantedOptions = availableSkillsWanted.length > 0 
    ? availableSkillsWanted 
    : targetUser.skillsOffered;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Send Swap Request
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-4">
            <div className="flex items-center space-x-3 mb-3">
              {targetUser.profilePhoto ? (
                <img 
                  src={targetUser.profilePhoto} 
                  alt={targetUser.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    {targetUser.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{targetUser.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{targetUser.location}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                I can teach you:
              </label>
              <select
                value={skillOffered}
                onChange={(e) => setSkillOffered(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Select a skill you can teach</option>
                {skillsOfferedOptions.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
              {availableSkillsOffered.length === 0 && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  You don't have any skills that {targetUser.name} wants to learn.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                I want to learn:
              </label>
              <select
                value={skillWanted}
                onChange={(e) => setSkillWanted(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Select a skill you want to learn</option>
                {skillsWantedOptions.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
              {availableSkillsWanted.length === 0 && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {targetUser.name} doesn't have any skills that you want to learn.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message (optional):
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a personal message to your request..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>

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
                disabled={isSubmitting || availableSkillsOffered.length === 0 || availableSkillsWanted.length === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 