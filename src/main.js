// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

//兼容IE
import 'babel-polyfill';
//
import Vue from 'vue';
//import App from './App'
import router from './router';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.min.js';
// import cmpntHeader from './components/cmpnt-header';
import mainMenu from '@/components/main-menu.vue';
import globalVariable from '@/components/global_variable.js';

// 
import axios from 'axios';
import toastRegistry from './toast/index';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText }
 from '@fortawesome/vue-fontawesome';

 
library.add(fas, far, fab);
 
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('font-awesome-layers', FontAwesomeLayers);
Vue.component('font-awesome-layers-text', FontAwesomeLayersText);


Vue.prototype.GLOBAL=globalVariable;
axios.defaults.baseURL = process.env.API_ROOT;
Vue.prototype.$axios = axios;



//以下为测试全局组件代码
Vue.use(toastRegistry);
//测试部分结束

Vue.config.productionTip = false;
// var istcCmpntHeader = new Vue({
//   el: '#cmpntHeader',
//   router,
//   components: { cmpntHeader },
//   template: '<cmpntHeader/>'
// })

var mainApp = new Vue({
  el: '#main-menu',
  router,
  components: { mainMenu },
  template: '<main-menu/>'
});


// var cmpntNavTop = new Vue({
//   el: '#nav-top',
//   router,
//   components: { navTop },
//   template: '<nav-top/>'
// })

