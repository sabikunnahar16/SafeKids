import React, { useState } from "react";
import { View, Text, TextInput, ImageBackground, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from 'expo-router';

const LoginScreen = () => {
  const router = useRouter();
  const [userType, setUserType] = useState<string>("");

  const handleLogin = () => {
    switch (userType) {
      case "parent":
        router.push("/parent" as any);
        break;
      case "School Authority":
        router.push("/SchoolAuth" as any);
        break;
      case "admin":
        router.push("/admin");
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
        <Text style={styles.title}>Login</Text>

        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#ddd" />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#ddd" secureTextEntry />

        <Picker selectedValue={userType} style={styles.input} onValueChange={(itemValue) => setUserType(itemValue)}>
          <Picker.Item label="Log in as" value="" />
          <Picker.Item label="parent" value="parent" />
          <Picker.Item label="School Authority" value="SchoolAuth" />
          <Picker.Item label="Admin" value="admin" />
          <Picker.Item label="Bus Driver" value="BusDriver" />
        </Picker>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={!userType}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.linkContainer}>
          Don't have an account?{" "}
          <TouchableOpacity onPress={() => router.push("/signup1" as any)}>
            <Text style={styles.link}>Sign Up</Text>
          </TouchableOpacity>
        </Text>

        <TouchableOpacity onPress={() => router.push("/ForgotPassword" as any)}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <Text style={styles.orLoginWith}>Or Login With</Text>
        <View style={styles.socialLoginContainer}>
          <TouchableOpacity onPress={() => {/* Handle Google login */}}>
            <Image source={require("@/assets/icons/google.png")} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {/* Handle Facebook login */}}>
            <Image source={require("@/assets/icons/facebook.webp")} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {/* Handle Instagram login */}}>
            <Image source={require("@/assets/icons/instagram.png")} style={styles.socialIcon} />
          </TouchableOpacity>
        </View>
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
  linkContainer: { color: "#fff", marginTop: 15, fontSize: 16, flexDirection: "row" },
  link: { color: "#FF6600", marginLeft: 5, fontSize: 16 },
  forgotPassword: { color: "#FF6600", marginTop: 15, fontSize: 16 },
  orLoginWith: { color: "#fff", marginTop: 20, fontSize: 16 },
  socialLoginContainer: { flexDirection: "row", justifyContent: "space-around", marginTop: 20, width: "100%" },
  socialIcon: { width: 40, height: 40 },
});

export default LoginScreen;
