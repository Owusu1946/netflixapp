import React, { createContext, useState, useContext, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';
import { Video } from '../data/videos';

interface DownloadState {
  downloadedVideos: Video[];
  downloading: { [key: string]: boolean };
  progress: { [key: string]: number };
}

interface DownloadContextType {
  downloadedVideos: Video[];
  downloadingVideos: { [key: string]: boolean };
  downloadProgress: { [key: string]: number };
  downloadVideo: (video: Video) => Promise<void>;
  deleteDownload: (videoId: string) => Promise<void>;
  isDownloaded: (videoId: string) => boolean;
  getDownloadedVideoUri: (videoId: string) => string | null;
}

const DownloadContext = createContext<DownloadContextType | undefined>(undefined);

// Storage directory for downloaded videos
const VIDEOS_DIRECTORY = `${FileSystem.documentDirectory}videos/`;

export const DownloadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DownloadState>({
    downloadedVideos: [],
    downloading: {},
    progress: {},
  });

  // Request media library permissions
  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Media library permission not granted');
      }
      
      // Initialize videos directory if it doesn't exist
      const dirInfo = await FileSystem.getInfoAsync(VIDEOS_DIRECTORY);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(VIDEOS_DIRECTORY, { intermediates: true });
      }
      
      // Load previously downloaded videos
      await loadDownloadedVideos();
    })();
  }, []);

  // Load previously downloaded videos from the file system
  const loadDownloadedVideos = async () => {
    try {
      const dirInfo = await FileSystem.getInfoAsync(VIDEOS_DIRECTORY);
      
      if (dirInfo.exists) {
        const files = await FileSystem.readDirectoryAsync(VIDEOS_DIRECTORY);
        const videoFiles = files.filter(f => f.endsWith('.mp4') || f.endsWith('.json'));
        
        const videoIds = [...new Set(videoFiles.map(f => f.split('.')[0]))];
        const videos: Video[] = [];
        
        for (const id of videoIds) {
          try {
            const metadataPath = `${VIDEOS_DIRECTORY}${id}.json`;
            const metadataInfo = await FileSystem.getInfoAsync(metadataPath);
            
            if (metadataInfo.exists) {
              const metadataStr = await FileSystem.readAsStringAsync(metadataPath);
              const videoData = JSON.parse(metadataStr) as Video;
              
              const videoPath = `${VIDEOS_DIRECTORY}${id}.mp4`;
              const videoInfo = await FileSystem.getInfoAsync(videoPath);
              
              if (videoInfo.exists) {
                videos.push({
                  ...videoData,
                  isDownloaded: true,
                });
              }
            }
          } catch (error) {
            console.error(`Error loading video ${id}:`, error);
          }
        }
        
        setState(prev => ({
          ...prev,
          downloadedVideos: videos,
        }));
      }
    } catch (error) {
      console.error('Error loading downloaded videos:', error);
    }
  };

  // Download a video to the file system
  const downloadVideo = async (video: Video) => {
    if (state.downloading[video.id]) {
      console.log('Already downloading this video');
      return;
    }
    
    if (isDownloaded(video.id)) {
      console.log('Video already downloaded');
      return;
    }
    
    setState(prev => ({
      ...prev,
      downloading: { ...prev.downloading, [video.id]: true },
      progress: { ...prev.progress, [video.id]: 0 },
    }));
    
    try {
      // Create directory if it doesn't exist
      const dirInfo = await FileSystem.getInfoAsync(VIDEOS_DIRECTORY);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(VIDEOS_DIRECTORY, { intermediates: true });
      }
      
      // Save metadata
      const metadataPath = `${VIDEOS_DIRECTORY}${video.id}.json`;
      const videoData = {
        ...video,
        downloadSize: 'Unknown', // We'll update this later
        isDownloaded: true,
      };
      
      await FileSystem.writeAsStringAsync(metadataPath, JSON.stringify(videoData));
      
      // Download the video
      const videoPath = `${VIDEOS_DIRECTORY}${video.id}.mp4`;
      const downloadResumable = FileSystem.createDownloadResumable(
        video.videoUrl,
        videoPath,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite * 100;
          setState(prev => ({
            ...prev,
            progress: { ...prev.progress, [video.id]: progress },
          }));
        }
      );
      
      const result = await downloadResumable.downloadAsync();
      
      if (result) {
        // Update video size in metadata
        const fileInfo = await FileSystem.getInfoAsync(videoPath);
        const fileSizeInMB = fileInfo.exists && 'size' in fileInfo ? fileInfo.size / (1024 * 1024) : 0;
        const formattedSize = `${fileSizeInMB.toFixed(1)} MB`;
        
        const updatedVideoData = {
          ...videoData,
          downloadSize: formattedSize,
        };
        
        await FileSystem.writeAsStringAsync(metadataPath, JSON.stringify(updatedVideoData));
        
        setState(prev => ({
          ...prev,
          downloadedVideos: [...prev.downloadedVideos, updatedVideoData],
          downloading: { ...prev.downloading, [video.id]: false },
        }));
        
        // Add to device media library if on mobile
        if (Platform.OS !== 'web') {
          try {
            const asset = await MediaLibrary.createAssetAsync(videoPath);
            await MediaLibrary.createAlbumAsync('Netflix Downloads', asset, false);
          } catch (error) {
            console.warn('Error adding to media library:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error downloading video:', error);
      setState(prev => ({
        ...prev,
        downloading: { ...prev.downloading, [video.id]: false },
      }));
    }
  };

  // Delete a downloaded video
  const deleteDownload = async (videoId: string) => {
    try {
      const videoPath = `${VIDEOS_DIRECTORY}${videoId}.mp4`;
      const metadataPath = `${VIDEOS_DIRECTORY}${videoId}.json`;
      
      const videoInfo = await FileSystem.getInfoAsync(videoPath);
      if (videoInfo.exists) {
        await FileSystem.deleteAsync(videoPath);
      }
      
      const metadataInfo = await FileSystem.getInfoAsync(metadataPath);
      if (metadataInfo.exists) {
        await FileSystem.deleteAsync(metadataPath);
      }
      
      setState(prev => ({
        ...prev,
        downloadedVideos: prev.downloadedVideos.filter(v => v.id !== videoId),
      }));
    } catch (error) {
      console.error('Error deleting download:', error);
    }
  };

  // Check if a video is downloaded
  const isDownloaded = (videoId: string) => {
    return state.downloadedVideos.some(v => v.id === videoId);
  };

  // Get the local URI of a downloaded video
  const getDownloadedVideoUri = (videoId: string) => {
    if (!isDownloaded(videoId)) return null;
    return `${VIDEOS_DIRECTORY}${videoId}.mp4`;
  };

  const value: DownloadContextType = {
    downloadedVideos: state.downloadedVideos,
    downloadingVideos: state.downloading,
    downloadProgress: state.progress,
    downloadVideo,
    deleteDownload,
    isDownloaded,
    getDownloadedVideoUri,
  };

  return (
    <DownloadContext.Provider value={value}>
      {children}
    </DownloadContext.Provider>
  );
};

export const useDownload = () => {
  const context = useContext(DownloadContext);
  if (context === undefined) {
    throw new Error('useDownload must be used within a DownloadProvider');
  }
  return context;
};

export default DownloadContext; 