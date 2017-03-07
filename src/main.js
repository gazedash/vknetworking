import App from "./App";
import Shell from "./containers/Shell";
import Login from "./components/Login";
import Vue from "vue";
import store from './store'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import VueRouter from 'vue-router'
import {redirected, logout, ifLoggedIn, requireAuth, initialCheck} from './utils/auth'

Vue.use(MuseUI);
Vue.use(VueRouter);

initialCheck();

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Shell, beforeEnter: requireAuth },
    { path: '/login', component: Login, beforeEnter: ifLoggedIn },
    { path: '/auth', beforeEnter: redirected },
    { path: '/logout', beforeEnter: logout }
  ]
});
/* eslint-disable no-new */
const app = new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
});
