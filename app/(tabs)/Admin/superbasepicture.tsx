import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
  ImageBackground,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { addDoc, collection } from "firebase/firestore";
import { firestore } from "../../../constants/FirebaseConfig";
import QRCode from "react-native-qrcode-svg";
import { useLocalSearchParams } from 'expo-router';
import { updateStudent } from './updateStudent';
import * as ImagePicker from 'expo-image-picker';
// Update the import path below if your supabaseClient file is located elsewhere
import { supabase } from '../../../constants/supabaseClient';

export default function StudentForm({
  onClose = () => {},
  existingStudent = null,
}: {
  onClose?: () => void;
  existingStudent?: any;
}) {
  const params = useLocalSearchParams();
  const parsedStudent = params.existingStudent ? JSON.parse(params.existingStudent as string) : existingStudent;
  const docId = params.id ? params.id.toString() : parsedStudent?.id || "";
  const [studentName, setStudentName] = useState(parsedStudent?.studentName || "");
  const [idNumber, setIdNumber] = useState(parsedStudent?.idNumber || "");
  const [email, setEmail] = useState(parsedStudent?.email || "");
  const [studentClass, setStudentClass] = useState(parsedStudent?.studentClass || "");
  const [parentName, setParentName] = useState(parsedStudent?.parentName || "");
  const [parentContact, setParentContact] = useState(parsedStudent?.parentContact || "");
  const [parentAddress, setParentAddress] = useState(parsedStudent?.parentAddress || "");
  const [imageUri, setImageUri] = useState(parsedStudent?.imageUrl || null);
  const [qrValue, setQrValue] = useState<string | null>(parsedStudent?.qrValue || null);

  const handleGenerateQRCode = () => {
    if (!studentName || !idNumber || !email || !studentClass || !parentName || !parentContact || !parentAddress) {
      Alert.alert("Missing Information", "Please fill in all the fields before generating the QR code.");
      return;
    }
    const studentData = {
      studentName,
      idNumber,
      email,
      parentContact,
    };
    setQrValue(JSON.stringify(studentData));
    Alert.alert("QR Code Generated", "The QR code has been successfully generated.");
  };

  const handleImagePick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Required", "Please allow access to photo library.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'] });
    if (!result.canceled && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      setImageUri(selectedAsset.uri);
    }
  };

  // Upload image to Supabase bucket named 'student-images' with any extension
  const uploadImageToSupabase = async (uri: string, fileName: string) => {
    // Try to get the file extension from the uri
    let extension = fileName.split('.').pop();
    if (!extension || extension.length > 5) {
      // fallback: try to extract from uri
      const match = uri.match(/\.([a-zA-Z0-9]+)(\?|$)/);
      extension = match ? match[1] : 'jpg';
    }
    // Ensure fileName has the correct extension
    let finalFileName = fileName;
    if (!finalFileName.endsWith('.' + extension)) {
      finalFileName = `${fileName}.${extension}`;
    }
    const response = await fetch(uri);
    const blob = await response.blob();
    // Try to get the correct content type
    let contentType = blob.type || `image/${extension}`;
    const { error } = await supabase.storage.from('student-images').upload(finalFileName, blob, {
      contentType,
      upsert: true,
    });
    if (error) throw error;
    const { data } = supabase.storage.from('student-images').getPublicUrl(finalFileName);
    return data.publicUrl;
  };

  const handleSubmit = async () => {
    if (!qrValue) {
      Alert.alert("QR Code Missing", "Please generate the QR code before submitting the form.");
      return;
    }
    try {
      let imageUrl = imageUri;
      if (imageUri && !imageUri.startsWith('https')) {
        // Try to extract extension from uri
        let ext = imageUri.split('.').pop();
        if (!ext || ext.length > 5) {
          const match = imageUri.match(/\.([a-zA-Z0-9]+)(\?|$)/);
          ext = match ? match[1] : 'jpg';
        }
        const fileName = `student-${idNumber}.${ext}`;
        imageUrl = await uploadImageToSupabase(imageUri, fileName);
      }
      const studentData: any = {
        studentName,
        idNumber,
        email,
        studentClass,
        parentName,
        parentContact,
        parentAddress,
        imageUrl,
        qrValue,
        updatedAt: new Date(),
      };
      if (docId) {
        await updateStudent(docId, studentData);
        Alert.alert("Updated", "Student updated successfully!");
      } else {
        studentData.createdAt = new Date();
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
        <View style={styles.formInner}>
          <TextInput
            placeholder="Student Name"
            value={studentName}
            onChangeText={setStudentName}
            style={styles.input}
          />
          <TextInput
            placeholder="Student ID (Custom)"
            value={idNumber}
            onChangeText={setIdNumber}
            style={styles.input}
            keyboardType="default"
            editable={true}
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
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
            <Text style={styles.buttonText}>Pick Student Image</Text>
          </Pressable>
          {imageUri && <Image source={{ uri: imageUri }} style={{ width: 100, height: 100, borderRadius: 8, marginTop: 10 }} />}
          <Pressable style={styles.smallButton} onPress={handleGenerateQRCode}>
            <Text style={styles.buttonText}>Generate QR Code</Text>
          </Pressable>
          {qrValue && <View style={styles.qrContainer}><QRCode value={qrValue} size={200} /></View>}
          <Pressable style={styles.smallButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

// styles unchanged


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
