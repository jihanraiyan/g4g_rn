import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FontAwesome5 } from "@expo/vector-icons";

export default function Layout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen 
            name="(tabs)" 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="games/4096" 
            options={{ 
              title: "4096!",
              headerStyle: {
                backgroundColor: '#faf8ef',
              },
              headerTintColor: '#776e65',
            }} 
          />
        </Stack>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#E8E8E8',
        },
        tabBarActiveTintColor: '#82D9C8',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="home" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Leaderboard",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="trophy" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="daily-goals"
        options={{
          title: "Daily Goals",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="star" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user" size={20} color={color} />
          ),
        }}
      />
    </Tabs>
  );
} 