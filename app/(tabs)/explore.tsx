import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Pressable, Image, Dimensions } from 'react-native';
import { MagnifyingGlassIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { useDownload } from '../context/DownloadContext';
import { ALL_VIDEOS, Video } from '../data/videos';
import { router } from 'expo-router';
import { ArrowDownTrayIcon } from 'react-native-heroicons/outline';
import { ArrowDownTrayIcon as ArrowDownTrayIconSolid } from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 2 - 24; // 2 items per row with spacing

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const { downloadVideo, isDownloaded, downloadingVideos, downloadProgress } = useDownload();

  // Process videos to include downloaded state
  const processedVideos = ALL_VIDEOS.map(video => ({
    ...video,
    isDownloaded: isDownloaded(video.id),
    downloadProgress: downloadingVideos[video.id] ? downloadProgress[video.id] : undefined,
  }));

  // Get unique genres from all videos
  const allGenres = [...new Set(ALL_VIDEOS.flatMap(video => video.genres))];

  // Filter videos by search query and genre
  const filteredVideos = processedVideos.filter(video => {
    const matchesSearch = searchQuery === '' || 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGenre = activeGenre === null || video.genres.includes(activeGenre);
    
    return matchesSearch && matchesGenre;
  });

  const handleDownload = (video: Video) => {
    downloadVideo(video);
  };

  const renderItem = ({ item }: { item: Video }) => (
    <Pressable
      className="mb-4"
      style={{ width: ITEM_WIDTH }}
      onPress={() => router.push(`/video/${item.id}`)}
    >
      <View className="rounded-lg overflow-hidden relative">
        <Image
          source={{ uri: item.thumbnail }}
          className="w-full aspect-[2/3]"
          style={{ width: ITEM_WIDTH }}
        />
        
        {item.isDownloaded && (
          <View className="absolute top-2 right-2 bg-green-600 rounded-full p-1">
            <Text className="text-white text-[8px] px-1">Downloaded</Text>
          </View>
        )}

        {item.downloadProgress !== undefined && item.downloadProgress < 100 && !item.isDownloaded && (
          <View className="absolute bottom-0 left-0 right-0">
            <View 
              className="h-1 bg-red-600" 
              style={{ width: `${item.downloadProgress}%` }} 
            />
          </View>
        )}
      </View>

      <View className="mt-2">
        <Text className="text-white font-semibold" numberOfLines={1}>
          {item.title}
        </Text>
        <View className="flex-row items-center justify-between mt-1">
          <Text className="text-gray-400 text-xs">
            {item.duration} • {item.releaseYear}
          </Text>
          
          {item.downloadable && (
            <Pressable 
              onPress={(e) => {
                e.stopPropagation();
                handleDownload(item);
              }}
            >
              {item.isDownloaded ? (
                <ArrowDownTrayIconSolid size={18} color="#E50914" />
              ) : (
                <ArrowDownTrayIcon size={18} color="white" />
              )}
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top', 'right', 'left']}>
      <View className="flex-1 px-4 pt-2">
        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-800 rounded-full mb-4 px-4 py-2">
          <MagnifyingGlassIcon size={20} color="gray" />
          <TextInput
            className="flex-1 text-white ml-2"
            placeholder="Search titles, genres..."
            placeholderTextColor="gray"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <XMarkIcon size={20} color="gray" />
            </Pressable>
          )}
        </View>

        {/* Genre Filter */}
        <FlatList
          horizontal
          data={allGenres}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          className="mb-4"
          renderItem={({ item }) => (
            <Pressable
              className={`mr-2 py-1 px-3 rounded-full ${
                activeGenre === item ? 'bg-red-600' : 'bg-gray-800'
              }`}
              onPress={() => {
                if (activeGenre === item) {
                  setActiveGenre(null); // Clear filter if same genre is tapped again
                } else {
                  setActiveGenre(item);
                }
              }}
            >
              <Text className="text-white text-sm">{item}</Text>
            </Pressable>
          )}
        />

        {/* Results */}
        <FlatList
          data={filteredVideos}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 4 }}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          ListEmptyComponent={() => (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-white text-lg">No videos found</Text>
              <Text className="text-gray-400 mt-2">Try adjusting your search or filters</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
} 