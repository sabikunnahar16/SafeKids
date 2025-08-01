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
import { addDoc, collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { firestore } from "../../../../constants/FirebaseConfig";

export default function ScannerScreen() {
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
      console.log('🔍 QR Code scanned, raw data:', data);

      try {
        // Try to parse the QR code as student data
        const studentData = JSON.parse(data);
        console.log('✅ Parsed QR data successfully:', studentData);

        if (studentData.studentName && studentData.idNumber) {
          console.log(`👤 Valid student QR detected: ${studentData.studentName} (ID: ${studentData.idNumber})`);
          // This is a student QR code - find the student in database and notify parent
          await findStudentAndNotifyParent(studentData);
          
          // Reset the QR lock after successful processing - moved to finally block
        } else {
          console.log('❌ QR data missing required fields:', { 
            hasStudentName: !!studentData.studentName, 
            hasIdNumber: !!studentData.idNumber 
          });
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
        console.log('❌ Failed to parse QR as JSON:', error);
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
      console.log('🔍 Looking up student in database:', qrStudentData);
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

      console.log('📊 Querying students collection for ID:', qrStudentData.idNumber);
      const studentSnapshot = await getDocs(studentsQuery);
      console.log(`📋 Found ${studentSnapshot.size} students with ID ${qrStudentData.idNumber}`);

      if (!studentSnapshot.empty) {
        const studentRecord = studentSnapshot.docs[0].data();
        console.log('✅ Student record found:', studentRecord);
        await sendNotificationToParent(studentRecord, qrStudentData);
      } else {
        console.log('❌ No student record found in database for ID:', qrStudentData.idNumber);
        Alert.alert("Error", "Student record not found in database");
      }
    } catch (error) {
      console.error("❌ Error finding student:", error);
      Alert.alert("Error", "Failed to find student record");
    }
  };

  const sendNotificationToParent = async (studentRecord: any, qrData: any) => {
    try {
      const timestamp = new Date();
      console.log(`🚌 Bus scanner processing for student: ${studentRecord.studentName} (ID: ${studentRecord.idNumber})`);

      // Determine if this is an IN or OUT scan based on recent records
      let scanType: 'IN' | 'OUT' = 'IN'; // Default to IN
      
      // Check the most recent record for this student
      const recentRecordsQuery = query(
        collection(firestore, 'inOutRecords'),
        where('studentId', '==', studentRecord.idNumber)
      );
      
      const recentRecordsSnapshot = await getDocs(recentRecordsQuery);
      console.log(`📊 Found ${recentRecordsSnapshot.size} existing records for student ${studentRecord.idNumber}`);
      
      const recentRecords = recentRecordsSnapshot.docs
        .map(doc => ({ ...doc.data(), timestamp: doc.data().timestamp.toDate() }))
        .sort((a: any, b: any) => b.timestamp.getTime() - a.timestamp.getTime());

      // If the most recent record is IN, this should be OUT, and vice versa
      if (recentRecords.length > 0) {
        const lastRecord = recentRecords[0] as any;
        scanType = lastRecord.type === 'IN' ? 'OUT' : 'IN';
        console.log(`🔄 Last record was ${lastRecord.type}, so this will be ${scanType}`);
      } else {
        console.log(`🆕 No previous records, defaulting to ${scanType}`);
      }

      // Create IN/OUT record (same as school authority scanner)
      const inOutRecord = {
        studentId: studentRecord.idNumber,
        studentName: studentRecord.studentName,
        type: scanType,
        timestamp: Timestamp.fromDate(timestamp),
        location: 'School Bus',
        scannerType: 'bus',
        recordedBy: 'Bus Driver'
      };
      
      console.log(`💾 Creating IN/OUT record:`, inOutRecord);
      const inOutDocRef = await addDoc(collection(firestore, 'inOutRecords'), inOutRecord);
      console.log(`✅ IN/OUT record created with ID: ${inOutDocRef.id} - ${scanType} for student ${studentRecord.studentName}`);

      const notificationData = {
        studentName: studentRecord.studentName,
        studentId: studentRecord.idNumber,
        studentClass: studentRecord.studentClass,
        parentName: studentRecord.parentName,
        parentEmail: studentRecord.email, // This is the parent's Gmail from student table
        parentContact: studentRecord.parentContact,
        parentAddress: studentRecord.parentAddress,
        scanTime: timestamp,
        message: `Your child ${studentRecord.studentName} (ID: ${studentRecord.idNumber}, Class: ${studentRecord.studentClass}) has been marked ${scanType} on the school bus at ${timestamp.toLocaleString()}`,
        type: "scan_notification",
        status: "sent",
        scannedBy: "Bus Driver",
        location: "School Bus",
        inOutType: scanType
      };

      // Save notification to Firestore
      const docRef = await addDoc(collection(firestore, "notifications"), notificationData);
      console.log('✅ Notification saved with ID:', docRef.id);
      console.log('📧 Parent email for notifications:', notificationData.parentEmail);
      console.log('📄 Full notification data:', notificationData);

      // Show success message (no email sent)
      Alert.alert(
        '✅ Notification Sent Successfully!', 
        `📱 In-app notification: Saved to parent dashboard\n📊 IN/OUT Record: ${scanType} recorded\n\n👤 Student: ${notificationData.studentName}\n🆔 ID: ${notificationData.studentId}\n📚 Class: ${notificationData.studentClass}\n⏰ Time: ${timestamp.toLocaleString()}\n🚌 Action: Marked ${scanType}\n\nParent can view this notification and IN/OUT record in their app dashboard.`,
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
        "Notification sent to parent:",
        notificationData.parentEmail
      );

    } catch (error) {
      console.error("Error sending notification:", error);
      Alert.alert("Error", "Failed to send notification to parent");
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Scanner", headerShown: false }} />
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
