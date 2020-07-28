import AsyncStorage from '@react-native-community/async-storage';

const key_username = 'username';
const key_password = 'password';
const key_token = 'token';


const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value)
        console.log('save ' + key + ' : ' + value);
    } catch (e) {
        // saving error
        console.log('error store ' + key + ' : ' + e);
    }
}

const getData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key)
        if(value !== null) {
            console.log('load ' + key + ' : ' + value);
            return value;
        }
    } catch(e) {
        // error reading value
        console.log('error getUsername : ' + e);
    }
    return null;
}

const storeUsername = async (username) => {
    await storeData(key_username, username);
}

const getUsername = async () => {
    return await getData(key_username);
}

const storePassword = async (password) => {
    await storeData(key_password, password);
}

const getPassword = async () => {
    return await getData(key_password);
}

const storeToken = async (token) => {
    await storeData(key_token, token);
}

const getToken = async () => {
    return await getData(key_token);
}

export {storeUsername, getUsername, storePassword, getPassword, storeToken, getToken};

