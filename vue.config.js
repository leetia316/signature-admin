const path = require('path')
const fs = require('fs')

const resolve = dir => {
  return path.join(__dirname, dir)
}

// const env = process.env.NODE_ENV || 'development'
// // fs.writeFileSync(path.join(__dirname, './config/env.js'), `export default '${env}'
// // `)

// 这里需要修改为你线上项目存放的路径
// 比如你打包的文件放到服务器的my-app文件夹，域名为a.com，则应改为
// http(s)://a.com/my-app/
// const BASE_URL = 'https://iview.github.io/iview-admin/'

module.exports = {
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  // baseUrl: BASE_URL,
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
    devServer: {
        host: '0.0.0.0',
        // host: "localhost",
        port: 8080, // 端口号
        proxy: {
            // '/api': {
            //     target: '<url>',
            //     ws: true,
            //     changeOrigin: true
            // },
            '/rxswt': {
                target: 'http://10.22.143.9:8977' //http://11.11.74.38:8977
            }
        }
    },
  chainWebpack: config => {
    config.entry.app = ["babel-polyfill", resolve('src/main.js')]
   /* config.entry('app').add('babel-polyfill') //添加babel-polyfill解决IE兼容问题*/
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
      .set('_com', resolve('src/common'))
      .set('_v', resolve('src/view'))

      // ie报错无效字符 添加该配置项 解决该问题
      config.module
          .rule('iview')
          .test(/iview.src.*?js$/)
          .use('babel')
          .loader('babel-loader')
          .end()

  }
}
