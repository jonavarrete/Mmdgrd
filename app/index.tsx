import { useEffect } from 'react';
import { router } from 'expo-router';
import { useUser } from '@/contexts/UserContext';

export default function Index() {
  const { user } = useUser();

  useEffect(() => {
    // Redirect based on user authentication status
    if (user) {
      router.replace('/(tabs)');
    } else {
      router.replace('/login');
    }
  }, [user]);

  return null;
}