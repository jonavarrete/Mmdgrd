import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Target, RefreshCw, Plus, X, ChevronDown } from 'lucide-react-native';
import { useDate } from '@/contexts/DateContext';
import { useTheme } from '@/contexts/ThemeContext';
import DateSelector from '@/components/DateSelector';

interface PikeEntry {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeResult: 'G' | 'Gm' | 'P' | 'Pm' | 'X' | 'S';
  awayResult: 'G' | 'Gm' | 'P' | 'Pm' | 'X' | 'S';
  homeScore: string;
  awayScore: string;
  middle: string;
  up: string;
  league: string;
  period: 'G' | 'MT' | '1/4';
  house: string;
  isTripleta: boolean;
}

interface PikeData {
  sencillos: {
    pelota: PikeEntry[];
    futbol: PikeEntry[];
    basket: {
      juego: PikeEntry[];
      mt: PikeEntry[];
      cuarto: PikeEntry[];
    };
  };
  tripletas: {
    pelota: PikeEntry[];
    futbol: PikeEntry[];
    basket: {
      juego: PikeEntry[];
      mt: PikeEntry[];
      cuarto: PikeEntry[];
    };
  };
}

// Mock data para visualización
const mockPikeData: PikeData = {
  sencillos: {
    pelota: [
      { id: '1', homeTeam: 'New York Yankees', awayTeam: 'Toronto Blue Jays', homeResult: 'G', awayResult: 'P', homeScore: '1', awayScore: '10', middle: '2ym', up: 'pym', league: 'MLB', period: 'G', house: 'House1', isTripleta: false },
      { id: '2', homeTeam: 'Chicago Cubs', awayTeam: 'Washington Nationals', homeResult: 'P', awayResult: 'G', homeScore: '4', awayScore: '5', middle: '1ym', up: 'my1', league: 'MLB', period: 'MT', house: 'House2', isTripleta: false },
    ],
    futbol: [
      { id: '3', homeTeam: 'Cartagena', awayTeam: 'Guardianes', homeResult: 'P', awayResult: 'G', homeScore: '2', awayScore: '3', middle: 'pym', up: '3', league: 'Fútbol', period: 'G', house: 'House3', isTripleta: false },
    ],
    basket: {
      juego: [
        { id: '4', homeTeam: 'Lakers', awayTeam: 'Warriors', homeResult: 'G', awayResult: 'P', homeScore: '110', awayScore: '105', middle: '+5', up: '215', league: 'NBA', period: 'G', house: 'House4', isTripleta: false },
      ],
      mt: [
        { id: '5', homeTeam: 'Lakers', awayTeam: 'Warriors', homeResult: 'Gm', awayResult: 'Pm', homeScore: '55', awayScore: '50', middle: '+2.5', up: '105', league: 'NBA', period: 'MT', house: 'House4', isTripleta: false },
      ],
      cuarto: [
        { id: '6', homeTeam: 'Lakers', awayTeam: 'Warriors', homeResult: 'X', awayResult: 'X', homeScore: '25', awayScore: '25', middle: '0', up: '50', league: 'NBA', period: '1/4', house: 'House4', isTripleta: false },
      ],
    },
  },
  tripletas: {
    pelota: [
      { id: '7', homeTeam: 'Industriales', awayTeam: 'Cienfuegos', homeResult: 'G', awayResult: 'P', homeScore: '2', awayScore: '1', middle: '1ym', up: '3y3m', league: 'MLB', period: 'G', house: 'House5', isTripleta: true },
    ],
    futbol: [
      { id: '8', homeTeam: 'Real Madrid', awayTeam: 'Barcelona', homeResult: 'X', awayResult: 'X', homeScore: '2', awayScore: '2', middle: 'p', up: '2', league: 'Fútbol', period: 'G', house: 'House6', isTripleta: true },
    ],
    basket: {
      juego: [
        { id: '9', homeTeam: 'Celtics', awayTeam: 'Heat', homeResult: 'P', awayResult: 'G', homeScore: '95', awayScore: '100', middle: '-3', up: '195', league: 'NBA', period: 'G', house: 'House7', isTripleta: true },
      ],
      mt: [],
      cuarto: [],
    },
  },
};

const houses = ['House1', 'House2', 'House3', 'House4', 'House5'];
const teams = ['New York Yankees', 'Toronto Blue Jays', 'Chicago Cubs', 'Washington Nationals', 'Lakers', 'Warriors', 'Celtics', 'Heat'];

export default function Pike() {
  const [activeTab, setActiveTab] = useState<'sencillos' | 'tripletas'>('sencillos');
  const [pikeData, setPikeData] = useState<PikeData>(mockPikeData);
  const { getDateString, getFormattedDate } = useDate();
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Form states
  const [selectedHouse, setSelectedHouse] = useState('');
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [middle, setMiddle] = useState('');
  const [up, setUp] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<'G' | 'MT' | '1/4'>('G');
  const [isTripleta, setIsTripleta] = useState(false);
  const [showHouseDropdown, setShowHouseDropdown] = useState(false);
  const [showHomeTeamDropdown, setShowHomeTeamDropdown] = useState(false);
  const [showAwayTeamDropdown, setShowAwayTeamDropdown] = useState(false);

  const fetchPikeData = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching pike data for date:', getDateString());
      
      const response = await fetch('https://midgard.ct.ws/get_pikes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'MidgardApp/1.0',
        },
        body: JSON.stringify({
          date: getDateString()
        })
      });

      console.log('Pike fetch response status:', response.status);
      const responseText = await response.text();
      console.log('Pike fetch response:', responseText);

      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          if (data.pikes) {
            // Transformar los datos de la API al formato esperado
            setPikeData(data.pikes);
          } else {
            // Si no hay datos, usar mock data
            setPikeData(mockPikeData);
          }
        } catch (parseError) {
          console.log('Using mock data due to parse error');
          setPikeData(mockPikeData);
        }
      } else {
        console.log('Using mock data due to API error');
        setPikeData(mockPikeData);
      }
    } catch (error) {
      console.error('Error fetching pike data:', error);
      console.log('Using mock data due to network error');
      setPikeData(mockPikeData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPikeData();
  }, []);

  const getResultStyle = (result: string) => {
    switch (result) {
      case 'G':
      case 'Gm':
        return styles.winResult;
      case 'P':
      case 'Pm':
        return styles.loseResult;
      case 'X':
        return styles.tieResult;
      case 'S':
        return styles.suspendedResult;
      default:
        return styles.defaultResult;
    }
  };

  const getResultTextStyle = (result: string) => {
    switch (result) {
      case 'G':
      case 'Gm':
        return styles.winText;
      case 'P':
      case 'Pm':
        return styles.loseText;
      case 'X':
        return styles.tieText;
      case 'S':
        return styles.suspendedText;
      default:
        return styles.defaultText;
    }
  };

  const handleCreatePike = () => {
    if (!selectedHouse || !homeTeam || !awayTeam || !middle || !up) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    console.log('Creating pike for date:', getDateString());
    
    const pikeData = {
      date: getDateString(),
      house: selectedHouse,
      home_team: homeTeam,
      away_team: awayTeam,
      middle: middle,
      up: up,
      period: selectedPeriod,
      is_tripleta: isTripleta
    };

    console.log('Pike creation data:', JSON.stringify(pikeData, null, 2));

    // Llamada a la API (comentada por ahora para testing local)
    /*
    fetch('https://midgard.ct.ws/create_manual_pike', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'MidgardApp/1.0',
      },
      body: JSON.stringify(pikeData)
    })
    .then(response => response.text())
    .then(responseText => {
      console.log('Pike creation response:', responseText);
      try {
        const data = JSON.parse(responseText);
        if (data.success || data.status) {
          Alert.alert('Éxito', 'Pike creado correctamente');
          fetchPikeData(); // Refrescar los datos
        } else {
          Alert.alert('Error', data.message || 'Error al crear pike');
        }
      } catch (parseError) {
        Alert.alert('Éxito', 'Pike creado correctamente');
        fetchPikeData(); // Refrescar los datos
      }
    })
    .catch(error => {
      console.error('Error creating pike:', error);
      Alert.alert('Error', `Error de conexión: ${error.message}`);
    });
    */

    Alert.alert('Éxito', 'Pike creado correctamente');
    setShowCreateModal(false);
    
    // Reset form
    setSelectedHouse('');
    setHomeTeam('');
    setAwayTeam('');
    setMiddle('');
    setUp('');
    setSelectedPeriod('G');
    setIsTripleta(false);
  };

  const renderPikeCard = (entry: PikeEntry) => (
    <View key={entry.id} style={[styles.pikeCard, { backgroundColor: colors.surface }]}>
      {/* Top Row */}
      <View style={styles.pikeTopRow}>
        <View style={styles.teamResult}>
          <Text style={[styles.teamName, getResultTextStyle(entry.homeResult)]}>
            {entry.homeTeam}
          </Text>
          <View style={[styles.resultBadge, getResultStyle(entry.homeResult)]}>
            <Text style={[styles.resultText, getResultTextStyle(entry.homeResult)]}>
              {entry.homeResult}
            </Text>
          </View>
        </View>
        
        <View style={styles.middleContainer}>
          <Text style={styles.middleText}>{entry.middle}</Text>
        </View>
        
        <View style={styles.teamResult}>
          <Text style={[styles.teamName, getResultTextStyle(entry.awayResult)]}>
            {entry.awayTeam}
          </Text>
          <View style={[styles.resultBadge, getResultStyle(entry.awayResult)]}>
            <Text style={[styles.resultText, getResultTextStyle(entry.awayResult)]}>
              {entry.awayResult}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Bottom Row */}
      <View style={styles.pikeBottomRow}>
        <View style={styles.teamResult}>
          <Text style={[styles.scoreText, getResultTextStyle(entry.homeResult)]}>
            {entry.homeScore}
          </Text>
          <View style={[styles.resultBadge, getResultStyle(entry.homeResult)]}>
            <Text style={[styles.resultText, getResultTextStyle(entry.homeResult)]}>
              {entry.homeResult}
            </Text>
          </View>
        </View>
        
        <View style={styles.upContainer}>
          <Text style={styles.upText}>{entry.up}</Text>
        </View>
        
        <View style={styles.teamResult}>
          <Text style={[styles.scoreText, getResultTextStyle(entry.awayResult)]}>
            {entry.awayScore}
          </Text>
          <View style={[styles.resultBadge, getResultStyle(entry.awayResult)]}>
            <Text style={[styles.resultText, getResultTextStyle(entry.awayResult)]}>
              {entry.awayResult}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderSportSection = (sportName: string, entries: PikeEntry[] | any) => {
    if (sportName === 'basket' && typeof entries === 'object') {
      return (
        <View style={styles.sportSection}>
          <Text style={[styles.sportTitle, { color: colors.text }]}>Basket</Text>
          
          {entries.juego.length > 0 && (
            <View style={styles.subSection}>
              <Text style={[styles.subSectionTitle, { color: colors.primary }]}>Juego</Text>
              {entries.juego.map(renderPikeCard)}
            </View>
          )}
          
          {entries.mt.length > 0 && (
            <View style={styles.subSection}>
              <Text style={[styles.subSectionTitle, { color: colors.primary }]}>MT</Text>
              {entries.mt.map(renderPikeCard)}
            </View>
          )}
          
          {entries.cuarto.length > 0 && (
            <View style={styles.subSection}>
              <Text style={[styles.subSectionTitle, { color: colors.primary }]}>1/4</Text>
              {entries.cuarto.map(renderPikeCard)}
            </View>
          )}
        </View>
      );
    }

    if (Array.isArray(entries) && entries.length > 0) {
      return (
        <View style={styles.sportSection}>
          <Text style={[styles.sportTitle, { color: colors.text }]}>
            {sportName === 'pelota' ? 'Pelota' : sportName === 'futbol' ? 'Fútbol' : sportName}
          </Text>
          {entries.map(renderPikeCard)}
        </View>
      );
    }

    return null;
  };

  const CreatePikeModal = () => (
    <Modal
      visible={showCreateModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowCreateModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Agregar Pike</Text>
          <TouchableOpacity onPress={() => setShowCreateModal(false)}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {/* House Dropdown */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>House:</Text>
            <TouchableOpacity 
              style={styles.dropdown}
              onPress={() => setShowHouseDropdown(!showHouseDropdown)}
            >
              <Text style={styles.dropdownText}>
                {selectedHouse || 'Seleccionar House'}
              </Text>
              <ChevronDown size={20} color="#6B7280" />
            </TouchableOpacity>
            {showHouseDropdown && (
              <View style={styles.dropdownList}>
                {houses.map((house) => (
                  <TouchableOpacity
                    key={house}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedHouse(house);
                      setShowHouseDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{house}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Teams Row */}
          <View style={styles.teamsRow}>
            <View style={styles.teamGroup}>
              <Text style={styles.formLabel}>Equipo (Home):</Text>
              <TouchableOpacity 
                style={styles.dropdown}
                onPress={() => setShowHomeTeamDropdown(!showHomeTeamDropdown)}
              >
                <Text style={styles.dropdownText}>
                  {homeTeam || 'Seleccionar'}
                </Text>
                <ChevronDown size={20} color="#6B7280" />
              </TouchableOpacity>
              {showHomeTeamDropdown && (
                <View style={styles.dropdownList}>
                  {teams.map((team) => (
                    <TouchableOpacity
                      key={team}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setHomeTeam(team);
                        setShowHomeTeamDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{team}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.teamGroup}>
              <Text style={styles.formLabel}>Equipo (Away):</Text>
              <TouchableOpacity 
                style={styles.dropdown}
                onPress={() => setShowAwayTeamDropdown(!showAwayTeamDropdown)}
              >
                <Text style={styles.dropdownText}>
                  {awayTeam || 'Seleccionar'}
                </Text>
                <ChevronDown size={20} color="#6B7280" />
              </TouchableOpacity>
              {showAwayTeamDropdown && (
                <View style={styles.dropdownList}>
                  {teams.map((team) => (
                    <TouchableOpacity
                      key={team}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setAwayTeam(team);
                        setShowAwayTeamDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{team}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Middle and Up Row */}
          <View style={styles.middleUpRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.formLabel}>Middle:</Text>
              <TextInput
                style={styles.textInput}
                value={middle}
                onChangeText={setMiddle}
                placeholder="Ej: 2ym"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.formLabel}>Up:</Text>
              <TextInput
                style={styles.textInput}
                value={up}
                onChangeText={setUp}
                placeholder="Ej: pym"
              />
            </View>
          </View>

          {/* Period Selection */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Período:</Text>
            <View style={styles.radioGroup}>
              {(['G', 'MT', '1/4'] as const).map((period) => (
                <TouchableOpacity
                  key={period}
                  style={styles.radioOption}
                  onPress={() => setSelectedPeriod(period)}
                >
                  <View style={[
                    styles.radioCircle,
                    selectedPeriod === period && styles.radioSelected
                  ]}>
                    {selectedPeriod === period && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.radioLabel}>{period}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Tripleta Checkbox */}
          <View style={styles.formGroup}>
            <TouchableOpacity
              style={styles.checkboxOption}
              onPress={() => setIsTripleta(!isTripleta)}
            >
              <View style={[
                styles.checkbox,
                isTripleta && styles.checkboxSelected
              ]}>
                {isTripleta && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>x3 (Tripleta)</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.modalActions}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowCreateModal(false)}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreatePike}
          >
            <Text style={styles.createButtonText}>Crear</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchPikeData} />
        }
      >
        <View style={styles.header}>
          <Text style={[styles.logo, { color: colors.primary }]}>MIDGARD</Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>Mis Pikes - {getFormattedDate()}</Text>
        </View>

        {/* Date Selector */}
        <DateSelector />

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={[styles.refreshButton, { backgroundColor: colors.primary }]} 
            onPress={fetchPikeData}
            disabled={isLoading}
          >
            <RefreshCw size={20} color="#FFFFFF" />
            <Text style={styles.refreshButtonText}>
              {isLoading ? 'Actualizando...' : 'Actualizar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: colors.success }]} 
            onPress={() => setShowCreateModal(true)}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Agregar Pike</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={[styles.tabContainer, { backgroundColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'sencillos' && { ...styles.activeTab, backgroundColor: colors.surface }]}
            onPress={() => setActiveTab('sencillos')}
          >
            <Text
              style={[
                styles.tabText, 
                { color: activeTab === 'sencillos' ? colors.text : colors.textSecondary },
                activeTab === 'sencillos' && { fontWeight: '600' },
              ]}
            >
              Pike Sencillos del Día
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'tripletas' && { ...styles.activeTab, backgroundColor: colors.surface }]}
            onPress={() => setActiveTab('tripletas')}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'tripletas' ? colors.text : colors.textSecondary },
                activeTab === 'tripletas' && { fontWeight: '600' },
              ]}
            >
              Pike Tripletas del Día
            </Text>
          </TouchableOpacity>
        </View>

        {/* Pike Content */}
        <View style={styles.pikeContent}>
          {renderSportSection('pelota', pikeData[activeTab].pelota)}
          {renderSportSection('futbol', pikeData[activeTab].futbol)}
          {renderSportSection('basket', pikeData[activeTab].basket)}
        </View>

        {/* Legend */}
        <View style={[styles.legend, { backgroundColor: colors.surface }]}>
          <Text style={[styles.legendTitle, { color: colors.text }]}>Leyenda:</Text>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, styles.winResult]} />
              <Text style={[styles.legendText, { color: colors.textSecondary }]}>G/Gm - Gana/Gana Mitad</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, styles.loseResult]} />
              <Text style={[styles.legendText, { color: colors.textSecondary }]}>P/Pm - Pierde/Pierde Mitad</Text>
            </View>
          </View>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, styles.tieResult]} />
              <Text style={[styles.legendText, { color: colors.textSecondary }]}>X - Empate</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, styles.suspendedResult]} />
              <Text style={[styles.legendText, { color: colors.textSecondary }]}>S - Suspendido/Cancelado</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <CreatePikeModal />
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
    marginBottom: 20,
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
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  refreshButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  addButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTab: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  pikeContent: {
    marginBottom: 20,
  },
  sportSection: {
    marginBottom: 24,
  },
  sportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    paddingLeft: 4,
  },
  subSection: {
    marginBottom: 16,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    paddingLeft: 8,
  },
  pikeCard: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pikeTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pikeBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamResult: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  teamName: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  resultBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  middleContainer: {
    flex: 0.6,
    alignItems: 'center',
  },
  middleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  upContainer: {
    flex: 0.6,
    alignItems: 'center',
  },
  upText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  // Result colors
  winResult: {
    backgroundColor: '#D1FAE5',
  },
  loseResult: {
    backgroundColor: '#FEE2E2',
  },
  tieResult: {
    backgroundColor: '#FEF3C7',
  },
  suspendedResult: {
    backgroundColor: '#F3F4F6',
  },
  defaultResult: {
    backgroundColor: '#FFFFFF',
  },
  winText: {
    color: '#065F46',
  },
  loseText: {
    color: '#991B1B',
  },
  tieText: {
    color: '#92400E',
  },
  suspendedText: {
    color: '#6B7280',
    textDecorationLine: 'line-through',
  },
  defaultText: {
    color: '#1F2937',
  },
  legend: {
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
  legendTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    flex: 1,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dropdownText: {
    fontSize: 14,
    color: '#1F2937',
  },
  dropdownList: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 150,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#1F2937',
  },
  teamsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  teamGroup: {
    flex: 1,
  },
  middleUpRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  inputGroup: {
    flex: 1,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#4F46E5',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4F46E5',
  },
  radioLabel: {
    fontSize: 14,
    color: '#1F2937',
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#1F2937',
  },
  modalActions: {
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
  createButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});