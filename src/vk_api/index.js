// @flow
import fetchJsonp from 'fetch-jsonp';
import _ from 'lodash';

export const client_id = 5899859;

function api_key() {
  return localStorage.token;
}
const endpoint = 'https://api.vk.com';
const OAuthEndpoint = 'https://oauth.vk.com/authorize?';
const profileFields = 'fields=photo_max,first_name,last_name';
const countAndOnline = 'count=1000&online=0';
export const redirect_uri = 'https://vk-networking.firebaseapp.com/auth';

function baseMethod(method) {
  return `${endpoint}/method/${method}?access_token=${api_key()}`;
}

function logError(json) {
  if (json.error) {
    console.error(json);
  }
}

function paramsToString(params: Object) {
  let res = '&';
  _.forEach(params, (value, key) => {
    if (value || value === 0) res += `${key}=${value}&`;
  });
  return res;
}

export function buildGetMembersUrl(params: Object) {
  console.log(`${baseMethod('users.search') + paramsToString(params)}${countAndOnline}&${profileFields}`);
  return `${baseMethod('users.search') + paramsToString(params)}${countAndOnline}&sort=0&${profileFields}`;
  // hometown?
}

export function buildGetCountries() {
  return baseMethod('database.getCountries');
}

export function buildGetCities(params: Object) {
  // console.log(baseMethod('database.getCities') + paramsToString(params));
  return baseMethod('database.getCities') + paramsToString(params);
}

export function buildGetSubscriptions(params: Object) {
  // console.log(baseMethod('users.getSubscriptions') + paramsToString(params) + '&extended=0');
  // return baseMethod('users.getSubscriptions') + paramsToString(params) + '&extended=0';
  return baseMethod('groups.get') + paramsToString(params);
}

export function buildGetMembers(params: Object) {
  // filter=friends
  console.log(`${baseMethod('groups.getMembers') + paramsToString(params)}&${profileFields}`);
  return `${baseMethod('groups.getMembers') + paramsToString(params)}&${profileFields}`;
}

export function buildGroupById(params: Object) {
  return `${baseMethod('groups.getById') + paramsToString(params)}&fields=name,photo`;
}

export function execute(code: string) {
  return `${baseMethod('execute')}&code=${encodeURI(code)}`;
}

export function executeGetFriends(testData: Array<number>) {
  const s = 'var f=\"photo_50,first_name,last_name\";return[';
  const loop = testData.map((id) => {
    const intId = parseInt(id, 10);
    return `[${intId},API.groups.getMembers({\"group_id\":${intId},\"filter\":\"friends\",\"fields\":f})]`;
  }).toString();
  const e = '];';
  return execute(s + loop + e);
}

export function executeGetGroupInfo(testData: Array<number>) {
  const c = 'var gr=\"name,photo\";return[';
  const loop = testData.map((id) => {
    const intId = parseInt(id, 10);
    return `API.groups.getById({\"group_id\":${intId},\"fields\":gr})`;
  }).toString();
  const e = '];';
  return execute(c + loop + e);
}

export function buildGetCountriesByCode(params: Object) {
  // console.log(baseMethod('database.getCountries') + paramsToString(params));
  return baseMethod('database.getCountries') + paramsToString(params);
}

export function buildGetUser(params: Object) {
  // console.log(baseMethod('users.get') + paramsToString(params));
  return baseMethod('users.get') + paramsToString(params);
}

export function buildFriendsGet(params: Object) {
  return `${baseMethod('friends.get') + paramsToString(params)}&count=10000`;
}

export function buildVkAuthUrl({ scope = 'groups', display = 'page', v = '5.626', response_type = 'token' }) {
  return `${OAuthEndpoint}client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}&display=${display}&v=${v}&response_type=${response_type}`;
}

export function getUserName(profileLink: ?string = null) {
  if (!profileLink) {
    return localStorage.getItem('lastLoginUserId');
  }
  const id = parseInt(profileLink, 10) || parseInt(profileLink.split('id')[1], 10);
  const link = profileLink.split('vk.com/')[1];
  if (id || link) {
    return id || link;
  }
  return profileLink;
}

export function fetchWrapper({ cb }) {
  return fetchJsonp(cb)
    .then(response => response.json())
    .then((json) => {
      logError(json);
      return json;
    });
}

export function fetchUser({ user_ids }) {
  return fetchWrapper({ cb: buildGetUser({ user_ids }) })
    .then(json => json.response ? json.response[0] : []);
}

export function fetchGroupById(params: Object) {
  // group_id, groups_id
  return fetchWrapper({ cb: buildGroupById(params) })
    .then(json => json.response ? json.response : []);
}

export function fetchExecuteGetFriendsInGroup({ items }) {
  return fetchWrapper({ cb: executeGetFriends(items) })
    .then(json => json.response ? json.response : []);
}

export function fetchExecuteGetGroupInfo({ items }) {
  return fetchWrapper({ cb: executeGetGroupInfo(items) })
    .then(json => json.response ? json.response : []);
}

export function fetchFriends({ user_id }) {
  return fetchWrapper({ cb: buildFriendsGet({ user_id }) })
    .then(json => json.response ? json.response : []);
}

export function fetchGroupMembers({ group_id, filter }) {
  // filter: String
  return fetchWrapper({ cb: buildGetMembers({ group_id, filter }) })
    .then((json) => {
      const { items = [] } = json.response;
      return items;
    });
}

export function fetchCountries({ code = null } = {}) {
  const cb = code ? buildGetCountriesByCode({ code }) : buildGetCountries();
  return fetchWrapper({ cb })
    .then(json => json.response ? json.response : _.toArray(json));
}

export function checkAuthError(array) {
  return array[0].error_code === 5;
}

export function fetchCities({ country_id = 1, q = '', need_all = 0, count = 100 }) {
  return fetchWrapper({ cb: buildGetCities({ country_id, q, need_all, count }) })
    .then(json => json.response ? json.response : []);
}

export function fetchGroups({ user_id }) {
  // return Promise.resolve(
  //   JSON.parse("[0]")
  // ).then(data => data);
  return fetchWrapper({ cb: buildGetSubscriptions({ user_id }) })
    .then(json => json.response ? json.response : []);
}

export function fetchMembers({ q, group_id, offset = 0, country, city, sex = 0, age_from, age_to, hometown, has_photo = 1 }) {
  return fetchWrapper({
    cb: buildGetMembersUrl({
      q,
      offset,
      country,
      group_id,
      city,
      sex,
      age_from,
      age_to,
      hometown,
      has_photo,
    }),
  })
    .then((json) => {
      if (json.response) {
        json.response.count = json.response[0];
        json.response.shift();
        return json.response;
      }
      return [];
    });
}
