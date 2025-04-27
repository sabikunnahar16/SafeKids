import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import Sidebar from "../../app/(tabs)/admin"; // Corrected import path

export default function Layout() {
  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <Sidebar />
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </View>
  );
}
