import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSwapRequests } from '../hooks/useSwapRequests';
import { SwapRequestCard } from '../components/SwapRequestCard';
import { 
  ClockIcon, 
  CheckIcon, 
  XMarkIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';

export function SwapRequests() {
  const { user } = useAuth();
  const { swapRequests, updateSwapRequest, deleteSwapRequest } = useSwapRequests(user?.id);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'accepted' | 'completed'>('all');

  const handleAccept = async (id: string) => {
    await updateSwapRequest(id, { status: 'accepted' });
  };

  const handleReject = async (id: string) => {
    await updateSwapRequest(id, { status: 'rejected' });
  };

  const handleDelete = async (id: string) => {
    await deleteSwapRequest(id);
  };

  const filteredRequests = swapRequests.filter(request => {
    if (activeTab === 'all') return true;
    return request.status === activeTab;
  });

  const tabs = [
    { id: 'all', name: 'All', icon: ArrowsRightLeftIcon },
    { id: 'pending', name: 'Pending', icon: ClockIcon },
    { id: 'accepted', name: 'Accepted', icon: CheckIcon },
    { id: 'completed', name: 'Completed', icon: XMarkIcon },
  ];

  const getRequestCounts = () => {
    return {
      all: swapRequests.length,
      pending: swapRequests.filter(r => r.status === 'pending').length,
      accepted: swapRequests.filter(r => r.status === 'accepted').length,
      completed: swapRequests.filter(r => r.status === 'completed').length,
    };
  };

  const counts = getRequestCounts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Swap Requests</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your skill swap requests and track your exchanges
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {tabs.map((tab) => {
            const count = counts[tab.id as keyof typeof counts];
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'all' | 'pending' | 'accepted' | 'completed')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
                {count > 0 && (
                  <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    activeTab === tab.id
                      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Requests List */}
      {filteredRequests.length > 0 ? (
        <div className="space-y-6">
          {filteredRequests.map((request) => (
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
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {activeTab === 'all' 
              ? 'No swap requests yet'
              : `No ${activeTab} requests`
            }
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {activeTab === 'pending' 
              ? 'You don\'t have any pending requests at the moment'
              : activeTab === 'accepted'
              ? 'No accepted requests to show'
              : activeTab === 'completed'
              ? 'No completed swaps yet'
              : 'Start by browsing available skills and sending requests'
            }
          </p>
          {activeTab === 'all' && (
            <button
              onClick={() => window.location.href = '/browse'}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Skills
            </button>
          )}
        </div>
      )}
    </div>
  );
}