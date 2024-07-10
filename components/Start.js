import React, { useState } from 'react';
import { ImageBackground, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';

const image = require('../images/Background Image.png'); // Adjust the path to your image file

const colors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];

const Start = ({ navigation }) => {
  const [name, setName] = useState('');
  const [backgroundColor, setBackgroundColor] = useState(colors[0]);

  const handlePress = () => {
    navigation.navigate('Chat', { name, backgroundColor });
  };

  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 50,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
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
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    opacity: 0.5,
  },
  chooseColorText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    marginBottom: 20,
  },
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  colorCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  button: {
    height: 50,
    width: '100%',
    backgroundColor: '#757083',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default Start;
