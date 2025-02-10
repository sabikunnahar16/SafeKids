// ParentScreen.js
import React from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ParentScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Parent Dashboard</Text>
      <ScrollView>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Child Details</Text>
          <Button title="View Child's Information" onPress={() => {}} />
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Attendance Details</Text>
          <Button title="View IN/OUT Times" onPress={() => {}} />
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Leave Application</Text>
          <Button title="Apply for Leave" onPress={() => {}} />
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Leave Status</Text>
          <Button title="Track Leave Applications" onPress={() => {}} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#F8F8F8',
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


