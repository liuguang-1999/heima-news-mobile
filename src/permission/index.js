/**
 *      在此文件中去做导航守卫拦截
 */
// 第一步 引入路由实例
import router from '@/router' // 引入 路由实例
import store from '@/store' // 引入 store 对象 Vuex
// 前置路由守卫
// 每当路由首位 发生变化时 前置守卫开始执行工作
router.beforeEach(function (to, from, next) { // to属性 要到那里去 fron 你从哪里来 next必执行函数
  // 首先需要判断 你的请求地址 和你的token令牌
  // 如果是以/user 开头的用户页面 你需要进行token的判断
  if (to.path.startsWith('/user') && !store.state.user.token) {
    // 需要拦截 这个请求 让他去登录页
    // 登陆成功之后 然后 返回 刚才的页面
    next({
      path: '/login', // 登录地址
      query: {
        // fullpath 和 path 的区别在于 fullpath 会带着问号？后面的参数 是一个完整路径
        redirectUrl: to.fullPath // 告诉登陆页面 我没有完成的 访问 你登陆之后 要完成
      }
    })
  } else {
    next() // 放行
  }
})
