import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { useDate } from '@/contexts/DateContext';

export default function DateSelector() {
  const { selectedDate, setSelectedDate } = useDate();

  const updateDate = (field: 'day' | 'month' | 'year', increment: boolean) => {
    const newDate = { ...selectedDate };
    if (field === 'day') {
      newDate.day = increment ? Math.min(31, selectedDate.day + 1) : Math.max(1, selectedDate.day - 1);
    } else if (field === 'month') {
      newDate.month = increment ? Math.min(12, selectedDate.month + 1) : Math.max(1, selectedDate.month - 1);
    } else if (field === 'year') {
      newDate.year = increment ? selectedDate.year + 1 : Math.max(2020, selectedDate.year - 1);
    }
    setSelectedDate(newDate);
  };

  return (
    <View style={styles.dateContainer}>
      <View style={styles.dateSelector}>
        <TouchableOpacity onPress={() => updateDate('day', false)}>
          <ChevronDown size={16} color="#6B7280" style={{ transform: [{ rotate: '180deg' }] }} />
        </TouchableOpacity>
        <Text style={styles.dateText}>{selectedDate.day.toString().padStart(2, '0')}</Text>
        <TouchableOpacity onPress={() => updateDate('day', true)}>
          <ChevronDown size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>
      <View style={styles.dateSelector}>
        <TouchableOpacity onPress={() => updateDate('month', false)}>
          <ChevronDown size={16} color="#6B7280" style={{ transform: [{ rotate: '180deg' }] }} />
        </TouchableOpacity>
        <Text style={styles.dateText}>{selectedDate.month.toString().padStart(2, '0')}</Text>
        <TouchableOpacity onPress={() => updateDate('month', true)}>
          <ChevronDown size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>
      <View style={styles.dateSelector}>
        <TouchableOpacity onPress={() => updateDate('year', false)}>
          <ChevronDown size={16} color="#6B7280" style={{ transform: [{ rotate: '180deg' }] }} />
        </TouchableOpacity>
        <Text style={styles.dateText}>{selectedDate.year}</Text>
        <TouchableOpacity onPress={() => updateDate('year', true)}>
          <ChevronDown size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    gap: 15,
  },
  dateSelector: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    minWidth: 60,
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
});