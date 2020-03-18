<template>
   <!-- 登录 -->
  <div class="container">
      <!-- 头部导航栏 左箭头left-arrow -->
      <van-nav-bar title="登录"  left-arrow @click-left="$router.go(-1)"></van-nav-bar>
      <!-- 登录模块 布局 -->
      <van-cell-group>
        <!-- 手机号 -->
       <van-field v-model="value" placeholder="请输入手机号" label="手机号"></van-field>
       <!-- 验证码 -->
       <van-field v-model="value" placeholder="请输入验证码" label="验证码">
         <!-- 验证码 按钮 -->
         <van-button slot="button" size="small" type="primary">发送验证码</van-button>
       </van-field>
      </van-cell-group>
        <!-- 登录按钮 -->
        <div class="login-box">
        <van-button type="info" block round size="small"> 登录 </van-button>
        </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>
.login-box{
padding: 15px;
}
</style>
