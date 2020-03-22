<template>
  <div class="channel-edit">
      <!-- 我的频道 -->
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="(item,index) in channels" :key="index">
          <span class="f12">{{ item.name }}</span>
          <!-- 叉号❌标签 应该在 进入编辑状态时显示 和 退出编辑状态时不显示 -->
          <van-icon v-if="!index == 0 && editing" class="btn" name="cross"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <!-- 可选频道 -->
    <!-- 我的 频道里面的数据 是  当前用户自己的频道数据(在登录情况下用户自己的频道数据，匿名情况下自己的频道数据) -->
    <!-- 可选频道怎么定义  全部频道 - 我的频道 = 可选频道 -->
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="index in 8" :key="index">
          <span class="f12">频道{{index}}</span>
          <van-icon class="btn" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      editing: false // 正在编辑状态  用这个状态控制 是否显示删除的图标❌
    }
  },
  //   props:['channels'] 老方法 简单易上手 没有难度
  // 下面是 以对象的形式 去结构 props 的数据
  props: {
    channels: { // 这里的 channels 是父组件传递过来的 参数 用循环去遍历他
      required: true, // 第一个参数 required 必填项
      type: Array, // 第二个参数是 传递数据的类型
      default: () => [] // 默认值为 空数组
    }
  }
}
</script>

<style lang='less' scoped>
.channel-edit {
  .channel {
    padding: 10px;
    .tit {
      line-height: 3;
      .tip {
        font-size: 10px;
        color: #999;
      }
    }
    .van-button {
      float: right;
      margin-top: 7px;
    }
    .btn {
      position: absolute;
      bottom: 0;
      right: 0;
      background: #ddd;
      font-size: 12px;
      color: #fff;
    }
    .f12 {
      font-size: 12px;
      color: #555;
    }
    .red {
      color: red;
    }
  }
}
</style>
