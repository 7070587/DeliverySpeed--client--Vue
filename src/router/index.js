/*
路由器對象模塊
 */

import Vue from 'vue';
import VueRouter from 'vue-router';

// import MSite from '../pages/MSite/MSite'
// import Order from '../pages/Order/Order'
// import Profile from '../pages/Profile/Profile'
// import Search from '../pages/Search/Search'

const MSite = () => import('../pages/MSite/MSite');
const Order = () => import('../pages/Order/Order');
const Profile = () => import('../pages/Profile/Profile');
const Search = () => import('../pages/Search/Search');

import Login from '../pages/Login/Login'
import Shop from '../pages/Shop/Shop'
import ShopGoods from '../pages/Shop/ShopGoods/ShopGoods'
import ShopInfo from '../pages/Shop/ShopInfo/ShopInfo'
import ShopRatings from '../pages/Shop/ShopRatings/ShopRatings'



// 聲明使用插件
Vue.use(VueRouter);

export default new VueRouter({
  // 所有路由
  routes: [
    {
      path: '/msite',
      component: MSite,   // 返回路由組件的函數，只有執行此函數，才會加載路由組件，這個函數在請求對應的路由路徑時才會執行
      meta: {
        showFooter: true
      }
    },
    {
      path: '/order',
      component: Order,
      meta: {
        showFooter: true
      }
    },
    {
      path: '/search',
      component: Search,
      meta: {
        showFooter: true
      }
    },
    {
      path: '/profile',
      component: Profile,
      meta: {
        showFooter: true
      }
    },
    {
      path: '/',
      redirect: '/msite'
    },
    {
      path: '/login',
      component: Login
      // 沒有showFooter，默認為false
    },
    {
      path: '/shop',
      component: Shop,
      children: [
        {
          path: '/shop/goods',
          component: ShopGoods
        },
        {
          path: '/shop/ratings',
          component: ShopRatings
        },
        {
          path: '/shop/info',
          component: ShopInfo
        },
        {
          path: '',
          redirect: '/shop/goods'
        },
      ],
    },

  ]
});
