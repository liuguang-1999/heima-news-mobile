/**
 *     专门处理 函数小功能的实现
 */
import dayjs from 'dayjs' // 引入day js 插件
import relativeTime from 'dayjs/plugin/relativeTime' // 相当于 Dayjs 扩展相对时间的方法
import 'dayjs/locale/zh-cn' // 引入时间插件
dayjs.extend(relativeTime) // 引入插件的语言包 dayjs 不会帮你引入语言包的 需要自己去手动引入语言包 默认英文语言
export default {
  install (Vue) {
    Vue.prototype.$sleep = sleep // 定义一个 原型属性 $sleep 所有的组件都有了这个属性
    // 这里用管道操作符/过滤器 去处理 时间各式的问题
    // 过滤器 参数 第一个参数 是过滤器的名称 第二个参数是过滤器的方法
    Vue.filter('reltime', relTime) // 注册一个 全局的过滤器  全局过滤器 一点但全局注册 任意位置都可以使用
  }
}
// 延时刷新请求函数
function sleep (time = 800) {
  // 可以直接返回一个 Promise
  return new Promise(function (resolve, reject) {
    // 肯定是成功执行 但是成功执行 也要有时间限制的延迟
    setTimeout(() => resolve(), time)
  })
}
/**
 *    此函数用来 将日期转化为相对时间
 * @params data 是传入的日期
 */
function relTime (data) {
  // 封装的方式 注册一个全局的过滤器  过滤器必须有返回值
  return dayjs().locale('zh-cn').from(data) // from 中的值是 日期 或者 dayjs 获得的日期  dayjs() 是当前时间  dayjs().from() 当前时间 距离你传入时间有多远
  // 引入语言包 在这里 使用 语言包转换方法 方法内 传入zh-cn
}
