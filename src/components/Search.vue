<template>
  <div class="search">
    <mu-icon-button class="more" @click="open('top')">
      <svg style="width:24px;height:24px" viewBox="0 0 24 24">
        <path fill="#000000" d="M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z" />
      </svg>
    </mu-icon-button>
    <div>Communities: {{ size }} Profiles: {{ list.length }}</div>
    <mu-popup position="top" :overlay="false" popupClass="demo-popup-top" :open="topPopup">
      <mu-paper class="paper" :zDepth="1" >
        <div class="profile-link">
          <mu-text-field hintText="enter id or link" label="Profile" v-model.trim="profileLink"/>
        </div>
        <div class="profile-link">
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
        <mu-flat-button @click="onSubmit" label="GO!" class="button" />
        <mu-flat-button @click="close('top')" label="HIDE" class="button cancel" />
      </mu-paper>
    </mu-popup>
  </div>
</template>

<script>
  import {getUserName} from "../vk_api/index";
  import {isBottomOfPage} from "../utils/index";
  import {Observable} from "rxjs/Rx";
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
        topPopup: false,
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
        list () {
          return this.$store.getters.getProfileList
        },
        size() {
          return this.$store.state.fetchedCommunitiesLength
        },
        countries () {
          return this.$store.state.countries;
        },
    },
    beforeUpdate() {
        this.country = this.$store.state.countries[0].cid;
    },
    created () {
      const scrollStream = Observable.fromEvent(window, 'scroll')
        .filter(() => {
          if (isBottomOfPage()) console.log("Bottom of page");
          return isBottomOfPage();
        }).throttleTime(500);
      scrollStream.subscribe(() => {
          this.onSubmit();
      });
    },
    methods: {
        open (position) {
          this[position + 'Popup'] = true
        },
        close (position) {
          this[position + 'Popup'] = false
        },
        onSubmit() {
         let userId = getUserName(this.$data.profileLink);
         if (!Number.isInteger(userId)) {
           this.$store.dispatch('getUser', userId).then((data) => {
             userId = data.uid;
           })
         }
         const {sex, age_from, age_to, city, country, query: q} = this.$data;
         console.log(sex, age_from, age_to, city, country, userId, q);
           this.$store.dispatch('getNextNext', { userId, city, sex, age_from, age_to, country, q, has_photo: 1});
        },
    },
  }
</script>
<style scoped>
  .search {
    display: flex;
    flex-direction: row-reverse;
  }
  .more {
    padding: 0;
    width: 32px;
    height: 32px;
  }
  .stats {
  }
  .paper {
    margin: 15px 0 10px 0;
    padding: 15px 30px 20px 30px;
    display: inline-block;
  }
  .sex-radio > div > div:nth-child(2) {
    margin-right: 10px;
    height: 20px;
    width: 20px;
  }
  .sex-radio > div > div:nth-child(3) {
    font-size: 16px !important;
  }
  .sex-radio-icon {
    height: 20px !important;
    width: 20px !important;
  }
  .age > div {
    width: 88px;
    margin: 0;
    font-size: 14px;
  }
  .button {
    background-color: #03a9f4 !important;
    color: #fff !important;
  }
  .cancel {
    background-color: rgb(141, 182, 204) !important;
  }
</style>
