import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { sendPasswordResetEmail, getAuth } from 'firebase/auth';
import { useRouter } from 'expo-router';

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      setErrorMessage('Please enter your email.');
      return;
    }

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      setErrorMessage(null);
      Alert.alert(
        'Success',
        'Password reset link sent to your email. Please check your inbox and follow the instructions to reset your password.',
        [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/login'); // Navigate to login screen
            },
          },
        ]
      );
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to send reset email.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Forgot Password</Text>
      <Text style={styles.info}>
        Enter your registered email address. We will send you a link to reset your password.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <Button title="Send Reset Link" onPress={handlePasswordReset} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#2563EB', textAlign: 'center' },
  info: { fontSize: 15, marginBottom: 16, color: '#555', textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  error: { color: 'red', marginBottom: 12, textAlign: 'center' },
});

export default ForgotPasswordScreen;