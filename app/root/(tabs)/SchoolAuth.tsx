import React from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SchoolAuthorityScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>School Authority Dashboard</Text>
      <ScrollView>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>QR Code Scanning</Text>
          <Button title="Scan Student QR Code" onPress={() => {}} />
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Attendance Records</Text>
          <Button title="Record IN/OUT Times" onPress={() => {}} />
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
    color: '#FF6347',
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
});
