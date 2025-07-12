import React from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { CheckIcon as CheckIconSolid } from '@heroicons/react/24/solid';

interface MessageStatusProps {
  status: 'sending' | 'sent' | 'delivered' | 'read';
  isFromCurrentUser: boolean;
}

export function MessageStatus({ status, isFromCurrentUser }: MessageStatusProps) {
  if (!isFromCurrentUser) return null;

  const getStatusIcon = () => {
    switch (status) {
      case 'sending':
        return (
          <div className="animate-pulse">
            <CheckIcon className="h-3 w-3 text-gray-400" />
          </div>
        );
      case 'sent':
        return <CheckIcon className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return (
          <div className="flex">
            <CheckIcon className="h-3 w-3 text-gray-400" />
            <CheckIcon className="h-3 w-3 text-gray-400 -ml-1" />
          </div>
        );
      case 'read':
        return (
          <div className="flex">
            <CheckIconSolid className="h-3 w-3 text-blue-500" />
            <CheckIconSolid className="h-3 w-3 text-blue-500 -ml-1" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-end mt-1">
      {getStatusIcon()}
    </div>
  );
} 