import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthContext } from '../../contexts/AuthContext';
import BatikPattern from '../BatikPattern';

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signIn, signUp, registerUser } = useAuthContext();

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (isSignUp) {
      if (!username || !phoneNumber || !fullName) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      if (username.length < 3) {
        Alert.alert('Error', 'Username must be at least 3 characters long');
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }

      if (password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters long');
        return;
      }
    }

    setLoading(true);
    
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, username, phoneNumber, fullName);
        if (error) {
          Alert.alert('Error', error.message);
        } else {
          Alert.alert('Success', 'Please check your email to verify your account');
          setIsSignUp(false);
          // Reset form
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setUsername('');
          setPhoneNumber('');
          setFullName('');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          Alert.alert('Error', error.message);
        }
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-batik-50"
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 relative min-h-screen">
          <BatikPattern />
          
          {/* Header */}
          <View className="bg-batik-700 px-4 py-8 rounded-b-3xl relative overflow-hidden">
            <BatikPattern className="opacity-10" />
            <View className="items-center relative z-10">
              <View className="bg-batik-600 w-16 h-16 rounded-full justify-center items-center mb-4">
                <Ionicons name="library" size={32} color="#F5EFE7" />
              </View>
              <Text className="text-batik-100 text-2xl font-bold">MAKNA</Text>
              <Text className="text-batik-200 text-sm">Jelajahi Cerita Budaya Indonesia</Text>
            </View>
          </View>

          {/* Form */}
          <View className="flex-1 px-6 py-8 relative z-10">
            <View className="bg-white rounded-2xl p-6 border border-batik-200 shadow-lg">
              <Text className="text-batik-800 text-xl font-bold text-center mb-6">
                {isSignUp ? 'Buat Akun Baru' : 'Selamat Datang Kembali'}
              </Text>

              {/* Full Name Input (Sign Up only) */}
              {isSignUp && (
                <View className="mb-4">
                  <Text className="text-batik-700 text-sm font-medium mb-2">Nama Lengkap *</Text>
                  <View className="bg-batik-50 rounded-xl px-4 py-3 border border-batik-200">
                    <TextInput
                      className="text-batik-800"
                      placeholder="Masukkan nama lengkap"
                      placeholderTextColor="#A0522D"
                      value={fullName}
                      onChangeText={setFullName}
                      autoCapitalize="words"
                    />
                  </View>
                </View>
              )}

              {/* Username Input (Sign Up only) */}
              {isSignUp && (
                <View className="mb-4">
                  <Text className="text-batik-700 text-sm font-medium mb-2">Username *</Text>
                  <View className="bg-batik-50 rounded-xl px-4 py-3 border border-batik-200">
                    <TextInput
                      className="text-batik-800"
                      placeholder="Minimal 3 karakter"
                      placeholderTextColor="#A0522D"
                      value={username}
                      onChangeText={setUsername}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </View>
              )}

              {/* Phone Number Input (Sign Up only) */}
              {isSignUp && (
                <View className="mb-4">
                  <Text className="text-batik-700 text-sm font-medium mb-2">Nomor Telepon *</Text>
                  <View className="bg-batik-50 rounded-xl px-4 py-3 border border-batik-200">
                    <TextInput
                      className="text-batik-800"
                      placeholder="08xxxxxxxxxx"
                      placeholderTextColor="#A0522D"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>
              )}

              {/* Email Input */}
              <View className="mb-4">
                <Text className="text-batik-700 text-sm font-medium mb-2">Email *</Text>
                <View className="bg-batik-50 rounded-xl px-4 py-3 border border-batik-200">
                  <TextInput
                    className="text-batik-800"
                    placeholder="Masukkan email"
                    placeholderTextColor="#A0522D"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View className="mb-4">
                <Text className="text-batik-700 text-sm font-medium mb-2">Password *</Text>
                <View className="bg-batik-50 rounded-xl px-4 py-3 border border-batik-200 flex-row items-center">
                  <TextInput
                    className="text-batik-800 flex-1"
                    placeholder={isSignUp ? "Minimal 6 karakter" : "Masukkan password"}
                    placeholderTextColor="#A0522D"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons 
                      name={showPassword ? 'eye-off' : 'eye'} 
                      size={20} 
                      color="#A0522D" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password (Sign Up only) */}
              {isSignUp && (
                <View className="mb-6">
                  <Text className="text-batik-700 text-sm font-medium mb-2">Konfirmasi Password *</Text>
                  <View className="bg-batik-50 rounded-xl px-4 py-3 border border-batik-200">
                    <TextInput
                      className="text-batik-800"
                      placeholder="Masukkan ulang password"
                      placeholderTextColor="#A0522D"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showPassword}
                    />
                  </View>
                </View>
              )}

              {/* Auth Button */}
              <TouchableOpacity
                onPress={handleAuth}
                disabled={loading}
                className={`bg-batik-700 rounded-xl py-4 mb-4 shadow-lg ${loading ? 'opacity-50' : ''}`}
              >
                <Text className="text-batik-100 text-center font-bold text-lg">
                  {loading ? 'Mohon tunggu...' : isSignUp ? 'Daftar Sekarang' : 'Masuk'}
                </Text>
              </TouchableOpacity>

              {/* Toggle Mode */}
              <TouchableOpacity
                onPress={() => {
                  setIsSignUp(!isSignUp);
                  // Reset form when switching
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                  setUsername('');
                  setPhoneNumber('');
                  setFullName('');
                }}
                className="items-center"
              >
                <Text className="text-batik-600">
                  {isSignUp ? 'Sudah punya akun? ' : "Belum punya akun? "}
                  <Text className="text-batik-700 font-bold">
                    {isSignUp ? 'Masuk di sini' : 'Daftar di sini'}
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>

            {/* Terms and Privacy (Sign Up only) */}
            {isSignUp && (
              <View className="mt-4 px-4">
                <Text className="text-batik-600 text-xs text-center">
                  Dengan mendaftar, Anda menyetujui{' '}
                  <Text className="text-batik-700 font-medium">Syarat & Ketentuan</Text>
                  {' '}dan{' '}
                  <Text className="text-batik-700 font-medium">Kebijakan Privasi</Text>
                  {' '}kami
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
