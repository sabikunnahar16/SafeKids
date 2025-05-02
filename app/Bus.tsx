import { View, Text, StyleSheet, FlatList, Pressable, TextInput, Modal, Alert } from "react-native";
import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../constants/FirebaseConfig";
import { Ionicons } from "@expo/vector-icons";

export default function BusPage() {
  const [buses, setBuses] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [busName, setBusName] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverContact, setDriverContact] = useState("");
  const [password, setPassword] = useState("");
  const [editingBus, setEditingBus] = useState<any | null>(null);

  const fetchBuses = async () => {
    const snapshot = await getDocs(collection(firestore, "buses"));
    const busList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setBuses(busList);
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const handleSubmit = async () => {
    if (!busName || !driverName || !driverContact || !password) {
      return Alert.alert("Error", "All fields are required");
    }

    try {
      if (editingBus) {
        await updateDoc(doc(firestore, "buses", editingBus.id), {
          busName,
          driverName,
          driverContact,
          password,
        });
        Alert.alert("Success", "Bus account updated");
      } else {
        await addDoc(collection(firestore, "buses"), {
          busName,
          driverName,
          driverContact,
          password,
          createdAt: new Date(),
        });
        Alert.alert("Success", "Bus account added");
      }

      fetchBuses();
      resetForm();
      setModalVisible(false);
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(firestore, "buses", id));
    Alert.alert("Deleted", "Bus account removed");
    fetchBuses();
  };

  const resetForm = () => {
    setBusName("");
    setDriverName("");
    setDriverContact("");
    setPassword("");
    setEditingBus(null);
  };

  const openEditForm = (bus: any) => {
    setBusName(bus.busName);
    setDriverName(bus.driverName);
    setDriverContact(bus.driverContact);
    setPassword(bus.password);
    setEditingBus(bus);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bus Accounts</Text>

      <FlatList
        data={buses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.busItem}>
            <Text style={styles.busText}>🚌 {item.busName}</Text>
            <Text style={styles.info}>👨‍✈️ {item.driverName}</Text>
            <Text style={styles.info}>📞 {item.driverContact}</Text>
            <Text style={styles.info}>🔑 {item.password}</Text>

            <View style={styles.buttonRow}>
              <Pressable style={styles.updateButton} onPress={() => openEditForm(item)}>
                <Text style={styles.buttonText}>Update</Text>
              </Pressable>
              <Pressable style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                <Text style={styles.buttonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Add Bus</Text>
      </Pressable>

      {/* Modal Form */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{editingBus ? "Update Bus" : "Add Bus"}</Text>
          <TextInput placeholder="Bus Name" style={styles.input} value={busName} onChangeText={setBusName} />
          <TextInput placeholder="Driver Name" style={styles.input} value={driverName} onChangeText={setDriverName} />
          <TextInput placeholder="Driver Contact" style={styles.input} value={driverContact} onChangeText={setDriverContact} keyboardType="phone-pad" />
          <TextInput placeholder="Password" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>{editingBus ? "Update" : "Submit"}</Text>
          </Pressable>

          <Pressable onPress={() => { resetForm(); setModalVisible(false); }}>
            <Text style={{ textAlign: "center", marginTop: 10, color: "red" }}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, color: "#153370" },
  busItem: { backgroundColor: "#f2f2f2", padding: 15, borderRadius: 10, marginBottom: 10 },
  busText: { fontSize: 18, fontWeight: "bold", color: "#1c4587" },
  info: { fontSize: 15, marginTop: 2, color: "#555" },
  buttonRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 10 },
  updateButton: { backgroundColor: "#4CAF50", padding: 8, borderRadius: 5, marginRight: 10 },
  deleteButton: { backgroundColor: "#f44336", padding: 8, borderRadius: 5 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  addButton: { backgroundColor: "#153370", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 20 },
  addButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  modalContent: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#fff" },
  modalTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#153370" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 15 },
  submitButton: { backgroundColor: "#153370", padding: 15, borderRadius: 8, alignItems: "center" },
  submitButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
