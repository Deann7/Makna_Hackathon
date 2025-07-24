import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

export default function ChatbotScreen() {
  // Untuk Expo: gunakan require untuk file lokal
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'https://NAMA-VERCEL-ANDA.vercel.app/' }}
        originWhitelist={["*"]}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
