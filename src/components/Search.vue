<template>
  <div>
    <mu-appbar class="app-bar" :zDepth="1">
        <div class="home">
          <router-link to="/">VKNetworking</router-link>
        </div>
        <mu-icon-button v-if="user.authenticated" slot="left" class="more" @click="open('top')">
          <svg style="width:32px;height:32px" viewBox="0 0 24 24">
            <path fill="#ffffff" d="M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z" />
          </svg>
        </mu-icon-button>
        <router-link v-if="user.authenticated" slot="right" to="/logout">
          <mu-icon-button class="logout">
            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
              <path fill="#ffffff" d="M14.08,15.59L16.67,13H7V11H16.67L14.08,8.41L15.5,7L20.5,12L15.5,17L14.08,15.59M19,3A2,2 0 0,1 21,5V9.67L19,7.67V5H5V19H19V16.33L21,14.33V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H19Z" />
            </svg>
          </mu-icon-button>
        </router-link>
    </mu-appbar>
    <mu-popup v-if="user.authenticated" position="top" popupClass="popup" :open="topPopup" @close="close('top')">
      <mu-paper class="paper" :zDepth="2" >
        <div class="profile-link">
          <mu-text-field hintText="enter id or link" label="Profile" v-model.trim="profileLink" />
        </div>
        <div class="search">
          <mu-text-field hintText="enter search query" label="Search query" v-model.trim="query"/>
        </div>
        <div class="country">
          <mu-select-field v-model="country" :labelFocusClass="['label-foucs']" label="Country">
            <mu-menu-item v-for="country in countries" ccc="dddd" ttt="ddd" :value="country.cid" :title="country.title" />
          </mu-select-field>
        </div>
        <div class="city">
          <mu-select-field v-model="city" :labelFocusClass="['label-foucs']" label="City">
            <mu-menu-item v-for="city in cities" ccc="dddd" ttt="ddd" :value="city.cid" :title="city.title" />
          </mu-select-field>
        </div>
        <div class="sex">
          <mu-radio iconClass="sex-radio-icon" label="Male" name="group" nativeValue="2" v-model="sex" class="sex-radio"/>
          <mu-radio iconClass="sex-radio-icon" label="Female" name="group" nativeValue="1" v-model="sex"  class="sex-radio"/>
          <mu-radio iconClass="sex-radio-icon" label="All" name="group" nativeValue="0" v-model="sex"  class="sex-radio"/>
        </div>
        <div class="age">
          <mu-text-field hintText="from" v-model.trim.number="age_from"/>
          <mu-text-field hintText="to" v-model.trim.number="age_to"/>
        </div>
        <div class="control">
          <mu-flat-button @click="onSubmit" label="GO!" />
          <mu-flat-button @click="close('top')" label="HIDE" />
        </div>
      </mu-paper>
    </mu-popup>
  </div>
</template>

<script>
  import {getUserName} from "../vk_api/index";
  import {isBottomOfPage} from "../utils/index";
  import debounce from 'lodash/debounce';
  import {checkAuth} from "../utils/auth";
  import {user} from "../utils/auth";
  export default {
    name: 'search',
    data () {
      return {
        user,
        sex: '1',
        city: null,
        country: null,
        profileLink: null,
        query: null,
        cities: [],
        age_from: 14,
        age_to: null,
        topPopup: true,
      }
    },
    watch: {
      country(country_id) {
        const currentCities = this.$store.state.cities[country_id];
        if (currentCities) {
          this.cities = currentCities;
          this.city = currentCities[0].cid;
        } else {
          this.$store.dispatch('getCities', {country_id})
            .then(() => {
              const currentCities = this.$store.state.cities[country_id];
              this.cities = currentCities;
              this.city = currentCities[0].cid;
            });
        }
      },
    },
    computed: {
      countries () {
        return this.$store.state.countries;
      },
    },
    beforeUpdate() {
        this.country = this.$store.state.countries[1].cid;
    },
    created () {
      this.$store.dispatch('getCountries');
      window.addEventListener('scroll', debounce(() => {
        if (isBottomOfPage()) {
          this.onSubmit();
        }
      }, 335));
    },
    methods: {
        open (position) {
          this[position + 'Popup'] = true
        },
        close (position) {
          this[position + 'Popup'] = false
        },
        finallyFetch(userId) {
          const {sex, age_from, age_to, city, country, query: q} = this.$data;
          const payload = { userId, city, sex, age_from, age_to, country, q, has_photo: 1};
          if (this.$store.state.communityIdList[[userId]]) {
            this.$store.dispatch('getNext', payload);
          } else {
            this.$store.dispatch('getNextNext', payload)
          }
        },
        onSubmit() {
          let self = this;
          this.close('top');
          let userId = getUserName(this.$data.profileLink);
           if (!Number.isInteger(userId)) {
               let storedUserId = this.$store.state.aliases[userId];
               if (storedUserId) {
                   this.finallyFetch(storedUserId);
               } else this.$store.dispatch('getUser', userId).then((data) => {
                return self.finallyFetch(data.uid);
             })
           } else {
             this.finallyFetch(userId);
           }
        },
    },
  }
</script>
<style scoped>
  .home {
    text-align: center;
  }
  .home > a {
    color: #fff;
  }
  .app-bar {
    position: fixed;
    top: 0;
  }
  .more {
    padding: 0;
    width: 32px;
    height: 32px;
  }
  .paper {
    padding: 14px 25px 14px 25px;
  }
  .sex {
    display: flex;
    justify-content: space-around;
  }
  .age {
    display: flex;
    justify-content: flex-start;
  }
  .age > div {
    margin: 5px 10px;
    width: 40px;
    font-size: 14px;
  }
  .age > div:first-child {
    margin-left: 0;
  }
  .control {
    display: flex;
    justify-content: flex-end;
  }
</style>
