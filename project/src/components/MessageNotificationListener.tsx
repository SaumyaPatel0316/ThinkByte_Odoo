import React, { useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export function MessageNotificationListener() {
  const { showToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const handleMessageToast = (event: CustomEvent) => {
      const { sender, message } = event.detail;
      
      // Don't show notification if it's from the current user
      if (sender.id === user?.id) return;

      showToast({
        type: 'info',
        title: `New message from ${sender.name}`,
        message: message.length > 50 ? `${message.substring(0, 50)}...` : message,
      });
    };

    // Listen for message toast events
    window.addEventListener('showMessageToast', handleMessageToast as EventListener);

    return () => {
      window.removeEventListener('showMessageToast', handleMessageToast as EventListener);
    };
  }, [showToast, user?.id]);

  return null; // This component doesn't render anything
} 