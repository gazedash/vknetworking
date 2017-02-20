<template>
  <div class="search">
    <div class="profile-link">
      <mu-text-field hintText="enter your profile id or link" label="Profile" v-model.trim="profileLink"/>
    </div>
    <div class="city">
      <mu-select-field v-model="city" :labelFocusClass="['label-foucs']" label="City">
        <mu-menu-item v-for="text,index in options" ccc="dddd" ttt="ddd" :value="String(index)" :title="text.text" />
      </mu-select-field>
    </div>
    <!--<div class="profile-link">-->
      <!--<input v-model.trim="profileLink" placeholder="insert profile link please">-->
    <!--</div>-->
    <!--<div class="sex">-->
    <div class="sex">
      <mu-radio label="Male" name="group" nativeValue="Male" v-model="picked" class="demo-radio"/>
      <mu-radio label="Female" name="group" nativeValue="Female" v-model="picked"  class="demo-radio"/>
      <mu-radio label="All" name="group" nativeValue="All" v-model="picked"  class="demo-radio"/>
    </div>
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
    <div class="age">
      <mu-text-field v-model.trim.number="age_from"/>
      <mu-text-field v-model.trim.number="age_to"/>
    </div>
    <!--<div class="age">-->
      <!--<div class="age_from">-->
        <!--<input v-model.trim.number="age_from" placeholder="from">-->
        <!--<span class="bar"></span>-->
      <!--</div>-->
      <!--<div class="age_to">-->
        <!--<input v-model.trim.number="age_to" placeholder="to">-->
      <!--</div>-->
    <!--</div>-->
  </div>
</template>

<script>
  export default {
    name: 'search',
//    props: ['profile'],
    data () {
      return {
        picked: null,
        city: false,
        profileLink: null,
        options: [
          { text: 'Moscow', value: 'A' },
          { text: 'Saint Petersburg', value: 'B' },
          { text: 'Rostov-On-Don', value: 'C' }
        ],
        age_from: null,
        age_to: null,
      }
    }
  }
</script>
<style scoped>
  .age > div {
    width: 50px;
  }
</style>
