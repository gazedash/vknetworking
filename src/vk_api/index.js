
//const api_key = "API_KEY";
// https://api.vk.com/method/users.search?group_id=97408246&fields=photo_max,first_name,last_name&online=0&city=139&sex=0&has_photo=1&access_token=API_KEY
import fetch from "isomorphic-fetch";
const api_key = "API_KEY";
const endpoint = "https://api.vk.com";
//
function baseMethod(method) {
  return `${endpoint}/method/${method}?access_token=${api_key}`
}

export function buildGetMembersUrl(q, id, city = "", sex = 0, age_from = 0, age_to = 0, hometown = "", has_photo = 0) {
  // sex=1: female
  return baseMethod('users.search') +
    `${q ? "&q=" + q : ""}${hometown ? "&hometown=" + hometown : ""}&group_id=${id}` +
    `&fields=photo_max,first_name,last_name&online=0` +
    `${city ? "&city=" + city : ""}&sex=${sex}` +
    `${age_from ? "&age_from=" + age_from : ""}` +
    `${age_to ? "&age_to=" + age_to : ""}` +
    `&has_photo=${has_photo}&count=1000`;
  // hometown?
}

export function buildGetCountries() {
  return baseMethod('database.getCountries');
}

export function buildGetCities({country_id = 1, q = "", need_all = 0, count = 100}) {
  return baseMethod('database.getCities') + `${q ? "&q=" + q : ""}&country_id=${country_id}` +
    `&need_all=${need_all}&count=${count}`;
}

export function buildGetSubscriptions(userId) {
  return baseMethod('users.getSubscriptions') + `&user_id=${userId}&extended=0`;
}

export function buildGetUser(id) {
  return baseMethod('users.get') + `&user_ids=${id}`;
}

export function getUserName(profileLink) {
  const id = parseInt(profileLink) || parseInt(profileLink.split('id')[1]);
  const link = profileLink.split('vk.com/')[1];
  return id ? id : link ? link : profileLink;
}

export function fetchUser(id) {
  return fetch(buildGetUser(id), {mode: 'cors'})
    .then(response => response.json())
    .then(json => {
      return json.response[0];
    });
}

export function fetchCountries() {
  return fetch(buildGetCountries(), {mode: 'cors'})
    .then(response => response.json())
    .then(json => {
      return json.response;
    });
}

export function fetchCities({country_id = 1, q = "", need_all = 0, count = 100}) {
  return fetch(buildGetCities({country_id, q, need_all, count}))
    .then(response => response.json())
    .then(json => {
      return json.response;
    });
}

export function fetchCommunities(userId) {
  return Promise.resolve(
    JSON.parse("MOCK_DATA")
  ).then(data => data);
  // return fetch(buildGetSubscriptions(userId), {mode: 'cors'})
  // .then(response => response.json())
  // .then(json => json.response.groups.items);
}

export function fetchMembers({q = "", id, city = "", sex = 0, age_from = 0, age_to = 0, hometown = "", has_photo = 0}) {
  return fetch(buildGetMembersUrl(q, id, city, sex, age_from, age_to, hometown, has_photo))
    .then(response => response.json())
    .then(json => {
      if (json.response) {
        json.response.shift()
      }
      return json.response;
    });
}
