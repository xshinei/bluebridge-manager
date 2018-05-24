// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import IView from 'iview';
import 'iview/dist/styles/iview.css';
import '../src/api/http';

Vue.config.productionTip = false;
Vue.use(IView);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
