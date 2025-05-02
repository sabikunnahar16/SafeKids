import { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../constants/FirebaseConfig"; // adjust if needed
import { useRouter } from "expo-router";

export default function LogoutScreen() {
  const router = useRouter();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await signOut(auth);
        router.replace("/login"); // redirect to login screen
      } catch (error) {
        Alert.alert("Logout Error", (error as Error).message);
        router.back(); // fallback if logout fails
      }
    };

    doLogout();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#153370" />
      <Text style={styles.text}>Logging out...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: "#153370",
  },
});



