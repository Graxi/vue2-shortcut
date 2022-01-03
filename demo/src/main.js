import Vue from 'vue'
import App from './App.vue'
import vShortcut from '../../dist/shortcut';

Vue.use(vShortcut);
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
