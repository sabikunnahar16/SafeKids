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
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { firestore, auth } from '../../../constants/FirebaseConfig';
import { Ionicons } from '@expo/vector-icons';

interface Notification {
  id: string;
  studentName: string;
  studentId: string;
  studentClass?: string;
  parentName?: string;
  parentEmail: string;
  parentContact?: string;
  parentAddress?: string;
  scanTime?: any;
  timestamp?: any; // Added for school notifications
  message: string;
  type: string;
  status?: string; // Made optional since it might be undefined
  scannedBy?: string;
  location: string;
  read?: boolean; // Added for notification read status
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    // Query notifications for the current user's email (parent's Gmail)
    // Using a simpler query to avoid index requirements
    const q = query(
      collection(firestore, 'notifications'),
      where('parentEmail', '==', user.email)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notificationList: Notification[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Notification document:', { id: doc.id, ...data });
        
        // Ensure we have required fields with fallbacks
        const notification: Notification = {
          id: doc.id,
          studentName: data.studentName || 'Unknown Student',
          studentId: data.studentId || 'N/A',
          studentClass: data.studentClass || 'N/A',
          parentName: data.parentName || 'Unknown Parent',
          parentEmail: data.parentEmail || user.email || '',
          parentContact: data.parentContact || 'N/A',
          parentAddress: data.parentAddress || 'N/A',
          scanTime: data.scanTime,
          timestamp: data.timestamp,
          message: data.message || 'No message available',
          type: data.type || 'scan_notification',
          status: data.status || 'sent',
          scannedBy: data.scannedBy || 'System',
          location: data.location || 'Unknown Location',
          read: data.read || false
        };
        
        notificationList.push(notification);
      });
      
      console.log('Total notifications found:', notificationList.length);
      console.log('User email:', user.email);
      
      // Sort by timestamp field (both scanTime and timestamp fields)
      notificationList.sort((a, b) => {
        // Handle both scanTime and timestamp fields
        const timeA = a.scanTime?.toDate ? a.scanTime.toDate() : 
                     a.timestamp?.toDate ? a.timestamp.toDate() : 
                     new Date(a.scanTime || a.timestamp || 0);
        const timeB = b.scanTime?.toDate ? b.scanTime.toDate() : 
                     b.timestamp?.toDate ? b.timestamp.toDate() : 
                     new Date(b.scanTime || b.timestamp || 0);
        return timeB.getTime() - timeA.getTime();
      });
      
      setNotifications(notificationList);
      setLoading(false);
      setRefreshing(false);
    }, (error) => {
      console.error('Error fetching notifications:', error);
      Alert.alert('Error', 'Failed to load notifications');
      setLoading(false);
      setRefreshing(false);
    });

    return () => unsubscribe();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // The onSnapshot listener will automatically update the data
  };

  const formatTime = (notificationItem: Notification) => {
    // Try scanTime first, then timestamp, then fallback
    const timestamp = notificationItem.scanTime || notificationItem.timestamp;
    if (!timestamp) return 'Unknown time';
    
    // Handle Firestore timestamp
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'school':
      case 'school_scan_notification':
      case 'school_inout':
        return 'school';
      case 'scan_notification':
      case 'bus':
      default:
        return 'bus';
    }
  };

  const getNotificationTitle = (type: string) => {
    switch (type) {
      case 'school':
      case 'school_scan_notification':
      case 'school_inout':
        return 'School Scan Alert';
      case 'scan_notification':
      case 'bus':
      default:
        return 'Bus Scan Alert';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'school':
      case 'school_scan_notification':
      case 'school_inout':
        return '#4CAF50'; // Green for school
      case 'scan_notification':
      case 'bus':
      default:
        return '#3498db'; // Blue for bus
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <View style={styles.notificationCard}>
      <View style={styles.notificationHeader}>
        <Ionicons name={getNotificationIcon(item.type) as any} size={24} color={getNotificationColor(item.type)} />
        <Text style={[styles.notificationTitle, { color: getNotificationColor(item.type) }]}>
          {getNotificationTitle(item.type)}
        </Text>
        <Text style={styles.timestamp}>{formatTime(item)}</Text>
      </View>
      <View style={styles.notificationBody}>
        <Text style={styles.studentName}>{item.studentName || 'Unknown Student'}</Text>
        <Text style={styles.studentDetails}>
          ID: {item.studentId || 'N/A'} • Class: {item.studentClass || 'N/A'}
        </Text>
        <Text style={styles.location}>
          📍 {item.location || 'Unknown Location'} • 
          Scanned by {item.scannedBy || 'System'}
        </Text>
        <Text style={styles.message}>{item.message || 'No message available'}</Text>
      </View>
      <View style={styles.notificationFooter}>
        <View style={[styles.statusBadge, { backgroundColor: (item.status === 'sent' || !item.status) ? '#27ae60' : '#e74c3c' }]}>
          <Text style={styles.statusText}>{(item.status || 'SENT').toUpperCase()}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="notifications" size={64} color="#3498db" />
        <Text style={styles.loadingText}>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <Text style={styles.headerSubtitle}>Bus and school scan alerts</Text>
      </View>

      {notifications.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="notifications-off" size={64} color="#bdc3c7" />
          <Text style={styles.emptyText}>No notifications yet</Text>
          <Text style={styles.emptySubtext}>You'll see alerts here when your child is scanned by bus drivers or school authorities</Text>
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
    backgroundColor: '#3498db',
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
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginLeft: 8,
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  notificationBody: {
    marginBottom: 12,
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
