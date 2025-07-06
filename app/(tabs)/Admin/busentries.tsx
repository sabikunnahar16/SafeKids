import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { firestore } from '../../../constants/FirebaseConfig';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

type InOutRecord = {
  id: string;
  studentId: string;
  studentName: string;
  type: 'IN' | 'OUT';
  timestamp: Date;
  location: string;
  scannerType: 'bus' | 'school';
  recordedBy: string;
};

type Student = {
  id: string;
  idNumber: string;
  studentName: string;
  studentClass: string;
  email: string;
};

type BusLogEntry = {
  date: string;
  studentId: string;
  studentName: string;
  inTime: string | null;
  outTime: string | null;
  status: 'IN' | 'OUT' | 'IN/OUT' | 'N/A';
};

export default function BusLogs() {
  const [busLogs, setBusLogs] = useState<BusLogEntry[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchStudentId, setSearchStudentId] = useState('');
  const [searchStudentName, setSearchStudentName] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
    // Load today's logs by default
    const today = new Date().toISOString().split('T')[0];
    setSearchDate(today);
    fetchBusLogs('', '', today);
  }, []);

  const fetchStudents = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'students'));
      const studentList: Student[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        studentList.push({ 
          id: doc.id, 
          idNumber: data.idNumber,
          studentName: data.studentName,
          studentClass: data.studentClass,
          email: data.email
        });
      });
      setStudents(studentList.sort((a, b) => a.studentName.localeCompare(b.studentName)));
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchBusLogs = async (studentId: string, studentName: string, date: string) => {
    setLoading(true);
    try {
      // Build query for inOutRecords with bus scanner type
      let q = query(
        collection(firestore, 'inOutRecords'),
        where('scannerType', '==', 'bus')
      );

      // Add student ID filter if provided
      if (studentId.trim()) {
        q = query(
          collection(firestore, 'inOutRecords'),
          where('scannerType', '==', 'bus'),
          where('studentId', '==', studentId.trim())
        );
      }

      const querySnapshot = await getDocs(q);
      const records: InOutRecord[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        records.push({
          id: doc.id,
          studentId: data.studentId,
          studentName: data.studentName,
          type: data.type,
          timestamp: data.timestamp.toDate(),
          location: data.location,
          scannerType: data.scannerType,
          recordedBy: data.recordedBy
        });
      });

      // Filter by date and student name if provided
      const filteredRecords = records.filter(record => {
        const recordDate = record.timestamp.toISOString().split('T')[0];
        const matchesDate = !date || recordDate === date;
        const matchesStudentName = !studentName.trim() || 
          record.studentName.toLowerCase().includes(studentName.toLowerCase());
        return matchesDate && matchesStudentName;
      });

      // Group records by student and date
      const logsMap: { [key: string]: BusLogEntry } = {};
      
      filteredRecords.forEach(record => {
        const dateKey = record.timestamp.toISOString().split('T')[0];
        const key = `${record.studentId}-${dateKey}`;
        
        if (!logsMap[key]) {
          logsMap[key] = {
            date: dateKey,
            studentId: record.studentId,
            studentName: record.studentName,
            inTime: null,
            outTime: null,
            status: 'N/A'
          };
        }
        
        const timeString = record.timestamp.toLocaleTimeString();
        if (record.type === 'IN') {
          logsMap[key].inTime = timeString;
        } else if (record.type === 'OUT') {
          logsMap[key].outTime = timeString;
        }
      });

      // Set status based on IN/OUT times
      Object.values(logsMap).forEach(log => {
        if (log.inTime && log.outTime) {
          log.status = 'IN/OUT';
        } else if (log.inTime) {
          log.status = 'IN';
        } else if (log.outTime) {
          log.status = 'OUT';
        } else {
          log.status = 'N/A';
        }
      });

      // Include students with no scans if searching for specific student
      if (studentId.trim() || studentName.trim()) {
        const studentsToCheck = students.filter(student => {
          const matchesId = !studentId.trim() || student.idNumber === studentId.trim();
          const matchesName = !studentName.trim() || 
            student.studentName.toLowerCase().includes(studentName.toLowerCase());
          return matchesId && matchesName;
        });

        studentsToCheck.forEach(student => {
          const key = `${student.idNumber}-${date}`;
          if (!logsMap[key]) {
            logsMap[key] = {
              date: date,
              studentId: student.idNumber,
              studentName: student.studentName,
              inTime: null,
              outTime: null,
              status: 'N/A'
            };
          }
        });
      }

      const logsArray = Object.values(logsMap).sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setBusLogs(logsArray);
    } catch (error) {
      console.error('Error fetching bus logs:', error);
      Alert.alert('Error', 'Failed to fetch bus logs');
    }
    setLoading(false);
  };

  const handleSearch = () => {
    fetchBusLogs(searchStudentId, searchStudentName, searchDate);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN/OUT': return '#10B981'; // Green
      case 'IN': return '#3B82F6'; // Blue
      case 'OUT': return '#F59E0B'; // Orange
      case 'N/A': return '#6B7280'; // Gray
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'IN/OUT': return 'checkmark-circle';
      case 'IN': return 'enter';
      case 'OUT': return 'exit';
      case 'N/A': return 'remove-circle';
      default: return 'help-circle';
    }
  };

  const renderBusLog = ({ item }: { item: BusLogEntry }) => (
    <View style={styles.logCard}>
      <View style={styles.logHeader}>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{item.studentName}</Text>
          <Text style={styles.studentId}>ID: {item.studentId}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Ionicons name={getStatusIcon(item.status) as any} size={16} color="white" />
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.timeContainer}>
        <View style={styles.timeRow}>
          <Ionicons name="enter" size={16} color="#3B82F6" />
          <Text style={styles.timeLabel}>IN Time:</Text>
          <Text style={styles.timeValue}>{item.inTime || 'Not scanned'}</Text>
        </View>
        <View style={styles.timeRow}>
          <Ionicons name="exit" size={16} color="#F59E0B" />
          <Text style={styles.timeLabel}>OUT Time:</Text>
          <Text style={styles.timeValue}>{item.outTime || 'Not scanned'}</Text>
        </View>
      </View>
      
      <Text style={styles.dateText}>Date: {new Date(item.date).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bus Scan Logs</Text>
      
      {/* Search Form */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchLabel}>Search Bus Logs</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Student ID (e.g., STD001)"
          value={searchStudentId}
          onChangeText={setSearchStudentId}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Student Name"
          value={searchStudentName}
          onChangeText={setSearchStudentName}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Date (YYYY-MM-DD)"
          value={searchDate}
          onChangeText={setSearchDate}
        />
        
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={20} color="white" />
          <Text style={styles.searchButtonText}>Search Logs</Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      <View style={styles.resultsHeader}>
        <Text style={styles.subHeader}>
          Bus Scan Results ({busLogs.length} records)
        </Text>
        <Text style={styles.legendText}>
          Status: IN = First scan, OUT = Second scan, IN/OUT = Both scans, N/A = No scans
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading bus logs...</Text>
        </View>
      ) : (
        <FlatList
          data={busLogs}
          keyExtractor={(item, index) => `${item.studentId}-${item.date}-${index}`}
          renderItem={renderBusLog}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="bus" size={64} color="#9CA3AF" />
              <Text style={styles.emptyText}>No bus logs found</Text>
              <Text style={styles.emptySubText}>
                Try adjusting your search criteria or check if students have been scanned by the bus driver
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#f8f9fa' 
  },
  header: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    color: '#1E293B',
    textAlign: 'center'
  },
  subHeader: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#374151',
    marginBottom: 8
  },
  searchContainer: { 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  searchLabel: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 12, 
    color: '#374151' 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#D1D5DB', 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 12, 
    backgroundColor: '#fff',
    fontSize: 16
  },
  searchButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 8
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16
  },
  resultsHeader: {
    marginBottom: 16
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 4
  },
  logCard: { 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 12, 
    borderLeftWidth: 4, 
    borderLeftColor: '#2563EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  logHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  studentInfo: {
    flex: 1
  },
  studentName: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#1E293B' 
  },
  studentId: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4
  },
  timeContainer: {
    marginBottom: 12
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  timeLabel: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    marginRight: 8,
    minWidth: 70
  },
  timeValue: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500'
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8
  },
  emptySubText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20
  }
});