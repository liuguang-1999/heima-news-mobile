<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <!-- 搜索组件 -->
    <van-search  placeholder="请输入搜索关键词" shape="round"  v-model.trim="q" @search="onSearch(q)" />
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
        <van-icon name="delete" @click="delclear"></van-icon>
      </div>
      <van-cell-group>
        <van-cell v-for="(item,index) in historylist" :key="item" @click="toSearchResult(item)">
          <!-- 这个位置 需要用动态的方式生成 -->
          <a class="word_btn">{{ item }}</a>
          <!-- 此时这个 方法 事件冒泡了 用 stop 修饰符 来阻止 冒泡 -->
          <van-icon class="close_btn" slot="right-icon" name="cross" @click.stop="delHistory(index)"/>
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
    },
    // 跳转到搜索结果页
    toSearchResult (item) {
      // 路由传参 query 传参
      // this.$router.push(`search/result/?q=${item}`) // 第一种 query 传参
      this.$router.push({ path: '/search/result', query: { item } }) // 第二种 query 的传参方式
    },
    // 点击垃圾桶 清除搜索的历史记录
    async delclear () {
      try {
        // 清空的数组 存储到本地的缓存内
        // await this.$confirm('您确定要清空历史记录吗？', '提示')
        await this.$dialog.confirm({
          title: '提示',
          message: '您确定要清空历史记录吗？'
        })
        this.historylist = [] // 清除的本质就是 把数组内的内容清空
        localStorage.setItem(key, JSON.stringify(this.historylist))
      } catch (error) {
        // 失败了 不需要处理
      }
    },
    // 搜索方法 点击搜索时触发
    onSearch (item) {
      // 首先判断 搜索内容为空的话 不能进行跳转
      if (!item) return // 如果 item 为空就不能进行 跳转
      this.historylist.unshift(item) // 存入到 本地中 但是有重复的记录
      this.historylist = Array.from(new Set(this.historylist)) // 追加一个 这种方法 就不会有重复的记录的问题了
      localStorage.setItem(key, JSON.stringify(this.historylist))
      // 搜索事件触发的时候 应该跳到 搜索结果页
      // 在跳转之前 把搜索数据 存入到 历史记录里面
      this.$router.push({ path: '/search/result', query: { item } })
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
