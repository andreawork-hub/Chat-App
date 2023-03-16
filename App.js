import { StatusBar } from 'expo-status-bar';
// import the screens we want to navigate
import Chat from './components/Chat';
import Start from './components/Start';
// import react navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


// Create the navigator
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Start'>
        <Stack.Screen
          name="Start"
          component={Start}
        ></Stack.Screen>
        <Stack.Screen name="Chat"
          component={Chat}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}
export default App; 
