import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, LogOut, Settings } from 'lucide-react-native';
import { router } from 'expo-router';
import { useUser } from '@/contexts/UserContext';
import { useTheme } from '@/contexts/ThemeContext';
import SettingsModal from '@/components/SettingsModal';

export default function Profile() {
  const { user, logout } = useUser();
  const { colors } = useTheme();
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión', 
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/login');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.logo, { color: colors.primary }]}>MIDGARD</Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>Mi Perfil</Text>
        </View>

        <View style={[styles.profileCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <User size={48} color="#FFFFFF" />
          </View>
          <Text style={[styles.username, { color: colors.text }]}>
            {user?.username || 'Usuario'}
          </Text>
          <Text style={[styles.balance, { color: colors.success }]}>
            F:{user?.balance?.toLocaleString() || '0'}
          </Text>
        </View>

        <View style={[styles.menuSection, { backgroundColor: colors.surface }]}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => setShowSettings(true)}
          >
            <Settings size={24} color={colors.primary} />
            <Text style={[styles.menuText, { color: colors.text }]}>Configuración</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleLogout}
          >
            <LogOut size={24} color={colors.error} />
            <Text style={[styles.menuText, { color: colors.error }]}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
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
  profileCard: {
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
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
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  balance: {
    fontSize: 18,
    fontWeight: '600',
  },
  menuSection: {
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 16,
  },
});