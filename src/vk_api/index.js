export const client_id = 5899859;

import fetchJsonp from "fetch-jsonp";
import _ from "lodash";

function api_key() { return localStorage.token; }
const endpoint = "https://api.vk.com";
const OAuthEndpoint = "https://oauth.vk.com/authorize?";
const profileFields = 'fields=photo_max,first_name,last_name';
const countAndOnline = 'count=1000&online=0';
export const redirect_uri = "https://vk-networking.firebaseapp.com/auth";

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
  console.log(baseMethod('users.search') + paramsToString(params) + `${countAndOnline}&` + profileFields);
  return baseMethod('users.search') + paramsToString(params) + `${countAndOnline}&sort=0&` + profileFields;
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
  return baseMethod('groups.get') + paramsToString(params);
}

export function buildGetMembers(params) {
  // filter=friends
  console.log(baseMethod('groups.getMembers') + paramsToString(params) + `&${profileFields}`);
  return baseMethod('groups.getMembers') + paramsToString(params) + `&${profileFields}`
}

export function buildGroupById(params) {
  return baseMethod('groups.getById') + paramsToString(params) + '&fields=name,photo'
}

export function executeGetFriends(testData) {
  const s = 'var f=\"photo_50,first_name,last_name\";return[';
  let loop = testData.map(id => {
    return `[${id},API.groups.getMembers({\"group_id\":${id},\"filter\":\"friends\",\"fields\":f})]`
  });
  const e = "];";
  return execute(s + loop + e);
}

export function executeGetGroupInfo(testData) {
  const c = 'var gr=\"name,photo\";return[';
  let loop = testData.map(id => {
    return `API.groups.getById({\"group_id\":${id},\"fields\":gr})`
  });
  const e = "];";
  return execute(c + loop + e);
}

export function execute(code) {
  return baseMethod('execute') + "&code=" + encodeURI(code);
}

export function buildGetCountriesByCode(params) {
  // console.log(baseMethod('database.getCountries') + paramsToString(params));
  return baseMethod('database.getCountries') + paramsToString(params);
}

export function buildGetUser(params) {
  // console.log(baseMethod('users.get') + paramsToString(params));
  return baseMethod('users.get') + paramsToString(params);
}

export function buildFriendsGet(params) {
  return baseMethod('friends.get') + paramsToString(params) + '&count=10000'
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
      return json.response ? json.response[0] : [];
    });
}

export function fetchGroupById(params) {
  // group_id, groups_id
  return fetchJsonp(buildGroupById(params))
    .then(response => response.json())
    .then(json => {
      logError(json);
      return json.response ? json.response : [];
    });
}

export function fetchExecuteGetFriendsInGroup({items}) {
  return fetchJsonp(executeGetFriends(items))
    .then(response => response.json())
    .then(json => {
      logError(json);
      return json.response ? json.response : [];
    });
}

export function fetchExecuteGetGroupInfo({items}) {
  return fetchJsonp(executeGetGroupInfo(items))
    .then(response => response.json())
    .then(json => {
      logError(json);
      return json.response ? json.response : [];
    });
}

export function fetchFriends({user_id}) {
  return fetchJsonp(buildFriendsGet({user_id}))
    .then(response => response.json())
    .then(json => {
      logError(json);
      return json.response ? json.response : [];
    })
}

export function fetchGroupMembers({group_id, filter}) {
  return fetchJsonp(buildGetMembers({group_id, filter}))
    .then(response => response.json())
    .then(json => {
      logError(json);
      if (json.response) {
        const {items} = json.response;
        return items ? items : [];
      }
      return [];
    })
}

export function fetchCountries({code = null} = {}) {
  return fetchJsonp(code ? buildGetCountriesByCode({code}) : buildGetCountries())
    .then(response => response.json())
    .then(json => {
      logError(json);
      return json.response ? json.response : _.toArray(json);
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
      return json.response ? json.response : [];
    });
}

export function fetchGroups({user_id}) {
  // return Promise.resolve(
  //   JSON.parse("[0]")
  // ).then(data => data);
  return fetchJsonp(buildGetSubscriptions({user_id}))
    .then(response => response.json())
    .then(json => {
      logError(json);
      return json.response ? json.response : [];
    });
}

function logError(json) {
  if (json.error) {
    console.error(json);
  }
}

export function fetchMembers({q, group_id, offset = 0, country, city, sex = 0, age_from, age_to, hometown, has_photo = 1}) {
  return fetchJsonp(buildGetMembersUrl({
    q,
    offset,
    country,
    group_id,
    city,
    sex,
    age_from,
    age_to,
    hometown,
    has_photo
  }))
    .then(response => response.json())
    .then(json => {
      logError(json);
      if (json.response) {
        json.response.count = json.response[0];
        json.response.shift();
        return json.response;
      }
      return [];
    });
}
