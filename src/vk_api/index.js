
//const api_key = "API_KEY";
// https://api.vk.com/method/users.search?group_id=97408246&fields=photo_max,first_name,last_name&online=0&city=139&sex=0&has_photo=1&access_token=API_KEY
import fetch from 'isomorphic-fetch'
const api_key = "API_KEY";
const endpoint = "https://api.vk.com";
//
function baseMethod(method) {
  return `${endpoint}/method/${method}?access_token=${api_key}`
}

export function buildGetMembersUrl(id, city = "", sex = 0, age_from = 0, age_to = 0) {
  // sex=1: female
  return baseMethod('users.search') + `&group_id=${id}&fields=photo_max,first_name,last_name&online=0` +
    `${city != "" ? "&city=" + city : ""}&sex=${sex}` +
    `${age_from ? "&age_from=" + age_from : ""}` +
    `${age_to ? "&age_to=" + age_to : ""}` +
    `&has_photo=1&count=1000`;
  // hometown?
}

export function buildGetSubscriptions(userId) {
  return baseMethod('users.getSubscriptions') + `&user_id=${userId}&extended=0`;
}

export function fetchCommunities(userId) {
  return Promise.resolve(
    JSON.parse("MOCK_DATA")
  ).then(data => data);
  // return fetch(buildGetSubscriptions(userId), {mode: 'cors'})
    // .then(response => response.json())
    // .then(json => json.response.groups.items);
}

export function fetchMembers({id, city = "", sex = 0, age_from = 0, age_to = 0}) {
  return fetch(buildGetMembersUrl(id, city, sex, age_from, age_to))
    .then(response => {
      return response.json();
    })
    .then(json => {
      if (json.response) {
        json.response.shift()
      }
      return json.response;
    });
}
