import React, { useState, useEffect, useCallback } from 'react';
import { View, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';

// Define the Chat component
const Chat = ({ route, db }) => {
  // Extract the name, backgroundColor, and uid from the route parameters
  const { name, backgroundColor, uid } = route.params;

  // Create the messages state with useState()
  const [messages, setMessages] = useState([]);

  // useEffect hook to fetch messages from Firestore in real time
  useEffect(() => {
    // Create a query that sorts messages by the createdAt property in descending order
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));

    // Set up the onSnapshot listener to get real-time updates from Firestore
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesFirestore = snapshot.docs.map((doc) => {
        const message = doc.data();
        // Convert Firestore timestamp to JavaScript Date object
        return { ...message, createdAt: message.createdAt.toDate() };
      });
      // Update the messages state with the fetched messages
      setMessages(messagesFirestore);
    });

    // Clean up the onSnapshot listener when the component unmounts
    return () => unsubscribe();
  }, [db]);

  // Function to handle sending new messages
  const onSend = useCallback((newMessages = []) => {
    const message = newMessages[0];
    if (message) {
      // Ensure the message has all required fields before saving
      if (message.text && message.user && message.createdAt) {
        // Save the new message to Firestore
        addDoc(collection(db, 'messages'), message).catch((error) => {
          console.error("Error adding message: ", error);
        });
      } else {
        console.error("Message is missing required fields: ", message);
      }
    }
  }, [db]);

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
          user={{ _id: uid, name }} // Current user details with user ID and name
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
