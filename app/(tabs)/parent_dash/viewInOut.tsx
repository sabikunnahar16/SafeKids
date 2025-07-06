import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../../constants/FirebaseConfig';
import { Ionicons } from '@expo/vector-icons';

type InOutRecord = {
  id: string;
  studentId: string;
  studentName: string;
  type: 'IN' | 'OUT';
  timestamp: Date;
  location: string;
  scannerType: 'bus' | 'school';
};

const ViewInOut = () => {
  const [records, setRecords] = useState<InOutRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const setupRealTimeListener = async () => {
      setLoading(true);
      try {
        // Get logged-in parent email
        const auth = getAuth();
        const user = auth.currentUser;
        const parentEmail = user?.email;

        console.log('🔍 Parent email:', parentEmail);

        if (!parentEmail) {
          Alert.alert('Error', 'No logged-in parent found.');
          setLoading(false);
          return;
        }

        // First, get the student ID from students collection
        const studentsQuery = query(
          collection(firestore, 'students'),
          where('email', '==', parentEmail)
        );

        const studentSnapshot = await getDocs(studentsQuery);
        console.log('👦 Students found:', studentSnapshot.size);

        if (studentSnapshot.empty) {
          Alert.alert('No Child Found', 'No student record found for your account.');
          setLoading(false);
          return;
        }

        const studentDoc = studentSnapshot.docs[0];
        const studentData = studentDoc.data();
        const childStudentId = studentData.idNumber;
        setStudentId(childStudentId);
        
        console.log('🆔 Child student ID:', childStudentId);

        // Set up real-time listener for IN/OUT records
        const inOutQuery = query(
          collection(firestore, 'inOutRecords'),
          where('studentId', '==', childStudentId)
        );

        unsubscribe = onSnapshot(inOutQuery, (inOutSnapshot) => {
          console.log('📊 IN/OUT records found:', inOutSnapshot.size);
          
          const recordsData: InOutRecord[] = inOutSnapshot.docs.map(doc => {
            const data = doc.data();
            console.log('📋 Record:', { id: doc.id, ...data });
            return {
              id: doc.id,
              studentId: data.studentId,
              studentName: data.studentName,
              type: data.type,
              timestamp: data.timestamp.toDate(),
              location: data.location,
              scannerType: data.scannerType
            };
          });

          // Sort on client side to avoid composite index requirement
          recordsData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

          console.log('✅ Final records data:', recordsData);
          setRecords(recordsData);
          setLoading(false);
        }, (error) => {
          console.error('❌ Error fetching IN/OUT records:', error);
          Alert.alert('Error', 'Something went wrong while fetching records.');
          setLoading(false);
        });

      } catch (err) {
        console.error('❌ Error in setupRealTimeListener:', err);
        Alert.alert('Error', 'Something went wrong while fetching records.');
        setLoading(false);
      }
    };

    setupRealTimeListener();
    
    // Cleanup listener on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Group records by date and organize by scanner type
  const groupRecordsByDate = () => {
    const grouped: { [key: string]: { 
      busIn?: InOutRecord, 
      busOut?: InOutRecord,
      schoolIn?: InOutRecord,
      schoolOut?: InOutRecord 
    } } = {};
    
    records.forEach(record => {
      const dateKey = record.timestamp.toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = {};
      }
      
      // Group by scanner type and IN/OUT
      if (record.scannerType === 'bus') {
        if (record.type === 'IN') {
          grouped[dateKey].busIn = record;
        } else {
          grouped[dateKey].busOut = record;
        }
      } else if (record.scannerType === 'school') {
        if (record.type === 'IN') {
          grouped[dateKey].schoolIn = record;
        } else {
          grouped[dateKey].schoolOut = record;
        }
      }
    });
    
    return Object.entries(grouped).map(([date, times]) => ({
      date,
      ...times
    }));
  };

  const renderTimeRow = ({ item }: { item: { 
    date: string, 
    busIn?: InOutRecord, 
    busOut?: InOutRecord,
    schoolIn?: InOutRecord,
    schoolOut?: InOutRecord 
  } }) => (
    <View style={styles.timeRow}>
      <Text style={styles.dateText}>{new Date(item.date).toLocaleDateString()}</Text>
      
      {/* Bus Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionHeader}>🚌 Bus Transport</Text>
        <View style={styles.timeColumns}>
          <View style={styles.timeColumn}>
            <Text style={styles.columnHeader}>IN TIME</Text>
            {item.busIn ? (
              <View style={styles.timeEntry}>
                <Text style={styles.timeText}>{item.busIn.timestamp.toLocaleTimeString()}</Text>
                <Text style={styles.locationText}>📍 {item.busIn.location}</Text>
              </View>
            ) : (
              <Text style={styles.noTimeText}>--:--</Text>
            )}
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.timeColumn}>
            <Text style={styles.columnHeader}>OUT TIME</Text>
            {item.busOut ? (
              <View style={styles.timeEntry}>
                <Text style={styles.timeText}>{item.busOut.timestamp.toLocaleTimeString()}</Text>
                <Text style={styles.locationText}>📍 {item.busOut.location}</Text>
              </View>
            ) : (
              <Text style={styles.noTimeText}>--:--</Text>
            )}
          </View>
        </View>
      </View>

      {/* School Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionHeader}>🏫 School</Text>
        <View style={styles.timeColumns}>
          <View style={styles.timeColumn}>
            <Text style={styles.columnHeader}>IN TIME</Text>
            {item.schoolIn ? (
              <View style={styles.timeEntry}>
                <Text style={styles.timeText}>{item.schoolIn.timestamp.toLocaleTimeString()}</Text>
                <Text style={styles.locationText}>📍 {item.schoolIn.location}</Text>
              </View>
            ) : (
              <Text style={styles.noTimeText}>--:--</Text>
            )}
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.timeColumn}>
            <Text style={styles.columnHeader}>OUT TIME</Text>
            {item.schoolOut ? (
              <View style={styles.timeEntry}>
                <Text style={styles.timeText}>{item.schoolOut.timestamp.toLocaleTimeString()}</Text>
                <Text style={styles.locationText}>📍 {item.schoolOut.location}</Text>
              </View>
            ) : (
              <Text style={styles.noTimeText}>--:--</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>IN/OUT Times</Text>
      {records.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="time-outline" size={64} color="#9CA3AF" />
          <Text style={styles.emptyText}>No IN/OUT records found</Text>
          <Text style={styles.emptySubtext}>Records will appear here when QR codes are scanned</Text>
        </View>
      ) : (
        <FlatList
          data={groupRecordsByDate()}
          renderItem={renderTimeRow}
          keyExtractor={(item) => item.date}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7faff',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 24,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  timeRow: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  timeColumns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeColumn: {
    flex: 1,
    alignItems: 'center',
  },
  separator: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  columnHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  timeEntry: {
    alignItems: 'center',
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  noTimeText: {
    fontSize: 18,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});

export default ViewInOut;
