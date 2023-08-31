import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  FlatList,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/Ionicons';

const ChatScreen = ({route}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const {currentUser, selectedUser} = route?.params;
  const chatId = [currentUser?.uid, selectedUser?.userId].sort().join('-');
  const [textInputHeight, setTextInputHeight] = useState(40);
  const flatListRef = useRef(null);

  const handleContentSizeChange = (contentWidth, contentHeight) => {
    setTextInputHeight(contentHeight);
  };

  useEffect(() => {
    const chatRef = firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('timestamp', 'asc');

    const unsubscribe = chatRef.onSnapshot(snapshot => {
      const messageList = snapshot.docs.map(doc => doc.data());
      setMessages(messageList);
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    setTextInputHeight(40);
    if (newMessage.trim() === '') {
      return;
    }

    const messageData = {
      senderId: currentUser?.uid,
      text: newMessage,
      timestamp: firestore.FieldValue.serverTimestamp(),
    };

    await firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .add(messageData);

    if (flatListRef.current) {
      flatListRef.current.scrollToEnd();
    }
    setNewMessage();
  };

  return (
    <View style={{flex: 1}}>
      <Header title={selectedUser?.username} isBack={true} />

      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        style={{flex: 1, paddingHorizontal: 8, marginTop: 8}}
        ref={flatListRef}
        contentContainerStyle={{flexGrow: 1}}
        renderItem={({item}) => (
          <View
            style={{
              alignItems:
                item?.senderId === currentUser?.uid ? 'flex-end' : 'flex-start',
              paddingVertical: 3,
              marginHorizontal: 6,
            }}>
            <View
              style={{
                backgroundColor:
                  item?.senderId === currentUser?.uid ? '#DCF8C6' : '#E5E5E5',
                padding: 8,
                borderRadius: 8,
                maxWidth: '80%',
              }}>
              <Text style={{color: 'black'}}>{item?.text}</Text>
              <Text
                style={{
                  fontSize: 12,
                  alignSelf:
                    item.senderId === currentUser?.uid
                      ? 'flex-end'
                      : 'flex-start',
                  color: item.senderId === currentUser?.uid ? 'black' : 'gray',
                }}>
                {new Date(item?.timestamp?.seconds * 1000).toLocaleTimeString(
                  [],
                  {hour: '2-digit', minute: '2-digit'},
                )}
              </Text>
            </View>
          </View>
        )}
        onContentSizeChange={() => {
          if (flatListRef.current) {
            flatListRef.current.scrollToEnd();
          }
        }}
      />
      <View style={{marginBottom: 90}}></View>

      <View style={styles.textContainer}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          style={[styles.textInput, {height: textInputHeight}]}
          placeholder="Type your message"
          multiline={true}
          placeholderTextColor={'gray'}
          onContentSizeChange={e =>
            handleContentSizeChange(
              e.nativeEvent.contentSize.width,
              e.nativeEvent.contentSize.height,
            )
          }
          textAlignVertical="top"
        />
        <TouchableOpacity
          onPress={sendMessage}
          disabled={newMessage?.length > 0 ? false : true}>
          <Icon
            name="send"
            size={24}
            style={{
              marginRight: 8,
              opacity: newMessage?.length > 0 ? 1 : 0.5,
            }}
            color={'gray'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    position: 'absolute',
    bottom: 0,
    width: '98%',
    marginTop: 12,
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'gray',
    display: 'flex',
    marginBottom: 1,
    paddingVertical: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  textInput: {
    fontSize: 17,
    width: '90%',
    paddingHorizontal: 10,
    color: 'black',
    borderRadius: 8,
    textAlignVertical: 'top',
  },
});

export default ChatScreen;
