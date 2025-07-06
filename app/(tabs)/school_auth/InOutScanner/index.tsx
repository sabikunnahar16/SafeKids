import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { firestore } from '../../../../constants/FirebaseConfig';

const InOutScanner = () => {
  const [studentId, setStudentId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastAction, setLastAction] = useState<'IN' | 'OUT' | null>(null);
  const [scanMode, setScanMode] = useState<'IN' | 'OUT'>('IN');
  const router = useRouter();

  const handleManualEntry = async () => {
    if (!studentId.trim()) {
      Alert.alert('Error', 'Please enter a student ID');
      return;
    }

    setIsProcessing(true);
    
    try {
      // First, check if student exists
      const studentsQuery = query(
        collection(firestore, 'students'),
        where('idNumber', '==', studentId.trim())
      );
      
      const studentSnapshot = await getDocs(studentsQuery);
      
      if (studentSnapshot.empty) {
        Alert.alert('Error', 'Student not found with ID: ' + studentId);
        setIsProcessing(false);
        return;
      }

      const studentData = studentSnapshot.docs[0].data();
      const studentName = studentData.studentName;
      const currentTime = new Date();

      // Check for recent duplicate scans (within 10 seconds)
      const recentScansQuery = query(
        collection(firestore, 'inOutRecords'),
        where('studentId', '==', studentId.trim())
      );
      
      const recentScansSnapshot = await getDocs(recentScansQuery);
      const recentScans = recentScansSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          timestamp: data.timestamp.toDate()
        };
      });

      // Sort by timestamp to get the most recent
      recentScans.sort((a: any, b: any) => b.timestamp.getTime() - a.timestamp.getTime());

      // Check if there's a recent scan within 10 seconds of the same type
      const tenSecondsAgo = new Date(currentTime.getTime() - 10000);
      const duplicateScan = recentScans.find((scan: any) => 
        scan.timestamp > tenSecondsAgo && scan.type === scanMode && scan.scannerType === 'school'
      );

      if (duplicateScan) {
        Alert.alert(
          'Duplicate Scan Detected',
          `${studentName} was already marked ${scanMode} recently at school. Please wait before scanning again.`
        );
        setIsProcessing(false);
        return;
      }

      // Create IN/OUT record
      await addDoc(collection(firestore, 'inOutRecords'), {
        studentId: studentId.trim(),
        studentName: studentName,
        type: scanMode,
        timestamp: Timestamp.fromDate(currentTime),
        location: 'School Main Gate',
        scannerType: 'school',
        recordedBy: 'School Authority'
      });

      // Create notification for parents (consistent with bus scanner)
      await addDoc(collection(firestore, 'notifications'), {
        studentId: studentId.trim(),
        studentName: studentName,
        message: `${studentName} has been marked ${scanMode} at School Main Gate at ${currentTime.toLocaleTimeString()}`,
        timestamp: Timestamp.fromDate(currentTime),
        type: 'school',
        location: 'School Main Gate',
        parentEmail: studentData.email,
        read: false,
        inOutType: scanMode,
        scannedBy: 'School Authority'
      });

      setLastAction(scanMode);
      Alert.alert(
        'Success!',
        `${studentName} marked ${scanMode} successfully at ${currentTime.toLocaleTimeString()}`,
        [
          {
            text: 'OK',
            onPress: () => {
              setStudentId('');
              setLastAction(null);
            }
          }
        ]
      );

    } catch (error) {
      console.error('Error recording IN/OUT:', error);
      Alert.alert('Error', 'Failed to record IN/OUT. Please try again.');
    }
    
    setIsProcessing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2563EB" />
        </TouchableOpacity>
        <Text style={styles.title}>Student IN/OUT Scanner</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.modeSelector}>
          <TouchableOpacity
            style={[styles.modeButton, scanMode === 'IN' && styles.modeButtonActiveIn]}
            onPress={() => setScanMode('IN')}
          >
            <Ionicons name="enter-outline" size={20} color={scanMode === 'IN' ? 'white' : '#10B981'} />
            <Text style={[styles.modeButtonText, scanMode === 'IN' && styles.modeButtonTextActive]}>
              IN
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, scanMode === 'OUT' && styles.modeButtonActiveOut]}
            onPress={() => setScanMode('OUT')}
          >
            <Ionicons name="exit-outline" size={20} color={scanMode === 'OUT' ? 'white' : '#EF4444'} />
            <Text style={[styles.modeButtonText, scanMode === 'OUT' && styles.modeButtonTextActive]}>
              OUT
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Enter Student ID:</Text>
          <TextInput
            style={styles.textInput}
            value={studentId}
            onChangeText={setStudentId}
            placeholder="Enter student ID (e.g., STD001)"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="characters"
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isProcessing && styles.submitButtonDisabled]}
          onPress={handleManualEntry}
          disabled={isProcessing}
        >
          <Ionicons 
            name={scanMode === 'IN' ? 'enter-outline' : 'exit-outline'} 
            size={24} 
            color="white" 
          />
          <Text style={styles.submitButtonText}>
            {isProcessing ? 'Processing...' : `Mark ${scanMode}`}
          </Text>
        </TouchableOpacity>

        {lastAction && (
          <View style={styles.successMessage}>
            <Ionicons 
              name="checkmark-circle" 
              size={24} 
              color="#10B981" 
            />
            <Text style={styles.successText}>
              Last action: Marked {lastAction} successfully
            </Text>
          </View>
        )}

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color="#6B7280" />
          <Text style={styles.infoText}>
            Enter the student ID and select IN or OUT mode, then tap "Mark {scanMode}" to record attendance. 
            Parents will be notified automatically.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7faff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  modeSelector: {
    flexDirection: 'row',
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  modeButtonActiveIn: {
    backgroundColor: '#10B981',
  },
  modeButtonActiveOut: {
    backgroundColor: '#EF4444',
  },
  modeButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  modeButtonTextActive: {
    color: 'white',
  },
  inputSection: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    color: '#1F2937',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  successText: {
    marginLeft: 8,
    color: '#065F46',
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#6B7280',
  },
  infoText: {
    marginLeft: 8,
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
});

export default InOutScanner;
