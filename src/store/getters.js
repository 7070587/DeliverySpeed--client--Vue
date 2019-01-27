/*
包含多個基於state的getter計算屬性的對象
 */

export default {
  // 定義計算屬性
  totalCount(state) {
    return state.cartFoods.reduce((preTotal, food) => preTotal + food.count, 0);
  },

  totalPrice(state) {
    return state.cartFoods.reduce((preTotal, food) => preTotal + food.count * food.price, 0);
  },

  positiveSize(state) {
    return state.ratings.reduce((preTotal, rating) => preTotal + (rating.rateType === 0 ? 1 : 0), 0);
  },
};
