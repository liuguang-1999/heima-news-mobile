/**
 *      作Vant组件库 覆盖颜色主题的配置
 *       导出一个 对象
 */
module.exports = {
  // 需要更改less 中的变量配置
  css: {
    // 修改CSS 相关的参数
    loaderOptions: {
      // 所有关于样式的 loader 相关的选项
      less: {
        // 这里的选项写 Vant 组件库给我们提供的配置参数
        // modifyVars 是 less-loader 的一个选项 在这里可以通过这个选项 去改变 Vant组件库里面 所有组件 的默认值
        modifyVars: {
          // key 和 value 的形式写配置参数
          blue: '#3296fa'
        }
      }
    }
  }
}
