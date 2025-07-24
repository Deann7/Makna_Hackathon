import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AuthStatus from '../AuthStatus';
import BatikPattern from '../BatikPattern';
import { useAuth } from '../../hooks/useAuth';
import { TripService } from '../../lib/tripService';

export default function HomeScreen({ onTripStart }) {
  const [activeTrips, setActiveTrips] = useState([]);
  const [availableSitus, setAvailableSitus] = useState([]);
  const [recentBadges, setRecentBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadHomeData();
    }
  }, [user]);

  const loadHomeData = async () => {
    try {
      const [tripsResult, situsResult, badgesResult] = await Promise.all([
        TripService.getActiveTrips(user.id),
        TripService.getAvailableSitus(),
        TripService.getUserBadges(user.id)
      ]);

      if (tripsResult.success) {
        setActiveTrips(tripsResult.data);
      }
      
      if (situsResult.success) {
        setAvailableSitus(situsResult.data.slice(0, 3)); // Show top 3
      }
      
      if (badgesResult.success) {
        setRecentBadges(badgesResult.data.slice(0, 1)); // Show latest badge
      }
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadHomeData();
  };

  const handleContinueTrip = (trip) => {
    onTripStart({
      tripId: trip.uid,
      situsInfo: trip.situs,
      totalBuildings: trip.total_buildings
    });
  };

  const getProgressPercentage = (trip) => {
    return trip.total_buildings > 0 ? (trip.visited_buildings / trip.total_buildings) * 100 : 0;
  };

  return (
    <ScrollView 
      className="flex-1 bg-batik-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
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
            {availableSitus.map((situs, index) => (
              <TouchableOpacity 
                key={situs.uid}
                className="bg-batik-600 w-40 h-28 rounded-xl justify-center items-center mr-4 relative overflow-hidden"
              >
                <View className="absolute inset-0 bg-black opacity-10" />
                <Ionicons name="diamond" size={32} color="#F5EFE7" />
                <Text className="text-batik-100 font-bold mt-2 text-center">{situs.nama_situs}</Text>
                <Text className="text-batik-200 text-xs">{situs.lokasi_daerah}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Active Trips */}
        {activeTrips.length > 0 && (
          <View className="mb-6">
            <Text className="text-batik-800 text-lg font-bold mb-4">Perjalanan Berlangsung</Text>
            {activeTrips.map((trip) => {
              const progressPercentage = getProgressPercentage(trip);
              return (
                <View key={trip.uid} className="bg-white rounded-xl p-4 border border-batik-200 mb-3">
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center flex-1">
                      <View className="bg-green-500 w-12 h-12 rounded-full justify-center items-center">
                        <Ionicons name="play-circle" size={24} color="white" />
                      </View>
                      <View className="ml-3 flex-1">
                        <Text className="text-batik-800 font-bold">{trip.situs.nama_situs}</Text>
                        <Text className="text-batik-600 text-sm">{trip.situs.lokasi_daerah}</Text>
                        <Text className="text-batik-500 text-xs">
                          {trip.visited_buildings}/{trip.total_buildings} bangunan
                        </Text>
                      </View>
                    </View>
                    <Text className="text-green-600 font-bold">{Math.round(progressPercentage)}%</Text>
                  </View>
                  <View className="bg-batik-100 h-2 rounded-full overflow-hidden mb-3">
                    <View 
                      className="bg-green-500 h-full rounded-full" 
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </View>
                  <TouchableOpacity 
                    onPress={() => handleContinueTrip(trip)}
                    className="bg-batik-600 py-2 rounded-lg"
                  >
                    <Text className="text-white font-medium text-center">Lanjutkan Perjalanan →</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}

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
        {recentBadges.length > 0 && (
          <View className="mb-6">
            <Text className="text-batik-800 text-lg font-bold mb-3">Pencapaian Terbaru</Text>
            {recentBadges.map((profileBadge) => (
              <TouchableOpacity 
                key={profileBadge.uid}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-4"
              >
                <View className="flex-row items-center">
                  <View className="bg-white w-12 h-12 rounded-full justify-center items-center">
                    <Ionicons name="trophy" size={24} color="#EAB308" />
                  </View>
                  <View className="ml-4 flex-1">
                    <Text className="text-yellow-900 font-bold">🏛️ {profileBadge.badges.badge_title}</Text>
                    <Text className="text-yellow-800 text-sm">{profileBadge.badges.badge_info}</Text>
                    <Text className="text-yellow-700 text-xs">
                      {profileBadge.badges.situs.nama_situs} • {new Date(profileBadge.earned_at).toLocaleDateString('id-ID')}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#EAB308" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* QR Scanner CTA */}
        {activeTrips.length === 0 && (
          <View className="mt-6">
            <Text className="text-batik-800 text-lg font-bold mb-4">Mulai Perjalanan</Text>
            <View className="bg-white rounded-xl p-6 border border-batik-200 items-center">
              <Ionicons name="qr-code-outline" size={48} color="#6F4E37" />
              <Text className="text-batik-700 font-bold text-lg mt-3 text-center">
                Scan QR Code untuk Memulai
              </Text>
              <Text className="text-batik-600 text-sm text-center mt-2 mb-4">
                Temukan QR code di situs bersejarah dan mulai perjalanan Anda
              </Text>
              <View className="bg-batik-600 px-6 py-2 rounded-full">
                <Text className="text-white font-bold">Ketuk tombol QR di kanan bawah</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
