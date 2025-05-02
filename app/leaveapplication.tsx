import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { firestore } from "../constants/FirebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function ParentLeaves() {
  const [view, setView] = useState<"none" | "form" | "status">("none");

  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [roll, setRoll] = useState("");
  const [reason, setReason] = useState("");
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);

  const [latestLeave, setLatestLeave] = useState<any>(null);

  const fetchLeaves = async () => {
    const snapshot = await getDocs(collection(firestore, "leaveApplications"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as { roll: string; [key: string]: any }),
    }));
    const userLeaves = data.filter((item) => item.roll === roll);
    if (userLeaves.length > 0) {
      const lastLeave = userLeaves[userLeaves.length - 1];
      setLatestLeave(lastLeave);
    } else {
      setLatestLeave(null);
    }
  };

  useEffect(() => {
    if (view === "status") fetchLeaves();
  }, [view]);

  const handleAddLeave = async () => {
    if (!studentName || !studentClass || !reason || !roll) {
      Alert.alert("Validation", "Please fill all fields");
      return;
    }

    await addDoc(collection(firestore, "leaveApplications"), {
      studentName,
      studentClass,
      roll,
      reason,
      fromDate: fromDate.toISOString().split("T")[0],
      toDate: toDate.toISOString().split("T")[0],
      status: "Pending",
    });

    Alert.alert("Submitted", "Your leave request is pending.");
    setStudentName("");
    setStudentClass("");
    setRoll("");
    setReason("");
    setView("none");
  };

  return (
    <SafeAreaView style={styles.container}>
      {view === "none" && (
        <View style={styles.centered}>
          <TouchableOpacity onPress={() => setView("form")} style={styles.iconBtn}>
            <Ionicons name="add-circle-outline" size={60} color="#007AFF" />
            <Text style={styles.iconText}>Add Leave Request</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setView("status")} style={styles.iconBtn}>
            <MaterialIcons name="visibility" size={60} color="#34A853" />
            <Text style={styles.iconText}>View Leave Status</Text>
          </TouchableOpacity>
        </View>
      )}

      {view === "form" && (
        <ScrollView>
          <Text style={styles.title}>Leave Application Form</Text>

          <TextInput
            placeholder="Student Name"
            style={styles.input}
            value={studentName}
            onChangeText={setStudentName}
          />
          <TextInput
            placeholder="Class"
            style={styles.input}
            value={studentClass}
            onChangeText={setStudentClass}
          />
          <TextInput
            placeholder="Roll"
            style={styles.input}
            value={roll}
            onChangeText={setRoll}
          />
          <TextInput
            placeholder="Reason"
            style={styles.input}
            value={reason}
            onChangeText={setReason}
          />

          <View style={styles.dateContainer}>
            <Text>From:</Text>
            <TouchableOpacity onPress={() => setShowFrom(true)} style={styles.dateButton}>
              <Text style={styles.dateText}>{fromDate.toDateString()}</Text>
            </TouchableOpacity>
            {showFrom && (
              <DateTimePicker
                value={fromDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(e, date) => {
                  setShowFrom(false);
                  if (date) setFromDate(date);
                }}
              />
            )}
          </View>

          <View style={styles.dateContainer}>
            <Text>To:</Text>
            <TouchableOpacity onPress={() => setShowTo(true)} style={styles.dateButton}>
              <Text style={styles.dateText}>{toDate.toDateString()}</Text>
            </TouchableOpacity>
            {showTo && (
              <DateTimePicker
                value={toDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(e, date) => {
                  setShowTo(false);
                  if (date) setToDate(date);
                }}
              />
            )}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.smallButtonBlue} onPress={handleAddLeave}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallButtonRed} onPress={() => setView("none")}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {view === "status" && (
        <View>
          <TextInput
            placeholder="Enter Roll to View Status"
            style={styles.input}
            value={roll}
            onChangeText={setRoll}
          />
          <TouchableOpacity style={styles.smallButtonBlue} onPress={fetchLeaves}>
            <Text style={styles.buttonText}>Check Status</Text>
          </TouchableOpacity>

          {latestLeave && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                {latestLeave.studentName} ({latestLeave.studentClass})
              </Text>
              <Text style={styles.cardText}>{latestLeave.reason}</Text>
              <Text style={styles.cardText}>
                {latestLeave.fromDate} ➝ {latestLeave.toDate}
              </Text>
              <Text
                style={[
                  styles.cardStatus,
                  {
                    color:
                      latestLeave.status === "Approved"
                        ? "green"
                        : latestLeave.status === "Disapproved"
                        ? "red"
                        : "orange",
                  },
                ]}
              >
                Status: {latestLeave.status}
              </Text>
              <TouchableOpacity style={[styles.smallButtonBlue, { marginTop: 10 }]} onPress={() => setView("none")}>
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  iconBtn: { alignItems: "center", marginVertical: 20 },
  iconText: { fontSize: 16, marginTop: 8, color: "#333" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    padding: 8,
    marginVertical: 6,
    borderRadius: 5,
    borderColor: "#ccc",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  dateButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
  },
  dateText: {
    color: "white",
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  smallButtonBlue: {
    backgroundColor: "#007AFF",
    paddingVertical: 12, // Increased padding for better visibility
    paddingHorizontal: 20,
    borderRadius: 6,
    flex: 1,
    alignItems: "center",
    marginRight: 10,
  },
  smallButtonRed: {
    backgroundColor: "#FF3B30",
    paddingVertical: 12, // Increased padding for better visibility
    paddingHorizontal: 20,
    borderRadius: 6,
    flex: 1,
    alignItems: "center",
  },
  fullWidthButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12, // Increased padding for better visibility
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    width: "90%", // Full width with some margin
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center", // Ensure text is centered
  },
  card: {
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderRadius: 8,
    marginVertical: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 6 },
  cardText: { fontSize: 16, marginBottom: 6 },
  cardStatus: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 18,
  },
});
