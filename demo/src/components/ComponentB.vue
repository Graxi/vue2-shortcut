<template>
  <div class='component' v-shortcut-scope="'b'">
    Component B
    <p>Component B 下注册的 1) 全局快捷键为 ctrl + b 2) 局部快捷键为 ctrl + d</p>
    <p>当Component B被销毁时 1) ctrl + b快捷键应该被删除 2) ctrl + d快捷键应该被删除</p>
  </div>
</template>

<script>
  import Vue from 'vue';
  
  export default {
    name: 'ComponentB',
    mounted() {
      console.log('mounted B')
      Vue.createShortcuts(this, [
        {
          keys: ['ctrl', 'b'],
          eventHandler: () => {
            console.log('pressing ctrl + b in global scope');
          }
        },
        {
          keys: ['ctrl', 'd'],
          scope: ['b'],
          eventHandler: () => {
            console.log('pressing ctrl + d in b scope');
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