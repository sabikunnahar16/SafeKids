import React from "react";
import { Link } from "expo-router";
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import { NavigationProp } from '@react-navigation/native';

// Define the type for the navigation prop
type RootStackParamList = {
  Signup: undefined;
  Login: undefined;
};

type WelcomeScreenProps = {
  navigation: NavigationProp<RootStackParamList>;
};

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  return (
    <ImageBackground 
      source={require("@/assets/images/pexels-lagosfoodbank-8054617.jpg")} // Ensure this path is correct
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome to <Text style={styles.highlight}>SafeKids</Text></Text>
        <Text style={styles.description}>
          An app Where Safety Meets Technology that allows you Safe Arrival, Happy Parents .
        </Text>
        <Link href="./login" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </Link>
        <Link href="./signup1" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>
        </Link>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    paddingVertical: 20

  },
  highlight: {
    color: "#ff6600",
  },
  description: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#ff6600",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  signInText: {
    color: "white",
    fontSize: 16,
    marginTop: 10,
    textDecorationLine: "underline",
  },
});

export default WelcomeScreen;