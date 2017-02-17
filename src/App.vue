<template>
  <div id="app">
    <person v-for="el in list" :profile="el"></person>
  </div>
</template>

<script>
import Person from './components/Person'

export default {
  name: 'app',
  data() {
    // Mock
    return {
      list: [{
        "uid": 57476411,
        "first_name": "Andrey",
        "last_name": "Stadnikov",
        "photo_max": "https://pp.vk.me/c622927/v622927411/268f5/T5j00nspfYE.jpg"
      }, {
        "uid": 68861859,
        "first_name": "Naran",
        "last_name": "Lidzhigaryaev",
        "photo_max": "https://pp.vk.me/c637121/v637121859/2dfe4/oie9-d5XUlo.jpg"
      }, {
        "uid": 147235682,
        "first_name": "Anatoly",
        "last_name": "Marinenko",
        "photo_max": "https://pp.vk.me/c626830/v626830682/23a56/w-I0gZNGYWM.jpg"
      }, {
        "uid": 62620477,
        "first_name": "Nikita",
        "last_name": "Isaev",
        "photo_max": "https://pp.vk.me/c836137/v836137477/1d0f6/8AhHA-B1xMM.jpg"
      }, {
        "uid": 141374441,
        "first_name": "Pavel",
        "last_name": "Popov",
        "photo_max": "https://pp.vk.me/c638820/v638820441/a3f/rbcESgM6vFc.jpg"
      }, {
        "uid": 57476411,
        "first_name": "Andrey",
        "last_name": "Stadnikov",
        "photo_max": "https://pp.vk.me/c622927/v622927411/268f5/T5j00nspfYE.jpg"
      }, {
        "uid": 68861859,
        "first_name": "Naran",
        "last_name": "Lidzhigaryaev",
        "photo_max": "https://pp.vk.me/c637121/v637121859/2dfe4/oie9-d5XUlo.jpg"
      }, {
        "uid": 147235682,
        "first_name": "Anatoly",
        "last_name": "Marinenko",
        "photo_max": "https://pp.vk.me/c626830/v626830682/23a56/w-I0gZNGYWM.jpg"
      }, {
        "uid": 62620477,
        "first_name": "Nikita",
        "last_name": "Isaev",
        "photo_max": "https://pp.vk.me/c836137/v836137477/1d0f6/8AhHA-B1xMM.jpg"
      }, {
        "uid": 141374441,
        "first_name": "Pavel",
        "last_name": "Popov",
        "photo_max": "https://pp.vk.me/c638820/v638820441/a3f/rbcESgM6vFc.jpg"
      }, {
        "uid": 57476411,
        "first_name": "Andrey",
        "last_name": "Stadnikov",
        "photo_max": "https://pp.vk.me/c622927/v622927411/268f5/T5j00nspfYE.jpg"
      }, {
        "uid": 68861859,
        "first_name": "Naran",
        "last_name": "Lidzhigaryaev",
        "photo_max": "https://pp.vk.me/c637121/v637121859/2dfe4/oie9-d5XUlo.jpg"
      }, {
        "uid": 147235682,
        "first_name": "Anatoly",
        "last_name": "Marinenko",
        "photo_max": "https://pp.vk.me/c626830/v626830682/23a56/w-I0gZNGYWM.jpg"
      }, {
        "uid": 62620477,
        "first_name": "Nikita",
        "last_name": "Isaev",
        "photo_max": "https://pp.vk.me/c836137/v836137477/1d0f6/8AhHA-B1xMM.jpg"
      }, {
        "uid": 141374441,
        "first_name": "Pavel",
        "last_name": "Popov",
        "photo_max": "https://pp.vk.me/c638820/v638820441/a3f/rbcESgM6vFc.jpg"
      }, {
        "uid": 57476411,
        "first_name": "Andrey",
        "last_name": "Stadnikov",
        "photo_max": "https://pp.vk.me/c622927/v622927411/268f5/T5j00nspfYE.jpg"
      }, {
        "uid": 68861859,
        "first_name": "Naran",
        "last_name": "Lidzhigaryaev",
        "photo_max": "https://pp.vk.me/c637121/v637121859/2dfe4/oie9-d5XUlo.jpg"
      }, {
        "uid": 147235682,
        "first_name": "Anatoly",
        "last_name": "Marinenko",
        "photo_max": "https://pp.vk.me/c626830/v626830682/23a56/w-I0gZNGYWM.jpg"
      }, {
        "uid": 62620477,
        "first_name": "Nikita",
        "last_name": "Isaev",
        "photo_max": "https://pp.vk.me/c836137/v836137477/1d0f6/8AhHA-B1xMM.jpg"
      }, {
        "uid": 141374441,
        "first_name": "Pavel",
        "last_name": "Popov",
        "photo_max": "https://pp.vk.me/c638820/v638820441/a3f/rbcESgM6vFc.jpg"
      }]
    }
  },
  components: {
    Person
  }
}

// fetch(buildGetMembersUrl(92621430, 139), {mode: 'cors'})
//     .then(response => response.json())
//     .then(json => {
//         console.log(json);
//         app.list = json.response;
//         return json;
//     });
//    const api_key = "API_KEY";
const api_key = "API_KEY";
const endpoint = "https://api.vk.com";
//
function buildGetMembersUrl(id, city = "", sex = 0, age_from = 0, age_to = 0) {
  // sex=1: female
  return `${endpoint}/method/users.search?group_id=${id}` +
    `&fields=photo_max,first_name,last_name&online=0${city != "" ? "&city=" + city : ""}&sex=${sex}` +
    `${age_from ? "&age_from=" + age_from : ""}` +
    `${age_to ? "&age_to=" + age_to : ""}` +
    `&has_photo=1&access_token=${api_key}`;
  // hometown?
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
