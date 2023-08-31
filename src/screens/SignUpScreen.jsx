import React, {isValidElement, useEffect, useState} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  ActivityIndicator,
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
      setErrorMessage('Password should contain 6 charactors.');
      return;
    } else if (!re.test(email)) {
      setErrorMessage('Email is not valid, try again!');
      return;
    }

    try {
      setLoading(true);

      if (!username || !email || !password) {
        setErrorMessage('Please fill in all fields.');
        return;
      } else if (password.length < 6) {
        setErrorMessage('Password should contain 6 characters.');
        return;
      } else if (!re.test(email)) {
        setErrorMessage('Email is not valid, please try again.');
        return;
      }

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
      <Text style={styles.signupText}>SignUp</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <Text style={styles.errorText}>{errorMessage}</Text>
      {loading ? (
        <ActivityIndicator size={'small'} color={'blue'} />
      ) : (
        <Button title="Sign Up" color={'black'} onPress={handleSignup} />
      )}
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          marginTop: 12,
        }}>
        <Text style={styles.signInText}>Already have an account? </Text>
        <Text
          style={{color: 'blue', marginTop: 20, fontSize: 16}}
          onPress={handleSignIn}>
          SignIn
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
  },
  input: {
    width: '80%',
    marginBottom: 10,
    padding: 10,
    color: 'black',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  signInText: {
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  signupText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
});

export default SignupScreen;
