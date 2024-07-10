
// Import necessary libraries for gesture handling and navigation
import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import the Start and Chat components
import Start from './components/Start';
import Chat from './components/Chat';

// Create an instance of the stack navigator
const Stack = createStackNavigator();

// Define the main App component
const App = () => {
  return (
    // Wrap the navigator in the NavigationContainer to manage the navigation tree
    <NavigationContainer>
      {/* Define the stack navigator with the initial route set to the Start screen */}
      <Stack.Navigator initialRouteName="Start">
        {/* Define the Start screen */}
        <Stack.Screen 
          name="Start" 
          component={Start} 
          options={{ title: 'Welcome' }} // Set the title for the Start screen
        />
        {/* Define the Chat screen */}
        <Stack.Screen 
          name="Chat" 
          component={Chat} 
          options={({ route }) => ({ title: route.params.name })} // Set the title dynamically based on the user's name
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Export the App component as the default export
export default App;
