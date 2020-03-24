<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <!-- 搜索组件 -->
    <van-search  placeholder="请输入搜索关键词" shape="round"  v-model.trim="q" @search="onSearch(q)" />
    <!-- 联想内容 输入内容时 显示联想内容 -->
    <van-cell-group class="suggest-box" v-if="q">
      <!-- 循环出的 历史搜索建议 -->
      <van-cell @click="toResult(item)" icon="search" v-for="(item,index) in suggestList" :key="index">
        {{ item }}
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
        <van-cell v-for="(item,index) in historylist" :key="item" @click="toResult(item)">
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
import { getSuggestion } from '@/api/articles'
const key = 'heima-94-toutiao' // 声明一个 key 用来向本地 作存储的 key
export default {
  name: 'search',
  data () {
    return {
      q: '', // 关键字的数据
      historylist: JSON.parse(localStorage.getItem(key) || '[]'), // 搜索 历史记录 的储存数组
      suggestList: [] // 历史的搜索记录 储存
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
    // 由于这个代码 和下面的某处代码一样 封装
    /*  toSearchResult (item) {
      // 路由传参 query 传参
      // this.$router.push(`search/result/?q=${item}`) // 第一种 query 传参
      this.$router.push({ path: '/search/result', query: { item } }) // 第二种 query 的传参方式
    }, */
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
      // 去除 重复 去重机制
      this.historylist = Array.from(new Set(this.historylist)) // 追加一个 这种方法 就不会有重复的记录的问题了
      localStorage.setItem(key, JSON.stringify(this.historylist))
      // 搜索事件触发的时候 应该跳到 搜索结果页
      // 在跳转之前 把搜索数据 存入到 历史记录里面
      this.$router.push({ path: '/search/result', query: { item } })
    },
    // 点击搜索记录 跳转至结果页
    toResult (item) {
      // 应该把 这个 item 放到历史记录里面
      this.historylist.unshift(item) // 放到 历史记录 有可能重复
      this.historylist = Array.from(new Set(this.historylist)) // 追加一个 这种方法 就不会有重复的记录的问题了
      localStorage.setItem(key, JSON.stringify(this.historylist)) // 存入到本地缓存中去
      this.$router.push({ path: '/search/result', query: { item } }) // 点击结果跳转至 搜索结果页
    }
  },
  watch: {
    /* q () {
      // 只要执行了 Q 就应该清除定时器
      clearTimeout(this.timer) // 清除定时器
      // 防抖函数 防抖写法
      this.timer = setTimeout(async () => {
        if (!this.q) {
          // 如果 这是搜索关键字没内容 应该把  suggestList 清空
          this.suggestList = [] // 清空历史记录 并且不能往下进行
          return
        }
        // 当搜索框 清空的时候 不要发送请求
        // 此函数内部 需要请求 历史搜索记录
        const ser = await getSuggestion({ q: this.q })
        this.suggestList = ser.options // 获取到的数据 赋值给 suggestList 历史的搜索记录 储存
      }, 300)
    } */
    // 节流写法 节流 函数
    q () {
      if (!this.timer) {
        // 要求 500 毫秒 执行一次
        this.timer = setTimeout(async () => {
          // 先将标记设置为空
          this.timer = null
          if (!this.q) {
          // 如果 这是搜索关键字没内容 应该把  suggestList 清空
            this.suggestList = [] // 清空历史记录 并且不能往下进行
            return
          }
          // 当搜索框 清空的时候 不要发送请求
          // 此函数内部 需要请求 历史搜索记录
          const ser = await getSuggestion({ q: this.q })
          this.suggestList = ser.options // 获取到的数据 赋值给 suggestList 历史的搜索记录 储存
        }, 500)
      }
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
