import { User } from '../types';

// Local storage keys
const USERS_KEY = 'skillswap_users';
const CURRENT_USER_KEY = 'skillswap_current_user';
const NOTIFICATIONS_KEY = 'skillswap_notifications';
const SWAP_REQUESTS_KEY = 'skillswap_swap_requests';
const CONVERSATIONS_KEY = 'skillswap_conversations';
const MESSAGES_KEY = 'skillswap_messages';

// User interface with password
interface UserWithPassword extends User {
  password: string;
}

// Notification interface
interface LocalNotification {
  id: string;
  userId: string;
  type: 'profile_setup' | 'swap_request' | 'swap_accepted' | 'swap_rejected' | 'message' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: Date;
}

class LocalStorageService {
  // Get all users from localStorage
  private getUsers(): UserWithPassword[] {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  // Save all users to localStorage
  private saveUsers(users: UserWithPassword[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  // Get current user from localStorage
  getCurrentUser(): User | null {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  // Save current user to localStorage
  private saveCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }

  // Register a new user
  registerUser(userData: { name: string; email: string; password: string; location?: string }): User {
    const users = this.getUsers();
    
    // Check if user already exists
    if (users.find(u => u.email === userData.email)) {
      throw new Error('User with this email already exists');
    }

    const newUser: UserWithPassword = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      password: userData.password, // In a real app, this would be hashed
      location: userData.location,
      profilePhoto: '',
      isPublic: true,
      skillsOffered: [],
      skillsWanted: [],
      availability: [],
      rating: 0,
      totalSwaps: 0,
      joinedAt: new Date(),
    };

    users.push(newUser);
    this.saveUsers(users);

    // Create profile setup notification
    this.createNotification({
      userId: newUser.id,
      type: 'profile_setup',
      title: 'Welcome to SkillSwap!',
      message: 'Complete your profile to start connecting with other users and sharing your skills.',
      actionUrl: '/profile',
      isRead: false
    });

    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  // Initialize demo data
  initializeDemoData(): void {
    this.initializeDemoUsers();
    this.initializeDemoConversations();
  }

  // Login user
  loginUser(email: string, password: string): User {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    this.saveCurrentUser(userWithoutPassword);
    return userWithoutPassword;
  }

  // Logout user
  logoutUser(): void {
    this.saveCurrentUser(null);
  }

  // Update user profile
  updateUserProfile(userId: string, updates: Partial<User>): User {
    console.log('Updating user profile:', { userId, updates });
    
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    console.log('Before update:', users[userIndex]);

    // Update user
    users[userIndex] = { ...users[userIndex], ...updates };
    this.saveUsers(users);

    console.log('After update:', users[userIndex]);

    // Update current user if it's the same user
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      const updatedUser = { ...currentUser, ...updates };
      this.saveCurrentUser(updatedUser);
      console.log('Current user updated:', updatedUser);
      return updatedUser;
    }

    // Return user without password
    const { password, ...userWithoutPassword } = users[userIndex];
    return userWithoutPassword;
  }

  // Get all users (for browsing)
  getAllUsers(): User[] {
    const users = this.getUsers();
    return users.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
  }

  // Get user by ID
  getUserById(userId: string): User | null {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return null;
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Get user by email (for password reset)
  getUserByEmail(email: string): UserWithPassword | null {
    const users = this.getUsers();
    const user = users.find(u => u.email === email);
    return user || null;
  }

  // Reset user password
  resetUserPassword(email: string, newPassword: string): boolean {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex === -1) {
      return false;
    }

    users[userIndex].password = newPassword;
    this.saveUsers(users);
    return true;
  }

  // Check if user exists by email
  userExists(email: string): boolean {
    const users = this.getUsers();
    return users.some(u => u.email === email);
  }

  // Check if user has completed profile
  isProfileComplete(user: User): boolean {
    return !!(
      user.name &&
      user.location &&
      user.skillsOffered.length > 0 &&
      user.skillsWanted.length > 0 &&
      user.availability.length > 0
    );
  }

  // Notification methods
  private getNotifications(): LocalNotification[] {
    const notifications = localStorage.getItem(NOTIFICATIONS_KEY);
    return notifications ? JSON.parse(notifications) : [];
  }

  private saveNotifications(notifications: LocalNotification[]): void {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  }

  createNotification(notification: Omit<LocalNotification, 'id' | 'createdAt'>): void {
    const notifications = this.getNotifications();
    const newNotification: LocalNotification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    notifications.push(newNotification);
    this.saveNotifications(notifications);
  }

  getNotificationsForUser(userId: string): LocalNotification[] {
    const notifications = this.getNotifications();
    return notifications.filter(n => n.userId === userId);
  }

  markNotificationAsRead(notificationId: string): void {
    const notifications = this.getNotifications();
    const notificationIndex = notifications.findIndex(n => n.id === notificationId);
    if (notificationIndex !== -1) {
      notifications[notificationIndex].isRead = true;
      this.saveNotifications(notifications);
    }
  }

  // Initialize with demo users if no users exist
  initializeDemoUsers(): void {
    const users = this.getUsers();
    if (users.length === 0) {
      const demoUsers: UserWithPassword[] = [
        {
          id: '1',
          name: 'Alex Johnson',
          email: 'alex@example.com',
          password: 'demo',
          location: 'San Francisco, CA',
          profilePhoto: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          isPublic: true,
          skillsOffered: ['React', 'TypeScript', 'UI/UX Design'],
          skillsWanted: ['Python', 'Machine Learning', 'Photography'],
          availability: ['Weekends', 'Evenings'],
          rating: 4.8,
          totalSwaps: 12,
          joinedAt: new Date('2024-01-15'),
        },
        {
          id: '2',
          name: 'Sarah Chen',
          email: 'sarah@example.com',
          password: 'demo',
          location: 'New York, NY',
          profilePhoto: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          isPublic: true,
          skillsOffered: ['Python', 'Data Science', 'Photography'],
          skillsWanted: ['React', 'Figma', 'Content Writing'],
          availability: ['Weekday evenings', 'Saturday mornings'],
          rating: 4.9,
          totalSwaps: 8,
          joinedAt: new Date('2024-02-20'),
        },
        {
          id: '3',
          name: 'Mike Rodriguez',
          email: 'mike@example.com',
          password: 'demo',
          location: 'Austin, TX',
          profilePhoto: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          isPublic: true,
          skillsOffered: ['Digital Marketing', 'SEO', 'Content Writing'],
          skillsWanted: ['Web Development', 'Graphic Design'],
          availability: ['Flexible schedule'],
          rating: 4.7,
          totalSwaps: 15,
          joinedAt: new Date('2023-11-10'),
          isAdmin: true,
        },
        {
          id: '4',
          name: 'Emma Wilson',
          email: 'emma@example.com',
          password: 'demo',
          location: 'Seattle, WA',
          profilePhoto: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          isPublic: true,
          skillsOffered: ['Graphic Design', 'Illustration', 'Branding'],
          skillsWanted: ['Web Development', 'Digital Marketing', 'Photography'],
          availability: ['Weekends', 'Weekday evenings'],
          rating: 4.6,
          totalSwaps: 6,
          joinedAt: new Date('2024-03-05'),
        },
        {
          id: '5',
          name: 'David Kim',
          email: 'david@example.com',
          password: 'demo',
          location: 'Los Angeles, CA',
          profilePhoto: 'https://images.pexels.com/photos/927022/pexels-photo-927022.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          isPublic: true,
          skillsOffered: ['Machine Learning', 'Python', 'Data Analysis'],
          skillsWanted: ['UI/UX Design', 'Mobile Development', 'Music Production'],
          availability: ['Flexible schedule'],
          rating: 4.9,
          totalSwaps: 18,
          joinedAt: new Date('2023-09-12'),
        },
        {
          id: '6',
          name: 'Lisa Thompson',
          email: 'lisa@example.com',
          password: 'demo',
          location: 'Chicago, IL',
          profilePhoto: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          isPublic: true,
          skillsOffered: ['Content Writing', 'Copywriting', 'Social Media Management'],
          skillsWanted: ['Graphic Design', 'Video Editing', 'Public Speaking'],
          availability: ['Weekday afternoons', 'Saturday mornings'],
          rating: 4.5,
          totalSwaps: 9,
          joinedAt: new Date('2024-01-28'),
        },
        {
          id: '7',
          name: 'James Brown',
          email: 'james@example.com',
          password: 'demo',
          location: 'Miami, FL',
          profilePhoto: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          isPublic: true,
          skillsOffered: ['Video Editing', 'Photography', 'Drone Operation'],
          skillsWanted: ['Web Development', 'Digital Marketing', 'Music Production'],
          availability: ['Weekends', 'Evenings'],
          rating: 4.7,
          totalSwaps: 11,
          joinedAt: new Date('2023-12-03'),
        },
        {
          id: '8',
          name: 'Maria Garcia',
          email: 'maria@example.com',
          password: 'demo',
          location: 'Denver, CO',
          profilePhoto: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          isPublic: true,
          skillsOffered: ['Spanish Translation', 'Teaching', 'Event Planning'],
          skillsWanted: ['Digital Marketing', 'Graphic Design', 'Photography'],
          availability: ['Weekday evenings', 'Sundays'],
          rating: 4.8,
          totalSwaps: 7,
          joinedAt: new Date('2024-02-14'),
        },
      ];
      this.saveUsers(demoUsers);
    }
  }

  // Swap request methods
  private getSwapRequests(): any[] {
    const requests = localStorage.getItem(SWAP_REQUESTS_KEY);
    return requests ? JSON.parse(requests) : [];
  }

  private saveSwapRequests(requests: any[]): void {
    localStorage.setItem(SWAP_REQUESTS_KEY, JSON.stringify(requests));
  }

  createSwapRequest(request: {
    fromUserId: string;
    toUserId: string;
    skillOffered: string;
    skillWanted: string;
    message?: string;
  }): any {
    const requests = this.getSwapRequests();
    const newRequest = {
      id: Date.now().toString(),
      fromUserId: request.fromUserId,
      toUserId: request.toUserId,
      skillOffered: request.skillOffered,
      skillWanted: request.skillWanted,
      message: request.message || '',
      status: 'pending',
      createdAt: new Date(),
    };
    
    requests.push(newRequest);
    this.saveSwapRequests(requests);

    // Create notification for the recipient
    this.createNotification({
      userId: request.toUserId,
      type: 'swap_request',
      title: 'New Swap Request',
      message: `You have a new skill swap request!`,
      actionUrl: '/swaps',
      isRead: false
    });

    return newRequest;
  }

  getSwapRequestsForUser(userId: string): any[] {
    const requests = this.getSwapRequests();
    return requests.filter(req => req.fromUserId === userId || req.toUserId === userId);
  }

  updateSwapRequest(requestId: string, updates: any): any {
    const requests = this.getSwapRequests();
    const requestIndex = requests.findIndex(req => req.id === requestId);
    
    if (requestIndex === -1) {
      throw new Error('Swap request not found');
    }

    requests[requestIndex] = { ...requests[requestIndex], ...updates };
    this.saveSwapRequests(requests);
    return requests[requestIndex];
  }

  deleteSwapRequest(requestId: string): void {
    const requests = this.getSwapRequests();
    const filteredRequests = requests.filter(req => req.id !== requestId);
    this.saveSwapRequests(filteredRequests);
  }

  // Message and Conversation methods
  private getConversations(): any[] {
    const conversations = localStorage.getItem(CONVERSATIONS_KEY);
    return conversations ? JSON.parse(conversations) : [];
  }

  private saveConversations(conversations: any[]): void {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  }

  private getMessages(): any[] {
    const messages = localStorage.getItem(MESSAGES_KEY);
    return messages ? JSON.parse(messages) : [];
  }

  private saveMessages(messages: any[]): void {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  }

  getAllConversations(): any[] {
    return this.getConversations();
  }

  getConversationMessages(conversationId: string): any[] {
    const messages = this.getMessages();
    return messages.filter(msg => msg.conversationId === conversationId);
  }

  createConversation(conversation: any): any {
    const conversations = this.getConversations();
    conversations.push(conversation);
    this.saveConversations(conversations);
    return conversation;
  }

  saveMessage(message: any): any {
    const messages = this.getMessages();
    messages.push(message);
    this.saveMessages(messages);
    return message;
  }

  updateMessageStatus(messageId: string, status: string): void {
    const messages = this.getMessages();
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex !== -1) {
      messages[messageIndex].status = status;
      this.saveMessages(messages);
    }
  }

  updateConversationLastMessage(conversationId: string, lastMessage: any): void {
    const conversations = this.getConversations();
    const conversationIndex = conversations.findIndex(conv => conv.id === conversationId);
    if (conversationIndex !== -1) {
      conversations[conversationIndex].lastMessage = lastMessage;
      conversations[conversationIndex].updatedAt = new Date();
      this.saveConversations(conversations);
    }
  }

  // Initialize demo conversations and messages
  initializeDemoConversations(): void {
    const conversations = this.getConversations();
    const messages = this.getMessages();
    
    if (conversations.length === 0) {
      // Create demo conversations
      const demoConversations = [
        {
          id: '1',
          participants: ['1', '2'],
          updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          id: '2',
          participants: ['1', '3'],
          updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        }
      ];

      const demoMessages = [
        {
          id: '1',
          conversationId: '1',
          senderId: '2',
          receiverId: '1',
          content: 'Hi! I\'d love to learn React from you in exchange for Python tutoring.',
          type: 'text',
          isRead: false,
          status: 'delivered',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          id: '2',
          conversationId: '1',
          senderId: '1',
          receiverId: '2',
          content: 'That sounds great! I\'m available on weekends. When would you like to start?',
          type: 'text',
          isRead: true,
          status: 'read',
          createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        },
        {
          id: '3',
          conversationId: '2',
          senderId: '1',
          receiverId: '3',
          content: 'Thanks for accepting my swap request!',
          type: 'text',
          isRead: true,
          status: 'read',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
        {
          id: '4',
          conversationId: '2',
          senderId: '3',
          receiverId: '1',
          content: 'You\'re welcome! Looking forward to our session.',
          type: 'text',
          isRead: true,
          status: 'read',
          createdAt: new Date(Date.now() - 23 * 60 * 60 * 1000),
        }
      ];

      // Update last messages for conversations
      demoConversations[0].lastMessage = demoMessages[1];
      demoConversations[1].lastMessage = demoMessages[3];

      // Save to localStorage
      this.saveConversations(demoConversations);
      this.saveMessages(demoMessages);
    }
  }
}

export const localStorageService = new LocalStorageService(); 