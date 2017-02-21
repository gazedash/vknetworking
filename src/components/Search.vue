<template>
  <!--<div class="search">-->
    <mu-paper class="paper" :zDepth="1" >
      <div class="profile-link">
        <mu-text-field hintText="enter id or link" label="Profile" v-model.trim="profileLink"/>
      </div>
      <div class="country">
        <mu-select-field v-model="country" :labelFocusClass="['label-foucs']" label="Country">
          <mu-menu-item v-for="country in countries" ccc="dddd" ttt="ddd" :value="country.cid" :title="country.title" />
        </mu-select-field>
      </div>
      <div class="city">
        <!--<div v-model="city">{{city}}</div>-->
        <!--<div v-model="country">{{typeof country}} {{country}}</div>-->
        <mu-select-field v-model="city" :labelFocusClass="['label-foucs']" label="City">
          <mu-menu-item v-for="city in cities" ccc="dddd" ttt="ddd" :value="city.cid" :title="city.title" />
        </mu-select-field>
      </div>
      <div class="sex">
        <mu-radio iconClass="sex-radio-icon" label="Male" name="group" nativeValue="2" v-model="picked" class="sex-radio"/>
        <mu-radio iconClass="sex-radio-icon" label="Female" name="group" nativeValue="1" v-model="picked"  class="sex-radio"/>
        <mu-radio iconClass="sex-radio-icon" label="All" name="group" nativeValue="0" v-model="picked"  class="sex-radio"/>
      </div>
      <div class="age">
        <mu-text-field hintText="from" v-model.trim.number="age_from"/>
        <mu-text-field hintText="to" v-model.trim.number="age_to"/>
      </div>
      <mu-flat-button @click="onSubmit" label="GO!" class="button" />
      <mu-flat-button label="HIDE" class="button cancel" />
    </mu-paper>
    <!--<div class="profile-link">-->
      <!--<input v-model.trim="profileLink" placeholder="insert profile link please">-->
    <!--</div>-->
    <!--<div class="sex">-->
      <!--<input type="radio" id="male" value="Male" v-model="picked">-->
      <!--<label for="male">Male</label>-->
      <!--<input type="radio" id="female" value="Female" v-model="picked">-->
      <!--<label for="female">Female</label>-->
      <!--<input type="radio" id="all" value="All" v-model="picked">-->
      <!--<label for="all">All</label>-->
    <!--</div>-->
    <!--<div class="city">-->
      <!--<select v-model="city">-->
        <!--<option v-for="option in options" :value="option.value">-->
          <!--{{ option.text }}-->
        <!--</option>-->
      <!--</select>-->
    <!--</div>-->
    <!--<div class="age">-->
      <!--<div class="age_from">-->
        <!--<input v-model.trim.number="age_from" placeholder="from">-->
        <!--<span class="bar"></span>-->
      <!--</div>-->
      <!--<div class="age_to">-->
        <!--<input v-model.trim.number="age_to" placeholder="to">-->
      <!--</div>-->
    <!--</div>-->
  <!--</div>-->
</template>

<script>
  export default {
    name: 'search',
    data () {
      return {
        picked: null,
        city: null,
        profileLink: null,
        cities: [],
//        cities: [
//          { text: 'Moscow', value: 'A' },
//          { text: 'Saint Petersburg', value: 'B' },
//          { text: 'Rostov-On-Don', value: 'C' }
//        ],
        age_from: null,
        age_to: null,
      }
    },
    watch: {
      country(country_id) {
        const currentCities = this.$store.state.cities[country_id];
        if (currentCities) {
          console.log('already loaded');
          this.cities = currentCities;
          this.city = currentCities[0].cid;
        } else {
          console.log('load cities');
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
        country () {
          if (this.$store.state.countries.length) {
              return this.$store.state.countries[0].cid;
          } else {
              return 0;
          }
        },
        countries () {
//            console.log(this.country, this.$store.state.countries[0]);
          console.log(this.$store.state.countries);
          return this.$store.state.countries;
        },
    },
    methods: {
        onSubmit() {
//            console.log(this.$data);
        },
    },
  }
</script>
<style scoped>
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
