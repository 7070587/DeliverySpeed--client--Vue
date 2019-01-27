/*
入口JS
 */
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';

import {Button} from 'mint-ui';
import VueLazyload from 'vue-lazyload'

import './mock/mockServer';   // 加載mockServer即可
import loading from './common/imgs/loading.gif'
import './filters'    // 加載過濾器

// 註冊全局組件標籤
Vue.component(Button.name, Button);   // <mt-button>
Vue.use(VueLazyload, {  // 內部自定義一個指令lazy
  loading
});

// 聲明使用vue-router插件
/*
內部定義並注冊了2個組件標簽(router-link/router-view),
給組件對像添加了2個屬性:
  1. $router: 路由器
  2. $route: 當前路由
 */

new Vue({
  el: '#app',
  render: h => h(App),
  router,   // 使用vue-router
  store,    // 使用vuex

});
