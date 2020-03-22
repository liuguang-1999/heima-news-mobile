/**
 *      获取 频道数据的文件
 *      处理 频道请求模块
 */
// 引入发送请求  数据模块
import request from '@/utils/request.js'
import store from '@/store' // 引入Vuex 实例化
// 导出 获取我的频道数据  没参数匿名用户 也可以获取 数据
// 要将这个 频道方法 改造一下 改造成本地化的频道数据
const CACHE_CHANNEL_V = 'hm-94-toutiao-v' // 登录用户的key
const CACHE_CHANNEL_T = 'hm-94-toutiao-t' // 游客用户的key
/**
 *      获取频道API 的封装
 */
export function getMyChannels () {
  // 因为 后端编辑用户接口存在问题 所以要用本地化的手段进行升级
  return new Promise(function (resolve, reject) {
    // 这里要做 本地化的缓存机制 而且要区分当前用户 是否登录 如何区分当前是登录用户 或 游客用户 ？ 可以根据 Vuex 中的 token 来进行判断
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T // 这个 key 根据当前游客是否登录的状态 来判断用那个 key
    // 去缓存中读取用户频道的数据
    const str = localStorage.getItem(key) // 通过缓存中的 key 获取用户频道数据
    if (str) {
      // 本地缓存 有数据 应该把本地数据释放给 后面的执行结果
      resolve({ channels: JSON.parse(str) }) // 这里的结构 是和 请求体中的结构一致的
    } else {
      // 本地缓存 没有数据 那就去 线上拉取数据
      request({
        url: '/user/channels' // 这个地址得到一个 线上的用户频道列表数据 把数据放到本地的缓存中
      }).then(ser => {
        // 获取请求的结果
        localStorage.setItem(key, JSON.stringify(ser.channels)) // 获取到的 频道数据 放进本地的缓存中去
        // 这个地方还需要 resolve 频道数据
        resolve(ser) // 这里表示 成功执行了 获取频道的数据 resolve 表示成功执行并返回到页面一个 then 中的 ser 返回数据
      })
    }
  })
  /*  return request({
    url: '/user/channels'
  }) */
}
/**
 *    封装 获取全部频道的接口
 */
export function getAllChannels () {
  return request({
    url: '/channels'
  })
}
/**
 *      删除频道API的 封装
 *      delChannel (id)  内部应该传入 一个id 作为删除的依据
 */
export function delChannel (id) {
  return new Promise(function (resolve, reject) {
    // 有传过来的 id 的话 就可以直接从缓存中 删除对应的 id 了
    // 删除频道时 无论如何都有数据
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T // 这个 key 根据当前游客是否登录的状态 来判断用那个 key
    const channels = localStorage.getItem(JSON.parse(key)) // 直接将 本地缓存中的字符串转化成一个对象
    //     // 第一种删除方式
    // // 返回一个 新数组 返回不等于 id 的内容
    // const str = str.filter(item => item.id !== id) // 得到一个新数组
    // // 接下来 重新写入缓存
    // localStorage.setItem(key, JSON.stringify(str))

    // 第二种 删除 方式
    const index = channels.findIndex(item => item.id === id) // 找到 这个 id 的 索引
    if (index > -1) {
      channels.splice(index, 1) // 删除索引对应的元素
      // 接下来 重新写入缓存
      localStorage.setItem(key, JSON.stringify(channels))
      // 逻辑成功了 接下来就执行 resolve
      resolve() //  resolve 可以传参 也可以传 取决于 后面的逻辑 有没有参数
    } else {
      reject(new Error('删除失败。。。'))
    }
  })
}
