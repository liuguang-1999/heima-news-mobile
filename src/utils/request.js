/**
 *      一个专门处理 大数字 和 请求管理的 文件
 *      create by wang j l 2020/03/17
 */
import axios from 'axios'
// axios.defaults 之前做法 是对原有的 默认值进行修改
// 现在的做法是

// axios.create() // 相当于 new 了一个新的实例 和之前的axios实例 互不影响
const instance = axios.create({ // 相当于 new了一个 新的axios的新实例
  // 构造参数 可以传入一些配置&参数
})

// 常见了一个新实例之后  将这个新的实例 导出
export default instance
