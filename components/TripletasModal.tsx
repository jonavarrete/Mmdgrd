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
}

export default function TripletasModal({ visible, onClose, player }: TripletasModalProps) {
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
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Tripletas de {player.nombre}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {player.tripletas.length > 0 ? (
            player.tripletas.map((tripleta, tripletaIndex) => {
              const tripletaResult = getTripletaResult(tripleta);
              
              return (
                <View key={tripleta.id} style={styles.tripletaContainer}>
                  <View style={styles.tripletaHeader}>
                    <Text style={styles.tripletaTitle}>Tripleta {tripletaIndex + 1}</Text>
                    <View style={styles.tripletaMonto}>
                      <Text style={styles.montoText}>{tripleta.monto}</Text>
                    </View>
                  </View>

                  <View style={styles.equiposContainer}>
                    {tripleta.equipos.map((equipo, equipoIndex) => (
                      <View 
                        key={equipoIndex} 
                        style={[
                          styles.equipoRow,
                          getResultadoStyle(equipo.tipo, equipo.resultado)
                        ]}
                      >
                        <View style={styles.equipoIcon}>
                          {getResultadoIcon(equipo.tipo, equipo.resultado)}
                        </View>
                        
                        <View style={styles.equipoInfo}>
                          <Text style={styles.equipoNombre}>{equipo.nombre}</Text>
                          <Text style={styles.equipoTipo}>({equipo.tipo})</Text>
                        </View>

                        {equipo.resultado && (
                          <View style={styles.resultadoContainer}>
                            <Text style={styles.resultadoText}>{equipo.resultado}</Text>
                          </View>
                        )}

                        {equipoIndex === 0 && (
                          <View style={styles.montoContainer}>
                            <Text style={styles.montoValue}>{tripleta.monto}</Text>
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
              <Text style={styles.emptyText}>No hay tripletas registradas</Text>
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
  tripletaContainer: {
    backgroundColor: '#FFFFFF',
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
    borderBottomColor: '#E5E7EB',
  },
  tripletaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  tripletaMonto: {
    backgroundColor: '#4F46E5',
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
    borderColor: '#E5E7EB',
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
    color: '#1F2937',
  },
  equipoTipo: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  resultadoContainer: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  resultadoText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  montoContainer: {
    minWidth: 60,
    alignItems: 'flex-end',
  },
  montoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
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