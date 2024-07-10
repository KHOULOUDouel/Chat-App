import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Define the Chat component
const Chat = ({ route }) => {
  // Extract the name and backgroundColor from the route parameters
  const { name, backgroundColor } = route.params;

  // Render the Chat component
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.text}>Welcome to the Chat, {name}!</Text>
    </View>
  );
};

// Define the styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up the full height of the screen
    alignItems: 'center', // Center the content horizontally
    justifyContent: 'center', // Center the content vertically
  },
  text: {
    fontSize: 20, // Font size of the text
    color: 'green', // Color of the text
  },
});

export default Chat;
