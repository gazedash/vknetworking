<template>
  <div id="app">
    <!--<div>-->
      <!--<span>Communities: {{ size }}</span>-->
      <!--<span>Profiles: {{ list.length }}</span>-->
    <!--</div>-->
    <search></search>
    <person v-for="el in list" :profile="el"></person>
    <!--{{ groups }}-->
  </div>
</template>

<script>
  import Person from './components/Person'
  import Search from './components/Search'

  export default {
    name: 'app',
    props: ['list', 'size'],
////      list: [{uid:57476411,first_name:"Andrey",last_name:"Stadnikov",photo_max:"https://pp.vk.me/c622927/v622927411/268f5/T5j00nspfYE.jpg"},{uid:68861859,first_name:"Naran",last_name:"Lidzhigaryaev",photo_max:"https://pp.vk.me/c637121/v637121859/2dfe4/oie9-d5XUlo.jpg"},{uid:147235682,first_name:"Anatoly",last_name:"Marinenko",photo_max:"https://pp.vk.me/c626830/v626830682/23a56/w-I0gZNGYWM.jpg"},{uid:62620477,first_name:"Nikita",last_name:"Isaev",photo_max:"https://pp.vk.me/c836137/v836137477/1d0f6/8AhHA-B1xMM.jpg"},{uid:141374441,first_name:"Pavel",last_name:"Popov",photo_max:"https://pp.vk.me/c638820/v638820441/a3f/rbcESgM6vFc.jpg"},{uid:57476411,first_name:"Andrey",last_name:"Stadnikov",photo_max:"https://pp.vk.me/c622927/v622927411/268f5/T5j00nspfYE.jpg"},{uid:68861859,first_name:"Naran",last_name:"Lidzhigaryaev",photo_max:"https://pp.vk.me/c637121/v637121859/2dfe4/oie9-d5XUlo.jpg"},{uid:147235682,first_name:"Anatoly",last_name:"Marinenko",photo_max:"https://pp.vk.me/c626830/v626830682/23a56/w-I0gZNGYWM.jpg"},{uid:62620477,first_name:"Nikita",last_name:"Isaev",photo_max:"https://pp.vk.me/c836137/v836137477/1d0f6/8AhHA-B1xMM.jpg"},{uid:141374441,first_name:"Pavel",last_name:"Popov",photo_max:"https://pp.vk.me/c638820/v638820441/a3f/rbcESgM6vFc.jpg"},{uid:57476411,first_name:"Andrey",last_name:"Stadnikov",photo_max:"https://pp.vk.me/c622927/v622927411/268f5/T5j00nspfYE.jpg"},{uid:68861859,first_name:"Naran",last_name:"Lidzhigaryaev",photo_max:"https://pp.vk.me/c637121/v637121859/2dfe4/oie9-d5XUlo.jpg"},{uid:147235682,first_name:"Anatoly",last_name:"Marinenko",photo_max:"https://pp.vk.me/c626830/v626830682/23a56/w-I0gZNGYWM.jpg"},{uid:62620477,first_name:"Nikita",last_name:"Isaev",photo_max:"https://pp.vk.me/c836137/v836137477/1d0f6/8AhHA-B1xMM.jpg"},{uid:141374441,first_name:"Pavel",last_name:"Popov",photo_max:"https://pp.vk.me/c638820/v638820441/a3f/rbcESgM6vFc.jpg"},{uid:57476411,first_name:"Andrey",last_name:"Stadnikov",photo_max:"https://pp.vk.me/c622927/v622927411/268f5/T5j00nspfYE.jpg"},{uid:68861859,first_name:"Naran",last_name:"Lidzhigaryaev",photo_max:"https://pp.vk.me/c637121/v637121859/2dfe4/oie9-d5XUlo.jpg"},{uid:147235682,first_name:"Anatoly",last_name:"Marinenko",photo_max:"https://pp.vk.me/c626830/v626830682/23a56/w-I0gZNGYWM.jpg"},{uid:62620477,first_name:"Nikita",last_name:"Isaev",photo_max:"https://pp.vk.me/c836137/v836137477/1d0f6/8AhHA-B1xMM.jpg"},{uid:141374441,first_name:"Pavel",last_name:"Popov",photo_max:"https://pp.vk.me/c638820/v638820441/a3f/rbcESgM6vFc.jpg"}],
    components: {
      Person, Search
    },
  };
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
