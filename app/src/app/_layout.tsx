import { useCallback } from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  useFonts,
  NotoSansThai_400Regular,
  NotoSansThai_500Medium,
  NotoSansThai_600SemiBold,
  NotoSansThai_700Bold,
} from "@expo-google-fonts/noto-sans-thai";
import { StoreProvider } from "@/data/store";
import { color } from "@/theme/tokens";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    NotoSansThai_400Regular,
    NotoSansThai_500Medium,
    NotoSansThai_600SemiBold,
    NotoSansThai_700Bold,
  });

  const onReady = useCallback(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <StoreProvider>
        <View style={{ flex: 1, backgroundColor: color.bg }} onLayout={onReady}>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShadowVisible: false,
              headerStyle: { backgroundColor: color.bg },
              headerTitleStyle: {
                fontFamily: "NotoSansThai_600SemiBold",
                fontSize: 17,
                color: color.ink,
              },
              headerTintColor: color.primaryDark,
              contentStyle: { backgroundColor: color.bg },
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="caregiver/[id]"
              options={{ title: "โปรไฟล์ผู้ดูแล", headerBackTitle: "กลับ" }}
            />
            <Stack.Screen
              name="book/[caregiverId]"
              options={{ title: "จองผู้ดูแล", presentation: "modal" }}
            />
            <Stack.Screen
              name="booking/[id]"
              options={{ title: "รายละเอียดการจอง", headerBackTitle: "กลับ" }}
            />
          </Stack>
        </View>
      </StoreProvider>
    </SafeAreaProvider>
  );
}
