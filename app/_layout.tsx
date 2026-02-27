import { Stack } from 'expo-router';
import { BankProvider } from '../context/BankContext';

export default function RootLayout() {
  return (
    <BankProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#072146' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerTitleAlign: 'center',
          headerBackTitle: 'Volver', 
          headerBackTitleStyle: { 
            fontSize: 10, 
            fontFamily: 'System' 
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ title: 'NovaBank' }} />
        <Stack.Screen name="sucursales" options={{ title: 'Sucursales Cercanas' }} />
      </Stack>
    </BankProvider>
  );
}