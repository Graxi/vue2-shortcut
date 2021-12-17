<template>
  <div class='container'>
    <div class='component' v-shortcut-scope="'a'">Component A</div>
    <div class='component' v-shortcut-scope="'b'">Component B</div>
    <div class='component' v-shortcut-scope="'c'">Component C</div>
    <div class='component' v-shortcut-scope="'d'">Component D</div>
  </div>
</template>

<script>
import Vue from 'vue';
export default {
  name: 'Demo',
  mounted() {
    Vue.createShortcut({
      keyGroup: [['ctrl', 'c']],
      eventHandler: () => {
        console.log('pressing ctrl + c');
      }
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container {
    display: grid;
    width: 100%;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 200px 200px;
  }

  .component {
    border: 1px solid black;
  }
</style>
