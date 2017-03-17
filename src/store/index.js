import Vue from "vue";
import Vuex from "vuex";
import {fetchGroups, fetchMembers, fetchCountries, fetchCities, fetchUser} from "../vk_api/index";
import uniqBy from "lodash/uniqBy";
import uniq from "lodash/uniq";
import * as mt from "./mutationTypes";
import * as at from "./actionTypes";
import {get} from "../utils/storage";
import {ignoreList, strategy as st, resetConst} from "../const/index";

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
  [mt.clearDebounceCounter] (state) {
    state.debounceCounter = 0;
  },
  [mt.setIndex] (state, {userId, index}) {
    state.index[userId] = index
  },
  [mt.setCurrentUser] (state, payload) {
    state.currentUser = payload;
  },
  [mt.bindAliasToUserId] (state, {alias, userId}) {
    state.aliases[alias] = userId;
  },
  [mt.setFetchedGroupsLength] (state) {
    state.fetchedGroupsLength++;
  },
  [mt.setGroupIdList] (state, {items, user_id}) {
    const groupIdList = state.groupIdList[user_id];
    state.groupIdList[user_id] = uniq(items.concat(groupIdList ? groupIdList : []));
  },
  [mt.setProfilesFromGroup] (state, {items}) {
    state.profileList = uniqBy(state.profileList.concat(items), 'uid');
  },
  [mt.setUser] (state, {items}) {
    state.users[items.uid] = items;
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
    state.index[state.currentUser.userId] = 0;
    state.fetchedGroupsLength = 0;
    state.profileList = [];
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
  }
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
            commit(mt.bindAliasToUserId, {alias: user_ids, userId: items.uid});
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
  [at.getProfilesFromGroup] ({commit, dispatch}, payload) {
    return dispatch(at.incrCheckAndWait).then(() => {
      return fetchMembers(payload)
        .then(items => {
          commit(mt.setFetchedGroupsLength);
          commit(mt.setProfilesFromGroup, {items});
          return items;
        });
    });
  },
  [at.getFirstNext] ({dispatch, commit, state}, payload) {
    return dispatch(at.getGroupIdList, payload.userId)
    // return actions.getGroupIdList({ commit }, payload.userId)
      .then(items => {
        return actions.getNext({dispatch, commit, state}, {items, ...payload});
      });
  },
  [at.getNext] ({dispatch, commit, state}, {items, ...payload}) {
    // payload is options for profile searching
    items = items ? items : state.groupIdList[payload.userId];
    let index = state.index[payload.userId];
    let nextIndex = !index && index !== 0 ? 0 : index + 1;
    if (!nextIndex) {
      commit(mt.setIndex, {userId: payload.userId, index: 0});
      nextIndex = 0;
    }
    if (nextIndex < items.length) {
      commit(mt.setIndex, {userId: payload.userId, index: nextIndex});
      commit(mt.setCurrentUser, payload);
      return dispatch(at.getProfilesFromGroup, {
        group_id: items[state.index[payload.userId]], ...payload
      }).then(profiles => {
        if (profiles) {
          return commit(mt.setNext, {items: profiles});
        }
      })
    }
  },
  [at.clearProfileList] ({commit}) {
    commit(mt.clearProfileList);
  },
  [at.appendToIgnoreList] ({commit}, {items = [], name = ignoreList} = {}) {
    let array = get(name);
    array = array && array.length ? array : [array];
    const res = uniq(items.concat(array));
    localStorage[name] = JSON.stringify(res);
    commit(mt.setStateIgnoreList, {items: res});
  },
  [at.clearIgnoreList] ({commit}, {name = ignoreList} = {}) {
    localStorage[name] = '{null}';
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
  }
};

// getters are functions
export const getters = {
  getStateIndex: state => (userId) => state.index[userId],
  getCurrentCities: state => (country_id) => state.cities[country_id],
  getProfileList: state => state.profileList,
  getStoredUserId: state => (userId) => state.aliases[userId],
  getCurrentUserGroups: state => state.groupIdList[state.currentUser.userId],
  getUserGroups: state => (userId) => state.groupIdList[userId],
};

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
