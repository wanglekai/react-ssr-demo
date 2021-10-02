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

## 路由支持

* 在 React SSR 项目中需要实现两端路由. 
* 客户端路由是用于支持用户通过点击链接的形式跳转页面. 
* 服务器端路由是用于支持用户直接从浏览器地址栏中访问页面.
* 客户端和服务器端公用一套路由规则.

### 实现服务器端路由

1. Express 路由接收任何请求
Express 路由接收所有 GET 请求, 服务器端 React 路由通过请求路径匹配要进行渲染的组件.

```js
app.get('*', (req, res) => {  });
```

2. 服务器端路由配置 

```js
import React from 'react'
import routes from '../share/routes'
import { renderToString } from 'react-dom/server'
import { renderRoutes } from 'react-router-config'
import { StaticRouter } from 'react-router-dom'

export default function renderer (req) {
    const content = renderToString(
        <StaticRouter location={req.path}>
            { renderRoutes(routes) }
        </StaticRouter>);
  // ...
}

```

### 实现客户端路由

```js
import React from 'react'
import ReactDOM from 'react-dom' 
import routes from '../share/routes'
import { BrowserRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'

ReactDOM.hydrate(
    <BrowserRouter>
        { renderRoutes(routes) }
    </BrowserRouter>, 
    document.getElementById('root'))
```

## Redux 支持

* 在实现了 React SSR 的项目中需要实现两端 Redux.
* 客户端 Redux 就是通过客户端 JavaScript 管理 Store 中的数据.
* 服务器端 Redux 就是在服务器端搭建一套 Redux 代码, 用于管理组件中的数据.
* 客户端和服务器端共用一套 Reducer 代码.
* 创建 Store 的代码由于参数传递不同所以不可以共用.

### 实现客户端 Redux

1. 创建 Store
2. 配置 Store
3. 创建 Action 和 Reducer
4. 配置 polyfill
由于浏览器不能识别异步函数代码, 所以需要 polyfill 进行填充.


```js
// 创建 store  src/client/createStroe.js
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from '../share/store/reducers'

const store = createStore(reducer, {}, applyMiddleware(thunk))

export default store

```


### 实现服务器端 Redux

```js
//   src/server/createStore.js
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from '../share/store/reducers'

export default () => createStore(reducer, {}, applyMiddleware(thunk))

```
* 服务器端 store 数据填充

问题：服务器端创建的 store 是空的, 组件并不能从Store中获取到任何数据.
解决：服务器端在渲染组件之前获取到组件所需要的数据.


1.  在组件中添加 loadData 方法, 此方法用于获取组件所需数据，方法被服务器端调用
2. 将 loadData 方法保存在当前组件的路由信息对象中.
3. 服务器端在接收到请求后，根据请求地址匹配出要渲染的组件的路由信息
4. 从路由信息中获取组件中的 loadData 方法并调用方法获取组件所需数据
5. 当数据获取完成以后再渲染组件并将结果响应到客户端
