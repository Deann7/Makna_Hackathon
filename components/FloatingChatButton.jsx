import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ChatBotPopup from './ChatBotPopup';

const { width, height } = Dimensions.get('window');

const FloatingChatButton = () => {
  const [showChatBot, setShowChatBot] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [scaleAnim] = useState(new Animated.Value(0));
  const [tooltipOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    // Animation untuk muncul pertama kali
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 3,
      useNativeDriver: true,
    }).start();

    // Show tooltip after initial animation
    const tooltipTimer = setTimeout(() => {
      Animated.timing(tooltipOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      // Hide tooltip after 5 seconds
      setTimeout(() => {
        Animated.timing(tooltipOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          setShowTooltip(false);
        });
      }, 5000);
    }, 1000);

    // Animation pulse berulang
    const pulseAnimation = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Ulangi animation setelah 5 detik
        setTimeout(pulseAnimation, 5000);
      });
    };

    // Mulai pulse animation setelah delay
    const pulseTimeout = setTimeout(pulseAnimation, 3000);

    return () => {
      clearTimeout(tooltipTimer);
      clearTimeout(pulseTimeout);
    };
  }, []);

  const handlePress = () => {
    // Hide tooltip immediately when pressed
    if (showTooltip) {
      Animated.timing(tooltipOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      setShowTooltip(false);
    }

    // Animation saat ditekan
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 200,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    setShowChatBot(true);
  };

  const handleCloseChatBot = () => {
    setShowChatBot(false);
  };

  return (
    <>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [
              { scale: scaleAnim },
              { scale: pulseAnim },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          {/* Gradient Background Effect */}
          <View style={styles.gradientOverlay} />
          
          <View style={styles.iconContainer}>
            <Image 
              source={{ uri: 'https://i.ibb.co/5hZsRx8t/Chat-GPT-Image-Jul-24-2025-10-31-03-PM.png' }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          </View>
          
          {/* Badge notifikasi */}
          <View style={styles.badge}>
            <Animated.View 
              style={[
                styles.badgePulse,
                {
                  transform: [{
                    scale: pulseAnim.interpolate({
                      inputRange: [1, 1.1],
                      outputRange: [1, 1.2],
                    })
                  }]
                }
              ]} 
            />
            <View style={styles.badgeDot} />
          </View>
        </TouchableOpacity>
        
        {/* Tooltip */}
        {showTooltip && (
          <Animated.View 
            style={[
              styles.tooltip,
              { opacity: tooltipOpacity }
            ]}
          >
            <Text style={styles.tooltipText}>💬 Ada yang bisa dibantu?</Text>
            <Text style={styles.tooltipSubText}>Klik untuk chat dengan kami!</Text>
            <View style={styles.tooltipArrow} />
          </Animated.View>
        )}
      </Animated.View>

      {/* ChatBot Popup */}
      <ChatBotPopup
        visible={showChatBot}
        onClose={handleCloseChatBot}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90, // Above tab navigation
    right: 20,
    alignItems: 'center',
    zIndex: 1000,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 30,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    zIndex: 2,
  },
  badgePulse: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FF3B30',
    opacity: 0.6,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    zIndex: 1,
  },
  tooltip: {
    position: 'absolute',
    bottom: 75,
    right: -10,
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 160,
    maxWidth: 200,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  tooltipText: {
    color: 'white',
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    textAlign: 'center',
    marginBottom: 2,
  },
  tooltipSubText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
  },
  tooltipArrow: {
    position: 'absolute',
    bottom: -8,
    right: 25,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#2C2C2E',
  },
});

export default FloatingChatButton; 