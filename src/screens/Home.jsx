import React, {useEffect, useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import Header from '../components/Header';
import firestore from '@react-native-firebase/firestore';
import UserListItem from '../components/userListItem';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {StyleSheet} from 'react-native';

const Home = () => {
  const [activeUsers, setActiveUsers] = useState([]);
  const navigation = useNavigation();

  const handleUserPress = selectedUser => {
    navigation.navigate('chatscreen', {
      currentUser: auth()?.currentUser,
      selectedUser: selectedUser,
    });
  };

  useEffect(() => {
    const usersRef = firestore().collection('users');
    const unsubscribe = usersRef.onSnapshot(snapshot => {
      const users = snapshot.docs.map(doc => doc.data());
      setActiveUsers(users);
    });
    console.log(
      activeUsers.filter(item => item.userId !== auth().currentUser?.uid),
    );

    return () => unsubscribe();
  }, []);

  const capitalizeFirstLetter = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  return (
    <View style={{backgroundColor: '#183D3D', flex: 1}}>
      <Header title={'Chat'} subTitle={'US'} />
      {activeUsers && (
        <Text style={styles.title}>
          Hello {auth().currentUser?.displayName}, your friends are there.
        </Text>
      )}
      <View style={{padding: 12}}>
        {activeUsers ? (
          <FlatList
            data={activeUsers.filter(
              item => item.userId !== auth().currentUser?.uid,
            )}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <UserListItem
                title={capitalizeFirstLetter(item.username)}
                handleClick={() => handleUserPress(item)}
              />
            )}
          />
        ) : (
          <Text style={styles.noUser}>NO USER HERE :/</Text>
        )}
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  title: {
    color: 'white',
    fontWeight: 'bold',
    paddingHorizontal: 7,
    fontSize: 12,
    marginLeft: 12,
    fontFamily: 'monospace',
    marginTop: 12,
  },
  noUser: {
    color: 'white',
    fontWeight: 'bold',
    paddingHorizontal: 7,
    fontSize: 12,
    marginLeft: 12,
    textAlign: 'center',
    fontFamily: 'monospace',
    marginTop: 12,
  },
});
