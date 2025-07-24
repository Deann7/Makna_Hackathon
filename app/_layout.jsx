import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import ErrorBoundary from '../components/ErrorBoundary';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View, StyleSheet, Modal, Pressable, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import "../global.css"

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

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
        {/* Floating Chatbot Button & Modal */}
        <ChatbotPopup />
      </AuthProvider>
    </ErrorBoundary>
  );

// Komponen ChatbotPopup harus di luar RootLayout agar tidak error sintaks
function ChatbotPopup() {
  const [visible, setVisible] = useState(false);
  const chatbotUrl = 'https://www.jotform.com/app/252044483767463';

  return (
    <>
      <Pressable
        style={styles.fab}
        onPress={() => setVisible(true)}
        accessibilityLabel="Open Chatbot"
      >
        <View style={styles.fabCircle}>
          <View style={styles.fabDot} />
        </View>
      </Pressable>
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Pressable style={styles.closeButton} onPress={() => setVisible(false)}>
              <View style={styles.closeBar} />
            </Pressable>
            {Platform.OS === 'web' ? (
              <iframe
                src={chatbotUrl}
                title="Chatbot AI"
                style={{ width: '100%', height: '100%', border: 'none', borderRadius: 12 }}
                allow="clipboard-write; microphone"
              />
            ) : (
              <WebView
                source={{ uri: chatbotUrl }}
                style={{ flex: 1, borderRadius: 12 }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
              />
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}
}


const styles = StyleSheet.create({
  fab: {
    position: 'fixed',
    right: 24,
    bottom: 24,
    zIndex: 10000,
    elevation: 10,
  },
  fabCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2D6A4F',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#2D6A4F',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10001,
  },
  modalContent: {
    width: 400,
    maxWidth: '90vw',
    height: 600,
    maxHeight: '90vh',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
  },
  closeButton: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  closeBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
    marginBottom: 4,
  },
});
