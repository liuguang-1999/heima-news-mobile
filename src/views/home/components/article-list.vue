<template>
  <!-- 文章列表 组件  放置文章列表-->
  <!-- 上拉加载 -->
  <!-- 放置这个div的目的是 形成滚动条 为后期的阅读记忆 埋伏笔 -->
  <div class="scroll-wrapper">
    <van-list v-model="uploading" :finished="finished" @load="onload">

    </van-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: [],
      uploading: false, // 是否 开启了上拉加载 默认值 false
      finished: false // 当前列表的  全部数据 是否加载完毕

    }
  },
  methods: {
    onload () {
      this.finished = true // 强制 关闭 上拉加载 的子检测机制
    }
  }
}
</script>

<style>
</style>
