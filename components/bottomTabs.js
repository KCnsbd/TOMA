import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

const BottomTabs = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const currentRoute = route.name;

  const isActive = (name) => currentRoute === name;
  const activeColor = '#00a568';
  const inactiveColor = '#6b7280';

  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity
        style={styles.bottomButton}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Ionicons
          name="home"
          size={24}
          color={isActive('Dashboard') ? activeColor : inactiveColor}
        />
        <Text
        style={[styles.bottomButtonText, isActive('Dashboard') && styles.activeText,]}>
          Dashboard
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.bottomButton}
        onPress={() => navigation.navigate('My Projects')}
      >
        <Ionicons
          name="list"
          size={24}
          color={isActive('My Projects') ? activeColor : inactiveColor}
        />
        <Text
          style={[
            styles.bottomButtonText,
            isActive('My Projects') && styles.activeText,
          ]}
        >
          My Projects
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.centerButton}
        onPress={() => navigation.navigate('Add Project')}
      >
        <Ionicons name="add" size={30} color="#ffffff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.bottomButton}
        onPress={() => navigation.navigate('Progress Report')}
      >
        <Ionicons
          name="bar-chart"
          size={24}
          color={isActive('Progress Report') ? activeColor : inactiveColor}
        />
        <Text
          style={[styles.bottomButtonText, isActive('Progress Report') && styles.activeText,]}>
          Progress Report
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.bottomButton}
        onPress={() => navigation.navigate('Profile')}
      >
        <Ionicons
          name="person"
          size={24}
          color={isActive('Profile') ? activeColor : inactiveColor}
        />
        <Text
          style={[styles.bottomButtonText, isActive('Profile') && styles.activeText,]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomTabs;

const styles = StyleSheet.create({
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
  activeText: {
    color: '#00a568',
    fontWeight: '600',
  },
  centerButton: {
    backgroundColor: '#00a568',
    borderRadius: 50,
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 25,
    left: '50%',
    transform: [{ translateX: -30 }],
    elevation: 8,
  },
});
