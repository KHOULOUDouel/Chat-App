import React, { useState, useEffect } from 'react';
import { View, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

// Define the Chat component
const Chat = ({ route }) => {
  // Extract the name and backgroundColor from the route parameters
  const { name, backgroundColor } = route.params;

  // Create the messages state with useState()
  const [messages, setMessages] = useState([]);

  // useEffect hook to set initial messages
  useEffect(() => {
    setMessages([
      {
        _id: 1, // Unique identifier for the system message
        text: 'You have entered the chat', // System message text
        createdAt: new Date(), // Timestamp of the system message
        system: true, // Flag to indicate this is a system message
      },
      {
        _id: 2, // Unique identifier for the user message
        text: 'Hello developer', // User message text
        createdAt: new Date(), // Timestamp of the user message
        user: {
          _id: 2, // Unique identifier for the user
          name: 'React Native', // User's name
          avatar: 'https://placeimg.com/140/140/any', // User's avatar image
        },
      },
    ]);
  }, []); // Empty dependency array means this runs once after initial render

  // Function to handle sending new messages
  const onSend = (newMessages) => {
    // Append new messages to the existing messages state
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
  };

  // Custom rendering function for message bubbles
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000', // Black background for sent messages
          },
          left: {
            backgroundColor: '#FFF', // White background for received messages
          },
        }}
      />
    );
  };

  // Render the Chat component
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={[styles.container, { backgroundColor }]}>
        <GiftedChat
          messages={messages} // Feed the GiftedChat component with messages from the messages state
          onSend={messages => onSend(messages)} // Function to handle sending messages
          user={{ _id: 1, name }} // Current user details
          renderBubble={renderBubble} // Custom bubble rendering function
          accessible={true} // Enable accessibility for the GiftedChat component
          accessibilityLabel="Chat screen" // Accessibility label for screen readers
          accessibilityHint="You are in a chat screen. Use the text input to type messages." // Accessibility hint for screen readers
        />
      </View>
    </KeyboardAvoidingView>
  );
};

// Define the styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up the full height of the screen
  },
});

export default Chat;
