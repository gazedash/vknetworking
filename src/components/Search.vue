<template>
  <div>
    <mu-appbar class="app-bar" title="VKNetworking" :zDepth="1">
      <mu-icon-button slot="right" class="more" @click="open('top')">
        <svg style="width:32px;height:32px" viewBox="0 0 24 24">
          <path fill="#000000" d="M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z" />
        </svg>
      </mu-icon-button>
    </mu-appbar>
    <mu-popup position="top" popupClass="popup" :open="topPopup" @close="close('top')">
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
  export default {
    name: 'search',
    data () {
      return {
        sex: null,
        city: null,
        country: null,
        profileLink: null,
        query: null,
        cities: [],
        age_from: null,
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
  .app-bar {
    position: fixed;
    top: 0;
  }
  .more {
    padding: 0;
    width: 32px;
    height: 32px;
  }
  .more > div > svg > path {
    fill: white;
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
