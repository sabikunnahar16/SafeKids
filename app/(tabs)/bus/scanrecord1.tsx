import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../../constants/FirebaseConfig';
import * as SMS from 'expo-sms';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ScanRecord() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleQRCodeRead = async (e: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    let studentData;
    try {
      studentData = JSON.parse(e.data);
    } catch {
      Alert.alert('Invalid QR', 'This QR code is not valid for a student ID card.');
      setTimeout(() => setScanned(false), 2000);
      return;
    }

    try {
      const snapshot = await getDocs(collection(firestore, "students"));
      let found: any = null;
      snapshot.forEach(docu => {
        const d = docu.data();
        if (d.idNumber === studentData.idNumber) found = d;
      });

      if (!found) {
        Alert.alert('Not found', 'Student not found in database.');
        setTimeout(() => setScanned(false), 2000);
        return;
      }

      const message = `Dear parents, your child is in the bus and safe. Please pray for us.`;
      if (found.parentContact) {
        const isAvailable = await SMS.isAvailableAsync();
        if (isAvailable) {
          await SMS.sendSMSAsync([found.parentContact], message);
          Alert.alert('Success', 'SMS sent to parent!');
        } else {
          Alert.alert('SMS Not Available', 'This device cannot send SMS.');
        }
      } else {
        Alert.alert('No Contact', 'No parent contact found for this student.');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to process scan.');
    }
    setTimeout(() => setScanned(false), 2000);
  };

  if (hasPermission === null) {
    return <View style={styles.center}><Text>Requesting camera permission...</Text></View>;
  }

  if (hasPermission === false) {
    return <View style={styles.center}><Text>No access to camera</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan Record</Text>
      <Text style={styles.subtitle}>Scan a student ID card QR code</Text>
      <View style={styles.scannerBox}>
        <QRCodeScanner
          onRead={handleQRCodeRead}
          reactivate={true}
          reactivateTimeout={2000}
          showMarker={true}
          topContent={<Text style={{ color: '#fff' }}>Align QR code within frame</Text>}
          cameraStyle={StyleSheet.absoluteFillObject}
        />
      </View>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.backBtnText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 20,
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563EB',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 24,
  },
  scannerBox: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  backBtn: {
    flexDirection: 'row',
    backgroundColor: '#6B7280',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
});