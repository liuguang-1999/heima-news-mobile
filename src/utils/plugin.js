/**
 *     专门处理 函数小功能的实现
 */
export default {
  install (Vue) {
    Vue.prototype.$sleep = sleep // 定义一个 原型属性 $sleep 所有的组件都有了这个属性
  }
}
// 延时刷新请求函数
function sleep (time = 2000) {
  // 可以直接返回一个 Promise
  return new Promise(function (resolve, reject) {
    // 肯定是成功执行 但是成功执行 也要有时间限制的延迟
    setTimeout(() => resolve(), time)
  })
}
