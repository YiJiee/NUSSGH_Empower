import {getAppointment} from './urls';

const {getToken} = require('../storage/asyncStorageFunctions');

const getAppointments = async () => {
  try {
    let response = await fetch(getAppointment, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + (await getToken()),
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
    });
    let json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};

export {getAppointments};
