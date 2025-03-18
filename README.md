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
