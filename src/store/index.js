import Vue from 'vue'
import Vuex from 'vuex'
import {fetchCommunities, fetchMembers, fetchCountries, fetchCities} from "../vk_api/index";
import uniqBy from 'lodash/uniqBy';

Vue.use(Vuex);

const state = {
  index: 0,
  fetchedCommunitiesLength: 0,
  profileList: [],
  communityIdList: [],
  countries: [],
  cities: {},
};

// mutations are operations that actually mutates the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
  setIndex (state, index) {
    state.index = index
  },
  fetchedCommunitiesLength (state) {
    state.fetchedCommunitiesLength++;
  },
  getCommunityIdList (state, {items}) {
    state.communityIdList = state.communityIdList.concat(items)
  },
  getProfilesFromCommunity (state, {items}) {
    state.profileList = uniqBy(state.profileList.concat(items), 'uid');
  },
  getCountries (state, {items}) {
    state.countries = uniqBy(state.countries.concat(items), 'cid');
  },
  getCities (state, {items, country_id}) {
    state.cities[country_id] = items;
  },
  getNextNext (state, {items}) {
    mutations.getNext(state, {items});
  },
  getNext (state, {items}) {
    mutations.getProfilesFromCommunity(state, {items});
  },
};

// actions are functions that causes side effects and can involve
// asynchronous operations.
const actions = {
  setIndex: ({ commit }, index) => commit('setIndex', index),
  getCountries ({ commit }) {
    return fetchCountries()
      .then((items) => {
        return commit('getCountries', {items});
      });
  },
  getCities ({commit}, payload) {
    return fetchCities(payload)
      .then((items) => commit('getCities', {items, country_id: payload.country_id}));
  },
  getCommunityIdList ({ commit }, userId) {
    return fetchCommunities(userId)
      .then((items) => {
        commit('getCommunityIdList', {items});
        return items;
      });
  },
  getProfilesFromCommunity ({ commit }, payload) {
    return fetchMembers(payload)
      .then(items => {
        commit('fetchedCommunitiesLength');
        commit('getProfilesFromCommunity', {items});
        return items;
      });
  },
  getNextNext ({ dispatch, commit, state }, payload) {
    return dispatch('getCommunityIdList', payload.userId)
    // return actions.getCommunityIdList({ commit }, payload.userId)
      .then(items => {
        return actions.getNext({ dispatch, commit, state }, { items, ...payload});
      });
  },
  getNext ({ dispatch, commit, state }, {items, ...payload}) {
    // payload is options for profile searching
    return dispatch('getProfilesFromCommunity', {
    id: items[state.index], ...payload
  }).then(items => {
        if (items) {
          commit('setIndex', state.index + 1);
          return commit('getNext', {items});
        }
        // const index = getters.getStateIndex(state);
        // actions.getNext({commit, state}, payload);
      })
  },
};

// getters are functions
const getters = {
  getStateIndex: state => state.index,
  getProfileList: state => state.profileList,
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
