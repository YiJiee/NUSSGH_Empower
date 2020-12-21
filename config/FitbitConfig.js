import {appRootUrl} from './AppConfig';

const Buffer = require('buffer/').Buffer;

const fitbitOAuthUri = "https://www.fitbit.com/oauth2/authorize";
const redirect_uri = appRootUrl + "oauth2-callback/fitbit";
const client_id = "22BVZ4";
const oAuthClientSecret = "81a05f0d421e7498f848bbb2ca11ad3b";
const scope = "profile activity heartrate location nutrition weight settings sleep social"; // all except profile

function base64URLEncode(buff) {
    return buff.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

const fitbitTokenUri = 'https://api.fitbit.com/oauth2/token';
const authorisationHeader = base64URLEncode(Buffer.from(client_id + ":" + oAuthClientSecret, 'utf8'));

export {fitbitOAuthUri, redirect_uri, client_id, oAuthClientSecret, scope, fitbitTokenUri, authorisationHeader, base64URLEncode};
