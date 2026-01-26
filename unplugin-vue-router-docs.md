# unplugin-vue-router

[![NPM version](https://img.shields.io/npm/v/unplugin-vue-router?color=black&label=)](https://www.npmjs.com/package/unplugin-vue-router)
[![ci status](https://github.com/posva/unplugin-vue-router/actions/workflows/ci.yml/badge.svg)](https://github.com/posva/unplugin-vue-router/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/posva/unplugin-vue-router/graph/badge.svg?token=28IvHS7TAx)](https://codecov.io/gh/posva/unplugin-vue-router)

> 基于文件的 Vue 自动路由，支持 TypeScript ✨

- [StackBlitz 在线演示](https://stackblitz.com/github/posva/uvr-demo)

这是一个构建时插件，简化了路由配置，并通过 TypeScript 使路由更安全、更易用。需要 Vue Router >= 4.4.0。

> [!WARNING]
> 虽然 unplugin-vue-router 的类型路由和基于文件的路由基本上是稳定的，但它包含一些实验性的 API 可能会发生变化（例如数据加载器）。请务必查看相关[官方文档](https://uvr.esm.is)以获取最新信息。
> 如果您发现任何问题、设计缺陷或有改进建议，请提 [issue](https://github.com/posva/unplugin-vue-router/issues/new/choose)或在[讨论区](https://github.com/posva/unplugin-vue-router/discussions)交流。

## 安装

```bash
npm i -D unplugin-vue-router
```

在 Vue 插件**之前**添加 VueRouter 插件：

## Vite 配置

```ts
// vite.config.ts
import VueRouter from 'unplugin-vue-router/vite'

export default defineConfig({
  plugins: [
    VueRouter({
      /* 选项配置 */
    }),
    // ⚠️ Vue 必须放在 VueRouter() 之后
    Vue(),
  ],
})
```

示例：[`playground/`](https://github.com/posva/unplugin-vue-router/tree/main/playground)

## 配置步骤

安装完成后，**运行您的开发服务器**（通常是 `npm run dev`）**以生成首个版本的类型文件**。然后将类型添加到您的 `tsconfig.json` 中。

```json
{
  "include": [
    // ...
    "./typed-router.d.ts"
  ],
  // ...
  "compilerOptions": {
    // ...
    "moduleResolution": "Bundler"
    // ...
  }
}
```

如果您有像 `npm vue create <my-project>` 创建的 `env.d.ts` 文件，在其中添加 `unplugin-vue-router/client` 类型引用：

```ts
// env.d.ts
/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />
```

如果您没有 `env.d.ts` 文件，可以创建一个并添加 unplugin-vue-router 类型，**或者**将它们添加到 `tsconfig.json` 的 `types` 属性中：

```json
{
  "compilerOptions": {
    // ...
    "types": ["unplugin-vue-router/client"]
  }
}
```

最后，从 `vue-router/auto-routes` 导入生成的路由并传递给路由器：

```diff
import { createRouter, createWebHistory } from 'vue-router'
+import { routes } from 'vue-router/auto-routes'

createRouter({
  history: createWebHistory(),
  // 传递由插件自动生成的路由 🤖
+  routes,
})
```

或者，**您也可以导入 `routes` 数组**并手动创建路由器或将其传递给某个插件。以下是与 [Vitesse starter](https://github.com/antfu-collective/vitesse/blob/main/src/main.ts) 集成的示例：

```diff
import { ViteSSG } from 'vite-ssg'
import { setupLayouts } from 'virtual:generated-layouts'
import App from './App.vue'
import type { UserModule } from './types'
-import generatedRoutes from '~pages'
+import { routes } from 'vue-router/auto-routes'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

-const routes = setupLayouts(generatedRoutes)

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  {
-   routes,
+   routes: setupLayouts(routes),
    base: import.meta.env.BASE_URL
  },
  (ctx) => {
    // 安装 `modules/` 下的所有模块
    Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
      .forEach(i => i.install?.(ctx))
  },
)
```

- [📖 查看更多文档](https://uvr.esm.is)

## 许可证

[MIT](http://opensource.org/licenses/MIT)
