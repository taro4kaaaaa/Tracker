import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { UserProfile } from '../types/user';
import { saveVO2maxRecord } from '../utils/vo2maxHistory';

interface UserContextType {
  user: UserProfile | null;
  saveUser: (user: UserProfile) => void;
  isOnboarded: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'user-profile';

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  });

  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    return localStorage.getItem(USER_STORAGE_KEY) !== null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      setIsOnboarded(true);
      saveVO2maxRecord(user);
    }
  }, [user]);

  const saveUser = (userData: UserProfile) => {
    setUser(userData);
  };

  return (
    <UserContext.Provider value={{ user, saveUser, isOnboarded }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};