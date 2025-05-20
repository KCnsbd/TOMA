import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView, Alert, TextInput,} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomTabs from '../components/bottomTabs';
import { useNavigation } from '@react-navigation/native';
import { db, ref, onValue, update } from '../firebaseConfig';
import { useAuth } from '../AuthContext'; 

const sanitizeEmail = (email) => email.replace(/[@.]/g, '_');

export default function Profile() {
  const navigation = useNavigation();
  const { email } = useAuth(); 
  const sanitizedEmail = sanitizeEmail(email);

  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    aboutMe: '',
  });

  const [editableData, setEditableData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    location: '',
    specialty: '',
    aboutMe: '',
  });

  useEffect(() => {
    const userRef = ref(db, `users/${sanitizedEmail}`);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setUserData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          aboutMe: data.aboutMe || '',
        });
        setEditableData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          age: data.age || '',
          location: data.location || '',
          specialty: data.specialty || '',
          aboutMe: data.aboutMe || '',
        });
      }
    });
  }, []);

  const handleChange = (field, value) => {
    setEditableData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const userRef = ref(db, `users/${sanitizedEmail}`);
    update(userRef, editableData)
      .then(() => {
        setIsEditing(false);
        setUserData({
          firstName: editableData.firstName,
          lastName: editableData.lastName,
          email: editableData.email,
          aboutMe: editableData.aboutMe,
        });
        Alert.alert('Success', 'Profile updated successfully.');
      })
      .catch((err) => {
        console.error('Update failed: ', err);
        Alert.alert('Error', 'Failed to update profile.');
      });
  };

  const handleLogout = () => {
    Alert.alert(
      'Are you sure?',
      'Do you really want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => navigation.navigate('Sign In') },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
       
        <View style={styles.header}>
  <View style={styles.profileImage}>
    <Text style={styles.initialsText}>
      {`${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`}
    </Text>
  </View>
  <Text style={styles.userName}>
    {isEditing ? (
      <>
        <TextInput
          style={styles.input}
          value={editableData.firstName}
          onChangeText={(text) => handleChange('firstName', text)}
          placeholder="First Name"
          placeholderTextColor="#ccc"
        />
        <TextInput
          style={styles.input}
          value={editableData.lastName}
          onChangeText={(text) => handleChange('lastName', text)}
          placeholder="Last Name"
          placeholderTextColor="#ccc"
        />
      </>
    ) : (
      `${userData.firstName} ${userData.lastName}`
    )}
  </Text>
  <Text style={styles.userEmail}>
    {isEditing ? (
      <TextInput
        style={styles.input}
        value={editableData.email}
        onChangeText={(text) => handleChange('email', text)}
        placeholder="Email"
        placeholderTextColor="#ccc"
      />
    ) : (
      userData.email
    )}
  </Text>
</View>


        
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Personal Info</Text>
          {['age', 'location', 'specialty'].map((field, index) => (
            <View key={index}>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={editableData[field]}
                  onChangeText={(text) => handleChange(field, text)}
                  placeholderTextColor="#ccc"
                />
              ) : (
                <Text style={styles.infoText}>
                  {`${field.charAt(0).toUpperCase() + field.slice(1)}: ${editableData[field] || 'N/A'}`}
                </Text>
              )}
            </View>
          ))}
        </View>

       
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>About Me</Text>
          {isEditing ? (
            <TextInput
              style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
              multiline
              placeholder="Tell us about yourself..."
              value={editableData.aboutMe}
              onChangeText={(text) => handleChange('aboutMe', text)}
              placeholderTextColor="#ccc"
            />
          ) : (
            <Text style={styles.infoText}>
              {editableData.aboutMe || "I'm a creative UI/UX designer based in New York... 💻✨"}
            </Text>
          )}
        </View>

       
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
          >
            <Ionicons name={isEditing ? 'save' : 'settings'} size={24} color="#fff" />
            <Text style={styles.buttonText}>{isEditing ? 'Save' : 'Edit Profile'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Ionicons name="log-out" size={24} color="#fff" />
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomTabs />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  profileImage: {
  width: 120,
  height: 120,
  borderRadius: 60,
  backgroundColor: '#00a568',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 15,
},
initialsText: {
  fontSize: 40,
  fontWeight: 'bold',
  color: '#fff',
},
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#6b7280',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#00a568',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    lineHeight: 24,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#00a568',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600',
  },
});

