import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { useDate } from '@/contexts/DateContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function DateSelector() {
  const { selectedDate, setSelectedDate } = useDate();
  const { colors } = useTheme();

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
      <View style={[styles.dateSelector, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TouchableOpacity onPress={() => updateDate('day', false)}>
          <ChevronDown size={16} color={colors.textSecondary} style={{ transform: [{ rotate: '180deg' }] }} />
        </TouchableOpacity>
        <Text style={[styles.dateText, { color: colors.text }]}>{selectedDate.day.toString().padStart(2, '0')}</Text>
        <TouchableOpacity onPress={() => updateDate('day', true)}>
          <ChevronDown size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      <View style={[styles.dateSelector, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TouchableOpacity onPress={() => updateDate('month', false)}>
          <ChevronDown size={16} color={colors.textSecondary} style={{ transform: [{ rotate: '180deg' }] }} />
        </TouchableOpacity>
        <Text style={[styles.dateText, { color: colors.text }]}>{selectedDate.month.toString().padStart(2, '0')}</Text>
        <TouchableOpacity onPress={() => updateDate('month', true)}>
          <ChevronDown size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      <View style={[styles.dateSelector, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TouchableOpacity onPress={() => updateDate('year', false)}>
          <ChevronDown size={16} color={colors.textSecondary} style={{ transform: [{ rotate: '180deg' }] }} />
        </TouchableOpacity>
        <Text style={[styles.dateText, { color: colors.text }]}>{selectedDate.year}</Text>
        <TouchableOpacity onPress={() => updateDate('year', true)}>
          <ChevronDown size={16} color={colors.textSecondary} />
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 60,
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
  },
});