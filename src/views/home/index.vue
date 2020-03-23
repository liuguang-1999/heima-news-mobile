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
    <span class="bar_btn" @click="show = true">
      <van-icon name="wap-nav" dot />
    </span>
    <!-- 在这个位置上 放置一个弹层组件 -->
    <van-popup v-model="showMoreAction" style="width:80%;">
      <!-- 反馈内容组件 -->
      <!-- 在这里监听 不感兴趣的事件 -->
      <!-- 不喜欢文章 和 举报文章 实际上要用一个方法 -->
      <!-- $evten 就是传出来的参数 -->
      <moreAction @dislike="dislikeOrReport('dislike')" @report="dislikeOrReport('report',$event)"></moreAction>
    </van-popup>
    <!-- 频道编辑组件 -->
    <van-action-sheet v-model="show" title="标题" :round="false">
      <!-- 弹出面板 -->
      <!-- 此时将 父组件的数据 传递给了 子组件 数据在 channel-edit 子组件里面接收 -->
      <ChannelEdit :channels="channels" @selectChannel="selectChannel" :articleId="activeIndex" @delCannel="delCannel" @addChannel="addChannel" />
    </van-action-sheet>
  </div>
</template>

<script>
import moreAction from './components/more-action'
import { getMyChannels, delChannel, addChannel } from '@/api/channels.js'
import ArticleList from './components/article-list'
import { dislikeArticle, reportArticle } from '@/api/articles.js' // 调用不感兴趣 接口
import eventBus from '@/utils/eventbus.js' // 引入事件监听 机制  / 事件公交车
import ChannelEdit from './components/channel-edit' // 引入 频道编辑组件
export default {
  components: {
    ArticleList,
    moreAction,
    ChannelEdit
  },
  data () {
    return {
      channels: [], // 用来接收频道 数据
      showMoreAction: false, // 定义变量 是否显示弹层 默认不显示弹层组件
      articleId: null, // 接收和存储id 的变量 默认值为空
      activeIndex: 0, // 当前默认激活的页签
      show: false // 控制频道编辑组件 弹出层的显示与隐藏
    }
  },
  methods: {
    // 添加频道的方法
    async addChannel (channel) {
      // 调用 API 并写入缓存 成功后要将该 频道 push 到 channels 里面
      await addChannel(channel) // 传入参数 写入 写入缓存
      this.channels.push(channel) // 将自身数据 赋值给 data 中的 channels 数组
    },
    // 删除频道的方法
    async delCannel (id) {
      try {
        await delChannel(id) // 调用删除 API方法
        // 如果此时成功的 resolve 了 那就应该移出 当前 data 中 channels 的数据
        const index = this.channels.findIndex(item => item.id === id) // 找出对应的索引
        // 找到了 索引后 删除 channels 中对应索引的数据
        // 删除 索引对应的 频道数据
        if (index <= this.activeIndex) {
          // 此时你删除了 上面对应的索引 是在当激活索引之前的 或者等于当前激活索引的
          // 此时就需要把当前激活的索引 向前挪一位
          this.activeIndex = this.activeIndex - 1
        }
        this.channels.splice(index, 1) // 删除对应的索引频道
      } catch (error) {
        console.log(error)

        this.$notify({ message: '删除频道失败', duration: 800 })
      }
      // 此时应该先调用api
    },
    /*  // 第一种方式
     selectChannel (id) {
      // 当子组件 触发 selectChannel 的点击事件时 会触发 该方法
      const index = this.channels.findIndex(item => item.id === id) // 去频道数据里面找索引
      this.activeIndex = index // 对应频道的索引 设置给当前激活的 标签
      this.show = false // 关闭弹层
    }, */
    // 第二种方式
    selectChannel (index) {
      // 当子组件 触发 selectChannel 的点击事件时 会触发 该方法
      this.activeIndex = index // 对应频道的索引 设置给当前激活的 标签
      this.show = false // 关闭弹层
    },
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
    // operateType 是操作类型 如果是 dislike 即使不喜欢 如果是 report 就是举报
    async dislikeOrReport (operateType, type) { // 这里的 type 通过$evten 传出来
      try {
        // 需要根据一个参数来判断 是举报还是不喜欢
        operateType === 'dislike' ? await dislikeArticle({ // 用三元来决定 用那个传参 接口
          target: this.articleId // 传入不喜欢文章的id
        }) : await reportArticle({
          target: this.articleId, // 传入 id
          type
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
    /* ,
    // 接收举报文章 自定义事件 $emit()
    async reportArticle (type) {
      try {
        await reportArticle({
          target: this.articleId, // 传入 id
          type
        })
        // await 下方认为上方逻辑 通顺
        // 同样的 也要把 举报完的文章 给删除了
        eventBus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id) // 不感兴趣的id 传给事件公交车 触发这个事件
        // 关闭弹层
        this.showMoreAction = false
        this.$notify({ type: 'success', message: '操作成功' })
      } catch (error) {
        // 默认是 红色警示框
        this.$notify({ type: 'danger', message: '操作失败' })
      }
    } */
  },
  created () {
    this.getMyChannels()
  }
}
</script>

<style lang='less' scoped>
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
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
