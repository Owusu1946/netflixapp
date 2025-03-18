# Netflix-Inspired Streaming App

A feature-rich mobile streaming application built with Expo and React Native, styled with NativeWind (TailwindCSS). This app provides a premium Netflix-like experience with video playback, offline downloads, and a sleek modern UI.

![Netflix Inspired App](https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1000)

## 🚀 Features

### Core Technologies
- ⚡️ Expo SDK 52 for cross-platform development
- 💨 NativeWind/TailwindCSS for responsive styling
- 📱 Expo Router for file-based navigation
- 🔤 TypeScript for type safety
- 🎬 Video streaming with Expo AV
- 📲 Offline download capabilities
- 📁 Clean architecture with organized file structure

### App Features
- 🎭 Netflix-style UI with immersive hero section
- 🔄 Smooth video playback with loading indicators
- 💾 Download management system for offline viewing
- 🔎 Content discovery with search and genre filtering
- 👤 User profile with storage management
- 📊 Download progress tracking
- 📱 Responsive design for all screen sizes
- 🧭 Tab-based navigation (Home, Explore, Downloads, Profile)
- 🔒 SafeArea handling for notches and system UI

## 📦 Technical Stack

### Frontend Framework
- React Native / Expo
- Expo Router for navigation
- Expo AV for video handling
- NativeWind (TailwindCSS)

### UI Packages
- react-native-heroicons for icons
- expo-linear-gradient for gradients
- expo-blur for blur effects
- react-native-safe-area-context for notch/system UI handling

### Video Features
- Expo AV for high-quality video streaming
- Custom download management system
- Video progress tracking
- Background downloads

## 🛠️ Getting Started

1. Clone this repository:

```bash
git clone https://github.com/Owusu1946/netflixapp.git
cd expo_tailwind
```

2. Install dependencies:

```bash
npm install
```

3. Start the app:
```bash
npx expo start
```

## 📱 Running the App

After starting the development server, you can:
- Press `i` to open in iOS simulator
- Press `a` to open in Android emulator
- Scan the QR code with Expo Go on your physical device

## 🎬 Video Playback

The app uses Expo AV for smooth video playback with the following features:
- Automatic quality adaptation
- Landscape/portrait mode switching
- Fullscreen toggle
- Playback controls with auto-hide
- Background audio support

## 💾 Download System

The offline download system enables users to:
- Download videos for offline viewing
- Track download progress in real-time
- Manage downloaded content
- Delete individual or bulk downloads
- View storage usage statistics

## 🧠 Understanding the Download System (For Beginners)

The app implements a complete download system using React Context, AsyncStorage, and custom hooks. Here's how it works:

### 1. Download Context Setup

The core of our download system is the `DownloadContext` which manages the state of all downloads:

```tsx
// app/context/DownloadContext.tsx (simplified)
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Video } from '../data/videos';

// Context state definition
type DownloadContextType = {
  downloadedVideos: Video[];
  downloadingVideos: Record<string, boolean>;
  downloadProgress: Record<string, number>;
  downloadVideo: (video: Video) => void;
  deleteDownload: (videoId: string) => Promise<void>;
  isDownloaded: (videoId: string) => boolean;
  getDownloadedVideoUri: (videoId: string) => string | null;
};

// Create context with default values
const DownloadContext = createContext<DownloadContextType>({
  downloadedVideos: [],
  downloadingVideos: {},
  downloadProgress: {},
  downloadVideo: () => {},
  deleteDownload: async () => {},
  isDownloaded: () => false,
  getDownloadedVideoUri: () => null,
});

// Provider component that wraps your app
export const DownloadProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [downloadedVideos, setDownloadedVideos] = useState<Video[]>([]);
  const [downloadingVideos, setDownloadingVideos] = useState<Record<string, boolean>>({});
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});
  
  // Load saved downloads when app starts
  useEffect(() => {
    loadDownloads();
  }, []);

  // Function to load saved downloads from storage
  const loadDownloads = async () => {
    try {
      const savedDownloadsJson = await AsyncStorage.getItem('downloadedVideos');
      if (savedDownloadsJson) {
        const savedDownloads = JSON.parse(savedDownloadsJson);
        setDownloadedVideos(savedDownloads);
      }
    } catch (error) {
      console.error('Failed to load downloads:', error);
    }
  };

  // Save downloads to persistent storage
  const saveDownloads = async (videos: Video[]) => {
    try {
      await AsyncStorage.setItem('downloadedVideos', JSON.stringify(videos));
    } catch (error) {
      console.error('Failed to save downloads:', error);
    }
  };

  // Start downloading a video
  const downloadVideo = async (video: Video) => {
    // Skip if already downloaded or currently downloading
    if (isDownloaded(video.id) || downloadingVideos[video.id]) {
      return;
    }

    // Generate a unique file path for the video
    const fileUri = `${FileSystem.documentDirectory}videos/${video.id}.mp4`;
    
    // Create directory if it doesn't exist
    const dirUri = `${FileSystem.documentDirectory}videos`;
    const dirInfo = await FileSystem.getInfoAsync(dirUri);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dirUri, { intermediates: true });
    }

    // Mark as downloading
    setDownloadingVideos(prev => ({ ...prev, [video.id]: true }));
    setDownloadProgress(prev => ({ ...prev, [video.id]: 0 }));

    try {
      // Start the download with progress tracking
      const downloadResumable = FileSystem.createDownloadResumable(
        video.videoUrl,
        fileUri,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite * 100;
          setDownloadProgress(prev => ({ ...prev, [video.id]: progress }));
        }
      );

      const { uri } = await downloadResumable.downloadAsync();
      
      if (uri) {
        // Add to downloaded videos with local path information
        const downloadedVideo = {
          ...video,
          localUri: uri,
          downloadSize: await getFileSizeString(uri),
          downloadDate: new Date().toISOString(),
        };
        
        const newDownloadedVideos = [...downloadedVideos, downloadedVideo];
        setDownloadedVideos(newDownloadedVideos);
        await saveDownloads(newDownloadedVideos);
      }
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      // Clear downloading status
      setDownloadingVideos(prev => {
        const updated = { ...prev };
        delete updated[video.id];
        return updated;
      });
    }
  };

  // Delete a downloaded video
  const deleteDownload = async (videoId: string) => {
    const video = downloadedVideos.find(v => v.id === videoId);
    if (!video || !video.localUri) return;

    try {
      // Delete the file
      await FileSystem.deleteAsync(video.localUri);
      
      // Remove from state
      const updatedVideos = downloadedVideos.filter(v => v.id !== videoId);
      setDownloadedVideos(updatedVideos);
      
      // Update storage
      await saveDownloads(updatedVideos);
    } catch (error) {
      console.error('Failed to delete download:', error);
    }
  };

  // Check if a video is downloaded
  const isDownloaded = (videoId: string) => {
    return downloadedVideos.some(v => v.id === videoId);
  };

  // Get the local URI for a downloaded video
  const getDownloadedVideoUri = (videoId: string) => {
    const video = downloadedVideos.find(v => v.id === videoId);
    return video?.localUri || null;
  };

  // Helper to get human-readable file size
  const getFileSizeString = async (uri: string) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      const fileSizeInBytes = fileInfo.size || 0;
      const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
      return `${fileSizeInMB.toFixed(1)} MB`;
    } catch (error) {
      return 'Unknown size';
    }
  };

  // Provide the download context to children
  return (
    <DownloadContext.Provider
      value={{
        downloadedVideos,
        downloadingVideos,
        downloadProgress,
        downloadVideo,
        deleteDownload,
        isDownloaded,
        getDownloadedVideoUri,
      }}
    >
      {children}
    </DownloadContext.Provider>
  );
};

// Custom hook to use the download context
export const useDownload = () => useContext(DownloadContext);
```

### 2. Using the Download Functionality in Components

Here's how to use the download functionality in your components:

```tsx
// Example from a video card component
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useDownload } from '../context/DownloadContext';
import { ArrowDownTrayIcon } from 'react-native-heroicons/outline';
import { ArrowDownTrayIcon as ArrowDownTrayIconSolid } from 'react-native-heroicons/solid';

const VideoDownloadButton = ({ video }) => {
  const { downloadVideo, isDownloaded, downloadProgress } = useDownload();

  // Check if video is downloaded or in progress
  const downloaded = isDownloaded(video.id);
  const downloading = downloadProgress[video.id] !== undefined && !downloaded;
  const progress = downloadProgress[video.id] || 0;

  const handleDownload = () => {
    if (!downloaded && !downloading) {
      downloadVideo(video);
    }
  };

  return (
    <View>
      {/* Download button */}
      <Pressable 
        onPress={handleDownload}
        disabled={downloading || downloaded}
      >
        {downloaded ? (
          <ArrowDownTrayIconSolid size={24} color="#E50914" />
        ) : (
          <ArrowDownTrayIcon size={24} color="white" />
        )}
      </Pressable>

      {/* Download progress indicator */}
      {downloading && (
        <View className="mt-2 w-full">
          <View className="h-1 bg-gray-700 rounded-full">
            <View 
              className="h-1 bg-red-600 rounded-full" 
              style={{ width: `${progress}%` }} 
            />
          </View>
          <Text className="text-gray-400 text-xs mt-1">
            {Math.round(progress)}%
          </Text>
        </View>
      )}

      {/* Downloaded indicator */}
      {downloaded && (
        <Text className="text-green-500 text-xs mt-1">
          Downloaded
        </Text>
      )}
    </View>
  );
};

export default VideoDownloadButton;
```

### 3. Managing Downloads in a Dedicated Screen

The Downloads screen lets users view and manage their downloaded content:

```tsx
// Simplified example from Downloads screen
import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, Alert } from 'react-native';
import { useDownload } from '../context/DownloadContext';
import { CheckCircleIcon, TrashIcon } from 'react-native-heroicons/outline';

const DownloadsScreen = () => {
  const { downloadedVideos, deleteDownload } = useDownload();
  const [editMode, setEditMode] = useState(false);
  const [selectedVideos, setSelectedVideos] = useState([]);

  // Handle deletion of a single video
  const handleDelete = (videoId) => {
    Alert.alert(
      "Delete Download",
      "Are you sure you want to delete this download?",
      [
        { text: "Cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => deleteDownload(videoId)
        }
      ]
    );
  };

  // Handle bulk deletion
  const handleBulkDelete = () => {
    if (selectedVideos.length === 0) return;
    
    Alert.alert(
      "Delete Downloads",
      `Delete ${selectedVideos.length} video(s)?`,
      [
        { text: "Cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            // Delete each selected video
            for (const id of selectedVideos) {
              await deleteDownload(id);
            }
            setSelectedVideos([]);
            setEditMode(false);
          }
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-black p-4">
      {/* Header with edit toggle */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-white text-2xl font-bold">Downloads</Text>
        
        {downloadedVideos.length > 0 && (
          <Pressable onPress={() => setEditMode(!editMode)}>
            <Text className="text-red-600">{editMode ? 'Done' : 'Edit'}</Text>
          </Pressable>
        )}
      </View>

      {/* Edit mode controls */}
      {editMode && downloadedVideos.length > 0 && (
        <View className="flex-row justify-end mb-4">
          {selectedVideos.length > 0 && (
            <Pressable 
              className="bg-red-600 px-4 py-2 rounded"
              onPress={handleBulkDelete}
            >
              <Text className="text-white">Delete Selected ({selectedVideos.length})</Text>
            </Pressable>
          )}
        </View>
      )}

      {/* Downloaded videos list */}
      <FlatList
        data={downloadedVideos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-gray-900 rounded p-4 mb-4">
            <Text className="text-white font-bold text-lg">{item.title}</Text>
            <Text className="text-gray-400">{item.downloadSize} • {item.duration}</Text>
            
            <View className="flex-row justify-between mt-4">
              {editMode ? (
                <Pressable
                  onPress={() => {
                    if (selectedVideos.includes(item.id)) {
                      setSelectedVideos(selectedVideos.filter(id => id !== item.id));
                    } else {
                      setSelectedVideos([...selectedVideos, item.id]);
                    }
                  }}
                >
                  <View className={`w-6 h-6 rounded-full border ${
                    selectedVideos.includes(item.id) ? 'bg-red-600 border-red-600' : 'border-white'
                  }`}>
                    {selectedVideos.includes(item.id) && <CheckCircleIcon size={16} color="white" />}
                  </View>
                </Pressable>
              ) : (
                <Pressable 
                  className="bg-white py-2 px-4 rounded-full"
                  onPress={() => {/* Play video */}}
                >
                  <Text className="text-black font-bold">Play</Text>
                </Pressable>
              )}
              
              {!editMode && (
                <Pressable onPress={() => handleDelete(item.id)}>
                  <TrashIcon size={24} color="white" />
                </Pressable>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="items-center justify-center py-12">
            <Text className="text-white text-lg mb-2">No Downloads</Text>
            <Text className="text-gray-400 text-center mb-6">
              Videos you download will appear here for offline viewing.
            </Text>
          </View>
        )}
      />
    </View>
  );
};
```

### 4. Key Concepts to Understand

- **Context API**: We use React Context to share download state across the app
- **AsyncStorage**: Persists download information between app sessions
- **Expo FileSystem**: Handles file operations like downloading and deleting files
- **Progress Tracking**: Updates download progress in real-time
- **Multiple Download States**: Manages different states (not downloaded, downloading, downloaded)

### 5. Implementation Tips

- Always check if files exist before accessing them
- Provide visual feedback during downloads with progress indicators
- Handle errors gracefully with try/catch blocks
- Clean up files when deleting downloads to free up storage
- Use human-readable file sizes for better user experience

By following this pattern, you can implement a robust download system in your own React Native apps!

## 🎭 UI Architecture

The app follows a clean architecture with:
- Tab-based navigation (Home, Explore, Downloads, Profile)
- File-based routing with Expo Router
- Context API for state management
- SafeArea handling for all screens except Home (for immersive experience)
- Netflix-style gradient overlays and animations

## 🎨 Styling with NativeWind

This app uses NativeWind for styling. You can use Tailwind CSS classes directly in components:

```tsx
<View className="bg-blue-500 p-4 rounded-lg">
  <Text className="text-white">Hello, World!</Text>
</View>
```

## 🧰 Project Structure

```
app/
├── (tabs)/                 # Tab screens
│   ├── _layout.tsx         # Tab navigation layout
│   ├── index.tsx           # Home screen
│   ├── explore.tsx         # Explore screen
│   ├── downloads.tsx       # Downloads screen
│   └── profile.tsx         # Profile screen
├── video/                  # Video-related screens
│   ├── _layout.tsx         # Video navigation layout
│   └── [id].tsx            # Video detail screen
├── components/             # Reusable components
│   ├── VideoPlayer.tsx     # Video player component
│   ├── VideoCard.tsx       # Video card component
│   ├── VideoRow.tsx        # Horizontal video list
│   └── ...
├── context/                # Context providers
│   └── DownloadContext.tsx # Download state management
├── data/                   # Data models and constants
│   └── videos.tsx          # Video data
└── _layout.tsx             # Root layout
```

## 📋 Development Guidelines

- Use SafeAreaView for all screens except the home screen (for immersive experience)
- Follow the Netflix design patterns for consistency
- Use the DownloadContext for all download-related operations
- Use Expo Router for navigation between screens

Thank you for checking out this Netflix-inspired streaming app! Feel free to contribute or customize it for your needs.

## 📱 Contact

Feel free to reach out if you have any questions or feedback:

- Twitter: [Twitter](https://x.com/owusu2255)
- LinkedIn: [LinkedIn](https://www.linkedin.com/in/okenneth/)
- GitHub: [Github](https://github.com/Owusu1946)
- Email: [Email](mailto:owusukenneth77@gmail.com)
- WhatsApp: [+233559182794](https://wa.me/233559182794)
