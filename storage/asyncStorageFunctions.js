import AsyncStorage from '@react-native-community/async-storage';

const key_username = 'username';
const key_password = 'password';
const key_token = 'token';
const key_medications = 'medications';
const key_last_meal_log = 'lastMealLog';

const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    console.log('save ' + key + ' : ' + value);
  } catch (e) {
    // saving error
    console.log('error store ' + key + ' : ' + e);
  }
};

const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      console.log('load ' + key + ' : ' + value);
      return value;
    }
  } catch (e) {
    // error reading value
    console.log('error getUsername : ' + e);
  }
  return null;
};

//just without value*
const getData2 = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      console.log('load ' + key);
      return value;
    }
  } catch (e) {
    // error reading value
    console.log('error : ' + e);
  }
  return null;
};

const storeUsername = async (username) => {
  await storeData(key_username, username);
};

const getUsername = async () => {
  return await getData(key_username);
};

const storePassword = async (password) => {
  await storeData(key_password, password);
};

const getPassword = async () => {
  return await getData(key_password);
};

const storeToken = async (token) => {
  await storeData(key_token, token);
};

const getToken = async () => {
  return await getData(key_token);
};

const getMedications = async () => {
  return await getData2(key_medications);
};

const storeLastMealLog = async (mealLog) => {
  return await storeData(key_last_meal_log, mealLog);
}

const getLastMealLog = async () => {
  return await getData(key_last_meal_log);
}

export {
  storeUsername,
  getUsername,
  storePassword,
  getPassword,
  storeToken,
  getToken,
  getMedications,
  storeLastMealLog,
  getLastMealLog
};
