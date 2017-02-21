import App from "./App";
import Vue from "vue";
import {Observable} from "rxjs/Rx";
import {isBottomOfPage} from "./utils/index";
import store from './store'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
Vue.use(MuseUI);
/* eslint-disable no-new */
const app = new Vue({
  el: '#app',
  store,
  created() {
    this.$store.dispatch('getCountries');
    // this.$store.dispatch('getNextNext', { userId: 126125228, city: 139, has_photo: 1});
    // const scrollStream = Observable.fromEvent(window, 'scroll')
    //   .filter(() => {
    //     if (isBottomOfPage()) console.log("Bottom of page");
    //     return isBottomOfPage();
    //   }).throttleTime(500);
    // scrollStream.subscribe(() => {
    //   this.$store.dispatch('getNextNext', { userId: 126125228, city: 139, has_photo: 1});
    // });
  },
  template: '<App/>',
  components: { App }
});
