<template>
  <mu-popup position="top" popupClass="popup" :open="open" @close="close('top')">
    <mu-paper class="paper" :zDepth="2">
      <welcome v-if="!user.doNotShowAgain" v-on:doNotShowAgain="doNotShowAgain"></welcome>
      <div class="profile-link">
        <mu-text-field hintText="enter id or link" label="Profile" v-model.trim="profileLink"/>
      </div>
      <div class="search">
        <mu-text-field hintText="enter search query" label="Search query" v-model.trim="query"/>
      </div>
      <div class="country">
        <mu-auto-complete v-model="countryInput" :dataSource="countriesArr" :dataSourceConfig="dataSourceConfig"
                          @blur="blur" @select="handlechange"></mu-auto-complete>
      </div>
      <div class="city">
        <mu-select-field v-model="city" :labelFocusClass="['label-focus']" label="City">
          <mu-menu-item v-for="city in cities" ccc="dddd" ttt="ddd" :value="city.cid" :title="city.title"/>
        </mu-select-field>
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
  </mu-popup>
</template>

<script>
  import Welcome from './Welcome';
  import {user, setDoNotShowAgain} from '../utils/auth';
  import _ from 'lodash';
  import countries from "i18n-iso-countries";
  export default {
    name: 'search-popup',
    data () {
      return {
        dataSourceConfig: {text: 'title', value: 'cid'},
        user,
        sex: '1',
        city: null,
        country: null,
        countryInput: 'Russia',
        profileLink: null,
        query: null,
        age_from: null,
        age_to: null,
      }
    },
    props: ['open', 'close', 'onSubmit', 'cities', 'countries'],
    computed: {
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
        if (items) {
          this.country = items[1].cid;
        }
        console.log({before: this.country});
        const currentCountry = _.find(this.countries, (country) => country.title === this.countryInput);
        if (currentCountry) {
          this.country = currentCountry.cid;
          console.log({after: this.country});
        }
      },
      country (cid) {
        this.country = cid;
        this.$emit('changeCountry', cid);
      },
      cities (cities) {
        this.city = cities[0].cid;
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
          this.$emit('getCountryByCode', {code, country});
        }
      },
      handlechange (country) {
        console.log(country);
        this.country = country.cid;
//          this.country = _.find(this.countries, (el) => el.title === val);
      },
      onSubmitLocal() {
        console.log(this.searchData);
        this.onSubmit(this.searchData);
      },
      doNotShowAgain() {
        setDoNotShowAgain();
      }
    },
    components: {Welcome},
  }
</script>

<style scoped>
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
