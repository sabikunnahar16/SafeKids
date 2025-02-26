import React, { useState } from "react";
import { View, Text, TextInput, ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from 'expo-router';

export default function SignUpScreen() {
  const router = useRouter();
  const [userType, setUserType] = useState("");

  const handleSignUp = () => {
    switch (userType) {
      case "parent":
        router.push("/parent" as any);
        break;
      case "School Authority":
        router.push("/SchoolAuth" as any);
        break;
      case "admin":
        router.push("/admin" as any);
        break;
      case "Bus Driver":
        router.push("/BusDriver" as any);
        break;
      default:
        break;
    }
  };

  return (
    <ImageBackground source={require("@/assets/images/pexels-cottonbro-6590933.jpg")} style={styles.background}>
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
        
        <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#ddd" />
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#ddd" />
        <TextInput style={styles.input} placeholder="Phone Number" placeholderTextColor="#ddd"/>
        
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#ddd" secureTextEntry />
        
        <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor="#ddd" secureTextEntry />
        <TextInput style={styles.input} placeholder="Address" placeholderTextColor="#ddd"/>

        <Picker
          selectedValue={userType}
          style={styles.input}
          onValueChange={(itemValue) => setUserType(itemValue)}
        >
          <Picker.Item label="Sign in as" value="" />
          <Picker.Item label="parent" value="parent" />
          <Picker.Item label="School Authority" value="SchoolAuth" />
          <Picker.Item label="Admin" value="admin" />
          <Picker.Item label="Bus Driver" value="BusDriver" />
        </Picker>

        <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={!userType}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login" as any)}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: "cover", justifyContent: "center" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0, 0, 0, 0.5)" },
  container: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 30 },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 20 },
  input: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    color: "#fff",
    fontSize: 16,
  },
  button: { backgroundColor: "#FF6600", padding: 15, borderRadius: 8, width: "100%", alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  link: { color: "#FF6600", marginTop: 15, fontSize: 16 },
});
