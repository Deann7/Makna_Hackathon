import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Dimensions, Modal, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import ExploreScreen from './screens/ExploreScreen';
import HistoryScreen from './screens/HistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import QRScannerScreen from './screens/QRScannerScreen';
import TripProgressScreen from './screens/TripProgressScreen';
import TestQRData from './TestQRData';
import TestAuthFlow from './TestAuthFlow';

const { width } = Dimensions.get('window');

export default function TabNavigation() {
  const [activeTab, setActiveTab] = useState('Home');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showTestQR, setShowTestQR] = useState(false);
  const [showTestAuth, setShowTestAuth] = useState(false);
  const [activeTripData, setActiveTripData] = useState(null);
  const [showTripProgress, setShowTripProgress] = useState(false);
  const insets = useSafeAreaInsets();

  const tabs = [
    { name: 'Home', icon: 'home', iconOutline: 'home-outline', component: HomeScreen, label: 'Beranda' },
    { name: 'Explore', icon: 'compass', iconOutline: 'compass-outline', component: ExploreScreen, label: 'Jelajahi' },
    { name: 'History', icon: 'time', iconOutline: 'time-outline', component: HistoryScreen, label: 'Riwayat' },
    { name: 'Profile', icon: 'person', iconOutline: 'person-outline', component: ProfileScreen, label: 'Profil' },
  ];

  const handleTripStart = (tripData) => {
    setActiveTripData(tripData);
    setShowTripProgress(true);
  };

  const handleTripComplete = (badgeData) => {
    setShowTripProgress(false);
    setActiveTripData(null);
    // Could show badge earned screen here
    setActiveTab('Home'); // Return to home to see updated data
  };

  const renderContent = () => {
    const ActiveComponent = tabs.find(tab => tab.name === activeTab)?.component;
    if (ActiveComponent) {
      const props = { onTripStart: handleTripStart };
      if (activeTab === 'Profile') {
        props.onShowTestAuth = () => setShowTestAuth(true);
      }
      return <ActiveComponent {...props} />;
    }
    return <HomeScreen onTripStart={handleTripStart} />;
  };

  return (
    <View className="flex-1">
      {/* Main Content */}
      <View className="flex-1">
        {renderContent()}
      </View>

      {/* Floating QR Scanner Button */}
      <TouchableOpacity
        onPress={() => {
          Alert.alert(
            'Scan QR Code',
            'Pilih metode untuk memulai perjalanan',
            [
              { text: 'Batal', style: 'cancel' },
              { text: 'Test QR', onPress: () => setShowTestQR(true) },
              { text: 'Scan Kamera', onPress: () => setShowQRScanner(true) }
            ]
          );
        }}
        className="absolute bottom-20 right-6 bg-batik-600 w-14 h-14 rounded-full justify-center items-center shadow-lg"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Ionicons name="qr-code" size={28} color="#F5EFE7" />
      </TouchableOpacity>

      {/* Bottom Tab Bar */}
      <View 
        className="bg-white border-t border-batik-200 px-2"
        style={{ 
          paddingBottom: Math.max(insets.bottom, 10),
          paddingTop: 10
        }}
      >
        {/* Batik-inspired decorative line */}
        <View className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-batik-600 via-batik-500 to-batik-400" />
        
        <View className="flex-row justify-around items-center">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.name;
            const tabWidth = width / tabs.length;
            
            return (
              <TouchableOpacity
                key={tab.name}
                onPress={() => setActiveTab(tab.name)}
                className="items-center py-2 px-1"
                style={{ width: tabWidth }}
                activeOpacity={0.7}
              >
                {/* Tab Background with Batik Pattern Effect */}
                {isActive && (
                  <View className="absolute top-0 bg-batik-50 rounded-xl w-full h-full border border-batik-200" />
                )}
                
                {/* Icon Container */}
                <View className={`items-center justify-center w-8 h-8 rounded-lg ${
                  isActive ? 'bg-batik-600' : 'bg-transparent'
                }`}>
                  <Ionicons
                    name={isActive ? tab.icon : tab.iconOutline}
                    size={isActive ? 22 : 20}
                    color={isActive ? '#F5EFE7' : '#6F4E37'}
                  />
                </View>

                {/* Label */}
                <Text className={`text-xs font-medium mt-1 ${
                  isActive ? 'text-batik-700' : 'text-batik-500'
                }`}>
                  {tab.label}
                </Text>

                {/* Active Indicator Dot */}
                {isActive && (
                  <View className="w-1 h-1 bg-batik-600 rounded-full mt-1" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* QR Scanner Modal */}
      <Modal
        visible={showQRScanner}
        animationType="slide"
        onRequestClose={() => setShowQRScanner(false)}
      >
        <QRScannerScreen
          onTripStart={handleTripStart}
          onClose={() => setShowQRScanner(false)}
        />
      </Modal>

      {/* Trip Progress Modal */}
      <Modal
        visible={showTripProgress}
        animationType="slide"
        onRequestClose={() => setShowTripProgress(false)}
      >
        {activeTripData && (
          <TripProgressScreen
            tripData={activeTripData}
            onTripComplete={handleTripComplete}
            onClose={() => setShowTripProgress(false)}
          />
        )}
      </Modal>

      {/* Test QR Modal */}
      <Modal
        visible={showTestQR}
        animationType="slide"
        onRequestClose={() => setShowTestQR(false)}
      >
        <TestQRData
          onTripStart={handleTripStart}
          onClose={() => setShowTestQR(false)}
        />
      </Modal>

      {/* Test Auth Modal */}
      <Modal
        visible={showTestAuth}
        animationType="slide"
        onRequestClose={() => setShowTestAuth(false)}
      >
        <TestAuthFlow
          onClose={() => setShowTestAuth(false)}
        />
      </Modal>
    </View>
  );
}
