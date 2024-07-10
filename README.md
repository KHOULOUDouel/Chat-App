# Chat-App
About Chat App with React Native:
To build a chat app for mobile devices using React Native. The app will provide users with a chat interface and options to share images and their location. It works on both iOS and Android devices and utilizes Google Firestore/Firebase for storing messages and images. Guest authentication is handled via Google Firebase authentication.

Features and Requirements:
Key Features:
A page where users can enter their name and choose a background color for the chat screen before joining the chat.
A page displaying the conversation, as well as an input field and submit button.
The chat must provide users with two additional communication features: sending images and location data.
Data gets stored online and offline.
Technologies Used:
React Native
Expo
Expo ImagePicker
Expo Location
Google Firestore/Firebase
Gifted Chat Library
Android Studio
Dependencies:
@react-navigation/native: ^6.1.17
@react-navigation/native-stack: ^6.9.26
expo: ~50.0.13
expo-status-bar: ~1.11.1
firebase: ^10.3.1
react: "18.2.0
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
Node.js
Google Firestore/Firebase
create an account and a new project
obtain the configuration code, and add it to App.js:
set up the database under build --> Firestore Database
activate storage
change rules to: allow read, write: if true
Start the expo project
npx expo start
Testing Options
download and connect the expo app on your mobile device
Android Studio (android)
Xcode (iOS)
Author
Khouloud Ouelhazi