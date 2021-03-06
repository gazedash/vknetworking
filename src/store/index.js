/* eslint-disable camelcase */
// @flow
import Vue from 'vue';
import Vuex from 'vuex';
import _, { uniq, uniqBy } from 'lodash';
import {
  fetchCities,
  fetchCountries,
  fetchExecuteGetGroups,
  fetchFriends,
  fetchGroups,
  fetchMembers,
  fetchUser,
} from '../vk_api/index';
import * as mt from './mutationTypes';
import * as at from './actionTypes';
import { get } from '../utils/storage';
import { ignoreList, resetConst, strategy as st } from '../const/index';
// import PromiseWorker from 'promise-worker';
// const MyWorker = require('worker-loader!../workers/worker.js');
// const worker = new MyWorker();
// const promiseWorker = new PromiseWorker(worker);
// fetchGroups({ user_id: newUserId, extended })
//   .catch(function (error) {
//     console.log(error);
//   });
Vue.use(Vuex);

const state = {
  index: {},
  strategy: st.darkenOnClick,
  ignoreList: [],
  fetchedGroupsLength: 0,
  profileList: [],
  groupIdList: {},
  groupUsersIdList: {},
  countries: { NaN: { cid: NaN, title: 'Not specified' } },
  cities: { NaN: [{ cid: NaN, label: 'Not specified' }] },
  aliases: {},
  users: {},
  currentUser: {},
  debounceCounter: 0,
  settings: '',
  // groupCommonFriends: {},
  friendList: [],
  friendListFoF: [],
  friendCounter: 0,
  groups: {},
  singles: {},
  user: { token: localStorage.token },
  // payload is latest search params
  payload: {},
};

// mutations are operations that actually mutates the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
  [mt.incrDebounceCounter](state) {
    state.debounceCounter++;
  },
  [mt.setToken](state, token) {
    state.user = { ...state.user, token };
  },
  [mt.search](state, { payload }) {
    state.payload = payload;
  },
  [mt.incrFriendCounter](state) {
    state.friendCounter++;
  },
  [mt.clearFriendCounter](state) {
    state.friendCounter = 0;
  },
  [mt.clearDebounceCounter](state) {
    state.debounceCounter = 0;
  },
  [mt.setIndex](state, { user_id, index }) {
    state.index = { ...state.index, [user_id]: index };
  },
  [mt.setCurrentUser](state, payload) {
    state.currentUser = payload;
  },
  [mt.bindAliasToUserId](state, { alias, user_id }) {
    state.aliases = { ...state.aliases, [alias.screen_name]: user_id };
  },
  [mt.setFetchedGroupsLength](state) {
    state.fetchedGroupsLength++;
  },
  [mt.setGroupIdList](state, { items = [], user_id }) {
    state.groupIdList = { ...state.groupIdList, [user_id]: items };
  },
  [mt.setGroupUsersList](state, { items = [], user_id }) {
    const res = {};
    items.forEach((group) => {
      let { gid } = group;
      if (!gid) {
        gid = group;
      }
      state.groups = { ...state.groups, [gid]: group };
      res[gid] = [user_id].concat(state.groupUsersIdList[gid] || []);
    });
    state.groupUsersIdList = { ...state.groupUsersIdList, ...res };
  },
  // [mt.setGroupCommonFriends](state, { items = [], group_id }) {
  //   state.groupCommonFriends = { ...state.groupCommonFriends, [group_id]: items };
  // },
  [mt.setProfilesFromGroup](state, { items = [] }) {
    const profileList = state.profileList || [];
    state.profileList = uniqBy(profileList.concat(items), 'uid');
  },
  [mt.setFriends](state, { items = [] }) {
    const friendList = state.friendList || [];
    state.friendList = uniqBy(friendList.concat(items || []), 'uid');
  },
  [mt.setFriendsFoF](state, { items = [] }) {
    const friendListFoF = state.friendListFoF || [];
    state.friendListFoF = uniqBy(friendListFoF.concat(items || []), 'uid');
  },
  [mt.setUser](state, { items }) {
    state.users = { ...state.users, [items.uid]: items };
  },
  [mt.setCountries](state, { items, payload }) {
    const countries = Object.assign({}, state.countries);
    if (items) {
      items.forEach((country) => {
        countries[country.cid] = { payload, ...country };
      });
    }
    state.countries = countries;
  },
  [mt.setCities](state, { items, country_id }) {
    const stateCities = state.cities[country_id] ? state.cities[country_id] : [];
    stateCities.push({ cid: NaN, label: 'Not specified' });
    const newItems = items.map((city) => {
      const newCity = { ...city };
      newCity.label = city.area ? `${city.title} (${city.area})` : city.title;
      return newCity;
    });
    state.cities[country_id] = uniqBy(newItems.concat(stateCities), 'cid');
  },
  [mt.clearProfileList](state) {
    state.index[state.currentUser.user_id] = 0;
    state.fetchedGroupsLength = 0;
    state.profileList = [];
    state.groupIdList[state.currentUser.user_id] = [];
  },
  [mt.setStateIgnoreList](state, { items }) {
    state.ignoreList = items;
  },
  [mt.clearStateIgnoreList](state) {
    state.ignoreList = [];
  },
  [mt.changeStrategy](state, { strategy }) {
    state.strategy = strategy;
  },
  [mt.setSettings](state, { settings }) {
    state.settings = settings;
  },
  [mt.setGroupById](state, { items }) {
    const res = {};
    items.forEach((item) => {
      const { gid } = item;
      res[gid] = item;
    });
    state.groups = { ...state.groups, ...res };
  },
  [mt.setSingle](state, { group_id, user }) {
    const { uid: user_id } = user;
    if (user_id) {
      const stateItems = state.singles[user_id] ? state.singles[user_id].groups || [] : [];
      const newItems = { user, groups: uniq([...stateItems, group_id]) };
      state.singles = { ...state.singles, [user_id]: newItems };
    }
  },
};

// actions are functions that causes side effects and can involve
// asynchronous operations.
const actions = {
  [at.incrCheckAndWait]({ commit, state }) {
    commit(mt.incrDebounceCounter);
    if (state.debounceCounter === 5) {
      commit(mt.clearDebounceCounter);
      return new Promise(resolve => setTimeout(resolve, 1000));
    }
    return new Promise(resolve => setTimeout(() => resolve(true), 0));
  },
  [at.getUser]({ commit, dispatch }, user_ids) {
    return dispatch(at.incrCheckAndWait).then(() => fetchUser({ user_ids })
      .then((items) => {
        const { uid } = items;
        const newItems = { ...items };
        newItems.screen_name = user_ids;
        commit(mt.setUser, { items: newItems });
        if (items && uid) {
          commit(mt.bindAliasToUserId, { alias: user_ids, user_id: uid });
        }
        return items;
      }));
  },
  [at.getCountries]({ commit, dispatch }, payload) {
    return dispatch(at.incrCheckAndWait).then(() => fetchCountries(payload)
      .then((items) => {
        commit(mt.setCountries, { items, payload });
        return items;
      }));
  },
  [at.getCities]({ commit, dispatch }, payload) {
    return dispatch(at.incrCheckAndWait).then(() => fetchCities(payload)
      .then((items) => {
        commit(mt.setCities, { items, country_id: payload.country_id });
        return items;
      }));
  },
  [at.getGroupIdList]({ commit, dispatch }, { user_id, extended = 0 }) {
    console.log('getGroupIdList', user_id);
    return dispatch(at.incrCheckAndWait).then(() => fetchGroups({ user_id, extended })
      .then((items) => {
        commit(mt.setGroupIdList, { items, user_id });
        return items;
      }));
  },
  [at.getGroupUsersList]({ commit, state, dispatch }, { items, extended = 0 }) {
    // [at.getGroupUsersList]({ commit, state, dispatch }, { user_id, extended = 0 }) {
    //   console.log('getGroupUsersList', user_id);
    //   const newUserId = user_id.uid || user_id;
    // console.log(state.user);
    // const x = promiseWorker.postMessage({ user_id: 126125228, extended: 0, token: state.user.token });
    // x.then((data) => {
    //   console.log('data', data);
    // });
    // return dispatch(at.incrCheckAndWait).then(() => fetchGroups({ user_id: newUserId, extended })
    return dispatch(at.incrCheckAndWait).then(() => fetchExecuteGetGroups({ items, extended })
      .then((groups) => {
        // commit(mt.setGroupUsersList, { items, user_id: newUserId });
        commit(mt.setGroupUsersList, { items: groups });
        return items;
      }));
  },
  [at.getProfilesFromGroup]({ commit, dispatch }, payload) {
    return dispatch(at.incrCheckAndWait).then(() => fetchMembers(payload)
      .then((items) => {
        // if (payload.second || payload.offset) {
        //   console.error('getProfilesFromGroup N PART', payload, items);
        // }
        commit(mt.setFetchedGroupsLength);
        commit(mt.setProfilesFromGroup, { items });
        if (items.length >= 999) {
          dispatch(at.incrCheckAndWait).then(() => {
            const newPayload = payload;
            if (payload.offset) {
              if (payload.offset >= 999 && payload.second !== true) {
                newPayload.offset += 999;
              }
              newPayload.second = false;
            } else {
              newPayload.offset = 999;
              newPayload.second = true;
            }
            dispatch(at.getProfilesFromGroup, newPayload);
          });
        }
        return items;
      }));
  },
  [at.getFirstNext]({ dispatch }, payload) {
    return dispatch(at.getGroupIdList, { user_id: payload.user_id })
      .then(items => dispatch(at.getNext, { items, ...payload }));
  },
  [at.getFirstNextFoF]({ dispatch, commit }, payload) {
    commit(mt.search, { payload });
    return dispatch(at.getFriends, { user_id: payload.user_id })
      .then(items => dispatch(at.getNextFoF, { items, ...payload }));
  },
  [at.getNextFoF]({ dispatch, commit, state }, { items, ...payload }) {
    // payload is options for profile searching
    const newItems = items || state.friendList;
    const index = state.index[payload.user_id];
    let nextIndex = !index && index !== 0 ? 0 : index + 1;
    if (!nextIndex) {
      commit(mt.setIndex, { user_id: payload.user_id, index: 0 });
      nextIndex = 0;
    }
    if (nextIndex < newItems.length) {
      commit(mt.setIndex, { user_id: payload.user_id, index: nextIndex });
      commit(mt.setCurrentUser, payload);
      const user_id = newItems[state.index[payload.user_id]].uid;
      console.log(user_id);
      return dispatch(at.getFriends, {
        ...payload,
        user_id,
        fof: true,
      }).then((profiles) => {
        if (profiles.length !== 0) {
          return items;
        }
        return [];
      });
    }
    return [];
  },
  [at.getNext]({ dispatch, commit, state }, { items, ...payload }) {
    // payload is options for profile searching
    const newItems = items || state.groupIdList[payload.user_id];
    const index = state.index[payload.user_id];
    let nextIndex = !index && index !== 0 ? 0 : index + 1;
    if (!nextIndex) {
      commit(mt.setIndex, { user_id: payload.user_id, index: 0 });
      nextIndex = 0;
    }
    if (nextIndex < newItems.length) {
      commit(mt.setIndex, { user_id: payload.user_id, index: nextIndex });
      commit(mt.setCurrentUser, payload);
      return dispatch(at.getProfilesFromGroup, {
        group_id: newItems[state.index[payload.user_id]], ...payload,
      }).then((profiles) => {
        if (profiles.length !== 0) {
          return commit(mt.setProfilesFromGroup, { items: newItems });
        }
        return [];
      });
    }
    return [];
  },
  [at.clearProfileList]({ commit }) {
    commit(mt.clearProfileList);
  },
  [at.appendToIgnoreList]({ commit }, { items = [], name = ignoreList } = {}) {
    let array = get(name);
    array = array && array.length ? array : [array];
    const res = uniq(items.concat(array));
    localStorage[name] = JSON.stringify(res);
    commit(mt.setStateIgnoreList, { items: res });
  },
  [at.clearIgnoreList]({ commit }, { name = ignoreList } = {}) {
    localStorage[name] = '[]';
    commit(mt.clearStateIgnoreList);
  },
  [at.changeStrategy]({ state, commit }, { strategy } = {}) {
    let newStrategy = strategy;
    if (!newStrategy) {
      const str = localStorage.strategy;
      newStrategy = str || state.strategy;
    } else {
      localStorage.strategy = newStrategy;
    }
    commit(mt.changeStrategy, { strategy: newStrategy });
  },
  [at.getSettings]({ commit }) {
    const settings = btoa(JSON.stringify(localStorage));
    commit(mt.setSettings, { settings });
    return settings;
  },
  [at.setSettings]({ commit }, { settings }) {
    if (settings) {
      if (settings === resetConst) {
        const token = localStorage.token;
        localStorage.clear();
        localStorage.token = token;
        commit(mt.setSettings, { settings: '' });
      } else {
        const settingsStr = btoa(JSON.stringify(localStorage));
        commit(mt.setSettings, { settings: settingsStr });
        Object.entries(settings)
          .forEach(([key, value]) => localStorage[key] = value);
      }
    }
  },
  [at.getFriends]({ dispatch, commit }, { user_id, fof = false }) {
    console.log(user_id, fof);
    return dispatch(at.incrCheckAndWait).then(() => fetchFriends({
      user_id,
      fields: 'uid,first_name,last_name,photo_max,site,city,country',
    })
      .then((items) => {
        console.log('getFriends already', user_id, { items });
        if (fof) {
          commit(mt.setFriendsFoF, { items });
        } else {
          commit(mt.setFriendsFoF, { items });
          commit(mt.setFriends, { items });
        }
        return items;
      }));
  },
  // [at.getExecuteFriendsInGroup]({ dispatch, commit }, { items }) {
  //   return dispatch(at.incrCheckAndWait).then(() => fetchExecuteGetFriendsInGroup({ items })
  //     .then((friends) => {
  //       friends.forEach((item) => {
  //         const { users } = item[1];
  //         const group_id = item[0];
  //         if (users) {
  //           if (users.length === 1) {
  //             const user = users[0];
  //             commit(mt.setSingle, { group_id, user });
  //           } else {
  //             commit(mt.setGroupCommonFriends, { group_id, items: users });
  //           }
  //         }
  //       });
  //     }));
  // },
  // [at.getExecuteGroupInfo]({ dispatch, commit }, { items }) {
  //   return dispatch(at.incrCheckAndWait).then(() => fetchExecuteGetGroupInfo({ items })
  //     .then((data) => {
  //       const res = data.map(item => item[0]);
  //       commit(mt.setGroupById, { items: res });
  //       return res;
  //     }));
  // },
  // [at.getGroupCommonFriendsFromFriendGroups]({ dispatch }, payload) {
  //   return dispatch(at.getGroupIdList, payload.user_id)
  //     .then((groups) => {
  //       // const groupChunks = _.chunk(groups, 25).slice(1, 3);
  //       const groupChunks = _.chunk(groups, 25);
  //       // iterateWithDelay(groupChunks, items => dispatch(at.getExecuteGroupInfo, { items }));
  //         // .then(() => dispatch(at.getExecuteFriendsInGroup, { items })));
  //     });
  // },
  [at.getFirstGroup]({ commit, dispatch }, { items }) {
    // const friendCounter = state.friendCounter;
    // commit(mt.incrFriendCounter);
    const groupChunks = _.chunk(items, 25);
    // fetchExecuteGetGroups({ items: groupChunks[0] })
    //   .then(data => console.log(data));
    // const funcs = groupChunks.map((el, i) => () => new Promise(resolve =>
    const funcs = groupChunks.slice(1, 6).map((el, i) => () => new Promise(resolve =>
      // const funcs = items.map((el, i) => () => new Promise(resolve =>
      setTimeout(resolve, (i === 0 ? i : i + 1) * 1))
      .then(() => {
        commit(mt.incrFriendCounter);
        // return dispatch(at.getGroupUsersList, { user_id: el, extended: 0 });
        return dispatch(at.getGroupUsersList, { items: el, extended: 0 });
      }));
    return funcs.reduce((p, f) => p.then(f), Promise.resolve());
    // return dispatch(at.getGroupCommonFriendsFromFriendGroups,
    // {user_id: state.friendList[friendCounter]});
  },
  [at.getFirstGroupNext]({ dispatch }, { user_id }) {
    return dispatch(at.getFriends, { user_id })
      .then(items => dispatch(at.getFirstGroup, { items }));
  },
};

// getters are functions
export const getters = {
  getStateIndex: state => user_id => state.index[user_id],
  getCurrentCities: state => country_id => state.cities[country_id],
  getProfileList: state => state.profileList,
  getSingle: (state) => {
    const res = {};
    _.each(state.groupUsersIdList, (val, gid) => {
      const user_id = val[0];
      if (val.length === 1) {
        const groups = res[user_id] ? res[user_id].groups : [];
        res[user_id] = {
          user: state.friendList.find(el => el.uid === user_id),
          groups: _.uniqBy([{ info: state.groups[gid] }].concat(groups), 'info.gid'),
        };
      }
    });
    return res;
  },
  getCommonGroups: (state) =>
    // const res = {};
    // _.forEach(state.groupUsersIdList, (val, key) => {
    //   // const data = _.map(val, user_id => state.friendList.find(el => el.uid === user_id));
    //   // res[key] = { data, info: state.groups[key] };
    //   res[key] = { info: state.groups[key] };
    //   return res[key];
    // });
     _.toArray(state.groups),
  getStoredUserId: state => user_id => state.aliases[user_id],
  getCurrentUserGroups: state => state.groupIdList[state.currentUser.user_id],
  getUserGroups: state => user_id => state.groupIdList[user_id],
  getUserId: (store, getters) => (user_id) => {
    const id = parseInt(user_id, 10) || parseInt(user_id.split('id')[1], 10);
    const link = user_id.split('vk.com/')[1];
    switch (true) {
      case !user_id:
        return localStorage.getItem('lastLoginUserId');
      case Number.isInteger(user_id):
        return user_id;
      case id:
        return id;
      case link:
        return link;
      default:
        return getters.getStoredUserId(user_id) || null;
    }
  },
};

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
});
