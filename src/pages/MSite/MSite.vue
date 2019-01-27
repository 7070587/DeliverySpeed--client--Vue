<template>
  <section class="msite">
    <!--首頁頭部-->
    <HeaderTop title="我的位置">
      <router-link class="header_search" slot="left" to="/search">
        <i class="iconfont icon-sousuo"></i>
      </router-link>
      <router-link class="header_login" slot="right" :to="userInfo._id ? '/userInfo' : '/login'">
        <span class="header_login_text" v-if="!userInfo._id">登入&nbsp;|&nbsp;注冊</span>
        <span class="header_login_text" v-else>
        <i class="iconfont icon-person" ></i>
        </span>
      </router-link>
    </HeaderTop>

    <!--首頁導航-->
    <nav class="msite_nav">
      <div class="swiper-container" v-if="categories.length">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(categories, index) in categoriesArr" :key="index">
            <a href="javascript:" class="link_to_food" v-for="(categories,index) in categories"
               :key="index">
              <div class="food_container">
                <img :src="baseImageUrl + categories.image_url">
                <!--<img :src="baseImageUrl + categories.image_url">-->

              </div>
              <span>{{categories.title}}</span>
            </a>

          </div>
        </div>
        <!-- Add Pagination -->
        <div class="swiper-pagination"></div>
      </div>
      <img src="./images/msite_back.svg" alt="back" v-else>
    </nav>
    <!--首頁附近商家-->
    <div style="height: 10px;"></div>
    <div class="msite_shop_list">
      <div class="shop_header">
        &nbsp;&nbsp;<i class="iconfont icon-xuanxiang">&nbsp;<span class="shop_header_title">附近商家</span></i>

      </div>
      <ShopList/>
    </div>
  </section>

</template>

<script>
  import Swiper from 'swiper'
  import 'swiper/dist/css/swiper.css'
  import {mapState} from 'vuex';

  import HeaderTop from '../../components/HeaderTop/HeaderTop'
  import ShopList from '../../components/ShopList/ShopList'

  export default {
    name: "MSite",
    // 映射成標籤
    components: {
      HeaderTop,
      ShopList,
    },
    data() {
      return {
        baseImageUrl: 'https://fuss10.elemecdn.com'
      }
    },
    mounted() {
      /*
	  1.調用action
	  2.讀狀態
	  3.寫模板顯示
	   */
      // 觸發action調用
      this.$store.dispatch('getCategories');
      this.$store.dispatch('getShops');


    },
    // 在計算屬性裡面讀狀態
    computed: {
      ...mapState(['address', 'categories', 'userInfo', ]),

      // 根據categories一維數組，生成一個二維數組categoriesArr
      // 小數組中的元素個數最大是8
      categoriesArr() {
        const {categories} = this;
        // 準備空的二維數組
        const arr = [];
        // 準備一個小數組（最大長度為8）
        let minArr = [];

        // 遍歷categories
        categories.forEach(category => {

          // 小數組最多放八項，因此需要判斷
          // 如果當前小數組minArr已經滿了，創建一個新的
          if (minArr.length === 8) {
            minArr = [];
          }
          // 如果minArr是空的，將小數組保存到大數組中
          if (minArr.length === 0) {
            arr.push(minArr);
          }
          // 將當前分類保存到小數組中
          // 要確認兩件事：（1）小數組已經保存大數組裡面，（2）小數組還沒有滿
          minArr.push(category);

        });

        return arr;
      }
    },

    // 監視categories
    watch: {
      categories(value) {   // categories數組中有數據了，在異步更新界面之前執行

        // 使用setTimeout可以實現效果，但不是太好
        // setTimeout(() => {
        // // 創建一個Swiper實例對象，來實現輪播
        //   new Swiper('.swiper-container', {
        //     loop: true, // 可以循環輪播
        //     // 如果需要分頁器
        //     pagination: {
        //       el: '.swiper-pagination',
        //     },
        //   });
        // }, 100);

        // 界面更新就立即創建Swiper對象
        this.$nextTick(() => {  // 一旦完成界面更新，立即調用，此條語句要寫在數據更新之後
        // 創建一個Swiper實例對象，來實現輪播
          new Swiper('.swiper-container', {
            loop: true, // 可以循環輪播
            // 如果需要分頁器
            pagination: {
              el: '.swiper-pagination',
            },
          });
        });
      },
    },
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .msite //首頁
    width 100%

    .msite_nav
      bottom-border-1px(#e4e4e4)
      margin-top 45px
      height 200px
      background #fff

      .swiper-container
        width 100%
        height 100%

        .swiper-wrapper
          width 100%
          height 100%

          .swiper-slide
            display flex
            justify-content center
            align-items flex-start
            flex-wrap wrap

            .link_to_food
              width 25%

              .food_container
                display block
                width 100%
                text-align center
                padding-bottom 10px
                font-size 0

                img
                  display inline-block
                  width 50px
                  height 50px

              span
                display block
                width 100%
                text-align center
                font-size 13px
                color #666

        .swiper-pagination
          > span.swiper-pagination-bullet-active
            background #02a774

      .msite_shop_list
        top-border-1px(#e4e4e4)
        margin-top 10px
        background #fff

        .shop_header
          padding 10px 10px 0

          .shop_icon
            margin-left 5px
            color #999

          .shop_header_title
            display block
            color #999
            font-size 14px
            line-height 20px
</style>
