import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { db } from '../firebaseConfig';
import { ref, get } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../AuthContext'; // Import the useAuth hook

const LoginScreen = () => {
  const navigation = useNavigation();
  const { setEmail } = useAuth(); // Access the setEmail function from context
  const [email, setEmailState] = useState('');
  const [password, setPassword] = useState('');

  const logInUser = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Oops!', 'Please fill in all fields 💡');
      return;
    }

    try {
      const userId = email.replace(/[@.]/g, '_');
      const snapshot = await get(ref(db, 'users/' + userId));

      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.password === password) {
          setEmail(email); // Store the email in global state using context
          navigation.navigate('Dashboard'); // No need to pass email explicitly here
        } else {
          Alert.alert('Wrong password ❌', 'Please try again.');
        }
      } else {
        Alert.alert('User not found ❌', 'Please sign up first.');
      }
    } catch (error) {
      console.error('Login error: ', error);
      Alert.alert('Error ❌', 'Failed to log in');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.header}>Login</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          value={email}
          onChangeText={setEmailState}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity onPress={() => navigation.navigate('Sign Up')} style={styles.signUpLink}>
          <Text style={styles.signUpText}>
            Don't have an account yet?{' '}
            <Text style={styles.signUpAction}>Sign Up</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={logInUser}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 10,
  },
  header: {
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#00a568',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    color: '#444',
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#00a568',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#FF6B81',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signUpLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  
  signUpText: {
    fontSize: 14,
    color: '#555',
  },
  
  signUpAction: {
    color: '#00a568',
    fontWeight: 'bold',
  },  
});

export default LoginScreen;
