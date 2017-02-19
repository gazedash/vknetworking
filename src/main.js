import App from './App';
 import {fetchCommunities, fetchMembers} from './vk_api'
 import Vue from 'vue'
 import Rx from 'rxjs/Rx'
import {isBottomOfPage} from "./utils/index";
 const groupStream = Rx.Observable.fromPromise(fetchCommunities(126125228))
   .flatMap(el => Rx.Observable.from(el))
   .bufferCount(1);
 let prom;
 const scrollStream = Rx.Observable.fromEvent(window, 'scroll')
   .filter(() => {
     if (isBottomOfPage()) console.log("Bottom of page");
     return isBottomOfPage();
   }).throttleTime(500);
 scrollStream.subscribe(el => console.log(el));
/* eslint-disable no-new */
const app = new Vue({
  el: '#app',
  data: {
    list: [],
  },
  mounted() {
    console.log('mounted');
  },
  template: '<App :list="list"/>',
  components: { App }
});

const initial = groupStream.find(el => {
  prom = Rx.Observable.fromPromise(fetchMembers(el, 139));
  return prom.subscribe(
    (members) => members.length,
    () => false,
  );
}).map(() => {
  return prom;
});

initial.subscribe(el => {
  el.subscribe((da) => {
    console.log(da);
    app.list = app.list.concat(da)
  });
});
