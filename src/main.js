import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import VTooltip from 'v-tooltip'
Vue.use(VTooltip)
import '@/assets/tooltip.css';

new Vue({
  render: h => h(App),
}).$mount('#app')
