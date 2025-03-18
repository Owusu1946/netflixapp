import { Tabs } from "expo-router";
import { HomeIcon, MagnifyingGlassIcon, ArrowDownTrayIcon, UserIcon } from "react-native-heroicons/outline";
import { HomeIcon as HomeIconSolid, MagnifyingGlassIcon as MagnifyingGlassIconSolid, 
  ArrowDownTrayIcon as ArrowDownTrayIconSolid, UserIcon as UserIconSolid } from "react-native-heroicons/solid";
import { useColorScheme, View } from "react-native";
import Colors from "@/constants/Colors";

export default function TabsLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarStyle: {
          backgroundColor: '#121212',
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: 2,
        },
        tabBarInactiveTintColor: 'gray',
        tabBarIconStyle: {
          marginBottom: -2,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => 
            focused ? 
              <View className="items-center justify-center">
                <HomeIconSolid size={24} color={color} />
              </View> : 
              <View className="items-center justify-center">
                <HomeIcon size={24} color={color} />
              </View>,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => 
            focused ? 
              <View className="items-center justify-center">
                <MagnifyingGlassIconSolid size={24} color={color} />
              </View> : 
              <View className="items-center justify-center">
                <MagnifyingGlassIcon size={24} color={color} />
              </View>,
        }}
      />
      <Tabs.Screen
        name="downloads"
        options={{
          title: 'Downloads',
          tabBarIcon: ({ color, focused }) => 
            focused ? 
              <View className="items-center justify-center">
                <ArrowDownTrayIconSolid size={24} color={color} />
              </View> : 
              <View className="items-center justify-center">
                <ArrowDownTrayIcon size={24} color={color} />
              </View>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => 
            focused ? 
              <View className="items-center justify-center">
                <UserIconSolid size={24} color={color} />
              </View> : 
              <View className="items-center justify-center">
                <UserIcon size={24} color={color} />
              </View>,
        }}
      />
    </Tabs>
  );
} 