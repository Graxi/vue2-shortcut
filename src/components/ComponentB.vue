<template>
  <div class='component' v-shortcut-scope="'b'">Component B</div>
</template>

<script lang='ts'>
  import { Component, Vue } from 'vue-property-decorator';

  @Component
  export default class ComponentB extends Vue {
    mounted() {
      console.log('mounted B')
      Vue.test(this);
    }

    beforeDestroy() {
      console.log('destroy B')
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .component {
    border: 1px solid black;
  }
</style>