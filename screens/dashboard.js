import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db, ref, onValue } from '../firebaseConfig';
import BottomTabs from '../components/bottomTabs';
import { useAuth } from '../AuthContext';  

const sanitizeEmail = (email) => email.replace(/[@.]/g, '_');

export default function Dashboard() {
  const navigation = useNavigation();
  const { email } = useAuth(); 
  const sanitizedEmail = sanitizeEmail(email);  

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingTasks, setPendingTasks] = useState(0);

  useEffect(() => {
    const projectsRef = ref(db, `users/${sanitizedEmail}/projects`);
    onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedProjects = Object.entries(data).map(([id, value]) => {
          const subtasks = value.subtasks || [];
          const completed = subtasks.filter((t) => t.isCompleted).length;
          const total = subtasks.length || 1;
          const progress = Math.round((completed / total) * 100);

          return { id, ...value, subtasks, progress };
        });

        const totalPending = loadedProjects.reduce((acc, project) => {
          return acc + project.subtasks.filter((t) => !t.isCompleted).length;
        }, 0);

        setProjects(loadedProjects);
        setPendingTasks(totalPending);
      }
      setLoading(false);
    });
  }, [sanitizedEmail]); 

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.greeting}>Welcome back!</Text>
        <Text style={styles.subtitle}>Here’s what’s happening today.</Text>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryNumber}>{projects.length}</Text>
              <Text style={styles.summaryLabel}>Total Projects</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryNumber}>{pendingTasks}</Text>
              <Text style={styles.summaryLabel}>Pending Tasks</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Project Highlights</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {projects.map((project) => (
              <TouchableOpacity
                key={project.id}
                style={styles.projectCard}
                onPress={() => navigation.navigate('ProjectDetails', { project })}
              >
                <Text style={styles.projectTitle}>{project.projectName}</Text>
                <Text style={styles.projectDeadline}>Due: {project.deadline}</Text>
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBarFill, { width: `${project.progress}%` }]} />
                </View>
                <Text style={styles.projectProgress}>{project.progress}% Complete</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.actionCard}>
            <Text style={styles.actionText}>Need to start a new project?</Text>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Add Project')}>
              <Text style={styles.actionButtonText}>Create Now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
      <BottomTabs />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  banner: {
    backgroundColor: '#10b981',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  greeting: { fontSize: 22, color: '#ffffff', fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#e0f2f1', marginTop: 4 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16, paddingBottom: 100 },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 4,
  },
  summaryNumber: { fontSize: 22, fontWeight: 'bold', color: '#10b981' },
  summaryLabel: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#111827' },
  projectCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginRight: 12,
    width: 220,
    elevation: 3,
  },
  projectTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  projectDeadline: { fontSize: 13, color: '#6b7280', marginBottom: 6 },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 6,
  },
  progressBarFill: { height: 8, backgroundColor: '#34d399' },
  projectProgress: { fontSize: 12, color: '#6b7280' },
  actionCard: {
    backgroundColor: '#d1fae5',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  actionText: { fontSize: 16, color: '#065f46', marginBottom: 10 },
  actionButton: {
    backgroundColor: '#059669',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  actionButtonText: { color: '#ffffff', fontWeight: 'bold' },
});
