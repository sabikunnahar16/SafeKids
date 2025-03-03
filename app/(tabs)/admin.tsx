import React from 'react';
import { useRouter } from 'expo-router';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdminScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <ScrollView>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Manage Class and Student Details</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push("../class")}>
            <Text style={styles.buttonText}>View/Add/Update Classes</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Parent Credentials</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push("../SchoolEntries")}>
            <Text style={styles.buttonText}>Manage Parent Accounts</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Student Attendance</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push("../attendance")}>
            <Text style={styles.buttonText}>View IN/OUT Times</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Leave Applications</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push("../LeavesScreen")}>
            <Text style={styles.buttonText}>Approve/Reject Leaves</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1E90FF',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A4A4A',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
