import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Video as ExpoVideo, ResizeMode } from 'expo-av';
import { PauseIcon, PlayIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon, ArrowLeftIcon } from 'react-native-heroicons/outline';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

interface VideoPlayerProps {
  uri: string;
  title?: string;
  autoPlay?: boolean;
  onBack?: () => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  uri,
  title,
  autoPlay = true,
  onBack,
  onPlayStateChange,
}) => {
  const videoRef = useRef<ExpoVideo>(null);
  const [status, setStatus] = useState<any>({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  // Hide controls after inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (visible) {
      timeout = setTimeout(() => {
        if (!status.isPlaying) return;
        setVisible(false);
      }, 3000);
    }
    
    return () => clearTimeout(timeout);
  }, [visible, status.isPlaying]);
  
  // Lock orientation when entering/exiting fullscreen
  useEffect(() => {
    const setOrientation = async () => {
      if (isFullscreen) {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
        );
      } else {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP
        );
      }
    };
    
    setOrientation();
    
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, [isFullscreen]);
  
  // Handle loading state
  useEffect(() => {
    if (status.isLoaded) {
      setLoading(false);
    }
  }, [status.isLoaded]);

  // Report play state changes to parent
  useEffect(() => {
    if (onPlayStateChange) {
      onPlayStateChange(status.isPlaying || false);
    }
  }, [status.isPlaying, onPlayStateChange]);

  // Format time in MM:SS
  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle play/pause toggle
  const togglePlayPause = async () => {
    if (videoRef.current) {
      if (status.isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
    }
  };

  // Handle fullscreen toggle
  const toggleFullscreen = async () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle back button
  const handleBack = () => {
    if (isFullscreen) {
      setIsFullscreen(false);
      return;
    }
    
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View className={`${isFullscreen ? 'flex-1' : 'aspect-video'} bg-black relative`}>
      <StatusBar hidden={isFullscreen} />
      
      <ExpoVideo
        ref={videoRef}
        source={{ uri }}
        style={[
          styles.video,
          { width: isFullscreen ? SCREEN_HEIGHT : '100%', height: isFullscreen ? SCREEN_WIDTH : '100%' }
        ]}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={autoPlay}
        isLooping
        onPlaybackStatusUpdate={setStatus}
        onTouchStart={() => setVisible(true)}
        onFullscreenUpdate={({ fullscreenUpdate }) => {
          if (fullscreenUpdate === 3) { // FULLSCREEN_UPDATE_PLAYER_DID_DISMISS
            setIsFullscreen(false);
          }
        }}
      />
      
      {loading && (
        <View className="absolute inset-0 flex items-center justify-center">
          <ActivityIndicator size="large" color="#E50914" />
        </View>
      )}
      
      {visible && (
        <Pressable
          className="absolute inset-0 flex items-center justify-center"
          onPress={() => setVisible(false)}
        >
          <View className="absolute inset-0 bg-black/40" />
          
          {/* Top controls */}
          <View className="absolute top-0 left-0 right-0 flex-row items-center p-4 z-10">
            <Pressable onPress={handleBack} className="mr-4">
              <ArrowLeftIcon size={24} color="white" />
            </Pressable>
            {title && (
              <Text className="text-white font-semibold text-lg" numberOfLines={1}>
                {title}
              </Text>
            )}
          </View>
          
          {/* Center play/pause button */}
          <Pressable onPress={togglePlayPause} className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            {status.isPlaying ? <PauseIcon size={30} color="white" /> : <PlayIcon size={30} color="white" />}
          </Pressable>
          
          {/* Bottom controls */}
          <View className="absolute bottom-0 left-0 right-0 p-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-white">
                {status.positionMillis ? formatTime(status.positionMillis) : '00:00'}
              </Text>
              <Text className="text-white">
                {status.durationMillis ? formatTime(status.durationMillis) : '00:00'}
              </Text>
            </View>
            
            {/* Progress bar */}
            <View className="h-1 bg-white/30 rounded-full w-full mb-4">
              {status.positionMillis && status.durationMillis && (
                <View
                  className="h-1 bg-red-600 rounded-full absolute top-0 left-0"
                  style={{
                    width: `${(status.positionMillis / status.durationMillis) * 100}%`,
                  }}
                />
              )}
            </View>
            
            {/* Bottom row controls */}
            <View className="flex-row items-center justify-end">
              <Pressable onPress={toggleFullscreen} className="ml-4">
                {isFullscreen ? (
                  <ArrowsPointingInIcon size={24} color="white" />
                ) : (
                  <ArrowsPointingOutIcon size={24} color="white" />
                )}
              </Pressable>
            </View>
          </View>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  video: {
    flex: 1,
  },
});

export default VideoPlayer; 