import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SchoolAuth() {
  const router = useRouter();

  const handleLogout = () => {
    // Perform any necessary cleanup here (e.g., clearing local storage)
    // For demonstration, we'll just navigate to the login screen
    Alert.alert('Logout', 'You have been logged out.');
    router.replace('/login'); // Adjust the path to your login screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>School Authority Dashboard</Text>
      <Text style={styles.subtitle}>Manage student attendance and notifications</Text>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => {
          try {
            router.push('/school_auth/Recordscan'); // Fixed path for school scanner
          } catch (error) {
            console.error('Navigation error:', error);
            Alert.alert('Error', 'Failed to navigate to School Scanner.');
          }
        }}
      >
        <Text style={styles.buttonText}>📱 Scan Student QR Code</Text>
        <Text style={styles.buttonSubText}>Record student presence and notify parents</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.inOutButton]} 
        onPress={() => {
          try {
            router.push('./InOutScanner'); // Navigate to IN/OUT scanner
          } catch (error) {
            console.error('Navigation error:', error);
            Alert.alert('Error', 'Failed to navigate to IN/OUT Scanner.');
          }
        }}
      >
        <Text style={styles.buttonText}>🚪 Student IN/OUT Scanner</Text>
        <Text style={styles.buttonSubText}>Record student entry and exit times</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.secondaryButton]} 
        onPress={() => {
          Alert.alert(
            'View Reports',
            'Scan history and reports feature coming soon!',
            [{ text: 'OK' }]
          );
        }}
      >
        <Text style={styles.buttonText}>📊 View Scan Reports</Text>
        <Text style={styles.buttonSubText}>See student attendance records</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.secondaryButton]} 
        onPress={() => {
          Alert.alert(
            'Notifications',
            'View all sent notifications feature coming soon!',
            [{ text: 'OK' }]
          );
        }}
      >
        <Text style={styles.buttonText}>🔔 View Notifications</Text>
        <Text style={styles.buttonSubText}>See all parent notifications sent</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.logoutButton]} 
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>🚪 Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 20,
    marginVertical: 8,
    borderRadius: 12,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  secondaryButton: {
    backgroundColor: '#3498db',
  },
  inOutButton: {
    backgroundColor: '#e67e22',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  buttonSubText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    textAlign: 'center',
  },
});
