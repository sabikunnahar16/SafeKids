import { View, Text, TextInput, StyleSheet, Pressable, Alert, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore"; // Added updateDoc
import { firestore } from "../../constants/FirebaseConfig";

export default function StudentForm({
  onClose,
  existingStudent = null,
}: {
  onClose: () => void;
  existingStudent?: any;
}) {
  const [studentName, setStudentName] = useState(existingStudent?.studentName || "");
  const [roll, setRoll] = useState(existingStudent?.roll || "");
  const [studentClass, setStudentClass] = useState(existingStudent?.studentClass || "");
  const [parentName, setParentName] = useState(existingStudent?.parentName || "");
  const [parentContact, setParentContact] = useState(existingStudent?.parentContact || "");
  const [parentAddress, setParentAddress] = useState(existingStudent?.parentAddress || "");

  const handleSubmit = async () => {
    try {
      if (existingStudent?.id) {
        const studentRef = doc(firestore, "students", existingStudent.id);
        await updateDoc(studentRef, {
          studentName,
          roll,
          studentClass,
          parentName,
          parentContact,
          parentAddress,
          updatedAt: new Date(),
        });
        Alert.alert("Updated", "Student updated successfully!");
      } else {
        await addDoc(collection(firestore, "students"), {
          studentName,
          roll,
          studentClass,
          parentName,
          parentContact,
          parentAddress,
          createdAt: new Date(),
        });
        Alert.alert("Added", "Student added successfully!");
      }
      onClose();
    } catch (error) {
      console.error("Error saving student: ", error);
      Alert.alert("Error", "Failed to save student.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New Student</Text>

      <TextInput
        placeholder="Student Name"
        value={studentName}
        onChangeText={setStudentName}
        style={styles.input}
      />
      <TextInput
        placeholder="Roll Number"
        value={roll}
        onChangeText={setRoll}
        style={styles.input}
        keyboardType="numeric"
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={studentClass}
          onValueChange={(itemValue) => setStudentClass(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Class" value="" />
          <Picker.Item label="1-1" value="1-1" />
          <Picker.Item label="1-2" value="1-2" />
          <Picker.Item label="2-1" value="2-1" />
          <Picker.Item label="2-2" value="2-2" />
          <Picker.Item label="3-1" value="3-1" />
          <Picker.Item label="3-2" value="3-2" />
          <Picker.Item label="4-1" value="4-1" />
          <Picker.Item label="4-2" value="4-2" />
          <Picker.Item label="5-1" value="5-1" />
          <Picker.Item label="5-2" value="5-2" />
          <Picker.Item label="6-1" value="6-1" />
          <Picker.Item label="6-2" value="6-2" />
          <Picker.Item label="7-1" value="7-1" />
          <Picker.Item label="8-1" value="8-1" />
          <Picker.Item label="8-2" value="8-2" />
          <Picker.Item label="9-1" value="9-1" />
          <Picker.Item label="9-2" value="9-2" />
          <Picker.Item label="10-1" value="10-1" />
          <Picker.Item label="10-2" value="10-2" />
        </Picker>
      </View>

      <TextInput
        placeholder="Parent Name"
        value={parentName}
        onChangeText={setParentName}
        style={styles.input}
      />
      <TextInput
        placeholder="Parent Contact"
        value={parentContact}
        onChangeText={setParentContact}
        style={styles.input}
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder="Parent Address"
        value={parentAddress}
        onChangeText={setParentAddress}
        style={[styles.input, { height: 80 }]}
        multiline
      />

      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    color: "#153370",
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#f9f9f9",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  picker: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#153370",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
