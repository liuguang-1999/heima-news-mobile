<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <!-- 搜索组件 -->
    <van-search  placeholder="请输入搜索关键词" shape="round"  v-model.trim="q" />
    <!-- 联想内容 输入内容时 显示联想内容 -->
    <van-cell-group class="suggest-box" v-if="q">
      <van-cell icon="search">
        <span>j</span>ava
      </van-cell>
    </van-cell-group>
    <!-- 历史部分 收缩后的记录 会在这里显示 -->
    <!-- 果如没有 历史记录 -->
    <div class="history-box" v-else>
      <!-- 只有当历史记录 存在的时候 才显示 历史记录 的头部模块 -->
      <div class="head" v-if="historylist.length">
        <span>历史记录</span>
        <van-icon name="delete" ></van-icon>
      </div>
      <van-cell-group>
        <van-cell v-for="(item,index) in historylist" :key="item">
          <!-- 这个位置 需要用动态的方式生成 -->
          <a class="word_btn">{{ item }}</a>
          <van-icon class="close_btn" slot="right-icon" name="cross" @click="delHistory(index)"/>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
const key = 'heima-94-toutiao' // 声明一个 key 用来向本地 作存储的 key
export default {
  name: 'search',
  data () {
    return {
      q: '', // 关键字的数据
      historylist: JSON.parse(localStorage.getItem(key) || '[]') // 搜索 历史记录 的储存数组
    }
  },
  methods: {
    // 删除历史记录 方法
    delHistory (id) {
      // 删除 要现在本地删除  然后在内存中删除
      this.historylist.splice(id, 1) // 直接删除本地的历史记录
      // 删除后的数据 同步本地的缓存中
      localStorage.setItem(key, JSON.stringify(this.historylist))
    }
  }
}
</script>

<style lang='less' scoped>
.history-box {
  padding: 0 20px;
  .head{
    line-height: 36px;
    color: #999;
    .van-icon{
      font-size: 16px;
      float: right;
      margin-top: 10px;;
    }
  }
  .van-cell{
    padding: 10px 0;
  }
  .word_btn{
    color:#3296fa;
  }
  .close_btn{
    margin-top:5px;
    color: #999;
  }
}
.suggest-box{
  /deep/ .van-cell{
    padding: 10px 20px;
    color: #999;
    p{
      span{
        color: red;
      }
    }
  }
}
</style>
