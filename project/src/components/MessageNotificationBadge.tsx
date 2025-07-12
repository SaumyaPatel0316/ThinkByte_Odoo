import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';

export function MessageNotificationBadge() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Get initial count
    const updateCount = () => {
      const count = notificationService.getUnreadCount();
      setUnreadCount(count);
    };

    updateCount();

    // Listen for storage changes (when notifications are added/updated)
    const handleStorageChange = () => {
      updateCount();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for when notifications are updated
    window.addEventListener('notificationsUpdated', updateCount);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('notificationsUpdated', updateCount);
    };
  }, []);

  if (unreadCount === 0) return null;

  return (
    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  );
} 