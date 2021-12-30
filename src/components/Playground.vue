<template>
  <div>
    <div id='toolbar'>
      <button @click="toggleComponentB">Toggle Component B</button>
      <button @click="printShortcuts">Print available shortcuts in console</button>
    </div>
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
      <ComponentB v-if="loadComponentB"/>
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
  import ComponentB from './ComponentB.vue';

  @Component({
    components: {
      ComponentB
    }
  })

  export default class Playground extends Vue {
    loadComponentB: boolean = true;

    toggleComponentB() {
      const loadComponentB = this.loadComponentB;
      this.loadComponentB = !loadComponentB;
    }

    printShortcuts() {
      console.log(Vue.getAvailableShortcuts());
    }

    mounted() {
      Vue.createShortcuts(this, [
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
        },
        // keys start with shift
        {
          keys: ['shift', '1'],
          eventHandler: () => {
            console.log('pressing shift + 1 in global scope');
          }
        },
        {
          keys: ['ctrl', 'shift', '1'],
          eventHandler: () => {
            console.log('pressing ctrl + shift + 1 in global scope');
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

  #toolbar {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
  }
</style>
