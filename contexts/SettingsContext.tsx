import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SettingsContextType {
  notifications: {
    push: boolean;
    email: boolean;
    gameUpdates: boolean;
    pikeResults: boolean;
  };
  updateNotificationSetting: (key: keyof SettingsContextType['notifications'], value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    gameUpdates: true,
    pikeResults: true,
  });

  const updateNotificationSetting = (key: keyof typeof notifications, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <SettingsContext.Provider value={{
      notifications,
      updateNotificationSetting
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}