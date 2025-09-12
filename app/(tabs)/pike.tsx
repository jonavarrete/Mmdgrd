import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Target, RefreshCw } from 'lucide-react-native';

interface PikeEntry {
  id: string;
  team: string;
  opponent: string;
  result: 'G' | 'Gm' | 'P' | 'Pm' | 'X' | 'S'; // G=Gana, Gm=Gana Mitad, P=Pierde, Pm=Pierde Mitad, X=Empate, S=Suspendido
  score?: string;
  league: string;
  period: string; // G, MT, 1/4, etc.
}

interface PikeData {
  sencillos: PikeEntry[];
  tripletas: PikeEntry[];
}

// Mock data para visualización
const mockPikeData: PikeData = {
  sencillos: [
    { id: '1', team: 'New York Yankees', opponent: 'Toronto Blue Jays', result: 'G', score: '1', league: 'MLB', period: 'G' },
    { id: '2', team: 'New York Yankees', opponent: 'Toronto Blue Jays', result: 'Gm', score: '5yn5', league: 'MLB', period: 'MT' },
    { id: '3', team: 'Chicago Cubs', opponent: 'Washington Nationals', result: 'P', score: '4yn5', league: 'MLB', period: 'G' },
    { id: '4', team: 'Chicago Cubs', opponent: 'Washington Nationals', result: 'G', score: '6', league: 'MLB', period: 'MT' },
    { id: '5', team: 'Cartagena', opponent: 'Guardianes', result: 'P', score: '2', league: 'Fútbol', period: 'G' },
    { id: '6', team: 'Gramma', opponent: 'Holguín', result: 'X', score: '5yn2', league: 'MLB', period: 'G' },
    { id: '7', team: 'Industriales', opponent: 'Camagüey', result: 'G', score: '3', league: 'MLB', period: 'G' },
    { id: '8', team: 'Sancti Spíritus', opponent: 'Villa Clara', result: 'Gm', score: 'my1', league: 'MLB', period: 'G' },
    { id: '9', team: 'Santiago de Cuba', opponent: 'La Isla', result: 'P', score: '5', league: 'MLB', period: 'G' },
    { id: '10', team: 'Philadelphia Phillies', opponent: 'Miami Marlins', result: 'S', score: '4yn8', league: 'MLB', period: 'MT' },
  ],
  tripletas: [
    { id: '11', team: 'Industriales', opponent: 'Cienfuegos', result: 'G', score: '2', league: 'MLB', period: 'G' },
    { id: '12', team: 'Sancti Spíritus', opponent: 'Villa Clara', result: 'Gm', score: '1yn', league: 'MLB', period: 'G' },
    { id: '13', team: 'Camagüey', opponent: 'Guantánamo', result: 'P', score: '3', league: 'MLB', period: 'G' },
    { id: '14', team: 'Gramma', opponent: 'Holguín', result: 'G', score: '1yn', league: 'MLB', period: 'G' },
    { id: '15', team: 'Las Tunas', opponent: 'Pinar del Río', result: 'X', score: '1yn', league: 'MLB', period: 'G' },
    { id: '16', team: 'New York Yankees', opponent: 'Toronto Blue Jays', result: 'P', score: '10', league: 'MLB', period: 'G' },
    { id: '17', team: 'Chicago Cubs', opponent: 'Washington Nationals', result: 'G', score: '2', league: 'MLB', period: 'G' },
    { id: '18', team: 'Philadelphia Phillies', opponent: 'Miami Marlins', result: 'Gm', score: '1yn', league: 'MLB', period: 'G' },
    { id: '19', team: 'Detroit Tigers', opponent: 'Chicago White Sox', result: 'P', score: '2', league: 'MLB', period: 'G' },
    { id: '20', team: 'Milwaukee Brewers', opponent: 'Pittsburgh Pirates', result: 'S', score: '1yn', league: 'MLB', period: 'G' },
  ]
};

export default function Pike() {
  const [activeTab, setActiveTab] = useState<'sencillos' | 'tripletas'>('sencillos');
  const [pikeData, setPikeData] = useState<PikeData>(mockPikeData);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPikeData = async () => {
    setIsLoading(true);
    try {
      // Aquí iría la llamada a la API real
      // const response = await fetch('https://midgard.ct.ws/public/get_pikes');
      // const data = await response.json();
      // setPikeData(data);
      
      // Por ahora usamos datos mock
      setTimeout(() => {
        setPikeData(mockPikeData);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching pike data:', error);
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

  const renderPikeTable = (entries: PikeEntry[]) => {
    // Dividir las entradas en dos columnas
    const leftColumn = entries.filter((_, index) => index % 2 === 0);
    const rightColumn = entries.filter((_, index) => index % 2 === 1);
    const maxRows = Math.max(leftColumn.length, rightColumn.length);

    return (
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Pike {activeTab === 'sencillos' ? 'Sencillos' : 'Tripletas'} del Día</Text>
        </View>
        
        <View style={styles.tableContent}>
          <View style={styles.column}>
            {leftColumn.map((entry, index) => (
              <View key={entry.id} style={[styles.pikeRow, getResultStyle(entry.result)]}>
                <View style={styles.teamInfo}>
                  <Text style={[styles.teamName, getResultTextStyle(entry.result)]}>
                    {entry.team} ({entry.period})
                  </Text>
                  <Text style={[styles.opponentName, getResultTextStyle(entry.result)]}>
                    {entry.opponent}
                  </Text>
                </View>
                <View style={styles.resultInfo}>
                  <Text style={[styles.score, getResultTextStyle(entry.result)]}>
                    {entry.score}
                  </Text>
                  <Text style={[styles.result, getResultTextStyle(entry.result)]}>
                    {entry.result}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          
          <View style={styles.column}>
            {rightColumn.map((entry, index) => (
              <View key={entry.id} style={[styles.pikeRow, getResultStyle(entry.result)]}>
                <View style={styles.teamInfo}>
                  <Text style={[styles.teamName, getResultTextStyle(entry.result)]}>
                    {entry.team} ({entry.period})
                  </Text>
                  <Text style={[styles.opponentName, getResultTextStyle(entry.result)]}>
                    {entry.opponent}
                  </Text>
                </View>
                <View style={styles.resultInfo}>
                  <Text style={[styles.score, getResultTextStyle(entry.result)]}>
                    {entry.score}
                  </Text>
                  <Text style={[styles.result, getResultTextStyle(entry.result)]}>
                    {entry.result}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchPikeData} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.logo}>MIDGARD</Text>
          <Text style={styles.subtitle}>Mis Pikes</Text>
        </View>

        {/* Refresh Button */}
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={fetchPikeData}
          disabled={isLoading}
        >
          <RefreshCw size={20} color="#FFFFFF" />
          <Text style={styles.refreshButtonText}>
            {isLoading ? 'Actualizando...' : 'Actualizar Pikes'}
          </Text>
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
              Pike Sencillos del Día
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
              Pike Tripletas del Día
            </Text>
          </TouchableOpacity>
        </View>

        {/* Pike Table */}
        {pikeData[activeTab].length > 0 ? (
          renderPikeTable(pikeData[activeTab])
        ) : (
          <View style={styles.emptyState}>
            <Target size={64} color="#9CA3AF" />
            <Text style={styles.emptyStateTitle}>No tienes pikes activos</Text>
            <Text style={styles.emptyStateText}>
              Ve a la sección de Dashboard para crear tu primer pike
            </Text>
          </View>
        )}

        {/* Legend */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Leyenda:</Text>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, styles.winResult]} />
              <Text style={styles.legendText}>G/Gm - Gana/Gana Mitad</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, styles.loseResult]} />
              <Text style={styles.legendText}>P/Pm - Pierde/Pierde Mitad</Text>
            </View>
          </View>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, styles.tieResult]} />
              <Text style={styles.legendText}>X - Empate</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, styles.suspendedResult]} />
              <Text style={styles.legendText}>S - Suspendido/Cancelado</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  refreshButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  refreshButtonText: {
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
    paddingVertical: 12,
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
    textAlign: 'center',
  },
  activeTabText: {
    color: '#1F2937',
    fontWeight: '600',
  },
  tableContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
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
  tableHeader: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  tableHeaderText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  tableContent: {
    flexDirection: 'row',
    padding: 8,
  },
  column: {
    flex: 1,
    paddingHorizontal: 4,
  },
  pikeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 2,
    borderRadius: 6,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  opponentName: {
    fontSize: 11,
    fontWeight: '400',
  },
  resultInfo: {
    alignItems: 'center',
    minWidth: 40,
  },
  score: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  result: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Result background colors
  winResult: {
    backgroundColor: '#D1FAE5', // Light green
  },
  loseResult: {
    backgroundColor: '#FEE2E2', // Light red
  },
  tieResult: {
    backgroundColor: '#FEF3C7', // Light yellow
  },
  suspendedResult: {
    backgroundColor: '#F3F4F6', // Light gray
  },
  defaultResult: {
    backgroundColor: '#FFFFFF',
  },
  // Text colors
  winText: {
    color: '#065F46', // Dark green
  },
  loseText: {
    color: '#991B1B', // Dark red
  },
  tieText: {
    color: '#92400E', // Dark yellow/orange
  },
  suspendedText: {
    color: '#6B7280', // Gray
    textDecorationLine: 'line-through',
  },
  defaultText: {
    color: '#1F2937',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  legend: {
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
  legendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
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
    color: '#6B7280',
    flex: 1,
  },
});