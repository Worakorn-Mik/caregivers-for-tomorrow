import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { color } from "@/theme/tokens";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: color.bg },
        headerTitleStyle: {
          fontFamily: "NotoSansThai_700Bold",
          fontSize: 20,
          color: color.ink,
        },
        headerTitleAlign: "left",
        tabBarActiveTintColor: color.primary,
        tabBarInactiveTintColor: color.faint,
        tabBarStyle: {
          backgroundColor: color.surface,
          borderTopColor: color.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontFamily: "NotoSansThai_500Medium", fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "ค้นหาผู้ดูแล",
          tabBarLabel: "ค้นหา",
          tabBarIcon: ({ color: c, size }) => (
            <Ionicons name="search" size={size} color={c} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "การจองของฉัน",
          tabBarLabel: "การจอง",
          tabBarIcon: ({ color: c, size }) => (
            <Ionicons name="calendar" size={size} color={c} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "บัญชี",
          tabBarLabel: "บัญชี",
          tabBarIcon: ({ color: c, size }) => (
            <Ionicons name="person-circle" size={size} color={c} />
          ),
        }}
      />
    </Tabs>
  );
}
