// Class 1 students page
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Alert, Image, Modal, TouchableOpacity } from "react-native";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../../../constants/FirebaseConfig";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateStudent } from './updateStudent';

type Student = {
  id: string;
  studentName: string;
  studentClass: string;
  imageUri?: string;
  // add other fields as needed
};

export default function Class1() {
  const [students, setStudents] = useState<Student[]>([]);
  const [menuVisible, setMenuVisible] = useState<string | null>(null);
  const router = useRouter();

  const fetchStudents = async () => {
    const snapshot = await getDocs(collection(firestore, "students"));
    const studentsList = snapshot.docs
      .map(doc => ({ id: doc.id, ...(doc.data() as Omit<Student, 'id'>) }))
      .filter(student => student.studentClass === "2-1" || student.studentClass === "2-2");
    setStudents(studentsList);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (studentId: string) => {
    try {
      console.log('Attempting to delete student with Firestore doc id:', studentId);
      await deleteDoc(doc(firestore, "students", studentId));
      await new Promise(resolve => setTimeout(resolve, 500)); // Wait for Firestore consistency
      await fetchStudents();
      // Check if student still exists in the list
      const stillExists = students.some(s => s.id === studentId);
      if (stillExists) {
        Alert.alert("Error", "Student could not be deleted. Please check your Firestore rules or refresh the app.");
      } else {
        Alert.alert("Deleted", "Student deleted successfully");
      }
    } catch (error) {
      console.error('Delete error:', error);
      Alert.alert("Error", `Failed to delete student: ${(error as any)?.message || error}`);
    }
  };

  const handleProfileImagePress = async (student: Student) => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', 'You need to allow access to the media library.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        // Upload to Firebase Storage
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const storage = getStorage();
        const storageRef = ref(storage, `students/${student.id}.jpg`);
        await uploadBytes(storageRef, blob);
        const downloadUrl = await getDownloadURL(storageRef);
        // Update Firestore using updateStudent helper
        await updateStudent(student.id, { imageUri: downloadUrl });
        Alert.alert('Success', 'Profile image updated!');
        fetchStudents();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile image.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Students of Class 2</Text>
      <Text style={styles.subtitle}>(2-1 & 2-2)</Text>
      <FlatList
        data={students}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.studentCardRow}>
            <Pressable onPress={() => handleProfileImagePress(item)} style={styles.profileSection}>
              {item.imageUri ? (
                <Image source={{ uri: item.imageUri }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder} />
              )}
              <View style={{ marginLeft: 16 }}>
                <Text style={styles.studentName}>{item.studentName}</Text>
                <Text style={styles.studentInfo}>ID: {item.id}</Text>
                <Text style={styles.studentInfo}>Class: {item.studentClass}</Text>
              </View>
            </Pressable>
            <TouchableOpacity onPress={() => setMenuVisible(item.id)} style={styles.menuButton}>
              <Ionicons name="ellipsis-vertical" size={24} color="#153370" />
            </TouchableOpacity>
            <Modal
              visible={menuVisible === item.id}
              transparent
              animationType="fade"
              onRequestClose={() => setMenuVisible(null)}
            >
              <TouchableOpacity style={styles.modalOverlay} onPress={() => setMenuVisible(null)} />
              <View style={styles.menuModal}>
                <Pressable style={styles.menuItem} onPress={() => {
                  setMenuVisible(null);
                  const student = students.find(s => s.id === item.id);
                  if (student) {
                    router.push({
                      pathname: '/(tabs)/Admin/StudentForm',
                      params: { id: item.id, existingStudent: JSON.stringify(student) }
                    });
                  } else {
                    Alert.alert('Error', 'Student data not found');
                  }
                }}>
                  <Ionicons name="create-outline" size={20} color="#2563EB" style={{ marginRight: 8 }} />
                  <Text style={styles.menuText}>Update</Text>
                </Pressable>
                <Pressable style={styles.menuItem} onPress={() => { setMenuVisible(null); handleDelete(item.id); }}>
                  <Ionicons name="trash-outline" size={20} color="#F43F5E" style={{ marginRight: 8 }} />
                  <Text style={styles.menuText}>Delete</Text>
                </Pressable>
                <Pressable style={styles.menuItem} onPress={() => { setMenuVisible(null); router.push({ pathname: '/(tabs)/Admin/StudentIdCard', params: { id: item.id } }); }}>
                  <Ionicons name="card-outline" size={20} color="#2563EB" style={{ marginRight: 8 }} />
                  <Text style={styles.menuText}>ID Card</Text>
                </Pressable>
              </View>
            </Modal>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No students found.</Text>}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  ...require('./class1').styles,
  studentCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    justifyContent: 'space-between',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuButton: {
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  menuModal: {
    position: 'absolute',
    right: 30,
    top: 120,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 100,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  menuText: {
    fontSize: 16,
    color: '#153370',
    fontWeight: '500',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#153370',
    marginBottom: 16,
    marginTop: 24,
    textAlign: 'center',
  },
});
