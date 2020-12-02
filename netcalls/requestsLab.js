import {getLab} from './urls';
import {getToken} from '../storage/asyncStorageFunctions';

const getLabResults = async (date) => {
  let newDate = date + '-01';
  let link = getLab + '/' + newDate;
  try {
    let response = await fetch(link, {
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

export {getLabResults};
