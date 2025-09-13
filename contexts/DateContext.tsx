import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DateContextType {
  selectedDate: {
    day: number;
    month: number;
    year: number;
  };
  setSelectedDate: (date: { day: number; month: number; year: number }) => void;
  getFormattedDate: () => string;
  getDateString: () => string;
}

const DateContext = createContext<DateContextType | undefined>(undefined);

interface DateProviderProps {
  children: ReactNode;
}

export function DateProvider({ children }: DateProviderProps) {
  const [selectedDate, setSelectedDate] = useState({
    day: new Date().getDate(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  const getFormattedDate = () => {
    return `${selectedDate.day.toString().padStart(2, '0')}/${selectedDate.month.toString().padStart(2, '0')}/${selectedDate.year}`;
  };

  const getDateString = () => {
    return `${selectedDate.year}-${selectedDate.month.toString().padStart(2, '0')}-${selectedDate.day.toString().padStart(2, '0')}`;
  };

  return (
    <DateContext.Provider value={{
      selectedDate,
      setSelectedDate,
      getFormattedDate,
      getDateString
    }}>
      {children}
    </DateContext.Provider>
  );
}

export function useDate() {
  const context = useContext(DateContext);
  if (context === undefined) {
    throw new Error('useDate must be used within a DateProvider');
  }
  return context;
}