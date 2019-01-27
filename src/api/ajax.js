/*
ajax請求函數模塊
返回值promise對象(異步返回的數據是：response.data)
 */
import axios from 'axios'
export default function ajax(url, data = {}, type = 'GET') {

  return new Promise((resolve, reject) => {
    // 執行異步ajax請求
    let promise;
    if (type === 'GET') {
      // 準備 url query參數數據
      let dataStr = '';   // 數據拼接字符串
      Object.keys(data).forEach(key => {
        dataStr += key + '=' + data[key] + '&';
        // dataStr +=`${key}=${data[key]}&`
      });
      if (dataStr !== '') {
        dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'));
        url = url + '?' + dataStr;
        // url = `${url}?${dataStr}`;
      }
      // 發送get請求
      promise = axios.get(url);
    } else {
      // 發送post請求
      promise = axios.post(url, data);
    }
    promise.then(response => {
      // 成功，調用resolve()
      resolve(response.data);
    })
    // 失敗，調用reject()
      .catch(error => {
        reject(error)
      });

  });

}

/*
const response = await ajax();
const result = response.data;

最終目標：
const result = await  ajax();
*/
