import React, {useEffect, useState} from 'react';
import {Button, Platform, StyleSheet, View} from 'react-native';
import {FriendsSelector} from "./src/FriendsSelector";
import {fetchFriends, saveFriends} from "./src/FriendStore";
import {AdMobBanner} from 'expo-ads-admob';
import {Roulette} from "./src/Roulette";

function shouldDisplayFriendSelector(friends) {
  return friends.length === 0;
}

const bannerAddUnit = Platform.OS === 'ios' ? "ca-app-pub-5835627539614976/5497430882" : "ca-app-pub-5835627539614976/2292435627"

export default function App() {
  const [friends, setFriends] = useState([]);
  const [isPickingFriends, setIsPickingFriends] = useState(true);

  useEffect(() => {
        (async () => {
          setFriends(await fetchFriends());
          setIsPickingFriends(shouldDisplayFriendSelector(await fetchFriends()));
        })();
      },
      []
  );

  return (
      <View>
        {isPickingFriends ? (
          <FriendsSelector selectedFriendIds={friends.map(friend => friend.id)} onSelection={async friends => {
            await saveFriends(friends);
            setFriends(friends);
            setIsPickingFriends(false);
          }}/>
        ) : (
            <>
              <Button title={"Pick more contacts"} onPress={() => setIsPickingFriends(true)}/>
              <Roulette friends={friends} />
            </>
        )}
        <AdMobBanner
            bannerSize="fullBanner"
            adUnitID={bannerAddUnit}
            testDeviceID="EMULATOR"
            servePersonalizedAds
            onDidFailToReceiveAdWithError={(error) => console.log(error)} />
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
