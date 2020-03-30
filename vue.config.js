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
  },
  // config 参数就是 当前 vue-cli 项目所有的 webpack 配置参数
  // 如果想要改动 直接修改这个信息就可以了
  // 首先要判断 一下 当前打包环境 是 开发环境 还是生产环境
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // 只需要在 生产环境中 把所有的 console 删除掉 在打包 删除的 console 不是删除源代码的 console 而是删除了 编译之后的 console
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  },
  publicPath: './' // 打包后的 文件引用地址
}
