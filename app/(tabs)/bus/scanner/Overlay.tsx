import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");
const BOX_SIZE = 300;
const borderRadius = 50;

export const Overlay = () => {
  const cutOutTop = height / 2 - BOX_SIZE / 2;
  const cutOutLeft = width / 2 - BOX_SIZE / 2;

  return (
    <View style={styles.container}>
      {/* Top Overlay */}
      <View style={{ ...styles.overlay, height: cutOutTop }} />

      {/* Middle Row */}
      <View style={{ flexDirection: "row", height: BOX_SIZE }}>
        {/* Left of Cutout */}
        <View style={{ ...styles.overlay, width: cutOutLeft }} />
        
        {/* Transparent Cut-out */}
        <View
          style={{
            width: BOX_SIZE,
            height: BOX_SIZE,
            borderRadius,
            backgroundColor: "transparent",
            borderWidth: 2,
            borderColor: "white",
          }}
        />
        
        {/* Right of Cutout */}
        <View style={{ ...styles.overlay, width: cutOutLeft }} />
      </View>

      {/* Bottom Overlay */}
      <View style={{ ...styles.overlay, flex: 1 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
