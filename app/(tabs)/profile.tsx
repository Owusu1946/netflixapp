import React from 'react';
import { View, Text, Image, Pressable, ScrollView } from 'react-native';
import { useDownload } from '../context/DownloadContext';
import { Cog6ToothIcon, ClockIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { downloadedVideos } = useDownload();
  
  // Calculate total download size
  const totalSize = downloadedVideos.reduce((total, video) => {
    if (video.downloadSize) {
      const size = parseFloat(video.downloadSize.replace(' MB', ''));
      return total + (isNaN(size) ? 0 : size);
    }
    return total;
  }, 0);
  
  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top', 'right', 'left']}>
      <ScrollView className="flex-1">
        <View className="items-center py-8">
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1000' }}
            className="w-20 h-20 rounded-full"
          />
          <Text className="text-white text-xl font-bold mt-4">John Doe</Text>
          <Text className="text-gray-400">johndoe@example.com</Text>
        </View>
        
        <View className="bg-gray-900 mx-4 rounded-lg p-4 mb-6">
          <Text className="text-white text-lg font-semibold mb-4">Storage</Text>
          
          <View className="mb-6">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-400">Downloads</Text>
              <Text className="text-white">{totalSize.toFixed(1)} MB</Text>
            </View>
            
            <View className="h-2 bg-gray-800 rounded-full">
              <View 
                className="h-2 bg-red-600 rounded-full" 
                style={{ 
                  width: `${Math.min((totalSize / 2000) * 100, 100)}%` 
                }} 
              />
            </View>
            
            <Text className="text-xs text-gray-500 mt-1 text-right">
              {totalSize.toFixed(1)} MB of 2 GB used
            </Text>
          </View>
          
          <View className="flex-row items-center justify-between py-2">
            <View className="flex-row items-center">
              <View className="bg-gray-800 p-2 rounded-full mr-3">
                <ClockIcon size={20} color="#E50914" />
              </View>
              <View>
                <Text className="text-white">Viewing Activity</Text>
                <Text className="text-gray-500 text-xs">History of what you've watched</Text>
              </View>
            </View>
            <Text className="text-gray-400">{">"}</Text>
          </View>
        </View>
        
        <View className="bg-gray-900 mx-4 rounded-lg mb-8">
          <Pressable className="flex-row items-center p-4 border-b border-gray-800">
            <Cog6ToothIcon size={20} color="white" className="mr-3" />
            <Text className="text-white">App Settings</Text>
          </Pressable>
          
          <Pressable className="flex-row items-center p-4 border-b border-gray-800">
            <Text className="text-white">Help Center</Text>
          </Pressable>
          
          <Pressable className="flex-row items-center p-4">
            <Text className="text-white">Sign Out</Text>
          </Pressable>
        </View>
        
        <View className="px-4 pb-8">
          <Text className="text-gray-600 text-center text-xs">
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 