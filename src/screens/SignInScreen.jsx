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

const SigninScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    const user = auth()?.currentUser;
    if (user !== null) {
      setIsUser(true);
      navigation.replace('home');
    } else {
      setIsUser(false);
    }
  }, [isUser, navigation]);

  const handleSignUp = () => {
    navigation.replace('signup');
  };

  const handleSignin = async () => {
    if (!email || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    } else if (password.length < 6) {
      setErrorMessage('Password should contain at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      await auth().signInWithEmailAndPassword(email, password);
      navigation.replace('home');
    } catch (error) {
      setLoading(false);
      setErrorMessage('Error: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      {isUser ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : (
        <>
          <Text style={styles.signinText}>Sign In</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              keyboardType="email-address"
              placeholder="Email"
              onChangeText={setEmail}
              value={email}
              placeholderTextColor="#ffffff"
              selectionColor="#ffffff"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              onChangeText={setPassword}
              value={password}
              placeholderTextColor="#ffffff"
              selectionColor="#ffffff"
            />
          </View>
          <Text style={styles.errorText}>{errorMessage}</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <TouchableOpacity
              style={[styles.button, {backgroundColor: '#93B1A6'}]}
              onPress={handleSignin}>
              <Text style={[styles.buttonText, {color: 'black'}]}>
                {'Sign In'}
              </Text>
            </TouchableOpacity>
          )}
          <View style={styles.subContainer}>
            <Text style={{color: 'grey', marginRight: 5}}>
              Don't have an account?
            </Text>
            <Text
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: 16,
              }}
              onPress={handleSignUp}>
              Sign Up
            </Text>
          </View>
        </>
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
    backgroundColor: '#121212',
  },
  inputContainer: {
    width: '80%',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff',
  },
  input: {
    width: '100%',
    padding: 10,
    color: '#ffffff',
    borderWidth: 0, // Set border width to zero
    borderBottomWidth: 1, // If you still want to keep the bottom border, you can set it separately
    borderColor: 'transparent',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  signinText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffffff',
  },
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
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

export default SigninScreen;
