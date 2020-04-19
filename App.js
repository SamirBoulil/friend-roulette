import React, {useEffect, useState} from 'react';
import {Button, Linking, StyleSheet, Text, View} from 'react-native';
import {FriendsSelector} from "./src/FriendsSelector";
import {fetchFriends, saveFriends} from "./src/FriendStore";

function Friend({friend}) {
  return <View>
    <Button title={`Call ${friend.firstName} ${friend.lastName}!`} onPress={() => Linking.openURL(`tel:${friend.phoneNumbers[0].number}`)}/>
  </View>;
}

function pickFriendRandomly(friends) {
  return friends[Math.floor(Math.random() * friends.length)];
}

function shouldDisplayFriendSelector(friends) {
  return friends.length !== 0;
}

export default function App() {
  const [friends, setFriends] = useState([]);
  const [isSelectingContacts, setIsSelectingContacts] = useState(true);
  const [friendToCall, setFriendToCall] = useState(null); // To extract in dedicated Roulette component

  useEffect(() => {
        (async () => {
          let friends = await fetchFriends();
          console.log("Friends fetched");
          setFriends(friends);
          setIsSelectingContacts(shouldDisplayFriendSelector(friends));
        })();
      },
      []
  );

  return (
      <View>
        {isSelectingContacts ? (
          <FriendsSelector selectedFriendIds={friends.map(friend => friend.id)} onSelection={async friends => {
            await saveFriends(friends);
            setFriends(friends);
            setIsSelectingContacts(false);
          }}/>
        ) : (
            <>
              <Button title={"Select contact randomly"} onPress={() => setFriendToCall(pickFriendRandomly(friends))}/>
              {friendToCall && <Friend friend={friendToCall}/>}
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
