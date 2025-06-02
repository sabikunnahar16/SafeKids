// Class 4 students page
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Alert, Image } from "react-native";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../../../constants/FirebaseConfig";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";

type Student = {
  id: string;
  studentName: string;
  studentClass: string;
  imageUri?: string;
};

export default function Class4() {
  const [students, setStudents] = useState<Student[]>([]);
  const router = useRouter();

  const fetchStudents = async () => {
    const snapshot = await getDocs(collection(firestore, "students"));
    const studentsList = snapshot.docs
      .map(doc => ({ id: doc.id, ...(doc.data() as Omit<Student, 'id'>) }))
      .filter(student => student.studentClass === "5-1" || student.studentClass === "5-2");
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
      <Text style={styles.title}>Class 5 Students (5-1 & 5-2)</Text>
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
  ...require('./class1').styles
});
