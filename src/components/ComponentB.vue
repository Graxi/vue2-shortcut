<template>
  <div class='component' v-shortcut-scope="'b'">
    Component B
    <p>Component B 下注册的全局快捷键为 ctrl + b</p>
    <p>当Component B被销毁时 ctrl + b快捷键应该被删除</p>
  </div>
</template>

<script lang='ts'>
  import { Component, Vue } from 'vue-property-decorator';

  @Component
  export default class ComponentB extends Vue {
    mounted() {
      console.log('mounted B')
      Vue.createShortcuts(this, [
        {
          keyGroup: [['ctrl', 'b']],
          eventHandler: () => {
            console.log('pressing ctrl + b in global scope');
          }
        }
      ])
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