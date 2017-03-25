<template>
  <div class="root">
    <mu-select-field @change="change" class="select" :value="strategy">
      <mu-menu-item key="text" v-for="text in list" :value="text" :title="text"/>
    </mu-select-field>
  </div>
</template>

<script>
  import { strategy as st } from '../const/index';

  export default {
    name: 'ignore-strategy-select',
    props: { strategy: { default: st.darkenOnClick } },
    data () {
      return {
        list: [st.noop, st.hide, st.darkenOnClick, st.darkenOnScroll],
      };
    },
    methods: {
      change(e) {
        this.$emit('change', e);
      },
    },
  };
</script>

<style scope>
  .root {
    display: flex;
    align-items: center;
  }

  .select {
    width: 120px !important;
    min-height: 0 !important;
    margin: 0 !important;
  }

  .select > div {
    padding: 0;
  }
</style>
