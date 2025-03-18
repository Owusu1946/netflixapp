import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Video } from '../data/videos';
import VideoCard from './VideoCard';

interface VideoRowProps {
  title: string;
  videos: Video[];
  onDownload?: (video: Video) => void;
  showDownloadButton?: boolean;
  showRank?: boolean;
}

const VideoRow: React.FC<VideoRowProps> = ({
  title,
  videos,
  onDownload,
  showDownloadButton = false,
  showRank = false,
}) => {
  if (!videos || videos.length === 0) return null;

  return (
    <View className="mb-6">
      <Text className="text-white text-xl font-bold mb-2 px-4">{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {videos.map((video, index) => (
          <VideoCard
            key={video.id}
            video={video}
            showDownloadButton={showDownloadButton}
            onDownload={onDownload}
            showRank={showRank}
            rank={index + 1}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default VideoRow; 