import Vue from 'vue';
// import moment from 'moment'
import format from 'date-fns/format'

// 自定義過濾器
Vue.filter('date-format', (value, formatstr = 'YYYY-MM-DD HH:mm:ss') => {
  // return moment(value).format(formatstr);
  return format(value, formatstr);
});
