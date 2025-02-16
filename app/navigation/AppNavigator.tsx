import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../root/(tabs)/login';
import SignUpScreen from '../root/(tabs)/sign';
import ParentScreen from '../root/(tabs)/parent';
import SchoolAuthorityScreen from '../root/(tabs)/SchoolAuth';
import AdminScreen from '../root/(tabs)/admin';
// ...other imports...

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Parent" component={ParentScreen} />
        <Stack.Screen name="SchoolAuthority" component={SchoolAuthorityScreen} />
        <Stack.Screen name="Admin" component={AdminScreen} />
        {/* Add other screens as needed */}
        <Stack.Screen name="ClassScreen" component={ClassScreen} />
        <Stack.Screen name="StudentScreen" component={StudentScreen} />
        <Stack.Screen name="BusScreen" component={BusScreen} />
        <Stack.Screen name="SchoolEntriesScreen" component={SchoolEntriesScreen} />
        <Stack.Screen name="LeavesScreen" component={LeavesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
