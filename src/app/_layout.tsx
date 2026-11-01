import '../../global.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';

import { queryClient } from '@/lib/query-client';
import { toastConfig } from '@/lib/toast';

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast config={toastConfig} topOffset={64} />
    </QueryClientProvider>
  );
}
