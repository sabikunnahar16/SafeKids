import { Link } from "expo-router";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export function Overlay() {
  return (
    <View style={styles.container}>
      {/* Header with title and back button */}
      <View style={styles.header}>
        <Link href="/school_auth/SchoolAuth" asChild>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </Link>
        <Text style={styles.title}>School QR Scanner</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Scanning frame */}
      <View style={styles.scanFrame}>
        <View style={styles.cornerTopLeft} />
        <View style={styles.cornerTopRight} />
        <View style={styles.cornerBottomLeft} />
        <View style={styles.cornerBottomRight} />
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>School Authority Scanner</Text>
        <Text style={styles.instructions}>
          Point your camera at a student's QR code to scan
        </Text>
        <Text style={styles.subInstructions}>
          This will notify parents that their child has been scanned at school
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  placeholder: {
    width: 80,
  },
  scanFrame: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cornerTopLeft: {
    position: "absolute",
    top: "40%",
    left: "20%",
    width: 40,
    height: 40,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderColor: "#4CAF50",
  },
  cornerTopRight: {
    position: "absolute",
    top: "40%",
    right: "20%",
    width: 40,
    height: 40,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderColor: "#4CAF50",
  },
  cornerBottomLeft: {
    position: "absolute",
    bottom: "40%",
    left: "20%",
    width: 40,
    height: 40,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderColor: "#4CAF50",
  },
  cornerBottomRight: {
    position: "absolute",
    bottom: "40%",
    right: "20%",
    width: 40,
    height: 40,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderColor: "#4CAF50",
  },
  instructionsContainer: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  instructionsTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  instructions: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 5,
  },
  subInstructions: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
  },
});
