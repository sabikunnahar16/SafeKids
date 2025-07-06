import React, { useState } from "react";
import { View, Text, TextInput, ImageBackground, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from 'expo-router';
import { auth, firestore } from '../../constants/FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userType, setUserType] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password || !userType) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Authenticate with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Check if the selected userType matches the stored userType
        if (userData.userType !== userType) {
          Alert.alert('Error', 'Selected user type does not match your account type');
          setLoading(false);
          return;
        }

        // Navigate based on userType
        switch (userType) {
          case "parent":
            router.push("../parent_dash/parent" as any);
            break;
          case "School Authority":
            router.push("../school_auth/SchoolAuth" as any);
            break;
          case "admin":
            router.push("../Admin/admin" as any);
            break;
          case "Bus Driver":
            router.push("../bus/BusDriver" as any);
            break;
          default:
            Alert.alert('Error', 'Invalid user type');
            break;
        }
      } else {
        Alert.alert('Error', 'User data not found');
      }
    } catch (error: any) {
      Alert.alert('Login Error', error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={require("@/assets/images/boy-goes-to-school-free-photo.jpg")} style={styles.background}>
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        <TextInput 
          style={styles.input} 
          placeholder="Email" 
          placeholderTextColor="#ddd" 
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        {/* Password Field with Eye Icon */}
        <View style={{ width: '100%', marginBottom: 15 }}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#ddd"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={{ position: 'absolute', right: 18, top: 16 }}
            onPress={() => setShowPassword((prev) => !prev)}
          >
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <Picker selectedValue={userType} style={styles.input} onValueChange={(itemValue) => setUserType(itemValue)}>
          <Picker.Item label="Log in as" value="" />
          <Picker.Item label="parent" value="parent" />
          <Picker.Item label="School Authority" value="School Authority" />
          <Picker.Item label="admin" value="admin" />
          <Picker.Item label="Bus Driver" value="Bus Driver" />
        </Picker>

        <TouchableOpacity 
          style={[styles.button, { opacity: loading ? 0.6 : 1 }]} 
          onPress={handleLogin} 
          disabled={!userType || !email || !password || loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
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
});

export default LoginScreen;
