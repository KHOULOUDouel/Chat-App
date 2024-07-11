import React, { useState } from 'react';
import { ImageBackground, StyleSheet, Text, TextInput, View, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { getAuth, signInAnonymously } from 'firebase/auth';

// Import the background image
const image = require('../images/Background Image.png'); // Adjust the path to your image file

// Define the colors array for background color options
const colors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];

// Define the Start component
const Start = ({ navigation }) => {
  // State variables to store the user's name and selected background color
  const [name, setName] = useState('');
  const [backgroundColor, setBackgroundColor] = useState(colors[0]);

  // Initialize Firebase Authentication
  const auth = getAuth();

  // Function to handle the button press and navigate to the Chat screen
  const handlePress = () => {
    signInAnonymously(auth)
      .then((result) => {
        const user = result.user;
        navigation.navigate('Chat', { 
          uid: user.uid, 
          name, 
          backgroundColor 
        });
      })
      .catch((error) => {
        console.error("Error signing in anonymously:", error);
      });
  };

  // Render the Start component
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ImageBackground source={image} style={styles.background}>
        <Text style={styles.title}>Chat App!</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder='Your Name'
            placeholderTextColor='#757083'
            onChangeText={(text) => setName(text)}
            value={name}
          />
          <Text style={styles.chooseColorText}>Choose Background Color:</Text>
          <View style={styles.colorContainer}>
            {colors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[styles.colorCircle, { backgroundColor: color }]}
                onPress={() => setBackgroundColor(color)}
              />
            ))}
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={handlePress}
          >
            <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

// Define the styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up the full height of the screen
  },
  background: {
    flex: 1, // Take up the full height of the screen
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center', // Center the content horizontally
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 50, // Space below the title
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 10, // Rounded corners
    padding: 20,
    width: '80%', // 80% of the screen width
    alignItems: 'center', // Center the content horizontally
    marginTop: 300, // Adjust this value to move the container down
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#757083',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 15,
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    marginBottom: 20, // Space below the input field
    backgroundColor: '#FFFFFF',
    opacity: 0.5, // Slightly transparent
  },
  chooseColorText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    marginBottom: 20, // Space below the text
  },
  colorContainer: {
    flexDirection: 'row', // Align children in a row
    justifyContent: 'space-between', // Space between the color circles
    marginBottom: 20, // Space below the color container
    width: '100%', // Full width of the container
  },
  colorCircle: {
    width: 50,
    height: 50,
    borderRadius: 25, // Rounded to make it a circle
  },
  button: {
    height: 50,
    width: '100%',
    backgroundColor: '#757083',
    alignItems: 'center', // Center the button text horizontally
    justifyContent: 'center', // Center the button text vertically
    borderRadius: 5, // Rounded corners
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default Start;
