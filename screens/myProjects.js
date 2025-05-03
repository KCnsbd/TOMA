import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import icons
import { useNavigation } from '@react-navigation/native';


const projects = [
  { id: 1, title: 'GEHISTO Video', progress: 75, deadline: '2025-05-05' },
  { id: 2, title: 'GEFIL02 Whole Paper', progress: 40, deadline: '2025-04-28' },
  { id: 3, title: 'CSPL System', progress: 10, deadline: '2025-05-01' },
  { id: 4, title: 'ITECC06 System', progress: 100, deadline: '2025-05-10' },
];

// Function to determine the project status
const getStatus = (progress) => {
  if (progress === 100) return 'done';
  if (progress > 0) return 'in progress';
  return 'to-do';
};

export default function MyProjects() {
    const navigation = useNavigation();
  return (
    <View style={styles.container}>
      
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.topBarTitle}>My Projects</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Project Categories */}
        {['done', 'in progress', 'to-do'].map((status) => (
          <View key={status} style={styles.statusSection}>
            <Text style={styles.statusTitle}>{status.charAt(0).toUpperCase() + status.slice(1)}</Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {projects
                .filter((project) => getStatus(project.progress) === status)
                .map((project) => (
                  <View key={project.id} style={styles.card}>
                    <Text style={styles.title}>{project.title}</Text>
                    <Text style={styles.deadline}>Deadline: {project.deadline}</Text>
                    <View style={styles.progressBarBackground}>
                      <View style={[styles.progressBarFill, { width: `${project.progress}%` }]} />
                    </View>
                    <TouchableOpacity style={styles.button}>
                      <Text style={styles.buttonText}>View Details</Text>
                    </TouchableOpacity>
                  </View>
                ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomBar}>
              <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('Dashboard')}>
                <Ionicons name="home" size={24} color="#6b7280" />
                <Text style={styles.bottomButtonText}>Dashboard</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('My Projects')}>
                <Ionicons name="list" size={24} color="#00a568" />
                <Text style={styles.bottomButtonText}>My Projects</Text>
              </TouchableOpacity>
      
              {/* Centered "+" Button */}
              <TouchableOpacity style={styles.centerButton} >
                <Ionicons name="add" size={30} color="#ffffff" />
              </TouchableOpacity>
      
              <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('Progress Report')}>
                <Ionicons name="bar-chart" size={24} color="#6b7280" />
                <Text style={styles.bottomButtonText}>Progress Report</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('Profile')}>
                <Ionicons name="person" size={24} color="#6b7280" />
                <Text style={styles.bottomButtonText}>Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    elevation: 8,
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 8,
    marginTop: 20,
  },
  topBarTitle: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  statusSection: {
    marginBottom: 20,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'capitalize',
    color: '#333',
  },
  horizontalScroll: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginRight: 16, // Space between cards
    width: 250, // Width of each card
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  deadline: {
    color: '#6b7280',
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: 10,
    backgroundColor: '#85d1b2',
  },
  button: {
    backgroundColor: '#00a568',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    justifyContent: 'space-around',
  },
  bottomButton: {
    alignItems: 'center',
  },
  bottomButtonText: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 4,
  },
  centerButton: {
    backgroundColor: '#00a568',
    borderRadius: 50,
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 25, // Adjust to ensure it sits above the other buttons
    left: '50%',
    transform: [{ translateX: -30 }], // Centers the button
    elevation: 8,
  },
});