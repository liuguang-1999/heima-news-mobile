<template>
  <div class="container">
    <!-- 主页 -->
    <!-- 顶部 标签页 -->
    <van-tabs>
      <!-- 内部标签 -->
      <van-tab :title=" item.name " v-for="item in channels" :key="item.id">
        <!-- 单元格 -->
        <!-- <div class="scroll-wrapper">
          <van-cell-group>
            <van-cell title="标题" value="内容" v-for="item in 20" :key="item"></van-cell>
          </van-cell-group>
        </div>-->
        <!-- ArticleList 组件替换了 上面整套流程 -->
        <!-- 需要将频道 id item.id 传递给每一个列表组件 父传子=> props -->
        <ArticleList :channel_id="item.id" @showAction="openAction"></ArticleList>
      </van-tab>
    </van-tabs>
    <!-- 放置编辑频道 的字体图标 -->
    <span class="bar_btn">
      <van-icon name="wap-nav" dot />
    </span>
    <!-- 在这个位置上 放置一个弹层组件 -->
    <van-popup v-model="showMoreAction" style="width:80%;">
      <!-- 反馈内容组件 -->
      <moreAction></moreAction>
    </van-popup>
  </div>
</template>

<script>
import moreAction from './components/more-action'
import { getMyChannels } from '@/api/channels.js'
import ArticleList from './components/article-list'
export default {
  components: {
    ArticleList,
    moreAction
  },
  data () {
    return {
      channels: [], // 用来接收频道 数据
      showMoreAction: false // 定义变量 是否显示弹层 默认不显示弹层组件
    }
  },
  methods: {
    // 定义一个 子传父接收讯息方法
    openAction () {
      this.showMoreAction = true // 点击叉号后 利用 子传父 接收到的讯息 出发后 这里进行监听  然后把 showMoreAction 这个弹层给打开
    },
    // 定义接收频道数据 的方法
    async getMyChannels () {
      const ser = await getMyChannels()
      this.channels = ser.channels // 将获取到的 数据 赋值给data中的 channels 数组
    }
  },
  created () {
    this.getMyChannels()
  }
}
</script>

<style lang='less' scoped>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    // /deep/ 深度选择器 加了这个 会对子组件 新添加的样式 生效
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    .scroll-wrapper {
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
</style>
