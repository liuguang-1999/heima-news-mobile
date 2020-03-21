<template>
  <div class="container">
    <!-- 主页 -->
    <!-- 顶部 标签页 -->
    <!-- activeIndex 默认绑定激活页签 -->
    <van-tabs  v-model="activeIndex">
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
      <!-- 在这里监听 不感兴趣的事件 -->
      <moreAction @dislike="dislikeOrReport"></moreAction>
    </van-popup>
  </div>
</template>

<script>
import moreAction from './components/more-action'
import { getMyChannels } from '@/api/channels.js'
import ArticleList from './components/article-list'
import { dislikeArticle } from '@/api/articles.js' // 调用不感兴趣 接口
import eventBus from '@/utils/eventbus.js' // 引入事件监听 机制  / 事件公交车
export default {
  components: {
    ArticleList,
    moreAction
  },
  data () {
    return {
      channels: [], // 用来接收频道 数据
      showMoreAction: false, // 定义变量 是否显示弹层 默认不显示弹层组件
      articleId: null, // 接收和存储id 的变量 默认值为空
      activeIndex: 0 // 当前默认激活的页签
    }
  },
  methods: {
    // 定义一个 子传父接收讯息方法
    openAction (id) { // 接收父组件 传过来的id参数
      this.showMoreAction = true // 点击叉号后 利用 子传父 接收到的讯息 出发后 这里进行监听  然后把 showMoreAction 这个弹层给打开
      this.articleId = id // 子传父 获取到的 id 存起来 遇到不喜欢的文章了 id就可以调用了
    },
    // 定义接收频道数据 的方法
    async getMyChannels () {
      const ser = await getMyChannels()
      this.channels = ser.channels // 将获取到的 数据 赋值给data中的 channels 数组
    },
    async dislikeOrReport () {
      try {
        await dislikeArticle({
          target: this.articleId // 传入不喜欢文章的id
        })
        // 利用事件 广播的机制 触发一个事件 通知对应的tab页 删除不感兴趣的文章数据
        // this.channels[this.activeIndex].id  当前激活页签的频道数据
        eventBus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id) // 不感兴趣的id 传给事件公交车 触发这个事件
        // 关闭弹层
        this.showMoreAction = false
        this.$notify({ type: 'success', message: '操作成功' })
      } catch (error) {
        // 默认是 红色警示框
        this.$notify({ type: 'danger', message: '操作失败' })
      }
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
