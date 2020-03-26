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
          :src="user.photo"
          @click="showPhoto=true"
        />
      </van-cell>
      <van-cell is-link title="名称" :value="user.name" @click="showName = true" />
      <van-cell is-link title="性别" :value="user.gender === 0 ? '男' :'女'" @click="showGender = true" />
      <van-cell is-link title="生日" :value="user.birthday" @click="showDate" />
    </van-cell-group>
    <!-- 放置头像弹层组件 -->
    <van-popup v-model="showPhoto" style="width:80%">
      <!-- 内容 -->
      <!-- 1 本地相册选择图片 -->
      <!-- 2 拍照 -->
      <van-cell is-link title="本地相册选择图片" @click="openFileDialog"></van-cell>
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
    <!-- 注册弹层的选择事件 -->
    <van-action-sheet @select="selectItem" :actions="actions" v-model="showGender" cancel-text="取消"></van-action-sheet>
    <!-- 放置生日弹层 -->
    <van-popup v-model="showBirthDay" position="bottom">
      <!-- 选择出生日期  出生日期应该小于现在时间-->
      <!-- type表示 当前的日期类型 年月日 -->
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
         @cancel="showBirthDay=false"
         @confirm="confirmDate"
      />
    </van-popup>
     <!-- 放置一个input:file 标签 用来上传图片  不能让人看到 隐藏掉 -->
    <!-- vue中 可以通过 ref获取对象 -->
    <!-- 如果选择了文件 就会触发input change事件 -->
    <input @change="upload" ref="myFile" type="file" style="display:none" name="" id="">
  </div>
</template>

<script>
import { getUserprofile, updatePhoto } from '@/api/user'
import dayjs from 'dayjs'
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
        birthday: '1999-4-9', // 给一个默认生日
        photo: '' // 用户 头像
      }
    }
  },
  methods: {
    // 修改头像
    async upload (params) {
    //   如果选择了文件 就会触发input 文件上传
      const data = new FormData()
      data.append('photo', this.$refs.myFile.files[0]) // 第一个参数 名称  第二个参数 图片文件
      const ser = await updatePhoto(data) // 上传头像
      this.showPhoto = false // 关闭头像弹层
      this.user.photo = ser.photo
    },
    // 打开选择文件的对话框
    openFileDialog () {
      this.$refs.myFile.click() // 触发input:file的click事件 触发事件就会弹出文件对话框
    },
    async getUserprofile () {
      this.user = await getUserprofile()
    },
    btnName () {
      if (this.user.name.length < 1 || this.user.name.length > 7) {
        this.nameMsg = '用户昵称的长度应该是1-7的长度要求'
        return
      }
      this.nameMsg = '' // 将错误信息 清空
      // 关闭弹层
      this.showName = false // 关闭 弹层
    },
    // 性别 弹层 事件方法
    selectItem (item, index) {
      this.user.gender = index // index 是 选择性别 的代号 0 男 1 女
      this.showGender = false // 手动关闭弹层
    },
    // 显示 生日 弹层
    showDate () {
    // 打开生日 弹层
      this.showBirthDay = true
      // 将当前的生日 设置到 选择日期的当前时间  将生日字符串转化为 date 对象 绑定到日期组件上面
      this.currentDate = new Date(this.user.birthday)
    },
    // 确定生日 日期
    confirmDate () {
      //  当前选择的生日 其实就是 currenDate
      // 拿到选择的日期  设置给生日  => date  => 字符串
      this.user.birthday = dayjs(this.currentDate).format('YYYY-MM-DD') // 将date类型转化成字符串
      this.showBirthDay = false // 关闭弹层
    }
  },
  created () {
    this.getUserprofile()
  }
}
</script>

<style>

</style>
