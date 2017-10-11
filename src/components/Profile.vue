<template>
  <a class="root" @click="open" @mouseenter="mouseOver(item.uid)" @mouseleave="mouseLeave"
     :href="'https://vk.com/id' + item.uid"
     target="_blank">
    <div :class="[ item.seen ? 'seen ' + size : '' ]"></div>
    <div class="image">
      <img :class="size" v-lazy="item.photo_max"/>
      <div v-if="activeId === item.uid" :class="'name ' + size + '_name'">
        <span>{{ item.first_name }} {{ item.last_name }}</span>
        <a target="_blank" :href="lastfm" class="lastfm" v-if="lastfm">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
            <path fill="white"
                  d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-.707 14.605l-.441-1.196s-.715.798-1.785.798c-.949 0-1.623-.825-1.623-2.145 0-1.691.852-2.296 1.691-2.296 1.209 0 1.594.784 1.924 1.787l.44 1.375c.439 1.333 1.265 2.405 3.642 2.405 1.705 0 2.859-.522 2.859-1.896 0-1.114-.633-1.691-1.814-1.966l-.879-.193c-.605-.137-.784-.384-.784-.797 0-.467.37-.742.976-.742.66 0 1.018.247 1.072.839l1.374-.165c-.11-1.237-.961-1.746-2.364-1.746-1.236 0-2.446.467-2.446 1.965 0 .935.454 1.526 1.595 1.801l.936.22c.699.165.934.453.934.852 0 .509-.494.715-1.43.715-1.389 0-1.965-.728-2.295-1.732l-.454-1.374c-.577-1.787-1.499-2.447-3.327-2.447-2.022 0-3.094 1.278-3.094 3.45 0 2.09 1.072 3.216 2.997 3.216 1.553 0 2.296-.728 2.296-.728z"/>
          </svg>
        </a>
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
    computed: {
      lastfm() {
        if (this.item.site) {
          const matchedLastFm = this.item.site.match(/last\.?fm(.ru)?\/user\/[a-zA-Z0-9_-]{2,14}/gi);
          if (matchedLastFm) {
            return `https://${matchedLastFm[0]}`;
          }
        }
        return null;
      },
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

  .lastfm {
    position: relative;
    display: inline-flex;
    top: 2px;
  }
</style>
