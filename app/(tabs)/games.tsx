import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreditCard as Edit, Zap } from 'lucide-react-native';
import PikeModal from '@/components/PikeModal';

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

export default function Games() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const handleEditPike = (game: Game) => {
    setSelectedGame(game);
    setModalVisible(true);
  };

  const handlePike = (game: Game) => {
    setSelectedGame(game);
    setModalVisible(true);
  };

  const groupedGames = [].reduce((acc: Record<string, Game[]>, game: Game) => {
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
          <Text style={styles.subtitle}>Juegos del Día</Text>
        </View>

        {/* Games by League */}
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Los juegos se muestran ahora en el Dashboard principal. Ve a la pestaña Dashboard para ver y gestionar los partidos.
          </Text>
        </View>
        {/* {Object.entries(groupedGames).map(([league, games]) => (
          <View key={league} style={styles.leagueSection}>
            <Text style={styles.leagueTitle}>{league}</Text>
            
            {games.map((game) => (
              <View key={game.id} style={styles.gameCard}>
                <View style={styles.gameHeader}>
                  <Text style={styles.gameTime}>{game.time}</Text>
                </View>
                
                <View style={styles.gameContent}>
                  <View style={styles.teamContainer}>
                    <View style={styles.team}>
                      <View style={styles.teamLogo}>
                        <Text style={styles.teamLogoText}>
                          {game.homeTeam.split(' ').map(word => word[0]).join('')}
                        </Text>
                      </View>
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
                      <View style={styles.teamLogo}>
                        <Text style={styles.teamLogoText}>
                          {game.awayTeam.split(' ').map(word => word[0]).join('')}
                        </Text>
                      </View>
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
                  {league === 'MLB' ? (
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
        ))} */}
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
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 40,
    borderRadius: 12,
    marginBottom: 30,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
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
});