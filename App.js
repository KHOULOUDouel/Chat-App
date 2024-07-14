
import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { initializeApp } from 'firebase/app';
import { getFirestore, disableNetwork, enableNetwork } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { useNetInfo } from '@react-native-community/netinfo';
import { LogBox } from 'react-native'; //ignore warnings in expo

import Start from './components/Start';
import Chat from './components/Chat';

// Ignore all log notifications
LogBox.ignoreAllLogs();

// Firebase configuration
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
const storage = getStorage(app); // Initialize storage

// Create a stack navigator
const Stack = createStackNavigator();

const App = () => {
  const netInfo = useNetInfo();
  const isConnected = netInfo.isConnected;

  // Handle network status changes
  useEffect(() => {
    if (isConnected === false) {
      disableNetwork(db);
    } else {
      enableNetwork(db);
    }
  }, [isConnected]);

  // Sign in anonymously to Firebase
  useEffect(() => {
    signInAnonymously(auth)
      .then(() => {
        console.log("User signed in anonymously");
      })
      .catch((error) => {
        console.error("Error signing in anonymously:", error);
      });
  }, []);

  return (
    <ActionSheetProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Start">
          <Stack.Screen 
            name="Start" 
            component={Start} 
            options={{ title: 'Welcome' }} 
          />
          <Stack.Screen 
            name="Chat">
            {(props) => <Chat {...props} db={db} storage={storage} isConnected={isConnected} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </ActionSheetProvider>
  );
};

export default App;
