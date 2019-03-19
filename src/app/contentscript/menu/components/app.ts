import { dragDirective } from '@contentscript/vuedirective/drag/index';
import Buefy from 'buefy';
import Vue from 'vue';
import App from './App.vue';

// Vue devtools を有効にする {
Vue.config.devtools = true;
// }

// Buefy の css は App.vue 内で定義している。 {
Vue.use(Buefy, {
  defaultIconPack: 'fas',
});
// }

// directive を登録する {
Vue.directive('drag', dragDirective);
// }

const app = new Vue({
  render: h => h(App),
});

export default app;
