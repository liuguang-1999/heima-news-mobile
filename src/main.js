import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/permission' // 引入 权限路由拦截
import store from './store'
import Vant, { Lazyload } from 'vant' // 引入vant组件库 & 懒加载
import 'vant/lib/index.less' // 引入vant组件的样式  引入Vatn的LESS 方便修改 变量 而不是修改源文件
import '@/styles/index.less' // 引入自定义的全局样式  覆盖vant的样式
import 'amfe-flexible' // 修改rem基准值的 插件 功能：实时改变 font-size 屏幕基准值的大小 屏幕边 字体大小变
import plugin from '@/utils/plugin.js'
Vue.config.productionTip = false
Vue.use(Vant) // 注册Vant的所有组件 一旦注册任意位置都可以使用vant的组件 相当于调用了vant的install方法吧
// 以上做法是完整导入的模式
Vue.use(Lazyload) // 引入 Lazyload 懒加载 插件 并且 全局注册懒加载指令  图片就可以搭配这个指令进行懒加载了
Vue.use(plugin) //  plugin 会调用 utils/plugin.js/install (Vue) 里面的全部方法
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
// 物理触摸键 返回功能 Bug 修复
// 在main.js中添加如下代码  此代码是采用的 5+ Runtime中的plus对象
document.addEventListener('plusready', function () {
  var webview = window.plus.webview.currentWebview()
  window.plus.key.addEventListener('backbutton', function () {
    webview.canBack(function (e) {
      if (e.canBack) {
        webview.back()
      } else {
        // webview.close(); //hide,quit
        // plus.runtime.quit();
        // 首页返回键处理
        // 处理逻辑：1秒内，连续两次按返回键，则退出应用；
        var first = null
        window.plus.key.addEventListener('backbutton', function () {
          // 首次按键，提示‘再按一次退出应用’
          if (!first) {
            first = new Date().getTime()
            setTimeout(function () {
              first = null
            }, 1000)
          } else {
            if (new Date().getTime() - first < 1500) {
              window.plus.runtime.quit()
            }
          }
        }, false)
      }
    })
  })
})
