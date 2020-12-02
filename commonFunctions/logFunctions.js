import React from 'react';
import Moment from 'moment';
import {Alert} from 'react-native';
import {
  glucoseAddLogRequest,
  medicationAddLogRequest,
  weightAddLogRequest,
  getWeightLogs,
  getBloodGlucoseLogs,
} from '../netcalls/requestsLog';
import {
  storeLastBgLog,
  storeLastMedicationLog,
  storeLastWeightLog,
  getLastBgLog,
  getLastWeightLog,
  getLastMedicationLog,
  getLastMealLog,
} from '../storage/asyncStorageFunctions';

import {
  getGreetingFromHour,
  checkLast7Day,
  noLog,
  eveningObj,
  afternoonObj,
} from './common';
import {getEntry4Day} from '../netcalls/requestsDiary';
import {
  filterMorning,
  filterAfternoon,
  getTime,
  getHour,
  getDateRange,
  getDateObj,
  checkFoodLogQuantity,
} from './diaryFunctions';
//svg
import DARKGREEN_BG from '../resources/images/Patient-Icons/SVG/icon-darkgreen-bloodglucose.svg';
import DARKGREEN_FOOD from '../resources/images/Patient-Icons/SVG/icon-darkgreen-food.svg';
import DARKGREEN_MED from '../resources/images/Patient-Icons/SVG/icon-darkgreen-med.svg';
import DARKGREEN_WEIGHT from '../resources/images/Patient-Icons/SVG/icon-darkgreen-weight.svg';

import NAVY_BG from '../resources/images/Patient-Icons/SVG/icon-navy-bloodglucose.svg';
import NAVY_FOOD from '../resources/images/Patient-Icons/SVG/icon-navy-food.svg';
import NAVY_MED from '../resources/images/Patient-Icons/SVG/icon-navy-med.svg';
import NAVY_WEIGHT from '../resources/images/Patient-Icons/SVG/icon-navy-weight.svg';
import NAVY_ACTIVITY from '../resources/images/Patient-Icons/SVG/icon-navy-running.svg';
import NAVY_STEPS from '../resources/images/Patient-Icons/SVG/icon-navy-steps.svg';

import WHITE_BG from '../resources/images/Patient-Icons/SVG/icon-white-bloodglucose.svg';
import WHITE_FOOD from '../resources/images/Patient-Icons/SVG/icon-white-food.svg';
import WHITE_MED from '../resources/images/Patient-Icons/SVG/icon-white-med.svg';
import WHITE_WEIGHT from '../resources/images/Patient-Icons/SVG/icon-white-weight.svg';

import GREEN_BG from '../resources/images/Patient-Icons/SVG/icon-lightgreen-bloodglucose.svg';
import GREEN_FOOD from '../resources/images/Patient-Icons/SVG/icon-lightgreen-food.svg';
import GREEN_MED from '../resources/images/Patient-Icons/SVG/icon-lightgreen-med.svg';
import GREEN_WEIGHT from '../resources/images/Patient-Icons/SVG/icon-lightgreen-weight.svg';
import {logIconHomeStyle, logIconAddLogStyle} from './scaleFunction';

const bg_key = 'Blood Glucose Log';
const food_key = 'Food Intake Log';
const med_key = 'Medication Log';
const weight_key = 'Weight Log';
const activity_key = 'Activity Log';
const step_key = 'Steps';
const min_bg = 4;

const logoStyle = {
  width: 35,
  height: 35,
  marginEnd: '5%',
};

const renderLogIcon = (logType) => {
  if (logType === bg_key) {
    return <DARKGREEN_BG {...logIconHomeStyle} />;
  }
  if (logType === food_key) {
    return <DARKGREEN_FOOD {...logIconHomeStyle} />;
  }
  if (logType === med_key) {
    return <DARKGREEN_MED {...logIconHomeStyle} />;
  }
  if (logType === weight_key) {
    return <DARKGREEN_WEIGHT {...logIconHomeStyle} />;
  }
  if (logType === activity_key) {
    return <DARKGREEN_ACTIVITY {...logIconHomeStyle} />;
  }
};

const renderLogIconNavy = (logType) => {
  if (logType === bg_key) {
    return <NAVY_BG {...logIconAddLogStyle} />;
  }
  if (logType === food_key) {
    return <NAVY_FOOD {...logIconAddLogStyle} />;
  }
  if (logType === med_key) {
    return <NAVY_MED {...logIconAddLogStyle} />;
  }
  if (logType === weight_key) {
    return <NAVY_WEIGHT {...logIconAddLogStyle} />;
  }
  if (logType === activity_key) {
    return <NAVY_ACTIVITY {...logIconAddLogStyle} />;
  }
  if (logType === step_key) {
    return <NAVY_STEPS {...logIconAddLogStyle} />;
  }
};

const renderLogIconWhite = (logType) => {
  if (logType === bg_key) {
    return <WHITE_BG {...logoStyle} />;
  }
  if (logType === food_key) {
    return <WHITE_FOOD {...logoStyle} />;
  }
  if (logType === med_key) {
    return <WHITE_MED {...logoStyle} />;
  }
  if (logType === weight_key) {
    return <WHITE_WEIGHT {...logoStyle} />;
  }
};

const isToday = (date) => {
  return date === Moment(new Date()).format('YYYY/MM/DD');
};

const isPeriod = (time) => {
  let timeArr = String(time).split(':');
  let hour = timeArr[0];
  return getGreetingFromHour(hour);
};

const dateFrom2dayLog = async (type, date) => {
  let arr = getDateRange(7, date);
  let arr1 = [];
  if (type === weight_key) {
    arr1 = await getWeightLogs(
      arr[0],
      Moment(date).add(1, 'days').format('YYYY-MM-DD'),
    );
  } else if (type === bg_key) {
    arr1 = await getBloodGlucoseLogs(
      arr[0],
      Moment(date).add(1, 'days').format('YYYY-MM-DD'),
    );
  }
  let logs = arr1?.logs;
  if (logs?.length === 0) {
    return noLog;
  } else {
    //weight exist in last 7 days
    let today = Moment(date).startOf('day');
    let takenDate = Moment(
      getDateObj(logs[logs?.length - 1].record_date),
    ).startOf('day');
    let diff = today.diff(takenDate, 'days');
    if (diff != 0) {
      return 'Logged ' + diff + ' day(s) ago';
    } else {
      return 'Logged today';
    }
  }
};

const checkLogDone = async (period) => {
  let completed = [];
  let notCompleted = [];
  let bgLogs = [];
  let foodLogs = [];
  let medLogs = [];
  let weightLogs = [];
  let today = Moment(new Date()).format('YYYY-MM-DD');

  try {
    let data = await getEntry4Day(String(today));
    let d = data[today];
    bgLogs = d?.glucose?.logs;
    foodLogs = d?.food?.logs;
    medLogs = d?.medication?.logs;
    weightLogs = d?.weight?.logs;

    if ((await dateFrom2dayLog(bg_key, new Date())) === noLog) {
      notCompleted.push(bg_key);
    } else {
      completed.push(bg_key);
    }

    if (inPeriod(foodLogs, period)) {
      completed.push(food_key);
    } else {
      notCompleted.push(food_key);
    }

    if (inPeriod(medLogs, period)) {
      completed.push(med_key);
    } else {
      notCompleted.push(med_key);
    }

    //check last weight
    if ((await dateFrom2dayLog(weight_key, new Date())) === noLog) {
      notCompleted.push(weight_key);
    } else {
      completed.push(weight_key);
    }
  } catch (e) {
    console.error(e);
    //for now temporary push food to not done
  }
  return {
    completed: completed,
    notCompleted: notCompleted,
  };
};

const inPeriod = (logs, period) => {
  if (logs.length === 0) {
    return false;
  }
  for (var x of logs) {
    let time = getHour(x.record_date);
    let greeting = getGreetingFromHour(time);
    if (greeting === period) {
      return true;
    }
  }
  return false;
};

const checkBloodGlucose = (bloodGlucose) => {
  if (bloodGlucose && checkBloodGlucoseText(bloodGlucose) === '') {
    return true;
  }
  return false;
};

const checkBloodGlucoseText = (bloodGlucose) => {
  if (bloodGlucose) {
    if (Number(bloodGlucose) >= 30 || Number(bloodGlucose) <= 0) {
      return 'Invalid Blood Glucose Level, should be within 0-30';
    } else if (
      bloodGlucose.match(/^[0-9]+(\.[0-9]{1,2})?$/g) &&
      !bloodGlucose.includes(',') &&
      !bloodGlucose.includes('-')
    ) {
      return '';
    } else {
      return 'Invalid Blood Glucose Input. Make sure at most 2 decimal place';
    }
  }
  return '';
};

const checkWeight = (weight) => {
  if (weight && checkWeightText(weight) === '') {
    return true;
  }
  return false;
};

const checkWeightText = (weight) => {
  if (weight) {
    if (
      String(weight).match(/^[0-9]+(\.[0-9]{1})?$/g) &&
      !String(weight).includes(',') &&
      !String(weight).includes('-') &&
      Number(weight) <= 200 &&
      Number(weight) >= 40
    ) {
      return '';
    } else {
      return 'Make sure weight entered is between 40 to 200kg. ';
    }
  }
  return '';
};

const checkDosageText = (dosage) => {
  if (dosage > 0) {
    return '';
  } else {
    return 'Dosage cannot be 0';
  }
};

const checkDosage = (dosage, correctDosage) => {
  if (dosage && checkDosageText(dosage, correctDosage) === '') {
    return true;
  }
  return false;
};

const checkRepeatMedicine = (medicine, list) => {
  for (let x of list) {
    if (x.drugName === medicine.medication) {
      return true;
    }
  }
  return false;
};

const handleSubmitBloodGlucose = async (
  date,
  bloodGlucose,
  eatSelection,
  exerciseSelection,
  alcholicSelection,
) => {
  if (checkBloodGlucose(bloodGlucose)) {
    let formatDate = Moment(date).format('DD/MM/YYYY HH:mm:ss');
    if (
      await glucoseAddLogRequest(
        Number(bloodGlucose),
        formatDate,
        eatSelection,
        exerciseSelection,
        alcholicSelection,
      )
    ) {
      storeLastBgLog({
        value: bloodGlucose,
        date: Moment(date).format('YYYY/MM/DD'),
        hour: Moment(date).format('HH:mm'), //tweaked
        dateString: Moment(date).format('Do MMM YYYY, h:mm a'), //added
      });
      return true;
    } else {
      Alert.alert('Error', 'Unexpected Error Occured', [
        {text: 'Try again later'},
      ]);
      return false;
    }
  }
};

const handleSubmitMedication = async (date, selectedMedicationList) => {
  for (let x of selectedMedicationList) {
    x.recordDate = Moment(date).format('DD/MM/YYYY HH:mm:ss');
  }

  if (await medicationAddLogRequest(selectedMedicationList)) {
    let med_data = await getLastMedicationLog();

    if (
      med_data === null ||
      Moment(date).format('YYYY/MM/DD') > med_data.date ||
      (Moment(date).format('YYYY/MM/DD') === med_data.date &&
        Moment(date).format('HH:mm') > med_data.hour)
    ) {
      storeLastMedicationLog({
        value: selectedMedicationList,
        date: Moment(date).format('YYYY/MM/DD'),
        hour: Moment(date).format('HH:mm'), //tweaked
        dateString: Moment(date).format('Do MMM YYYY, h:mm a'), //added
      });
    }

    return true;
  } else {
    Alert.alert('Error', 'Unexpected Error Occured', [
      {text: 'Try again later'},
    ]);
    return false;
  }
};

const handleSubmitWeight = async (date, weight) => {
  if (checkWeight(weight)) {
    let formatDate = Moment(date).format('DD/MM/YYYY HH:mm:ss');
    if (await weightAddLogRequest(Number(weight), formatDate)) {
      let weight_data = await getLastWeightLog();
      if (weight_data != null) {
        if (
          Moment(date).format('YYYY/MM/DD') > weight_data.date ||
          (Moment(date).format('YYYY/MM/DD') === weight_data.date &&
            Moment(date).format('HH:mm') > weight_data.hour)
        ) {
          storeLastWeightLog({
            value: weight,
            date: Moment(date).format('YYYY/MM/DD'),
            hour: Moment(date).format('HH:mm'), //tweaked
            dateString: Moment(date).format('Do MMM YYYY, h:mm a'), //added
          });
        }
      } else {
        storeLastWeightLog({
          value: weight,
          date: Moment(date).format('YYYY/MM/DD'),
          hour: Moment(date).format('HH:mm'), //tweaked
          dateString: Moment(date).format('Do MMM YYYY, h:mm a'), //added
        });
      }

      return true;
    } else {
      Alert.alert('Error', 'Unexpected Error Occured ', [
        {text: 'Try Again Later'},
      ]);
      return false;
    }
  }
};

const renderUncompleteLogText = (
  uncompleteMorningLog,
  uncompleteAfternoonLog,
  periodName,
  type,
) => {
  if (periodName === afternoonObj.name) {
    if (uncompleteMorningLog.includes(type)) {
      return 'Incomplete for Morning';
    }
  }

  if (periodName === eveningObj.name) {
    let noMorning = uncompleteMorningLog.includes(type);
    let noAfternoon = uncompleteAfternoonLog.includes(type);
    let both =
      uncompleteMorningLog.includes(type) &&
      uncompleteAfternoonLog.includes(type);
    if (both) {
      return 'Incomplete for Morning & Afternoon';
    } else if (noMorning) {
      return 'Incomplete for Morning';
    } else if (noAfternoon) {
      return 'Incomplete for Afternoon';
    }
  }
  return '';
};

export {
  bg_key,
  food_key,
  med_key,
  weight_key,
  activity_key,
  step_key,
  min_bg,
  renderLogIcon,
  renderLogIconNavy,
  renderLogIconWhite,
  isToday,
  isPeriod,
  checkLogDone,
  checkBloodGlucose,
  checkWeight,
  checkBloodGlucoseText,
  checkWeightText,
  checkDosageText,
  checkDosage,
  checkRepeatMedicine,
  handleSubmitBloodGlucose,
  handleSubmitMedication,
  handleSubmitWeight,
  dateFrom2dayLog,
  renderUncompleteLogText,
};
//edit flag
