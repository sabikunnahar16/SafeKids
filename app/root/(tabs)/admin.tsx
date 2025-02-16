import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function AdminScreen() {
  const navigation = useNavigation();

  const options = [
    { name: 'Class', screen: 'ClassScreen', icon: 'school-outline', color: 'green' },
    { name: 'Student', screen: 'StudentScreen', icon: 'people-outline', color: 'blue' },
    { name: 'Bus', screen: 'BusScreen', icon: 'bus-outline', color: 'red' },
    { name: 'School Entries', screen: 'SchoolEntriesScreen', icon: 'school-outline', color: 'purple' },
    { name: 'Leaves', screen: 'LeavesScreen', icon: 'calendar-outline', color: 'teal' },
    { name: 'Logout', screen: 'Login', icon: 'log-out-outline', color: 'gray' },
  ];

  return (
    <ImageBackground source={require('@/assets/images/benefits-of-school-security-systems.jpg')} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <ScrollView>
          {options.map((option, index) => (
            <TouchableOpacity key={index} style={styles.card} onPress={() => navigation.navigate(option.screen)}>
              <Ionicons name={option.icon} size={24} color={option.color} />
              <Text style={styles.cardTitle}>{option.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Add overlay to make text readable
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginLeft: 16,
  },
});
