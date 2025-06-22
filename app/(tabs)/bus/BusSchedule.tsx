import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Modal, TextInput } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { firestore } from "../../../constants/FirebaseConfig";
import * as SMS from 'expo-sms';

export default function BusSchedule() {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [busSchedules, setBusSchedules] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
  const [newTime, setNewTime] = useState('');
  const [newInfo, setNewInfo] = useState('');

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    // Example: Fetch all bus schedules from Firestore (collection: 'busSchedules')
    const snapshot = await getDocs(collection(firestore, "busSchedules"));
    const schedules = snapshot.docs.map(docu => ({ id: docu.id, ...docu.data() }));
    setBusSchedules(schedules);
  };

  const handleEdit = (schedule: any) => {
    setEditingSchedule(schedule);
    setNewTime(schedule.time || '');
    setNewInfo(schedule.info || '');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!editingSchedule) return;
    try {
      await updateDoc(doc(firestore, 'busSchedules', editingSchedule.id), {
        time: newTime,
        info: newInfo,
      });
      setModalVisible(false);
      fetchSchedules();
      notifyParents(editingSchedule, newTime, newInfo);
      Alert.alert('Success', 'Schedule updated and parents notified!');
    } catch (e) {
      Alert.alert('Error', 'Failed to update schedule.');
    }
  };

  const notifyParents = async (schedule: any, time: string, info: string) => {
    // Fetch all students for this bus (assuming busId is in schedule)
    const studentsSnap = await getDocs(collection(firestore, 'students'));
    const parents: string[] = [];
    studentsSnap.forEach(docu => {
      const d = docu.data();
      if (d.busId === schedule.busId && d.parentContact) {
        parents.push(d.parentContact);
      }
    });
    if (parents.length > 0) {
      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        const message = `Bus schedule updated: Time - ${time}, Info - ${info}. Please note the change.`;
        await SMS.sendSMSAsync(parents, message);
      }
    }
  };

  // Filter schedules for the selected date
  const filteredSchedules = busSchedules.filter(s => s.date === selectedDate);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bus Schedule</Text>
      <Text style={styles.subtitle}>View and manage your bus schedule. Parents will be notified of any changes.</Text>
      <Calendar
        onDayPress={day => setSelectedDate(day.dateString)}
        markedDates={{ [selectedDate]: { selected: true, selectedColor: '#2563EB' } }}
        style={styles.calendar}
        theme={{
          todayTextColor: '#F43F5E',
          selectedDayBackgroundColor: '#2563EB',
          arrowColor: '#2563EB',
        }}
      />
      <FlatList
        data={filteredSchedules}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.scheduleCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.scheduleTime}>Time: {item.time}</Text>
              <Text style={styles.scheduleInfo}>Info: {item.info}</Text>
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(item)}>
              <Ionicons name="create-outline" size={22} color="#2563EB" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No schedule for this day.</Text>}
        style={{ width: '100%' }}
      />
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Schedule</Text>
            <TextInput
              style={styles.input}
              placeholder="Time (e.g. 8:00 AM)"
              value={newTime}
              onChangeText={setNewTime}
            />
            <TextInput
              style={[styles.input, { height: 60 }]}
              placeholder="Info (e.g. Route, Notes)"
              value={newInfo}
              onChangeText={setNewInfo}
              multiline
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 }}>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Ionicons name="checkmark" size={20} color="#fff" />
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={20} color="#fff" />
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fa',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#153370',
    marginTop: 30,
    marginBottom: 8,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#2563EB',
    marginBottom: 18,
    textAlign: 'center',
    fontWeight: '500',
  },
  calendar: {
    borderRadius: 16,
    marginBottom: 18,
    width: '100%',
    alignSelf: 'center',
    elevation: 2,
    backgroundColor: '#fff',
    padding: 8,
  },
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    width: '100%',
  },
  scheduleTime: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#153370',
    marginBottom: 4,
  },
  scheduleInfo: {
    fontSize: 15,
    color: '#2563EB',
    marginBottom: 2,
  },
  editBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#e0e7ff',
    marginLeft: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 30,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    width: 320,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#34495e',
    backgroundColor: '#ecf0f1',
    width: '100%',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginRight: 8,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 6,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F43F5E',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancelBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 6,
  },
});
