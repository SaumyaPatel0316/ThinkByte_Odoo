import { useState, useEffect } from 'react';
import { localStorageService } from '../services/localStorageService';
import { SwapRequest, User } from '../types';

export function useSwapRequests(userId?: string) {
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      const requests = localStorageService.getSwapRequestsForUser(userId);
      // Convert localStorage format to SwapRequest format
      const formattedRequests: SwapRequest[] = requests.map((req: any) => ({
        id: req.id,
        fromUserId: req.fromUserId,
        toUserId: req.toUserId,
        fromUser: localStorageService.getUserById(req.fromUserId) || {} as User,
        toUser: localStorageService.getUserById(req.toUserId) || {} as User,
        offeredSkill: req.skillOffered,
        requestedSkill: req.skillWanted,
        status: req.status,
        message: req.message,
        createdAt: new Date(req.createdAt),
        updatedAt: new Date(req.updatedAt || req.createdAt),
      }));
      setSwapRequests(formattedRequests);
    }
  }, [userId]);

  const createSwapRequest = async (request: {
    toUserId: string;
    skillOffered: string;
    skillWanted: string;
    message?: string;
  }) => {
    if (!userId) throw new Error('User not logged in');
    
    setLoading(true);
    try {
      const newRequest = localStorageService.createSwapRequest({
        fromUserId: userId,
        ...request
      });
      
      // Convert to SwapRequest format
      const formattedRequest: SwapRequest = {
        id: newRequest.id,
        fromUserId: newRequest.fromUserId,
        toUserId: newRequest.toUserId,
        fromUser: localStorageService.getUserById(newRequest.fromUserId) || {} as User,
        toUser: localStorageService.getUserById(newRequest.toUserId) || {} as User,
        offeredSkill: newRequest.skillOffered,
        requestedSkill: newRequest.skillWanted,
        status: newRequest.status,
        message: newRequest.message,
        createdAt: new Date(newRequest.createdAt),
        updatedAt: new Date(newRequest.createdAt),
      };
      
      setSwapRequests(prev => [...prev, formattedRequest]);
      return formattedRequest;
    } finally {
      setLoading(false);
    }
  };

  const updateSwapRequest = async (id: string, updates: Partial<SwapRequest>) => {
    setLoading(true);
    try {
      const updatedRequest = localStorageService.updateSwapRequest(id, updates);
      
      // Convert to SwapRequest format
      const formattedRequest: SwapRequest = {
        id: updatedRequest.id,
        fromUserId: updatedRequest.fromUserId,
        toUserId: updatedRequest.toUserId,
        fromUser: localStorageService.getUserById(updatedRequest.fromUserId) || {} as User,
        toUser: localStorageService.getUserById(updatedRequest.toUserId) || {} as User,
        offeredSkill: updatedRequest.skillOffered,
        requestedSkill: updatedRequest.skillWanted,
        status: updatedRequest.status,
        message: updatedRequest.message,
        createdAt: new Date(updatedRequest.createdAt),
        updatedAt: new Date(updatedRequest.updatedAt || updatedRequest.createdAt),
      };
      
      setSwapRequests(prev => 
        prev.map(req => req.id === id ? formattedRequest : req)
      );
      return formattedRequest;
    } finally {
      setLoading(false);
    }
  };

  const deleteSwapRequest = async (id: string) => {
    setLoading(true);
    try {
      localStorageService.deleteSwapRequest(id);
      setSwapRequests(prev => prev.filter(req => req.id !== id));
    } finally {
      setLoading(false);
    }
  };

  return {
    swapRequests,
    loading,
    createSwapRequest,
    updateSwapRequest,
    deleteSwapRequest,
  };
}