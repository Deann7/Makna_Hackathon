import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, Modal, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TripService } from '../../lib/tripService';
import { useAuth } from '../../hooks/useAuth';

export default function SitusQRDetailScreen({ qrCodeData, onClose, onStartTrip }) {
  const [situsData, setSitusData] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startingTrip, setStartingTrip] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchSitusData();
  }, [qrCodeData]);

  const fetchSitusData = async () => {
    try {
      setLoading(true);
      
      // Validate QR code and get situs data
      const validation = await TripService.validateQRCode(qrCodeData);
      if (!validation.success) {
        Alert.alert('Error', 'QR Code tidak valid atau situs tidak ditemukan');
        onClose();
        return;
      }

      setSitusData(validation.data);

      // Get buildings for this situs
      const buildingsResult = await TripService.getSitusBuildings(validation.data.uid);
      if (buildingsResult.success) {
        setBuildings(buildingsResult.data);
      }
    } catch (error) {
      console.error('Error fetching situs data:', error);
      Alert.alert('Error', 'Gagal memuat data situs');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTrip = async () => {
    // Create a mock user for testing if no real user is available
    const userId = user?.id || 'mock-user-id-for-testing';
    
    if (!userId) {
      Alert.alert('Error', 'Anda harus login terlebih dahulu');
      return;
    }

    Alert.alert(
      'Mulai Perjalanan',
      `Apakah Anda ingin memulai perjalanan di ${situsData.nama_situs}?\n\nEstimasi waktu: ${situsData.estimated_duration_minutes || 60} menit\nJumlah bangunan: ${buildings.length}`,
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Mulai', 
          onPress: async () => {
            setStartingTrip(true);
            try {
              const result = await TripService.startTrip(userId, qrCodeData);
              
              if (result.success) {
                const { trip_uid, situs_info, total_buildings } = result.data;
                
                Alert.alert(
                  'Perjalanan Dimulai!',
                  `Selamat datang di ${situs_info.nama_situs}!\n\nAnda akan mengunjungi ${total_buildings} bangunan bersejarah.`,
                  [
                    {
                      text: 'Mulai Jelajahi',
                      onPress: () => {
                        onStartTrip({
                          tripId: trip_uid,
                          situsInfo: situs_info,
                          totalBuildings: total_buildings
                        });
                        onClose();
                      }
                    }
                  ]
                );
              } else {
                Alert.alert(
                  'Gagal Memulai Perjalanan',
                  result.error.includes('already has an active trip') 
                    ? 'Anda sudah memiliki perjalanan aktif untuk situs ini.' 
                    : result.error
                );
              }
            } catch (error) {
              Alert.alert('Error', 'Terjadi kesalahan saat memulai perjalanan');
            } finally {
              setStartingTrip(false);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <Modal visible={true} animationType="slide" presentationStyle="fullScreen">
        <SafeAreaView className="flex-1 bg-batik-50">
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#6F4E37" />
            <Text className="text-batik-700 mt-4">Memuat data situs...</Text>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  if (!situsData) {
    return (
      <Modal visible={true} animationType="slide" presentationStyle="fullScreen">
        <SafeAreaView className="flex-1 bg-batik-50">
          <View className="flex-1 justify-center items-center">
            <Ionicons name="alert-circle" size={64} color="#DC2626" />
            <Text className="text-red-600 text-lg font-bold mt-4">Situs tidak ditemukan</Text>
            <TouchableOpacity 
              onPress={onClose}
              className="bg-batik-700 px-6 py-3 rounded-xl mt-4"
            >
              <Text className="text-white font-medium">Tutup</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  return (
    <Modal visible={true} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-batik-700 px-4 py-4" style={{ paddingTop: 48 }}>
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={onClose}
            className="bg-batik-600 p-2 rounded-full"
          >
            <Ionicons name="close" size={24} color="#F5EFE7" />
          </TouchableOpacity>
          
          <Text className="text-batik-100 text-lg font-bold">Detail Situs</Text>
          
          <View className="w-10" />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="bg-batik-700 px-4 pb-8">
          <View className="bg-white rounded-2xl p-6 mt-4">
            <Text className="text-batik-800 text-2xl font-bold mb-2">
              {situsData.nama_situs}
            </Text>
            <View className="flex-row items-center mb-4">
              <Ionicons name="location" size={20} color="#6F4E37" />
              <Text className="text-batik-600 ml-2 flex-1">
                {situsData.lokasi_daerah}
              </Text>
            </View>
            
            {situsData.tahun_dibangun && (
              <View className="flex-row items-center mb-4">
                <Ionicons name="calendar" size={20} color="#6F4E37" />
                <Text className="text-batik-600 ml-2">
                  Dibangun tahun {situsData.tahun_dibangun}
                </Text>
              </View>
            )}

            <View className="flex-row items-center">
              <Ionicons name="time" size={20} color="#6F4E37" />
              <Text className="text-batik-600 ml-2">
                Estimasi kunjungan: {situsData.estimated_duration_minutes || 60} menit
              </Text>
            </View>
          </View>
        </View>

        {/* Information Section */}
        <View className="px-4 py-6">
          <Text className="text-batik-800 text-lg font-bold mb-4">Informasi Situs</Text>
          <View className="bg-white rounded-2xl p-4 border border-batik-200 mb-6">
            <Text className="text-batik-700 leading-6">
              {situsData.informasi_situs || 'Informasi detail tentang situs ini sedang dalam proses penambahan.'}
            </Text>
          </View>

          {/* Buildings Section */}
          {buildings.length > 0 && (
            <>
              <Text className="text-batik-800 text-lg font-bold mb-4">
                Bangunan yang Akan Dikunjungi ({buildings.length})
              </Text>
              {buildings.map((building, index) => (
                <View 
                  key={building.uid}
                  className="bg-white rounded-xl p-4 mb-3 border border-batik-200"
                >
                  <View className="flex-row items-start">
                    <View className="bg-batik-500 rounded-full w-8 h-8 justify-center items-center mr-3 mt-1">
                      <Text className="text-white font-bold text-sm">
                        {building.urutan_kunjungan || index + 1}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-batik-800 font-bold text-base mb-1">
                        {building.nama_bangunan}
                      </Text>
                      {building.jenis_bangunan && (
                        <Text className="text-batik-600 text-sm mb-2">
                          {building.jenis_bangunan}
                        </Text>
                      )}
                      {building.deskripsi && (
                        <Text className="text-batik-700 text-sm leading-5">
                          {building.deskripsi}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </>
          )}

          {/* QR Code Info */}
          <View className="bg-blue-50 rounded-xl p-4 mb-6">
            <View className="flex-row items-center mb-2">
              <Ionicons name="qr-code" size={20} color="#1E40AF" />
              <Text className="text-blue-800 font-bold ml-2">QR Code Info</Text>
            </View>
            <Text className="text-blue-700 text-sm">
              Kode QR: {qrCodeData}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Start Trip Button */}
      <View className="px-4 py-4 bg-white border-t border-gray-200">
        <TouchableOpacity
          onPress={handleStartTrip}
          disabled={startingTrip}
          className={`bg-batik-700 rounded-xl py-4 ${startingTrip ? 'opacity-50' : ''}`}
        >
          <Text className="text-white text-center font-bold text-lg">
            {startingTrip ? 'Memulai Perjalanan...' : 'Mulai Perjalanan'}
          </Text>
        </TouchableOpacity>
      </View>
      </SafeAreaView>
    </Modal>
  );
}
