<template>
  <div class='component' v-shortcut-scope="'b'">
    <h4>Component B</h4>
    <p>Available Scoped Shortcut: ctrl + b</p>
    <p>Available Global Shortcut: shift + b</p>
    <p>Both shortcuts are removed after Component B is unmounted</p>
  </div>
</template>

<script>
  import Vue from 'vue';
  
  export default {
    name: 'ComponentB',
    mounted() {
      Vue.createShortcuts(this, [
        {
          keys: ['ctrl', 'b'],
          scope: ['b'],
          eventHandler: () => {
            this.$emit('log', 'you just pressed ctrl + b in scope b');
          },
          description: 'CTRL + B'
        },
        {
          keys: ['shift', 'b'],
          eventHandler: () => {
            this.$emit('log', 'you just pressed shift + b');
          }
        }
      ])
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .component {
    border: 1px solid black;
  }
</style>