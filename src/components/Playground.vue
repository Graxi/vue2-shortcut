<template>
  <div>
    <button @click="printShortcuts">Print available shortcuts in console</button>
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
      <div class='component' v-shortcut-scope="'b'">
        <h4>Component B</h4>
      </div>
      <div class='component' v-shortcut-scope="'c'">
        <h4>Component C</h4>
      </div>
      <div class='component' v-shortcut-scope="'d'">
        <h4>Component D</h4>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
  import { Component, Vue } from 'vue-property-decorator';

  @Component
  export default class Playground extends Vue {

    printShortcuts() {
      console.log(Vue.getAvailableShortcuts());
    }

    mounted() {
      Vue.createShortcuts([
        {
          keys: ['ctrl', 'c'],
          scope: ['a'],
          eventHandler: () => {
            console.log('pressing ctrl + c in scope a');
            console.log('executed repeatedly');
            console.log('*************');
          }
        },
        {
          keys: ['ctrl', 'c'],
          eventHandler: () => {
            console.log('pressing ctrl + c in global scope');
            console.log('executed once');
            console.log('*************');
          },
          once: true
        },
        {
          keys: ['ctrl', 'a'],
          scope: ['c'],
          eventHandler: () => {
            console.log('pressing ctrl + a in scope c')
          }
        },
        // space key
        {
          keys: ['a', ' '],
          eventHandler: () => {
            console.log('pressing space in global scope');
          }
        },
        // special keys: , or . or \(should use \\ to escape \) or /
        {
          keys: ['\\', 'a'],
          eventHandler: () => {
            console.log('pressing \\ in global scope');
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
