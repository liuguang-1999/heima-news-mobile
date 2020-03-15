/**
 * 专门处理 postcss 插件
 *
 */
module.exports = {
  // 导出所有的postcss 插件
  // 我们只需要导出两个插件 即可
  plugins: {
    // 这个功能 自动给css样式 加前缀的属性 例如 displaty:flex => 自动加 其他浏览器的 前缀
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue: 37.5, // 基准值 的意思  例如 font-size: 30px =>  /rootValue => 最终的rem
      propList: ['*'] // 包括那些文件 需要做基准值的处理 写*的意思是 所有的文件都需要 作rem 适配
    }
  }
}
// 注意  rootValue 是转换px的基准值 上面的值 是参考苹果6 设备宽度 375px / 10 得出的rem
