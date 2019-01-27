<template>
  <div class="star" :class="`star-${size}`">
  <!--<div class="star" :class="'star-'+size">-->
    <span class="star-item" v-for="(starclass, index) in starClasses" :key="index" :class="starclass"></span>

  </div>
</template>

<script>
  // 類名常量
  const CLASS_ON = 'on';
  const CLASS_HALF = 'half';
  const CLASS_OFF = 'off';

	export default {
		name: "Star",
    props: {
		  score: Number,
		  size: Number,
    },

    computed: {
		  /*
		  3.2 = 3 + 0 + 2
		  3.5 = 3 + 1 + 1
		   */
      starClasses() {
        const {score} = this;
        const starclasses = [];

        // 向starclasses中添加多個CLASS_ON
        const scoreInteger = Math.floor(score);
        for (let i = 0; i < scoreInteger; i++) {
          starclasses.push(CLASS_ON);
        }

        // 向starclasses中添加 0/1 個CLASS_HALF
        // score - scoreInteger > 0.5，但因為小數的計算不精準，所以全部 * 10
        if ((score * 10) - (scoreInteger * 10) >= 5) {
          starclasses.push(CLASS_HALF);
        }

        // 向starclasses中添加多個CLASS_OFF
        // 因為星星最多5個，所以只有在少於5個星星的時候才會執行
        // 有可能執行，有可能不執行
        while (starclasses.length < 5) {
          starclasses.push(CLASS_OFF);
        }

        return starclasses;
      },
    },
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .star //2x圖 3x圖
    float left
    font-size 0
    .star-item
      display inline-block
      background-repeat no-repeat
    &.star-48
      .star-item
        width 20px
        height 20px
        margin-right 22px
        background-size 20px 20px
        &:last-child
          margin-right: 0
        &.on
          bg-image('./images/star48_on')
        &.half
          bg-image('./images/star48_half')
        &.off
          bg-image('./images/star48_off')
    &.star-36
      .star-item
        width 15px
        height 15px
        margin-right 6px
        background-size 15px 15px
        &:last-child
          margin-right 0
        &.on
          bg-image('./images/star36_on')
        &.half
          bg-image('./images/star36_half')
        &.off
          bg-image('./images/star36_off')
    &.star-24
      .star-item
        width 10px
        height 10px
        margin-right 3px
        background-size 10px 10px
        &:last-child
          margin-right 0
        &.on
          bg-image('./images/star24_on')
        &.half
          bg-image('./images/star24_half')
        &.off
          bg-image('./images/star24_off')
</style>
