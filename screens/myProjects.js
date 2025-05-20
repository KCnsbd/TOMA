import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db, ref, onValue } from '../firebaseConfig';
import BottomTabs from '../components/bottomTabs';
import { useAuth } from '../AuthContext'; 

const sanitizeEmail = (email) => email.replace(/[@.]/g, '_');

const getStatus = (progress) => {
  if (progress === 100) return 'done';
  if (progress > 0) return 'in progress';
  return 'to-do';
};

export default function MyProjects() {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = useAuth(); 

  const sanitizedEmail = sanitizeEmail(email);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const projectsRef = ref(db, `users/${sanitizedEmail}/projects`);
    const unsubscribe = onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedProjects = Object.entries(data).map(([id, value]) => {
          const subtasks = value.subtasks || [];
          const completed = subtasks.filter((t) => t.isCompleted).length;
          const total = subtasks.length || 1;
          const progress = Math.round((completed / total) * 100);

          return {
            id,
            ...value,
            subtasks,
            progress,
          };
        });
        setProjects(loadedProjects);
      } else {
        setProjects([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [sanitizedEmail]);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>My Projects</Text>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {['to-do', 'in progress', 'done'].map((status) => {
            const filtered = projects.filter((p) => getStatus(p.progress) === status);

            return (
              <View key={status} style={styles.statusSection}>
                <Text style={styles.statusTitle}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>

                {filtered.length > 0 ? (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                    {filtered.map((project) => (
                      <View key={project.id} style={styles.card}>
                        <Text style={styles.title}>{project.projectName}</Text>
                        <Text style={styles.deadline}>Deadline: {project.deadline}</Text>
                        <View style={styles.progressBarBackground}>
                          <View style={[styles.progressBarFill, { width: `${project.progress}%` }]} />
                        </View>
                        <Text style={styles.progressText}>{project.progress}% Complete</Text>
                        <TouchableOpacity
                          style={styles.button}
                          onPress={() => navigation.navigate('ProjectDetails', { project })}
                        >
                          <Text style={styles.buttonText}>View Details</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                ) : (
                  <Text style={styles.noProjects}>No projects in this category.</Text>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}

      <BottomTabs />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8f9',
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 12,
    textTransform: 'capitalize',
    color: '#333',
  },
  horizontalScroll: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    width: 240,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
    overflow: 'hidden',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  deadline: {
    color: '#9ca3af',
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: 12,
    backgroundColor: '#34d399',
    borderRadius: 8,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#059669',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  noProjects: {
    fontSize: 14,
    color: '#9ca3af',
    paddingHorizontal: 4,
    paddingVertical: 8,
    fontStyle: 'italic',
  },
});
