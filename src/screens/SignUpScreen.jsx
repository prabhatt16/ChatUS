import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const SignupScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const storeUserData = async (user, username, email) => {
    try {
      const usersRef = firestore().collection('users');
      await usersRef.doc(user?.uid).set({
        username: username,
        email: email,
        userId: user?.uid,
      });
      navigation.replace('home');
    } catch (error) {
      setLoading(false);
      console.error('Error', error);
    }
  };

  const handleSignIn = async () => {
    navigation.replace('signin');
  };

  const handleSignup = async () => {
    let re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!username || !email || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    } else if (password.length < 6) {
      setErrorMessage('Password should contain 6 characters.');
      return;
    } else if (!re.test(email)) {
      setErrorMessage('Email is not valid, try again!');
      return;
    }

    try {
      setLoading(true);

      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const user = userCredential.user;

      if (user) {
        await user.updateProfile({
          displayName: username,
        });

        storeUserData(user, username, email);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage(
          'Email is already in use. Please use a different email.',
        );
      } else {
        setErrorMessage('Error: ' + error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.signUpText}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={setUsername}
        value={username}
        placeholderTextColor="#ffffff"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        placeholderTextColor="#ffffff"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        placeholderTextColor="#ffffff"
      />
      <Text style={styles.errorText}>{errorMessage}</Text>
      {loading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <TouchableOpacity
          style={[styles.button, {backgroundColor: '#93B1A6'}]}
          onPress={handleSignup}>
          <Text style={[styles.buttonText, {color: 'black'}]}>{'Sign Up'}</Text>
        </TouchableOpacity>
      )}
      <View style={styles.subContainer}>
        <Text style={{color: 'grey'}}>Already have an account? </Text>
        <Text style={styles.signInLink} onPress={handleSignIn}>
          Sign In
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  input: {
    width: '80%',
    marginBottom: 10,
    padding: 10,
    color: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#ffffff',
    outlineStyle: 'none',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  signUpText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffffff',
  },
  signInText: {
    color: '#ffffff',
    fontSize: 16,
    marginRight: 5,
  },
  signInLink: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subContainer: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '80%',
    marginBottom: 10,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 900,
  },
});

export default SignupScreen;
