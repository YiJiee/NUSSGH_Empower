import moment from 'moment';
import {
  morningObj,
  afternoonObj,
  eveningObj,
  getGreetingFromHour,
} from './common';
import {getMedication4Day} from '../netcalls/requestsLog';

const maxCarbs = 150; //grams
const maxProtein = 112; //grams
const maxFats = 50; //grams
const maxCalBurnt = 500;
const maxSteps = 7000;
const maxDuration = 150; //min

const getDateObj = (dateString) => {
  let dateMomentObject = moment(dateString, 'DD/MM/YYYY HH:mm:ss');
  let dateObject = dateMomentObject.toDate();

  return dateObject;
};

//24hr
const getTime = (dateString) => {
  if (dateString != null) {
    let time = dateString.substring(
      dateString.indexOf('2020') + 4,
      dateString.length - 3,
    );
    return time;
  }
};

const getTime12hr = (dateString) => {
  let date = moment(getDateObj(dateString));
  return date.format('h:mm a');
};

const getHour = (dateString) => {
  if (dateString != null) {
    let timeString = getTime(dateString);
    let hourString = timeString.substring(0, 4).trim().replace(/[:]/, '');
    return Number(hourString);
  }
};

const getDateRange = (value, fromDate) => {
  let startDate = moment(fromDate).subtract(value, 'days');
  return getDateArray(startDate.toDate(), fromDate);
};

const getDateArray = (startDate, stopDate) => {
  let dateArr = new Array();
  let current = moment(startDate);
  let stop = moment(stopDate);
  while (current <= stop) {
    dateArr.push(moment(current).format('YYYY-MM-DD'));
    current = moment(current).add(1, 'days');
  }

  return dateArr;
};

//pass a food item - beverage, main etc in to get [carbs, protein, fats] count
const getNutrientCount = (array) => {
  let nutrientArr = new Array();
  let totalCarbs = 0;
  let totalProtein = 0;
  let totalFats = 0;
  if (array.length != 0) {
    for (var a of array) {
      if (a != null) {
        let carbsAmount = a?.nutrients.carbohydrate.amount;
        let proteinAmount = a?.nutrients.protein.amount;
        let fatAmount = a?.nutrients['total-fat']?.amount;
        if (carbsAmount != 'N.A') {
          totalCarbs += Number(carbsAmount) * Number(a.quantity);
        }
        if (proteinAmount != 'N.A') {
          totalProtein += Number(proteinAmount) * Number(a.quantity);
        }
        if (fatAmount != 'N.A') {
          totalFats += Number(fatAmount) * Number(a.quantity);
        }
      }
    }
  }
  nutrientArr.push(totalCarbs);
  nutrientArr.push(totalProtein);
  nutrientArr.push(totalFats);
  return nutrientArr;
};

//checking whether medication taken for day === medication in plan
const checkMedTaken4Day = async (medLog, date) => {
  let date_toCheck = moment(date).format('YYYY-MM-DD');
  let medList = await getMedication4Day(date_toCheck);
  let today_medList = medList[date_toCheck];

  //check if for each type med, total dosage for day === planned for day
  for (var i of today_medList) {
    let planned_med = i.medication;
    let planned_dosage = i.per_day * i.dosage;
    for (var x of medLog) {
      if (x.medication === planned_med) {
        let count = 0;
        for (var j of medLog) {
          if (j.medication === planned_med) {
            count += j.dosage;
          }
        }
        console.log(
          'For ' +
            x.medication +
            ' count ' +
            count +
            ' vs planned: ' +
            planned_dosage,
        );
        if (count < planned_dosage) {
          return false;
        }
      }
    }
  }

  if (getMedNames(medLog).length < today_medList.length) {
    return false;
  }

  return true;
};

const getMedNames = (arr) => {
  let list = [];
  let finalList = []; //get unique
  for (var x of arr) {
    list.push(x.medication);
  }
  finalList = list.filter((v, i, a) => a.findIndex((t) => t === v) === i);
  return finalList;
};

const getMedDonePeriods = (medLogs) => {
  let list = [];
  let finalList = [];
  for (var x of medLogs) {
    list.push(getGreetingFromHour(getHour(x.record_date)));
  }
  finalList = list.filter((v, i, a) => a.findIndex((t) => t === v) === i);
  return finalList;
};

const filterMorning = (logs) => {
  let list = new Array();
  for (var i of logs) {
    let date = i.record_date;
    let hour = getHour(date);
    if (hour >= morningObj.start && hour < morningObj.end) {
      list.push(i);
    }
  }
  return list;
};

const filterAfternoon = (logs) => {
  let list = new Array();
  for (var i of logs) {
    let date = i.record_date;
    let hour = getHour(date);
    if (hour >= afternoonObj.start && hour < afternoonObj.end) {
      list.push(i);
    }
  }
  return list;
};

//cannot filter based on just hours * will get erro
const filterEvening = (logs) => {
  let list = new Array();
  for (var i of logs) {
    let date = i.record_date;
    let hour = getHour(date);
    let greeting = getGreetingFromHour(hour);
    if (greeting === eveningObj.name) {
      list.push(i);
    }
  }
  return list;
};

//determine if edit button will show
const showEdit = (dateToCompare) => {
  let today = moment(new Date()).format('DD/MM/YYYY');
  let formatedDate = String(dateToCompare).substring(
    0,
    String(dateToCompare).indexOf('2020') + 4,
  );
  if (String(today) === String(formatedDate)) {
    return true;
  } else {
    return false;
  }
};

const getMissedArr = (morningLog, afternoonLog, eveningLog) => {
  let list = [];
  if (morningLog.length === 0) {
    list.push(morningObj.name);
  }
  if (afternoonLog.length === 0) {
    list.push(afternoonObj.name);
  }
  if (eveningLog.length === 0) {
    list.push(eveningObj.name);
  }

  return list;
};

const renderGreetingText = (arr) => {
  let string = '';
  if (arr.length === 3) {
    for (var i = 0; i < arr.length; i++) {
      if (i === 2) {
        string += 'and ' + arr[i] + '.';
        return string;
      }
      string += arr[i] + ', ';
    }
  } else if (arr.length === 2) {
    string = arr[0] + ' and ' + arr[1] + '.';
  } else {
    string = arr[0] + '.';
  }
  return string;
};

//since backend dont delete the actual food log, check if all food items in logs is 0
function checkFoodLogQuantity(logs) {
  for (var x of logs) {
    for (var y of x.foodItems) {
      if (y.quantity != 0) {
        return false;
      }
    }
  }
  return true;
}

export {
  maxCarbs,
  maxProtein,
  maxFats,
  maxCalBurnt,
  maxSteps,
  maxDuration,
  getDateObj,
  getDateArray,
  getTime,
  getHour,
  getDateRange,
  getNutrientCount,
  checkMedTaken4Day,
  getMedDonePeriods,
  filterMorning,
  filterAfternoon,
  filterEvening,
  showEdit,
  getMissedArr,
  renderGreetingText,
  checkFoodLogQuantity,
  getTime12hr,
};
