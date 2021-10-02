> 客户端渲染

* CSR：Client Side Rendering
* 服务器端仅返回 JSON 数据, DATA 和 HTML 在客户端进行渲染.
* 首屏等待时间长, 用户体验差, 页面结构为空, 不利于 SEO


![client-side-render](./imgs/client-side-render.png)

> 服务器端渲染

* SSR：Server Side Rendering
* 服务器端返回HTML, DATA 和 HTML 在服务器端进行渲染.

![server-side-render](./imgs/server-side-render.png)

## 项目结构

* react-ssr
    * src
       * client 客户端代码
       * server 服务器端代码
       * share 同构代码


(同构指的是代码复用. 即实现客户端和服务器端最大程度的代码复用.)

## 实现 React SSR

1. 引入要渲染的 React 组件
2. 通过 `renderToString` 方法将 React 组件转换为 HTML 字符串
3. 将结果HTML字符串想到到客户端

> renderToString 方法用于将 React 组件转换为 HTML 字符串, 通过 react-dom/server 导入.


## webpack 打包配置

```js
// webpack.server.js
const path = require('path')

module.exports = {
    mode: 'development',
    target: 'node',
    entry: './src/server/index.js',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            }
        ]
    }
}
```

## 项目启动命令配置

1. 配置服务器端打包命令: `"dev:server-build": "webpack --config webpack.server.js --watch"`
2. 配置服务端启动命令: `"dev:server-run": "nodemon --watch build --exec \"node build/bundle.js\""`

## 客户端 React 附加事件

* 使用 `hydrate` 方法对组件进行渲染, 为组件元素附加事件.
* `hydrate` 方法在实现渲染的时候, 会复用原本已经存在的 DOM 节点, 减少重新生成节点以及删除原本 DOM 节点的开销.
* 通过 `react-dom` 导入 `hydrate`.

```js
ReactDOM.hydrate(<APP />, document.getElementById('root'))
```

### 客户端 React 打包配置


1. webpack 配置
打包目的: 转换JSX语法, 转换浏览器不识别的高级 JavaScript 语法
打包目标位置: `public` 文件夹
2. 打包启动命令配置
`"dev:client-build": "webpack --config webpack.client.js --watch"`

* 在响应给客户端的 HTML 代码中添加 script 标签, 请求客户端 JavaScript 打包文件.
* 服务器端程序实现静态资源访问功能, 客户端 JavaScript 打包文件会被作为静态资源使用.

服务器端实现静态资源访问

* 服务器端程序实现静态资源访问功能, 客户端 JavaScript 打包文件会被作为静态资源使用.
 
```js
app.use(express.static('public'))
```

## 优化 

* 合并 webpack 配置
    * 服务器端 webpack 配置和客户端 webpack 配置存在重复. 将重复配置抽象到 webpack.base.js 配置文件中.

* 合并项目启动命令
    * 目的: 使用一个命令启动项目, 解决多个命令启动的繁琐问题. 通过 npm-run-all 工具实现.
    * "dev": "npm-run-all --parallel dev:*"
* 服务器端打包文件体积优化
    * 问题：在服务器端打包文件中, 包含了 Node 系统模块. 导致打包文件本身体积庞大.
    * 解决：通过 webpack 配置剔除打包文件中的 Node 模块.

```js
const nodeExternals = require('webpack-node-externals')
const config = {
    // ... 其他选项
    externals: [nodeExternals()]
}
module.exports = merge(baseConfig, config)
```
