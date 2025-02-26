// AdminScreen.js
import React from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdminScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <ScrollView>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Manage Class and Student Details</Text>
          <Button title="View/Add/Update Classes" onPress={() => {}} />
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Parent Credentials</Text>
          <Button title="Manage Parent Accounts" onPress={() => {}} />
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Student Attendance</Text>
          <Button title="View IN/OUT Times" onPress={() => {}} />
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Leave Applications</Text>
          <Button title="Approve/Reject Leaves" onPress={() => {}} />
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
});
