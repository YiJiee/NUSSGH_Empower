import {medplanAdd} from './urls';
import {getToken} from '../storage/asyncStorageFunctions';
import {Alert} from 'react-native';
import moments from 'moment';

const prepareData = (data) => {
  let objArr = [];
  let finalArr = [];
  for (var x of Object.keys(data)) {
    for (var y of data[x].medicationList) {
      let obj = {
        dosage_unit: y.unit,
        date_list: [x],
        dosage: y.dosage,
        medication: y.drugName,
        per_day: y.perDay,
      };
      objArr.push(obj);
    }
  }
  console.log('----preparing data for api call to post medication plan');
  for (var x of objArr) {
    for (var y of objArr) {
      if (y.medication === x.medication) {
        x.date_list = x.date_list.concat(y.date_list).unique();
      }
    }
  }
  finalArr = objArr.filter(
    (v, i, a) => a.findIndex((t) => t.medication === v.medication) === i,
  );
  console.log(finalArr);
  return finalArr;
};

Array.prototype.unique = function () {
  var a = this.concat();
  for (var i = 0; i < a.length; ++i) {
    for (var j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) a.splice(j--, 1);
    }
  }

  return a;
};

const postPlan = async (data) => {
  try {
    let response = await fetch(medplanAdd, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + (await getToken()),
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        plans: data,
      }),
    });
    console.log('body');
    console.log(
      JSON.stringify({
        plans: data,
      }),
    );
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    //console.error(error);
    Alert.alert('Error', 'Account already has existing med plan', [
      {text: 'Got It'},
    ]);
  }
};

const getMedication4DateRange = async (start, end) => {
  const string = medplanAdd + '?start=' + start + '&end=' + end;
  try {
    let response = await fetch(string, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + (await getToken()),
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
    });
    let responseJson = await response.json();
    console.log('get medication for date range : ' + responseJson);
    return responseJson;
  } catch (error) {
    Alert.alert('Network Error', 'Try Again Later', [{text: 'Got It'}]);
  }
};

const getMed4CurrentMonth = async () => {
  let today = new Date();
  let lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  let start = moments(today).format('YYYY-MM-01');
  let end = moments(lastDayOfMonth).format('YYYY-MM-DD');

  let data = await getMedication4DateRange(start, end);
  if (data != null) {
    return data;
  } else {
    return {};
  }
};

export {prepareData, postPlan, getMedication4DateRange, getMed4CurrentMonth};
