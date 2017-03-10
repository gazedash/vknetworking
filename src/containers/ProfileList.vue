<template>
  <div>
    <mu-paper class="paper" :zDepth="1">
      <div class="list">
        <profile v-for="p in list" :profile="p"></profile>
      </div>
    </mu-paper>
    <div class="stats">Groups: {{ size }} Profiles: {{ list.length }}</div>
  </div>
</template>

<script>
  import Profile from '../components/Profile'
  import {isContentSmallerThanWindow, isBottomOfPage} from "../utils/index";
  import debounce from 'lodash/debounce';
  import * as at from "../store/actionTypes";

  export default {
    name: 'profile-list',
    props: ['list', 'size'],
    components: {
      Profile
    },
    methods: {
      fetchNew: debounce(
        function () {
          const {currentUser} = this.$store.state;
          if (currentUser) {
            this.$store.dispatch(at.getNext, currentUser)
          }
        }, 400),
    },
    computed: {
      items() {
        return {
          length: this.list.length,
          size: this.size,
          pageLength: document.documentElement.scrollHeight,
        }
      },
    },
    watch: {
      items(items, oldItems) {
        const diff = items.length - oldItems.length;
        const screenSizeIsNotChanged = items.pageLength === oldItems.pageLength;
        const notEnoughNewProfiles = isBottomOfPage() && (screenSizeIsNotChanged || diff < 5);
        if (notEnoughNewProfiles) {
            this.fetchNew();
        }
      },
    }
  }
</script>

<style scoped>
  .paper {
    display: block;
    padding: 0 0 10px 0;
  }

  .list {
    display: inline-flex;
    justify-content: center;
    flex-flow: row wrap;
  }

  .stats {
    margin: 8px 0 8px 0;
  }
</style>
