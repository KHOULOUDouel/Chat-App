import React, { useState, useEffect, useCallback } from 'react';
import { View, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';

const Chat = ({ route, db, isConnected }) => {
  const { name, backgroundColor, uid } = route.params;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messagesFirestore = snapshot.docs.map((doc) => {
          const message = doc.data();
          return { ...message, createdAt: message.createdAt.toDate() };
        });
        setMessages(messagesFirestore);
        AsyncStorage.setItem('messages', JSON.stringify(messagesFirestore));
      });

      return () => unsubscribe();
    };

    const loadCachedMessages = async () => {
      const cachedMessages = await AsyncStorage.getItem('messages');
      if (cachedMessages) {
        setMessages(JSON.parse(cachedMessages));
      }
    };

    if (isConnected) {
      fetchMessages();
    } else {
      loadCachedMessages();
    }
  }, [db, isConnected]);

  const onSend = useCallback((newMessages = []) => {
    const message = newMessages[0];
    if (message && message.text && message.user && message.createdAt) {
      addDoc(collection(db, 'messages'), message).catch((error) => {
        console.error("Error adding message: ", error);
      });
    } else {
      console.error("Message is missing required fields: ", message);
    }
  }, [db]);

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: { backgroundColor: '#000' },
        left: { backgroundColor: '#FFF' },
      }}
    />
  );

  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    return null;
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor }]}>
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{ _id: uid, name }}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          accessible={true}
          accessibilityLabel="Chat screen"
          accessibilityHint="You are in a chat screen. Use the text input to type messages."
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;
