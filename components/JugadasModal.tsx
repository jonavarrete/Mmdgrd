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
}

export default function JugadasModal({ visible, onClose, player }: JugadasModalProps) {
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
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Jugadas de {player.nombre}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {player.jugadas.length > 0 ? (
            player.jugadas.map((jugada, index) => (
              <View key={jugada.id} style={styles.jugadaItem}>
                <View style={styles.jugadaNumber}>
                  <Text style={styles.numberText}>{index + 1}.</Text>
                </View>
                
                <View style={styles.jugadaContent}>
                  <Text style={styles.jugadaText}>
                    - {jugada.monto} {jugada.equipo} {jugada.tipo}
                  </Text>
                  
                  {jugada.resultado && (
                    <View style={[styles.resultadoBadge, getResultadoStyle(jugada.resultado)]}>
                      <Text style={[styles.resultadoText, { color: getResultadoStyle(jugada.resultado).color }]}>
                        ({jugada.resultado})
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No hay jugadas registradas</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.okButton} onPress={onClose}>
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
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
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
    backgroundColor: '#FFFFFF',
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
    color: '#4F46E5',
  },
  jugadaContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  jugadaText: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
  },
  resultadoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
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
    color: '#6B7280',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#6B7280',
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
    backgroundColor: '#10B981',
    alignItems: 'center',
  },
  okButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});