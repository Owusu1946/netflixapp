import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, Pressable, Dimensions } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { ALL_VIDEOS, Video } from '../data/videos';
import { useDownload } from '../context/DownloadContext';
import VideoPlayer from '../components/VideoPlayer';
import { ArrowDownTrayIcon, CheckIcon, ShareIcon, ArrowLeftIcon } from 'react-native-heroicons/outline';
import VideoRow from '../components/VideoRow';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function VideoDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [video, setVideo] = useState<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  
  const { 
    downloadVideo, 
    isDownloaded, 
    getDownloadedVideoUri, 
    downloadedVideos,
    downloadingVideos,
    downloadProgress
  } = useDownload();

  // Find the video by ID
  useEffect(() => {
    if (id) {
      const foundVideo = ALL_VIDEOS.find(v => v.id === id.toString()) || null;
      
      if (foundVideo) {
        setVideo({
          ...foundVideo,
          isDownloaded: isDownloaded(foundVideo.id),
          downloadProgress: downloadingVideos[foundVideo.id] ? downloadProgress[foundVideo.id] : undefined,
        });
        
        // Find related videos from same genre
        const related = ALL_VIDEOS
          .filter(v => 
            v.id !== foundVideo.id && 
            v.genres.some(g => foundVideo.genres.includes(g))
          )
          .slice(0, 6)
          .map(v => ({
            ...v,
            isDownloaded: isDownloaded(v.id),
            downloadProgress: downloadingVideos[v.id] ? downloadProgress[v.id] : undefined,
          }));
        
        setRelatedVideos(related);
      }
    }
  }, [id, downloadedVideos, downloadingVideos, downloadProgress]);

  const handleDownload = () => {
    if (video) {
      downloadVideo(video);
    }
  };

  // Get video source URI (local or remote)
  const getVideoUri = () => {
    if (!video) return '';
    
    const localUri = getDownloadedVideoUri(video.id);
    return localUri || video.videoUrl;
  };

  if (!video) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-white">Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false,
        }} 
      />
      
      <SafeAreaView className="flex-1 bg-black" edges={isPlaying ? [] : ['right', 'left']}>
        <View className="relative">
          <VideoPlayer 
            uri={getVideoUri()} 
            title={video.title}
            onPlayStateChange={setIsPlaying}
          />
          
          {!isPlaying && (
            <Pressable 
              className="absolute top-2 left-4 z-10 p-2 bg-black/30 rounded-full" 
              onPress={() => router.back()}
            >
              <ArrowLeftIcon size={24} color="white" />
            </Pressable>
          )}
        </View>
        
        <ScrollView className="flex-1">
          <View className="px-4 pt-4">
            <Text className="text-white text-2xl font-bold mb-1">{video.title}</Text>
            
            <View className="flex-row items-center mb-2">
              <Text className="text-gray-400 text-sm">{video.releaseYear}</Text>
              <Text className="text-gray-400 text-sm mx-2">•</Text>
              <Text className="text-gray-400 text-sm">{video.duration}</Text>
              <Text className="text-gray-400 text-sm mx-2">•</Text>
              <View className="bg-gray-800 px-2 py-0.5 rounded">
                <Text className="text-gray-300 text-xs">{video.ageRating}</Text>
              </View>
            </View>
            
            <Text className="text-white mb-4">{video.description}</Text>
            
            <View className="flex-row mb-6">
              {video.downloadable && (
                <Pressable
                  className="flex-1 items-center mr-4"
                  onPress={handleDownload}
                  disabled={video.isDownloaded || (video.downloadProgress !== undefined && video.downloadProgress < 100)}
                >
                  <View className="w-12 h-12 rounded-full bg-gray-800 items-center justify-center mb-1">
                    {video.isDownloaded ? (
                      <CheckIcon size={24} color="#E50914" />
                    ) : (
                      <ArrowDownTrayIcon size={24} color="white" />
                    )}
                  </View>
                  <Text className="text-white text-xs">
                    {video.isDownloaded ? 'Downloaded' : 'Download'}
                  </Text>
                  
                  {video.downloadProgress !== undefined && video.downloadProgress < 100 && !video.isDownloaded && (
                    <View className="w-full mt-1">
                      <View className="h-1 bg-gray-700 rounded-full w-full">
                        <View 
                          className="h-1 bg-red-600 rounded-full" 
                          style={{ width: `${video.downloadProgress}%` }} 
                        />
                      </View>
                      <Text className="text-gray-400 text-[10px] mt-0.5">{Math.round(video.downloadProgress)}%</Text>
                    </View>
                  )}
                </Pressable>
              )}
              
              <Pressable className="flex-1 items-center">
                <View className="w-12 h-12 rounded-full bg-gray-800 items-center justify-center mb-1">
                  <ShareIcon size={24} color="white" />
                </View>
                <Text className="text-white text-xs">Share</Text>
              </Pressable>
            </View>
            
            <View className="mb-4">
              <Text className="text-gray-400 text-sm mb-1">Genres:</Text>
              <View className="flex-row flex-wrap">
                {video.genres.map((genre, index) => (
                  <View key={index} className="bg-gray-800 rounded-full py-1 px-3 mr-2 mb-2">
                    <Text className="text-white text-xs">{genre}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            {relatedVideos.length > 0 && (
              <View className="mb-6">
                <Text className="text-white text-lg font-semibold mb-2">More Like This</Text>
                <VideoRow
                  videos={relatedVideos}
                  showDownloadButton
                  onDownload={downloadVideo}
                  title=""
                />
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
} 