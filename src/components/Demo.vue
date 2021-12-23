<template>
  <div>
    <header>
<!--      nav-->
      <ul class="nav">
        <li>
          <router-link to ="/essential">Essential</router-link>
        </li>
        <li>
          <router-link to ="/tool">Tools</router-link>
        </li>
        <li>
          <router-link to ="/view">View</router-link>
        </li>
        <li>
          <router-link to ="/zoom">Zoom</router-link>
        </li>
        <li>
          <router-link to ="/text">Text</router-link>
        </li>
        <li>
          <router-link to ="/shape">Shape</router-link>
        </li>
        <li>
          <router-link to ="/selection">Selection</router-link>
        </li>
        <li>
          <router-link to ="/cursor">Cursor</router-link>
        </li>
        <li>
          <router-link to ="/edit">Edit</router-link>
        </li>
        <li>
          <router-link to ="/transform">Transform</router-link>
        </li>
        <li>
          <router-link to ="/arrange">Arrange</router-link>
        </li>
        <li>
          <router-link to ="/components">Components</router-link>
        </li>
      </ul>
<!--      content-->
      <template class="content">
        <router-view></router-view>
      </template>
    </header>
    <div class='container'>
      <div class='component' v-shortcut-scope="'a'">Component A</div>
      <div class='component' v-shortcut-scope="'b'">Component B</div>
      <div class='component' v-shortcut-scope="'c'">Component C</div>
      <div class='component' v-shortcut-scope="'d'">Component D</div>
    </div>
  </div>
</template>

<script>
 //import Vue from 'vue';
 import VueRouter from "vue-router";
 import Essential from "./nav/Essential";
 const router = new VueRouter({
   routes:[
     {
       path:'/essential',
       component:Essential,
       props:{ nums: true }
     }
   ]
 })
export default {
  name: 'Demo',
  router,
/*  components: {Essential},*/
 /* mounted() {
    Vue.createShortcut({
          /!**!/
      keyGroup: [['ctrl', 'c']],
      scope:['a'],
      eventHandler: () => {
        console.log('pressing ctrl + c in scopeA');
        /!*this.keys.class.add('playing')*!/
        console.log(this.key[0])
        this.key[0].className ='key active'
      }
    },
    )
  }*/
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  header{
    background:#0D1117 ;
  }
  header .nav{
    height:40px;
    display:flex;
    /*flex-direction: row;*/
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
  }
  .nav li{
    margin-left: 10px;
  }

  .container {
    margin-top: 30px;
    display: grid;
    width: 100%;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 200px 200px;
  }

  .component {
    border: 1px solid black;
  }
  li.router-link-active a {
    color: #f66;
  }
</style>
