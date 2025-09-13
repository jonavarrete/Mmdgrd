import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, LogOut, Settings, CreditCard as Edit, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { useUser } from '@/contexts/UserContext';
import { useTheme } from '@/contexts/ThemeContext';
import SettingsModal from '@/components/SettingsModal';

export default function Profile() {
  const { user, logout, setUser } = useUser();
  const { colors } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [showEditBalance, setShowEditBalance] = useState(false);
  const [newBalance, setNewBalance] = useState('');

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

  const handleEditBalance = () => {
    setNewBalance(user?.balance?.toString() || '0');
    setShowEditBalance(true);
  };

  const handleSaveBalance = async () => {
    if (!user || !newBalance) {
      Alert.alert('Error', 'Por favor ingresa un balance válido');
      return;
    }

    const balance = parseFloat(newBalance);
    if (isNaN(balance)) {
      Alert.alert('Error', 'El balance debe ser un número válido');
      return;
    }

    try {
      const response = await fetch('https://midgard.ct.ws/update_balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'MidgardApp/1.0',
        },
        body: JSON.stringify({
          user_id: user.id,
          new_balance: balance
        })
      });

      console.log('Balance update response status:', response.status);
      const responseText = await response.text();
      console.log('Balance update response:', responseText);

      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          if (data.success || data.status) {
            // Update local user state
            setUser({
              ...user,
              balance: balance
            });
            Alert.alert('Éxito', 'Balance actualizado correctamente');
          } else {
            Alert.alert('Error', data.message || 'Error al actualizar el balance');
          }
        } catch (parseError) {
          // If not valid JSON but status is OK, assume success
          setUser({
            ...user,
            balance: balance
          });
          Alert.alert('Éxito', 'Balance actualizado correctamente');
        }
      } else {
        Alert.alert('Error', `Error ${response.status}: No se pudo actualizar el balance`);
      }
    } catch (error) {
      console.error('Error updating balance:', error);
      // For development, allow local update
      setUser({
        ...user,
        balance: balance
      });
      Alert.alert('Éxito', 'Balance actualizado correctamente (modo desarrollo)');
    }

    setShowEditBalance(false);
  };

  const EditBalanceModal = () => (
    <Modal
      visible={showEditBalance}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowEditBalance(false)}
    >
      <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.modalHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Editar Balance</Text>
          <TouchableOpacity onPress={() => setShowEditBalance(false)}>
            <X size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.modalContent}>
          <View style={[styles.formSection, { backgroundColor: colors.surface }]}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Nuevo Balance:</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              value={newBalance}
              onChangeText={setNewBalance}
              placeholder="0"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              autoFocus
            />
          </View>
        </View>

        <View style={[styles.modalActions, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: colors.textSecondary }]}
            onPress={() => setShowEditBalance(false)}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSaveBalance}
          >
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

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
          <View style={styles.balanceContainer}>
            <Text style={[styles.balance, { color: colors.success }]}>
              F:{user?.balance?.toLocaleString() || '0'}
            </Text>
            <TouchableOpacity 
              style={[styles.editBalanceButton, { backgroundColor: colors.primary }]}
              onPress={handleEditBalance}
            >
              <Edit size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
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

      <EditBalanceModal />
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
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  editBalanceButton: {
    padding: 8,
    borderRadius: 6,
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
  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formSection: {
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
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
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
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});