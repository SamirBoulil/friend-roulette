import React, {useState} from 'react';
import {Text, Button, TouchableOpacity, Linking, StyleSheet, View, Image} from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';


function Friend({friend, onCallCompleted}) {
    return (
        <TouchableOpacity
            style={styles.friend}
            onPress={() => {
                Linking.openURL(`tel:${friend.phoneNumbers[0].number}`);
                onCallCompleted(friend);
            }}>
            <Image style={styles.portrait} source={friend.image && {uri: friend.image}}/>
            <View style={styles.nameContainer} >
                <Text style={styles.name}>{friend.firstName}</Text>
                <Text style={styles.name}>{friend.lastName}</Text>
            </View>
            <MaterialCommunityIcons style={styles.callButton} size={54} name="phone-in-talk" color={'black'} />
        </TouchableOpacity>
    );
}

function pickFriendRandomly(friends) {
    return friends[Math.floor(Math.random() * friends.length)];
}

function pickNewFriendToCall(setFriendToCall, friends, friendToCall) {
    const friendsWithoutCurrentFriendToCall = friends.filter(friend => friend.id !== friendToCall.id);
    const newFriendToCall = pickFriendRandomly(friendsWithoutCurrentFriendToCall);
    setFriendToCall(newFriendToCall);
}

export const Roulette = ({friends, onCall}) => {
    console.group('Friends in roulette');
    console.log(friends);
    const [friendToCall, setFriendToCall] = useState(pickFriendRandomly(friends));
    console.log(friendToCall.image);
    console.groupEnd();

    return (
        <View style={styles.container}>
            <MaterialCommunityIcons style={styles.anotherFriend} size={54} name="reload" color='black'  onPress={() => pickNewFriendToCall(setFriendToCall, friends, friendToCall)} />
            {friendToCall && <Friend friend={friendToCall} onCallCompleted={(contact) => {onCall(contact)}}/>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginTop: 25,
        marginBottom: 25,
        alignItems: 'center',
    },
    friend: {
        position: 'relative',
        alignItems: 'center',
        alignSelf: 'stretch',
        flex: 1,
        marginTop: 50,
        marginBottom: 50,
        marginLeft: 'auto',
        marginRight: 'auto',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 5,
        paddingTop: 30,
        paddingBottom: 30,
        width: 300,
        padding: 15,

        backgroundColor: 'grey',
    },
    portrait: {
        position: 'absolute',
        top: - (100/2),
        borderWidth: 2,
        borderColor: 'black',
        width: 100,
        height: 100,
        borderRadius: 25,
    },
    nameContainer: {
      marginTop: 30,
        textAlign: 'center'
    },
    name: {
        fontWeight: 'bold',
        fontSize: 50
    },
    callButton: {
        position: 'absolute',
        bottom: -30,
    },
    anotherFriend: {
        marginBottom: 40,
    }
});
