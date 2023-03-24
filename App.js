import { StatusBar } from 'expo-status-bar';

// import react navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Create the navigator
const Stack = createNativeStackNavigator();
// importfirestore from the package
import { initializeApp } from "firebase/app";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
// import the screens we want to navigate
// import Chat from './components/Chat';
import Chat from './components/Chat';
import Start from './components/Start';
import { getStorage } from "firebase/storage";
import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect } from 'react';
import { LogBox, Alert } from 'react-native';
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);



const App = () => {
  const connectionStatus = useNetInfo();
  const firebaseConfig = {
    apiKey: "AIzaSyDcnqbe6h_r6hmKWKeKYoy1ErwYyj3lin8",
    authDomain: "chatapp-19ebf.firebaseapp.com",
    projectId: "chatapp-19ebf",
    storageBucket: "chatapp-19ebf.appspot.com",
    messagingSenderId: "434554682426",
    appId: "1:434554682426:web:8bcd7237c3cb0952a98903",
    measurementId: "G-T13CR3EWQV"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);
  // displ. an alert if connection is lost 
  const storage = getStorage(app);

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Start'>
        <Stack.Screen
          name="Start"
          component={Start}
        ></Stack.Screen>
        <Stack.Screen
          name="Chat"
        >
          {props => <Chat isConnected={connectionStatus.isConnected} db={db} storage={storage} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}
export default App; 
