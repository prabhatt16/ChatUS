import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/AntDesign';
const Header = ({title, subTitle, isBack, backgroundColor}) => {
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
    <View
      style={[
        styles.container,
        {backgroundColor: backgroundColor ? backgroundColor : 'black'},
      ]}>
      <View style={styles.subContainer}>
        {isBack && (
          <Icon
            name="caretleft"
            size={20}
            color="white"
            onPress={() => {
              navigation.goBack();
            }}
          />
        )}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          <Text style={[styles.title, isBack && {marginLeft: 12}]}>
            {title}
          </Text>
          <Text style={styles.subTitle}>{subTitle}</Text>
        </View>
      </View>
      {!isBack && (
        <Icon
          name="logout"
          size={20}
          color="white"
          onPress={() => {
            handleLogout();
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#93B1A6',
  },
  logoutText: {
    color: '#93B1A6',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default Header;
