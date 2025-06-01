import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Alert,
} from "react-native";
import { firestore } from "@/constants/FirebaseConfig"; // Adjust path as needed
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export default function LeavesApplication() {
  const [leaves, setLeaves] = useState<
    {
      id: string;
      studentName?: string;
      studentClass?: string;
      roll?: string;
      reason?: string;
      fromDate?: string;
      toDate?: string;
      status?: string;
    }[]
  >([]);

  const fetchLeaves = async () => {
    try {
      const snapshot = await getDocs(collection(firestore, "leaveApplications"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as {
          studentName?: string;
          studentClass?: string;
          roll?: string;
          reason?: string;
          fromDate?: string;
          toDate?: string;
          status?: string;
        }),
      }));
      const pendingOnly = data.filter(
        (item) => item.status === "Pending"
      );
      setLeaves(pendingOnly);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch leave applications.");
      console.error("Error fetching leave applications:", error);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const updateStatus = async (id: string, status: "Approved" | "Disapproved") => {
    try {
      const leaveRef = doc(firestore, "leaveApplications", id);
      await updateDoc(leaveRef, { status });
      fetchLeaves(); // Refresh list after update
    } catch (error) {
      Alert.alert("Error", `Failed to update status to ${status}.`);
      console.error(`Error updating status for leave ID ${id}:`, error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pending Leave Applications</Text>
      {leaves.length === 0 ? (
        <Text style={styles.noData}>No pending requests.</Text>
      ) : (
        <FlatList
          data={leaves}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>
                {item.studentName} ({item.studentClass})
              </Text>
              <Text style={styles.info}>Roll No: {item.roll}</Text>
              <Text style={styles.reason}>Reason: {item.reason}</Text>
              <Text style={styles.date}>
                {item.fromDate} ➝ {item.toDate}
              </Text>
              <Text style={styles.status}>Status: {item.status}</Text>
              <View style={styles.buttons}>
                <Button
                  title="Approve"
                  onPress={() => updateStatus(item.id, "Approved")}
                  color="#4CAF50"
                />
                <Button
                  title="Disapprove"
                  onPress={() => updateStatus(item.id, "Disapproved")}
                  color="#F44336"
                />
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  noData: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#999",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  info: {
    fontSize: 14,
    marginBottom: 4,
    color: "#666",
  },
  reason: {
    fontSize: 14,
    marginBottom: 4,
    fontStyle: "italic",
  },
  date: {
    fontSize: 14,
    marginBottom: 6,
    color: "#444",
  },
  status: {
    fontWeight: "600",
    marginBottom: 8,
    color: "#ff9800",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
});
