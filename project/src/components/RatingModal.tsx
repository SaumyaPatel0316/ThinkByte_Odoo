import React, { useState } from 'react';
import { 
  XMarkIcon, 
  StarIcon,
  UserIcon 
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { User } from '../types';
import { ratingService } from '../services/ratingService';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: User;
  swapRequestId: string;
  onRatingSubmitted: () => void;
}

export function RatingModal({ 
  isOpen, 
  onClose, 
  targetUser, 
  swapRequestId, 
  onRatingSubmitted 
}: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Get current user from localStorage
      const currentUser = localStorage.getItem('skillswap_current_user');
      if (!currentUser) {
        throw new Error('User not found');
      }
      
      const user = JSON.parse(currentUser);
      
      await ratingService.submitRating({
        fromUserId: user.id,
        toUserId: targetUser.id,
        swapRequestId,
        rating,
        comment: comment.trim(),
      });

      onRatingSubmitted();
      onClose();
      
      // Reset form
      setRating(0);
      setComment('');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Failed to submit rating');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Rate Your Experience
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* User Info */}
          <div className="flex items-center space-x-3">
            {targetUser.profilePhoto ? (
              <img 
                src={targetUser.profilePhoto} 
                alt={targetUser.name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="h-12 w-12 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </div>
            )}
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {targetUser.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {targetUser.location}
              </p>
            </div>
          </div>

          {/* Rating Stars */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              How would you rate your experience?
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="text-2xl text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  {star <= (hoveredRating || rating) ? (
                    <StarIconSolid className="h-8 w-8 text-yellow-400" />
                  ) : (
                    <StarIcon className="h-8 w-8" />
                  )}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {rating > 0 && (
                <span className="text-yellow-600 dark:text-yellow-400">
                  {rating} star{rating !== 1 ? 's' : ''} selected
                </span>
              )}
            </p>
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Share your experience (optional)
            </label>
            <textarea
              id="comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience with this skill swap..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 