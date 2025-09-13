import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { X, Bell, Palette, Moon, Sun, Smartphone } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useSettings } from '@/contexts/SettingsContext';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const { colors, themeMode, setThemeMode, isDark } = useTheme();
  const { notifications, updateNotificationSetting } = useSettings();

  const themeOptions = [
    { key: 'light', label: 'Claro', icon: Sun },
    { key: 'dark', label: 'Oscuro', icon: Moon },
    { key: 'system', label: 'Sistema', icon: Smartphone },
  ] as const;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>Configuración</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Theme Section */}
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <View style={styles.sectionHeader}>
              <Palette size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Tema</Text>
            </View>
            
            <View style={styles.themeOptions}>
              {themeOptions.map(({ key, label, icon: Icon }) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.themeOption,
                    { borderColor: colors.border },
                    themeMode === key && { backgroundColor: colors.primary + '20', borderColor: colors.primary }
                  ]}
                  onPress={() => setThemeMode(key)}
                >
                  <Icon size={20} color={themeMode === key ? colors.primary : colors.textSecondary} />
                  <Text style={[
                    styles.themeOptionText,
                    { color: themeMode === key ? colors.primary : colors.text }
                  ]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Notifications Section */}
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <View style={styles.sectionHeader}>
              <Bell size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Notificaciones</Text>
            </View>

            <View style={styles.notificationOptions}>
              <View style={[styles.notificationItem, { borderBottomColor: colors.border }]}>
                <View style={styles.notificationInfo}>
                  <Text style={[styles.notificationTitle, { color: colors.text }]}>
                    Notificaciones Push
                  </Text>
                  <Text style={[styles.notificationDescription, { color: colors.textSecondary }]}>
                    Recibir notificaciones en el dispositivo
                  </Text>
                </View>
                <Switch
                  value={notifications.push}
                  onValueChange={(value) => updateNotificationSetting('push', value)}
                  trackColor={{ false: colors.border, true: colors.primary + '40' }}
                  thumbColor={notifications.push ? colors.primary : colors.textSecondary}
                />
              </View>

              <View style={[styles.notificationItem, { borderBottomColor: colors.border }]}>
                <View style={styles.notificationInfo}>
                  <Text style={[styles.notificationTitle, { color: colors.text }]}>
                    Notificaciones por Email
                  </Text>
                  <Text style={[styles.notificationDescription, { color: colors.textSecondary }]}>
                    Recibir resúmenes por correo electrónico
                  </Text>
                </View>
                <Switch
                  value={notifications.email}
                  onValueChange={(value) => updateNotificationSetting('email', value)}
                  trackColor={{ false: colors.border, true: colors.primary + '40' }}
                  thumbColor={notifications.email ? colors.primary : colors.textSecondary}
                />
              </View>

              <View style={[styles.notificationItem, { borderBottomColor: colors.border }]}>
                <View style={styles.notificationInfo}>
                  <Text style={[styles.notificationTitle, { color: colors.text }]}>
                    Actualizaciones de Juegos
                  </Text>
                  <Text style={[styles.notificationDescription, { color: colors.textSecondary }]}>
                    Notificar cuando cambien los puntajes
                  </Text>
                </View>
                <Switch
                  value={notifications.gameUpdates}
                  onValueChange={(value) => updateNotificationSetting('gameUpdates', value)}
                  trackColor={{ false: colors.border, true: colors.primary + '40' }}
                  thumbColor={notifications.gameUpdates ? colors.primary : colors.textSecondary}
                />
              </View>

              <View style={styles.notificationItem}>
                <View style={styles.notificationInfo}>
                  <Text style={[styles.notificationTitle, { color: colors.text }]}>
                    Resultados de Pike
                  </Text>
                  <Text style={[styles.notificationDescription, { color: colors.textSecondary }]}>
                    Notificar resultados de tus pikes
                  </Text>
                </View>
                <Switch
                  value={notifications.pikeResults}
                  onValueChange={(value) => updateNotificationSetting('pikeResults', value)}
                  trackColor={{ false: colors.border, true: colors.primary + '40' }}
                  thumbColor={notifications.pikeResults ? colors.primary : colors.textSecondary}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TouchableOpacity 
            style={[styles.saveButton, { backgroundColor: colors.primary }]} 
            onPress={onClose}
          >
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
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
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  themeOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  notificationOptions: {
    gap: 0,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  notificationInfo: {
    flex: 1,
    marginRight: 16,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});