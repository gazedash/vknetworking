<template>
  <div id="shell">
    <search-header></search-header>
    <profile-list v-if="friendList.length" :list="friendList" :ignoreList="ignoreList"></profile-list>
    <profile-list v-else :size="size" :list="list" :ignoreList="ignoreList"></profile-list>
  </div>
</template>

<script>
  import { user } from '../utils/auth';
  import * as mt from '../store/mutationTypes';
  import SearchHeader from './SearchHeader'
  import ProfileList from './ProfileList'

  export default {
    name: 'shell',
    created() {
      if (user.token) {
        this.$store.commit(mt.setToken, user.token);
      }
    },
    computed: {
      friendList() {
        return this.$store.state.friendListFoF;
      },
      ignoreList() {
        return this.$store.state.ignoreList
      },
      list () {
        return this.$store.getters.getProfileList
      },
      size () {
        return this.$store.state.fetchedGroupsLength
      },
    },
    components: {
      SearchHeader, ProfileList
    },
  }
</script>

<style scoped>
  #shell {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
