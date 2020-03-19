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
          <van-cell v-for="item in list" :key="item.art_id">
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
                <van-image class="w33" fit="cover" :src="item.cover.images[0]" />
                <van-image class="w33" fit="cover" :src="item.cover.images[1]" />
                <van-image class="w33" fit="cover" :src="item.cover.images[2]" />
              </div>
              <!-- 单图 暂时隐藏掉单图-->
               <div class="img_box" v-if="item.cover.type === 1">
                 <!-- 单图取第一个 -->
                <van-image class="w100" fit="cover" :src="item.cover.images[0]" />
              </div>
              <!-- 作者信息 -->
              <div class="info_box">
                <span>名字</span>
                <span>0评论</span>
                <span>事件</span>
                <span class="close">
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
export default {
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
    onrefresh () {
      setTimeout(() => {
        const arr = Array.from(
          Array(2),
          (value, index) => '追加' + (index + 1)
        )
        this.list.unshift(...arr)
        this.isLoading = false // 手动关闭 下拉加载状态
        this.successText = `刷新成功添加了${arr.length}条信息` // 下拉刷新 成功后提示信息文本
      }, 800)
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
