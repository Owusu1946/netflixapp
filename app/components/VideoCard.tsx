import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ArrowDownTrayIcon } from 'react-native-heroicons/outline';
import { ArrowDownTrayIcon as ArrowDownTrayIconSolid } from 'react-native-heroicons/solid';
import { Video } from '../data/videos';

interface VideoCardProps {
  video: Video;
  width?: number;
  height?: number;
  showDownloadButton?: boolean;
  onDownload?: (video: Video) => void;
  showRank?: boolean;
  rank?: number;
}

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  width = 150,
  height = 220,
  showDownloadButton = false,
  onDownload,
  showRank = false,
  rank,
}) => {
  return (
    <Pressable
      className="mr-3 mb-3 rounded-lg overflow-hidden"
      style={{ width, height }}
      onPress={() => router.push(`/video/${video.id}`)}
    >
      <Image
        source={{ uri: video.thumbnail }}
        className="absolute w-full h-full"
        style={{ width, height }}
      />
      
      {/* Netflix-style rank number for top 10 */}
      {showRank && rank && rank <= 10 && (
        <View className="absolute right-0 bottom-12 z-10">
          <Text 
            className="text-white font-black text-6xl opacity-90"
            style={{ 
              textShadowColor: 'rgba(0, 0, 0, 0.75)',
              textShadowOffset: { width: -1, height: 1 },
              textShadowRadius: 10
            }}
          >
            {rank}
          </Text>
        </View>
      )}

      <View className="absolute bottom-0 left-0 right-0 p-2 bg-black/60">
        <Text className="text-white font-semibold" numberOfLines={1}>
          {video.title}
        </Text>
        <View className="flex-row items-center mt-1 justify-between">
          <Text className="text-white/80 text-xs">
            {video.duration} • {video.releaseYear}
          </Text>
          
          {showDownloadButton && video.downloadable && (
            <Pressable 
              className="ml-2" 
              onPress={(e) => {
                e.stopPropagation();
                if (onDownload) onDownload(video);
              }}
            >
              {video.isDownloaded ? (
                <ArrowDownTrayIconSolid size={18} color="#E50914" />
              ) : (
                <ArrowDownTrayIcon size={18} color="white" />
              )}
            </Pressable>
          )}
        </View>
        
        {video.isDownloaded && (
          <View className="absolute -top-1 -right-1 bg-green-600 rounded-full p-1">
            <Text className="text-white text-[6px]">Saved</Text>
          </View>
        )}
        
        {video.downloadProgress !== undefined && video.downloadProgress < 100 && !video.isDownloaded && (
          <View 
            className="absolute left-0 bottom-0 h-1 bg-red-600" 
            style={{ width: `${video.downloadProgress}%` }} 
          />
        )}
      </View>
    </Pressable>
  );
};

export default VideoCard; 