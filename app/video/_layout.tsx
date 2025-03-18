import { Stack } from "expo-router";

export default function VideoLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: {
          backgroundColor: '#000',
        }
      }}
    />
  );
} 