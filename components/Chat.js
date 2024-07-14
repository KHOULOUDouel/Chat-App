import React, { useState, useEffect, useCallback } from 'react';
import { View, Platform, KeyboardAvoidingView, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const Chat = ({ route, db, storage, isConnected }) => {
  const { name, backgroundColor, uid } = route.params;
  const [messages, setMessages] = useState([]);
  const { showActionSheetWithOptions } = useActionSheet();

  // Request permissions
  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
    if (cameraStatus !== 'granted' || libraryStatus !== 'granted' || locationStatus !== 'granted') {
      alert('Sorry, we need permissions to make this work!');
    } else {
      console.log("All permissions granted.");
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (isConnected) {
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
      } else {
        const cachedMessages = await AsyncStorage.getItem('messages');
        if (cachedMessages) setMessages(JSON.parse(cachedMessages));
      }
    };
    fetchMessages();
  }, [db, isConnected]);

  const onSend = useCallback((newMessages = []) => {
    newMessages.forEach(message => {
      if (message._id && message.createdAt && message.user) {
        addDoc(collection(db, 'messages'), message).catch((error) => {
          console.error("Error adding message: ", error);
        });
      } else {
        console.error("Message is missing required fields: ", message);
      }
    });
  }, [db]);

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#000',
        },
        left: {
          backgroundColor: '#FFF',
        },
      }}
    />
  );

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `images/${Date.now()}`);
      const snapshot = await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (error) {
      console.error("Error uploading image: ", error);
      Alert.alert("Error uploading image");
    }
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const imageUrl = await uploadImage(result.assets[0].uri);
        onSend([{
          _id: Date.now().toString(),
          createdAt: new Date(),
          text: '',
          user: { _id: uid, name },
          image: imageUrl
        }]);
      }
    } catch (error) {
      console.error("Error picking image: ", error);
      Alert.alert("Error picking image");
    }
  };

  const handleCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const imageUrl = await uploadImage(result.assets[0].uri);
        onSend([{
          _id: Date.now().toString(),
          createdAt: new Date(),
          text: '',
          user: { _id: uid, name },
          image: imageUrl
        }]);
      }
    } catch (error) {
      console.error("Error taking photo: ", error);
      Alert.alert("Error taking photo");
    }
  };

  const handleLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log("Location permission status: ", status);
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      if (location) {
        console.log("Location data: ", location);
        onSend([{
          _id: Date.now().toString(),
          createdAt: new Date(),
          text: '',
          user: { _id: uid, name },
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          }
        }]);
      } else {
        Alert.alert("Error occurred while fetching location");
      }
    } catch (error) {
      console.error("Error fetching location: ", error);
      Alert.alert("Error fetching location");
    }
  };

  const renderInputToolbar = (props) => {
    if (isConnected) {
      return (
        <InputToolbar
          {...props}
          containerStyle={styles.inputToolbarContainer}
          renderActions={() => (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                const options = ['Pick Image', 'Take Photo', 'Share Location', 'Cancel'];
                const cancelButtonIndex = 3;
                showActionSheetWithOptions(
                  {
                    options,
                    cancelButtonIndex,
                  },
                  (buttonIndex) => {
                    if (buttonIndex === 0) {
                      handleImagePick();
                    } else if (buttonIndex === 1) {
                      handleCamera();
                    } else if (buttonIndex === 2) {
                      handleLocation();
                    }
                  }
                );
              }}
              accessible={true}
              accessibilityLabel="More options"
              accessibilityHint="Opens options to pick an image, take a photo, or share your location"
            >
              <Text style={styles.actionButtonText}>+</Text>
            </TouchableOpacity>
          )}
        />
      );
    }
    return null;
  };

  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: currentMessage.location.latitude,
                longitude: currentMessage.location.longitude,
              }}
            />
          </MapView>
        </View>
      );
    }
    return null;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={[styles.container, { backgroundColor }]}>
        <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages)}
          user={{ _id: uid, name }}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          renderCustomView={renderCustomView}
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
  inputToolbarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#007AFF',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 24,
  },
  mapContainer: {
    width: 150,
    height: 100,
    borderRadius: 13,
    overflow: 'hidden',
    margin: 3,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Chat;
