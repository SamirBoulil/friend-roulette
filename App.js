import React, {useEffect, useState} from 'react';
import {Button, SafeAreaView, StyleSheet} from 'react-native';
import {FriendsSelector} from "./src/FriendsSelector/FriendsSelector";
import {fetchFriends, saveFriends} from "./src/FriendStore";
import {Roulette} from "./src/Roulette";

function shouldDisplayFriendSelectorOnStart(friends) {
    return friends.length === 0;
}

async function selectFriendsAndCloseSelector(friends, setFriends, setIsPickingFriends) {
    console.group('Add friends');
    const friendsToCall = friends.map(friend => ({...friend, hasBeenCalled: false}));
    console.log(friendsToCall);
    console.groupEnd();

    await saveFriends(friendsToCall);
    setFriends(friendsToCall);
    setIsPickingFriends(false);
}

const friendsToCall = (friends) => {
    return friends.filter(friends => !friends.hasBeenCalled);
}

async function setFriendHasBeenCalled(friends, calledFriend, setFriends) {
    let updatedFriends = friends.map(
        friend => (calledFriend.id === friend.id ? {
            ...friend,
            hasBeenCalled: true
        } : friend)
    );

    if (friendsToCall(updatedFriends).length === 0) {
        updatedFriends = friends.map(friend => ({...friend, hasBeenCalled: false}))
    }

    await saveFriends(updatedFriends);
    setFriends(updatedFriends)
}

export default function App() {
    const [friends, setFriends] = useState([]);
    const [isPickingFriends, setIsPickingFriends] = useState(shouldDisplayFriendSelectorOnStart(friends));
    useEffect(() => {
            (async () => {
                const friends = await fetchFriends();
                setFriends(friends);
                setIsPickingFriends(shouldDisplayFriendSelectorOnStart(friends));
            })();
        },
        []
    );

    return (
        <SafeAreaView>
            {isPickingFriends ? (
                <FriendsSelector selectedFriends={friends} onSelection={
                    async friends => {
                        await selectFriendsAndCloseSelector(friends, setFriends, setIsPickingFriends);
                    }
                }/>
            ) : (
                <>
                    <Roulette
                        friends={friendsToCall(friends)}
                        onCall={async calledFriend => {
                            await setFriendHasBeenCalled(friends, calledFriend, setFriends);
                        }}
                    />
                    <Button title={"Pick more contacts"} onPress={() => setIsPickingFriends(true)}/>
                </>
            )}
        </SafeAreaView>
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
