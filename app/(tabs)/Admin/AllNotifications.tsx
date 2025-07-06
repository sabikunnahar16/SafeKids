import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../../../constants/FirebaseConfig';
import { Ionicons } from '@expo/vector-icons';

interface Notification {
  id: string;
  studentName: string;
  studentId: string;
  studentClass: string;
  parentName: string;
  parentEmail: string;
  parentContact: string;
  scanTime: any;
  message: string;
  type: string;
  status: string;
  scannedBy: string;
  location: string;
}

export default function AllNotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Query ALL notifications for debugging
    const unsubscribe = onSnapshot(
      collection(firestore, 'notifications'),
      (snapshot) => {
        const notificationList: Notification[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          console.log('All Notifications - Document:', { id: doc.id, ...data });
          notificationList.push({ id: doc.id, ...data } as Notification);
        });
        
        console.log('Total notifications in database:', notificationList.length);
        
        // Sort by scanTime (newest first)
        notificationList.sort((a, b) => {
          const timeA = a.scanTime?.toDate ? a.scanTime.toDate() : new Date(a.scanTime || 0);
          const timeB = b.scanTime?.toDate ? b.scanTime.toDate() : new Date(b.scanTime || 0);
          return timeB.getTime() - timeA.getTime();
        });
        
        setNotifications(notificationList);
        setLoading(false);
        setRefreshing(false);
      },
      (error) => {
        console.error('Error fetching all notifications:', error);
        Alert.alert('Error', 'Failed to load notifications');
        setLoading(false);
        setRefreshing(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return 'Unknown time';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await deleteDoc(doc(firestore, 'notifications', notificationId));
      Alert.alert('Success', 'Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      Alert.alert('Error', 'Failed to delete notification');
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <View style={styles.notificationCard}>
      <View style={styles.notificationHeader}>
        <Ionicons name="notifications" size={20} color="#3498db" />
        <Text style={styles.notificationTitle}>Debug - All Notifications</Text>
        <TouchableOpacity onPress={() => deleteNotification(item.id)}>
          <Ionicons name="trash" size={20} color="#e74c3c" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.notificationBody}>
        <Text style={styles.debugText}>ID: {item.id}</Text>
        <Text style={styles.studentName}>{item.studentName}</Text>
        <Text style={styles.studentDetails}>ID: {item.studentId} • Class: {item.studentClass}</Text>
        <Text style={styles.parentEmail}>📧 Parent Email: {item.parentEmail}</Text>
        <Text style={styles.location}>📍 {item.location} • {formatTime(item.scanTime)}</Text>
        <Text style={styles.message}>{item.message}</Text>
      </View>
      
      <View style={styles.notificationFooter}>
        <View style={[styles.statusBadge, { backgroundColor: '#27ae60' }]}>
          <Text style={styles.statusText}>{item.status?.toUpperCase() || 'SENT'}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="notifications" size={64} color="#3498db" />
        <Text style={styles.loadingText}>Loading all notifications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Notifications (Debug)</Text>
        <Text style={styles.headerSubtitle}>Total: {notifications.length}</Text>
      </View>

      {notifications.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="notifications-off" size={64} color="#bdc3c7" />
          <Text style={styles.emptyText}>No notifications found</Text>
          <Text style={styles.emptySubtext}>Try scanning a student QR code first</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#e74c3c',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'white',
    fontSize: 16,
    opacity: 0.8,
    marginTop: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#7f8c8d',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 20,
    color: '#7f8c8d',
    marginTop: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#95a5a6',
    marginTop: 8,
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
  },
  notificationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
    marginLeft: 8,
  },
  notificationBody: {
    marginBottom: 12,
  },
  debugText: {
    fontSize: 12,
    color: '#95a5a6',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  studentDetails: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  parentEmail: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '600',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  message: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 20,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});
