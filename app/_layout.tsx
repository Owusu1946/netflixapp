import { Stack } from "expo-router";
import "../global.css";
import { DownloadProvider } from "./context/DownloadContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <DownloadProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen 
            name="video/[id]" 
            options={{
              animation: 'slide_from_right',
              contentStyle: { backgroundColor: '#000' },
            }} 
          />
        </Stack>
      </DownloadProvider>
    </SafeAreaProvider>
  );
}
