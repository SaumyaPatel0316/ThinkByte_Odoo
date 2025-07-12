import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../hooks/useMessages';
import { localStorageService } from '../services/localStorageService';
import { MessageStatus } from '../components/MessageStatus';
import { notificationService } from '../services/notificationService';
import { 
  PaperAirplaneIcon,
  UserIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

export function Messages() {
  const { user } = useAuth();
  const { 
    conversations, 
    getUserById, 
    getConversationMessages, 
    sendMessage,
    createConversation,
    markAsRead,
    simulateIncomingMessage
  } = useMessages(user?.id);
  
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatSearchQuery, setNewChatSearchQuery] = useState('');
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversationId]);

  // Check notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const handleRequestNotificationPermission = async () => {
    const permission = await notificationService.requestPermission();
    setNotificationPermission(permission ? 'granted' : 'denied');
  };

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedConversationId && user?.id) {
      const messages = getConversationMessages(selectedConversationId);
      messages.forEach(message => {
        if (message.senderId !== user.id && !message.isRead) {
          markAsRead(message.id);
        }
      });
    }
  }, [selectedConversationId, user?.id, markAsRead]);

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    const otherParticipant = conv.participants.find(p => p !== user?.id);
    const otherUser = otherParticipant ? getUserById(otherParticipant) : null;
    return otherUser?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const selectedConversation = selectedConversationId 
    ? conversations.find(conv => conv.id === selectedConversationId)
    : null;

  const selectedMessages = selectedConversationId 
    ? getConversationMessages(selectedConversationId)
    : [];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversationId || !selectedConversation) return;

    const otherParticipant = selectedConversation.participants.find(p => p !== user?.id);
    if (!otherParticipant) return;

    await sendMessage(selectedConversationId, messageText, otherParticipant);
    setMessageText('');
  };

  const getOtherUser = (conversation: { participants: string[] }) => {
    const otherParticipant = conversation.participants.find((p: string) => p !== user?.id);
    return otherParticipant ? getUserById(otherParticipant) : null;
  };

  const handleStartNewChat = async (targetUserId: string) => {
    const conversationId = await createConversation(targetUserId);
    setSelectedConversationId(conversationId);
    setShowNewChatModal(false);
    setNewChatSearchQuery('');
  };

  // Get all available users for new chat
  const allUsers = localStorageService.getAllUsers().filter(u => u.id !== user?.id && u.isPublic);

  const filteredUsersForNewChat = allUsers.filter(u => 
    u.name.toLowerCase().includes(newChatSearchQuery.toLowerCase()) ||
    u.skillsOffered.some(skill => skill.toLowerCase().includes(newChatSearchQuery.toLowerCase())) ||
    u.skillsWanted.some(skill => skill.toLowerCase().includes(newChatSearchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-[600px] flex">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Messages</h2>
              <div className="flex items-center space-x-2">
                {notificationPermission === 'default' && (
                  <button
                    onClick={handleRequestNotificationPermission}
                    className="p-2 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                    title="Enable notifications"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M9 11h.01M9 8h.01M15 11h.01M15 8h.01M15 14h.01M15 17h.01" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => setShowNewChatModal(true)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title="Start new chat"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 text-sm"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => {
                const otherUser = getOtherUser(conversation);
                if (!otherUser) return null;

                return (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversationId(conversation.id)}
                    className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 transition-colors ${
                      selectedConversationId === conversation.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' : ''
                    }`}
                  >
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
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {otherUser.name}
                        </p>
                        {conversation.lastMessage && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {conversation.lastMessage.content}
                          </p>
                        )}
                        {conversation.lastMessage && (
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {formatDistanceToNow(conversation.lastMessage.createdAt, { addSuffix: true })}
                          </p>
                        )}
                      </div>
                      {conversation.lastMessage && !conversation.lastMessage.isRead && conversation.lastMessage.senderId !== user?.id && (
                        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                <p>No conversations yet</p>
                <button
                  onClick={() => setShowNewChatModal(true)}
                  className="mt-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                >
                  Start your first chat
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center space-x-3">
                  {(() => {
                    const otherUser = getOtherUser(selectedConversation);
                    return otherUser ? (
                      <>
                        {otherUser.profilePhoto ? (
                          <img 
                            src={otherUser.profilePhoto} 
                            alt={otherUser.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                            <UserIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">{otherUser.name}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
                        </div>
                      </>
                    ) : null;
                  })()}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selectedMessages.map((message) => {
                  const isFromCurrentUser = message.senderId === user?.id;

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        isFromCurrentUser 
                          ? 'bg-blue-600 text-white rounded-br-md' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className={`text-xs ${
                            isFromCurrentUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {formatDistanceToNow(message.createdAt, { addSuffix: true })}
                          </p>
                          {isFromCurrentUser && (
                            <MessageStatus 
                              status={message.status} 
                              isFromCurrentUser={isFromCurrentUser} 
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSendMessage} className="flex space-x-3">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    disabled={!messageText.trim()}
                    className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <ChatBubbleLeftRightIcon className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p className="text-lg font-medium">Select a conversation to start messaging</p>
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => setShowNewChatModal(true)}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Start a new chat
                  </button>
                  {conversations.length > 0 && (
                    <div>
                      <button
                        onClick={() => {
                          const firstConv = conversations[0];
                          const otherUser = getOtherUser(firstConv);
                          if (otherUser) {
                            simulateIncomingMessage(firstConv.id, otherUser.id, "Hey! Just checking in to see how our skill swap is going!");
                          }
                        }}
                        className="ml-4 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
                      >
                        Test Notification
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Start New Chat</h3>
                <button
                  onClick={() => {
                    setShowNewChatModal(false);
                    setNewChatSearchQuery('');
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-4 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search users by name or skills..."
                  value={newChatSearchQuery}
                  onChange={(e) => setNewChatSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 text-sm"
                />
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {filteredUsersForNewChat.length > 0 ? (
                filteredUsersForNewChat.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleStartNewChat(user.id)}
                    className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {user.profilePhoto ? (
                        <img 
                          src={user.profilePhoto} 
                          alt={user.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.skillsOffered.join(', ')}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  <p>No users found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}