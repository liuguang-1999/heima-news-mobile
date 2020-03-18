<template>
   <!-- 登录 -->
  <div class="container">
      <!-- 头部导航栏 左箭头left-arrow -->
      <van-nav-bar title="登录"  left-arrow @click-left="$router.go(-1)"></van-nav-bar>
      <!-- 登录模块 布局 -->
      <van-cell-group>
        <!-- 手机号 -->
       <van-field @blur="checkMobile" :error-message="errorMessage.mobile" v-model.trim="loginFrom.mobile" placeholder="请输入手机号" label="手机号"></van-field>
       <!-- 验证码 -->
       <van-field @blur="checkCode" :error-message="errorMessage.code" v-model.trim="loginFrom.code" placeholder="请输入验证码" label="验证码">
         <!-- 验证码 按钮 -->
         <van-button slot="button" size="small" type="primary">发送验证码</van-button>
       </van-field>
      </van-cell-group>
        <!-- 登录按钮 -->
        <div class="login-box">
        <van-button @click="login" type="info" block round size="small"> 登录 </van-button>
        </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    // 表单数据
      loginFrom: {
        mobile: '13911111111', // 手机号
        code: '666666' // 验证码
      },
      errorMessage: { // 定义一个 对象专门存放 错误消息
        mobile: '', // 手机号错误消息
        code: '' // 验证码 错误消息
      }
    }
  },
  methods: {
    // 定义一个检查手机号的方法
    checkMobile () {
      // 获取手机号 校验是否为空
      if (!this.loginFrom.mobile) {
        this.errorMessage.mobile = '手机号不能为空'
        return false // return 一个 false 表示此校验没有通过
      }
      // 正则 校验格式是否正确
      if (!/^1[3-9]\d{9}$/.test(this.loginFrom.mobile)) {
        this.errorMessage.mobile = '手机号格式不正确'
        return false
      }
      // 如果到了 这个位置了 就说明 之前的校验都通过了
      this.errorMessage.mobile = '' // 通过了 就没有消息了
      return true
    },
    // 定义一个 检查验证码的方法
    checkCode () {
      // 获取 验证码 校验是否为空
      if (!this.loginFrom.code) {
        this.errorMessage.code = '验证码不能为空'
        return false // return 一个 false 表示此校验没有通过
      }
      // 正则 校验格式是否正确
      if (!/^\d{6}$/.test(this.loginFrom.code)) { // 摘要 /^\d{6}$/.test(this.loginFrom.code ! ! ! !
        this.errorMessage.code = '验证码必须为6位数字'
        return false
      }
      // 如果到了 这个位置了 就说明 之前的校验都通过了
      this.errorMessage.code = '' // 通过了 就没有消息了
      return true
    },
    // 点击登陆时 手动校验表单
    login () {
      const validateMobile = this.checkMobile()
      const validateCode = this.checkCode()
      if (validateMobile && validateCode) {
        console.log('校验通过')
      }
    }
  }
}
</script>

<style>
.login-box{
padding: 15px;
}
</style>
