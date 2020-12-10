import {
  searchCaregiver,
  assignCaregiver,
  getCaregiver,
  pendingCaregiverReq,
  patientCode,
  sendCaregiverReq,
} from './urls';
import {getToken} from '../storage/asyncStorageFunctions';

const getMyCaregiver = async () => {
  try {
    let response = await fetch(getCaregiver, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + (await getToken()),
        'Content-type': 'application/json',
      },
    });
    let responseJson = await response.json();
    console.log(responseJson);
    return responseJson;
  } catch (error) {
    console.error(error);
  }
  return null;
};

const getPendingReq = async () => {
  console.log('-------getting pending req');
  try {
    let response = await fetch(pendingCaregiverReq, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + (await getToken()),
        'Content-type': 'application/json',
      },
    });

    let status = response.status;
    let responseJson = await response.json();

    return {response: responseJson, status: status};
  } catch (error) {
    console.error(error);
  }
  return null;
};

const getCode = async () => {
  try {
    let response = await fetch(patientCode, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + (await getToken()),
        'Content-type': 'application/json',
      },
    });
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.error(error);
  }
  return null;
};

const validateCode = async (code) => {
  let link = patientCode + '/' + code;
  try {
    let response = await fetch(link, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + (await getToken()),
        'Content-type': 'application/json',
      },
    });
    let responseJson = await response.json();
    let status = await response.status;

    return {response: responseJson, status: status};
  } catch (error) {
    console.error(error);
  }
  return null;
};

const sendReqPermission = async (obj) => {
  try {
    let response = await fetch(sendCaregiverReq, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + (await getToken()),
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        patient: String(obj.patient),
        permissions: obj.permissions,
      }),
    });
    let status = await response.status;
    console.log(status);
    return status;
  } catch (error) {
    console.error(error);
  }
  return null;
};

const rejectPendingCaregiver = async () => {
  try {
    let response = await fetch(pendingCaregiverReq, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + (await getToken()),
        'Content-type': 'application/json',
      },
    });
    let status = await response.status;
    let rsp = await response.json();
    console.log(rsp);
    return status;
  } catch (error) {
    console.error(error);
  }
  return null;
};

const acceptPendingCaregiver = async () => {
  try {
    let response = await fetch(pendingCaregiverReq, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + (await getToken()),
        'Content-type': 'application/json',
      },
    });
    let status = response.status;
    let rsp = await response.json();
    console.log(rsp);
    return status;
  } catch (error) {
    console.error(error);
  }
  return null;
};

const unassignCaregiver = async () => {
  try {
    let response = await fetch(getCaregiver, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + (await getToken()),
        'Content-type': 'application/json',
      },
    });
    let status = await response.status;
    return status;
  } catch (error) {
    console.error(error);
  }
  return null;
};

const patientSetPermission = async (arr) => {
  try {
    let response = await fetch(getCaregiver, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + (await getToken()),
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        permissions: arr,
      }),
    });
    let status = await response.status;
    return status;
  } catch (error) {
    console.error(error);
  }
  return null;
};

export {
  getMyCaregiver,
  unassignCaregiver,
  getPendingReq,
  getCode,
  validateCode,
  sendReqPermission,
  rejectPendingCaregiver,
  acceptPendingCaregiver,
  patientSetPermission,
};
