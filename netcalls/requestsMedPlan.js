import {medPlan} from './urls';
import {getToken} from '../storage/asyncStorageFunctions';
import {Alert} from 'react-native';
import moments from 'moment';
import {dayList} from '../commonFunctions/medicationFunction';

//re-format the days attribute in the obj, only add when selected==true
const prepareData = (data) => {
  for (var x of data) {
    let days = [];
    for (var y of x.days) {
      if (y.selected) {
        days.push(y.value);
      }
    }
    x.days = days;
  }
  console.log('----preparing data for api call to post medication plan');

  return data;
};

//re-format the days attribute when retrieve from api
const prepareDataFromAPI = (data) => {
  let arr = [];
  for (var x of data) {
    let dayArr = JSON.parse(JSON.stringify(dayList));
    for (var y of x?.days) {
      for (var z of dayArr) {
        if (z.value === y) {
          z.selected = true;
        }
      }
    }
    x.days = dayArr;
    arr.push(x);
  }
  return arr;
};

const postPlan = async (data) => {
  try {
    let response = await fetch(medPlan, {
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
    console.log(response.status);
    return response.status;
  } catch (error) {
    console.error(error);
  }
};

const getMedication4DateRange = async (start, end) => {
  const string = medPlan + '?start=' + start + '&end=' + end;
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

const deleteMedPlan = async (id) => {
  try {
    let response = await fetch(medPlan, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + (await getToken()),
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        plans: [id],
      }),
    });
    return response.status;
  } catch (error) {
    Alert.alert('Network Error', 'Try Again Later', [{text: 'Got It'}]);
  }
};

const getPlan = async (startDateString, endDateString) => {
  let response = await fetch(
    medPlan + '/by-date' + `?start=${startDateString}&end=${endDateString}`,
    {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + (await getToken()),
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
    },
  );
  let responseJson = await response.json();
  return responseJson;
};

const getCompletePlan = async () => {
  try {
    let response = await fetch(medPlan, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + (await getToken()),
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
    });
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    Alert.alert('Network Error', 'Try Again Later', [{text: 'Got It'}]);
  }
};

export {
  prepareData,
  postPlan,
  getPlan,
  getMedication4DateRange,
  getMed4CurrentMonth,
  deleteMedPlan,
  getCompletePlan,
  prepareDataFromAPI,
};
