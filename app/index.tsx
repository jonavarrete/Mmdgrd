import { useEffect } from 'react';
import { router } from 'expo-router';

export default function Index() {
  useEffect(() => {
    // Redirect to login screen
    router.replace('/login');
  }, []);

  return null;
}