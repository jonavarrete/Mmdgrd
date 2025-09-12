import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { X, RefreshCw } from 'lucide-react-native';

interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  time: string;
  homeScore: string;
  awayScore: string;
  homeRecord: string;
  awayRecord: string;
  league: string;
}

interface PikeModalProps {
  visible: boolean;
  onClose: () => void;
  game: Game | null;
}

export default function PikeModal({ visible, onClose, game }: PikeModalProps) {
  const [activeTab, setActiveTab] = useState<'sencillos' | 'tripletas'>('sencillos');
  const [teamsSwapped, setTeamsSwapped] = useState(false);
  const [fullGameLine, setFullGameLine] = useState('');
  const [fullGameTotal, setFullGameTotal] = useState('');
  const [halfTimeLine, setHalfTimeLine] = useState('');
  const [halfTimeTotal, setHalfTimeTotal] = useState('');

  if (!game) return null;

  const handleSwapTeams = () => {
    setTeamsSwapped(!teamsSwapped);
  };

  const handleSave = () => {
    // Aquí iría la lógica para guardar el pike
    console.log('Pike guardado', {
      game,
      activeTab,
      teamsSwapped,
      fullGameLine,
      fullGameTotal,
      halfTimeLine,
      halfTimeTotal,
    });
    onClose();
  };

  const displayHomeTeam = teamsSwapped ? game.awayTeam : game.homeTeam;
  const displayAwayTeam = teamsSwapped ? game.homeTeam : game.awayTeam;

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
          <TouchableOpacity style={styles.swapButton} onPress={handleSwapTeams}>
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
            {/* Full Game */}
            <View style={styles.gameTypeSection}>
              <Text style={styles.gameTypeTitle}>Juego Completo</Text>
              
              <View style={styles.matchup}>
                <View style={styles.teamContainer}>
                  <View style={styles.teamLogo}>
                    <Text style={styles.teamLogoText}>
                      {displayHomeTeam.split(' ').map(word => word[0]).join('')}
                    </Text>
                  </View>
                  <Text style={styles.teamName}>{displayHomeTeam}</Text>
                </View>
                
                <View style={styles.swapIcon}>
                  <RefreshCw size={16} color="#9CA3AF" />
                </View>
                
                <View style={styles.teamContainer}>
                  <View style={styles.teamLogo}>
                    <Text style={styles.teamLogoText}>
                      {displayAwayTeam.split(' ').map(word => word[0]).join('')}
                    </Text>
                  </View>
                  <Text style={styles.teamName}>{displayAwayTeam}</Text>
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Línea</Text>
                  <TextInput
                    style={styles.input}
                    value={fullGameLine}
                    onChangeText={setFullGameLine}
                    placeholder="0.0"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Alta/Baja</Text>
                  <TextInput
                    style={styles.input}
                    value={fullGameTotal}
                    onChangeText={setFullGameTotal}
                    placeholder="0.0"
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            {/* Half Time */}
            <View style={styles.gameTypeSection}>
              <Text style={styles.gameTypeTitle}>Medio Tiempo</Text>
              
              <View style={styles.matchup}>
                <View style={styles.teamContainer}>
                  <View style={styles.teamLogo}>
                    <Text style={styles.teamLogoText}>
                      {displayHomeTeam.split(' ').map(word => word[0]).join('')}
                    </Text>
                  </View>
                  <Text style={styles.teamName}>{displayHomeTeam}</Text>
                </View>
                
                <View style={styles.swapIcon}>
                  <RefreshCw size={16} color="#9CA3AF" />
                </View>
                
                <View style={styles.teamContainer}>
                  <View style={styles.teamLogo}>
                    <Text style={styles.teamLogoText}>
                      {displayAwayTeam.split(' ').map(word => word[0]).join('')}
                    </Text>
                  </View>
                  <Text style={styles.teamName}>{displayAwayTeam}</Text>
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Línea</Text>
                  <TextInput
                    style={styles.input}
                    value={halfTimeLine}
                    onChangeText={setHalfTimeLine}
                    placeholder="0.0"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Alta/Baja</Text>
                  <TextInput
                    style={styles.input}
                    value={halfTimeTotal}
                    onChangeText={setHalfTimeTotal}
                    placeholder="0.0"
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
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
  swapIcon: {
    marginHorizontal: 16,
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