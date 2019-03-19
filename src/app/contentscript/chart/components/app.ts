import Buefy from 'buefy';
import Vue from 'vue';
import App from './App.vue';

// Buefy の css は App.vue 内で定義している。 {
Vue.use(Buefy);
// }

// Vue devtools を有効にする {
Vue.config.devtools = true;
// }

const app = new Vue({
  render: h => h(App),
});

export default app;
