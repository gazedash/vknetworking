<template>
  <div class="header">
    <app-header class="app-bar">
      <div class="left" slot="left">
        <search-button @click.native="open('top')"></search-button>
        <ignore-strategy-select :strategy="strategy" @change="changeStrategy"></ignore-strategy-select>
      </div>
      <div class="right" slot="right">
        <groups-button></groups-button>
        <settings-button></settings-button>
        <clear-list-button @clear="clear"></clear-list-button>
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
  import GroupsButton from '../components/GroupsButton';
  import IgnoreStrategySelect from '../components/IgnoreStrategySelect';
  import SettingsButton from '../components/SettingsButton';
  import SearchPopup from '../components/SearchPopup';
  import {isBottomOfPage} from "../utils/index";
  import debounce from 'lodash/debounce';
  import _ from 'lodash';
  import {checkAuth, logout} from "../utils/auth";
  import * as at from "../store/actionTypes";
  import * as mt from "../store/mutationTypes";
  export default {
    name: 'search',
    components: {
      AppHeader, SearchButton, SearchPopup, Logout,
      ClearListButton, IgnoreStrategySelect, SettingsButton, GroupsButton
    },
    data () {
      return {
        cities: [],
        searchData: [],
        topPopup: true,
      }
    },
    computed: {
      strategy () {
          return this.$store.state.strategy;
      },
      countries () {
        return this.$store.state.countries;
      },
    },
    created() {
      this.$store.dispatch(at.getCountries).then((res) => {
          if (checkAuthError(res)) {
            logout();
            this.$router.push({name: 'login', params: { renew: true }});
          }
      });
      window.addEventListener('scroll', this.submitOnBottomOfPage);
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.submitOnBottomOfPage)
    },
    methods: {
      submitOnBottomOfPage: debounce(
          function () {
            if (isBottomOfPage()) {
              this.onSubmit();
            }
          }, 335
      ),
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
        const fetchData = (data, userId) => this.finallyFetch({...data, userId});
        const userId = this.$store.getters.getUserId(data.profileLink);
        if (userId) {
          fetchData(data, userId);
        } else {
          let userId = data.profileLink;
          this.$store.dispatch(at.getUser, userId).then((user) => fetchData(data, user.uid))
        }
      },
      clear() {
        this.$store.dispatch(at.clearProfileList);
      },
      changeStrategy(strategy) {
        this.$store.dispatch(at.changeStrategy, {strategy});
      },
    },
  }
</script>
<style scoped>
  .left {
    display: flex;
  }
  .header {
    padding-bottom: 64px;
  }
  .app-bar {
    width: 100%;
    position: fixed;
  }
</style>
