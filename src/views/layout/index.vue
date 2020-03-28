<template>
  <div class="container">
    <!-- 导航头部组件 fixed表示导航栏 固定在顶部 -->
    <!-- 当页面地址是 /user的时候 该把顶部导航栏 给隐藏掉 不是/user就不隐藏 -->
    <van-nav-bar title="标题" left-arrow right-text="搜索" fixed v-if="$route.path !== '/user'" @click-right="$router.push('/search')"></van-nav-bar>
    <div class="my-wrapper" :class="{noTop:$route.path==='/user'}">
    <!-- 二级路由容器 -->
    <!-- 对二级路由容器 进行缓存 直接使用 keep-alive Vue.js 自带组件 包裹容器 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    </div>
    <!-- 导航底部组件 route 开启导航的路由模式 -->
    <van-tabbar route>
      <!-- 底部标签栏 组件 -->
      <!-- 点击标签 跳转路由 -->
      <van-tabbar-item icon="wap-home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="chat-o" to="/question">问答</van-tabbar-item>
      <van-tabbar-item icon="video-o" to="video">火神山</van-tabbar-item>
      <van-tabbar-item icon="manager-o" to="user">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  position: relative;
  // 控制二级路由容器的高宽
  .my-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 46px;
    padding-bottom: 50px;
    box-sizing: border-box;
    &.noTop {
      padding-top: 0;
    }
  }
}
</style>
