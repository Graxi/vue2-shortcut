import Vue from 'vue'
import App from './App.vue'
import VShortcut from './shortcut';

Vue.use(VShortcut);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
