import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QuestDetailScreen from './QuestDetailScreen';

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [showQuestModal, setShowQuestModal] = useState(false);

  const categories = ['Semua', 'Candi', 'Desa Budaya', 'Museum', 'Keraton'];
  
  const culturalDestinations = [
    {
      id: 1,
      title: 'Candi Borobudur',
      location: 'Magelang, Jawa Tengah',
      category: 'Candi',
      difficulty: 'Pemula',
      duration: '45 menit',
      description: 'Jelajahi sejarah kemegahan candi Buddha terbesar di dunia dan temukan makna filosofis setiap reliefnya.',
      questContent: {
        video: 'https://example.com/borobudur-video',
        story: 'Candi Borobudur dibangun pada abad ke-8 oleh Dinasti Syailendra. Candi ini merupakan representasi dari konsep alam semesta dalam kosmologi Buddha...',
        highlights: [
          'Sejarah pembangunan yang memakan waktu 75 tahun',
          'Makna filosofis 2.672 panel relief',
          'Fungsi sebagai tempat ibadah dan meditasi',
          'Proses restorasi modern yang menakjubkan'
        ]
      },
      completed: false,
      rating: 4.9
    },
    {
      id: 2,
      title: 'Candi Prambanan',
      location: 'Yogyakarta',
      category: 'Candi',
      difficulty: 'Menengah',
      duration: '50 menit',
      description: 'Masuki dunia epik Ramayana melalui relief-relief indah candi Hindu terbesar di Indonesia.',
      questContent: {
        video: 'https://example.com/prambanan-video',
        story: 'Candi Prambanan atau Loro Jonggrang adalah kompleks candi Hindu terbesar di Indonesia yang dibangun pada abad ke-9...',
        highlights: [
          'Arsitektur Hindu klasik yang megah',
          'Cerita Ramayana dalam relief batu',
          'Legenda Loro Jonggrang',
          'Simbolisme Trimurti: Brahma, Wisnu, Siwa'
        ]
      },
      completed: true,
      rating: 4.8
    },
    {
      id: 3,
      title: 'Desa Penglipuran',
      location: 'Bangli, Bali',
      category: 'Desa Budaya',
      difficulty: 'Pemula',
      duration: '40 menit',
      description: 'Rasakan kehidupan tradisional Bali di desa yang mempertahankan adat istiadat leluhur.',
      questContent: {
        video: 'https://example.com/penglipuran-video',
        story: 'Desa Penglipuran dikenal sebagai salah satu desa terindah di dunia berkat kelestarian budaya dan lingkungannya...',
        highlights: [
          'Arsitektur rumah tradisional Bali',
          'Sistem sosial dan budaya yang unik',
          'Kelestarian lingkungan berbasis kearifan lokal',
          'Upacara adat yang masih dijaga'
        ]
      },
      completed: false,
      rating: 4.7
    },
    {
      id: 4,
      title: 'Museum Nasional',
      location: 'Jakarta Pusat',
      category: 'Museum',
      difficulty: 'Menengah',
      duration: '60 menit',
      description: 'Telusuri ribuan tahun sejarah Nusantara melalui koleksi artefak yang tak ternilai.',
      questContent: {
        video: 'https://example.com/museum-nasional-video',
        story: 'Museum Nasional Indonesia, atau yang dikenal sebagai Museum Gajah, menyimpan kekayaan budaya dari seluruh Nusantara...',
        highlights: [
          'Koleksi etnografi terlengkap di Asia Tenggara',
          'Artefak prasejarah Nusantara',
          'Keragaman budaya dari 34 provinsi',
          'Arca dan prasasti bersejarah'
        ]
      },
      completed: false,
      rating: 4.6
    },
    {
      id: 5,
      title: 'Keraton Yogyakarta',
      location: 'Yogyakarta',
      category: 'Keraton',
      difficulty: 'Lanjutan',
      duration: '55 menit',
      description: 'Masuki istana yang masih berfungsi dan pelajari filosofi Jawa dalam arsitektur dan tata ruangnya.',
      questContent: {
        video: 'https://example.com/keraton-video',
        story: 'Keraton Ngayogyakarta Hadiningrat adalah istana resmi Kesultanan Yogyakarta yang dibangun oleh Sultan Hamengku Buwono I...',
        highlights: [
          'Filosofi Jawa dalam arsitektur istana',
          'Sistem pemerintahan tradisional yang masih berjalan',
          'Koleksi pusaka dan benda bersejarah',
          'Seni dan budaya keraton'
        ]
      },
      completed: false,
      rating: 4.8
    },
    {
      id: 6,
      title: 'Desa Wae Rebo',
      location: 'Manggarai, Flores',
      category: 'Desa Budaya',
      difficulty: 'Lanjutan',
      duration: '50 menit',
      description: 'Jelajahi desa di atas awan dengan rumah adat Mbaru Niang yang unik dan filosofi hidup yang harmonis.',
      questContent: {
        video: 'https://example.com/wae-rebo-video',
        story: 'Desa Wae Rebo terletak di ketinggian 1.200 meter di atas permukaan laut dengan rumah adat berbentuk kerucut...',
        highlights: [
          'Arsitektur rumah adat Mbaru Niang',
          'Sistem sosial dan gotong royong',
          'Harmonisasi dengan alam',
          'Ritual dan upacara adat Manggarai'
        ]
      },
      completed: false,
      rating: 4.9
    }
  ];

  const filteredDestinations = culturalDestinations.filter(destination => 
    (activeCategory === 'Semua' || destination.category === activeCategory) &&
    destination.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Pemula': return 'bg-green-100 text-green-700';
      case 'Menengah': return 'bg-yellow-100 text-yellow-700';
      case 'Lanjutan': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleStartQuest = (destination) => {
    setSelectedQuest(destination);
    setShowQuestModal(true);
  };

  return (
    <View className="flex-1 bg-batik-50">
      {/* Header */}
      <View className="bg-batik-700 px-4 py-6 rounded-b-3xl">
        <Text className="text-batik-100 text-2xl font-bold mb-4">Jelajahi Budaya</Text>
        
        {/* Search Input */}
        <View className="bg-batik-100 flex-row items-center px-4 py-3 rounded-xl">
          <Ionicons name="search" size={20} color="#6F4E37" />
          <TextInput
            className="text-batik-700 ml-3 flex-1"
            placeholder="Cari destinasi budaya..."
            placeholderTextColor="#A0522D"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        {/* Category Filter */}
        <View className="mb-6">
          <Text className="text-batik-800 text-lg font-bold mb-3">Kategori</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full mr-3 ${
                  activeCategory === category 
                    ? 'bg-batik-600' 
                    : 'bg-white border border-batik-300'
                }`}
              >
                <Text className={`font-medium ${
                  activeCategory === category 
                    ? 'text-batik-100' 
                    : 'text-batik-700'
                }`}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Quest */}
        <View className="mb-6">
          <Text className="text-batik-800 text-lg font-bold mb-3">Quest Unggulan</Text>
          <TouchableOpacity 
            className="bg-white rounded-xl p-4 border-2 border-batik-300"
            onPress={() => handleStartQuest(culturalDestinations[0])}
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="bg-yellow-100 px-2 py-1 rounded-full">
                <Text className="text-yellow-700 text-xs font-bold">⭐ FEATURED</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="star" size={16} color="#FCD34D" />
                <Text className="text-batik-600 text-sm ml-1">4.9</Text>
              </View>
            </View>
            <Text className="text-batik-800 text-xl font-bold mb-1">Candi Borobudur</Text>
            <Text className="text-batik-600 text-sm mb-3">Magelang, Jawa Tengah</Text>
            <Text className="text-batik-700 text-sm mb-4">
              Jelajahi sejarah kemegahan candi Buddha terbesar di dunia dan temukan makna filosofis setiap reliefnya.
            </Text>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center space-x-4">
                <View className="flex-row items-center">
                  <Ionicons name="time" size={16} color="#A0522D" />
                  <Text className="text-batik-600 text-xs ml-1">45 menit</Text>
                </View>
                <View className="bg-green-100 px-2 py-1 rounded-full">
                  <Text className="text-green-700 text-xs font-medium">Pemula</Text>
                </View>
              </View>
              <View className="bg-batik-600 px-4 py-2 rounded-lg">
                <Text className="text-batik-100 font-medium text-sm">Mulai Quest</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quest List */}
        <View>
          <Text className="text-batik-800 text-lg font-bold mb-3">
            Semua Quest ({filteredDestinations.length})
          </Text>
          
          {filteredDestinations.map((destination) => (
            <TouchableOpacity 
              key={destination.id}
              className="bg-white rounded-xl p-4 mb-3 border border-batik-200"
              onPress={() => handleStartQuest(destination)}
            >
              <View className="flex-row items-start justify-between mb-2">
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Text className="text-batik-800 font-bold text-lg flex-1">{destination.title}</Text>
                    {destination.completed && (
                      <View className="bg-green-100 w-6 h-6 rounded-full justify-center items-center ml-2">
                        <Ionicons name="checkmark" size={14} color="#10B981" />
                      </View>
                    )}
                  </View>
                  <Text className="text-batik-600 text-sm mb-2">{destination.location}</Text>
                  <Text className="text-batik-700 text-sm mb-3" numberOfLines={2}>
                    {destination.description}
                  </Text>
                </View>
              </View>
              
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center space-x-3">
                  <View className="flex-row items-center">
                    <Ionicons name="time" size={14} color="#A0522D" />
                    <Text className="text-batik-600 text-xs ml-1">{destination.duration}</Text>
                  </View>
                  <View className={`px-2 py-1 rounded-full ${getDifficultyColor(destination.difficulty)}`}>
                    <Text className="text-xs font-medium">{destination.difficulty}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="star" size={14} color="#FCD34D" />
                    <Text className="text-batik-600 text-xs ml-1">{destination.rating}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#A0522D" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Quest Detail Modal */}
      <Modal
        visible={showQuestModal}
        animationType="slide"
        onRequestClose={() => setShowQuestModal(false)}
      >
        <View className="flex-1">
          {selectedQuest && (
            <QuestDetailScreen 
              quest={selectedQuest}
              onClose={() => setShowQuestModal(false)}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}
