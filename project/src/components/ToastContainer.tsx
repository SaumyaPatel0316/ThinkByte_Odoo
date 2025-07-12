import React from 'react';
import { ToastNotification, ToastNotification as ToastNotificationType } from './ToastNotification';

interface ToastContainerProps {
  notifications: ToastNotificationType[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ notifications, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <ToastNotification
          key={notification.id}
          notification={notification}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
} 