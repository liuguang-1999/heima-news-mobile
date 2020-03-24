 <template>
  <div class='container'>
     <van-nav-bar  fixed title="搜索结果" left-arrow @click-left="$router.back()" />
      <!-- 放置上拉加载状态 -->
      <van-list v-model="upLoading" @load="onLoad" :finished="finished">
        <van-cell-group>
          <van-cell v-for="item in articles " :key="item.art_id.toString()">
            <div class="article_item">
              <h3 class="van-ellipsis">{{ item.title }}</h3>
              <div class="img_box" v-if="item.cover.type === 3">
                <van-image class="w33" fit="cover" :src="item.cover.images[0]" />
                <van-image class="w33" fit="cover" :src="item.cover.images[1]" />
                <van-image class="w33" fit="cover" :src="item.cover.images[2]" />
              </div>
              <div class="img_box" v-if="item.cover.type === 1">
                <van-image class="w100" fit="cover" :src="item.cover.images[0]" />
              </div>
              <div class="info_box">
                <span>{{ item.aut_name }}</span>
                <span>{{ item.comm_count }}</span>
                <!-- 用之前封装的过滤器 来处理相对时间 -->
                <span>{{ item.pubdate | reltime }}</span>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
      </van-list>
  </div>
</template>

<script>
import * as auts from '@/api/articles'
export default {
  data () {
    return {
      upLoading: false, // 上拉加载状态
      finished: false, // 表示当前的加载是否全部完成了 如果全部完成 应该将finished设置成true
      articles: [], // 放置搜索结果文章的
      page: {
        page: 1, // 当前第几页
        per_page: 10 // 每页的多少条
      }
    }
  },
  methods: {
    // 该方法会在 滚动条 滚动到底部的时候执行
    async onLoad () {
      try {
        const { item } = this.$route.query // 获取路由 地址参数
        const ser = await auts.searchArticle({ ...this.page, q: item })
        this.articles.push(...ser.results) // 上拉加载方法 触发时 我们将请求到的数据 追加到 队列尾部
        // 关闭 上拉加载状态
        this.upLoading = false
        // 还有一问题 如何判断 上拉加载把全部的数据都查询过来了呢？
        // 接口并没有 告诉我们 什么时候结束 我们可以根据 当前返回的数据 是否有记录 进行判断
        // 如果你返回的 查询记录时0 我们此时认为 没有下一页数据了
        if (ser.results.length) {
        // 返回的数据 有长度 大于 0 就可以认为 有下一页数据
          this.page.page++ // 若果有下一页 应该把页码切换到下一页
        } else {
        // 否则 是没有下一页数据的
          this.finished = false // 没有下一页 结束  当前的加载是否全部完成了
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

}
</script>

<style lang="less" scoped>
.container {
  padding-top: 46px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      height: 180px;
      width: 100%;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    span {
      padding-right: 10px;
    }
  }
}
</style>
