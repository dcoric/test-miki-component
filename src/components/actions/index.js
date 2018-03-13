import axios from 'axios';
import { AUTH_USER, UNAUTH_USER, AUTH_ERROR, REQUEST_SENT, RESPONSE_RECEIVED } from './types';
import { REFRESH_TOKEN, TOKEN, TOKEN_EXPIRES, LOGOUT_COOKIE } from '../helper/constants';

import * as cookieActions from '../helper/cookie';

let url;
export function setUrl (u) {
  return function (dispatch) {
    url = u;
  };
}

function paramSerializer (obj) {
  var str = '';
  for (var key in obj) {
    if (str !== '') {
      str += '&';
    }
    str += key + '=' + obj[key];
  }
  return str;
}
export function signinUser ({ email, password, rememberMe }) {
  return function (dispatch) {
    dispatch({type: REQUEST_SENT});
    // const requestURL = `grant_type=password&username=customer:${email}&password=${password}&client_id=oss_web&client_secret=NpJ2mdewxPGV`;
    // submit email-pass
    var config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Platform': 'oss web'
      }
    };

    let storage = sessionStorage;
    if (rememberMe) {
      storage = localStorage;
    }
    axios.post(`${url}`,
      paramSerializer({
        username: `customer:${email}`,
        password: password,
        grant_type: 'password',
        client_id: 'oss_web',
        client_secret: 'NpJ2mdewxPGV'
      }),
      config)
      .then(response => {
      // on ok update to authenticated
        dispatch({type: AUTH_USER, token: response.data.access_token});
        dispatch({type: RESPONSE_RECEIVED});
        storage.setItem(TOKEN, response.data.access_token);
        storage.setItem(REFRESH_TOKEN, response.data.refresh_token);
        storage.setItem(TOKEN_EXPIRES, new Date().getTime() + response.data.expires_in);

        var expiration = new Date();
        expiration.setDate(expiration.getDate() + 1000);
        cookieActions.saveCookie(LOGOUT_COOKIE, 'true', expiration, '.groundlink.com');
      })
      .catch(error => {
      // show an error on bad request
        dispatch({type: AUTH_ERROR, payload: error.response.data.message});
        dispatch({type: RESPONSE_RECEIVED});
        console.log(error);
      });
  };
}

export function signoutUser () {
  console.log('dfakdsfasdflkasdks');
  localStorage.removeItem(TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
  localStorage.removeItem(TOKEN_EXPIRES);
  sessionStorage.removeItem(TOKEN);
  sessionStorage.removeItem(REFRESH_TOKEN);
  sessionStorage.removeItem(TOKEN_EXPIRES);
  var expiration = new Date();
  expiration.setDate(expiration.getDate() + 1000);
  cookieActions.saveCookie(LOGOUT_COOKIE, 'true', expiration, '.groundlink.com');
  return {
    type: UNAUTH_USER
  };
}
