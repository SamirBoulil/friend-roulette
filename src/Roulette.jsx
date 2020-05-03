import React, {useState} from 'react';
import {Text, Button, TouchableOpacity, Linking, StyleSheet, View, Image} from "react-native";


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
        </TouchableOpacity>
    );
}

function pickFriendRandomly(friends) {
    return friends[Math.floor(Math.random() * friends.length)];
}

export const Roulette = ({friends, onCall}) => {
    console.group('Friends in roulette');
    console.log(friends);
    const [friendToCall, setFriendToCall] = useState(pickFriendRandomly(friends));
    console.log(friendToCall.image);
    console.groupEnd();
    return (
        <View style={styles.container}>
            {friendToCall && <Friend friend={friendToCall} onCallCompleted={(contact) => {onCall(contact)}}/>}
            <Button title={"Pick a friend to call!"} onPress={() => setFriendToCall(pickFriendRandomly(friends))}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginTop: 25,
        marginBottom: 25,
    },
    friend: {
        position: 'relative',
        alignItems: 'center',
        alignSelf: 'stretch',
        flex: 1,
        marginTop: 50,
        marginLeft: 'auto',
        marginRight: 'auto',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 2,
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
    }
});
