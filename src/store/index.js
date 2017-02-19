import Vue from 'vue'
import Vuex from 'vuex'
import {fetchCommunities, fetchMembers} from "../vk_api/index";

Vue.use(Vuex);

const state = {
  index: 0,
  profileList: [],
  communityIdList: [],
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
  getCommunityIdList (state, {items}) {
    state.communityIdList = state.communityIdList.concat(items)
  },
  getProfilesFromCommunity (state, {items}) {
    state.profileList = state.profileList.concat(items)
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
  getCommunityIdList ({ commit }, userId) {
    return fetchCommunities(userId)
      .then((items) => {
        commit('getCommunityIdList', {items});
        return items;
      });
  },
  getProfilesFromCommunity ({ commit }, payload) {
    console.log(payload);
    return fetchMembers(payload)
      .then(items => {
        console.log({items, payload});
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
  getNext ({ dispatch, commit, state, ...rest }, {items, ...payload}, rest2) {
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
