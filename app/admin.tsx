import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AdminPage = () => {
  return (
    <ImageBackground source={require('@/assets/images/benefits-of-school-security-systems.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>SchoolSecuritySystem_Admin</Text>
        <ScrollView>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="school-outline" size={24} color="green" />
            <Text style={styles.menuText}>Class</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="people-outline" size={24} color="blue" />
            <Text style={styles.menuText}>Student</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="bus-outline" size={24} color="red" />
            <Text style={styles.menuText}>Bus</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="time-outline" size={24} color="orange" />
            <Text style={styles.menuText}>Bus Entries</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="school-outline" size={24} color="purple" />
            <Text style={styles.menuText}>School Entries</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, styles.highlighted]}>
            <Ionicons name="calendar-outline" size={24} color="teal" />
            <Text style={styles.menuText}>Leaves</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="log-out-outline" size={24} color="gray" />
            <Text style={styles.menuText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
  },
  menuText: {
    fontSize: 18,
    marginLeft: 10,
    color: '#333',
  },
  highlighted: {
    backgroundColor: '#d3d3d3',
  },
});

export default AdminPage;
