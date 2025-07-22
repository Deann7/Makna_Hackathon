import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthContext } from '../../contexts/AuthContext';
import AuthStatus from '../AuthStatus';
import EditProfileModal from '../EditProfileModal';

export default function ProfileScreen() {
  const { user, profile, signOut } = useAuthContext();
  const [showEditModal, setShowEditModal] = useState(false);

  const handleSignOut = async () => {
    Alert.alert(
      'Konfirmasi Logout',
      'Apakah Anda yakin ingin keluar?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            const { error } = await signOut();
            if (error) {
              Alert.alert('Error', 'Gagal logout');
            }
          },
        },
      ]
    );
  };

  const profileOptions = [
    { id: 1, title: 'Quest Favorit', icon: 'heart', color: 'bg-red-500' },
    { id: 2, title: 'Koleksi Badge', icon: 'trophy', color: 'bg-yellow-500' },
    { id: 3, title: 'Sertifikat Digital', icon: 'certificate', color: 'bg-blue-500' },
    { id: 4, title: 'Riwayat Perjalanan', icon: 'map', color: 'bg-green-500' },
    { id: 5, title: 'Berbagi Cerita', icon: 'share-social', color: 'bg-purple-500' },
    { id: 6, title: 'Pengaturan', icon: 'settings', color: 'bg-gray-500' },
  ];

  const stats = [
    { label: 'Quest Selesai', value: '12', icon: 'checkmark-circle' },
    { label: 'Destinasi Dikunjungi', value: '8', icon: 'location' },
    { label: 'Badge Dikumpulkan', value: '15', icon: 'trophy' },
    { label: 'Jam Belajar', value: '24', icon: 'time' },
  ];

  const achievements = [
    {
      id: 1,
      title: 'Penjelajah Candi',
      description: 'Selesaikan 3 quest di candi bersejarah',
      icon: '🏛️',
      earned: true,
      progress: 3,
      total: 3
    },
    {
      id: 2,
      title: 'Pecinta Desa',
      description: 'Kunjungi 2 desa budaya tradisional',
      icon: '🏡',
      earned: true,
      progress: 2,
      total: 2
    },
    {
      id: 3,
      title: 'Raja Budaya',
      description: 'Eksplorasi 1 keraton atau istana',
      icon: '👑',
      earned: true,
      progress: 1,
      total: 1
    },
    {
      id: 4,
      title: 'Master Sejarah',
      description: 'Selesaikan 10 quest berbeda',
      icon: '📚',
      earned: false,
      progress: 8,
      total: 10
    },
    {
      id: 5,
      title: 'Penjelajah Nusantara',
      description: 'Kunjungi destinasi dari 5 provinsi',
      icon: '🗺️',
      earned: false,
      progress: 3,
      total: 5
    }
  ];

  return (
    <ScrollView className="flex-1 bg-batik-50">
      {/* Auth Status */}
      <AuthStatus />
      
      {/* Header */}
      <View className="bg-batik-700 px-4 py-6 rounded-b-3xl">
        <View className="items-center">
          {/* Avatar */}
          <View className="bg-batik-500 w-20 h-20 rounded-full justify-center items-center mb-4">
            <Ionicons name="person" size={40} color="white" />
          </View>
          
          {/* User Info */}
          <Text className="text-batik-100 text-xl font-bold">
            {profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Penjelajah MAKNA'}
          </Text>
          <Text className="text-batik-200 text-sm mb-2">
            {(profile?.username || user?.user_metadata?.username) && `@${profile?.username || user.user_metadata.username}`}
          </Text>
          <Text className="text-batik-200 text-sm mb-4">
            {user?.email || 'Masuk untuk menyimpan progress'}
          </Text>
          
          {/* Edit Profile Button */}
          {user && (
            <TouchableOpacity 
              onPress={() => setShowEditModal(true)}
              className="bg-batik-600 px-4 py-2 rounded-lg mb-4 flex-row items-center"
            >
              <Ionicons name="create-outline" size={16} color="#F5EFE7" />
              <Text className="text-batik-100 ml-2 font-medium">Edit Profile</Text>
            </TouchableOpacity>
          )}
          
          {/* Level Badge */}
          <View className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 py-2 rounded-full">
            <Text className="text-yellow-900 text-sm font-bold">🏆 Penjelajah Level 3</Text>
          </View>
        </View>
      </View>

      <View className="px-4 py-6">
        {/* Stats Grid */}
        <View className="mb-6">
          <Text className="text-batik-800 text-lg font-bold mb-4">Perjalanan Anda</Text>
          <View className="flex-row flex-wrap justify-between">
            {stats.map((stat, index) => (
              <View key={index} className="bg-white rounded-xl p-4 w-[48%] mb-3 border border-batik-200">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-batik-800 text-2xl font-bold">{stat.value}</Text>
                    <Text className="text-batik-600 text-xs">{stat.label}</Text>
                  </View>
                  <View className="bg-batik-100 p-2 rounded-lg">
                    <Ionicons name={stat.icon} size={20} color="#6F4E37" />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Latest Achievement */}
        <View className="mb-6">
          <Text className="text-batik-800 text-lg font-bold mb-3">Pencapaian Terbaru</Text>
          <TouchableOpacity className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-4">
            <View className="flex-row items-center">
              <View className="bg-white w-12 h-12 rounded-full justify-center items-center">
                <Text className="text-2xl">🏛️</Text>
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-yellow-900 font-bold">Penjelajah Candi</Text>
                <Text className="text-yellow-800 text-sm">Selesaikan 3 quest di candi bersejarah</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#EAB308" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Achievement Progress */}
        <View className="mb-6">
          <Text className="text-batik-800 text-lg font-bold mb-3">Progress Pencapaian</Text>
          <View className="bg-white rounded-xl border border-batik-200 overflow-hidden">
            {achievements.map((achievement, index) => (
              <View 
                key={achievement.id}
                className={`p-4 ${index !== achievements.length - 1 ? 'border-b border-batik-100' : ''}`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <Text className="text-2xl mr-3">{achievement.icon}</Text>
                    <View className="flex-1">
                      <Text className={`font-bold ${achievement.earned ? 'text-batik-800' : 'text-batik-600'}`}>
                        {achievement.title}
                      </Text>
                      <Text className="text-batik-500 text-sm mb-2">{achievement.description}</Text>
                      
                      {!achievement.earned && (
                        <View>
                          <View className="flex-row items-center justify-between mb-1">
                            <Text className="text-batik-600 text-xs">
                              {achievement.progress}/{achievement.total}
                            </Text>
                            <Text className="text-batik-600 text-xs">
                              {Math.round((achievement.progress / achievement.total) * 100)}%
                            </Text>
                          </View>
                          <View className="bg-batik-100 h-2 rounded-full overflow-hidden">
                            <View 
                              className="bg-batik-500 h-full rounded-full"
                              style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                            />
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                  {achievement.earned && (
                    <View className="bg-green-100 w-8 h-8 rounded-full justify-center items-center">
                      <Ionicons name="checkmark" size={16} color="#10B981" />
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Menu Options */}
        <View className="mb-6">
          <Text className="text-batik-800 text-lg font-bold mb-3">Menu</Text>
          <View className="bg-white rounded-xl border border-batik-200 overflow-hidden">
            {profileOptions.map((option, index) => (
              <TouchableOpacity 
                key={option.id}
                className={`p-4 flex-row items-center ${
                  index !== profileOptions.length - 1 ? 'border-b border-batik-100' : ''
                }`}
              >
                <View className={`w-10 h-10 rounded-lg justify-center items-center ${option.color}`}>
                  <Ionicons name={option.icon} size={20} color="white" />
                </View>
                <Text className="text-batik-800 font-medium ml-4 flex-1">{option.title}</Text>
                <Ionicons name="chevron-forward" size={20} color="#A0522D" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Account Actions */}
        <View className="mb-6">
          <Text className="text-batik-800 text-lg font-bold mb-3">Akun</Text>
          <View className="bg-white rounded-xl border border-batik-200 overflow-hidden">
            <TouchableOpacity className="p-4 flex-row items-center border-b border-batik-100">
              <View className="bg-blue-500 w-10 h-10 rounded-lg justify-center items-center">
                <Ionicons name="help-circle" size={20} color="white" />
              </View>
              <Text className="text-batik-800 font-medium ml-4 flex-1">Bantuan & Dukungan</Text>
              <Ionicons name="chevron-forward" size={20} color="#A0522D" />
            </TouchableOpacity>
            
            <TouchableOpacity className="p-4 flex-row items-center border-b border-batik-100">
              <View className="bg-purple-500 w-10 h-10 rounded-lg justify-center items-center">
                <Ionicons name="information-circle" size={20} color="white" />
              </View>
              <Text className="text-batik-800 font-medium ml-4 flex-1">Tentang MAKNA</Text>
              <Ionicons name="chevron-forward" size={20} color="#A0522D" />
            </TouchableOpacity>

            <TouchableOpacity className="p-4 flex-row items-center border-b border-batik-100">
              <View className="bg-green-500 w-10 h-10 rounded-lg justify-center items-center">
                <Ionicons name="star" size={20} color="white" />
              </View>
              <Text className="text-batik-800 font-medium ml-4 flex-1">Beri Rating Aplikasi</Text>
              <Ionicons name="chevron-forward" size={20} color="#A0522D" />
            </TouchableOpacity>

            {user && (
              <TouchableOpacity 
                onPress={handleSignOut}
                className="p-4 flex-row items-center"
              >
                <View className="bg-red-500 w-10 h-10 rounded-lg justify-center items-center">
                  <Ionicons name="log-out" size={20} color="white" />
                </View>
                <Text className="text-red-600 font-medium ml-4 flex-1">Keluar</Text>
                <Ionicons name="chevron-forward" size={20} color="#EF4444" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* App Version */}
        <View className="items-center mt-4">
          <Text className="text-batik-500 text-sm">MAKNA v1.0.0</Text>
          <Text className="text-batik-400 text-xs">Dibuat dengan ❤️ untuk Budaya Indonesia</Text>
        </View>
      </View>

      {/* Edit Profile Modal */}
      <EditProfileModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={() => {
          // Profile akan auto-update karena subscription di useAuth
          console.log('Profile updated successfully');
        }}
      />
    </ScrollView>
  );
}
