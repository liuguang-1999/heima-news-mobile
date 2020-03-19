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
          <van-cell :title="`标题${item}`" value="内容" v-for="item in list" :key="item"></van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: [], // 文章列表
      uploading: false, // 是否 开启了上拉加载 默认值 false
      finished: false, // 当前列表的  全部数据 是否加载完毕
      isLoading: false, // 下拉刷新加载 是否完成
      successText: '' // 下拉刷新 成功提示信息
    }
  },
  methods: {
    // 上拉加载
    onLoad () {
      if (this.list.length > 40) {
        this.finished = true // 达到了 预期的数量就关闭 添加条数
      }
      const arr = Array.from(
        Array(21),
        (value, index) => this.list.length + index + 1
      )
      this.list.push(...arr) // 结构出来 添加到 list 这个数组里面去
      this.uploading = false // 数据 请求完毕 关闭 上拉加载
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

<style>
</style>
