import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { X } from 'lucide-react-native';
import { CreditCard as Edit2, Trash2 } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface Jugada {
  id: string;
  equipo: string;
  tipo: 'G' | 'P' | 'X';
  monto: number;
  resultado?: 'G' | 'P' | 'X';
}

interface CuentaJugador {
  id: string;
  nombre: string;
  jugadas: Jugada[];
  tripletas: any[];
  totalGanado: number;
  totalPerdido: number;
  balance: number;
}

interface JugadasModalProps {
  visible: boolean;
  onClose: () => void;
  player: CuentaJugador | null;
  onEdit?: (jugada: Jugada) => void;
  onDelete?: (jugadaId: string) => void;
}

export default function JugadasModal({ visible, onClose, player, onEdit, onDelete }: JugadasModalProps) {
  const { colors } = useTheme();
  
  if (!player) return null;

  const getResultadoStyle = (resultado?: string) => {
    switch (resultado) {
      case 'G': return { backgroundColor: '#D1FAE5', color: '#065F46' };
      case 'P': return { backgroundColor: '#FEE2E2', color: '#991B1B' };
      case 'X': return { backgroundColor: '#FEF3C7', color: '#92400E' };
      default: return { backgroundColor: '#F3F4F6', color: '#6B7280' };
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>Jugadas de {player.nombre}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {player.jugadas.length > 0 ? (
            player.jugadas.map((jugada, index) => (
              <View key={jugada.id} style={[styles.jugadaItem, { backgroundColor: colors.surface }]}>
                <View style={styles.jugadaNumber}>
                  <Text style={[styles.numberText, { color: colors.primary }]}>{index + 1}.</Text>
                </View>
                
                <View style={styles.jugadaContent}>
                  <View style={styles.jugadaInfo}>
                    <Text style={[styles.jugadaText, { color: colors.text }]}>
                      - {jugada.monto} {jugada.equipo} {jugada.tipo} {jugada.periodo !== 'G' ? jugada.periodo : ''}
                    </Text>
                  </View>
                  
                  <View style={styles.jugadaRight}>
                    {jugada.resultado && (
                      <View style={[styles.resultadoBadge, getResultadoStyle(jugada.resultado)]}>
                        <Text style={[styles.resultadoText, { color: getResultadoStyle(jugada.resultado).color }]}>
                          ({jugada.resultado})
                        </Text>
                      </View>
                    )}
                    
                    <View style={styles.jugadaActions}>
                      {onEdit && (
                        <TouchableOpacity
                          style={[styles.actionButton, { backgroundColor: colors.warning }]}
                          onPress={() => onEdit(jugada)}
                        >
                          <Edit2 size={14} color="#FFFFFF" />
                        </TouchableOpacity>
                      )}
                      {onDelete && (
                        <TouchableOpacity
                          style={[styles.actionButton, { backgroundColor: colors.error }]}
                          onPress={() => onDelete(jugada.id)}
                        >
                          <Trash2 size={14} color="#FFFFFF" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No hay jugadas registradas</Text>
            </View>
          )}
        </ScrollView>

        <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TouchableOpacity style={[styles.cancelButton, { backgroundColor: colors.textSecondary }]} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.okButton, { backgroundColor: colors.success }]} onPress={onClose}>
            <Text style={styles.okButtonText}>OK</Text>
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
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  jugadaItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  jugadaNumber: {
    marginRight: 12,
  },
  numberText: {
    fontSize: 16,
    fontWeight: '600',
  },
  jugadaContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  jugadaInfo: {
    flex: 1,
  },
  jugadaRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  jugadaText: {
    fontSize: 14,
  },
  jugadaActions: {
    flexDirection: 'row',
    gap: 4,
  },
  actionButton: {
    padding: 6,
    borderRadius: 4,
  },
  resultadoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  resultadoText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
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
  okButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  okButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});