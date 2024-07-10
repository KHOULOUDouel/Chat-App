Chat App with React Native
Overview
This project involves building a chat application for mobile devices using React Native. The app provides users with a chat interface and options to share images and their location. It is designed to work on both iOS and Android devices and utilizes Google Firestore/Firebase for storing messages and images. Guest authentication is handled via Google Firebase authentication.

Features
User Profile Setup: Users can enter their name and choose a background color for the chat screen before joining the chat.
Chat Interface: A page displaying the conversation, as well as an input field and submit button.
Media Sharing: Users can send images and location data.
Data Storage: Messages and images are stored online and offline.
Technologies Used
React Native
Expo
Expo ImagePicker
Expo Location
Google Firestore/Firebase
Gifted Chat Library
Android Studio
Dependencies
@react-navigation/native: ^6.1.17
@react-navigation/native-stack: ^6.9.26
expo: ~50.0.13
expo-status-bar: ~1.11.1
firebase: ^10.3.1
react: 18.2.0
react-native: 0.73.5
react-native-gifted-chat: ^2.4.0
react-native-safe-area-context: 4.8.2
react-native-screens: ~3.29.0
@react-native-async-storage/async-storage: 1.21.0
@react-native-community/netinfo: 11.1.0
expo-image-picker: ~14.7.1
expo-location: ~16.5.5
react-native-maps: 1.10.0
Prerequisites
Node.js: Ensure that Node.js is installed on your system.
Google Firestore/Firebase:
Create an account and a new project.
Obtain the configuration code and add it to App.js.
Set up the database under Build → Firestore Database.
Activate storage.
Change rules to: allow read, write: if true.
Testing Options
Mobile Device: Download and connect the Expo app on your mobile device.
Android Studio: For Android testing.
Xcode: For iOS testing.
Author
Khouloud Ouelhaz