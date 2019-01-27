<template>
  <div id="app">
    <!--上面：路由結構-->
    <router-view/>

    <!--上面：底部導航-->
    <!--$route為當前路由-->
    <FooterGuide v-show="$route.meta.showFooter"/>
  </div>

</template>

<script>
  import FooterGuide from './components/FooterGuide/FooterGuide';
  // import {reqFoodTypes} from './api/index';
  import {mapActions} from 'vuex';

  export default {
    // 映射成標籤
    components: {
      FooterGuide
    },
    // 異步請求通常在 mounted()發
    // async mounted() {
    //   this.$store.dispatch('getAddress');
    // },

    mounted() {   // 更新狀態
      this.getAddress();
      this.getUserInfo();   // 獲取用戶訊息
    },

    /*
    1.調用action --> methods: {...mapActions(['getAddress'])}
    2.讀狀態 --> computed: {...mapState(['address'])}
    3.寫模板顯示 --> :title="address.name
     */
    // 調用action
    methods: {
      ...mapActions(['getAddress', 'getUserInfo', ])
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .app
    width 100%
    height 100%
    background #f5f5f5
</style>
