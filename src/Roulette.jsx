import React, {useState} from 'react';
import {Button, Linking, View} from "react-native";


function Friend({friend, onCallCompleted}) {
    return <View>
        <Button
            title={`Call ${friend.firstName} ${friend.lastName}!`}
            onPress={() => {
                Linking.openURL(`tel:${friend.phoneNumbers[0].number}`);
                onCallCompleted(friend);
            }}
        />
    </View>;
}

function pickFriendRandomly(friends) {
    return friends[Math.floor(Math.random() * friends.length)];
}

export const Roulette = ({friends, onCall}) => {
    console.group('Friends in roulette');
    console.log(friends);
    console.groupEnd();
    const [friendToCall, setFriendToCall] = useState(pickFriendRandomly(friends));

    return (
        <>
            <Button title={"Pick a friend to call!"} onPress={() => setFriendToCall(pickFriendRandomly(friends))}/>
            {friendToCall && <Friend friend={friendToCall} onCallCompleted={(contact) => {onCall(contact)}}/>}
        </>
    );
}
