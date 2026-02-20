import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="location/[id]" 
          options={{ 
            presentation: 'card',
            animation: 'slide_from_right' 
          }} 
        />
        <Stack.Screen 
          name="add-location" 
          options={{ 
            presentation: 'modal',
            animation: 'slide_from_bottom' 
          }} 
        />
        <Stack.Screen 
          name="add-review" 
          options={{ 
            presentation: 'modal',
            animation: 'slide_from_bottom' 
          }} 
        />
        <Stack.Screen 
          name="filters" 
          options={{ 
            presentation: 'transparentModal',
            animation: 'slide_from_bottom' 
          }} 
        />
      </Stack>
    </SafeAreaProvider>
  );
}
