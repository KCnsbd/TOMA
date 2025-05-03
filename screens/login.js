import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { db, ref, set } from './firebaseConfig';

const AddDataScreen = () => {
  const [id, setId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');

  const addDataToRealtimeDatabase = async () => {
    if (!id.trim() || !firstName.trim() || !lastName.trim() || !age.trim()) {
      Alert.alert('Oops!', 'Please fill in all fields 💡');
      return;
    }
    try {
      await set(ref(db, 'users/' + id), {
        id,
        firstName,
        lastName,
        age: parseInt(age, 10),
        createdAt: new Date().toISOString(),
      });

      Alert.alert('Success 🎉', 'Data added successfully!');
      setId('');
      setFirstName('');
      setLastName('');
      setAge('');
    } catch (error) {
      console.error('Error adding document: ', error);
      Alert.alert('Error ❌', 'Failed to add data');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>👩‍💻 Add User Info</Text>

      <View style={styles.card}>
        <Text style={styles.label}>ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter ID"
          value={id}
          onChangeText={setId}
          keyboardType="numeric"
        />

        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter First Name"
          value={firstName}
          onChangeText={setFirstName}
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Last Name"
          value={lastName}
          onChangeText={setLastName}
        />

        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={addDataToRealtimeDatabase}>
          <Text style={styles.buttonText}>➕ Add Data</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5EC',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#FF6B81',
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
});

export default AddDataScreen;
