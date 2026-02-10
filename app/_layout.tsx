import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { View, Text, Platform } from 'react-native';

export default function RootLayout() {
  useFrameworkReady();

  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#000', textAlign: 'center', marginHorizontal: 20 }}>
          This AR app is only available on iOS and Android.
        </Text>
        <Text style={{ fontSize: 14, color: '#666', marginTop: 12, textAlign: 'center', marginHorizontal: 20 }}>
          Please build and run it on a physical device or simulator using Expo Dev Client.
        </Text>
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
