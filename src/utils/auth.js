/**
 * 专门用来处理token的读写&删除
 * establish by wangjl 2020/3/15
 */
const WSER_TOKEN = 'heima-toutiao-mobile-94' // 用来存储用户信息

// 设置用户的 token信息
// 传入一个 user信息
export function setUser (user) {
  // user应该写成一个 对象形式
  window.localStorage.setItem(WSER_TOKEN, JSON.stringify(user)) // 通过 JSON.stringify(user) 转化成 json 字符串格式进行 存储token信息
}

// 获取用户的 token 信息
export function getUser () {
  // 返回一个 JSON对象 将JSON 字符串转化成一个 对象再返回出去
  return JSON.parse(window.localStorage.getItem(WSER_TOKEN) ? window.localStorage.getItem(WSER_TOKEN) : {}) // 三元表达式 判断window.localStorage.getItem(WSER_TOKEN) 是否成立 不成立赋值一个空对象
}

// 删除用户的 token信息
export function delUser () {
  // 删除token信息
  window.localStorage.removeItem(WSER_TOKEN) // 删除用户信息
}
