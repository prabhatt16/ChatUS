import React, {useEffect, useState} from 'react';
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

const SigninScreen = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    const user = auth()?.currentUser;
    if (user !== null) {
      setIsUser(true);
      console.log(isUser);
      navigation.replace('home');
    } else {
      setIsUser(false);
      console.log(user);
    }
  }, [isUser]);

  const handleSignUp = () => {
    navigation.replace('signup');
  };

  const handleSignin = async () => {
    let re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!email || !password) {
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
      await auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          navigation.replace('home');
        });
    } catch (error) {
      setLoading(false);
      setErrorMessage('Error: ' + error.message);
    }
  };

  return (
    <View style={{flex: 1}}>
      {isUser ? (
        <View style={styles.container}>
          <ActivityIndicator size={'large'} color={'blue'} />
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.signinText}>SignIn</Text>
          <TextInput
            style={styles.input}
            keyboardType="email-address"
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
            <Button title="Sign In" color={'black'} onPress={handleSignin} />
          )}
          <View style={styles.subContainer}>
            <Text style={{color: 'gray'}}>Don't have an account? </Text>
            <Text style={{color: 'blue', fontSize: 16}} onPress={handleSignUp}>
              SignUp
            </Text>
          </View>
        </View>
      )}
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
    borderBottomWidth: 1,
    color: 'black',
    borderColor: '#ccc',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  signinText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  subContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 12,
  },
});

export default SigninScreen;
