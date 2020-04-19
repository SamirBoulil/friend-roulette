import React, {useState, useEffect} from 'react';
import {Text, View, SectionList, StyleSheet, Button, TouchableWithoutFeedback} from "react-native";
import {useContacts} from "./UseContacts";
import _ from 'lodash';

function fromArrayToSectionData(contacts) {
    let contactSections = _.groupBy(contacts, d => d.firstName.charAt(0));
    contactSections = _.reduce(
        contactSections,
        (acc, next, index) => {
            acc.push({key: index, data: next});
            return acc;
        },
        []
    );
    contactSections = _.orderBy(contactSections, ["id"]);

    return contactSections;
}

const showEmptyList = () => (
    <View>
        <Text>Aucun résultat!</Text>
    </View>
);

const showSection = ({section}) => (
    <View style={{padding: 8, backgroundColor: '#4fc3c8'}}>
        <Text style={{color: 'white'}}>{section.key.toUpperCase()}</Text>
    </View>
);

const showContact = (onPress) => {
    return ({item: contact}) => (
        <View style={styles.row}>
            {/*<Image style={styles.picture} source={{ uri: props.picture }} />*/}
            <TouchableWithoutFeedback onPress={() => onPress(contact.id)}>
                <View>
                    <Text style={styles.primaryText}>
                        {contact.firstName + ' ' + contact.lastName}
                    </Text>
                    <Text style={styles.secondaryText}>{contact.id}</Text>
                    <Text>{contact.isSelected ? 'Added' : ''}</Text>
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
};

const addFriends = (contacts, numberOfFriends, onAdd) => (
    numberOfFriends > 0 ?
        <Button title={`Add ${numberOfFriends} contact${numberOfFriends > 1 ? 's' : ''}!`}
                onPress={() => onAdd(contacts.filter(contact => contact.isSelected))}/>
        : null
);

export const FriendsSelector = ({selectedFriendIds, onSelection}) => {
    const [contacts, setContacts] = useState([]);
    const setContactsWithSelection = (contacts) => {
        const allContacts = contacts.map(contact => ({...contact, isSelected: selectedFriendIds.includes(contact.id)}));
        console.log("merge contacts and friends!")
        console.log(allContacts);
        setContacts(allContacts);
    };
    useContacts(setContactsWithSelection, selectedFriendIds);

    const contactsSortedAlphabetically = fromArrayToSectionData(contacts);
    const numberOfSelectedFriends = contacts.filter((contact) => contact.isSelected).length;

    // Should not be defined here
    const onPress = (selectedContactId) => setContacts(
        contacts.map(contact => contact.id === selectedContactId ? {
            ...contact,
            isSelected: !contact.isSelected
        } : contact)
    );

    return (
        <View>
            <SectionList
                sections={contactsSortedAlphabetically}
                renderItem={showContact(onPress)}
                keyExtractor={contact => contact.id}
                ListEmptyComponent={showEmptyList}
                renderSectionHeader={showSection}
                ListFooterComponent={addFriends(contacts, numberOfSelectedFriends, onSelection)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    row: {flexDirection: 'row', alignItems: 'center', padding: 12},
    picture: {width: 50, height: 50, borderRadius: 25, marginRight: 18},
    primaryText: {
        fontWeight: 'bold',
        fontSize: 14,
        color: 'black',
        marginBottom: 4,
    },
    secondaryText: {color: 'grey'},
})
