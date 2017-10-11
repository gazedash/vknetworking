import Vue from 'vue';
import MuseUI from 'muse-ui';
import VueRouter from 'vue-router';
import {
  VirtualScroller,
} from 'vue-virtual-scroller/dist/vue-virtual-scroller';
import 'muse-ui/dist/muse-ui.css';
import store from './store';
import App from './App';
import Shell from './containers/Shell';
import Settings from './containers/Settings';
import Groups from './containers/Groups';
import Login from './components/Login';
import {
  ifLoggedIn,
  initialCheck,
  redirected,
  requireAuth,
} from './utils/auth';
import fetchJsonp from 'fetch-jsonp';
import lazy from './directives/lazy';
Vue.component('virtual-scroller', VirtualScroller);
Vue.use(MuseUI);
Vue.use(VueRouter);

Vue.directive('lazy', lazy);

initialCheck();
const people = [
  {
    uid: 170172245,
    first_name: 'Igor',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c639431/v639431245/1e11f/s66TOtud5xw.jpg',
    site: '',
  },
  {
    uid: 7111880,
    first_name: 'Dmitry',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c633130/v633130880/3fb89/A-0m_qlU2V4.jpg',
    site: '',
  },
  {
    uid: 83476732,
    first_name: 'Antonina',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c638624/v638624732/2b4ff/b4uhC-sODec.jpg',
    site: '',
  },
  {
    uid: 167648146,
    first_name: 'Margarita',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c836230/v836230146/34bc2/P3TK5TFFhdI.jpg',
    site: 'http://ask.fm/swiggyshawty',
  },
  {
    uid: 336794164,
    first_name: 'Yulya',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c626427/v626427164/1df5e/BAg7LemcZK4.jpg',
    site: '',
  },
  {
    uid: 257865342,
    first_name: 'Margarita',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c836325/v836325342/4b271/ht9WQGZk9tg.jpg',
    site: '',
  },
  {
    uid: 161339407,
    first_name: 'Tatyana',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c617330/v617330407/202ea/_e9Jr33Owng.jpg',
    site: '',
  },
  {
    uid: 7152019,
    first_name: 'Ekaterina',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c629314/v629314019/4261e/tO25Vp--5dg.jpg',
    site: '',
  },
  {
    uid: 5027489,
    first_name: 'Dmitry',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c637425/v637425489/15354/QCT0cvWJmrM.jpg',
    site: '',
  },
  {
    uid: 24420024,
    first_name: 'Katya',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c633128/v633128024/2855c/Oth8zwkYyQs.jpg',
    site: '',
  },
  {
    uid: 54709717,
    first_name: 'Lena',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c626125/v626125717/6c5aa/Hfl_IczIKD4.jpg',
    site: '',
  },
  {
    uid: 75618414,
    first_name: 'Darya',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c840135/v840135414/59e0/FYDS08UOEKw.jpg',
    site: '',
  },
  {
    uid: 4862721,
    first_name: 'Roman',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c626330/v626330721/4d951/WYzKogT-Kc0.jpg',
    site: '',
  },
  {
    uid: 297509088,
    first_name: 'Iskra',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c624726/v624726088/22ecf/g4rSqRJWZRc.jpg',
    site: '',
  },
  {
    uid: 2257790,
    first_name: 'Boris',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c631916/v631916790/4398f/uBuqtNbP2FM.jpg',
    site: '',
  },
  {
    uid: 1837961,
    first_name: 'Ksyusha',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c638130/v638130961/431de/3jGLuvKyRv8.jpg',
    site: 'https://www.instagram.com/xeniababichlove/',
  },
  {
    uid: 912880,
    first_name: 'Alexander',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c10987/u912880/d_fb43deca.jpg',
    site: '',
  },
  {
    uid: 17919466,
    first_name: 'Sergey',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c625323/v625323466/532d4/7q1HDo2XgAs.jpg',
    site: ' Loading... ██████████████] 100%',
  },
  {
    uid: 6688905,
    first_name: 'Roman',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c631330/v631330905/ee17/9Eqlrv6-fzo.jpg',
    site: '',
  },
  {
    uid: 305817228,
    first_name: 'Edvard',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c625117/v625117228/4f1a5/dOHthkSEFbE.jpg',
    site: 'artemida28.ru',
  },
  {
    uid: 17476,
    first_name: 'Anton',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c830/u17476/d_81ea591e.jpg',
    site: 'http://malysh87.livejournal.com',
  },
  {
    uid: 909132,
    first_name: 'Semyon',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c625727/v625727132/6690/7q164W6nLu0.jpg',
    site: 'http://500px.com/ba7/',
  },
  {
    uid: 34408174,
    first_name: 'Vladislav',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c636926/v636926174/5d282/ns_7PwN0LPY.jpg',
    site: '',
  },
  {
    uid: 1391273,
    first_name: 'Sergey',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c33/u1391273/d_d8811da2.jpg',
    site: '',
  },
  {
    uid: 36494802,
    first_name: 'Alexander',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c633324/v633324802/2dc6e/a_lKHNOAxaM.jpg',
    site: 'www.agcoins.ru',
  },
  {
    uid: 176916203,
    first_name: 'Alexandra',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c638517/v638517203/3fce7/sPfkaGazahg.jpg',
    site: '',
  },
  {
    uid: 348331287,
    first_name: 'Andrey',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c630728/v630728287/4ac92/tVVL_f7bryo.jpg',
    site: '',
  },
  {
    uid: 199295426,
    first_name: 'Lena',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c604422/v604422426/20753/rTVyvVSbjis.jpg',
    site: '',
  },
  {
    uid: 193557320,
    first_name: 'Vladimir',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c637822/v637822320/24b1b/n6FCd-Bc5I8.jpg',
    site: '',
  },
  {
    uid: 173119132,
    first_name: 'Vitaly',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c624924/v624924132/35f4c/ywxIYVyMWtI.jpg',
    site: '',
  },
  {
    uid: 354535813,
    first_name: 'Vasily',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c836734/v836734813/31d39/jckShRlOyaU.jpg',
    site: '',
  },
  {
    uid: 123316157,
    first_name: 'Olga',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c836137/v836137157/313d/b2NSqdXf7wo.jpg',
    site: '',
  },
  {
    uid: 76575775,
    first_name: 'Kirill',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c630022/v630022775/39e45/D67XVO4Mc0I.jpg',
    site: '',
  },
  {
    uid: 2109462,
    first_name: 'Nikolay',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c618323/v618323462/1e930/eSOcgbprUhM.jpg',
    site: 'https://itunes.apple.com/ru/movie/burime-igry-v-temnote/id884491592?ls=1',
  },
  {
    uid: 3535380,
    first_name: 'Olga',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c836226/v836226380/419eb/wznjDWRdfjY.jpg',
    site: '',
  },
  {
    uid: 6373925,
    first_name: 'Anastasia',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c636721/v636721925/5ba7d/0PjLh8vyLXQ.jpg',
    site: '',
  },
  {
    uid: 247277914,
    first_name: 'Alyona',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c837636/v837636914/35691/6qvUdvlUu7s.jpg',
    site: '',
  },
  {
    uid: 262587590,
    first_name: 'Varya',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c639231/v639231590/858f/EA_TuoP7g6E.jpg',
    site: '',
  },
  {
    uid: 194192871,
    first_name: 'Yulya',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c639920/v639920871/2194d/vjdbpQZaMdA.jpg',
    site: '',
  },
  {
    uid: 12584831,
    first_name: 'Anna',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c639826/v639826831/1f069/uFv5LgAct1Y.jpg',
    site: '',
  },
  {
    uid: 184059240,
    first_name: 'Misha',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c608522/v608522240/4390/AAm0S16YaFI.jpg',
    site: '',
  },
  {
    uid: 334234669,
    first_name: 'Vlad',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c639225/v639225669/1ec07/ez7aM4qH9aw.jpg',
    site: '',
  },
  {
    uid: 282536156,
    first_name: 'Nikita',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c604629/v604629156/14a35/Z0VMIYZ_0nQ.jpg',
    site: 'вапкеыа125346е5476',
  },
  {
    uid: 266412076,
    first_name: 'Vlad',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c836639/v836639076/51bc7/7bIR2hqfevI.jpg',
    site: '',
  },
  {
    uid: 242306985,
    first_name: 'Aliosha',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c624325/v624325985/7d45/YppZ9NEETSU.jpg',
    site: '',
  },
  {
    uid: 239503260,
    first_name: 'Sabina',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c624531/v624531260/3642/1dcImVlNFek.jpg',
    site: 'нууу ето личная информация!',
  },
  {
    uid: 231960665,
    first_name: 'Alexander',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c313725/v313725665/55ed/CNkRcksjCsA.jpg',
    site: '',
  },
  {
    uid: 219391313,
    first_name: 'Alexey',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c314518/v314518313/1eba/swcyKYMH-bU.jpg',
    site: 'https://vk.com/black_hole_inc  https://vk.com/id219391313',
  },
  {
    uid: 214508854,
    first_name: 'Seryozha',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c618816/v618816854/3757/k03ywHTNyHM.jpg',
    site: '',
  },
  {
    uid: 122104956,
    first_name: 'Kirill',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c636619/v636619956/26ee3/VaahvLACREw.jpg',
    site: '',
  },
  {
    uid: 79569267,
    first_name: 'Evgeny',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c413024/v413024267/2c3c/jTePeIJ2TRs.jpg',
    site: 'мыши сьели',
  },
  {
    uid: 151674929,
    first_name: 'Anastasia',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c633222/v633222929/470ce/P8xsut8QPio.jpg',
    site: '',
  },
  {
    uid: 91381697,
    first_name: 'Maria',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c639219/v639219697/17b50/4MwjDNbr8zA.jpg',
    site: '',
  },
  {
    uid: 353361040,
    first_name: 'Sergey',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c621618/v621618040/3fb18/fn5JmX8wndI.jpg',
    site: '',
  },
  {
    uid: 311425930,
    first_name: 'Vladimir',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c623630/v623630930/37b66/icvVgNEEXkQ.jpg',
    site: '',
  },
  {
    uid: 202189613,
    first_name: 'Natalya',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c638119/v638119613/1bb3a/v9Objt1PAQo.jpg',
    site: '',
  },
  {
    uid: 175284838,
    first_name: 'Vlad',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c840123/v840123838/7ca/AOJRIcCDH_M.jpg',
    site: '',
  },
  {
    uid: 40779314,
    first_name: 'Anton',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c616223/v616223314/527e/B56-aIcFjp0.jpg',
    site: '',
  },
  {
    uid: 14894405,
    first_name: 'Danila',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c636728/v636728405/5ec49/IyRTi3iKHwk.jpg',
    site: '',
  },
  {
    uid: 376641958,
    first_name: 'Mikhail',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c837223/v837223958/39fae/-5Xltgn_HOg.jpg',
    site: '',
  },
  {
    uid: 292808435,
    first_name: 'Vladimir',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c837223/v837223435/3f6dc/yfvxdwJaiIs.jpg',
    site: '',
  },
  {
    uid: 265631148,
    first_name: 'Roman',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c622721/v622721148/17154/FNVqBVNBjt8.jpg',
    site: '',
  },
  {
    uid: 233868404,
    first_name: 'Bogdan',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c625428/v625428404/47d86/TJpQz2DsBbw.jpg',
    site: 'pycavlad.com',
  },
  {
    uid: 138132999,
    first_name: 'Anastasia',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c631728/v631728999/4ab3d/b5i24hSYfVc.jpg',
    site: '',
  },
  {
    uid: 288727220,
    first_name: 'Mikhaylo',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c638728/v638728220/42d6d/yY6TY5RqMYs.jpg',
    site: 'https://vk.com/app638461_288727220',
  },
  {
    uid: 255126862,
    first_name: 'Anna',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c638921/v638921862/1f8e4/YvIfixBie-g.jpg',
    site: '',
  },
  {
    uid: 226947792,
    first_name: 'Boris',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c837534/v837534792/483f3/7wFrnMfGJ4k.jpg',
    site: '',
  },
  {
    uid: 37833370,
    first_name: 'Alexey',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c836735/v836735370/4e918/NjMt_RWiHFM.jpg',
    site: '',
  },
  {
    uid: 346616188,
    first_name: 'Anton',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c637628/v637628188/290e6/xPl5aaijVKQ.jpg',
    site: '',
  },
  {
    uid: 145181328,
    first_name: 'Liza',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c312524/v312524328/57f3/jvMtxzLc8u4.jpg',
    site: '',
  },
  {
    uid: 281479922,
    first_name: 'Maria',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c836332/v836332922/4be73/5wjnmCi57K0.jpg',
    site: '',
  },
  {
    uid: 250912510,
    first_name: 'Catherine',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c608820/v608820510/4994/XuAjizamLzo.jpg',
    site: '',
  },
  {
    uid: 209449238,
    first_name: 'Maxim',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c639724/v639724238/28dda/1zZ-O0lPzfE.jpg',
    site: '',
  },
  {
    uid: 283158116,
    first_name: 'Vova',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c629101/v629101116/167d8/bgkwnEKRyzA.jpg',
    site: '',
  },
  {
    uid: 226023898,
    first_name: 'Alex',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c320928/v320928898/8cb0/h0CbwcASRTw.jpg',
    site: '',
  },
  {
    uid: 210509240,
    first_name: 'Nadezhda',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c413927/v413927240/93d/dbI9mMkuNl4.jpg',
    site: '',
  },
  {
    uid: 393644717,
    first_name: 'Andrey',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c836537/v836537717/134a1/DUX7PV13T-k.jpg',
    site: '',
  },
  {
    uid: 341460004,
    first_name: 'Anya',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c638426/v638426004/47fb8/SOqzugdKY8w.jpg',
    site: '',
  },
  {
    uid: 335592032,
    first_name: 'Kirill',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c837229/v837229032/29124/oO1BG4ZgEe0.jpg',
    site: '',
  },
  {
    uid: 237295861,
    first_name: 'Ivan',
    last_name: 'Babich',
    photo_max: 'https://pp.userapi.com/c631230/v631230861/f093/QxocNORqcTg.jpg',
    site: '',
  },
];
import _ from 'lodash';
function paramsToString(params) {
  let res = '&';
  _.forEach(params, (value, key) => {
    if (value || value === 0) res += `${key}=${value}&`;
  });
  return res;
}

// const pps = people.map((p, i) => () => fetchJsonp(
//     `https://api.vk.com/method/photos.get?access_token=${localStorage.token}${paramsToString(params)}`,
//   ).then(response => response.json()));
// Promise.all(pps).then((data) => {
//   console.log(data);
// });
const res = [];
const funcs = people.map((el, i) => () =>
  new Promise(resolve =>
    // const funcs = items.map((el, i) => () => new Promise(resolve =>
    setTimeout(resolve, (i === 0 ? i : i + 1) * 1),
  ).then(() => {
    const params = {
      owner_id: el.uid,
      album_id: 'profile',
    };
    return fetchJsonp(
      `https://api.vk.com/method/photos.get?access_token=${localStorage.token}${paramsToString(params)}`,
    ).then(response => response.json().then(data => { res[i] = data; console.log(res); }));
  }));
funcs.reduce((p, f) => p.then(f), Promise.resolve());

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Shell, beforeEnter: requireAuth },
    {
      name: 'settings',
      path: '/settings',
      component: Settings,
      beforeEnter: requireAuth,
    },
    {
      name: 'groups',
      path: '/groups',
      component: Groups,
      beforeEnter: requireAuth,
    },
    {
      name: 'login',
      path: '/login',
      component: Login,
      beforeEnter: ifLoggedIn,
    },
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
