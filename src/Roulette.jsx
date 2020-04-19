import React, {useState} from 'react';
import {Button, Linking, View} from "react-native";


function Friend({friend}) {
    return <View>
        <Button title={`Call ${friend.firstName} ${friend.lastName}!`} onPress={() => Linking.openURL(`tel:${friend.phoneNumbers[0].number}`)}/>
    </View>;
}

function pickFriendRandomly(friends) {
    return friends[Math.floor(Math.random() * friends.length)];
}

export const Roulette = ({friends}) => {
    const [friendToCall, setFriendToCall] = useState(null);

    return (
        <>
            <Button title={"Pick a friend to call!"} onPress={() => setFriendToCall(pickFriendRandomly(friends))}/>
            {friendToCall && <Friend friend={friendToCall}/>}
        </>
    );
}
