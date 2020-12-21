import {inappNotifEndpoint} from "../urls";
import {getToken} from "../../storage/asyncStorageFunctions";

async function getInAppNotifications() {
    let resp = await fetch(inappNotifEndpoint, {
       method: 'GET',
       headers: {
           Accept: 'application/json',
           'Content-type': 'application/json',
           Authorization: `Bearer ${await getToken()}`
       }
    });

    if (resp.status === 200) {
        return await resp.json();
    } else {
        return [];
    }
}

export {getInAppNotifications};
