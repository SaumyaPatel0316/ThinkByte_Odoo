import React, { useState } from 'react';
import { SwapRequest } from '../types';
import { useAuth } from '../context/AuthContext';
import { RatingModal } from './RatingModal';
import { ratingService } from '../services/ratingService';
import { 
  CheckIcon, 
  XMarkIcon, 
  TrashIcon,
  UserIcon,
  ArrowRightIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { formatDistanceToNow } from 'date-fns';

interface SwapRequestCardProps {
  request: SwapRequest;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRatingSubmitted?: () => void;
}

export function SwapRequestCard({ 
  request, 
  onAccept, 
  onReject, 
  onDelete, 
  onRatingSubmitted 
}: SwapRequestCardProps) {
  const { user } = useAuth();
  const [showRatingModal, setShowRatingModal] = useState(false);
  const isFromCurrentUser = request.fromUserId === user?.id;
  const otherUser = isFromCurrentUser ? request.toUser : request.fromUser;
  const hasRated = ratingService.hasUserRatedSwapRequest(user?.id || '', request.id);
  const existingRating = ratingService.getRatingForSwapRequest(request.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400';
      case 'accepted':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400';
      case 'completed':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400';
      case 'cancelled':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const canDelete = request.status === 'pending' && isFromCurrentUser;
  const canRespond = request.status === 'pending' && !isFromCurrentUser;
  const canRate = request.status === 'completed' && !hasRated;

  const handleRatingSubmitted = () => {
    setShowRatingModal(false);
    if (onRatingSubmitted) {
      onRatingSubmitted();
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {otherUser.profilePhoto ? (
              <img 
                src={otherUser.profilePhoto} 
                alt={otherUser.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                {isFromCurrentUser ? `To ${otherUser.name}` : `From ${otherUser.name}`}
              </h3>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <ClockIcon className="h-3 w-3 mr-1" />
                {formatDistanceToNow(request.createdAt, { addSuffix: true })}
              </div>
            </div>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
        </div>

        {/* Skills Exchange */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                request.offeredSkill === 'Learning Request' 
                  ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400'
                  : 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400'
              }`}>
                {request.offeredSkill === 'Learning Request' ? 'Learning Request' : request.offeredSkill}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {request.offeredSkill === 'Learning Request' ? 'Type' : 'Offered'}
              </p>
            </div>
            <ArrowRightIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            <div className="text-center">
              <div className="bg-teal-100 dark:bg-teal-900/20 text-teal-800 dark:text-teal-400 px-3 py-1 rounded-full text-sm font-medium">
                {request.requestedSkill}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Wants to Learn</p>
            </div>
          </div>
        </div>

        {/* Message */}
        {request.message && (
          <div className="mb-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              "{request.message}"
            </p>
          </div>
        )}

        {/* Rating Display */}
        {existingRating && (
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>
                    {star <= existingRating.rating ? (
                      <StarIconSolid className="h-4 w-4 text-yellow-400" />
                    ) : (
                      <StarIcon className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                    )}
                  </span>
                ))}
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {existingRating.rating}/5
              </span>
            </div>
            {existingRating.comment && (
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                "{existingRating.comment}"
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3">
          {canRespond && onAccept && onReject && (
            <>
              <button
                onClick={() => onAccept(request.id)}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium flex items-center justify-center space-x-2"
              >
                <CheckIcon className="h-4 w-4" />
                <span>Accept</span>
              </button>
              <button
                onClick={() => onReject(request.id)}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium flex items-center justify-center space-x-2"
              >
                <XMarkIcon className="h-4 w-4" />
                <span>Reject</span>
              </button>
            </>
          )}
          
          {canDelete && onDelete && (
            <button
              onClick={() => onDelete(request.id)}
              className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium flex items-center justify-center space-x-2"
            >
              <TrashIcon className="h-4 w-4" />
              <span>Delete</span>
            </button>
          )}

          {canRate && (
            <button
              onClick={() => setShowRatingModal(true)}
              className="bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors duration-200 font-medium flex items-center justify-center space-x-2"
            >
              <StarIcon className="h-4 w-4" />
              <span>Rate Experience</span>
            </button>
          )}
        </div>
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        targetUser={otherUser}
        swapRequestId={request.id}
        onRatingSubmitted={handleRatingSubmitted}
      />
    </>
  );
}