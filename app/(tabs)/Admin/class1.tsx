// Class 1 students page
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Alert, Image } from "react-native";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { firestore,storage } from "../../../constants/FirebaseConfig";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";

type Student = {
  id: string;
  studentName: string;
  studentClass: string;
  imageUri?: string;
  // add other fields as needed
};

export default function Class1() {
  const [students, setStudents] = useState<Student[]>([]);
  const router = useRouter();

  const fetchStudents = async () => {
    const snapshot = await getDocs(collection(firestore, "students"));
    const studentsList = snapshot.docs
      .map(doc => ({ id: doc.id, ...(doc.data() as Omit<Student, 'id'>) }))
      .filter(student => student.studentClass === "1-1" || student.studentClass === "1-2");
    setStudents(studentsList);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (studentId: string) => {
    try {
      await deleteDoc(doc(firestore, "students", studentId));
      Alert.alert("Deleted", "Student deleted successfully");
      fetchStudents();
    } catch (error) {
      Alert.alert("Error", "Failed to delete student");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Class 1 Students (1-1 & 1-2)</Text>
      <FlatList
        data={students}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.studentCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {item.imageUri ? (
                <Image source={{ uri: item.imageUri }} style={styles.avatar} />
              ) : (
                <Ionicons name="person-circle" size={48} color="#2563EB" />
              )}
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.studentName}>{item.studentName}</Text>
                <Text style={styles.studentInfo}>ID: {item.id}</Text>
                <Text style={styles.studentInfo}>Class: {item.studentClass}</Text>
              </View>
            </View>
            <View style={styles.buttonRow}>
              <Pressable style={styles.updateButton} onPress={() => router.push({ pathname: '/(tabs)/Admin/StudentForm', params: { id: item.id } })}>
                <Ionicons name="create-outline" size={20} color="#fff" />
                <Text style={styles.buttonText}>Update</Text>
              </Pressable>
              <Pressable style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                <Ionicons name="trash-outline" size={20} color="#fff" />
                <Text style={styles.buttonText}>Delete</Text>
              </Pressable>
              <Pressable style={styles.idCardButton} onPress={() => router.push({ pathname: '/(tabs)/Admin/student', params: { id: item.id } })}>
                <Ionicons name="card-outline" size={20} color="#fff" />
                <Text style={styles.buttonText}>ID Card</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888', marginTop: 30 }}>No students found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    padding: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#153370',
    marginBottom: 18,
    textAlign: 'center',
  },
  studentCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0e7ff',
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#153370',
  },
  studentInfo: {
    fontSize: 15,
    color: '#555',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-between',
  },
  updateButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#F43F5E',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  idCardButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 4,
  },
});
