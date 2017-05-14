<template>
  <div class="root">
    <group-logo :item="item.info"></group-logo>
    <members :item="item.data"></members>
  </div>
</template>

<script>
  import Members from './Members';
  import GroupLogo from './GroupLogo';

  export default {
    name: 'group',
    components: {
      Members, GroupLogo,
    },
    props: {
      item: { type: Object, required: true },
    },
  };
</script>

<style scoped>
  .root {
    height: 100px;
    border-top: solid 1px #e7e8ec;
    padding: 10px;
    display: flex;
  }
</style>
