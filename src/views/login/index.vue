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
import { login } from '@/api/user.js'
import { mapMutations } from 'vuex' // 辅助函数 可以把mutations方法映射到methods方法中
export default {
  data () {
    return {
    // 表单数据
      loginFrom: {
        mobile: '13911111111', // 手机号
        code: '246810' // 验证码
      },
      errorMessage: { // 定义一个 对象专门存放 错误消息
        mobile: '', // 手机号错误消息
        code: '' // 验证码 错误消息
      }
    }
  },
  methods: {
    ...mapMutations(['updataUser']),
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
    async login () {
      const validateMobile = this.checkMobile()
      const validateCode = this.checkCode()
      if (validateMobile && validateCode) {
        // 当手机号 失败的时候 我们需要 捕获错误 用 try catch
        try {
          const ser = await login(this.loginFrom) // 调用接口 给接口传入 请求 参数
          // Vuex 的简化写法 结构出一个方法
          this.updataUser({ user: ser }) // 相当于 更新了 token 和 refresh_token
          // 判断是否有新的跳转页面
          const { redirectUrl } = this.$route.query // query 查询参数 也就是 ？ 后面的参数地址 里面有个 redirectUrl 地址变量 这个变量 也就是我要 跳转的地址
          this.$router.push(redirectUrl || '/')
          this.$notify({ type: 'success', message: '登陆成功', duration: 800 })
        } catch (error) {
          // 需要提示 捕获到的错误消息 告诉用户 登陆失败
          this.$notify({ message: '登陆失败', duration: 800 })
        }
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
