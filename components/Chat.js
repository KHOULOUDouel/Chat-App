import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Chat = ({ route }) => {
  const { name, backgroundColor } = route.params;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.text}>Welcome to the Chat, {name}!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    color: 'green',
  },
});

export default Chat;
