import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import RightIcon from 'react-native-vector-icons/AntDesign';
const UserListItem = ({title, handleClick}) => {
  return (
    <TouchableOpacity onPress={handleClick} style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <RightIcon name="right" size={20} color={'black'} />
    </TouchableOpacity>
  );
};

export default UserListItem;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'cyan',
    padding: 12,
    marginVertical: 6,
  },
  title: {color: 'black', fontWeight: 'bold', fontSize: 18},
});
