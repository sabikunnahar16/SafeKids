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

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => {
          try {
            router.push('./ScanRecord' as any); // Ensure this path exists
          } catch (error) {
            console.error('Navigation error:', error);
            Alert.alert('Error', 'Failed to navigate to ScanRecord.');
          }
        }}
      >
        <Text style={styles.buttonText}>Scan</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.logoutButton]} 
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Logout</Text>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    width: 250,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#f44336', // Red color for logout
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});
