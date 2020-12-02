import {
  requestOTP,
  verifyOTP,
  postNewPassword,
  requestOTP_C,
  verifyOTP_C,
  postNewPassword_C,
} from './urls';
import {getRole} from '../storage/asyncStorageFunctions';
import {role_patient} from '../commonFunctions/common';

const sendOTPRequest = async (phoneNumber, selection) => {
  let role = await getRole();
  let link = '';
  try {
    if (role === role_patient || selection === role_patient) {
      link = requestOTP;
    } else {
      link = requestOTP_C;
    }
    let response = await fetch(link, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: String(phoneNumber),
      }),
    });
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    return 'Unexpected Network Error';
  }
};

const verifyOTPRequest = async (phoneNumber, otp, selection) => {
  let role = await getRole();
  let link = '';
  try {
    if (role === role_patient || selection === role_patient) {
      link = verifyOTP;
    } else {
      link = verifyOTP_C;
    }
    let response = await fetch(link, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: String(phoneNumber),
        code: otp,
      }),
    });
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    return 'Unexpected Network Error Occured.';
  }
};

const resetPassword = async (password, token, selection) => {
  let role = await getRole();
  let link = '';
  try {
    if (role === role_patient || selection === 'patient') {
      link = postNewPassword;
    } else {
      link = postNewPassword_C;
    }
    console.log('resetting password---');
    console.log(selection);
    let response = await fetch(link, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        newPassword: password,
      }),
    });
    let responseJson = await response.json();
    console.log(responseJson);
    return true;
  } catch (error) {
    return false;
  }
};

export {sendOTPRequest, verifyOTPRequest, resetPassword};
