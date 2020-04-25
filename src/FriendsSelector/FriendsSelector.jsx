import React, {useEffect, useState} from 'react';
import {Button, SectionList, StyleSheet, Text, TouchableWithoutFeedback, View, Image} from "react-native";
import _ from 'lodash';
import {fetchAllContacts} from "./ContactsFetcher";
import Constants from "expo-constants";

function sortContactsAlphabetically(contacts) {
    let contactSections = _.groupBy(contacts, d => d.firstName.charAt(0));
    contactSections = _.reduce(
        contactSections,
        (acc, next, index) => {
            acc.push({key: index, data: next});
            return acc;
        },
        []
    );
    contactSections = _.orderBy(contactSections, ["key"]);

    return contactSections;
}

const showContact = (onPress) => {
    return ({item: contact}) => (
        !contact.isSelected ?
                <TouchableWithoutFeedback onPress={() => onPress(contact)}>
                    <View style={styles.row}>
                        <Image style={styles.picture} source={contact.image && {uri: contact.image}}/>
                        <View style={{flexGrow: 1}}>
                            <Text style={styles.primaryText}>
                                {contact.firstName + ' ' + contact.lastName}
                            </Text>
                            <Text>Add</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
             : null
    )
};

const useContacts = (friends) => {
    const [contacts, setContacts] = useState([]);
    useEffect(() => {
        (async () => {
            const friendIds = friends.map(friend => friend.id);
            const contactsWithoutFriends = (await fetchAllContacts(setContacts)).map(contact => {
                return {...contact, isSelected: friendIds.includes(contact.id)};
            });
            setContacts(sortContactsAlphabetically(contactsWithoutFriends));
        })();
    }, []);

    return [contacts, setContacts];
};

const showFriend = (onPress) => {
    return ({item: contact}) => (
        <TouchableWithoutFeedback onPress={() => onPress(contact)}>
            <View style={styles.row}>
                <Image style={styles.picture} source={contact.image && {uri: contact.image}}/>
                <View style={{flexGrow: 1}}>
                    <Text style={styles.primaryText}>
                        {contact.firstName + ' ' + contact.lastName}
                    </Text>
                </View>
                <Text style={{color: "black", fontSize: 24}}>✔</Text>
            </View>
        </TouchableWithoutFeedback>
    )
};

const AddFriends = ({friends, onAdd}) => {
    const numberOfFriends = friends.length;

    return numberOfFriends > 0 ?
        <Button
            title={`Add ${numberOfFriends} contact${numberOfFriends > 1 ? 's' : ''}!`}
            onPress={() => onAdd(friends)}/>
        : null;
};

const ShowEmptyListComponent = () => (
    <View>
        <Text>Aucun résultat!</Text>
    </View>
);

const showSection = ({section}) => (
    section.key === 'selected_friends' ?
        <Header />
        :
    <View style={{padding: 15, backgroundColor: 'white'}}>
        <Text style={{color: 'black'}}>{section.key.toUpperCase()}</Text>
    </View>
);

const Header = () => <View style={{padding: 15, backgroundColor: 'black'}}>
    <Text style={{color: 'white', fontSize: 36, fontStyle: 'bold'}}>Your Friends</Text>
</View>;


export const FriendsSelector = ({selectedFriends, onSelection}) => {
    const [friends, setFriends] = useState(selectedFriends);
    const [contacts, setContacts] = useContacts(friends);

    const onAddFriend = (newFriend) => {
        setFriends([...friends, newFriend]);

        const sectionOfFriendIndex = contacts.findIndex((section) => section.key === newFriend.firstName.charAt(0));
        contacts[sectionOfFriendIndex]['data'] = contacts[sectionOfFriendIndex]['data'].map(contact => contact.id === newFriend.id ? {
            ...contact,
            isSelected: true
        } : contact);
        setContacts(contacts);
    };

    const onRemoveFriend = (friendToRemove) => {
        setFriends(friends.filter(friend => friend.id !== friendToRemove.id));

        const sectionOfFriendIndex = contacts.findIndex((section) => section.key === friendToRemove.firstName.charAt(0));
        contacts[sectionOfFriendIndex]['data'] = contacts[sectionOfFriendIndex]['data'].map(contact => contact.id === friendToRemove.id ? {
            ...contact,
            isSelected: false
        } : contact);

        setContacts(contacts);
    };

    const listToDisplay = [{key: 'selected_friends', data: friends, renderItem: showFriend(onRemoveFriend)}, ...contacts];
    return (
        <>
            <AddFriends friends={friends} onAdd={onSelection} />
            <SectionList
                keyExtractor={contact => contact.id}
                sections={listToDisplay}
                renderItem={showContact(onAddFriend)}
                renderSectionHeader={showSection}
                ListEmptyComponent={ShowEmptyListComponent}
                // ListFooterComponent={addFriends(friends, onSelection)}
                stickySectionHeadersEnabled={true}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
        marginHorizontal: 16
    },
    row: {flexDirection: 'row', alignItems: 'center', padding: 12},
    picture: {width: 50, height: 50, borderRadius: 25, marginRight: 18},
    primaryText: {
        fontWeight: 'bold',
        fontSize: 14,
        color: 'black',
    },
    secondaryText: {color: 'grey'},
});
