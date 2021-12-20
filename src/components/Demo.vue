<template>
  <div class='container'>
    <div class='component' v-shortcut-scope="'a'">
      <h4>Component A</h4>
      <p>
        Shortcut is disabled globally in input field
      </p>
      <p>
        <input type='text' />
      </p>
    </div>
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
    Vue.createShortcuts([
      {
        keyGroup: [['ctrl', 'c']],
        scope: ['a'],
        eventHandler: () => {
          console.log('pressing ctrl + c in scope a');
        }
      },
      {
        keyGroup: [['ctrl', 'a']],
        scope: ['c'],
        eventHandler: () => {
          console.log('pressing ctrl + a in scope c')
        }
      }
    ])
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
