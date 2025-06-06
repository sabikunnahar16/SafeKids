import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BusScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Bus Screen</Text>
      {/* Add your bus screen content here */}
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
});
