import { SplashScreen, Stack } from "expo-router";

import "./globals.css"
import {useFonts} from "expo-font";
import { useEffect } from "react";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Rubik-Bold": require("../assets/fonts/Rubik-Bold.ttf"),
    "Rubik-ExtraBold": require("../assets/fonts/Rubik-ExtraBold.ttf"),
    "Rubik-Light": require("../assets/fonts/Rubik-Light.ttf"),
    "Rubik-Medium": require("../assets/fonts/Rubik-Medium.ttf"),
    "Rubik-Regular": require("../assets/fonts/Rubik-Regular.ttf"), // Fixed typo
    "Rubik-SemiBold": require("../assets/fonts/Rubik-SemiBold.ttf"), // Fixed typo
  });

  // Hide the splash screen when fonts are loaded
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]); // Corrected the dependency array syntax

  // Return null while fonts are loading
  if (!fontsLoaded) return null;
  return <Stack screenOptions={{headerShown:false}} />;
}
