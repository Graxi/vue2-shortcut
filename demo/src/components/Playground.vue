<template>
  <div>
    <div id='toolbar'>
      <button @click="toggleComponentB">Toggle Component B</button>
      <button @click="printShortcuts">Print available shortcuts in console</button>
    </div>
    <div class='container'>
      <div class='component'>
        <h4>Component A</h4>
        <p>
          Shortcut is disabled globally in input field
        </p>
        <p>
          <input type='text' />
        </p>
      </div>
      <ComponentB @log="message => logMessage = message" v-if="loadComponentB" />
    </div>
    <div>
      {{logMessage}}
    </div>
  </div>
</template>

<script>
  import ComponentB from './ComponentB.vue';
  import Vue from 'vue';

  export default {
    name: 'Playground',
    components: {
      ComponentB
    },
    data: function() {
      return {
        loadComponentB: true,
        logMessage: ''
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
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container {
    display: grid;
    width: 100%;
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
