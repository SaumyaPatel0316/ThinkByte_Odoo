import { User } from '../types';

class NotificationService {
  private hasPermission = false;

  constructor() {
    this.checkPermission();
  }

  private async checkPermission() {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        this.hasPermission = true;
      } else if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        this.hasPermission = permission === 'granted';
      }
    }
  }

  async requestPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      this.hasPermission = permission === 'granted';
      return this.hasPermission;
    }
    return this.hasPermission;
  }

  showMessageNotification(sender: User, message: string) {
    // Show browser notification
    if (this.hasPermission && document.hidden) {
      new Notification(`New message from ${sender.name}`, {
        body: message,
        icon: sender.profilePhoto || '/logo.png',
        tag: 'message-notification',
        requireInteraction: false,
      });
    }

    // Show toast notification (if not on messages page)
    const currentPath = window.location.pathname;
    if (!currentPath.includes('/messages')) {
      // Dispatch custom event for toast notification
      const event = new CustomEvent('showMessageToast', {
        detail: {
          sender,
          message,
        },
      });
      window.dispatchEvent(event);
    }
  }

  showConversationNotification(conversationId: string, sender: User, message: string) {
    // Store notification in localStorage for the notification dropdown
    const notifications = this.getStoredNotifications();
    const newNotification = {
      id: Date.now().toString(),
      type: 'message',
      title: `New message from ${sender.name}`,
      message: message,
      conversationId,
      senderId: sender.id,
      isRead: false,
      createdAt: new Date(),
    };
    
    notifications.unshift(newNotification);
    this.saveNotifications(notifications);

    // Show browser/toast notification
    this.showMessageNotification(sender, message);
  }

  private getStoredNotifications() {
    const stored = localStorage.getItem('skillswap_message_notifications');
    return stored ? JSON.parse(stored) : [];
  }

  private saveNotifications(notifications: any[]) {
    localStorage.setItem('skillswap_message_notifications', JSON.stringify(notifications));
    // Dispatch event to notify components about the update
    window.dispatchEvent(new Event('notificationsUpdated'));
  }

  getNotifications() {
    return this.getStoredNotifications();
  }

  markAsRead(notificationId: string) {
    const notifications = this.getStoredNotifications();
    const updatedNotifications = notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true }
        : notification
    );
    this.saveNotifications(updatedNotifications);
  }

  markAllAsRead() {
    const notifications = this.getStoredNotifications();
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      isRead: true,
    }));
    this.saveNotifications(updatedNotifications);
  }

  getUnreadCount() {
    const notifications = this.getStoredNotifications();
    return notifications.filter(notification => !notification.isRead).length;
  }

  clearNotifications() {
    this.saveNotifications([]);
  }
}

export const notificationService = new NotificationService(); 