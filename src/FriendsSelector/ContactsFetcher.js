import {Platform} from "react-native";
import {Fields, getContactsAsync, requestPermissionsAsync} from "expo-contacts";

export const fetchAllContacts = async () => {
    if (Platform.OS === 'web') {
        return await mockForWeb();
    } else {
        return await fetchFromPhone();
    }
};

const mockForWeb = async () => {
    return [
        {
            id: '1',
            firstName: 'Samir',
            lastName: 'Boulil',
            image: 'https://avatars3.githubusercontent.com/u/1826473?s=220&v=4',
            phoneNumbers: [
                {number: '0606060606', label: 'home', id: '1'},
                {number: '1616161616', label: 'home', id: '2'},
            ],
        },
        {
            id: '4',
            firstName: 'Sami',
            lastName: 'Mimouni',
            image: 'https://business.lesechos.fr/images/2017/12/14/317023_1513274492_smt-performances-photo-fb_1200x640.png',
            phoneNumbers: [
                {number: '0606060606', label: 'home', id: '1'},
                {number: '1616161616', label: 'home', id: '2'},
            ],
        },
        {
            id: '2',
            firstName: 'Lucie',
            lastName: 'Blanchard',
            image: 'https://i.pinimg.com/280x280_RS/d4/93/be/d493be1f6032a3ab1e3fd43c4de5d341.jpg',
            phoneNumbers: [
                {number: '1717171717', label: 'home', id: '1'},
                {number: '1717171717', label: 'home', id: '1'},
            ],
        },
        {
            id: '3',
            firstName: 'Isabelle',
            lastName: 'Boulil',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/A_perfect_SVG_heart.svg/1200px-A_perfect_SVG_heart.svg.png',
            phoneNumbers: [
                {number: '1818181818', label: 'home', id: '1'},
                {number: '1818181818', label: 'home', id: '1'},
            ],
        },
    ];
};

const fetchFromPhone = async () => {
    const {status} = await requestPermissionsAsync()
    if (status === 'granted') {
        const {data} = await getContactsAsync({
            fields: [
                Fields.ID,
                Fields.FirstName,
                Fields.LastName,
                Fields.PhoneNumbers,
                Fields.Image,
                Fields.ImageAvailable,
            ],
        });

        if (data.length === 0) {
            return
        }

        return data.filter(hasPhoneAndName).map(adaptToContact);
    } else {
        // App cannot work
    }
};

function adaptToContact(contact) {
    const phoneNumbers = contact.phoneNumbers ?? []
    console.log(contact);
    const image = contact.imageAvailable ? contact.image.uri : null;
    return {
        id: contact.id,
        firstName: contact.firstName ?? '',
        lastName: contact.lastName ?? '',
        image: image,
        phoneNumbers: phoneNumbers.map(adaptPhoneNumber),
    }
}

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
