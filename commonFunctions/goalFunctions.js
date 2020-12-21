import moment from 'moment';
import {getDateObj} from './diaryFunctions';
import {bg_key, food_key, med_key, weight_key} from '../commonFunctions/logFunctions';

const bg = 'blood_glucose';
const food = 'food';
const med = 'medication';
const weight = 'weight';
const activity = 'activity';
const steps = 'steps';
const bgpost = 'blood-glucose';

const frequencyOption = [
  {name: 'Daily', value: 'daily'},
  {name: 'Weekly', value: 'weekly'},
  {name: 'Monthly', value: 'monthly'},
  {name: 'One-Off', value: 'one-off'},
];

const weeklyGoalList = [
  {name: 'Lose 0.2 kg per week', value: -0.2},
  {name: 'Lose 0.5 kg per week ', value: -0.5},
  {name: 'Lose 0.8 kg per week', value: -0.8},
  {name: 'Lose 1 kg per week', value: -1},
  {name: 'Maintain Weight', value: 0},
  {name: 'Gain 0.2 kg per week', value: 0.2},
  {name: 'Gain 0.5 kg per week', value: 0.5},
];

const selfv = 'self';
const defaultv = 'default';
const phyv = 'physician';

const checkSpecialChara = (input) => {
  let toCheck = String(input);
  if (
    toCheck.match(/^[0-9]+(\.[0-9]{1,2})?$/g) &&
    !toCheck.includes(',') &&
    !toCheck.includes('-')
  ) {
    return true;
  }
  return false;
};

const renderGoalTypeName = (type) => {
  switch (type) {
    case bg:
      return 'Blood Glucose Goal';
    case food:
      return 'Food Goal';
    case med:
      return 'Medication Goal';
    case weight:
      return 'Weight Goal';
    case activity:
      return 'Activity Goal';
    case steps:
      return 'Step Goal';
  }
};

const isMonday = () => {
  let dayOfWeek = moment(new Date()).weekday();
  if (dayOfWeek === 1) {
    return true;
  } else {
    return false;
  }
};

//if today date === expire date, goal has not ended
const goalEnded = (dateString) => {
  let endDate = moment(getDateObj(dateString))
    .startOf('day')
    .subtract(1, 'day');
  let today = moment(new Date()).startOf('day');
  if (today.isAfter(endDate)) {
    return true;
  } else {
    return false;
  }
};

//when at edit page, to reinitalise the field
const getFrequency = (value) => {
  for (var x of frequencyOption) {
    if (x.value === value) {
      return x;
    }
  }
};

const getWeeklyObj = (value) => {
  for (var x of weeklyGoalList) {
    if (x.value === value) {
      return x;
    }
  }
};

const getGoalObjById = (id, arr) => {
  for (var x of Object.keys(arr)) {
    let typeArray = arr[x].goals;
    for (var y of typeArray) {
      if (y._id === id) {
        return y;
      }
    }
  }
};

//pass in self, default, physician
const filterForGoalType = (arr, type) => {
  let returnArr = [];
  for (var x of Object.keys(arr)) {
    //get the goal for the type and check set_by
    if (arr[x]?.goals[0]?.set_by === type) {
      let obj = {
        type: x,
        goal: arr[x].goals[0],
      };
      returnArr.push(obj);
    }
  }
  return returnArr;
};
const getGoalTypeFromLog = (logType) => {
  let goalType = '';
  switch (logType) {
    case bg_key:
      goalType = bgpost;
      break;
    case food_key:
      goalType = food;
      break;
    case med_key:
      goalType = med;
      break;
    case weight_key:
      goalType = weight;
      break;
  }
  return goalType;
};

export {
  bg,
  bgpost,
  food,
  med,
  weight,
  activity,
  steps,
  frequencyOption,
  weeklyGoalList,
  selfv,
  defaultv,
  phyv,
  renderGoalTypeName,
  isMonday,
  goalEnded,
  getFrequency,
  getWeeklyObj,
  getGoalObjById,
  checkSpecialChara,
  filterForGoalType,
  getGoalTypeFromLog,
};
