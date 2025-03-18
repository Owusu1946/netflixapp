import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StatusBar, Image, Pressable, Dimensions, ImageBackground, Platform, Animated } from 'react-native';
import { FEATURED_VIDEOS, TRENDING_VIDEOS, ALL_VIDEOS, Video } from '../data/videos';
import VideoRow from '../components/VideoRow';
import { useDownload } from '../context/DownloadContext';
import { PlayIcon, InformationCircleIcon } from 'react-native-heroicons/outline';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');
const NETFLIX_RED = '#E50914';

export default function HomeScreen() {
  const { downloadVideo, isDownloaded, downloadingVideos, downloadProgress } = useDownload();
  const [featuredVideo, setFeaturedVideo] = useState<Video & {isDownloaded?: boolean, downloadProgress?: number}>(FEATURED_VIDEOS[0]);
  const [scrollY, setScrollY] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Add isDownloaded property to videos
  const featuredVideos = FEATURED_VIDEOS.map(video => ({
    ...video,
    isDownloaded: isDownloaded(video.id),
    downloadProgress: downloadingVideos[video.id] ? downloadProgress[video.id] : undefined,
  }));
  
  const trendingVideos = TRENDING_VIDEOS.map(video => ({
    ...video,
    isDownloaded: isDownloaded(video.id),
    downloadProgress: downloadingVideos[video.id] ? downloadProgress[video.id] : undefined,
  }));
  
  // Get curated categories for a Netflix-like experience
  const actionVideos = ALL_VIDEOS.filter(v => v.genres.includes('Action')).slice(0, 10).map(video => ({
    ...video,
    isDownloaded: isDownloaded(video.id),
    downloadProgress: downloadingVideos[video.id] ? downloadProgress[video.id] : undefined,
  }));
  
  const documentaryVideos = ALL_VIDEOS.filter(v => v.genres.includes('Documentary')).slice(0, 10).map(video => ({
    ...video,
    isDownloaded: isDownloaded(video.id),
    downloadProgress: downloadingVideos[video.id] ? downloadProgress[video.id] : undefined,
  }));
  
  const handleDownload = (video: Video) => {
    downloadVideo(video);
  };
  
  // Cycle through featured videos every 15 seconds like Netflix
  useEffect(() => {
    const interval = setInterval(() => {
      const currentIndex = FEATURED_VIDEOS.findIndex(v => v.id === featuredVideo.id);
      const nextIndex = (currentIndex + 1) % FEATURED_VIDEOS.length;
      setFeaturedVideo({
        ...FEATURED_VIDEOS[nextIndex],
        isDownloaded: isDownloaded(FEATURED_VIDEOS[nextIndex].id),
        downloadProgress: downloadingVideos[FEATURED_VIDEOS[nextIndex].id] 
          ? downloadProgress[FEATURED_VIDEOS[nextIndex].id] 
          : undefined,
      });
    }, 15000);
    
    return () => clearInterval(interval);
  }, [featuredVideo, isDownloaded, downloadingVideos, downloadProgress]);
  
  // Animate the category header
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);
  
  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Netflix Header with logo */}
      <Animated.View 
        className="absolute top-0 left-0 right-0 z-50 flex-row items-center px-4 pt-12 pb-2"
        style={{
          opacity: fadeAnim,
          backgroundColor: `rgba(0,0,0,${Math.min(scrollY / 100, 0.9)})`,
        }}
      >
        <Text className="text-red-600 text-4xl font-bold">N</Text>
        <View className="flex-1" />
        <Pressable className="px-4">
          <Text className="text-white font-semibold">TV Shows</Text>
        </Pressable>
        <Pressable className="px-4">
          <Text className="text-white font-semibold">Movies</Text>
        </Pressable>
        <Pressable className="px-4">
          <Text className="text-white font-semibold">My List</Text>
        </Pressable>
      </Animated.View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
        onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
      >
        {/* Hero Feature - Netflix Style */}
        <View style={{ height: height * 0.7 }} className="relative">
          <ImageBackground
            source={{ uri: featuredVideo.thumbnail }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          >
            {/* Netflix-style gradient overlay */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)', '#000']}
              style={{ position: 'absolute', height: '100%', width: '100%' }}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
            
            {/* Content info */}
            <View className="absolute bottom-20 left-0 right-0 px-6">
              {/* Title with Netflix-style animation */}
              <Animated.View 
                className="items-center mb-3"
                style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })}] }}
              >
                <Text className="text-white text-4xl font-bold text-center" numberOfLines={2}>
                  {featuredVideo.title}
                </Text>
              </Animated.View>
              
              {/* Metadata row */}
              <View className="flex-row items-center justify-center mb-4 flex-wrap">
                <Text className="text-green-500 font-bold mr-2">98% Match</Text>
                <Text className="text-gray-300 mr-2">{featuredVideo.releaseYear}</Text>
                <View className="bg-gray-600 px-1 rounded mr-2">
                  <Text className="text-white text-xs">TV-MA</Text>
                </View>
                <Text className="text-gray-300 mr-2">{featuredVideo.duration}</Text>
                <View className="bg-gray-800 px-1 rounded">
                  <Text className="text-white text-xs">HD</Text>
                </View>
              </View>
              
              {/* Genres */}
              <View className="flex-row justify-center mb-6 flex-wrap">
                {featuredVideo.genres.map((genre, index) => (
                  <React.Fragment key={genre}>
                    <Text className="text-gray-300 text-sm">{genre}</Text>
                    {index < featuredVideo.genres.length - 1 && (
                      <Text className="text-gray-500 mx-1">•</Text>
                    )}
                  </React.Fragment>
                ))}
              </View>
              
              {/* Action buttons */}
              <View className="flex-row justify-center space-x-4">
                <Pressable
                  className="bg-white rounded-md py-2 px-6 flex-row items-center justify-center flex-1"
                  style={{ maxWidth: 150 }}
                  onPress={() => router.push(`/video/${featuredVideo.id}`)}
                >
                  <PlayIcon size={20} color="black" />
                  <Text className="text-black ml-2 font-bold">Play</Text>
                </Pressable>
                
                <Pressable
                  className="bg-gray-600 bg-opacity-80 rounded-md py-2 px-6 flex-row items-center justify-center flex-1"
                  style={{ maxWidth: 150 }}
                  onPress={() => handleDownload(featuredVideo)}
                >
                  <InformationCircleIcon size={20} color="white" />
                  <Text className="text-white ml-2 font-semibold">More Info</Text>
                </Pressable>
              </View>
            </View>
          </ImageBackground>
        </View>
        
        {/* Preview Label - Like the "New & Hot" on Netflix */}
        <View className="mt-4 mb-1 ml-4 flex-row items-center">
          <View className="bg-red-600 h-5 w-1 mr-2" />
          <Text className="text-white font-semibold text-lg">New & Hot</Text>
        </View>
        
        {/* Content rows - Netflix style spacing */}
        <View className="mt-2">
          <VideoRow 
            title="Trending Now" 
            videos={trendingVideos}
            showDownloadButton
            onDownload={handleDownload}
            showRank={true}
          />
          
          <VideoRow 
            title="Popular on Netflix" 
            videos={featuredVideos}
            showDownloadButton
            onDownload={handleDownload}
          />
          
          <VideoRow 
            title="Action & Adventure" 
            videos={actionVideos}
            showDownloadButton
            onDownload={handleDownload}
          />
          
          <VideoRow 
            title="Documentaries" 
            videos={documentaryVideos}
            showDownloadButton
            onDownload={handleDownload}
          />
        </View>
      </ScrollView>
    </View>
  );
} 