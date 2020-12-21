import {authorisationHeader, client_id, fitbitTokenUri, redirect_uri} from '../config/FitbitConfig';
import {postFitbitToken} from '../netcalls/fitbitEndpoints/tokenRequests';

const qs = require('qs');

export function AuthoriseFitbit(callback_url) {
    const params = callback_url.split(redirect_uri + "?")[1];
    const codeResponse = qs.parse(params);
    const authorisationCode = codeResponse['code'].replace(/(_|=|#)/g, '');
    // Make call to get tokens
    return fetch(fitbitTokenUri, {
        method: "POST",
        headers: {
            Authorization: "Basic " + authorisationHeader,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: qs.stringify({
            clientId: client_id,
            grant_type: 'authorization_code',
            redirect_uri,
            code: authorisationCode
        })
    }).then(resp => resp.json())
        .then(data => {
            return postFitbitToken(data);
        }).catch(err => alert(err.message));
}
