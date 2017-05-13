<template>
  <div class="root">
    <div class="header">
      <app-header class="app-bar">
        <div class="right" slot="right">
          <logout></logout>
        </div>
      </app-header>
    </div>
    <div class="content">
      <mu-toast v-if="toast" :message="message" @close="hideToast"/>
      <mu-text-field v-model.trim="importSettings" hintText="Import settings"></mu-text-field>
      <mu-raised-button @click="setSettings">IMPORT</mu-raised-button>
      <mu-text-field id="export" :value="settings" hintText="Export settings" multiLine :rows="6" :rowsMax="6"/>
      <div class="buttons">
        <mu-raised-button @click="copy">EXPORT</mu-raised-button>
        <mu-raised-button @click="clearList">CLEAR IGNORE LIST</mu-raised-button>
        <mu-raised-button @click="reset">RESET SETTINGS</mu-raised-button>
      </div>
    </div>
  </div>
</template>

<script>
  import AppHeader from '../components/AppHeader';
  import Logout from '../components/Logout';
  import * as at from "../store/actionTypes";
  import { resetConst } from "../const/index";
  export default {
    name: 'search-popup',
    created () {
      this.$store.dispatch(at.getSettings);
    },
    data () {
      return {
        message: 'Copied to clipboard',
        importSettings: '',
        toast: false,
      }
    },
    computed: {
      settings () {
        return this.$store.state.settings;
      },
    },
    methods: {
      clearList () {
        this.$store.dispatch(at.clearIgnoreList)
      },
      copy() {
        const copyTextarea = document.querySelector('#export');
        copyTextarea.children[0].children[1].children[1].select();
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            this.showToast();
          }
        } catch (err) {
          this.showToast('Oops, unable to copy');
        }
      },
      setSettings () {
        const settings = JSON.parse(atob(this.importSettings));
        this.$store.dispatch(at.setSettings, { settings });
      },
      showToast (message) {
        if (message) {
          this.message = message;
        }
        this.toast = true;
        if (this.toastTimer) clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => {
          this.toast = false
        }, 2000)
      },
      hideToast () {
        this.toast = false;
        if (this.toastTimer) clearTimeout(this.toastTimer)
      },
      reset () {
        this.$store.dispatch(at.setSettings, { settings: resetConst });
      },
    },
    components: { AppHeader, Logout },
  }
</script>

<style scoped>
  .content {
    padding-left: 10px;
    display: flex;
    flex-direction: column;
    padding-top: 64px;
    padding-bottom: 10px;
  }

  .app-bar {
    top: 0;
    width: 100%;
    position: fixed;
  }

  .buttons {
    display: flex;
    flex-direction: column;
  }

  .buttons > button {
    margin-bottom: 10px;
  }
</style>
