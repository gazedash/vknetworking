<template>
  <div>
    <div class="paper" :zDepth="1">
      <div class="list">
        <virtual-scroller
          :pageMode="true"
          contentClass="profile-list"
          class="scroller"
          :items="splitFilteredList"
          :item-height="height('pixels')">
          <template scope="props">
            <profile
              v-for="item in props.item"
              :item="item"
              :size="height('name')"
              :seen="seen(item.uid)"
              :key="item.uid"
              @open="open"
            ></profile>
          </template>
        </virtual-scroller>
      </div>
    </div>
    <div class="stats">Groups: {{ size }} Profiles:
      <span v-if="strategy === 'hide'">{{ filteredList.length }} / </span>
      <span>{{ list.length }}</span>
    </div>
  </div>
</template>

<script>
  import Profile from '../components/Profile'
  import { isBottomOfPage, isElementHigher, addOrRemoveListener, mediaQueryWidth } from '../utils/index';
  import debounce from 'lodash/debounce'
  import * as at from "../store/actionTypes"
  import { strategy as st } from "../const/index"
  import { onScroll } from '../utils'
  import flatten from 'lodash/flatten';

  export default {
    name: 'profile-list',
    props: ['list', 'size', 'ignoreList'],
    data () {
      return {
        lastScrollTop: 0,
        length: 4,
      };
    },
    components: {
      Profile,
    },
    mounted() {
      window.addEventListener('resize', this.handleWindowResize);
    },
    created() {
      this.$store.dispatch(at.changeStrategy);
      this.$store.dispatch(at.appendToIgnoreList);
      if (this.$store.state.strategy === st.darkenOnScroll) {
        window.addEventListener('scroll', this.darkenOnScrollListener);
      }
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.handleWindowResize);
      window.removeEventListener('scroll', this.darkenOnScrollListener);
    },
    computed: {
      splitFilteredList () {
        return _.chunk(this.filteredList, this.length);
      },
      filteredList () {
        if (this.strategy === st.hide) {
          return this.list.filter((p) => !this.show(p.uid));
        }
        return this.list;
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
      items: debounce(function(items, oldItems) {
        const diff = items.length - oldItems.length;
        const screenSizeIsNotChanged = items.pageLength === oldItems.pageLength;
        const notEnoughNewProfiles = isBottomOfPage() && (screenSizeIsNotChanged || diff < 5);
        if (notEnoughNewProfiles) {
          this.fetchNew();
        }
      }, 500),
    },
    methods: {
      handleWindowResize() {
        this.length = this.height('length');
      },
      height(value) {
          console.log(mediaQueryWidth());
        return mediaQueryWidth()[value];
      },
      open(uid) {
        this.$store.dispatch(at.appendToIgnoreList, { items: flatten([uid]) });
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
        function() {
          const { currentUser } = this.$store.state;
          if (currentUser) {
            this.$store.dispatch(at.getNext, currentUser)
          }
        }, 200),
      darkenOnScrollListener: debounce(
        function() {
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
    },
  };
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
