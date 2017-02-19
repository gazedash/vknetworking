import App from "./App";
import {fetchCommunities, fetchMembers} from "./vk_api";
import Vue from "vue";
import Rx from "rxjs/Rx";
import {isBottomOfPage} from "./utils/index";
import store from './store'

const groupStream = Rx.Observable.fromPromise(fetchCommunities(126125228))
  .flatMap(el => Rx.Observable.from(el))
  .bufferCount(1);

 let prom;
 const scrollStream = Rx.Observable.fromEvent(window, 'scroll')
   .filter(() => {
     if (isBottomOfPage()) console.log("Bottom of page");
     return isBottomOfPage();
   }).throttleTime(500);
 scrollStream.subscribe(el => {
   app.$store.dispatch('getNextNext', { userId: 126125228, city: 139});
 });
/* eslint-disable no-new */
const app = new Vue({
  el: '#app',
  store,
  data: {
    index: 0,
  },
  created() {
    this.$store.dispatch('getNextNext', { userId: 126125228, city: 139});
  },
  computed: {
    list () {
      return this.$store.getters.getProfileList
    },
  },
  mounted() {
    console.log({store: this.$store.state});
  },
  template: '<App :list="list"/>',
  components: { App }
});
//
// function find(el, i) {
//   console.log({i: app.index});
//   prom = Rx.Observable.fromPromise(fetchMembers(el, 139));
//   return prom.subscribe(
//     (members) => {
//       app.index = i + 1;
//       return members.length;
//     },
//     () => false,
//   );
// }
//
// function exec(i = 0) {
//   return groupStream.skip(i).find(find).map(() => {
//     return prom;
//   })
// }
//
// const initial = exec(app.index);
// initial.subscribe(el => {
//   el.subscribe((da) => {
//     console.log(da.length);
//     app.list = app.list.concat(da);
//   });
// });
