import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../../constants/FirebaseConfig";
import * as ImagePicker from "expo-image-picker";
import QRCode from "react-native-qrcode-svg";

export default function StudentForm({
  onClose,
  existingStudent = null,
}: {
  onClose: () => void;
  existingStudent?: any;
}) {
  const [studentName, setStudentName] = useState(existingStudent?.studentName || "");
  const [id, setId] = useState(existingStudent?.id || "");
  const [studentClass, setStudentClass] = useState(existingStudent?.studentClass || "");
  const [parentName, setParentName] = useState(existingStudent?.parentName || "");
  const [parentContact, setParentContact] = useState(existingStudent?.parentContact || "");
  const [parentAddress, setParentAddress] = useState(existingStudent?.parentAddress || "");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [qrValue, setQrValue] = useState<string | null>(null);

  const handleImagePick = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert("Permission Denied", "You need to allow access to the media library.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Image picker error: ", error);
      Alert.alert("Error", "Failed to pick an image.");
    }
  };

  const handleGenerateQRCode = () => {
    if (!studentName || !id || !studentClass || !parentName || !parentContact || !parentAddress) {
      Alert.alert("Missing Information", "Please fill in all the fields before generating the QR code.");
      return;
    }

    const studentData = {
      studentName,
      id,
      studentClass,
      parentName,
      parentContact,
      parentAddress,
      imageUri,
    };

    setQrValue(JSON.stringify(studentData));
    Alert.alert("QR Code Generated", "The QR code has been successfully generated.");
  };

  const handleSubmit = async () => {
    if (!qrValue) {
      Alert.alert("QR Code Missing", "Please generate the QR code before submitting the form.");
      return;
    }

    try {
      const studentData = {
        studentName,
        id,
        studentClass,
        parentName,
        parentContact,
        parentAddress,
        imageUri,
        qrValue,
        createdAt: new Date(),
      };

      if (existingStudent?.id) {
        const studentRef = doc(firestore, "students", existingStudent.id);
        await updateDoc(studentRef, {
          ...studentData,
          updatedAt: new Date(),
        });
        Alert.alert("Updated", "Student updated successfully!");
      } else {
        await addDoc(collection(firestore, "students"), studentData);
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
      <Text style={styles.title}>Student Registration</Text>

      <TextInput
        placeholder="Student Name"
        value={studentName}
        onChangeText={setStudentName}
        style={styles.input}
      />
      <TextInput
        placeholder="ID"
        value={id}
        onChangeText={setId}
        style={styles.input}
        keyboardType="default"
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

      <Pressable style={styles.button} onPress={handleImagePick}>
        <Text style={styles.buttonText}>Pick Image</Text>
      </Pressable>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
      )}

      <Pressable style={styles.button} onPress={handleGenerateQRCode}>
        <Text style={styles.buttonText}>Generate QR Code</Text>
      </Pressable>

      {qrValue && (
        <View style={styles.qrContainer}>
          <Text style={styles.qrTitle}>Generated QR Code:</Text>
          <QRCode value={qrValue} size={200} />
        </View>
      )}

      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    color: "#2c3e50",
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#bdc3c7",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: "#34495e",
    backgroundColor: "#ecf0f1",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#bdc3c7",
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#ecf0f1",
  },
  picker: {
    fontSize: 16,
    color: "#34495e",
  },
  button: {
    backgroundColor: "#3498db",
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
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: "center",
  },
  qrContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
