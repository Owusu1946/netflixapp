import React, { useState } from 'react';
import { View, Text, FlatList, Image, Pressable, Alert, Dimensions } from 'react-native';
import { useDownload } from '../context/DownloadContext';
import { router } from 'expo-router';
import { CheckCircleIcon, PlayIcon, TrashIcon } from 'react-native-heroicons/outline';
import { useNetInfo } from '@react-native-community/netinfo';
import { Video } from '../data/videos';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 32; // Full width minus padding

export default function DownloadsScreen() {
  const { downloadedVideos, deleteDownload } = useDownload();
  const netInfo = useNetInfo();
  const [editMode, setEditMode] = useState(false);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  
  const isOffline = !netInfo.isConnected;
  
  const handlePlay = (videoId: string) => {
    router.push(`/video/${videoId}`);
  };
  
  const handleDelete = (videoId: string) => {
    Alert.alert(
      "Delete Download",
      "Are you sure you want to delete this download?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => deleteDownload(videoId)
        }
      ]
    );
  };
  
  const handleBulkDelete = () => {
    if (selectedVideos.length === 0) return;
    
    Alert.alert(
      "Delete Downloads",
      `Are you sure you want to delete ${selectedVideos.length} download${selectedVideos.length > 1 ? 's' : ''}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
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
  
  const toggleVideoSelection = (videoId: string) => {
    if (selectedVideos.includes(videoId)) {
      setSelectedVideos(selectedVideos.filter(id => id !== videoId));
    } else {
      setSelectedVideos([...selectedVideos, videoId]);
    }
  };
  
  const toggleEditMode = () => {
    if (editMode) {
      setSelectedVideos([]);
    }
    setEditMode(!editMode);
  };
  
  const selectAll = () => {
    if (selectedVideos.length === downloadedVideos.length) {
      setSelectedVideos([]);
    } else {
      setSelectedVideos(downloadedVideos.map(video => video.id));
    }
  };
  
  const renderItem = ({ item }: { item: Video }) => (
    <Pressable
      className={`flex-row bg-gray-900 rounded-lg mb-4 overflow-hidden ${editMode ? 'pr-4' : ''}`}
      onPress={() => editMode ? toggleVideoSelection(item.id) : handlePlay(item.id)}
      onLongPress={() => !editMode && setEditMode(true)}
    >
      <Image
        source={{ uri: item.thumbnail }}
        className="w-24 h-32"
      />
      
      <View className="flex-1 p-3 justify-between">
        <View>
          <Text className="text-white font-semibold text-base">{item.title}</Text>
          <Text className="text-gray-400 text-xs mt-1">
            {item.duration} • {item.downloadSize || 'Unknown size'}
          </Text>
          <Text className="text-gray-500 text-xs mt-1 line-clamp-2" numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        
        {!editMode && (
          <View className="flex-row justify-between items-center mt-2">
            <Pressable
              className="bg-white rounded-full py-1 px-4 flex-row items-center"
              onPress={(e) => {
                e.stopPropagation();
                handlePlay(item.id);
              }}
            >
              <PlayIcon size={16} color="black" />
              <Text className="text-black ml-1 font-semibold">Play</Text>
            </Pressable>
            
            <Pressable
              className="p-2"
              onPress={(e) => {
                e.stopPropagation();
                handleDelete(item.id);
              }}
            >
              <TrashIcon size={20} color="white" />
            </Pressable>
          </View>
        )}
      </View>
      
      {editMode && (
        <View className="self-center mr-2">
          <Pressable onPress={() => toggleVideoSelection(item.id)}>
            <View className={`w-6 h-6 rounded-full border ${
              selectedVideos.includes(item.id) 
                ? 'bg-red-600 border-red-600' 
                : 'border-gray-400'
            } items-center justify-center`}>
              {selectedVideos.includes(item.id) && (
                <CheckCircleIcon size={14} color="white" />
              )}
            </View>
          </Pressable>
        </View>
      )}
    </Pressable>
  );
  
  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top', 'right', 'left']}>
      <View className="flex-1 px-4 pt-2">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-white text-xl font-bold">Downloads</Text>
          
          {downloadedVideos.length > 0 ? (
            <Pressable onPress={toggleEditMode}>
              <Text className="text-red-600 font-semibold">
                {editMode ? 'Done' : 'Edit'}
              </Text>
            </Pressable>
          ) : null}
        </View>
        
        {isOffline && (
          <View className="bg-blue-900/40 p-3 rounded-lg mb-4">
            <Text className="text-white text-center">
              You're offline. Only downloaded videos are available.
            </Text>
          </View>
        )}
        
        {editMode && downloadedVideos.length > 0 && (
          <View className="flex-row justify-between mb-4">
            <Pressable onPress={selectAll}>
              <Text className="text-white font-semibold">
                {selectedVideos.length === downloadedVideos.length ? 'Deselect All' : 'Select All'}
              </Text>
            </Pressable>
            
            {selectedVideos.length > 0 && (
              <Pressable onPress={handleBulkDelete}>
                <Text className="text-red-600 font-semibold">
                  Delete ({selectedVideos.length})
                </Text>
              </Pressable>
            )}
          </View>
        )}
        
        <FlatList
          data={downloadedVideos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={() => (
            <View className="items-center justify-center py-12">
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=500' }}
                className="w-40 h-40 rounded-lg mb-6 opacity-50"
              />
              <Text className="text-white text-xl font-semibold mb-2">No Downloads</Text>
              <Text className="text-gray-400 text-center mb-6 px-8">
                Videos you download will appear here for offline viewing.
              </Text>
              <Pressable
                className="bg-red-600 py-2 px-6 rounded-sm"
                onPress={() => {
                  // Use the tabs navigation to go to the home tab
                  const firstTab = document.querySelector('[role="tab"]') as HTMLElement;
                  if (firstTab) firstTab.click();
                }}
              >
                <Text className="text-white font-semibold">Find Something to Download</Text>
              </Pressable>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
} 