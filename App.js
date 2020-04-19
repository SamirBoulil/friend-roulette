import React, {useState} from 'react';
import {StyleSheet, Linking, Text, View, Button} from 'react-native';
import {FriendsSelector} from "./src/FriendsSelector";

function Friend({friend}) {
  return <View>
    <Text>{friend.firstName} {friend.lastName}</Text>
    <Button title={"Call!"} onPress={() => Linking.openURL(`tel:${friend.phoneNumbers[0].number}`)}/>
  </View>;
}


function pickFriendRandomly(friends) {
  return friends[Math.floor(Math.random() * friends.length)];
}

export default function App() {
  const [isSelectingContacts, setIsSelectingContacts] = useState(true);
  const [friends, setFriends] = useState([]);
  const [friend, setFriend] = useState(null);

  return (
      <View>
        {isSelectingContacts ? (
          <FriendsSelector onSelection={(friends) => setFriends(friends)}/>
        ) : (
            <>
              <Button title={"Select contact randomly"} onPress={() => setFriend(pickFriendRandomly(friends))}/>
              {friend && <Friend friend={friend}/>}
            </>
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
