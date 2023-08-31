/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {firebaseConfig} from './src/components/firebase';
import { firebase } from '@react-native-firebase/auth';

firebase.initializeApp(firebaseConfig);

AppRegistry.registerComponent(appName, () => App);
