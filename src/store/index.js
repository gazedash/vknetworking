import Vue from "vue";
import Vuex from "vuex";
import {
  fetchCities,
  fetchCountries,
  fetchExecuteGetFriendsInGroup,
  fetchExecuteGetGroupInfo,
  fetchFriends,
  fetchGroups,
  fetchMembers,
  fetchUser
} from "../vk_api/index";
import uniqBy from "lodash/uniqBy";
import uniq from "lodash/uniq";
import _ from "lodash";
import * as mt from "./mutationTypes";
import * as at from "./actionTypes";
import {get} from "../utils/storage";
import {ignoreList, resetConst, strategy as st} from "../const/index";
import {iterateWithDelay} from "../utils/index";

Vue.use(Vuex);

const state = {
  index: {},
  strategy: st.darkenOnClick,
  ignoreList: [],
  fetchedGroupsLength: 0,
  profileList: [],
  groupIdList: {},
  countries: {NaN: {cid: NaN, title: 'Not specified'}},
  cities: {NaN: [{cid: NaN, label: 'Not specified'}]},
  aliases: {},
  users: {},
  currentUser: {},
  debounceCounter: 0,
  settings: "",
  groupCommonFriends: {},
  friendList: [],
  friendCounter: 0,
  groups: {},
  singles: {}
};

// mutations are operations that actually mutates the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
  [mt.incrDebounceCounter] (state) {
    state.debounceCounter++;
  },
  [mt.incrFriendCounter] (state) {
    state.friendCounter++;
  },
  [mt.clearFriendCounter] (state) {
    state.friendCounter = 0;
  },
  [mt.clearDebounceCounter] (state) {
    state.debounceCounter = 0;
  },
  [mt.setIndex] (state, {user_id, index}) {
    state.index = {...state.index, [user_id]: index}
  },
  [mt.setCurrentUser] (state, payload) {
    state.currentUser = payload;
  },
  [mt.bindAliasToUserId] (state, {alias, user_id}) {
    state.aliases = {...state.aliases, [alias]: user_id};
  },
  [mt.setFetchedGroupsLength] (state) {
    state.fetchedGroupsLength++;
  },
  [mt.setGroupIdList] (state, {items = [], user_id}) {
    state.groupIdList = {...state.groupIdList, [user_id]: items}
  },
  [mt.setGroupCommonFriends] (state, {items = [], group_id}) {
    state.groupCommonFriends = {...state.groupCommonFriends, [group_id]: items};
  },
  [mt.setProfilesFromGroup] (state, {items = []}) {
    const profileList = state.profileList;
    state.profileList = uniqBy(items.concat(profileList ? profileList : []), 'uid');
  },
  [mt.setFriends] (state, {items = []}) {
    const friendList = state.friendList;
    state.friendList = uniqBy(items.concat(friendList ? friendList : []));
  },
  [mt.setUser] (state, {items}) {
    state.users = {...state.users, [items.uid]: items};
  },
  [mt.setCountries] (state, {items, payload}) {
    const countries = Object.assign({}, state.countries);
    if (items) items.forEach((country) => countries[country.cid] = {payload, ...country});
    state.countries = countries;
  },
  [mt.setCities] (state, {items, country_id}) {
    const stateCities = state.cities[country_id] ? state.cities[country_id] : [];
    stateCities.push({cid: NaN, label: 'Not specified'});
    items = items.map((city) => {
      city.label = city.area ? `${city.title} (${city.area})` : city.title;
      return city;
    });
    state.cities[country_id] = uniqBy(items.concat(stateCities), 'cid');
  },
  [mt.setNext] (state, {items}) {
    mutations.setProfilesFromGroup(state, {items});
  },
  [mt.clearProfileList] (state) {
    state.index[state.currentUser.user_id] = 0;
    state.fetchedGroupsLength = 0;
    state.profileList = [];
    state.groupIdList[state.currentUser.user_id] = [];
  },
  [mt.setStateIgnoreList] (state, {items}) {
    state.ignoreList = items;
  },
  [mt.clearStateIgnoreList] (state) {
    state.ignoreList = [];
  },
  [mt.changeStrategy] (state, {strategy}) {
    state.strategy = strategy;
  },
  [mt.setSettings] (state, {settings}) {
    state.settings = settings;
  },
  [mt.setGroupById] (state, {items}) {
    const res = {};
    items.forEach((item) => {
      res[item.gid] = item;
    });
    state.groups = {...state.groups, ...res};
  },
  [mt.setSingle] (state, {group_id, user}) {
    const user_id = user.uid;
    const stateItems = state.singles[user_id] ? state.singles[user_id].groups || [] : [];
    const newItems = {user: user, groups: uniq([...stateItems, group_id])};
    state.singles = {...state.singles, [user_id]: newItems}
  },
};

// actions are functions that causes side effects and can involve
// asynchronous operations.
const actions = {
  [at.incrCheckAndWait] ({commit, state}) {
    commit(mt.incrDebounceCounter);
    if (state.debounceCounter === 5) {
      commit(mt.clearDebounceCounter);
      return new Promise(resolve => setTimeout(resolve, 1000));
    }
    return new Promise((resolve) => setTimeout(() => resolve(true), 0))
  },
  [at.getUser] ({commit, dispatch}, user_ids) {
    return dispatch(at.incrCheckAndWait).then(() => {
      return fetchUser({user_ids})
        .then((items) => {
          items.screen_name = user_ids;
          commit(mt.setUser, {items});
          if (items && items.uid) {
            commit(mt.bindAliasToUserId, {alias: user_ids, user_id: items.uid});
          }
          return items;
        })
    });
  },
  [at.getCountries] ({commit, dispatch}, payload) {
    return dispatch(at.incrCheckAndWait).then(() => {
      return fetchCountries(payload)
        .then((items) => {
          commit(mt.setCountries, {items, payload});
          return items;
        });
    });
  },
  [at.getCities] ({commit, dispatch}, payload) {
    return dispatch(at.incrCheckAndWait).then(() => {
      return fetchCities(payload)
        .then((items) => {
          commit(mt.setCities, {items, country_id: payload.country_id});
          return items;
        });
    });
  },
  [at.getGroupIdList] ({commit, dispatch}, user_id) {
    return dispatch(at.incrCheckAndWait).then(() => {
      return fetchGroups({user_id})
        .then((items) => {
          commit(mt.setGroupIdList, {items, user_id});
          return items;
        });
    });
  },
  [at.getGroupIdListNoCommit] ({dispatch}, user_id) {
    return dispatch(at.incrCheckAndWait).then(() => {
      return fetchGroups({user_id})
        .then(items => items);
    });
  },
  [at.getProfilesFromGroup] ({commit, dispatch}, payload) {
    return dispatch(at.incrCheckAndWait).then(() => {
      return fetchMembers(payload)
        .then(items => {
          commit(mt.setFetchedGroupsLength);
          commit(mt.setProfilesFromGroup, {items});
          if (items.length >= 999) {
            dispatch(at.incrCheckAndWait).then(() => {
              if (payload.offset) {
                if (payload.offset >= 999 && payload.second !== true) {
                  payload.offset = payload.offset + 999;
                }
                payload.second = false;
              } else {
                payload.offset = 999;
                payload.second = true;
              }
              dispatch(at.getProfilesFromGroup, payload);
            })
          }
          return items;
        });
    });
  },
  [at.getFirstNext] ({dispatch, commit, state}, payload) {
    return dispatch(at.getGroupIdList, payload.user_id)
    // return actions.getGroupIdList({ commit }, payload.user_id)
      .then(items => {
        return actions.getNext({dispatch, commit, state}, {items, ...payload});
      });
  },
  [at.getNext] ({dispatch, commit, state}, {items, ...payload}) {
    // payload is options for profile searching
    items = items ? items : state.groupIdList[payload.user_id];
    let index = state.index[payload.user_id];
    let nextIndex = !index && index !== 0 ? 0 : index + 1;
    if (!nextIndex) {
      commit(mt.setIndex, {user_id: payload.user_id, index: 0});
      nextIndex = 0;
    }
    if (nextIndex < items.length) {
      commit(mt.setIndex, {user_id: payload.user_id, index: nextIndex});
      commit(mt.setCurrentUser, payload);
      return dispatch(at.getProfilesFromGroup, {
        group_id: items[state.index[payload.user_id]], ...payload
      }).then(profiles => {
        if (profiles) {
          return commit(mt.setNext, {items: profiles});
        }
      })
    }
  },
  [at.clearProfileList] ({commit}) { commit(mt.clearProfileList); },
  [at.appendToIgnoreList] ({commit}, {items = [], name = ignoreList} = {}) {
    let array = get(name);
    array = array && array.length ? array : [array];
    const res = uniq(items.concat(array));
    localStorage[name] = JSON.stringify(res);
    commit(mt.setStateIgnoreList, {items: res});
  },
  [at.clearIgnoreList] ({commit}, {name = ignoreList} = {}) {
    localStorage[name] = '[]';
    commit(mt.clearStateIgnoreList);
  },
  [at.changeStrategy] ({state, commit}, {strategy} = {}) {
    if (!strategy) {
      const str = localStorage.strategy;
      strategy = str ? str : state.strategy;
    } else {
      localStorage.strategy = strategy;
    }
    commit(mt.changeStrategy, {strategy});
  },
  [at.getSettings] ({commit}) {
    const settings = btoa(JSON.stringify(localStorage));
    commit(mt.setSettings, {settings});
    return settings;
  },
  [at.setSettings] ({commit}, {settings}) {
    if (settings) {
      if (settings === resetConst) {
        const token = localStorage.token;
        localStorage.clear();
        localStorage.token = token;
        commit(mt.setSettings, {settings: ''});
      } else {
        const settingsStr = btoa(JSON.stringify(localStorage));
        commit(mt.setSettings, {settings: settingsStr});
        Object.entries(settings)
          .forEach(([key, value]) => localStorage[key] = value)
      }
    }
  },
  [at.getFriends] ({dispatch, commit}, {user_id}) {
    return dispatch(at.incrCheckAndWait).then(() => {
      return fetchFriends({user_id})
        .then(items => {
          commit(mt.setFriends, {items});
          return items;
        });
    });
  },
  [at.getExecuteFriendsInGroup] ({dispatch, commit}, {items, ...payload}) {
    return dispatch(at.incrCheckAndWait).then(() => {
      return fetchExecuteGetFriendsInGroup({items})
        .then(items => {
          items.forEach((item) => {
            if (item[1].users) {
              if (item[1].users.length === 1) {
                const user = item[1].users[0];
                commit(mt.setSingle, {group_id: item[0], user});
              } else {
                commit(mt.setGroupCommonFriends, {group_id: item[0], items: item[1].users})
              }
            }
          });
        })
    });
  },
  [at.getExecuteGroupInfo] ({dispatch, commit}, {items, ...payload}) {
    return dispatch(at.incrCheckAndWait).then(() => {
      return fetchExecuteGetGroupInfo({items})
        .then(items => {
          const res = items.map((item) => item[0]);
          commit(mt.setGroupById, {items: res})
        })
    });
  },
  [at.getGroupCommonFriendsFromFriendGroups] ({dispatch}, payload) {
    return dispatch(at.getGroupIdListNoCommit, payload.user_id)
      .then(groups => {
        // const groupChunks = _.chunk(groups, 25).slice(1, 3);
        const groupChunks = _.chunk(groups, 25);
        iterateWithDelay(groupChunks, (items) => dispatch(at.getExecuteGroupInfo, {items})
          .then(() => dispatch(at.getExecuteFriendsInGroup, {items})));
      });
  },
  [at.getFirstGroup] ({commit, state, dispatch}) {
    // const friendCounter = state.friendCounter;
    // commit(mt.incrFriendCounter);
    console.log(state.friendList.length);
    // const funcs = state.friendList.slice(1, 3).map((el, i) => () => new Promise(resolve =>
    const funcs = state.friendList.map((el, i) => () => new Promise(resolve =>
      setTimeout(resolve, (i === 0 ? i : i + 1) * 4000))
      .then(() => {
        commit(mt.incrFriendCounter);
        return dispatch(at.getGroupCommonFriendsFromFriendGroups, {user_id: el});
      }));
    funcs.reduce((p, f) => p.then(f), Promise.resolve());
    // return dispatch(at.getGroupCommonFriendsFromFriendGroups, {user_id: state.friendList[friendCounter]});
  },
  [at.getFirstGroupNext] ({dispatch}, {user_id}) {
    return dispatch(at.getFriends, {user_id})
      .then(() => {
        return dispatch(at.getFirstGroup);
      });
  },
};

// getters are functions
export const getters = {
  getStateIndex: state => (user_id) => state.index[user_id],
  getCurrentCities: state => (country_id) => state.cities[country_id],
  getProfileList: state => state.profileList,
  getSingle: state => {
    const res = {};
    _.forEach(state.singles, (single, user_id) => {
      res[user_id] = {...single, groups: single.groups.map(gid => ({info: state.groups[gid]}))};
      return {...single, groups: single.groups.map(gid => ({info: state.groups[gid]}))};
    });
    return res;
  },
  getCommonGroups: state => {
    const res = {};
    _.forEach(state.groupCommonFriends, (val, key) => {
      res[key] = {data: val, info: state.groups[key]};
      return {data: val, info: state.groups[key]};
    });
    return res;
  },
  getStoredUserId: state => (user_id) => state.aliases[user_id],
  getCurrentUserGroups: state => state.groupIdList[state.currentUser.user_id],
  getUserGroups: state => (user_id) => state.groupIdList[user_id],
  getUserId: (store, getters) => (userId) => {
    const id = parseInt(userId) || parseInt(userId.split('id')[1]);
    const link = userId.split('vk.com/')[1];
    switch (true) {
      case !userId:
        return localStorage.getItem('lastLoginUserId');
      case Number.isInteger(userId):
        return userId;
      case id:
        return id;
      case link:
        return link;
      default:
        return getters.getStoredUserId(userId) || null;
    }
  }
};

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
