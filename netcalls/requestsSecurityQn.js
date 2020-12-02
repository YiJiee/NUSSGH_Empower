import {getToken} from '../storage/asyncStorageFunctions';
import {
  get_authSecurityQn,
  authSecurityQnAns,
  authSecurityQn,
  verify_authSecurityQn,
} from './urls';

const getQuestions = async () => {
  try {
    let response = await fetch(get_authSecurityQn, {
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
    console.error(error);
  }
};

const setSecurityQn = async (obj) => {
  try {
    let response = await fetch(authSecurityQnAns, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + (await getToken()),
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(obj),
    });
    let status = response.status;
    return status;
  } catch (error) {
    console.error(error);
  }
};

const getSecurityQnByUsername = async (username) => {
  let link = authSecurityQn + '/' + username;
  try {
    let response = await fetch(link, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + (await getToken()),
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
    });
    let status = response.status;
    let json = await response.json();
    return {status: status, qnList: json};
  } catch (error) {
    console.error(error);
  }
};

const verifySecurityAns = async (obj, username) => {
  try {
    let response = await fetch(verify_authSecurityQn, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + (await getToken()),
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        answers: obj,
      }),
    });
    let status = response.status;
    let json = await response.json();
    return {status: status, token: json?.token, role: json?.role};
  } catch (error) {
    console.error(error);
  }
};

export {
  getQuestions,
  setSecurityQn,
  getSecurityQnByUsername,
  verifySecurityAns,
};
