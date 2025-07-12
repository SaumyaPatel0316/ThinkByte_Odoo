import { useState, useEffect } from 'react';
import { Message, Conversation, User } from '../types';

// Mock data
const mockUsers: User[] = [
  {
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
  {
    id: '3',
    name: 'Mike Rodriguez',
    email: 'mike@example.com',
    profilePhoto: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    isPublic: true,
    skillsOffered: ['Digital Marketing'],
    skillsWanted: ['Web Development'],
    availability: ['Flexible'],
    rating: 4.7,
    totalSwaps: 15,
    joinedAt: new Date(),
    isAdmin: true,
  },
];

const mockConversations: Conversation[] = [
  {
    id: '1',
    participants: ['1', '2'],
    lastMessage: {
      id: '1',
      conversationId: '1',
      senderId: '2',
      receiverId: '1',
      content: 'Hi! I\'d love to learn React from you in exchange for Python tutoring.',
      type: 'text',
      isRead: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '2',
    participants: ['1', '3'],
    lastMessage: {
      id: '2',
      conversationId: '2',
      senderId: '1',
      receiverId: '3',
      content: 'Thanks for accepting my swap request!',
      type: 'text',
      isRead: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    conversationId: '1',
    senderId: '2',
    receiverId: '1',
    content: 'Hi! I\'d love to learn React from you in exchange for Python tutoring.',
    type: 'text',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '2',
    conversationId: '2',
    senderId: '1',
    receiverId: '3',
    content: 'Thanks for accepting my swap request!',
    type: 'text',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    conversationId: '2',
    senderId: '3',
    receiverId: '1',
    content: 'You\'re welcome! Looking forward to our session.',
    type: 'text',
    isRead: true,
    createdAt: new Date(Date.now() - 23 * 60 * 60 * 1000),
  },
];

export function useMessages(userId?: string) {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [loading, setLoading] = useState(false);

  const getUserById = (id: string): User | undefined => {
    return mockUsers.find(user => user.id === id);
  };

  const getConversationMessages = (conversationId: string): Message[] => {
    return messages.filter(msg => msg.conversationId === conversationId);
  };

  const sendMessage = async (conversationId: string, content: string, receiverId: string) => {
    if (!userId) return;

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newMessage: Message = {
      id: Date.now().toString(),
      conversationId,
      senderId: userId,
      receiverId,
      content,
      type: 'text',
      isRead: false,
      createdAt: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Update conversation's last message
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, lastMessage: newMessage, updatedAt: new Date() }
          : conv
      )
    );

    setLoading(false);
  };

  const markAsRead = async (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      )
    );
  };

  const createConversation = async (participantId: string): Promise<string> => {
    if (!userId) return '';

    const existingConv = conversations.find(conv => 
      conv.participants.includes(userId) && conv.participants.includes(participantId)
    );

    if (existingConv) {
      return existingConv.id;
    }

    const newConversation: Conversation = {
      id: Date.now().toString(),
      participants: [userId, participantId],
      updatedAt: new Date(),
    };

    setConversations(prev => [...prev, newConversation]);
    return newConversation.id;
  };

  return {
    conversations,
    messages,
    loading,
    getUserById,
    getConversationMessages,
    sendMessage,
    markAsRead,
    createConversation,
  };
}