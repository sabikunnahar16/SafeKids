import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";

export default function BusDriverDashboard() {
  const router = useRouter();

  return (
    <ImageBackground source={require("@/assets/images/hikaique-68427.jpg")} style={styles.bgImage} resizeMode="cover">
      <View style={styles.overlay}>
        <Text style={styles.title}>Bus Driver Dashboard</Text>
        <View style={styles.cardRow}>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/(tabs)/bus/QRScanner' as any)}>
            <Ionicons name="qr-code-outline" size={48} color="#2563EB" />
            <Text style={styles.cardTitle}>Scan Record</Text>
            <Text style={styles.cardDesc}>Scan student bus ID card QR codes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/(tabs)/bus/BusSchedule' as any)}>
            <Ionicons name="bus-outline" size={48} color="#2563EB" />
            <Text style={styles.cardTitle}>Bus Schedule</Text>
            <Text style={styles.cardDesc}>See your assigned bus schedule</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => router.push('/logout')}>
          <Ionicons name="log-out-outline" size={24} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.70)', // More transparent overlay
    padding: 24,
  },
  container: {
    flex: 1,
    backgroundColor: '#f4f6fa',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#153370',
    marginBottom: 32,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.85)', // More transparent card
    borderRadius: 18,
    padding: 28,
    marginHorizontal: 12,
    alignItems: 'center',
    width: 160,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 14,
    color: '#153370',
    textAlign: 'center',
    opacity: 0.7,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F43F5E',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginTop: 18,
    alignSelf: 'center',
    shadowColor: '#F43F5E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
});
