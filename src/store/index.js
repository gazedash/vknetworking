import Vue from "vue";
import Vuex from "vuex";
import {fetchCommunities, fetchMembers, fetchCountries, fetchCities, fetchUser, fetchCountriesByCode} from "../vk_api/index";
import uniqBy from "lodash/uniqBy";
import {uniq} from "lodash";

Vue.use(Vuex);

const state = {
  index: 0,
  fetchedCommunitiesLength: 0,
  profileList: [],
  communityIdList: {},
  countries: {NaN: {cid: NaN, title: 'Not specified'}},
  cities: {NaN: [{cid: NaN, title: 'Not specified'}]},
  aliases: {},
  users: {},
  currentUser: {},
  debounceCounter: 0,
};

// mutations are operations that actually mutates the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
  incrDebounceCounter (state) {
    state.debounceCounter++;
  },
  clearDebounceCounter (state) {
    state.debounceCounter = 0;
  },
  setCurrentUser (state, payload) {
    state.currentUser = payload;
  },
  bindAlisToUserId (state, {alias, userId}) {
    state.aliases[alias] = userId;
  },
  setIndex (state, index) {
    state.index = index
  },
  fetchedCommunitiesLength (state) {
    state.fetchedCommunitiesLength++;
  },
  getCommunityIdList (state, {items, user_id}) {
    state.communityIdList[user_id] = uniq(items.concat(state.communityIdList[user_id]));
  },
  getProfilesFromCommunity (state, {items}) {
    state.profileList = uniqBy(state.profileList.concat(items), 'uid');
  },
  getUser (state, {items}) {
    state.users[items.uid] = items;
  },
  getCountries (state, {items, payload}) {
    const countries = Object.assign({}, state.countries);
    if (items) items.forEach((country) => countries[country.cid] = {payload, ...country});
    state.countries = countries;
  },
  getCities (state, {items, country_id}) {
    state.cities[country_id] = [...items, {cid: NaN, title: 'Not specified'}];
  },
  getNext (state, {items}) {
    mutations.getProfilesFromCommunity(state, {items});
  },
};

// actions are functions that causes side effects and can involve
// asynchronous operations.
const actions = {
  incrCheckAndWait({commit, state}) {
    commit('incrDebounceCounter');
    if (state.debounceCounter === 5) {
      commit('clearDebounceCounter');
      return new Promise((resolve, reject) => {
        // A mock async action using setTimeout
        setTimeout(function () {
          console.log('timeout');
          resolve(true);
        }, 1000);
      })
    } else {
      return new Promise((resolve, reject) => {
        setTimeout(function () {
          resolve(true);
        }, 0);
      })
    }
  },
  getUser ({commit, dispatch}, user_ids) {
    return fetchUser({user_ids})
      .then((items) => {
        return dispatch('incrCheckAndWait').then(() => {
          items.screen_name = user_ids;
          commit('getUser', {items});
          if (items && items.uid) {
            commit('bindAlisToUserId', {alias: user_ids, userId: items.uid});
          }
          return items;
        })
      });
  },
  getCountries ({commit, dispatch}) {
    return fetchCountries()
      .then((items) => {
        return dispatch('incrCheckAndWait').then(() => {
          commit('getCountries', {items});
          return items;
        });
      });
  },
  getCities ({commit, dispatch}, payload) {
    return fetchCities(payload)
      .then((items) => {
        return dispatch('incrCheckAndWait').then(() => {
          commit('getCities', {items, country_id: payload.country_id});
          return items;
        });
      });
  },
  getCommunityIdList ({commit, dispatch}, user_id) {
    return fetchCommunities({user_id})
      .then((items) => {
        return dispatch('incrCheckAndWait').then(() => {
          commit('getCommunityIdList', {items, user_id});
          return items;
        });
      });
  },
  getProfilesFromCommunity ({commit, dispatch}, payload) {
    return fetchMembers(payload)
      .then(items => {
        return dispatch('incrCheckAndWait').then(() => {
          commit('fetchedCommunitiesLength');
          commit('getProfilesFromCommunity', {items});
          return items;
        });
      });
  },
  getCountriesByCode ({dispatch, commit}, payload) {
    return fetchCountriesByCode(payload)
      .then(items => {
          return dispatch('incrCheckAndWait').then(() => {
            commit('getCountries', {items, payload});
            return items;
          });
      });
  },
  getNextNext ({dispatch, commit, state}, payload) {
    return dispatch('getCommunityIdList', payload.userId)
    // return actions.getCommunityIdList({ commit }, payload.userId)
      .then(items => {
        return actions.getNext({dispatch, commit, state}, {items, ...payload});
      });
  },
  getNext ({dispatch, commit, state}, {items, ...payload}) {
    // payload is options for profile searching
    items = items ? items : state.communityIdList[payload.userId];
    commit('setCurrentUser', payload);
    return dispatch('getProfilesFromCommunity', {
      group_id: items[state.index], ...payload
    }).then(profiles => {
      if (profiles) {
        console.log(state.index);
        const nextIndex = state.index + 1;
        if (nextIndex < items.length) {
          commit('setIndex', nextIndex);
        }
        console.log(state.index);
        return commit('getNext', {items: profiles});
      }
    })
  },
};

// getters are functions
export const getters = {
  getStateIndex: state => state.index,
  getCurrentCities: state => (country_id) => state.cities[country_id],
  getProfileList: state => state.profileList,
  getStoredUserId: state => (userId) => state.aliases[userId],
  getCurrentUserCommunities: state => state.communityIdList[state.currentUser.userId],
  getUserCommunities: state => (userId) => state.communityIdList[userId],
  getCurrentCommunityId: state => state.communityIdList[state.index],
  getNextCommunityId: state => state.communityIdList[state.index + 1],
};

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
