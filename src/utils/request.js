/**
 *      一个专门处理 大数字 和 请求管理的 文件
 *      create by wang j l 2020/03/17
 */
import axios from 'axios'
// axios.defaults 之前做法 是对原有的 默认值进行修改
// 现在的做法是
import JSONbigin from 'json-bigint' // 引入大数字 插件处理的包
import store from '@/store'
// axios.create() // 相当于 new 了一个新的实例 和之前的axios实例 互不影响

const instance = axios.create({ // 相当于 new了一个 新的axios的新实例 ! ! ! !

  // 构造参数 可以传入一些配置&参数
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0', // 设置请求地址常量 相当于 定义了一个请求的基地址  ! ! ! !
  // 此函数是后端服务器 相应回来的数据 但还没有进到 axios 相应拦截器时执行的 此函数是一个 数组的形式 数组内部可以写 多个处理函数 我们只需要写入 一个即可

  transformResponse: [function (data) { // data 是承载着 后端响应回来的 数据或字符串
    // 用三元表达式 去处理 data 数据是否为空的时候 假如为空就返回一个 空对象
    return data ? JSONbigin.parse(data) : {} // 处理 大数字的问题 替代 原来的 JSON.parse
  }]
})

// 请求拦截器 token 的注入  ! ! ! !
instance.interceptors.request.use(function (config) {
  if (!store.state.user.token) { // 伏笔`````` ! ! ! ! !
    return // 如果 store.state.user.token 不成立 结束代码执行
  }
  config.headers.Authorization = `Bearer ${store.state.user.token}` // 注入统一的token处理 注入到请求头headers中
  return config // 将结果返回
}, function (error) { // 失败时 执行的Promise 抛出错误代码
  return Promise.reject(error) // 提示错误
})

// 常见了一个新实例之后  将这个新的实例 导出
export default instance // 这个instance 拥有了 axios的所有方法 包括请求数据
