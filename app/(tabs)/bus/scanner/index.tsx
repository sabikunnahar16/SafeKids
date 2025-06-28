import { CameraView } from "expo-camera";
import { Stack } from "expo-router";
import {
  AppState,
  Linking,
  Platform,
  StatusBar,
  StyleSheet,
  Alert,
  View,
  Dimensions,
} from "react-native";
import { Overlay } from "./Overlay";
import { useEffect, useRef } from "react";

export default function ScannerScreen() {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (data && !qrLock.current) {
      qrLock.current = true;

      Alert.alert("QR Code Scanned", data, [
        {
          text: "OK",
          onPress: () => {
            qrLock.current = false;
          },
        },
      ]);

      if (data.startsWith("http")) {
        Linking.openURL(data).catch((err) =>
          console.error("Failed to open URL:", err)
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Scanner", headerShown: false }} />
      {Platform.OS === "android" ? <StatusBar hidden /> : null}

      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={handleBarcodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      />

      <Overlay />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
