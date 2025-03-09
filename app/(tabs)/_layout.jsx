import { Tabs } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
        },
        tabBarActiveTintColor: '#5BCCA6',
        tabBarInactiveTintColor: '#718096',
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
          title: "Goals",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="tasks" size={20} color={color} />
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