<template>
  <!-- 文章列表 组件  放置文章列表-->
  <!-- 上拉加载 -->
  <!-- 放置这个div的目的是 形成滚动条 为后期的阅读记忆 埋伏笔 -->
  <div class="scroll-wrapper">
    <van-list v-model="uploading" :finished="finished" @load="onLoad" finished-text="数据加载完毕">
      <!-- 边框 -->
      <van-cell-group>
      <van-cell :title="`标题${item}`" value="内容" v-for="item in list" :key="item"></van-cell>
      </van-cell-group>
    </van-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: [], // 文章列表
      uploading: false, // 是否 开启了上拉加载 默认值 false
      finished: false // 当前列表的  全部数据 是否加载完毕

    }
  },
  methods: {
    onLoad () {
      if (this.list.length > 40) {
        this.finished = true // 达到了 预期的数量就关闭 添加条数
      }
      const arr = Array.from(Array(21), (value, index) => this.list.length + index + 1)
      this.list.push(...arr) // 结构出来 添加到 list 这个数组里面去
      this.uploading = false // 数据 请求完毕 关闭 上拉加载
    }
  }
}
</script>

<style>
</style>
