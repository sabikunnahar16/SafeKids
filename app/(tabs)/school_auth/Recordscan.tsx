import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCodeScanner from 'react-native-qrcode-scanner';
import * as SMS from 'expo-sms';

export default function ScanRecord() {
  const [scannedData, setScannedData] = useState('');

  interface QRCodeEvent {
    data: string;
  }

  interface SMSResult {
    result: string;
  }

  const handleQRCodeScanned = async (e: QRCodeEvent): Promise<void> => {
    const studentId: string = e.data; // Assuming the QR code contains the student ID
    setScannedData(studentId);

    // Get the current time
    const currentTime: string = new Date().toLocaleTimeString();

    // Simulate sending a message to the parent's contact number
    const isAvailable: boolean = await SMS.isAvailableAsync();
    if (isAvailable) {
      const { result }: SMSResult = await SMS.sendSMSAsync(
        ['+1234567890'], // Replace with parent's contact number from signup
        `Dear parents, Your child has reached school at ${currentTime}.`
      );
      Alert.alert('Message Sent', `Notification sent for Student ID: ${studentId}`);
    } else {
      Alert.alert('Error', 'SMS service is not available on this device.');
    }

    // Simulate storing the in/out time for the parent's dashboard
    storeAttendanceRecord(studentId, currentTime);
  };

  interface AttendanceRecord {
    studentId: string;
    time: string;
  }

  const storeAttendanceRecord = (studentId: string, time: string): void => {
    // Replace this with actual backend API or local storage logic
    console.log(`Attendance recorded: Student ID: ${studentId}, Time: ${time}`);
    Alert.alert('Attendance Recorded', `Student ID: ${studentId}, Time: ${time}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Scan Record Screen</Text>
      <QRCodeScanner
        onRead={handleQRCodeScanned}
        topContent={<Text style={styles.instruction}>Scan a Student's QR Code</Text>}
      />
      {scannedData ? (
        <Text style={styles.scannedText}>Scanned Student ID: {scannedData}</Text>
      ) : null}
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
  instruction: {
    fontSize: 16,
    marginBottom: 10,
  },
  scannedText: {
    fontSize: 18,
    color: '#333',
    marginTop: 20,
  },
});
