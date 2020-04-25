// import AsyncStorage from '@react-native-community/async-storage';
import { AsyncStorage } from 'react-native';

const STORAGE_KEY = 'friend-roulette-friends';

const saveFriends = async (friends) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(friends));
    } catch (error) {
        // Error saving data
    }
};

const fetchFriends = async () => {
    try {
        const friends = await AsyncStorage.getItem(STORAGE_KEY);
        if (friends !== null) {
            console.log(friends);
            return JSON.parse(friends);
        }

        return [];
    } catch (error) {
        // Error retrieving data
    }
};

export {saveFriends, fetchFriends};
