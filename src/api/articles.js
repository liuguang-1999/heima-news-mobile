/**
 *      处理 获取文章模块的获取数据请求
 *      获取推荐文章
 */
// 引入网络请求 模块
import request from '@/utils/request.js'

// 导出 获取文章推荐数据的 方法
// 这里需要传入 timestamp 时间戳  channel_id (频道id)
export function getArticles (params) {
  return request({
    // 这里必须要用完整的地址 因为这个基地址 版本和另一个 基地址不一样 这个基地址版本V1_1
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
    params: { with_top: 1, ...params } // 利用延展运算符 合并 数据  使其两个数据合并在一起
  })
}
/**
 *    不感兴趣 文章的接口
 */
export function dislikeArticle (data) {
  return ({
    url: '/article/dislikes', // 不喜欢 文章的接口地址
    method: 'post', // 请求类型
    data // 不喜欢 文章的id 发送到服务器
  })
}
/**
 *   封装一个 举报文章 接口
 */
export function reportArticle (data) {
  return request({
    url: '/article/reports',
    data,
    method: 'post'
  })
}
/**
 *    搜索建议
 */
export function getSuggestion (params) {
  return request({
    url: '/suggestion', // 搜索建议地址
    params // query 中的参数 传入到 params 中
  })
}
/**
 *    封装 搜索文章接口 方法
 */
export function searchArticle (params) {
  return request({
    url: '/search', // 搜索结果
    params // 参数里面有关键词 和 分页信息
  })
}
/**
 *    获取文章详情 封装API
 */
export function getArticleInfo (id) {
  return request({
    url: `articles/${id}` // 获取详情地址、 传入一个 id 获取详情数据
  })
}
