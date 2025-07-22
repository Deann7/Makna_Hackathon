import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BatikPattern from '../BatikPattern';

export default function QuestDetailScreen({ quest, onClose }) {
  const [questCompleted, setQuestCompleted] = useState(quest.completed);
  const [currentStep, setCurrentStep] = useState(0);

  const questSteps = [
    {
      title: 'Selamat Datang',
      type: 'intro',
      content: quest.description
    },
    {
      title: 'Video Edukatif',
      type: 'video',
      content: 'Tonton video edukatif tentang ' + quest.title
    },
    {
      title: 'Cerita & Sejarah',
      type: 'story',
      content: quest.questContent.story
    },
    {
      title: 'Poin Menarik',
      type: 'highlights',
      content: quest.questContent.highlights
    }
  ];

  const handleCompleteQuest = () => {
    Alert.alert(
      '🎉 Selamat!',
      `Anda telah menyelesaikan pengalaman wisata di ${quest.title} bersama MAKNA.\n\nAnda mendapatkan:\n• Badge: ${quest.title} Explorer\n• Poin pengalaman: +50\n• Sertifikat digital`,
      [
        {
          text: 'Lihat Pencapaian',
          onPress: () => {
            setQuestCompleted(true);
            onClose();
          }
        },
        {
          text: 'Lanjutkan',
          onPress: () => {
            setQuestCompleted(true);
            onClose();
          },
          style: 'default'
        }
      ]
    );
  };

  const handleNextStep = () => {
    if (currentStep < questSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCompleteQuest();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    const step = questSteps[currentStep];
    
    switch (step.type) {
      case 'intro':
        return (
          <View className="bg-white rounded-xl p-6 mb-6">
            <View className="items-center mb-4">
              <View className="bg-batik-600 w-20 h-20 rounded-full justify-center items-center mb-4">
                <Ionicons name="diamond" size={40} color="#F5EFE7" />
              </View>
              <Text className="text-batik-800 text-2xl font-bold text-center mb-2">{quest.title}</Text>
              <Text className="text-batik-600 text-center">{quest.location}</Text>
            </View>
            <Text className="text-batik-700 text-lg leading-relaxed text-center">
              {step.content}
            </Text>
          </View>
        );

      case 'video':
        return (
          <View className="bg-white rounded-xl p-6 mb-6">
            <Text className="text-batik-800 text-xl font-bold mb-4 text-center">Video Edukatif</Text>
            <View className="bg-batik-300 h-48 rounded-xl justify-center items-center mb-4">
              <Ionicons name="play-circle" size={64} color="#6F4E37" />
              <Text className="text-batik-700 mt-2 text-center">Video: Sejarah {quest.title}</Text>
            </View>
            <Text className="text-batik-600 text-center">
              {step.content}
            </Text>
            <Text className="text-batik-500 text-sm text-center mt-2">
              Durasi: {quest.duration}
            </Text>
          </View>
        );

      case 'story':
        return (
          <View className="bg-white rounded-xl p-6 mb-6">
            <Text className="text-batik-800 text-xl font-bold mb-4">Cerita & Sejarah</Text>
            <Text className="text-batik-700 leading-relaxed text-justify">
              {step.content}
            </Text>
          </View>
        );

      case 'highlights':
        return (
          <View className="bg-white rounded-xl p-6 mb-6">
            <Text className="text-batik-800 text-xl font-bold mb-4">Poin Menarik</Text>
            {step.content.map((highlight, index) => (
              <View key={index} className="flex-row items-start mb-3">
                <View className="bg-batik-500 w-6 h-6 rounded-full justify-center items-center mr-3 mt-1">
                  <Text className="text-white text-xs font-bold">{index + 1}</Text>
                </View>
                <Text className="text-batik-700 flex-1 leading-relaxed">{highlight}</Text>
              </View>
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-batik-50">
      {/* Header */}
      <View className="bg-batik-700 px-4 py-6 rounded-b-3xl relative overflow-hidden">
        <BatikPattern className="opacity-10" />
        <View className="flex-row items-center justify-between relative z-10">
          <TouchableOpacity onPress={onClose} className="bg-batik-600 w-10 h-10 rounded-full justify-center items-center">
            <Ionicons name="chevron-back" size={24} color="#F5EFE7" />
          </TouchableOpacity>
          <Text className="text-batik-100 text-lg font-bold">Quest MAKNA</Text>
          <View className="w-10" />
        </View>
        
        {/* Progress Indicator */}
        <View className="mt-4 relative z-10">
          <Text className="text-batik-200 text-sm mb-2">
            Langkah {currentStep + 1} dari {questSteps.length}
          </Text>
          <View className="bg-batik-600 h-2 rounded-full overflow-hidden">
            <View 
              className="bg-batik-100 h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / questSteps.length) * 100}%` }}
            />
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        {/* Step Title */}
        <View className="mb-4">
          <Text className="text-batik-800 text-2xl font-bold text-center">
            {questSteps[currentStep].title}
          </Text>
        </View>

        {/* Step Content */}
        {renderStepContent()}

        {/* Quest Info Card */}
        <View className="bg-batik-100 rounded-xl p-4 mb-6">
          <Text className="text-batik-800 font-bold mb-2">Informasi Quest</Text>
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Ionicons name="time" size={16} color="#A0522D" />
              <Text className="text-batik-600 text-sm ml-1">{quest.duration}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="trending-up" size={16} color="#A0522D" />
              <Text className="text-batik-600 text-sm ml-1">{quest.difficulty}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="star" size={16} color="#FCD34D" />
              <Text className="text-batik-600 text-sm ml-1">{quest.rating}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Navigation Controls */}
      <View className="bg-white border-t border-batik-200 px-4 py-4">
        <View className="flex-row justify-between items-center">
          {currentStep > 0 ? (
            <TouchableOpacity 
              onPress={handlePreviousStep}
              className="bg-batik-200 px-6 py-3 rounded-xl flex-row items-center"
            >
              <Ionicons name="chevron-back" size={20} color="#6F4E37" />
              <Text className="text-batik-700 font-medium ml-2">Sebelumnya</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}

          <TouchableOpacity 
            onPress={handleNextStep}
            className="bg-batik-600 px-6 py-3 rounded-xl flex-row items-center"
          >
            <Text className="text-batik-100 font-medium mr-2">
              {currentStep === questSteps.length - 1 ? 'Selesai Quest' : 'Lanjutkan'}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#F5EFE7" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
