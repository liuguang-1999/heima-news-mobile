<template>
  <!-- 编辑资料 -->
  <div class="container">
    <van-nav-bar left-arrow @click-left="$router.back()" title="编辑资料" right-text="保存"></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像" center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        />
      </van-cell>
      <van-cell is-link title="名称" :value="user.name" @click="showName = true" />
      <van-cell is-link title="性别" value="男" />
      <van-cell is-link title="生日" value="2019-08-08" />
    </van-cell-group>
    <!-- 放置头像弹层组件 -->
    <van-popup v-model="showPhoto" style="width:80%">
      <!-- 内容 -->
      <!-- 1 本地相册选择图片 -->
      <!-- 2 拍照 -->
      <van-cell is-link title="本地相册选择图片"></van-cell>
      <van-cell is-link title="拍照"></van-cell>
    </van-popup>
    <!-- 放置昵称弹层 -->
    <van-popup v-model="showName" style="width:80%" :close-on-click-overlay="false">
      <!-- 编辑用户昵称  双向绑定用户的昵称-->
      <van-field :error-message="nameMsg" type="textarea" rows="4" v-model="user.name"></van-field>
      <!-- 点击确定 关闭弹层 -->
      <van-button type="info" size="large" block @click="btnName">确定</van-button>
    </van-popup>
    <!-- 放置性别弹层 -->
    <van-action-sheet :actions="actions" v-model="showGender" cancel-text="取消"></van-action-sheet>
    <!-- 放置生日弹层 -->
    <van-popup v-model="showBirthDay" position="bottom">
      <!-- 选择出生日期  出生日期应该小于现在时间-->
      <!-- type表示 当前的日期类型 年月日 -->
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showPhoto: false, // 显示头像弹层 组件
      showName: false, // 显示昵称弹层
      showGender: false, // 显示性别弹层
      showBirthDay: false, // 显示生日弹层
      minDate: new Date(1900, 1, 1), // 生日组件 最小日期
      maxDate: new Date(), // 生日组件 最大日期
      currentDate: new Date(), // 当前弹出层 显示的时间 是今天
      actions: [{ name: '男' }, { name: '女' }],
      nameMsg: '', // 错误的信息
      user: {
        // 专门 放置 个人资料
        name: '', // 用户昵称
        gender: 1, // 0男 1 女
        birthday: '' // 给一个默认生日
      }
    }
  },
  methods: {
    btnName () {
      if (this.user.name.length < 1 || this.user.name.length > 7) {
        this.nameMsg = '用户昵称的长度应该是1-7的长度要求'
        return
      }
      this.nameMsg = '' // 将错误信息 清空
      // 关闭弹层
      this.showName = false // 关闭 弹层
    }
  }
}
</script>

<style>

</style>
