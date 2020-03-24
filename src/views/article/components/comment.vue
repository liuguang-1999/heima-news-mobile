<template>
  <div class="comment">
      <!-- 列表组件 可以做上拉 加载 我们的数据 是不可能一口气 加载完的 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div class="item van-hairline--bottom van-hairline--top" v-for="item in comments" :key="item.com_id.toString()">
          <!-- 用户头像 -->
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          :src="item.aut_photo"/>
        <div class="info">
          <p>
              <!-- 用户名称 -->
            <span class="name">{{ item.aut_name }}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <!-- 点赞数量 -->
              <span class="count">{{ item.like_count }}</span>
            </span>
          </p>
          <!-- 评论内容 -->
          <p>{{ item.content }}</p>
          <p>
              <!-- 时间 用过滤器 处理一下 -->
            <span class="time">{{ item.pubdate | reltime }}</span>&nbsp;
            <!-- 回复数量 -->
            <van-tag plain @click="openReyply">{{ item.reply_count }} 回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="写评论...">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span class="submit" v-else slot="button">提交</span>
      </van-field>
    </div>
    <!-- 评论组件 的评论区弹出框 -->
        <!-- 回复 -->
    <van-action-sheet v-model="showReply" :round="false" class="reply_dialog" title="回复评论">
      <van-list v-model="reply.loading" :finished="reply.finished" finished-text="没有更多了">
        <div class="item van-hairline--bottom van-hairline--top" v-for="index in 8" :key="index">
          <van-image round width="1rem" height="1rem" fit="fill" src="https://img.yzcdn.cn/vant/cat.jpeg" />
          <div class="info">
            <p><span class="name">一阵清风</span></p>
            <p>评论的内容，。。。。</p>
            <p><span class="time">两天内</span></p>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
  </div>

  <!-- 都不输入框 -->
</template>

<script>
import { getComments } from '@/api/articles'
export default {
  data () {
    return {
      // 上拉加载中
      loading: false,
      // 全部加载完毕
      finished: false,
      // 输入的内容
      value: '',
      // 控制提交中状态数据
      submiting: false,
      // 存放评论数据
      comments: [],
      // 分页依据 如果为空 默认第一页开始
      offset: null,
      // ------------ 回复相关数据 -------------
      // 控制回复弹窗显示隐藏
      showReply: false, // 控制回复列表组件的显示和隐藏
      reply: {
        // 专门用reply这个对象存放回复相关的数据
        loading: false, // 是回复列表组件的状态
        finished: false, // 评论的 评论是否加载完毕
        offset: null, // 偏移量 获取评论的评论的分页依据 c
        list: [] // 用于存放 当前评论的 评论数据
      }
    }
  },
  methods: {
    // 下拉加载方法 当滚动条距离底部 超过一定限制的时候 触发这个方法
    async onLoad () {
      try {
        const { artId } = this.$route.query
        // 方法里面要做数据的加载
        const ser = await getComments({
          type: 'a', // a(文章的评论)  c(评论的评论)
          source: artId, // 表示 你查询的 是那种评论 文章的评论？ 还是评论回复的评论？
          offset: this.offset // 偏移量 就是当前的 偏移量  语义分析、分页数据的页码
        })
        // 将数据 追加到 comments 的尾部中
        this.comments.push(...ser.results) // 将请求道的 数据追加到尾部
        // 接下来 应该关闭 下拉刷新的状态
        this.loading = false // 关闭 下拉刷新 的状态
        // 此时此刻 还没有结数 还需要判断 还有没有 下一页数据
        // ser.end.id === ser.last_id => finished = true
        this.finished = ser.end_id === ser.last_id // 如果 这俩 相等 就为 true 为 true 的话就意味着 没有下一页的数据 能求到了
        if (!this.finished) {
        // 如果还没结束 需要把 ser.last_id 当前页的最后一个 id 给 offset 最后页码变量中
          this.offset = ser.last_id
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 点击按钮 弹出 评论的 回复评论列表 组件
    openReyply () {
      this.showReply = true
    }
  }
}
</script>

<style lang='less' scoped>
.reply_dialog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content{
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
.reply_dialog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content{
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    .info {
      flex: 1;
      padding-left: 10px;
      .name{
        color:#069;
      }
      .zan{
        vertical-align:middle;
        padding-right:2px;
      }
      .count{
        vertical-align:middle;
        font-size:10px;
        color: #666;
      }
      .time{
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
</style>
