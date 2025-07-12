import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { localStorageService } from '../services/localStorageService';

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

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<LocalNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      const userNotifications = localStorageService.getNotificationsForUser(user.id);
      setNotifications(userNotifications);
      setUnreadCount(userNotifications.filter(n => !n.isRead).length);
    }
  }, [user]);

  const markAsRead = (notificationId: string) => {
    localStorageService.markNotificationAsRead(notificationId);
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    notifications.forEach(n => {
      if (!n.isRead) {
        localStorageService.markNotificationAsRead(n.id);
      }
    });
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
}