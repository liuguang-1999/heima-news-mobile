/**
 *    一个专门处理  Vuex的文件
 *    这里会 处理 token
 */
import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth.js' // 引入token的 处理方法文件  * 把全部的处理方法 赋值给auth
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: auth.getUser() // user 属性是承载着token的信息   auth.getUser()是获取 token 信息 并挂载到了user 属性上面
  },
  // 假如要修改 state里面的user下的token信息 在mutations 里面定义修改方法
  mutations: {
    // 修改 token 方法名称 定义为 updatatoken
    updataUser (state, payload) {
      state.user = payload.user // 将载荷 中的变量数据赋值给 state中的user

      // 更新Vuex的时候 应该把本地缓存中的token 更新为最新数据 并存入本地当中
      auth.setUser(payload.user) // 相当于 与 Vuex 和 本地储存的同步
    },
    // 删除 token
    deldataUser (state) { // 这是个 删除token 的方法不需要载荷 载荷没有任何用处
      // Vuex 更新删除token 数据
      state.user = {} // 所谓意义上的删除 其实就是清空 一个数组 或者 一个对象
      // 本地缓存 也要 更新删除token数据
      auth.delUser() // 删除本地缓存中的 token数据
    }
  },
  actions: {
  },
  modules: {
  }
})
