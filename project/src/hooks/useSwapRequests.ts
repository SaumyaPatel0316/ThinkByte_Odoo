import { useState, useEffect } from 'react';
import { SwapRequest, User } from '../types';

// Mock data
const mockSwapRequests: SwapRequest[] = [
  {
    id: '1',
    fromUserId: '2',
    toUserId: '1',
    fromUser: {
      id: '2',
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      profilePhoto: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      isPublic: true,
      skillsOffered: ['Python', 'Data Science'],
      skillsWanted: ['React'],
      availability: ['Weekends'],
      rating: 4.9,
      totalSwaps: 8,
      joinedAt: new Date(),
    },
    toUser: {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      profilePhoto: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      isPublic: true,
      skillsOffered: ['React'],
      skillsWanted: ['Python'],
      availability: ['Weekends'],
      rating: 4.8,
      totalSwaps: 12,
      joinedAt: new Date(),
    },
    offeredSkill: 'Python',
    requestedSkill: 'React',
    status: 'pending',
    message: 'Hi! I\'d love to learn React from you in exchange for Python tutoring.',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
];

export function useSwapRequests(userId?: string) {
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>(mockSwapRequests);
  const [loading, setLoading] = useState(false);

  const createSwapRequest = async (request: Omit<SwapRequest, 'id' | 'createdAt' | 'updatedAt' | 'fromUser' | 'toUser'>) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newRequest: SwapRequest = {
      ...request,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      fromUser: {} as User, // Would be populated from backend
      toUser: {} as User, // Would be populated from backend
    };
    
    setSwapRequests(prev => [...prev, newRequest]);
    setLoading(false);
  };

  const updateSwapRequest = async (id: string, updates: Partial<SwapRequest>) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setSwapRequests(prev => 
      prev.map(request => 
        request.id === id 
          ? { ...request, ...updates, updatedAt: new Date() }
          : request
      )
    );
    setLoading(false);
  };

  const deleteSwapRequest = async (id: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setSwapRequests(prev => prev.filter(request => request.id !== id));
    setLoading(false);
  };

  const userRequests = userId 
    ? swapRequests.filter(req => req.fromUserId === userId || req.toUserId === userId)
    : swapRequests;

  return {
    swapRequests: userRequests,
    loading,
    createSwapRequest,
    updateSwapRequest,
    deleteSwapRequest,
  };
}