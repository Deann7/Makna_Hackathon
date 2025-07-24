import React, { useState, useRef } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Share,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const ChatBotPopup = ({ visible, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const webViewRef = useRef(null);

  // Multiple URL options untuk JotForm chatbot - fallback jika satu tidak bekerja
  const chatbotUrls = [
    'https://form.jotform.com/252044483767463',
    'https://www.jotform.com/form/252044483767463',
    'https://submit.jotform.com/252044483767463',
    'https://www.jotform.com/app/252044483767463'
  ];

  const currentChatbotUrl = chatbotUrls[currentUrlIndex];

  const handleLoadStart = () => {
    setLoading(true);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleNavigationStateChange = (navState) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
  };

  const handleClose = () => {
    Alert.alert(
      'Tutup Chat',
      'Apakah Anda yakin ingin menutup percakapan?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Tutup',
          style: 'destructive',
          onPress: () => {
            setLoading(true);
            setCurrentUrlIndex(0); // Reset ke URL pertama
            onClose();
          },
        },
      ]
    );
  };

  const handleGoBack = () => {
    if (webViewRef.current && canGoBack) {
      webViewRef.current.goBack();
    }
  };

  const handleRefresh = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  const tryNextUrl = () => {
    if (currentUrlIndex < chatbotUrls.length - 1) {
      setCurrentUrlIndex(currentUrlIndex + 1);
      setTimeout(() => {
        if (webViewRef.current) {
          webViewRef.current.reload();
        }
      }, 500);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Chat dengan MAKNA Assistant untuk bantuan lebih lanjut: ' + currentChatbotUrl,
        url: currentChatbotUrl,
        title: 'MAKNA Assistant',
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('WebView Error:', nativeEvent);
    
    Alert.alert(
      'Koneksi Bermasalah',
      `Tidak dapat memuat chatbot. ${currentUrlIndex < chatbotUrls.length - 1 ? 'Mencoba URL alternatif...' : 'Periksa koneksi internet Anda dan coba lagi.'}`,
      [
        ...(currentUrlIndex < chatbotUrls.length - 1 ? [{
          text: 'Coba URL Lain',
          onPress: tryNextUrl,
        }] : []),
        {
          text: 'Coba Lagi',
          onPress: handleRefresh,
        },
        {
          text: 'Tutup',
          style: 'cancel',
          onPress: onClose,
        },
      ]
    );
  };

  const handleHttpError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('HTTP Error:', nativeEvent);
    
    // Jika status code adalah 404 atau 403, coba URL berikutnya
    if ((nativeEvent.statusCode === 404 || nativeEvent.statusCode === 403) && currentUrlIndex < chatbotUrls.length - 1) {
      setTimeout(tryNextUrl, 1000);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.titleContainer}>
              <Text style={styles.headerTitle}>MAKNA Assistant</Text>
              <View style={styles.statusIndicator}>
                <View style={[styles.statusDot, { backgroundColor: loading ? '#FFA500' : '#34C759' }]} />
                <Text style={styles.statusText}>
                  {loading ? 'Connecting...' : 'Online'}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            {canGoBack && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleGoBack}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={20} color="#666" />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleRefresh}
              activeOpacity={0.7}
            >
              <Ionicons name="refresh" size={20} color="#666" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleShare}
              activeOpacity={0.7}
            >
              <Ionicons name="share-outline" size={20} color="#666" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* WebView Container */}
        <View style={styles.webViewContainer}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Memuat MAKNA Assistant...</Text>
              <Text style={styles.loadingSubText}>
                {currentUrlIndex > 0 ? `Mencoba koneksi alternatif (${currentUrlIndex + 1}/${chatbotUrls.length})` : 'Mohon tunggu sebentar'}
              </Text>
            </View>
          )}
          
          <WebView
            ref={webViewRef}
            source={{ 
              uri: currentChatbotUrl,
              headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Cache-Control': 'no-cache',
                'Referer': 'https://www.jotform.com/',
              }
            }}
            style={styles.webView}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            onNavigationStateChange={handleNavigationStateChange}
            onError={handleError}
            onHttpError={handleHttpError}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={false}
            scalesPageToFit={false}
            bounces={false}
            scrollEnabled={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            mixedContentMode="compatibility"
            thirdPartyCookiesEnabled={true}
            cacheEnabled={false}
            incognito={false}
            sharedCookiesEnabled={true}
            allowsBackForwardNavigationGestures={true}
            userAgent="Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36"
            originWhitelist={['*']}
            allowsFullscreenVideo={true}
          />
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            💬 Powered by MAKNA • 🔒 Secure & Private
          </Text>
          {currentUrlIndex > 0 && (
            <Text style={styles.footerSubText}>
              Using alternative connection ({currentUrlIndex + 1}/{chatbotUrls.length})
            </Text>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerLeft: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
    marginBottom: 2,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webViewContainer: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    color: '#333',
  },
  loadingSubText: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    textAlign: 'center',
  },
  footerSubText: {
    fontSize: 10,
    fontFamily: 'Poppins_400Regular',
    color: '#999',
    textAlign: 'center',
    marginTop: 2,
  },
});

export default ChatBotPopup; 