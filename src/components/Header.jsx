import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/AntDesign';
const Header = ({title, isBack}) => {
  const navigation = useNavigation();
  
  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.replace('signin');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        {isBack && (
          <Icon
            name="arrowleft"
            size={20}
            color="white"
            onPress={() => {
              navigation.goBack();
            }}
          />
        )}
        <Text style={[styles.title, isBack && {marginLeft: 12}]}>{title}</Text>
      </View>
      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'black',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  logoutText: {
    color: 'white',
  },
  subContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default Header;
