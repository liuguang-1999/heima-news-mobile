/**
 *      一个专门处理 大数字 和 请求管理的 文件
 *      create by wang j l 2020/03/17
 */
import axios from 'axios'
// axios.defaults 之前做法 是对原有的 默认值进行修改
// 现在的做法是
import JSONbigin from 'json-bigint' // 引入大数字 插件处理的包
import store from '@/store'
import router from '@/router'
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

// 响应拦截器 去处理返回的数据
instance.interceptors.response.use(function (response) {
  // axios 默认给我们加了一层 data 包裹层  我们可以通过 相应拦截器 去扒掉一层data的包裹层 data本身自带了一层data包裹层我们还可以扒掉自带的包裹层  然后再返回给响应数据
  return response.data.data ? response.data.data : response.data // 褪去2层 data的包裹层外壳  如果不成立 那就褪去一层  肯定能褪去一层data因为是axios默认包裹的data
}, async function (error) { // 失败时 执行的Promise 抛出错误代码
  /**
     *    只要是401 就是token过期 导航守卫 就要进行拦截
     *    error 里面有三个参数
     *    config 是出现这次错误请求的 配置文件  这个 config 就是 25行里面的 config
     *    request 请求对象
     *    response 响应对象 响应对象中有个参数叫status  状态码
     */
  if (error.response && error.response.status === 401) {
    const path = {
      url: '/login', // 要跳转的地址
      query: { // 路由传参 有两种方法一种是 动态路由 另一种是 query 传参 我们选择 query 传参
        redirectUrl: router.currentRoute.fullpath // 表示 进登录页后 需要跳转的地址
      }

    }
    // 如果状态码 为401的话 就认为 token 失效了 就需要处理已经失效的token
    // refresh_token 相当一个 为token 续命的药
    if (store.state.user.refresh_token) {
      // 进到这里表示 你有refresh_token
      // 你有token  但是它过期了 refresh_token 会去帮你换一个新的token
      try {
        const ser = await axios({
          method: 'put', // 请求类型
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations', // 完成的url地址
          headers: { Authorization: `Bearer ${store.state.user.refresh_token}` } // 在请求头中注入 新的 refresh_token
        })
        // 这个 就是请求回来的新的token
        // ser.data.data.token
        // 如果请求成了  那就去更新 之前失效的token
        store.commit('updataUser', {
          user: {
            token: ser.data.data.token, // 最新的token
            refresh_token: store.state.user.refresh_token // 还是原来的 refresh_token 14天后就过期了
          }
        })
        // 这里 还需要把之前错误的请求再次 发送出去 使用 instance 发送错误 的提示
        return instance(error.config) // 相当于 执行了 之前出现的 401 错误请求  return 返回 这个请求的 目的是继续执行 这个请求执行链下面的内容
      } catch (error) {
        // 如果失败意味着 续命也失败了
        // 这时候需要回到登录页  去重新登录了 重新登陆之前 需要删除掉token令牌 因为此时 token失效 refesh_token也失效
        store.commit('deldataUser') // 删除掉 token 因为此时 token失效了
        router.push(path)
      }
    } else {
      // 尽到了这里 表示你没有 refresh_token 直接 over 掉
      // router.push('/login') // 直接踢到 登录页去  错 这种方法可以但很暴力已经uot了  还有更温柔的方法
      // 登陆页面 登录成功之后 先判断 有没有需要跳转的地址 如果有 那就跳到需要跳转的页面
      // router.currentRoute  是当前的路由信息 对象 里面包含了路由的地址和参数
      // 我们需要获取  当前路由的 带参数的地址 router.currentRoute.fullpath  通过这段代码去获取
      store.commit('deldataUser') // 删除掉 token 因为此时 token失效了
      router.push(path)
    }
  }
  return Promise.reject(error) // 提示错误
})
// 常见了一个新实例之后  将这个新的实例 导出
export default instance // 这个instance 拥有了 axios的所有方法 包括请求数据
