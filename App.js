
import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

// Import the Start and Chat components
import Start from './components/Start';
import Chat from './components/Chat';

// Create an instance of the stack navigator
const Stack = createStackNavigator();

const firebaseConfig = {
  apiKey: "AIzaSyC0zJEpQ163PZS8LT2FHcWfwtOqztcfLvU",
  authDomain: "chat-app-aa6be.firebaseapp.com",
  projectId: "chat-app-aa6be",
  storageBucket: "chat-app-aa6be.appspot.com",
  messagingSenderId: "1091669374554",
  appId: "1:1091669374554:web:0317d5a7dcec9a71b34a63",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const App = () => {
  useEffect(() => {
    // Sign in anonymously to Firebase
    signInAnonymously(auth)
      .then(() => {
        console.log("User signed in anonymously");
      })
      .catch((error) => {
        console.error("Error signing in anonymously:", error);
      });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen 
          name="Start" 
          component={Start} 
          options={{ title: 'Welcome' }} 
        />
        <Stack.Screen 
          name="Chat">
          {(props) => <Chat {...props} db={db} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;
