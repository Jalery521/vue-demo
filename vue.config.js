module.exports = {
  lintOnSave: false,
  baseUrl: './',
  productionSourceMap: false, //生产环境打包的时候，不需要打包sourceMap文件
  configureWebpack: {
    externals: {
      // 左边的名字是 import xx from '包名'  包名
      // 右边的名字是 cdn中导入的第三方包js的名字
      vue: 'Vue',
      'vue-router': 'VueRouter',
      wangeditor: 'wangEditor',
    },
  },
}
