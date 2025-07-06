import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { firestore } from '../../../constants/FirebaseConfig';

const TestInOutCreation = () => {
  const createTestRecord = async () => {
    try {
      const testRecord = {
        studentId: 'STD001',
        studentName: 'Test Student',
        type: 'IN',
        timestamp: Timestamp.fromDate(new Date()),
        location: 'School Bus',
        scannerType: 'bus',
        recordedBy: 'Bus Driver'
      };
      
      console.log('🧪 Creating test record:', testRecord);
      const docRef = await addDoc(collection(firestore, 'inOutRecords'), testRecord);
      console.log('✅ Test record created with ID:', docRef.id);
      
      Alert.alert('Success', `Test IN/OUT record created with ID: ${docRef.id}`);
    } catch (error) {
      console.error('❌ Error creating test record:', error);
      Alert.alert('Error', 'Failed to create test record: ' + (error as any).message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test IN/OUT Record Creation</Text>
      <TouchableOpacity style={styles.button} onPress={createTestRecord}>
        <Text style={styles.buttonText}>Create Test Record</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2563EB',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TestInOutCreation;
