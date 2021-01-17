import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// import router from './krouter';
// import store from './hstore';
import Notice from './plugins/notice';

Vue.use(Notice);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
