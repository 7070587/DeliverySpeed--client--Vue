<template>
  <section class="search">
    <HeaderTop title="搜尋"/>
    <form class="search_form" @submit.prevent="search">
      <input type="search" placeholder="請輸入商家名稱" class="search_input" v-model="keyword">
      <input type="submit" class="search_submit">
    </form>

    <section class="list" v-if="!noSearchShops">
      <ul class="list_container">
        <!--:to="'/shop?id='+item.id"-->
        <router-link :to="{path:'/shop', query:{id:item.id}}" tag="li"
                     v-for="item in searchShops" :key="item.id" class="list_li">
          <section class="item_left">
            <img :src="imgBaseUrl + item.image_path" class="restaurant_img">
          </section>
          <section class="item_right">
            <div class="item_right_text">
              <p>
                <span>{{item.name}}</span>
              </p>
              <p>月售 {{item.month_sales||item.recent_order_num}} 單</p>
              <p>{{item.delivery_fee||item.float_minimum_order_amount}} 元起送 / 距離{{item.distance}}</p>
            </div>
          </section>
        </router-link>

      </ul>
    </section >
    <div class="search_none" v-else>很抱歉，沒有搜尋結果，請重新輸入</div>

  </section>
</template>
<script>
  import HeaderTop from '../../components/HeaderTop/HeaderTop'

  import {mapState} from 'vuex';

  export default {
    name: "Search",
    data() {
      return {
        keyword: '',
        imgBaseUrl: 'https://elm.cangdu.org/img/',
        noSearchShops: false,   // 標識是某有搜尋結果的變量：標識搜索的結果是否有數據
      }
    },

    computed: {
      ...mapState(['searchShops']),
    },

    methods: {
      search() {
        // 得到輸入的搜索關鍵字
        const keyword = this.keyword.trim();

        // 進行搜索（有值才進行搜索）
        if (keyword) {
          // this.noSearchShops = false;   // 搜尋之前要先改為false，可以寫在下面，也可以寫在這裡
          this.$store.dispatch('searchShops', keyword);
        }

      },

    },

    watch: {
      // 監視搜索的改變
      searchShops(value) {
        if (!value.length) {  // 沒有數據
          this.noSearchShops = true;
        } else {
          this.noSearchShops = false;   // 有數據：再次搜尋之前要先改為false
        }
      },
    },


    components: {
      HeaderTop
    },
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixins.styl"
  .search
    width 100%
    height 100%
    overflow hidden

    .search_form
      clearFix()
      margin-top 45px
      background-color #fff
      padding 12px 8px

      input
        height 35px
        padding 0 4px
        border-radius 2px
        font-weight bold
        outline none

        &.search_input
          float left
          width 79%
          border 4px solid #f2f2f2
          font-size 14px
          color #333
          background-color #f2f2f2

        &.search_submit
          float right
          width 18%
          border 4px solid #02a774
          font-size 16px
          color #fff
          background-color #02a774

    .list
      .list_container
        background-color: #fff;

        .list_li
          display: flex;
          justify-content: center;
          padding: 10px
          border-bottom: 1px solid $bc;

          .item_left
            margin-right: 10px

            .restaurant_img
              width 50px
              height 50px
              display block

          .item_right
            font-size 12px
            flex 1

            .item_right_text
              p
                line-height 12px
                margin-bottom 6px

                &:last-child
                  margin-bottom 0

    .search_none
      margin: 0 auto
      color: #333
      background-color: #fff
      text-align: center
      margin-top: 0.125rem
</style>
