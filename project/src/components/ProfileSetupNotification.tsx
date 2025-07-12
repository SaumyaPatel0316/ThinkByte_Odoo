import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ExclamationTriangleIcon, 
  XMarkIcon,
  UserIcon 
} from '@heroicons/react/24/outline';

interface ProfileSetupNotificationProps {
  onDismiss: () => void;
}

export function ProfileSetupNotification({ onDismiss }: ProfileSetupNotificationProps) {
  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full bg-yellow-50 border border-yellow-200 rounded-lg shadow-lg">
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-yellow-800">
              Complete Your Profile
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Welcome to SkillSwap! To start connecting with other users and sharing your skills, 
                please complete your profile by adding your skills and availability.
              </p>
            </div>
            <div className="mt-4 flex space-x-3">
              <Link
                to="/profile"
                className="flex items-center space-x-2 bg-yellow-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-yellow-700 transition-colors"
              >
                <UserIcon className="h-4 w-4" />
                <span>Setup Profile</span>
              </Link>
              <button
                onClick={onDismiss}
                className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
              >
                Dismiss
              </button>
            </div>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={onDismiss}
              className="text-yellow-400 hover:text-yellow-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 