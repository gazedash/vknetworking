<template>
  <div id="shell">
    <div class="header">
      <app-header class="app-bar">
        <div class="left" slot="left">
          <search-button @click.native="open('top')"></search-button>
        </div>
        <div class="right" slot="right">
          <settings-button></settings-button>
          <logout></logout>
        </div>
      </app-header>
    </div>
    <my-popup position="top" :open="topPopup" @close="close('top')">
      <div class="paper">
        <div class="profile-link">
          <mu-text-field hintText="enter id or link" label="Profile" v-model.trim="profileLink"/>
        </div>
        <div class="control">
          <mu-flat-button @click="onSubmitLocal" label="GO!"/>
          <mu-flat-button @click="close('top')" label="HIDE"/>
        </div>
      </div>
    </my-popup>
    <group-list :list="list"></group-list>
  </div>
</template>

<script>
  import AppHeader from '../components/AppHeader'
  import GroupsButton from '../components/GroupsButton'
  import SettingsButton from '../components/SettingsButton'
  import Logout from '../components/Logout'
  import SearchHeader from './SearchHeader'
  import GroupList from './GroupList'
  import MyPopup from '../components/MyPopup'
  import SearchButton from '../components/SearchButton'
  import * as at from "../store/actionTypes";

  export default {
    name: 'groups',
    data() {
      return {
        profileLink: '',
        topPopup: true,
      };
    },
    computed: {
//      singles() {
//        return this.$store.getters.getSingle;
//      },
      list() {
        return this.$store.getters.getCommonGroups;
      },
//      size() {
//        return this.$store.state.friendCounter
//      },
    },
    methods: {
      onSubmitLocal() {
        this.close('top');
        let user_id = this.$store.getters.getUserId(this.profileLink);
        const fetchData = (user_id) => this.$store.dispatch(at.getFirstGroupNext, { user_id });
        if (user_id) {
          fetchData(user_id);
        } else {
          user_id = this.profileLink;
          if (user_id) {
            this.$store.dispatch(at.getUser, user_id).then((user) => {
              return fetchData(user.uid);
            });
          }
        }
      },
      open (position) {
        this[position + 'Popup'] = true
      },
      close (position) {
        this[position + 'Popup'] = false
      },
    },
    components: {
      AppHeader, GroupsButton, SettingsButton, Logout, GroupList, MyPopup, SearchButton
    },
  };
</script>

<style scoped>
  .header {
    padding-bottom: 64px;
  }

  .app-bar {
    width: 100%;
    position: fixed;
  }

  .paper {
    padding: 14px 25px 14px 25px;
  }
</style>
