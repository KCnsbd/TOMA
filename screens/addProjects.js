import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AddProject() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Add Project Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});
