import {getToken, getRole} from '../storage/asyncStorageFunctions';
import {profile, caregiverProfile} from './urls';
import {role_patient} from '../commonFunctions/common';

//patient
const getPatientProfile = async () => {
  try {
    let response = await fetch(profile, {
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
    return 'Error';
  }
};

//caregiver
const getCaregiverProfile = async () => {
  try {
    let response = await fetch(caregiverProfile, {
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
    return 'Error';
  }
};

//both
const editName = async (firstName) => {
  let role = await getRole();
  try {
    let link = '';
    if (role === role_patient) {
      link = profile;
    } else {
      link = caregiverProfile;
    }
    let response = await fetch(link, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + (await getToken()),
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        first_name: firstName,
      }),
    });

    let responseJson = await response.json();
    console.log(responseJson);
    return true;
  } catch (error) {
    return false;
  }
};

const editPhonNum = async (phoneNum, token) => {
  let role = await getRole();
  try {
    let link = '';
    if (role === role_patient) {
      link = profile;
    } else {
      link = caregiverProfile;
    }
    let response = await fetch(link, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        contact_number: phoneNum,
      }),
    });
    let responseJson = await response.json();
    console.log(responseJson);
    return true;
  } catch (error) {
    return false;
  }
};

export {getPatientProfile, editName, editPhonNum, getCaregiverProfile};
