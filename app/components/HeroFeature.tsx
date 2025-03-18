import React from 'react';
import { View, Text, Image, Pressable, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { PlayIcon } from 'react-native-heroicons/outline';
import { ArrowDownTrayIcon } from 'react-native-heroicons/outline';
import { Video } from '../data/videos';
import { LinearGradient } from 'expo-linear-gradient';

interface HeroFeatureProps {
  video: Video;
  onDownload?: (video: Video) => void;
}

const { width } = Dimensions.get('window');

const HeroFeature: React.FC<HeroFeatureProps> = ({ video, onDownload }) => {
  if (!video) return null;

  return (
    <View className="w-full relative" style={{ height: width * 0.65 }}>
      <Image
        source={{ uri: video.thumbnail }}
        className="absolute w-full h-full"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,1)']}
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: '70%',
        }}
      />
      <View className="absolute bottom-4 left-0 right-0 px-4">
        <Text className="text-white text-2xl font-bold mb-1">{video.title}</Text>
        <View className="flex-row items-center mb-2">
          <Text className="text-white/80 text-xs mr-2">{video.duration}</Text>
          <Text className="text-white/80 text-xs mr-2">{video.releaseYear}</Text>
          <View className="bg-gray-500/30 px-1 rounded">
            <Text className="text-white/80 text-xs">{video.ageRating}</Text>
          </View>
        </View>
        <Text className="text-white/90 mb-4" numberOfLines={3}>
          {video.description}
        </Text>
        <View className="flex-row">
          <Pressable
            className="bg-white rounded-sm flex-row items-center justify-center py-2 px-4 mr-3 flex-1"
            onPress={() => router.push(`/video/${video.id}`)}
          >
            <PlayIcon size={20} color="black" />
            <Text className="text-black font-semibold ml-2">Play</Text>
          </Pressable>
          {video.downloadable && (
            <Pressable
              className="bg-gray-700/80 rounded-sm flex-row items-center justify-center py-2 px-4 flex-1"
              onPress={() => onDownload && onDownload(video)}
            >
              <ArrowDownTrayIcon size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Download</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

export default HeroFeature; 