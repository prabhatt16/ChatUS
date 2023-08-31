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

  return (
    <View>
      <Header title={'Chat'} />
      <Text style={styles.title}>
        Hello {auth().currentUser?.displayName}, let's chat with your friends!
      </Text>
      <View style={{padding: 12}}>
        <Text style={{color: 'gray', fontWeight: 'bold', marginVertical: 2}}>
          Friend
        </Text>
        <FlatList
          data={activeUsers.filter(
            item => item.userId !== auth().currentUser?.uid,
          )}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <UserListItem
              title={item.username}
              handleClick={() => handleUserPress(item)}
            />
          )}
        />
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  title: {
    color: 'black',
    fontWeight: 'bold',
    paddingHorizontal: 7,
    marginTop: 12,
  },
});
