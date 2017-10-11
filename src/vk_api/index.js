/* eslint-disable no-useless-escape */
// @flow
import fetchJsonp from 'fetch-jsonp';
import _ from 'lodash';

export const client_id = 5899859;

function api_key(aceess_token = null) {
  if (aceess_token) {
    return aceess_token;
  } else {
    return localStorage.token;
  }
}

const endpoint = 'https://api.vk.com';
const OAuthEndpoint = 'https://oauth.vk.com/authorize?';
const profileFields = 'fields=photo_max,first_name,last_name,site';
const countAndOnline = 'count=1000&online=0';
export const redirect_uri = 'https://vk-networking.firebaseapp.com/auth';

function baseMethod(method, pa) {
  return `${endpoint}/method/${method}?access_token=${api_key(pa ? pa.token : null)}`;
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
  return baseMethod('groups.get', params) + paramsToString(params);
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

export function executeGetGroups({ items }) {
  // groups.get
  const s = 'return[';
  const loop = items.map((id) => {
    console.log(id);
    const intId = parseInt(id.uid, 10);
    return `[${intId},API.groups.get({\"user_id\":${intId},\"extended\": 0})]`;
  }).toString();
  const e = '];';
  return execute(s + loop + e);
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
  return `${baseMethod('friends.get')}${paramsToString(params)}&count=10000`;
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

export function fetchExecuteGetGroups({ items, extended }) {
  return fetchWrapper({ cb: executeGetGroups({ items, extended }) })
    .then(json => {
      console.log(json);
      return json.response ? json.response : [];
    });
}

export function fetchExecuteGetGroupInfo({ items }) {
  return fetchWrapper({ cb: executeGetGroupInfo(items) })
    .then(json => json.response ? json.response : []);
}

export function fetchFriends({ user_id, fields }) {
  // return Promise.resolve(
    // JSON.parse('[{"uid":109956,"first_name":"Valia","last_name":"Walsk","photo_50":"https://pp.userapi.com/c639124/v639124956/5cc5/47caMIiVhyQ.jpg","online":0,"user_id":109956},{"uid":373502,"first_name":"Vasya","last_name":"Elektrichkin","photo_50":"https://pp.userapi.com/c626321/v626321502/1ccb4/UQ6sj4enru8.jpg","online":0,"user_id":373502},{"uid":1198736,"first_name":"Alexander","last_name":"Garkusha","photo_50":"https://pp.userapi.com/c637324/v637324736/13954/vaOzDRxWh68.jpg","online":0,"user_id":1198736},{"uid":1213694,"first_name":"Ilya","last_name":"Vorontsov","photo_50":"https://pp.userapi.com/c630822/v630822694/23ae7/RMrus8GiNwg.jpg","online":1,"user_id":1213694},{"uid":1415277,"first_name":"Philip","last_name":"Filippak","photo_50":"https://pp.userapi.com/c636124/v636124277/3db1c/uiKC_UlXmZU.jpg","online":0,"user_id":1415277},{"uid":1940792,"first_name":"Yana","last_name":"Terekhova","photo_50":"https://pp.userapi.com/c636622/v636622792/6a21a/1e4FLKB56e4.jpg","online":0,"user_id":1940792},{"uid":2088727,"first_name":"Alexey","last_name":"Koshkidko","photo_50":"https://pp.userapi.com/c629231/v629231727/453c0/DT-poUyj5KM.jpg","online":0,"user_id":2088727},{"uid":2149559,"first_name":"Alexandra","last_name":"Vorontsova","photo_50":"https://pp.userapi.com/c636829/v636829559/1e942/k71quaQtSno.jpg","online":0,"user_id":2149559},{"uid":2847854,"first_name":"Vitaly","last_name":"Pavlenko","photo_50":"https://cs541608.userapi.com/c636320/v636320854/1249b/7koKvtyyK2o.jpg","online":0,"user_id":2847854},{"uid":2929694,"first_name":"Alisa","last_name":"Altsionskaya","photo_50":"https://pp.userapi.com/c639218/v639218694/1b807/syp0WpcDGfE.jpg","online":0,"user_id":2929694},{"uid":3156935,"first_name":"Shorokh","last_name":"Shifera","photo_50":"https://pp.userapi.com/c631521/v631521935/18242/naEJLuPHS5I.jpg","online":1,"user_id":3156935},{"uid":3874394,"first_name":"Olga","last_name":"Kolesnikova","photo_50":"https://pp.userapi.com/c604726/v604726394/3e9c/Wg1FqDo_UOU.jpg","online":0,"user_id":3874394},{"uid":3882911,"first_name":"Dmitry","last_name":"Nikulin","photo_50":"https://pp.userapi.com/c636127/v636127911/1a506/_FKzVkbO7Bw.jpg","online":1,"user_id":3882911},{"uid":7124399,"first_name":"Ira","last_name":"Krylova","photo_50":"https://pp.userapi.com/c837134/v837134399/40905/N7HaZdhskpc.jpg","online":1,"user_id":7124399},{"uid":8330597,"first_name":"Arlyon","last_name":"Rykunova","photo_50":"https://pp.userapi.com/c637726/v637726597/44eb6/vQrMnTrX4Jo.jpg","online":1,"user_id":8330597},{"uid":10293767,"first_name":"Tatyana","last_name":"Suvorina","photo_50":"https://pp.userapi.com/c639918/v639918767/21e04/KSzfyyFkX_0.jpg","online":1,"user_id":10293767},{"uid":13291172,"first_name":"Viktor","last_name":"Burenin","photo_50":"https://pp.userapi.com/c633916/v633916172/1b94c/HZFzD2lLIbk.jpg","online":0,"user_id":13291172},{"uid":14771916,"first_name":"Nili","last_name":"Oniel","photo_50":"https://pp.userapi.com/c626316/v626316916/1a619/dOW1RfYyfYs.jpg","online":0,"user_id":14771916},{"uid":15710424,"first_name":"Alexandra","last_name":"Plotnikova","photo_50":"https://pp.userapi.com/c840227/v840227424/2e5a/B_5sepwJ8jE.jpg","online":0,"user_id":15710424},{"uid":16411198,"first_name":"Sanchir","last_name":"Kartiev","photo_50":"https://pp.userapi.com/c626220/v626220198/5f7b1/SKKZvhu3mLk.jpg","online":1,"user_id":16411198},{"uid":17539418,"first_name":"Roman","last_name":"Strugatskikh","photo_50":"https://pp.userapi.com/c638722/v638722418/a177/Na5PhMkkvwg.jpg","online":1,"user_id":17539418},{"uid":17541036,"first_name":"Alexander","last_name":"Krasnov","photo_50":"https://pp.userapi.com/c636422/v636422036/528a3/Awt2vmhUVbs.jpg","online":1,"user_id":17541036},{"uid":18116368,"first_name":"Yann","last_name":"Pavlenko","photo_50":"https://pp.userapi.com/c633718/v633718368/43cd5/BLxQwZdEeIw.jpg","online":1,"user_id":18116368},{"uid":18205753,"first_name":"Svetlana","last_name":"Kaspruk","photo_50":"https://pp.userapi.com/c636927/v636927753/1bd77/SOPABnnrkXI.jpg","online":0,"user_id":18205753,"lists":[29]},{"uid":19037786,"first_name":"Maxim","last_name":"Averin","photo_50":"https://pp.userapi.com/c837236/v837236786/2419c/TKj_6NyOR7g.jpg","online":0,"user_id":19037786},{"uid":23229178,"first_name":"Andrey","last_name":"Sitnichuk","photo_50":"https://pp.userapi.com/c630323/v630323178/404cc/5qvz5K2TvXU.jpg","online":0,"user_id":23229178},{"uid":23299278,"first_name":"Margarita","last_name":"Pestryakova","photo_50":"https://pp.userapi.com/c629503/v629503278/36be5/kdhQLmRTlPM.jpg","online":0,"user_id":23299278},{"uid":23536310,"first_name":"Dmitry","last_name":"Meynster","photo_50":"https://pp.userapi.com/c637827/v637827310/45294/Gfp3y5DVfTM.jpg","online":1,"user_id":23536310},{"uid":27269447,"first_name":"Sasha","last_name":"Izmaylova","photo_50":"https://pp.userapi.com/c637418/v637418447/44857/r8uHHuBep0c.jpg","online":0,"user_id":27269447},{"uid":30870741,"first_name":"Anton","last_name":"Veys","photo_50":"https://pp.userapi.com/c623430/v623430741/48c84/aA6-V9joWmw.jpg","online":0,"user_id":30870741},{"uid":34438859,"first_name":"Igor","last_name":"Sarkisyan","photo_50":"https://pp.userapi.com/c836625/v836625859/29752/BIxwXKoskeY.jpg","online":1,"user_id":34438859},{"uid":35515775,"first_name":"Nicole","last_name":"Davidova","photo_50":"https://pp.userapi.com/c604330/v604330775/55142/EsGKstZ7XAA.jpg","online":0,"user_id":35515775},{"uid":36451718,"first_name":"Alexander","last_name":"Shevchenko","photo_50":"https://vk.com/images/camera_50.png","online":1,"user_id":36451718},{"uid":37157754,"first_name":"Ivan","last_name":"Bulatov","photo_50":"https://pp.userapi.com/c630916/v630916754/3c74e/clJn3AizF5Q.jpg","online":0,"user_id":37157754},{"uid":37507164,"first_name":"Konstantin","last_name":"Potapov","photo_50":"https://pp.userapi.com/c636926/v636926164/65979/LTdMUFDOfcU.jpg","online":1,"user_id":37507164},{"uid":37531367,"first_name":"Kirill","last_name":"Bobyrev","photo_50":"https://cs541608.userapi.com/c636430/v636430367/6f9b7/zyHSzKTD5fc.jpg","online":1,"user_id":37531367},{"uid":38599330,"first_name":"Denis","last_name":"Sorokin","photo_50":"https://pp.userapi.com/c629418/v629418330/21bff/lm2diRq41nI.jpg","online":0,"user_id":38599330},{"uid":38606350,"first_name":"Sergey","last_name":"Salomatin","photo_50":"https://pp.userapi.com/c637524/v637524350/3e0f8/xdrGcHUE1q0.jpg","online":0,"user_id":38606350},{"uid":39136056,"first_name":"Sergey","last_name":"Pinkevich","photo_50":"https://pp.userapi.com/c638324/v638324056/52af2/a8nShn0zjLw.jpg","online":1,"user_id":39136056},{"uid":39944649,"first_name":"Evgeny","last_name":"Voskoboynikov","photo_50":"https://pp.userapi.com/c837221/v837221649/2528a/fUO2aF0OmlM.jpg","online":0,"user_id":39944649},{"uid":43784041,"first_name":"Ivan","last_name":"Sokolov","photo_50":"https://pp.userapi.com/c636717/v636717041/559c/mas8QpHftnI.jpg","online":0,"user_id":43784041},{"uid":46721078,"first_name":"Slava","last_name":"Nikolaevich","photo_50":"https://pp.userapi.com/c636817/v636817078/38262/3XrBV6Qmr84.jpg","online":0,"user_id":46721078},{"uid":47074543,"first_name":"Margarita","last_name":"Kholod","photo_50":"https://pp.userapi.com/c836328/v836328543/2c74b/R3HxjoTswVc.jpg","online":0,"user_id":47074543},{"uid":48705891,"first_name":"Yulia","last_name":"Gulyuk","photo_50":"https://pp.userapi.com/c626429/v626429891/56973/pmbc5giMaYU.jpg","online":0,"user_id":48705891},{"uid":49588167,"first_name":"Lidia","last_name":"Raulevskaya","photo_50":"https://pp.userapi.com/c6004/v6004167/230/OK_1fPQHPRA.jpg","online":1,"user_id":49588167},{"uid":51441539,"first_name":"Daniil","last_name":"Kovalenko","photo_50":"https://pp.userapi.com/c626927/v626927539/1899/i0bqobxNfrg.jpg","online":0,"user_id":51441539},{"uid":53316409,"first_name":"Kirill","last_name":"Minosyan","photo_50":"https://pp.userapi.com/c837224/v837224409/2d495/IlKE3S08jZY.jpg","online":0,"user_id":53316409},{"uid":54217993,"first_name":"Vera","last_name":"Provatorova","photo_50":"https://pp.userapi.com/c836634/v836634993/45d58/oCepH7eOKKk.jpg","online":0,"user_id":54217993},{"uid":54855074,"first_name":"Gleb","last_name":"Samosledov","photo_50":"https://pp.userapi.com/c636916/v636916074/69acf/l7dNzbCeHwc.jpg","online":0,"user_id":54855074},{"uid":54971869,"first_name":"Anastasia","last_name":"Dorozhkina","photo_50":"https://pp.userapi.com/c604819/v604819869/634f/s6JYyGfiWSs.jpg","online":0,"user_id":54971869},{"uid":57313961,"first_name":"Ruslan","last_name":"Datsun","photo_50":"https://pp.userapi.com/c837436/v837436961/6cbb0/95kYS-rJsLU.jpg","online":0,"user_id":57313961},{"uid":57476411,"first_name":"Andrey","last_name":"Stadnikov","photo_50":"https://pp.userapi.com/c622927/v622927411/268f7/jx_PQkyDrDI.jpg","online":0,"user_id":57476411,"lists":[28]},{"uid":59949877,"first_name":"Artyom","last_name":"Popov","photo_50":"https://pp.userapi.com/c604619/v604619877/d54b/IQoblh005Sk.jpg","online":0,"user_id":59949877},{"uid":61801697,"first_name":"Sonya","last_name":"Suntsova","photo_50":"https://pp.userapi.com/c638230/v638230697/3cc9a/yU4iI_GbcIY.jpg","online":0,"user_id":61801697},{"uid":62620477,"first_name":"Nikita","last_name":"Isaev","photo_50":"https://pp.userapi.com/c639431/v639431477/19c25/B_APRk93puc.jpg","online":1,"user_id":62620477,"lists":[28]},{"uid":64856503,"first_name":"Anyuta","last_name":"Syrykh","photo_50":"https://pp.userapi.com/c637826/v637826503/30ac8/ykxf0B_Dg6E.jpg","online":0,"user_id":64856503},{"uid":66899562,"first_name":"Anastasia","last_name":"Voloshina","photo_50":"https://pp.userapi.com/c638121/v638121562/bdef/c81vkKD0q6k.jpg","online":1,"user_id":66899562},{"uid":67745400,"first_name":"Ekaterina","last_name":"Veber","photo_50":"https://pp.userapi.com/c625431/v625431400/36141/vRYFyueWd8g.jpg","online":0,"user_id":67745400},{"uid":68861859,"first_name":"Naran","last_name":"Lidzhigaryaev","photo_50":"https://pp.userapi.com/c626228/v626228859/5b04d/jYOWYXfX5Ec.jpg","online":1,"user_id":68861859,"lists":[28]},{"uid":72071122,"first_name":"Alexander","last_name":"Eryomenko","photo_50":"https://pp.userapi.com/c322921/v322921122/87af/gLJVwgTpUOI.jpg","online":1,"user_id":72071122},{"uid":76767813,"first_name":"Erdni","last_name":"Erendzhenov","photo_50":"https://pp.userapi.com/c636516/v636516813/55edd/LcnSX8TFCGE.jpg","online":0,"user_id":76767813},{"uid":81378602,"first_name":"Alexandra","last_name":"Bakuleva","photo_50":"https://pp.userapi.com/c636425/v636425602/6924a/KZvJ13ghDEI.jpg","online":0,"user_id":81378602},{"uid":87444080,"first_name":"Pavel","last_name":"Dunkan","photo_50":"https://pp.userapi.com/c626426/v626426080/64eb8/n8k3HOOb630.jpg","online":0,"user_id":87444080},{"uid":90992729,"first_name":"Savva","last_name":"Kolushkin","photo_50":"https://pp.userapi.com/c636629/v636629729/68d75/YbgxMC_ygW8.jpg","online":1,"user_id":90992729},{"uid":93368506,"first_name":"Nika","last_name":"Mayakovskaya","photo_50":"https://pp.userapi.com/c626228/v626228506/6da34/7B-n-X70FUg.jpg","online":0,"user_id":93368506},{"uid":93768041,"first_name":"Nika","last_name":"Chernikova","photo_50":"https://pp.userapi.com/c639128/v639128041/1d96c/Q-HPHiO-xv4.jpg","online":0,"user_id":93768041},{"uid":94391569,"first_name":"Alevtina","last_name":"Petrova","photo_50":"https://pp.userapi.com/c638620/v638620569/38742/qzajr0eMYPA.jpg","online":0,"user_id":94391569},{"uid":94655679,"first_name":"Anastasia","last_name":"Ponomareva","photo_50":"https://pp.userapi.com/c626528/v626528679/4e9af/iDve6Nr9qEQ.jpg","online":0,"user_id":94655679,"lists":[28]},{"uid":95316767,"first_name":"Alyona","last_name":"Leontyeva","photo_50":"https://pp.userapi.com/c636923/v636923767/3a915/Tkg_SZkWT3M.jpg","online":0,"user_id":95316767},{"uid":95623017,"first_name":"Vladimir","last_name":"Kondenko","photo_50":"https://pp.userapi.com/c837331/v837331017/18688/4AY7MSWAi8U.jpg","online":0,"user_id":95623017},{"uid":96098134,"first_name":"Slavik","last_name":"Sergeev","photo_50":"https://pp.userapi.com/c636730/v636730134/65852/-nQhcIHp17w.jpg","online":0,"user_id":96098134},{"uid":102425763,"first_name":"Polina","last_name":"Zakhodyaka","photo_50":"https://pp.userapi.com/c636625/v636625763/6c662/nftgJYNsnoM.jpg","online":0,"user_id":102425763},{"uid":103305102,"first_name":"Max","last_name":"Dinov","photo_50":"https://cs541608.userapi.com/c638418/v638418102/37b22/Rb5KS62bDuk.jpg","online":0,"user_id":103305102},{"uid":103388241,"first_name":"Sasha","last_name":"Ksagorari","photo_50":"https://pp.userapi.com/c837430/v837430241/353b1/M-ftnk9XHEw.jpg","online":0,"user_id":103388241,"lists":[28]},{"uid":107286781,"first_name":"Maria","last_name":"Tkach","photo_50":"https://pp.userapi.com/c626322/v626322781/8bc3/o9filkQNeLw.jpg","online":1,"user_id":107286781},{"uid":117724699,"first_name":"Vitaly","last_name":"Domoslavsky","photo_50":"https://pp.userapi.com/c639718/v639718699/1da64/Buie2L1tQMA.jpg","online":0,"user_id":117724699},{"uid":118884069,"first_name":"Roman","last_name":"Eltsov","photo_50":"https://pp.userapi.com/c627231/v627231069/52c93/Akhuj1Jri3I.jpg","online":0,"user_id":118884069},{"uid":124558867,"first_name":"Dmitry","last_name":"Evdokimenko","photo_50":"https://pp.userapi.com/c636419/v636419867/56661/cuBQASHkwqI.jpg","online":0,"user_id":124558867},{"uid":125091832,"first_name":"Darya","last_name":"Shargorodskaya","photo_50":"https://pp.userapi.com/c637922/v637922832/42ba0/XPqwQKmIcJU.jpg","online":0,"user_id":125091832},{"uid":126132676,"first_name":"Anatoly","last_name":"Vinnikov","photo_50":"https://pp.userapi.com/c625126/v625126676/1bae/6lZcrswPMwk.jpg","online":0,"user_id":126132676,"lists":[26]},{"uid":135666269,"first_name":"Petya","last_name":"Bubnenko","photo_50":"https://pp.userapi.com/c604618/v604618269/318ab/FhjXcJr_VM8.jpg","online":0,"user_id":135666269},{"uid":136140341,"first_name":"Alina","last_name":"Vishnyakova","photo_50":"https://pp.userapi.com/c604721/v604721341/35809/NEGNrXBzpjI.jpg","online":0,"user_id":136140341},{"uid":136621558,"first_name":"Artyom","last_name":"Proskuryakov","photo_50":"https://pp.userapi.com/c639828/v639828558/25130/354J0MckQCo.jpg","online":0,"user_id":136621558,"lists":[28]},{"uid":136629502,"first_name":"Evgeny","last_name":"Vasilyev","photo_50":"https://pp.userapi.com/c637317/v637317502/34672/BJ7w7v9f0tU.jpg","online":0,"user_id":136629502},{"uid":139276314,"first_name":"Andrey","last_name":"Protsenko","deactivated":"deleted","photo_50":"https://vk.com/images/deactivated_50.png","online":0,"user_id":139276314},{"uid":141374441,"first_name":"Pavel","last_name":"Popov","photo_50":"https://pp.userapi.com/c638820/v638820441/a41/zRVZX5c1zBo.jpg","online":1,"user_id":141374441},{"uid":144725237,"first_name":"Anastasia","last_name":"Medvedeva","photo_50":"https://pp.userapi.com/c639324/v639324237/14dcd/sR9L2Na7DiU.jpg","online":1,"user_id":144725237},{"uid":147235682,"first_name":"Anatoly","last_name":"Marinenko","photo_50":"https://pp.userapi.com/c626516/v626516682/5ee36/29KGNIyLOnI.jpg","online":0,"user_id":147235682},{"uid":148002754,"first_name":"Pelageya","last_name":"Zhuk","photo_50":"https://cs541608.userapi.com/c635104/v635104754/193c7/39juwHZmcB8.jpg","online":0,"user_id":148002754},{"uid":149192198,"first_name":"Mikhail","last_name":"Samin","photo_50":"https://pp.userapi.com/c637623/v637623198/48d79/q97m998sSVc.jpg","online":0,"user_id":149192198},{"uid":151116991,"first_name":"Viktoria","last_name":"Krasterson","photo_50":"https://pp.userapi.com/c638929/v638929991/ea40/rA4zI5-jZzo.jpg","online":0,"user_id":151116991},{"uid":152720911,"first_name":"Anastasia","last_name":"Bulatova","photo_50":"https://pp.userapi.com/c638918/v638918911/3ec98/xdwQ3J3htz8.jpg","online":0,"user_id":152720911,"lists":[28]},{"uid":154427361,"first_name":"Inna","last_name":"Voloschuk","photo_50":"https://pp.userapi.com/c636731/v636731361/4184f/ERy6tY7QV1U.jpg","online":1,"user_id":154427361},{"uid":163407688,"first_name":"Antonina","last_name":"Tarasenko","photo_50":"https://pp.userapi.com/c637820/v637820688/44418/leaUvl6FstU.jpg","online":1,"user_id":163407688},{"uid":164605511,"first_name":"Ekaterina","last_name":"Tarasova","photo_50":"https://pp.userapi.com/c604616/v604616511/32c02/uhqQZUQ6fq4.jpg","online":0,"user_id":164605511},{"uid":170044017,"first_name":"Relaxing","last_name":"Kot","photo_50":"https://pp.userapi.com/c623718/v623718017/54e26/u2b22yy8Y8s.jpg","online":1,"user_id":170044017},{"uid":172335550,"first_name":"Sergey","last_name":"Borzenkov","photo_50":"https://pp.userapi.com/c627828/v627828550/21f3/mIs1AiMKDOI.jpg","online":0,"user_id":172335550,"lists":[28]},{"uid":172584763,"first_name":"Alexey","last_name":"Vinogradov","photo_50":"https://pp.userapi.com/c636429/v636429763/473ce/go0CMkguaPg.jpg","online":1,"user_id":172584763},{"uid":173709624,"first_name":"Mark","last_name":"Tselikov","photo_50":"https://vk.com/images/camera_50.png","online":0,"user_id":173709624,"lists":[28,26]},{"uid":174361100,"first_name":"Alexander","last_name":"Maletin","photo_50":"https://pp.userapi.com/c637531/v637531100/1e9da/Po6QwB1txHk.jpg","online":0,"user_id":174361100},{"uid":179610607,"first_name":"Alexey","last_name":"Tartykov","photo_50":"https://pp.userapi.com/c638229/v638229607/4f78/h_5wfTsaNSY.jpg","online":0,"user_id":179610607},{"uid":181840653,"first_name":"Igor","last_name":"Shevchenko","photo_50":"https://vk.com/images/camera_50.png","online":0,"user_id":181840653},{"uid":182228754,"first_name":"Vladislav","last_name":"Scheglov","photo_50":"https://pp.userapi.com/c836327/v836327754/13ba0/bJ-tWPNLIRM.jpg","online":0,"user_id":182228754},{"uid":182927206,"first_name":"Kirill","last_name":"Besfamilny","photo_50":"https://pp.userapi.com/c604526/v604526206/4d305/L81AW8QrStI.jpg","online":0,"user_id":182927206},{"uid":183256915,"first_name":"Vladimir","last_name":"Pinchuk","photo_50":"https://pp.userapi.com/c636719/v636719915/52596/4I32a6tfz84.jpg","online":0,"user_id":183256915},{"uid":187942282,"first_name":"Vladimir","last_name":"Rydvanov","photo_50":"https://pp.userapi.com/c638929/v638929282/22421/B8HYFfuUeok.jpg","online":1,"user_id":187942282},{"uid":193775275,"first_name":"Lidia","last_name":"Bondar","photo_50":"https://pp.userapi.com/c636920/v636920275/4465b/XRWwfeelTy0.jpg","online":0,"user_id":193775275},{"uid":194688777,"first_name":"Kirill","last_name":"Vdovenko","photo_50":"https://pp.userapi.com/c636028/v636028777/45207/y_o6UzynH2U.jpg","online":0,"user_id":194688777},{"uid":195930198,"first_name":"Eva","last_name":"Rozenberg","photo_50":"https://pp.userapi.com/c638929/v638929198/31378/wus8lSzmU-w.jpg","online":1,"user_id":195930198},{"uid":199741604,"first_name":"Andrey","last_name":"Gaydukevich","photo_50":"https://pp.userapi.com/c631624/v631624604/4f540/4yd6C6u2HMY.jpg","online":1,"user_id":199741604},{"uid":203568237,"first_name":"Alexander","last_name":"Vinter","photo_50":"https://pp.userapi.com/c637929/v637929237/36a3c/JN9iMjdtA18.jpg","online":0,"user_id":203568237},{"uid":210076873,"first_name":"Lina","last_name":"Xia","photo_50":"https://pp.userapi.com/c836327/v836327873/1cc6/Y1qW1xJWbj4.jpg","online":1,"user_id":210076873},{"uid":213253903,"first_name":"Danil","last_name":"Zhiganov","photo_50":"https://pp.userapi.com/c638620/v638620903/418f8/kD1BFS1qAwA.jpg","online":0,"user_id":213253903},{"uid":222339100,"first_name":"Ekaterina","last_name":"Levakova","photo_50":"https://pp.userapi.com/c636927/v636927100/6f3b1/8Cuv7xVOCSI.jpg","online":1,"user_id":222339100},{"uid":239818120,"first_name":"Yulia","last_name":"Rovnik","photo_50":"https://pp.userapi.com/c637325/v637325120/4432c/87a1nNdhc5U.jpg","online":0,"user_id":239818120},{"uid":244160060,"first_name":"Igor","last_name":"Shpak","photo_50":"https://vk.com/images/camera_50.png","online":1,"user_id":244160060},{"uid":249941579,"first_name":"Denis","last_name":"Denisov","photo_50":"https://pp.userapi.com/c630716/v630716579/444f6/woS5Gs2eBKo.jpg","online":1,"user_id":249941579},{"uid":256611307,"first_name":"Kommi","last_name":"Voyazhyor","photo_50":"https://pp.userapi.com/c622219/v622219307/3576a/k7lgaSlbVNU.jpg","online":0,"user_id":256611307},{"uid":273047844,"first_name":"Ekaterina","last_name":"Orlova","deactivated":"deleted","photo_50":"https://vk.com/images/deactivated_50.png","online":0,"user_id":273047844},{"uid":286985620,"first_name":"Mebiro","last_name":"Bits","photo_50":"https://pp.userapi.com/c630625/v630625620/216a1/0miqXs2JjWk.jpg","online":0,"user_id":286985620},{"uid":287778572,"first_name":"Emilia","last_name":"Tsimmer","photo_50":"https://pp.userapi.com/c637717/v637717572/40933/tDManKBfJI4.jpg","online":1,"user_id":287778572},{"uid":293385854,"first_name":"Mira","last_name":"Skrepina","photo_50":"https://pp.userapi.com/c638917/v638917854/3706c/cIhEVU2YljM.jpg","online":0,"user_id":293385854},{"uid":293907349,"first_name":"Go","last_name":"English","photo_50":"https://pp.userapi.com/c837422/v837422349/2eada/5dW33uvbxWk.jpg","online":1,"user_id":293907349},{"uid":297062533,"first_name":"Lodoss","last_name":"Team","photo_50":"https://pp.userapi.com/c625320/v625320533/40cca/yIH-QAZzRZs.jpg","online":0,"user_id":297062533},{"uid":339713745,"first_name":"Ruslan","last_name":"Vinter","photo_50":"https://pp.userapi.com/c637530/v637530745/41f66/5s5yRUeF6ZY.jpg","online":1,"user_id":339713745},{"uid":340981943,"first_name":"Ьaioadvd","last_name":"Aoatvlaoviai","photo_50":"https://cs541608.userapi.com/c636327/v636327943/57905/yTnpMHVGKeQ.jpg","online":0,"user_id":340981943},{"uid":345225769,"first_name":"Waft","last_name":"Retro","photo_50":"https://pp.userapi.com/c630830/v630830769/3b4bf/TmGaestJEyY.jpg","online":0,"user_id":345225769},{"uid":349874155,"first_name":"Ivan","last_name":"Ufolog","photo_50":"https://pp.userapi.com/c837531/v837531155/2346f/8iVEzchgTOg.jpg","online":0,"user_id":349874155},{"uid":359773412,"first_name":"Den","last_name":"Derty","photo_50":"https://pp.userapi.com/c626216/v626216412/1227/U-IH65htjRM.jpg","online":0,"user_id":359773412},{"uid":363714080,"first_name":"White","last_name":"Spirit","photo_50":"https://pp.userapi.com/c637319/v637319080/49dca/jpuA07W7M-A.jpg","online":1,"user_id":363714080},{"uid":369718329,"first_name":"Rafał","last_name":"Wojaczek","photo_50":"https://pp.userapi.com/c630928/v630928329/4c99e/lvieAfCKCls.jpg","online":0,"user_id":369718329},{"uid":372571931,"first_name":"Anatoly","last_name":"Goncharov","photo_50":"https://pp.userapi.com/c636822/v636822931/37abe/xpLtw4ihZu4.jpg","online":0,"user_id":372571931},{"uid":373316467,"first_name":"Sonya","last_name":"Dobraya","photo_50":"https://pp.userapi.com/c7003/v7003575/2c5fc/2HhZcEMx1Lw.jpg","online":0,"user_id":373316467},{"uid":390613856,"first_name":"Sirius","last_name":"Aaronovich","photo_50":"https://pp.userapi.com/c636526/v636526856/53cae/XdkfxcGsj4M.jpg","online":1,"user_id":390613856},{"uid":410292229,"first_name":"Maxim","last_name":"Ruslanovich","photo_50":"https://pp.userapi.com/c636829/v636829229/652ed/9UybNV86ng8.jpg","online":0,"user_id":410292229},{"uid":410474988,"first_name":"Anatoly","last_name":"Liventsev","deactivated":"banned","photo_50":"https://vk.com/images/deactivated_50.png","online":0,"user_id":410474988},{"uid":412488541,"first_name":"Elena","last_name":"Bandurist","photo_50":"https://pp.userapi.com/c638627/v638627541/21ea1/BKSj_hLN3WE.jpg","online":0,"user_id":412488541},{"uid":413662026,"first_name":"Margarita","last_name":"Umbrella","photo_50":"https://pp.userapi.com/c837123/v837123026/2cd62/_ttjPooASpk.jpg","online":0,"user_id":413662026}]'),
  // ).then(data => data);
  return fetchWrapper({ cb: buildFriendsGet({ user_id, fields }) })
    .then(json => {
      console.log(json.response);
      return json.response ? json.response : [];
    });
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

export function fetchGroups({ user_id, extended = 0, ...rest }) {
  // return Promise.resolve(
  //   JSON.parse("[0]")
  // ).then(data => data);
  return fetchWrapper({ cb: buildGetSubscriptions({ user_id, extended, rest }), worker: true })
    .then((json) => {
      if (json.response) {
        json.response.count = json.response[0];
        json.response.shift();
        return json.response;
      }
      return [];
    });
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
