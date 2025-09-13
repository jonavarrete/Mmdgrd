import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  balance: number;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>({
    id: '1',
    username: 'Jekyll',
    balance: 34885
  });

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      logout
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}