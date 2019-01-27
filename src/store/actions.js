/*
通過mutation間接更新state的多個方法的對象
 */

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

import {
  reqAddress,
  reqFoodCategories,
  reqShops,
  reqUserInfo,
  reqLogout,
  reqShopGoods,
  reqShopInfo,
  reqShopRatings,
  reqSearchShop,

} from "../api";

export default {
  // 異步獲取地址
  async getAddress({commit, state}) {
    // 發送異步ajax請求
    const geohash = state.latitude + ',' + state.longitude;   // 從satae取出geohash
    const result = await reqAddress(geohash);

    // 提交一個mutation
    if (result.code === 0) {
      const address = result.data;
      commit(RECEIVE_ADDRESS, {address});
    }
  },

  // 異步獲取食品分類數組列表
  async getCategories({commit}) {
    // 發送異步ajax請求
    const result = await reqFoodCategories();

    // 提交一個mutation
    if (result.code === 0) {
      const categories = result.data;
      commit(RECEIVE_CATEGORIES, {categories});
    }
  },

  // 異步獲取商家列表
  async getShops({commit, state}) {
    // 發送異步ajax請求
    const {longitude, latitude} = state;
    const result = await reqShops(longitude, latitude);   // 要按照../api裡面index定義的參數順序傳入

    // 提交一個mutation
    if (result.code === 0) {
      const shops = result.data;
      commit(RECEIVE_SHOPS, {shops});
    }
  },

  // 手上有user -- 同步
  // 手上沒有user，需要從後台發請求 -- 異步
  // 同步紀錄用戶訊息
  recordUser({commit}, userInfo) {
    commit(RECEIVE_USER_INFO, {userInfo});
  },

  // 異步獲取用戶訊息
  async getUserInfo({commit}) {
    const result = await reqUserInfo();
    if (result.code === 0) {
      const userInfo = result.data;
      commit(RECEIVE_USER_INFO, {userInfo});
    }
  },
  // 異步登出
  async logout({commit}) {
    const result = await reqLogout();
    if (result.code === 0) {
      commit(RESET_USER_INFO);
    }
  },

  // 異步獲取商家訊息
  async getShopInfo({commit}) {
    const result = await reqShopInfo();
    if (result.code === 0) {
      const info = result.data;
      commit(RECEIVE_INFO, {info});
    }
  },



  // 異步獲取商家評價訊息
  async getShopRatings({commit}, callback) {
    const result = await reqShopRatings();
    if (result.code === 0) {
      const ratings = result.data;
      commit(RECEIVE_RATINGS, {ratings});
      // 數據更新了，通知一下組件
      callback && callback();
    }
  },

  // 異步獲取商家商品列表
  async getShopGoods({commit}, callback) {
    const result = await reqShopGoods();
    if (result.code === 0) {
      const goods = result.data;
      commit(RECEIVE_GOODS, {goods});
      // 數據更新了，通知一下組件
      callback && callback();
    }
  },

  // 同步更新food中的count值
  updateFoodCount({commit}, {isAdd, food}) {
    if (isAdd) {
      commit(INCREMENT_FOOD_COUNT, {food});
    } else {
      commit(DECREMENT_FOOD_COUNT, {food});

    }
  },

  // 同步清空購物車
  clearCart({commit}) {
    commit(CLEAR_CART)
  },

  // 異步獲取搜索的商家列表
  // async searchShops({commit, state}, keyword) {
  //
  //   const geohash = state.latitude + ',' + state.longitude;   // 從satae取出geohash
  //   const result = await reqSearchShop({geohash, keyword});
  //   if (result.code === 0) {
  //     const searchShops = result.data;
  //     commit(RECEIVE_SEARCH_SHOPS, {searchShops});
  //   }
  // },

  async searchShops({commit, state}, keyword) {

    const geohash = state.latitude + ',' + state.longitude
    const result = await reqSearchShop({geohash, keyword})
    if (result.code === 0) {
      const searchShops = result.data
      commit(RECEIVE_SEARCH_SHOPS, {searchShops})
    }
  },

}
