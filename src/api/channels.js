/**
 *      获取 频道数据的文件
 *      处理 频道请求模块
 */
// 引入发送请求  数据模块
import request from '@/utils/request.js'

// 导出 获取我的频道数据  没参数匿名用户 也可以获取 数据
export function getMyChannels () {
  return request({
    url: '/user/channels'
  })
}
/**
 *    封装 获取全部频道的接口
 */
export function getAllChannels () {
  return request({
    url: '/channels'
  })
}
