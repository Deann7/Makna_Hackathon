import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AuthStatus from '../AuthStatus';
import BatikPattern from '../BatikPattern';

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-batik-50">
      {/* Header with batik pattern background */}
      <View className="bg-batik-700 px-4 py-6 rounded-b-3xl relative overflow-hidden">
        <BatikPattern />
        <View className="flex-row items-center justify-between mb-4 relative z-10">
          <View>
            <Text className="text-batik-100 text-2xl font-bold">MAKNA</Text>
            <Text className="text-batik-200 text-sm">Jelajahi Cerita Budaya Indonesia</Text>
          </View>
          <TouchableOpacity className="bg-batik-600 p-2 rounded-full">
            <Ionicons name="notifications-outline" size={24} color="#F5EFE7" />
          </TouchableOpacity>
        </View>
        
        {/* Search Bar */}
        <TouchableOpacity className="bg-batik-100 flex-row items-center px-4 py-3 rounded-xl relative z-10">
          <Ionicons name="search" size={20} color="#6F4E37" />
          <Text className="text-batik-700 ml-3 flex-1">Cari destinasi wisata budaya...</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="px-4 py-6">
        {/* Featured Destinations */}
        <View className="mb-6">
          <Text className="text-batik-800 text-lg font-bold mb-4">Destinasi Unggulan</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-4">
            {[
              { name: 'Borobudur', icon: 'diamond' },
              { name: 'Prambanan', icon: 'library' },
              { name: 'Desa Penglipuran', icon: 'home' }
            ].map((destination, index) => (
              <TouchableOpacity 
                key={index}
                className="bg-batik-600 w-40 h-28 rounded-xl justify-center items-center mr-4 relative overflow-hidden"
              >
                <View className="absolute inset-0 bg-black opacity-10" />
                <Ionicons name={destination.icon} size={32} color="#F5EFE7" />
                <Text className="text-batik-100 font-bold mt-2 text-center">{destination.name}</Text>
                <Text className="text-batik-200 text-xs">Mulai Quest →</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quest Progress */}
        <View className="mb-6">
          <Text className="text-batik-800 text-lg font-bold mb-4">Quest Berlangsung</Text>
          <View className="bg-white rounded-xl p-4 border border-batik-200">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <View className="bg-green-500 w-12 h-12 rounded-full justify-center items-center">
                  <Ionicons name="play-circle" size={24} color="white" />
                </View>
                <View className="ml-3">
                  <Text className="text-batik-800 font-bold">Candi Borobudur</Text>
                  <Text className="text-batik-600 text-sm">Sejarah Kemegahan Buddha</Text>
                </View>
              </View>
              <Text className="text-green-600 font-bold">60%</Text>
            </View>
            <View className="bg-batik-100 h-2 rounded-full overflow-hidden">
              <View className="bg-green-500 h-full rounded-full" style={{ width: '60%' }} />
            </View>
            <TouchableOpacity className="mt-3">
              <Text className="text-batik-600 font-medium text-center">Lanjutkan Quest →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-batik-800 text-lg font-bold mb-4">Aksi Cepat</Text>
          <View className="flex-row justify-between">
            {[
              { icon: 'map', label: 'Jelajahi' },
              { icon: 'time', label: 'Riwayat' },
              { icon: 'trophy', label: 'Prestasi' },
              { icon: 'bookmark', label: 'Tersimpan' }
            ].map((action, index) => (
              <TouchableOpacity 
                key={index}
                className="bg-white p-4 rounded-xl items-center flex-1 mx-1 border border-batik-200"
              >
                <Ionicons name={action.icon} size={24} color="#6F4E37" />
                <Text className="text-batik-700 text-xs mt-2 text-center">{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Achievement Badge */}
        <View className="mb-6">
          <Text className="text-batik-800 text-lg font-bold mb-3">Pencapaian Terbaru</Text>
          <TouchableOpacity className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-4">
            <View className="flex-row items-center">
              <View className="bg-white w-12 h-12 rounded-full justify-center items-center">
                <Ionicons name="trophy" size={24} color="#EAB308" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-yellow-900 font-bold">🏛️ Penjelajah Candi</Text>
                <Text className="text-yellow-800 text-sm">Selesaikan quest pertama di Borobudur</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#EAB308" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View className="mt-6">
          <Text className="text-batik-800 text-lg font-bold mb-4">Aktivitas Terkini</Text>
          <View className="bg-white rounded-xl p-4 border border-batik-200">
            <View className="flex-row items-center mb-3">
              <View className="bg-green-500 w-10 h-10 rounded-full justify-center items-center">
                <Ionicons name="checkmark-circle" size={20} color="white" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-batik-800 font-medium">Menyelesaikan: Cerita Borobudur</Text>
                <Text className="text-batik-600 text-sm">2 jam yang lalu</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <View className="bg-blue-500 w-10 h-10 rounded-full justify-center items-center">
                <Ionicons name="play" size={20} color="white" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-batik-800 font-medium">Memulai: Quest Prambanan</Text>
                <Text className="text-batik-600 text-sm">1 hari yang lalu</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
