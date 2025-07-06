import { CameraView } from "expo-camera";
import { Stack } from "expo-router";
import {
  AppState,
  Linking,
  Platform,
  StatusBar,
  StyleSheet,
  Alert,
  View,
  Dimensions,
} from "react-native";
import { Overlay } from "./Overlay";
import { useEffect, useRef } from "react";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../../../../constants/FirebaseConfig";

export default function SchoolScannerScreen() {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const lastScannedStudentId = useRef<string | null>(null);
  const lastScanTime = useRef<number>(0);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (data && !qrLock.current) {
      qrLock.current = true;

      try {
        // Try to parse the QR code as student data
        const studentData = JSON.parse(data);

        if (studentData.studentName && studentData.idNumber) {
          // This is a student QR code - find the student in database and notify parent
          await findStudentAndNotifyParent(studentData);
        } else {
          // Not a student QR code
          Alert.alert(
            "Invalid QR Code",
            "This is not a valid student QR code.",
            [
              {
                text: "OK",
                onPress: () => {
                  qrLock.current = false;
                },
              },
            ]
          );
        }
      } catch (error) {
        // QR code is not JSON, check if it's a URL
        if (data.startsWith("http")) {
          Linking.openURL(data).catch((err) =>
            console.error("Failed to open URL:", err)
          );
          qrLock.current = false;
        } else {
          Alert.alert("QR Code Scanned", data, [
            {
              text: "OK",
              onPress: () => {
                qrLock.current = false;
              },
            },
          ]);
        }
      } finally {
        // Reset QR lock after all async operations complete
        setTimeout(() => {
          qrLock.current = false;
        }, 2000); // Wait 2 seconds before allowing another scan
      }
    }
  };

  const findStudentAndNotifyParent = async (qrStudentData: any) => {
    try {
      const currentTime = Date.now();
      const timeSinceLastScan = currentTime - lastScanTime.current;
      
      // Prevent duplicate scans of the same student within 10 seconds
      if (lastScannedStudentId.current === qrStudentData.idNumber && timeSinceLastScan < 10000) {
        console.log('⚠️ Duplicate scan prevented for student:', qrStudentData.idNumber);
        Alert.alert(
          "Recent Scan Detected",
          `Student ${qrStudentData.studentName} was already scanned recently. Please wait before scanning again.`,
          [
            {
              text: "OK",
              onPress: () => {
                // Duplicate scan handled
              },
            },
          ]
        );
        return;
      }

      // Update last scan tracking
      lastScannedStudentId.current = qrStudentData.idNumber;
      lastScanTime.current = currentTime;

      // Find the complete student record in Firestore using the student ID
      const studentsQuery = query(
        collection(firestore, "students"),
        where("idNumber", "==", qrStudentData.idNumber)
      );

      const studentSnapshot = await getDocs(studentsQuery);

      if (!studentSnapshot.empty) {
        const studentRecord = studentSnapshot.docs[0].data();
        await sendNotificationToParent(studentRecord, qrStudentData);
      } else {
        Alert.alert("Error", "Student record not found in database");
      }
    } catch (error) {
      console.error("Error finding student:", error);
      Alert.alert("Error", "Failed to find student record");
    }
  };

  const sendNotificationToParent = async (studentRecord: any, qrData: any) => {
    try {
      const timestamp = new Date();

      const notificationData = {
        studentName: studentRecord.studentName,
        studentId: studentRecord.idNumber,
        studentClass: studentRecord.studentClass,
        parentName: studentRecord.parentName,
        parentEmail: studentRecord.email, // This is the parent's Gmail from student table
        parentContact: studentRecord.parentContact,
        parentAddress: studentRecord.parentAddress,
        scanTime: timestamp,
        message: `Your child ${studentRecord.studentName} (ID: ${studentRecord.idNumber}, Class: ${studentRecord.studentClass}) has been scanned by school authority at ${timestamp.toLocaleString()}`,
        type: "school_scan_notification",
        status: "sent",
        scannedBy: "School Authority",
        location: "School Premises"
      };

      // Save notification to Firestore
      const docRef = await addDoc(collection(firestore, "notifications"), notificationData);
      console.log('✅ School scan notification saved with ID:', docRef.id);
      console.log('📧 Parent email for notifications:', notificationData.parentEmail);
      console.log('📄 Full notification data:', notificationData);

      // Show success message
      Alert.alert(
        '✅ Student Scanned Successfully!', 
        `📱 Notification sent to parent dashboard\n\n👤 Student: ${notificationData.studentName}\n🆔 ID: ${notificationData.studentId}\n📚 Class: ${notificationData.studentClass}\n⏰ Time: ${timestamp.toLocaleString()}\n🏫 Location: School Premises\n\nParent will be notified of this school scan.`,
        [
          {
            text: "OK",
            onPress: () => {
              // Success handled
            },
          },
        ]
      );

      console.log(
        "School scan notification sent to parent:",
        notificationData.parentEmail
      );

    } catch (error) {
      console.error("Error sending school scan notification:", error);
      Alert.alert("Error", "Failed to send notification to parent");
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "School Scanner", headerShown: false }} />
      {Platform.OS === "android" ? <StatusBar hidden /> : null}

      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={handleBarcodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      />

      <Overlay />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
