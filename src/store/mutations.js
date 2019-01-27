/*
直接更新state的多個方法的對象
 */
import Vue from 'vue';

import {
  RECEIVE_ADDRESS,
  RECEIVE_CATEGORIES,
  RECEIVE_SHOPS,
  RECEIVE_USER_INFO,
  RESET_USER_INFO,
  RECEIVE_INFO,
  RECEIVE_RATINGS,
  RECEIVE_GOODS,
  INCREMENT_FOOD_COUNT,
  DECREMENT_FOOD_COUNT,
  CLEAR_CART,
  RECEIVE_SEARCH_SHOPS

} from "./mutation-types";

export default {
  [RECEIVE_ADDRESS] (state, {address}) {
    state.address = address;
  },

  [RECEIVE_CATEGORIES] (state, {categories}) {
    state.categories = categories;
  },

  [RECEIVE_SHOPS] (state, {shops}) {
    state.shops = shops;
  },

  [RECEIVE_USER_INFO] (state, {userInfo}) {
    state.userInfo = userInfo;
  },

  [RESET_USER_INFO] (state) {
    state.userInfo = {};
  },

  [RECEIVE_INFO](state, {info}) {
    state.info = info
  },

  [RECEIVE_RATINGS](state, {ratings}) {
    state.ratings = ratings
  },

  [RECEIVE_GOODS](state, {goods}) {
    state.goods = goods
  },

  [INCREMENT_FOOD_COUNT](state, {food}) {
    if (!food.count) {
      // 第一次增加：開始count為0，點擊後增加為1
     // food.count = 1  // 新增屬性，沒有數據綁定效果
      // set(對象, 屬性名（字符串）, 屬性值)：給有數據綁定的對象添加效果
      Vue.set(food, 'count', 1);  // 讓新增的屬性也有數據綁定
      // 將food添加到cartFoods中
      state.cartFoods.push(food);
      /*
      通過兩個引用變量指向同一個對象，通過一個引用變量改變對象的數據，另外一個引用變量能看見
      兩個引用變量指向同一個對象，一個引用變量指向另一個對象（新建一個對象，賦值給它），而另一個引用變量還是指向原來對象
       */
    } else {
      // 第二次增加，已經有值，所以可以直接增加
      food.count++;
    }
  },

  [DECREMENT_FOOD_COUNT](state, {food}) {
    if (food.count) {   // 只有food.count有值才可以減少，避免點擊多次出現負數的情況
      food.count--;
      if (food.count === 0) {}
      // 將food從cardFoods中移除
      state.cartFoods.splice(state.cartFoods.indexOf(food), 1);
    }
  },

  [CLEAR_CART](state) {
    // 清除food中的count
    state.cartFoods.forEach(food => food.count = 0);

    // 移除購物車中的品項
    state.cartFoods = [];
  },

  [RECEIVE_SEARCH_SHOPS](state, {searchShops}) {
    state.searchShops = searchShops;
  },
}
