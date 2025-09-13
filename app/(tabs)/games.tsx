import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Eye, Target, Trash2, Send, RefreshCw } from 'lucide-react-native';
import JugadasModal from '@/components/JugadasModal';
import TripletasModal from '@/components/TripletasModal';

interface Jugada {
  id: string;
  equipo: string;
  tipo: 'G' | 'P' | 'X';
  monto: number;
  resultado?: 'G' | 'P' | 'X';
}

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
  jugadas: Jugada[];
  tripletas: Tripleta[];
  totalGanado: number;
  totalPerdido: number;
  balance: number;
}

export default function Jugadas() {
  const [cuentas, setCuentas] = useState<CuentaJugador[]>([]);
  const [showJugadasModal, setShowJugadasModal] = useState(false);
  const [showTripletasModal, setShowTripletasModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<CuentaJugador | null>(null);
  
  // Form states
  const [nuevoEquipo, setNuevoEquipo] = useState('');
  const [nuevoTipo, setNuevoTipo] = useState<'G' | 'P' | 'X'>('G');
  const [nuevoMonto, setNuevoMonto] = useState('');
  const [nuevoJugador, setNuevoJugador] = useState('');
  
  // Tripleta form states
  const [tripletaEquipos, setTripletaEquipos] = useState<Array<{nombre: string, tipo: 'G' | 'P' | 'X'}>>([
    { nombre: '', tipo: 'G' },
    { nombre: '', tipo: 'G' },
    { nombre: '', tipo: 'G' }
  ]);
  const [tripletaMonto, setTripletaMonto] = useState('');
  const [tripletaJugador, setTripletaJugador] = useState('');
  
  // WhatsApp message state
  const [whatsappMessage, setWhatsappMessage] = useState('');

  // Mock data inicial
  useEffect(() => {
    const mockData: CuentaJugador[] = [
      {
        id: '1',
        nombre: 'Piri',
        jugadas: [
          { id: '1', equipo: 'Boston Red Sox', tipo: 'P', monto: 4000, resultado: 'P' },
          { id: '2', equipo: 'Boston Red Sox MT', tipo: 'P', monto: 3000, resultado: 'G' }
        ],
        tripletas: [
          {
            id: '1',
            equipos: [
              { nombre: 'Nigeria', tipo: 'G', resultado: 'P' },
              { nombre: 'Portugal', tipo: 'P', resultado: 'P' },
              { nombre: 'Irlanda', tipo: 'X', resultado: 'X' }
            ],
            monto: 5000
          }
        ],
        totalGanado: 3000,
        totalPerdido: 9000,
        balance: -6000
      },
      {
        id: '2',
        nombre: 'Alfredo',
        jugadas: [
          { id: '3', equipo: 'Lakers', tipo: 'G', monto: 2500, resultado: 'G' },
          { id: '4', equipo: 'Warriors MT', tipo: 'P', monto: 1500, resultado: 'P' }
        ],
        tripletas: [
          {
            id: '2',
            equipos: [
              { nombre: 'Andorra', tipo: 'G', resultado: 'G' },
              { nombre: 'Irlanda', tipo: 'P', resultado: 'P' },
              { nombre: 'Nigeria', tipo: 'G', resultado: 'G' }
            ],
            monto: 5000
          }
        ],
        totalGanado: 7500,
        totalPerdido: 1500,
        balance: 6000
      }
    ];
    setCuentas(mockData);
  }, []);

  const handleAgregarJugada = () => {
    if (!nuevoEquipo || !nuevoMonto || !nuevoJugador) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    const nuevaJugada: Jugada = {
      id: Date.now().toString(),
      equipo: nuevoEquipo,
      tipo: nuevoTipo,
      monto: parseFloat(nuevoMonto)
    };

    setCuentas(prev => {
      const cuentaExistente = prev.find(c => c.nombre === nuevoJugador);
      if (cuentaExistente) {
        return prev.map(c => 
          c.nombre === nuevoJugador 
            ? { ...c, jugadas: [...c.jugadas, nuevaJugada] }
            : c
        );
      } else {
        const nuevaCuenta: CuentaJugador = {
          id: Date.now().toString(),
          nombre: nuevoJugador,
          jugadas: [nuevaJugada],
          tripletas: [],
          totalGanado: 0,
          totalPerdido: 0,
          balance: 0
        };
        return [...prev, nuevaCuenta];
      }
    });

    // Reset form
    setNuevoEquipo('');
    setNuevoMonto('');
    setNuevoJugador('');
    Alert.alert('Éxito', 'Jugada agregada correctamente');
  };

  const handleAgregarTripleta = () => {
    if (!tripletaMonto || !tripletaJugador || tripletaEquipos.some(e => !e.nombre)) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    const nuevaTripleta: Tripleta = {
      id: Date.now().toString(),
      equipos: [...tripletaEquipos],
      monto: parseFloat(tripletaMonto)
    };

    setCuentas(prev => {
      const cuentaExistente = prev.find(c => c.nombre === tripletaJugador);
      if (cuentaExistente) {
        return prev.map(c => 
          c.nombre === tripletaJugador 
            ? { ...c, tripletas: [...c.tripletas, nuevaTripleta] }
            : c
        );
      } else {
        const nuevaCuenta: CuentaJugador = {
          id: Date.now().toString(),
          nombre: tripletaJugador,
          jugadas: [],
          tripletas: [nuevaTripleta],
          totalGanado: 0,
          totalPerdido: 0,
          balance: 0
        };
        return [...prev, nuevaCuenta];
      }
    });

    // Reset form
    setTripletaEquipos([
      { nombre: '', tipo: 'G' },
      { nombre: '', tipo: 'G' },
      { nombre: '', tipo: 'G' }
    ]);
    setTripletaMonto('');
    setTripletaJugador('');
    Alert.alert('Éxito', 'Tripleta agregada correctamente');
  };

  const procesarMensajeWhatsApp = () => {
    if (!whatsappMessage.trim()) {
      Alert.alert('Error', 'Por favor ingresa un mensaje de WhatsApp');
      return;
    }

    // Aquí iría la lógica para procesar el mensaje de WhatsApp
    // Por ahora solo mostramos un mensaje de éxito
    Alert.alert('Procesado', 'Mensaje de WhatsApp procesado correctamente');
    setWhatsappMessage('');
  };

  const eliminarCuenta = (cuentaId: string) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar esta cuenta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => {
            setCuentas(prev => prev.filter(c => c.id !== cuentaId));
          }
        }
      ]
    );
  };

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return '#10B981'; // Verde
    if (balance < 0) return '#EF4444'; // Rojo
    return '#6B7280'; // Gris
  };

  const getResultadoStyle = (resultado?: string) => {
    switch (resultado) {
      case 'G': return { backgroundColor: '#D1FAE5', color: '#065F46' };
      case 'P': return { backgroundColor: '#FEE2E2', color: '#991B1B' };
      case 'X': return { backgroundColor: '#FEF3C7', color: '#92400E' };
      default: return { backgroundColor: '#F3F4F6', color: '#6B7280' };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>MIDGARD</Text>
          <Text style={styles.subtitle}>Jugadas</Text>
        </View>

        {/* Formulario Jugadas Sencillas */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Agregar Jugada</Text>
          
          <View style={styles.formRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Jugador</Text>
              <TextInput
                style={styles.input}
                value={nuevoJugador}
                onChangeText={setNuevoJugador}
                placeholder="Nombre del jugador"
              />
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Equipo</Text>
              <TextInput
                style={styles.input}
                value={nuevoEquipo}
                onChangeText={setNuevoEquipo}
                placeholder="Nombre del equipo"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tipo</Text>
              <View style={styles.tipoSelector}>
                {(['G', 'P', 'X'] as const).map((tipo) => (
                  <TouchableOpacity
                    key={tipo}
                    style={[
                      styles.tipoButton,
                      nuevoTipo === tipo && styles.tipoButtonActive
                    ]}
                    onPress={() => setNuevoTipo(tipo)}
                  >
                    <Text style={[
                      styles.tipoButtonText,
                      nuevoTipo === tipo && styles.tipoButtonTextActive
                    ]}>
                      {tipo}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Monto</Text>
              <TextInput
                style={styles.input}
                value={nuevoMonto}
                onChangeText={setNuevoMonto}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.addButton} onPress={handleAgregarJugada}>
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Agregar Jugada</Text>
          </TouchableOpacity>
        </View>

        {/* Formulario Tripletas */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Agregar Tripleta</Text>
          
          <View style={styles.formRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Jugador</Text>
              <TextInput
                style={styles.input}
                value={tripletaJugador}
                onChangeText={setTripletaJugador}
                placeholder="Nombre del jugador"
              />
            </View>
          </View>

          {tripletaEquipos.map((equipo, index) => (
            <View key={index} style={styles.formRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Equipo {index + 1}</Text>
                <TextInput
                  style={styles.input}
                  value={equipo.nombre}
                  onChangeText={(text) => {
                    const newEquipos = [...tripletaEquipos];
                    newEquipos[index].nombre = text;
                    setTripletaEquipos(newEquipos);
                  }}
                  placeholder="Nombre del equipo"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tipo</Text>
                <View style={styles.tipoSelector}>
                  {(['G', 'P', 'X'] as const).map((tipo) => (
                    <TouchableOpacity
                      key={tipo}
                      style={[
                        styles.tipoButton,
                        equipo.tipo === tipo && styles.tipoButtonActive
                      ]}
                      onPress={() => {
                        const newEquipos = [...tripletaEquipos];
                        newEquipos[index].tipo = tipo;
                        setTripletaEquipos(newEquipos);
                      }}
                    >
                      <Text style={[
                        styles.tipoButtonText,
                        equipo.tipo === tipo && styles.tipoButtonTextActive
                      ]}>
                        {tipo}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          ))}

          <View style={styles.formRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Monto</Text>
              <TextInput
                style={styles.input}
                value={tripletaMonto}
                onChangeText={setTripletaMonto}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.addButton} onPress={handleAgregarTripleta}>
            <Target size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Agregar Tripleta</Text>
          </TouchableOpacity>
        </View>

        {/* WhatsApp Message Processor */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Procesar Mensaje WhatsApp</Text>
          <TextInput
            style={styles.textArea}
            value={whatsappMessage}
            onChangeText={setWhatsappMessage}
            placeholder="Pega aquí el mensaje de WhatsApp..."
            multiline
            numberOfLines={4}
          />
          <TouchableOpacity style={styles.processButton} onPress={procesarMensajeWhatsApp}>
            <RefreshCw size={20} color="#FFFFFF" />
            <Text style={styles.processButtonText}>Procesar Mensaje</Text>
          </TouchableOpacity>
        </View>

        {/* Cuentas de Jugadores */}
        <View style={styles.cuentasSection}>
          <Text style={styles.sectionTitle}>Cuentas de Jugadores</Text>
          
          {cuentas.map((cuenta) => (
            <View key={cuenta.id} style={styles.cuentaCard}>
              {/* Header de la cuenta */}
              <View style={styles.cuentaHeader}>
                <Text style={styles.cuentaNombre}>{cuenta.nombre}</Text>
                <View style={styles.cuentaActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                      setSelectedPlayer(cuenta);
                      setShowJugadasModal(true);
                    }}
                  >
                    <Eye size={20} color="#4F46E5" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                      setSelectedPlayer(cuenta);
                      setShowTripletasModal(true);
                    }}
                  >
                    <Target size={20} color="#10B981" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => eliminarCuenta(cuenta.id)}
                  >
                    <Trash2 size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Jugadas Sencillas */}
              {cuenta.jugadas.length > 0 && (
                <View style={styles.jugadasSection}>
                  <Text style={styles.subsectionTitle}>Jugadas Sencillas</Text>
                  {cuenta.jugadas.map((jugada, index) => (
                    <View 
                      key={jugada.id} 
                      style={[
                        styles.jugadaRow,
                        index === cuenta.jugadas.length - 1 && styles.lastRow,
                        jugada.resultado && getResultadoStyle(jugada.resultado)
                      ]}
                    >
                      <Text style={styles.jugadaEquipo}>{jugada.equipo}</Text>
                      <Text style={styles.jugadaTipo}>{jugada.tipo}</Text>
                      <Text style={styles.jugadaMonto}>${jugada.monto}</Text>
                      {jugada.resultado && (
                        <Text style={styles.jugadaResultado}>{jugada.resultado}</Text>
                      )}
                    </View>
                  ))}
                </View>
              )}

              {/* Tripletas */}
              {cuenta.tripletas.length > 0 && (
                <View style={styles.tripletasSection}>
                  <Text style={styles.subsectionTitle}>Tripletas</Text>
                  {cuenta.tripletas.map((tripleta, index) => (
                    <View 
                      key={tripleta.id} 
                      style={[
                        styles.tripletaContainer,
                        index === cuenta.tripletas.length - 1 && styles.lastRow
                      ]}
                    >
                      {tripleta.equipos.map((equipo, equipoIndex) => (
                        <View 
                          key={equipoIndex} 
                          style={[
                            styles.tripletaRow,
                            equipo.resultado && getResultadoStyle(equipo.resultado)
                          ]}
                        >
                          <Text style={styles.jugadaEquipo}>{equipo.nombre}</Text>
                          <Text style={styles.jugadaTipo}>{equipo.tipo}</Text>
                          {equipoIndex === 0 && (
                            <Text style={styles.jugadaMonto}>${tripleta.monto}</Text>
                          )}
                          {equipo.resultado && (
                            <Text style={styles.jugadaResultado}>{equipo.resultado}</Text>
                          )}
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              )}

              {/* Balance */}
              <View style={styles.balanceSection}>
                <View style={styles.balanceRow}>
                  <Text style={styles.balanceLabel}>G:</Text>
                  <Text style={[styles.balanceValue, { color: '#10B981' }]}>
                    {cuenta.totalGanado}
                  </Text>
                </View>
                <View style={styles.balanceRow}>
                  <Text style={styles.balanceLabel}>L:</Text>
                  <Text style={[styles.balanceValue, { color: '#EF4444' }]}>
                    {cuenta.totalPerdido}
                  </Text>
                </View>
                <View style={styles.balanceRow}>
                  <Text style={styles.balanceLabel}>P:</Text>
                  <Text style={[styles.balanceValue, { color: getBalanceColor(cuenta.balance) }]}>
                    {cuenta.balance}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Send to Telegram Button */}
        <TouchableOpacity style={styles.telegramButton}>
          <Send size={20} color="#FFFFFF" />
          <Text style={styles.telegramButtonText}>Enviar a Telegram</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modals */}
      <JugadasModal
        visible={showJugadasModal}
        onClose={() => setShowJugadasModal(false)}
        player={selectedPlayer}
      />
      
      <TripletasModal
        visible={showTripletasModal}
        onClose={() => setShowTripletasModal(false)}
        player={selectedPlayer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
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
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  tipoSelector: {
    flexDirection: 'row',
    gap: 4,
  },
  tipoButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  tipoButtonActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  tipoButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  tipoButtonTextActive: {
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  processButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  processButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cuentasSection: {
    marginBottom: 20,
  },
  cuentaCard: {
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
  cuentaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cuentaNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  cuentaActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  jugadasSection: {
    marginBottom: 16,
  },
  tripletasSection: {
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  jugadaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  lastRow: {
    borderWidth: 2,
    borderColor: '#4F46E5',
  },
  tripletaContainer: {
    marginBottom: 8,
  },
  tripletaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 2,
  },
  jugadaEquipo: {
    flex: 2,
    fontSize: 12,
    fontWeight: '500',
    color: '#1F2937',
  },
  jugadaTipo: {
    flex: 0.5,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  jugadaMonto: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
    color: '#1F2937',
  },
  jugadaResultado: {
    flex: 0.5,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  balanceSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  balanceRow: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  telegramButton: {
    backgroundColor: '#0088CC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 20,
  },
  telegramButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});