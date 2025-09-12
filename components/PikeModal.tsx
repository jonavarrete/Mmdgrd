import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { X, RefreshCw } from 'lucide-react-native';

interface Game {
  id: string;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
  time: string;
  homeScore: string;
  awayScore: string;
  homeRecord: string;
  awayRecord: string;
  league: string;
  hasPike?: boolean;
  periods?: {
    fullGame?: { home: string; away: string };
    halfTime?: { home: string; away: string };
    firstQuarter?: { home: string; away: string };
  };
}

interface PikeModalProps {
  visible: boolean;
  onClose: () => void;
  game: Game | null;
}

export default function PikeModal({ visible, onClose, game }: PikeModalProps) {
  const [activeTab, setActiveTab] = useState<'sencillos' | 'tripletas'>('sencillos');
  
  // Estados para intercambio individual por período
  const [fullGameSwapped, setFullGameSwapped] = useState(false);
  const [halfTimeSwapped, setHalfTimeSwapped] = useState(false);
  const [firstQuarterSwapped, setFirstQuarterSwapped] = useState(false);
  
  // Estados para los valores de los inputs
  const [fullGameLine, setFullGameLine] = useState('');
  const [fullGameTotal, setFullGameTotal] = useState('');
  const [halfTimeLine, setHalfTimeLine] = useState('');
  const [halfTimeTotal, setHalfTimeTotal] = useState('');
  const [firstQuarterLine, setFirstQuarterLine] = useState('');
  const [firstQuarterTotal, setFirstQuarterTotal] = useState('');
  
  // Estados para selección de equipos por período
  const [fullGameSelectedTeam, setFullGameSelectedTeam] = useState<'home' | 'away'>('home');
  const [halfTimeSelectedTeam, setHalfTimeSelectedTeam] = useState<'home' | 'away'>('home');
  const [firstQuarterSelectedTeam, setFirstQuarterSelectedTeam] = useState<'home' | 'away'>('home');

  // Determinar qué períodos mostrar según el deporte
  const getAvailablePeriods = () => {
    if (!game) return [];
    
    const periods = [];
    
    // Todos los deportes tienen juego completo
    periods.push('fullGame');
    
    // Todos los deportes tienen medio tiempo
    periods.push('halfTime');
    
    // Solo basketball tiene primer cuarto
    if (game.league === 'NBA' || game.league === 'BASKETBALL') {
      periods.push('firstQuarter');
    }
    
    return periods;
  };

  const getPeriodTitle = (period: string) => {
    switch (period) {
      case 'fullGame': return 'Juego Completo (G)';
      case 'halfTime': return 'Medio Tiempo (MT)';
      case 'firstQuarter': return 'Primer Cuarto (1/4)';
      default: return period;
    }
  };

  const getPeriodScores = (period: string) => {
    if (!game?.periods) return { home: '0', away: '0' };
    
    switch (period) {
      case 'fullGame': return game.periods.fullGame || { home: '0', away: '0' };
      case 'halfTime': return game.periods.halfTime || { home: '0', away: '0' };
      case 'firstQuarter': return game.periods.firstQuarter || { home: '0', away: '0' };
      default: return { home: '0', away: '0' };
    }
  };

  if (!game) return null;

  const handleSwapAllTeams = () => {
    const newSwapState = !fullGameSwapped;
    setFullGameSwapped(newSwapState);
    setHalfTimeSwapped(newSwapState);
    setFirstQuarterSwapped(newSwapState);
  };

  const handleSwapPeriod = (period: string) => {
    switch (period) {
      case 'fullGame':
        setFullGameSwapped(!fullGameSwapped);
        break;
      case 'halfTime':
        setHalfTimeSwapped(!halfTimeSwapped);
        break;
      case 'firstQuarter':
        setFirstQuarterSwapped(!firstQuarterSwapped);
        break;
    }
  };

  const getSwappedState = (period: string) => {
    switch (period) {
      case 'fullGame': return fullGameSwapped;
      case 'halfTime': return halfTimeSwapped;
      case 'firstQuarter': return firstQuarterSwapped;
      default: return false;
    }
  };

  const getDisplayTeams = (period: string) => {
    const isSwapped = getSwappedState(period);
    return {
      home: {
        name: isSwapped ? game.awayTeam : game.homeTeam,
        id: isSwapped ? game.awayTeamId : game.homeTeamId,
        logo: isSwapped ? game.awayTeamLogo : game.homeTeamLogo,
      },
      away: {
        name: isSwapped ? game.homeTeam : game.awayTeam,
        id: isSwapped ? game.homeTeamId : game.awayTeamId,
        logo: isSwapped ? game.homeTeamLogo : game.awayTeamLogo,
      }
    };
  };

  const handleSave = async () => {
    try {
      const pikeData = {
        match_id: game.matchId,
        type: activeTab,
        periods: []
      };

      // Agregar datos de cada período disponible
      const availablePeriods = getAvailablePeriods();
      
      availablePeriods.forEach(period => {
        const teams = getDisplayTeams(period);
        const lineValue = getLineValue(period);
        const totalValue = getTotalValue(period);
        
        if (lineValue || totalValue) {
          pikeData.periods.push({
            period: period,
            home_team_id: teams.home.id,
            away_team_id: teams.away.id,
            line: lineValue,
            total: totalValue,
          });
        }
      });

      // Enviar a la API
      const response = await fetch('https://midgard.ct.ws/public/api/create_pike', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pikeData)
      });

      if (response.ok) {
        Alert.alert('Éxito', 'Pike guardado correctamente');
        onClose();
      } else {
        Alert.alert('Error', 'No se pudo guardar el pike');
      }
    } catch (error) {
      console.error('Error saving pike:', error);
      Alert.alert('Error', 'Error de conexión');
    }
  };

  const getLineValue = (period: string) => {
    switch (period) {
      case 'fullGame': return fullGameLine;
      case 'halfTime': return halfTimeLine;
      case 'firstQuarter': return firstQuarterLine;
      default: return '';
    }
  };

  const getTotalValue = (period: string) => {
    switch (period) {
      case 'fullGame': return fullGameTotal;
      case 'halfTime': return halfTimeTotal;
      case 'firstQuarter': return firstQuarterTotal;
      default: return '';
    }
  };

  const setLineValue = (period: string, value: string) => {
    switch (period) {
      case 'fullGame': setFullGameLine(value); break;
      case 'halfTime': setHalfTimeLine(value); break;
      case 'firstQuarter': setFirstQuarterLine(value); break;
    }
  };

  const setTotalValue = (period: string, value: string) => {
    switch (period) {
      case 'fullGame': setFullGameTotal(value); break;
      case 'halfTime': setHalfTimeTotal(value); break;
      case 'firstQuarter': setFirstQuarterTotal(value); break;
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
          <Text style={styles.title}>Agregar Pike</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Swap Teams Button */}
          <TouchableOpacity style={styles.swapButton} onPress={handleSwapAllTeams}>
            <RefreshCw size={20} color="#FFFFFF" />
            <Text style={styles.swapButtonText}>Cambiar Todos los Equipos</Text>
          </TouchableOpacity>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'sencillos' && styles.activeTab]}
              onPress={() => setActiveTab('sencillos')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'sencillos' && styles.activeTabText,
                ]}
              >
                Sencillos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'tripletas' && styles.activeTab]}
              onPress={() => setActiveTab('tripletas')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'tripletas' && styles.activeTabText,
                ]}
              >
                Tripletas
              </Text>
            </TouchableOpacity>
          </View>

          {/* Game Content */}
          <View style={styles.gameSection}>
            {getAvailablePeriods().map((period) => {
              const scores = getPeriodScores(period);
              const teams = getDisplayTeams(period);

              return (
                <View key={period} style={styles.gameTypeSection}>
                  <Text style={styles.gameTypeTitle}>{getPeriodTitle(period)}</Text>
                  
                  <View style={styles.matchup}>
                    <View style={styles.teamContainer}>
                      {teams.home.logo ? (
                        <Image source={{ uri: teams.home.logo }} style={styles.teamLogoImage} />
                      ) : (
                        <View style={styles.teamLogo}>
                          <Text style={styles.teamLogoText}>
                            {teams.home.name.split(' ').map(word => word[0]).join('')}
                          </Text>
                        </View>
                      )}
                      <Text style={styles.teamName}>{teams.home.name}</Text>
                      <Text style={styles.teamScore}>{scores.home}</Text>
                    </View>
                    
                    <TouchableOpacity onPress={() => handleSwapPeriod(period)} style={styles.swapIcon}>
                    
                      <RefreshCw size={16} color="#9CA3AF" />
                    </TouchableOpacity>
                    
                    <View style={styles.teamContainer}>
                      {teams.away.logo ? (
                        <Image source={{ uri: teams.away.logo }} style={styles.teamLogoImage} />
                      ) : (
                        <View style={styles.teamLogo}>
                          <Text style={styles.teamLogoText}>
                            {teams.away.name.split(' ').map(word => word[0]).join('')}
                          </Text>
                        </View>
                      )}
                      <Text style={styles.teamName}>{teams.away.name}</Text>
                      <Text style={styles.teamScore}>{scores.away}</Text>
                    </View>
                  </View>

                  <View style={styles.inputRow}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Línea</Text>
                      <TextInput
                        style={styles.input}
                        value={getLineValue(period)}
                        onChangeText={(value) => setLineValue(period, value)}
                        placeholder="0.0"
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Alta/Baja</Text>
                      <TextInput
                        style={styles.input}
                        value={getTotalValue(period)}
                        onChangeText={(value) => setTotalValue(period, value)}
                        placeholder="0.0"
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>OK</Text>
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
    fontSize: 20,
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
  swapButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  swapButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
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
    color: '#6B7280',
  },
  activeTabText: {
    color: '#1F2937',
    fontWeight: '600',
  },
  gameSection: {
    gap: 24,
  },
  gameTypeSection: {
    backgroundColor: '#FFFFFF',
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
  gameTypeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  matchup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  teamContainer: {
    alignItems: 'center',
    flex: 1,
  },
  teamLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  teamLogoImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginBottom: 8,
  },
  teamLogoText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 10,
  },
  teamName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'center',
  },
  teamScore: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginTop: 4,
  },
  swapIcon: {
    marginHorizontal: 16,
    padding: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
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
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
  },
  actionButtons: {
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
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#10B981',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});