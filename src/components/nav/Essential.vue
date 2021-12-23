<template>
<div class="essential">
  <h1>Essential keyboard shortcuts</h1>
  <div class="essentialContent">
    <div class="box" v-for="( num , i ) in nums" :key="i">
      <div class="box-left">
        {{ i+1 }}
        <h2 style="margin:10px 0 ">Show/Hide UI</h2>
        <p style="margin:10px 0 ">
          {{ num.msg }}
        </p>
      </div>
<!--      keyboard-->
        <div class="box-right" >
<!--            <div :class="activeClass == i ? 'key active':'key'">-->
          <div  class="key" ref="key">
              <kdb>{{ num.key1 }}</kdb>+<kbd>{{ num.key2 }}</kbd>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import Vue from "vue";
export default {
  name: "Essential",
  data() {
    return {
      nums: [
        {msg:'Press it how to quickly hide the panes and focus on you work',key1:'Crtl',key2:'C'},
        {msg:'Grab a color',key1:'Crtl',key2:'D'},
        {msg: 'Search through',key1:'Crtl',key2:'V'}
      ]
    }
  },

 /* methods:{
    IsActive(i) {
      this.activeClass = i
    }
  },*/
  mounted() {
    Vue.createShortcut({
          /**/
          keyGroup: [['ctrl', 'c']],
          scope:['a'],
          eventHandler: () => {
            console.log('pressing ctrl + c in scopeA');
            /*this.IsActive(i)*/
            console.log(this.$refs.key[0])
            this.$refs.key[0].className ='key active'
          }
    })
  }
}
</script>

<style scoped>

.essential h1{
  font-weight: bold;
  margin:20px 20px;
}
.essentialContent {
  width:100%;
  display: flex;
  justify-content: flex-start;
}
.essentialContent .box{
  width: 400px;
  margin: 0 20px;
  display: flex;
  justify-content: space-between;
}
.essentialContent h2{
  /*color: #0D53D2;*/
  font-weight: bold;
}
.box-right {
  width: 80px;
  margin: 0 10px;
}
/*.keys {
  display:flex;
  flex:1;
  align-items: center;
  justify-content: center;
}*/

.key {
  font-family: monospace;
  font-weight: bold;
  font-size: 16px;
  border:2px solid black;
  border-radius:5px;
 /* margin:1rem;*/
  padding:1rem 0;
  transition:all .07s;
  width:100px;
  text-align: center;
  color:white;
  background:rgba(0,0,0,0.4);
  text-shadow:0 0 5px black;
}

.active {
  transform:scale(1.1);
  border-color:#ffc600;
  box-shadow: 0 0 10px #ffc600;
}

/*
kbd {

}*/
</style>