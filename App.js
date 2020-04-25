import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, SafeAreaView} from 'react-native';
import {FriendsSelector} from "./src/FriendsSelector/FriendsSelector";
import {fetchFriends, saveFriends} from "./src/FriendStore";
import {Roulette} from "./src/Roulette";

function shouldDisplayFriendSelectorOnStart(friends) {
    return friends.length === 0;
}

async function selectFriendsAndCloseSelector(friends, setFriends, setIsPickingFriends) {
    await saveFriends(friends);
    setFriends(friends);
    setIsPickingFriends(false);
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
                        friends={friends}
                        onCall={(calledFriend) => {
                            setFriends(friends.map(friend => (calledFriend.id === friend.id ? {
                                ...friend,
                                hasBeenCalled: true
                            } : friend)))
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
