import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';

export default function TestAuthFlow({ onClose }) {
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('password123');
  const [testFirstname, setTestFirstname] = useState('Test');
  const [testLastname, setTestLastname] = useState('User');
  const [loading, setLoading] = useState(false);
  
  const { user, profile, signIn, signUp, signOut } = useAuth();

  const handleTestSignUp = async () => {
    setLoading(true);
    try {
      const result = await signUp(testEmail, testPassword, testFirstname, testLastname);
      
      if (result.error) {
        Alert.alert('Sign Up Error', `Error: ${result.error.message}\n\nFull Error: ${JSON.stringify(result.error, null, 2)}`);
      } else {
        Alert.alert('Success', 'Account created successfully!\n\nYou can now sign in immediately (no email verification needed).');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTestSignIn = async () => {
    setLoading(true);
    try {
      const result = await signIn(testEmail, testPassword);
      
      if (result.error) {
        Alert.alert('Sign In Error', JSON.stringify(result.error, null, 2));
      } else {
        Alert.alert('Success', 'Signed in successfully!');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTestSignOut = async () => {
    setLoading(true);
    try {
      const result = await signOut();
      
      if (result.error) {
        Alert.alert('Sign Out Error', JSON.stringify(result.error, null, 2));
      } else {
        Alert.alert('Success', 'Signed out successfully!');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-batik-50">
      {/* Header */}
      <View className="bg-batik-700 px-4 py-12 pb-6">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={onClose} className="bg-batik-600 p-2 rounded-full">
            <Ionicons name="close" size={24} color="#F5EFE7" />
          </TouchableOpacity>
          <Text className="text-batik-100 text-lg font-bold">Test Auth Flow</Text>
          <View className="w-10" />
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        {/* Current User Status */}
        <View className="bg-white rounded-xl p-4 mb-6 border border-batik-200">
          <Text className="text-batik-800 font-bold text-lg mb-3">Current Status</Text>
          
          <View className="mb-3">
            <Text className="text-batik-600 text-sm">Auth User:</Text>
            <Text className="text-batik-800 text-xs font-mono">
              {user ? JSON.stringify({ id: user.id, email: user.email }, null, 2) : 'Not authenticated'}
            </Text>
          </View>
          
          <View className="mb-3">
            <Text className="text-batik-600 text-sm">Profile Data:</Text>
            <Text className="text-batik-800 text-xs font-mono">
              {profile ? JSON.stringify(profile, null, 2) : 'No profile data'}
            </Text>
          </View>
        </View>

        {/* Test Form */}
        <View className="bg-white rounded-xl p-4 mb-6 border border-batik-200">
          <Text className="text-batik-800 font-bold text-lg mb-4">Test Credentials</Text>
          
          <View className="space-y-3">
            <View>
              <Text className="text-batik-600 text-sm mb-1">Email</Text>
              <TextInput
                value={testEmail}
                onChangeText={setTestEmail}
                className="border border-batik-200 rounded-lg px-3 py-2"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View>
              <Text className="text-batik-600 text-sm mb-1">Password</Text>
              <TextInput
                value={testPassword}
                onChangeText={setTestPassword}
                className="border border-batik-200 rounded-lg px-3 py-2"
                secureTextEntry
              />
            </View>
            
            <View>
              <Text className="text-batik-600 text-sm mb-1">First Name</Text>
              <TextInput
                value={testFirstname}
                onChangeText={setTestFirstname}
                className="border border-batik-200 rounded-lg px-3 py-2"
              />
            </View>
            
            <View>
              <Text className="text-batik-600 text-sm mb-1">Last Name</Text>
              <TextInput
                value={testLastname}
                onChangeText={setTestLastname}
                className="border border-batik-200 rounded-lg px-3 py-2"
              />
            </View>
          </View>
        </View>

        {/* Test Actions */}
        <View className="bg-white rounded-xl p-4 mb-6 border border-batik-200">
          <Text className="text-batik-800 font-bold text-lg mb-4">Test Actions</Text>
          
          <View className="space-y-3">
            <TouchableOpacity
              onPress={handleTestSignUp}
              disabled={loading}
              className="bg-green-500 py-3 rounded-lg"
            >
              <Text className="text-white font-bold text-center">
                {loading ? 'Testing...' : 'Test Sign Up'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleTestSignIn}
              disabled={loading}
              className="bg-blue-500 py-3 rounded-lg"
            >
              <Text className="text-white font-bold text-center">
                {loading ? 'Testing...' : 'Test Sign In'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleTestSignOut}
              disabled={loading}
              className="bg-red-500 py-3 rounded-lg"
            >
              <Text className="text-white font-bold text-center">
                {loading ? 'Testing...' : 'Test Sign Out'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setTestEmail(`test${Date.now()}@example.com`);
                Alert.alert('Email Updated', 'Generated new unique test email');
              }}
              className="bg-purple-500 py-3 rounded-lg"
            >
              <Text className="text-white font-bold text-center">Generate New Email</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Database Schema Info */}
        <View className="bg-blue-100 rounded-xl p-4">
          <View className="flex-row items-center mb-2">
            <Ionicons name="information-circle" size={20} color="#1E40AF" />
            <Text className="text-blue-800 font-bold ml-2">Database Schema</Text>
          </View>
          <Text className="text-blue-700 text-sm">
            Expected profiles table structure:{'\n'}
            • id (uuid, FK to auth.users){'\n'}
            • email (text, unique, required){'\n'}
            • firstname (text, required){'\n'}
            • lastname (text, required){'\n'}
            • password (text, required){'\n'}
            • username (text, unique, optional){'\n'}
            • avatar_url (text, optional){'\n'}
            • phone_number (text, optional){'\n'}
            • created_at, updated_at (timestamps)
          </Text>
        </View>
      </ScrollView>
    </View>
  );
} 