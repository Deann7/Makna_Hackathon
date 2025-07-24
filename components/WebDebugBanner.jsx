import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { isWeb } from './WebCompatibility';
import { useAuth } from '../hooks/useAuth';

export default function WebDebugBanner() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { user, profile } = useAuth();

  // Only show on web and in development
  if (!isWeb || !__DEV__) {
    return null;
  }

  return (
    <View className="bg-purple-600 border-b border-purple-500">
      <TouchableOpacity
        onPress={() => setIsCollapsed(!isCollapsed)}
        className="px-4 py-2 flex-row items-center justify-between"
      >
        <View className="flex-row items-center">
          <Ionicons name="code" size={16} color="white" />
          <Text className="text-white font-bold text-sm ml-2">Web Development Mode</Text>
        </View>
        <Ionicons 
          name={isCollapsed ? "chevron-down" : "chevron-up"} 
          size={16} 
          color="white" 
        />
      </TouchableOpacity>
      
      {!isCollapsed && (
        <View className="px-4 pb-3">
          <View className="bg-purple-700 rounded-lg p-3">
            <Text className="text-purple-100 text-xs font-bold mb-2">Debug Info:</Text>
            
            <View className="flex-row justify-between mb-1">
              <Text className="text-purple-200 text-xs">Platform:</Text>
              <Text className="text-white text-xs">Web Browser</Text>
            </View>
            
            <View className="flex-row justify-between mb-1">
              <Text className="text-purple-200 text-xs">Auth Status:</Text>
              <Text className="text-white text-xs">{user ? 'Authenticated' : 'Not Authenticated'}</Text>
            </View>
            
            <View className="flex-row justify-between mb-1">
              <Text className="text-purple-200 text-xs">Profile:</Text>
              <Text className="text-white text-xs">{profile ? `${profile.firstname} ${profile.lastname}` : 'No Profile'}</Text>
            </View>
            
            <View className="flex-row justify-between mb-2">
              <Text className="text-purple-200 text-xs">User ID:</Text>
              <Text className="text-white text-xs font-mono">{user?.id?.slice(0, 8) || 'None'}...</Text>
            </View>
            
            <Text className="text-purple-200 text-xs">
              💡 Tip: Use Test Auth Flow in Profile tab for easy testing
            </Text>
          </View>
        </View>
      )}
    </View>
  );
} 