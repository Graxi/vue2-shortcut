import Vue from 'vue'
import App from './App.vue'
import VShortcut from './shortcut';
import router from './router'
import './assets/reset.css'


Vue.use(VShortcut);


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')


