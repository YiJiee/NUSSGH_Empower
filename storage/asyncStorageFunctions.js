import AsyncStorage from '@react-native-community/async-storage';
import {getDateObj} from '../commonFunctions/diaryFunctions';

const key_username = 'username';
const key_role = 'role';
const key_password = 'password';
const key_token = 'token';
const key_bloodGlucoseLog = 'lastBloodGlucoseLog';
const key_weightLog = 'lastWeightLog';
const key_medicationLog = 'lastMedicationLog';
const key_last_meal_log = 'lastMealLog';
const key_fitbit_token = 'fitbitToken';
const key_authorisedCaregiver = 'authorisedCaregiver';
const key_notif_read = 'notif_read';
const key_notifReadPeriod = 'notif_readPeriod';
const key_permission = 'permissions';

const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    console.log('save ' + key + ' : ' + value);
  } catch (e) {
    // saving error
    console.log('error store : ' + key + ' : ' + e);
  }
};

const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      //console.log('load ' + key + ' : ' + value);
      return value;
    }
  } catch (e) {
    // error reading value
    console.log('error getData : ' + e);
  }
  return null;
};

const storeDataObj = async (key, obj) => {
  try {
    let objString = JSON.stringify(obj);
    console.log('save obj ' + key + ' : ' + objString);
    await AsyncStorage.setItem(key, objString);
  } catch (e) {
    // saving error
    console.log('error store obj : ' + key + ' : ' + e);
  }
};

const getDataObj = async (key) => {
  try {
    let objString = await AsyncStorage.getItem(key);
    let obj = JSON.parse(objString);
    if (obj !== null) {
      //console.log('load ' + key + ' : ' + objString);
      return obj;
    }
  } catch (e) {
    // error reading value
    console.log('error getData obj : ' + e);
  }
  return null;
};

const storeUsername = async (username) => {
  await storeData(key_username, username);
};

const getUsername = async () => {
  return await getData(key_username);
};

const storeRole = async (role) => {
  await storeData(key_role, role);
};

const getRole = async () => {
  return await getData(key_role);
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

const storeLastBgLog = async (bgLog) => {
  await storeDataObj(key_bloodGlucoseLog, bgLog);
};

const getLastBgLog = async () => {
  return await getDataObj(key_bloodGlucoseLog);
};

const storeLastWeightLog = async (weightLog) => {
  await storeDataObj(key_weightLog, weightLog);
};

const getLastWeightLog = async () => {
  return await getDataObj(key_weightLog);
};

const storeLastMedicationLog = async (medicationLog) => {
  await storeDataObj(key_medicationLog, medicationLog);
};

const getLastMedicationLog = async () => {
  return await getDataObj(key_medicationLog);
};
const storeLastMealLog = async (mealLog) => {
  return await storeDataObj(key_last_meal_log, mealLog);
};

const getLastMealLog = async () => {
  return await getDataObj(key_last_meal_log);
};

const storeFitbitToken = async (token) => {
  return await storeDataObj(key_fitbit_token, token);
};

const getFitbitToken = async () => {
  return await getDataObj(key_fitbit_token);
};

const storeAuthorisedStatusCaregiver = async (bool) => {
  return await storeDataObj(key_authorisedCaregiver, bool);
};

const getAuthorisedStatusCaregiver = async () => {
  return await getDataObj(key_authorisedCaregiver);
};

const storeReadNotifDate = async (dateObj) => {
  return await storeDataObj(key_notifReadPeriod, dateObj);
};

const getReadNotifDate = async () => {
  return await getDataObj(key_notifReadPeriod);
};

const storePermissions = async (array) => {
  return await storeDataObj(key_permission, array);
};

const getPermissions = async () => {
  return await getDataObj(key_permission);
};

export {
  storeUsername,
  getUsername,
  storeRole,
  getRole,
  storePassword,
  getPassword,
  storeToken,
  getToken,
  storeLastBgLog,
  getLastBgLog,
  storeLastWeightLog,
  getLastWeightLog,
  storeLastMedicationLog,
  getLastMedicationLog,
  storeLastMealLog,
  getLastMealLog,
  getFitbitToken,
  storeFitbitToken,
  key_weightLog,
  storeAuthorisedStatusCaregiver,
  getAuthorisedStatusCaregiver,
  storeReadNotifDate,
  getReadNotifDate,
  storePermissions,
  getPermissions,
};
