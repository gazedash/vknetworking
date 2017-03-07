<template>
  <div>
    <mu-paper class="paper" :zDepth="1">
      <div class="list">
        <person v-for="el in list" :profile="el"></person>
      </div>
    </mu-paper>
    <div class="stats">Communities: {{ size }} Profiles: {{ list.length }}</div>
  </div>
</template>

<script>
  import Person from '../components/Person'
  import {isContentSmallerThanWindow, isBottomOfPage} from "../utils/index";
  import debounce from 'lodash/debounce';

  export default {
    name: 'profile-list',
    props: ['list', 'size'],
    components: {
      Person,
    },
    methods: {
      fetchNew: debounce(
        function () {
          const {currentUser} = this.$store.state;
          if (currentUser) {
            this.$store.dispatch('getNext', currentUser)
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
//        const notEnoughNewProfiles = isBottomOfPage() && (screenSizeIsNotChanged || diff < 5);
//        const noNewProfiles = items.length === oldItems.length && items.size !== oldItems.size;
        if (notEnoughNewProfiles) {
//        if (isContentSmallerThanWindow() && noNewProfiles) {
            this.fetchNew();
        }
      },
    }
  }
</script>

<style scoped>
  .list {
    margin: 4.5em 0 10px 0;
    display: inline-flex;
    justify-content: center;
    flex-flow: row wrap;
  }

  .stats {
    margin: 8px 0 8px 0;
  }
</style>
