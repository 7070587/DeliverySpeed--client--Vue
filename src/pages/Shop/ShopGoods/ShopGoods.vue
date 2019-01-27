<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper">
        <ul>
          <!--
          功能：
          實現兩個列表滑動
          1.當前分類
          2.當滑動右側列表時，更新當前分類
          3.點擊某個分類項，右側列表滑動到對應位置

          分析：
          類名：current，標識當前分類
          設計一個計算屬性：currentIndex
          根據哪些數據計算
              scrollY：右側滑動的Y軸座標   （滑動過程中時實變化）
              tops：所有右側分類li的top組成的數組 （列表第一次顯示後就不再變化）

          編碼：
          1.在滑動過程中時實收集scrollY
          2.列表第一次顯示後，收集tops
          3.實現currentIndex的計算邏輯

          -->
          <!--current-->
          <li class="menu-item " v-for="(good, index) in goods" :key="index"
              :class="{current: index === currentIndex}" @click="clickMenuItem(index)">
            <span class="text bottom-border-1px">
              <img class="icon" :src="good.icon" v-if="good.icon">
              {{good.name}}
            </span>
          </li>
        </ul>
      </div>

      <div class="foods-wrapper">
        <ul ref="foodsUl">
          <li class="food-list-hook" v-for="(good, index) in goods" :key="index">
            <h1 class="title">{{good.name}}</h1>
            <!--顯示某個分頁項目食物列表-->
            <ul>
              <li class="food-item bottom-border-1px" v-for="(food, index) in good.foods"
                  :key="index" @click="showFood(food)">
                <div class="icon">
                  <img width="57" height="57" :src="food.icon">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span>
                    <span class="count">好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <CartControl :food="food" red="food"/>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <ShopCart />
    </div>
    <!--父組件想要調用子組件對象的方法，先標識組件對象標籤-->
    <Food :food="food" ref="food"/>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import BScroll from 'better-scroll';

  import CartControl from '../../../components/CartControl/CartControl';
  import Food from '../../../components/Food/Food';
  import ShopCart from '../../../components/ShopCart/ShopCart';

	export default {
		name: "ShopGoods",
    data() {
		  return {
        scrollY: 0,   // 右側滑動的Y軸座標   （滑動過程中時實變化）
        tops: [],     // 所有右側分類li的top組成的數組 （列表第一次顯示後就不再變化）
        food: {},     // 需要顯示的food

      };
    },
    mounted() {
		  // 1. 從後台獲取數據
      this.$store.dispatch('getShopGoods', () => {  // 數據更新後執行
        this.$nextTick(() => {  // 列表數據更新顯示後執行
          this._initScroll();
          this._initTops();

        });

      });


    },
    computed: {
      // 2.從state讀數據
      ...mapState(['goods']),

      // 計算得到當前分類的下標
      currentIndex() {  // 初始和相關數據（scrollY, tops）發生變化時執行
        // 得到條件數據
        const {scrollY, tops} = this;

        // 根據條件計算產生的一個結果\
        /*
        findIndex() 方法返回傳入一個測試條件（函數）符合條件的數組第一個元素位置。
        findIndex() 方法為數組中的每個元素都調用一次函數執行：
        當數組中的元素在測試條件時返回 true 時, findIndex() 返回符合條件的元素的索引位置，之後的值不會再調用執行函數。
        如果沒有符合條件的元素返回 -1
         */
        const index = tops.findIndex((top, index) => {
          // scrollY >= 當前top && scrollY < 下一個top
          return scrollY >= top && scrollY < tops[index + 1];
        });

        // 返回結果
        return index;
      },

    },
    methods: {
      // 事件相關的回調函數就不會加_
      // 初始化滾動
      _initScroll() {
        // 在列表顯示之後創建
        new BScroll('.menu-wrapper', {
          click: true,
        });
        this.foodsScroll = new BScroll('.foods-wrapper', {
          probeType: 2,   // 因為慣性的滑動不會觸發
          click: true,

        });

        // 在滑動過程中時實收集scrollY
        // 給右側列表綁定scroll監聽，使用better-scroll提供的on方法
        this.foodsScroll.on('scroll', ({x, y}) => {  // 事件：scroll
          console.log(x, y);
          this.scrollY = Math.abs(y);
        });

        // // 給右側列表綁定scroll結束的監聽
        this.foodsScroll.on('scrollEnd', ({x, y}) => {  // 事件：scrollEnd
          console.log('scrollEnd', x, y);
          this.scrollY = Math.abs(y);
        });

      },

      // 初始化tops
      _initTops() {
        // 1.初始化tops
        const tops = [];
        let top = 0;
        tops.push(top);   // 往tops裡面添加top

        // 2.收集
        // 找到所有右側分類的li
        const lis = this.$refs.foodsUl.getElementsByClassName('food-list-hook');
        // const lis = this.$refs.foodsUl.children;

        // 把偽數組變為真數組：Array.prototype.slice.call(lis)
        Array.prototype.slice.call(lis).forEach(li => {
          top += li.clientHeight;
          tops.push(top);   // 往tops裡面添加top
        });

        // 3.更新狀態
        this.tops = tops;
        console.log(tops);
      },

      clickMenuItem(index) {
       // console.log(index);
        // 使右側列表滑動到對應的位置，使用scrollTo方法

        // 得到目標位置的scrollY
        const scrollY = this.tops[index];
        // 立即更新scrollY（讓點擊的分類項成為當前的分類）
        this.scrollY = scrollY;
        // 平滑滾動右側列表
        this.foodsScroll.scrollTo(0, -scrollY, 300)
      },

      // 顯示點擊的food
      showFood(food) {
        // 設置food
        this.food = food;
        // 顯示food組件（在父組件調用子組件對象的方法）
        // 通過組件標籤就可以調用子組件的方法
        this.$refs.food.toggleShow();

      },

    },

    components: {
		  CartControl,
      Food,
      ShopCart,
    },
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/mixins.styl"
  .goods
    display: flex
    position: absolute
    top: 195px
    bottom: 46px
    width: 100%
    background: #fff;
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          color: $green
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          bottom-border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        bottom-border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
              margin-bottom : 1px
              display: inline-block
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
</style>
