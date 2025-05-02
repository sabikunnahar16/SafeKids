import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const backgroundImage = require('@/assets/images/D2115_186_139_1200.jpg');

const ParentDashboard = () => {
  const router = useRouter();

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.overlay} />
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Parent Dashboard</Text>

        <TouchableOpacity style={styles.card} onPress={() => router.push("/viewChildInfo")}>
          <Ionicons name="person" size={30} color="black" />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>View Child's Information</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push("/viewInOut" as any)}>
          <Ionicons name="time" size={30} color="black" />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>View IN/OUT Times</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push("/leaveapplication")}>
          <Ionicons name="calendar" size={30} color="black" />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Apply for Leave</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push("/TrackLeaves" as any)}>
          <Ionicons name="analytics" size={30} color="black" />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Track Leave Applications</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push("/logout")}>
          <Ionicons name="log-out-outline" size={30} color="black" />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Logout</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardContent: {
    marginLeft: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default ParentDashboard;
