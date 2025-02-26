import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
//import { SafeAreaView } from 'react-native-safe-area-context';

const backgroundImage = require('@/assets/images/D2115_186_139_1200.jpg'); // Replace with your image path

const ParentDashboard = () => {
  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.overlay} />
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Parent Dashboard</Text>
        
        <TouchableOpacity style={styles.card}>
          <Ionicons name="person" size={30} color="black" />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>View Child's Information</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.card}>
          <Ionicons name="time" size={30} color="black" />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>View IN/OUT Times</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.card}>
          <Ionicons name="calendar" size={30} color="black" />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Apply for Leave</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.card}>
          <Ionicons name="analytics" size={30} color="black" />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Track Leave Applications</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Darker overlay for better readability
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slight transparency for the card
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardContent: {
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A4A4A',
  },
});

export default ParentDashboard;
