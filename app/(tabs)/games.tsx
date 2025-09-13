import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Eye, Target, Trash2, Send, RefreshCw } from 'lucide-react-native';
import JugadasModal from '@/components/JugadasModal';
import TripletasModal from '@/components/TripletasModal';
import SearchableDropdown from '@/components/SearchableDropdown';
import { useDate } from '@/contexts/DateContext';
import { useTheme } from '@/contexts/ThemeContext';
import DateSelector from '@/components/DateSelector';

interface Jugada {
  id: string;
  equipo: string;
  tipo: '-' | 'alta' | 'baja';
  periodo: 'G' | 'MT' | '1/4';
  monto: number;
  resultado?: 'G' | 'P' | 'X';
  section?: string;
}

interface Tripleta {
  id: string;
  equipos: Array<{
    nombre: string;
    tipo: '-' | 'alta' | 'baja';
    periodo: 'G' | 'MT' | '1/4';
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
  const { getDateString, getFormattedDate } = useDate();
  const { colors } = useTheme();
  const [showJugadasModal, setShowJugadasModal] = useState(false);
  const [showTripletasModal, setShowTripletasModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<CuentaJugador | null>(null);
  
  // Form states para jugadas sencillas
  const [nuevoEquipo, setNuevoEquipo] = useState('');
  const [nuevoTipo, setNuevoTipo] = useState<'-' | 'alta' | 'baja'>('-');
  const [nuevoPeriodo, setNuevoPeriodo] = useState<'G' | 'MT' | '1/4'>('G');
  const [nuevoMonto, setNuevoMonto] = useState('');
  const [nuevoJugador, setNuevoJugador] = useState('');
  
  // Form states para tripletas
  const [tripletaEquipos, setTripletaEquipos] = useState<Array<{
    nombre: string;
    tipo: '-' | 'alta' | 'baja';
    periodo: 'G' | 'MT' | '1/4';
  }>>([
    { nombre: '', tipo: '-', periodo: 'G' },
    { nombre: '', tipo: '-', periodo: 'G' },
    { nombre: '', tipo: '-', periodo: 'G' }
  ]);
  const [tripletaMonto, setTripletaMonto] = useState('');
  const [tripletaJugador, setTripletaJugador] = useState('');
  
  // WhatsApp message states
  const [whatsappJugadasMessage, setWhatsappJugadasMessage] = useState('');
  const [whatsappTripletasMessage, setWhatsappTripletasMessage] = useState('');
  const [whatsappJugadasJugador, setWhatsappJugadasJugador] = useState('');
  const [whatsappTripletasJugador, setWhatsappTripletasJugador] = useState('');

  // Listas de opciones
  const jugadores = ['Piri', 'Alfredo', 'Carlos', 'Miguel', 'Ana', 'Luis'];
  const equipos = [
    'New York Yankees', 'Toronto Blue Jays', 'Chicago Cubs', 'Washington Nationals',
    'Boston Red Sox', 'Lakers', 'Warriors', 'Celtics', 'Heat', 'Cartagena',
    'Guardianes', 'Real Madrid', 'Barcelona', 'Industriales', 'Cienfuegos'
  ];

  // Mock data inicial
  useEffect(() => {
    const mockData: CuentaJugador[] = [
      {
        id: '1',
        nombre: 'Piri',
        jugadas: [
          { id: '1', equipo: 'Boston Red Sox', tipo: 'baja', periodo: 'G', monto: 4000, resultado: 'P' },
          { id: '2', equipo: 'Boston Red Sox', tipo: 'alta', periodo: 'MT', monto: 3000, resultado: 'G' },
          { id: '8', equipo: 'Cubs', tipo: '-', periodo: 'G', monto: 3000, resultado: 'G' },
          { id: '9', equipo: 'Brewers', tipo: 'baja', periodo: 'MT', monto: 3000, resultado: 'G' }
        ],
        tripletas: [
          {
            id: '1',
            equipos: [
              { nombre: 'Nigeria', tipo: '-', periodo: 'G', resultado: 'P' },
              { nombre: 'Portugal', tipo: 'baja', periodo: 'MT', resultado: 'P' },
              { nombre: 'Irlanda', tipo: 'alta', periodo: '1/4', resultado: 'X' }
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
          { id: '3', equipo: 'Lakers', tipo: '-', periodo: 'G', monto: 2500, resultado: 'G' },
          { id: '4', equipo: 'Warriors', tipo: 'baja', periodo: '1/4', monto: 1500, resultado: 'P' },
          { id: '6', equipo: 'Lakers', tipo: 'alta', periodo: 'MT', monto: 1500, resultado: 'G' }
        ],
        tripletas: [
          {
            id: '2',
            equipos: [
              { nombre: 'Andorra', tipo: '-', periodo: 'G', resultado: 'G' },
              { nombre: 'Irlanda', tipo: 'baja', periodo: 'MT', resultado: 'P' },
              { nombre: 'Nigeria', tipo: 'alta', periodo: '1/4', resultado: 'G' }
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

  // Sincronizar selección de jugadores
  const handleJugadorChange = (jugador: string, source: 'jugada' | 'tripleta' | 'whatsappJugadas' | 'whatsappTripletas') => {
    if (source === 'jugada') {
      setNuevoJugador(jugador);
    } else if (source === 'tripleta') {
      setTripletaJugador(jugador);
    } else if (source === 'whatsappJugadas') {
      setWhatsappJugadasJugador(jugador);
    } else if (source === 'whatsappTripletas') {
      setWhatsappTripletasJugador(jugador);
    }
    
    // Sincronizar con otros campos
    setNuevoJugador(jugador);
    setTripletaJugador(jugador);
    setWhatsappJugadasJugador(jugador);
    setWhatsappTripletasJugador(jugador);
  };

  const handleAgregarJugada = () => {
    if (!nuevoEquipo || !nuevoMonto || !nuevoJugador) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    console.log('Adding jugada for date:', getDateString());

    const nuevaJugada: Jugada = {
      id: Date.now().toString(),
      equipo: nuevoEquipo,
      tipo: nuevoTipo,
      periodo: nuevoPeriodo,
      monto: parseFloat(nuevoMonto),
    };

    // Enviar a la API
    const jugadaData = {
      date: getDateString(),
      player: nuevoJugador,
      team: nuevoEquipo,
      type: nuevoTipo,
      period: nuevoPeriodo,
      amount: parseFloat(nuevoMonto)
    };

    console.log('Jugada data to send:', JSON.stringify(jugadaData, null, 2));

    // Llamada a la API (comentada por ahora para testing local)
    /*
    fetch('https://midgard.ct.ws/add_jugada', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'MidgardApp/1.0',
      },
      body: JSON.stringify(jugadaData)
    })
    .then(response => response.text())
    .then(responseText => {
      console.log('Jugada response:', responseText);
      try {
        const data = JSON.parse(responseText);
        if (data.success || data.status) {
          Alert.alert('Éxito', 'Jugada agregada correctamente');
        } else {
          Alert.alert('Error', data.message || 'Error al agregar jugada');
        }
      } catch (parseError) {
        Alert.alert('Éxito', 'Jugada agregada correctamente');
      }
    })
    .catch(error => {
      console.error('Error adding jugada:', error);
      Alert.alert('Error', `Error de conexión: ${error.message}`);
    });
    */

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
    Alert.alert('Éxito', 'Jugada agregada correctamente');
  };

  const handleAgregarTripleta = () => {
    if (!tripletaMonto || !tripletaJugador || tripletaEquipos.some(e => !e.nombre)) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    console.log('Adding tripleta for date:', getDateString());

    const nuevaTripleta: Tripleta = {
      id: Date.now().toString(),
      equipos: [...tripletaEquipos],
      monto: parseFloat(tripletaMonto),
    };

    // Enviar a la API
    const tripletaData = {
      date: getDateString(),
      player: tripletaJugador,
      amount: parseFloat(tripletaMonto),
      teams: tripletaEquipos.map(equipo => ({
        name: equipo.nombre,
        type: equipo.tipo,
        period: equipo.periodo
      }))
    };

    console.log('Tripleta data to send:', JSON.stringify(tripletaData, null, 2));

    // Llamada a la API (comentada por ahora para testing local)
    /*
    fetch('https://midgard.ct.ws/add_tripleta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'MidgardApp/1.0',
      },
      body: JSON.stringify(tripletaData)
    })
    .then(response => response.text())
    .then(responseText => {
      console.log('Tripleta response:', responseText);
      try {
        const data = JSON.parse(responseText);
        if (data.success || data.status) {
          Alert.alert('Éxito', 'Tripleta agregada correctamente');
        } else {
          Alert.alert('Error', data.message || 'Error al agregar tripleta');
        }
      } catch (parseError) {
        Alert.alert('Éxito', 'Tripleta agregada correctamente');
      }
    })
    .catch(error => {
      console.error('Error adding tripleta:', error);
      Alert.alert('Error', `Error de conexión: ${error.message}`);
    });
    */

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
      { nombre: '', tipo: '-', periodo: 'G' },
      { nombre: '', tipo: '-', periodo: 'G' },
      { nombre: '', tipo: '-', periodo: 'G' }
    ]);
    setTripletaMonto('');
    Alert.alert('Éxito', 'Tripleta agregada correctamente');
  };

  const procesarMensajeWhatsAppJugadas = () => {
    if (!whatsappJugadasMessage.trim() || !whatsappJugadasJugador) {
      Alert.alert('Error', 'Por favor ingresa un mensaje y selecciona un jugador');
      return;
    }

    console.log('Procesando jugadas para fecha:', getDateString());
    
    const whatsappData = {
      date: getDateString(),
      player: whatsappJugadasJugador,
      message: whatsappJugadasMessage.trim(),
      type: 'jugadas'
    };

    console.log('WhatsApp jugadas data:', JSON.stringify(whatsappData, null, 2));

    // Llamada a la API (comentada por ahora para testing local)
    /*
    fetch('https://midgard.ct.ws/process_whatsapp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'MidgardApp/1.0',
      },
      body: JSON.stringify(whatsappData)
    })
    .then(response => response.text())
    .then(responseText => {
      console.log('WhatsApp jugadas response:', responseText);
      try {
        const data = JSON.parse(responseText);
        if (data.success || data.status) {
          Alert.alert('Procesado', 'Mensaje de jugadas procesado correctamente');
        } else {
          Alert.alert('Error', data.message || 'Error al procesar mensaje');
        }
      } catch (parseError) {
        Alert.alert('Procesado', 'Mensaje de jugadas procesado correctamente');
      }
    })
    .catch(error => {
      console.error('Error processing WhatsApp jugadas:', error);
      Alert.alert('Error', `Error de conexión: ${error.message}`);
    });
    */

    Alert.alert('Procesado', 'Mensaje de jugadas procesado correctamente');
    setWhatsappJugadasMessage('');
  };

  const procesarMensajeWhatsAppTripletas = () => {
    if (!whatsappTripletasMessage.trim() || !whatsappTripletasJugador) {
      Alert.alert('Error', 'Por favor ingresa un mensaje y selecciona un jugador');
      return;
    }

    console.log('Procesando tripletas para fecha:', getDateString());
    
    const whatsappData = {
      date: getDateString(),
      player: whatsappTripletasJugador,
      message: whatsappTripletasMessage.trim(),
      type: 'tripletas'
    };

    console.log('WhatsApp tripletas data:', JSON.stringify(whatsappData, null, 2));

    // Llamada a la API (comentada por ahora para testing local)
    /*
    fetch('https://midgard.ct.ws/process_whatsapp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'MidgardApp/1.0',
      },
      body: JSON.stringify(whatsappData)
    })
    .then(response => response.text())
    .then(responseText => {
      console.log('WhatsApp tripletas response:', responseText);
      try {
        const data = JSON.parse(responseText);
        if (data.success || data.status) {
          Alert.alert('Procesado', 'Mensaje de tripletas procesado correctamente');
        } else {
          Alert.alert('Error', data.message || 'Error al procesar mensaje');
        }
      } catch (parseError) {
        Alert.alert('Procesado', 'Mensaje de tripletas procesado correctamente');
      }
    })
    .catch(error => {
      console.error('Error processing WhatsApp tripletas:', error);
      Alert.alert('Error', `Error de conexión: ${error.message}`);
    });
    */

    Alert.alert('Procesado', 'Mensaje de tripletas procesado correctamente');
    setWhatsappTripletasMessage('');
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

  const getResultadoStyle = (resultado?: string) => {
    switch (resultado) {
      case 'G': return { backgroundColor: '#D1FAE5', color: '#065F46' };
      case 'P': return { backgroundColor: '#FEE2E2', color: '#991B1B' };
      case 'X': return { backgroundColor: '#FEF3C7', color: '#92400E' };
      default: return { backgroundColor: '#F3F4F6', color: '#6B7280' };
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.logo, { color: colors.primary }]}>MIDGARD</Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>Jugadas - {getFormattedDate()}</Text>
        </View>

        {/* Date Selector */}
        <DateSelector />

        {/* Formulario Jugadas Sencillas */}
        <View style={[styles.formSection, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Agregar Jugada</Text>
            <View style={styles.jugadorContainer}>
              <Text style={[styles.jugadorLabel, { color: colors.textSecondary }]}>Jugador:</Text>
              <View style={styles.jugadorDropdown}>
                <SearchableDropdown
                  options={jugadores}
                  value={nuevoJugador}
                  onSelect={(jugador) => handleJugadorChange(jugador, 'jugada')}
                  placeholder="Seleccionar jugador"
                />
              </View>
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Team</Text>
              <SearchableDropdown
                options={equipos}
                value={nuevoEquipo}
                onSelect={setNuevoEquipo}
                placeholder="Seleccionar equipo"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Money</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                value={nuevoMonto}
                onChangeText={setNuevoMonto}
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.radioRow}>
            <View style={styles.radioGroup}>
              {(['-', 'alta', 'baja'] as const).map((tipo) => (
                <TouchableOpacity
                  key={tipo}
                  style={styles.radioOption}
                  onPress={() => setNuevoTipo(tipo)}
                >
                  <View style={[
                    styles.radioCircle,
                    { borderColor: colors.primary },
                    nuevoTipo === tipo && styles.radioSelected
                  ]}>
                    {nuevoTipo === tipo && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}
                  </View>
                  <Text style={[styles.radioLabel, { color: colors.text }]}>{tipo}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.radioGroup}>
              {(['G', 'MT', '1/4'] as const).map((periodo) => (
                <TouchableOpacity
                  key={periodo}
                  style={styles.radioOption}
                  onPress={() => setNuevoPeriodo(periodo)}
                >
                  <View style={[
                    styles.radioCircle,
                    { borderColor: colors.primary },
                    nuevoPeriodo === periodo && styles.radioSelected
                  ]}>
                    {nuevoPeriodo === periodo && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}
                  </View>
                  <Text style={[styles.radioLabel, { color: colors.text }]}>{periodo}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]} onPress={handleAgregarJugada}>
            <Text style={[styles.addButtonText, { color: '#FFFFFF' }]}>Agregar</Text>
          </TouchableOpacity>
        </View>

        {/* WhatsApp Jugadas Sencillas */}
        <View style={[styles.formSection, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Agregar Jugadas desde WhatsApp</Text>
            <View style={styles.jugadorContainer}>
              <Text style={[styles.jugadorLabel, { color: colors.textSecondary }]}>Jugador:</Text>
              <View style={styles.jugadorDropdown}>
                <SearchableDropdown
                  options={jugadores}
                  value={whatsappJugadasJugador}
                  onSelect={(jugador) => handleJugadorChange(jugador, 'whatsappJugadas')}
                  placeholder="Seleccionar jugador"
                />
              </View>
            </View>
          </View>
          
          <TextInput
            style={[styles.textArea, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            value={whatsappJugadasMessage}
            onChangeText={setWhatsappJugadasMessage}
            placeholder="Pega los mensajes aquí..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
          />
          <TouchableOpacity style={[styles.processButton, { backgroundColor: colors.success }]} onPress={procesarMensajeWhatsAppJugadas}>
            <Text style={[styles.processButtonText, { color: '#FFFFFF' }]}>Agregar</Text>
          </TouchableOpacity>
        </View>

        {/* WhatsApp Tripletas */}
        <View style={[styles.formSection, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Agregar Tripletas desde WhatsApp</Text>
            <View style={styles.jugadorContainer}>
              <Text style={[styles.jugadorLabel, { color: colors.textSecondary }]}>Jugador:</Text>
              <View style={styles.jugadorDropdown}>
                <SearchableDropdown
                  options={jugadores}
                  value={whatsappTripletasJugador}
                  onSelect={(jugador) => handleJugadorChange(jugador, 'whatsappTripletas')}
                  placeholder="Seleccionar jugador"
                />
              </View>
            </View>
          </View>
          
          <TextInput
            style={[styles.textArea, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            value={whatsappTripletasMessage}
            onChangeText={setWhatsappTripletasMessage}
            placeholder="Pega los mensajes aquí..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
          />
          <TouchableOpacity style={[styles.processButton, { backgroundColor: colors.success }]} onPress={procesarMensajeWhatsAppTripletas}>
            <Text style={[styles.processButtonText, { color: '#FFFFFF' }]}>Agregar</Text>
          </TouchableOpacity>
        </View>

        {/* Formulario Tripletas */}
        <View style={[styles.formSection, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Agregar Jugada Tripleta</Text>
            <View style={styles.jugadorContainer}>
              <Text style={[styles.jugadorLabel, { color: colors.textSecondary }]}>Jugador:</Text>
              <View style={styles.jugadorDropdown}>
                <SearchableDropdown
                  options={jugadores}
                  value={tripletaJugador}
                  onSelect={(jugador) => handleJugadorChange(jugador, 'tripleta')}
                  placeholder="Seleccionar jugador"
                />
              </View>
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Money</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                value={tripletaMonto}
                onChangeText={setTripletaMonto}
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>
          </View>

          {tripletaEquipos.map((equipo, index) => (
            <View key={index} style={styles.tripletaTeamSection}>
              <Text style={[styles.teamLabel, { color: colors.text }]}>Team {index + 1}</Text>
              
              <View style={styles.formRow}>
                <View style={styles.inputGroup}>
                  <SearchableDropdown
                    options={equipos}
                    value={equipo.nombre}
                    onSelect={(nombre) => {
                      const newEquipos = [...tripletaEquipos];
                      newEquipos[index].nombre = nombre;
                      setTripletaEquipos(newEquipos);
                    }}
                    placeholder="Seleccionar equipo"
                  />
                </View>
              </View>

              <View style={styles.radioRow}>
                <View style={styles.radioGroup}>
                  {(['-', 'alta', 'baja'] as const).map((tipo) => (
                    <TouchableOpacity
                      key={tipo}
                      style={styles.radioOption}
                      onPress={() => {
                        const newEquipos = [...tripletaEquipos];
                        newEquipos[index].tipo = tipo;
                        setTripletaEquipos(newEquipos);
                      }}
                    >
                      <View style={[
                        styles.radioCircle,
                        { borderColor: colors.primary },
                        equipo.tipo === tipo && styles.radioSelected
                      ]}>
                        {equipo.tipo === tipo && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}
                      </View>
                      <Text style={[styles.radioLabel, { color: colors.text }]}>{tipo}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.radioGroup}>
                  {(['G', 'MT', '1/4'] as const).map((periodo) => (
                    <TouchableOpacity
                      key={periodo}
                      style={styles.radioOption}
                      onPress={() => {
                        const newEquipos = [...tripletaEquipos];
                        newEquipos[index].periodo = periodo;
                        setTripletaEquipos(newEquipos);
                      }}
                    >
                      <View style={[
                        styles.radioCircle,
                        { borderColor: colors.primary },
                        equipo.periodo === periodo && styles.radioSelected
                      ]}>
                        {equipo.periodo === periodo && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}
                      </View>
                      <Text style={[styles.radioLabel, { color: colors.text }]}>{periodo}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          ))}

          <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]} onPress={handleAgregarTripleta}>
            <Text style={[styles.addButtonText, { color: '#FFFFFF' }]}>Agregar</Text>
          </TouchableOpacity>
        </View>

        {/* Cuentas de Jugadores */}
        <View style={styles.cuentasSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Cuentas de Jugadores</Text>
          
          {cuentas.map((cuenta) => (
            <View key={cuenta.id} style={[styles.cuentaCard, { backgroundColor: colors.surface }]}>
              {/* Header de la cuenta */}
              <View style={[styles.cuentaHeader, { borderBottomColor: colors.border }]}>
                <Text style={[styles.cuentaNombre, { color: colors.text }]}>{cuenta.nombre}</Text>
                <View style={styles.cuentaActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.background }]}
                    onPress={() => {
                      setSelectedPlayer(cuenta);
                      setShowJugadasModal(true);
                    }}
                  >
                    <Eye size={20} color="#4F46E5" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.background }]}
                    onPress={() => {
                      setSelectedPlayer(cuenta);
                      setShowTripletasModal(true);
                    }}
                  >
                    <Target size={20} color="#10B981" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.background }]}
                    onPress={() => eliminarCuenta(cuenta.id)}
                  >
                    <Trash2 size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Jugadas Sencillas */}
              {cuenta.jugadas.length > 0 && (
                <View style={styles.jugadasSection}>
                  <View style={styles.jugadasColumns}>
                    {/* Columna Ganado (G) */}
                    <View style={[styles.jugadasColumn, { backgroundColor: colors.background }]}>
                      <Text style={[styles.columnHeader, { backgroundColor: colors.border, color: colors.text }]}>G</Text>
                      {cuenta.jugadas
                        .filter(jugada => jugada.resultado === 'G')
                        .map((jugada, index) => (
                          <View key={jugada.id} style={styles.jugadaItem}>
                            <Text style={[styles.jugadaEquipoText, { color: colors.text, borderBottomColor: colors.border }]}>
                              {jugada.monto} {jugada.equipo} 
                               {jugada.periodo == 'G'? '':jugada.periodo} 
                              {jugada.tipo == 'alta'? ' ↑':jugada.tipo == 'baja'?'':' ↓'}
                            </Text>
                          </View>
                        ))}
                    </View>

                    {/* Columna Perdido (P) */}
                    <View style={[styles.jugadasColumn, { backgroundColor: colors.background }]}>
                      <Text style={[styles.columnHeader, { backgroundColor: colors.border, color: colors.text }]}>P</Text>
                      {cuenta.jugadas
                        .filter(jugada => jugada.resultado === 'P')
                        .map((jugada, index) => (
                          <View key={jugada.id} style={styles.jugadaItem}>
                            <Text style={[styles.jugadaEquipoText, { color: colors.text, borderBottomColor: colors.border }]}>
                              {jugada.monto} {jugada.equipo} 
                               {jugada.periodo == 'G'? '': jugada.periodo} 
                              {jugada.tipo == 'alta'? ' ↑':jugada.tipo == 'baja'?'':' ↓'}
                            </Text>
                          </View>
                        ))}
                    </View>
                  </View>
                </View>
              )}

              {/* Tripletas */}
              {cuenta.tripletas.length > 0 && (
                <View style={styles.tripletasSection}>
                  <View style={styles.tripletasColumns}>
                    <View style={[styles.tripletasColumn, { backgroundColor: colors.background }]}>
                      <View style={styles.tripletaRow}>
                        <Text style={[styles.tripletaLabel, { color: colors.text }]}>C:</Text>
                        <Text style={[styles.tripletaValue, { color: colors.text }]}>15000</Text>
                      </View>
                      <View style={styles.tripletaRow}>
                        <Text style={[styles.tripletaLabel, { color: colors.text }]}>L:</Text>
                        <Text style={[styles.tripletaValue, { color: colors.text }]}>13500</Text>
                      </View>
                      <View style={styles.tripletaRow}>
                        <Text style={[styles.tripletaLabel, { color: colors.text }]}>P:</Text>
                        <Text style={[styles.tripletaValue, { color: colors.text }]}>15000</Text>
                      </View>
                      <View style={styles.tripletaRow}>
                        <Text style={[styles.tripletaLabel, { color: colors.text }]}>F:</Text>
                        <Text style={[styles.tripletaValue, { color: colors.text }]}>-1500</Text>
                      </View>
                    </View>

                    <View style={[styles.tripletasColumn, { backgroundColor: colors.background }]}>
                      <View style={styles.tripletaTypeColumns}>
                        <View style={styles.tripletaTypeColumn}>
                          <Text style={[styles.tripletaTypeLabel, { color: colors.text }]}>I</Text>
                          <Text style={[styles.tripletaTypeValue, { color: colors.text }]}>0</Text>
                          <Text style={[styles.tripletaTypeValue, { color: colors.text }]}></Text>
                          <View style={[styles.tripletaTypeSeparator, { backgroundColor: colors.text }]} />
                          <Text style={[styles.tripletaTypeTotalValue, { color: colors.text }]}>0</Text>
                        </View>
                        
                        <View style={styles.tripletaTypeColumn}>
                          <Text style={[styles.tripletaTypeLabel, { color: colors.text }]}>II</Text>
                          <Text style={[styles.tripletaTypeValue, { color: colors.text }]}>5000</Text>
                          <Text style={[styles.tripletaTypeValue, { color: colors.text }]}>15000</Text>
                          <View style={[styles.tripletaTypeSeparator, { backgroundColor: colors.text }]} />
                          <Text style={[styles.tripletaTypeTotalValue, { color: colors.text }]}>60000</Text>
                        </View>
                        
                        <View style={styles.tripletaTypeColumn}>
                          <Text style={[styles.tripletaTypeLabel, { color: colors.text }]}>III</Text>
                          <Text style={[styles.tripletaTypeValue, { color: colors.text }]}>0</Text>
                          <Text style={[styles.tripletaTypeValue, { color: colors.text }]}></Text>
                          <View style={[styles.tripletaTypeSeparator, { backgroundColor: colors.text }]} />
                          <Text style={[styles.tripletaTypeTotalValue, { color: colors.text }]}>0</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {/* Cálculo Final */}
              <View style={[styles.finalCalculationSection, { borderTopColor: colors.border }]}>
                <View style={styles.finalCalculationColumns}>
                  <View style={[styles.finalCalculationColumn, { backgroundColor: colors.background }]}>
                    <View style={styles.calculationItem}>
                      <Text style={[styles.calculationValue, { color: colors.text }]}>+11000 (2%)</Text>
                    </View>
                    <View style={styles.calculationItem}>
                      <Text style={[styles.calculationValue, { color: colors.text }]}>101000</Text>
                    </View>
                    <View style={styles.calculationItem}>
                      <Text style={[styles.calculationValue, { color: colors.text }]}>+1500 (Tripleta)</Text>
                    </View>
                    <View style={[styles.calculationSeparator, { backgroundColor: colors.text }]} />
                    <View style={[styles.calculationTotal, styles.calculationTotalWin]}>
                      <Text style={styles.calculationTotalText}>347500</Text>
                    </View>
                  </View>

                  <View style={[styles.finalCalculationColumn, { backgroundColor: colors.background }]}>
                    <View style={styles.calculationItem}>
                      <Text style={[styles.calculationValue, { color: colors.text }]}>-102500</Text>
                    </View>
                    <View style={[styles.calculationSeparator, { backgroundColor: colors.text }]} />
                    <View style={[styles.calculationTotal, styles.calculationTotalLoss]}>
                      <Text style={styles.calculationTotalText}>102500</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Send to Telegram Button */}
        <TouchableOpacity style={[styles.telegramButton, { backgroundColor: '#0088CC' }]}>
          <Send size={20} color="#FFFFFF" />
          <Text style={[styles.telegramButtonText, { color: '#FFFFFF' }]}>Enviar a Telegram</Text>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  formSection: {
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  jugadorContainer: {
    alignItems: 'flex-end',
  },
  jugadorLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  jugadorDropdown: {
    minWidth: 150,
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
  textArea: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
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
  tripletaTeamSection: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  teamLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  addButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  processButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  processButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cuentasSection: {
    marginBottom: 20,
  },
  cuentaCard: {
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
  },
  cuentaNombre: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cuentaActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
  },
  jugadasSection: {
    marginBottom: 20,
  },
  jugadasColumns: {
    flexDirection: 'row',
    gap: 1,
  },
  jugadasColumn: {
    flex: 1,
  },
  columnHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 8,
  },
  jugadaItem: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
  },
  jugadaEquipoText: {
    fontSize: 12,
    fontWeight: '500',
  },
  tripletasSection: {
    marginBottom: 20,
  },
  tripletasColumns: {
    flexDirection: 'row',
    gap: 1,
  },
  tripletasColumn: {
    flex: 1,
    padding: 8,
  },
  tripletaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  tripletaLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  tripletaValue: {
    fontSize: 14,
  },
  tripletaTypeColumns: {
    flexDirection: 'row',
    flex: 1,
  },
  tripletaTypeColumn: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  tripletaTypeLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  tripletaTypeValue: {
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 2,
    minHeight: 16,
  },
  tripletaTypeSeparator: {
    height: 1,
    width: '80%',
    marginVertical: 4,
  },
  tripletaTypeTotalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
  },
  finalCalculationSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  finalCalculationColumns: {
    flexDirection: 'row',
    gap: 1,
  },
  finalCalculationColumn: {
    flex: 1,
    padding: 8,
  },
  calculationItem: {
    paddingVertical: 4,
  },
  calculationValue: {
    fontSize: 12,
  },
  calculationSeparator: {
    height: 1,
    marginVertical: 8,
  },
  calculationTotal: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  calculationTotalWin: {
    backgroundColor: '#10B981',
  },
  calculationTotalLoss: {
    backgroundColor: '#EF4444',
  },
  calculationTotalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  telegramButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 20,
  },
  telegramButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});