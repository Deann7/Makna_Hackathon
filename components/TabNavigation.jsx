import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import ExploreScreen from './screens/ExploreScreen';
import HistoryScreen from './screens/HistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import ChatbotScreen from './screens/ChatbotScreen';

const { width } = Dimensions.get('window');

export default function TabNavigation() {
  const [activeTab, setActiveTab] = useState('Home');
  const insets = useSafeAreaInsets();

  const tabs = [
    { name: 'Home', icon: 'home', iconOutline: 'home-outline', component: HomeScreen, label: 'Beranda' },
    { name: 'Explore', icon: 'compass', iconOutline: 'compass-outline', component: ExploreScreen, label: 'Jelajahi' },
    { name: 'Chatbot', icon: 'chatbubble-ellipses', iconOutline: 'chatbubble-ellipses-outline', component: ChatbotScreen, label: 'Chatbot' },
    { name: 'History', icon: 'time', iconOutline: 'time-outline', component: HistoryScreen, label: 'Riwayat' },
    { name: 'Profile', icon: 'person', iconOutline: 'person-outline', component: ProfileScreen, label: 'Profil' },
  ];

  const renderContent = () => {
    const ActiveComponent = tabs.find(tab => tab.name === activeTab)?.component;
    return ActiveComponent ? <ActiveComponent /> : <HomeScreen />;
  };

  return (
    <View className="flex-1">
      {/* Main Content */}
      <View className="flex-1">
        {renderContent()}
      </View>

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
    </View>
  );
}
