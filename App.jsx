import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignupScreen from './src/screens/SignUpScreen';
import SigninScreen from './src/screens/SignInScreen';
import ChatScreen from './src/screens/ChatScreen';
import {StatusBar} from 'react-native';
import Home from './src/screens/Home';
import SplashScreen from './src/screens/SplashScreen';

const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="splashscreen" component={SplashScreen} />
        <Stack.Screen name="signin" component={SigninScreen} />
        <Stack.Screen name="signup" component={SignupScreen} />
        <Stack.Screen name="home" component={Home} />
        <Stack.Screen name="chatscreen" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
