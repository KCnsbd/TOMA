import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import BottomTabs from '../components/bottomTabs';
import { db, ref, onValue } from '../firebaseConfig';
import { useAuth } from '../AuthContext'; 

const screenWidth = Dimensions.get('window').width;

const sanitizeEmail = (email) => email.replace(/[@.]/g, '_');

const getStatus = (progress) => {
  if (progress === 100) return 'done';
  if (progress > 0) return 'in progress';
  return 'to-do';
};

export default function ProgressReport() {
  const navigation = useNavigation();
  const { email } = useAuth(); 
  
  const sanitizedEmail = sanitizeEmail(email);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subtaskCounts, setSubtaskCounts] = useState({ completed: 0, pending: 0 });

  useEffect(() => {
    const projectsRef = ref(db, `users/${sanitizedEmail}/projects`);
    onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        let totalCompletedSubtasks = 0;
        let totalPendingSubtasks = 0;

        const loadedProjects = Object.entries(data).map(([id, value]) => {
          const subtasks = value.subtasks || [];
          const completedCount = subtasks.filter((task) => task.isCompleted).length;
          const totalCount = subtasks.length || 1;
          totalCompletedSubtasks += completedCount;
          totalPendingSubtasks += totalCount - completedCount;

          const progress = Math.round((completedCount / totalCount) * 100);
          return { id, ...value, progress };
        });

        setProjects(loadedProjects);
        setSubtaskCounts({ completed: totalCompletedSubtasks, pending: totalPendingSubtasks });
      }
      setLoading(false);
    });
  }, []);

  const completedCount = projects.filter((p) => p.progress === 100).length;
  const inProgressCount = projects.filter((p) => p.progress > 0 && p.progress < 100).length;
  const toDoCount = projects.filter((p) => p.progress === 0).length;
  const avgProgress = projects.length
    ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
    : 0;

  const pieData = [
    { name: 'Completed', progress: completedCount, color: '#079aad', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'In Progress', progress: inProgressCount, color: '#3db787', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'To Do', progress: toDoCount, color: '#7ad759', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  ];

  const barData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [subtaskCounts.completed, subtaskCounts.pending],
      },
    ],
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Progress Report</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <View style={styles.chartContainer}>
            <ActivityIndicator size="large" color="#00a568" />
          </View>
        ) : (
          <>
            {/* Overview Numbers */}
            <Text style={styles.reportTitle}>Analytics Summary</Text>
            <View style={styles.analyticsBox}>
              <Text>Total Projects: {projects.length}</Text>
              <Text>Completed: {completedCount}</Text>
              <Text>In Progress: {inProgressCount}</Text>
              <Text>To Do: {toDoCount}</Text>
              <Text>Average Progress: {avgProgress}%</Text>
            </View>

            {/* Pie Chart */}
            <Text style={styles.reportTitle}>Project Status Distribution</Text>
            <View style={styles.chartContainer}>
              <PieChart
                data={pieData}
                width={screenWidth - 32}
                height={200}
                chartConfig={chartConfig}
                accessor="progress"
                backgroundColor="transparent"
                paddingLeft="15"
              />
            </View>

            {/* Bar Chart */}
            <Text style={styles.reportTitle}>Subtasks Completion Status</Text>
            <View style={styles.chartContainer}>
              <BarChart
                data={barData}
                width={screenWidth - 32}
                height={220}
                fromZero
                chartConfig={chartConfig}
                showValuesOnTopOfBars
              />
            </View>

            {/* Average Progress Bar */}
            <Text style={styles.reportTitle}>Overall Progress</Text>
            <View style={styles.projectCard}>
              <Text style={styles.projectTitle}>Average Completion</Text>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: `${avgProgress}%` }]} />
              </View>
              <Text style={styles.projectStatus}>{avgProgress}% done</Text>
            </View>

            {/* Individual Project Cards */}
            <Text style={styles.reportTitle}>Projects Breakdown</Text>
            {projects.map((project) => (
              <View key={project.id} style={styles.projectCard}>
                <Text style={styles.projectTitle}>{project.projectName}</Text>
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBarFill, { width: `${project.progress}%` }]} />
                </View>
                <Text style={styles.projectStatus}>Status: {getStatus(project.progress)}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      <BottomTabs />
    </View>
  );
}

const chartConfig = {
  backgroundGradientFrom: '#f3f4f6',
  backgroundGradientTo: '#f3f4f6',
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  decimalPlaces: 0,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  topBar: {
  flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 25, 
    paddingBottom: 10,
    elevation: 8,
  },
  topBarTitle: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 12,
    color: '#333',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  analyticsBox: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  projectCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  projectTitle: {
    fontSize: 16,
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
    backgroundColor: '#4ade80',
  },
  projectStatus: {
    color: '#6b7280',
  },
});
