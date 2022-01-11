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

    <div id='test'>
      <h4>Shortcuts Manual Test in GLOBAL SCOPE</h4>

      <p v-for="(shortcut, index) in manualTestShortcuts" :key="index">{{shortcut}}</p>

    </div>
  </div>
</template>

<script>
  import ComponentB from './ComponentB.vue';
  import Vue from 'vue';

  // only for manual testing
  const FIGMA_SHORTCUTS = [
    ['ctrl', 'c'],
    ['ctrl', 'b']
  ]

  export default {
    name: 'Playground',
    components: {
      ComponentB
    },
    data: function() {
      return {
        loadComponentB: true,
        manualTestShortcuts: [...FIGMA_SHORTCUTS]
      }
    },
    methods: {
      toggleComponentB: function() {
        const loadComponentB = this.loadComponentB;
        this.loadComponentB = !loadComponentB;
      },
      printShortcuts: function() {
        console.log(Vue.getAvailableShortcuts());
      }
    },
    mounted() {
      // section for testing ordered and unordered keys
      Vue.createShortcuts(this, [
        {
          keys: ['ctrl', 'e'],
          eventHandler: () => {
            console.log('pressing ctrl + e in order');
          },
        },
        {
          keys: ['ctrl', 'e'],
          eventHandler: () => {
            console.log('pressing ctrl + e regardless of order');
          },
          unOrdered: true
        }
      ])

      // section for quick testing keys combo
      Vue.createShortcuts(this, this.manualTestShortcuts.map(shortcut => ({
        keys: shortcut,
        eventHandler: () => {
          console.log(`pressing ${shortcut.join('+')}`);

          const idx = this.manualTestShortcuts.indexOf(shortcut);
          if (idx !== -1) this.manualTestShortcuts.splice(idx, 1);
        }
      })))
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
