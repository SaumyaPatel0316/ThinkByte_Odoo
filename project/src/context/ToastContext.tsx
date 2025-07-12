import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ToastNotification } from '../components/ToastNotification';

interface ToastContextType {
  showToast: (notification: Omit<ToastNotification, 'id'>) => void;
  dismissToast: (id: string) => void;
  notifications: ToastNotification[];
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  const showToast = (notification: Omit<ToastNotification, 'id'>) => {
    const newNotification: ToastNotification = {
      ...notification,
      id: Date.now().toString(),
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  const dismissToast = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, dismissToast, notifications }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
} 