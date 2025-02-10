import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePasswordReset = () => {
    if (!email.trim()) {
      setErrorMessage('Please enter your email.');
      return;
    }

    if (email !== 'uixlibraries@gmail.com') {
      setErrorMessage('We cannot find your email.');
    } else {
      setErrorMessage(null);
      Alert.alert('Success', 'Password reset link sent to your email.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <Image
        source={{ uri: 'https://thrivesportsco.co.uk/wp-content/uploads/2023/08/Thrive-Sports-Co.-Pitch_Page_16_Image_0001.jpg' }} // Replace this with your logo URL
        style={styles.logo}
      />
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Enter your email and we'll send you a link to reset your password.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <TouchableOpacity style={styles.submitButton} onPress={handlePasswordReset}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton}>
        <Text style={styles.backText}>⬅ Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f9f9f9',
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1A73E8',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backButton: {
    alignItems: 'center',
  },
  backText: {
    color: '#1A73E8',
    marginTop: 8,
  },
});

export default ForgotPasswordScreen;
