<template>
  <!-- 外层盒子元素 -->
  <div class="more-action">
    <!-- 单元格组 1-->
    <van-cell-group v-if="!isReport">
      <!-- d -->
      <van-cell @click="$emit('dislike')">不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
    <!-- 单元格组 2-->
    <van-cell-group v-else>
       <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
       <!-- 注册一个自定义事件 -->
       <van-cell v-for="item in reports" :key="item.value" @click="$emit('report',item.value)">{{ item.label }}</van-cell>
       </van-cell-group>
  </div>
</template>

<script>
import { reports } from '@/api/constants.js' // 引入常量里面的变量
import eventBus from '@/utils/eventbus' // 引入 事件公交车
export default {
  data () {
    return {
      isReport: false,
      reports // ES6 的简写  把 reports 这个 常量数据 给到我们的 data 数据中  才可以使用
    }
  },
  created () {
    eventBus.$on('delArticle', () => (this.isReport = false)) // 点击删除就重置为 最初状态
  }
}
</script>

<style lang="less" scoped>
.more-action{
  border-radius: 4px;
}
</style>
