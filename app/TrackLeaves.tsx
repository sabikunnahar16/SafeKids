import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TrackLeaves = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Track Leave Applications</Text>
      {/* Add content for tracking leave applications */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
});

export default TrackLeaves;
