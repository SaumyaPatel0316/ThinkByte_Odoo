import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSwapRequests } from '../hooks/useSwapRequests';
import { SwapRequestCard } from '../components/SwapRequestCard';
import { ProfileSetupNotification } from '../components/ProfileSetupNotification';
import { 
  UserGroupIcon, 
  ArrowsRightLeftIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { user, isProfileComplete } = useAuth();
  const { swapRequests, updateSwapRequest, deleteSwapRequest } = useSwapRequests(user?.id);
  const [showProfileNotification, setShowProfileNotification] = useState(!isProfileComplete);

  const stats = [
    {
      name: 'Total Swaps',
      value: user?.totalSwaps || 0,
      icon: ArrowsRightLeftIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Rating',
      value: user?.rating?.toFixed(1) || '0.0',
      icon: StarIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      name: 'Skills Offered',
      value: user?.skillsOffered?.length || 0,
      icon: ArrowTrendingUpIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Active Requests',
      value: swapRequests.filter(req => req.status === 'pending').length,
      icon: UserGroupIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
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

  const pendingRequests = swapRequests.filter(req => req.status === 'pending');
  const recentRequests = swapRequests.slice(0, 3);

  return (
    <>
      {showProfileNotification && (
        <ProfileSetupNotification 
          onDismiss={() => setShowProfileNotification(false)} 
        />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your skill swaps
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className={`${stat.bgColor} rounded-lg p-3`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/browse"
            className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <UserGroupIcon className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Browse Skills</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Find new people to swap with</p>
            </div>
          </Link>
          
          <Link
            to="/profile"
            className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <PlusIcon className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Update Profile</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Add new skills or availability</p>
            </div>
          </Link>
          
          <Link
            to="/swaps"
            className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            <ArrowsRightLeftIcon className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">View All Swaps</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage your swap requests</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Pending Requests ({pendingRequests.length})
          </h2>
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <SwapRequestCard
                key={request.id}
                request={request}
                onAccept={handleAccept}
                onReject={handleReject}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
          <Link
            to="/swaps"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View all
          </Link>
        </div>
        
        {recentRequests.length > 0 ? (
          <div className="space-y-4">
            {recentRequests.map((request) => (
              <SwapRequestCard
                key={request.id}
                request={request}
                onAccept={handleAccept}
                onReject={handleReject}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <ArrowsRightLeftIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No swap requests yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Start by browsing available skills and sending requests</p>
            <Link
              to="/browse"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Skills
            </Link>
          </div>
        )}
      </div>
      </div>
    </>
  );
}