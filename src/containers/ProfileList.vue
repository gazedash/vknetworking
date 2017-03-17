<template>
  <div>
    <mu-paper class="paper" :zDepth="1">
      <div class="list">
        <profile
          v-for="p in filteredList"
          :profile="p"
          :key="p.uid"
          :seen="seen(p.uid)"
          @open="open"></profile>
      </div>
    </mu-paper>
    <div class="stats">Groups: {{ size }} Profiles:
      <span v-if="strategy === 'hide'">{{ filteredList.length }} / </span>
      {{ list.length }}</div>
  </div>
</template>

<script>
  import Profile from '../components/Profile'
  import {isBottomOfPage, show, isElementHigher, addOrRemoveListener} from "../utils/index"
  import debounce from 'lodash/debounce'
  import * as at from "../store/actionTypes"
  import {strategy as st} from "../const/index"
  import {onScroll} from '../utils'
  import flatten from 'lodash/flatten';

  export default {
    name: 'profile-list',
    props: ['list', 'size', 'ignoreList'],
    data () {
      return {
        lastScrollTop: 0
      }
    },
    components: {
      Profile
    },
    created() {
      this.$store.dispatch(at.changeStrategy);
      this.$store.dispatch(at.appendToIgnoreList);
      if (this.$store.state.strategy === st.darkenOnScroll) {
        window.addEventListener('scroll', this.darkenOnScrollListener)
      }
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.darkenOnScrollListener)
    },
    computed: {
      filteredList () {
        return this.list.filter((p) => !this.show(p.uid));
      },
      children() {
        return this.$children[0].$children;
      },
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
      strategy(newStrategy, oldStrategy) {
        addOrRemoveListener({
          newStrategy,
          oldStrategy,
          cmpStrategy: st.darkenOnScroll,
          listener: this.darkenOnScrollListener
        });
      },
      items(items, oldItems) {
        const diff = items.length - oldItems.length;
        const screenSizeIsNotChanged = items.pageLength === oldItems.pageLength;
        const notEnoughNewProfiles = isBottomOfPage() && (screenSizeIsNotChanged || diff < 5);
        if (notEnoughNewProfiles) {
          this.fetchNew();
        }
      }
    },
    methods: {
      open(uid) {
        this.$store.dispatch(at.appendToIgnoreList, {items: flatten([uid])});
      },
      show(uid) {
        const strategy = this.strategy === st.hide;
        return this.ignoreList.includes(uid) && strategy;
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
        }, 200),
      darkenOnScrollListener: debounce(
        function () {
          this.lastScrollTop = onScroll(this.lastScrollTop, () => {
            if (this.children) {
              const seenArray = this.children.reduce((newArray, child) => {
                const uid = child.$props.profile.uid;
                if (isElementHigher(child.$el) && uid) {
                  newArray.push(uid);
                }
                return newArray;
              }, []);
              this.open(seenArray);
            }
          });
        }, 1000),
    }
  }
</script>

<style scoped>
  .paper {
    display: block;
    padding: 0 0 10px 0;
    margin-bottom: 10px;
  }

  .list {
    display: inline-flex;
    justify-content: center;
    flex-flow: row wrap;
  }

  .stats {
    background-color: #333;
    color: #fff;
    width: 100%;
    text-align: center;
    position: fixed;
    bottom: 0;
  }
</style>
