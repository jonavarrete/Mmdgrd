import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RefreshCw, CreditCard as Edit, Zap, ChevronDown } from 'lucide-react-native';
import PikeModal from '@/components/PikeModal';
import { useDate } from '@/contexts/DateContext';

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

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  
  const { selectedDate, setSelectedDate, getDateString } = useDate();

  const handleUpdateScores = async () => {
    setIsLoading(true);
    try {
      const dateString = getDateString();
      
      const response = await fetch('https://midgard.ct.ws/public/get_scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: dateString
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Transformar los datos de la API al formato esperado
        const transformedGames = data.games?.map((game: any, index: number) => ({
          id: game.id || index.toString(),
          matchId: game.match_id || game.id || index.toString(),
          homeTeam: game.home_team || game.homeTeam,
          awayTeam: game.away_team || game.awayTeam,
          homeTeamId: game.home_team_id || game.homeTeamId || '',
          awayTeamId: game.away_team_id || game.awayTeamId || '',
          homeTeamLogo: game.home_team_logo || game.homeTeamLogo,
          awayTeamLogo: game.away_team_logo || game.awayTeamLogo,
          time: game.time || game.start_time,
          homeScore: game.home_score || game.homeScore || '0 - 0',
          awayScore: game.away_score || game.awayScore || '0 - 0',
          homeRecord: game.home_record || game.homeRecord || 'G',
          awayRecord: game.away_record || game.awayRecord || 'MT',
          league: game.league || 'MLB',
          hasPike: game.has_pike || false,
          periods: {
            fullGame: game.full_game ? { home: game.full_game.home, away: game.full_game.away } : undefined,
            halfTime: game.half_time ? { home: game.half_time.home, away: game.half_time.away } : undefined,
            firstQuarter: game.first_quarter ? { home: game.first_quarter.home, away: game.first_quarter.away } : undefined,
          }
        })) || [];
        
        setGames(transformedGames);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
      Alert.alert('Error', 'No se pudieron cargar los juegos. Mostrando datos de ejemplo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPike = (game: Game) => {
    setSelectedGame(game);
    setModalVisible(true);
  };

  const handlePike = (game: Game) => {
    setSelectedGame(game);
    setModalVisible(true);
  };

  const updateDate = (field: 'day' | 'month' | 'year', increment: boolean) => {
    const newDate = { ...selectedDate };
    if (field === 'day') {
      newDate.day = increment ? Math.min(31, selectedDate.day + 1) : Math.max(1, selectedDate.day - 1);
    } else if (field === 'month') {
      newDate.month = increment ? Math.min(12, selectedDate.month + 1) : Math.max(1, selectedDate.month - 1);
    } else if (field === 'year') {
      newDate.year = increment ? selectedDate.year + 1 : Math.max(2020, selectedDate.year - 1);
    }
    setSelectedDate(newDate);
  };

  const groupedGames = games.reduce((acc, game) => {
    if (!acc[game.league]) {
      acc[game.league] = [];
    }
    acc[game.league].push(game);
    return acc;
  }, {} as Record<string, Game[]>);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>MIDGARD</Text>
          <Text style={styles.subtitle}>Dashboard</Text>
        </View>

        {/* Date Selector */}
        <View style={styles.dateContainer}>
          <View style={styles.dateSelector}>
            <TouchableOpacity onPress={() => updateDate('day', false)}>
              <ChevronDown size={16} color="#6B7280" style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>
            <Text style={styles.dateText}>{selectedDate.day.toString().padStart(2, '0')}</Text>
            <TouchableOpacity onPress={() => updateDate('day', true)}>
              <ChevronDown size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <View style={styles.dateSelector}>
            <TouchableOpacity onPress={() => updateDate('month', false)}>
              <ChevronDown size={16} color="#6B7280" style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>
            <Text style={styles.dateText}>{selectedDate.month.toString().padStart(2, '0')}</Text>
            <TouchableOpacity onPress={() => updateDate('month', true)}>
              <ChevronDown size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <View style={styles.dateSelector}>
            <TouchableOpacity onPress={() => updateDate('year', false)}>
              <ChevronDown size={16} color="#6B7280" style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>
            <Text style={styles.dateText}>{selectedDate.year}</Text>
            <TouchableOpacity onPress={() => updateDate('year', true)}>
              <ChevronDown size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Update Button */}
        <TouchableOpacity 
          style={styles.updateButton} 
          onPress={handleUpdateScores}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <RefreshCw size={20} color="#FFFFFF" />
          )}
          <Text style={styles.updateButtonText}>
            {isLoading ? 'Actualizando...' : 'Actualizar Puntajes'}
          </Text>
        </TouchableOpacity>

        {/* Games Section */}
        {games.length > 0 ? (
          <View style={styles.gamesSection}>
            {Object.entries(groupedGames).map(([league, leagueGames]) => (
              <View key={league} style={styles.leagueSection}>
                <Text style={styles.leagueTitle}>{league}</Text>
                
                {leagueGames.map((game) => (
                  <View key={game.id} style={styles.gameCard}>
                    <View style={styles.gameHeader}>
                      <Text style={styles.gameTime}>{game.time}</Text>
                    </View>
                    
                    <View style={styles.gameContent}>
                      <View style={styles.teamContainer}>
                        <View style={styles.team}>
                          {game.homeTeamLogo ? (
                            <Image source={{ uri: game.homeTeamLogo }} style={styles.teamLogoImage} />
                          ) : (
                            <View style={styles.teamLogo}>
                              <Text style={styles.teamLogoText}>
                                {game.homeTeam.split(' ').map(word => word[0]).join('')}
                              </Text>
                            </View>
                          )}
                          <Text style={styles.teamName} numberOfLines={1}>
                            {game.homeTeam}
                          </Text>
                        </View>
                        
                        <View style={styles.scoreContainer}>
                          <Text style={styles.record}>{game.homeRecord}</Text>
                          <Text style={styles.score}>{game.homeScore}</Text>
                        </View>
                      </View>

                      <Text style={styles.vs}>VS</Text>

                      <View style={styles.teamContainer}>
                        <View style={styles.team}>
                          {game.awayTeamLogo ? (
                            <Image source={{ uri: game.awayTeamLogo }} style={styles.teamLogoImage} />
                          ) : (
                            <View style={styles.teamLogo}>
                              <Text style={styles.teamLogoText}>
                                {game.awayTeam.split(' ').map(word => word[0]).join('')}
                              </Text>
                            </View>
                          )}
                          <Text style={styles.teamName} numberOfLines={1}>
                            {game.awayTeam}
                          </Text>
                        </View>
                        
                        <View style={styles.scoreContainer}>
                          <Text style={styles.record}>{game.awayRecord}</Text>
                          <Text style={styles.score}>{game.awayScore}</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.actionButtons}>
                      {game.hasPike ? (
                        <TouchableOpacity 
                          style={styles.editButton}
                          onPress={() => handleEditPike(game)}
                        >
                          <Edit size={16} color="#92400E" />
                          <Text style={styles.editButtonText}>Editar</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity 
                          style={styles.pikeButton}
                          onPress={() => handlePike(game)}
                        >
                          <Zap size={16} color="#FFFFFF" />
                          <Text style={styles.pikeButtonText}>Pike</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Presiona "Actualizar Puntajes" para obtener los juegos del día
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Copyright © Midgard 2025</Text>
        </View>
      </ScrollView>

      <PikeModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        game={selectedGame}
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
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    gap: 15,
  },
  dateSelector: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    minWidth: 60,
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  updateButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 30,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  gamesSection: {
    marginBottom: 30,
  },
  leagueSection: {
    marginBottom: 30,
  },
  leagueTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
    paddingLeft: 5,
  },
  gameCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gameHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  gameTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  gameContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  teamContainer: {
    flex: 1,
    alignItems: 'center',
  },
  team: {
    alignItems: 'center',
    marginBottom: 8,
  },
  teamLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  teamLogoImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
  },
  teamLogoText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  teamName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    maxWidth: 80,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  record: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 2,
  },
  score: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  vs: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6B7280',
    marginHorizontal: 10,
  },
  actionButtons: {
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  editButtonText: {
    color: '#92400E',
    fontSize: 14,
    fontWeight: '600',
  },
  pikeButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pikeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 40,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});