<template>
  <div class="login">
    <div class="form">
      <label>Login</label>
      <mu-raised-button @clic="login" type="submit">login</mu-raised-button>
      <p v-if="error" class="error">Bad login information</p>
    </div>
  </div>
</template>

<script>
  import auth from '../utils/auth'
  import {createPopup} from "../utils/index";
  import {buildVkAuthUrl} from "../vk_api/index";
  export default {
    data () {
      return {
        error: false
      }
    },
    methods: {
      login () {
        buildVkAuthUrl({client_id: 5899859, redirect_uri: "https://vknetworking-8c4dd.firebaseapp.com/auth"});
        createPopup(buildVkAuthUrl({
          client_id: 5899859,
          redirect_uri: "https://vknetworking-8c4dd.firebaseapp.com/auth"
        }), "Please log in to VK");
      }
    }
  }
</script>

<style>
  .login {
    margin-top: 64px;
  }

  .form {
    padding: 10px;
  }

  .form > label {
    display: block;
    padding-bottom: 10px;
  }

  .error {
    color: red;
  }
</style>
