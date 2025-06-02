import { View, Text, StyleSheet, FlatList, Pressable, Modal, TextInput, Alert, TouchableOpacity, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../../../constants/FirebaseConfig";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import StudentForm from "./StudentForm"; // Adjust the path based on the actual location of StudentForm

export default function StudentPage() {
  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [editingStudent, setEditingStudent] = useState(null);

  const fetchStudents = async () => {
    const snapshot = await getDocs(collection(firestore, "students"));
    const studentsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setStudents(studentsList);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleFormClose = () => {
    setModalVisible(false);
    setEditingStudent(null);
    fetchStudents();
  };

  const handleDelete = async (studentId: string) => {
    try {
      await deleteDoc(doc(firestore, "students", studentId));
      Alert.alert("Deleted", "Student deleted successfully");
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student: ", error);
    }
  };

  // Filter students by search and selected class
  const filteredStudents = students.filter((student) => {
    const matchesName = student.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass ? student.studentClass.startsWith(selectedClass) : true;
    return matchesName && matchesClass;
  });

  // List of classes 1-10
  const classList = Array.from({ length: 10 }, (_, i) => (i + 1).toString());

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("./admin")}>
          <Ionicons name="menu" size={30} color="#153370" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Students</Text>
      </View>

      {/* Class List */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        {classList.map((cls) => (
          <Pressable
            key={cls}
            style={[
              styles.classButton,
              selectedClass === cls && styles.classButtonActive
            ]}
            onPress={() => setSelectedClass(selectedClass === cls ? null : cls)}
          >
            <Text style={[
              styles.classButtonText,
              selectedClass === cls && styles.classButtonTextActive
            ]}>Class {cls}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search student..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#999"
      />

      {/* Students List */}
      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.studentItem}
            onPress={() => router.push({ pathname: '/(tabs)/Admin/student', params: { id: item.id } })}
          >
            <Text style={styles.studentText}>{item.studentName}</Text>
            <Text style={styles.studentSubText}><Text style={styles.bold}>Class:</Text> {item.studentClass}</Text>
            <Text style={styles.studentSubText}><Text style={styles.bold}>id:</Text> {item.roll}</Text>
            <Text style={styles.studentSubText}><Text style={styles.bold}>Parent:</Text> {item.parentName}</Text>
            <Text style={styles.studentSubText}><Text style={styles.bold}>Parent Contact:</Text> {item.parentContact}</Text>
            <View style={styles.buttonRow}>
              <Pressable
                style={styles.updateButton}
                onPress={(e) => {
                  e.stopPropagation();
                  setEditingStudent(item);
                  setModalVisible(true);
                }}
              >
                <Text style={styles.buttonText}>Update</Text>
              </Pressable>
              <Pressable
                style={styles.deleteButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id);
                }}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </Pressable>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888', marginTop: 30 }}>No students found.</Text>}
      />

      {/* Floating Add Button */}
      <Pressable
        style={styles.floatingButton}
        onPress={() => {
          setEditingStudent(null);
          setModalVisible(true);
        }}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </Pressable>

      {/* Modal for Form */}
      <Modal visible={modalVisible} animationType="slide">
        <StudentForm onClose={handleFormClose} existingStudent={editingStudent} />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 20,
    color: "#153370",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: "#333",
  },
  studentItem: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
  },
  studentText: {
    color: "#153370",
    fontSize: 20,
    fontWeight: "bold",
  },
  studentSubText: {
    color: "#555",
    fontSize: 16,
    marginTop: 2,
  },
  bold: {
    fontWeight: "bold",
    color: "#153370",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  updateButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: "#f44336",
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  floatingButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#153370",
    borderRadius: 50,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
  },
  classButton: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  classButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  classButtonText: {
    color: '#153370',
    fontWeight: '600',
    fontSize: 16,
  },
  classButtonTextActive: {
    color: '#fff',
  },
});
