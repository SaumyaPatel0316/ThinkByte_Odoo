import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { localStorageService } from '../services/localStorageService';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: { name: string; email: string; password: string; location?: string }) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  isProfileComplete: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  // Initialize demo users and check for existing session
  useEffect(() => {
    localStorageService.initializeDemoUsers();
    const currentUser = localStorageService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsProfileComplete(localStorageService.isProfileComplete(currentUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const loggedInUser = localStorageService.loginUser(email, password);
    setUser(loggedInUser);
    setIsProfileComplete(localStorageService.isProfileComplete(loggedInUser));
  };

  const logout = () => {
    localStorageService.logoutUser();
    setUser(null);
    setIsProfileComplete(false);
  };

  const register = async (userData: { name: string; email: string; password: string; location?: string }) => {
    const newUser = localStorageService.registerUser(userData);
    setUser(newUser);
    setIsProfileComplete(localStorageService.isProfileComplete(newUser));
  };

  const updateProfile = async (updates: Partial<User>) => {
    console.log('AuthContext updateProfile called with:', updates);
    if (user) {
      const updatedUser = localStorageService.updateUserProfile(user.id, updates);
      console.log('Updated user from localStorageService:', updatedUser);
      setUser(updatedUser);
      setIsProfileComplete(localStorageService.isProfileComplete(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register, 
      updateProfile, 
      isProfileComplete 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}