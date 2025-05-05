import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function QRCodeGenerator() {
  const [studentId, setStudentId] = useState('');
  const [qrCodeRef, setQrCodeRef] = useState<QRCode | null>(null);

  const handleDownloadQRCode = async () => {
    if (!qrCodeRef) return;

    try {
      qrCodeRef.toDataURL((data) => {
        const uri = data;
        const filePath = `${FileSystem.cacheDirectory}student-qr-code.png`;
        FileSystem.writeAsStringAsync(filePath, uri, { encoding: FileSystem.EncodingType.Base64 })
          .then(() => Sharing.shareAsync(filePath))
          .then(() => Alert.alert('Success', 'QR Code downloaded and ready to share.'))
          .catch(() => Alert.alert('Error', 'Failed to download QR Code.'));
      });
      const filePath = `${FileSystem.cacheDirectory}student-qr-code.png`;
      await FileSystem.writeAsStringAsync(filePath, uri, { encoding: FileSystem.EncodingType.Base64 });
      await Sharing.shareAsync(filePath);
      Alert.alert('Success', 'QR Code downloaded and ready to share.');
    } catch (error) {
      Alert.alert('Error', 'Failed to download QR Code.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>QR Code Generator</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Student ID"
        value={studentId}
        onChangeText={setStudentId}
      />
      {studentId ? (
        <QRCode
          value={studentId}
          size={200}
          getRef={(ref) => setQrCodeRef(ref)}
        />
      ) : (
        <Text style={styles.placeholder}>Enter a Student ID to generate QR Code</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={handleDownloadQRCode}>
        <Text style={styles.buttonText}>Download QR Code</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    width: '80%',
    marginBottom: 20,
  },
  placeholder: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});
