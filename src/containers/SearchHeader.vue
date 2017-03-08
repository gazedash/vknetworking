<template>
  <div>
    <app-header>
      <search-button slot="left" @click.native="open('top')"></search-button>
      <logout slot="right"></logout>
      <search-popup
        v-on:changeCountry="changeCities"
        v-on:getCountryByCode="getCountryByCode"
        v-on:getCityByQuery="getCityByQuery"
        :close="close"
        :cities="cities"
        :countries="countries"
        :open="topPopup"
        :onSubmit="onSubmit"
        slot="popup">
      </search-popup>
    </app-header>
  </div>
</template>

<script>
  import {getUserName} from "../vk_api/index";
  import AppHeader from '../components/AppHeader';
  import Logout from '../components/Logout';
  import SearchButton from '../components/SearchButton';
  import SearchPopup from '../components/SearchPopup';
  import {isBottomOfPage} from "../utils/index";
  import debounce from 'lodash/debounce';
  import _ from 'lodash';
  import {checkAuth} from "../utils/auth";
  export default {
    name: 'search',
    components: {AppHeader, SearchButton, SearchPopup, Logout},
    data () {
      return {
        cities: [],
        searchData: [],
        topPopup: true,
      }
    },
    computed: {
      countries () {
        return this.$store.state.countries;
      },
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
      changeCities (country_id) {
        const currentCities = this.$store.getters.getCurrentCities(country_id);
        if (currentCities) {
          this.cities = currentCities;
        } else {
          this.$store.dispatch('getCities', {country_id})
            .then(() => {
              this.cities = this.$store.getters.getCurrentCities(country_id);
            });
        }
      },
      getCountryByCode ({code, country}) {
          this.$store.dispatch('getCountriesByCode', {code, country});
      },
      getCityByQuery ({city, code, country, countryInput}) {
          if (Number.isInteger(country)) {
            this.$store.dispatch('getCities', {q: city, code, country_id: country, countryInput})
              .then(() => {
                this.cities = this.$store.getters.getCurrentCities(country);
              });
          } else {
            this.$store.dispatch('getCountriesByCode', {code, country})
              .then(items => {
                this.$store.dispatch('getCities', {q: city, code, country_id: items[0].cid})
                  .then(() => {
                    this.cities = this.$store.getters.getCurrentCities(country);
                  });
              });
          }
      },
      open (position) {
        this[position + 'Popup'] = true
      },
      close (position) {
        this[position + 'Popup'] = false
      },
      finallyFetch({query: q, ...data}) {
        const payload = {...data, q};
        if (this.$store.getters.getUserCommunities(data.userId)) {
          this.$store.dispatch('getNext', payload);
        } else {
          this.$store.dispatch('getNextNext', payload)
        }
      },
      onSubmit(data) {
        if (data) {
          this.searchData = data;
        } else {
          data = this.searchData;
        }
        let self = this;
        this.close('top');
        let userId = getUserName(data.profileLink);
        if (!Number.isInteger(userId)) {
          let storedUserId = this.$store.getters.getStoredUserId(userId);
          if (storedUserId) {
            this.finallyFetch({...data, userId: storedUserId});
          } else this.$store.dispatch('getUser', userId).then((user) => {
            return self.finallyFetch({...data, userId: user.uid});
          })
        } else {
          this.finallyFetch({...data, userId});
        }
      },
    },
  }
</script>
<style scoped>
</style>
