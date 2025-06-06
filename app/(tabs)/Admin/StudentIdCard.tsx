import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator, Alert, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { firestore } from "../../../constants/FirebaseConfig";
import QRCode from "react-native-qrcode-svg";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import ViewShot from "react-native-view-shot";

export default function StudentIdCard() {
  const { id } = useLocalSearchParams();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const viewShotRef = useRef<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetchStudent();
    }
  }, [id]);

  const fetchStudent = async () => {
    setLoading(true);
    try {
      const docRef = doc(firestore, "students", id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setStudent({ ...docSnap.data(), id: docSnap.id });
      } else {
        // Fallback: search all students for a matching idNumber or id field
        const studentsCol = collection(firestore, "students");
        const allDocs = await getDocs(studentsCol);
        let found = null;
        allDocs.forEach((docu) => {
          const data = docu.data();
          if (
            data.idNumber === id ||
            data.id === id ||
            (typeof id === "string" && data.idNumber === id.trim()) ||
            (typeof id === "string" && data.id === id.trim())
          ) {
            found = { ...data, id: docu.id };
          }
        });
        if (found) {
          setStudent(found);
        } else {
          Alert.alert("Not found", `Student not found for id: ${id}`);
          router.back();
        }
      }
    } catch (e) {
      Alert.alert("Error", `Failed to fetch student data for id: ${id}`);
      router.back();
    }
    setLoading(false);
  };

  const handleDownload = async () => {
    if (!viewShotRef.current) return;
    try {
      const uri = await viewShotRef.current.capture();
      await Sharing.shareAsync(uri);
    } catch (e) {
      Alert.alert("Error", "Failed to download ID card");
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#2563EB" /></View>;
  }
  if (!student) return (
    <View style={styles.center}>
      <Text style={styles.notFoundText}>Student not found. Please check the student record in the database.</Text>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backBtnText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.center}>
      <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1 }} style={styles.cardContainerPro}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <Image source={require("@/assets/images/logo.jpg")} style={styles.logoLarge} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.schoolName}>SafeKids School</Text>
            <Text style={styles.idCardTitle}>STUDENT IDENTITY CARD</Text>
          </View>
        </View>
        {/* Profile Row */}
        <View style={styles.profileRow}>
          {/* Try multiple possible image fields for compatibility */}
          {student.imageUri || student.photo || student.profileImage ? (
            <Image
              source={{ uri: student.imageUri || student.photo || student.profileImage }}
              style={styles.profileImgPro}
            />
          ) : (
            <View style={styles.profileImgPro} />
          )}
          <View style={styles.infoColPro}>
            <Text style={styles.labelPro}>Name: <Text style={styles.valuePro}>{student.studentName}</Text></Text>
            <Text style={styles.labelPro}>Class: <Text style={styles.valuePro}>{student.studentClass}</Text></Text>
            {/* Show ONLY the custom student id field, never the Firestore doc id */}
            <Text style={styles.labelPro}>ID: <Text style={styles.valuePro}>{student.idNumber || student.customId || "N/A"}</Text></Text>
            <Text style={styles.labelPro}>Parent: <Text style={styles.valuePro}>{student.parentName}</Text></Text>
            <Text style={styles.labelPro}>Parent Contact: <Text style={styles.valuePro}>{student.parentContact}</Text></Text>
          </View>
        </View>
        {/* QR and Footer */}
        <View style={styles.qrFooterRow}>
          <View style={styles.qrBoxPro}>
            {/* Use the saved qrValue from Firestore if available, otherwise fallback to idNumber or customId */}
            {(student.qrValue && typeof student.qrValue === 'string' && student.qrValue.trim() !== '') ? (
              <QRCode value={student.qrValue} size={80} />
            ) : (student.idNumber || student.customId) ? (
              <QRCode value={student.idNumber || student.customId} size={80} />
            ) : (
              <View style={{width: 80, height: 80, backgroundColor: '#eee', borderRadius: 8, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{color: '#888', fontSize: 12}}>No QR</Text>
              </View>
            )}
            <Text style={styles.qrLabelPro}>Scan for Student Info</Text>
          </View>
          <View style={styles.stampBox}>
            <Text style={styles.stampText}>School Stamp</Text>
          </View>
        </View>
      </ViewShot>
      <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload}>
        <Text style={styles.downloadBtnText}>Download ID Card</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f6fa",
    paddingVertical: 70,
  },
  notFoundText: {
    color: '#F43F5E',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
  },
  backBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  backBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardContainerPro: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 22,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 18,
    width: 370,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e7ff',
    paddingBottom: 10,
    marginBottom: 16,
  },
  logoLarge: {
    width: 54,
    height: 54,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  schoolName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563EB',
    letterSpacing: 1,
  },
  idCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#153370',
    letterSpacing: 1,
    marginTop: 2,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  profileImgPro: {
    width: 80,
    height: 96,
    borderRadius: 12,
    backgroundColor: '#e0e7ff',
    marginRight: 18,
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  infoColPro: {
    flex: 1,
    justifyContent: 'center',
  },
  labelPro: {
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  valuePro: {
    fontWeight: '600',
    color: '#153370',
  },
  qrFooterRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  qrBoxPro: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e7eb',
    marginRight: 18,
  },
  qrLabelPro: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: 'bold',
    marginTop: 6,
    textAlign: 'center',
  },
  stampBox: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f6fa',
  },
  stampText: {
    color: '#2563EB',
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
  },
  downloadBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    alignSelf: "center",
  },
  downloadBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
