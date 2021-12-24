import Vue from 'vue'
import App from './App.vue'
import VShortcut, { Options } from './shortcut';

const options: Options = {
  excludeTags: ['input', 'textarea'], // optional
}

Vue.use(VShortcut, options);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
