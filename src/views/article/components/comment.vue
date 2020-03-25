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
            <van-tag plain @click="openReyply(item.com_id.toString())">{{ item.reply_count }} 回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
    <!-- 底部输入框 -->
    <div class="reply-container van-hairline--top">
      <!-- 绑定了 评论内容 不论是 对文章评论 还是对评论回复 都是用的 这个底部输入框 -->
      <van-field v-model.trim="value" placeholder="写评论...">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span class="submit" v-else slot="button" @click="submit">提交</span>
      </van-field>
    </div>
    <!-- 评论组件 的评论区弹出框 -->
        <!-- 回复 -->
        <!-- 关闭 评论是 评论id 设置为空 closed -->
    <van-action-sheet @closed="reply.commentId = null" v-model="showReply" :round="false" class="reply_dialog" title="回复评论">
      <van-list @load="getReply" :immediate-check="false" v-model="reply.loading" :finished="reply.finished" finished-text="没有更多了">
        <div class="item van-hairline--bottom van-hairline--top" v-for="item in reply.list" :key="item.com_id.toString()">
          <van-image round width="1rem" height="1rem" fit="fill" :src="item.aut_photo" />
          <div class="info">
            <p><span class="name">{{ item.aut_name }}</span></p>
            <p>{{ item.content }}</p>
            <p><span class="time">{{ item.pubdate |reltime }}</span></p>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
  </div>

  <!-- 都不输入框 -->
</template>

<script>
import { getComments, commentoReply } from '@/api/articles'
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
        list: [], // 用于存放 当前评论的 评论数据
        commentId: null // 用来存放评论 id   用这个 id 区查询 这个评论的 评论
      }
    }
  },
  methods: {
    // 点击按钮提交评论
    async submit () {
      try {
      // 点击按钮后 需要判断一下 用户是否登录 如果没登陆的话 不允许评论 登陆了才可以往下 进行
      // 可以利用 Vuex 里面的 token 进行判断 用户是否登录 如果没登录就让用户去登陆
        if (this.$store.state.user.token) {
        // 成立的话 才认为当前用户登录了 若果登陆了 还需要判断 是否有评论的内容
        // 如果没有评论内容 直接返回
          if (!this.value) return false// 如果没有评论内容 直接拦截代码执行
          this.submiting = true // 把按钮 的加载状态 打开 表示正在提交中 这样的话 可以避免 重复提交 只有提交完毕 后方可关闭 加载状态
          try {
            const ser = await commentoReply({
              target: this.reply.commentId ? this.reply.commentId : this.$route.query.artId, // 表示 要么是文章的 id 要么是 回复评论的 id  这就要 根据 你当前是对谁 进行评论
              content: this.value, // 传入 评论的内容
              art_id: this.reply.commentId ? this.$route.query.artId : null// 如果是对评论进行评论 需要传该评论属于哪个文章 如果是对文章进行评论 就不用传入这个参数
            }) // 提交数据 方法
            // ser.new_obj // 此 obj 是添加成功后的一条数据 词条数据需要追加到 评论列表
            // 有两个场景 对文章进行评论 对评论 进行回复
            if (this.reply.commentId) {
              setTimeout(() => {
                // 如果有 id 的话 就是对 评论进行 回复
                this.reply.list.unshift(ser.new_obj)
                // 如果是对评论 进行回复 那就需要 找到对应的评论 id 将评论 id 的回复数+1
                const comment = this.comments.find(item => item.com_id.toString() === this.reply.commentId)
                comment && comment.reply_count++ // 找到了 回复的显示数字的话 就递增 加1
                this.submiting = false // 按钮的加载状态关闭
                this.value = '' // 清空 评论框内的内容
              }, 200)
            } else {
              setTimeout(() => {
                // 如果没 id 的话 就是对文章进行评论
                this.comments.unshift(ser.new_obj)
                this.submiting = false // 按钮的加载状态关闭
                this.value = '' // 清空 评论框内的内容
              }, 200)
            }
          } catch (error) {
            this.$notify({ message: '评论失败', duration: 800 })
          }
        } else {
        // 否则 认为 用户没有登录
        // 没登陆的情况下 去告知用户 去登录 登陆后 才可以进行评论
          await this.$dialog.confirm({
            message: '当前还没有登陆,请登陆'
          })
          // 如果用户点击了确定 需要跳转到登陆页面
          this.$router.push({ path: '/login', query: { redirectUrl: this.$route.fullPath } }) // 登录成功之后需要回到 当前页
        }
      } catch (error) {
        console.log(error)
      }
    },
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
        if (!this.finished) { // 如果不等 表示还有下一页的数据
        // 如果还没结束 需要把 ser.last_id 当前页的最后一个 id 给 offset 最后页码变量中
          this.offset = ser.last_id
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 点击按钮 弹出 评论的 回复评论列表 组件
    openReyply (id) {
      // 点击按钮 打开 评论 列表
      this.showReply = true
      // 在弹出面板时候 重置数据
      this.reply.commentId = id
      // 弹出窗口之前 把之前的 list 列表给清空
      this.reply.list = [] // 清空 之前的数据
      this.reply.offset = null // 因为 希望点击弹出回复面板的时候 是新的数据 从第一页开始
      this.reply.finished = false // 将 加载状态 开启
      this.reply.loading = true // 主动打开 加载状态 因为此时没有 主动检查
      // 打开 弹出面板的时候 去主动调用 评论的评论 获取数据方法
      this.getReply() // 点击弹出层 调用 获取评论的评论 方法
    },
    // 此方法 用来获取 评论的评论
    // 此方法 会在第一次 时执行 也会在 加载第二页 。。。。 第三页。。。时执行
    // 获取 评论 的评论数据
    async getReply () {
      try {
        // 发送获取数据的请求
        const ser = await getComments({
          type: 'c', // 表示 获取 评论的评论
          source: this.reply.commentId, // 获取评论的评论
          offset: this.reply.offset // 当前的偏移量 评论的 评论的分页依据
        })
        // 把获取到的数据 追加到我的列表队尾中
        this.reply.list.push(...ser.results)
        this.reply.loading = false // 关闭加载状态
        this.reply.finished = ser.end_id === ser.last_id // 如果 这俩 相等 就为 true 为 true 的话就意味着 没有下一页的数据 能求到了
        if (!this.reply.finished) { // 如果不等 表示还有下一页的数据
        // 如果还没结束 需要把 ser.last_id 当前页的最后一个 id 给 offset 最后页码变量中
          this.reply.offset = ser.last_id
        }
      } catch (error) {
        console.log(error)
      }
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
