<template>
      <!-- 文章 详情 -->
    <div class='container'>
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />
    <div class="detail">
      <h3 class="title">{{ article.title }}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <p class="name">{{ article.aut_name }}</p>
          <p class="time">{{ article.pubdate | reltime }}</p>
        </div>
        <van-button round size="small" type="info">{{ article.is_followed ? '已关注' : '+关注' }}</van-button>
      </div>
      <div class="content" v-html="article.content">
        <!-- 文章内容 有属性 有样式 有标签 -->
        <!-- <p>文章的内容</p> -->
      </div>
      <div class="zan">
        <!-- 需要根据当前的 不喜欢&点赞 决定谁来拥有这个红色的 active 样式 1、点赞 0、不喜欢 其他数是没有 两个状态都不选择 -->
        <van-button round size="small" :class="{active: article.attitude === 1}" plain icon="like-o">点赞</van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round size="small" :class="{active: article.attitude === 0}" plain icon="delete">不喜欢</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticleInfo } from '@/api/articles'
export default {
  data () {
    return {
      article: {} // 文章详情存储容器
    }
  },
  methods: {
    // 获取文章 详情数据 方法
    async getArticleInfo () {
      // 获取 路由传参 传入的 id 参数
      const { artId } = this.$route.query // 从当前路由信息对象里面  结构出一个 query 参数
      // 把得到的结果 赋值给我的 文章详情存储容器 article 里面
      this.article = await getArticleInfo(artId) // 接口返回值有一个参数的时不用 额外找变量接收了 节省代码量
    }
  },
  created () {
    this.getArticleInfo()
  }

}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.detail {
  padding: 46px 10px 44px;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan{
    text-align: center;
    padding: 10px 0;
    .active{
      border-color:red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    position:sticky;
    background-color: #fff;
    top:46px;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
    /deep/ code{
      white-space: pre-wrap;
    }
  }
}
</style>
