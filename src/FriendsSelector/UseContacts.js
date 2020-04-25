import {useEffect} from 'react'
import {Platform} from 'react-native';
import {fetchAllContacts} from "./ContactsFetcher";

export const useContacts = (setContacts, dependency) => {
    if (Platform.OS === 'web') {
        useEffect(() => {
            setContacts(fetchAllContacts());
        }, [dependency])
    } else {
        useEffect(() => {
            ;(async () => {
                await fetchFromPhone(setContacts);
            })()
        }, [])
    }
}
