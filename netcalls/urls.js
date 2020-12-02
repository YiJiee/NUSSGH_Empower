const server = 'https://sghempower.com/';

const login = server + 'auth/login';
const isTokenValid = server + 'auth/is-token-valid';
const glucoseAddLog = server + 'log/glucose';
const medicationAddLog = server + 'log/medication';
const medicationList = server + 'log/medication/list';
const weightAddLog = server + 'log/weight';
const getActivityLog = server + 'log/activity';
const getActivitySummary = server + 'log/activity/summary';
const mealAddLogEndpoint = server + 'log/meal';
const unfavouriteMealEndpoint = server + 'log/meal/unfavourite-meal';
const mealListEndpoint = server + 'log/meal';
const favouriteMealListEndpoint = server + 'log/meal/favourite-list';
const nutrientConsumptionEndpoint = server + 'log/meal/nutrient-consumption';
const foodSearchEndpoint = server + 'food/search';
const foodSearchByNameEndpoint = server + 'food/search-by-exact-name';
const hypocorrectionFoodEndpoint = server + 'food/hypocorrection'; // This endpoint will be deployed soon.
const requestOTP = server + 'auth/patient/password-reset/request-otp';
const verifyOTP = server + 'auth/patient/password-reset/verify-otp';
const postNewPassword = server + 'auth/patient/password-reset/reset';
const medPlan = server + 'log/medication/plan';
const fitbitTokenPostEndpoint = server + 'datasync/auth-fitbit';
const getDiaryEntries = server + 'log/diary';
const goal = server + '/goal';
const profile = server + 'patient/profile';
const educationArticlesEndpoint = server + 'education/articles';
const pusherTokenEndpoint = server + 'auth/notification-token';

const gameCenterGetOverview = server + 'game/bingo/overview';
const gameCenterSelectGame = server + 'game/bingo/select';
const gameCenterPerformSpin = server + 'game/bingo/spin';
const rewardGetOverview = server + 'rewards';
const rewardRedeem = server + 'rewards/redeem';

const searchCaregiver = server + 'caregiver/search';
const getCaregiver = server + 'caregiver';
const assignCaregiver = server + 'caregiver/assign';
const pendingCaregiverReq = server + 'caregiver/pending';
const patientCode = server + 'caregiver/code';
const sendCaregiverReq = server + 'caregiver/request';

const caregiverLogin = server + 'auth/caregiver-login';
const caregiverProfile = server + 'profile/caregiver';
const requestOTP_C = server + 'auth/caregiver/password-reset/request-otp';
const verifyOTP_C = server + 'auth/caregiver/password-reset/verify-otp';
const postNewPassword_C = server + 'auth/caregiver/password-reset/reset';

const authSecurityQn = server + 'auth/security-questions';
const authSecurityQnAns = server + 'auth/security-answers';
const get_authSecurityQn = server + 'auth/security-questions/all';
const verify_authSecurityQn = server + 'auth/security-answers/verify';

const getLab = server + 'profile/lab-data';

const getAppointment = server + 'profile/appointment';

export {
  login,
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
  foodSearchByNameEndpoint,
  hypocorrectionFoodEndpoint,
  requestOTP,
  verifyOTP,
  postNewPassword,
  medPlan,
  fitbitTokenPostEndpoint,
  nutrientConsumptionEndpoint,
  getDiaryEntries,
  getActivityLog,
  goal,
  getActivitySummary,
  profile,
  educationArticlesEndpoint,
  gameCenterGetOverview,
  gameCenterSelectGame,
  gameCenterPerformSpin,
  rewardGetOverview,
  rewardRedeem,
  pusherTokenEndpoint,
  caregiverLogin,
  caregiverProfile,
  requestOTP_C,
  verifyOTP_C,
  postNewPassword_C,
  searchCaregiver,
  getCaregiver,
  assignCaregiver,
  pendingCaregiverReq,
  patientCode,
  sendCaregiverReq,
  authSecurityQn,
  get_authSecurityQn,
  verify_authSecurityQn,
  authSecurityQnAns,
  getLab,
  getAppointment,
};
