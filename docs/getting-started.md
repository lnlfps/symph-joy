
# 使用指南

## 安装和开始

运行`npm init`创建一个空工程，填写项目的基本信息，当然也可以在一个已有的项目中安装使用。

```bash
npm install --save @symph/joy react react-dom
```
> @symph/joy 只支持 [React 16](https://reactjs.org/blog/2017/09/26/react-v16.0.html)及以上版本

添加NPM脚本到package.json文件：

```json
{
  "scripts": {
    "dev": "joy dev"
  }
}
```

创建`./src/index.js`文件，并插入以下代码：

```jsx
import React, {Component} from 'react'

export default class Index extends Component{
  render(){
    return <div>Welcome to symphony joy!</div>
  }
}
```

然后运行`npm run dev` 命令，在浏览器中输入访问地址`http://localhost:3000`。如果需要使用其它端口来启动应用 `npm run dev -- -p <your port here>`

到目前为止，一个完整的前端应用已经创建完成，可以在上面进行业务开发了，例子[hello-world](https://github.com/lnlfps/symph-joy/tree/master/examples/hello-world)，到这儿我们拥有了哪些功能呢？

- 应用入口（`./src/index.js`），一切都从这里开始，以后可以添加子路由、布局、Model等组件
- 启动了一个服务器，支持服务端渲染和业务请求代理转发等
- 一个零配置的webpack+babel编译器，确保代码在Node.js和浏览器上正确运行
- ES6、7、8等高级语法支持，如：`class`、`async`、`@`注解、`{...}`解构等
- 热更新，调试模式下，在浏览器不刷新的情况下，使更改立即生效
- 静态资源服务，在`/static/`目录下的静态资源，可通过`http://localhost:3000/static/`访问


## 样式 CSS

### jsx内建样式

内建了 [styled-jsx](https://github.com/zeit/styled-jsx) 模块，无需配置，可直接使用。支持Component内独立域的CSS样式，不会和其他组件的同名样式冲突。

```jsx
export default () =>
  <div>
    Hello world
    <p>scoped!</p>
    <style jsx>{`
      p {
        color: blue;
      }
      div {
        background: red;
      }
      @media (max-width: 600px) {
        div {
          background: blue;
        }
      }
    `}</style>
    <style global jsx>{`
      body {
        background: black;
      }
    `}</style>
  </div>
```

查看  [styled-jsx 文档](https://www.npmjs.com/package/styled-jsx) ，获取详细信息。


### Import CSS / LESS 文件

@symph/joy提供下列插件来处理样式，默认支持post-css、autoprefixer、css-modules、extract-text-webpack等，具体使用方法请查看插件使用文档。

- [@symph/joy-css](https://github.com/lnlfps/joy-plugins/tree/master/packages/joy-css)
- [@symph/joy-less](https://github.com/lnlfps/joy-plugins/tree/master/packages/joy-less)

### 导入图片 

[@symph/joy-image](https://github.com/lnlfps/joy-plugins/tree/master/packages/joy-image)插件提供图片导入功能，详细的配置请参见[插件主页](https://github.com/lnlfps/joy-plugins/tree/master/packages/joy-image)。

```js
  // joy.config.js
const withLess = require('@symph/joy-less')
const withImageLoader = require('@symph/joy-image')

module.exports = {
  serverRender: true,
  plugins: [
    withImageLoader({limit: 8192})
  ]
}
```

使用方法

```js
// in jsx
export default () =>
  <img src={require('./image.png')}/>
```

在css、less文件中使用

```css
.bg {
  background: url("./image.png");
}
```

## 静态文件

在工程根目录下创建`static`目录，将静态文件放入其中，例如：图片、第三方js、css等，也可以创建子目录管理文件，可以通过`{assetPrefix}/static/{file}`访问这些文件，也可使用`asset`方法得到最终的访问路径 。

```jsx
export default () => <img src="/static/my-image.png" />

//or 
import asset from '@symph/joy/asset'
export default () => <img src={asset("/my-image.png")} />
```

## 自定义 Head

@symph/joy 提供了`Head` Component来设置html页面的`<head>`标签中的内容

```jsx
import Head from '@symph/joy/head'

export default () =>
  <div>
    <Head>
      <title>My page title</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <p>Hello world!</p>
  </div>
```

在`head`中重复添加多个相同标签，可以给标签添加`key`属性， 相同的key只会在head中输出一次。

```jsx
import Head from '@symph/joy/head'
export default () => (
  <div>
    <Head>
      <title>My page title</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
    </Head>
    <Head>
      <meta name="viewport" content="initial-scale=1.2, width=device-width" key="viewport" />
    </Head>
    <p>Hello world!</p>
  </div>
)
```

在上面的例子中，只有第二个`<meta key="viewport" />`被渲染和添加到页面。

## 获取数据 fetch

`@symph/joy/fetch`用于发送数据请求，该方法在浏览器和Node.js上都可以正常执行。其调用参数和浏览器提供的[fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)方法一样。

```jsx
import fetch from '@symph/joy/fetch'

fetch('https://news-at.zhihu.com/api/3/news/hot', {method: 'GET'})
  .then(respone = >{
      // do something...
  });
```

`@symph/joy/fetch` 支持跨域请求，跨域请求会先发送到Node.js服务端，服务端再转发请求到远程业务服务器上。

TODO 插入流程图

如果想关闭改内建行为，使用jsonp来完成跨域请求，可以在fetch的options参数上设定`options.mode='cors'`

```jsx
import fetch from '@symph/joy/fetch'

fetch('https://news-at.zhihu.com/api/3/news/hot', {method: 'GET', mode:'cors})
  .then(respone = >{
      // do something...
  });
```

> 也可以使用其它的类似解决方案，例如：[node-http-proxy](https://github.com/nodejitsu/node-http-proxy#using-https)、[express-http-proxy](https://github.com/villadora/express-http-proxy)等。我们内建了这个服务，是为了让开发人员像原生端开发人员一样，更专注于业务开发，不再为跨域、代理路径、代理配置等问题困扰。

如果使用`joy dev`或`joy start`来启动应用，不需要任何配置，即可使用跨域服务。如果项目采用了自定义Server，需要开发者将`@symph/joy/proxy-api-middleware`代理服务注册到自定义的Server中。

```jsx
const express = require('express')
const symph = require('@symph/joy')
const {createProxyApiMiddleware} = require('@symph/joy/proxy-api-middleware')

const app = symph({ dev })
const handle = app.getRequestHandler()

app.prepare()
.then(() => {
  const server = express()
  server.use(createProxyApiMiddleware())  //register proxy, 
  server.get('*', (req, res) => {
    return handle(req, res)
  })
})
```

`createProxyApiMiddleware(options)`支持下列参数，。

- proxyPrefix = ''， 用于设置proxy在服务器上的访问路径，当应用不是部署在host根路径下时，这非常有用。
- onReq = (req, res, reqBody, next) => {}, 浏览器的请求到达proxy时的事件，可以在这里拦截请求或者加工原始请求。
- onProxyReq = ((proxyReq, req, res, options)) => {}, 代理服务器发送请求到业务服务器上时的事件。
- onProxyRes = (proxyRes, req, res, body) => {}, 代理服务器从业务服务器上得到响应。
- onProxyResBody = (proxyRes, req, res, body) => {}, 代理服务器从业务服务器上得到完整的响应body是的时间，可以对body部分进行修改。
- onError = onError(err, req, res) => {}, 发送错误时的回调，一般用打印日志，给客户端返回错误信息等。
- dev = false， 开启调试模式后，会打印详细的请求日志。

## 应用组件

@symph/joy采用 [MVC组件](https://lnlfps.github.io/symph-joy/#/thinking-in-joy?id=mvc%E7%9A%84%E6%80%9D%E8%80%83) 来规范应用各部分的职责，使逻辑更清晰，便于协同开发和维护。

- Model: 管理应用的行为和数据，普通class类，有初始状态，业务运行中更新model状态
- View: 展示数据，继承React.Component
- Controller: 控制View的展示，绑定Model数据到View，响应用户的操作，调用Model中的业务, 继承于React.Component

![app work flow](https://github.com/lnlfps/static/blob/master/symphony-joy/images/app-work-flow.jpeg?raw=true)

图中蓝色的箭头表示数据流的方向，红色箭头表示控制流的方向，他们都是单向流，store中的`state`对象是不可修改其内部值的，状态发生改变后，都会生成一个新的state对象，且只将有变化的部分更新到界面上，这和[redux](https://redux.js.org/)的工作流程是一致的。

> 这里只是对redux进行MVC层面的封装，并未添加新的技术，依然可以使用redux的原生接口，如果想深入了解redux，请阅读其详细文档：[redux](https://redux.js.org/)

### 依赖注入 @autowire

组件在创建的时候，系统自动将其所依赖的对象的引用传递给它。Controller依赖于Model实现业务调用，Model也可能需要其它Model共同完成一件事情，系统将在需要的时候加载Model并初始化它。

如何在Controller中申明依赖的Model呢？

```jsx
import React from 'react'
import {controller} from '@symph/joy/controller'
import {autowire} from '@symph/joy/autowire'
import UserModel from './UserModel'

@controller()
export default class Comp extends React.Component{

  @autowire()
  userModel: UserModel

  onClickBtnLogin = () => {
    this.userModel.login()
  }
}
```
`@autowire()`装饰器申明一个属性需要依赖注入，`userModel: UserModel`是ES6申明类实例属性的语法，在组件内部通过`this.userModel`来访问该属值。`: UserModel`部分是TypeScript的类型申明语法，声明该属性的类型为`UserModel`。系统将在初始化组件的时候，自动注入`UserModel`的实例到该属性上，之后就可以通过`this.userModel.login()`的方式调用model中定义的业务方法。


### Model

Model管理应用的行为和数据，Model拥有初始状态`initState`和更新状态的方法`setState(nextState)`，这和Component的state概念类似，业务在执行的过程中，不断更新`state`，当`state`发生改变时，和`state`绑定的View也会自动的更新。这里并没有什么魔法和创造新的东西，只是将redux的`action`、`actionCreator`、`reducer`、`thunk`、`saga`等复杂概念简化为业务方法和业务数据两个概念，让我们更专注于业务实现，代码也更简洁.

下面是一个简单的model示例：

```jsx
import model from '@symph/joy/model'
import fetch from '@symph/joy/fetch'

@model()
export default class TodosModel {

  // the mount point of store state tree, must unique in the app.
  namespace = 'todos';

  // this is the initial state of model
  initState = {
    pageSize: 5,
    count: 0,
    entities: [],
  };

  async getTodos({lastId = 0, pageSize = 5}) {
    // fetch remote data
    let pagedTodos = await fetch('https://www.example.com/api/hello', 
      {body:{lastId, pageSize}});

    let {entities} = this.getState();
    if (lastId === 0) {
      // first page
      entities = pagedTodos;
    } else {
      entities = [...entities, ...pagedTodos];
    }
    
    // update model's state
    this.setState({
      entities,
      pageSize
    });
  }
};

```

我们使用`@model()`将一个类声明为Model类，Model类在实例化的时候会添加`getState`、`setState`，`dispatch`等快捷方法。

#### Model API

##### namespace

model将会被注册到redux store中，由store统一管理model的状态，使用`store.getState()[namespace]`来访问对应model的state, store中不能存在两个相同的`namespace`的model。

##### initState

设置model的初始化状态，由于`model.state`可能会被多个`async`业务方法同时操作，所以为了保证state的有效性，请在需要使用state时使用`getState()`来获取当前state的最新值，并使用`setState(nextState)`方法更新当前的state。

##### setState(nextState)

`setState(nextState)`更新model的状态，`nextState`是当前state的一个子集，系统将使用浅拷贝的方式合并当前的状态。

##### getState()

`getState()`获取当前model的状态。

##### getStoreState()

`getStoreState(）`获取当前整个store的状态。

##### dispatch(action)

返回值：Promise，被调用业务的返回值。

在model中使用`await this.dispatch(action)`调用其它业务方法，这和redux的`store.dispatch(action)`的使用一样，由系统分发`action`到指定的model业务方法中, `action.type`的格式为`modelNamespace/serviceFunction`。

如果是调用model自身的业务方法，可以使用`await this.otherService({option})`的方式，`this`指的是model本身。

#### 业务方法

在Model中定义实体方法来实现业务逻辑，例如：`async getTodos()` ，该方法是一个`async`函数，所以我们可以轻松的使用`await`指令来实现异步逻辑调用，以及调用其它业务方法。

调用方式：
1. `todosModel.getTodos({lastId: 0, pagesSize:5})` 在Model的实例上直接调用
2. `dispatch({type:"todos/getTodos", lastId: 0, pageSize: 5})` 通过redux的dispatch方法，调用当前store中已注册的model实例上的方法。

### Controller

Controller需要申明其依赖哪些Model，并绑定Model的中的状态，以及调用Model里定义的业务方法。它是一个React组件，可以像其它React组件一样创建和使用，新增了[`async componentPrepare()`](https://lnlfps.github.io/symph-joy/#/thinking-in-joy?id=componentprepare-%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F)生命周期方法，在组件创建完成后执行，在服务端渲染时，会等待其执行完成后，再渲染出html，接着在浏览器上运行是，会直接使用在服务端prepare得到的数据，不再执行该方法。如果没有启用服务端渲染，或者在浏览器上动态加载Controller组件时，该方法将在组件初始化完成后，立即上运行。在一次页面请求的过程中，系统会保证该方法只执行一次，避免数据重复加载。

```jsx
import React, {Component} from 'react';
import TodosModel from '../models/TodosModel'
import {controller} from '@symph/joy/controller'
import {autowire} from '@symph/joy/autowire'

@controller((state) => {              // state is store's state
  return {
    todos: state.todos.entities // bind model's state to props
  }
})
export default class IndexController extends Component {

  @autowire()
  todosModel: TodosModel              // register model

  async componentPrepare() {
    // call model
    await this.todosModel.getTodos({lastId: 0, pageSize: 5})
    // or use dispatch to call model
    // await this.props.dispath({type: 'todos/getTodos', lastId: 0, pageSize: 5})
  }

  render() {
    let {todos = []} = this.props;
    return (
      <div >
        <div>Todo List</div>
        <div>
          {todos.map((todo, i) => {
            return <div key={todo.id} >{todo.id}:{todo.content}</div>
          })}
        </div>
      </div>
    );
  }
}

```

创建和使用Controller的步骤：

- 使用`@controller(mapStateToProps)`装饰器将一个普通的Component声明为一个Controller，参数`mapStateToProps`实现model状态和组件props属性绑定，当model的state发生改变时，会触发组件使用新数据重新渲染界面。

- `@autowire(ModelClass)`声明该属性是一个model，运行时，`@symph/joy`将自动初始化该model，并绑定到该属性上。打包时，controller依赖的model将一起打包thunk中，这样在controller运行时，才会去加载依赖的model。

- 每个controller的`props`会被注入一个`dispatch`方法，`dispatch`是redux提供的方法，我们可以由此来调用model、reducer、effect等redux支持的方法。

### View

View是一个普通的React组件，其只负责界面展示，展示的数据来自父组件，通过`this.props`属性读取。 

```javascript
import React, {Component} from 'react'

class ImageView extends Component {
  render() {
    let {src} = this.props
    return (
      <img src={src} />
    )
  }
}
```

#### 兼容 Dva

@symph/joy兼容dva的Model开发模式，[Dva概念 官方文档](https://dvajs.com/guide/concepts.html#models) 

```javascript
  import {controller, requireModel} from '@symph/joy/controller'
  import MyDvaModel from './MyDvaModel'
  
  @requireModel(MyDvaModel)
  @controller()
  class MyComponent extends Component {
  
    componentDidMount(){
      this.props.dispatch({
        type: 'myDvaModel/getData',
      })
    }
   
  }
```

使用`@requireModel()`注册dva的model，其它使用方法和dva保持一致

## Router

请查看 [react-router-4 官方文档](https://reacttraining.com/react-router/web/example/basic)
 
### 导入方法

 ```jsx
 import {  StaticRouter,
           BrowserRouter,
           Switch,
           Route,
           createServerRouter,
           createClientRouter,
           Link,
           HashRouter,
           NavLink,
           Prompt,
           MemoryRouter,
           Redirect,
           Router,
           withRouter,
           routerRedux } from '@symph/joy/router'
 ```

 ### react-router-redux

 在代码中控制页面跳转

 ```jsx
 import {routerRedux} from '@symph/joy/router'

 ......
   dispatch(routerRedux.push('/abount')))
   
   //or
   dispatch(routerRedux.push({
     pathname: '/about',
     search: `?x=xxx`
   }))
 ......
  
 ```


## 代码启动 Server

一个独立的`@symph/joy`应用，通常我们使用`joy start`来启动应用。如果想把`@symph/joy`集成到`express`、`koa`等服务端框架中，可以使用代码启动`@symph/joy`应用。

下面例子展示了，如何集成到express中，并且修改路由`\a`到`\b`.

```js
// server.js
const express = require('express')
const joy = require('@symph/joy')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = joy({ dev, dir: '.' })
const handle = app.getRequestHandler()

const server = express()
const preapredApp = app.prepare()

server.get('/a', (req, res) => {
  preapredApp.then(() => {
    return app.render(req, res, '/b', req.query)
  })
})

server.get('*', (req, res) => {
  preapredApp.then(() => {
    return handle(req, res);
  })
})

server.listen(port, (err) => {
  if (err) throw err
  console.log(`> Ready on http://localhost:${port}`)
})
```
> 集成到已有的express服务器中时，我们的应用通常是挂载到url的某个子路径上的，此时请参考[assetPrefix](./configurations#assetPrefix)的配置说明。

`joy(options: object)` API 提供以下参数：
- dev: bool: false  设置为true时，启动开发调试模式，将实时编译源代码、启动热更新等，关闭时，直接运行提前编译好的目标代码(`.joy`目录)。
- dir: string: '.' 应用放置的路径，相对于server.js文件
- quiet: bool: false 是否隐藏服务器错误信息
- conf: object: {} 和`joy.config.js`相同的配置对象，如果设置了该值，则忽略`joy.config.js`文件。

最后修改NPM `start`脚本:

```json
// package.json
{
  "scripts": {
    "build": "build-your-code && joy build",
    "start": "NODE_ENV=production node server.js"
  }
}
```

> 如果express作为业务服务器时，可以将@symph/joy当作express的View模块来使用，用来替代html模板渲染模块。

## 动态导入 import

`@symph/joy`支持JavaScript的TC39 [dynamic import](https://github.com/tc39/proposal-dynamic-import)提议，意味着你可以将代码分割为多个代码块，在浏览器上运行时，只加载当前需要的代码块。

`@symph/joy/dynamic`模块实现了分割代码、动态加载和加载动画等功能，下面展示了其2种用法：

### 基础用法:

```js
import dynamic from '@symph/joy/dynamic'

const DynamicComponent = dynamic({
  loader: () => import('../components/hello'),
  ssr: true,
  loading:() => <div>...</div>
})

export default () =>
  <div>
    <Header />
    <DynamicComponent />
    <p>HOME PAGE is here!</p>
  </div>
```

### 一次加载多个模块

```js
import dynamic from '@symph/joy/dynamic'

const HelloBundle = dynamic({
  modules: {
      Hello1: () => import('../components/hello1'),
      Hello2: () => import('../components/hello2')
  },
  render: (props, { Hello1, Hello2 }) =>
    <div>
      <h1>
        {props.title}
      </h1>
      <Hello1 />
      <Hello2 />
    </div>
})

export default () => <HelloBundle title="Dynamic Bundle" />
```

配置参数：
- loader: function: null, 加载器，定义动态加载的内容
- ssr: bool: true, 设置是否开启服务端渲染
- loading: Component: `<p>loading...</p>` 加载过程中，展示的动画组件

## 自定义 `<Document>`

如果需要定制html文档的内容，例如引入额外的`<script>`或`<link>`等，可在src目录中新建`_document.js`文件，参考下面的示例加入自定义的内容。

```jsx
// /src/_document.js
import Document, { Head, Main, JoyScript } from '@symph/joy/document'

export default class MyDocument extends Document {
  render () {
    return (
      <html>
        <Head>
          {/* add custom style */}
          <link rel='stylesheet' href='/_joy/static/style.css' />
        </Head>
        <body>
          <Main />
          <JoyScript />
        </body>
      </html>
    )
  }
}
```

`_document.js`只在服务端渲染使用，并不会在浏览器端加载，所以不能在这里放置任何的业务代码，如果希望在整个应用里共享一部分功能，请将它们放到`src/index.js`应用入口组件中。


## 自定义 Error 界面

渲染时出现未捕获的异常时，可以自定义错误展示组件，来提示或者引导用户，例如500错误。这只在`production`环境有效，在开发模式下，系统将展示详细的错误堆栈信息，来帮助开发人员定位问题。

创建`src/_error.js`文件来替换默认的错误展示组件。

```jsx
// src/_error.js

import React from 'react'
import Head from './head'

export default class _Error extends React.Component {
  render () {
    const { statusCode, message } = this.props
    const title = statusCode === 404
      ? 'This page could not be found'
      : 'An unexpected error has occurred'

    return <div>
      <Head>
        <title>{statusCode}: {title}</title>
      </Head>

       <h1>{statusCode}</div>
       <div>{message}</div>
    </div>
  }
}
```

## 打包部署

部署时，需要先使用`joy build`命令来编译代码，生成可在浏览器和node.js里直接运行的目标代码，放入`.joy`目录中([distDir](./configurations#distDir)可自定义输出目录名称)，然后将`.joy`目录上传到生产机器上，在生产机器上执行`joy start`命令来启动应用。在`package.json`的`scripts`节点中加入以下命令脚本：

```json
// package.json
{
  "scripts": {
    "dev": "joy dev",
    "build": "joy build",
    "start": "joy start"
  }
}
```

`@symph/joy` 可以部署到不同的域名或路径上，这需要对应用内引用的资源路径进行配置，参考[assetPrefix](./configurations#assetPrefix)的设置说明。

> 在运行`joy build`的时候，`NODE_ENV`被默认设置为`production`， 使用`joy dev`启动开发环境时，设置为`development`。如果你是在自定义的Server内启动应用，需要你自己设置`NODE_ENV=production`。

## 静态版本输出

`joy export`用于将`@symph/joy` app输出为静态版本，只包含html、js、css等静态资源文件，可在浏览器上直接加载运行。静态版本仍然支持`@symph/joy`的大部分特性，比如：MVC组件、动态路由、按需加载等。

`joy export`的原理是提前假设用户的请求，预先渲染为HTML文件，这和当来自浏览器的request到达Node.js服务器上时，实时渲染的工作流程类似。默认只渲染根路径`/`对应的`index.html`文件，浏览器加载该文件后，[Router](https://reacttraining.com/react-router/web/example/basic)组件再根据当前url，加载相应的页面。这要求我们在业务服务器上，例如JAVA的Spring MVC中，使用正则路由来匹配应用内部的所有路径，并都返回`index.js`这个文件，例如：`@RequestMapping(path="/**", method=RequestMethod.GET)`。

```java
@Controller
@RequestMapping("/**")
public class ViewController {

    @RequestMapping(path = "/**", method = RequestMethod.GET)
    public Map<String, Appointment> pages() {
       return "forward:/static/index.html";
    }

}
```

### 导出步骤

`joy export`提供默认的导出配置[`exportPathMap`](./configurations#exportPathMap)，如果需要导出其它页面，请先在`joy.config.js`中设置[`exportPathMap`](./configurations#exportPathMap)。

接下来我们分两步进行导出操作：
1. 编译源代码 `joy build`
2. 预渲染需要导出的页面 `joy export`

添加NPM脚本到`package.json`文件中：

```json
{
  "scripts": {
    "build": "joy build",
    "export": "npm run build && joy export"
  }
}
```

现在执行下面命令，完成整个导出工作：

```bash
npm run export
```

执行完成以后，静态版本生成的所有文件都放置在应用根目录下的`out`目录中，只需要将`out`目录部署到静态文件服务器即可。

> 你可以定制`out`目录名称，请运行`joy export -h`指令，按提示操作。
