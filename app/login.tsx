import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Eye, EyeOff, User, Lock } from 'lucide-react-native';
import { useUser } from '@/contexts/UserContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function Login() {
  const { setUser } = useUser();
  const { colors } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Por favor ingresa usuario y contraseña');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('https://midgard.ct.ws/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      // Primero obtener el texto para ver qué viene
      const responseText = await response.text();
      console.log('Raw response:', responseText);
    
      // Si empieza con <html>, es la página de protección
      if (responseText.startsWith('<html>')) {
        //throw new Error('Server returned protection page instead of JSON');
      }
    
      // Si es JSON, parsearlo
      const data = JSON.parse(responseText);
      console.log('Parsed data:', data);

      if (response.ok && data.status) {
        // Set user data
        setUser({
          id: '1',
          username: username,
          balance: 34885
        });
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', data.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Full error:', error);
      //console.log('Response text was:', responseText); // Esto te mostrará el HTML completo
      Alert.alert('Error', 'Error de conexión. Inténtalo de nuevo.');
      // Para desarrollo, permitir login sin conexión
      setUser({
        id: '1',
        username: username || 'Jekyll',
        balance: 34885
      });
      setIsLoading(false);
      router.replace('/(tabs)');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.primary }]}>
      <View style={styles.content}>
        {/* Logo and Title */}
        <View style={styles.header}>
          <Text style={styles.logo}>MIDGARD</Text>
          <Text style={styles.subtitle}>Bienvenido de vuelta</Text>
          <Text style={styles.description}>
            Ingresa a tu cuenta para continuar con las apuestas
          </Text>
        </View>

        {/* Login Form */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <User size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Usuario"
                placeholderTextColor="#9CA3AF"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoComplete="username"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Lock size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Contraseña"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="password"
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ¿Olvidaste tu contraseña? Contacta al administrador
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#C7D2FE',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  eyeIcon: {
    marginLeft: 12,
  },
  loginButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#C7D2FE',
    textAlign: 'center',
    lineHeight: 20,
  },
});