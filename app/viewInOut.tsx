import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ViewInOut = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>View IN/OUT Times</Text>
      {/* Add content for viewing IN/OUT times */}
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

export default ViewInOut;
