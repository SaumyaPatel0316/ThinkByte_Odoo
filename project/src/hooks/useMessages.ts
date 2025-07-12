import { useState, useEffect } from 'react';
import { Message, Conversation, User } from '../types';
import { localStorageService } from '../services/localStorageService';
import { notificationService } from '../services/notificationService';

export function useMessages(userId?: string) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Load conversations and messages from localStorage on mount
  useEffect(() => {
    if (userId) {
      const storedConversations = localStorageService.getAllConversations();
      const userConversations = storedConversations.filter((conv: any) => 
        conv.participants.includes(userId)
      );
      
      // Convert stored conversations to proper format
      const formattedConversations: Conversation[] = userConversations.map((conv: any) => ({
        id: conv.id,
        participants: conv.participants,
        lastMessage: conv.lastMessage ? {
          ...conv.lastMessage,
          createdAt: new Date(conv.lastMessage.createdAt),
        } : undefined,
        updatedAt: new Date(conv.updatedAt),
      }));
      
      setConversations(formattedConversations);

      // Load all messages for user's conversations
      const allMessages: Message[] = [];
      formattedConversations.forEach(conv => {
        const convMessages = localStorageService.getConversationMessages(conv.id);
        convMessages.forEach((msg: any) => {
          allMessages.push({
            ...msg,
            createdAt: new Date(msg.createdAt),
          });
        });
      });
      setMessages(allMessages);
    }
  }, [userId]);

  const getUserById = (id: string): User | undefined => {
    return localStorageService.getUserById(id) || undefined;
  };

  const getConversationMessages = (conversationId: string): Message[] => {
    return messages.filter(msg => msg.conversationId === conversationId);
  };

  const sendMessage = async (conversationId: string, content: string, receiverId: string) => {
    if (!userId) return;

    setLoading(true);

    // Create message with initial 'sending' status
    const newMessage: Message = {
      id: Date.now().toString(),
      conversationId,
      senderId: userId,
      receiverId,
      content,
      type: 'text',
      isRead: false,
      status: 'sending',
      createdAt: new Date(),
    };

    // Add to local state immediately
    setMessages(prev => [...prev, newMessage]);
    
    // Save to localStorage
    localStorageService.saveMessage(newMessage);
    
    // Update conversation's last message
    const updatedConversation = {
      ...newMessage,
      status: 'sent',
    };
    localStorageService.updateConversationLastMessage(conversationId, updatedConversation);
    
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, lastMessage: updatedConversation, updatedAt: new Date() }
          : conv
      )
    );

    // Simulate message delivery process
    setTimeout(() => {
      updateMessageStatus(newMessage.id, 'sent');
    }, 1000);

    setTimeout(() => {
      updateMessageStatus(newMessage.id, 'delivered');
    }, 2000);

    setLoading(false);
  };

  const updateMessageStatus = (messageId: string, status: 'sent' | 'delivered' | 'read') => {
    localStorageService.updateMessageStatus(messageId, status);
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, status } : msg
      )
    );
  };

  const markAsRead = async (messageId: string) => {
    localStorageService.updateMessageStatus(messageId, 'read');
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true, status: 'read' } : msg
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

    // Save to localStorage
    localStorageService.createConversation(newConversation);
    setConversations(prev => [...prev, newConversation]);
    
    return newConversation.id;
  };

  // Simulate receiving a message (for demo purposes)
  const simulateIncomingMessage = (conversationId: string, senderId: string, content: string) => {
    const sender = getUserById(senderId);
    if (!sender) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      conversationId,
      senderId,
      receiverId: userId!,
      content,
      type: 'text',
      isRead: false,
      status: 'delivered',
      createdAt: new Date(),
    };

    // Add to local state
    setMessages(prev => [...prev, newMessage]);
    
    // Save to localStorage
    localStorageService.saveMessage(newMessage);
    
    // Update conversation's last message
    localStorageService.updateConversationLastMessage(conversationId, newMessage);
    
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, lastMessage: newMessage, updatedAt: new Date() }
          : conv
      )
    );

    // Show notification
    notificationService.showConversationNotification(conversationId, sender, content);
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
    updateMessageStatus,
    simulateIncomingMessage,
  };
}