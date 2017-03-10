<template>
  <div>
    <app-header>
      <search-button slot="left" @click.native="open('top')"></search-button>
      <div class="right" slot="right">
        <clear-list-button @clear="clear" class="clear"></clear-list-button>
        <logout></logout>
      </div>
    </app-header>
    <search-popup
      @changeCountry="changeCities"
      @getCountryByCode="getCountryByCode"
      @getCityByQuery="getCityByQuery"
      :close="close"
      :cities="cities"
      :countries="countries"
      :open="topPopup"
      :onSubmit="onSubmit"
    >
    </search-popup>
  </div>
</template>

<script>
  import {getUserName, checkAuthError} from "../vk_api/index";
  import AppHeader from '../components/AppHeader';
  import Logout from '../components/Logout';
  import ClearListButton from '../components/ClearListButton'
  import SearchButton from '../components/SearchButton';
  import SearchPopup from '../components/SearchPopup';
  import {isBottomOfPage} from "../utils/index";
  import debounce from 'lodash/debounce';
  import _ from 'lodash';
  import {checkAuth} from "../utils/auth";
  import * as at from "../store/actionTypes";
  export default {
    name: 'search',
    components: {AppHeader, SearchButton, SearchPopup, Logout, ClearListButton},
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
      this.$store.dispatch(at.getCountries).then((res) => {
          if (checkAuthError(res)) {
            this.$router.push('/logout');
          }
      });
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
          this.$store.dispatch(at.getCities, {country_id})
            .then(() => {
              this.cities = this.$store.getters.getCurrentCities(country_id);
            });
        }
      },
      getCountryByCode ({code, country}) {
          this.$store.dispatch(at.getCountries, {code, country});
      },
      getCityByQuery ({city, code, country, countryInput}) {
          if (Number.isInteger(country)) {
            this.$store.dispatch(at.getCities, {q: city, code, country_id: country, countryInput})
              .then(() => {
                this.cities = this.$store.getters.getCurrentCities(country);
              });
          } else {
            this.$store.dispatch(at.getCountries, {code, country})
              .then(items => {
                this.$store.dispatch(at.getCities, {q: city, code, country_id: items[0].cid})
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
        if (this.$store.getters.getUserGroups(data.userId)) {
          this.$store.dispatch(at.getNext, payload);
        } else {
          this.$store.dispatch(at.getFirstNext, payload)
        }
      },
      onSubmit(data) {
        data ? this.searchData = data : data = this.searchData;
        this.close('top');
        // If profileLink...
        let userId = getUserName(data.profileLink);
        if (Number.isInteger(userId)) {
          this.finallyFetch({...data, userId});
        } else {
          let storedUserId = this.$store.getters.getStoredUserId(userId);
          if (storedUserId) {
            this.finallyFetch({...data, userId: storedUserId});
          } else this.$store.dispatch(at.getUser, userId).then((user) => {
            this.finallyFetch({...data, userId: user.uid});
          })
        }
      },
      clear() {
          this.$store.dispatch(at.clearProfileList);
      },
    },
  }
</script>
<style scoped>
</style>
