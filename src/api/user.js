/**
 *      一个专门处理 用户数据信息的请求模块 文件
 */
// 引入 请求模块
import request from '@/utils/request.js'
// 应该先 导出一个方法 登录方法
export function login (data) {
  // request 相当于 axios 实例 拥有和 axios 同样的功能
  return request({
    // 配置参数
    url: '/authorizations', // 请求地址
    method: 'post', // 请求类型
    data // ES6 简写模式
  })
}
/**
 *    关注用户
 */
export function followUser (data) {
  return request({
    url: '/user/followings', // 关注用户 接口地址
    data, // 请求参数
    method: 'post' // 请求类型
  })
}
/**
 *    取消关注用户
 */
export function unfollowUser (id) {
  return request({
    url: `/user/followings/${id}`,
    method: 'DELETE' // 取消 关注接口类型
  })
}
/**
 *    获取用户的 个人资料
 */
export function getuserInfo () {
  return request({
    url: '/user'
  })
}
