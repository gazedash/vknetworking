<template>
  <div>
    <group
      v-for="item, id in filteredList"
      :item="item"
      :key="id"
    ></group>
    <div class="stats">Groups: {{ size }} Friends:
      <span>{{ list.length }}</span>
      <single v-for="s, id in singles" :key="id" :item="s"></single>
    </div>
  </div>
</template>

<script>
  import Group from '../components/Group'
  import Single from '../components/Single'
  import * as at from "../store/actionTypes"
  import _ from 'lodash';

  export default {
    name: 'group-list',
    props: ['list', 'size', 'singles'],
    data () {
      return {
//        lastScrollTop: 0
      };
    },
    components: {
      Group, Single
    },
    beforeDestroy () {
//      window.removeEventListener('scroll', this.fetchNew)
    },
    computed: {
      filteredList () {
        return _.sortBy(this.list, ['data', 'length']).reverse();
      },
      items() {
        return {
          length: this.filteredList.length,
          pageLength: document.documentElement.scrollHeight
        };
      },
    },
    methods: {
//      fetchNew: _.debounce(
//        function () {
//          if (isBottomOfPage()) {
//            console.log(_.isEmpty(this.$store.state.groupCommonFriends), this.$store.state.groupCommonFriends);
//            if (_.isEmpty(this.$store.state.groupCommonFriends)) {
//              this.$store.dispatch(at.getFirstGroupNext, {user_id: XXX});
//            } else {
//              this.$store.dispatch(at.getFirstGroup, {user_id: XXX})
//            }
//          }
//        }, 1000),
    },
    watch: {
      items(items, oldItems) {
//        const diff = items.length - oldItems.length;
//        console.log(items, oldItems);
//        const screenSizeIsNotChanged = items.pageLength === oldItems.pageLength;
//        const notEnoughNewProfiles = isBottomOfPage() && (screenSizeIsNotChanged);
//        if (notEnoughNewProfiles) {
//          this.fetchNew();
//        }
      }
    }
  }
</script>

<style scoped>
</style>
