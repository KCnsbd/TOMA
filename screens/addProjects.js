import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList, ScrollView,} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, push } from 'firebase/database';
import { firebaseApp } from '../firebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function AddProject() {
  const navigation = useNavigation();
  const db = getDatabase(firebaseApp);

  const [projectName, setProjectName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateProgress = (taskList) => {
    const completed = taskList.filter((task) => task.isCompleted).length;
    const total = taskList.length || 1;
    return Math.round((completed / total) * 100);
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

  const handleSubmit = async () => {
    if (!projectName || !deadline) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    try {
      setIsSubmitting(true);
      const userKey = 'consebidokeana_gmail_com';
      const projectRef = ref(db, `users/${userKey}/projects`);

      const newProject = {
        projectName,
        deadline,
        subtasks,
        progress: calculateProgress(subtasks),
      };

      await push(projectRef, newProject);
      Alert.alert('Success', 'Project added successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Could not add project.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = calculateProgress(subtasks);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.heading}>New Project</Text>
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
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={styles.buttonText}>{isSubmitting ? 'Submitting...' : 'Submit Project'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f8f9', padding: 20 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
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
});