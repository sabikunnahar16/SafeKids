import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCodeScanner from 'react-native-qrcode-scanner';
import * as SMS from 'expo-sms';

export default function StudentsScreen() {
  const [scannedData, setScannedData] = useState('');

interface QRCodeEvent {
    data: string;
}

const handleQRCodeScanned = async (e: QRCodeEvent): Promise<void> => {
    const studentId: string = e.data;
    setScannedData(studentId);

    // Simulate sending a message to the parent's contact number
    const isAvailable: boolean = await SMS.isAvailableAsync();
    if (isAvailable) {
        const { result }: { result: string } = await SMS.sendSMSAsync(
            ['+1234567890'], // Replace with parent's contact number
            `Student with ID ${studentId} has been scanned.`
        );
        Alert.alert('Message Sent', `Notification sent for Student ID: ${studentId}`);
    } else {
        Alert.alert('Error', 'SMS service is not available on this device.');
    }
};

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Students Screen</Text>
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
