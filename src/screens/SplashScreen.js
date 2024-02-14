import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';

const SplashScreen = ({navigation}) => {
  const isUser = auth().currentUser;
  const [counter, setCounter] = useState(0);
  const [counterArr, setCounterArr] = useState([]);
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(counter + 1);
    }, 200);

    if (counter > 3) {
      setCounter(0);
      setCounterArr([]);
    } else {
      setCounterArr([...counterArr, counter + 1]);
    }

    return () => {
      clearInterval(interval);
    };
  }, [counter]);

//   useEffect(() => {
//     setTimeout(() => {
//       isUser ? navigation.replace('home') : navigation.replace('signin');
//     }, 2500);
//   }, [navigation]);

  return (
    <View style={styles.container}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <Text style={styles.title}>Chat</Text>
        <Text style={styles.subTitle}>US</Text>
      </View>
      {/* <View style={styles.loaderContainer}>
        {counterArr?.map(index => (
          <View style={styles.loaderBox} key={index} />
        ))}
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderBox: {
    margin: 2,
    height: 12,
    width: 12,
    backgroundColor: 'white',
  },
  text: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: 'white',
  },
  subTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#93B1A6',
  },
});

export default SplashScreen;
