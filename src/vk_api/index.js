export const client_id = 5899859;

import fetchJsonp from "fetch-jsonp";
import _ from "lodash";

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
  console.log(baseMethod('users.search') + paramsToString(params) + '&count=1000&fields=photo_max,first_name,last_name&online=0');
  return baseMethod('users.search') + paramsToString(params) + '&count=1000&fields=photo_max,first_name,last_name&online=0&sort=0';
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
  // return baseMethod('users.getSubscriptions') + paramsToString(params) + '&extended=0';
  return baseMethod('groups.get') + paramsToString(params) + '&extended=0';
}

export function buildGetCountriesByCode(params) {
  // console.log(baseMethod('database.getCountries') + paramsToString(params));
  return baseMethod('database.getCountries') + paramsToString(params);
}

export function buildGetUser(params) {
  // console.log(baseMethod('users.get') + paramsToString(params));
  return baseMethod('users.get') + paramsToString(params);
}

export function buildVkAuthUrl({scope = "groups", display = "page", v = "5.626", response_type = "token"}) {
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
  //   JSON.parse("[4325149,30666517,66170841,27211409,77270571,97408246,16466790,45454285,54530371,42013162,63066646,136372935,91933860,128481735,112005188,46638176,60684683,96047932,30775488,83547547,126188798,86905866,29740811,62625657,119425878,28076056,27667725,32465350,101522128,51236599,55614321,28302704,36315046,3967881,122776382,61440523,34616083,97689542,46495134,100401854,25616872,33603301,89558999,23995866,67256178,124116417,51216202,30597807,79473076,61226939,87771822,42523284,36326524,99215308,91304139,65688570,28457642,30619123,101541636,29537720,81956710,54319981,34724138,44955915,36837512,37615994,58267631,83776680,35634642,30321428,28636332,26929408,27683540,41057556,40520174,130654112,116863980,109302706,95589554,69843850,51592339,42020877,128188034,35052469,79138567,78863628,91635769,99198691,29591008,24578222,55098695,26356004,1672730,20629724,10839812,24507496,26071073,26140698,27711883,27801913,30078854,39687507,41016919,45994531,67528877]")
  // ).then(data => data);
  return fetchJsonp(buildGetSubscriptions({user_id}))
  .then(response => response.json())
  .then(json => {
    logError(json);
    console.log(json);
    if (json.response) {
      // const res = json.response.groups.items;
      const res = json.response;
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

export function fetchMembers({q, group_id, country, city, sex = 0, age_from, age_to, hometown, has_photo = 1}) {
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
