<template>
  <div>
    <mu-paper class="paper" :zDepth="1">
      <div class="list">
        <person v-for="el in items.list" :profile="el"></person>
      </div>
    </mu-paper>
    <div class="stats">Communities: {{ items.size }} Profiles: {{ items.list.length }}</div>
  </div>
</template>

<script>
  import Person from './Person'
  import {isContentSmallerThanWindow} from "../utils/index";
  import Vue from 'vue';
  import debounce from 'lodash/debounce';
  export default {
    name: 'profile-list',
    props: ['items'],
    components: {
      Person,
    },
    methods: {
      fetchIfNoScroll: debounce(
        function (user) {
          if (isContentSmallerThanWindow() && user) {
            this.$store.dispatch('getNext', user)
          }
        }, 400),
    },
    watch: {
      items(s, oldS) {
        console.log('WATCH SIZE', s, oldS, this.items);

        const {currentUser} = this.$store.state;
        this.fetchIfNoScroll(currentUser);
      }
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
