<template>
  <div class="container">
    <!-- 主页 -->
    <!-- 顶部 标签页 -->
    <van-tabs>
      <!-- 内部标签 -->
      <van-tab :title="`标签${iten}`" v-for="(iten,index) in 10" :key="index">
        <!-- 单元格 -->
        <div class="scroll-wrapper">
          <van-cell-group>
            <van-cell title="标题" value="内容" v-for="item in 20" :key="item"></van-cell>
          </van-cell-group>
        </div>
      </van-tab>
    </van-tabs>
    <!-- 放置编辑频道 的字体图标 -->
    <span class="bar_btn">
    <van-icon name="wap-nav" dot />
    </span>
  </div>
</template>

<script>
export default {}
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
