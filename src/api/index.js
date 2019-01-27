/*
包含多個接口請求函數的模塊
函數的返回值：promise對象
 */

import ajax from './ajax';

// const BASE_URL = 'http://localhost:4000';
const BASE_URL = '/api';

// 1、根據經緯度獲取位置詳情
export const reqAddress = (geohash) => ajax(`${BASE_URL}/position/${geohash}`);

// 2、獲取食品分類列表
export const reqFoodCategories = () => ajax(`${BASE_URL}/index_category`);

// 3、根據經緯度獲取商鋪列表
export const reqShops = (longitude, latitude) => ajax(`${BASE_URL}/shops`, {longitude, latitude});

// 4、根據經緯度和關鍵字搜索商鋪列表
export const reqSearchShop = ({geohash, keyword}) => ajax(`${BASE_URL}/search_shops`, {geohash, keyword});

// 6、用戶名密碼登陸
export const reqPwdLogin = ({name, pwd, captcha}) => ajax(`${BASE_URL}/login_pwd`, {name, pwd, captcha},"POST");

// 7、發送短信驗證碼
export const reqSendCode = ({phone}) => ajax(`${BASE_URL}/sendcode` ,{phone});

// 8、手機號驗證碼登陸
export const reqSmsLogin = ({phone, code}) => ajax(`${BASE_URL}/login_sms`, {phone, code}, 'POST');

// 9、根據會話獲取用戶信息
export const reqUserInfo = () => ajax(`${BASE_URL}/userinfo`);

// 10、用戶登出
export const reqLogout = () => ajax(`${BASE_URL}/logout`);


// 獲取商家信息
export const reqShopInfo = () => ajax('/info');

// 獲取商家評價數組
export const reqShopRatings = () => ajax('/ratings');

// 獲取商家商品數組
export const reqShopGoods = () => ajax('/goods');
