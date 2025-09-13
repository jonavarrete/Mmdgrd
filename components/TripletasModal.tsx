import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { X, Check, CircleAlert as AlertCircle } from 'lucide-react-native';
import { CreditCard as Edit2, Trash2 } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface Tripleta {
  id: string;
  equipos: Array<{
    nombre: string;
    tipo: 'G' | 'P' | 'X';
    resultado?: 'G' | 'P' | 'X';
  }>;
  monto: number;
}

interface CuentaJugador {
  id: string;
  nombre: string;
  jugadas: any[];
  tripletas: Tripleta[];
  totalGanado: number;
  totalPerdido: number;
  balance: number;
}

interface TripletasModalProps {
  visible: boolean;
  onClose: () => void;
  player: CuentaJugador | null;
  onEdit?: (tripleta: Tripleta) => void;
  onDelete?: (tripletaId: string) => void;
}

export default function TripletasModal({ visible, onClose, player, onEdit, onDelete }: TripletasModalProps) {
  const { colors } = useTheme();
  
  if (!player) return null;

  const getResultadoIcon = (tipo: 'G' | 'P' | 'X', resultado?: 'G' | 'P' | 'X') => {
    if (!resultado) return <AlertCircle size={16} color="#9CA3AF" />;
    
    const isCorrect = tipo === resultado;
    return isCorrect ? 
      <Check size={16} color="#10B981" /> : 
      <X size={16} color="#EF4444" />;
  };

  const getResultadoStyle = (tipo: 'G' | 'P' | 'X', resultado?: 'G' | 'P' | 'X') => {
    if (!resultado) return { backgroundColor: '#F3F4F6' };
    
    const isCorrect = tipo === resultado;
    return isCorrect ? 
      { backgroundColor: '#D1FAE5' } : 
      { backgroundColor: '#FEE2E2' };
  };

  const getTripletaResult = (tripleta: Tripleta) => {
    const allCorrect = tripleta.equipos.every(equipo => 
      equipo.resultado && equipo.tipo === equipo.resultado
    );
    const hasResults = tripleta.equipos.some(equipo => equipo.resultado);
    
    if (!hasResults) return null;
    return allCorrect;
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
          <Text style={[styles.title, { color: colors.text }]}>Tripletas de {player.nombre}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {player.tripletas.length > 0 ? (
            player.tripletas.map((tripleta, tripletaIndex) => {
              const tripletaResult = getTripletaResult(tripleta);
              
              return (
                <View key={tripleta.id} style={[styles.tripletaContainer, { backgroundColor: colors.surface }]}>
                  <View style={[styles.tripletaHeader, { borderBottomColor: colors.border }]}>
                    <View style={styles.tripletaTitleContainer}>
                      <Text style={[styles.tripletaTitle, { color: colors.text }]}>Tripleta {tripletaIndex + 1}</Text>
                      <View style={[styles.tripletaMonto, { backgroundColor: colors.primary }]}>
                        <Text style={styles.montoText}>{tripleta.monto}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.tripletaHeaderActions}>
                      {onEdit && (
                        <TouchableOpacity
                          style={[styles.headerActionButton, { backgroundColor: colors.warning }]}
                          onPress={() => onEdit(tripleta)}
                        >
                          <Edit2 size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                      )}
                      {onDelete && (
                        <TouchableOpacity
                          style={[styles.headerActionButton, { backgroundColor: colors.error }]}
                          onPress={() => onDelete(tripleta.id)}
                        >
                          <Trash2 size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  <View style={styles.equiposContainer}>
                    {tripleta.equipos.map((equipo, equipoIndex) => (
                      <View 
                        key={equipoIndex} 
                        style={[
                          styles.equipoRow,
                          { borderColor: colors.border },
                          getResultadoStyle(equipo.tipo, equipo.resultado)
                        ]}
                      >
                        <View style={styles.equipoIcon}>
                          {getResultadoIcon(equipo.tipo, equipo.resultado)}
                        </View>
                        
                        <View style={styles.equipoInfo}>
                          <Text style={[styles.equipoNombre, { color: colors.text }]}>{equipo.nombre}</Text>
                          <Text style={[styles.equipoTipo, { color: colors.textSecondary }]}>{equipo.tipo})</Text>
                        </View>

                        {equipo.resultado && (
                          <View style={[styles.resultadoContainer, { backgroundColor: colors.border }]}>
                            <Text style={[styles.resultadoText, { color: colors.text }]}>{equipo.resultado}</Text>
                          </View>
                        )}

                        {equipoIndex === 0 && (
                          <View style={styles.montoContainer}>
                            <Text style={[styles.montoValue, { color: colors.text }]}>{tripleta.monto}</Text>
                          </View>
                        )}
                      </View>
                    ))}
                  </View>

                  {tripletaResult !== null && (
                    <View style={[
                      styles.tripletaResult,
                      tripletaResult ? styles.tripletaWin : styles.tripletaLoss
                    ]}>
                      <Text style={[
                        styles.tripletaResultText,
                        tripletaResult ? styles.winText : styles.lossText
                      ]}>
                        {tripletaResult ? 'GANADA' : 'PERDIDA'}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No hay tripletas registradas</Text>
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
  tripletaContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tripletaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  tripletaTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tripletaTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  tripletaHeaderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerActionButton: {
    padding: 6,
    borderRadius: 4,
  },
  tripletaMonto: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  montoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  equiposContainer: {
    gap: 8,
  },
  equipoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  equipoIcon: {
    marginRight: 12,
  },
  equipoInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  equipoNombre: {
    fontSize: 14,
    fontWeight: '500',
  },
  equipoTipo: {
    fontSize: 12,
    fontWeight: '600',
  },
  resultadoContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  resultadoText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  montoContainer: {
    minWidth: 60,
    alignItems: 'flex-end',
  },
  montoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  tripletaResult: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  tripletaWin: {
    backgroundColor: '#D1FAE5',
  },
  tripletaLoss: {
    backgroundColor: '#FEE2E2',
  },
  tripletaResultText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  winText: {
    color: '#065F46',
  },
  lossText: {
    color: '#991B1B',
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