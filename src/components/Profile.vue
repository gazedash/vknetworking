<template>
  <div class="root">
    <div>
      <a @click="open" @mouseenter="mouseOver(profile.uid)" @mouseleave="mouseLeave" :href="'https://vk.com/id' + profile.uid"
         target="_blank">
        <div :class="{ seen }">
        </div>
        <div class="image">
          <!--@error-->
          <img v-lazy="profile.photo_max"/>
          <div v-if="activeId === profile.uid" class="name">
            {{ profile.first_name }} {{ profile.last_name }}
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'profile',
    props: {
      profile: {type: Object, required: true},
      seen: {type: Boolean, default: false}
    },
    data () {
      return {
        activeId: null,
      }
    },
    methods: {
      open() {
        this.$emit('open', this.profile.uid)
      },
      mouseOver(id) {
        this.activeId = id;
      },
      mouseLeave() {
        this.activeId = null;
      }
    }
  }
</script>

<style scoped>
  .root {
    /*box-shadow: 0 27px 55px 0 rgba(0, 0, 0, 0.1), 0 7px 12px 0 rgba(0, 0, 0, 0.10);*/
    background-color: #fafafa;
  }

  .seen {
    position: absolute;
    background: rgba(0,0,0,0.35);
    z-index: 0;
  }

  .seen, img {
    height: 200px;
    width: 200px;
  }

  a {
    display: block;
    text-decoration: none;
    color: black;
  }

  .image {
    z-index: 0;
    display: flex;
    justify-content: center;
  }

  .name {
    background-color: rgba(0, 0, 0, 0.25);
    color: #fff;
    position: absolute;
    margin-top: 12.1em;
    z-index: 1;
    width: 200px;
    overflow: hidden;
    padding: 5px 0 5px 0;
    text-align: center;
  }

  @media screen and (max-width: 360px) {
    .seen, img {
      height: 100px;
      width: 100px;
    }

    .name {
      word-break: keep-all;
      overflow: hidden;
      font-size: 10px;
      padding: 2px 0 2px 0;
      margin-top: 6em;
      width: 100px;
    }
  }

  @media screen and (min-width: 1220px) {
    .seen, img {
      height: 240px;
      width: 240px;
    }

    .name {
      margin-top: 14.9em;
      width: 240px;
    }
  }

  @media screen and (min-width: 1440px) {
    .seen, img {
      height: 260px;
      width: 260px;
    }

    .name {
      margin-top: 16.35em;
      width: 260px;
    }
  }

  @media screen and (min-width: 1570px) {
    .seen, img {
      height: 280px;
      width: 280px;
    }

    .name {
      margin-top: 17.8em;
      width: 280px;
    }
  }
</style>
