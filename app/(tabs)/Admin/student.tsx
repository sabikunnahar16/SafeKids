import { View, Text, TextInput, StyleSheet, Pressable, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { auth, firestore } from '../../../constants/FirebaseConfig'; // Corrected import path

export default function StudentForm() {
  const [studentName, setStudentName] = useState("");
  const [id, setid] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentContact, setParentContact] = useState("");
  const [parentAddress, setParentAddress] = useState("");

  const handleSubmit = async () => {
    try {
      await addDoc(collection(firestore, "students"), {
        studentName,
        id,
        studentClass,
        parentName,
        parentContact,
        parentAddress,
        createdAt: new Date(),
      });
      Alert.alert("Success", "Student details added successfully!");
      // Clear form
      setStudentName("");
      setid("");
      setStudentClass("");
      setParentName("");
      setParentContact("");
      setParentAddress("");
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert("Error", "Failed to add student details.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Registration</Text>

      <TextInput
        placeholder="Student Name"
        value={studentName}
        onChangeText={setStudentName}
        style={styles.input}
        placeholderTextColor="#ccc"
      />

      <TextInput
        placeholder="id number"
        value={id}
        onChangeText={setid}
        style={styles.input}
        placeholderTextColor="#ccc"
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={studentClass}
          onValueChange={(itemValue) => setStudentClass(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Class" value="" />
          <Picker.Item label="Class 1" value="Class 1" />
          <Picker.Item label="Class 2" value="Class 2" />
          <Picker.Item label="Class 3" value="Class 3" />
          <Picker.Item label="Class 4" value="Class 4" />
          {/* Add more classes if needed */}
        </Picker>
      </View>

      <TextInput
        placeholder="Parent Name"
        value={parentName}
        onChangeText={setParentName}
        style={styles.input}
        placeholderTextColor="#ccc"
      />

      <TextInput
        placeholder="Parent Contact"
        value={parentContact}
        onChangeText={setParentContact}
        style={styles.input}
        keyboardType="phone-pad"
        placeholderTextColor="#ccc"
      />

      <TextInput
        placeholder="Parent Address"
        value={parentAddress}
        onChangeText={setParentAddress}
        style={[styles.input, { height: 80 }]}
        multiline
        placeholderTextColor="#ccc"
      />

      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#153370",
    padding: 20,
  },
  title: {
    fontSize: 26,
    color: "white",
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    color: "#fff",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 8,
    marginBottom: 15,
    overflow: "hidden",
  },
  picker: {
    color: "#fff",
    backgroundColor: "#153370",
  },
  button: {
    backgroundColor: "#1c4587",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});
