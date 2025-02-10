import React from "react";
import { View, Text, TextInput, ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

type Props = {
  navigation: NavigationProp<any>;
};

export default function LoginScreen({ navigation }: Props) {
  return (
    <ImageBackground source={require("@/assets/images/pexels-cottonbro-6590933.jpg")} style={styles.background}>
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#ddd" />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#ddd" secureTextEntry />

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Success")}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.signupText}>Don't have an account? <Text style={styles.signupLink}>Sign Up</Text></Text>
        </TouchableOpacity>

        {/* Social Media Login */}
        <Text style={styles.orText}>Or Login With</Text>
        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="google" size={24} color="#DB4437" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="facebook" size={24} color="#3b5998" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="instagram" size={24} color="#C13584" />
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
  link: { color: "#FF6600", marginTop: 15, fontSize: 16 },
  signupText: { color: "#fff", marginTop: 20, fontSize: 16 },
  signupLink: { color: "#FF6600", fontWeight: "bold" },
  orText: { color: "#fff", marginTop: 25, fontSize: 16, fontWeight: "bold" },
  socialContainer: { flexDirection: "row", marginTop: 15 },
  socialButton: { marginHorizontal: 10, padding: 10, backgroundColor: "#fff", borderRadius: 50 },
});
