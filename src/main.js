import Vue from 'vue'
import App from './App.vue'
import VShortcut from './shortcut';

Vue.use(VShortcut, {
  excludeTags: ['input', 'textarea'], // optional
  preventWhen: () => true, // optional
});

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
