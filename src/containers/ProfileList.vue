<template>
  <div>
    <mu-paper class="paper" :zDepth="1">
      <div class="list">
        <profile key="p.uid" v-show="show(p.uid)" :seen="seen(p.uid)" @open="open" v-for="p in list" :profile="p"></profile>
      </div>
    </mu-paper>
    <div class="stats">Groups: {{ size }} Profiles: {{ list.length }}</div>
  </div>
</template>

<script>
  import Profile from '../components/Profile'
  import {isBottomOfPage, show} from "../utils/index";
  import debounce from 'lodash/debounce';
  import * as at from "../store/actionTypes";
  import {strategy as st} from "../const/index";

  export default {
    name: 'profile-list',
    props: ['list', 'size', 'ignoreList'],
    components: {
      Profile
    },
    created() {
      this.$store.dispatch(at.changeStrategy);
      this.$store.dispatch(at.appendToIgnoreList)
    },
    methods: {
      open(uid) {
          this.$store.dispatch(at.appendToIgnoreList, {items: [uid]});
      },
      show(uid) {
        return show(this.strategy, !this.ignoreList.includes(uid));
      },
      seen(uid) {
        const strategy = this.strategy === st.noop;
        return this.ignoreList.includes(uid) && !strategy;
      },
      fetchNew: debounce(
        function () {
          const {currentUser} = this.$store.state;
          if (currentUser) {
            this.$store.dispatch(at.getNext, currentUser)
          }
        }, 400)
    },
    computed: {
      strategy() {
        return this.$store.state.strategy;
      },
      items() {
        return {
          length: this.list.length,
          pageLength: document.documentElement.scrollHeight
        }
      }
    },
    watch: {
      items(items, oldItems) {
        const diff = items.length - oldItems.length;
        const screenSizeIsNotChanged = items.pageLength === oldItems.pageLength;
        const notEnoughNewProfiles = isBottomOfPage() && (screenSizeIsNotChanged || diff < 5);
        if (notEnoughNewProfiles) {
            this.fetchNew();
        }
      }
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
