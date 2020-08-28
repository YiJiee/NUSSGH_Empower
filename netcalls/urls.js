const server = 'https://sghempower.com/';

const patientLogin = server + 'auth/patient-login';
const isTokenValid = server + 'auth/is-token-valid';
const glucoseAddLog = server + 'log/glucose';
const medicationAddLog = server + 'log/medication';
const medicationList = server + 'log/medication/list';
const weightAddLog = server + 'log/weight';
const mealAddLogEndpoint = server + 'log/meal';
const unfavouriteMealEndpoint = server + 'log/meal/unfavourite-meal';
const mealListEndpoint = server + 'log/meal';
const favouriteMealListEndpoint = server + 'log/meal/favourite-list';
const foodSearchEndpoint = server + 'food/search';
const requestOTP = server + 'auth/patient/password-reset/request-otp';
const verifyOTP = server + 'auth/patient/password-reset/verify-otp';
const postNewPassword = server + 'auth/patient/password-reset/reset';
const getDiaryEntries = server + 'log/diary';
const medplanAdd = server + 'log/medication/plan';

export {
  patientLogin,
  isTokenValid,
  glucoseAddLog,
  medicationAddLog,
  medicationList,
  weightAddLog,
  mealAddLogEndpoint,
  mealListEndpoint,
  favouriteMealListEndpoint,
  unfavouriteMealEndpoint,
  foodSearchEndpoint,
  requestOTP,
  verifyOTP,
  postNewPassword,
  getDiaryEntries,
  medplanAdd,
};
