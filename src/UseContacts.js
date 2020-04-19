import {useEffect} from 'react'
import {Platform} from 'react-native';
import {
    requestPermissionsAsync,
    getContactsAsync,
    Fields
} from 'expo-contacts';

function hasPhoneAndName(contact) {
    return (
        null !== contact.phoneNumbers &&
        null !== contact.firstName &&
        null !== contact.lastName
    )
}

function adaptPhoneNumber(phoneNumber) {
    return {
        id: phoneNumber.id,
        label: phoneNumber.label ?? '',
        number: phoneNumber.number ?? '',
    }
}

function adaptToContact(contact) {
    const phoneNumbers = contact.phoneNumbers ?? []
    return {
        id: contact.id,
        firstName: contact.firstName ?? '',
        lastName: contact.lastName ?? '',
        phoneNumbers: phoneNumbers.map(adaptPhoneNumber),
    }
}

export const useContacts = (selectedFriends, setContacts) => {
    if (Platform.OS === 'web') {
        useEffect(() => {
            setContacts([
                {
                    id: '1',
                    firstName: 'Samir',
                    lastName: 'Boulil',
                    phoneNumbers: [
                        {number: '0606060606', label: 'home', id: '1'},
                        {number: '1616161616', label: 'home', id: '2'},
                    ],
                    isSelected: true,
                },
                {
                    id: '2',
                    firstName: 'Lucie',
                    lastName: 'Blanchard',
                    phoneNumbers: [
                        {number: '1717171717', label: 'home', id: '1'},
                        {number: '1717171717', label: 'home', id: '1'},
                    ],
                    isSelected: false,
                },
            ]);
        }, [])
    } else {
        useEffect(() => {
            ;(async () => {
                const {status} = await requestPermissionsAsync()
                if (status === 'granted') {
                    const {data} = await getContactsAsync({
                        fields: [
                            Fields.ID,
                            Fields.FirstName,
                            Fields.LastName,
                            Fields.PhoneNumbers,
                        ],
                    });

                    if (data.length === 0) {
                        return
                    }

                    const contactCandidates = data
                        .filter(hasPhoneAndName)
                        .map(adaptToContact)
                        .map((contact) => ({...contact, isSelected: selectedFriends.includes(contact.id)}))
                    ;

                    setContacts(contactCandidates)
                } else {
                    // App cannot work
                }
            })()
        }, [])
    }
}
