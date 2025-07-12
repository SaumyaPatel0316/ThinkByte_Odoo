import React from 'react';
import { User } from '../types';
import { 
  MapPinIcon, 
  StarIcon, 
  ClockIcon,
  UserIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface SkillCardProps {
  user: User;
  onSendRequest?: (user: User) => void;
  compact?: boolean;
}

export function SkillCard({ user, onSendRequest, compact = false }: SkillCardProps) {
  if (!user.isPublic) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
        <EyeSlashIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
        <p className="text-gray-500 dark:text-gray-400">Private Profile</p>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i}>
        {i < Math.floor(rating) ? (
          <StarIconSolid className="h-4 w-4 text-yellow-400" />
        ) : (
          <StarIcon className="h-4 w-4 text-gray-300 dark:text-gray-600" />
        )}
      </span>
    ));
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-4">
        {user.profilePhoto ? (
          <img 
            src={user.profilePhoto} 
            alt={user.name}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <div className="h-12 w-12 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
            <UserIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{user.name}</h3>
          {user.location && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <MapPinIcon className="h-4 w-4 mr-1" />
              {user.location}
            </div>
          )}
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="flex space-x-1">
          {renderStars(user.rating)}
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {user.rating.toFixed(1)} ({user.totalSwaps} swaps)
        </span>
      </div>

      {!compact && (
        <>
          {/* Skills Offered */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Skills Offered</h4>
            <div className="flex flex-wrap gap-2">
              {user.skillsOffered.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400"
                >
                  {skill}
                </span>
              ))}
              {user.skillsOffered.length > 3 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                  +{user.skillsOffered.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Skills Wanted */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Skills Wanted</h4>
            <div className="flex flex-wrap gap-2">
              {user.skillsWanted.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 dark:bg-teal-900/20 text-teal-800 dark:text-teal-400"
                >
                  {skill}
                </span>
              ))}
              {user.skillsWanted.length > 3 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                  +{user.skillsWanted.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Availability */}
          <div className="mb-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <ClockIcon className="h-4 w-4 mr-1" />
              Available: {user.availability.join(', ')}
            </div>
          </div>

          {/* Action Button */}
          {onSendRequest && (
            <button
              onClick={() => onSendRequest(user)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Send Swap Request
            </button>
          )}
        </>
      )}
    </div>
  );
}