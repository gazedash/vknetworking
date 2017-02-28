import App from "./App";
import Login from "./components/Login";
import Vue from "vue";
import store from './store'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import VueRouter from 'vue-router'
import auth from './utils/auth'

Vue.use(MuseUI);
Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: App, beforeEnter: auth.requireAuth },
    { path: '/login', component: Login },
    { path: '/auth', beforeEnter: auth.redirected },
    { path: '/logout', beforeEnter: auth.logout }
  ]
});
/* eslint-disable no-new */
const app = new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
});
