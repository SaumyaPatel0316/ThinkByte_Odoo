import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSwapRequests } from '../hooks/useSwapRequests';
import { SwapRequestCard } from '../components/SwapRequestCard';
import { ProfileSetupNotification } from '../components/ProfileSetupNotification';
import { SkillRequestModal } from '../components/SkillRequestModal';
import { 
  UserGroupIcon, 
  ArrowsRightLeftIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  PlusIcon,
  AcademicCapIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { user, isProfileComplete } = useAuth();
  const { swapRequests, updateSwapRequest, deleteSwapRequest } = useSwapRequests(user?.id);
  const [showProfileNotification, setShowProfileNotification] = useState(!isProfileComplete);
  const [showSkillRequestModal, setShowSkillRequestModal] = useState(false);

  const stats = [
    {
      name: 'Total Swaps',
      value: user?.totalSwaps || 0,
      icon: ArrowsRightLeftIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      link: '/swaps',
    },
    {
      name: 'Rating',
      value: user?.rating?.toFixed(1) || '0.0',
      icon: StarIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      link: null,
    },
    {
      name: 'Skills Offered',
      value: user?.skillsOffered?.length || 0,
      icon: ArrowTrendingUpIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      link: '/profile',
    },
    {
      name: 'Active Requests',
      value: swapRequests.filter(req => req.status === 'pending').length,
      icon: UserGroupIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      link: '/swaps',
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

  const handleRequestSent = () => {
    // Refresh the page or update the swap requests
    window.location.reload();
  };

  const pendingRequests = swapRequests.filter(req => req.status === 'pending');
  const recentRequests = swapRequests.slice(0, 3);

  const hasSkills = user?.skillsOffered && user.skillsOffered.length > 0;
  const hasActiveRequests = pendingRequests.length > 0;

  return (
    <>
      {showProfileNotification && (
        <ProfileSetupNotification 
          onDismiss={() => setShowProfileNotification(false)} 
        />
      )}
      
      <SkillRequestModal
        isOpen={showSkillRequestModal}
        onClose={() => setShowSkillRequestModal(false)}
        onRequestSent={handleRequestSent}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Here's what's happening with your skill swaps
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              {stat.link ? (
                <Link to={stat.link} className="block">
                  <div className="flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2 -m-2 transition-colors">
                    <div className={`${stat.bgColor} rounded-lg p-3`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center">
                  <div className={`${stat.bgColor} rounded-lg p-3`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Skills Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Skills Offered</h2>
            <Link
              to="/profile"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
            >
              Manage Skills
            </Link>
          </div>
          
          {hasSkills ? (
            <div className="flex flex-wrap gap-2">
              {user?.skillsOffered.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AcademicCapIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No skills added yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Add your skills to start offering them to others, or request to learn from others
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/profile"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Skills
                </Link>
                <button
                  onClick={() => setShowSkillRequestModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <AcademicCapIcon className="h-4 w-4 mr-2" />
                  Request to Learn
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Active Requests Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Requests</h2>
            <Link
              to="/swaps"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          
          {hasActiveRequests ? (
            <div className="space-y-4">
              {pendingRequests.slice(0, 3).map((request) => (
                <SwapRequestCard
                  key={request.id}
                  request={request}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  onDelete={handleDelete}
                />
              ))}
              {pendingRequests.length > 3 && (
                <div className="text-center pt-4">
                  <Link
                    to="/swaps"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    View {pendingRequests.length - 3} more requests
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <ClockIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No active requests</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {hasSkills 
                  ? "You don't have any pending swap requests at the moment"
                  : "Start by requesting to learn skills from others"
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {!hasSkills && (
                  <button
                    onClick={() => setShowSkillRequestModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <AcademicCapIcon className="h-4 w-4 mr-2" />
                    Request to Learn
                  </button>
                )}
                <Link
                  to="/browse"
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <UserGroupIcon className="h-4 w-4 mr-2" />
                  Browse Skills
                </Link>
              </div>
            </div>
          )}
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

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
            <Link
              to="/swaps"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
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
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {hasSkills 
                  ? "Start by browsing available skills and sending requests"
                  : "Start by requesting to learn skills from others"
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {!hasSkills && (
                  <button
                    onClick={() => setShowSkillRequestModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <AcademicCapIcon className="h-4 w-4 mr-2" />
                    Request to Learn
                  </button>
                )}
                <Link
                  to="/browse"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Skills
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}