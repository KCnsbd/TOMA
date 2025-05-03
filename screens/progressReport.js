import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PieChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';


const projects = [
  { id: 1, title: 'GEHISTO Video', progress: 75 },
  { id: 2, title: 'GEFIL02 Whole Paper', progress: 40 },
  { id: 3, title: 'CSPL System', progress: 10 },
  { id: 4, title: 'ITECC06 System', progress: 100 },
];

const getStatus = (progress) => {
  if (progress === 100) return 'done';
  if (progress > 0) return 'in progress';
  return 'to-do';
};

// Dummy data for the Pie Chart
const pieData = [
  {
    name: 'Completed',
    progress: projects.filter((project) => project.progress === 100).length,
    color: '#00a568',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'In Progress',
    progress: projects.filter((project) => project.progress > 0 && project.progress < 100).length,
    color: '#FFE761',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'To Do',
    progress: projects.filter((project) => project.progress === 0).length,
    color: '#FF0000',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
];

export default function ProgressReport() {
    const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Ionicons name="arrow-back" size={24} color="#ffffff" />
        <Text style={styles.topBarTitle}>Progress Report</Text>
      </View>

      {/* Progress Chart */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.reportTitle}>Project Progress Overview</Text>
        <View style={styles.chartContainer}>
          <PieChart
            data={pieData}
            width={300}
            height={200}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#f3f4f6',
              backgroundGradientTo: '#f3f4f6',
              color: (opacity = 1) => `rgba(0, 165, 104, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="progress"
            backgroundColor="transparent"
            paddingLeft="15"
          />
        </View>

        {/* Project List */}
        <Text style={styles.reportTitle}>Projects Status</Text>
        {projects.map((project) => (
          <View key={project.id} style={styles.projectCard}>
            <Text style={styles.projectTitle}>{project.title}</Text>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${project.progress}%` }]} />
            </View>
            <Text style={styles.projectStatus}>Status: {getStatus(project.progress)}</Text>
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
          <Ionicons name="list" size={24} color="#6b7280" />
          <Text style={styles.bottomButtonText}>My Projects</Text>
        </TouchableOpacity>

        {/* Centered "+" Button */}
        <TouchableOpacity style={styles.centerButton} >
          <Ionicons name="add" size={30} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('Progress Report')}>
          <Ionicons name="bar-chart" size={24} color="#00a568" />
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
  reportTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textTransform: 'capitalize',
    color: '#333',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  projectCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: 10,
    backgroundColor: '#85d1b2',
  },
  projectStatus: {
    color: '#6b7280',
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
