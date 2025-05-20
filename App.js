import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from './screens/dashboard'; 
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp'; 
import AddProject from './screens/addProjects';
import MyProjects from './screens/myProjects'; 
import ProgressReport from './screens/progressReport'; 
import Profile from './screens/profile'; 
import ProjectDetails from './screens/projectDetails'; 
import { AuthProvider } from './AuthContext'; // Adjust the path as necessary

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <AuthProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Sign In" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Sign In" component={SignIn} />
        <Stack.Screen name="Sign Up" component={SignUp} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="My Projects" component={MyProjects} />
        <Stack.Screen name="Add Project" component={AddProject} />
        <Stack.Screen name="Progress Report" component={ProgressReport} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="ProjectDetails" component={ProjectDetails} />
      </Stack.Navigator>
    </NavigationContainer>
    </AuthProvider>
  );
}
