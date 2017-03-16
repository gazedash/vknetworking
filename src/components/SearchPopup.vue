<template>
  <div>
    <my-popup position="top" :open="open" @close="close('top')">
      <reset-button @reset="resetForm"></reset-button>
      <mu-paper class="paper" :zDepth="1">
        <div>
          <welcome v-if="!user.doNotShowAgain" @doNotShowAgain="doNotShowAgain"></welcome>
        </div>
        <div class="profile-link">
          <mu-text-field hintText="enter id or link" label="Profile" v-model.trim="profileLink"/>
        </div>
        <div class="search">
          <mu-text-field hintText="enter search query" label="Search query" v-model.trim="query"/>
        </div>
        <div class="country">
          <mu-auto-complete openOnFocus :filter="filterSource" v-model="countryInput" :dataSource="countriesArr"
                            :dataSourceConfig="dataSourceConfigCountry"
                            @blur="blur" @select="handleChange"></mu-auto-complete>
        </div>
        <div class="city">
          <mu-auto-complete openOnFocus :filter="filterSource" v-model="cityInput" :dataSource="cityArr"
                            :dataSourceConfig="dataSourceConfigCity"
                            @blur="blurCity" @select="handleChangeCity"></mu-auto-complete>
        </div>
        <div class="sex">
          <mu-radio label="Male" name="group" nativeValue="2" v-model="sex" class="sex-radio"/>
          <mu-radio label="Female" name="group" nativeValue="1" v-model="sex" class="sex-radio"/>
          <mu-radio label="All" name="group" nativeValue="0" v-model="sex" class="sex-radio"/>
        </div>
        <div class="age">
          <mu-text-field hintText="from" v-model.trim.number="age_from"/>
          <mu-text-field hintText="to" v-model.trim.number="age_to"/>
        </div>
        <div class="control">
          <mu-flat-button @click="onSubmitLocal" label="GO!"/>
          <mu-flat-button @click="close('top')" label="HIDE"/>
        </div>
      </mu-paper>
    </my-popup>
  </div>
</template>

<script>
  import Welcome from './Welcome';
  import ResetButton from './ResetButton';
  import MyPopup from './MyPopup';
  import {user, setDoNotShowAgain} from '../utils/auth';
  import _ from 'lodash';
  import countries from "i18n-iso-countries";
  export default {
    name: 'search-popup',
    data () {
      return {
        dataSourceConfigCountry: {text: 'title', value: 'cid'},
        dataSourceConfigCity: {text: 'label', value: 'cid'},
        user,
        sex: '0',
        city: null,
        cityInput: null,
        country: null,
        countryInput: 'Russia',
        profileLink: null,
        query: null,
        age_from: null,
        age_to: null,
        filterSource (searchText, key) {
          return key.includes(searchText);
        },
      }
    },
    props: {
      open: {
        type: Boolean,
        default: true,
      },
      close: {
        type: Function,
      },
      onSubmit: {
        type: Function,
      },
      cities: {
        type: Array,
        default: [],
      },
      countries: {
        type: Object,
        default: {},
      }
    },
    computed: {
      cityArr() {
        return _.toArray(this.cities);
      },
      countriesArr() {
        return _.toArray(this.countries);
      },
      searchData() {
        return {
          sex: this.sex,
          age_from: this.age_from,
          age_to: this.age_to,
          country: this.country,
          city: this.city,
          query: this.query,
          profileLink: this.profileLink,
        };
      }
    },
    watch: {
      countries(items) {
        this.country = items[1] ? items[1].cid : 1;
        const currentCountry = _.find(this.countries, (country) => country.title === this.countryInput);
        if (currentCountry) {
          this.country = currentCountry.cid;
        }
      },
      country (cid) {
        if (cid) {
          this.$emit('changeCountry', cid);
        }
      },
      cities (cities) {
        this.city = cities[0].cid;
        this.cityInput = cities[0].label;
        const currentCity = _.find(this.cities, (city) => city.title === this.cityInput);
        if (currentCity) {
          this.city = currentCity.cid;
        }
      },
    },
    methods: {
      blur (e) {
        const country = e.target.value;
        const co = _.find(this.countries, (el) => el.title === country);
        if (co) {
          this.country = co.cid;
        } else {
          const code = countries.getAlpha2Code(country, 'en');
          if (code) {
            this.$emit('getCountryByCode', {code, country});
          }
        }
      },
      blurCity (e) {
        const city = e.target.value;
        const c = _.find(this.cities, (el) => el.title === city);
        if (c) {
          this.city = c.cid;
        } else {
          const country = this.countryInput || this.country;
          const code = countries.getAlpha2Code(country, 'en');
          this.$emit('getCityByQuery', {city, code, country: this.country, countryInput: this.countryInput});
        }
      },
      handleChange (country) {
        this.country = country.cid;
      },
      handleChangeCity (city) {
        this.city = city.cid;
      },
      onSubmitLocal() {
        this.onSubmit(this.searchData);
      },
      doNotShowAgain() {
        setDoNotShowAgain();
      },
      resetForm() {
        Object.entries(this.searchData).forEach(
          ([key, value]) => this[key] = null
        );
      },
    },
    components: {Welcome, ResetButton, MyPopup},
  }
</script>

<style scoped>
  .paper {
  padding: 14px 25px 14px 25px;
  }
</style>
