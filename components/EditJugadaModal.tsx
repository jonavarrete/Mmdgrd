import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { X } from 'lucide-react-native';
import SearchableDropdown from '@/components/SearchableDropdown';
import { useTheme } from '@/contexts/ThemeContext';

interface Jugada {
  id: string;
  equipo: string;
  tipo: '-' | 'alta' | 'baja';
  periodo: 'G' | 'MT' | '1/4';
  monto: number;
  resultado?: 'G' | 'P' | 'X';
  section?: string;
}

interface EditJugadaModalProps {
  visible: boolean;
  onClose: () => void;
  jugada: Jugada | null;
  onSave: (jugada: Jugada) => void;
}

const equipos = [
  'New York Yankees', 'Toronto Blue Jays', 'Chicago Cubs', 'Washington Nationals',
  'Boston Red Sox', 'Lakers', 'Warriors', 'Celtics', 'Heat', 'Cartagena',
  'Guardianes', 'Real Madrid', 'Barcelona', 'Industriales', 'Cienfuegos'
];

export default function EditJugadaModal({ visible, onClose, jugada, onSave }: EditJugadaModalProps) {
  const { colors } = useTheme();
  const [equipo, setEquipo] = useState('');
  const [tipo, setTipo] = useState<'-' | 'alta' | 'baja'>('-');
  const [periodo, setPeriodo] = useState<'G' | 'MT' | '1/4'>('G');
  const [monto, setMonto] = useState('');

  useEffect(() => {
    if (jugada) {
      setEquipo(jugada.equipo);
      setTipo(jugada.tipo);
      setPeriodo(jugada.periodo);
      setMonto(jugada.monto.toString());
    }
  }, [jugada]);

  const handleSave = () => {
    if (!equipo || !monto) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (!jugada) return;

    const updatedJugada: Jugada = {
      ...jugada,
      equipo,
      tipo,
      periodo,
      monto: parseFloat(monto),
    };

    onSave(updatedJugada);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  if (!jugada) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>Editar Jugada</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={[styles.formSection, { backgroundColor: colors.surface }]}>
            <View style={styles.formRow}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Team</Text>
                <SearchableDropdown
                  options={equipos}
                  value={equipo}
                  onSelect={setEquipo}
                  placeholder="Seleccionar equipo"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Money</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                  value={monto}
                  onChangeText={setMonto}
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.radioRow}>
              <View style={styles.radioGroup}>
                {(['-', 'alta', 'baja'] as const).map((tipoOption) => (
                  <TouchableOpacity
                    key={tipoOption}
                    style={styles.radioOption}
                    onPress={() => setTipo(tipoOption)}
                  >
                    <View style={[
                      styles.radioCircle,
                      { borderColor: colors.primary },
                      tipo === tipoOption && styles.radioSelected
                    ]}>
                      {tipo === tipoOption && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}
                    </View>
                    <Text style={[styles.radioLabel, { color: colors.text }]}>{tipoOption}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.radioGroup}>
                {(['G', 'MT', '1/4'] as const).map((periodoOption) => (
                  <TouchableOpacity
                    key={periodoOption}
                    style={styles.radioOption}
                    onPress={() => setPeriodo(periodoOption)}
                  >
                    <View style={[
                      styles.radioCircle,
                      { borderColor: colors.primary },
                      periodo === periodoOption && styles.radioSelected
                    ]}>
                      {periodo === periodoOption && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}
                    </View>
                    <Text style={[styles.radioLabel, { color: colors.text }]}>{periodoOption}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TouchableOpacity style={[styles.cancelButton, { backgroundColor: colors.textSecondary }]} onPress={handleClose}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formSection: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  radioLabel: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});