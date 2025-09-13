import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
} from 'react-native';
import { ChevronDown, Search } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface SearchableDropdownProps {
  options: string[];
  value: string;
  onSelect: (value: string) => void;
  placeholder: string;
  searchable?: boolean;
}

export default function SearchableDropdown({
  options,
  value,
  onSelect,
  placeholder,
  searchable = true,
}: SearchableDropdownProps) {
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const filteredOptions = searchable
    ? options.filter(option =>
        option.toLowerCase().includes(searchText.toLowerCase())
      )
    : options;

  const handleSelect = (option: string) => {
    onSelect(option);
    setIsOpen(false);
    setSearchText('');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.dropdown, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => setIsOpen(true)}
      >
        <Text style={[
          styles.dropdownText, 
          { color: value ? colors.text : colors.textSecondary },
          !value && styles.placeholder
        ]}>
          {value || placeholder}
        </Text>
        <ChevronDown size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            {searchable && (
              <View style={[styles.searchContainer, { borderBottomColor: colors.border }]}>
                <Search size={16} color={colors.textSecondary} />
                <TextInput
                  style={[styles.searchInput, { color: colors.text }]}
                  value={searchText}
                  onChangeText={setSearchText}
                  placeholder="Buscar..."
                  autoFocus
                />
              </View>
            )}
            
            <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
              {filteredOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.option,
                    { borderBottomColor: colors.border },
                    option === value && { backgroundColor: colors.primary + '20' }
                  ]}
                  onPress={() => handleSelect(option)}
                >
                  <Text style={[
                    styles.optionText,
                    { color: option === value ? colors.primary : colors.text },
                    option === value && { fontWeight: '600' }
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
              {filteredOptions.length === 0 && (
                <View style={styles.noResults}>
                  <Text style={[styles.noResultsText, { color: colors.textSecondary }]}>No se encontraron resultados</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 44,
  },
  dropdownText: {
    fontSize: 14,
    flex: 1,
  },
  placeholder: {
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  optionsList: {
    maxHeight: 300,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 14,
  },
  noResults: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
  },
});