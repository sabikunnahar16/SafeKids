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
  ImageBackground,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { firestore,storage } from "../../../constants/FirebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
  const [imageUri, setImageUri] = useState<string | null>(existingStudent?.imageUri || null);
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
      let uploadedImageUrl = imageUri;
      if (imageUri && !imageUri.startsWith("http")) {
        // Upload image to Firebase Storage
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const storage = getStorage();
        const uniqueId = id || Date.now().toString();
        const storageRef = ref(storage, `students/${uniqueId}.jpg`);
        await uploadBytes(storageRef, blob);
        uploadedImageUrl = await getDownloadURL(storageRef);
      }

      // If adding a new student, generate a unique id for the student
      let studentDocId = id;
      if (!existingStudent?.id && !id) {
        studentDocId = Date.now().toString();
        setId(studentDocId);
      }

      const studentData = {
        studentName,
        id: studentDocId,
        studentClass,
        parentName,
        parentContact,
        parentAddress,
        imageUri: uploadedImageUrl,
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
    } catch (error: any) {
      console.error("Error saving student:", error);
      Alert.alert("Error", `Failed to save student.\n${error?.message || error}`);
    }
  };

  return (
    <ImageBackground source={require("@/assets/images/pexels-julia-m-cameron-6994992.jpg")} style={styles.bgImage} resizeMode="cover">
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Student Registration</Text>
        <View style={styles.formInner}> {/* New wrapper for alignment */}
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
          <Pressable style={styles.smallButton} onPress={handleImagePick}>
            <Text style={styles.buttonText}>Pick Image</Text>
          </Pressable>
          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          )}
          <Pressable style={styles.smallButton} onPress={handleGenerateQRCode}>
            <Text style={styles.buttonText}>QR Code</Text>
          </Pressable>
          {qrValue && (
            <View style={styles.qrContainer}>
              <Text style={styles.qrTitle}>Generated QR Code:</Text>
              <QRCode value={qrValue} size={200} />
            </View>
          )}
          <Pressable style={styles.smallButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </Pressable>
          {/* <Pressable style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable> */}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
    flexGrow: 1,
    marginTop: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    color: "#2c3e50",
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  formInner: {
    width: '100%',
    maxWidth: 350,
    alignSelf: 'center',
    alignItems: 'center',
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
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#bdc3c7",
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#ecf0f1",
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
  },
  picker: {
    fontSize: 16,
    color: "#34495e",
  },
  smallButton: {
    backgroundColor: "#3498db",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
    alignSelf: 'center',
    minWidth: 0,
    width: '100%',
    maxWidth: 320,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 0.5,
  },
  cancelButton: {
    backgroundColor: '#888',
    marginTop: 10,
    width: '100%',
    maxWidth: 320,
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 14,
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
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
