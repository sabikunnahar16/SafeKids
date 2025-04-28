// components/pages/StudentForm.tsx
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { firestore } from "../../constants/FirebaseConfig";

export default function StudentForm({ onClose }: { onClose: () => void }) {
  const [studentName, setStudentName] = useState("");
  const [roll, setRoll] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentContact, setParentContact] = useState("");
  const [parentAddress, setParentAddress] = useState("");

  const handleSubmit = async () => {
    try {
      await addDoc(collection(firestore, "students"), {
        studentName,
        roll,
        studentClass,
        parentName,
        parentContact,
        parentAddress,
        createdAt: new Date(),
      });
      Alert.alert("Success", "Student added successfully!");
      onClose(); // 🔥 after submit, close form!
    } catch (error) {
      console.error("Error adding student: ", error);
      Alert.alert("Error", "Failed to add student.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Student</Text>

      <TextInput
        placeholder="Student Name"
        value={studentName}
        onChangeText={setStudentName}
        style={styles.input}
        placeholderTextColor="#ccc"
      />
      <TextInput
        placeholder="Roll Number"
        value={roll}
        onChangeText={setRoll}
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
          <Picker.Item label="Class 1-1" value="Class" />
          <Picker.Item label="Class 1-2" value="Class " />
          <Picker.Item label="Class 2-1" value="Class 2" />
          <Picker.Item label="Class 2-2" value="Class 2" />
          <Picker.Item label="Class 3-1" value="Class 3" />
          <Picker.Item label="Class 3-2" value="Class 3" />
          <Picker.Item label="Class 4-1" value="Class" />
          <Picker.Item label="Class 4-2" value="Class " />
          <Picker.Item label="Class 5-1" value="Class " />
          <Picker.Item label="Class 5-2" value="Class " />
          <Picker.Item label="Class 6-1" value="Class " />
          <Picker.Item label="Class 6-2" value="Class " />
          <Picker.Item label="Class 7-1" value="Class " /> 
          <Picker.Item label="Class 8-1" value="Class " />
          <Picker.Item label="Class 8-2" value="Class " />
          <Picker.Item label="Class 9-1" value="Class " />
          <Picker.Item label="Class 9-2" value="Class " />
          <Picker.Item label="Class 10-1" value="Class " />
          <Picker.Item label="Class 10-2" value="Class " />

          {/* more classes */}
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
    fontSize: 24,
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
