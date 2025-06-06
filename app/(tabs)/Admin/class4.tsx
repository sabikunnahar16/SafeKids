// Class 4 students page
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Alert, Image, Modal, TouchableOpacity } from "react-native";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
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
};

export default function Class4() {
  const [students, setStudents] = useState<Student[]>([]);
  const [menuVisible, setMenuVisible] = useState<string | null>(null);
  const router = useRouter();

  const fetchStudents = async () => {
    const snapshot = await getDocs(collection(firestore, "students"));
    const studentsList = snapshot.docs
      .map(doc => ({ id: doc.id, ...(doc.data() as Omit<Student, 'id'>) }))
      .filter(student => student.studentClass === "4-1" || student.studentClass === "4-2");
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
        // Update Firestore
        await updateDoc(doc(firestore, 'students', student.id), { imageUri: downloadUrl });
        Alert.alert('Success', 'Profile image updated!');
        fetchStudents();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile image.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Students of Class 4</Text>
      <Text style={styles.subtitle}>(4-1 & 4-2)</Text>
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
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#153370',
    textAlign: 'center',
    marginTop: 35,
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#2563EB',
    textAlign: 'center',
    marginBottom: 18,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 30,
  },
  studentCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 3,
    justifyContent: 'space-between',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#e0e7ff',
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  avatarPlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#e0e7ff',
    borderWidth: 2,
    borderColor: '#e0e7ff',
  },
  menuButton: {
    padding: 8,
    borderRadius: 20,
    marginLeft: 8,
  },
  menuModal: {
    position: 'absolute',
    right: 30,
    top: 120,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 7,
    zIndex: 1000,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  menuText: {
    fontSize: 17,
    color: '#153370',
    fontWeight: '500',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
    fontSize: 16,
  },
});
