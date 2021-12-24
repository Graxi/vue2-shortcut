<template>
  <div class='container'>
    <button @click="() => displayComponentB = false">Destroy Component B</button>
    <div class='component' v-shortcut-scope="'a'">
      <h4>Component A</h4>
      <p>
        Shortcut is disabled globally in input field
      </p>
      <p>
        <input type='text' />
      </p>
    </div>
    <ComponentB v-if="displayComponentB"/>
    <div class='component' v-shortcut-scope="'c'">Component C</div>
    <div class='component' v-shortcut-scope="'d'">Component D</div>
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
    displayComponentB: boolean = true;

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
