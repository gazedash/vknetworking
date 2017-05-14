import Vue from 'vue';
import MuseUI from 'muse-ui';
import VueRouter from 'vue-router';
import { VirtualScroller } from 'vue-virtual-scroller/dist/vue-virtual-scroller';
import 'muse-ui/dist/muse-ui.css';
import store from './store';
import App from './App';
import Shell from './containers/Shell';
import Settings from './containers/Settings';
// import Groups from './containers/Groups';
import Login from './components/Login';
import { ifLoggedIn, initialCheck, redirected, requireAuth } from './utils/auth';
import lazy from './directives/lazy';

Vue.component('virtual-scroller', VirtualScroller);
Vue.use(MuseUI);
Vue.use(VueRouter);

Vue.directive(
  'lazy',
  lazy,
);

initialCheck();

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Shell, beforeEnter: requireAuth },
    { name: 'settings', path: '/settings', component: Settings, beforeEnter: requireAuth },
    // { name: 'groups', path: '/groups', component: Groups, beforeEnter: requireAuth },
    { name: 'login', path: '/login', component: Login, beforeEnter: ifLoggedIn },
    { path: '/auth', beforeEnter: redirected },
  ],
});
/* eslint-disable no-new */
const app = new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
