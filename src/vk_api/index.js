export const client_id = 5899859;

//const api_key = "API_KEY";
import fetchJsonp from "fetch-jsonp";
import _ from 'lodash';

function api_key() { return localStorage.token; }
const endpoint = "https://api.vk.com";
const OAuthEndpoint = "https://oauth.vk.com/authorize?";
export const redirect_uri = "https://vknetworking-8c4dd.firebaseapp.com/auth";

function baseMethod(method) {
  return `${endpoint}/method/${method}?access_token=${api_key()}`
}

function paramsToString(params) {
  let res = '&';
  _.forEach(params, (value, key) => {
    if (value || value === 0) res += `${key}=${value}&`;
  });
  return res;
}

export function buildGetMembersUrl(params) {
  // sex=1: female
  // console.log(baseMethod('users.search') + paramsToString(params) + '&count=1000&fields=photo_max,first_name,last_name&online=0');
  return baseMethod('users.search') + paramsToString(params) + '&count=1000&fields=photo_max,first_name,last_name&online=0';
  // hometown?
}

export function buildGetCountries() {
  return baseMethod('database.getCountries');
}

export function buildGetCities(params) {
  // console.log(baseMethod('database.getCities') + paramsToString(params));
  return baseMethod('database.getCities') + paramsToString(params);
}

export function buildGetSubscriptions(params) {
  // console.log(baseMethod('users.getSubscriptions') + paramsToString(params) + '&extended=0');
  return baseMethod('users.getSubscriptions') + paramsToString(params) + '&extended=0';
}

export function buildGetCountriesByCode(params) {
  // console.log(baseMethod('database.getCountries') + paramsToString(params));
  return baseMethod('database.getCountries') + paramsToString(params);
}

export function buildGetUser(params) {
  // console.log(baseMethod('users.get') + paramsToString(params));
  return baseMethod('users.get') + paramsToString(params);
}

export function buildVkAuthUrl({client_id, scope = "groups", redirect_uri = window.location.origin + '/auth', display = "page", v = "5.626", response_type = "token"}) {
  return `${OAuthEndpoint}client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}&display=${display}&v=${v}&response_type=${response_type}`
}

export function getUserName(profileLink) {
  if (!profileLink) {
    profileLink = localStorage.getItem('lastLoginUserId')
  }
  const id = parseInt(profileLink) || parseInt(profileLink.split('id')[1]);
  const link = profileLink.split('vk.com/')[1];
  return id ? id : link ? link : profileLink;
}

export function fetchUser({user_ids}) {
  return fetchJsonp(buildGetUser({user_ids}))
    .then(response => response.json())
    .then(json => {
      logError(json);
      if (json.response) {
        return json.response[0];
      }
      return [];
    });
}

export function fetchCountries({code = null} = {}) {
  return fetchJsonp(code ? buildGetCountriesByCode({code}) : buildGetCountries())
    .then(response => response.json())
    .then(json => {
      logError(json);
      if (json.response) {
        return json.response;
      }
      return _.toArray(json);
    });
}

export function checkAuthError(array) {
  return array[0].error_code === 5;
}

export function fetchCities({country_id = 1, q = "", need_all = 0, count = 100}) {
  return fetchJsonp(buildGetCities({country_id, q, need_all, count}))
    .then(response => response.json())
    .then(json => {
      logError(json);
      if (json.response) {
        return json.response;
      }
      return [];
    });
}

export function fetchGroups({user_id}) {
  // return Promise.resolve(
  //   JSON.parse("MOCK_DATA")
  // ).then(data => data);
  return fetchJsonp(buildGetSubscriptions({user_id}))
  .then(response => response.json())
  .then(json => {
    logError(json);
    if (json.response) {
      const res = json.response.groups.items;
      return res ? res : [];
    }
    return [];
  });
}

function logError(json) {
  if (json.error) {
    console.error(json);
  }
}

export function fetchMembers({q, group_id, country, city, sex = 0, age_from, age_to, hometown, has_photo}) {
  return fetchJsonp(buildGetMembersUrl({q, country, group_id, city, sex, age_from, age_to, hometown, has_photo}))
    .then(response => response.json())
    .then(json => {
      logError(json);
      if (json.response) {
        json.response.shift();
        return json.response;
      }
      return [];
    });
}
