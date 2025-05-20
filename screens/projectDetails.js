import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import { ref, update, remove } from 'firebase/database';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../AuthContext'; 

const sanitizeEmail = (email) => email.replace(/[@.]/g, '_');

export default function ProjectDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const { project } = route.params;
  
    const { email } = useAuth(); 
    
    const sanitizedEmail = sanitizeEmail(email);
  const projectRefPath = `users/${sanitizedEmail}/projects/${project.id}`;
  const projectRef = ref(db, projectRefPath);

  const [projectName, setProjectName] = useState(project.projectName);
  const [deadline, setDeadline] = useState(project.deadline);
  const [subtasks, setSubtasks] = useState(project.subtasks || []);
  const [newSubtask, setNewSubtask] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const calculateProgress = (taskList) => {
    const completed = taskList.filter((task) => task.isCompleted).length;
    const total = taskList.length || 1;
    return Math.round((completed / total) * 100);
  };

  const handleUpdateProject = async () => {
    try {
      setIsUpdating(true);
      const updatedProgress = calculateProgress(subtasks);
      await update(projectRef, {
        projectName,
        deadline,
        subtasks,
        progress: updatedProgress,
      });
      Alert.alert('Success', 'Project updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update project');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteProject = async () => {
    Alert.alert('Delete Project', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await remove(projectRef);
            Alert.alert('Deleted', 'Project removed');
            navigation.goBack();
          } catch (err) {
            console.error('Delete error:', err);
            Alert.alert('Error', `Failed to delete: ${err.message}`);
          }
        },
      },
    ]);
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim() === '') return;
    setSubtasks([...subtasks, { name: newSubtask, isCompleted: false }]);
    setNewSubtask('');
  };

  const toggleSubtaskComplete = (index) => {
    const updated = [...subtasks];
    updated[index].isCompleted = !updated[index].isCompleted;
    setSubtasks(updated);
  };

  const updateSubtaskText = (index, newText) => {
    const updated = [...subtasks];
    updated[index].name = newText;
    setSubtasks(updated);
  };

  const deleteSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const progress = calculateProgress(subtasks);

  return (
    <View style={styles.container}>
      {/* Top Bar with Close Button */}
      <View style={styles.topBar}>
        <Text style={styles.heading}>Project Details</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Icon name="times" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Project Name</Text>
      <TextInput style={styles.input} value={projectName} onChangeText={setProjectName} />

      <Text style={styles.label}>Deadline</Text>
      <TextInput style={styles.input} value={deadline} onChangeText={setDeadline} />

      <Text style={styles.label}>Progress: {progress}%</Text>
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>

      <Text style={styles.label}>Subtasks</Text>
      <FlatList
        data={subtasks}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.subtaskItem}>
            <TextInput
              style={[styles.input, styles.subtaskInput]}
              value={item.name}
              onChangeText={(text) => updateSubtaskText(index, text)}
            />
            <TouchableOpacity
              style={[
                styles.toggleButton,
                { backgroundColor: item.isCompleted ? '#00a568' : '#e5e7eb' },
              ]}
              onPress={() => toggleSubtaskComplete(index)}
            >
              <Icon
                name={item.isCompleted ? 'check-circle' : 'circle-o'}
                size={20}
                color={item.isCompleted ? '#fff' : '#333'}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteSubtask(index)}>
              <Icon name="trash" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.subtaskAddContainer}>
        <TextInput
          placeholder="New subtask"
          style={[styles.input, { flex: 1, marginRight: 8 }]}
          value={newSubtask}
          onChangeText={setNewSubtask}
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleAddSubtask}>
          <Icon name="plus" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.saveButton]}
        onPress={handleUpdateProject}
        disabled={isUpdating}
      >
        <Text style={styles.buttonText}>{isUpdating ? 'Saving...' : 'Save Changes'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteProject}>
        <Text style={styles.buttonText}>Delete Project</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f8f9', padding: 20 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  closeBtn: { padding: 8 },
  label: { fontSize: 16, color: '#333', marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  subtaskInput: { flex: 1, marginRight: 8, paddingVertical: 8 },
  progressBarBackground: {
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 16,
  },
  progressBarFill: {
    height: 12,
    backgroundColor: '#85d1b2',
    borderRadius: 8,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  toggleButton: {
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  deleteBtn: {
    backgroundColor: '#ef4444',
    padding: 8,
    borderRadius: 8,
  },
  subtaskAddContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  addBtn: {
    backgroundColor: '#00a568',
    padding: 12,
    borderRadius: 8,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  saveButton: { backgroundColor: '#00a568' },
  deleteButton: { backgroundColor: '#e11d48' },
});
