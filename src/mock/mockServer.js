/*
使用mockjs提供mock數據接口
 */

import Mock from 'mockjs';
import data from './data';


// 返回goods的接口
Mock.mock('/goods', {code: 0, data: data.goods});

// 返回ratings的接口
Mock.mock('/ratings', {code: 0, data: data.ratings});

// 返回info商品列表的接口
Mock.mock('/info', {code: 0, data: data.info});


// export default ??? 不需要向外不露任何數據，只需要執行即可
