<template>
  <!-- 文章列表 组件  放置文章列表-->
  <!-- 上拉加载 -->
  <!-- 放置这个div的目的是 形成滚动条 为后期的阅读记忆 埋伏笔 -->
  <div class="scroll-wrapper">
    <!--  下拉刷新 组件 这个组件包含了 上拉加载 组件  -->
    <van-pull-refresh @refresh="onrefresh" v-model="isLoading" :success-text="successText">
      <van-list v-model="uploading" :finished="finished" @load="onLoad" finished-text="数据加载完毕">
        <!-- 边框 -->
        <van-cell-group>
          <van-cell v-for="item in list" :key="item.art_id.toString()">
             <!-- item.art_id 此时是一个大数字的对象 v-for 的key需要用字符串或者数字代理 v-for="item in 1" :key="item.art_id.toString()" -->
           <van-cell >
            <!-- 放置元素 文章列表的循环项  无图  单图  三图 -->
            <div class="article_item">
              <!-- 标题 -->
              <h3 class="van-ellipsis">{{ item.title }}</h3>
              <!-- 根据当前的封面类型决定显示单图 三图 还是无图 -->
              <!-- 三图图片 -->
              <div class="img_box" v-if="item.cover.type === 3">
                <!-- 图片组件用的是 vant的组件库中的图片组件 需要使用该组件 进行图片的懒加载 -->
                <!-- lazy-load 表示 该图片组件 会进行 懒加载 也就是当前屏幕出现时才去加载对应的图片 -->
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[1]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[2]" />
              </div>
              <!-- 单图 暂时隐藏掉单图-->
               <div class="img_box" v-if="item.cover.type === 1">
                 <!-- 单图取第一个 -->
                <van-image lazy-load class="w100" fit="cover" :src="item.cover.images[0]" />
              </div>
              <!-- 作者信息 -->
              <div class="info_box">
                <span>{{ item.aut_name }}</span>
                <span>{{ item.comm_count }}评论</span>
                <!-- 使用时间过滤器 -->
                <span>{{ item.pubdate | reltime}}</span>
                <!-- 此❌的显示 根据是否具有token令牌  进行显示 如果登陆了 就显示 没登陆就不显示 -->
                <!-- 用最原始的方式 进行显示和隐藏叉号 -->
                <!-- <span class="close" v-if="$store.state.user.token"> -->
                  <!-- 还可以通过辅助函数的方式去做 利用 mapState 方法 -->
                  <!-- 需要传出 点击叉号的文章的id -->
                <span class="close" v-if="user.token" @click="$emit('showAction',item.art_id.toString())">
                  <van-icon name="cross"></van-icon>
                </span>
              </div>
            </div>
          </van-cell>
          </van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
// 引入 获取推荐的方法
import { getArticles } from '@/api/articles.js'
import eventBus from '@/utils/eventbus'
// 引入 辅助函数
import { mapState } from 'vuex'
export default {
  // 初始化的钩子函数
  created () {
    // 监听删除 文章事件
    eventBus.$on('delArticle', (articId, channelsId) => {
      // 这个位置  每个组件实例都会触发
      // articId 文章id  channelsId 频道 id
      // 还需要判断一下 传递过来的频道是否等于 自身的频道
      if (channelsId === this.channel_id) {
        // 说明当前的这个 article-list 实例 就是我们要删除数据的实例
        const index = this.list.findIndex(item => item.art_id.toString() === articId)
        // 通过 id 查询对应文章数据所在的下标
        if (index > -1) {
          // 因为 下表是从0开始的 所以应该大于-1
          this.list.splice(index, 1) // 删除对应下表的数据
        }
        if (this.list.length === 0) {
          // 说明你把 数据给删光了  就不会触发 滚动条的下拉刷新事件了
          this.onLoad() // 列表数据删没了就去 手动的去 请求列表数据
        }
      }
    })
  },
  // 计算属性
  computed: {
    // 将 State 解构出来
    ...mapState(['user'])
  },
  // props:['channel_id'] // 字符串数组 接收方式 比较简单 比较low 易于上手 但! 还有更好的方放 除了用数组 还可以用 对象的形式
  // props 以对象形式的形式 编写 可以约束传入的值 必填=>(没传入这个值 就会报错) 以及 传入值的类型
  props: {
    // key( props传过来的属性名 ) & value(对象 配置) 形式
    channel_id: {
      // 这里面有三个选项
      required: true, // 这是个 必填项 此属性的含义是 如果参数为 true 要求该 props 必须传值
      type: Number, // 表示 要传入的props属性的类型
      default: null // 默认值的意思 假如你没有传入 props属性 你的默认值就会被采用 默认值给一个null 默认 没有 channel_id 的值
    }
  },
  data () {
    return {
      list: [], // 文章列表
      uploading: false, // 是否 开启了上拉加载 默认值 false
      finished: false, // 当前列表的  全部数据 是否加载完毕
      isLoading: false, // 下拉刷新加载 是否完成
      successText: '', // 下拉刷新 成功提示信息
      timestamp: null // 定义一个时间戳属性 用来存储 上一个历史时间戳 初始化是没有 历史时间戳的 所以给一个空
    }
  },
  methods: {
    // 上拉加载
    async onLoad () {
      // 开始加载 文章列表数据
      //  if (this.list.length > 40) {
      //   this.finished = true // 达到了 预期的数量就关闭 添加条数
      // }
      // const arr = Array.from(
      //   Array(21),
      //   (value, index) => this.list.length + index + 1
      // )
      // this.list.push(...arr) // 结构出来 添加到 list 这个数组里面去
      // this.uploading = false // 数据 请求完毕 关闭 上拉加载
      // timestamp: this.timestamp || Date.now() 如果有历史时间戳 用历史时间戳 没有就 new 一个当前的时间戳
      await this.$sleep() // 在这个函数 强制等待 2秒 用await
      const ser = await getArticles({ channel_id: this.channel_id, timestamp: this.timestamp || Date.now() }) // this.channel_id 指的是 当前 props 里的频道id  这里还需要传入一个时间戳
      this.list.push(...ser.results) // 将数据追加到队列尾部
      this.uploading = false // 关闭加载状态
      // 还需要将 历史时间戳 给 data 中的 timestamp 但是 赋值之前需要判断一下 历史时间戳是否为0
      // 如果历史时间戳 为0 说明 此时已经没有数据了 到这里就结束了 设置 finished 属性为 true 结束掉
      if (ser.pre_timestamp) {
        // 如果 有历史时间戳 表示 还有数据 可以继续进行加载
        this.timestamp = ser.pre_timestamp
      } else {
        // 如果为0的话 表示结束了 没有数据可以请求了
        this.finished = true
      }
    },
    // 下拉刷新
    async onrefresh () {
      await this.$sleep() // 在这个函数 强制等待 2秒 用await
      // 下拉刷新请求发送最新的时间戳
      const ser = await getArticles({
        channel_id: this.channel_id,
        timestamp: Date.now() // 这个时间戳 永远是 最新的时间戳
      })
      // 手动关闭下拉刷新的状态
      this.isLoading = false
      // 需要判断 最新的时间戳能否换来新的数据 如果能换来新的数据 把新的数据整个替换旧数据 如果不能就告诉用户 暂时没有数据 更新

      if (ser.results.length) {
        // 如果有返回数据
        // 需要将整个数据列表 进行替换
        this.list = ser.results // 替换后 历史数据全部被 覆盖
        if (ser.pre_timestamp) {
          // 因为下拉刷新 换来了一波新的数据 里面又有 历史时间戳了
          this.finished = false // 重新唤醒列表 让列表可以继续上拉加载
          this.timestamp = ser.pre_timestamp // q记录历史的时间戳
        }
        this.successText = `更新了${ser.results.length}条数据`
      } else {
        // 如果换不来 数据提醒一下
        this.successText = '当前已是最新数据了'
      }

      // setTimeout(() => {
      //   const arr = Array.from(
      //     Array(2),
      //     (value, index) => '追加' + (index + 1)
      //   )
      //   this.list.unshift(...arr)
      //   this.isLoading = false // 手动关闭 下拉加载状态
      //   this.successText = `刷新成功添加了${arr.length}条信息` // 下拉刷新 成功后提示信息文本
      // }, 800)
    }
  }
}
</script>

<style lang='less' scoped>
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
