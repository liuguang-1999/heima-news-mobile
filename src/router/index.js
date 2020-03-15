import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
// 用按需加载 的方式去配置路由表
const layout = () => import('@/views/layout') // 按需加载 引入布局组件
const home = () => import('@/views/home') // 按需加载 引入首页组件 配置二级路由
const question = () => import('@/views/question') // 按需加载 引入问答组件 二级路由
const video = () => import('@/views/video') // 按需加载 引入 视频组件 二级路由
const user = () => import('@/views/user') // 按需加载 引入 个人中心 组件 二级路由
// ~~~~~~~~~~~~~~~~   其他一级路由组件引入
const chat = () => import('@/views/user/chat.vue') // 引入小爱同学 组件 一级路由
const login = () => import('@/views/login') // 引入登录模块组件 一级路由
const profile = () => import('@/views/user/profile.vue') // 引入 编辑资料 组件  一级路由
const search = () => import('@/views/search') // 引入 搜索中心 组件  一级路由
const result = () => import('@/views/search/result.vue') // 引入 搜索结果 组件  一级路由
const article = () => import('@/views/article') // 引入 文章详情 组件  一级路由

const routes = [
  {
    path: '/',
    name: 'Home',
    component: layout, // 布局组件 一级路由
    children: [{
      path: '',
      component: home // 首页组件 二级路由
    }, {
      path: '/question',
      component: question // 问答组件 二级路由
    }, {
      path: '/video',
      component: video // 视频组件 二级路由
    }, {
      path: '/user',
      component: user // 个人中心 组件 二级路由
    }]
  }, {
    path: '/user/chat',
    component: chat// 小爱同学 组件 一级路由
  }, {
    path: '/login',
    component: login // 登录模块组件 一级路由
  }, {
    path: '/user/profile',
    component: profile // 编辑资料 组件  一级路由
  }, {
    path: '/search',
    component: search // 搜索中心 组件 一级路由
  }, {
    path: '/search/result',
    component: result // 搜索结果 组件 一级路由
  }, {
    path: '/article',
    component: article // 文章详情 组件  一级路由
  }]

const router = new VueRouter({
  routes
})

export default router
