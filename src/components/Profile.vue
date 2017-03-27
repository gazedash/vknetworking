<template>
  <a class="root" @click="open" @mouseenter="mouseOver(item.uid)" @mouseleave="mouseLeave"
     :href="'https://vk.com/id' + item.uid"
     target="_blank">
    <div :class="[ item.seen ? 'seen ' + size : '' ]">
    </div>
    <div class="image">
      <img :class="size" v-lazy="item.photo_max"/>
      <div v-if="activeId === item.uid" :class="'name ' + size + '_name'">
        {{ item.first_name }} {{ item.last_name }}
      </div>
    </div>
  </a>
</template>

<script>
  export default {
    name: 'profile',
    props: {
      item: { type: Object, required: true },
//      seen: { type: Boolean, default: false },
      size: { type: String, default: 'small' },
    },
    data () {
      return {
        activeId: null,
      };
    },
    methods: {
      open() {
        this.$emit('open', this.item.uid);
      },
      mouseOver(id) {
        this.activeId = id;
      },
      mouseLeave() {
        this.activeId = null;
      },
    },
  }
</script>

<style scoped>
  .root {
    /*box-shadow: 0 27px 55px 0 rgba(0, 0, 0, 0.1), 0 7px 12px 0 rgba(0, 0, 0, 0.10);*/
    background-color: #fafafa;
  }
  a {
    display: block;
    text-decoration: none;
    color: black;
  }

  .seen {
    position: absolute;
    background: rgba(0, 0, 0, 0.35);
    z-index: 0;
  }

  /*small*/
  .name {
    background-color: rgba(0, 0, 0, 0.25);
    color: #fff;
    position: absolute;
    margin-top: 169px;
    z-index: 1;
    width: 200px;
    overflow: hidden;
    padding: 5px 0 5px 0;
    text-align: center;
  }

  .extra-small {
    height: 100px;
    width: 100px;
  }

  .extra-small_name {
    word-break: keep-all;
    overflow: hidden;
    font-size: 10px;
    padding: 2px 0 2px 0;
    margin-top: 66px;
    width: 100px;
  }

  .small {
    height: 200px;
    width: 200px;
  }

  .medium {
    height: 240px;
    width: 240px;
  }

  .medium_name {
    margin-top: 210px;
    width: 240px;
  }

  .large {
    height: 260px;
    width: 260px;
  }

  .large_name {
    margin-top: 229px;
    width: 260px;
  }

  .extra-large {
    height: 280px;
    width: 280px;
  }

  .extra-large_name {
    margin-top: 249px;
    width: 280px;
  }

  .image {
    z-index: 0;
    display: flex;
    justify-content: center;
  }
</style>
