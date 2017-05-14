<template>
  <div>
    <div class="paper" :zDepth="1">
      <div class="list">
        <virtual-scroller
          :pageMode="true"
          contentClass="profile-list"
          class="scroller"
          ref="vueVirtualScroller"
          :items="splitFilteredList"
          :item-height="height('pixels')">
          <template scope="props">
            <profile
              v-for="item in props.item"
              :item="item"
              :size="height('name')"
              :key="item.uid"
              @open="open"
            ></profile>
          </template>
        </virtual-scroller>
      </div>
    </div>
    <div class="stats">Groups: {{ size }} Profiles:
      <span v-if="strategy === 'hide'">{{ splitFilteredList.length * this.length }} / </span>
      <span>{{ list.length }}</span>
    </div>
  </div>
</template>

<script>
  /* eslint-disable func-names */

  import Profile from '../components/Profile'
  import {
    isBottomOfPage,
    isElementHigher,
    addOrRemoveListener,
    mediaQueryWidth,
    isElementInViewport
  } from '../utils/index';
  import debounce from 'lodash/debounce'
  import * as at from "../store/actionTypes"
  import { strategy as st } from "../const/index"
  import { onScroll } from '../utils'
  import { flatten, findLast, differenceWith, every } from 'lodash';

  export default {
    name: 'profile-list',
    props: ['list', 'size', 'ignoreList'],
    data () {
      return {
        lastScrollTop: 0,
        checkScroll: false,
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
      this.handleWindowResize();
      this.$store.dispatch(at.changeStrategy);
      this.$store.dispatch(at.appendToIgnoreList);
      if (this.$store.state.strategy === st.darkenOnScroll) {
        window.addEventListener('scroll', this.darkenOnScrollListener);
      }
    },
    updated() {
      this.scrollTopIfNoVisibleItems();
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.handleWindowResize);
      window.removeEventListener('scroll', this.darkenOnScrollListener);
    },
    computed: {
      splitFilteredList () {
        let list = this.list;
        if (this.strategy === st.hide) {
          list = differenceWith(list, this.ignoreList, (arrVal, othVal) => arrVal.uid === othVal);
        } else {
          if (this.strategy !== st.noop) {
            list = this.list
              .map(item => ({ ...item, seen: this.show(item.uid) }));
          }
          if (this.strategy === st.lastFm) {
            list = this.list
              .filter(el => !!el.site && el.site.match(/last\.?fm(.ru)?\/user\/[a-zA-Z0-9_-]{2,14}/gi));
          }
        }
        return _.chunk(list, this.length);
      },
      strategy() {
        return this.$store.state.strategy;
      },
      items() {
        return {
          length: this.list.length,
          pageLength: document.documentElement.scrollHeight,
        };
      },
    },
    watch: {
      strategy(newStrategy, oldStrategy) {
        if (newStrategy !== oldStrategy && newStrategy === st.hide) {
          this.checkScroll = true;
        }
        addOrRemoveListener({
          newStrategy,
          oldStrategy,
          cmpStrategy: st.darkenOnScroll,
          listener: this.darkenOnScrollListener,
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
      scrollTopIfNoVisibleItems() {
        if (this.checkScroll) {
          this.checkScroll = false;
          const children = this.$refs.vueVirtualScroller.$children;
          children.shift();
          const child = every(children, el => isElementHigher(el.$el));
          // all not in viewport
          if (child) {
            window.scroll(0, 0);
          }
        }
      },
      handleWindowResize() {
        this.length = this.height('length');
      },
      height(value) {
        return mediaQueryWidth()[value];
      },
      open(uid) {
        this.$store.dispatch(at.appendToIgnoreList, { items: flatten([uid]) });
      },
      show(uid) {
        return this.ignoreList.includes(uid);
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
            const children = this.$refs.vueVirtualScroller.$children;
            children.shift();
            const child = findLast(children, el => isElementHigher(el.$el));
            if (child) {
              const { uid } = child.$props.item;
              const seenArray = this.list
                .slice(0, this.list.findIndex(el => el.uid === uid))
                .map(el => el.uid);
              this.open(seenArray);
            }
          });
        },
        1000
      ),
    },
  }
  ;
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
