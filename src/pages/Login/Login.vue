<template>
  <section class="loginContainer">
    <div class="loginInner">
      <div class="login_header">
        <h2 class="login_logo">DeliverySpeed</h2>
        <div class="login_header_title">
          <!--關鍵：有一個標識變量或屬性，標識登入方式，當點到哪個，就會跳轉到點擊的那個-->
          <a href="javascript:;" :class="{on: loginWay}" @click="loginWay = true">手機登入</a>
          <!--loginWay為true時-->
          <a href="javascript:;" :class="{on: !loginWay}" @click="loginWay = false">密碼登入</a>
          <!--loginWay為false時-->
        </div>
      </div>

      <div class="login_content">
        <form @submit.prevent="login">
          <div :class="{on: loginWay}">
            <section class="login_message">
              <input type="tel" maxlength="11" placeholder="手機號碼" v-model="phone">
              <!--rightPhone的數據根據phone就可以確定，說明rightPhone是計算屬性-->
              <button :disabled="!rightPhone" class="get_verification"
                      :class="{right_phone: rightPhone}" @click.prevent="getCode">
                {{computeTime > 0 ? `已發送(${computeTime}s)` : '獲取驗證碼'}}
              </button> <!--@click.prevent：點擊後不要提交表單-->
            </section>
            <section class="login_verification">
              <input type="tel" maxlength="8" placeholder="驗證碼" v-model="code">
            </section>
            <section class="login_hint">
              溫馨提示：未注冊DeliverySpeed帳號的手機號碼，登入時將自動注冊，且代表已同意
              <a href="javascript:;">《用戶服務協議》</a>
            </section>
          </div>
          <div :class="{on: !loginWay}">
            <section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="手機/信箱/帳號" v-model="name">
              </section>
              <section class="login_verification">
                <input type="text" maxlength="8" placeholder="密碼"
                       v-if="showPwd" v-model="pwd">
                <input type="password" maxlength="8" placeholder="密碼"
                       v-else v-model="pwd">
                <div class="switch_button" :class="showPwd ? 'on' : 'off'"
                     @click="showPwd = !showPwd">
                  <div class="switch_circle" :class="{right: showPwd}"></div>
                  <span class="switch_text">{{showPwd ? 'abc' : '...'}}</span>
                </div>
              </section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="驗證碼" v-model="captcha">
                <img class="get_verification" src="http://localhost:4000/captcha" alt="captcha"
                     @click="getCaptcha" ref="captcha">
                <!--點擊圖片驗證碼獲取新的請求的方式：找到img，重新指定src-->
              </section>
            </section>
          </div>
          <button class="login_submit">登入</button>
        </form>
        <a href="javascript:;" class="about_us">關於我們</a>
      </div>
      <a href="javascript:" class="go_back" @click="$router.back()">
        <i class="iconfont icon-jiantou2"></i>
      </a>
    </div>

    <AlertTip :alertText="alertText" v-show="alertShow" @closeTip="closeTip"/>

  </section>

  <!--模板變量的來源：props、data、computed-->
</template>

<script>
  import AlertTip from '../../components/AlertTip/AlertTip';
  import {reqPwdLogin, reqSendCode, reqSmsLogin} from "../../api";

  export default {
    name: "Login",
    data() {
      return {
        loginWay: true,       // true代表手機登入，false代表密碼登入
        phone: '',            // 手機號碼
        computeTime: 0,       // 計時的時間
        showPwd: false,       // 是否顯示密碼
        pwd: '',              // 密碼
        code: '',             // 簡訊驗證碼
        name: '',             // 帳號
        captcha: '',          // 圖形驗證碼
        alertText: '',        // 提示文本
        alertShow: false,     // 是否顯示提示框

      }
    },

    computed: {
      rightPhone() {
        //return /^1\d{10}$/.test(this.phone);  // 正則表達式： /^0\d{9}$/ 此為台灣的手機號碼，對phone做簡單的前台格式驗證
        return /^0\d{9}$/.test(this.phone);  // 正則表達式： /^0\d{9}$/ 此為台灣的手機號碼，對phone做簡單的前台格式驗證
      },
    },

    methods: {
      // 異步獲取簡訊驗證碼
      async getCode() {
        // 如果當前沒有倒數計時
        if (!this.computeTime) {
          // 秒數倒數
          this.computeTime = 30;
          // 啟動循環定時器
          this.intervalId = setInterval(() => {
            this.computeTime--;
            if (this.computeTime <= 0) {
              // 停止計時
              clearInterval(this.intervalId);
            }
          }, 1000);

          // 發送ajax請求（向指定手機號碼發送驗證的簡訊）
          // 原本返回的是promise，如果要得到結果數據，
          // 必須在reqSendCode加上await，在方法前（getCode()）加上async
          const result = await reqSendCode(this.phone);
          if (result.code === 1) {   // 失敗
            // 顯示提示
            this.showAlert(result.msg);
            // 停止倒數計時
            if (this.computeTime) {
              this.computeTime = 0;
              clearInterval(this.intervalId);
              this.intervalId = undefined;
            }
          }
        }


      },

      // 異步登入
      async login() {
        let result;
        // 前台表單驗證，要收集數據
        if (this.loginWay) {  // 手機登入
          const {rightPhone, phone, code} = this;
          if (!this.rightPhone) {
            // 手機號碼輸入錯誤
            this.showAlert('手機號碼輸入錯誤');
            return;
          } else if (!/^\d{6}/.test(code)) {  // /^\d{6}/ --> 6位數
            // 請輸入正確的6位數驗證碼
            this.showAlert('請輸入正確的6位數驗證碼');
            return;
          }

          // 發送ajax請求，手機簡訊登入
          result = await reqSmsLogin({phone, code});


          // 發送ajax請求，手機登入
            } else {  //密碼登入
          const {name, pwd, captcha} = this;

          if (!this.name) {
            // 請輸入帳號
            this.showAlert('請輸入帳號');
            return;

          } else if (!this.pwd) {
            // 請輸入密碼
            this.showAlert('請輸入密碼');
            return;
          } else if (!this.captcha) {
            // 請輸入驗證碼
            this.showAlert('請輸入驗證碼');
            return;
          }
          // 發送ajax請求，密碼登入
          result = await reqPwdLogin({name, pwd, captcha});

        }

        // 停止倒數計時
        if (this.computeTime) {
          this.computeTime = 0;
          clearInterval(this.intervalId);
          this.intervalId = undefined;
        }

        // 根據結果處理數據
        if (result.code === 0) {   // 成功
          const user = result.data;
          // 將user保存到vuex的state裡面
          this.$store.dispatch('recordUser', user);
          // 跳轉路由去個人中心頁面
          this.$router.replace('/profile');
        } else {    // 失敗
          // 顯示新的圖片驗證碼
          this.getCaptcha();
          const msg = result.msg;
          // 顯示警告提示
          this.showAlert(msg);
          // 清除輸入錯誤的驗證碼
          this.captcha = '';
        }


      },

      // 顯示提示
      showAlert(alertText) {
        this.alertShow = true;
        this.alertText = alertText;
      },

      // 關閉警告框
      closeTip() {
        this.alertShow = false;
        this.alertText = '';
      },

      // 獲取一個新的圖片驗證碼
      getCaptcha() {
        // <
        // 每次指定的src要不一樣，取得src，路徑有變化，才會重新發請求
        // 不是ajax請求，不存在跨域的問題
        this.$refs.captcha.src = 'http://localhost:4000/captcha?time' + Date.now();
      },
    },

    components: {
      AlertTip
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .loginContainer
    width 100%
    height 100%
    background #fff

    .loginInner
      padding-top 60px
      width 80%
      margin 0 auto

      .login_header
        .login_logo
          font-size 40px
          font-weight bold
          color #02a774
          text-align center

        .login_header_title
          padding-top 40px
          text-align center

          > a
            color #333
            font-size 14px
            padding-bottom 4px
            display inline-block

            &:first-child
              margin-right 40px

            &.on
              color #02a774
              font-weight 700
              border-bottom 2px solid #02a774

      .login_content
        > form
          > div
            display none

            &.on
              display block

            input
              width 100%
              height 100%
              padding-left 10px
              box-sizing border-box
              border 1px solid #ddd
              border-radius 4px
              outline 0
              font 400 14px Arial

              &:focus
                border 1px solid #02a774

            .login_message
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff

              .get_verification
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                border 0
                color #ccc
                font-size 14px
                background transparent

                &.right_phone
                  color black

            .login_verification
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff

              .switch_button
                font-size 12px
                border 1px solid #ddd
                border-radius 8px
                transition background-color .3s, border-color .3s
                padding 0 6px
                width 30px
                height 16px
                line-height 16px
                color #fff
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)

                &.off
                  background #fff

                  .switch_text
                    float right
                    color #ddd

                &.on
                  background #02a774

                > .switch_circle
                  position absolute
                  top -1px
                  left -1px
                  width 16px
                  height 16px
                  border 1px solid #ddd
                  border-radius 50%
                  background #fff
                  box-shadow 0 2px 4px 0 rgba(0, 0, 0, .1)
                  transition transform .3s

                  &.right
                    transform translateX(30px)

            .login_hint
              margin-top 12px
              color #999
              font-size 14px
              line-height 20px

              > a
                color #02a774

          .login_submit
            display block
            width 100%
            height 42px
            margin-top 30px
            border-radius 4px
            background #4cd96f
            color #fff
            text-align center
            font-size 16px
            line-height 42px
            border 0

        .about_us
          display block
          font-size 12px
          margin-top 20px
          text-align center
          color #999

      .go_back
        position absolute
        top 5px
        left 5px
        width 30px
        height 30px

        > .iconfont
          font-size 20px
          color #999
</style>
