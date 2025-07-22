import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import ErrorBoundary from '../components/ErrorBoundary';
import "../global.css"

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Stack>
          <Stack.Screen 
            name="index" 
            options={{
              title: 'Home',
              headerShown: false
            }} 
          />
        </Stack>
      </AuthProvider>
    </ErrorBoundary>
  );
}
