import App from "./App";
import Vue from "vue";
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
  },
  computed: {
    list () {
      return this.$store.getters.getProfileList
    },
    size() {
      return this.$store.state.fetchedCommunitiesLength
    }
  },
  template: '<App :list="list"/>',
  components: { App }
});
