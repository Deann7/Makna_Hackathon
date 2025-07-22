import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HistoryScreen() {
  const [activeFilter, setActiveFilter] = useState('Semua');
  
  const filters = ['Semua', 'Selesai', 'Berlangsung', 'Favorit'];
  
  const questHistory = [
    {
      id: 1,
      title: 'Candi Borobudur',
      location: 'Magelang, Jawa Tengah',
      status: 'Selesai',
      completedAt: '2 jam yang lalu',
      category: 'Candi',
      rating: 5,
      badge: '🏛️ Penjelajah Candi',
      progress: 100,
      duration: '45 menit'
    },
    {
      id: 2,
      title: 'Candi Prambanan',
      location: 'Yogyakarta',
      status: 'Berlangsung',
      completedAt: '5 jam yang lalu',
      category: 'Candi',
      rating: null,
      badge: null,
      progress: 60,
      duration: '50 menit'
    },
    {
      id: 3,
      title: 'Desa Penglipuran',
      location: 'Bangli, Bali',
      status: 'Selesai',
      completedAt: '1 hari yang lalu',
      category: 'Desa Budaya',
      rating: 5,
      badge: '🏡 Penjelajah Desa',
      progress: 100,
      duration: '40 menit'
    },
    {
      id: 4,
      title: 'Museum Nasional',
      location: 'Jakarta Pusat',
      status: 'Selesai',
      completedAt: '2 hari yang lalu',
      category: 'Museum',
      rating: 4,
      badge: '🏛️ Pecinta Sejarah',
      progress: 100,
      duration: '60 menit'
    },
    {
      id: 5,
      title: 'Keraton Yogyakarta',
      location: 'Yogyakarta',
      status: 'Favorit',
      completedAt: '3 hari yang lalu',
      category: 'Keraton',
      rating: 5,
      badge: '👑 Raja Budaya',
      progress: 100,
      duration: '55 menit'
    },
    {
      id: 6,
      title: 'Desa Wae Rebo',
      location: 'Manggarai, Flores',
      status: 'Selesai',
      completedAt: '1 minggu yang lalu',
      category: 'Desa Budaya',
      rating: 5,
      badge: '⛰️ Penjelajah Pegunungan',
      progress: 100,
      duration: '50 menit'
    },
  ];

  const filteredHistory = questHistory.filter(quest => {
    if (activeFilter === 'Semua') return true;
    if (activeFilter === 'Favorit') return quest.status === 'Favorit' || quest.rating === 5;
    return quest.status === activeFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Selesai': return 'bg-green-500';
      case 'Berlangsung': return 'bg-blue-500';
      case 'Favorit': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Selesai': return 'checkmark-circle';
      case 'Berlangsung': return 'play-circle';
      case 'Favorit': return 'star';
      default: return 'time';
    }
  };

  const completedQuests = questHistory.filter(quest => quest.status === 'Selesai').length;
  const totalBadges = questHistory.filter(quest => quest.badge).length;
  const totalHours = Math.floor(questHistory.reduce((acc, quest) => {
    if (quest.status === 'Selesai') {
      return acc + parseInt(quest.duration);
    }
    return acc;
  }, 0) / 60);

  return (
    <View className="flex-1 bg-batik-50">
      {/* Header */}
      <View className="bg-batik-700 px-4 py-6 rounded-b-3xl">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-batik-100 text-2xl font-bold">Riwayat Quest</Text>
          <TouchableOpacity className="bg-batik-600 px-3 py-2 rounded-lg">
            <Text className="text-batik-100 text-sm font-medium">Filter</Text>
          </TouchableOpacity>
        </View>
        
        {/* Stats */}
        <View className="flex-row justify-around">
          <View className="items-center">
            <Text className="text-batik-100 text-2xl font-bold">{completedQuests}</Text>
            <Text className="text-batik-200 text-sm">Quest Selesai</Text>
          </View>
          <View className="items-center">
            <Text className="text-batik-100 text-2xl font-bold">{totalBadges}</Text>
            <Text className="text-batik-200 text-sm">Badge Didapat</Text>
          </View>
          <View className="items-center">
            <Text className="text-batik-100 text-2xl font-bold">{totalHours}h</Text>
            <Text className="text-batik-200 text-sm">Waktu Belajar</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        {/* Filter Tabs */}
        <View className="mb-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full mr-3 ${
                  activeFilter === filter 
                    ? 'bg-batik-600' 
                    : 'bg-white border border-batik-300'
                }`}
              >
                <Text className={`font-medium ${
                  activeFilter === filter 
                    ? 'text-batik-100' 
                    : 'text-batik-700'
                }`}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Achievement Highlight */}
        <View className="mb-6">
          <Text className="text-batik-800 text-lg font-bold mb-3">Pencapaian Terbaru</Text>
          <View className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="bg-white w-12 h-12 rounded-full justify-center items-center">
                  <Text className="text-2xl">🏛️</Text>
                </View>
                <View className="ml-3">
                  <Text className="text-yellow-900 font-bold">Penjelajah Candi</Text>
                  <Text className="text-yellow-800 text-sm">Selesaikan quest di Borobudur</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Ionicons name="chevron-forward" size={20} color="#EAB308" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Quest History List */}
        <View>
          <Text className="text-batik-800 text-lg font-bold mb-3">
            {activeFilter === 'Semua' ? 'Semua Quest' : `Quest ${activeFilter}`} ({filteredHistory.length})
          </Text>
          
          {filteredHistory.length === 0 ? (
            <View className="bg-white rounded-xl p-8 items-center border border-batik-200">
              <Ionicons name="time-outline" size={48} color="#A0522D" />
              <Text className="text-batik-700 text-lg font-medium mt-4">Tidak ada riwayat</Text>
              <Text className="text-batik-600 text-sm text-center mt-2">
                Quest {activeFilter.toLowerCase()} Anda akan muncul di sini
              </Text>
            </View>
          ) : (
            filteredHistory.map((quest, index) => (
              <TouchableOpacity 
                key={quest.id}
                className="bg-white rounded-xl p-4 mb-3 border border-batik-200"
              >
                <View className="flex-row items-start">
                  <View className={`w-12 h-12 rounded-full justify-center items-center ${getStatusColor(quest.status)}`}>
                    <Ionicons name={getStatusIcon(quest.status)} size={20} color="white" />
                  </View>
                  <View className="ml-4 flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="text-batik-800 font-bold text-lg">{quest.title}</Text>
                      {quest.badge && (
                        <View className="bg-yellow-100 px-2 py-1 rounded-full">
                          <Text className="text-yellow-700 text-xs font-bold">+BADGE</Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-batik-600 text-sm mb-1">{quest.location}</Text>
                    <Text className="text-batik-500 text-xs mb-2">{quest.category}</Text>
                    
                    {quest.status === 'Berlangsung' && (
                      <View className="mb-2">
                        <View className="flex-row items-center justify-between mb-1">
                          <Text className="text-batik-600 text-xs">Progress</Text>
                          <Text className="text-batik-600 text-xs">{quest.progress}%</Text>
                        </View>
                        <View className="bg-batik-100 h-2 rounded-full overflow-hidden">
                          <View 
                            className="bg-blue-500 h-full rounded-full"
                            style={{ width: `${quest.progress}%` }}
                          />
                        </View>
                      </View>
                    )}
                    
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Text className="text-batik-500 text-xs">{quest.completedAt}</Text>
                        {quest.rating && (
                          <>
                            <Text className="text-batik-400 text-xs mx-2">•</Text>
                            <View className="flex-row items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Ionicons
                                  key={star}
                                  name="star"
                                  size={12}
                                  color={star <= quest.rating ? "#FCD34D" : "#E5E7EB"}
                                />
                              ))}
                            </View>
                          </>
                        )}
                      </View>
                      <TouchableOpacity className="p-1">
                        <Ionicons name="ellipsis-vertical" size={16} color="#A0522D" />
                      </TouchableOpacity>
                    </View>
                    
                    {quest.badge && (
                      <View className="mt-2 bg-batik-50 px-2 py-1 rounded-lg">
                        <Text className="text-batik-700 text-xs font-medium">{quest.badge}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
